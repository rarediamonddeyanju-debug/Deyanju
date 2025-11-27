
import React, { useState, useCallback } from 'react';
import { generateBookData } from './services/geminiService';
import { AppData, ViewState } from './types';
import { BookDetail } from './components/BookDetail';
import { AuthorProfile } from './components/AuthorProfile';
import { BookOpen, Star, Play, TrendingUp, MessageCircle } from './components/Icons';

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>({ type: 'home' });

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedData = await generateBookData();
      setData(generatedData);
      setView({ type: 'home' });
    } catch (err: any) {
      setError(err.message || "Failed to generate content.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookComments = (trailerId: string) => {
    return data?.comments.filter(c => c.trailer_id === trailerId) || [];
  };

  const getAuthorBooks = (authorId: string) => {
    return data?.books.filter(b => b.author_id === authorId) || [];
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
            <BookOpen className="absolute inset-0 m-auto text-slate-600 w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Curating Library...</h2>
            <p className="text-slate-400">AI is crafting original books, trailers, and author profiles.</p>
          </div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-lg mx-auto px-6">
          <div className="mb-8 p-6 bg-slate-900 rounded-full shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <BookOpen className="w-16 h-16 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Discover Your Next <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Favorite Story</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Enter the BookStream platform. Generate a completely unique, AI-powered book community with trailers, authors, and discussions instantly.
          </p>
          <button 
            onClick={handleGenerate}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-950 transition-all duration-200 bg-amber-500 rounded-full hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-slate-900"
          >
            <span>Enter BookStream</span>
            <Play className="w-5 h-5 ml-2 fill-current group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
          </button>
          {error && (
            <div className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>
      );
    }

    if (view.type === 'book') {
      const book = data.books.find(b => b.id === view.bookId);
      const author = data.authors.find(a => a.id === book?.author_id);
      if (!book) return <div>Book not found</div>;
      
      return (
        <BookDetail 
          book={book} 
          author={author}
          comments={getBookComments(book.trailer.id || book.id)} // Fallback if trailer_id not strictly mapped in simple version
          onBack={() => setView({ type: 'home' })}
          onAuthorClick={(id) => setView({ type: 'author', authorId: id })}
        />
      );
    }

    if (view.type === 'author') {
      const author = data.authors.find(a => a.id === view.authorId);
      if (!author) return <div>Author not found</div>;

      return (
        <AuthorProfile 
          author={author}
          authorBooks={getAuthorBooks(author.id)}
          onBack={() => setView({ type: 'home' })}
          onBookClick={(id) => setView({ type: 'book', bookId: id })}
        />
      );
    }

    // Dashboard View (Home)
    const featuredBook = data.books[0];
    const trendingBooks = data.books.slice(1);

    return (
      <div className="animate-fade-in space-y-12 pb-20">
        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] group cursor-pointer" onClick={() => setView({ type: 'book', bookId: featuredBook.id })}>
          <img src={featuredBook.trailer.thumbnail} alt={featuredBook.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent">
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3">
              <span className="inline-block px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded mb-3">
                Featured Trailer
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight shadow-sm">{featuredBook.title}</h2>
              <p className="text-slate-200 line-clamp-2 mb-6 text-sm md:text-base">{featuredBook.summary}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors">
                  <Play className="w-5 h-5 fill-current" /> Watch Trailer
                </button>
                <div className="flex items-center gap-4 text-slate-300 ml-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span>{featuredBook.rating}</span>
                    <span className="text-xs text-slate-500">({featuredBook.review_count} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" /> Trending Now
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingBooks.map(book => (
              <div 
                key={book.id} 
                className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-all cursor-pointer hover:-translate-y-1"
                onClick={() => setView({ type: 'book', bookId: book.id })}
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-2 right-2 bg-slate-950/90 px-2 py-1 rounded flex items-center gap-1 text-xs text-amber-400 font-bold shadow-lg">
                    <Star className="w-3 h-3 fill-current" /> {book.rating}
                    <span className="text-slate-500 font-normal ml-0.5">({book.review_count})</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-white font-bold truncate mb-1">{book.title}</h4>
                  <p className="text-slate-400 text-xs mb-3">{book.genre}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {book.trailer.views > 1000 ? (book.trailer.views/1000).toFixed(0) + 'k' : book.trailer.views}</span>
                      <span className="flex items-center gap-1 group-hover:text-amber-500 transition-colors"><MessageCircle className="w-3 h-3" /> {book.trailer.comments_count}</span>
                    </div>
                    <span>{book.trailer.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Authors Section */}
        <section>
          <h3 className="text-xl font-bold text-white mb-6">Popular Authors</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {data.authors.map(author => (
              <div 
                key={author.id} 
                className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-slate-900 transition-colors cursor-pointer group"
                onClick={() => setView({ type: 'author', authorId: author.id })}
              >
                <div className="relative mb-3">
                  <img src={author.photo} alt={author.name} className="w-20 h-20 rounded-full object-cover border-2 border-slate-700 group-hover:border-amber-500 transition-colors" />
                </div>
                <h4 className="text-slate-200 font-medium text-sm group-hover:text-white">{author.name}</h4>
                <p className="text-slate-500 text-xs mt-1">{author.follower_count > 1000 ? (author.follower_count/1000).toFixed(0) + 'k' : author.follower_count} Followers</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView({ type: 'home' })}>
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">BookStream</span>
          </div>
          
          {data && (
            <div className="flex items-center gap-4">
              <button 
                onClick={handleGenerate} 
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Feed'}
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        {renderContent()}
      </main>
    </div>
  );
}
