import LikeButton from "@/app/components/LikeButton";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = await res.json();

  return (
    <article className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="mb-4">{post.body}</p>
      <LikeButton />
    </article>
  );
}
