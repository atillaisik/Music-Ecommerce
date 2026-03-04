import { useAuthStore, useWishlistStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Heart, Package, User, LogOut, Star, MessageSquare, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal";
import { products } from "@/data/mock";
import { useUserOrders } from "@/lib/orderAPI";

const Profile = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const { items: wishlistItems } = useWishlistStore();
    const navigate = useNavigate();

    const { data: realOrders, isLoading: isLoadingOrders } = useUserOrders(user?.email);

    if (!isAuthenticated) {
        return (
            <div className="container flex min-h-[60vh] flex-col items-center justify-center space-y-4">
                <h1 className="text-3xl font-bold">Please log in to view your profile</h1>
                <p className="text-muted-foreground">You need to be authenticated to access your wishlist and orders.</p>
                <AuthModal>
                    <Button size="lg">Sign In / Sign Up</Button>
                </AuthModal>
            </div>
        );
    }

    // Find reviews authored by the user
    // In a real app, this would be a separate API call to a reviews table
    const userReviews = products.flatMap(product =>
        (product.reviewsData || [])
            .filter(review => review.user === user?.name)
            .map(review => ({ ...review, product }))
    );

    return (
        <div className="container py-8">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft size={16} />
                Back
            </Button>

            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{user?.name}</h1>
                        <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => logout()} className="gap-2">
                    <LogOut size={16} />
                    Log Out
                </Button>
            </div>

            <Tabs defaultValue="wishlist" className="w-full">
                <TabsList className="mb-8 h-12 w-full justify-start gap-4 bg-transparent p-0 overflow-x-auto overflow-y-hidden">
                    <TabsTrigger
                        value="wishlist"
                        className="flex h-full items-center gap-2 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                        <Heart size={18} />
                        My Wishlist ({wishlistItems.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="orders"
                        className="flex h-full items-center gap-2 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                        <Package size={18} />
                        Recent Orders ({realOrders?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger
                        value="reviews"
                        className="flex h-full items-center gap-2 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                    >
                        <MessageSquare size={18} />
                        My Reviews ({userReviews.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="wishlist" className="mt-0">
                    {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {wishlistItems.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Heart className="mb-4 h-12 w-12 text-muted-foreground/40" />
                                <h3 className="text-xl font-semibold">Your wishlist is empty</h3>
                                <p className="mb-6 text-muted-foreground">Save items you love to find them later!</p>
                                <Button variant="outline" onClick={() => navigate("/shop")}>
                                    Start Browsing
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="orders" className="mt-0">
                    {isLoadingOrders ? (
                        <div className="flex h-40 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : realOrders && realOrders.length > 0 ? (
                        <div className="space-y-4">
                            {realOrders.map((order) => (
                                <Card key={order.id}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg font-bold">#{order.id.substring(0, 8)}</CardTitle>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${order.status === "completed" ? "bg-green-100 text-green-700" :
                                            order.status === "cancelled" ? "bg-red-100 text-red-700" :
                                                "bg-blue-100 text-blue-700"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                                                <span className="font-bold text-foreground">Total: ${Number(order.total_amount).toLocaleString()}</span>
                                            </div>
                                            {order.order_items && (
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="mb-4 h-12 w-12 text-muted-foreground/40" />
                                <h3 className="text-xl font-semibold">No orders found</h3>
                                <p className="mb-6 text-muted-foreground">You haven't placed any orders yet.</p>
                                <Button variant="outline" onClick={() => navigate("/shop")}>
                                    Go Shopping
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="reviews" className="mt-0">

                    {userReviews.length > 0 ? (
                        <div className="space-y-6">
                            {userReviews.map((review) => (
                                <Card key={review.id} className="overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="w-full md:w-32 lg:w-48 bg-secondary/20">
                                            <Link to={`/product/${review.product.id}`}>
                                                <img
                                                    src={review.product.image}
                                                    alt={review.product.name}
                                                    className="h-32 w-full object-cover md:h-full transition-transform hover:scale-105"
                                                />
                                            </Link>
                                        </div>
                                        <div className="flex-1 p-6">
                                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                                <div>
                                                    <Link to={`/product/${review.product.id}`} className="font-bold hover:text-primary transition-colors">
                                                        {review.product.name}
                                                    </Link>
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
                                            <p className="mt-4 text-muted-foreground italic">&ldquo;{review.comment}&rdquo;</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/40" />
                                <h3 className="text-xl font-semibold">No reviews yet</h3>
                                <p className="mb-6 text-muted-foreground">Share your thoughts on products you've purchased!</p>
                                <Button variant="outline" onClick={() => navigate("/shop")}>
                                    Go Shopping
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Profile;

