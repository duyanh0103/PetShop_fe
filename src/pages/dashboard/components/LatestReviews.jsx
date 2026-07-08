import { Card } from "@/components/ui/Card";

function LatestReviews({ reviews }) {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Latest Reviews</h2>
        <p className="mt-2 text-sm text-slate-500">Recent customer feedback from your storefront.</p>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-900">{review.customer}</p>
              <span className="text-sm font-semibold text-amber-600">★ {review.rating}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default LatestReviews;
