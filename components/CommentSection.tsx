import React from 'react';
import { Comment } from '../types';
import { Heart, User } from './Icons';

interface CommentSectionProps {
  comments: Comment[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
        Community Discussion <span className="text-sm font-normal text-slate-500">({comments.length})</span>
      </h3>
      <div className="space-y-4">
        {comments.map((comment, idx) => (
          <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-amber-500">@{comment.username}</span>
                  <span className="block text-xs text-slate-500">{comment.timestamp}</span>
                </div>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-3 pl-10">{comment.text}</p>
            <div className="flex items-center gap-2 pl-10 text-xs text-slate-500">
              <button className="flex items-center gap-1 hover:text-red-400 group transition-colors">
                <Heart className="w-3 h-3 group-hover:fill-current" />
                <span>{comment.likes}</span>
              </button>
              <button className="hover:text-white transition-colors">Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};