export interface DataCardItem {
  title: string;
  subtitle?: string;
  image?: string;
  stats: { label: string; value: string }[];
  notes?: string;
}

export function DataCard({ item }: { item: DataCardItem }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-base mb-1">{item.title}</h4>
      {item.subtitle && <p className="text-xs text-gray-500 mb-2">{item.subtitle}</p>}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {item.stats.map(stat => (
          <div key={stat.label} className="flex justify-between border-b border-gray-100 py-1">
            <span className="text-gray-500">{stat.label}</span>
            <span className="font-medium">{stat.value}</span>
          </div>
        ))}
      </div>
      {item.notes && <p className="text-xs text-gray-400 mt-2 italic">{item.notes}</p>}
    </div>
  );
}
