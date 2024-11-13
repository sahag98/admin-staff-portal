import * as React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Tailwind,
  Section,
} from "@react-email/components";

export const UpdateTemplate = (
  email: string,
  items: Array<any>,
  amount: number,
  status: string
) => {
  // const {
  //   email,
  //   amount,
  //   budget_num,
  //   event_name,
  //   expense_type,
  //   isBudgeted,
  //   item_name,
  //   message,
  //   ministry,
  //   nonbudget_approval,
  //   priority,
  //   required_by,
  //   vendor,
  // } = values;
  return (
    <Html>
      <Head />
      <Preview>PO Status</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] bg-[#FAFAFA] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[28px] font-bold text-center p-0 my-[10px] mx-0">
              Your PO has been {status}
            </Heading>

            <Text className="text-black text-[15px] leading-[24px]">
              Item(s):
            </Text>
            <Section>
              {items.map((item, idx) => (
                <Text key={idx}>{item?.name}</Text>
              ))}
            </Section>
            <Text className="text-black text-[15px] leading-[24px]">
              Amount: ${amount.toFixed(2)}
            </Text>
            <Text className="text-black text-[13px] leading-[24px]">
              PO was submitted by: {email}
            </Text>

            {/* <Text className="text-[#2f2d51] text-[15px] font-medium">
              Praying for you,
              <br />
              Sahag
              <br />
              Founder
            </Text>

            <Hr className="border border-solid border-[#b7d3ff] my-[26px] mx-0 w-full" />
            <Section className="text-center">
              <table className="w-full">
                <tr>
                  <td align="center">
                    <Row className="table-cell h-[44px] w-[80px] align-bottom">
                      <Column className="pr-[15px]">
                        <Link href="https://www.instagram.com/prayse.app/">
                          <Img
                            alt="Instagram"
                            height="30"
                            src="https://cdn.glitch.global/1948cbef-f54d-41c2-acf7-6548a208aa97/4.png?v=1725481759654"
                            width="30"
                          />
                        </Link>
                      </Column>
                      <Column className="pr-[15px]">
                        <Link href="https://www.youtube.com/@prayse-app">
                          <Img
                            alt="Youtube"
                            height="30"
                            src="https://cdn.glitch.global/1948cbef-f54d-41c2-acf7-6548a208aa97/5.png?v=1725481763041"
                            width="30"
                          />
                        </Link>
                      </Column>
                      <Column>
                        <Link href="https://shop.prayse.app/">
                          <Img
                            alt="Merch"
                            height="30"
                            src="https://cdn.glitch.global/1948cbef-f54d-41c2-acf7-6548a208aa97/6.png?v=1725481767757"
                            width="30"
                          />
                        </Link>
                      </Column>
                    </Row>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <Text className="mt-[10px] text-[16px] leading-[24px] text-[#2f2d51]">
                      sahag@prayse.app +16613000021
                    </Text>
                  </td>
                </tr>
              </table>
              <Text className="mt-[10px] text-[13px] text-gray-500">
                You are recieving this email because you have sign up on our
                Community section in our app.
              </Text>
              <Text className="mt-[10px] text-[13px] text-gray-500">
                If you don't want to recieve anymore emails, feel free to reply
                with "unsubscribe", and we will remove you from our email list.
              </Text>
            </Section> */}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
