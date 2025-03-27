import { NextResponse } from 'next/server';
import Post from '@/models/Post';
import { connectToDatabase } from '@/utils/database';

export async function DELETE(request: Request) {
    try {
      
        await connectToDatabase();
        const { postID } = await request.json();
        if (!postID) {
          return NextResponse.json(
            { error: 'Post ID is required' },
            { status: 400 }
          );
        }
        
        const deletedPost = await Post.findByIdAndDelete(postID);
        if (!deletedPost) {
          return NextResponse.json(
            { error: 'Post not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          message: 'Post deleted successfully'
        });
  
    }
    catch (error) {
        console.error('Error deleting', error);
        return NextResponse.json(
            { error: 'Failed to delete' },
            { status: 500 }
        );
    }
}