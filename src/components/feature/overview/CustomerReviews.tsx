import { CustomerReviewCard } from "@/components/feature/overview/CustomerReviewCard";
import { StatisticsSection } from "@/components/feature/overview/StatisticsSection";
import type { CustomerReview } from "@/types/overview";

export interface CustomerReviewsProps {
    reviews: CustomerReview[];
    className?: string;
}

export function CustomerReviews({ reviews, className }: CustomerReviewsProps) {
    return (
        <StatisticsSection className={className} title="Customers feedback">
            <div className="flex flex-col divide-y divide-[#eeeeee]">
                {reviews.map(review => (
                    <CustomerReviewCard
                        key={review.id}
                        message={review.message}
                        name={review.name}
                        roomNumber={review.roomNumber}
                    />
                ))}
            </div>
        </StatisticsSection>
    );
}
