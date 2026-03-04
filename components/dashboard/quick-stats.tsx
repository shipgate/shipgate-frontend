"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  useTotalMoneySpentQuery,
  useTotalShipmentQuery,
  useWalletsQuery,
} from "@/store/slice/apiSlice";
import { Package, TrendingUp, DollarSign } from "lucide-react";
import { motion } from "motion/react";

interface QuickStatsProps {
  walletBalance: number;
  shipmentCount: number;
  totalSpent: number;
}

export function QuickStats({
  walletBalance,
  shipmentCount,
  totalSpent,
}: QuickStatsProps) {
  const { data: walletData, isLoading: isWalletLoading } = useWalletsQuery({});
  const { data: totalShipmentData, isLoading: isTotalShipmentLoading } =
    useTotalShipmentQuery({});
  const { data: totalMoneySpentData, isLoading: isTotalMoneySpentLoading } =
    useTotalMoneySpentQuery({});

  const stats = [
    {
      icon: DollarSign,
      label: "Wallet Balance",
      value: `${walletData?.data?.currency} ${Number(walletData?.data?.balance || 0).toLocaleString()}`,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Package,
      label: "Total Shipments",
      value: Number(
        totalShipmentData?.data?.totalShipments || 0,
      ).toLocaleString(),
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      label: "Total Spent",
      value: `$${Number(totalMoneySpentData?.data?.totalSpent || 0).toLocaleString()}`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground/60 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
