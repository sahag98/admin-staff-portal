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

export const EmailTemplate = (
  values: z.infer<typeof formSchema>,
  poId: Id<"pos">
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
      <Preview>New Purchase Order</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] bg-[#FAFAFA] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[28px] font-bold text-center p-0 my-[10px] mx-0">
              New Purchase Order
            </Heading>
            <Text>Submitted By: {email}</Text>
            <Heading className="text-black text-[15px]">Item(s):</Heading>
            {/* <Section>
              <Row>
                <Column>
                  <Text>Hey</Text>
                  <Text>there</Text>
                  <Text>man</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text>Hey</Text>
                  <Text>there</Text>
                  <Text>man</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text>Hey</Text>
                  <Text>there</Text>
                  <Text>man</Text>
                </Column>
              </Row>
            </Section> */}
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

            <Hr className="border border-solid border-[#c0c0c0] my-[10px] mx-0 w-full" />
            <Section cellSpacing={3} className="w-full mt-4">
              <Link
                className="bg-gray-900 p-3 text-white w-full rounded-md"
                href={`https://new-life-po.vercel.app/pos/${poId}?admin=true`}
              >
                View
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
