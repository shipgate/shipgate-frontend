"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import {
  useAssignMultipleCourierMutation,
  useGetCourierWithShipmentQuery,
  useGetWarehouseShipmentQuery,
} from "@/store/slice/apiSlice";

export default function AssignCouriers() {
  const [onAssignCourier] = useAssignMultipleCourierMutation();
  const { data: warehouseShipmentData, isLoading: isLoadingWarehouseShipment } =
    useGetWarehouseShipmentQuery({});
  const { data: assignedCourierData, isLoading: isLoadingAssignedCourier } =
    useGetCourierWithShipmentQuery({});
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [assignmentComplete, setAssignmentComplete] = useState(false);

  console.log({ warehouseShipmentData: warehouseShipmentData?.data?.data });

  const toggleShipment = (id: string) => {
    setSelectedShipments((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleAssign = () => {
    if (selectedShipments.length > 0 && selectedCourier) {
      console.log(
        `[v0] Assigning ${selectedShipments.length} shipments to courier ${selectedCourier}`,
      );
      onAssignCourier({
        trackingNumber: selectedShipments,
        courierUserId: selectedCourier,
      });

      setAssignmentComplete(true);
      setTimeout(() => {
        setAssignmentComplete(false);
        setSelectedShipments([]);
        setSelectedCourier(null);
      }, 2000);
    }
  };

  console.log(assignedCourierData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Assign Shipments to Couriers
        </h1>
        <p className="text-foreground/60">
          Select home delivery shipments and assign to a courier
        </p>
      </div>
      {isLoadingWarehouseShipment ||
        (isLoadingAssignedCourier && (
          <p className="text-foreground/60">Loading data...</p>
        ))}

      {/* Couriers Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Courier</CardTitle>
          <CardDescription>
            Choose a courier to assign the selected shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedCourierData?.data?.map((courier) => (
              <button
                key={courier?.courierId}
                onClick={() => setSelectedCourier(courier?.courierId)}
                className={`p-4 border-2 rounded-lg transition-all text-left ${
                  selectedCourier === courier?.courierId
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-semibold text-foreground">
                  {courier?.fullName}
                </p>
                <p className="text-sm text-foreground/60 mb-3">
                  {courier?.phoneNumber}
                </p>
                <Badge variant="outline">{courier?.shipments} assigned</Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Home Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Home Delivery Shipments at Warehouse</CardTitle>
          <CardDescription>
            Select shipments to assign to the selected courier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {warehouseShipmentData?.data?.data.map((shipment) => (
              <button
                key={shipment.id}
                onClick={() => toggleShipment(shipment.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedShipments.includes(shipment.id)
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">
                        {shipment.trackingNumber}
                      </p>
                      <Badge variant="outline">{shipment.status}</Badge>
                    </div>
                    <p className="text-sm text-foreground/60 capitalize">
                      {shipment.recipientName}
                    </p>
                    <p className="text-sm text-foreground/60 mt-1">
                      {shipment.recipientCity}, {shipment.recipientState}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-foreground/60">
                    {shipment.item.weightKg}kg
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Assign Button */}
          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleAssign}
              disabled={selectedShipments.length === 0 || !selectedCourier}
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-semibold"
            >
              Assign{" "}
              {selectedShipments.length > 0
                ? `${selectedShipments.length} Shipment(s)`
                : "Shipments"}{" "}
              to Courier
            </Button>
            {(!selectedCourier || selectedShipments.length === 0) && (
              <p className="text-sm text-foreground/60 mt-2">
                {!selectedCourier && "Please select a courier"}{" "}
                {selectedShipments.length === 0 && "Please select shipments"}
              </p>
            )}
          </div>

          {assignmentComplete && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">
                  Shipments assigned successfully
                </p>
                <p className="text-sm text-green-800">
                  Courier has been notified
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
