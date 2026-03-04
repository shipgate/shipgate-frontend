import { create } from "zustand";
import { getAuthToken } from "../authStore";
import { apiRequest } from "../apiclient";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type ShippingPayload = {
  shippingMethod: number;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  itemDescription: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
};

interface ShipmentState {
  shipment: any | null;
  isLoading: boolean;
  errorMessage: string | null;
  createShipment: (payload: ShippingPayload) => Promise<any>;
}

const token = getAuthToken();

export const createShipmentStore = create<ShipmentState>((set) => ({
  shipment: null,
  isLoading: false,
  errorMessage: null,
  // onSuccess: (onSuccess: () => void) => {
  //   onSuccess();
  // },
  // onError: (onError: () => void) => {
  //   onError();
  // },
  /* CREATE SHIPMENT */
  createShipment: async (payload: ShippingPayload) => {
    set({ isLoading: true, errorMessage: null });

    try {
      const res = await apiRequest(`${apiUrl}/shipments`, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        console.log(res);
        const errorData = await res.json();
        console.error("BACKEND CREATE SHIPMENT ERROR:", errorData);

        throw new Error(
          errorData.message || errorData.error || JSON.stringify(errorData)
        );
      }

      const data = await res.json();

      set({
        shipment: data.shipment || null,
        isLoading: false,
      });

      return data;
    } catch (err) {
      console.error("CREATE SHIPMENT CATCH:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Create shipment failed";
      set({ errorMessage: errorMessage, isLoading: false });
      throw err;
    }
  },
}));
