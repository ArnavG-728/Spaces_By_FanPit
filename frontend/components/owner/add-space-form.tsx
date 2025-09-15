"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { spacesAPI } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"

const spaceFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  address: z.string().min(5, "Address is required."),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1."),
  amenities: z.string().optional(),
  hourlyRate: z.coerce.number().min(0, "Hourly rate must be a positive number.").optional(),
})

type SpaceFormValues = z.infer<typeof spaceFormSchema>

export function AddSpaceForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SpaceFormValues>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      capacity: 10,
      amenities: "",
      hourlyRate: 500,
    },
  })

  async function onSubmit(data: SpaceFormValues) {
    setIsSubmitting(true)
    try {
      const spaceData = {
        name: data.name,
        description: data.description,
        address: data.address,
        capacity: data.capacity,
        amenities: data.amenities?.split(',').map(a => a.trim()).filter(Boolean) || [],
        pricing: {
          hourlyRate: data.hourlyRate,
        },
      }
      await spacesAPI.create(spaceData)
      alert("Space created successfully!")
      router.push("/") // Redirect to homepage or owner dashboard
    } catch (error) {
      console.error("Failed to create space:", error)
      alert("Failed to create space. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Add a New Space</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Space Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Downtown Conference Room" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="A brief description of your space..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, Anytown, USA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <Input placeholder="WiFi, Projector, Whiteboard (comma-separated)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate (INR)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Space..." : "Create Space"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
