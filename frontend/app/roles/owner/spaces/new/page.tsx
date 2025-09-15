"use client"

import { Navbar } from "@/components/navbar"
import { AddSpaceForm } from "@/app/roles/owner/add-space-form"

export default function AddSpacePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <AddSpaceForm />
      </main>
    </div>
  )
}
