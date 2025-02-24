import Post from '@/components/Post';
import {
  serializeMongoPostObject,
  serializeMongoUserObject,
} from '@/lib/utils';
import Pagination from '@/components/Pagination';
import { fetchLatestPosts } from '@/lib/actions/post.action';
import { currentUser } from '@clerk/nextjs/server';
import { fetchUser } from '@/lib/actions/user.action';

async function Home({ searchParams }) {
  const { page } = await searchParams;
  const res = await fetchLatestPosts(page ? +page : 1, 20);
  const posts = res.posts;
  const user = await currentUser();
  let mongoUser = null;

  if (user) {
    mongoUser = await fetchUser(user.id);
  }

  if (res && res.posts?.length === 0) {
    return (
      <>
        <h1 className="text-heading2-bold text-light-1 text-left">Home</h1>
        <p className="text-center !text-base-regular text-light-3 ">
          No posts found
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-heading2-bold text-light-1 text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {posts.map((post) => {
          post = serializeMongoPostObject(post);
          return (
            <Post
              key={post._id.toString()}
              post={post}
              currentUser={user ? serializeMongoUserObject(mongoUser) : null}
            />
          );
        })}
      </section>

      <Pagination path="/" pageNumber={page ? +page : 1} isNext={res.isNext} />
    </>
  );
}

export default Home;
