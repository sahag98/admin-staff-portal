"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader, Search } from "lucide-react";
import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "./ui/button";
import Link from "next/link";
import ApprovalBanner from "./approval-banner";

export default function AllUsers({
  preloadedUser,
  preloadedUsers,
  budget,
  admin,
}: {
  admin: boolean;
  preloadedUser: Preloaded<typeof api.users.current>;
  preloadedUsers: Preloaded<typeof api.users.getAllUsers>;
  budget: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const users = usePreloadedQuery(preloadedUsers);

  const currentUser = usePreloadedQuery(preloadedUser);

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // if (!users) {
  //   return;
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-6">User Management</h1> */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search staff..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!users ? (
          <div className="bg-gray-100 flex flex-col gap-3 items-center justify-center w-full h-full col-span-3 row-span-12">
            <Loader size={40} className="animate-spin" />
            <p>Loading staff... </p>
          </div>
        ) : (
          <>
            {filteredUsers?.map((user) => (
              <Card className="" key={user._id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    {/* <AvatarImage src={user.avatarUrl} alt={user.name} /> */}
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle>
                      {currentUser?.name === user.name ? "You" : user.name}
                    </CardTitle>
                    <p className="text-sm italic text-gray-500">{user.role}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex items-end justify-between">
                  <Link
                    href={
                      budget
                        ? `/budget/${user._id}?admin=true`
                        : `/all-pos/${user._id}`
                    }
                  >
                    <Button>{budget ? "View Budget" : "View POs"}</Button>
                  </Link>
                  {!budget && <ApprovalBanner user={user} />}
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
