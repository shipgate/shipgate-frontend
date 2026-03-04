"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrackingTimeline } from "@/components/tracking/tracking-timeline";
import { TrackingMap } from "@/components/tracking/tracking-map";
import { Search, AlertCircle } from "lucide-react";
import { useAppSelector } from "@/hooks/useStore";
import { useGetShipmentByTrackingNumberQuery } from "@/store/slice/apiSlice";

export default function TrackPage() {
  const username = useAppSelector((state) => state.auth.user?.fullName);

  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(
    searchParams.get("id") || "",
  );

  const {
    data: shipmentData,
    isLoading,
    isError,
    refetch,
  } = useGetShipmentByTrackingNumberQuery(trackingNumber, {
    skip: !trackingNumber,
  });
  const [shipment, setShipment] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  // Mock shipment data - replace with real API call

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  console.log(shipmentData);

  return (
    <>
      <Navbar />

      {username}
      {username === null && (
        <div className="flex justify-center flex-col items-center gap-4 mt-12">
          <CardTitle>You need to login to track shipments</CardTitle>
          <Button className="bg-primary hover:bg-primary/90 text-white h-12 px-8 flex items-center justify-center gap-2">
            Go to Login
          </Button>
        </div>
      )}

      {username && (
        <main className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Search Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Track Your Shipment</CardTitle>
                <CardDescription>
                  Enter your tracking number to view real-time updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleTrack}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Enter tracking number (e.g., SHP-ABC123-XYZ)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="h-12 text-lg"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    onClick={() => refetch()}
                    className="bg-primary hover:bg-primary/90 text-white h-12 px-8 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Track
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Not Found Message */}
            {notFound && (
              <Card className="mb-8 border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-yellow-900">
                        Tracking number not found
                      </p>
                      <p className="text-sm text-yellow-800">
                        Please check your tracking number and try again.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipment Details */}
            {shipment && (
              <>
                {/* Header Info */}
                <Card className="mb-8">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">
                          {shipment.trackingNumber}
                        </CardTitle>
                        <CardDescription>
                          {shipment.origin} → {shipment.destination}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          shipment.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {shipment.status === "delivered"
                          ? "Delivered"
                          : "In Transit"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-foreground/60 text-sm">
                          Shipping Type
                        </p>
                        <p className="text-lg font-semibold text-foreground capitalize">
                          {shipment.shippingType === "air"
                            ? "✈️ Air Shipping"
                            : "🚢 Sea Shipping"}
                        </p>
                      </div>
                      <div>
                        <p className="text-foreground/60 text-sm">
                          Estimated Delivery
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {shipment.estimatedDelivery}
                        </p>
                      </div>
                      {shipment.weight && (
                        <div>
                          <p className="text-foreground/60 text-sm">Weight</p>
                          <p className="text-lg font-semibold text-foreground">
                            {shipment.weight}
                          </p>
                        </div>
                      )}
                      {shipment.containerType && (
                        <div>
                          <p className="text-foreground/60 text-sm">
                            Container
                          </p>
                          <p className="text-lg font-semibold text-foreground">
                            {shipment.containerType} Container
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-foreground/60 text-sm">Carrier</p>
                        <p className="text-lg font-semibold text-foreground">
                          {shipment.carrier}
                        </p>
                      </div>
                      <div>
                        <p className="text-foreground/60 text-sm">Total Cost</p>
                        <p className="text-lg font-semibold text-primary">
                          {shipment.cost}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tracking Map */}
                <TrackingMap
                  origin={shipment.origin}
                  destination={shipment.destination}
                  status={shipment.status}
                  shippingType={shipment.shippingType}
                />

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipment Timeline</CardTitle>
                    <CardDescription>Complete tracking history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TrackingTimeline events={shipment.timeline} />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      )}
    </>
  );
}
