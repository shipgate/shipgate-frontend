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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import {
  useGetShipmentByIdQuery,
  useShipmentPendingUpdateQuery,
  useUpdateShipmentStatusMutation,
} from "@/store/slice/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";

export default function StaffStatusUpdates() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [submitedId, setSubmitedId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [
    handleShipmentUpdate,
    { data: shipmentData, isLoading: isLoadingShipmentUpdate, isSuccess },
  ] = useUpdateShipmentStatusMutation();

  const { data: pendingShipmentData, isLoading } = useGetShipmentByIdQuery(
    submitedId ?? skipToken,
  );

  const statusOptions = {
    air: [
      "package_received",
      "in_airport_customs",
      "in_flight",
      "arriving_soon",
      "pending_delivery",
    ],
    sea: [
      "cargo_received",
      "port_departure",
      "at_sea",
      "port_arrival",
      "delivered",
    ],
  };

  useEffect(() => {
    if (pendingShipmentData) {
      setTrackingNumber("");
    }

    if (shipmentData) {
      setTrackingNumber("");
      setSelectedStatus("");
    }
  }, [pendingShipmentData, shipmentData]);

  const handleSearch = () => {
    setSubmitedId(trackingNumber);
  };

  const handleConfirm = () => {
    if (selectedStatus) {
      handleShipmentUpdate({
        status: selectedStatus,
        trackingNumber: pendingShipmentData?.id,
      });
    }
  };

  const currentOptions = pendingShipmentData
    ? statusOptions[pendingShipmentData?.type as keyof typeof statusOptions]
    : [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Update Tracking Status
        </h1>
        <p className="text-foreground/60">
          Search shipments and update their tracking status
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Shipment</CardTitle>
          <CardDescription>
            Enter tracking number to find shipment
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Input
            placeholder="e.g., SHP-2024-001"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="h-12"
          />
          <Button
            onClick={handleSearch}
            disabled={!trackingNumber || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? "...loading" : "Search"}
          </Button>
        </CardContent>
      </Card>

      {/* Shipment Details & Status Update */}
      {pendingShipmentData && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{pendingShipmentData.id}</CardTitle>
                <CardDescription>
                  {pendingShipmentData.customer}
                </CardDescription>
              </div>
              <Badge>{pendingShipmentData.type.toUpperCase()}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Current Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-foreground/60">Current Status</p>
                <p className="font-semibold text-foreground capitalize">
                  {pendingShipmentData.current.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground/60">Location</p>
                <p className="font-semibold text-foreground">
                  {pendingShipmentData.location}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground/60">Weight</p>
                <p className="font-semibold text-foreground">
                  {pendingShipmentData.weight}
                </p>
              </div>
              {pendingShipmentData?.container && (
                <div>
                  <p className="text-xs text-foreground/60">Container</p>
                  <p className="font-semibold text-foreground">
                    {pendingShipmentData?.container}
                  </p>
                </div>
              )}
            </div>

            {/* Status Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                Update to New Status
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedStatus === status
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold text-foreground text-sm capitalize">
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
                disabled={!selectedStatus}
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-semibold"
              >
                {isLoadingShipmentUpdate
                  ? "...updating status"
                  : "Confirm Status Update"}
              </Button>
            </div>

            {isSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">
                    Status updated successfully
                  </p>
                  <p className="text-sm text-green-800">
                    Tracking timeline has been updated
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
