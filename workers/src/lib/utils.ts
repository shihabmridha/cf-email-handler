import {Buffer} from 'node:buffer';
import {createHash, randomBytes} from 'node:crypto';

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


export function cleanHtml(html: string): string {
  return new HTMLRewriter()
    .on('style', {
      element(element) {
        element.remove();
      }
    })
    .on('link[rel="stylesheet"]', {
      element(element) {
        element.remove();
      }
    })
    .on('*', {
      element(element) {
        element.removeAttribute('style');
        element.removeAttribute('class');
      }
    })
    .transform(html);
}
