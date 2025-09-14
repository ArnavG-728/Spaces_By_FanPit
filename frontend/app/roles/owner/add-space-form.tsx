"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { PricingEngine } from "@/app/components/spaces/_components/pricing-engine"
import { api } from "@/lib/api/client"

const amenityOptions = [
  "WiFi",
  "Parking",
  "Catering",
  "AV Equipment",
  "Air Conditioning",
  "Security",
  "Kitchen",
  "Bar",
  "Outdoor Space",
  "Wheelchair Accessible",
  "Sound System",
  "Projector",
  "Whiteboard",
  "Coffee Machine",
  "Restrooms",
]

export function AddSpaceForm() {
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    description: "",
    type: "",
    capacity: "",
    
    // Location
    address: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Pricing
    pricing: {
      model: 'hourly' as 'free' | 'hourly' | 'daily' | 'monthly' | 'peak_off_peak',
      basePrice: 0,
      dailyRate: 0,
      monthlyRate: 0,
      isPeakPricingEnabled: false,
      peakHours: [] as Array<{
        start: string
        end: string
        multiplier: number
      }>,
      timeBlocks: [] as Array<{
        id: string
        name: string
        startTime: string
        endTime: string
        price: number
      }>,
      promoCodes: [] as Array<{
        code: string
        discountType: 'percentage' | 'fixed'
        value: number
        validUntil: string
        maxUses?: number
        currentUses: number
      }>,
      isPromoCodesEnabled: false
    },
    
    // Other
    amenities: [] as string[],
    rules: [""],
    images: [] as File[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      // Handle nested fields like pricing.model
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenity] : prev.amenities.filter((a) => a !== amenity),
    }))
  }

  const handleRuleChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.map((rule, i) => (i === index ? value : rule)),
    }))
  }

  const addRule = () => {
    setFormData((prev) => ({ ...prev, rules: [...prev.rules, ""] }))
  }

  const removeRule = (index: number) => {
    setFormData((prev) => ({ ...prev, rules: prev.rules.filter((_, i) => i !== index) }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Minimal payload matching backend schema
      const payload = {
        name: formData.name,
        description: formData.description,
        capacity: Number(formData.capacity) || 0,
        pricePerHour: Number(formData.pricing.basePrice) || 0,
        amenities: formData.amenities,
      }

      const created = await api.createSpace(payload)

      toast({
        title: "Space Added Successfully!",
        description: `${created.name} has been created.`,
      })
      router.push("/roles/owner/dashboard")
    } catch (err: any) {
      toast({
        title: "Failed to add space",
        description: err?.message || "Something went wrong while creating the space.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Space</h1>
          <p className="text-muted-foreground">Create a listing for your space and start accepting bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="media">Media & Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Space Information</CardTitle>
                  <CardDescription>Enter the basic details about your space.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Space Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="e.g., Modern Event Hall"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Space Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select space type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">Event Space</SelectItem>
                          <SelectItem value="coworking">Co-working</SelectItem>
                          <SelectItem value="hangout">Hangout Spot</SelectItem>
                          <SelectItem value="meeting">Meeting Room</SelectItem>
                          <SelectItem value="studio">Studio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your space, its features, and what makes it special..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity (number of guests) *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange("capacity", e.target.value)}
                      placeholder="e.g., 50"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Configuration</CardTitle>
                  <CardDescription>Set up your pricing model and rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <PricingEngine 
                    pricing={formData.pricing}
                    onChange={(pricing) => handleInputChange('pricing', pricing)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>Where is your space located?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Chennai"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="Tamil Nadu"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder="603203"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                  <CardDescription>Add photos of your space.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="images" className="cursor-pointer">
                        <span className="text-primary hover:text-primary/80">Click to upload</span> or drag and drop
                      </Label>
                      <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>House Rules</CardTitle>
                  <CardDescription>Set guidelines for guests using your space</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.rules.map((rule, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={rule}
                        onChange={(e) => handleRuleChange(index, e.target.value)}
                        placeholder="e.g., No smoking inside the venue"
                        className="flex-1"
                      />
                      {formData.rules.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeRule(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addRule}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rule
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding Space..." : "Add Space"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
