import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Heart, 
  Award, 
  Users,
  TreePine,
  ArrowRight
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Paradise Resort</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your home away from home, where luxury meets nature
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Story</h2>
            <p className="text-lg text-slate-600">
              Founded in 2010, Paradise Resort began as a small family-owned retreat 
              with just five cottages. Today, we&apos;ve grown into a premier destination 
              while maintaining the warm, personal touch that made us special from the start.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop"
              alt="Resort overview"
              className="rounded-xl shadow-lg"
            />
            <div>
              <p className="text-slate-600 mb-4">
                Our mission is simple: to provide an unforgettable escape where guests 
                can reconnect with nature, loved ones, and themselves. Nestled along 
                the pristine coastline, our resort offers the perfect blend of adventure 
                and relaxation.
              </p>
              <p className="text-slate-600">
                Every detail of Paradise Resort has been thoughtfully designed to 
                ensure your comfort and create lasting memories. From our eco-friendly 
                practices to our locally-sourced cuisine, we&apos;re committed to 
                sustainability and supporting our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Hospitality", desc: "Warm, genuine service from our family to yours" },
              { icon: TreePine, title: "Sustainability", desc: "Committed to preserving our natural environment" },
              { icon: Award, title: "Excellence", desc: "Exceeding expectations in every detail" },
              { icon: Users, title: "Community", desc: "Supporting local artisans and businesses" },
            ].map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-600">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Paradise?</h2>
          <p className="text-xl mb-8 text-emerald-100">
            Book your stay today and discover why guests keep coming back.
          </p>
          <Link href="/select-accommodation">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
              Book Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
