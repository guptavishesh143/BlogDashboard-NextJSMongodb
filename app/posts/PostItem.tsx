import Link from 'next/link';
import LikeButton from '@/app/components/LikeButton';

interface Post {
  _id: string;
  title: string;
  content?: string;
  body?: string;
  authorId?: string;
  userId?: string;
  createdAt?: string;
  likes?: string[];
  likesCount?: number;
}

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  const content = post.content || post.body || '';
  const excerpt = content.length > 100 ? content.substring(0, 100) + '...' : content;

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 overflow-hidden">
      <div className="p-8">
        <Link href={`/posts/${post._id}`}>
          <h2 className="text-3xl font-bold mb-4 hover:text-blue-600 transition-colors text-gray-900 leading-tight">{post.title}</h2>
        </Link>
        <p className="text-gray-700 mb-6 leading-relaxed text-lg">{excerpt}</p>
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-bold text-sm">
                {(post.authorId || post.userId || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">User {post.authorId || post.userId}</p>
              <p className="text-gray-500 text-sm">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{post.likesCount || post.likes?.length || 0}</span>
            </button>
            <div className="text-gray-400 text-sm">
              {Math.ceil((content || '').length / 200)} min read
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}