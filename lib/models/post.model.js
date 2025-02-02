import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
