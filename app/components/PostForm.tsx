// components/PostForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostForm({ initial = { title: '', body: '', published: false }, postId }: { initial?: any; postId?: string }) {
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);
  const [published, setPublished] = useState(initial.published);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = { title, body, published };
    try {
      const method = postId ? 'PUT' : 'POST';
      const url = postId ? `/api/posts/${postId}` : '/api/posts';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      // Optionally use router.refresh() or navigate to posts
      router.push('/posts');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" rows={8} className="w-full p-2 border rounded" />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published
      </label>
      <div>
        <button disabled={loading} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
