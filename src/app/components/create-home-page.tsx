"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight, Loader2 } from "lucide-react";
import { createHomePage, getHomePage } from "../actions";
import { toast } from "sonner";
import { useDeepCompareEffect } from "react-use";

type FormValues = {
  hero: {
    title: string;
    description: string;
  };
  usp: {
    title1: string;
    title2: string;
    title3: string;
    description1: string;
    description2: string;
    description3: string;
  };
  leftPicture: {
    title: string;
    header: string;
    subHeader: string;
    description: string;
  };
  service: {
    title: string;
    description: string;
    header: string;
  };
  trust: {
    title: string;
    heading: string;
    quality1: string;
    quality2: string;
    quality3: string;
    quality4: string;
    quality5: string;
    quality6: string;
    description1: string;
    description2: string;
    description3: string;
    description4: string;
    description5: string;
    description6: string;
  };
  map: {
    title: string;
    description: string;
    heading: string;
  };
  cta: {
    title: string;
    link: string;
  };
  meta: {
    title: string;
    description: string;
  };
};

export default function CreateHomePage({
  id,
  businessName,
  address,
  state,
  city,
}: {
  id: string;
  businessName: string;
  address: string;
  state: string;
  city: string;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      hero: { title: "", description: "" },
      usp: {
        title1: "",
        title2: "",
        title3: "",
        description1: "",
        description2: "",
        description3: "",
      },
      leftPicture: { title: "", header: "", subHeader: "", description: "" },
      service: { title: "", description: "", header: "" },
      trust: {
        title: "",
        heading: "",
        quality1: "",
        quality2: "",
        quality3: "",
        quality4: "",
        quality5: "",
        quality6: "",
        description1: "",
        description2: "",
        description3: "",
        description4: "",
        description5: "",
        description6: "",
      },
      map: { title: "", description: "", heading: "" },
      cta: { title: "", link: "" },
      meta: { title: "", description: "" },
    },
  });

  useEffect(() => {
    const fetchHomePage = async () => {
      const homePage = await getHomePage({ id });
      console.log("homePage", homePage);
      if (homePage?.sections) {
        const sections = homePage.sections as FormValues;
        reset(sections);
      }
    };
    fetchHomePage();
  }, [id, reset]);

  const onSubmit = async (data: FormValues) => {
    console.log("Submitting sections:", JSON.stringify(data, null, 2));
    const response = await createHomePage({
      id,
      data,
    });

    if (response.success) {
      toast.success("Home page created successfully");
      reset(data);
    } else {
      toast.error("Failed to create home page");
    }
  };

  const generateHomePageContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/home-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business: businessName,
          address,
          state,
          city,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate home page content");
      }

      const data = await response.json();

      const sanitizedData = {
        hero: {
          title: data.hero?.title || "",
          description: data.hero?.description || "",
        },
        usp: {
          title1: data.usp?.title1 || "",
          title2: data.usp?.title2 || "",
          title3: data.usp?.title3 || "",
          description1: data.usp?.description1 || "",
          description2: data.usp?.description2 || "",
          description3: data.usp?.description3 || "",
        },
        leftPicture: {
          title: data.leftPicture?.title || "",
          header: data.leftPicture?.header || "",
          subHeader: data.leftPicture?.subHeader || "",
          description: data.leftPicture?.description || "",
        },
        service: {
          title: data.service?.title || "",
          description: data.service?.description || "",
          header: data.service?.header || "",
        },
        trust: {
          title: data.trust?.title || "",
          heading: data.trust?.heading || "",
          quality1: data.trust?.quality1 || "",
          quality2: data.trust?.quality2 || "",
          quality3: data.trust?.quality3 || "",
          quality4: data.trust?.quality4 || "",
          quality5: data.trust?.quality5 || "",
          quality6: data.trust?.quality6 || "",
          description1: data.trust?.description1 || "",
          description2: data.trust?.description2 || "",
          description3: data.trust?.description3 || "",
          description4: data.trust?.description4 || "",
          description5: data.trust?.description5 || "",
          description6: data.trust?.description6 || "",
        },
        map: {
          title: data.map?.title || "",
          description: data.map?.description || "",
          heading: data.map?.heading || "",
        },
        cta: {
          title: data.cta?.title || "",
          link: data.cta?.link || "",
        },
        meta: {
          title: data.meta?.title || "",
          description: data.meta?.description || "",
        },
      };

      reset(sanitizedData);
      toast.success("Home page content generated successfully");
    } catch (error) {
      console.error("Error generating home page content:", error);
      toast.error("Failed to generate home page content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create Home Page</h1>
        <Button onClick={generateHomePageContent} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Home Page Content"
          )}
        </Button>
      </div>
      <Card className="py-6">
        <CardHeader>
          <CardTitle className="text-2xl">Home Page Builder</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Accordion
            type="single"
            collapsible
            className="w-full flex flex-col gap-4 h-fit pb-8 py-4"
            defaultValue="hero"
          >
            <AccordionItem value="hero" className="border rounded-md px-4 mb-4">
              <AccordionTrigger className="py-4 text-lg font-medium">
                Hero Section
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Hero Title (H1)</Label>
                    <Controller
                      name="hero.title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="heroTitle"
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Enter hero title"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroDescription">
                      Hero Description (Paragraph)
                    </Label>
                    <Controller
                      name="hero.description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          id="heroDescription"
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Enter hero description"
                          className="min-h-[80px]"
                        />
                      )}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="usp" className="border rounded-md px-4 mb-4">
              <AccordionTrigger className="py-4 text-lg font-medium">
                USP Section
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    {
                      id: "uspTitle1",
                      name: "usp.title1",
                      placeholder: "Fast Repair Title",
                    },
                    {
                      id: "uspDescription1",
                      name: "usp.description1",
                      placeholder: "Fast Repair Description",
                    },
                    {
                      id: "uspTitle2",
                      name: "usp.title2",
                      placeholder: "Affordable Install Title",
                    },
                    {
                      id: "uspDescription2",
                      name: "usp.description2",
                      placeholder: "Affordable Install Description",
                    },
                    {
                      id: "uspTitle3",
                      name: "usp.title3",
                      placeholder: "Reliable Maintenance Title",
                    },
                    {
                      id: "uspDescription3",
                      name: "usp.description3",
                      placeholder: "Reliable Maintenance Description",
                    },
                  ].map(({ id, name, placeholder }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>
                        {id.includes("Title")
                          ? `USP Title ${id.slice(-1)} (H3)`
                          : `USP Description ${id.slice(-1)} (Paragraph)`}
                      </Label>
                      <Controller
                        name={name as keyof FormValues}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={id}
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder={placeholder}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="leftPicture"
              className="border rounded-md px-4 mb-4"
            >
              <AccordionTrigger className="py-4 text-lg font-medium">
                Left Picture Section
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    {
                      id: "leftPictureTitle",
                      label: "Title (Paragraph)",
                      name: "leftPicture.title",
                      placeholder: "Title (Paragraph)",
                    },
                    {
                      id: "leftPictureHeader",
                      label: "Header (H2)",
                      name: "leftPicture.header",
                      placeholder: "Header (H2)",
                    },
                    {
                      id: "leftPictureSubHeader",
                      label: "Sub Header (H3)",
                      name: "leftPicture.subHeader",
                      placeholder: "Sub Header (H3)",
                    },
                  ].map(({ id, name, placeholder, label }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>{label}</Label>
                      <Controller
                        name={name as keyof FormValues}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={id}
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder={placeholder}
                          />
                        )}
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Label htmlFor="leftPictureDescription">
                      Description (Paragraph)
                    </Label>
                    <Controller
                      name="leftPicture.description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          id="leftPictureDescription"
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Description"
                          className="min-h-[80px]"
                        />
                      )}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="service"
              className="border rounded-md px-4 mb-4"
            >
              <AccordionTrigger className="py-4 text-lg font-medium">
                Service Section
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    {
                      id: "serviceTitle",
                      name: "service.title",
                      placeholder: "Service Title",
                      label: "Service Title (Span)",
                    },
                    {
                      id: "serviceHeader",
                      name: "service.header",
                      placeholder: "Service Header",
                      label: "Service Header (H2)",
                    },
                  ].map(({ id, name, placeholder, label }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>{label}</Label>
                      <Controller
                        name={name as keyof FormValues}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={id}
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder={placeholder}
                          />
                        )}
                      />
                    </div>
                  ))}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="serviceDescription">
                      Service Description (Paragraph)
                    </Label>
                    <Controller
                      name="service.description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          id="serviceDescription"
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Service Description"
                          className="min-h-[80px]"
                        />
                      )}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="trust"
              className="border rounded-md px-4 mb-4"
            >
              <AccordionTrigger className="py-4 text-lg font-medium">
                Trust Section
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    {
                      id: "trustTitle",
                      name: "trust.title",
                      placeholder: "Trust Title (Paragraph)",
                    },
                    {
                      id: "trustHeading",
                      name: "trust.heading",
                      placeholder: "Trust Heading (H2)",
                    },
                  ].map(({ id, name, placeholder }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>
                        {id.includes("Title")
                          ? `Trust Title (Paragraph)`
                          : `Trust Heading (H2)`}
                      </Label>
                      <Controller
                        name={name as keyof FormValues}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={id}
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder={placeholder}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-4">Trust Qualities</h4>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <div
                        key={`quality-${num}`}
                        className="space-y-4 border p-4 rounded-md"
                      >
                        <div className="space-y-2">
                          <Label htmlFor={`quality${num}`}>
                            Quality (H3) {num}
                          </Label>
                          <Controller
                            name={`trust.quality${num}` as keyof FormValues}
                            control={control}
                            render={({ field }) => (
                              <Input
                                id={`quality${num}`}
                                value={
                                  typeof field.value === "string"
                                    ? field.value
                                    : ""
                                }
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                placeholder={`Quality ${num}`}
                              />
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`description${num}`}>
                            Description (Paragraph) {num}
                          </Label>
                          <Controller
                            name={`trust.description${num}` as keyof FormValues}
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                id={`description${num}`}
                                value={
                                  typeof field.value === "string"
                                    ? field.value
                                    : ""
                                }
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                placeholder={`Description ${num}`}
                                className="min-h-[80px]"
                              />
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="map" className="border rounded-md px-4 mb-4">
              <AccordionTrigger className="py-4 text-lg font-medium">
                Map Section
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    {
                      id: "mapTitle",
                      name: "map.title",
                      placeholder: "Map Title",
                    },
                    {
                      id: "mapHeading",
                      name: "map.heading",
                      placeholder: "Map Heading",
                    },
                  ].map(({ id, name, placeholder }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>
                        Map{" "}
                        {id
                          .replace("map", "")
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                      </Label>
                      <Controller
                        name={name as keyof FormValues}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={id}
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder={placeholder}
                          />
                        )}
                      />
                    </div>
                  ))}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="mapDescription">Map Description</Label>
                    <Controller
                      name="map.description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          id="mapDescription"
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Map Description"
                          className="min-h-[80px]"
                        />
                      )}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cta" className="border rounded-md px-4">
              <AccordionTrigger className="py-4 text-lg font-medium">
                CTA Section
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    {
                      id: "ctaTitle",
                      name: "cta.title",
                      placeholder: "Call to Action Title",
                    },
                    {
                      id: "ctaLink",
                      name: "cta.link",
                      placeholder: "Call to Action Link",
                    },
                  ].map(({ id, name, placeholder }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>
                        CTA{" "}
                        {id
                          .replace("cta", "")
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                      </Label>
                      <Controller
                        name={name as keyof FormValues}
                        control={control}
                        render={({ field }) => (
                          <Input
                            id={id}
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder={placeholder}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="meta" className="border rounded-md px-4 mb-4">
              <AccordionTrigger className="py-4 text-lg font-medium">
                Meta Tags
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Controller
                      name="meta.title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="metaTitle"
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Meta Title"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Controller
                      name="meta.description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          id="metaDescription"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Meta Description"
                          className="min-h-[80px]"
                        />
                      )}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit(onSubmit)}
              size="lg"
              className="px-8 font-medium"
              disabled={!isDirty}
            >
              Create Home Page
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
