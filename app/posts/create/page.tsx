'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
const PostForm = dynamic(() => import('@/app/components/PostForm'));
const ThemeToggle = dynamic(() => import('@/app/components/ThemeToggle'));

export default function CreatePostPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-8 relative">
          <button
            onClick={() => router.push('/')}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900 dark:text-white pr-8">Create New Post</h1>
          <PostForm />
        </div>
      </div>
    </div>
  );
}
