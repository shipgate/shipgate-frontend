import { create } from "zustand";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ShipmentState {
  shipmentData: any | null;
  isLoading: boolean;
  errorMessage: string | null;
  getShipment: () => Promise<any>;
}

export const getShipmentStore = create<ShipmentState>((set) => ({
  shipmentData: null,
  isLoading: false,
  errorMessage: null,
  getShipment: async () => {
    set({ isLoading: true, errorMessage: null });

    try {
      const res = await fetch(`${apiUrl}/shipments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("BACKEND CREATE SHIPMENT ERROR:", errorData);

        throw new Error(
          errorData.message || errorData.error || JSON.stringify(errorData)
        );
      }

      const data = await res.json();

      set({
        shipmentData: data.shipment || null,
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
