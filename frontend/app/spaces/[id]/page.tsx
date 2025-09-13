import { Navbar } from "@/components/navbar"
import { SpaceDetails } from "@/components/spaces/space-details"

export default function SpaceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <SpaceDetails spaceId={params.id} />
      </main>
    </div>
  )
}
