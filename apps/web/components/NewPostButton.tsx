"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function NewPostButton({ token }: { token: string }) {
  return (
    <Dialog>
      <DialogTrigger aria-label="create-page">
        {/* <Button size="icon" variant="outline"> */}
        <PlusCircleIcon />
        {/* </Button> */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
          
        </DialogHeader>
        {/* @ts-expect-error Server Component */}
        <AddForm token={token} />
      </DialogContent>
    </Dialog>
  );
}

import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { cn } from "@/lib/utils";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIssue } from "@/lib/github-issues-api";

function AddForm({ token, className }: { token: string; className: string }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const router = useRouter();

  async function handleCreateIssue() {
    const issueToCreate: GitHubIssue = {
      title,
      body,
    };

    console.log(issueToCreate)
    console.log(token)

    const newIssue = await createIssue(issueToCreate, { token });
    await fetch("/api/revalidate");
    router.refresh();
    router.push(`/posts/${newIssue.number}`);
  }

  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          type="title"
          id="title"
          placeholder="Give your post a title."
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="body">Body</Label>
        <Input
          type="body"
          id="body"
          placeholder="Give your post brief a content."
          name="body"
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <DialogClose disabled={title.length == 0} onClick={handleCreateIssue}>
          Create a Post!

      </DialogClose>
    </form>
  );
}
