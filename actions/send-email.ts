"use server";
import { EmailTemplate } from "@/components/email-template";
import { formSchema } from "@/components/po-form";
import { Id } from "@/convex/_generated/dataModel";
import { Resend } from "resend";
import { z } from "zod";
export async function sendEmail(
  values: z.infer<typeof formSchema>,
  po_id: Id<"pos">
) {
  const resend = new Resend("re_gLWkB4j8_696ABZnRK56f1zEieEeZVUt2");

  const { data, error } = await resend.emails.send({
    from: `Juan <onboarding@resend.dev>`,
    to: ["arzsahag@gmail.com"],
    cc: ["sahagking@gmail.com"],
    subject: "New Purchase Order",
    react: EmailTemplate(values, po_id),
  });

  console.log("data: ", data);
  console.log("error: ", error);
}
