import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, now: Date.now() });
}
