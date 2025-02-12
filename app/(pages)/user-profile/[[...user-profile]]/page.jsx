'use client';

import { UserProfile } from '@clerk/nextjs';
import Image from 'next/image';
import { updateUser } from '@/lib/actions/user.action';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { notify } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const EditIcon = () => {
  return (
    <Image src={'/assets/edit.svg'} alt="edit icon" width={16} height={16} />
  );
};

const EditBio = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (e.target.bio.value === '') {
          notify({ message: 'Bio cannot be empty', success: false });
          return;
        }

        if (e.target.bio.value.length > 60) {
          notify({
            message: 'Bio cannot be more than 60 characters',
            success: false,
          });
          return;
        }

        if (e.target.bio.value.length < 3) {
          notify({
            message: 'Bio cannot be less than 3 characters',
            success: false,
          });
          return;
        }

        await updateUser({
          userId: user.id,
          name: user.fullName,
          email: user.emailAddresses[0].emailAddress,
          username: user.username,
          image: user.imageUrl,
          bio: e.target.bio.value,
        });

        notify({ message: 'Bio updated successfully', success: true });
        router.push(`/profile/${user.id}`);
      }}
      className="flex flex-col gap-10"
    >
      <label htmlFor="bio">Bio</label>
      <textarea
        cols="30"
        rows="10"
        name="bio"
        className="text-black rounded-md border border-gray-200 outline-none focus:border-gray-300 focus:shadow-md p-1"
        placeholder="Enter your Bio...."
        defaultValue={''}
      />
      <Button type="submit" className="bg-primary-500">
        Save
      </Button>
    </form>
  );
};

const UserProfilePage = () => (
  <>
    <div>
      <Toaster />
    </div>
    <UserProfile path="/user-profile" routing="path">
      <UserProfile.Page
        label="Edit Bio"
        labelIcon={<EditIcon />}
        url="edit-bio"
      >
        <EditBio />
      </UserProfile.Page>
    </UserProfile>
  </>
);

export default UserProfilePage;
