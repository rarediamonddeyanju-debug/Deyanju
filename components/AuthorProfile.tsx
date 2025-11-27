import React from 'react';
import { Author, Book } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { User, Eye, BookOpen, TrendingUp, Star } from './Icons';

interface AuthorProfileProps {
  author: Author;
  authorBooks: Book[];
  onBack: () => void;
  onBookClick: (id: string) => void;
}

export const AuthorProfile: React.FC<AuthorProfileProps> = ({ author, authorBooks, onBack, onBookClick }) => {
  
  const chartData = authorBooks.map(book => ({
    name: book.title.length > 15 ? book.title.substring(0, 15) + '...' : book.title,
    views: book.trailer.views
  }));

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex items-center gap-2 mb-6 text-slate-400 hover:text-white cursor-pointer w-fit" onClick={onBack}>
        <span className="text-sm">← Back to Browse</span>
      </div>

      <div className="relative mb-12">
        <div className="h-48 w-full bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 rounded-2xl overflow-hidden opacity-50"></div>
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <img 
            src={author.photo} 
            alt={author.name} 
            className="w-32 h-32 rounded-xl object-cover border-4 border-slate-950 shadow-2xl"
          />
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-white mb-1">{author.name}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
               <span className="flex items-center gap-1"><User className="w-4 h-4" /> {author.follower_count.toLocaleString()} Followers</span>
               <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-emerald-400" /> Top Rated Author</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
        <div className="space-y-8">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">About</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{author.bio}</p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4">Total Reach</h3>
            <div className="text-4xl font-bold text-white mb-2">{author.total_trailer_views.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Combined Trailer Views</div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-6">Performance Analytics</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#fbbf24' }}
                    cursor={{fill: '#334155', opacity: 0.2}}
                  />
                  <Bar dataKey="views" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Books by {author.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {authorBooks.map(book => (
                <div 
                  key={book.id} 
                  className="flex gap-4 p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg cursor-pointer transition-all"
                  onClick={() => onBookClick(book.id)}
                >
                  <img src={book.cover_image} alt={book.title} className="w-16 h-24 object-cover rounded shadow-md" />
                  <div className="flex flex-col justify-center">
                    <h4 className="text-white font-bold mb-1">{book.title}</h4>
                    <div className="text-xs text-slate-400 mb-2">{book.genre}</div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-current" />
                      <span className="text-xs font-bold text-white">{book.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};