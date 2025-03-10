import { expect, test, describe } from "bun:test";
import {cleanHtml} from "../src/lib/utils";

describe("Utils", () => {
  test.only("clean html", async ()=> {
    const html = `
      <html>
        <head>
          <style>
            body {
              background-color: #f5f5f5;
            }
          </style>
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <h1 class="title">Hello World</h1>
          <p style="color: #333;">This is a paragraph</p>
        </body>
      </html>
    `;
    const res = await cleanHtml(html);
    console.log(res);
    expect(res).toBeDefined();
  });
});
