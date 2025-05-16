// app/api/business/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id },
      include: { locations: true },
    });

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 });
  }
}
