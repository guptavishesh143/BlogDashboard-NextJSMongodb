'use client';

import CommentForm from './CommentForm';

interface ReplyFormProps {
  entityId: string;
  entityType: string;
  userId: string;
  parentId: string;
  onReplyAdded: () => void;
}

export default function ReplyForm({
  entityId,
  entityType,
  userId,
  parentId,
  onReplyAdded,
}: ReplyFormProps) {
  return (
    <div className="ml-8 mt-2">
      <CommentForm
        entityId={entityId}
        entityType={entityType}
        userId={userId}
        parentId={parentId}
        onCommentAdded={onReplyAdded}
      />
    </div>
  );
}