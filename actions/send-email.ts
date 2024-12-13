"use server";
import { EmailTemplate } from "@/components/email-template";
import { EmailUserTemplate } from "@/components/email-user-template";
import { formSchema } from "@/components/po-form";
import { Id } from "@/convex/_generated/dataModel";
import { Resend } from "resend";
import { z } from "zod";

export async function sendEmailToAdmins(
  values: z.infer<typeof formSchema>,
  po_id: Id<"pos">,
  po_number: number
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: `${values.email} <${values.email}>`,
    to: ["sarona.a@findnewlife.church", "peter@findnewlife.church"],
    subject: "New Purchase Order",
    react: EmailTemplate(values, po_id, po_number),
  });

  console.log("send data: ", data);
  console.log("send error: ", error);
}

export async function sendEmailToUsers(
  values: z.infer<typeof formSchema>,
  po_id: Id<"pos">,
  po_number: number
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: `Sarona <sarona.a@findnewlife.church>`,
    to: [values.email],
    subject: "New Purchase Order Confirmation",
    react: EmailUserTemplate(values, po_id, po_number),
  });

  console.log("send data: ", data);
  console.log("send error: ", error);
}
