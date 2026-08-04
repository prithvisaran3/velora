import React from "react";
import { TamilText } from "../primitives/TamilText";

export const AuthenticityPanel: React.FC = () => {
  return (
    <div className="bg-[#F6EAD6] p-6 md:p-8 flex flex-col gap-3 my-6">
      <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#241F1C]/55">
        AUTHENTICITY GUARANTEE
      </span>
      <h3 className="font-display text-[20px] md:text-[24px] text-ink font-normal">
        Chosen in Erode by Priya Mahadevan
      </h3>
      <p className="font-sans text-[13px] md:text-[14px] text-[#241F1C]/80 leading-relaxed">
        Every saree in our collection is single-unit woven and handpicked directly from loom clusters in Tamil Nadu. Verified pure silk, no synthetic blends.
      </p>
      <TamilText className="text-[13px] text-[#241F1C]/70">
        ஒவ்வொரு புடவையும் என் கையால் தேர்ந்தெடுக்கப்பட்டது.
      </TamilText>
    </div>
  );
};
