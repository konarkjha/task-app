import requestify from "requestify";
import { config } from "../lib/config";
// import imageResizer from "s3-imageresizer";
import RoleModel from "../db/RoleModel";
import { ApplicationError } from "../lib/errors";
import { ERROR_CODES, ERROR_TEXTS, ENVIRONMENT } from "../lib/constants";
import UserModel from "../db/UserModel";

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

export async function uploadImage(photoUrl, uploadPath, imagePath) {
  try {
    const randomImageNumber = Math.floor(Math.random() * 89999 + 10000);
    const filename = `${randomImageNumber}_${photoUrl.name}`;
    await photoUrl.mv(`${uploadPath}/${filename}`, function(err) {
      if (err) {
        throw err;
      }
    });
    return `${imagePath}/${filename}`;
  } catch (error) {
    throw error;
  }
}

export const sendSms = async (phoneNumber, text) => {
  try {
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
    const mailOptions = {
      from: `${nameToSend || "Rentickle"} <${process.env.DEV_EMAIL}>`,
      to: email,
      subject: subject,
      html: message,
      bcc: bccEmail || ""
    };
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
// export const uploadImageToS3 = async (imageData, ImageName) => {
//   const awsDetails = config[ENVIRONMENT].AwsCredentials;
//   const s3Path = await imageResizer.uploadBufferToS3(
//     imageData,
//     awsDetails.AWS_ACCESS_KEY_ID,
//     awsDetails.AWS_SECRET_ACCESS_KEY,
//     awsDetails.S3_BUCKET_NAME,
//     null,
//     `${Date.now()}_${ImageName}`
//   );
//   return s3Path.Key;
// };
