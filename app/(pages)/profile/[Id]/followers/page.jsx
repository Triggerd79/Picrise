import { fetchFollowers } from '@/lib/actions/user.action';
import Image from 'next/image';
import Link from 'next/link';

const page = async ({ params }) => {
  const { id } = await params;

  const response = await fetchFollowers(id);
  const followers = response.success ? response.followers : [];

  if (followers.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 my-5">
          <p className="text-base-medium text-light-1">No followers yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-heading3-bold text-light-1">Followers</h2>
      </div>
      <div className="flex flex-col gap-3 my-5">
        {followers.map(({ _id, firstName, lastName, username, image }) => (
          <div key={_id} className="flex items-center justify-between">
            <div className="flex items-center gap-3 font-thin text-muted-foreground">
              <Image
                src={image}
                alt="logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <p className="text-base-medium text-light-1">
                  {firstName} {lastName}
                </p>
                <Link href={`/profile/${_id}`}>
                  <p className="text-base-medium text-light-1">@{username}</p>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
