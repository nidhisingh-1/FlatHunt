export interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
  priority: 'Must be close' | 'Important' | 'Flexible';
}

export type InspectionStatus = 'verified' | 'requested' | 'none';

export interface Listing {
  id: string;
  title: string;
  price: string;
  rentType: 'per month';
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: string;
  furnishing: string;
  societyType: string;
  distances: {
    office: string;
    friend: string;
    gym: string;
  };
  postedBy: 'broker' | 'owner';
  trueMoveIn: string;
  inspected: string;
  inspectionStatus: InspectionStatus;
  amenities: string[];
  details: {
    built: string;
    lastPainted: string;
    previousTenants: number;
    lastInspected: string;
  };
  locality: string;
  distanceFromPreferred: string;
  lastMile: string[];
  reviews: {
    rating: number;
    text: string;
    author: string;
    type: string;
  }[];
  brokerFree: boolean;
  photosVerified: boolean;
  ownerVerified: boolean;
  postedDaysAgo: number;
  ownerReplyTime: string;
  activityStats: string;
}

/* ── Image shorthand URLs ── */
const IMG = {
  A: 'https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  B: 'https://images.unsplash.com/photo-1759722668087-efcc63c91ed2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  C: 'https://images.unsplash.com/photo-1774716925737-2618ea7ebc50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  D: 'https://images.unsplash.com/photo-1766200356993-0095280cc10b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  E: 'https://images.unsplash.com/photo-1600592858560-9fef0f602f40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  F: 'https://images.unsplash.com/photo-1721825171356-1b92dd73bfd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  G: 'https://images.unsplash.com/photo-1664190053321-4ef213299eec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  H: 'https://images.unsplash.com/photo-1746700060416-5b7100d33618?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  I: 'https://images.unsplash.com/photo-1682662046610-fbdb3db4bd74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  J: 'https://images.unsplash.com/photo-1585128792103-0b591f96512e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  K: 'https://images.unsplash.com/photo-1758555226274-7b9f5c220b64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  L: 'https://images.unsplash.com/photo-1713799210416-593f9734af6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  M: 'https://images.unsplash.com/photo-1633429083846-376f1b9737a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  N: 'https://images.unsplash.com/photo-1728488442735-861ca8e30c77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  O: 'https://images.unsplash.com/photo-1619439676908-4d89f6353cc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  P: 'https://images.unsplash.com/photo-1721738854631-fd100dbdd0c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
};

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Google Ananta, Mahadevpura, East Bengalur',
    type: 'Workplace',
    address: 'Mahadevpura, East Bengaluru, Karnataka',
    priority: 'Must be close',
  },
  {
    id: '2',
    name: 'House no. 232, Lake View Apartments, H...',
    type: 'Friend',
    address: 'Lake View Apartments, HSR',
    priority: 'Important',
  },
  {
    id: '3',
    name: 'Cult Fit, Mahadevpura, 16th Main road',
    type: 'GYM',
    address: 'Mahadevpura, 16th Main road',
    priority: 'Flexible',
  }
];

export const mockListings: Listing[] = [
  /* ── 1 — VERIFIED ── */
  {
    id: '1',
    title: '2 BHK in HSR Layout, Sec-6',
    price: '₹30,000',
    rentType: 'per month',
    images: [IMG.A, IMG.B, IMG.C, IMG.D],
    bedrooms: 2, bathrooms: 2, area: '1200 Sqft',
    furnishing: 'Semi Furnished', societyType: 'Gated Society',
    distances: { office: '11.5km', friend: '1.2km', gym: '14km' },
    postedBy: 'broker',
    trueMoveIn: '₹87,000',
    inspected: 'April 2026', inspectionStatus: 'verified',
    amenities: ['Parking', 'Gas Pipeline', 'Fully-Furnished', 'Lift', 'Power Backup', 'Battery Charger', 'Solar Panels', 'Washing Area'],
    details: { built: '2010', lastPainted: 'November 2025', previousTenants: 4, lastInspected: 'January 2026' },
    locality: 'HSR Layout', distanceFromPreferred: '9.8 KM',
    lastMile: ['Blinkit', 'Zepto', 'Zomato', 'Pronto', 'Urban Clap'],
    reviews: [
      { rating: 5, text: 'The flat is well-located and has good natural lighting. Very comfortable.', author: 'Sakshi', type: 'Tenant (Jan \'24 - Jan \'26)' },
      { rating: 4, text: 'Great locality and friendly neighbours. Water supply is consistent.', author: 'Rahul', type: 'Neighbour' },
    ],
    brokerFree: false, photosVerified: true, ownerVerified: false,
    postedDaysAgo: 8, ownerReplyTime: 'typically 4 hours',
    activityStats: '12 queries, 6 visits scheduled this week',
  },

  /* ── 2 — VERIFIED ── */
  {
    id: '2',
    title: '2 BHK in HSR Layout, Sec-6',
    price: '₹30,000',
    rentType: 'per month',
    images: [IMG.E, IMG.F, IMG.G, IMG.D],
    bedrooms: 2, bathrooms: 2, area: '1450 Sqft',
    furnishing: 'Fully Furnished', societyType: 'Standalone Building',
    distances: { office: '11.5km', friend: '1.2km', gym: '14km' },
    postedBy: 'owner',
    trueMoveIn: '₹87,000',
    inspected: 'April 2026', inspectionStatus: 'verified',
    amenities: ['Parking', 'Fully-Furnished', 'Lift', 'Power Backup', 'Washing Area'],
    details: { built: '2015', lastPainted: 'August 2025', previousTenants: 2, lastInspected: 'March 2026' },
    locality: 'HSR Layout', distanceFromPreferred: '10.2 KM',
    lastMile: ['Blinkit', 'Zepto', 'Zomato', 'Urban Clap'],
    reviews: [
      { rating: 5, text: 'The flat is well-located and has good natural lighting. Very comfortable.', author: 'Sakshi', type: 'Tenant (Jan \'24 - Jan \'26)' },
    ],
    brokerFree: true, photosVerified: true, ownerVerified: true,
    postedDaysAgo: 2, ownerReplyTime: 'typically 1 hour',
    activityStats: '24 queries, 10 visits scheduled this week',
  },

  /* ── 3 — VERIFIED ── */
  {
    id: '3',
    title: '1 BHK in Koramangala, 4th Block',
    price: '₹22,000',
    rentType: 'per month',
    images: [IMG.P, IMG.I, IMG.K, IMG.L],
    bedrooms: 1, bathrooms: 1, area: '680 Sqft',
    furnishing: 'Semi Furnished', societyType: 'Gated Society',
    distances: { office: '6.2km', friend: '3.8km', gym: '2.1km' },
    postedBy: 'owner',
    trueMoveIn: '₹62,000',
    inspected: 'March 2026', inspectionStatus: 'verified',
    amenities: ['Parking', 'Gas Pipeline', 'Lift', 'Power Backup', 'Washing Area'],
    details: { built: '2018', lastPainted: 'January 2026', previousTenants: 1, lastInspected: 'March 2026' },
    locality: 'Koramangala', distanceFromPreferred: '6.2 KM',
    lastMile: ['Blinkit', 'Swiggy', 'Zepto'],
    reviews: [
      { rating: 5, text: 'Perfect for a single professional. Very clean and well maintained.', author: 'Arjun', type: 'Tenant (Apr \'25 - Mar \'26)' },
    ],
    brokerFree: true, photosVerified: true, ownerVerified: true,
    postedDaysAgo: 5, ownerReplyTime: 'typically 30 min',
    activityStats: '18 queries, 8 visits scheduled this week',
  },

  /* ── 4 — VERIFIED ── */
  {
    id: '4',
    title: '2 BHK in Indiranagar, 12th Main',
    price: '₹35,000',
    rentType: 'per month',
    images: [IMG.H, IMG.E, IMG.C, IMG.D],
    bedrooms: 2, bathrooms: 2, area: '1100 Sqft',
    furnishing: 'Semi Furnished', societyType: 'Gated Society',
    distances: { office: '8.4km', friend: '5.1km', gym: '3.4km' },
    postedBy: 'owner',
    trueMoveIn: '₹98,000',
    inspected: 'March 2026', inspectionStatus: 'verified',
    amenities: ['Parking', 'Gas Pipeline', 'Lift', 'Power Backup', 'Washing Area', 'CCTV'],
    details: { built: '2016', lastPainted: 'October 2025', previousTenants: 3, lastInspected: 'March 2026' },
    locality: 'Indiranagar', distanceFromPreferred: '8.4 KM',
    lastMile: ['Blinkit', 'Zepto', 'Zomato', 'Urban Clap'],
    reviews: [
      { rating: 4, text: 'Great area, lovely street below. Slightly pricey but worth it for the location.', author: 'Neha', type: 'Tenant' },
    ],
    brokerFree: false, photosVerified: true, ownerVerified: true,
    postedDaysAgo: 11, ownerReplyTime: 'typically 2 hours',
    activityStats: '9 queries, 4 visits scheduled this week',
  },

  /* ── 5 — VERIFIED ── */
  {
    id: '5',
    title: '3 BHK in Whitefield, EPIP Zone',
    price: '₹45,000',
    rentType: 'per month',
    images: [IMG.N, IMG.B, IMG.K, IMG.L],
    bedrooms: 3, bathrooms: 3, area: '1800 Sqft',
    furnishing: 'Fully Furnished', societyType: 'Gated Society',
    distances: { office: '4.8km', friend: '12.1km', gym: '5.2km' },
    postedBy: 'owner',
    trueMoveIn: '₹1,28,000',
    inspected: 'February 2026', inspectionStatus: 'verified',
    amenities: ['Parking', 'Gas Pipeline', 'Fully-Furnished', 'Lift', 'Power Backup', 'Solar Panels', 'Society Pool', 'Clubhouse'],
    details: { built: '2019', lastPainted: 'December 2025', previousTenants: 1, lastInspected: 'February 2026' },
    locality: 'Whitefield', distanceFromPreferred: '4.8 KM',
    lastMile: ['Blinkit', 'Zepto', 'Zomato', 'Urban Clap'],
    reviews: [
      { rating: 5, text: 'Spacious, modern and the society has great amenities. Owner is very responsive.', author: 'Kiran', type: 'Tenant' },
      { rating: 5, text: 'Best flat I\'ve lived in. The pool and gym in the society are an absolute bonus.', author: 'Shalini', type: 'Tenant' },
    ],
    brokerFree: true, photosVerified: true, ownerVerified: true,
    postedDaysAgo: 3, ownerReplyTime: 'typically 45 min',
    activityStats: '31 queries, 14 visits scheduled this week',
  },

  /* ── 6 — VERIFIED ── */
  {
    id: '6',
    title: 'Studio in Marathahalli',
    price: '₹18,000',
    rentType: 'per month',
    images: [IMG.J, IMG.I, IMG.K, IMG.L],
    bedrooms: 1, bathrooms: 1, area: '450 Sqft',
    furnishing: 'Fully Furnished', societyType: 'Standalone Building',
    distances: { office: '7.0km', friend: '9.4km', gym: '1.2km' },
    postedBy: 'broker',
    trueMoveIn: '₹51,500',
    inspected: 'April 2026', inspectionStatus: 'verified',
    amenities: ['Lift', 'Power Backup', 'Washing Area', 'CCTV'],
    details: { built: '2020', lastPainted: 'February 2026', previousTenants: 2, lastInspected: 'April 2026' },
    locality: 'Marathahalli', distanceFromPreferred: '7.0 KM',
    lastMile: ['Blinkit', 'Swiggy'],
    reviews: [
      { rating: 4, text: 'Compact but perfectly laid out. Good for someone who works from home.', author: 'Dev', type: 'Tenant' },
    ],
    brokerFree: false, photosVerified: true, ownerVerified: false,
    postedDaysAgo: 6, ownerReplyTime: 'typically 3 hours',
    activityStats: '7 queries, 3 visits scheduled this week',
  },

  /* ── 7 — VERIFIED ── */
  {
    id: '7',
    title: '2 BHK in Bellandur, Near Outer Ring',
    price: '₹28,000',
    rentType: 'per month',
    images: [IMG.H, IMG.I, IMG.C, IMG.D],
    bedrooms: 2, bathrooms: 2, area: '1050 Sqft',
    furnishing: 'Semi Furnished', societyType: 'Gated Society',
    distances: { office: '5.3km', friend: '7.8km', gym: '4.0km' },
    postedBy: 'owner',
    trueMoveIn: '₹79,500',
    inspected: 'March 2026', inspectionStatus: 'verified',
    amenities: ['Parking', 'Lift', 'Power Backup', 'Washing Area', 'CCTV', 'Security Guard'],
    details: { built: '2017', lastPainted: 'September 2025', previousTenants: 3, lastInspected: 'March 2026' },
    locality: 'Bellandur', distanceFromPreferred: '5.3 KM',
    lastMile: ['Blinkit', 'Zepto', 'Zomato'],
    reviews: [
      { rating: 4, text: 'Great location near the ORR. Society is well maintained and peaceful.', author: 'Pooja', type: 'Tenant' },
    ],
    brokerFree: true, photosVerified: true, ownerVerified: true,
    postedDaysAgo: 14, ownerReplyTime: 'typically 2 hours',
    activityStats: '11 queries, 5 visits scheduled this week',
  },

  /* ── 8 — VERIFIED ── */
  {
    id: '8',
    title: '1 BHK in BTM Layout, Sec-2',
    price: '₹20,000',
    rentType: 'per month',
    images: [IMG.M, IMG.B, IMG.O, IMG.L],
    bedrooms: 1, bathrooms: 1, area: '720 Sqft',
    furnishing: 'Semi Furnished', societyType: 'Standalone Building',
    distances: { office: '9.1km', friend: '2.3km', gym: '1.8km' },
    postedBy: 'owner',
    trueMoveIn: '₹57,000',
    inspected: 'April 2026', inspectionStatus: 'verified',
    amenities: ['Parking', 'Gas Pipeline', 'Power Backup', 'Washing Area'],
    details: { built: '2014', lastPainted: 'July 2025', previousTenants: 5, lastInspected: 'April 2026' },
    locality: 'BTM Layout', distanceFromPreferred: '9.1 KM',
    lastMile: ['Blinkit', 'Swiggy', 'Zepto'],
    reviews: [
      { rating: 4, text: 'Very affordable for the size. Owner is helpful and maintenance is prompt.', author: 'Manisha', type: 'Tenant' },
    ],
    brokerFree: true, photosVerified: true, ownerVerified: false,
    postedDaysAgo: 4, ownerReplyTime: 'typically 1 hour',
    activityStats: '16 queries, 7 visits scheduled this week',
  },

  /* ── 9 — VERIFIED ── */
  {
    id: '9',
    title: '2 BHK in Sarjapur Road, Syn...',
    price: '₹32,000',
    rentType: 'per month',
    images: [IMG.P, IMG.E, IMG.K, IMG.D],
    bedrooms: 2, bathrooms: 2, area: '1150 Sqft',
    furnishing: 'Semi Furnished', societyType: 'Gated Society',
    distances: { office: '6.8km', friend: '8.5km', gym: '3.1km' },
    postedBy: 'broker',
    trueMoveIn: '₹91,500',
    inspected: 'February 2026', inspectionStatus: 'verified',
    amenities: ['Parking', 'Lift', 'Power Backup', 'Washing Area', 'CCTV', 'Children Play Area'],
    details: { built: '2018', lastPainted: 'November 2025', previousTenants: 2, lastInspected: 'February 2026' },
    locality: 'Sarjapur Road', distanceFromPreferred: '6.8 KM',
    lastMile: ['Blinkit', 'Zepto', 'Zomato'],
    reviews: [
      { rating: 3, text: 'Decent flat but traffic on Sarjapur Road can be hectic during peak hours.', author: 'Vikram', type: 'Tenant' },
    ],
    brokerFree: false, photosVerified: true, ownerVerified: true,
    postedDaysAgo: 18, ownerReplyTime: 'typically 5 hours',
    activityStats: '8 queries, 2 visits scheduled this week',
  },

  /* ── 10 — VERIFIED ── */
  {
    id: '10',
    title: '3 BHK in JP Nagar, 7th Phase',
    price: '₹42,000',
    rentType: 'per month',
    images: [IMG.N, IMG.I, IMG.C, IMG.L],
    bedrooms: 3, bathrooms: 2, area: '1650 Sqft',
    furnishing: 'Fully Furnished', societyType: 'Gated Society',
    distances: { office: '13.2km', friend: '4.6km', gym: '2.8km' },
    postedBy: 'owner',
    trueMoveIn: '₹1,20,000',
    inspected: 'January 2026', inspectionStatus: 'verified',
    amenities: ['Parking', 'Gas Pipeline', 'Fully-Furnished', 'Lift', 'Power Backup', 'Washing Area', 'Solar Panels'],
    details: { built: '2013', lastPainted: 'October 2025', previousTenants: 6, lastInspected: 'January 2026' },
    locality: 'JP Nagar', distanceFromPreferred: '13.2 KM',
    lastMile: ['Blinkit', 'Zepto', 'Zomato', 'Urban Clap'],
    reviews: [
      { rating: 5, text: 'Huge flat for the price. JP Nagar 7th Phase is super green and calm.', author: 'Rohit', type: 'Tenant' },
    ],
    brokerFree: true, photosVerified: true, ownerVerified: true,
    postedDaysAgo: 7, ownerReplyTime: 'typically 2 hours',
    activityStats: '22 queries, 9 visits scheduled this week',
  },

  /* ── 11 — VERIFIED ── */
  {
    id: '11',
    title: '1 RK in Koramangala, 5th Block',
    price: '₹15,000',
    rentType: 'per month',
    images: [IMG.M, IMG.J, IMG.K, IMG.D],
    bedrooms: 1, bathrooms: 1, area: '320 Sqft',
    furnishing: 'Fully Furnished', societyType: 'Standalone Building',
    distances: { office: '7.5km', friend: '4.2km', gym: '2.5km' },
    postedBy: 'owner',
    trueMoveIn: '₹42,500',
    inspected: 'April 2026', inspectionStatus: 'verified',
    amenities: ['Power Backup', 'Washing Area', 'CCTV'],
    details: { built: '2012', lastPainted: 'March 2026', previousTenants: 8, lastInspected: 'April 2026' },
    locality: 'Koramangala', distanceFromPreferred: '7.5 KM',
    lastMile: ['Blinkit', 'Swiggy'],
    reviews: [
      { rating: 4, text: 'Tiny but cozy. Perfect for a student or young working professional on a budget.', author: 'Tanya', type: 'Tenant' },
    ],
    brokerFree: true, photosVerified: true, ownerVerified: true,
    postedDaysAgo: 1, ownerReplyTime: 'typically 20 min',
    activityStats: '34 queries, 12 visits scheduled this week',
  },

  /* ── 12 — VERIFIED ── */
  {
    id: '12',
    title: '2 BHK in Electronic City, Phase 1',
    price: '₹26,000',
    rentType: 'per month',
    images: [IMG.A, IMG.B, IMG.O, IMG.L],
    bedrooms: 2, bathrooms: 2, area: '1080 Sqft',
    furnishing: 'Semi Furnished', societyType: 'Gated Society',
    distances: { office: '3.1km', friend: '14.7km', gym: '1.9km' },
    postedBy: 'broker',
    trueMoveIn: '₹74,000',
    inspected: 'March 2026', inspectionStatus: 'verified',
    amenities: ['Parking', 'Lift', 'Power Backup', 'Washing Area', 'CCTV', 'Security Guard'],
    details: { built: '2016', lastPainted: 'August 2025', previousTenants: 3, lastInspected: 'March 2026' },
    locality: 'Electronic City', distanceFromPreferred: '3.1 KM',
    lastMile: ['Blinkit', 'Zepto', 'Zomato'],
    reviews: [
      { rating: 4, text: 'Super close to the tech park. Metro connectivity is a big plus.', author: 'Anand', type: 'Tenant' },
    ],
    brokerFree: false, photosVerified: true, ownerVerified: false,
    postedDaysAgo: 9, ownerReplyTime: 'typically 3 hours',
    activityStats: '14 queries, 6 visits scheduled this week',
  },

  /* ── 13 — INSPECTION REQUESTED ── */
  {
    id: '13',
    title: '2 BHK in Hebbal, Outer Ring Road',
    price: '₹31,000',
    rentType: 'per month',
    images: [IMG.H, IMG.E, IMG.K, IMG.D],
    bedrooms: 2, bathrooms: 2, area: '1120 Sqft',
    furnishing: 'Semi Furnished', societyType: 'Gated Society',
    distances: { office: '10.4km', friend: '6.7km', gym: '3.8km' },
    postedBy: 'owner',
    trueMoveIn: '₹88,000',
    inspected: '', inspectionStatus: 'requested',
    amenities: ['Parking', 'Gas Pipeline', 'Lift', 'Power Backup', 'Washing Area'],
    details: { built: '2017', lastPainted: 'June 2025', previousTenants: 2, lastInspected: 'Pending' },
    locality: 'Hebbal', distanceFromPreferred: '10.4 KM',
    lastMile: ['Blinkit', 'Zepto', 'Zomato'],
    reviews: [],
    brokerFree: true, photosVerified: false, ownerVerified: true,
    postedDaysAgo: 2, ownerReplyTime: 'typically 2 hours',
    activityStats: '6 queries, 1 visit scheduled this week',
  },

  /* ── 14 — INSPECTION REQUESTED ── */
  {
    id: '14',
    title: '1 BHK in Yelahanka, New Town',
    price: '₹19,000',
    rentType: 'per month',
    images: [IMG.M, IMG.I, IMG.O, IMG.L],
    bedrooms: 1, bathrooms: 1, area: '700 Sqft',
    furnishing: 'Unfurnished', societyType: 'Standalone Building',
    distances: { office: '16.0km', friend: '11.3km', gym: '5.5km' },
    postedBy: 'broker',
    trueMoveIn: '₹54,500',
    inspected: '', inspectionStatus: 'requested',
    amenities: ['Parking', 'Power Backup', 'Washing Area'],
    details: { built: '2015', lastPainted: 'May 2025', previousTenants: 4, lastInspected: 'Pending' },
    locality: 'Yelahanka', distanceFromPreferred: '16.0 KM',
    lastMile: ['Swiggy', 'Zepto'],
    reviews: [],
    brokerFree: false, photosVerified: false, ownerVerified: false,
    postedDaysAgo: 1, ownerReplyTime: 'typically 6 hours',
    activityStats: '3 queries this week',
  },

  /* ── 15 — NOT INSPECTED ── */
  {
    id: '15',
    title: '3 BHK in Bannerghatta Road',
    price: '₹48,000',
    rentType: 'per month',
    images: [IMG.N, IMG.B, IMG.C, IMG.D],
    bedrooms: 3, bathrooms: 3, area: '1900 Sqft',
    furnishing: 'Unfurnished', societyType: 'Gated Society',
    distances: { office: '15.8km', friend: '9.2km', gym: '6.1km' },
    postedBy: 'broker',
    trueMoveIn: '₹1,35,000',
    inspected: '', inspectionStatus: 'none',
    amenities: ['Parking', 'Lift', 'Power Backup', 'CCTV'],
    details: { built: '2021', lastPainted: 'April 2025', previousTenants: 0, lastInspected: 'Not Inspected' },
    locality: 'Bannerghatta Road', distanceFromPreferred: '15.8 KM',
    lastMile: ['Blinkit', 'Zepto', 'Zomato'],
    reviews: [],
    brokerFree: false, photosVerified: false, ownerVerified: false,
    postedDaysAgo: 0, ownerReplyTime: 'typically 8 hours',
    activityStats: '2 queries this week',
  },
];
