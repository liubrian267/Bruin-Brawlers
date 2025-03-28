import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  author: mongoose.Types.ObjectId | { 
    BrawlID: string;
    profilePicture?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  imageUrl: string | null;
  likedBy: string[];
}

const PostSchema: Schema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  imageUrl: { type: String, default: null },
  likedBy: { type: [String], default: [] }
});

// Add a pre-find middleware to populate author
PostSchema.pre('find', function() {
  this.populate('author', 'BrawlID profilePicture');
});

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
