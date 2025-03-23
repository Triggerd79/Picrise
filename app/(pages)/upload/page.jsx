'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createPost } from '@/lib/actions/post.action';
import { notify, uploadImage } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function UploadPage() {
  const router = useRouter();

  const { isLoaded, user } = useUser();

  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null);

  if (isLoaded) {
    var { id } = user;
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        notify({
          message:
            'Unsupported file type. Please upload a PNG, JPG or WEBP image.',
          success: false,
        });
        return;
      }

      if (file.size > maxSize) {
        notify({
          message:
            'File size exceeds the 5MB limit. Please upload a smaller file.',
          success: false,
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      setImage(file);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    if (!image) {
      notify({ message: 'Please upload an image', success: false });
      setIsUploading(false);
      return;
    }

    // remove trailing spaces from caption
    setCaption(caption.trim());

    try {
      const res = await uploadImage({
        file: image,
        name: caption ? caption : 'image',
      });

      if (!res.success) {
        notify({
          message: 'Failed to share your creation Image kit error ',
          success: false,
        });
        setIsUploading(false);
        return;
      }

      const response = await createPost({
        userId: id,
        image: res.data.url,
        fileId: res.data.fileId,
        caption,
      });

      if (!response.success) {
        console.log('Post creation error ');
        notify({
          message: 'Failed to share your creation Post creation error ',
          success: false,
        });
        setIsUploading(false);
        return;
      }

      //   Reset form
      setImagePreview(null);
      setCaption('');

      // Show success message
      notify({ message: 'Your creation has been shared!', success: true });

      // redirect to home
      console.log(response);
      router.push(`/post/${response.postId}`);
    } catch (error) {
      console.log(error);
      notify({
        message: 'Failed to share your creation Error ',
        success: false,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="container max-w-2xl py-6 mx-auto">
        <h1 className="mb-6 text-3xl text-center font-bold">
          Share Your Creation
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Image</label>
              {imagePreview ? (
                <div className="relative">
                  <Image
                    width={100}
                    height={100}
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-lg object-contain aspect-square"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImagePlus className="h-12 w-12 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or WEBP (MAX. 5MB)
                    </p>
                  </div>
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="caption"
                  className="block text-sm font-medium mb-2"
                >
                  Caption
                </label>
                <Textarea
                  id="caption"
                  placeholder="Add a caption to your post..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={!imagePreview || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Share Creation'}
          </Button>
        </form>
      </div>
    </>
  );
}
