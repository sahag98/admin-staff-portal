import * as React from "react";
import { formSchema } from "./po-form";
import { z } from "zod";

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Row,
  Column,
} from "@react-email/components";
import { Id } from "@/convex/_generated/dataModel";

export const EmailUserTemplate = (
  values: z.infer<typeof formSchema>,
  poId: Id<"pos">,
  po_number: number
) => {
  const {
    email,
    amount,
    event_name,
    payment_term,
    expense_type,
    budget_num,
    items,
    message,
    ministry,
    priority,
    required_by,
    vendor,
  } = values;
  return (
    <Html>
      <Head />
      <Preview>New Purchase Order Confirmation</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] bg-[#FAFAFA] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[28px] font-bold text-center p-0 my-[10px] mx-0">
              New Purchase Order #{po_number}
            </Heading>
            <Text className="text-black text-[15px]">
              Your PO has been submitted successfuly and is pending for
              aproval/denial.
            </Text>
            <Heading className="text-black text-[15px]">Item(s):</Heading>
            <Section>
              {items.map((item, idx) => (
                <Row className="flex items-center gap-2" key={idx}>
                  <Column className="font-medium">
                    <Text>
                      {item?.name} {item?.quantity} ${item?.price}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
            <Text className="text-black text-[15px] leading-[24px]">
              Priority: {priority}
            </Text>
            <Text className="text-black text-[15px] leading-[24px]">
              Payment term: {payment_term}
            </Text>
            <Text className="text-black text-[15px] leading-[24px]">
              Budget number: {budget_num?.budget_num}
            </Text>
            <Text className="text-black text-[15px] leading-[24px]">
              Description: {budget_num?.description}
            </Text>
            <Text className="text-black text-[15px] leading-[24px]">
              Amount: ${amount.toFixed(2)}
            </Text>
            <Text className="text-black text-[15px] leading-[24px]">
              Vendor: {vendor}
            </Text>

            <Text className="text-black text-[15px] leading-[24px]">
              Required By: {required_by.toLocaleDateString()}
            </Text>
            <Text className="text-black text-[15px] leading-[24px]">
              Expense Type: {expense_type}
            </Text>
            <Text className="text-black text-[15px] leading-[24px]">
              Event: {event_name}
            </Text>
            <Text className="text-black text-[15px] leading-[24px]">
              Ministry: {ministry}
            </Text>
            <Text className="text-black text-[15px] leading-[24px]">
              Message: {message}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
