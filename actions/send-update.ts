"use server";
import { UpdateTemplate } from "@/components/update-template";
import { Resend } from "resend";

export async function sendUpdate(
  email: string,
  items: Array<Object>,
  approved_by: string,
  amount: number,
  status: string
) {
  const resend = new Resend("re_gLWkB4j8_696ABZnRK56f1zEieEeZVUt2");

  const { data, error } = await resend.emails.send({
    from: "Staff <onboarding@resend.dev>",
    to: [email],
    subject: "PO Status",
    react: UpdateTemplate(email, items, approved_by, amount, status),
  });

  console.log("data: ", data);
  console.log("error: ", error);
}
