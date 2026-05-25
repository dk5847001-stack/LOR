const cloudinary = require("../config/cloudConfig");

exports.uploadPdfBuffer = (pdfBuffer, { publicId }) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "internovatech/lor",
        public_id: publicId,
        resource_type: "raw",
        format: "pdf",
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );

    uploadStream.end(Buffer.from(pdfBuffer));
  });
};

exports.deletePdf = async (publicId) => {
  if (!publicId) return null;

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
};
