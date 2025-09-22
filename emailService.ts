import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.RESEND_TO!.split(","),
      subject,
      html,
    });

    console.log("Email sent:", data);
  } catch (error: any) {
    console.error("Error sending email:", error.message || error);
  }
}
