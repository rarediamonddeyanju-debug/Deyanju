import React, { useRef, useState } from 'react';
import { Trailer } from '../types';
import { Play, Eye, MessageCircle, Calendar } from './Icons';

interface TrailerPlayerProps {
  trailer: Trailer;
  title: string;
  onCommentClick?: () => void;
}

export const TrailerPlayer: React.FC<TrailerPlayerProps> = ({ trailer, title, onCommentClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      <div className="relative aspect-video bg-black group">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={trailer.thumbnail}
          src={trailer.video_url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
        >
           <source src={trailer.video_url} type="video/mp4" />
           Your browser does not support the video tag.
        </video>
        
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer group-hover:bg-black/30 transition-all"
            onClick={togglePlay}
          >
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(245,158,11,0.5)] transform group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-slate-950 fill-current" />
            </div>
          </div>
        )}
        
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-mono text-white">
          {trailer.duration}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-white line-clamp-1">{title} - Official Trailer</h3>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>{trailer.views.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{trailer.upload_date}</span>
          </div>
           <button 
             onClick={onCommentClick}
             className="flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer"
            >
            <MessageCircle className="w-4 h-4" />
            <span>{trailer.comments_count} comments</span>
          </button>
        </div>
      </div>
    </div>
  );
};