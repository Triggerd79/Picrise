'use client';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Toaster } from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import { followUser, unfollowUser } from '@/lib/actions/user.action';
import { likeOrDislikePost, deletePost } from '@/lib/actions/post.action';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';

export default function Post({ post, currentUser }) {
  const user = currentUser;
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (!post) return null;

  useEffect(() => {
    if (!user) {
      setIsFollowing(false);
    }

    if (post?.owner?.followers?.includes(user._id)) {
      setIsFollowing(true);
    }
  });

  const followUserHandler = async () => {
    if (!user.id) {
      alert('Please Login First to perform this action');
    }
    await followUser({
      userId: user.id,
      followedUserId: post.owner.id,
    });
    setIsFollowing(true);
  };

  const unfollowUserHandler = async () => {
    if (!user.id) {
      alert('Please Login First to perform this action');
    }
    await unfollowUser({
      userId: user.id,
      unFollowedUserId: post.owner.id,
    });
    setIsFollowing(false);
  };

  const handleLike = async () => {
    if (!user.id) {
      alert('Please Login First to perform this action');
    }
    if (!isLiked) {
      await likeOrDislikePost({
        postId: post._id,
        liked: true,
        userClerkId: user.id,
      });
      setIsLiked(true);
    } else {
      await likeOrDislikePost({
        postId: post._id,
        liked: false,
        userClerkId: user.id,
      });
      setIsLiked(false);
    }
  };

  const deletePostHandler = async () => {
    await deletePost({
      postId: post._id,
      ownerClerkId: user.id,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Check out this post!',
          text: post.caption || 'Awesome post!',
          url: window.location.href + 'post/' + post._id,
        })
        .catch((error) => console.error('Error sharing post:', error));
    } else {
      alert('This sharing method is not supported on this browser.');
    }
  };
  return (
    <>
      <div>
        <Toaster />
      </div>
      <Card
        key={post._id}
        className="overflow-hidden my-2 mx-auto w-full md:w-[70%]  dark"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                className="flex items-center gap-3"
                href={`/profile/${post.owner.id}`}
              >
                <Avatar>
                  {post.owner.image ? (
                    <AvatarImage src={post.owner.image} alt={post.owner.name} />
                  ) : (
                    <AvatarImage
                      className="bg-dark-4 p-1"
                      src="/assets/user.svg"
                      alt={post.owner.name}
                    />
                  )}
                  <AvatarImage src={post.owner.image} alt={post.owner.name} />
                  <AvatarFallback>{post.owner.name}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.owner.name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{post.owner.username}
                  </p>
                </div>
              </Link>

              {post.owner.id !== user?.id && (
                <div className=" max-sm:hidden opacity-20 font-thin">
                  {isFollowing ? (
                    <Button variant="ghost" onClick={unfollowUserHandler}>
                      following
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={followUserHandler}>
                      Follow
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal className="h-8 w-8 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark">
                  <DropdownMenuItem>
                    <Link href={`/profile/${post.owner.id}`}>Profile</Link>
                  </DropdownMenuItem>

                  {isFollowing ? (
                    <DropdownMenuItem onClick={unfollowUserHandler}>
                      Unfollow
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={followUserHandler}>
                      Follow
                    </DropdownMenuItem>
                  )}
                  {post.owner.id === user?.id && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link
                          href={`/post/edit/${post._id}`}
                          className="flex items-center gap-2"
                        >
                          <Image
                            width={20}
                            height={20}
                            src={'/assets/edit.svg'}
                            alt="edit"
                          />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={deletePostHandler}
                        className="text-red-600"
                      >
                        <Image
                          width={20}
                          height={20}
                          src={'/assets/delete.svg'}
                          alt="delete"
                        />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <Image
          width={100}
          height={100}
          src={post.image}
          alt={post.prompt}
          className="max-h-96 w-full object-contain bg-dark-4"
        />
        <div className="p-4">
          <div className="flex gap-2">
            <b>Prompt : </b>
            <p className="mb-4 text-sm">{post.prompt}</p>
          </div>
          {post.caption && (
            <p className="mb-4 text-sm">
              <b>Caption : </b>
              {post.caption}
            </p>
          )}

          <div className="flex gap-4">
            <Button variant="ghost" size="sm" onClick={handleLike}>
              {isLiked ? (
                <>
                  <Image
                    width={24}
                    height={24}
                    src={'/assets/heart-filled.svg'}
                    alt="like"
                  />
                  <p>{post.likes + 1}</p>
                </>
              ) : (
                <>
                  <Image
                    width={24}
                    height={24}
                    src={'/assets/heart.svg'}
                    alt="like"
                  />
                  <p>{post.likes}</p>
                </>
              )}
            </Button>

            {/* TODO: implement Commenting */}

            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Image
                width={24}
                height={24}
                src={'/assets/share.svg'}
                alt="like"
              />
              Share
            </Button>
          </div>
        </div>

        <div className="px-4 py-2">
          {post.createdAt && (
            <p className="text-small-regular text-muted-foreground">
              {formatDate(post.createdAt)}
            </p>
          )}
        </div>
      </Card>
    </>
  );
}
