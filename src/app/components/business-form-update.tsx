"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { updateBusiness } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDirty } from "zod";

const businessFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  city: z.string().min(2, { message: "City is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  state: z.string().min(2, { message: "State is required" }),
  hours: z.string().min(2, { message: "Business hours are required" }),
  mapLink: z.string().url({ message: "Valid map URL is required" }),
  facebook: z
    .string()
    .url({ message: "Valid Facebook URL is required" })
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  html: z.string().optional(),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

interface BusinessEditFormProps {
  business: BusinessFormValues;
}

export default function BusinessEditForm({ business }: BusinessEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      id: "",
      name: "",
      address: "",
      phone: "",
      city: "",
      email: "",
      state: "",
      hours: "",
      mapLink: "",
      facebook: "",
      description: "",
      html: "",
    },
  });

  const isDirty = form.formState.isDirty;

  useEffect(() => {
    if (business) {
      form.reset({
        id: business.id,
        name: business.name || "",
        address: business.address || "",
        phone: business.phone || "",
        city: business.city || "",
        email: business.email || "",
        hours: business.hours || "",
        state: business.state || "",
        mapLink: business.mapLink || "",
        facebook: business.facebook || "",
        description: business.description || "",
        html: business.html || "",
      });
    }
  }, [business, form]);

  async function onSubmit(data: BusinessFormValues) {
    setIsSubmitting(true);
    console.log("Submitting updated data:", data);

    try {
      const result = await updateBusiness(data);
      console.log("Server response:", result);

      if (result.success) {
        toast.success("Business Updated", {
          description: "The business has been successfully updated.",
        });
        router.refresh();
      } else {
        toast.error("Error", {
          description:
            result.error || "Failed to update business. Please try again.",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Edit Business{" "}
          <span className="text-sm text-muted-foreground">
            ({business.name})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon-Fri: 9AM-5PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mapLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://maps.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://facebook.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter business description"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="html"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HTML Content (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter custom HTML content"
                      className="min-h-[150px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add any custom HTML content for the business page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
