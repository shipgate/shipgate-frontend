"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, MapPin, Package } from "lucide-react";
import {
  useGetCourierDashboardDataQuery,
  useGetCourierDeliveriesQuery,
} from "@/store/slice/apiSlice";

export default function CourierDashboard() {
  const { data, isLoading } = useGetCourierDashboardDataQuery({});
  const { data: courierData, isLoading: isLoadingCourier } =
    useGetCourierDeliveriesQuery({});

  const stats = [
    {
      label: "Today's Deliveries",
      value: isLoading
        ? "..."
        : data?.today_deliveries
          ? Number(data?.today_deliveries)
          : "0",
      icon: Package,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "In Progress",
      value: isLoading
        ? "..."
        : data?.today_deliveries
          ? Number(data?.today_deliveries)
          : "0",
      icon: Clock,
      color: "bg-orange-100 text-orange-700",
    },
    {
      label: "Completed",
      value: isLoading
        ? "..."
        : data?.today_deliveries
          ? Number(data?.today_deliveries)
          : "0",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Earnings",
      value: isLoading
        ? "..."
        : data?.today_deliveries
          ? `₦${Number(data?.today_deliveries)}`
          : "0",
      icon: MapPin,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Courier Dashboard
        </h1>
        <p className="text-foreground/60">Manage your assigned deliveries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground/60">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Assigned Deliveries</CardTitle>
          <CardDescription>
            Tap on a delivery to update its status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoadingCourier && <p>...loading deliveries</p>}
            {courierData?.map((delivery) => (
              <div
                key={delivery.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {delivery.id}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {delivery.customer}
                    </p>
                  </div>
                  <Badge
                    variant={
                      delivery.status === "in_progress" ? "default" : "outline"
                    }
                  >
                    {delivery.status === "in_progress"
                      ? "In Progress"
                      : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-foreground/60">
                  <MapPin className="w-4 h-4" />
                  {delivery.address}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Action */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Action</CardTitle>
        </CardHeader>
        <CardContent>
          <a
            href="/courier/update-delivery"
            className="w-full p-3 bg-primary text-white rounded-lg text-center font-semibold hover:bg-primary/90 transition-colors block"
          >
            Update Delivery Status
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
