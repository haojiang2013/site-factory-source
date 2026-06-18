const knowledge = (() => {
  try { return require('../data/knowledge-base.json'); } catch {}
  try { return require('../../src/data/knowledge-base.json'); } catch {}
  return require('@/data/knowledge-base.json');
})();

interface KnowledgeBase {
  version: string;
  lastUpdated: string;
  keywordPatterns: { highCTR: string[]; lowCTR: string[]; provenKeywords: string[] };
  contentPatterns: { optimalWordRange: number[]; bestSectionOrder: string[]; effectivePhrases: string[] };
  designInsights: { highEngagementColors: string[]; preferredLayouts: string[]; fontPerformance: Record<string, number> };
  toolPerformance: { highBacklinkTypes: string[]; highEngagementParams: string[] };
  nicheROI: { niche: string; roi: number; recommendation: string }[];
  lessonsLearned: string[];
}

// Read-only access at build time (JSON import)
const KB: KnowledgeBase = knowledge as KnowledgeBase;

/** Read knowledge base (used by downstream agents) */
export function getKnowledge(): KnowledgeBase {
  return KB;
}

/** Get keyword guidance for KW Researcher */
export function getKeywordGuidance(): string {
  return [
    `High-CTR patterns: ${KB.keywordPatterns.highCTR.join(', ')}`,
    `Low-CTR patterns to avoid: ${KB.keywordPatterns.lowCTR.join(', ')}`,
    `Proven keywords: ${KB.keywordPatterns.provenKeywords.slice(0, 10).join(', ') || 'none yet'}`,
  ].join('\n');
}

/** Get content guidance for Content Writer */
export function getContentGuidance(): string {
  return [
    `Optimal word range: ${KB.contentPatterns.optimalWordRange[0]}-${KB.contentPatterns.optimalWordRange[1]} words`,
    `Best section order: ${KB.contentPatterns.bestSectionOrder.join(' → ')}`,
    `Effective phrases: ${KB.contentPatterns.effectivePhrases.join(', ')}`,
    `Recent lessons: ${KB.lessonsLearned.slice(-3).join('; ')}`,
  ].join('\n');
}

/** Get design guidance for UI Designer */
export function getDesignGuidance(): string {
  return [
    KB.designInsights.highEngagementColors.length
      ? `High-engagement colors: ${KB.designInsights.highEngagementColors.join(', ')}`
      : 'No color performance data yet',
    KB.designInsights.preferredLayouts.length
      ? `Preferred layouts: ${KB.designInsights.preferredLayouts.join(', ')}`
      : 'No layout preference data yet',
  ].join('\n');
}

/** Get tool guidance for Tool Developer */
export function getToolGuidance(): string {
  return [
    KB.toolPerformance.highBacklinkTypes.length
      ? `High-backlink tool types: ${KB.toolPerformance.highBacklinkTypes.join(', ')}`
      : 'No backlink performance data yet',
    KB.toolPerformance.highEngagementParams.length
      ? `High-engagement params: ${KB.toolPerformance.highEngagementParams.join(', ')}`
      : 'No engagement data yet',
  ].join('\n');
}

/** Get niche ROI data for CSA */
export function getNicheROI(): string {
  if (!KB.nicheROI.length) return 'No niche ROI data yet';
  return KB.nicheROI
    .map(n => `${n.niche}: ROI ${n.roi} — ${n.recommendation}`)
    .join('\n');
}
