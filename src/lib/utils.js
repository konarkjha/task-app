import requestify from "requestify";
import { config } from "../lib/config";
import nodemailer from "nodemailer";

export const externalApiRequest = async (
  url,
  method,
  body = null,
  headers = null,
  dataType = null
) => {
  try {
    const response = await requestify.request(url, {
      method,
      body,
      headers,
      dataType
    });
    return {
      code: response.getCode(),
      headers: response.getHeaders(),
      body: response.getBody()
    };
  } catch (err) {
    return {
      code: err.getCode(),
      headers: err.getHeaders(),
      body: err.getBody()
    };
  }
};

export const sendSms = async (phoneNumber, text) => {
  try {
    return;
    let url = config.SMS_API;
    url = url.replace("<MOBILENUMBER>", phoneNumber).replace("<MESSAGE>", text);
    await externalApiRequest(url, "GET");
  } catch (error) {
    throw error;
  }
};

export async function sendMail(
  email,
  subject,
  message,
  bccEmail = null,
  nameToSend = null,
  attachments = {}
) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    console.log(
      process.env.EMAIL,
      "process.env.EMAIL",
      process.env.EMAIL_PASSWORD,
      "process.env.EMAIL_PASSWORD"
    );

    const mailOptions = {
      from: `${nameToSend || "Getbaqala"} <${process.env.DEV_EMAIL}>`,
      to: email,
      subject: subject,
      html: message,
      bcc: bccEmail || ""
    };
    console.log("mailOptions", mailOptions);

    if (Object.keys(attachments).length) {
      mailOptions.attachments = [attachments];
    }
    return await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
      }
    });
  } catch (error) {
    throw error;
  }
}
