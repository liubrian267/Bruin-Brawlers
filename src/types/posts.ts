
export interface Post {
    _id: string;
    author: { 
      BrawlID: string;
      profilePicture?: string;
      username: string;
    }
    content: string;
    imageUrl?: string;
    createdAt: Date;
    likes: number;
    likedBy: string[];
}