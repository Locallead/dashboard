import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { business, address, state, city } = await req.json();

  const homePageSchema = z.object({
    hero: z.object({
      title: z.string().describe("(H1)"),
      description: z.string().describe("(Paragraph)"),
    }),
    usp: z.object({
      title1: z.string().describe("(H3)"),
      title2: z.string().describe("(H3)"),
      title3: z.string().describe("(H3)"),
      description1: z.string().describe("(Paragraph)"),
      description2: z.string().describe("(Paragraph)"),
      description3: z.string().describe("(Paragraph)"),
    }),
    leftPicture: z.object({
      title: z.string().describe("(P)"),
      header: z.string().describe("(H2)"),
      subHeader: z.string().describe("(H3)"),
      description: z.string().describe("(Paragraph)"),
    }),
    service: z.object({
      title: z.string().describe("(Paragraph)"),
      description: z.string().describe("(Paragraph)"),
      header: z.string().describe("(H2)"),
    }),
    trust: z.object({
      title: z.string().describe("(Paragraph)"),
      heading: z.string().describe("(H2)"),
      quality1: z.string().describe("(Paragraph)"),
      quality2: z.string().describe("(Paragraph)"),
      quality3: z.string().describe("(Paragraph)"),
      quality4: z.string().describe("(Paragraph)"),
      quality5: z.string().describe("(Paragraph)"),
      quality6: z.string().describe("(Paragraph)"),
      description1: z.string().describe("(Paragraph)"),
      description2: z.string().describe("(Paragraph)"),
      description3: z.string().describe("(Paragraph)"),
      description4: z.string().describe("(Paragraph)"),
      description5: z.string().describe("(Paragraph)"),
      description6: z.string().describe("(Paragraph)"),
    }),
    map: z.object({
      title: z.string().describe("(Paragraph)"),
      description: z.string().describe("(Paragraph)"),
      heading: z.string().describe("(H2)"),
    }),
    cta: z.object({
      title: z.string().describe("(H2)"),
      link: z.string().describe("(Link)"),
    }),
    meta: z.object({
      title: z.string().describe("(Meta Title of the home page)"),
      description: z.string().describe("(Meta Description of the home page)"),
    }),
  });

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: homePageSchema,
      prompt: `You are a SEO Expert who creates websites optimized for local SEO, making them SEO optimized and hyper-localized. You are given the Business name and address. This is a garage door services provider business.

Business name is ${business}
Address is ${address}
State is ${state}
City is ${city}

Create a home page that:
1. Uses natural, engaging language that connects with local customers
2. Incorporates local landmarks and area-specific details when relevant
3. Optimizes for local SEO with strategic placement of city name and service keywords
4. Maintains a professional yet approachable tone
5. Emphasizes trust, reliability, and local expertise
6. Includes clear calls to action
7. Meta description should be 150-170 characters and meta title around 60 characters
8. Includes the city name in meta tags
9. Uses persuasive language that encourages contact/conversion

The content should be unique and tailored to this specific business and location, avoiding generic content.`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
