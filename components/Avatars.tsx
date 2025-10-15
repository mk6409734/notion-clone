"use client";

import { useOthers, useSelf } from "@liveblocks/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Avatars() {
  const others = useOthers();
  const self = useSelf();
  const all = [self, ...others];
  return (
    <div className="flex gap-2 items-center">
      <p className="font-light text-sm">Avatars</p>
      <div className="flex -space-x-5">
        {all.map((other, i) => (
          <TooltipProvider key={`${other?.id ?? "unknown"}-${i}`}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="border-2 hover:z-50">
                  <AvatarImage src={other?.info?.avatar ?? undefined} />
                  <AvatarFallback>{other?.info?.name ?? "User"}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {self?.id && other?.id && self.id === other.id
                    ? "You"
                    : other?.info?.name ?? "User"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
