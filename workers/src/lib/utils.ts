import { createHash, randomBytes } from 'node:crypto';

export function hashText(text: string, salt: string): string {
  const saltedText = text + salt;
  return createHash('sha256').update(saltedText).digest('hex');
}

export function generateSalt(): string {
  return randomBytes(16).toString('hex');
}

export async function cleanHtml(html: string): Promise<string> {
  const originalResponse = new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });

  const transformedResponse = new HTMLRewriter()
    .on('style', {
      element(element) {
        element.remove();
      },
    })
    .on('link[rel="stylesheet"]', {
      element(element) {
        element.remove();
      },
    })
    .on('*', {
      element(element) {
        element.removeAttribute('style');
        element.removeAttribute('class');
      },
    })
    .transform(originalResponse);

  return await transformedResponse.text();
}
