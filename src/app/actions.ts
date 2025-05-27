"use server";

import { prisma } from "./lib/prisma";
import { revalidatePath } from "next/cache";

export async function addBusiness(data: {
  name: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  email: string;
  hours: string;
  mapLink: string;
  facebook?: string;
  description: string;
  html?: string;
}) {
  try {
    const business = await prisma.business.create({
      data: {
        ...data,
        facebook: data.facebook || "",
        html: data.html || "",
      },
    });

    revalidatePath("/");
    return { success: true, data: business };
  } catch (error) {
    console.error("Error adding business:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add business",
    };
  }
}

export async function getBusinesses() {
  const businesses = await prisma.business.findMany();
  return businesses;
}

export async function getBusiness(id: string) {
  const business = await prisma.business.findUnique({
    where: {
      id,
    },
  });
  return business;
}

export async function updateBusiness(data: {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  state: string;
  email: string;
  hours: string;
  mapLink: string;
  facebook?: string;
  description: string;
  html?: string;
}) {
  try {
    await prisma.business.update({
      where: {
        id: data.id,
      },
      data,
    });

    console.log("Updating business with ID:", data.id);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating business:", error);
    return {
      success: false,
      error: "Failed to update business",
    };
  }
}

export async function createHomePage({ id, data }: { id: string; data: any }) {
  try {
    await prisma.homePage.upsert({
      where: {
        businessId: id,
      },
      update: {
        sections: data,
      },
      create: {
        sections: data,
        business: {
          connect: { id },
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating home page:", error);
    return {
      success: false,
      error: "Failed to create home page",
    };
  }
}

export async function getHomePage({ id }: { id: string }) {
  const homePage = await prisma.homePage.findUnique({
    where: {
      businessId: id,
    },
  });
  return homePage;
}

export async function createServices({ id, data }: { id: string; data: any }) {
  try {
    await prisma.business.update({
      where: { id },
      data: { services: data },
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating services:", error);
    return { success: false, error: "Failed to create services" };
  }
}

export async function createLocation({ id, data }: { id: string; data: any }) {
  try {
    await prisma.location.create({
      data: {
        businessId: id,
        locations: data,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating location:", error);
    return { success: false, error: "Failed to create location" };
  }
}

export async function getLocations({ id }: { id: string }) {
  const locations = await prisma.location.findFirst({
    where: {
      businessId: id,
    },
  });
  return locations?.locations || [];
}

export async function addLocationPage({ id, data }: { id: string; data: any }) {
  try {
    await prisma.business.update({
      where: { id },
      data: { locationPages: data },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add location page" };
  }
}

export async function addServicePage({ id, data }: { id: string; data: any }) {
  try {
    await prisma.business.update({
      where: { id },
      data: { servicePages: data },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add service page" };
  }
}

export async function deleteBusiness(id: string) {
  try {
    await prisma.business.delete({
      where: {
        id,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete business:", error);
    return { success: false, error: "Failed to delete business" };
  }
}

export async function updateBusinessSchema(id: string, schema: string) {
  try {
    await prisma.business.update({
      where: { id },
      data: { themeScript: schema },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating business schema:", error);
    return {
      success: false,
      error: "Failed to update business schema",
    };
  }
}

export async function updateBusinessTheme(id: string, theme: string) {
  try {
    await prisma.business.update({
      where: { id },
      data: { theme: theme.toString() },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating business theme:", error);
    return {
      success: false,
      error: "Failed to update business theme",
    };
  }
}

export async function updateBusinessLogo(businessId: string, logoUrl: string) {
  try {
    await prisma.business.update({
      where: { id: businessId },
      data: { logo: logoUrl },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating business logo:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update business logo",
    };
  }
}

export async function createFaqs({
  id,
  data,
}: {
  id: string;
  data: {
    id: string;
    question: string;
    answer: string;
    slug: string;
  }[];
}) {
  try {
    const business = await prisma.business.update({
      where: { id },
      data: {
        faqs: data,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving FAQs:", error);
    return { success: false, error: "Failed to save FAQs" };
  }
}

export async function saveFaqSchema({
  id,
  schema,
}: {
  id: string;
  schema: string;
}) {
  try {
    const business = await prisma.business.update({
      where: { id },
      data: {
        faqSchema: schema,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving FAQ schema:", error);
    return { success: false, error: "Failed to save FAQ schema" };
  }
}
