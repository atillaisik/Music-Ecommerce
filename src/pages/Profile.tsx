import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useAuthStore, useWishlistStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Heart, Package, User, LogOut, Star, MessageSquare, ArrowLeft, Loader2, Edit2, MapPin, Phone, Mail } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal";
import { useUserOrders } from "@/lib/orderAPI";
import { useUserReviews } from "@/lib/reviewAPI";
import { useProfile, useUpdateProfile } from "@/lib/profileAPI";
import { useState, useEffect, useRef } from "react";
import { uploadAvatar } from "@/lib/imageUploader";
import { toast } from "sonner";
import { formatTRY } from "@/lib/currency";
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
    const { t } = useTranslation();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { items: wishlistItems } = useWishlistStore();
    const navigate = useNavigate();

    const { data: profile, isLoading: isLoadingProfile } = useProfile();
    const updateProfile = useUpdateProfile();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        setIsUploadingAvatar(true);
        try {
            const url = await uploadAvatar(user.id, file);
            if (!url) return;
            await updateProfile.mutateAsync({ avatar_url: url });
            toast.success(t("profile.avatar_updated"));
        } finally {
            setIsUploadingAvatar(false);
            if (avatarInputRef.current) avatarInputRef.current.value = "";
        }
    };

    const { data: realOrders, isLoading: isLoadingOrders } = useUserOrders(user?.email);
    const { data: userReviews = [], isLoading: isLoadingReviews } = useUserReviews(user?.id);

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
                <Helmet><title>{t("profile.title")}</title></Helmet>
                <h1 className="text-3xl font-bold">{t("profile.please_login")}</h1>
                <p className="text-muted-foreground">{t("profile.auth_required")}</p>
                <AuthModal>
                    <Button size="lg">{t("profile.sign_in_button")}</Button>
                </AuthModal>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <Helmet><title>{t("profile.title")}</title></Helmet>
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft size={16} />
                {t("profile.back")}
            </Button>

            {/* Profile Header */}
            <div className="mb-12">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex items-center gap-6">
                        {isLoadingProfile ? (
                            <Skeleton className="h-20 w-20 rounded-full" />
                        ) : (
                            <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                                className="relative h-20 w-20 overflow-hidden rounded-full bg-primary/10 text-primary border-2 border-primary/20 transition-all hover:border-primary/50 group"
                                aria-label={t("profile.avatar_change")}
                                disabled={isUploadingAvatar}
                            >
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <User size={40} className="m-auto" />
                                )}
                                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 transition-opacity group-hover:opacity-100">
                                    {isUploadingAvatar ? t("profile.avatar_uploading") : t("profile.avatar_change")}
                                </span>
                            </button>
                        )}
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />

                        <div>
                            {isLoadingProfile ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-4xl font-black tracking-tight">{profile?.full_name || user?.name || t("profile.default_name")}</h1>
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
                                    {t("profile.edit_profile")}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={handleUpdateProfile}>
                                    <DialogHeader>
                                        <DialogTitle>{t("profile.edit_dialog_title")}</DialogTitle>
                                        <DialogDescription>
                                            {t("profile.edit_dialog_description")}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="full_name">{t("auth.full_name")}</Label>
                                            <Input
                                                id="full_name"
                                                value={editFormData.full_name}
                                                onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                                                placeholder="Ahmet Yılmaz"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">{t("profile.phone")}</Label>
                                            <Input
                                                id="phone"
                                                value={editFormData.phone}
                                                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                                placeholder={t("profile.phone_placeholder")}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="address">{t("profile.shipping_address")}</Label>
                                            <Textarea
                                                id="address"
                                                value={editFormData.address}
                                                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                                placeholder={t("profile.address_placeholder")}
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={updateProfile.isPending}>
                                            {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {t("profile.save_changes")}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button variant="outline" onClick={() => logout()} className="flex-1 gap-2 border-destructive/20 text-destructive hover:bg-destructive/10 md:flex-none">
                            <LogOut size={16} />
                            {t("profile.logout")}
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
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("profile.phone")}</p>
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
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("profile.shipping_address")}</p>
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
                        {t("profile.tabs.wishlist", { count: wishlistItems.length })}
                    </TabsTrigger>
                    <TabsTrigger
                        value="orders"
                        className="flex h-full items-center gap-2 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap data-[state=active]:text-primary font-bold"
                    >
                        <Package size={18} />
                        {t("profile.tabs.orders", { count: realOrders?.length || 0 })}
                    </TabsTrigger>
                    <TabsTrigger
                        value="reviews"
                        className="flex h-full items-center gap-2 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap data-[state=active]:text-primary font-bold"
                    >
                        <MessageSquare size={18} />
                        {t("profile.tabs.reviews", { count: userReviews.length })}
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
                                <h3 className="text-2xl font-bold">{t("profile.wishlist_empty_title")}</h3>
                                <p className="mb-8 max-w-sm text-muted-foreground">{t("profile.wishlist_empty_text")}</p>
                                <Button size="lg" onClick={() => navigate("/shop")}>
                                    {t("profile.wishlist_empty_cta")}
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
                                            {t(`profile.status.${order.status}` as const)}
                                        </span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                                <span className="font-bold text-foreground text-lg">{t("profile.order_total")}: {formatTRY(Number(order.total_amount))}</span>
                                            </div>
                                            {order.order_items && (
                                                <div className="mt-2 text-sm font-medium text-primary">
                                                    {t("profile.order_items", { count: order.order_items.length })}
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
                                <h3 className="text-2xl font-bold">{t("profile.orders_empty_title")}</h3>
                                <p className="mb-8 max-w-sm text-muted-foreground">{t("profile.orders_empty_text")}</p>
                                <Button size="lg" onClick={() => navigate("/shop")}>
                                    {t("profile.orders_empty_cta")}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 outline-none">
                    {isLoadingReviews ? (
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="mt-3 h-4 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : userReviews.length > 0 ? (
                        <div className="space-y-6">
                            {userReviews.map((review) => {
                                const productImage = review.product?.product_images?.find((i) => i.is_primary)?.image_url
                                    ?? review.product?.product_images?.[0]?.image_url
                                    ?? "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop";
                                return (
                                    <Card key={review.id} className="overflow-hidden border-primary/10 transition-all hover:shadow-md">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="w-full md:w-32 lg:w-48 bg-secondary/20 shrink-0">
                                                {review.product ? (
                                                    <Link to={`/product/${review.product.id}`}>
                                                        <img
                                                            src={productImage}
                                                            alt={review.product.name}
                                                            className="h-40 w-full object-cover md:h-full transition-transform hover:scale-105"
                                                        />
                                                    </Link>
                                                ) : (
                                                    <img
                                                        src={productImage}
                                                        alt={t("profile.product_unavailable")}
                                                        className="h-40 w-full object-cover md:h-full opacity-50"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 p-6">
                                                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                                    <div>
                                                        {review.product ? (
                                                            <Link to={`/product/${review.product.id}`} className="text-xl font-bold hover:text-primary transition-colors">
                                                                {review.product.name}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-xl font-bold text-muted-foreground">{t("profile.product_unavailable")}</span>
                                                        )}
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
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="mt-4 relative">
                                                    <p className="text-muted-foreground italic leading-relaxed text-lg">&ldquo;{review.comment}&rdquo;</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-4 rounded-full bg-primary/5 p-4">
                                    <MessageSquare className="h-12 w-12 text-primary/20" />
                                </div>
                                <h3 className="text-2xl font-bold">{t("profile.reviews_empty_title")}</h3>
                                <p className="mb-8 max-w-sm text-muted-foreground">{t("profile.reviews_empty_text")}</p>
                                <Button size="lg" onClick={() => navigate("/shop")}>
                                    {t("profile.reviews_empty_cta")}
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

