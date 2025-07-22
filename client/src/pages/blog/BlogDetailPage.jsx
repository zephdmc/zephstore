import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import client from '../../services/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'blogPost', // Match your Contentful content type ID
          'fields.slug': slug,
        });
        if (res.items.length > 0) setPost(res.items[0]);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!post) return <div className="p-10 text-center text-red-500">Post not found.</div>;

  const { title, coverImage, publishDate, body } = post.fields;

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-gray-500 mb-6">Published on {new Date(publishDate).toLocaleDateString()}</p>
      <img
        src={coverImage.fields.file.url}
        alt={title}
        className="w-full h-72 object-cover rounded-lg mb-10"
      />
      <article className="prose prose-lg max-w-none">
        {documentToReactComponents(body, {
          renderNode: {
            [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
          },
        })}
      </article>
    </div>
  );
}
