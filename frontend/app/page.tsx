import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/homepage/hero-section"
import { FeaturedSpaces } from "@/components/homepage/featured-spaces"
import { TestimonialsSection } from "@/components/homepage/testimonials-section"
import { CallToActionSection } from "@/components/homepage/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedSpaces />
        <TestimonialsSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  )
}
