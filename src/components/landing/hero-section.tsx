"use client";

import { Button } from "@/components/ui/button";
import { PostForm } from "@/features/posts/components/post-form";
import { useSession } from "@/lib/auth/auth-client";
import Link from "next/link";
import { ForumsPreview } from "./forums-preview";

interface Forum {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  _count: {
    posts: number;
  };
}

interface HeroSectionProps {
  forums: Forum[];
}

export function HeroSection({ forums }: HeroSectionProps) {
  const { data: session } = useSession();

  return (
    <section className="relative overflow-hidden bg-background dark:bg-background">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-muted dark:bg-muted" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(148 163 184 / 0.15) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* TopLeftButtons replaced by global Navbar in layout */}

      <div className="relative container mx-auto max-w-7xl px-4 py-24 sm:py-32 lg:py-40">
        <div className="text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Prenez part dans les débats de Meudon
            </h1>
          </div>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Rejoignez les discussions !
          </p>

          <div className="mt-8 max-w-3xl mx-auto">
            {!session && (
              <p className="text-sm text-muted-foreground mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                Votre post sera publié de façon anonyme.
                <Link href="/auth/login" className="ml-1 underline font-medium">
                  Connectez-vous
                </Link>{" "}
                pour publier avec votre profil.
              </p>
            )}
            <PostForm
              showCard={false}
              placeholder="Partagez votre amour pour Meudon..."
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
            />
          </div>

          <div className="mt-8">
            <Button asChild variant="secondary" className="px-6">
              <Link href="/forums">Voir les sujets</Link>
            </Button>
          </div>

          <ForumsPreview forums={forums} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-background dark:bg-background" />
    </section>
  );
}
