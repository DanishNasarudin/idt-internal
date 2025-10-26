"use client";

import { ActionButton } from "@/components/custom/action-button";
import NavbarPreview from "@/components/custom/navbar-preview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, ChevronDown, Edit2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";

type NavItem = {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  parentId?: string | null;
  children?: NavItem[];
};

export default function PublicNavbarManager({
  initialItems,
}: {
  initialItems?: NavItem[];
}) {
  const [items, setItems] = useState<NavItem[]>(initialItems ?? []);
  const [loading, setLoading] = useState(false);

  // dialog state
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<NavItem | null>(null);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [visible, setVisible] = useState(true);
  const [parentId, setParentId] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/internal/public-navbar", {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch");
      const list = (data.items || []).slice();
      list.sort((a: NavItem, b: NavItem) => a.order - b.order);
      setItems(list);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // helper to compute descendants of a node (by id) to prevent circular parents
  const getDescendantIds = (rootId: string | null) => {
    if (!rootId) return new Set<string>();
    const desc = new Set<string>();
    const stack: string[] = [rootId];
    while (stack.length > 0) {
      const cur = stack.pop() as string;
      items.forEach((it) => {
        if (it.parentId === cur && !desc.has(it.id)) {
          desc.add(it.id);
          stack.push(it.id);
        }
      });
    }
    return desc;
  };

  const descendantIds = editItem
    ? getDescendantIds(editItem.id)
    : new Set<string>();

  const openAdd = () => {
    setEditItem(null);
    setLabel("");
    setHref("");
    setVisible(true);
    setParentId(null);
    setOpen(true);
  };

  const openEdit = (it: NavItem) => {
    setEditItem(it);
    setLabel(it.label);
    setHref(it.href);
    setVisible(Boolean(it.visible));
    setParentId(it.parentId ?? null);
    setOpen(true);
  };

  const save = async () => {
    try {
      const body: any = { label: label.trim(), href: href.trim(), visible };
      if (editItem) body.id = editItem.id;
      if (parentId) body.parentId = parentId;
      const res = await fetch("/api/internal/public-navbar", {
        method: editItem ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save");
      toast.success(editItem ? "Updated" : "Created");
      setOpen(false);
      await fetchItems();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save item");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this nav item?")) return;
    try {
      const res = await fetch(
        `/api/internal/public-navbar?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete");
      toast.success("Deleted");
      await fetchItems();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete item");
    }
  };

  const toggleVisible = async (id: string, v: boolean) => {
    try {
      const res = await fetch("/api/internal/public-navbar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, visible: v }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update");
      setItems((s) =>
        s.map((it) => (it.id === id ? { ...it, visible: v } : it))
      );
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update visibility");
    }
  };

  // Reorder within siblings (preserves nesting). Sends only sibling updates to server.
  const reorder = async (id: string, dir: -1 | 1) => {
    const itemIdx = items.findIndex((i) => i.id === id);
    if (itemIdx === -1) return;
    const item = items[itemIdx];
    const parentKey = item.parentId ?? null;
    const siblings = items
      .filter((i) => (i.parentId ?? null) === parentKey)
      .slice()
      .sort((a, b) => a.order - b.order);
    const sidx = siblings.findIndex((s) => s.id === id);
    if (sidx === -1) return;
    const newSIdx = sidx + dir;
    if (newSIdx < 0 || newSIdx >= siblings.length) return;
    const copySiblings = siblings.slice();
    const [moved] = copySiblings.splice(sidx, 1);
    copySiblings.splice(newSIdx, 0, moved);

    // reassign orders for this sibling group only
    const updates = copySiblings.map((it, i) => ({
      id: it.id,
      order: i + 1,
      parentId: parentKey,
    }));

    // apply locally
    const updatedItems = items.map((it) => {
      const u = updates.find((up) => up.id === it.id);
      return u ? { ...it, order: u.order } : it;
    });
    setItems(updatedItems);

    try {
      const res = await fetch("/api/internal/public-navbar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", items: updates }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d?.error || "Failed to reorder");
      }
      toast.success("Reordered");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to reorder");
      await fetchItems();
    }
  };

  const visibleList = useMemo(() => items.filter((i) => i.visible), [items]);

  // build tree for table rendering (keeps nesting and order)
  type TreeNode = NavItem & { children: TreeNode[] };
  const buildTree = (flat: NavItem[]) => {
    const map = new Map<string, TreeNode>();
    flat.forEach((f) => map.set(f.id, { ...f, children: [] } as TreeNode));
    const roots: TreeNode[] = [];
    for (const node of map.values()) {
      if (node.parentId) {
        const parent = map.get(node.parentId);
        if (parent) parent.children.push(node);
        else roots.push(node);
      } else {
        roots.push(node);
      }
    }
    // sort siblings by order recursively
    const sortRec = (arr: TreeNode[]) => {
      arr.sort((a, b) => a.order - b.order);
      arr.forEach((c) => sortRec(c.children));
    };
    sortRec(roots);
    return roots;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div>
          <ActionButton action="add" label="Add nav item" onClick={openAdd} />
        </div>
        <div>
          <Button variant="outline" onClick={fetchItems}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-center">Order</TableHead>
                  <TableHead className="text-center">Visible</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No items
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // render as nested rows using the tree builder
                  (() => {
                    const tree = buildTree(items);

                    const renderRows = (nodes: any[], depth = 0.5): any[] => {
                      return nodes.flatMap((n) => {
                        const row = (
                          <TableRow key={n.id}>
                            <TableCell
                              style={{ paddingLeft: `${depth * 1.25}rem` }}
                            >
                              {n.label}
                            </TableCell>
                            <TableCell>
                              {items.find((p) => p.id === n.parentId)?.label ??
                                "-"}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {n.href}
                            </TableCell>
                            <TableCell className="text-center">
                              {n.order}
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={Boolean(n.visible)}
                                onCheckedChange={(v) =>
                                  toggleVisible(n.id, Boolean(v))
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2 items-center justify-center">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => reorder(n.id, -1)}
                                  title="Move up"
                                >
                                  <ArrowUp size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => reorder(n.id, 1)}
                                  title="Move down"
                                >
                                  <ArrowDown size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openEdit(n)}
                                  title="Edit"
                                >
                                  <Edit2 size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => remove(n.id)}
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );

                        if (!n.children || n.children.length === 0)
                          return [row];
                        return [row, ...renderRows(n.children, depth + 1)];
                      });
                    };

                    return renderRows(tree);
                  })()
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium">Preview</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Visible items preview (local)
          </p>
          <div className="mt-2">
            <NavbarPreview items={visibleList} />
          </div>
        </div>
        <div className="h-[200px]"></div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit nav item" : "Add nav item"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <label className="text-sm text-muted-foreground">Label</label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
            <label className="text-sm text-muted-foreground">URL</label>
            <Input value={href} onChange={(e) => setHref(e.target.value)} />
            <label className="text-sm text-muted-foreground">Parent</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between">
                  {parentId
                    ? items.find((p) => p.id === parentId)?.label
                    : "-- none --"}{" "}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <ScrollArea className="max-h-60">
                  <DropdownMenuItem
                    onSelect={() => setParentId(null)}
                    variant={parentId === null ? "default" : "default"}
                  >
                    -- none --
                  </DropdownMenuItem>
                  {items
                    .filter((i) => i.id !== editItem?.id)
                    .map((it) => (
                      <DropdownMenuItem
                        key={it.id}
                        onSelect={() => setParentId(it.id)}
                        disabled={
                          descendantIds.has(it.id) || Boolean(it.parentId)
                        }
                      >
                        {it.label}
                      </DropdownMenuItem>
                    ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2 mt-2">
              <Switch
                checked={visible}
                onCheckedChange={(v) => setVisible(Boolean(v))}
              />
              <span className="text-sm">Visible</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={save}>{editItem ? "Save" : "Create"}</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
