import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor extends Document {
  name: string;
  avatar: string;
  bio: string;
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true },
    avatar: { type: String, default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default' },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Author = mongoose.model<IAuthor>('Author', AuthorSchema);