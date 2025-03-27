import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Post from '@/models/Post';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Connect to MongoDB
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Search for posts where content matches the query (case-insensitive)
    const posts = await Post.find({
      content: { $regex: query, $options: 'i' }
    })
    .populate('author', 'BrawlID') // Populate author field and get BrawlID
    .sort({ createdAt: -1 })
    .limit(10)
    .lean() // Convert to plain JavaScript objects
    .then(posts => posts.map(post => {
      // Ensure we have a valid post object
      if (!post) return null;

      // Extract author information safely
      let authorName = 'Anonymous';
      if (post.author) {
        if (typeof post.author === 'object' && post.author.BrawlID) {
          authorName = post.author.BrawlID;
        } else if (typeof post.author === 'string') {
          authorName = post.author;
        }
      }

      return {
        ...post,
        author: authorName
      };
    }))
    .then(posts => posts.filter(post => post !== null)); // Remove any null posts

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json({ error: 'Failed to search posts' }, { status: 500 });
  }
} 