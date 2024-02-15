import { auth } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { Button } from "./ui/button";
import Link from "next/link";
import { LogInIcon, LogOutIcon } from "lucide-react";

import { NewPostButton } from "./NewPostButton";

import { SearchPageButton } from "./SearchPageButton";

export default async function AuthButton() {
  const session: SessionWithToken = await auth();

  if (!session) {
    return (
      <div className="flex gap-2">
        <Link href={"/api/auth/signin"}>
          <Button aria-label="login" variant="outline" size="icon">
            <LogInIcon />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex h-10 w-10 justify-center">
        <NewPostButton token={session.token} />
      </div>
      <Link href={"/api/auth/signout"}>
        <Button aria-label="log-out" size="icon" variant="outline">
          <LogOutIcon />
        </Button>
      </Link>
        <Avatar>
          <AvatarImage src={session.user.image} alt="avatar" />
          <AvatarFallback>{session.user.name}</AvatarFallback>
        </Avatar>
    </div>
  );
}
