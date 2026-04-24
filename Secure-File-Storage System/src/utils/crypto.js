import CryptoJS from "crypto-js";

const getKey = (password) => {
  return CryptoJS.PBKDF2(password, "salt", {
    keySize: 256 / 32,
    iterations: 1000,
  });
};

export const encryptFile = (file, password) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      const key = getKey(password);

      const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();
      resolve(encrypted);
    };

    reader.readAsArrayBuffer(file);
  });
};


export const decryptFile = (encryptedData, password) => {
  const key = getKey(password);

  const decrypted = CryptoJS.AES.decrypt(encryptedData, key);

  const words = decrypted.words;
  const bytes = [];

  for (let i = 0; i < words.length; i++) {
    bytes.push(
      (words[i] >> 24) & 0xff,
      (words[i] >> 16) & 0xff,
      (words[i] >> 8) & 0xff,
      words[i] & 0xff
    );
  }

  return new Blob([new Uint8Array(bytes)]);
};