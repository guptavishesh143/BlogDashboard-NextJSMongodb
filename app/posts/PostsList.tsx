// Server Component
import Link from 'next/link';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
export default async function PostsList() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 60 }, // ISR-like caching
  });
  const posts = await res.json();

  return (
    <ul className="space-y-2">
      {posts.slice(0, 10).map((post: Post) => (
        <li key={post.id} className="border p-3 rounded bg-white shadow">
          <Link href={`/posts/${post.id}`} className="font-medium hover:underline">
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
