import ClerkUsersManager from "@/components/custom/clerk-users-manager";

export const metadata = {
  title: "Clerk Users",
};

export default function ClerkUsersPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clerk Users</h1>
          <p className="text-muted-foreground">
            Manage users authenticated via Clerk.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <ClerkUsersManager />
      </div>
    </div>
  );
}
