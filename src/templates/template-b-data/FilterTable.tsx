'use client';
import React, { useState, useMemo } from 'react';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableRow {
  id: string;
  cells: Record<string, string | number | boolean>;
  detail?: string;
  affiliateUrl?: string;
}

export function FilterTable({ columns, rows, brandName }: {
  columns: TableColumn[];
  rows: TableRow[];
  brandName: string;
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let r = rows;
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(row => Object.values(row.cells).some(v => String(v).toLowerCase().includes(q)));
    }
    if (sortKey) {
      r = [...r].sort((a, b) => {
        const va = a.cells[sortKey] ?? '';
        const vb = b.cells[sortKey] ?? '';
        const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return r;
  }, [rows, search, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    if (sortKey === key) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleCompare = (id: string) => {
    setCompare(c => c.includes(id) ? c.filter(x => x !== id) : c.length < 3 ? [...c, id] : c);
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text" placeholder="Search tools..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left w-8">#</th>
              {columns.map(col => (
                <th key={col.key} className="p-2 text-left cursor-pointer select-none" onClick={() => col.sortable !== false && toggleSort(col.key)}>
                  {col.label}{sortKey === col.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                </th>
              ))}
              <th className="p-2 text-center w-16">Compare</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <React.Fragment key={row.id}>
                <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(expanded === row.id ? null : row.id)}>
                  <td className="p-2 text-gray-400">{i + 1}</td>
                  {columns.map(col => (
                    <td key={col.key} className="p-2">{String(row.cells[col.key] ?? '-')}</td>
                  ))}
                  <td className="p-2 text-center">
                    <input type="checkbox" checked={compare.includes(row.id)} onChange={() => toggleCompare(row.id)} className="cursor-pointer" onClick={e => e.stopPropagation()} />
                  </td>
                </tr>
                {expanded === row.id && row.detail && (
                  <tr key={row.id + '-detail'}>
                    <td colSpan={columns.length + 2} className="p-4 bg-gray-50">
                      <div dangerouslySetInnerHTML={{ __html: row.detail || '' }} />
                      {row.affiliateUrl && (
                        <a href={row.affiliateUrl} target="_blank" rel="nofollow sponsored" className="inline-block mt-2 text-sm text-green-700 hover:underline">
                          {brandName} Pick →
                        </a>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparison panel */}
      {compare.length >= 2 && (
        <div className="mt-6 border rounded-lg p-4 bg-blue-50">
          <h3 className="font-semibold mb-3">Side-by-Side Comparison ({compare.length} selected)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {compare.map(id => {
              const r = rows.find(r => r.id === id);
              if (!r) return null;
              return (
                <div key={id} className="border rounded p-3 bg-white">
                  <strong className="block mb-2">{r.cells.name || r.id}</strong>
                  {columns.map(col => (
                    <div key={col.key} className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">{col.label}</span>
                      <span className="font-medium">{String(r.cells[col.key] ?? '-')}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && <p className="text-center text-gray-500 py-8">No results found. Try a different search.</p>}
    </div>
  );
}
