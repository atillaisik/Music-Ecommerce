import { Star } from "lucide-react";
import { Review } from "@/data/mock";

interface ReviewSectionProps {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

const ReviewSection = ({ reviews, averageRating, totalReviews }: ReviewSectionProps) => {
    return (
        <section className="mt-24">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold uppercase tracking-tight">Customer Reviews</h2>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${i < Math.floor(averageRating)
                                            ? "fill-primary text-primary"
                                            : "fill-muted text-muted"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xl font-bold">{averageRating} out of 5</span>
                        <span className="text-muted-foreground">({totalReviews} reviews)</span>
                    </div>
                </div>
            </div>

            <div className="mt-12 space-y-8">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-border pb-8 last:border-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold">{review.user}</p>
                                    <div className="mt-1 flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating
                                                        ? "fill-primary text-primary"
                                                        : "fill-muted text-muted"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="mt-4 text-muted-foreground">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <div className="rounded-xl bg-secondary/30 p-8 text-center">
                        <p className="text-muted-foreground">No detailed reviews yet. Be the first to share your experience!</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReviewSection;
