import { createBrowserRouter } from "react-router";
import { AnimatedLayout } from "./components/AnimatedLayout";
import { BudgetScreen } from "./pages/BudgetScreen";
import { FlatTypeScreen } from "./pages/FlatTypeScreen";
import { AmenitiesScreen } from "./pages/AmenitiesScreen";
import { LocationSearchInit } from "./pages/LocationSearchInit";
import { LocationSearchActive } from "./pages/LocationSearchActive";
import { SelectedLocations } from "./pages/SelectedLocations";
import { PreferencesScreen } from "./pages/PreferencesScreen";
import { ListingsPage } from "./pages/ListingsPage";
import { ListingDetail } from "./pages/ListingDetail";
import { SavedScreen } from "./pages/SavedScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AnimatedLayout,
    children: [
      { index: true,             Component: BudgetScreen          },
      { path: "flat-type",       Component: FlatTypeScreen        },
      { path: "amenities",       Component: AmenitiesScreen       },
      { path: "location",        Component: LocationSearchInit    },
      { path: "search-active",   Component: LocationSearchActive  },
      { path: "selected-locations", Component: SelectedLocations  },
      { path: "preferences",     Component: PreferencesScreen     },
      { path: "listings",        Component: ListingsPage          },
      { path: "listings/:id",    Component: ListingDetail         },
      { path: "saved",           Component: SavedScreen           },
    ],
  },
]);