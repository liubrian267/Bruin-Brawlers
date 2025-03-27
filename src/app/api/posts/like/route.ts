import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/database';
import Post from '@/models/Post';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { postId, userId, action } = await request.json();
    
    if (!postId || !userId) {
      return NextResponse.json(
        { error: 'Post ID and User ID are required' },
        { status: 400 }
      );
    }
    
    // Initialize likedBy field if it doesn't exist in schema
    if (!Post.schema.paths.likedBy) {
      Post.schema.add({
        likedBy: { type: [String], default: [] }
      });
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Initialize likedBy array if it doesn't exist on the post
    if (!post.likedBy) {
      post.likedBy = [];
    }
    
    let updateOperation;
    const updatedPost = { ...post.toObject() }; // Create a copy of the post to modify
    
    if (action === 'like') {
      // Add user to likedBy if not already present
      if (!post.likedBy.includes(userId)) {
        updateOperation = {
          $inc: { likes: 1 },
          $push: { likedBy: userId }
        };
        // Update the copy of the post
        updatedPost.likes = (updatedPost.likes || 0) + 1;
        updatedPost.likedBy.push(userId);
      }
    } else {
      // Remove user from likedBy if present
      if (post.likedBy.includes(userId)) {
        updateOperation = {
          $inc: { likes: -1 },
          $pull: { likedBy: userId }
        };
        // Update the copy of the post
        updatedPost.likes = (updatedPost.likes || 0) - 1;
        updatedPost.likedBy = updatedPost.likedBy.filter(id => id !== userId);
      }
    }
    
    if (updateOperation) {
      await Post.updateOne(
        { _id: new ObjectId(postId) },
        updateOperation
      );
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating like:', error);
    return NextResponse.json(
      { error: 'Failed to update like' },
      { status: 500 }
    );
  }
}