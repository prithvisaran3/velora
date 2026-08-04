import { ColourKey, OccasionKey } from "../domain/types";

export interface ConfigFixture {
  storeName: string;
  endorsement: string;
  city: string;
  sinceYear: number;
  tagline: { en: string; ta: string };
  trust: {
    authenticity: string;
    returnPolicy: string;
    shipping: string;
    legacy: string;
  };
  deliveryWindows: Record<string, string>;
  codPincodePrefixes: string[];
  colours: Record<ColourKey, { hex: string; label: { en: string; ta: string } }>;
  occasions: Record<OccasionKey, { title: { en: string; ta: string }; description: { en: string; ta: string } }>;
}

export const configFixture: ConfigFixture = {
  storeName: "Velora",
  endorsement: "by Priya Mahadevan",
  city: "Erode, Tamil Nadu",
  sinceYear: 1977,
  tagline: {
    en: "Handpicked pure silk sarees from Erode",
    ta: "ஈரோட்டிலிருந்து தேர்ந்தெடுக்கப்பட்ட தூய பட்டுப் புடவைகள்",
  },
  trust: {
    authenticity: "Handpicked pure silk, chosen in Erode by Priya Mahadevan.",
    returnPolicy: "Easy 7-day hassle-free returns on all unstitched sarees.",
    shipping: "Free insured delivery across all pincodes in India.",
    legacy: "Silk chosen in Erode by hand since 1977.",
  },
  deliveryWindows: {
    tamilNadu: "2–3 days",
    southIndia: "3–4 days",
    restOfIndia: "4–6 days",
  },
  codPincodePrefixes: ["60", "61", "62", "63", "64", "56", "57", "50", "40", "11"],
  colours: {
    maroon: { hex: "#8C1F3D", label: { en: "Deep Maroon", ta: "ஆழ்ந்த அரக்கு" } },
    peacock: { hex: "#12514E", label: { en: "Peacock Blue", ta: "மயில் நீலம்" } },
    indigo: { hex: "#2E4A7D", label: { en: "Royal Indigo", ta: "அரச நீலம்" } },
    leaf: { hex: "#4E7031", label: { en: "Leaf Green", ta: "இலை பச்சை" } },
    plum: { hex: "#6B3FA0", label: { en: "Plum Purple", ta: "நாவல் ஊதா" } },
    kora: { hex: "#F3EADC", label: { en: "Kora Silk Cream", ta: "கோரா பட்டு" } },
    saffron: { hex: "#E8621B", label: { en: "Heritage Saffron", ta: "பாரம்பரிய காவி" } },
    marigold: { hex: "#F5A623", label: { en: "Marigold Yellow", ta: "சம்பங்கி மஞ்சள்" } },
  },
  occasions: {
    muhurtham: {
      title: { en: "Muhurtham", ta: "முகூர்த்தம்" },
      description: { en: "Grand weaves crafted for sacred wedding ceremonies and bridal elegance.", ta: "திருமண முகூர்த்தத்திற்கான கம்பீரமான பட்டு நெசவுகள்." },
    },
    reception: {
      title: { en: "Reception", ta: "வரவேற்பு" },
      description: { en: "Luminous drapes with rich zari highlights for evening celebrations.", ta: "மாலை நேர நிகழ்வுகளுக்கான பிரகாசமான ஜரிகை புடவைகள்." },
    },
    temple: {
      title: { en: "Temple Visit", ta: "கோவில் வழிபாடு" },
      description: { en: "Traditional korvai borders and quiet heritage charm for sacred days.", ta: "பாரம்பரிய கோர்வை பார்டர் அமைந்த புனிதமான புடவைகள்." },
    },
    festival: {
      title: { en: "Festivals", ta: "பண்டிகைகள்" },
      description: { en: "Vibrant festive hues woven with gold zari for Diwali, Ponagal & festive gatherings.", ta: "பண்டிகை கால கொண்டாட்டங்களுக்கான வண்ணமயமான புடவைகள்." },
    },
    office: {
      title: { en: "Executive & Formals", ta: "அலுவலகம்" },
      description: { en: "Subtle, structured silk drapes that articulate poise and authority.", ta: "அலுவலக நிகழ்வுகளுக்கான நேர்த்தியான பட்டு புடவைகள்." },
    },
    everyday: {
      title: { en: "Everyday Luxury", ta: "தினம் ஒரு அழகு" },
      description: { en: "Lightweight pure silk sarees for effortless elegance every single day.", ta: "தினசரி பயன்பாட்டிற்கான இலகுரக தூய பட்டு புடவைகள்." },
    },
  },
};
