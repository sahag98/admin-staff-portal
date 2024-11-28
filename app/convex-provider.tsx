"use client";

import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_DEV_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const customLocalization = {
    signIn: {
      start: {
        title: "Sign in to the New Life Staff Portal", // Change the title
        subtitle: "Welcome back! Please sign in to continue!",
      },
    },
  };
  return (
    <ClerkProvider
      localization={customLocalization}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
