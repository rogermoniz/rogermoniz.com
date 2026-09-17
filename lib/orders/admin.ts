"use server";

import { revalidatePath } from "next/cache";
import { isSignedIn } from "@/lib/cms/auth";
import { setFulfilled } from "./orders";

/** The one thing the owner does to an order: say it has been honoured. */
export async function markFulfilled(form: FormData): Promise<void> {
  if (!(await isSignedIn())) throw new Error("Not signed in.");
  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) throw new Error("Unknown order.");
  await setFulfilled(id, form.get("fulfilled") === "1");
  revalidatePath("/admin/commandes");
}
