import PublicNavbarManager from "@/components/custom/public-navbar-manager";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Public Navbar",
};

export default async function PublicNavbarPage() {
  // server-side fetch of navbar items (no client secret exposure)
  const items = await prisma.navbarItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Public Navbar</h1>
          <p className="text-muted-foreground">
            Manage items that appear on the public navigation bar.
          </p>
        </div>
      </div>

      <div className="mt-6">
        {/* pass initial items to client manager so it doesn't need a secret for initial load */}
        <PublicNavbarManager initialItems={items} />
      </div>
    </div>
  );
}
