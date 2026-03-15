import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore, useAuthStore } from "@/lib/store";

import { useCreateOrder } from "@/lib/orderAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    ChevronRight,
    ChevronLeft,
    CreditCard,
    Truck,
    CheckCircle2,
    ShoppingBag,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Step = "shipping" | "payment" | "review";

export default function Checkout() {
    const navigate = useNavigate();
    const { items, subtotal, clearCart } = useCartStore();
    const [step, setStep] = useState<Step>("shipping");
    const [isProcessing, setIsProcessing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    const currentSubtotal = subtotal();
    const total = currentSubtotal;

    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || user.name || "",
                email: prev.email || user.email || ""
            }));
        }
    }, [user]);

    useEffect(() => {
        if (items.length === 0 && !isProcessing && step !== "review") {
            // If cart is empty and we aren't mid-checkout/success, go back to shop
            // But let's allow review step if reached. Actually, if empty, just go home.
            toast.error("Your cart is empty");
            navigate("/shop");
        }
    }, [items, navigate, isProcessing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (step === "shipping") {
            if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zip) {
                toast.error("Please fill in all shipping fields");
                return;
            }

            // Name validation: At least two words
            if (formData.name.trim().split(/\s+/).length < 2) {
                toast.error("Please enter both First and Last name");
                return;
            }

            // Email validation: strict regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error("Please enter a valid email address");
                return;
            }

            // City validation: alphabetical characters only (allowing spaces)
            const cityRegex = /^[A-Za-z\s]+$/;
            if (!cityRegex.test(formData.city)) {
                toast.error("City name can only contain alphabetical characters");
                return;
            }

            // ZIP Code validation: minimum 5 alphanumeric characters
            const zipRegex = /^[a-zA-Z0-9\s-]{5,}$/;
            if (!zipRegex.test(formData.zip)) {
                toast.error("ZIP Code must be at least 5 alphanumeric characters");
                return;
            }

            setStep("payment");
        } else if (step === "payment") {
            if (!formData.cardNumber || !formData.cvv) {
                toast.error("Please fill in payment details");
                return;
            }
            // Mock card validation
            if (formData.cardNumber.replace(/\s/g, "").length < 16) {
                toast.error("Invalid card number. Use 16 digits.");
                return;
            }
            setStep("review");
        }
    };

    const prevStep = () => {
        if (step === "payment") setStep("shipping");
        if (step === "review") setStep("payment");
    };

    const createOrder = useCreateOrder();
    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        try {
            const order = await createOrder.mutateAsync({
                customer_name: formData.name,
                customer_email: formData.email,
                total_amount: total,
                shipping_address: `${formData.address}, ${formData.city}, ${formData.zip}`,
                items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_purchase: item.price
                })),
                payment_method: 'Credit Card',
                user_id: user?.id
            });


            setIsProcessing(false);
            clearCart();
            navigate("/checkout/success", {
                state: {
                    orderId: order.id,
                    total: total,
                    items: items
                }
            });
            toast.success("Order placed successfully!");
        } catch (error: any) {
            console.error("Checkout error:", error);
            setIsProcessing(false);
            toast.error(error.message || "Failed to place order. Please try again.");
        }
    };

    if (items.length === 0 && !isProcessing) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container max-w-5xl py-12 px-4">
                <div className="flex flex-col gap-8">
                    {/* Header & Steps */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-display font-bold">Checkout</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className={step === "shipping" ? "text-primary font-bold" : ""}>Shipping</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className={step === "payment" ? "text-primary font-bold" : ""}>Payment</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className={step === "review" ? "text-primary font-bold" : ""}>Review</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Form Area */}
                        <div className="lg:col-span-2 space-y-8 animate-in fade-in duration-500">
                            {step === "shipping" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <Truck className="h-5 w-5 text-primary" />
                                        <h2>Shipping Information</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor="address">Street Address</Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                placeholder="123 Music Ave"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                placeholder="New York"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zip">ZIP Code</Label>
                                            <Input
                                                id="zip"
                                                name="zip"
                                                placeholder="10001"
                                                value={formData.zip}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={nextStep} className="w-full md:w-auto px-8">
                                        Continue to Payment
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {step === "payment" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        <h2>Payment Method</h2>
                                    </div>
                                    <div className="p-4 rounded-lg bg-secondary/50 border border-border flex items-center gap-4 text-sm text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <p>This is a simulated checkout. Use any 16-digit number.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor="cardNumber">Card Number</Label>
                                            <Input
                                                id="cardNumber"
                                                name="cardNumber"
                                                placeholder="0000 0000 0000 0000"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry">Expiry Date</Label>
                                            <Input
                                                id="expiry"
                                                name="expiry"
                                                placeholder="MM/YY"
                                                value={formData.expiry}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvv">CVV</Label>
                                            <Input
                                                id="cvv"
                                                name="cvv"
                                                placeholder="123"
                                                value={formData.cvv}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={prevStep}>
                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button onClick={nextStep} className="flex-1 md:flex-none md:px-8">
                                            Review Order
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === "review" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <ShoppingBag className="h-5 w-5 text-primary" />
                                        <h2>Review Your Order</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-xl border border-border bg-card">
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Shipping To</h3>
                                            <p className="font-medium">{formData.name}</p>
                                            <p className="text-sm text-muted-foreground">{formData.address}</p>
                                            <p className="text-sm text-muted-foreground">{formData.city}, {formData.zip}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Payment</h3>
                                            <p className="font-medium">Card ending in {formData.cardNumber.slice(-4)}</p>
                                            <p className="text-sm text-muted-foreground">{formData.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={prevStep} disabled={isProcessing}>
                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handlePlaceOrder}
                                            className="flex-1 md:flex-none md:px-12 py-6 text-lg"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                "Place Order"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="space-y-6 lg:border-l lg:pl-12 border-border">
                            <h2 className="text-xl font-bold">Order Summary</h2>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-16 w-16 rounded bg-secondary overflow-hidden flex-shrink-0">
                                            <img src={(item as any).image || (item.images && item.images.length > 0 ? (typeof item.images[0] === 'string' ? item.images[0] : item.images[0].image_url) : 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop')} alt={item.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-sm">
                                            <p className="font-medium line-clamp-1">{item.name}</p>
                                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                            <p className="font-bold mt-1">${(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${currentSubtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">${total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
