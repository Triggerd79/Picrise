'use client';

import { useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Image as ImageIcon,
  Star,
} from 'lucide-react';

const PROFILE_DATA = {
  name: 'Sarah Chen',
  username: 'sarahchen',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  bio: 'AI artist exploring the boundaries of imagination. Creating surreal landscapes and dreamlike scenes.',
  stats: {
    posts: 127,
    followers: 1420,
    following: 891,
    likes: 3205,
  },
};

const USER_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1686191128892-3e72b544f8e3?w=800',
    prompt:
      'A surreal landscape with floating islands and bioluminescent plants',
    likes: 234,
    comments: 42,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1686754118153-a667fa3fb5b5?w=800',
    prompt: 'Cyberpunk city at night with neon lights and flying vehicles',
    likes: 567,
    comments: 89,
  },
];

const ProfilePage = ({ params }) => {
  const unwrappedParams = use(params);
  const [isFollowing, setIsFollowing] = useState(false);
  const Id = unwrappedParams.Id.replace('%40', '@');

  // TODO : Fetch user data and posts based on the Id

  return (
    <div className="container py-6 max-w-[80%] mx-auto">
      <Card className="p-6 mb-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <Avatar className="w-24 h-24">
            <AvatarImage src={PROFILE_DATA.avatar} alt={PROFILE_DATA.name} />
            <AvatarFallback>{PROFILE_DATA.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-grow">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{PROFILE_DATA.name}</h1>
                <p className="text-muted-foreground">
                  @{PROFILE_DATA.username}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsFollowing(!isFollowing)}
                  variant={isFollowing ? 'secondary' : 'default'}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            </div>

            <p className="mb-6">{PROFILE_DATA.bio}</p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center p-2 rounded-lg bg-secondary">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold">{PROFILE_DATA.stats.posts}</span>
                </div>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold">
                    {PROFILE_DATA.stats.followers}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold">
                    {PROFILE_DATA.stats.following}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold">{PROFILE_DATA.stats.likes}</span>
                </div>
                <p className="text-sm text-muted-foreground">Likes</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {USER_POSTS.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;

const Post = ({ post }) => {
  return (
    <Card key={post.id} className="overflow-hidden">
      <img
        src={post.image}
        alt="AI-generated artwork"
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="p-4">
        <p className="mb-4 text-sm">{post.prompt}</p>
        <div className="flex gap-4">
          <Button variant="ghost" size="sm">
            <Heart className="mr-2 h-4 w-4" />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            {post.comments}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
};
