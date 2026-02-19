import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  privateKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  urlEndpoint: process.env.URL_ENDPOINT || "",
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const formUserId = formData.get("userId") as string;
    const parentId = (formData.get("parentId") as string) || null;

    if (formUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file selescted" }, { status: 401 });
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
    } else {
      return NextResponse.json(
        { error: "Parent folder not found" },
        { status: 401 },
      );
    }

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only Images and pdfs are supported" },
        { status: 401 },
      );
    }

    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const folderPath = parentId
      ? `/dropify/${userId}/folder/${parentId}`
      : `/dropify/${userId}`;

    const Originalfilename = file.name;
    const fileExtension = Originalfilename.split(".").pop() || "";
    const uniqueFilename = `${uuidv4}.${fileExtension}`;

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: uniqueFilename,
      folder: folderPath,
      useUniqueFileName: false,
    });

    const fileData = {
        name: Originalfilename,
        path: uploadResponse.filePath,
        size: file.size.toString(),
        type: file.type,
        fileUrl: uploadResponse.url,
        thumbnailUrl: uploadResponse.thumbnailUrl || null,
        userId: userId,
        parentId: parentId,
        isFolder: false ,
        isStarred: false,
        isTrash:false

    };

    const [newFile] = await db.insert(files).values(fileData).returning();

    return NextResponse.json({
      success: true,
      message: "Files fetched successfully",
      file: newFile,
    });
  } catch (error) {
    return NextResponse.json({error: "error occured wile uploading the file."}, {status: 401})
  }
}
