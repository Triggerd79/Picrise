'use server';
import User from '../models/user.model';
import Post from '../models/post.model';
import Comment from '../models/comment.model';
import { connectToDB } from '../mongoose';
import { deleteImage } from '../utils';

// Create or Update user
async function updateUser({
  userId,
  email,
  bio,
  firstName,
  lastName,
  username,
  image,
}) {
  if (!userId) {
    return {
      success: false,
      message: 'UserId is required',
    };
  }

  if (!email) {
    return {
      success: false,
      message: 'Email is required',
    };
  }

  if (!username) {
    return {
      success: false,
      message: 'Username is required',
    };
  }

  if (!firstName) {
    return {
      success: false,
      message: 'first name is required',
    };
  }

  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOneAndUpdate(
      { id: userId },
      {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        firstName: firstName,
        lastName: lastName,
        bio: bio,
        image: image,
      },
      { new: true, upsert: true },
    );

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Return the response
    return {
      success: true,
      message: 'User created/updated successfully',
    };
  } catch (error) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

// Delete user
async function deleteUser(userId) {
  try {
    // connect to the database
    await connectToDB();

    // Find user by clerk id
    const user = await User.findOne({ id: userId });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Remove deleted user from the follower list of other users
    await user.following.forEach(async (id) => {
      await User.findOneAndUpdate(
        { _id: id },
        { $pull: { followers: user._id } },
      );
    });

    // Remove deleted user from the following list of other users
    await user.followers.forEach(async (id) => {
      await User.findOneAndUpdate(
        { _id: id },
        { $pull: { following: user._id } },
      );
    });

    // Remover user's all posts
    if (user.posts.length > 0) {
      user.posts.map(async (id) => {
        const post = await Post.findOne({ _id: id });
        if (post) {
          // Delete all comment docs on associated with the post
          if (post.comments.length > 0) {
            post.comments.map(async (id) => {
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
          if (post.likes.length > 0) {
            post.likes.map(async (id) => {
              await User.findOneAndUpdate(
                { _id: id },
                { $pull: { likedPosts: id } },
              );
            });
          }

          // delete post from image kit
          await deleteImage({ fileId: post.fileId });

          // Delete the post
          await Post.findOneAndDelete({ _id: id });
        }
      });
    }

    // Remove user's like on all posts
    if (user.likedPosts.length > 0) {
      user.likedPosts.map(async (id) => {
        await Post.findOneAndUpdate(
          { _id: id },
          { $pull: { likes: user._id } },
        );
      });
    }

    // Remove user's comment on all post
    if (user.commentedOn.length > 0) {
      user.commentedOn.map(async (commentId) => {
        const comment = Comment.findOne({ _id: commentId });

        if (comment) {
          const post = Post.findOne({ _id: comment.post });

          if (post) {
            await Post.findOneAndUpdate(
              { _id: comment.post },
              { $pull: { comments: commentId } },
            );
          }

          // Delete the original comment doc
          await Comment.findOneAndDelete({ _id: commentId });
        }
      });
    }

    // Finally, delete the user
    await User.findOneAndDelete({ id: userId });

    // return the response
    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

// Fetch user details by Clerk id
async function fetchUser(userId) {
  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOne({ id: userId.toString() }).lean();

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

// Fetch User by username
async function fetchUserByUsername(username) {
  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOne({ username: username }).lean();

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

// Follow
async function followUser({ userId, followedUserId }) {
  if (!userId) {
    return {
      success: false,
      message: 'UserId is required',
    };
  }

  if (!followedUserId) {
    return {
      success: false,
      message: 'followedUserId is required',
    };
  }

  try {
    // connect to the database
    await connectToDB();

    // Find the user and the followed user
    const user = await User.findOne({ id: userId.toString() });
    const followedUser = await User.findOne({ id: followedUserId.toString() });

    if (!user || !followedUser) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Check if the user is already following the followed user
    if (user.following.includes(followedUser._id)) {
      return {
        success: false,
        message: 'User is already following the followed user',
      };
    }

    // Update the user's following list
    await User.findOneAndUpdate(
      { id: userId.toString() },
      { $addToSet: { following: followedUser._id } },
    );

    // Update the followed user's followers list
    await User.findOneAndUpdate(
      { id: followedUserId.toString() },
      { $addToSet: { followers: user._id } },
    );

    return {
      success: true,
      message: 'User followed successfully',
    };
  } catch (error) {
    throw new Error(`Failed to follow user: ${error.message}`);
  }
}

// Unfollow
async function unfollowUser({ userId, unfollowedUserId }) {
  if (!userId) {
    return {
      success: false,
      message: 'UserId is required',
    };
  }

  console.log('unfollowedUserId', unfollowedUserId);

  if (!unfollowedUserId) {
    return {
      success: false,
      message: 'unfollowedUserId is required',
    };
  }
  try {
    // connect to the database
    await connectToDB();

    // Find the user and the unfollowed user
    const user = await User.findOne({ id: userId.toString() });
    const unfollowedUser = await User.findOne({
      id: unfollowedUserId.toString(),
    });

    if (!user || !unfollowedUser) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Check if the user is already following the unfollowed user
    if (!user.following.includes(unfollowedUser._id)) {
      return {
        success: false,
        message: 'User is not following the unfollowed user',
      };
    }

    // Remove the user from the following list
    await User.findOneAndUpdate(
      { id: userId.toString() },
      { $pull: { following: unfollowedUser._id } },
    );

    // Remove the user from the followers list
    await User.findOneAndUpdate(
      { id: unfollowedUserId.toString() },
      { $pull: { followers: user._id } },
    );

    return {
      success: true,
      message: 'User unfollowed successfully',
    };
  } catch (error) {
    throw new Error(`Failed to unfollow user: ${error.message}`);
  }
}

async function fetchUserPosts(userId) {
  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOne({ id: userId })
      .populate({
        path: 'posts',
        model: Post,
      })
      .lean()
      .exec();

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      posts: user.posts,
    };
  } catch (error) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

async function fetchFollowers(userId) {
  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOne({ id: userId })
      .populate({
        path: 'followers',
        model: User,
      })
      .lean()
      .exec();

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      followers: user.followers,
    };
  } catch (error) {
    throw new Error(`Failed to fetch user followers: ${error.message}`);
  }
}

async function fetchFollowing(userId) {
  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOne({ id: userId })
      .populate({
        path: 'following',
        model: User,
      })
      .lean()
      .exec();

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      following: user.following,
    };
  } catch (error) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

async function fetchLikedPosts(userId) {
  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOne({ id: userId })
      .populate({
        path: 'likedPosts',
        model: Post,
      })
      .lean()
      .exec();

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      posts: user.likedPosts,
    };
  } catch (error) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

async function fetchCommentedPosts(userId) {
  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOne({ id: userId })
      .populate({
        path: 'commentedOn',
        model: Comment,
        populate: {
          path: 'post',
          model: Post,
        },
      })
      .lean()
      .exec();

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      posts: user.commentedOn,
    };
  } catch (error) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

export {
  deleteUser,
  fetchUser,
  fetchUserByUsername,
  followUser,
  unfollowUser,
  updateUser,
  fetchUserPosts,
  fetchFollowers,
  fetchFollowing,
  fetchLikedPosts,
  fetchCommentedPosts,
};
