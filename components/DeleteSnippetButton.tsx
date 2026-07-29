'use client';

import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function DeleteSnippetButton({ snippetId }: { snippetId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this snippet?')) return;
    setLoading(true);
    const res = await fetch(`/api/snippets/${snippetId}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh(); // refresh the page to show updated list
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to delete snippet');
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
      title="Delete snippet"
    >
      <FiTrash2 className="h-4 w-4" />
    </button>
  );
}