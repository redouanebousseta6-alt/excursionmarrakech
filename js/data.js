/**
 * excursionmarrakech — Trip catalogue
 * Source: Silver Sands Travel brochure (accurate pricing & copy)
 */
window.EM = window.EM || {};
var EM = window.EM;

EM.SITE = {
  name: "excursionmarrakech",
  tagline: "Premium Marrakech Excursions & Desert Tours",
  phone: "+212 639 996 960",
  phoneAlt: "+212 624 603 887",
  email: "silversandstravels@gmail.com",
  url: "https://excursionmarrakech.net",
};

EM.CATEGORIES = [
  {
    id: "desert",
    name: "Desert Adventures",
    description: "Agafay dunes, camel rides, quads & starlit camps",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80",
  },
  {
    id: "day-trips",
    name: "Day Trips",
    description: "Atlas valleys, waterfalls, Essaouira & kasbahs",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
  },
  {
    id: "city",
    name: "City Tours",
    description: "Medina, gardens, carriage rides & night lights",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
  },
  {
    id: "wellness",
    name: "Wellness",
    description: "Hammam rituals & hands-on cooking classes",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
  },
  {
    id: "multi-day",
    name: "Multi-day",
    description: "Sahara overnight journeys to Merzouga & Zagora",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
  },
];

/**
 * Pricing model notes:
 * - type "flat": single price per person (or as stated)
 * - type "private-group": privatePrice & groupPrice (per person unless noted)
 * - type "options": radio options with custom labels
 * - type "driver-passenger": driver / passenger rates
 * - minPrivate: minimum persons for private booking
 */
EM.TRIPS = [
  {
    id: "hammam-spa-massage",
    title: "Traditional Hammam Spa & Massage",
    shortDescription:
      "Authentic hammam ritual with black soap scrub and Moroccan oil massage for total renewal.",
    description:
      "Relax and rejuvenate with an authentic traditional hammam experience in Marrakech. Begin with a steam bath to open the pores, followed by a deep black soap scrub performed by skilled attendants to cleanse and refresh the skin. The experience continues with a relaxing massage, using natural Moroccan oils to relieve stress and restore energy. This wellness ritual is perfect for unwinding after a busy day and discovering a true Moroccan tradition. Ideal for relaxation, wellness, and total body renewal.",
    category: "wellness",
    duration: "2 hours",
    durationLabel: "2 hours",
    featured: true,
    image: "/images/trips/hammam-spa-massage.jpg",
    tags: ["hammam", "spa", "massage"],
    itinerary: [
      "Welcome & preparation in a traditional hammam setting",
      "Steam bath to open the pores",
      "Deep black soap scrub by skilled attendants",
      "Relaxing massage with natural Moroccan oils",
      "Quiet recovery time before departure",
    ],
    included: [
      "Traditional hammam access",
      "Black soap scrub",
      "Relaxing oil massage",
      "Professional attendants",
    ],
    pricing: { type: "flat", price: 550, unit: "per person", label: "Per person" },
  },
  {
    id: "horse-riding-palmeraie",
    title: "Horse Riding Excursion in the Palmeraie",
    shortDescription:
      "Guided ride through palm groves and open desert paths just outside Marrakech.",
    description:
      "Enjoy a peaceful and authentic horse riding experience in the Palmeraie de Marrakech, just outside Marrakech. Ride through beautiful palm groves, open desert paths, and traditional surroundings while guided by experienced professionals. This relaxing excursion is suitable for beginners and experienced riders alike, offering a perfect mix of nature, tradition, and Moroccan charm.",
    category: "city",
    duration: "1 hour",
    durationLabel: "1 hour",
    featured: false,
    image: "/images/trips/horse-riding-palmeraie.jpg",
    tags: ["horse riding", "palmeraie"],
    itinerary: [
      "Meet your guide at the Palmeraie stables",
      "Safety briefing and horse assignment",
      "Guided ride through palm groves and desert paths",
      "Photo stops in traditional surroundings",
      "Return to the stables",
    ],
    included: [
      "Experienced guide",
      "Horse & riding equipment",
      "Suitable for beginners and experienced riders",
    ],
    pricing: { type: "flat", price: 350, unit: "per person", label: "Per person" },
  },
  {
    id: "agafay-promo-pack",
    title: "Agafay Desert Promo Pack – Quad, Camel, Dinner & Show",
    shortDescription:
      "Full-day Agafay adventure: quad biking, sunset camel ride, dinner and live show.",
    description:
      "Enjoy an unforgettable experience in the Agafay Desert, just outside Marrakech. This special promo pack combines quad biking across the rocky desert, a peaceful camel ride at sunset, and a magical evening in a desert camp. End your adventure with a traditional Moroccan dinner, followed by a live show with music, fire performance, and folkloric entertainment under the stars.",
    category: "desert",
    duration: "8 am – 8 pm",
    durationLabel: "Full day",
    featured: true,
    image: "/images/trips/agafay-promo-pack.jpg",
    tags: ["agafay", "quad", "camel", "dinner", "show"],
    itinerary: [
      "Morning departure toward the Agafay Desert",
      "Quad biking across rocky desert landscapes",
      "Sunset camel ride",
      "Traditional Moroccan dinner at desert camp",
      "Live music, fire performance & folkloric show under the stars",
      "Return to Marrakech in the evening",
    ],
    included: [
      "Quad biking experience",
      "Camel ride at sunset",
      "Traditional Moroccan dinner",
      "Live show & entertainment",
      "Round-trip transfers",
    ],
    pricing: { type: "flat", price: 700, unit: "per person", label: "Per person" },
  },
  {
    id: "vip-buggy-canam",    title: "Ultra-Luxury VIP Buggy Can-Am Experience",
    shortDescription:
      "Premium Can-Am buggy adventure with fuel, full insurance and professional supervision.",
    description:
      "Discover the desert in absolute comfort with our premium Can-Am buggies, designed for power, safety, and elegance. This exclusive experience includes premium fuel, full insurance coverage, and dedicated professional supervision, ensuring a smooth, safe, and unforgettable adventure.",
    category: "desert",
    duration: "3 pm – 10 pm",
    durationLabel: "1 hour ride",
    featured: true,
    image: "/images/trips/vip-buggy-canam.jpg",
    tags: ["buggy", "vip", "can-am", "luxury"],
    itinerary: [
      "Afternoon meeting & safety briefing",
      "Choose your 2-seater or 4-seater Can-Am buggy",
      "1-hour guided desert drive with professional supervision",
      "Evening return",
    ],
    included: [
      "Premium Can-Am buggy (2 or 4 seater)",
      "Premium fuel",
      "Full insurance coverage",
      "Dedicated professional supervision",
    ],
    pricing: {
      type: "options",
      options: [
        { id: "2seater", label: "2-Seater Buggy – 1 hour", price: 3000, unit: "per buggy" },
        { id: "4seater", label: "4-Seater Buggy – 1 hour", price: 3500, unit: "per buggy" },
      ],
    },
  },
  {
    id: "zagora-desert",
    title: "Zagora Desert – 2 Days / 1 Night",
    shortDescription:
      "Cross the Atlas and Draa Valley for a sunset over the dunes and a night in a nomadic camp.",
    description:
      "Experience a unique adventure to the Zagora desert! Cross the Atlas Mountains, visit the stunning Draa Valley, and discover traditional palm groves and kasbahs. Upon arrival, enjoy a magical sunset over the dunes and spend an unforgettable night under the stars in a nomadic camp.",
    category: "multi-day",
    duration: "2 days / 1 night",
    durationLabel: "2 days / 1 night",
    featured: true,
    image: "/images/trips/zagora-desert.jpg",
    tags: ["zagora", "desert", "overnight"],
    itinerary: [
      "Day 1: Departure from Marrakech across the Atlas Mountains",
      "Visit Draa Valley, palm groves and kasbahs",
      "Sunset over the dunes",
      "Overnight in a nomadic desert camp under the stars",
      "Day 2: Morning desert experience & return to Marrakech",
    ],
    included: [
      "Transport in air-conditioned vehicle",
      "Overnight in nomadic camp",
      "Dinner & breakfast (typical package)",
      "Guided desert experience",
    ],
    pricing: {
      type: "private-group",
      groupPrice: 950,
      privatePrice: null,
      unit: "per person",
      note: "Group rate",
    },
  },
  {
    id: "ouarzazate",
    title: "Ouarzazate & Aït Ben Haddou Day Trip",
    shortDescription:
      "UNESCO kasbah, film studios and High Atlas scenery on a full day south of Marrakech.",
    description:
      "Embark on an unforgettable day trip to Ouarzazate, the gateway to the desert! Discover the famous Aït Ben Haddou Kasbah, a UNESCO World Heritage site, and explore the film studios where many iconic movies were shot. Travel through the breathtaking landscapes of the High Atlas Mountains and immerse yourself in the rich culture of southern Morocco.",
    category: "day-trips",
    duration: "Full day",
    durationLabel: "Full day",
    featured: false,
    image: "/images/trips/ouarzazate.jpg",
    tags: ["ouarzazate", "ait ben haddou", "unesco"],
    itinerary: [
      "Morning departure via the High Atlas Mountains",
      "Visit Aït Ben Haddou Kasbah (UNESCO)",
      "Explore Ouarzazate film studios",
      "Immersion in southern Moroccan culture",
      "Return to Marrakech in the evening",
    ],
    included: [
      "Comfortable transport",
      "Professional driver/guide service",
      "Stops at key landmarks",
    ],
    pricing: {
      type: "private-group",
      privatePrice: 500,
      groupPrice: 350,
      unit: "per person",
      minPrivate: 4,
      note: "Private minimum 4 persons",
    },
  },
  {
    id: "merzouga",
    title: "Merzouga Sahara – 3 Days / 2 Nights",
    shortDescription:
      "Erg Chebbi dunes, Todgha Gorges, camel sunset and a magical desert camp night.",
    description:
      "Set off on an unforgettable journey to the golden dunes of Merzouga, at the edge of the Sahara. Discover Berber villages, the Todgha Gorges, and lush oases. Ride a camel to admire the sunset over the Erg Chebbi dunes, then spend a magical night in a desert camp under the starry sky.",
    category: "multi-day",
    duration: "3 days / 2 nights",
    durationLabel: "3 days / 2 nights",
    featured: true,
    image: "/images/trips/merzouga.jpg",
    tags: ["merzouga", "sahara", "camel", "overnight"],
    itinerary: [
      "Day 1: Marrakech → High Atlas → southern valleys & overnight stop",
      "Day 2: Todgha Gorges, oases & Berber villages → Erg Chebbi",
      "Camel ride at sunset over the dunes",
      "Night in desert camp under the stars",
      "Day 3: Sunrise option & return to Marrakech",
    ],
    included: [
      "Transport & overnight stops",
      "Desert camp accommodation",
      "Camel ride at Erg Chebbi",
      "Guided multi-day itinerary",
    ],
    pricing: {
      type: "private-group",
      groupPrice: 950,
      privatePrice: null,
      unit: "per person",
      note: "Group rate",
    },
  },
  {
    id: "agadir-day-tour",
    title: "Agadir Day Tour from Marrakech",
    shortDescription:
      "Atlantic coast escape with free time at the beach, marina and markets.",
    description:
      "Enjoy a full-day escape from Marrakech to the Atlantic coast with our Agadir tour. Departure is at 08:30, traveling through scenic landscapes and charming towns. Upon arrival in Agadir, enjoy free time to explore the beachfront, marina, local markets, or relax by the ocean. At 16:00, we depart from Agadir and head back to Marrakech, arriving in the evening. A perfect day trip combining comfort, discovery, and seaside relaxation. Includes comfortable transport and professional service.",
    category: "day-trips",
    duration: "08:30 – evening",
    durationLabel: "Full day",
    featured: false,
    image: "/images/trips/agadir-day-tour.jpg",
    tags: ["agadir", "atlantic", "beach"],
    itinerary: [
      "08:30 departure from Marrakech",
      "Scenic drive through landscapes and charming towns",
      "Free time in Agadir: beachfront, marina or markets",
      "16:00 departure back to Marrakech",
      "Evening arrival in Marrakech",
    ],
    included: [
      "Comfortable transport",
      "Professional service",
      "Free time in Agadir",
    ],
    pricing: {
      type: "private-group",
      privatePrice: 700,
      groupPrice: null,
      unit: "per person",
      minPrivate: 3,
      note: "Private — minimum 3 persons",
    },
  },
  {
    id: "electric-scooter",
    title: "Electric Scooter Ride – Medina or Palm Grove",
    shortDescription:
      "Eco-friendly all-terrain scooter tour of the medina or serene palm grove.",
    description:
      "Explore Marrakech in a unique way with our all-terrain electric scooters, from the lively medina to the serene palm grove. Enjoy a fun, immersive, and eco-friendly experience, guided by a passionate local expert. Discover the city's highlights, hidden gems, and stunning panoramas effortlessly and in total comfort.",
    category: "city",
    duration: "Half day",
    durationLabel: "Tour duration varies",
    featured: false,
    image: "/images/trips/electric-scooter.jpg",
    tags: ["scooter", "eco", "medina", "palm grove"],
    itinerary: [
      "Meet your local expert guide",
      "Safety briefing & scooter familiarization",
      "Guided tour of Medina or Palm Grove (your choice)",
      "Hidden gems & panorama stops",
      "Return to meeting point",
    ],
    included: [
      "All-terrain electric scooter",
      "Passionate local guide",
      "Helmet & safety briefing",
    ],
    pricing: {
      type: "options",
      options: [
        { id: "medina", label: "Medina Tour", price: 450, unit: "per person" },
        { id: "palmgrove", label: "Palm Grove Tour", price: 450, unit: "per person" },
      ],
    },
  },
  {
    id: "gardens-ramparts-carriage",
    title: "Gardens & Ramparts by Carriage",
    shortDescription:
      "Horse-drawn carriage past Majorelle Garden, Menara Gardens and Medina gates.",
    description:
      "Enjoy an authentic open-air experience in the comfort of a horse-drawn carriage, accompanied by the rhythmic sound of hooves through Marrakech's vibrant and lush surroundings. Discover the Majorelle Garden, an endless source of inspiration for designer Yves Saint Laurent. Stroll through the romantic Menara Gardens, featuring a large Atlas-fed basin surrounded by olive trees and rose bushes. Admire the majestic ramparts and monumental gates of the Red City's Medina.",
    category: "city",
    duration: "8 am – 6 pm window",
    durationLabel: "Carriage tour",
    featured: false,
    image: "/images/trips/gardens-ramparts-carriage.jpg",
    tags: ["carriage", "majorelle", "menara", "ramparts"],
    itinerary: [
      "Board your horse-drawn carriage",
      "Pass by Majorelle Garden (Yves Saint Laurent inspiration)",
      "Stroll through romantic Menara Gardens",
      "Admire Medina ramparts and monumental gates",
      "Return through Marrakech's lush surroundings",
    ],
    included: [
      "Horse-drawn carriage experience",
      "Guided sightseeing route",
      "Stops at iconic gardens & ramparts",
    ],
    pricing: { type: "flat", price: 500, unit: "per person", label: "Per person" },
  },
  {
    id: "road-of-the-kasbahs",
    title: "On the Road of the Kasbahs",
    shortDescription:
      "Tizi n'Tichka, Telouet & Aït Ben Haddou — the legendary kasbah route.",
    description:
      "Take the spectacular Tizi n'Tichka mountain pass and journey through the Berber villages of Telouet. Discover the legendary Road of the Kasbahs, a natural film set for famous movies such as Gladiator and Lawrence of Arabia. The day includes a visit to the majestic Kasbah of Pacha El Glaoui in Telouet, followed by lunch near the UNESCO-listed Kasbah of Ait Ben Haddou.",
    category: "day-trips",
    duration: "Full day",
    durationLabel: "Full day",
    featured: true,
    image: "/images/trips/road-of-the-kasbahs.jpg",
    tags: ["kasbahs", "telouet", "ait ben haddou"],
    itinerary: [
      "Ascend via Tizi n'Tichka mountain pass",
      "Berber villages of Telouet",
      "Visit Kasbah of Pacha El Glaoui",
      "Lunch near UNESCO Aït Ben Haddou",
      "Return to Marrakech",
    ],
    included: [
      "Transport via Tizi n'Tichka",
      "Kasbah visits",
      "Lunch stop near Aït Ben Haddou",
      "Professional guiding",
    ],
    pricing: {
      type: "private-group",
      privatePrice: 900,
      groupPrice: 650,
      unit: "per person",
    },
  },
  {
    id: "evening-marrakech-desert",
    title: "Evening in the Marrakech Desert",
    shortDescription:
      "Agafay safari with sunset camel ride — an afternoon and evening of total escape.",
    description:
      "Embark on a true desert adventure in Agafay with a unique safari that combines thrill and wonder. Cross arid landscapes, then experience an unforgettable sunset camel ride. An afternoon and evening of total escape await you in the heart of the desert.",
    category: "desert",
    duration: "5 pm – 10 pm",
    durationLabel: "5 hours",
    featured: false,
    image: "/images/trips/evening-marrakech-desert.jpg",
    tags: ["agafay", "sunset", "camel", "evening"],
    itinerary: [
      "Afternoon departure to Agafay",
      "Desert safari across arid landscapes",
      "Unforgettable sunset camel ride",
      "Evening desert atmosphere",
      "Return around 10 pm",
    ],
    included: [
      "Desert safari",
      "Sunset camel ride",
      "Transfers",
    ],
    pricing: { type: "flat", price: 800, unit: "per person", label: "Per person" },
  },
  {
    id: "marrakech-by-carriage-night",
    title: "Marrakech by Night – Horses & Carriage",
    shortDescription:
      "Romantic evening carriage past illuminated fountains, ramparts and Jemaa El Fna.",
    description:
      "Discover the magic of Marrakech by night on a romantic carriage ride. Admire the illuminated fountains, the prestigious La Mamounia Casino, the ancient city walls, and end your tour near one of Africa's most vibrant scenes: the iconic Jemaa El Fna square.",
    category: "city",
    duration: "6 pm – 8 pm",
    durationLabel: "2 hours",
    featured: false,
    image: "/images/trips/marrakech-by-carriage-night.jpg",
    tags: ["night", "carriage", "jemaa el fna"],
    itinerary: [
      "Evening boarding of horse-drawn carriage",
      "Illuminated fountains & La Mamounia Casino",
      "Ancient city walls by night",
      "Finish near Jemaa El Fna square",
    ],
    included: [
      "Romantic carriage ride",
      "Night sightseeing route",
    ],
    pricing: { type: "flat", price: 300, unit: "per person", label: "Per person" },
  },
  {
    id: "lights-barbecue-dinner",
    title: "Lights of Marrakech & Barbecue Dinner",
    shortDescription:
      "Sunset carriage through iconic landmarks, then traditional barbecue in an authentic riad.",
    description:
      "Discover Marrakech at sunset with an elegant horse-drawn carriage ride through illuminated fountains, historic ramparts, and the lively Jemaa El Fna square. Enjoy a romantic moment in front of the city's most iconic landmarks. The evening continues with a traditional barbecue dinner in an authentic riad, featuring Moroccan salads, skewers, vegetable couscous, and a surprise dessert lovingly prepared by the Dada (traditional cook).",
    category: "city",
    duration: "7 pm – 10 pm",
    durationLabel: "3 hours",
    featured: false,
    image: "/images/trips/lights-barbecue-dinner.jpg",
    tags: ["carriage", "dinner", "riad", "barbecue"],
    itinerary: [
      "Sunset carriage through fountains & historic ramparts",
      "Jemaa El Fna atmosphere",
      "Traditional barbecue dinner in an authentic riad",
      "Moroccan salads, skewers, vegetable couscous & surprise dessert",
    ],
    included: [
      "Horse-drawn carriage at sunset",
      "Barbecue dinner in a riad",
      "Traditional Moroccan dishes prepared by the Dada",
    ],
    pricing: { type: "flat", price: 550, unit: "per person", label: "Per person" },
  },
  {
    id: "berber-trails",
    title: "The Berber Trails",
    shortDescription:
      "Hike the High Atlas Three Valleys with panoramic views, villages and valley lunch.",
    description:
      "Hike through the peaks of the High Atlas and the Three Valleys, offering panoramic views and a thrilling experience. Discover ancient Berber villages and their traditional rammed-earth architecture. Enjoy a delicious lunch in the heart of this picturesque valley.",
    category: "day-trips",
    duration: "9 am – 5 pm",
    durationLabel: "Full day",
    featured: false,
    image: "/images/trips/berber-trails.jpg",
    tags: ["hiking", "atlas", "berber"],
    itinerary: [
      "09:00 departure toward the High Atlas",
      "Hike through the Three Valleys with panoramic views",
      "Visit ancient Berber villages",
      "Lunch in the picturesque valley",
      "Return by 17:00",
    ],
    included: [
      "Guided hike",
      "Berber village visits",
      "Valley lunch",
      "Transport",
    ],
    pricing: {
      type: "private-group",
      privatePrice: 800,
      groupPrice: 550,
      childPrivate: 400,
      childGroup: 225,
      unit: "per adult",
      note: "Child rates: Private 400 MAD / Group 225 MAD",
    },
  },
  {
    id: "medina-tour",
    title: "Medina Tour",
    shortDescription:
      "Monuments, palaces, souks and the living atmosphere of the Red City.",
    description:
      "Explore the iconic monuments and palaces for an immersive journey through the history of Marrakech. Wander through the winding alleys of the Medina to uncover the hidden treasures of the souks and local craftsmanship. Soak up the unique atmosphere of the \"Red City,\" where every street corner tells a captivating story.",
    category: "city",
    duration: "9 am – 1 pm",
    durationLabel: "Half day",
    featured: false,
    image: "/images/trips/medina-tour.jpg",
    tags: ["medina", "souks", "monuments"],
    itinerary: [
      "Morning start in the historic Medina",
      "Iconic monuments and palaces",
      "Winding alleys & souk craftsmanship",
      "Atmosphere of the Red City",
      "End around 13:00",
    ],
    included: [
      "Guided Medina walk",
      "Monument & souk orientation",
      "Local insights",
    ],
    pricing: {
      type: "private-group",
      privatePrice: 400,
      groupPrice: 300,
      unit: "per person",
      minPrivate: 4,
      note: "Private minimum 4 persons",
    },
  },
  {
    id: "ourika-valley",
    title: "Ourika Valley",
    shortDescription:
      "High Atlas scenery, Berber villages and the seven waterfalls of Setti Fatma.",
    description:
      "Admire the spectacular landscapes of the High Atlas Mountains and the Ourika River. Explore preserved villages that offer a deep immersion into Berber culture. Discover the seven waterfalls of Setti Fatma — a refreshing and unforgettable experience.",
    category: "day-trips",
    duration: "9 am – 3 pm",
    durationLabel: "Half day+",
    featured: true,
    image: "/images/trips/ourika-valley.jpg",
    tags: ["ourika", "waterfalls", "setti fatma"],
    itinerary: [
      "09:00 departure to Ourika Valley",
      "High Atlas & Ourika River landscapes",
      "Preserved Berber villages",
      "Seven waterfalls of Setti Fatma",
      "Return by 15:00",
    ],
    included: [
      "Transport",
      "Valley & village experience",
      "Setti Fatma waterfalls visit",
    ],
    pricing: {
      type: "private-group",
      privatePrice: 450,
      groupPrice: 300,
      unit: "per person",
      minPrivate: 4,
      note: "Private minimum 4 persons",
    },
  },
  {
    id: "ouzoud-waterfalls",
    title: "Ouzoud Waterfalls",
    shortDescription:
      "110m cascades, lunch by the water and Rhesus macaques in lush scenery.",
    description:
      "Among the most beautiful in North Africa, standing 110 meters high with permanent rainbows. Enjoy lunch with your feet in the water and watch Rhesus macaques in their natural habitat. Escape the bustle of Marrakech and spend a refreshing day surrounded by stunning and peaceful scenery.",
    category: "day-trips",
    duration: "8 am – 6 pm",
    durationLabel: "Full day",
    featured: true,
    image: "/images/trips/ouzoud-waterfalls.jpg",
    tags: ["ouzoud", "waterfalls", "nature"],
    itinerary: [
      "08:00 departure from Marrakech",
      "Arrive at the 110m Ouzoud cascades",
      "Walks with rainbow views & macaque sightings",
      "Lunch with your feet in the water",
      "Return by 18:00",
    ],
    included: [
      "Round-trip transport",
      "Waterfall visit",
      "Time for lunch by the water",
    ],
    pricing: {
      type: "private-group",
      privatePrice: 400,
      groupPrice: 250,
      unit: "per person",
      minPrivate: 4,
      note: "Private minimum 4 persons",
    },
  },
  {
    id: "essaouira",
    title: "Essaouira Day Trip",
    shortDescription:
      "Atlantic medina, Mogador sunsets, souks, trade winds and coastal cuisine.",
    description:
      "Located 186 km from Marrakech, Essaouira is beloved by surfers from around the world for its peaceful vibe and unique climate. Essaouira delights all the senses with sunsets over Mogador Island, the scents of the souk, the sound of crashing waves, the trade winds on your face, and the charm of affordable local cuisine.",
    category: "day-trips",
    duration: "8 am – 7 pm",
    durationLabel: "Full day",
    featured: true,
    image: "/images/trips/essaouira.jpg",
    tags: ["essaouira", "atlantic", "medina"],
    itinerary: [
      "08:00 departure (186 km from Marrakech)",
      "Free time in Essaouira medina & ramparts",
      "Souk scents, waves & Mogador views",
      "Local cuisine stop",
      "Return by 19:00",
    ],
    included: [
      "Round-trip transport",
      "Free exploration time",
      "Coastal day trip experience",
    ],
    pricing: {
      type: "private-group",
      privatePrice: 400,
      groupPrice: 250,
      unit: "per person",
      minPrivate: 4,
      note: "Private minimum 4 persons",
    },
  },
  {
    id: "quad-agafay",
    title: "Quad Biking in the Agafay Desert",
    shortDescription:
      "Exhilarating quad ride plus Berber village visit and mint tea with locals.",
    description:
      "Ride across diverse desert landscapes near Marrakech on an exhilarating quad adventure. A meeting with Berber culture: explore a traditional Berber village and enjoy mint tea with the locals for an authentic cultural immersion. Morning (9 am – 1 pm) or afternoon (2 pm – 6 pm) sessions available.",
    category: "desert",
    duration: "Morning or afternoon",
    durationLabel: "Half day",
    featured: false,
    image: "/images/trips/quad-agafay.jpg",
    tags: ["quad", "agafay", "berber"],
    itinerary: [
      "Choose morning (9–13h) or afternoon (14–18h) session",
      "Safety briefing",
      "Quad ride across desert landscapes",
      "Visit a traditional Berber village",
      "Mint tea with locals",
    ],
    included: [
      "Quad bike",
      "Guide & safety briefing",
      "Berber village visit & mint tea",
    ],
    pricing: {
      type: "driver-passenger",
      driverPrice: 400,
      passengerPrice: 200,
      note: "Same rates for Private & Group",
    },
  },
  {
    id: "cooking-class",
    title: "Moroccan Cooking Class",
    shortDescription:
      "Hands-on chef-led class — prepare your own dish, then taste your creations.",
    description:
      "Immerse yourself in Moroccan gastronomy. Interactive experience with a chef: prepare your own dish under the expert guidance of a professional chef, who will share culinary tips and traditional techniques for an enriching and hands-on experience. Tasting your creations: enjoy the fruits of your labor with an authentic and rewarding culinary moment.",
    category: "wellness",
    duration: "9 am – 2 pm",
    durationLabel: "5 hours",
    featured: false,
    image: "/images/trips/cooking-class.jpg",
    tags: ["cooking", "gastronomy", "chef"],
    itinerary: [
      "09:00 welcome & market/ingredient introduction",
      "Interactive cooking with a professional chef",
      "Learn traditional techniques & tips",
      "Taste your creations together",
      "Finish around 14:00",
    ],
    included: [
      "Professional chef guidance",
      "Ingredients & cooking session",
      "Tasting of your dishes",
    ],
    pricing: { type: "flat", price: 550, unit: "per person", label: "Per person" },
  },
  {
    id: "dromedary-agafay",
    title: "Dromedary Ride in the Agafay Desert",
    shortDescription:
      "Peaceful camel ride through stone desert landscapes and palm groves.",
    description:
      "Discover the Agafay Desert on a relaxing ride through stone desert landscapes and palm groves, offering a peaceful escape just outside Marrakech. Morning (9 am – 1 pm) or afternoon (2 pm – 6 pm) sessions available.",
    category: "desert",
    duration: "Morning or afternoon",
    durationLabel: "Half day",
    featured: false,
    image: "/images/trips/dromedary-agafay.jpg",
    tags: ["camel", "dromedary", "agafay"],
    itinerary: [
      "Choose morning or afternoon slot",
      "Meet your camel caravan team",
      "Relaxing ride through stone desert & palm groves",
      "Photo stops & peaceful escape",
      "Return to meeting point",
    ],
    included: [
      "Dromedary ride",
      "Guide accompaniment",
      "Scenic desert & palm grove route",
    ],
    pricing: { type: "flat", price: 300, unit: "per person", label: "Per person" },
  },
  {
    id: "hot-air-balloon",
    title: "Hot Air Balloon Flight",
    shortDescription:
      "One-hour flight with panoramic views of Marrakech and the Atlas Mountains.",
    description:
      "Breathtaking panoramic views: enjoy stunning aerial views of Marrakech and the Atlas Mountains on this unforgettable hot air balloon ride. A peaceful and memorable experience: soar gently for a one-hour flight, creating lasting memories before a smooth landing and a celebratory moment to mark the adventure.",
    category: "desert",
    duration: "5 am – 10 am (1h flight)",
    durationLabel: "1 hour flight",
    featured: true,
    image: "/images/trips/hot-air-balloon.jpg",
    tags: ["balloon", "sunrise", "atlas"],
    itinerary: [
      "Very early morning pickup (from 5 am)",
      "Flight preparation & safety briefing",
      "1-hour gentle flight over Marrakech & Atlas views",
      "Smooth landing",
      "Celebratory moment marking the adventure",
      "Return by ~10 am",
    ],
    included: [
      "Hot air balloon flight (1 hour)",
      "Professional pilot & crew",
      "Transfers in the time window",
      "Celebratory landing moment",
    ],
    pricing: { type: "flat", price: 1400, unit: "per person", label: "Per person" },
  },
  {
    id: "imlil-asni",
    title: "Imlil & Asni",
    shortDescription:
      "Gateway to Toubkal National Park — mountain village hiking and Berber landscapes.",
    description:
      "Imlil, a charming mountain village, is the gateway to Mount Toubkal, the highest peak in North Africa. Located just 64 km from Marrakech, Imlil also serves as the entrance to Toubkal National Park, offering exceptional hiking opportunities. The park features a rich diversity of landscapes, from high plateaus to deep gorges, filled with vibrant colors and fragrant scents.",
    category: "day-trips",
    duration: "9 am – 5 pm",
    durationLabel: "Full day",
    featured: false,
    image: "/images/trips/imlil-asni.jpg",
    tags: ["imlil", "toubkal", "hiking"],
    itinerary: [
      "09:00 departure (64 km to Imlil)",
      "Explore Imlil mountain village",
      "Toubkal National Park landscapes — plateaus & gorges",
      "Optional short hikes with panoramic views",
      "Return by 17:00",
    ],
    included: [
      "Transport to Imlil & Asni",
      "Mountain village experience",
      "National park scenery",
    ],
    pricing: {
      type: "private-group",
      privatePrice: 600,
      groupPrice: 400,
      unit: "per person",
      minPrivate: 4,
      note: "Private — minimum 4 persons",
    },
  },
  {
    id: "fantasia-chez-ali",
    title: "Fantasia Dinner at Chez Ali",
    shortDescription:
      "Traditional dinner show with music, fantasia and folkloric dances under the stars.",
    description:
      "Traditional Moroccan dinner show set in a magical setting on the outskirts of Marrakech, featuring music, fantasia, and folkloric dances. A unique experience combining gastronomy, culture, and a truly Moroccan atmosphere under the stars.",
    category: "city",
    duration: "7 pm – 11 pm",
    durationLabel: "4 hours",
    featured: false,
    image: "/images/trips/fantasia-chez-ali.jpg",
    tags: ["fantasia", "dinner", "show"],
    itinerary: [
      "19:00 transfer to Chez Ali",
      "Traditional Moroccan dinner",
      "Music, fantasia & folkloric dances",
      "Magical outdoor atmosphere",
      "Return around 23:00",
    ],
    included: [
      "Dinner show admission",
      "Traditional entertainment",
      "Transfers (as arranged)",
    ],
    pricing: {
      type: "private-group",
      privatePrice: 750,
      groupPrice: 550,
      unit: "per person",
      minPrivate: 4,
      note: "Private minimum 4 persons",
    },
  },
  {
    id: "buggy-agafay",
    title: "Buggy Adventure in the Agafay Desert",
    shortDescription:
      "Guided buggy thrills 30 km from Marrakech with Berber mint tea and full safety briefing.",
    description:
      "Explore this peaceful haven just 30 km from Marrakech, discover diverse landscapes, and meet the Berbers during a mint tea break. Professional guides & safety first: accompanied by experienced guides, you'll receive a full briefing on buggy operation and safety rules to ensure a secure and unforgettable experience. Morning (9 am – 1 pm) or afternoon (2 pm – 6 pm) sessions.",
    category: "desert",
    duration: "Morning or afternoon",
    durationLabel: "Half day",
    featured: true,
    image: "/images/trips/buggy-agafay.jpg",
    tags: ["buggy", "agafay", "adventure"],
    itinerary: [
      "Morning or afternoon session",
      "Full safety & operation briefing",
      "Guided buggy adventure across Agafay landscapes",
      "Meet Berbers & mint tea break",
      "Return to base",
    ],
    included: [
      "Buggy for 2 persons",
      "Experienced guides",
      "Safety briefing",
      "Mint tea with Berbers",
    ],
    pricing: {
      type: "private-group",
      privatePrice: 2000,
      groupPrice: 1400,
      unit: "per buggy (2 persons)",
      note: "Price for 2 persons",
    },
  },
];

/** Deterministic fake guest ratings until real reviews are wired up */
(function assignFakeRatings() {
  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }
  EM.TRIPS.forEach(function (trip) {
    if (trip.rating != null && trip.reviewCount != null) return;
    var h = hash(trip.id);
    // 4.6 – 5.0 in 0.1 steps
    trip.rating = Math.round((4.6 + (h % 5) * 0.1) * 10) / 10;
    trip.reviewCount = 18 + (h % 160);
  });
})();

/** Homepage guest reviews (placeholder until live reviews) */
EM.REVIEWS = [
  {
    name: "Sophie M.",
    location: "Paris, France",
    rating: 5,
    tripId: "agafay-promo-pack",
    text: "The Agafay promo pack was magical — quads, camel ride at sunset, and an unforgettable dinner show. Flawless organisation from pickup to drop-off.",
  },
  {
    name: "James R.",
    location: "London, UK",
    rating: 5,
    tripId: "ourika-valley",
    text: "Ourika Valley day trip exceeded expectations. Friendly guide, beautiful scenery, and transparent pricing. We will book again on our next Marrakech visit.",
  },
  {
    name: "Elena V.",
    location: "Madrid, Spain",
    rating: 5,
    tripId: "hammam-spa-massage",
    text: "The traditional hammam was the perfect reset after exploring the medina. Professional staff and a genuinely authentic ritual — highly recommend.",
  },
  {
    name: "Marcus T.",
    location: "Berlin, Germany",
    rating: 4,
    tripId: "merzouga",
    text: "Merzouga overnight was the highlight of our Morocco trip. Dunes, camp dinner under the stars, and a smooth private transfer from Marrakech.",
  },
  {
    name: "Amelia K.",
    location: "Toronto, Canada",
    rating: 5,
    tripId: "essaouira",
    text: "Essaouira day trip was breezy and well paced. Blue medina walks, seafood lunch tips, and back to Marrakech before dinner. Great value.",
  },
  {
    name: "Luca B.",
    location: "Milan, Italy",
    rating: 5,
    tripId: "hot-air-balloon",
    text: "Sunrise balloon flight over the Palmeraie — pure wow. Clear briefing, safe landing, and champagne toast. Worth every dirham.",
  },
];

EM.getTrip = function (id) {
  return EM.TRIPS.find(function (t) {
    return t.id === id;
  });
};

EM.ensureRating = function (trip) {
  if (!trip) return { rating: 4.8, reviewCount: 24 };
  if (trip.rating == null || trip.reviewCount == null) {
    var h = 0;
    var id = String(trip.id || "trip");
    for (var i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
    h = Math.abs(h);
    trip.rating = trip.rating != null ? trip.rating : Math.round((4.6 + (h % 5) * 0.1) * 10) / 10;
    trip.reviewCount = trip.reviewCount != null ? trip.reviewCount : 18 + (h % 160);
  }
  return { rating: Number(trip.rating), reviewCount: Number(trip.reviewCount) };
};

EM.starsHtml = function (rating, opts) {
  opts = opts || {};
  var value = Math.max(0, Math.min(5, Number(rating) || 0));
  var full = Math.floor(value + 0.01);
  var half = value - full >= 0.4 && value - full < 0.9;
  var empty = 5 - full - (half ? 1 : 0);
  var label = value.toFixed(1).replace(/\.0$/, "") + " out of 5";
  var html =
    '<span class="stars' +
    (opts.className ? " " + opts.className : "") +
    '" role="img" aria-label="' +
    label +
    '">';
  var i;
  for (i = 0; i < full; i++) html += '<span class="stars__icon stars__icon--full" aria-hidden="true">★</span>';
  if (half) html += '<span class="stars__icon stars__icon--half" aria-hidden="true">★</span>';
  for (i = 0; i < empty; i++) html += '<span class="stars__icon stars__icon--empty" aria-hidden="true">★</span>';
  if (opts.showValue !== false) {
    html +=
      '<span class="stars__value">' +
      value.toFixed(1) +
      "</span>";
  }
  html += "</span>";
  return html;
};

EM.siteAggregateRating = function () {
  var trips = EM.TRIPS || [];
  if (!trips.length) return { ratingValue: 4.9, reviewCount: 320, bestRating: 5, worstRating: 1 };
  var sum = 0;
  var count = 0;
  trips.forEach(function (t) {
    var r = EM.ensureRating(t);
    sum += r.rating * r.reviewCount;
    count += r.reviewCount;
  });
  return {
    ratingValue: Math.round((sum / count) * 10) / 10,
    reviewCount: count,
    bestRating: 5,
    worstRating: 1,
  };
};

EM.getFeatured = function (limit) {
  return EM.TRIPS.filter(function (t) {
    return t.featured;
  }).slice(0, limit || 6);
};

EM.getByCategory = function (categoryId) {
  if (!categoryId || categoryId === "all") return EM.TRIPS.slice();
  return EM.TRIPS.filter(function (t) {
    return t.category === categoryId;
  });
};

/** Related trips for a listing page: same category first, then featured/top-rated. */
EM.getRelatedTrips = function (trip, limit) {
  limit = limit || 4;
  if (!trip) return [];
  var trips = EM.TRIPS || [];
  var others = trips.filter(function (t) {
    return t && t.id && t.id !== trip.id;
  });

  function byRating(a, b) {
    var ra = EM.ensureRating ? EM.ensureRating(a) : { rating: 0, reviewCount: 0 };
    var rb = EM.ensureRating ? EM.ensureRating(b) : { rating: 0, reviewCount: 0 };
    return rb.rating - ra.rating || rb.reviewCount - ra.reviewCount;
  }

  var same = others
    .filter(function (t) {
      return t.category === trip.category;
    })
    .sort(byRating);
  var rest = others
    .filter(function (t) {
      return t.category !== trip.category;
    })
    .sort(function (a, b) {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || byRating(a, b);
    });

  return same.concat(rest).slice(0, limit);
};

EM.categoryName = function (id) {
  var c = EM.CATEGORIES.find(function (x) {
    return x.id === id;
  });
  return c ? c.name : id;
};

EM.formatPrice = function (amountMad) {
  if (amountMad == null) return "—";
  if (EM.money && EM.money.format) return EM.money.format(amountMad);
  return new Intl.NumberFormat("fr-MA").format(amountMad) + " MAD";
};

/** Lowest displayable starting price for cards */
EM.startingPrice = function (trip) {
  var p = trip.pricing;
  if (p.type === "flat") return p.price;
  if (p.type === "private-group") {
    var vals = [p.groupPrice, p.privatePrice].filter(function (v) {
      return v != null;
    });
    return vals.length ? Math.min.apply(null, vals) : null;
  }
  if (p.type === "options") {
    return Math.min.apply(
      null,
      p.options.map(function (o) {
        return o.price;
      })
    );
  }
  if (p.type === "driver-passenger") return p.passengerPrice;
  return null;
};

EM.priceLabel = function (trip) {
  var p = trip.pricing;
  if (p.type === "flat") return "from " + EM.formatPrice(p.price);
  if (p.type === "private-group") {
    var start = EM.startingPrice(trip);
    return "from " + EM.formatPrice(start);
  }
  if (p.type === "options") return "from " + EM.formatPrice(EM.startingPrice(trip));
  if (p.type === "driver-passenger")
    return "from " + EM.formatPrice(p.passengerPrice);
  return "";
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = EM;
}
