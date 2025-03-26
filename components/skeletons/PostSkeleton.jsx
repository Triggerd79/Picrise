import { Card } from '@/components/ui/card';
const PostSkeleton = () => {
  return (
    <>
      <Card className="overflow-hidden my-2 mx-auto w-full md:w-[70%] dark">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-dark-4"></div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 rounded-full bg-light-2"></div>
                <div className="h-4 w-16 rounded-full bg-light-2"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-96 bg-dark-4"></div>
        <div className="p-4">
          <div className="h-4 w-24 rounded-full bg-light-2 my-2"></div>
          <div className="h-4 w-16 rounded-full bg-light-2 my-2"></div>
        </div>
      </Card>
    </>
  );
};

export default PostSkeleton;
