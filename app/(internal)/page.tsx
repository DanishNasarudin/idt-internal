import { FileText, LayoutDashboard, Settings } from "lucide-react";

export default function Home() {
  const navigationCards = [
    {
      title: "Dashboard",
      description: "View warranty cases and manage your workflow",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Warranty Cases",
      description: "Create and manage warranty cases",
      icon: FileText,
      href: "/dashboard",
      color: "text-green-600 dark:text-green-400",
    },
    // {
    //   title: "Branch Management",
    //   description: "View and manage branch information",
    //   icon: Building2,
    //   href: "/branch",
    //   color: "text-purple-600 dark:text-purple-400",
    // },
    {
      title: "Settings",
      description: "Configure branches, staff, and system settings",
      icon: Settings,
      href: "/settings",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Internal Management System
        </h1>
        <p className="text-muted-foreground">
          Welcome to Ideal Tech PC Internal Management.
        </p>
      </div>
      {/* Developer guide for public-navbar API */}
      <div className="bg-muted p-4 rounded-md">
        <h2 className="text-xl font-semibold">
          Developer guide: /api/public-navbar
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          This API is used to manage site navigation items. It requires an
          Authorization header:{" "}
          <code>Authorization: Bearer &lt;SECRET&gt;</code>. Keep the secret on
          the server and prefer server-to-server calls.
        </p>
        <div className="mt-3">
          <pre className="rounded bg-black/5 p-3 overflow-auto text-sm">
            <code>{`// server-side example (Node / server)
const res = await fetch('https://your-domain.com/api/public-navbar', {
  headers: { Authorization: 'Bearer <CLERK_SECRET_KEY>' }
});
const json = await res.json();
console.log(json);
`}</code>
          </pre>
          <p className="text-xs text-muted-foreground mt-2">
            For safer client usage, create a server proxy that injects the
            Authorization header so the secret never hits the browser.
          </p>
        </div>
      </div>
    </div>
  );
}
