'use client';

import { useState } from 'react';

interface LikeButtonProps {
  entityId: string;
  entityType: string;
  userId: string;
  initialLikesCount: number;
  initialIsLiked: boolean;
}

export default function LikeButton({
  entityId,
  entityType,
  userId,
  initialLikesCount,
  initialIsLiked,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const action = isLiked ? 'unlike' : 'like';
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId, entityType, userId, action }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsLiked(!isLiked);
        setLikesCount(data.likesCount);
      } else {
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`flex items-center gap-2 transition-colors ${
        isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleLike}
      disabled={loading}
      type="button"
    >
      <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span className="font-medium">{likesCount}</span>
    </button>
  );
}
