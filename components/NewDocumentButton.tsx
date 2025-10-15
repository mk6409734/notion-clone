"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/action/action";

export default function NewDocumentButton() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleCreateNewButton = async () => {
    setIsPending(true);
    try {
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Button onClick={handleCreateNewButton} disabled={isPending}>
      {isPending ? "Creating..." : "New Document"}
    </Button>
  );
}
