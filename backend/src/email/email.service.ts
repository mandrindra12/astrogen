import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or any other email service provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Generate verification code
  async generateOTP(): Promise<string> {
    const otp = crypto.randomInt(0, 999999).toString().padStart(6, '0');
    return otp;
  }

  // Send Email verification code
  async sendOtpEmail(email: string, otp: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification Code',
      text: `Your Verification Code is ${otp}. It is valid for 5 minutes.`,
    };
    try {
      const a = await this.transporter.sendMail(mailOptions);
      if (a) {
        console.log(`Email sent to ${email}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
