'use client';

import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface Comment {
  _id: string;
  text: string;
  userId: string;
  createdAt: string;
  likes: string[];
  parentId: string | null;
}

interface CommentsSectionProps {
  entityId: string;
  entityType: string;
  userId: string;
}

export default function CommentsSection({
  entityId,
  entityType,
  userId,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchComments = async (pageNum = 1, append = false) => {
    try {
      const res = await fetch(`/api/comments?entityId=${entityId}&entityType=${entityType}&page=${pageNum}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        if (append) {
          setComments(prev => [...prev, ...data.comments]);
        } else {
          setComments(data.comments);
        }
        setHasMore(data.pagination.hasMore);
      }
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setComments([]);
    setPage(1);
    setLoading(true);
    fetchComments(1, false);
  }, [entityId, entityType]);

  const loadMoreComments = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchComments(nextPage, true);
    }
  };

  const topLevelComments = comments.filter((c) => !c.parentId);
  const repliesMap: { [key: string]: Comment[] } = {};
  comments.filter((c) => c.parentId).forEach((c) => {
    if (!repliesMap[c.parentId!]) repliesMap[c.parentId!] = [];
    repliesMap[c.parentId!].push(c);
  });

  if (loading) {
    return <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h3 className="text-2xl font-bold mb-8 text-gray-900 border-b border-gray-200 pb-4">
        Comments ({topLevelComments.length + Object.values(repliesMap).flat().length})
      </h3>
      <div className="mb-8">
        <CommentForm
          entityId={entityId}
          entityType={entityType}
          userId={userId}
          onCommentAdded={fetchComments}
        />
      </div>
      <div className="space-y-8">
        {topLevelComments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            entityId={entityId}
            entityType={entityType}
            userId={userId}
            onCommentAdded={() => {
              setComments([]);
              setPage(1);
              setLoading(true);
              fetchComments(1, false);
            }}
            replies={repliesMap[comment._id] || []}
          />
        ))}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMoreComments}
              disabled={loadingMore}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? 'Loading...' : 'Load More Comments'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}