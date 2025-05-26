import { getBusiness, getLocations } from "@/app/actions";
import BusinessEditForm from "@/app/components/business-form-update";
import CreateHomePage from "@/app/components/create-home-page";
import { FaqGenerator } from "@/app/components/faq-generator";
import { LocationManager } from "@/app/components/location-menager";
import LocationPageForm, {
  FormValues,
} from "@/app/components/location-page-form";
import SchemaForm from "@/app/components/schema-form";
import { ServiceManager } from "@/app/components/service-menager";
import ServicePageForm from "@/app/components/service-page-form";
import ThemePicker from "@/app/components/theme-picker";
import { UploadLogo } from "@/app/components/upload-logo";
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

  const faqs = Array.isArray(business.faqs)
    ? business.faqs.map((faq: any) => ({
        id: faq.id || String(Date.now()),
        question: faq.question || "",
        answer: faq.answer || "",
        slug: faq.slug || "",
      }))
    : [];

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
    locationPages: business.locationPages,
    servicePages: business.servicePages,
    faqs,
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
    <div className="space-y-20">
      <div className="flex gap-2">
        <ThemePicker id={id} initTheme={business.theme} />
        <UploadLogo businessId={id} currentLogo={business.logo || ""} />
      </div>

      <BusinessEditForm business={validBusiness} />
      <CreateHomePage
        id={id}
        businessName={validBusiness.name}
        address={validBusiness.address}
        state={validBusiness.state}
        city={validBusiness.city}
      />
      <SchemaForm id={id} />
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
      <LocationPageForm
        businessName={validBusiness.name}
        id={id}
        initialValues={
          (validBusiness.locationPages as FormValues) || {
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
          }
        }
      />
      <ServicePageForm
        businessName={validBusiness.name}
        id={id}
        address={validBusiness.address}
        state={validBusiness.state}
        city={validBusiness.city}
        initialValues={(validBusiness.servicePages as FormValues) || {}}
      />
      <FaqGenerator
        id={id}
        initFaqs={validBusiness.faqs}
        businessName={validBusiness.name}
        cityName={validBusiness.city}
      />
    </div>
  );
}
