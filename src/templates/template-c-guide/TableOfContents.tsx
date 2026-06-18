'use client';
import { useState } from 'react';

interface TocItem { id: string; text: string; level: number; }

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);

  if (!items.length) return null;

  return (
    <nav className="mb-8 border rounded-lg p-4 bg-gray-50 text-sm">
      <button onClick={() => setOpen(!open)} className="font-semibold text-gray-700 mb-2 w-full text-left flex justify-between">
        Contents {open ? '▾' : '▸'}
      </button>
      {open && (
        <ul className="space-y-1 mt-2">
          {items.map(item => (
            <li key={item.id} style={{ paddingLeft: (item.level - 1) * 16 }}>
              <a href={`#${item.id}`} className="text-blue-600 hover:underline">{item.text}</a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
