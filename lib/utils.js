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
      _id: doc.owner._id.toString(),
      post: doc.owner.post.map((id) => id.toString()),
      following: doc.owner.following.map((id) => id.toString()),
      followers: doc.owner.followers.map((id) => id.toString()),
    },
    createdAt: doc.createdAt.toISOString(),
  };
}

export function serializeMongoUserObject(doc) {
  return {
    ...doc,
    _id: doc._id.toString(),
    followers: doc.followers.map((id) => id.toString()),
    following: doc.following.map((id) => id.toString()),
    post: doc.post.map((p) => {
      return {
        ...p,
        _id: p._id.toString(),
        owner: p.owner.toString(),
        createdAt: p.createdAt.toISOString(),
      };
    }),
  };
}

export function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}
