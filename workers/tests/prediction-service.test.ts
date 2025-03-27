import { expect, test, describe } from "bun:test";

import config from '../wrangler.toml';
import { WranglerConfig } from "../src/interfaces/wrangler-config.js";
const wranglerConfig = config as WranglerConfig;
import { PredictionService, VerificationData } from "../src/services/prediction";
import { GeminiService } from "../src/services/llm/gemini.js";
import { Configuration } from "../src/config";
import { EmailClass } from "@/enums/email-class";
import { cleanHtml } from "../src/lib/utils";

describe.skip("Prediction Service", () => {
  test("Should contains OTP code and summary", async () => {
    const env = {
      ...wranglerConfig.vars
    };
    const config = new Configuration(env);
    const llm = new GeminiService(config);
    const service = new PredictionService(llm);

    const cleanedHtml = await cleanHtml(`
      <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">Your OTP Code</h1>
            <p>Here is your one-time password (OTP):</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; margin: 20px 0;">
              123456
            </div>
            <p>Please use this code to complete your login.</p>
          </div>
        </body>
      </html>
    `);
    const res = await service.extractEmailClassAndData(cleanedHtml);
    expect(res).toBeDefined();
    expect(res).toBeInstanceOf(VerificationData);
    expect(res.class).toContain(EmailClass.OTP);
    expect(res.otp).toContain("123456");
    expect(res.summary).toBeString();
    expect(res.summary).toContain("123456");
  });

  test("Should extract verification link and summary", async () => {
    const env = {
      ...wranglerConfig.vars
    };
    const config = new Configuration(env);
    const llm = new GeminiService(config);
    const service = new PredictionService(llm);

    const cleanedHtml = await cleanHtml(`
      <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">Verify Your Email</h1>
            <p>Please click the button below to verify your email address:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://example.com/verify?token=abc123"
                 style="background-color: #4CAF50; color: white; padding: 14px 20px;
                        text-decoration: none; border-radius: 4px;">
                Verify Email
              </a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>https://example.com/verify?token=abc123</p>
          </div>
        </body>
      </html>
    `);
    const res = await service.extractEmailClassAndData(cleanedHtml);
    expect(res).toBeDefined();
    expect(res).toBeInstanceOf(VerificationData);
    expect(res.class).toContain(EmailClass.OTP);
    expect(res.otp).toContain("https://example.com/verify?token=abc123");
    expect(res.summary).toBeString();
  });

  test("Should identify marketing email and extract summary", async () => {
    const env = {
      ...wranglerConfig.vars
    };
    const config = new Configuration(env);
    const llm = new GeminiService(config);
    const service = new PredictionService(llm);

    const cleanedHtml = await cleanHtml(`
      <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">Special Holiday Sale!</h1>
            <p>Dear Valued Customer,</p>
            <div style="background-color: #f8f8f8; padding: 20px; margin: 20px 0;">
              <h2 style="color: #e63946;">Save up to 50% OFF!</h2>
              <p>Don't miss out on our biggest sale of the year. Shop now and enjoy amazing discounts on all products.</p>
              <ul style="list-style-type: none; padding: 0;">
                <li>✨ Premium Electronics - 30% OFF</li>
                <li>🎉 Home Appliances - 40% OFF</li>
                <li>🌟 Fashion Items - 50% OFF</li>
              </ul>
              <a href="https://example.com/sale"
                 style="display: inline-block; background-color: #e63946; color: white;
                        padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Shop Now
              </a>
            </div>
            <p>Offer valid until December 31st, 2023</p>
          </div>
        </body>
      </html>
    `);
    const res = await service.extractEmailClassAndData(cleanedHtml);
    expect(res).toBeDefined();
    expect(res).toBeInstanceOf(VerificationData);
    expect(res.class).toContain(EmailClass.PROMOTIONAL);
    expect(res.summary).toBeString();
  });

  test("Should identify invoice email and extract summary", async () => {
    const env = {
      ...wranglerConfig.vars
    };
    const config = new Configuration(env);
    const llm = new GeminiService(config);
    const service = new PredictionService(llm);

    const cleanedHtml = await cleanHtml(`
      <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">Purchase Invoice</h1>
            <div style="margin: 20px 0;">
              <p><strong>Invoice #:</strong> INV-2024-001</p>
              <p><strong>Date:</strong> January 15, 2024</p>
              <p><strong>Bill To:</strong> John Doe</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; border: 1px solid #ddd;">Item</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                  <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">Premium Widget</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">2</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">$49.99</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">$99.98</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">Deluxe Gadget</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">1</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">$129.99</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">$129.99</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="text-align: right; padding: 10px; border: 1px solid #ddd;"><strong>Total:</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd;">$229.97</td>
                </tr>
              </tfoot>
            </table>
            <p>Thank you for your purchase!</p>
          </div>
        </body>
      </html>
    `);
    const res = await service.extractEmailClassAndData(cleanedHtml);
    expect(res).toBeDefined();
    expect(res).toBeInstanceOf(VerificationData);
    expect(res.class).toContain(EmailClass.INVOICE);
    expect(res.otp).toBeOneOf(["", "EMPTY"]);
    expect(res.summary).toBeString();
    expect(res.summary).toContain("$229.97");
  });

  test("Should identify unknown email type", async () => {
    const env = {
      ...wranglerConfig.vars
    };
    const config = new Configuration(env);
    const llm = new GeminiService(config);
    const service = new PredictionService(llm);

    const cleanedHtml = await cleanHtml(`
      <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">Welcome to Our Service</h1>
            <p>Thank you for signing up with us. We're excited to have you on board!</p>
          </div>
        </body>
      </html>
    `);
    const res = await service.extractEmailClassAndData(cleanedHtml);
    expect(res).toBeDefined();
    expect(res).toBeInstanceOf(VerificationData);
    expect(res.class).toContain(EmailClass.UNKNOWN);
    expect(res.otp).toBeOneOf(["", "EMPTY"]);
    expect(res.summary).toBeString();
  });
});
