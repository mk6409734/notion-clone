"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname} from "next/navigation";
import { inviteUserToDocument } from "@/action/action";
import { toast } from "sonner";
import { Input } from "./ui/input";

export default function InviteUser() {
  const [isOpen, setisOpen] = useState(false);
  const [email, setemail] = useState('');
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();


  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();

    const roomId = pathname.split("/").pop();
    if(!roomId) return;

    startTransition(async () => {
      const { success } = await inviteUserToDocument(roomId, email);
      if (success) {
        setisOpen(false);
        setemail('');
        toast.success("User Added to Room successfully");
      } else {
        toast.error("Failed to add user to room!");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setisOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a User to Collaborate!</DialogTitle>
          <DialogDescription>
            Enter the email of the User you want to invite. 
          </DialogDescription>
        </DialogHeader>
       <form className="flex gap-2" onSubmit={handleInvite}>
        <Input type="email" value={email} placeholder="Email" className="w-full" onChange={(e) => setemail(e.target.value)} />
        <Button type="submit" disabled={!email || isPending}>{isPending ? "Inviting..." : "Invite"}</Button>
       </form>
      </DialogContent>
    </Dialog>
  );
}
