'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export default function LandingPage() {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-gray-950 text-white font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-32 text-center space-y-6">
        <motion.h1
          className="text-5xl md:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Shorten URLs with Power & Simplicity
        </motion.h1>

        <motion.p
          className="text-lg max-w-2xl text-gray-300"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A secure and modern URL shortener with custom slugs, analytics, QR generation, and full dashboard control – all in one sleek app.
        </motion.p>

        {/* URL Input Preview */}
        <motion.div
          className="w-full max-w-xl flex items-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Input placeholder="Paste a long URL here..." className="flex-1 text-black" />
          <Button disabled>Shorten</Button>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Link href="/auth">
            <Button size="lg">Get Started</Button>
          </Link>
          <Button variant="outline" className={"text-black"} size="lg" onClick={scrollToFeatures}>
            Explore Features
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="py-20 px-6 bg-slate-950 border-t border-gray-800"
      >
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <motion.h2
            className="text-4xl font-semibold"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Our Platform?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "🔒 Secure Auth",
                desc: "JWT & bcrypt powered login with secure cookies.",
              },
              {
                title: "✂️ Short & Custom URLs",
                desc: "Generate random short links or define your own alias.",
              },
              {
                title: "📊 Analytics",
                desc: "Track clicks and gain insights on every short link.",
              },
              {
                title: "📅 Expiry Options",
                desc: "Add expiry dates or limited clicks to URLs for better control.",
              },
              {
                title: "📎 QR Code Ready",
                desc: "Easily generate and share QR codes for your short links.",
              },
              {
                title: "📂 Personal Dashboard",
                desc: "Manage, edit and delete all your links from one place.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-slate-900 p-6 rounded-xl border border-gray-800 hover:shadow-lg transition"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} URLify – Built with ❤️ using Next.js, ShadCN, and MongoDB.
      </footer>
    </main>
  );
}
