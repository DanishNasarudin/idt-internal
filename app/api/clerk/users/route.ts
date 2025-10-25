import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Simple Clerk users admin route. Requires CLERK_SECRET_KEY in environment.

export async function GET(req: Request) {
  try {
    const client = await clerkClient();
    // getUserList is the server-side method to list users
    // We limit to 200 for now; pagination can be added later.
    const listRaw = await client.users.getUserList({ limit: 200 });

    // Clerk SDK returns a paginated shape like { data: User[], totalCount }
    // normalize to an array for mapping
    const arr: unknown[] = Array.isArray(listRaw)
      ? listRaw
      : typeof listRaw === "object" &&
        listRaw !== null &&
        Array.isArray((listRaw as unknown as Record<string, unknown>).data)
      ? ((listRaw as unknown as Record<string, unknown>).data as unknown[])
      : [];

    // If caller requests raw SDK response for inspection, return it directly
    try {
      const url = new URL(req.url);
      if (url.searchParams.get("raw") === "1") {
        return NextResponse.json({ raw: listRaw });
      }
    } catch (_e) {
      /* ignore URL parse errors */
    }

    // The list endpoint may return lightweight user objects that omit email_addresses.
    // Fetch full user objects to reliably obtain email and related fields.
    const ids: string[] = arr.flatMap((u) => {
      if (typeof u === "object" && u !== null) {
        const r = u as Record<string, unknown>;
        const maybeId = r["id"];
        if (typeof maybeId === "string") return [maybeId];
      }
      return [] as string[];
    });

    const detailedUsers = await Promise.all(
      ids.map((id) => client.users.getUser(id))
    );

    // Define minimal shape for the response we want to return to the client.
    type UsersResponseItem = {
      id: string;
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      role: string | null;
      lastSignInAt: string | null;
      _raw: unknown;
    };

    const extractEmail = (val: unknown): string | null => {
      if (val == null) return null;
      if (typeof val === "string") return val;
      if (typeof val === "object") {
        const r = val as Record<string, unknown>;
        const candidate =
          r["emailAddress"] ?? r["email_address"] ?? r["email"] ?? r["address"];
        if (typeof candidate === "string") return candidate;
      }
      return null;
    };

    const users: UsersResponseItem[] = (detailedUsers || []).map((u) => {
      const obj =
        typeof u === "object" && u !== null
          ? (u as unknown as Record<string, unknown>)
          : {};

      const emailFromEmailAddresses = Array.isArray(obj["email_addresses"])
        ? extractEmail((obj["email_addresses"] as unknown[])[0])
        : null;

      const email =
        emailFromEmailAddresses ??
        extractEmail(obj["primary_email_address"]) ??
        extractEmail(obj["primary_email"]) ??
        extractEmail(obj["primaryEmailAddress"]) ??
        extractEmail(obj["email"]) ??
        extractEmail(obj["emailAddress"]) ??
        null;

      const firstName =
        typeof obj["first_name"] === "string"
          ? (obj["first_name"] as string)
          : typeof obj["firstName"] === "string"
          ? (obj["firstName"] as string)
          : null;
      const lastName =
        typeof obj["last_name"] === "string"
          ? (obj["last_name"] as string)
          : typeof obj["lastName"] === "string"
          ? (obj["lastName"] as string)
          : null;

      const role =
        typeof obj["privateMetadata"] === "object" &&
        obj["privateMetadata"] !== null &&
        typeof (obj["privateMetadata"] as Record<string, unknown>)["role"] ===
          "string"
          ? ((obj["privateMetadata"] as Record<string, unknown>)[
              "role"
            ] as string)
          : typeof obj["private_metadata"] === "object" &&
            obj["private_metadata"] !== null &&
            typeof (obj["private_metadata"] as Record<string, unknown>)[
              "role"
            ] === "string"
          ? ((obj["private_metadata"] as Record<string, unknown>)[
              "role"
            ] as string)
          : null;

      const lastSignInAt =
        typeof obj["last_sign_in_at"] === "string"
          ? (obj["last_sign_in_at"] as string)
          : typeof obj["lastSignInAt"] === "string"
          ? (obj["lastSignInAt"] as string)
          : null;

      const id = typeof obj["id"] === "string" ? (obj["id"] as string) : "";

      return {
        id,
        email,
        firstName,
        lastName,
        role,
        lastSignInAt,
        _raw: u,
      } as UsersResponseItem;
    });

    return NextResponse.json({ users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, role } = body as { email?: string; role?: string };

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // Create a user directly via the server Clerk SDK and set private metadata.
    try {
      const client = await clerkClient();

      // Create the user using the Clerk SDK with the documented field name.
      // Per Clerk server SDK, use `emailAddress` (camelCase) to pass an array of email addresses.
      const created = await client.users.createUser({
        emailAddress: [email],
      });

      // Ensure the user has a role; default to "Normal" when none provided.
      const updated = await client.users.updateUser(created.id, {
        privateMetadata: { role: role ?? "Normal" },
      });

      return NextResponse.json({ user: updated });
    } catch (errCreate: unknown) {
      // Creation failed — return failure so caller can handle it explicitly.
      const message =
        errCreate instanceof Error ? errCreate.message : String(errCreate);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, role } = body as { userId?: string; role?: string };

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Missing userId or role" },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    const updated = await client.users.updateUser(userId, {
      privateMetadata: { role },
    });

    return NextResponse.json({ user: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const client = await clerkClient();
    await client.users.deleteUser(id);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
