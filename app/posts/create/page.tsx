// app/posts/create/page.tsx
import dynamic from 'next/dynamic';
const PostForm = dynamic(() => import('@/app/components/PostForm'));

export default function CreatePostPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <PostForm />
    </section>
  );
}
