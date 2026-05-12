import { create } from "zustand";

export interface GigDeliverable {
  contentType: "video" | "image" | "text";
  quantity: number;
  includedItems?: string[];
}

export interface PricingState {
  basePrice: number;
  currency: "INR" | "USD";
  negotiationAllowed?: boolean;
  deliveryTimeInDays: number;
  revisionsIncluded: number;
}



interface GigCreateState {
  mode: "create" | "edit";
  setMode: (mode: "create" | "edit") => void;
  gigId: string | null;
  
  details: {
    title: string;
    shortDescription: string;
    platform: string;
    gigType: string;
    category: string;
    tags: string[];
    bannerUrl: string;
  };

  deliverables: GigDeliverable[];
  pricing: PricingState | null;

  setGigId: (id: string) => void;
  setDetails: (data: Partial<GigCreateState["details"]>) => void;
  setDeliverables: (data: GigDeliverable[]) => void;
  setPricing: (data: PricingState) => void;
  reset: () => void;
}

export const useGigCreateStore = create<GigCreateState>((set) => ({
  mode: "create",
  setMode: (mode) => set({ mode }),
  gigId: null,

  details: {
    title: "",
    shortDescription: "",
    platform: "instagram",
    gigType: "solo",
    category: "",
    tags: [],
    bannerUrl: ""
  },

  deliverables: [],
  pricing: null,

  setGigId: (id) => set({ gigId: id }),

  setDetails: (data) =>
    set((state) => ({
      details: { ...state.details, ...data }
    })),

  setDeliverables: (data) =>
    set({ deliverables: data }),

  setPricing: (data) =>
    set({ pricing: data }),



  reset: () =>
  set({
    mode: "create",
    gigId: null,
    details: {
      title: "",
      shortDescription: "",
      platform: "instagram",
      gigType: "solo",
      category: "",
      tags: [],
      bannerUrl: ""
    },
    deliverables: [],
    pricing: null
  })
}));


// import { create } from "zustand";

// interface GigCreateState {
//   gigId: string | null;

//   details: {
//     title: string;
//     shortDescription: string;
//     platform: string;
//     gigType: string;
//     category: string;
//     tags: string[];
//   };

//   deliverables: any[];
//   pricing: any;
//   availability: any;

//   setGigId: (id: string) => void;
//   setDetails: (data: Partial<GigCreateState["details"]>) => void;
//   setDeliverables: (data: any[]) => void;
//   setPricing: (data: any) => void;
//   setAvailability: (data: any) => void;
//   reset: () => void;
// }

// export const useGigCreateStore = create<GigCreateState>((set) => ({
//   gigId: null,

//   details: {
//     title: "",
//     shortDescription: "",
//     platform: "instagram",
//     gigType: "solo",
//     category: "",
//     tags: []
//   },

//   deliverables: [],
//   pricing: {},
//   availability: {},

//   setGigId: (id) => set({ gigId: id }),

//   setDetails: (data) =>
//     set((state) => ({
//       details: { ...state.details, ...data }
//     })),

//   setDeliverables: (data) =>
//     set({ deliverables: data }),

//   setPricing: (data) =>
//     set({ pricing: data }),

//   setAvailability: (data) =>
//     set({ availability: data }),

//   reset: () =>
//     set({
//       gigId: null,
//       details: {
//         title: "",
//         shortDescription: "",
//         platform: "instagram",
//         gigType: "solo",
//         category: "",
//         tags: []
//       },
//       deliverables: [],
//       pricing: {},
//       availability: {}
//     })
// }));