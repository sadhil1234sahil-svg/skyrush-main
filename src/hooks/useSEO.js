import { useEffect } from 'react';

export default function useSEO({ title, description, schema }) {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    if (description) {
      metaDescription.content = description;
    }

    // 3. Update JSON-LD Schema Script
    let schemaScript = document.getElementById('seo-schema-script');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-schema-script';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    if (schema) {
      schemaScript.textContent = JSON.stringify(schema);
    } else {
      schemaScript.textContent = '';
    }

    // Cleanup on unmount or updates
    return () => {
      if (schemaScript) {
        schemaScript.textContent = '';
      }
    };
  }, [title, description, JSON.stringify(schema)]);
}
