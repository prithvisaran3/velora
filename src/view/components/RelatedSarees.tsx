import React from "react";
import { Saree } from "@/model/domain/types";
import { SareeCard } from "./SareeCard";
import { SectionHead } from "../primitives/SectionHead";

interface RelatedSareesProps {
  sarees: Saree[];
}

export const RelatedSarees: React.FC<RelatedSareesProps> = ({ sarees }) => {
  if (!sarees || sarees.length === 0) return null;

  return (
    <section className="my-16">
      <SectionHead align="left" subtitle="Handpicked single-unit drapes in similar hues and occasions.">
        You May Also Like
      </SectionHead>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
        {sarees.map((saree) => (
          <SareeCard key={saree.id} saree={saree} />
        ))}
      </div>
    </section>
  );
};
