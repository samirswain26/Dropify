import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  privateKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  urlEndpoint: process.env.URL_ENDPOINT || "",
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized access",
        },
        {
          status: 401,
        },
      );
    }

    const authparams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authparams);
  } catch (error) {
    return NextResponse.json({error: "Failed to authenticate for imagekit"},{status: 500});
  }
}
