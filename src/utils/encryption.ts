import crypto from 'crypto';

export function encryptHybrid(plaintext: string, rsaPublicKeyPem: string) {
  const iv = crypto.randomBytes(12);
  const aesKey = crypto.randomBytes(32); // 256 bits
  const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
  const encrypted = Buffer.concat([cipher.update(Buffer.from(plaintext, 'utf8')), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const encryptedKey = crypto.publicEncrypt(
    {
      key: rsaPublicKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    aesKey
  );

  return {
    algorithm: 'AES-256-GCM',
    keyAlgorithm: 'RSA-OAEP',
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    encryptedKey: encryptedKey.toString('base64'),
    cipherText: encrypted.toString('base64'),
  };
}

export function decryptHybrid(payload: {
  iv: string;
  authTag: string;
  encryptedKey: string;
  cipherText: string;
}, rsaPrivateKeyPem: string) {
  const iv = Buffer.from(payload.iv, 'base64');
  const authTag = Buffer.from(payload.authTag, 'base64');
  const encryptedKey = Buffer.from(payload.encryptedKey, 'base64');
  const cipherText = Buffer.from(payload.cipherText, 'base64');

  const aesKey = crypto.privateDecrypt(
    {
      key: rsaPrivateKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    encryptedKey
  );

  const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
  return decrypted.toString('utf8');
}

