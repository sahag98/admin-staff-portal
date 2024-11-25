"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { NotepadTextDashed, Trash2 } from "lucide-react";
import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import SkeletonLoader from "./skeleton-loader";

const ExistingDrafts = () => {
  const currentUser = useQuery(api.users.current);
  console.log("curr user: ", currentUser?._id);
  const drafts = useQuery(api.pos.getUserPODrafts);
  const deleteDraft = useMutation(api.pos.deleteDraft);

  if (!drafts) {
    return (
      <div className="flex-1 flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Drafts (...)</h2>
        <SkeletonLoader />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col gap-3">
      <section className="flex items-center gap-1 ">
        <NotepadTextDashed size={28} />
        <h2 className="text-xl font-semibold gap-2 flex items-center">
          Drafts
          <span className="bg-secondary text-secondary-foreground text-sm flex items-center justify-center rounded-full size-7">
            {drafts.length}
          </span>
        </h2>
      </section>
      {drafts?.length === 0 ? (
        <div className="bg-secondary p-10 rounded flex-1 h-full flex flex-col gap-2 justify-center items-center">
          <NotepadTextDashed size={60} />
          <h3 className="text-lg font-semibold">No drafts</h3>
        </div>
      ) : (
        <div className="grid  md:grid-cols-4 gap-5 grid-cols-1">
          {drafts?.map((draft) => (
            <Card
              className="bg-secondary flex flex-col justify-between shadow-none p-3"
              key={draft._id}
            >
              <CardTitle className="text-lg flex items-center justify-between">
                <h2>Draft Fields</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={async () =>
                    await deleteDraft({ draft_id: draft._id })
                  }
                >
                  <Trash2 className="w-6 h-6 text-red-500" />
                </Button>
                {/* {draft.amount && <span>${draft?.amount?.toFixed(2)}</span>} */}
              </CardTitle>
              <CardContent className="px-0">
                <ul>
                  {draft.budget_num && (
                    <li className="text-sm">Budget num: {draft?.budget_num}</li>
                  )}
                  {draft.event_name && (
                    <li className="text-sm">Event name: {draft?.event_name}</li>
                  )}
                  {draft.priority && (
                    <li className="text-sm">Priority: {draft?.priority}</li>
                  )}
                  {draft.ministry && (
                    <li className="text-sm">Ministry: {draft?.ministry}</li>
                  )}
                  {draft.expense_type && (
                    <li className="text-sm">
                      Expense Type: {draft?.expense_type}
                    </li>
                  )}
                  {draft.message && (
                    <li className="text-sm">Message: {draft?.message}</li>
                  )}
                  {draft.required_by && (
                    <li className="text-sm">
                      Required by:{" "}
                      {new Date(draft?.required_by).toLocaleDateString()}
                    </li>
                  )}
                  {draft.vendor && (
                    <li className="text-sm">Vendor: {draft?.vendor}</li>
                  )}
                </ul>

                <ul className="list-disc p-3">
                  {draft?.item_name?.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-sm">
                      {item.name}
                    </li>
                  ))}
                  {draft.item_name && draft?.item_name?.length > 3 && (
                    <span>and more...</span>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="p-0">
                <Link href={`/create/new/?draft=true&draft_id=${draft._id}`}>
                  <Button>Continue Draft</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExistingDrafts;
