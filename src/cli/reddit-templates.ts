/**
 * Reddit Promotion Templates — BossPlan (bossbreak.8zla.com)
 * Target subreddits, post templates, and cadence for game guide sites.
 *
 * Usage: npx tsx src/cli/social-promote.ts reddit
 */

// Target subreddits by game
export const SUBREDDITS = {
  eldenRing: {
    subs: ['r/Eldenring', 'r/EldenRingBuilds', 'r/fromsoftware'],
    size: '3.2M combined',
    postTypes: ['boss help requests', 'build advice', 'new player tips'],
    bestTime: 'Weekdays 9-11am EST (US peak) + Weekends 12-3pm EST',
    tone: 'Helpful veteran player, not self-promotional',
  },
  darkSouls3: {
    subs: ['r/darksouls3', 'r/fromsoftware', 'r/darksouls'],
    size: '1.8M combined',
    postTypes: ['boss strats', 'build help', 'returning player advice'],
    bestTime: 'Weekdays 10am-2pm EST',
    tone: 'Experienced but patient with new players',
  },
  sekiro: {
    subs: ['r/Sekiro', 'r/fromsoftware'],
    size: '400K combined',
    postTypes: ['boss tips', 'new player help', 'charmless run advice'],
    bestTime: 'Evenings 6-9pm EST',
    tone: 'Respectful of the game\'s difficulty curve',
  },
  hollowKnight: {
    subs: ['r/HollowKnight', 'r/metroidvania'],
    size: '600K combined',
    postTypes: ['boss help', 'pantheon advice', 'new player guides'],
    bestTime: 'Weekdays + Sunday afternoons',
    tone: 'Enthusiastic, spoiler-conscious',
  },
};

// Post templates — follow 10% self-promo rule (9 value posts : 1 link)
export const TEMPLATES = {
  // Value post: answer a question without linking
  valueHelp: {
    title: '[Game] — How to beat [Boss Name] with [Build Type] build',
    body: `I've been helping players with this boss for a while, here's what works:

**Quick Answer:**
- Recommended level: [level range]
- Best build: [build recommendation]
- Key weakness: [weakness]
- Est. attempts: [number]

**Phase-by-Phase:**
[2-3 short strategy paragraphs]

**What NOT to do:**
[1-2 common mistakes]

Happy to answer follow-up questions in comments. You got this! 💪`,
    noLink: true,
  },

  // Soft-promo post (1 in 10): share your tool when genuinely helpful
  softPromo: {
    title: 'Built a free boss difficulty checker — tells you if you\'re ready or underleveled',
    body: `I kept seeing posts asking "am I ready for [boss]?" so I built a quick tool.

**What it does:**
- Pick your game (Elden Ring, DS3, Sekiro, Hollow Knight)
- Enter your level and build type
- See every boss ranked: easy → very hard
- Get specific tips per boss

**Why I built it:**
Got tired of Fextralife's mobile experience. Wanted something fast, clean, and ad-free that gives a straight answer.

🔗 [link to bossbreak.8zla.com]

Would love feedback — especially from players running unusual builds. What should I add next?`,
    canLink: true,
  },

  // Patch day post: freshness advantage
  patchUpdate: {
    title: 'Updated for [Patch Version]: Boss difficulty rankings post-patch',
    body: `Just updated the boss difficulty tool for [patch]. Changes I've noted:

- [Boss A]: [what changed]
- [Boss B]: [what changed]
- [Build type]: [buffed/nerfed]

Full updated list at the tool: [link]

What changes have you noticed that I might have missed?`,
    canLink: true,
    timing: 'Within 48 hours of patch release',
  },

  // Community engagement: ask for feedback
  communityAsk: {
    title: 'What boss gave you the most trouble on your first playthrough?',
    body: `Curious what everyone's wall was. Mine was [Boss Name] — took me [number] tries with a [build] build.

Poll: hardest first-playthrough boss in [game]?`,
    poll: true,
    noLink: true,
  },
};

// Suggested weekly cadence
export const CADENCE = [
  { day: 'Mon', action: 'Value post in game-specific sub', type: 'valueHelp' },
  { day: 'Tue', action: 'Comment on 3 boss-help threads, no links', type: 'engage' },
  { day: 'Wed', action: 'Value post in second subreddit', type: 'valueHelp' },
  { day: 'Thu', action: 'Community poll or discussion post', type: 'communityAsk' },
  { day: 'Fri', action: 'Soft-promo post (1 in 10 rule)', type: 'softPromo' },
  { day: 'Sat', action: 'Reply to comments, engage', type: 'engage' },
  { day: 'Sun', action: 'If patch dropped: patch update post', type: 'patchUpdate' },
];

console.log('Reddit templates loaded. Run: npx tsx src/cli/social-promote.ts reddit');
