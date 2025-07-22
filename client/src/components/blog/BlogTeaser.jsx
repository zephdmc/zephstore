import { Link } from 'react-router-dom';

export default function BlogTeaser({ post }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={post.fields.coverImage.fields.file.url}
        alt={post.fields.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{post.fields.title}</h3>
        <p className="text-gray-600 mb-4">{post.fields.excerpt}</p>
        <Link
          to={`/blog/${post.fields.slug}`}
          className="text-purple-700 hover:underline font-semibold"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}
