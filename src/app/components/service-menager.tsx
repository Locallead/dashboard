"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Edit, Loader2Icon, BotIcon } from "lucide-react";
import { toast } from "sonner";
import { createServices } from "../actions";

interface Service {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export function ServiceManager({
  id,
  initServices,
  businessName,
  cityName,
}: {
  id: string;
  initServices?: Service[];
  businessName: string;
  cityName: string;
}) {
  const [services, setServices] = useState<Service[]>(initServices || []);
  const [showForm, setShowForm] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Function to check if services have changed
  const checkForChanges = (currentServices: Service[]) => {
    if (currentServices.length !== initServices?.length) {
      return true;
    }

    return currentServices.some((currentService, index) => {
      const initialService = initServices?.[index];
      return (
        currentService.name !== initialService.name ||
        currentService.description !== initialService.description ||
        currentService.slug !== initialService.slug
      );
    });
  };

  // Update hasChanges whenever services change
  useEffect(() => {
    setHasChanges(checkForChanges(services));
  }, [services]);

  const handleAddService = () => {
    if (!serviceName.trim()) return;

    const slug = serviceName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (editingId) {
      setServices(
        services.map((service) =>
          service.id === editingId
            ? {
                ...service,
                name: serviceName,
                description: serviceDescription,
                slug,
              }
            : service
        )
      );
      setEditingId(null);
    } else {
      // Add new service
      const newService: Service = {
        id: Date.now().toString(),
        name: serviceName,
        description: serviceDescription,
        slug,
      };
      setServices([...services, newService]);
    }

    setServiceName("");
    setServiceDescription("");
    setShowForm(false);
  };

  const handleEditService = (service: Service) => {
    setServiceName(service.name);
    setServiceDescription(service.description);
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    const response = await createServices({ id, data: services });
    if (response.success) {
      setIsLoading(false);
      toast.success("Services saved successfully");
    } else {
      setIsLoading(false);
      toast.error("Failed to save services");
    }
  };

  const generateServicesWithAI = async () => {
    debugger;
    setIsLoading(true);
    const response = await fetch("/api/services", {
      method: "POST",
      body: JSON.stringify({
        prompt: "Generate services for a business",
        businessName,
        cityName,
      }),
    });

    if (!response.ok) {
      setIsLoading(false);
      toast.error("Failed to generate services");
      return;
    }

    const data = await response.json();

    setServices(data.services);
    toast.success("Services generated successfully");
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 mt-4">
      <h2 className="text-2xl font-bold">Services</h2>
      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setServiceName("");
              setServiceDescription("");
              setEditingId(null);
            }
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          {showForm ? "Cancel" : "Add Service"}
        </Button>
        <Button variant="outline" size="sm" onClick={generateServicesWithAI}>
          {isLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <>
              <BotIcon className="h-4 w-4" />
              Generate Services
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Service" : "Add New Service"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Service Name</Label>
              <Input
                id="service-name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Enter service name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="Enter service description"
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddService}>
              {editingId ? "Update Service" : "Add Service"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {services.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Services</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Slug: {service.slug}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditService(service)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      <div className="flex w-full justify-end">
        <Button
          className="justify-end"
          onClick={handleSaveChanges}
          disabled={!hasChanges || isLoading}
        >
          {isLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
