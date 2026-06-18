// Free Reddit search via public JSON API — no auth needed
export interface RedditPost {
  title: string;
  selftext: string;
  subreddit: string;
  ups: number;
  url: string;
}

export async function searchReddit(niche: string): Promise<RedditPost[]> {
  const queries = [
    `${niche} sucks`,
    `is there a good ${niche}`,
    `${niche} alternative`,
    `${niche} calculator reddit`,
  ];

  const allPosts: RedditPost[] = [];

  for (const q of queries.slice(0, 2)) { // Limit to 2 queries to avoid rate limiting
    try {
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&sort=relevance&limit=10`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SiteFactory/1.0 (tool research bot)' },
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) continue;

      const data = await res.json() as any;
      const posts = (data?.data?.children || []).map((c: any) => ({
        title: c.data?.title || '',
        selftext: c.data?.selftext || '',
        subreddit: c.data?.subreddit || '',
        ups: c.data?.ups || 0,
        url: `https://reddit.com${c.data?.permalink || ''}`,
      }));

      allPosts.push(...posts);
    } catch {
      // Reddit may rate-limit; that's fine, we'll use what we have
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return allPosts.filter(p => {
    if (seen.has(p.url)) return false;
    seen.add(p.url);
    return true;
  });
}

// Extract user complaints from Reddit posts
export function extractComplaints(posts: RedditPost[]): string[] {
  const complaints: string[] = [];

  for (const post of posts) {
    const text = (post.title + ' ' + post.selftext).toLowerCase();

    // Common complaint patterns
    if (text.includes('doesn\'t work') || text.includes('doesnt work')) complaints.push(post.title);
    if (text.includes('useless') || text.includes('garbage')) complaints.push(post.title);
    if (text.includes('paywall') || text.includes('email') || text.includes('sign up') || text.includes('signup'))
      complaints.push(post.title);
    if (text.includes('outdated') || text.includes('old') || text.includes('broken')) complaints.push(post.title);
    if (text.includes('missing') && text.includes('feature')) complaints.push(post.title);
    if (text.includes('inaccurate') || text.includes('wrong') || text.includes('error')) complaints.push(post.title);
  }

  return [...new Set(complaints)].slice(0, 5);
}
