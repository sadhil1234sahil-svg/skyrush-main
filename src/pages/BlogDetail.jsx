import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

const renderListItems = (value) => {
  if (!value) return '';
  if (value.includes('<li>')) {
    return value;
  }
  // Backward-compatibility: split by newline and wrap in li tags
  return value.split('\n').filter(Boolean).map(item => `<li>${item}</li>`).join('');
};

export default function BlogDetail({ content = {} }) {
  const { id } = useParams();
  const blogs = content.blogs || [];
  const blog = blogs.find(b => b.id === parseInt(id, 10));

  useSEO({
    title: blog ? `${blog.title} | Skyrush Travel Blog` : 'Blog Article | Skyrush Tourism',
    description: blog ? `${blog.excerpt || blog.title}` : '',
    schema: blog ? {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': blog.title,
      'image': blog.image,
      'datePublished': blog.date,
      'author': {
        '@type': 'Person',
        'name': blog.author || 'Skyrush Admin'
      },
      'description': blog.excerpt || blog.title
    } : null
  });

  if (!blog) {
    return (
      <div className="container text-center" style={{ padding: '80px 20px' }}>
        <h2 style={{ fontSize: '32px', color: '#0f172a', fontWeight: 700 }}>Blog Post Not Found</h2>
        <p style={{ margin: '20px 0 30px', color: '#64748b' }}>The article you are trying to view does not exist or has been removed.</p>
        <Link to="/" className="primary-btn1">Back to Home</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Blog Page Header */}
      <div className="page-header" style={{ position: 'relative' }}>
        <div className="container">
          <span className="eg-tag" style={{ 
            background: 'rgba(240, 90, 36, 0.15)', 
            color: 'var(--orange)',
            padding: '5px 14px',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '15px'
          }}>Travel Blog</span>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: '1.2' }}>{blog.title}</h1>
          <p style={{ marginTop: '15px', color: '#cbd5e1' }}>
            <span>By {blog.author}</span>
            {blog.date && <span> · {blog.date}</span>}
            {blog.readTime && <span> · {blog.readTime}</span>}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '50px', marginBottom: '80px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          {/* Back button */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--orange)', fontWeight: 600, fontSize: '14px', marginBottom: '30px' }}>
            <i className="bx bx-left-arrow-alt" style={{ fontSize: '18px' }}></i> Back to Latest News
          </Link>

          {/* Featured Image */}
          <img 
            src={blog.image} 
            alt={blog.title} 
            style={{ 
              width: '100%', 
              maxHeight: '480px', 
              objectFit: 'cover', 
              borderRadius: '16px', 
              marginBottom: '40px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
            }} 
          />

          {/* Blog Content Body */}
          <div 
            className="blog-content-body" 
            style={{ fontFamily: 'Roboto, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: blog.content || '' }}
          />
        </div>
      </div>
    </div>
  );
}
