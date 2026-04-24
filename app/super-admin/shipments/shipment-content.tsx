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
import { Search, Check } from "lucide-react";
import {
  useAssignCourierMutation,
  useGetAdminShipmentQuery,
  useGetAllCourierUsersQuery,
  useUpdateAssignCourierMutation,
  useUpdateShipmentPriceMutation,
} from "@/store/slice/apiSlice";

export default function ShipmentsContent() {
  const [selectedCourier, setSelectedCourier] = useState("");

  const [selectedShipmentForCourier, setSelectedShipmentForCourier] = useState<
    string | null
  >(null);
  const [showCourierModal, setShowCourierModal] = useState(false);

  const [
    onShipmentPriceUpdate,
    { data: shipmentResult, isLoading: isLoadingPriceUpdate },
  ] = useUpdateShipmentPriceMutation();
  const { data, isLoading, refetch } = useGetAdminShipmentQuery({});

  const [
    onShipmentCourierUpdate,
    { data: shipmentCourierResult, isLoading: isUpdatingCourier },
  ] = useAssignCourierMutation();

  const { data: courierData, isLoading: isLoadingCourier } =
    useGetAllCourierUsersQuery({});

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [shipmentToPriceId, setShipmentToPriceId] = useState<string | null>(
    null,
  );
  const [assignedPrice, setAssignedPrice] = useState("");

  const filteredShipments = data?.data?.filter((shipment: any) => {
    const matchesSearch =
      shipment.id.includes(searchTerm.toUpperCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || shipment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  console.log(data, filteredShipments);

  useEffect(() => {
    if (shipmentResult) {
      setShowPriceModal(false);
      setAssignedPrice("");
      setShipmentToPriceId(null);
      refetch();
    }
  }, [shipmentResult, shipmentCourierResult]);

  const handlePriceAssignment = () => {
    if (shipmentToPriceId && assignedPrice) {
      console.log(
        `[v0] Price assigned to ${shipmentToPriceId}: $${assignedPrice}`,
      );
      onShipmentPriceUpdate({
        trackingNumber: shipmentToPriceId,
        cost: Number(assignedPrice),
      });
    }
  };
  const handleAssignCourier = () => {
    if (selectedShipmentForCourier && selectedCourier) {
      onShipmentCourierUpdate({
        courierUserId: selectedCourier,
        trackingNumber: selectedShipmentForCourier,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Shipments</h1>
        <p className="text-foreground/60">
          Manage all shipments, assign pricing, and courier delivery
        </p>
      </div>

      {isLoading && <p>...loading all shipment</p>}

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search by tracking ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="arrived">Arrived</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shipments ({filteredShipments?.length})</CardTitle>
          <CardDescription>All shipments across all routes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">
                    Tracking ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments?.map((shipment: any) => (
                  <tr
                    key={shipment.id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4 font-mono text-primary">
                      {shipment?.trackingNumber}
                    </td>
                    <td className="py-3 px-4">{shipment?.senderName}</td>
                    <td className="py-3 px-4">{shipment?.shippingTypeEnum}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          shipment.status === "delivered"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {shipment?.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground/70">
                      {shipment?.senderCity}, {shipment?.senderState} &rarr;{" "}
                      {shipment?.recipientCity}, {shipment?.recipientState}
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">
                      ${Number(shipment?.totalCost)?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 space-x-1">
                      {shipment.status === "ArrivingSoon" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShipmentToPriceId(shipment?.trackingNumber);
                            setShowPriceModal(true);
                          }}
                        >
                          Set Price
                        </Button>
                      )}
                      {shipment?.shippingTypeEnum
                        ?.toLowerCase()
                        ?.includes("air") &&
                        shipment?.status === "ArrivingSoon" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedShipmentForCourier(
                                shipment?.trackingNumber,
                              );
                              setShowCourierModal(true);
                            }}
                          >
                            <Check className="w-4 h-4 mr-1" /> Assign
                          </Button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Courier Assignment Modal */}
      {showCourierModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                Assign Courier - {selectedShipmentForCourier}
              </CardTitle>
              <CardDescription>
                Select a courier for this home delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Select Courier
                </label>
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choose a courier...</option>
                  {courierData?.data?.map((courier: any) => (
                    <option key={courier.id} value={courier.id.toString()}>
                      {courier?.fullName} ({courier.assignedCity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCourierModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleAssignCourier}
                  disabled={!selectedCourier}
                >
                  {isLoadingCourier ? (
                    "...loading"
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Confirm
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Price Assignment Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Assign Price - {shipmentToPriceId}</CardTitle>
              <CardDescription>
                Set the final delivery price for this shipment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Price (USD)
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={assignedPrice}
                  onChange={(e) => setAssignedPrice(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowPriceModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handlePriceAssignment}
                  disabled={isLoadingPriceUpdate}
                >
                  {isLoadingPriceUpdate ? (
                    "...loading"
                  ) : (
                    <>
                      {" "}
                      <Check className="w-4 h-4 mr-2" /> Confirm
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
