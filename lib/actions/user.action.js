'use server';

import { connectToDB } from '../mongoose';
import User from '../models/user.model';

// Create or Update user
async function updateUser({ userId, email, bio, name, username, image }) {
  try {
    // connect to the database
    await connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        email: email.toLowerCase(),
        username: username,
        name: name,
        bio: bio,
        image: image,
      },
      { upsert: true }, // update user if exists, else create a new user
    );

    // Return the response
    return {
      success: true,
      message: 'User created/updated successfully',
      status: 200,
    };
  } catch (error) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

// Delete user
async function deleteUser(userId) {
  // connect to the database
  await connectToDB();

  // Find user by clerk id
  const user = await User.findOne({ id: userId });

  if (!user) {
    return { message: 'User not found', status: 404 };
  }

  // Remove user from the follower list of other users
  await user.following.forEach(async (id) => {
    const followedUser = await User.findOne({ _id: id }); // Find the Followed user using Mongodb _id
    if (followedUser) {
      followedUser.followers = followedUser.followers.filter(
        (id) => id.toString() !== user._id.toString(),
      );
      await followedUser.save();
    }
  });

  // Remove user from the following list of other users
  await user.followers.forEach(async (id) => {
    const follower = await User.findOne({ _id: id }); // Find the Followed user using Mongodb _id
    if (follower) {
      follower.following = following.following.filter(
        (id) => id.toString() !== user._id.toString(),
      );
      await follower.save();
    }
  });

  // Finally, delete the user
  await User.findOneAndDelete({ id: userId });

  // return the response
  return { message: 'User deleted successfully', status: 200 };
}

// Fetch user details by Clerk id
async function fetchUser(userId) {
  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOne({ id: userId })
      .populate({
        path: 'post',
        model: 'Post',
      })
      .populate({
        path: 'following',
        model: 'User',
      })
      .populate({
        path: 'followers',
        model: 'User',
      })
      .lean();

    if (!user) {
      return { success: false, message: 'User not found', status: 404 };
    }

    return user;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch user',
      status: 500,
      error: error,
    };
  }
}

// Fetch User by username
async function fetchUserByUsername(username) {
  try {
    // connect to the database
    await connectToDB();

    const user = await User.findOne({ username: username })
      .populate({
        path: 'post',
        model: 'Post',
      })
      .populate({
        path: 'following',
        model: 'User',
      })
      .populate({
        path: 'followers',
        model: 'User',
      })
      .lean();

    if (!user) {
      return { success: false, message: 'User not found', status: 404 };
    }

    return user;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch user',
      status: 500,
      error: error,
    };
  }
}

// Follow
async function followUser({ userId, followedUserId }) {
  try {
    // connect to the database
    await connectToDB();

    // Find the user and the followed user
    const user = await User.findOne({ id: userId.toString() });
    const followedUser = await User.findOne({ id: followedUserId.toString() });

    if (!user || !followedUser) {
      return { success: false, message: 'User not found', status: 404 };
    }

    // Update the user's following list
    if (!user.following.includes(followedUser._id)) {
      user.following.push(followedUser._id);
      await user.save();
    }

    // Update the followed user's followers list
    if (!followedUser.followers.includes(user._id)) {
      followedUser.followers.push(user._id);
      await followedUser.save();
    }

    return {
      success: true,
      message: 'User followed successfully',
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to follow user',
      status: 500,
      error: error,
    };
  }
}

// Unfollow
async function unfollowUser({ userId, unFollowedUserId }) {
  try {
    // connect to the database
    await connectToDB();

    // Find the user and the unfollowed user
    const user = await User.findOne({ id: userId.toString() });
    const unFollowedUser = await User.findOne({
      id: unFollowedUserId.toString(),
    });

    if (!user || !unFollowedUser) {
      return { success: false, message: 'User not found', status: 404 };
    }

    // Update the user's following list
    if (user.following.includes(unFollowedUser._id)) {
      // Remove the user from the following list
      user.following = user.following.filter(
        (id) => id.toString() !== unFollowedUser._id.toString(),
      );
      await user.save();
    }

    // Update the followed user's followers list
    if (unFollowedUser.followers.includes(user._id)) {
      // Remove the user from the followers list
      unFollowedUser.followers = unFollowedUser.followers.filter(
        (id) => id.toString() !== user._id.toString(),
      );
      await unFollowedUser.save();
    }

    return {
      success: true,
      message: 'User unfollowed successfully',
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to unfollow user',
      status: 500,
      error: error,
    };
  }
}

export {
  updateUser,
  deleteUser,
  fetchUser,
  fetchUserByUsername,
  followUser,
  unfollowUser,
};
