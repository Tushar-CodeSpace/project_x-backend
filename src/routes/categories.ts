import { Router, Request, Response } from 'express';
import { Category } from '../models/Category';
import { Post } from '../models/Post';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => ({
        ...cat.toObject(),
        postCount: await Post.countDocuments({ 
          category: cat.name,
          status: 'published' 
        })
      }))
    );
    
    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const postCount = await Post.countDocuments({ 
      category: category.name,
      status: 'published' 
    });
    
    res.json({ ...category.toObject(), postCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const slug = req.body.slug || 
      req.body.name?.toLowerCase().replace(/\s+/g, '-') || 
      Date.now().toString();
    
    const category = await Category.create({
      ...req.body,
      slug
    });
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;