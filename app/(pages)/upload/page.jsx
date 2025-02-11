'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Toaster } from 'react-hot-toast';
import { createPost } from '@/lib/actions/post.action';
import { useUser } from '@clerk/nextjs';
import { notify } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { isLoaded, user } = useUser();

  if (isLoaded) {
    const { id } = user;
    var userId = id;
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        notify({
          message: 'Unsupported file type. Please upload a PNG, JPG image.',
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
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      createPost({
        ownerClerkId: userId,
        image: imagePreview,
        prompt,
        caption,
      });

      // Show success message
      notify({ message: 'Your creation has been shared!', success: true });

      // Reset form
      setImagePreview(null);
      setPrompt('');
      setCaption('');
      router.push('/');
    } catch (error) {
      // Show error message
      console.log(error);
      notify({ message: 'Failed to share your creation', success: false });
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
              <label className="block text-sm font-medium mb-2">
                AI-Generated Image
              </label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-lg object-cover aspect-[4/3]"
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or GIF (MAX. 5MB)
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
                  htmlFor="prompt"
                  className="block text-sm font-medium mb-2"
                >
                  Prompt Used
                </label>
                <Textarea
                  id="prompt"
                  placeholder="Enter the prompt you used to generate this image..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="caption"
                  className="block text-sm font-medium mb-2"
                >
                  Caption (Optional)
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
            disabled={!imagePreview || !prompt || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Share Creation'}
          </Button>
        </form>
      </div>
    </>
  );
}
