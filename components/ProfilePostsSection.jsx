import { Card } from './ui/card';
import Link from 'next/link';
import Image from 'next/image';

const ProfilePostsSection = ({ posts }) => {
  return (
    <section>
      <h4 className="text-heading4-bold text-light-1 mt-8"> Posts</h4>
      <div className="mt-1">
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              return (
                <Link href={`/post/${post._id}`} key={post._id}>
                  <Card className={`dark border-none`}>
                    <Image
                      src={post.image}
                      width={100}
                      height={100}
                      alt={'image'}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="aspect-[4/3] w-full object-contain"
                    />
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-2xl font-bold"> No Posts by user </p>
        )}
      </div>
    </section>
  );
};

export default ProfilePostsSection;
