"use client";

import { useRoom, useSelf } from "@liveblocks/react";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import {BlockNoteView}  from "@blocknote/shadcn"
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import stringtoColor from "@/lib/stringtoColor";
import TranslateDocument from "./TranslateDocument";
import ChatToDocument from "./ChatToDocument";

type EditorProps ={
    doc: Y.Doc;
    provider: any;
    darkMode: boolean;
}
 function BlockNote({doc, provider, darkMode}:EditorProps) {
    const userInfo = useSelf((me) => me.info);
    const editor: BlockNoteEditor = useCreateBlockNote({
      collaboration: {
        provider,
        fragment: doc.getXmlFragment("document-store"),
        user: {
          name: userInfo?.name || "Anonymous", // Default to "Anonymous" if name is undefined
          color: stringtoColor(userInfo?.email || "unknown@example.com"),
        },
      },
    });
  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView className="min-h-screen"
      editor={editor}
      theme={darkMode? "dark": "light"}/>
    </div>
  );
}
export default function Editor() {
  const room = useRoom();
  const [doc, setdoc] = useState<Y.Doc>();
  const [provider, setprovider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setdarkMode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setdoc(yDoc);
    setprovider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider){
    return null;
  }

  const style = `hover:text-white${
    darkMode
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">
        <TranslateDocument doc={doc}/>
        <ChatToDocument doc={doc}/>
        {/* Dark Mode  */}
        <Button className={style} onClick={() => setdarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
      {/* BlockNOte  */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode}/>
    </div>
  );
}
