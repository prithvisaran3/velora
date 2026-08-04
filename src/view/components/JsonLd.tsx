import React from "react";
import { Saree } from "@/model/domain/types";

interface JsonLdProps {
  saree?: Saree;
  url?: string;
}

export const JsonLd: React.FC<JsonLdProps> = ({ saree, url = "https://velora-storefront.vercel.app" }) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Velora",
    "url": url,
    "logo": `${url}/brand/png/icon-flat-512.png`,
    "foundingDate": "1977",
    "founder": { "@type": "Person", "name": "Priya Mahadevan" },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Erode",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://instagram.com/velora",
      "https://wa.me/919876543210"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Velora",
    "url": url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${url}/colour/maroon?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  let productSchema = null;

  if (saree) {
    productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": saree.title.en,
      "image": saree.images.map((img) => img.id),
      "description": `${saree.fabric} saree in ${saree.colour.label.en}. Handpicked in Erode by Priya Mahadevan.`,
      "sku": saree.id,
      "brand": {
        "@type": "Brand",
        "name": "Velora"
      },
      "offers": {
        "@type": "Offer",
        "url": `${url}/saree/${saree.slug}`,
        "priceCurrency": "INR",
        "price": saree.priceInPaise / 100,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": saree.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Velora"
        }
      }
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
    </>
  );
};
