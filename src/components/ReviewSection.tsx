import { useState } from "react";
import { Star, MessageSquarePlus } from "lucide-react";
import { Review } from "@/data/mock";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReviewSectionProps {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
    onAddReview?: (review: Review) => void;
}

const ReviewSection = ({ reviews, averageRating, totalReviews, onAddReview }: ReviewSectionProps) => {
    const { isAuthenticated, user } = useAuthStore();
    const [showAll, setShowAll] = useState(false);
    const [isAddingReview, setIsAddingReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

    const displayedReviews = showAll ? reviews : reviews.slice(0, 2);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !onAddReview) return;

        const review: Review = {
            id: Math.random().toString(36).substring(2, 9),
            user: user.name,
            rating: newReview.rating,
            comment: newReview.comment,
            date: new Date().toISOString().split("T")[0],
        };

        onAddReview(review);
        setNewReview({ rating: 5, comment: "" });
        setIsAddingReview(false);
    };

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

                {!isAddingReview ? (
                    <Button onClick={() => setIsAddingReview(true)}>
                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                        Write a Review
                    </Button>
                ) : null}
            </div>

            {isAddingReview && (
                <div className="mt-12 rounded-xl border border-border p-6 md:p-8">
                    {isAuthenticated ? (
                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            <h3 className="text-xl font-bold uppercase">Leave a Review</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Rating</Label>
                                    <div className="mt-2 flex items-center gap-2">
                                        {[...Array(5)].map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                                                className="transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${i < newReview.rating
                                                        ? "fill-primary text-primary"
                                                        : "fill-muted text-muted"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="comment">Your Review</Label>
                                    <Textarea
                                        id="comment"
                                        placeholder="Share your thoughts about this product..."
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        className="min-h-[120px]"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Button type="submit">Submit Review</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddingReview(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center">
                            <p className="text-lg font-medium">Log in to share your thoughts</p>
                            <p className="mt-2 text-muted-foreground">Only registered customers who have purchased this product may leave a review.</p>
                            <Button
                                variant="outline"
                                className="mt-6"
                                onClick={() => setIsAddingReview(false)}
                            >
                                Close
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-12 space-y-8">
                {displayedReviews.length > 0 ? (
                    <>
                        {displayedReviews.map((review) => (
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
                        ))}

                        {!showAll && reviews.length > 2 && (
                            <div className="flex justify-center pt-8">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setShowAll(true)}
                                    className="uppercase tracking-wider"
                                >
                                    Show more comments ({reviews.length - 2} more)
                                </Button>
                            </div>
                        )}
                    </>
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
