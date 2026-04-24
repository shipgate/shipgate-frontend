"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin } from "lucide-react";
import {
  useGetCourierDeliveriesQuery,
  useUpdateCourierShipmentStatusMutation,
} from "@/store/slice/apiSlice";

export default function CourierUpdateDelivery() {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState<any | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const { data: courierData, isLoading: isLoadingCourier } =
    useGetCourierDeliveriesQuery({});
  const [
    onUpdateCourierStatus,
    { data: courierStatusData, isLoading: isLoadingCourierStatus },
  ] = useUpdateCourierShipmentStatusMutation();

  const deliveryStatuses = ["OutForDelivery", "Delivered", "FailedDelivery"];

  const handleConfirm = () => {
    if (selectedDelivery && selectedStatus) {
      onUpdateCourierStatus({
        trackingId: deliveryDetails?.id,
        status: selectedStatus,
      });
    }
  };

  useEffect(() => {
    setSelectedDelivery(null);
    setSelectedStatus("");
  }, [courierStatusData]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Update Delivery Status
        </h1>
        <p className="text-foreground/60">
          Update status of assigned deliveries
        </p>
      </div>

      {isLoadingCourier && <p>...loading courier</p>}
      {/* Update Form */}
      {selectedDelivery && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle>{selectedDelivery}</CardTitle>
            <CardDescription>Update delivery status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Delivery Details */}
            {deliveryDetails && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-foreground/60">Customer</p>
                  <p className="font-semibold text-foreground">
                    {deliveryDetails.customer}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60">Phone</p>
                  <p className="font-semibold text-foreground">
                    {deliveryDetails.phone}
                  </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-foreground/60">Address</p>
                  <p className="font-semibold text-foreground text-sm">
                    {deliveryDetails.address}
                  </p>
                </div>
              </div>
            )}

            {/* Status Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                Delivery Status
              </label>
              <div className="grid grid-cols-1 gap-3">
                {deliveryStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedStatus === status
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground capitalize">
                      {status.replace(/_/g, " ")}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleConfirm}
                disabled={!selectedStatus || isLoadingCourierStatus}
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-semibold"
              >
                {isLoadingCourierStatus
                  ? "...updating status Update"
                  : "Confirm Status Update"}
              </Button>
            </div>

            {courierStatusData && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">
                    Delivery status updated
                  </p>
                  <p className="text-sm text-green-800">
                    Customer has been notified
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Assigned Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Deliveries</CardTitle>
          <CardDescription>
            Click on a delivery to update its status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courierData?.map((delivery) => (
              <button
                key={delivery.id}
                onClick={() => {
                  setSelectedDelivery(delivery.id);
                  setDeliveryDetails(delivery);
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedDelivery === delivery.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">
                        {delivery.id}
                      </p>
                      <Badge variant="outline">{delivery.status}</Badge>
                    </div>
                    <p className="text-sm text-foreground/60">
                      {delivery.customer}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-foreground/60">
                      <MapPin className="w-4 h-4" />
                      {delivery.address}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
