"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { LogoIcon } from "./icons";

type NavItem = {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
  parentId?: string | null;
  children?: NavItem[];
};

export default function NavbarPreview({ items }: { items: NavItem[] }) {
  // build tree from flat list
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
    // sort children by order
    const sortRec = (arr: TreeNode[]) => {
      arr.sort((a, b) => a.order - b.order);
      arr.forEach((c) => sortRec(c.children));
    };
    sortRec(roots);
    return roots;
  };

  const tree = buildTree(items || []);
  return (
    <nav className="w-full bg-background/50 border rounded p-2">
      <div className="flex items-center gap-4">
        <Link href="/">
          <LogoIcon size={36} className="text-foreground" />
        </Link>
        <div className="flex gap-2">
          {tree.map((it) => (
            <div key={it.id}>
              {it.children && it.children.length > 0 ? (
                // render dropdown (helper component manages its own open state)
                <DropdownWithChevron item={it} />
              ) : (
                <Button asChild variant="ghost" size="default">
                  <Link href={it.href} target="_blank">
                    {it.label}
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

// small helper component to render a DropdownMenu with a rotating chevron
function DropdownWithChevron({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={(v) => setOpen(v)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="default"
          className="flex items-center gap-1"
        >
          <span>{item.label}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-150 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="grid gap-1 p-1">
          {item.children?.map((c) => (
            <DropdownMenuItem key={c.id} asChild>
              <Link href={c.href} target="_blank">
                {c.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
