"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/lib/auth/auth-client";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  Menu,
  MessageSquare,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  function toggleCollapse() {
    setIsCollapsed((v) => !v);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty(
        "--sidebar-width",
        !isCollapsed ? "72px" : "240px"
      );
    }
  }

  return (
    <div>
      {/* Mobile: hamburger that opens the side menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <VerticalNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop: fixed sidebar */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 z-40 h-screen border-r bg-background"
        style={{ width: "var(--sidebar-width, 240px)" }}
      >
        <VerticalNav
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </aside>
    </div>
  );
}

interface VerticalNavProps {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function VerticalNav({
  onNavigate,
  isCollapsed,
  onToggleCollapse,
}: VerticalNavProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [forumsOpen, setForumsOpen] = useState(false);
  const [topForums, setTopForums] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isLoadingForums, setIsLoadingForums] = useState(false);

  function handleBack() {
    router.back();
    if (onNavigate) onNavigate();
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setIsLoadingForums(true);
        const res = await fetch("/api/forums", { cache: "no-store" });
        if (!res.ok) return;
        const data: Array<{
          id: string;
          name: string;
          _count?: { posts: number };
        }> = await res.json();
        if (!mounted) return;
        const sorted = data.sort(
          (a, b) =>
            (b._count?.posts ?? 0) - (a._count?.posts ?? 0) ||
            a.name.localeCompare(b.name)
        );
        setTopForums(sorted.slice(0, 3).map(({ id, name }) => ({ id, name })));
      } finally {
        if (mounted) setIsLoadingForums(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between px-3 py-3 border-b">
        {!isCollapsed && (
          <span className="px-2 text-base font-semibold">Menu</span>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="ml-auto"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="h-full py-3">
        <div className="px-2 py-1">
          <div className="space-y-1">
            <Button
              asChild
              variant="ghost"
              className={`w-full ${isCollapsed ? "justify-center" : "justify-start"}`}
              onClick={onNavigate}
            >
              <Link href="/">
                <Home className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`} />
                {!isCollapsed && <span>Accueil</span>}
              </Link>
            </Button>
            {isCollapsed ? (
              <Button
                asChild
                variant="ghost"
                className={`w-full ${isCollapsed ? "justify-center" : "justify-start"}`}
                onClick={onNavigate}
              >
                <Link href="/forums">
                  <MessageSquare
                    className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`}
                  />
                </Link>
              </Button>
            ) : (
              <Collapsible open={forumsOpen} onOpenChange={setForumsOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    type="button"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Forums</span>
                    <ChevronRight
                      className={`ml-auto h-4 w-4 transition-transform ${forumsOpen ? "rotate-90" : "rotate-0"}`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-7 mt-1 space-y-1">
                  {isLoadingForums && (
                    <div className="px-2 text-xs text-muted-foreground">
                      Chargement...
                    </div>
                  )}
                  {!isLoadingForums &&
                    topForums.map((f) => (
                      <Button
                        key={f.id}
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={onNavigate}
                      >
                        <Link href={`/forums/${f.id}`}>{f.name}</Link>
                      </Button>
                    ))}
                  {!isLoadingForums && topForums.length > 0 && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-muted-foreground"
                      onClick={onNavigate}
                    >
                      <Link href="/forums">Voir tout</Link>
                    </Button>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}
            <Button
              asChild
              variant="ghost"
              className={`w-full ${isCollapsed ? "justify-center" : "justify-start"}`}
              onClick={onNavigate}
            >
              <Link href="/shop">
                <ShoppingBag
                  className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`}
                />
                {!isCollapsed && <span>Magasin</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${isCollapsed ? "justify-center" : "justify-start"}`}
              onClick={handleBack}
            >
              <ChevronLeft className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`} />
              {!isCollapsed && <span>Retour</span>}
            </Button>
          </div>

          {session && (
            <div className="mt-3 space-y-1">
              {!isCollapsed && (
                <h3 className="mb-1 px-2 text-xs font-medium text-muted-foreground">
                  Compte
                </h3>
              )}
              <Button
                asChild
                variant="ghost"
                className={`w-full ${isCollapsed ? "justify-center" : "justify-start"}`}
                onClick={onNavigate}
              >
                <Link href="/profile">
                  <UserIcon
                    className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`}
                  />
                  {!isCollapsed && <span>Profil</span>}
                </Link>
              </Button>
              {session.user.role === "ADMIN" && (
                <Button
                  asChild
                  variant="ghost"
                  className={`w-full ${isCollapsed ? "justify-center" : "justify-start"}`}
                  onClick={onNavigate}
                >
                  <Link href="/admin/dashboard">
                    <LayoutDashboard
                      className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`}
                    />
                    {!isCollapsed && <span>Admin</span>}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
