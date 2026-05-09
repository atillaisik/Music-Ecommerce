import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, MessageSquarePlus } from "lucide-react";
import { ProductReview, AddReviewInput } from "@/lib/reviewAPI";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReviewSectionProps {
    reviews: ProductReview[];
    averageRating: number;
    totalReviews: number;
    onAddReview?: (review: Omit<AddReviewInput, "product_id">) => void;
}

const ReviewSection = ({ reviews, averageRating, totalReviews, onAddReview }: ReviewSectionProps) => {
    const { t } = useTranslation();
    const { isAuthenticated, user } = useAuthStore();
    const [showAll, setShowAll] = useState(false);
    const [isAddingReview, setIsAddingReview] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: "",
        reviewer_name: "",
        reviewer_email: "",
    });

    const displayedReviews = showAll ? reviews : reviews.slice(0, 2);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!onAddReview) return;

        const reviewer_name = isAuthenticated && user?.name
            ? user.name
            : newReview.reviewer_name.trim();

        if (!reviewer_name) return;
        if (!newReview.comment.trim()) return;

        onAddReview({
            rating: newReview.rating,
            comment: newReview.comment,
            reviewer_name,
            reviewer_email: isAuthenticated ? undefined : newReview.reviewer_email.trim() || undefined,
        });

        setNewReview({ rating: 5, comment: "", reviewer_name: "", reviewer_email: "" });
        setIsAddingReview(false);
    };

    return (
        <section className="mt-24">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold uppercase tracking-tight">{t("reviews.title")}</h2>
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
                        <span className="text-xl font-bold">
                            {t("reviews.average_rating", { rating: averageRating })}
                        </span>
                        <span className="text-muted-foreground">
                            {t("reviews.count", { count: totalReviews })}
                        </span>
                    </div>
                </div>

                {!isAddingReview && (
                    <Button onClick={() => setIsAddingReview(true)}>
                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                        {t("reviews.write_review")}
                    </Button>
                )}
            </div>

            {isAddingReview && (
                <div className="mt-12 rounded-xl border border-border p-6 md:p-8">
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                        <h3 className="text-xl font-bold uppercase">{t("reviews.leave_review")}</h3>
                        {!isAuthenticated && (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="reviewer_name">{t("reviews.your_name")}</Label>
                                    <Input
                                        id="reviewer_name"
                                        value={newReview.reviewer_name}
                                        onChange={(e) => setNewReview({ ...newReview, reviewer_name: e.target.value })}
                                        placeholder="Ahmet Yılmaz"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reviewer_email">{t("reviews.your_email")}</Label>
                                    <Input
                                        id="reviewer_email"
                                        type="email"
                                        value={newReview.reviewer_email}
                                        onChange={(e) => setNewReview({ ...newReview, reviewer_email: e.target.value })}
                                        placeholder="ad@example.com"
                                        required
                                    />
                                </div>
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">{t("reviews.rating")}</Label>
                                <div className="mt-2 flex items-center gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                                            className="transition-transform hover:scale-110"
                                            aria-label={t("reviews.rating_label", { rating: i + 1 })}
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
                                <Label htmlFor="comment">{t("reviews.your_review")}</Label>
                                <Textarea
                                    id="comment"
                                    placeholder={t("reviews.review_placeholder")}
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button type="submit">{t("reviews.submit")}</Button>
                            <Button type="button" variant="outline" onClick={() => setIsAddingReview(false)}>
                                {t("common.cancel")}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="mt-12 space-y-8">
                {displayedReviews.length > 0 ? (
                    <>
                        {displayedReviews.map((review) => (
                            <div key={review.id} className="border-b border-border pb-8 last:border-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">{review.user_name}</p>
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
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
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
                                    {t("reviews.show_more", { count: reviews.length - 2 })}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="rounded-xl bg-secondary/30 p-8 text-center">
                        <p className="text-muted-foreground">{t("reviews.empty")}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReviewSection;
