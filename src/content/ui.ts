/**
 * Velora UI copy — every merchandising string lives here, never in JSX.
 * Components receive text as props from this module.
 */

export const UI = {
  trust: {
    returns: "7-day hassle-free returns",
    cod: "Cash on delivery available",
    gst: "GST invoice on every order",
    shipping: "Free insured delivery across India",
  },

  emptyStates: {
    maroon: "Nothing in maroon this month — the next edit lands in early September.",
    peacock: "Nothing in peacock this month — check back soon.",
    indigo: "Nothing in indigo this month — check back soon.",
    leaf: "Nothing in leaf this month — check back soon.",
    plum: "Nothing in plum this month — check back soon.",
    kora: "Nothing in kora this month — check back soon.",
    generic: (colour: string) => `Nothing in ${colour} this month — check back soon.`,
  },

  nav: {
    shopByColour: "Shop by Colour",
    occasion: "Occasion",
    offers: "Offers",
    newIn: "New In",
    ourStory: "Our Story",
  },

  hero: {
    headline: "Handpicked, never\nwarehoused.",
    subline: "Forty-eight modern sarees chosen this month by our curator in Erode. Every one seen and felt before it is listed.",
    ctaPrimary: "SEE THIS MONTH\u2019S EDIT",
    ctaSecondary: "SHOP BY COLOUR",
  },

  legacyStrip: {
    heading: "Chosen in Erode,\nsince 1977.",
    years: "49",
    yearsLabel: "YEARS IN SILK",
    generations: "3",
    generationsLabel: "GENERATIONS",
    sarees: "48",
    sareesLabel: "SAREES A MONTH",
  },

  curatorQuote: {
    eyebrow: "FROM THE CURATOR",
    quote: "\u201CMy father could tell you which loom a saree came off with his eyes shut. He sent me to the weavers alone at nineteen. I still hold every one to the light before it goes on this website.\u201D",
    tamilQuote: "\u0B92\u0BB5\u0BCD\u0BB5\u0BCA\u0BB0\u0BC1 \u0BAA\u0BC1\u0B9F\u0BB5\u0BC8\u0BAF\u0BC1\u0BAE\u0BCD \u0B8E\u0BA9\u0BCD \u0B95\u0BC8\u0BAF\u0BBE\u0BB2\u0BCD \u0BA4\u0BC7\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1.",
    attribution: "\u2014 PRIYA MAHADEVAN \u00B7 FOUNDER & CURATOR, ERODE",
  },

  instagram: {
    heading: "Worn by you",
    subline: "@VELORA \u00B7 REAL CUSTOMER PHOTOS",
  },

  occasions: {
    heading: "Shop by occasion",
    subline: "MOMENTS, NOT CATEGORIES",
  },

  colours: {
    heading: "Shop by colour",
    description: "How sarees are actually chosen. Pick a colour and browse the full collection in that hue \u2014 from deep maroon bridal silks to everyday kora cottons.",
  },

  monthlyEdit: {
    heading: "This month\u2019s edit",
    subline: "48 SAREES \u00B7 JULY EDIT",
  },

  pdp: {
    handpicked: "HANDPICKED \u00B7 JULY EDIT",
    inclGst: "INCL. GST \u00B7 FREE SHIPPING",
    addToBag: "ADD TO BAG",
    askWhatsapp: "ASK ON WHATSAPP",
    onlyOne: "ONLY ONE IN STOCK",
    relatedHeading: "She also considered",
    authenticityEyebrow: "AUTHENTICITY NOTE",
  },

  checkout: {
    gstNote: "Inclusive of GST. Invoice emailed on dispatch.",
    shippingLabel: "Free",
    placeOrder: "PLACE ORDER",
  },

  tracking: {
    askWhatsapp: "ASK ON WHATSAPP",
  },

  story: {
    eyebrow: "1977 \u2014 TODAY \u00B7 ERODE",
    heading: "My father taught me silk before arithmetic.",
    tamilHeading: "\u0B8E\u0BA9\u0BCD \u0BA4\u0BA8\u0BCD\u0BA4\u0BC8 \u0B8E\u0BA9\u0B95\u0BCD\u0B95\u0BC1 \u0B95\u0BB1\u0BCD\u0BAA\u0BBF\u0BA4\u0BCD\u0BA4 \u0BAA\u0B9F\u0BCD\u0B9F\u0BC1",
    panels: [
      {
        year: "1977",
        title: "A thousand square feet of silk.",
        body: "My father, Mahadevan, opened his first shop with his brother beside him and very little else. He was no designer and never claimed to be one \u2014 he could tell you from the cloth between two fingers which loom it came off, and whether the zari would hold its colour after ten years folded in a steel trunk.",
      },
      {
        year: "1996",
        title: "He sends me to the weavers alone.",
        body: "I was nineteen. He never asked what I had bought \u2014 he would unfold it, hold it to the door light, and nod, or not nod. Thirty years later I am still buying the way he taught me.",
      },
      {
        year: "2026",
        title: "Velora.",
        body: "The same hands, now reaching a woman in Bengaluru who will never stand at my counter. Every saree here is one I have held to the light myself, and there is only ever one of each.",
      },
    ],
    signature: "Priya Mahadevan",
    signatureTitle: "FOUNDER & CURATOR \u00B7 ERODE, TAMIL NADU",
  },
} as const;
