import { useState, useMemo } from 'react';

interface Technique {
  id: string;
  title: string;
  slug: string;
  position: string;
  gi: 'gi' | 'no-gi' | 'both';
  videoUrl?: string;
  thumbnail?: {
    url: string;
    alt: string;
    sizes?: { card?: { url: string } };
  };
}

interface Props {
  techniques: Technique[];
}

const GI_OPTIONS = [
  { value: 'all', label: 'All Styles' },
  { value: 'gi', label: 'Gi' },
  { value: 'no-gi', label: 'No-Gi' },
];

export default function TechniqueFilter({ techniques }: Props) {
  const [positionFilter, setPositionFilter] = useState('all');
  const [giFilter, setGiFilter] = useState('all');

  const positions = useMemo(() => {
    const set = new Set(techniques.map((t) => t.position));
    return ['all', ...Array.from(set).sort()];
  }, [techniques]);

  const filtered = useMemo(() => {
    return techniques.filter((t) => {
      if (positionFilter !== 'all' && t.position !== positionFilter) return false;
      if (giFilter !== 'all') {
        if (t.gi === 'both') return true;
        if (t.gi !== giFilter) return false;
      }
      return true;
    });
  }, [techniques, positionFilter, giFilter]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#c0272d] focus:outline-none"
        >
          {positions.map((pos) => (
            <option key={pos} value={pos} className="bg-[#111]">
              {pos === 'all' ? 'All Positions' : pos}
            </option>
          ))}
        </select>

        <select
          value={giFilter}
          onChange={(e) => setGiFilter(e.target.value)}
          className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#c0272d] focus:outline-none"
        >
          {GI_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#111]">
              {opt.label}
            </option>
          ))}
        </select>

        {(positionFilter !== 'all' || giFilter !== 'all') && (
          <button
            onClick={() => { setPositionFilter('all'); setGiFilter('all'); }}
            className="text-sm text-brand-subtle hover:text-white transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-brand-subtle text-sm mb-6">
        {filtered.length} technique{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((technique) => (
            <div
              key={technique.id}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
            >
              {technique.thumbnail && (
                <img
                  src={technique.thumbnail.sizes?.card?.url ?? technique.thumbnail.url}
                  alt={technique.thumbnail.alt || technique.title}
                  className="w-full aspect-video object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{technique.title}</h3>
                <div className="flex gap-2 mb-3">
                  <span className="text-xs uppercase tracking-wider bg-white/10 px-2 py-1 rounded">
                    {technique.position}
                  </span>
                  <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded ${
                    technique.gi === 'gi'
                      ? 'bg-blue-900/40 text-blue-300'
                      : technique.gi === 'no-gi'
                        ? 'bg-orange-900/40 text-orange-300'
                        : 'bg-purple-900/40 text-purple-300'
                  }`}>
                    {technique.gi === 'both' ? 'Gi & No-Gi' : technique.gi === 'gi' ? 'Gi' : 'No-Gi'}
                  </span>
                </div>
                {technique.videoUrl && (
                  <a
                    href={technique.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-[#c0272d] hover:brightness-125 transition-all"
                  >
                    Watch Video &rarr;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
          <p className="text-brand-subtle">No techniques match your filters.</p>
        </div>
      )}
    </div>
  );
}
