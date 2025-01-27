import Post from './Post';

const Feed = ({ posts }) => {
  return (
    <div className="w-[70%] mx-auto">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
