import React from 'react';
import { Link } from 'react-router-dom';

export default function Blogs({ blogs = [] }) {
  if (blogs.length === 0) return null;

  return (
    <section className="section-padding" style={{ background: '#f8fafc' }}>
      <div className="container">
        <div className="section-title-wrap">
          <span className="eg-tag">Latest Blog</span>
          <h2>Latest Travel Blog</h2>
        </div>
        <div className="blog-grid">
          {blogs.map((blog) => (
            <article className="blog-card" key={blog.id}>
              <Link to={`/blogs/${blog.id}`} style={{ display: 'block', overflow: 'hidden' }}>
                <img src={blog.image} alt={blog.title} />
              </Link>
              <div className="blog-card-body">
                <div className="blog-meta">
                  <span>By {blog.author}</span>
                  {blog.date && <span> · {blog.date}</span>}
                </div>
                <h5>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </h5>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '10px 0 15px', lineHeight: '1.5' }}>
                  {blog.excerpt}
                </p>
                <Link to={`/blogs/${blog.id}`} className="read-more">
                  Read More {blog.readTime && `· ${blog.readTime}`}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
