import { NextResponse } from "next/server";
import { notifyAll } from "../../../notifications/notify";

export async function POST(req: Request): Promise<Response> {
    const { message } = await req.json();
    await notifyAll(message);
    return NextResponse.json({ success: true });
}
