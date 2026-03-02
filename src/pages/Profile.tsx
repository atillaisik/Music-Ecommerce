import { useAuthStore, useWishlistStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Heart, Package, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal";

const Profile = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const { items: wishlistItems } = useWishlistStore();
    const navigate = useNavigate();

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

    // Mock orders data
    const mockOrders = [
        { id: "ORD-12345", date: "2024-02-15", total: 1299.99, status: "Delivered" },
        { id: "ORD-12346", date: "2024-02-28", total: 450.00, status: "Processing" },
    ];

    return (
        <div className="container py-8">
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
                <TabsList className="mb-8 h-12 w-full justify-start gap-4 bg-transparent p-0">
                    <TabsTrigger
                        value="wishlist"
                        className="flex h-full items-center gap-2 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                        <Heart size={18} />
                        My Wishlist ({wishlistItems.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="orders"
                        className="flex h-full items-center gap-2 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                        <Package size={18} />
                        Recent Orders
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
                    <div className="space-y-4">
                        {mockOrders.map((order) => (
                            <Card key={order.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-bold">{order.id}</CardTitle>
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                        {order.status}
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Date: {order.date}</span>
                                        <span className="font-bold text-foreground">Total: ${order.total.toLocaleString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Profile;
