const mongoose = require("mongoose");

const lorSchema = new mongoose.Schema(
  {
    lorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    internshipDomain: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    durationText: {
      type: String,
      required: true,
      trim: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    performance: {
      type: String,
      enum: ["Excellent", "Very Good", "Good", "Satisfactory"],
      required: true,
    },
    recommendationText: {
      type: String,
      trim: true,
      default: "",
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    authorizedPersonName: {
      type: String,
      required: true,
      trim: true,
    },
    authorizedPersonDesignation: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      default: "InternovaTech",
      trim: true,
    },
    pdfUrl: {
      type: String,
      trim: true,
      default: "",
    },
    pdfPublicId: {
      type: String,
      trim: true,
      default: "",
    },
    qrCodeData: {
      type: String,
      trim: true,
      default: "",
    },
    verificationUrl: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

lorSchema.index({ studentEmail: 1, createdAt: -1 });
lorSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.models.Lor || mongoose.model("Lor", lorSchema);
