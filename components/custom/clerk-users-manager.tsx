"use client";

import { StaffBadge } from "@/components/custom/staff-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow, isValid } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  lastSignInAt: string | null;
  _raw?: any;
};
const ROLE_OPTIONS = ["Admin", "Staff", "Normal"];

export default function ClerkUsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  // search / sort / pagination
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<
    "email" | "name" | "role" | "lastActive"
  >("email");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clerk/users", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch");
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, rowsPerPage, sortField, sortDir]);

  const processedUsers = useMemo(() => {
    // search by email only
    const q = search.trim().toLowerCase();
    let list = users.slice();
    if (q) {
      list = list.filter((u) => (u.email ?? "").toLowerCase().includes(q));
    }

    const getLastActiveValue = (u: User) => {
      // prefer normalized field
      if (u.lastSignInAt) return u.lastSignInAt;
      const r = u._raw as any;
      if (!r) return null;
      // common alternate locations
      return (
        r.last_sign_in_at ??
        r.lastSignInAt ??
        r.last_active_at ??
        r.lastActiveAt ??
        r.lastActive ??
        r.last_active ??
        null
      );
    };

    // sorting
    list.sort((a, b) => {
      let va: any = "";
      let vb: any = "";
      switch (sortField) {
        case "email":
          va = a.email ?? "";
          vb = b.email ?? "";
          break;
        case "name":
          va = `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim();
          vb = `${b.firstName ?? ""} ${b.lastName ?? ""}`.trim();
          break;
        case "role":
          va = a.role ?? "";
          vb = b.role ?? "";
          break;
        case "lastActive":
          const la = getLastActiveValue(a);
          const lb = getLastActiveValue(b);
          va = la ? new Date(la).getTime() : -Infinity;
          vb = lb ? new Date(lb).getTime() : -Infinity;
          break;
      }

      if (va === vb) return 0;
      if (sortField === "lastActive") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      // string compare
      const res = String(va).localeCompare(String(vb), undefined, {
        sensitivity: "base",
      });
      return sortDir === "asc" ? res : -res;
    });

    return list;
  }, [users, search, sortField, sortDir]);

  const total = processedUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  // clamp page
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return processedUsers.slice(start, start + rowsPerPage);
  }, [processedUsers, page, rowsPerPage]);

  const roleToColor = (role?: string | null) => {
    const r = (role ?? "Normal").toLowerCase();
    switch (r) {
      case "admin":
        return "purple";
      case "staff":
        return "emerald";
      default:
        return "gray";
    }
  };

  const formatLastActive = (iso?: string | null | number | Date) => {
    if (iso == null || iso === "") return "—";
    try {
      // Accept number timestamps, Date objects, or strings
      const d =
        typeof iso === "number"
          ? new Date(iso)
          : iso instanceof Date
          ? iso
          : new Date(String(iso));
      if (!isValid(d)) return String(iso);
      const abs = format(d, "do MMM yyyy, hh:mm:ss a");
      const rel = formatDistanceToNow(d, { addSuffix: true });
      // relative-first layout: "3 days ago — 17th Oct 2025, 12:00:00 PM"
      return `${rel} — ${abs}`;
    } catch (e) {
      return String(iso);
    }
  };

  const invite = async () => {
    setError(null);
    if (!email) return setError("Email is required");
    try {
      const res = await fetch("/api/clerk/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to invite");
      setEmail("");
      // refresh list
      if (data?.user) {
        toast.success("User created");
      } else {
        toast.success("Invitation sent");
      }
      await fetchUsers();
    } catch (err: any) {
      setError(err?.message ?? String(err));
      toast.error(err?.message ?? "Failed to invite user");
    }
  };

  const updateRole = async (userId: string, role: string) => {
    setError(null);
    try {
      const res = await fetch("/api/clerk/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update");
      // show small success toast and refresh list
      toast.success(`Role updated to ${role}`);
      await fetchUsers();
    } catch (err: any) {
      setError(err?.message ?? String(err));
      toast.error(err?.message ?? "Failed to update role");
    }
  };

  const deleteUser = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/clerk/users?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete");
      // show small success toast and refresh list
      toast.success("User deleted");
      await fetchUsers();
    } catch (err: any) {
      setError(err?.message ?? String(err));
      toast.error(err?.message ?? "Failed to delete user");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:gap-4 gap-2 justify-between mb-4">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <Input
            placeholder="Search email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2 items-center">
            <p className="text-muted-foreground text-sm">Sort: </p>
            <Select
              value={sortField}
              onValueChange={(v) => setSortField(v as any)}
            >
              <SelectTrigger size="sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="lastActive">Last active</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortDir} onValueChange={(v) => setSortDir(v as any)}>
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Asc</SelectItem>
                <SelectItem value="desc">Desc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Invite user by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={invite} disabled={loading}>
            Invite
          </Button>
          <Button variant="outline" onClick={fetchUsers}>
            Refresh
          </Button>
        </div>
      </div>

      {error && <div className="text-sm text-rose-600 mb-2">{error}</div>}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? // render skeleton rows while loading
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell>
                      <div className="w-64">
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : pagedUsers.length > 0
              ? pagedUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.email ?? "—"}</TableCell>
                    <TableCell>
                      {u.firstName || u.lastName
                        ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.role ?? "Normal"}
                        onValueChange={(val) => updateRole(u.id, val)}
                      >
                        <SelectTrigger size="sm" className="w-full">
                          <StaffBadge
                            name={u.role ?? "Normal"}
                            color={roleToColor(u.role)}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((r) => (
                            <SelectItem key={r} value={r}>
                              <StaffBadge name={r} color={roleToColor(r)} />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{formatLastActive(u.lastSignInAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete user</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                {(u.email ??
                                  `${u.firstName ?? ""} ${
                                    u.lastName ?? ""
                                  }`.trim()) ||
                                  "this user"}
                                ? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteUser(u.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : !loading && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No users found
                      </div>
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-2 mt-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Showing
            <span className="font-medium mx-1">
              {total === 0 ? 0 : (page - 1) * rowsPerPage + 1}
            </span>
            to
            <span className="font-medium mx-1">
              {Math.min(page * rowsPerPage, total)}
            </span>
            of
            <span className="font-medium mx-1">{total}</span>
          </div>

          <Select
            value={String(rowsPerPage)}
            onValueChange={(v) => setRowsPerPage(Number(v))}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="20">20 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Pagination
          aria-label="Pagination"
          className={cn("md:justify-end mx-0")}
        >
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>

            {/* simple pages */}
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
