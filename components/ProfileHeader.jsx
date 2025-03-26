'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { Card } from './ui/card';
import { Image as ImageIcon, Users } from 'lucide-react';
import { followUser, unfollowUser } from '@/lib/actions/user.action';
import { useAuth } from '@clerk/nextjs';

function ProfileHeader({
  imageURL,
  firstName,
  lastName,
  username,
  userBio,
  totalPosts,
  followers,
  following,
  id,
  currentUser_id,
}) {
  const checkFollowing = () => {
    const isFollowing = following.includes(currentUser_id.toString());
    return isFollowing;
  };

  const { userId } = useAuth();
  const [isFollowing, setIsFollowing] = useState(checkFollowing());

  const handleFollow = async () => {
    try {
      const res = await followUser({
        userId: userId.toString(),
        followedUserId: id.toString(),
      });

      if (res.success) {
        setIsFollowing(true);
        followers.push(userId.toString());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnFollow = async () => {
    try {
      const res = await unfollowUser({
        userId: userId.toString(),
        followedUserId: id.toString(),
      });

      if (res.success) {
        setIsFollowing(false);
        followers.filter((id) => id !== userId.toString());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imageURL?.length > 0 ? imageURL : '/assets/user.svg'}
              alt="logo"
              fill
              className="rounded-full object-contain shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {firstName} {lastName}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
          {id !== userId && (
            <div className="flex items-center gap-3 mx-3 opacity-30 font-thin text-muted-foreground">
              <Button
                variant="ghost"
                onClick={isFollowing ? handleUnFollow : handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          )}
          {id === userId && (
            <Link href="/user-profile">
              <div className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2">
                <Image
                  src="/assets/edit.svg"
                  alt="logout"
                  width={16}
                  height={16}
                />
                <p className="text-light-2 max-sm:hidden">Edit</p>
              </div>
            </Link>
          )}
        </div>
        <p className="mt-6 max-w-lg text-base-regular text-light-2">
          {userBio}
        </p>
      </div>
      <div className="mt-3">
        <div className="grid gap-4 grid-cols-3 ">
          <Card className="dark">
            <div className="text-center p-2 rounded-lg bg-secondary">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-bold">{totalPosts}</span>
              </div>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
          </Card>
          <Link href={`/profile/${id}/followers`}>
            <Card className="dark">
              <div className="text-center p-2 rounded-lg bg-secondary bg-dark-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-light-1" />
                  <span className="font-bold text-light-1">
                    {followers.length}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
            </Card>
          </Link>
          <Link href={`/profile/${id}/following`}>
            <Card className="dark">
              <div className="text-center p-2 rounded-lg bg-secondary">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold">{following.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProfileHeader;
