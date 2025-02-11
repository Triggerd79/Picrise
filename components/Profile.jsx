'use client';
import { Card } from '@/components/ui/card';
import { Users, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
const Profile = ({ user }) => {
  return (
    <>
      {/* Profile header */}
      <div className="flex w-full flex-col justify-start">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-20 w-20 object-cover">
              <Image
                src={user.image !== '' ? user.image : '/assets/user.svg'}
                alt="logo"
                fill
                className="rounded-full object-contain shadow-2xl"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-left text-heading3-bold text-light-1">
                {user.name}
              </h2>
              <p className="text-base-medium text-gray-1">@{user.username}</p>
            </div>
          </div>
          {
            <Link href="/profile/edit">
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
          }
        </div>

        <p className="mt-6 max-w-lg text-base-regular text-light-2">
          {user.bio}
        </p>
      </div>

      <div className="mt-3">
        <div className="grid gap-4 grid-cols-3 ">
          <Card className="dark">
            <div className="text-center p-2 rounded-lg bg-secondary">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-bold">{user.post?.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
          </Card>
          <Card className="dark">
            <div className="text-center p-2 rounded-lg bg-secondary">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-bold">{user.followers?.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
          </Card>
          <Card className="dark">
            <div className="text-center p-2 rounded-lg bg-secondary">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-bold">{user.following?.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Profile Posts */}
      <h4 className="text-heading4-bold text-light-1 mt-8"> Posts</h4>
      <div className="mt-1">
        {user.post?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {user.post.map((post) => (
              <Link href={`/post/${post._id}`} key={post._id}>
                <Card className="dark">
                  <Image
                    src={post.image}
                    width={100}
                    height={100}
                    alt={post.prompt}
                    className="aspect-[4/3] w-full object-scale-down"
                  />
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-2xl font-bold"> No Posts by user </p>
        )}
      </div>
    </>
  );
};

export default Profile;
