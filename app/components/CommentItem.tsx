'use client';

import { useState } from 'react';
import ReplyForm from './ReplyForm';
import LikeButton from './LikeButton';

interface Comment {
  _id: string;
  text: string;
  userId: string;
  createdAt: string;
  likes: string[];
  parentId: string | null;
}

interface CommentItemProps {
  comment: Comment;
  entityId: string;
  entityType: string;
  userId: string;
  onCommentAdded: () => void;
  replies: Comment[];
  isReply?: boolean;
}

export default function CommentItem({
  comment,
  entityId,
  entityType,
  userId,
  onCommentAdded,
  replies,
  isReply = false,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className={`${isReply ? 'ml-12' : ''}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold text-sm">
              {comment.userId.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900">User {comment.userId}</span>
              <span className="text-gray-500 text-sm">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <p className="text-gray-800 leading-relaxed mb-3">{comment.text}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{comment.likes?.length || 0}</span>
              </button>
              {!isReply && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-gray-500 hover:text-blue-500 transition-colors text-sm font-medium"
                >
                  Reply
                </button>
              )}
            </div>
          </div>
          {showReplyForm && (
            <div className="mt-4">
              <ReplyForm
                entityId={entityId}
                entityType={entityType}
                userId={userId}
                parentId={comment._id}
                onReplyAdded={() => {
                  onCommentAdded();
                  setShowReplyForm(false);
                }}
              />
            </div>
          )}
          {replies.map((reply) => (
            <div key={reply._id} className="mt-4">
              <CommentItem
                comment={reply}
                entityId={entityId}
                entityType={entityType}
                userId={userId}
                onCommentAdded={onCommentAdded}
                replies={[]} // replies don't have further replies
                isReply={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}