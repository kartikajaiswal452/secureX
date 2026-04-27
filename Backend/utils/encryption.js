const crypto = require("crypto");

const algorithm = "aes-256-cbc";


const getKey = (password) =>
  crypto.createHash("sha256").update(password).digest();

exports.encryptBuffer = (buffer, password) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, getKey(password), iv);

  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    data: encrypted,
  };
};

exports.decryptBuffer = (encryptedData, ivHex, password) => {
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    getKey(password),
    iv
  );

  return Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
};