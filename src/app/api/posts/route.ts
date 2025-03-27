import { NextResponse } from 'next/server';
import Post from '@/models/Post';
import { connectToDatabase } from '@/utils/database';

export async function GET() {
  try {
    await connectToDatabase();
    //console.log('MongoDB connection status:', mongoose.connection.readyState);

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'BrawlID profilePicture username');
    
    //console.log('Posts fetched:',);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Detailed error fetching posts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // console.log('Starting post creation...');
    const formData = await request.formData();
    const content = formData.get('content') as string;
    const image = formData.get('image') as File | null;
    const userId = formData.get('_id') as string;

    // console.log('Content received:', content);
    // console.log('Image received:', image ? 'yes' : 'no');
    // console.log('User ID:', userId);

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const post = {
      author: userId,
      content,
      createdAt: new Date(),
      likes: 0,
      likedBy: [],
      imageUrl: null as string | null,
    };

    if (image) {
      console.log('Processing image...');
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString('base64');
      const imageType = image.type;
      post.imageUrl = `data:${imageType};base64,${base64Image}`;
      console.log('Image processed successfully');
    }

    const createdPost = await Post.create(post);    
    const populatedPost = await Post.findById(createdPost._id)
      .populate('author', 'BrawlID profilePicture username');

    return NextResponse.json({ 
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    console.error('Detailed error creating post:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 