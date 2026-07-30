// Smart Waste Management System - Mock Data & Constants

export const AI_SAMPLE_PRESETS = [
  {
    id: "pet-bottle",
    name: "PET Plastic Water Bottle",
    category: "Recyclable Plastics",
    binType: "Blue Bin (Plastics & Packaging)",
    binColor: "#3b82f6",
    confidence: 98.6,
    weightKg: 0.045,
    co2SavedKg: 0.12,
    recyclabilityRate: "95%",
    degradationYears: 450,
    imageUrl: "https://images.unsplash.com/photo-1562077772-3bd90403f7f0?w=600&auto=format&fit=crop&q=80",
    tags: ["Polyethylene Terephthalate", "RIC #1", "Clean", "Crushed"],
    instructions: [
      "Empty remaining liquids thoroughly.",
      "Remove cap and separate ring if required by local guidelines.",
      "Flatten container to save bin storage space by 40%."
    ],
    composition: [
      { name: "PET Plastic", percent: 92 },
      { name: "HDPE Cap", percent: 5 },
      { name: "Paper Label", percent: 3 }
    ]
  },
  {
    id: "cardboard-box",
    name: "Shipping Cardboard Box",
    category: "Paper & Cardboard",
    binType: "Yellow/Blue Bin (Paper)",
    binColor: "#eab308",
    confidence: 96.2,
    weightKg: 0.32,
    co2SavedKg: 0.78,
    recyclabilityRate: "99%",
    degradationYears: 2,
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    tags: ["Corrugated Cardboard", "Dry Material", "Flattenable"],
    instructions: [
      "Remove plastic adhesive tape and mailing stickers.",
      "Ensure cardboard is completely dry and ungreased.",
      "Break down flat before placing into paper recycling."
    ],
    composition: [
      { name: "Unbleached Cellulose", percent: 94 },
      { name: "Organic Starch Glue", percent: 6 }
    ]
  },
  {
    id: "aluminum-can",
    name: "Beverage Aluminum Can",
    category: "Metals",
    binType: "Blue Bin (Metals & Cans)",
    binColor: "#06b6d4",
    confidence: 99.1,
    weightKg: 0.015,
    co2SavedKg: 0.25,
    recyclabilityRate: "100%",
    degradationYears: 200,
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
    tags: ["Aluminum Alloy", "Infinite Recyclable", "Non-Ferrous"],
    instructions: [
      "Rinse out sweet residue to keep pests away.",
      "Do not crush if using reverse vending machines.",
      "100% infinitely recyclable without quality loss!"
    ],
    composition: [
      { name: "Aluminum", percent: 97 },
      { name: "Internal Polymer Coating", percent: 3 }
    ]
  },
  {
    id: "lithium-battery",
    name: "Li-Ion Rechargeable Battery",
    category: "Hazardous / E-Waste",
    binType: "Red/Special E-Waste Drop-off",
    binColor: "#ef4444",
    confidence: 94.8,
    weightKg: 0.08,
    co2SavedKg: 1.45,
    recyclabilityRate: "85%",
    degradationYears: 1000,
    imageUrl: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80",
    tags: ["Li-Ion", "Hazardous", "Fire Risk", "E-Waste"],
    instructions: [
      "DO NOT put in regular municipal trash bins (fire hazard).",
      "Tape over metal terminals with electrical tape.",
      "Drop off at designated E-Waste collection points."
    ],
    composition: [
      { name: "Cobalt / Lithium / Nickel", percent: 45 },
      { name: "Graphite / Carbon", percent: 25 },
      { name: "Protective Steel Shell", percent: 30 }
    ]
  },
  {
    id: "food-waste",
    name: "Organic Kitchen Food Scraps",
    category: "Organic Waste",
    binType: "Green Compost Bin",
    binColor: "#22c55e",
    confidence: 97.4,
    weightKg: 0.55,
    co2SavedKg: 0.65,
    recyclabilityRate: "100% (Composting)",
    degradationYears: 0.2,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    tags: ["Bio-degradable", "Compostable", "Methane Offset"],
    instructions: [
      "Keep free from plastic stickers, foil, or packaging.",
      "Ideal for anaerobic digestion or municipal composting.",
      "Produces rich organic fertilizer for local agriculture."
    ],
    composition: [
      { name: "Water & Organic Matter", percent: 88 },
      { name: "Cellulose & Fibers", percent: 12 }
    ]
  },
  {
    id: "glass-bottle",
    name: "Green Glass Wine Bottle",
    category: "Glass",
    binType: "Green/Clear Glass Container",
    binColor: "#10b981",
    confidence: 98.9,
    weightKg: 0.45,
    co2SavedKg: 0.35,
    recyclabilityRate: "100%",
    degradationYears: 1000000,
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
    tags: ["Silica Glass", "Infinitely Recyclable", "Heavy"],
    instructions: [
      "Rinse clean and remove metal or cork stoppers.",
      "Separate by color if multi-colored glass bins exist.",
      "Do not mix with tempered window glass or ceramics."
    ],
    composition: [
      { name: "Silica Sand (SiO2)", percent: 72 },
      { name: "Soda Ash & Limestone", percent: 28 }
    ]
  }
];

export const INITIAL_IOT_BINS = [
  {
    id: "BIN-101",
    name: "North Campus Central Plaza",
    location: "Zone A - Academic Block",
    lat: 37.7749, lng: -122.4194,
    fillLevel: 89, status: "Urgent",
    battery: 92, tempC: 24.5, capacityLiters: 240,
    lastEmptied: "18 hours ago",
    wasteType: "Recyclables (Plastics/Metals)",
    sensorHealth: "Optimal", compactorCyclesToday: 14
  },
  {
    id: "BIN-102",
    name: "Student Innovation Hub",
    location: "Zone B - Tech Building",
    lat: 37.7780, lng: -122.4150,
    fillLevel: 94, status: "Urgent",
    battery: 88, tempC: 26.1, capacityLiters: 360,
    lastEmptied: "22 hours ago",
    wasteType: "Paper & Cardboard",
    sensorHealth: "Optimal", compactorCyclesToday: 21
  },
  {
    id: "BIN-103",
    name: "Cafeteria Outdoor Courtyard",
    location: "Zone C - Dining Complex",
    lat: 37.7710, lng: -122.4230,
    fillLevel: 78, status: "Warning",
    battery: 65, tempC: 29.8, capacityLiters: 240,
    lastEmptied: "8 hours ago",
    wasteType: "Organic Composting",
    sensorHealth: "Optimal", compactorCyclesToday: 9
  },
  {
    id: "BIN-104",
    name: "Engineering Library Hall",
    location: "Zone A - Quiet Zone",
    lat: 37.7735, lng: -122.4170,
    fillLevel: 42, status: "Normal",
    battery: 97, tempC: 21.0, capacityLiters: 180,
    lastEmptied: "4 hours ago",
    wasteType: "General Waste",
    sensorHealth: "Optimal", compactorCyclesToday: 3
  },
  {
    id: "BIN-105",
    name: "Sports Complex Gymnasium",
    location: "Zone D - Athletics",
    lat: 37.7690, lng: -122.4280,
    fillLevel: 87, status: "Urgent",
    battery: 74, tempC: 25.0, capacityLiters: 240,
    lastEmptied: "16 hours ago",
    wasteType: "Recyclables (Plastics/Metals)",
    sensorHealth: "Optimal", compactorCyclesToday: 11
  },
  {
    id: "BIN-106",
    name: "E-Waste Smart Depot",
    location: "Zone B - Electronics Lab",
    lat: 37.7795, lng: -122.4110,
    fillLevel: 58, status: "Normal",
    battery: 100, tempC: 22.4, capacityLiters: 120,
    lastEmptied: "2 days ago",
    wasteType: "E-Waste / Batteries",
    sensorHealth: "Optimal", compactorCyclesToday: 0
  }
];

export const INITIAL_REWARDS = [
  { id: "reward-1", title: "$5 Campus Coffee Voucher", vendor: "EcoCafe", pointsRequired: 250, icon: "Coffee", category: "Food & Beverage", description: "Get a free artisanal organic coffee at any campus coffee spot." },
  { id: "reward-2", title: "1-Day Transit Day Pass", vendor: "City Transit", pointsRequired: 400, icon: "Bus", category: "Transportation", description: "Unlimited 24-hour bus and metro rides across the city network." },
  { id: "reward-3", title: "Plant a Native Tree Certificate", vendor: "GreenEarth NGO", pointsRequired: 500, icon: "Trees", category: "Eco Impact", description: "Plant a native sapling with your custom name on the global forest map." },
  { id: "reward-4", title: "Reusable Stainless Water Bottle", vendor: "EcoGear", pointsRequired: 850, icon: "Gift", category: "Merchandise", description: "Premium insulated 750ml thermal bottle with smart temperature indicator." }
];

export const MOCK_BOT_QA = [
  { keywords: ["pizza", "box", "greasy", "grease"], answer: "If the pizza box is clean and dry, recycle it in the Paper/Cardboard bin! If it has heavy cheese or grease stains, tear off the greasy bottom (put in compost/trash) and recycle the clean lid." },
  { keywords: ["battery", "batteries", "lithium", "cell"], answer: "Batteries must NEVER go in general trash or standard recycling bins! They are a severe fire hazard. Bring them to our E-Waste Smart Depot (Red Bin) or a local electronic recycling center." },
  { keywords: ["styrofoam", "thermocol", "foam"], answer: "Expanded Polystyrene (Styrofoam) is generally not accepted in standard curbside bins. Take it to specialized drop-off points or reuse it as packaging material." },
  { keywords: ["coffee cup", "to go cup", "starbucks"], answer: "Most paper coffee cups have a hidden plastic lining. Plastic lids go to Plastics (Blue Bin), cardboard sleeves to Paper, and the cup itself to General Waste unless specified compostable!" },
  { keywords: ["glass", "broken glass", "bottle"], answer: "Rinse food and beverage glass bottles and drop them in the Glass Bin. However, broken window glass, mirror glass, or ceramic mugs should NOT go into container recycling—wrap safely and place in General Waste." }
];
