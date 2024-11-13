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
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: `Staff Portal <onboarding@resend.dev>`,
    to: ["sahagking@gmail.com"],
    cc: ["sahagking@gmail.com"],
    subject: "New Purchase Order",
    react: EmailTemplate(values, po_id),
  });

  console.log("data: ", data);
  console.log("error: ", error);
}
