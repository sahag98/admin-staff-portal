"use server";
import { UpdateTemplate } from "@/components/update-template";
import { Resend } from "resend";

export async function sendUpdate(
  email: string,
  items: Array<Object>,
  approved_by: string,
  approval_email: string,
  amount: number,
  status: string,
  reason?: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: `${approved_by} <${approval_email}>`,
    to: [email],
    subject: "PO Status",
    react: UpdateTemplate(email, items, approved_by, amount, status, reason),
  });

  console.log("data: ", data);
  console.log("error: ", error);
}
