import { fetchUser } from '@/lib/actions/user.action';
import Profile from '@/components/Profile';

const ProfilePage = async ({ params }) => {
  const { id } = await params;

  const response = await fetchUser(id);
  const user = response.success ? response.user : null;

  return (
    <div className="py-6 w-full mx-auto">
      <Profile User={user} />
    </div>
  );
};

export default ProfilePage;
