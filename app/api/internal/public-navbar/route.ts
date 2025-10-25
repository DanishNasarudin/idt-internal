import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // server-side auth: only allow users with role Admin or Staff
  try {
    const { userId } = await auth();
    if (!userId)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const role =
      (user as any)?.privateMetadata?.role ??
      (user as any)?.private_metadata?.role ??
      null;
    if (!(role === "Admin" || role === "Staff")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }
  } catch (e: any) {
    console.error("Auth error", e);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    const items = await prisma.navbarItem.findMany({
      orderBy: { order: "asc" },
    });
    // build nested tree
    const map = new Map<string, any>();
    items.forEach((it: any) => map.set(it.id, { ...it, children: [] }));
    const roots: any[] = [];
    for (const it of map.values()) {
      if (it.parentId) {
        const parent = map.get(it.parentId);
        if (parent) parent.children.push(it);
        else roots.push(it);
      } else {
        roots.push(it);
      }
    }
    const sortRec = (arr: any[]) => {
      arr.sort((a, b) => a.order - b.order);
      arr.forEach((c) => sortRec(c.children));
    };
    sortRec(roots);
    return new Response(JSON.stringify({ items, tree: roots }), {
      status: 200,
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    // server-side auth: only allow Admin/Staff
    try {
      const { userId } = await auth();
      if (!userId)
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const role =
        (user as any)?.privateMetadata?.role ??
        (user as any)?.private_metadata?.role ??
        null;
      if (!(role === "Admin" || role === "Staff")) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
        });
      }
    } catch (e: any) {
      console.error("Auth error", e);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const body = await req.json();
    const parentWhere: any =
      typeof body.parentId !== "undefined" && body.parentId !== null
        ? { parentId: String(body.parentId) }
        : { parentId: null };
    const max = await prisma.navbarItem.aggregate({
      _max: { order: true },
      where: parentWhere,
    });
    const nextOrder = (max._max.order ?? 0) + 1;
    const data: any = {
      label: String(body.label ?? ""),
      href: String(body.href ?? "/"),
      order: Number(body.order ?? nextOrder),
      visible: Boolean(body.visible ?? true),
      parentId:
        typeof body.parentId !== "undefined"
          ? body.parentId
            ? String(body.parentId)
            : null
          : null,
    };
    if (body?.id) data.id = String(body.id);
    const item = await prisma.navbarItem.create({ data });
    return new Response(JSON.stringify({ item }), { status: 201 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // server-side auth: only allow Admin/Staff
    try {
      const { userId } = await auth();
      if (!userId)
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const role =
        (user as any)?.privateMetadata?.role ??
        (user as any)?.private_metadata?.role ??
        null;
      if (!(role === "Admin" || role === "Staff")) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
        });
      }
    } catch (e: any) {
      console.error("Auth error", e);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const body = await req.json();
    if (body?.action === "reorder" && Array.isArray(body.items)) {
      const ops = (body.items as any[]).map((i) =>
        prisma.navbarItem.update({
          where: { id: String(i.id) },
          data: {
            order: Number(i.order),
            parentId:
              typeof i.parentId !== "undefined"
                ? i.parentId
                  ? String(i.parentId)
                  : null
                : undefined,
          },
        })
      );
      await prisma.$transaction(ops);
      const items: any[] = await prisma.navbarItem.findMany({
        orderBy: { order: "asc" },
      });
      const map = new Map<string, any>();
      items.forEach((it: any) => map.set(it.id, { ...it, children: [] }));
      const roots: any[] = [];
      for (const it of map.values()) {
        if (it.parentId) {
          const parent = map.get(it.parentId);
          if (parent) parent.children.push(it);
          else roots.push(it);
        } else {
          roots.push(it);
        }
      }
      const sortRec = (arr: any[]) => {
        arr.sort((a, b) => a.order - b.order);
        arr.forEach((c) => sortRec(c.children));
      };
      sortRec(roots);
      return new Response(JSON.stringify({ items, tree: roots }), {
        status: 200,
      });
    }

    if (body?.id) {
      const updateData: any = {};
      if (typeof body.label !== "undefined")
        updateData.label = String(body.label);
      if (typeof body.href !== "undefined") updateData.href = String(body.href);
      if (typeof body.visible !== "undefined")
        updateData.visible = Boolean(body.visible);
      if (typeof body.order !== "undefined")
        updateData.order = Number(body.order);
      if (typeof body.parentId !== "undefined")
        updateData.parentId = body.parentId ? String(body.parentId) : null;
      const item = await prisma.navbarItem.update({
        where: { id: String(body.id) },
        data: updateData,
      });
      // normalize per parent
      const all: any[] = await prisma.navbarItem.findMany();
      const groups = new Map<string, any[]>();
      all.forEach((it: any) => {
        const key = it.parentId ?? "__root";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(it);
      });
      for (const [key, arr] of groups.entries()) {
        arr.sort((a: any, b: any) => a.order - b.order);
        for (let i = 0; i < arr.length; i++) {
          const it = arr[i];
          if (it.order !== i + 1) {
            prisma.navbarItem.update({
              where: { id: it.id },
              data: { order: i + 1 },
            });
          }
        }
      }
      return new Response(JSON.stringify({ item }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Bad request" }), {
      status: 400,
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // server-side auth: only allow Admin/Staff
    try {
      const { userId } = await auth();
      if (!userId)
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const role =
        (user as any)?.privateMetadata?.role ??
        (user as any)?.private_metadata?.role ??
        null;
      if (!(role === "Admin" || role === "Staff")) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
        });
      }
    } catch (e: any) {
      console.error("Auth error", e);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id)
      return new Response(JSON.stringify({ error: "Missing id" }), {
        status: 400,
      });
    await prisma.navbarItem.delete({ where: { id: String(id) } });
    // normalize per parent
    const all: any[] = await prisma.navbarItem.findMany();
    const groups = new Map<string, any[]>();
    all.forEach((it: any) => {
      const key = it.parentId ?? "__root";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(it);
    });
    for (const [key, arr] of groups.entries()) {
      arr.sort((a: any, b: any) => a.order - b.order);
      for (let i = 0; i < arr.length; i++) {
        const it = arr[i];
        if (it.order !== i + 1) {
          prisma.navbarItem.update({
            where: { id: it.id },
            data: { order: i + 1 },
          });
        }
      }
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
