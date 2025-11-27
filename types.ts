
export interface Trailer {
  id: string;
  video_url: string;
  thumbnail: string;
  duration: string;
  views: number;
  comments_count: number;
  upload_date: string;
}

export interface Book {
  id: string;
  title: string;
  cover_image: string;
  summary: string;
  genre: string;
  rating: number;
  review_count: number;
  author_id: string;
  trailer: Trailer;
}

export interface Author {
  id: string;
  name: string;
  photo: string;
  bio: string;
  follower_count: number;
  total_trailer_views: number;
  books_written: string[];
}

export interface Comment {
  trailer_id: string;
  username: string;
  timestamp: string;
  text: string;
  likes: number;
}

export interface AppData {
  books: Book[];
  authors: Author[];
  comments: Comment[];
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'book'; bookId: string }
  | { type: 'author'; authorId: string };
