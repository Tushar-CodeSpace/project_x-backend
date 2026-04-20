import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: Types.ObjectId;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  readingTime: number;
  status: 'draft' | 'published';
  featured: boolean;
  views: number;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    coverImage: { 
      type: String, 
      default: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800' 
    },
    category: { type: String, default: 'Programming' },
    tags: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    publishedAt: { type: Date, default: null },
    readingTime: { type: Number, default: 5 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
PostSchema.index({ slug: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ featured: 1, status: 1 });

export const Post = mongoose.model<IPost>('Post', PostSchema);