'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, Clock } from 'lucide-react';
import Post from '@/components/Post';

const SAMPLE_POSTS = [
  {
    id: 1,
    user: {
      name: 'Sarah Chen',
      username: 'sarahchen',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    image: 'https://images.unsplash.com/photo-1686191128892-3e72b544f8e3?w=800',
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
    image: 'https://images.unsplash.com/photo-1686754118153-a667fa3fb5b5?w=800',
    prompt: 'Cyberpunk city at night with neon lights and flying vehicles',
    likes: 567,
    comments: 89,
  },
  {
    id: 3,
    user: {
      name: 'Alex Rivera',
      username: 'alexr',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    image: 'https://images.unsplash.com/photo-1686754118153-a667fa3fb5b5?w=800',
    prompt: 'Cyberpunk city at night with neon lights and flying vehicles',
    likes: 567,
    comments: 89,
  },
  {
    id: 4,
    user: {
      name: 'Alex Rivera',
      username: 'alexr',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    image: 'https://images.unsplash.com/photo-1686754118153-a667fa3fb5b5?w=800',
    prompt: 'Cyberpunk city at night with neon lights and flying vehicles',
    likes: 567,
    comments: 89,
  },
  {
    id: 5,
    user: {
      name: 'Alex Rivera',
      username: 'alexr',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    image: 'https://images.unsplash.com/photo-1686754118153-a667fa3fb5b5?w=800',
    prompt: 'Cyberpunk city at night with neon lights and flying vehicles',
    likes: 567,
    comments: 89,
  },
];

export default function ExplorePage() {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Explore Creations</h1>
      </div>

      <Tabs defaultValue="trending" className="mb-8 mx-auto max-w-[90%]">
        <TabsList>
          <TabsTrigger value="trending">
            <Flame className="mr-2 h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="latest">
            <Clock className="mr-2 h-4 w-4" />
            Latest
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_POSTS.map((post) => (
              <Post post={post} key={post.id} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
