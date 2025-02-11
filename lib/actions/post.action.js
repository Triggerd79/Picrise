'use server';

import { connectToDB } from '../mongoose';
import Post from '../models/post.model';
import User from '../models/user.model';
import { fetchUser } from './user.action';

// Create Post
async function createPost({ ownerClerkId, image, prompt, caption }) {
  // connect to the database
  await connectToDB();

  try {
    const owner = await fetchUser(ownerClerkId);
    if (!owner) {
      return { success: false, message: 'User not found', status: 404 };
    }
    const ownerId = owner._id; // mongodb object Id

    // Create a new post
    const post = new Post({
      owner: ownerId,
      image,
      prompt,
      caption,
    });

    // Save the post
    await post.save();

    // Update the user's post list
    await User.findOneAndUpdate(
      { id: ownerClerkId },
      { $push: { post: post } },
    );

    // Return the response
    return { success: true, message: 'Post created successfully', status: 200 };
  } catch (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
}

// Update post
async function updatePost({ ownerClerkId, prompt, caption }) {
  // connect to the database
  await connectToDB();

  try {
    const owner = await fetchUser(ownerClerkId);

    if (!owner) {
      return { success: false, message: 'User not found', status: 404 };
    }
    const ownerId = owner._id; // mongodb object Id

    // Update the post
    await Post.findOneAndUpdate({ owner: ownerId }, { prompt, caption });

    // Return the response
    return { success: true, message: 'Post updated successfully', status: 200 };
  } catch (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }
}

// Fetch Latest Posts
async function fetchLatestPosts(pageNumber = 1, pageSize = 20) {
  // connect to the database
  await connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts
  const postsQuery = Post.find()
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: 'owner',
      model: User,
    })
    .lean();

  const totalPostsCount = await Post.countDocuments(); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

// Fetch Post by Id
async function fetchPostById(postId) {
  // connect to the database
  await connectToDB();
  const post = await Post.findById(postId)
    .populate({
      path: 'owner',
      model: 'User',
    })
    .lean()
    .exec();

  if (!post) {
    return { success: false, message: 'Post not found', status: 404 };
  }

  return post;
}

// delete post
async function deletePost({ postId, ownerClerkId }) {
  // connect to the database
  await connectToDB();
  try {
    const post = await Post.findById({ _id: postId });
    const owner = await fetchUser(ownerClerkId);

    if (!post) {
      return { success: false, message: 'Post not found', status: 404 };
    }

    if (!owner) {
      return { success: false, message: 'User not found', status: 404 };
    }

    const ownerMongoId = owner._id;

    if (ownerMongoId.toString() !== post.owner.toString()) {
      return { success: false, message: 'Unauthorized', status: 401 };
    }

    await post.deleteOne(); // Delete the post

    // Update user's post list
    await User.findOneAndUpdate(
      { id: ownerClerkId },
      { $pull: { post: postId } },
      { new: true }, // This option returns the modified document
    );
    return { message: 'Post deleted successfully', status: 200 };
  } catch (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}

// Like Post
async function likeOrDislikePost({ postId, liked }) {
  // connect to the database
  await connectToDB();

  // Update the post
  const post = await Post.findOne({ _id: postId });

  if (!post) {
    return { success: false, message: 'Post not found', status: 404 };
  }
  console.log('Post found : ', post);

  if (liked) {
    post.$inc('likes', 1); // increment the like count by 1
    await post.save();
    return { success: true, message: 'Post liked successfully', status: 200 };
  } else {
    post.$inc('likes', -1); // decrement the like count by 1
    await post.save();
    return {
      success: true,
      message: 'Post disliked successfully',
      status: 200,
    };
  }
}

// TODO: Implement commenting on post
// Comment on Post
async function commentPost() {}

// Delete Comment on Post
async function deleteComment() {}

export {
  createPost,
  updatePost,
  fetchLatestPosts,
  fetchPostById,
  deletePost,
  likeOrDislikePost,
  commentPost,
  deleteComment,
};
