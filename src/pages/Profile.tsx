import { useAuthStore, useWishlistStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Heart, Package, User, LogOut, Star, MessageSquare, ArrowLeft, Loader2, Edit2, MapPin, Phone, Mail } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal";
import { products } from "@/data/mock";
import { useUserOrders } from "@/lib/orderAPI";
import { useProfile, useUpdateProfile } from "@/lib/profileAPI";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const { items: wishlistItems } = useWishlistStore();
    const navigate = useNavigate();

    const { data: profile, isLoading: isLoadingProfile } = useProfile();
    const updateProfile = useUpdateProfile();

    const { data: realOrders, isLoading: isLoadingOrders } = useUserOrders(user?.email);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        full_name: "",
        phone: "",
        address: ""
    });

    useEffect(() => {
        if (profile) {
            setEditFormData({
                full_name: profile.full_name || "",
                phone: profile.phone || "",
                address: profile.address || ""
            });
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile.mutateAsync(editFormData);
            setIsEditModalOpen(false);
        } catch (error) {
            // Error is handled by the mutation toast
        }
    };

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
    // Note: In Phase 4 we updated reviewAPI to use UUIDs, this mock logic might need 
    // further refinement when we move reviews to Supabase completely.
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

            {/* Profile Header */}
            <div className="mb-12">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex items-center gap-6">
                        {isLoadingProfile ? (
                            <Skeleton className="h-20 w-20 rounded-full" />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary border-2 border-primary/20">
                                <User size={40} />
                            </div>
                        )}
                        <div>
                            {isLoadingProfile ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-4xl font-black tracking-tight">{profile?.full_name || user?.name || "Member"}</h1>
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <Mail size={14} />
                                        {user?.email}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full gap-3 md:w-auto">
                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex-1 gap-2 md:flex-none">
                                    <Edit2 size={16} />
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={handleUpdateProfile}>
                                    <DialogHeader>
                                        <DialogTitle>Edit profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="full_name">Full Name</Label>
                                            <Input
                                                id="full_name"
                                                value={editFormData.full_name}
                                                onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                value={editFormData.phone}
                                                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Textarea
                                                id="address"
                                                value={editFormData.address}
                                                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                                placeholder="123 Music St, New York, NY 10001"
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={updateProfile.isPending}>
                                            {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save changes
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button variant="outline" onClick={() => logout()} className="flex-1 gap-2 border-destructive/20 text-destructive hover:bg-destructive/10 md:flex-none">
                            <LogOut size={16} />
                            Log Out
                        </Button>
                    </div>
                </div>

                {/* Profile Details Grid */}
                {!isLoadingProfile && (profile?.phone || profile?.address) && (
                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {profile.phone && (
                            <Card className="bg-secondary/10 border-none shadow-none">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <div className="rounded-full bg-background p-2 text-primary">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</p>
                                        <p className="font-medium">{profile.phone}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        {profile.address && (
                            <Card className="bg-secondary/10 border-none shadow-none md:col-span-2">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <div className="rounded-full bg-background p-2 text-primary">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shipping Address</p>
                                        <p className="font-medium">{profile.address}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>

            <Tabs defaultValue="wishlist" className="w-full">
                <TabsList className="mb-8 h-12 w-full justify-start gap-4 bg-transparent p-0 overflow-x-auto overflow-y-hidden border-b rounded-none">
                    <TabsTrigger
                        value="wishlist"
                        className="flex h-full items-center gap-2 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap data-[state=active]:text-primary font-bold"
                    >
                        <Heart size={18} />
                        My Wishlist ({wishlistItems.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="orders"
                        className="flex h-full items-center gap-2 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap data-[state=active]:text-primary font-bold"
                    >
                        <Package size={18} />
                        Recent Orders ({realOrders?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger
                        value="reviews"
                        className="flex h-full items-center gap-2 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap data-[state=active]:text-primary font-bold"
                    >
                        <MessageSquare size={18} />
                        My Reviews ({userReviews.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="wishlist" className="mt-0 outline-none">
                    {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {wishlistItems.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-4 rounded-full bg-primary/5 p-4">
                                    <Heart className="h-12 w-12 text-primary/20" />
                                </div>
                                <h3 className="text-2xl font-bold">Your wishlist is empty</h3>
                                <p className="mb-8 max-w-sm text-muted-foreground">Save items you love to find them later! Explore our catalog to find your next musical companion.</p>
                                <Button size="lg" onClick={() => navigate("/shop")}>
                                    Start Browsing
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="orders" className="mt-0 outline-none">
                    {isLoadingOrders ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between">
                                                <Skeleton className="h-6 w-32" />
                                                <Skeleton className="h-6 w-24 rounded-full" />
                                            </div>
                                            <div className="flex justify-between">
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-6 w-20" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : realOrders && realOrders.length > 0 ? (
                        <div className="space-y-4">
                            {realOrders.map((order) => (
                                <Card key={order.id} className="transition-all hover:shadow-md border-primary/10">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-lg font-bold">#{order.id.substring(0, 8).toUpperCase()}</CardTitle>
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${order.status === "completed" ? "bg-green-100 text-green-700" :
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
                                                <span className="font-bold text-foreground text-lg">Total: ${Number(order.total_amount).toLocaleString()}</span>
                                            </div>
                                            {order.order_items && (
                                                <div className="mt-2 text-sm font-medium text-primary">
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
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-4 rounded-full bg-primary/5 p-4">
                                    <Package className="h-12 w-12 text-primary/20" />
                                </div>
                                <h3 className="text-2xl font-bold">No orders found</h3>
                                <p className="mb-8 max-w-sm text-muted-foreground">You haven't placed any orders yet. Once you make a purchase, it will appear here.</p>
                                <Button size="lg" onClick={() => navigate("/shop")}>
                                    Go Shopping
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 outline-none">
                    {userReviews.length > 0 ? (
                        <div className="space-y-6">
                            {userReviews.map((review) => (
                                <Card key={review.id} className="overflow-hidden border-primary/10 transition-all hover:shadow-md">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="w-full md:w-32 lg:w-48 bg-secondary/20 shrink-0">
                                            <Link to={`/product/${review.product.id}`}>
                                                <img
                                                    src={review.product.image}
                                                    alt={review.product.name}
                                                    className="h-40 w-full object-cover md:h-full transition-transform hover:scale-105"
                                                />
                                            </Link>
                                        </div>
                                        <div className="flex-1 p-6">
                                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                                <div>
                                                    <Link to={`/product/${review.product.id}`} className="text-xl font-bold hover:text-primary transition-colors">
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
                                                <span className="text-sm font-medium text-muted-foreground">{review.date}</span>
                                            </div>
                                            <div className="mt-4 relative">
                                                <p className="text-muted-foreground italic leading-relaxed text-lg">&ldquo;{review.comment}&rdquo;</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-4 rounded-full bg-primary/5 p-4">
                                    <MessageSquare className="h-12 w-12 text-primary/20" />
                                </div>
                                <h3 className="text-2xl font-bold">No reviews yet</h3>
                                <p className="mb-8 max-w-sm text-muted-foreground">Share your thoughts on products you've purchased! Your feedback helps other musicians make better choices.</p>
                                <Button size="lg" onClick={() => navigate("/shop")}>
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

export default ProfilePage;

