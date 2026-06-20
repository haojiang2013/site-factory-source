import { FAQ } from '@/lib/site-config';

export function FAQSection({ faqs, max }: { faqs: FAQ[]; max?: number }) {
  const list = max ? faqs.slice(0, max) : faqs;
  if (!list || list.length === 0) return null;

  return (
    <section className="faq-section my-8">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <dl className="space-y-5">
        {list.map((faq, i) => (
          <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
            <dt className="font-semibold text-gray-900 mb-1">{faq.question}</dt>
            <dd className="text-gray-600 leading-relaxed">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
