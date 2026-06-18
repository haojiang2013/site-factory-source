import { BaseAgent, AgentConfig } from './base-agent';
import { KW_RESEARCHER_PROMPT } from './prompts/kw-researcher';
import { Keyword } from '../lib/site-config';
import { searchReddit, extractComplaints } from '../lib/reddit-search';
import { getKeywordGuidance } from '../lib/knowledge-base';

export interface KWResearchInput {
  niche: string;
  targetCountry?: string;
}

export interface KWResearchOutput {
  niche: string;
  keywords: Keyword[];
  topUserComplaints: string[];
  recommendedAngles: string[];
}

export class KWResearcherAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'KWResearcher',
      provider: 'deepseek',
      model: 'deepseek-v4-pro',  // Needs reasoning for SERP analysis
      systemPrompt: KW_RESEARCHER_PROMPT,
      maxRetries: 2,
    };
    super(config);
  }

  async execute(input: KWResearchInput): Promise<KWResearchOutput> {
    // Search Reddit for real user complaints
    console.log(`  Searching Reddit for "${input.niche}" complaints...`);
    const redditPosts = await searchReddit(input.niche);
    const redditComplaints = extractComplaints(redditPosts);
    console.log(`  Found ${redditPosts.length} Reddit posts, ${redditComplaints.length} complaints`);

    const redditContext = redditPosts.length > 0
      ? `\nReal Reddit posts about this niche (use these for user complaints):\n${redditPosts.slice(0, 8).map(p => `- [r/${p.subreddit}] "${p.title}" (${p.ups} upvotes): ${p.selftext.slice(0, 200)}`).join('\n')}`
      : '';

    const userMessage = [
      `Research the niche: "${input.niche}"`,
      `Target country: ${input.targetCountry || 'US'}`,
      redditContext,
      ``,
      `Find 10-15 keywords with search intent, difficulty estimates, and SERP weaknesses.`,
      `Include 3-5 specific user complaints about existing tools in this space — use the Reddit posts above as real data.`,
      `Respond with valid JSON only.`,
    ].join('\n');

    const response = await this.think(userMessage);

    // Parse JSON
    let jsonStr = response.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    const braceStart = jsonStr.indexOf('{');
    const braceEnd = jsonStr.lastIndexOf('}');
    if (braceStart === -1 || braceEnd === -1) {
      throw new Error('KW Researcher: no JSON found in response');
    }
    jsonStr = jsonStr.slice(braceStart, braceEnd + 1);

    return JSON.parse(jsonStr) as KWResearchOutput;
  }
}
