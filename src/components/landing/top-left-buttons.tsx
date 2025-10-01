"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/auth-client";
import Link from "next/link";

export function TopLeftButtons() {
  const { data: session } = useSession();

  return (
    <div className="absolute top-4 left-4 z-10">
      {!session ? (
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="backdrop-blur-sm border-border/70 bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-background/70"
          >
            <Link href="/auth/login">Se connecter</Link>
          </Button>
          <Button
            asChild
            variant="default"
            className="backdrop-blur-sm shadow-sm"
          >
            <Link href="/shop">Voir le magasin</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="default"
            size="sm"
            className="backdrop-blur-sm shadow-sm"
          >
            <Link href="/shop">Voir le magasin</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="backdrop-blur-sm border-border/70 bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-background/70"
          >
            <Link href="/profile">Profile</Link>
          </Button>
          {session.user.role === "ADMIN" && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="backdrop-blur-sm border-border/70 bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-background/70"
            >
              <Link href="/admin/dashboard">Admin</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
