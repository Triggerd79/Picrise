'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deletePost, likeOrDislikePost } from '@/lib/actions/post.action';
import { notify, deleteImage } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function Post({
  _id,
  owner_id, // owner mongo id
  ownerName,
  ownerImage,
  ownerUsername,
  image,
  caption,
  likes,
  fileId,
  createdAt,
  User_id, // current logged in user's Mongo db doc id
  UserId, // current logged in user's clerk id
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (likes?.includes(User_id)) {
      setIsLiked(true);
    }
  }, [User_id]);

  const handleLike = async () => {
    if (!UserId) {
      alert('Please Login First to perform this action');
      return;
    }

    if (isLiked) {
      const res = await likeOrDislikePost({
        postId: _id,
        userId: UserId,
      });

      if (res.success) {
        setIsLiked(false);
      }
    } else {
      const res = await likeOrDislikePost({
        postId: _id,
        userId: UserId,
      });

      if (res.success) {
        setIsLiked(true);
      }
    }
  };

  const deletePostHandler = async () => {
    if (!UserId) {
      alert('Please Login First to perform this action');
      return;
    }

    // Delete Post doc from db
    const res = await deletePost({
      postId: _id,
      userId: UserId,
    });

    if (res.success) {
      // Delete image from imagekit
      const deleteImageResponse = await deleteImage({ fileId });

      notify({
        message: deleteImageResponse.success
          ? 'Post deleted successfully'
          : 'Failed to delete image',
        success: deleteImageResponse.success,
      });
      setDeleted(true);
    }
  };

  const handleShare = async () => {
    if (!UserId) {
      alert('Please Login First to perform this action');
      return;
    }

    if (navigator.share) {
      navigator
        .share({
          title: 'Check out this post!',
          text: caption || 'Awesome post!',
          url: window.location.href + 'post/' + _id,
        })
        .catch((error) => console.error('Error sharing post:', error));
    } else {
      alert('This sharing method is not supported on this browser.');
    }
  };

  if (deleted) {
    return null;
  }

  return (
    <div className={`${deleted ? 'hidden' : ''}`}>
      <div>
        <Toaster />
      </div>
      <Card
        key={_id}
        className="overflow-hidden my-2 mx-auto w-full md:w-[70%]  dark"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                className="flex items-center gap-3"
                href={`/profile/${owner_id}`}
              >
                <Avatar>
                  <AvatarImage
                    className={!ownerImage && 'bg-dark-4 p-1'}
                    src={ownerImage ?? '/assets/user.svg'}
                    alt={ownerName}
                  />
                  <AvatarFallback>{ownerName}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{ownerName}</p>
                  <p className="text-sm text-muted-foreground">
                    @{ownerUsername}
                  </p>
                </div>
              </Link>
            </div>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal className="h-8 w-8 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark">
                  <DropdownMenuItem>
                    <Link href={`/profile/${owner_id}`}>Profile</Link>
                  </DropdownMenuItem>

                  {owner_id === User_id && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link
                          href={`/post/edit/${_id}`}
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
          src={image}
          alt={caption ?? 'Image'}
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          className="max-h-96 w-full object-contain bg-dark-4"
        />
        <div className="p-4">
          {caption && (
            <p className="mb-4 text-sm">
              <b>Caption : </b>
              {caption}
            </p>
          )}

          <div className="flex gap-4">
            <Button variant={'ghost'} size="sm" onClick={handleLike}>
              <Image
                width={24}
                height={24}
                src={isLiked ? '/assets/heart-filled.svg' : '/assets/heart.svg'}
                alt="like"
              />
              <p>{isLiked ? likes.length + 1 : likes.length}</p>
            </Button>

            {
              // TODO: implement Commenting
            }

            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Image
                width={24}
                height={24}
                src={'/assets/share.svg'}
                alt="share"
              />
              Share
            </Button>
          </div>
        </div>

        <div className="px-4 py-2">
          {createdAt && (
            <p className="text-[10px] text-muted-foreground">{createdAt}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
