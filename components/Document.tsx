"use client";

import { FormEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

export default function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const isOwner = useOwner();
  useEffect(() => {
    if (data) {
      setInput(data.title || ""); // Safeguard against undefined `data.title`
    }
  }, [data]);

  const updateTitle = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setIsUpdating(true);
      try {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Handle loading and error states to ensure consistent SSR output
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading document: {error.message}</div>;
  }

  if (!data) {
    return <div>No data found for this document.</div>;
  }

  return (
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form className="flex flex-1 space-x-2" onSubmit={updateTitle}>
          {/* Input for updating title */}
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          {isOwner && (
            <>
              <InviteUser />
              <DeleteDocument />
            </>
          )}
        </form>
      </div>
      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
        <ManageUsers />
        <Avatars />
      </div>
      <hr className="pb-10" />
      <Editor />
    </div>
  );
}
