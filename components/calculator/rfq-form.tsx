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
import { Send } from "lucide-react";
import { useRequestQuoteMutation } from "@/store/slice/apiSlice";

export function RFQForm({
  weight,
  containerType,
  cbm,
  shippingType,
}: {
  weight?: number;
  containerType?: string;
  cbm?: number;
  shippingType?: string;
}) {
  const [requestQuote, { isLoading }] = useRequestQuoteMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    senderCountry: "China",
    senderAddress: "",
    senderState: "",
    recipientCountry: "Nigeria",
    recipientAddress: "",
    recipientState: "",
    shippingType: shippingType || "Air",
    origin: "Shanghai, China",
    destination: "Lagos, Nigeria",
    weight: weight || 0,
    cbm: cbm || 0,
    containerType: containerType,
    items: "",
    specialRequirements: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestQuote({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      senderAddress: formData.senderAddress,
      senderCountry: formData.senderCountry,
      senderState: formData.senderState,
      recipientAddress: formData.recipientAddress,
      recipientCountry: formData.recipientCountry,
      recipientState: formData.recipientState,
      itemDescription: formData.items,
      shippingType: formData.shippingType,
      weightKg: formData.weight,
      cbmVolume: formData.cbm,
      containerTypeEnum:
        formData.containerType === "20ft"
          ? "Container20Ft"
          : formData.containerType === "40ft"
            ? "Container40Ft"
            : "",
      specialRequirement: formData.specialRequirements,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Request for Quote (RFQ)</CardTitle>
          <CardDescription>
            Submit your shipping requirements for a personalized quote. We'll
            respond within 2 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">
                Quote request submitted!
              </p>
              <p className="text-green-600 text-sm">
                We'll contact you shortly with a detailed quote.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company
                  </label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234..."
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Shipping Location{" "}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
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
            </div>

            {/* Shipping Details */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Shipping Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Shipping Type
                  </label>
                  <select
                    name="shippingType"
                    value={formData.shippingType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  >
                    <option value="Air">Air Shipping</option>
                    <option value="Sea">Sea Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Items Description
                  </label>
                  <Input
                    type="text"
                    name="items"
                    value={formData.items}
                    onChange={handleChange}
                    placeholder="What are you shipping?"
                    required
                  />
                </div>
                {formData.shippingType === "Air" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Weight (kg)
                    </label>
                    <Input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                )}
                {formData.shippingType === "Sea" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        CBM Volume
                      </label>
                      <Input
                        type="number"
                        name="cbm"
                        value={formData.cbm}
                        onChange={handleChange}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Container Type
                      </label>
                      <select
                        name="containerType"
                        value={formData.containerType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="20ft">20ft Container</option>
                        <option value="40ft">40ft Container</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Special Requirements
              </label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                placeholder="Any special handling, fragile items, temperature control, etc."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-semibold flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isLoading ? "Submitting..." : "Submit RFQ"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
