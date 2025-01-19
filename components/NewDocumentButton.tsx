'use client'

import { useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/action/action";

export default function NewDocumentButton() {
  const [isPending, startTranition] = useTransition();
  const router = useRouter();

  const handleCreateNewButton = () => {
    startTranition(async () => {
       const {docId} = await createNewDocument();
       router.push(`/doc/${docId}`)
    })
  }
  return (
    <Button onClick={handleCreateNewButton} disabled={isPending}>{isPending ? "Creating..." : "New Document"}</Button>
  )
}
