import { AffiliateCTA as AffiliateCTAConfig } from '@/lib/site-config';

export function AffiliateCTA({ cta, brandName }: {
  cta: AffiliateCTAConfig;
  brandName: string;
}) {
  return (
    <div className="affiliate-cta rounded-lg border border-green-200 bg-green-50 p-5 my-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-green-700">
          {brandName} Pick
        </span>
        <span className="text-xs text-green-600">•</span>
        <span className="text-xs text-green-600">Our Recommendation</span>
      </div>
      <p className="text-sm text-gray-700 mb-3">{cta.productName}</p>
      <a
        href={cta.link}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="inline-flex items-center gap-1 rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 transition-colors"
      >
        View on {cta.platform} →
      </a>
      <p className="text-xs text-gray-400 mt-2">{cta.disclosureText}</p>
    </div>
  );
}
