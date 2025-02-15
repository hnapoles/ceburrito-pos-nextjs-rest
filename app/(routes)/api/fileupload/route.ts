import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData(); // ✅ Read FormData from request
        const file = formData.get("file") as Blob | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // ✅ Store file in custom storage (replace with actual upload logic)
        const buffer = await file.arrayBuffer();
        console.log("Received file:", file);

        return NextResponse.json({ message: "File uploaded successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
