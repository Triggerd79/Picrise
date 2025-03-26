import Pagination from '@/components/Pagination';
import Post from '@/components/Post';
import PostSkeleton from '@/components/skeletons/PostSkeleton';
import { fetchLatestPosts } from '@/lib/actions/post.action';
import { fetchUser, updateUser } from '@/lib/actions/user.action';
import { formatDate } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

async function Home({ searchParams }) {
  const { page } = await searchParams;

  const user = await currentUser();

  let User;

  if (!user) {
    redirect('/sign-in'); // redirect to sign in page if user is not logged in
  }

  if (user) {
    User = await fetchUser(user.id);

    if (User.success) {
      User = User.user;
    } else {
      User = await updateUser({
        userId: user.id,
        username: user.username,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.imageUrl,
      });
    }
  }

  return (
    <>
      <h1 className="text-heading2-bold text-light-1 text-left">Home</h1>

      <Suspense fallback={<PostSkeleton />}>
        <Posts page={page} User={User} />
      </Suspense>
    </>
  );
}

const Posts = async ({ page, User }) => {
  const pageSize = 10;
  const res = await fetchLatestPosts(page ? +page : 1, pageSize);
  const posts = res.posts;

  if (posts?.length === 0) {
    return (
      <>
        <p className="text-center !text-base-regular text-light-3 ">
          No posts found
        </p>
      </>
    );
  }

  return (
    <>
      <section className=" flex flex-col gap-2">
        {posts.map((post) => {
          return (
            <Post
              key={post._id.toString()}
              _id={post._id.toString()}
              owner_id={post.owner._id.toString()}
              ownerName={post.owner.firstName}
              ownerImage={post.owner.image}
              ownerUsername={post.owner.username}
              image={post.image}
              caption={post.caption}
              likes={post.likes.map((id) => id.toString())}
              fileId={post.fileId}
              createdAt={formatDate(post.createdAt.toString())}
              User_id={User._id.toString()}
              UserId={User.id}
            />
          );
        })}
      </section>

      <Pagination path="/" pageNumber={page ? +page : 1} isNext={res.isNext} />
    </>
  );
};

export default Home;
