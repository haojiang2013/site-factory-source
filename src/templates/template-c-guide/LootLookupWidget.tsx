'use client';

import { useState, useMemo } from 'react';

interface LootItem {
  name: string; type: string; rarity: string; dropRate: string;
  source: string; location: string; notes: string;
}

const GAMES: Record<string, { name: string; items: LootItem[] }> = {
  eldenRing: {
    name: 'Elden Ring',
    items: [
      { name: 'Moonveil Katana', type: 'Weapon', rarity: 'Legendary', dropRate: '100%', source: 'Magma Wyrm', location: 'Gael Tunnel, Caelid', notes: 'INT/DEX scaling. Ash of War: Transient Moonlight.' },
      { name: 'Rivers of Blood', type: 'Weapon', rarity: 'Legendary', dropRate: '100%', source: 'Bloody Finger Okina', location: 'Church of Repose, Mountaintops', notes: 'ARC scaling. Corpse Piler skill. Nerfed but still strong.' },
      { name: 'Bloodhound Fang', type: 'Weapon', rarity: 'Rare', dropRate: '100%', source: 'Bloodhound Knight Darriwil', location: 'Forlorn Hound Evergaol, Limgrave', notes: 'Top-tier early game weapon. Curved greatsword.' },
      { name: 'Larval Tear', type: 'Consumable', rarity: 'Rare', dropRate: '~5%', source: 'Silver Tear enemies', location: 'Nokron, Nokstella, Night Sacred Ground', notes: 'Respec item. Limited per playthrough but farmable.' },
      { name: 'Golden Rune [12]', type: 'Consumable', rarity: 'Uncommon', dropRate: '~60%', source: 'Various bosses', location: 'Late-game areas', notes: 'Grants 10,000 runes. Best in endgame areas.' },
      { name: 'Cleanrot Knight Set', type: 'Armor', rarity: 'Rare', dropRate: '~4% per piece', source: 'Cleanrot Knights', location: 'Swamp of Aeonia, Caelid', notes: 'High immunity/resistance. Heavy but stylish.' },
      { name: 'Smithing Stone [7]', type: 'Material', rarity: 'Uncommon', dropRate: '~20%', source: 'Various miners', location: 'Mountaintops, Farum Azula', notes: 'Upgrades weapons to +21.' },
      { name: 'Somber Ancient Dragon Smithing Stone', type: 'Material', rarity: 'Legendary', dropRate: '100% (limited)', source: 'Boss rewards & static loot', location: 'Farum Azula, Mountaintops', notes: 'Final upgrade for somber weapons. ~8 per playthrough.' },
    ],
  },
  darkSouls3: {
    name: 'Dark Souls 3',
    items: [
      { name: 'Dark Sword', type: 'Weapon', rarity: 'Rare', dropRate: '~5%', source: 'Darkwraith enemies', location: 'Farron Keep, High Wall (late)', notes: 'STR/DEX quality. Best straight sword pre-nerf.' },
      { name: 'Symbol of Avarice', type: 'Head Armor', rarity: 'Legendary', dropRate: '~.1%', source: 'Mimic chests', location: 'Various (guaranteed on last mimic)', notes: 'Soul boost +50%. HP drain while equipped.' },
      { name: 'Proof of a Concord Kept', type: 'Material', rarity: 'Very Rare', dropRate: '~1%', source: 'Silver Knights', location: 'Anor Londo stairs', notes: 'Covenant item. Infamous farm. 30 needed.' },
      { name: 'Titanite Slab', type: 'Material', rarity: 'Legendary', dropRate: '100% (limited)', source: 'Static loot & quests', location: 'Archdragon Peak, Ringed City', notes: 'Final upgrade material. ~8 per NG cycle.' },
      { name: 'Ring of Favor +3', type: 'Ring', rarity: 'Legendary', dropRate: '100%', source: 'Static loot', location: 'Ringed City DLC', notes: 'HP/Stamina/Equip load boost. On corpse near first bonfire.' },
    ],
  },
  diablo4: {
    name: 'Diablo IV',
    items: [
      { name: 'Harlequin Crest (Shako)', type: 'Helm', rarity: 'Uber Unique', dropRate: '~.00001%', source: 'Any lvl 85+ enemy', location: 'World Tier 4', notes: '+4 all skills, 20% DR. Rarest item in game.' },
      { name: 'Grandfather', type: 'Weapon', rarity: 'Uber Unique', dropRate: '~.00001%', source: 'Any lvl 85+ enemy', location: 'World Tier 4', notes: 'Massive crit damage. Uber Duriel best farm target.' },
      { name: 'Tibault\'s Will', type: 'Pants', rarity: 'Unique', dropRate: '~2%', source: 'Lord Zir', location: 'Darkened Way, Fractured Peaks', notes: 'Resource gen on Unstoppable. Meta for many builds.' },
      { name: 'Living Steel', type: 'Material', rarity: 'Rare', dropRate: '~100% (chest)', source: 'Helltide chests', location: 'Helltide zones, WT4', notes: '5 needed per Grigoire summon. Farm during Helltides.' },
    ],
  },
  pathOfExile: {
    name: 'Path of Exile',
    items: [
      { name: 'Mageblood', type: 'Belt', rarity: 'T0 Unique', dropRate: '~.001%', source: 'Random drop (lvl 75+)', location: 'T16 maps, Pinnacle bosses', notes: 'Permanent flask uptime. Most expensive item in league.' },
      { name: 'Headhunter', type: 'Belt', rarity: 'T0 Unique', dropRate: '~.002%', source: 'Random drop or Div Card set', location: 'T16 maps, The Nurse cards', notes: 'Steal rare monster mods. Map blaster dream belt.' },
      { name: 'Divine Orb', type: 'Currency', rarity: 'Rare', dropRate: '~.05%', source: 'Random drop lvl 35+', location: 'All content lvl 35+', notes: 'Main trading currency. ~200 Chaos Orbs each.' },
      { name: 'Mirror of Kalandra', type: 'Currency', rarity: 'Ultra Rare', dropRate: '~.000001%', source: 'Random drop', location: 'Anywhere', notes: 'Duplicate any item. Most players never see one.' },
    ],
  },
};

const TYPES = ['All', 'Weapon', 'Armor', 'Consumable', 'Material', 'Currency', 'Ring', 'Belt', 'Helm', 'Head Armor', 'Unique'];

export default function LootLookupWidget() {
  const [game, setGame] = useState('eldenRing');
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'dropRate'>('name');

  const items = useMemo(() => {
    let list = GAMES[game]?.items || [];
    if (filterType !== 'All') list = list.filter(i => i.type === filterType);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(i => i.name.toLowerCase().includes(q) || i.source.toLowerCase().includes(q) || i.notes.toLowerCase().includes(q));
    }
    const rarityOrder: Record<string, number> = { 'Ultra Rare': 0, 'T0 Unique': 0, 'Uber Unique': 1, 'Legendary': 2, 'Very Rare': 3, 'Rare': 4, 'Uncommon': 5 };
    if (sortBy === 'rarity') list.sort((a, b) => (rarityOrder[a.rarity] || 99) - (rarityOrder[b.rarity] || 99));
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [game, filterType, search, sortBy]);

  const rarityColor = (r: string): string => {
    if (r.includes('Ultra') || r.includes('Uber') || r.includes('T0')) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (r === 'Legendary') return 'text-purple-600 bg-purple-50 border-purple-200';
    if (r === 'Rare' || r === 'Very Rare') return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Controls */}
      <div className="p-4 sm:p-5 flex flex-wrap gap-3 items-end bg-slate-50 border-b">
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs text-gray-500 block mb-1">Game</label>
          <select className="w-full p-2.5 border rounded-lg text-sm bg-white" value={game} onChange={e => setGame(e.target.value)}>
            {Object.entries(GAMES).map(([k, v]) => (<option key={k} value={k}>{v.name}</option>))}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs text-gray-500 block mb-1">Item Type</label>
          <select className="w-full p-2.5 border rounded-lg text-sm bg-white" value={filterType} onChange={e => setFilterType(e.target.value)}>
            {TYPES.map(t => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
        <div className="flex-[2] min-w-[180px]">
          <label className="text-xs text-gray-500 block mb-1">Search</label>
          <input
            className="w-full p-2.5 border rounded-lg text-sm"
            placeholder="Item name, source, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Sort</label>
          <select className="w-full p-2.5 border rounded-lg text-sm bg-white" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="name">Name</option>
            <option value="rarity">Rarity</option>
            <option value="dropRate">Drop Rate</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="text-xs font-semibold text-gray-400 uppercase px-4 py-2 bg-gray-50 border-b tracking-wide">
        {items.length} items — {GAMES[game]?.name}
      </div>
      <div className="max-h-[520px] overflow-auto">
        {items.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No items match your filters.</div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-3 sm:px-4 py-3 border-b border-gray-100 text-sm hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{item.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold ${rarityColor(item.rarity)}`}>{item.rarity}</span>
                  <span className="text-xs text-gray-400">{item.type}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Drop:</span> {item.dropRate} · <span className="font-medium">Source:</span> {item.source}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{item.location}</div>
                <div className="text-xs text-gray-500 mt-0.5 italic">{item.notes}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
