'use client';

import Feed from '@/components/Feed';
import { Button } from '@/components/ui/Button';
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { Upload } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user } = useUser();

  const SAMPLE_POSTS = [
    // ai generated
    {
      id: 1,
      user: {
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      },
      image:
        'https://images.unsplash.com/photo-1686191128892-3e72b544f8e3?w=800',
      prompt:
        'A surreal landscape with floating islands and bioluminescent plants',
      likes: 234,
      comments: 42,
    },
    {
      id: 2,
      user: {
        name: 'Alex Rivera',
        username: 'alexr',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      },
      image:
        'https://images.unsplash.com/photo-1686754118153-a667fa3fb5b5?w=800',
      prompt: 'Cyberpunk city at night with neon lights and flying vehicles',
      likes: 567,
      comments: 89,
    },
  ];

  return (
    <main className="container mx-auto px-4">
      <section className="mb-12 text-center mt-4">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Welcome to Picrise
        </h1>
        <p className="mb-6 text-lg text-muted-foreground">
          Share and discover amazing AI-generated artwork with a creative
          community
        </p>
        <Button size="lg" className="gap-2" asChild>
          {user ? (
            <Link href="/upload">
              <Upload />
              Share Your Art
            </Link>
          ) : (
            <Link href="/sign-up">
              <Upload />
              Join to Share
            </Link>
          )}
        </Button>
      </section>
      <Feed posts={SAMPLE_POSTS} />
    </main>
  );
}
