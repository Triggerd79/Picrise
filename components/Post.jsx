import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const Post = ({ post }) => {
  const handleLike = () => {
    // to be impelemented
  };

  const handleComment = () => {
    // to be impelemented
  };

  const handleShare = () => {
    // to be impelemented
  };

  return (
    <>
      <Card key={post.id} className="overflow-hidden my-2">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{post.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  @{post.user.username}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <img
          src={post.image}
          alt="AI-generated artwork"
          className="aspect-[4/3] w-full object-cover"
        />

        <div className="p-4">
          <p className="mb-4 text-sm">{post.prompt}</p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" onClick={handleLike}>
              <Heart className="mr-1 h-4 w-4" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleComment}>
              <MessageCircle className="mr-1 h-4 w-4" />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Post;
