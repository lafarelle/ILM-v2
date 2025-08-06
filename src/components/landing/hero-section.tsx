"use client";

import { Button } from "@/components/ui/button";
import { PostForm } from "@/features/posts/components/post-form";
import { useSession } from "@/lib/auth/auth-client";
import Link from "next/link";

export function HeroSection() {
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

      <div className="absolute top-4 left-4 z-10">
        {!session ? (
          <Button
            asChild
            variant="outline"
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
          >
            <Link href="/auth/login">Se connecter</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
            >
              <Link href="/profile">Profile</Link>
            </Button>
            {session.user.role === "ADMIN" && (
              <Button
                asChild
                size="sm"
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
              >
                <Link href="/admin/dashboard">Admin Dashboard</Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="relative container mx-auto max-w-7xl px-4 py-24 sm:py-32 lg:py-40">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full mb-8">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            <span className="block text-primary">Pour tous les</span>
            <span className="block mt-2 text-secondary">
              adorateurs de Meudon
            </span>
          </h1>
          
          <div className="mt-12 max-w-2xl mx-auto">
            {!session && (
              <p className="text-sm text-muted-foreground mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                Votre post sera publié de façon anonyme. 
                <Link href="/auth/login" className="ml-1 underline font-medium">
                  Connectez-vous
                </Link> pour publier avec votre profil.
              </p>
            )}
            <PostForm
              showCard={false}
              placeholder="Partagez votre amour pour Meudon..."
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-background dark:bg-background" />
    </section>
  );
}
