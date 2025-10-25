"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
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
        <NavigationMenu>
          <NavigationMenuList className="flex gap-2">
            {tree.map((it) => (
              <NavigationMenuItem key={it.id}>
                {it.children && it.children.length > 0 ? (
                  <>
                    <NavigationMenuTrigger>{it.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-1 p-2">
                        {it.children.map((c) => (
                          <NavigationMenuLink
                            key={c.id}
                            href={c.href}
                            target="_blank"
                          >
                            {c.label}
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink href={it.href} target="_blank">
                    {it.label}
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
