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
  const [cbm, setCbm] = useState(0);
  const [containerType, setContainerType] = useState("");
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
    senderCity: "",
    senderCountry: "China",
    senderEmail: "",
    recipientState: "",
    recipientCity: "",
    recipientCountry: "Nigeria",
    recipientEmail: "",
    quantity: "",
    cbmVolume: "",
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
      !formData.recipientName
    ) {
      setError("Please fill in all required fields");
      return;
    }

    await createShipment({
      shippingTypeEnum: formData.shippingType.includes("sea") ? "Sea" : "Air",
      senderName: formData?.senderName,
      senderPhone: formData?.senderPhone,
      senderCountry: formData?.senderCountry,
      senderState: formData?.senderState,
      senderCity: formData?.senderCity,
      senderEmail: formData?.senderEmail,
      recipientName: formData?.recipientName,
      recipientPhone: formData?.recipientPhone,
      recipientCountry: formData?.recipientCountry,
      recipientState: formData?.recipientState,
      recipientCity: formData?.recipientCity,
      recipientEmail: formData?.recipientEmail,
      item: {
        itemDescription: formData?.itemDescription,
        quantity: Number(formData?.quantity),
        weightKg: Number(formData?.weight),
        lengthCm: Number(formData?.length),
        widthCm: Number(formData?.width),
        heightCm: Number(formData?.height),
        cbmVolume: Number(cbm),
        containerSize: formData?.shippingType.includes("40ft")
          ? "FortyFt"
          : formData?.shippingType.includes("20ft")
            ? "TwentyFt"
            : "",
      },
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
          senderCountry: "China",
          recipientState: "",
          recipientCountry: "Nigeria",
          cbmVolume: "",
          quantity: "",
          recipientCity: "",
          recipientEmail: "",
          senderCity: "",
          senderEmail: "",
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
                (item: { value: string; label: string }) => {
                  console.log(formData?.shippingType);
                  return <option value={item?.value}>{item?.label}</option>;
                },
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 ">
                  Sender Email Address
                </label>
                <Input
                  type="text"
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  placeholder="Enter email address"
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
                <label className="block text-sm font-medium text-foreground mb-2 ">
                  Sender City
                </label>
                <Input
                  type="text"
                  name="senderCity"
                  value={formData.senderCity}
                  onChange={handleChange}
                  placeholder="Enter sender city"
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 ">
                  Sender Email Address
                </label>
                <Input
                  type="text"
                  name="recipientEmail"
                  value={formData.recipientEmail}
                  onChange={handleChange}
                  placeholder="Enter email address"
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
                  Recipient City
                </label>
                <Input
                  type="text"
                  name="recipientCity"
                  value={formData.recipientCity}
                  onChange={handleChange}
                  placeholder=" Recipient city e.g Ikeja"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Recipient State/Province
                </label>
                <Input
                  type="text"
                  name="recipientState"
                  value={formData.recipientState}
                  onChange={handleChange}
                  placeholder="Recipient State/Province e.g Lagos"
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

            {formData.shippingType === "air" && (
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
            )}

            {formData.shippingType.includes("cbm") && (
              <Card>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      CBM volume
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter CBM (cubic meters)"
                      value={cbm || ""}
                      onChange={(e) =>
                        setCbm(Number.parseFloat(e.target.value) || 0)
                      }
                      className="h-10"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
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
