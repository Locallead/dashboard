import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { business, address, state, city } = await req.json();

  const servicePageSchema = z.object({
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
      title: z.string().describe("(Meta Title of the service page)"),
      description: z
        .string()
        .describe("(Meta Description of the service page)"),
    }),
  });

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: servicePageSchema,
      prompt: `This is a service page, and its gonna get duplicated in multiple service pages. So replace every use of service & state uses with {service}. Services can be example: Garage door repiar, Garage door service, and you build the content around that keyword. You are a SEO Expert. And you create websites optimized for local SEO, making them seo optimzied and hyper-localized. You are given the Business name and address. This is a garage door services provider business. Business name is ${business} and address is ${address} state is ${state} city is ${city} try to use as many keywords as possible in the content. Meta Description should be around 150-170 characters and meta title should be around 60 characters mention the city name as well. !!!Every mention of service should be replaced with {service}!!!`,
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
