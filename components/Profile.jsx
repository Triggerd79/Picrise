import ProfileHeader from './ProfileHeader';
import { fetchUser, fetchUserPosts } from '@/lib/actions/user.action';
import ProfilePostsSection from './ProfilePostsSection';

const Profile = async ({ User }) => {
  if (!User) {
    return (
      <div className="text-center text-heading3-bold text-light-1">
        Something went wrong
      </div>
    );
  }

  const userFetch = async () => {
    const res = await fetchUser(User.id.toString());
    if (!res.success) {
      return null;
    }
    return res.user._id.toString();
  };

  const fetchPosts = async () => {
    const res = await fetchUserPosts(User.id.toString());
    if (!res.success) {
      return null;
    }
    return res.posts;
  };

  return (
    <>
      <ProfileHeader
        imageURL={User.image}
        firstName={User.firstName}
        lastName={User.lastName}
        username={User.username}
        userBio={User.bio}
        totalPosts={User.posts.length}
        followers={User.followers.map((id) => id.toString())}
        following={User.following.map((id) => id.toString())}
        id={User.id.toString()}
        currentUser_id={await userFetch()}
      />

      <ProfilePostsSection posts={await fetchPosts()} />
    </>
  );
};

export default Profile;
