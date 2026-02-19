import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ fileId: string }> },
  // The fileId was to be created with the same name with passing the id in the folder...
  //   The fileId will come from the above root file that is "../"
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unhauthorized" }, { status: 401 });
    }

    const { fileId } = await props.params;

    if (!fileId) {
      return NextResponse.json(
        { error: "No file exists with that id." },
        { status: 401 },
      );
    }

    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "file not found" }, { status: 401 });
    }

    const updatedFiles = await db
      .update(files)
      .set({ isStarred: !file.isStarred })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();

    console.log("This is the whole updatedFiles is : ", updatedFiles);
    const UpdatedFile = updatedFiles[0];
    console.log("And the updatedFile is : ", UpdatedFile);

    NextResponse.json(UpdatedFile)
  } catch (error) {
      return NextResponse.json({ error: "Failed to updated the file" }, { status: 401 });
  }
}
