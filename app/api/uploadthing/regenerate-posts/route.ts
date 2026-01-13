import { NextResponse } from "next/server";
import { generatePosts } from "@/actions/upload-actions";

export async function POST(request: Request) {
  try {
    const { fileUrl, fileName, filters } = await request.json();

    const result = await generatePosts({ fileUrl, fileName, filters });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Regeneration error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to regenerate posts",
      },
      { status: 500 }
    );
  }
}
