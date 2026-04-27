const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
module.exports = cloudinary;
console.log("Cloud config:", {
  name: process.env.CLOUD_NAME,
  key: process.env.API_KEY || process.env.CLOUD_API_KEY,
});