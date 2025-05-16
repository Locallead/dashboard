"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addLocationPage } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  hero: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
  }),
  usp: z.object({
    title1: z.string().min(1, "Title is required"),
    title2: z.string().min(1, "Title is required"),
    title3: z.string().min(1, "Title is required"),
    description1: z.string().min(1, "Description is required"),
    description2: z.string().min(1, "Description is required"),
    description3: z.string().min(1, "Description is required"),
  }),
  leftPicture: z.object({
    title: z.string().min(1, "Title is required"),
    header: z.string().min(1, "Header is required"),
    subHeader: z.string().min(1, "Sub-header is required"),
    description: z.string().min(1, "Description is required"),
  }),
  service: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    header: z.string().min(1, "Header is required"),
  }),
  trust: z.object({
    title: z.string().min(1, "Title is required"),
    heading: z.string().min(1, "Heading is required"),
    quality1: z.string().min(1, "Quality is required"),
    quality2: z.string().min(1, "Quality is required"),
    quality3: z.string().min(1, "Quality is required"),
    quality4: z.string().min(1, "Quality is required"),
    quality5: z.string().min(1, "Quality is required"),
    quality6: z.string().min(1, "Quality is required"),
    description1: z.string().min(1, "Description is required"),
    description2: z.string().min(1, "Description is required"),
    description3: z.string().min(1, "Description is required"),
    description4: z.string().min(1, "Description is required"),
    description5: z.string().min(1, "Description is required"),
    description6: z.string().min(1, "Description is required"),
  }),
  map: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    heading: z.string().min(1, "Heading is required"),
  }),
  cta: z.object({
    title: z.string().min(1, "Title is required"),
    link: z.string().min(1, "Link is required"),
  }),
  meta: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
  }),
});

export type FormValues = z.infer<typeof formSchema>;

interface LocationPageFormProps {
  id: string;
  initialValues?: FormValues;
  businessName: string;
}

export default function LocationPageForm({
  id,
  initialValues,
  businessName,
}: LocationPageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      hero: { title: "", description: "" },
      usp: {
        title1: "",
        title2: "",
        title3: "",
        description1: "",
        description2: "",
        description3: "",
      },
      leftPicture: {
        title: "",
        header: "",
        subHeader: "",
        description: "",
      },
      service: {
        title: "",
        description: "",
        header: "",
      },
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
      map: {
        title: "",
        description: "",
        heading: "",
      },
      cta: {
        title: "",
        link: "",
      },
      meta: {
        title: "",
        description: "",
      },
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const result = await addLocationPage({ id, data });

      if (result.success) {
        toast.success("Success!", {
          description: "Service page has been updated successfully.",
        });
      } else {
        toast.error("Error", {
          description: result.error || "Failed to update service page.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const generateLocationPageContent = async () => {
    setIsGenerating(true);
    const response = await fetch("/api/location-page", {
      method: "POST",
      body: JSON.stringify({ business: businessName }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error("Error", {
        description: "Failed to generate location page content.",
      });
    } else {
      form.reset(data);
    }
    setIsGenerating(false);
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">Location Page Editor</h1>
        <Button onClick={generateLocationPageContent}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Location Page Content"
          )}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="grid grid-cols-8 mb-6">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="usp">USP</TabsTrigger>
              <TabsTrigger value="leftPicture">Left Picture</TabsTrigger>
              <TabsTrigger value="service">Service</TabsTrigger>
              <TabsTrigger value="trust">Trust</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="cta">CTA</TabsTrigger>
              <TabsTrigger value="meta">Meta</TabsTrigger>
            </TabsList>

            {/* Hero Section */}
            <TabsContent value="hero">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>
                    Configure the main hero section of your location page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="hero.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter hero title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hero.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter hero description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* USP Section */}
            <TabsContent value="usp">
              <Card>
                <CardHeader>
                  <CardTitle>Unique Selling Points</CardTitle>
                  <CardDescription>
                    Configure the USP section with three key points.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="usp.title1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title 1</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="usp.description1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description 1</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter description"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="usp.title2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title 2</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="usp.description2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description 2</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter description"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="usp.title3"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title 3</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="usp.description3"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description 3</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter description"
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Left Picture Section */}
            <TabsContent value="leftPicture">
              <Card>
                <CardHeader>
                  <CardTitle>Left Picture Section</CardTitle>
                  <CardDescription>
                    Configure the section with an image on the left.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="leftPicture.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leftPicture.header"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Header</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter header" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leftPicture.subHeader"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub-Header</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter sub-header" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leftPicture.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Service Section */}
            <TabsContent value="service">
              <Card>
                <CardHeader>
                  <CardTitle>Service Section</CardTitle>
                  <CardDescription>
                    Configure the main service details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="service.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="service.header"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Header</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter header" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="service.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trust Section */}
            <TabsContent value="trust">
              <Card>
                <CardHeader>
                  <CardTitle>Trust Section</CardTitle>
                  <CardDescription>
                    Configure the trust indicators section.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="trust.title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="trust.heading"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Heading</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter heading" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Trust Qualities 1-3</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="trust.quality1"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quality 1</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter quality"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="trust.description1"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description 1</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Enter description"
                                        className="min-h-[80px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="trust.quality2"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quality 2</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter quality"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="trust.description2"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description 2</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Enter description"
                                        className="min-h-[80px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="trust.quality3"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quality 3</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter quality"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="trust.description3"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description 3</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Enter description"
                                        className="min-h-[80px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger>Trust Qualities 4-6</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="trust.quality4"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quality 4</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter quality"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="trust.description4"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description 4</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Enter description"
                                        className="min-h-[80px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="trust.quality5"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quality 5</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter quality"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="trust.description5"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description 5</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Enter description"
                                        className="min-h-[80px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="trust.quality6"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quality 6</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter quality"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="trust.description6"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description 6</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Enter description"
                                        className="min-h-[80px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Map Section */}
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Map Section</CardTitle>
                  <CardDescription>
                    Configure the map section details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="map.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="map.heading"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heading</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter heading" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="map.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* CTA Section */}
            <TabsContent value="cta">
              <Card>
                <CardHeader>
                  <CardTitle>Call to Action</CardTitle>
                  <CardDescription>
                    Configure the call to action section.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cta.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cta.link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter link URL" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the URL where users will be directed when
                          clicking the CTA button.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Meta Section */}
            <TabsContent value="meta">
              <Card>
                <CardHeader>
                  <CardTitle>Meta Section</CardTitle>
                  <CardDescription>
                    Configure the meta section details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="meta.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || isGenerating}
              className="w-full md:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Location Page"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
