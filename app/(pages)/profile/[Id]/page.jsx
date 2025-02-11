import { fetchUser } from '@/lib/actions/user.action';
import Profile from '@/components/Profile';
import { serializeMongoUserObject } from '@/lib/utils';

const ProfilePage = async ({ params }) => {
  const user = await fetchUser(params.Id);
  return (
    <div className="container py-6 w-full mx-auto">
      <Profile user={serializeMongoUserObject(user)} />
    </div>
  );
};

export default ProfilePage;
