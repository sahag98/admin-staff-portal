"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

const Budget = () => {
  const user = useQuery(api.users.current);

  return (
    <div>
      <span>Monthly Budget: ${user?.budget}</span>
    </div>
  );
};

export default Budget;
