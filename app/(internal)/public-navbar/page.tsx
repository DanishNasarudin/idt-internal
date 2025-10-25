import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Public Navbar",
};

export default function PublicNavbarPage() {
  // Placeholder UI: table shell. We'll wire data and actions later.
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Public Navbar</h1>
          <p className="text-sm text-muted-foreground">
            Manage items that appear on the public navigation bar.
          </p>
        </div>
        <div>
          <Button variant="default">
            <Plus className="mr-2 w-4 h-4" /> Add nav item
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Visible</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Example/placeholder rows */}
            <TableRow>
              <TableCell>Home</TableCell>
              <TableCell>/</TableCell>
              <TableCell>1</TableCell>
              <TableCell>Yes</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>About</TableCell>
              <TableCell>/about</TableCell>
              <TableCell>2</TableCell>
              <TableCell>No</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <TableCaption>
          Items are editable — UI wiring will be added next.
        </TableCaption>
      </div>
    </div>
  );
}
