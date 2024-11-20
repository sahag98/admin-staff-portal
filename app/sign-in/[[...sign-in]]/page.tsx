import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            headerTitle: "Sign in to the", // Customize header text
          },
        }}
        signUpUrl="/sign-up"
      />
    </div>
  );
}
