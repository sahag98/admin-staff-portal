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
    from: `${values.email} <${values.email}>`,
    to: ["sarona.a@findnewlife.church", "peter@findnewlife.church"],
    subject: "New Purchase Order",
    react: EmailTemplate(values, po_id),
  });

  console.log("send data: ", data);
  console.log("send error: ", error);
}
