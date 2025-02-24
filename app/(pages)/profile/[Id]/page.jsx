import { fetchUser } from '@/lib/actions/user.action';
import Profile from '@/components/Profile';
import { serializeMongoUserObject } from '@/lib/utils';

const ProfilePage = async ({ params }) => {
  const { Id } = await params;
  const user = await fetchUser(Id);
  return (
    <div className="py-6 w-full mx-auto">
      <Profile user={serializeMongoUserObject(user)} />
    </div>
  );
};

export default ProfilePage;
