"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { useGetManageCustomersQuery } from "@/store/slice/apiSlice";

export default function ManageCustomers() {
  const { data, isLoading, isError } = useGetManageCustomersQuery({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Customers
          </h1>
          <p className="text-foreground/60">
            View and manage customer accounts
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">Add Customer</Button>
      </div>

      {isLoading && <p>Loading customers...</p>}

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers List</CardTitle>
          <CardDescription>All registered customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Shipments
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map(
                  (customer: {
                    id: string;
                    fullName: string;
                    email: string;
                    phoneNumber: string;
                    shipmentCount: number;
                    status: string;
                  }) => (
                    <tr
                      key={customer.id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4 font-semibold">
                        {customer?.fullName}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Mail className="w-4 h-4" />
                          {customer?.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Phone className="w-4 h-4" />
                          {customer?.phoneNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4">{customer?.shipmentCount}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            customer.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
