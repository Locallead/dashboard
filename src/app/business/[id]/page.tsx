import { getBusiness, getLocations } from "@/app/actions";
import BusinessEditForm from "@/app/components/business-form-update";
import CreateHomePage from "@/app/components/create-home-page";
import { LocationManager } from "@/app/components/location-menager";
import { ServiceManager } from "@/app/components/service-menager";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = await getBusiness(id);

  if (
    !business ||
    !business.id ||
    !business.name ||
    !business.address ||
    !business.phone ||
    !business.city ||
    !business.email ||
    !business.hours ||
    !business.mapLink ||
    !business.description
  ) {
    notFound();
  }

  const validBusiness = {
    id: business.id,
    name: business.name,
    address: business.address,
    phone: business.phone,
    city: business.city,
    email: business.email,
    state: business.state,
    hours: business.hours,
    mapLink: business.mapLink,
    description: business.description,
    facebook: business.facebook,
    html: business.html,
  };

  const services = Array.isArray(business.services)
    ? business.services.map((service: any) => ({
        id: service.id || String(Date.now()),
        name: service.name || "",
        description: service.description || "",
        slug: service.slug || "",
      }))
    : [];

  const locations = await getLocations({ id });

  return (
    <>
      <BusinessEditForm business={validBusiness} />
      <CreateHomePage id={id} />
      <ServiceManager
        id={id}
        initServices={services}
        businessName={validBusiness.name}
        cityName={validBusiness.city}
      />
      <LocationManager
        location={validBusiness.city + " " + validBusiness.state}
        businessId={id}
        initLocations={locations}
      />
    </>
  );
}
