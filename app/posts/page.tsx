// app/posts/page.tsx
import Link from 'next/link';
import { format } from 'date-fns';

type Post = {
  _id: string;
  title: string;
  body: string;
  published?: boolean;
  createdAt?: string;
};

export default async function PostsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/posts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch posts');
  const posts: Post[] = await res.json();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link href="/posts/create" className="px-3 py-1 rounded border">Create</Link>
      </div>

      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post._id} className="p-4 border rounded bg-white">
            <Link href={`/posts/${post._id}`} className="font-medium text-lg hover:underline">{post.title}</Link>
            <div className="text-sm text-gray-500">{post.createdAt ? format(new Date(post.createdAt), 'PPPpp') : ''}</div>
            <p className="mt-2 text-gray-700">{post.body.slice(0, 140)}{post.body.length > 140 ? '…' : ''}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
