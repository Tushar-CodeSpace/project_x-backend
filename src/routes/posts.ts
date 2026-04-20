import { Router, Request, Response } from 'express';
import { Post } from '../models/Post';
import { Author } from '../models/Author';

const router = Router();

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const getAuthor = async () => {
  let author = await Author.findOne();
  if (!author) {
    author = await Author.create({
      name: 'Admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      bio: 'TechBlog Administrator'
    });
  }
  return author;
};

router.get('/', async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name avatar bio')
      .sort({ publishedAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/featured', async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find({ featured: true, status: 'published' })
      .populate('author', 'name avatar bio')
      .limit(3);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured posts' });
  }
});

router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ 
      category: { $regex: new RegExp(req.params.category, 'i') },
      status: 'published' 
    })
      .populate('author', 'name avatar bio')
      .sort({ publishedAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts by category' });
  }
});

router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    const posts = await Post.find({
      status: 'published',
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    })
      .populate('author', 'name avatar bio')
      .sort({ publishedAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar bio');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.get('/admin/all', async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatar bio')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all posts' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar bio');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const author = await getAuthor();
    
    const slug = req.body.slug || 
      req.body.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 
      Date.now().toString();
    
    const readingTime = calculateReadingTime(req.body.content || '');
    
    const post = await Post.create({
      ...req.body,
      slug,
      author: author._id,
      readingTime,
      publishedAt: req.body.status === 'published' ? new Date() : null
    });
    
    await post.populate('author', 'name avatar bio');
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (req.body.content) {
      req.body.readingTime = calculateReadingTime(req.body.content);
    }
    
    if (req.body.status === 'published' && !req.body.publishedAt) {
      const existingPost = await Post.findById(req.params.id);
      if (!existingPost?.publishedAt) {
        req.body.publishedAt = new Date();
      }
    }
    
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar bio');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

router.patch('/:id/featured', async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.featured = !post.featured;
    await post.save();
    await post.populate('author', 'name avatar bio');
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle featured' });
  }
});

export default router;