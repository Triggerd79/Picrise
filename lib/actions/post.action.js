'use server';
import Comment from '../models/comment.model';
import Post from '../models/post.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

// Create Post
async function createPost({ userId, image, caption, fileId }) {
  if (!userId) {
    return {
      success: false,
      message: 'userId is required',
    };
  }

  if (!image) {
    return {
      success: false,
      message: 'image is required',
    };
  }

  if (!fileId) {
    return {
      success: false,
      message: 'fileId is required',
    };
  }

  try {
    // connect to the database
    await connectToDB();

    const owner = await User.findOne({
      id: userId,
    });

    if (!owner) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Create a new post
    const post = await Post.create({
      owner: owner._id,
      image,
      fileId,
      caption,
    });

    // Update the user's post list
    await User.findOneAndUpdate({ id: owner.id }, { $push: { posts: post } });

    return {
      success: true,
      message: 'Post created successfully',
      postId: post._id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
}

// Update post
async function updatePost({ userId, caption, postId }) {
  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOne({ id: userId });

    if (!user) {
      return {
        success: false,
        message: 'User not found ',
      };
    }

    const owner = await User.findOne({ id: userId });
    if (!owner) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Update the post
    const post = await Post.findOneAndUpdate(
      { _id: postId, owner: owner._id },
      { caption },
    );

    if (!post) {
      return {
        success: false,
        message: 'Post not found',
      };
    }

    return {
      success: true,
      message: 'Post updated successfully',
      postId: post._id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }
}

// Fetch Latest Posts
async function fetchLatestPosts(pageNumber = 1, pageSize = 10) {
  try {
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

    return {
      success: true,
      message: `Fetched ${totalPostsCount} posts successfully`,
      posts,
      isNext,
      totalPostsCount,
    };
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
}

// delete post
async function deletePost({ postId, userId }) {
  try {
    // connect to the database
    await connectToDB();
    const post = await Post.findById({ _id: postId });
    const owner = await User.findOne({ id: userId.toString() });

    if (!post) {
      return {
        success: false,
        message: 'Post not found',
      };
    }

    if (!owner) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const ownerMongoId = owner._id;
    if (ownerMongoId.toString() !== post.owner.toString()) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    // Delete all comment docs on associated with the post
    if (post.comments?.length > 0) {
      post.comments?.map(async (id) => {
        const comment = Comment.findOne({ _id: id });
        const userId = comment.user;

        // Pull comment from user's comment list
        await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { commentedOn: comment._id } },
        );
      });
    }

    // Update user's likedPost list
    if (post.likes?.length > 0) {
      post.likes?.map(async (id) => {
        await User.findOneAndUpdate({ _id: id }, { $pull: { likedPosts: id } });
      });
    }

    await post.deleteOne(); // Delete the post

    // Update user's post list
    await User.findOneAndUpdate({ id: userId }, { $pull: { posts: postId } });

    return {
      success: true,
      message: 'Post deleted successfully',
    };
  } catch (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}

// Like or Dislike  Post
async function likeOrDislikePost({ postId, userId }) {
  try {
    // connect to the database
    await connectToDB();

    // Update the post
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return {
        success: false,
        message: 'Post not found',
      };
    }

    const user = await User.findOne({ id: userId });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const isLiked = post.likes.includes(user._id);
    if (isLiked) {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: user._id } },
      );

      await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { likedPosts: post._id } },
      );
    } else {
      await Post.findOneAndUpdate(
        { _id: postId },
        { $addToSet: { likes: user._id } },
      );

      await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { likedPosts: post._id } },
      );
    }

    return {
      success: true,
      message: 'Post liked/disliked successfully',
    };
  } catch (error) {
    throw new Error(`Failed to like or dislike post: ${error.message}`);
  }
}

// Comment on Post
async function commentPost({ postId, userId, comment }) {
  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOneAndUpdate(
      { id: userId },
      { $addToSet: { commentedOn: postId } },
    );

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const commentDoc = await Comment.create({
      post: postId,
      user: user._id,
      comment,
    });

    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: commentDoc } },
      { new: true },
    );

    if (!post) {
      // Delete the comment document if the post is not found
      await commentDoc.deleteOne();

      await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { commentedOn: postId } },
      );

      return {
        success: false,
        message: 'Post not found',
      };
    }

    return {
      success: true,
      message: 'Comment added successfully',
    };
  } catch (error) {
    throw new Error(`Failed to comment on post: ${error.message}`);
  }
}

// Delete Comment on Post
async function deleteComment({ postId, commentId, userId }) {
  // connect to the database
  await connectToDB();

  const user = await User.findOne({ id: userId });
  if (!user) {
    return {
      success: false,
      message: 'User not found',
    };
  }

  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    return {
      success: false,
      message: 'Comment not found',
    };
  }

  const isOwner = comment.user.toString() === user._id.toString();
  if (!isOwner) {
    return {
      success: false,
      message: 'Unauthorized',
    };
  }

  const post = await Post.findOneAndUpdate(
    { _id: postId },
    { $pull: { comments: commentId } },
  );
  if (!post) {
    return {
      success: false,
      message: 'Post not found',
    };
  }

  await User.findOneAndUpdate(
    { _id: user._id },
    { $pull: { commentedOn: postId } },
  );

  await comment.deleteOne();
  return {
    success: true,
    message: 'Comment deleted successfully',
  };
}

async function fetchComments(postId) {
  try {
    // connect to the database
    await connectToDB();

    const post = await Post.findById(postId)
      .populate({
        path: 'comments',
        model: Comment,
        populate: {
          path: 'user',
          model: User,
        },
      })
      .lean()
      .exec();

    if (!post) {
      return {
        success: false,
        message: 'Post not found',
      };
    }

    return {
      success: true,
      comments: post.comments,
    };
  } catch (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
}

export {
  commentPost,
  createPost,
  deleteComment,
  deletePost,
  fetchLatestPosts,
  likeOrDislikePost,
  updatePost,
  fetchComments,
};
