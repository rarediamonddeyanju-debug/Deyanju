
import React from 'react';
import { Book, Author, Comment } from '../types';
import { TrailerPlayer } from './TrailerPlayer';
import { CommentSection } from './CommentSection';
import { Star, User, BookOpen, Share2 } from './Icons';

interface BookDetailProps {
  book: Book;
  author?: Author;
  comments: Comment[];
  onBack: () => void;
  onAuthorClick: (id: string) => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({ book, author, comments, onBack, onAuthorClick }) => {
  return (
    <div className="animate-fade-in pb-20">
      <div className="flex items-center gap-2 mb-6 text-slate-400 hover:text-white cursor-pointer w-fit" onClick={onBack}>
        <span className="text-sm">← Back to Browse</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Trailer & Comments */}
        <div className="lg:col-span-2 space-y-8">
          <TrailerPlayer trailer={book.trailer} title={book.title} />
          <CommentSection comments={comments} />
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 sticky top-6">
            <div className="flex gap-4 mb-6">
              <img 
                src={book.cover_image} 
                alt={book.title} 
                className="w-24 h-36 object-cover rounded shadow-lg"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2 leading-tight">{book.title}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                  <span className="text-lg font-bold text-white">{book.rating.toFixed(1)}</span>
                  <span className="text-sm text-slate-400">({book.review_count} reviews)</span>
                </div>
                <span className="inline-block px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-slate-700">
                  {book.genre}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                {book.summary}
              </p>
              
              <div className="pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Author</div>
                {author ? (
                  <div 
                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 p-2 -mx-2 rounded transition-colors"
                    onClick={() => onAuthorClick(author.id)}
                  >
                    <img src={author.photo} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="text-white font-medium">{author.name}</div>
                      <div className="text-xs text-slate-400">View Profile</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400">Unknown Author</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 py-2.5 px-4 rounded-lg font-bold text-sm transition-colors">
                  <BookOpen className="w-4 h-4" />
                  Read Now
                </button>
                <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors border border-slate-700">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
