/**
 * Velora UI copy — every merchandising string lives here, never in JSX.
 *
 * Count-agnostic by design. There is no "forty-eight", no "twelve pieces", no
 * edit counter and no month name anywhere in this file: nothing in the copy
 * may break when she adds stock. "All sarees", never "Twelve sarees".
 */

export const UI = {
  trust: {
    returns: "7-day hassle-free returns",
    cod: "Cash on delivery available",
    gst: "GST invoice on every order",
    shipping: "Free insured delivery across India",
    authenticity: "Handpicked pure silk, chosen in Erode by Priya Mahadevan",
  },

  emptyStates: {
    generic: (colour: string) =>
      `Nothing in ${colour} right now. She is in Erode most weeks — check back soon.`,
    occasion: (occasion: string) =>
      `Nothing for ${occasion} right now. Check back soon, or ask her on WhatsApp.`,
  },

  nav: {
    shop: "Shop",
    shopByColour: "By Colour",
    occasion: "Occasion",
    offers: "Offers",
    atelier: "Atelier",
    ourStory: "Our Story",
    bag: "Bag",
  },

  hero: {
    headlineTop: "Every saree here",
    headlineBottom: "was held first.",
    subline:
      "Priya chooses each one by hand in Erode, the way her father taught her. Nothing is listed she has not seen in daylight.",
    ctaPrimary: "SHOP ALL SAREES",
    ctaSecondary: "BROWSE BY COLOUR",
    scroll: "SCROLL",
  },

  shop: {
    eyebrow: "CHOSEN IN ERODE",
    heading: "All sarees",
    loadMore: "LOAD MORE",
    filterAll: "ALL",
    filterUnder: (price: string) => `UNDER ${price}`,
    empty: "Nothing here yet — the next pieces are being chosen in Erode.",
  },

  colours: {
    eyebrow: "HOW WOMEN ACTUALLY SHOP",
    heading: "Pick your colour",
    description:
      "How sarees are actually chosen. Pick a colour and browse everything in that hue — from deep maroon bridal silks to everyday kora cottons.",
  },

  occasions: {
    heading: "Shop by occasion",
    subline: "MOMENTS, NOT CATEGORIES",
  },

  curatorQuote: {
    eyebrow: "FROM THE CURATOR",
    quote:
      "“My father could tell you which loom a saree came off with his eyes shut. He sent me to the weavers alone at nineteen. I still hold every one to the light before it goes on this website.”",
    tamilQuote:
      "ஒவ்வொரு புடவையும் என் கையால் தேர்ந்தெடுக்கப்பட்டது.",
    attribution: "— PRIYA MAHADEVAN · FOUNDER & CURATOR, ERODE",
  },

  legacy: {
    eyebrow: "ERODE, TAMIL NADU",
    heading: "Chosen in Erode,\nsince 1977.",
    body: "Three generations behind one counter. The same hands, now reaching a woman who will never stand at it.",
    readStory: "READ HER STORY",
  },

  instagram: {
    heading: "Worn by you",
    subline: "@VELORA · REAL CUSTOMER PHOTOS",
  },

  pdp: {
    handpicked: "HANDPICKED IN ERODE",
    inclGst: "INCL. GST · FREE SHIPPING",
    addToBag: "ADD TO BAG",
    inBag: "IN YOUR BAG",
    soldOut: "SOLD OUT",
    askWhatsapp: "ASK ON WHATSAPP",
    onlyOne: "ONLY ONE IN STOCK",
    relatedHeading: "She also considered",
    authenticityEyebrow: "AUTHENTICITY NOTE",
  },

  bag: {
    heading: "Your bag",
    empty: "Your bag is empty.",
    emptyCta: "SHOP ALL SAREES",
    checkout: "CHECKOUT",
  },

  checkout: {
    heading: "Checkout",
    steps: ["BAG", "ADDRESS", "PAYMENT", "DONE"],
    gstNote: "Inclusive of GST. Invoice emailed on dispatch.",
    shippingLabel: "Free",
    placeOrder: "PLACE ORDER",
  },

  tracking: {
    askWhatsapp: "ASK ON WHATSAPP",
    verifyEyebrow: "SECURITY VERIFICATION",
    verifyBody:
      "To protect customer privacy, please enter the last 4 digits of the mobile number registered with this order.",
    verifyCta: "VERIFY & VIEW TRACKING",
  },

  loading: {
    collection: "Finding her sarees",
    saree: "Unfolding",
    order: "Finding your order",
  },

  story: {
    eyebrow: "1977 — TODAY · ERODE",
    heading: "My father taught me silk before arithmetic.",
    tamilHeading:
      "என் தந்தை எனக்கு கற்பித்த பட்டு",
    panels: [
      {
        year: "1977",
        title: "A thousand square feet of silk.",
        body: "My father, Mahadevan, opened his first shop with his brother beside him and very little else. He was no designer and never claimed to be one — he could tell you from the cloth between two fingers which loom it came off, and whether the zari would hold its colour after ten years folded in a steel trunk.",
      },
      {
        year: "1996",
        title: "He sends me to the weavers alone.",
        body: "I was nineteen. He never asked what I had bought — he would unfold it, hold it to the door light, and nod, or not nod. Thirty years later I am still buying the way he taught me.",
      },
      {
        year: "2026",
        title: "Velora.",
        body: "The same hands, now reaching a woman in Bengaluru who will never stand at my counter. Every saree here is one I have held to the light myself, and there is only ever one of each.",
      },
    ],
    signature: "Priya Mahadevan",
    signatureTitle: "FOUNDER & CURATOR · ERODE, TAMIL NADU",
  },
} as const;
