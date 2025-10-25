import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";

export const metadata = {
  title: "Clerk Users",
};

export default function ClerkUsersPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clerk Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage users authenticated via Clerk. Edits will be handled via
            Clerk APIs later.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search users..." className="" />
          <Button variant="ghost">
            <Search />
          </Button>
          <Button variant="default">
            <Plus className="mr-2 w-4 h-4" /> Invite user
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>demo+admin@idealtech.com</TableCell>
              <TableCell>Admin User</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>—</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>demo+staff@idealtech.com</TableCell>
              <TableCell>Staff User</TableCell>
              <TableCell>Staff</TableCell>
              <TableCell>—</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <TableCaption>
          Clerk-backed users — editing will be wired later.
        </TableCaption>
      </div>
    </div>
  );
}
