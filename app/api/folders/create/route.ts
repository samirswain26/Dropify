import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { uuid } from "drizzle-orm/gel-core";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { name, userId: bodyUserID, parentId = null } = body;

    if (bodyUserID !== userId) {
      return NextResponse.json(
        { error: "Authorization failed" },
        { status: 500 },
      );
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Enter a valid name" },
        { status: 401 },
      );
    }

    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, userId),
            eq(files.isFolder, true),
          ),
        );

        if(!parentFolder){
            return NextResponse.json({error: "Parent folder not found"}, {status: 404})
        }
    }

    // create a folder in db

    const folderData = {
        id: uuidv4(),
        name: name.trim(),
        path: `/folders/${userId}/${uuidv4()}`,
        size: 0,
        type: "folder",
        fileUrl: "",
        thumbnailUrl:"",
        parentId,
        userId,
        isFolder: true,
        isStarred: false,
        isTrash: false
    }

    const [newFolder] = await db.insert(files).values(folderData).returning()

    return NextResponse.json({
        success: true,
        message: "Folder created successfully",
        folder: newFolder
    })
  } catch (error) {}
}
