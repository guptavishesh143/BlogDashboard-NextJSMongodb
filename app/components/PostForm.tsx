// components/PostForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  parent?: string;
}

interface TreeCategory extends Category {
  children: TreeCategory[];
}

export default function PostForm({ initial = { title: '', body: '', published: false, image: null, category: null }, postId }: { initial?: any; postId?: string }) {
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);
  const [published, setPublished] = useState(initial.published);
  const [image, setImage] = useState<File | null>(initial.image);
  const [category, setCategory] = useState<string | null>(initial.category);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; body?: string; category?: string }>({});
  const router = useRouter();

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || []))
      .catch(err => console.error('Failed to fetch categories', err));
  }, []);

  const buildTree = (cats: Category[]): TreeCategory[] => {
    const map = new Map<string, TreeCategory>();
    cats.forEach(cat => map.set(cat._id, { ...cat, children: [] }));
    const roots: TreeCategory[] = [];
    cats.forEach(cat => {
      if (cat.parent) {
        const parent = map.get(cat.parent);
        if (parent) parent.children.push(map.get(cat._id)!);
      } else {
        roots.push(map.get(cat._id)!);
      }
    });
    return roots;
  };

  const tree = buildTree(categories);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpanded(newExpanded);
  };

  const renderCategory = (cat: TreeCategory, level = 0) => (
    <div key={cat._id} style={{ marginLeft: level * 20 }}>
      <button
        type="button"
        onClick={() => setCategory(cat._id)}
        className={`block p-2 text-left text-gray-900 dark:text-white ${category === cat._id ? 'bg-blue-200 dark:bg-blue-800' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}
      >
        {cat.name}
      </button>
      {cat.children.length > 0 && (
        <button
          type="button"
          onClick={() => toggleExpand(cat._id)}
          className="ml-2 text-sm text-blue-600 dark:text-blue-400"
        >
          {expanded.has(cat._id) ? 'Hide' : 'Show'} subcategories
        </button>
      )}
      {expanded.has(cat._id) && cat.children.map(child => renderCategory(child, level + 1))}
    </div>
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!body.trim()) newErrors.body = 'Body is required';
    if (!category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('published', published.toString());
    if (category) formData.append('category', category);
    if (image) formData.append('image', image);
    try {
      const method = postId ? 'PUT' : 'POST';
      const url = postId ? `/api/posts/${postId}` : '/api/posts';
      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to save');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full">
      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400" />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>
      <div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" rows={8} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-vertical" />
        {errors.body && <p className="text-red-500 text-sm">{errors.body}</p>}
      </div>
      <div>
        <label className="block text-gray-900 dark:text-white mb-2">Category:</label>
        <div className="border border-gray-300 dark:border-gray-600 rounded p-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-700">
          {tree.map(cat => renderCategory(cat))}
        </div>
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
      </div>
      <label className="block text-gray-900 dark:text-white">
        Image:
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="mt-1" />
      </label>
      <label className="flex items-center gap-2 text-gray-900 dark:text-white">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published
      </label>
      <div>
        <button disabled={loading} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {loading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
