import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AdminSignIn } from "@/components/admin/AdminSignIn";
import { EnquiriesPanel } from "@/components/admin/EnquiriesPanel";
import { ProductsPanel } from "@/components/admin/ProductsPanel";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Sri Prakash Traders" },
      { name: "description", content: "Admin dashboard for managing maize enquiries and products." },
      { property: "og:title", content: "Admin Dashboard | Sri Prakash Traders" },
      { property: "og:description", content: "Private admin area for Sri Prakash Traders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return { session, ready };
}

function AdminPage() {
  const { session, ready } = useSession();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const userId = session?.user.id;

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["admin", "is-admin", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_role", { _user_id: userId!, _role: "admin" });
      if (error) throw error;
      return data === true;
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.removeQueries({ queryKey: ["admin"] });
    await supabase.auth.signOut();
    navigate({ to: "/admin", replace: true });
  }

  if (!ready || (userId && isLoading)) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-forest" />
      </div>
    );
  }

  if (!session) return <AdminSignIn />;

  if (!isAdmin) {
    return (
      <div className="container-site grid min-h-[60vh] place-items-center py-16">
        <div className="max-w-md text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-gold" />
          <h1 className="mt-4 text-3xl font-semibold text-forest-deep">No admin access</h1>
          <p className="mt-2 text-muted-foreground">
            You're signed in as {session.user.email}, but this account doesn't have access to the dashboard.
          </p>
          <Button variant="outline" className="mt-6" onClick={signOut}>
            <LogOut /> Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-cream py-10 md:py-14">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-forest">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-forest-deep md:text-4xl">Enquiries &amp; products</h1>
            <p className="mt-1 text-sm text-muted-foreground">Signed in as {session.user.email}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut /> Sign out
          </Button>
        </div>
        <Tabs defaultValue="enquiries" className="mt-8">
          <TabsList>
            <TabsTrigger value="enquiries">Price enquiries</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          <TabsContent value="enquiries" className="mt-6">
            <EnquiriesPanel />
          </TabsContent>
          <TabsContent value="products" className="mt-6">
            <ProductsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
