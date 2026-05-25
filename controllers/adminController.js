const Lor = require("../models/Lor");

exports.renderDashboard = async (req, res) => {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [totalLors, activeLors, revokedLors, generatedThisMonth] = await Promise.all([
    Lor.countDocuments(),
    Lor.countDocuments({ status: "active" }),
    Lor.countDocuments({ status: "revoked" }),
    Lor.countDocuments({ createdAt: { $gte: monthStart } }),
  ]);

  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    admin: req.session.admin,
    stats: {
      totalLors,
      activeLors,
      revokedLors,
      generatedThisMonth,
    },
  });
};
