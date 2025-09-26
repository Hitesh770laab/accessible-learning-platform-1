"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main id="main" className="min-h-[calc(100vh-56px)]" aria-labelledby="home-heading">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 id="home-heading" className="text-3xl md:text-4xl font-bold tracking-tight">
              Inclusive learning for every student
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Real-time captions, text-to-speech, and OCR to make lectures and study materials accessible for students with hearing, visual, and learning disabilities.
            </p>
            <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Primary actions">
              <Button asChild size="lg">
                <Link href="/captions">Start Live Captions</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/reader">Open Reader & OCR</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border">
            <Image
              src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop"
              alt="Students learning with accessible technology"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-semibold">Key features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <FeatureCard title="Live speech-to-text" desc="Instant captions for lectures with downloadable transcripts in Indian languages." />
          <FeatureCard title="Text-to-speech for PDFs" desc="Upload notes and listen hands-free with natural voices." />
          <FeatureCard title="OCR for diagrams" desc="Turn images into spoken descriptions using on-device OCR." />
          <FeatureCard title="Accessibility controls" desc="Adjust font size, contrast, motion, and screen reader hints." />
          <FeatureCard title="Keyboard friendly" desc="Optimized focus states and skip links throughout." />
          <FeatureCard title="Privacy & Security first" desc="Processing happens in your browser for transcripts and OCR." />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card role="article" aria-labelledby={`feature-${title}`}>
      <CardHeader>
        <CardTitle id={`feature-${title}`} className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}