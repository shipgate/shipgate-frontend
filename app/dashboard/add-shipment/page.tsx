"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import {
  useCreateShipmentMutation,
  useGetShippingMethodQuery,
} from "@/store/slice/apiSlice";

export default function AddShipmentPage() {
  const { data: shippingOptions } = useGetShippingMethodQuery({});

  const [createShipment, { isLoading }] = useCreateShipmentMutation();

  const formattedOptions: any = [];

  shippingOptions?.forEach((option: any) => {
    if (option.shippingTypeEnum === "Air") {
      formattedOptions?.push({
        value: "air",
        label: `${option.name} (${option.currency}${option.price}/kg)`,
      });
    }

    if (option.shippingTypeEnum === "Sea") {
      // CBM (base sea price)
      formattedOptions?.push({
        value: "sea-cbm",
        label: `${option.name} - CBM (${option.currency}${option.price}/CBM)`,
      });

      // Only add containers if they exist
      if (Array.isArray(option.containers)) {
        option.containers.forEach((container: any) => {
          formattedOptions?.push({
            value: `sea-${container.containerSize}ft`,
            label: `${option.name} - ${container.containerSize}${container.measurement} Container (${option.currency}${container.price})`,
          });
        });
      }
    }
  });

  const [formData, setFormData] = useState({
    shippingType: "air",
    senderName: "",
    senderPhone: "",
    recipientName: "",
    recipientPhone: "",
    itemDescription: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    senderState: "",
    senderCountry: "China",
    senderAddress: "",
    recipientState: "",
    recipientCountry: "Nigeria",
    recipientAddress: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.senderName ||
      !formData.senderPhone ||
      !formData.recipientName ||
      !formData.weight
    ) {
      setError("Please fill in all required fields");
      return;
    }

    await createShipment({
      shippingTypeEnum: formData.shippingType === "air" ? 1 : 2,
      // originCity: "Lagos",
      // originCountry: "Nigeria",
      // destinationCity: "Abuja",
      // destinationCountry: "Nigeria",
      senderEmail: "",
      senderCity: "",
      senderName: formData.senderName,
      senderPhone: formData.senderPhone,
      recipientName: formData.recipientName,
      recipientPhone: formData.recipientPhone,
      // itemDescription: formData.itemDescription,
      senderState: formData.senderState,
      senderCountry: formData.senderCountry,
      // senderAddress: formData.senderAddress,
      recipientEmail: "",
      recipientCity: "",
      recipientState: formData.recipientState,
      recipientCountry: formData.recipientCountry,
      // recipientAddress: formData.recipientAddress,
      // weightKg: Number(formData.weight),
      // lengthCm: formData.length ? Number(formData.length) : 0,
      // widthCm: formData.width ? Number(formData.width) : 0,
      // heightCm: formData.height ? Number(formData.height) : 0,
    })
      .then(() => {
        alert("Shipment created successfully!");

        setFormData({
          shippingType: "air",
          senderName: "",
          senderPhone: "",
          recipientName: "",
          recipientPhone: "",
          itemDescription: "",
          weight: "",
          length: "",
          width: "",
          height: "",
          senderState: "",
          senderAddress: "",
          senderCountry: "China",
          recipientState: "",
          recipientAddress: "",
          recipientCountry: "Nigeria",
        });
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to create shipment",
        );
      });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Create New Shipment
        </h1>
        <p className="text-foreground/60 text-sm md:text-base">
          Fill in the details to start a new shipment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Type */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Method</CardTitle>
            <CardDescription>Choose how you want to ship</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              name="shippingType"
              value={formData.shippingType}
              onChange={handleChange}
              className="w-full p-3 border border-border rounded-lg bg-background"
            >
              {formattedOptions?.map(
                (item: { value: string; label: string }) => (
                  <option value={item?.value}>{item?.label}</option>
                ),
              )}
            </select>
          </CardContent>
        </Card>

        {/* Sender Details */}
        <Card>
          <CardHeader>
            <CardTitle>Sender Details</CardTitle>
            <CardDescription>Your information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <Input
                  name="senderName"
                  placeholder="Your full name"
                  value={formData.senderName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Phone Number *
                </label>
                <Input
                  name="senderPhone"
                  placeholder="Your phone number e.g +234 800 000 0000"
                  value={formData.senderPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2 ">
                  Sender Address
                </label>
                <Input
                  type="text"
                  name="senderAddress"
                  value={formData.senderAddress}
                  onChange={handleChange}
                  placeholder="Enter sender's full address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sender Country
                </label>
                <Input
                  type="text"
                  name="senderCountry"
                  value={formData.senderCountry}
                  onChange={handleChange}
                  placeholder="Sender Country"
                  disabled
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sender State/Province
                </label>
                <Input
                  type="text"
                  name="senderState"
                  value={formData.senderState}
                  onChange={handleChange}
                  placeholder="Sender State/Province e.g Shanghai"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipient Details */}
        <Card>
          <CardHeader>
            <CardTitle>Recipient Details</CardTitle>
            <CardDescription>Recipient information in Nigeria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <Input
                  name="recipientName"
                  placeholder="Recipient's full name"
                  value={formData.recipientName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <Input
                  name="recipientPhone"
                  placeholder="Recipient's phone number e.g +234 800 000 0000"
                  value={formData.recipientPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2 ">
                  Recipient Address
                </label>
                <Input
                  type="text"
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleChange}
                  placeholder="Enter recipient's full address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Recipient Country
                </label>
                <Input
                  type="text"
                  name="recipientCountry"
                  value={formData.recipientCountry}
                  onChange={handleChange}
                  placeholder="Recipient Country"
                  disabled
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Recipient State
                </label>
                <Input
                  type="text"
                  name="recipientState"
                  value={formData.recipientState}
                  onChange={handleChange}
                  placeholder="Recipient State e.g Lagos"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Details */}
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>What are you shipping?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Item Description
              </label>
              <textarea
                name="itemDescription"
                placeholder="Describe what you're shipping..."
                value={formData.itemDescription}
                onChange={handleChange}
                className="w-full p-3 border border-border rounded-lg bg-background resize-none"
                rows={3}
              />
            </div>

            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Weight (kg) *
                </label>
                <Input
                  type="number"
                  name="weight"
                  placeholder="Enter weight"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>

              {/* Dimensions for volumetric weight */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">
                  Dimensions (Optional - for volumetric weight)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Length (cm)
                    </label>
                    <Input
                      type="number"
                      name="length"
                      placeholder="L"
                      value={formData.length}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Width (cm)
                    </label>
                    <Input
                      type="number"
                      name="width"
                      placeholder="W"
                      value={formData.width}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">
                      Height (cm)
                    </label>
                    <Input
                      type="number"
                      name="height"
                      placeholder="H"
                      value={formData.height}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
        >
          {isLoading ? "Creating Shipment..." : "Create Shipment"}
        </Button>
      </form>
    </div>
  );
}
