'use client';

import { useState } from 'react';

interface CommentFormProps {
  entityId: string;
  entityType: string;
  userId: string;
  parentId?: string;
  onCommentAdded: () => void;
}

export default function CommentForm({
  entityId,
  entityType,
  userId,
  parentId,
  onCommentAdded,
}: CommentFormProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          entityType,
          userId,
          text: text.trim(),
          parentId,
        }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      setText('');
      onCommentAdded();
    } catch (err) {
      console.error(err);
      alert('Failed to add comment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-bold text-sm">U</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}