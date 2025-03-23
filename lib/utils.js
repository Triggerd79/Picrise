import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const notify = ({ message, success = true, duration = 4000 }) => {
  toast(message, {
    duration: duration,
    icon: success ? '🎉' : '❌',
    style: {
      border: `2px solid ${success ? '#10B981' : '#EF4444'}`,
    },
  });
};

export function serializeMongoPostObject(doc) {
  return {
    ...doc,
    _id: doc._id.toString(),
    owner: {
      ...doc.owner,
      buffer: doc.owner.buffer ? doc.owner.buffer.toString() : null,
      _id: doc.owner._id.toString(),
    },
    likes: doc.likes?.map((id) => id.toString()),
    comments: doc.comments?.map((id) => id.toString()),
    createdAt: doc.createdAt.toString(),
    updatedAt: doc.updatedAt.toString(),
  };
}

export function serializeMongoUserObject(doc) {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt.toString(),
    updatedAt: doc.updatedAt.toString(),
    commentedOn: doc.commentedOn?.map((id) => id.toString()),
    likedPosts: doc.likedPosts?.map((id) => id.toString()),
    followers: doc.followers.map((id) => id.toString()),
    following: doc.following.map((id) => id.toString()),
    posts: doc.posts?.map((p) => {
      return {
        ...p,
        buffer: p.buffer ? p.buffer.toString() : null,
        _id: p._id?.toString(),
      };
    }),
  };
}

export function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

export const uploadImage = async ({ file, name }) => {
  if (!file) return { success: false, error: 'No file provided' };
  if (!name) return { success: false, error: 'No name provided' };

  const url = 'https://upload.imagekit.io/api/v1/files/upload';
  const form = new FormData();
  form.append('file', file);
  form.append('fileName', name ?? 'image');
  form.append('useUniqueFileName', 'true');
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${process.env.NEXT_PUBLIC_ENCODED_IMAGE_KIT_PRIVATE_KEY}`,
    },
  };

  options.body = form;

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      return { success: false, error: 'Failed to upload image' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to upload image', error.message);
  }
};

export const deleteImage = async ({ fileId }) => {
  if (!fileId) {
    return {
      success: false,
      error: 'No file id provided',
    };
  }

  const url = `https://api.imagekit.io/v1/files/${fileId}`;
  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${process.env.NEXT_PUBLIC_ENCODED_IMAGE_KIT_PRIVATE_KEY}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to delete image',
      };
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};
