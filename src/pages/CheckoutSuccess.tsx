import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, total, items } = location.state || {};

    useEffect(() => {
        if (!orderId) {
            navigate("/");
        }
    }, [orderId, navigate]);

    if (!orderId) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-xl w-full text-center space-y-8 py-12 animate-in zoom-in duration-500">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="h-12 w-12 text-primary" />
                        </div>
                        <h1 className="text-4xl font-display font-bold">Order Confirmed!</h1>
                        <p className="text-muted-foreground">
                            Thank you for your purchase. We've received your order and are getting it ready for shipment.
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl border border-border bg-card/50 text-left space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Order Number</p>
                                <p className="text-xl font-mono font-bold text-primary">{orderId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Total Paid</p>
                                <p className="text-xl font-bold">${total.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Items</p>
                            <div className="space-y-3">
                                {items?.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <span className="line-clamp-1">{item.name} x{item.quantity}</span>
                                        <span className="font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center pt-4">
                        <Button variant="outline" asChild className="w-full md:w-auto">
                            <Link to="/shop">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Continue Shopping
                            </Link>
                        </Button>
                        <Button asChild className="w-full md:w-auto px-8">
                            <Link to="/">
                                Back to Home
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
