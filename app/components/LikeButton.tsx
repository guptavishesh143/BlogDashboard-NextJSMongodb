'use client';

import { useState } from 'react';

export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button
      className="px-3 py-1 rounded bg-blue-500 text-white"
      onClick={() => setLiked(!liked)}
    >
      {liked ? '❤️ Liked' : '🤍 Like'}
    </button>
  );
}
