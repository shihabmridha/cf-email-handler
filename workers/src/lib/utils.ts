import Utf8 from 'crypto-js/enc-utf8';
import {createHmac, createHash, randomBytes, Hash} from 'node:crypto';
import * as Buffer from 'node:buffer';

// import Base64 from 'crypto-js/enc-base64';
function base64Url(input: CryptoJS.lib.WordArray) {
  const base64Url = btoa(input);

  // Replace characters according to base64url specifications
  return base64Url.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function createJwtToken(payload: object, secret: string) {
  if (!payload) {
    throw new Error('Empty payload');
  }

  const jwtHeader = JSON.stringify({ alg: 'HS256', typ: 'JWT' });

  const encodedHeaders = createHash('utf8').update(jwtHeader).digest('base64url');
  const encodedPayload = createHash('utf8').update(JSON.stringify(payload)).digest('base64url');
  // const encodedHeaders = base64Url(Utf8.parse(jwtHeader));
  // const encodedPayload = base64Url(Utf8.parse(JSON.stringify(payload)));

  const encodedSignature = createHmac('sha256', secret).update(`${encodedHeaders}.${encodedPayload}`).digest('base64url');

  return `${encodedHeaders}.${encodedPayload}.${encodedSignature}`;
}

// Function to hash the password
export function hashText(text: string, salt: string): string {
  const saltedText = text + salt;
  return createHash('sha256').update(saltedText).digest('hex');
}

// Function to generate a random salt
export function generateSalt(): string {
  return randomBytes(16).toString('hex');
}
