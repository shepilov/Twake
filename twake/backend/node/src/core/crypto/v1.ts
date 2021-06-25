import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { CryptoResult } from ".";

export default {
  encrypt,
  decrypt,
};

function encrypt(data: any, encryptionKey: any): CryptoResult {
  const key = createHash("sha256").update(String(encryptionKey)).digest("base64").substr(0, 32);
  try {
    const iv = randomBytes(16);
    const cipher = createCipheriv("aes-256-cbc", key, iv);
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(data)), cipher.final()]).toString(
      "hex",
    );
    return {
      data: `${iv.toString("hex")}:${encrypted}`,
      done: true,
    };
  } catch (err) {
    return {
      err,
      data,
      done: false,
    };
  }
}

function decrypt(data: string, encryptionKey: any): CryptoResult {
  const key = createHash("sha256").update(String(encryptionKey)).digest("base64").substr(0, 32);

  const encryptedArray = data.split(":");

  if (!encryptedArray.length || encryptedArray.length !== 2) {
    return {
      data,
      done: false,
    };
  }

  const iv = Buffer.from(encryptedArray[0], "hex");
  const encrypted = Buffer.from(encryptedArray[1], "hex");
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  const decrypt = JSON.parse(
    Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(),
  );
  return {
    data: decrypt,
    done: true,
  };
}
