import {Buffer} from 'node:buffer';
import {createHmac, createHash, randomBytes} from 'node:crypto';
import {ClassConstructor, plainToInstance} from "class-transformer";
import {BaseDto} from "@/shared/dtos/base";
import {BaseEntity} from "../entities/base";

export function base64Url(input: Buffer) {
  const base64Url = input.toString('base64');

  // Replace characters according to base64url specifications
  return base64Url.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function hashText(text: string, salt: string): string {
  const saltedText = text + salt;
  return createHash('sha256').update(saltedText).digest('hex');
}

export function generateSalt(): string {
  return randomBytes(16).toString('hex');
}

// Get HMAC string in base64
export function createHmacString(payload: string, secret: string) {
  if (!payload) {
    throw new Error('Empty payload');
  }

  const digest = createHmac('sha256', secret).update(payload).digest();
  return digest.toString('base64');
}
