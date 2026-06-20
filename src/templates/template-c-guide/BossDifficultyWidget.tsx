'use client';

import { useState, useMemo } from 'react';

interface Boss {
  name: string; recLevel: number; hp: number; weaknesses: string[]; region: string; type: string;
}

interface GameData {
  name: string; bosses: Boss[];
}

const GAMES: Record<string, GameData> = {
  eldenRing: {
    name: 'Elden Ring',
    bosses: [
      { name: 'Margit the Fell Omen', recLevel: 30, hp: 5000, weaknesses: ['bleed','spirit ashes'], region: 'Limgrave', type: 'Story' },
      { name: 'Godrick the Grafted', recLevel: 35, hp: 6500, weaknesses: ['bleed','poison'], region: 'Stormveil', type: 'Story' },
      { name: 'Red Wolf of Radagon', recLevel: 40, hp: 4000, weaknesses: ['strike','magic'], region: 'Liurnia', type: 'Story' },
      { name: 'Rennala Queen of the Full Moon', recLevel: 45, hp: 5500, weaknesses: ['physical','bleed'], region: 'Liurnia', type: 'Story' },
      { name: 'Starscourge Radahn', recLevel: 65, hp: 9500, weaknesses: ['scarlet rot','bleed','summons'], region: 'Caelid', type: 'Story' },
      { name: 'Draconic Tree Sentinel', recLevel: 70, hp: 8000, weaknesses: ['strike','lightning resist'], region: 'Altus Plateau', type: 'Gate' },
      { name: 'Godfrey Golden Shade', recLevel: 80, hp: 7500, weaknesses: ['physical','lightning'], region: 'Leyndell', type: 'Story' },
      { name: 'Morgott the Omen King', recLevel: 85, hp: 10000, weaknesses: ['bleed','frost'], region: 'Leyndell', type: 'Story' },
      { name: 'Fire Giant', recLevel: 95, hp: 18000, weaknesses: ['frost','bleed','torrent'], region: 'Mountaintops', type: 'Story' },
      { name: 'Godskin Duo', recLevel: 100, hp: 14000, weaknesses: ['sleep','bleed','summons'], region: 'Farum Azula', type: 'Story' },
      { name: 'Maliketh the Black Blade', recLevel: 105, hp: 10500, weaknesses: ['physical','blasphemous claw'], region: 'Farum Azula', type: 'Story' },
      { name: 'Malenia Blade of Miquella', recLevel: 130, hp: 15000, weaknesses: ['bleed','frost','stagger'], region: 'Haligtree', type: 'Optional' },
      { name: 'Mohg Lord of Blood', recLevel: 110, hp: 14000, weaknesses: ['hemorrhage','physick tear'], region: 'Mohgwyn Palace', type: 'Optional' },
      { name: 'Radagon & Elden Beast', recLevel: 120, hp: 20000, weaknesses: ['strike','holy resist'], region: 'Erdtree', type: 'Final' },
    ],
  },
  darkSouls3: {
    name: 'Dark Souls 3',
    bosses: [
      { name: 'Iudex Gundyr', recLevel: 10, hp: 1100, weaknesses: ['fire','parry'], region: 'Cemetery of Ash', type: 'Tutorial' },
      { name: 'Vordt of the Boreal Valley', recLevel: 20, hp: 2500, weaknesses: ['dark','strike'], region: 'High Wall', type: 'Story' },
      { name: 'Abyss Watchers', recLevel: 35, hp: 4500, weaknesses: ['lightning','backstab'], region: 'Farron Keep', type: 'Story' },
      { name: 'Pontiff Sulyvahn', recLevel: 55, hp: 5100, weaknesses: ['parry','lightning','fire'], region: 'Irithyll', type: 'Story' },
      { name: 'Dancer of the Boreal Valley', recLevel: 70, hp: 6000, weaknesses: ['dark','strike'], region: 'Lothric Castle', type: 'Story' },
      { name: 'Nameless King', recLevel: 90, hp: 7000, weaknesses: ['dark','fire'], region: 'Archdragon Peak', type: 'Optional' },
      { name: 'Slave Knight Gael', recLevel: 100, hp: 15000, weaknesses: ['strike','poison','frost'], region: 'Ringed City', type: 'DLC' },
      { name: 'Soul of Cinder', recLevel: 90, hp: 11000, weaknesses: ['lightning','dark'], region: 'Kiln', type: 'Final' },
    ],
  },
  sekiro: {
    name: 'Sekiro: Shadows Die Twice',
    bosses: [
      { name: 'Gyoubu Oniwa', recLevel: 1, hp: 2000, weaknesses: ['firecracker','grapple'], region: 'Ashina Outskirts', type: 'Story' },
      { name: 'Lady Butterfly', recLevel: 1, hp: 1800, weaknesses: ['shuriken','aggression'], region: 'Hirata Estate', type: 'Story' },
      { name: 'Genichiro Ashina', recLevel: 1, hp: 2500, weaknesses: ['mikiri','lightning reversal'], region: 'Ashina Castle', type: 'Story' },
      { name: 'Guardian Ape', recLevel: 1, hp: 3000, weaknesses: ['firecracker','spear'], region: 'Sunken Valley', type: 'Story' },
      { name: 'Owl Father', recLevel: 1, hp: 2800, weaknesses: ['mortal blade','aggression'], region: 'Hirata Estate', type: 'Optional' },
      { name: 'Isshin the Sword Saint', recLevel: 1, hp: 3200, weaknesses: ['mikiri','lightning reversal'], region: 'Ashina Reservoir', type: 'Final' },
      { name: 'Demon of Hatred', recLevel: 1, hp: 3500, weaknesses: ['malcontent','suzaku umbrella'], region: 'Ashina Outskirts', type: 'Optional' },
    ],
  },
  hollowKnight: {
    name: 'Hollow Knight',
    bosses: [
      { name: 'False Knight', recLevel: 10, hp: 800, weaknesses: ['spells','aggression'], region: 'Forgotten Crossroads', type: 'Story' },
      { name: 'Hornet Protector', recLevel: 15, hp: 900, weaknesses: ['vengeful spirit','range'], region: 'Greenpath', type: 'Story' },
      { name: 'Mantis Lords', recLevel: 25, hp: 1600, weaknesses: ['nail arts','quick slash'], region: 'Mantis Village', type: 'Story' },
      { name: 'Broken Vessel', recLevel: 30, hp: 1000, weaknesses: ['spells','defenders crest'], region: 'Ancient Basin', type: 'Story' },
      { name: 'Watcher Knights', recLevel: 35, hp: 1800, weaknesses: ['spells','shade soul'], region: "Watcher's Spire", type: 'Story' },
      { name: 'The Hollow Knight', recLevel: 40, hp: 1300, weaknesses: ['abyss shriek','shade cloak'], region: 'Temple of the Black Egg', type: 'Final' },
      { name: 'Nightmare King Grimm', recLevel: 50, hp: 1500, weaknesses: ['shape of unn','quick focus'], region: 'Dirtmouth', type: 'DLC' },
      { name: 'Absolute Radiance', recLevel: 55, hp: 2000, weaknesses: ['abyss shriek','shaman stone'], region: 'Godhome', type: 'Optional' },
    ],
  },
};

const BUILDS = ['strength', 'dexterity', 'mage', 'faith', 'quality', 'bleed', 'hybrid'] as const;
type Build = typeof BUILDS[number];

const BUILD_MODS: Record<Build, Record<string, number>> = {
  strength:  { physical: 1.3, fire: 0.9, magic: 0.7 },
  dexterity: { physical: 1.1, bleed: 1.3, magic: 0.8 },
  mage:      { magic: 1.4, physical: 0.6, dark: 1.1 },
  faith:     { holy: 1.4, lightning: 1.2, physical: 0.7 },
  quality:   { physical: 1.2, bleed: 1.0, magic: 0.8 },
  bleed:     { bleed: 1.5, physical: 0.9, magic: 0.7 },
  hybrid:    { physical: 1.0, magic: 1.0, bleed: 1.0 },
};

interface BossResult {
  name: string; region: string; type: string; recLevel: number;
  difficulty: 'easy' | 'fair' | 'hard' | 'very hard';
  tips: string[]; hp: number;
}

function calculate(gameKey: string, playerLevel: number, build: Build): BossResult[] {
  const game = GAMES[gameKey];
  const mods = BUILD_MODS[build];
  return game.bosses.map(boss => {
    const diff = playerLevel - boss.recLevel;
    const level = diff >= 15 ? 'easy' : diff >= 0 ? 'fair' : diff >= -15 ? 'hard' : 'very hard' as const;
    let adv = 0;
    boss.weaknesses.forEach(w => { if (mods[w] && mods[w] > 1.0) adv += mods[w] - 1.0; });
    const tips: string[] = [];
    if (level === 'hard' || level === 'very hard') tips.push('Grind 3-5 more levels');
    if (level === 'very hard') tips.push('Max upgrade weapon & bring consumables');
    if (boss.weaknesses.some(w => w === 'bleed')) tips.push('Bleed build is strong here');
    if (boss.weaknesses.some(w => w === 'frost')) tips.push('Frostbite deals %HP damage');
    if (adv < 0.05) tips.push('No build advantage — play carefully');
    return { name: boss.name, region: boss.region, type: boss.type, recLevel: boss.recLevel, difficulty: level, tips: tips.slice(0, 3), hp: boss.hp };
  });
}

const diffColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-800',
  fair: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
  'very hard': 'bg-pink-100 text-pink-800',
};

export default function BossDifficultyWidget() {
  const [game, setGame] = useState('eldenRing');
  const [level, setLevel] = useState(50);
  const [build, setBuild] = useState<Build>('strength');

  const results = useMemo(() => calculate(game, level, build), [game, level, build]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { easy: 0, fair: 0, hard: 0, 'very hard': 0 };
    results.forEach(r => { c[r.difficulty]++; });
    return c;
  }, [results]);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Stats bar */}
      <div className="flex justify-center gap-4 sm:gap-8 px-4 py-5 bg-slate-50 border-b flex-wrap">
        {[
          [counts.easy, 'Easy', 'text-green-700'],
          [counts.fair, 'Fair', 'text-yellow-700'],
          [counts.hard, 'Hard', 'text-red-700'],
          [counts['very hard'], 'Very Hard', 'text-pink-700'],
        ].map(([n, label, color]) => (
          <div key={label} className="text-center">
            <div className={`text-2xl sm:text-3xl font-extrabold ${color}`}>{n}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="p-4 sm:p-5 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs text-gray-500 block mb-1">Game</label>
          <select
            className="w-full p-2.5 border rounded-lg text-sm bg-white"
            value={game}
            onChange={e => setGame(e.target.value)}
          >
            {Object.entries(GAMES).map(([k, v]) => (
              <option key={k} value={k}>{v.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs text-gray-500 block mb-1">Your Level (1-200)</label>
          <input
            type="number"
            className="w-full p-2.5 border rounded-lg text-sm"
            value={level}
            min={1} max={200}
            onChange={e => setLevel(parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="flex-[2] min-w-[280px]">
          <label className="text-xs text-gray-500 block mb-1">Build Type</label>
          <div className="flex flex-wrap gap-1.5">
            {BUILDS.map(b => (
              <button
                key={b}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  build === b
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
                }`}
                onClick={() => setBuild(b)}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results table */}
      <div className="max-h-[500px] overflow-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase px-4 py-2 bg-gray-50 border-b tracking-wide">
          Recommended Order — {GAMES[game].name}
        </div>
        {results.map((r, i) => (
          <div key={r.name} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50">
            <span className="text-gray-300 w-5 text-right text-xs">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">{r.name}</div>
              <div className="text-xs text-gray-400">{r.region} · Rec Lv {r.recLevel}</div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${diffColors[r.difficulty]}`}>
              {r.difficulty}
            </span>
            <span className="text-xs text-gray-400 hidden sm:block max-w-[160px] truncate">{r.tips[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
