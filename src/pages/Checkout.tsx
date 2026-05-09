import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCartStore, useAuthStore } from "@/lib/store";

import { useCreateOrder } from "@/lib/orderAPI";
import { validateDiscountCode } from "@/lib/discountAPI";
import { useStoreSettings } from "@/lib/storeSettingsAPI";
import { formatTRY } from "@/lib/currency";
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
    Loader2,
    Tag,
    X,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

type Step = "shipping" | "payment" | "review";

export default function Checkout() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { items, subtotal, clearCart } = useCartStore();
    const [step, setStep] = useState<Step>("shipping");
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });

    const currentSubtotal = subtotal();
    const [discountCode, setDiscountCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
    const [validatingDiscount, setValidatingDiscount] = useState(false);
    const { data: storeSettings } = useStoreSettings();
    const shippingFee = Number(storeSettings?.standardShippingFee ?? 0);
    const total = Math.max(0, currentSubtotal - (appliedDiscount?.amount ?? 0)) + shippingFee;

    const { user } = useAuthStore();

    const handleApplyDiscount = async () => {
        const trimmed = discountCode.trim();
        if (!trimmed) {
            toast.error(t("checkout.discount_required"));
            return;
        }
        setValidatingDiscount(true);
        try {
            const result = await validateDiscountCode(trimmed, currentSubtotal);
            if (!result.ok) {
                toast.error(result.error ?? t("checkout.discount_invalid"));
                setAppliedDiscount(null);
                return;
            }
            setAppliedDiscount({ code: trimmed.toUpperCase(), amount: result.discount_amount });
            toast.success(t("checkout.discount_applied", { amount: formatTRY(result.discount_amount) }));
        } catch (err: any) {
            toast.error(err?.message ?? t("checkout.discount_validation_error"));
        } finally {
            setValidatingDiscount(false);
        }
    };

    const handleClearDiscount = () => {
        setAppliedDiscount(null);
        setDiscountCode("");
    };

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: prev.name || user.name || "",
                email: prev.email || user.email || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        if (items.length === 0 && !isProcessing && step !== "review") {
            toast.error(t("checkout.errors.cart_empty"));
            navigate("/shop");
        }
    }, [items, navigate, isProcessing, step, t]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (step === "shipping") {
            if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zip) {
                toast.error(t("checkout.errors.fill_shipping_fields"));
                return;
            }
            if (formData.name.trim().split(/\s+/).length < 2) {
                toast.error(t("checkout.errors.name_two_words"));
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error(t("checkout.errors.invalid_email"));
                return;
            }
            const cityRegex = /^[A-Za-zÇĞİıÖŞÜçğıöşü\s]+$/;
            if (!cityRegex.test(formData.city)) {
                toast.error(t("checkout.errors.invalid_city"));
                return;
            }
            const zipRegex = /^[a-zA-Z0-9\s-]{5,}$/;
            if (!zipRegex.test(formData.zip)) {
                toast.error(t("checkout.errors.invalid_zip"));
                return;
            }
            setStep("payment");
        } else if (step === "payment") {
            if (!formData.cardNumber || !formData.cvv) {
                toast.error(t("checkout.errors.fill_payment"));
                return;
            }
            if (formData.cardNumber.replace(/\s/g, "").length < 16) {
                toast.error(t("checkout.errors.invalid_card"));
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
                total_amount: currentSubtotal,
                shipping_address: `${formData.address}, ${formData.city}, ${formData.zip}`,
                items: items.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price_at_purchase: item.price,
                })),
                payment_method: "Credit Card",
                discount_code: appliedDiscount?.code,
            });

            setIsProcessing(false);
            clearCart();
            navigate("/checkout/success", {
                state: {
                    orderId: order.id,
                    total: total,
                    items: items,
                },
            });
            toast.success(t("checkout.success_toast"));
        } catch (error: any) {
            console.error("Checkout error:", error);
            setIsProcessing(false);
            toast.error(error.message || t("checkout.errors.place_order_failed"));
        }
    };

    if (items.length === 0 && !isProcessing) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEOHead path="/checkout" defaultTitle={t("checkout.title")} />
            <Navbar />

            <main className="flex-1 container max-w-5xl py-12 px-4">
                <div className="flex flex-col gap-8">
                    {/* Header & Steps */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-display font-bold">{t("checkout.page_title")}</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className={step === "shipping" ? "text-primary font-bold" : ""}>{t("checkout.step_shipping")}</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className={step === "payment" ? "text-primary font-bold" : ""}>{t("checkout.step_payment")}</span>
                            <ChevronRight className="h-4 w-4" />
                            <span className={step === "review" ? "text-primary font-bold" : ""}>{t("checkout.step_review")}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Form Area */}
                        <div className="lg:col-span-2 space-y-8 animate-in fade-in duration-500">
                            {step === "shipping" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <Truck className="h-5 w-5 text-primary" />
                                        <h2>{t("checkout.shipping_info_title")}</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">{t("checkout.full_name")}</Label>
                                            <Input id="name" name="name" placeholder="Ahmet Yılmaz" value={formData.name} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">{t("checkout.email")}</Label>
                                            <Input id="email" name="email" type="email" placeholder="ad@example.com" value={formData.email} onChange={handleInputChange} />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor="address">{t("checkout.address")}</Label>
                                            <Input id="address" name="address" placeholder="Mahalle, sokak, kapı no" value={formData.address} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city">{t("checkout.city")}</Label>
                                            <Input id="city" name="city" placeholder="İstanbul" value={formData.city} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zip">{t("checkout.zip")}</Label>
                                            <Input id="zip" name="zip" placeholder="34000" value={formData.zip} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <Button onClick={nextStep} className="w-full md:w-auto px-8">
                                        {t("checkout.continue_to_payment")}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {step === "payment" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        <h2>{t("checkout.payment_method_title")}</h2>
                                    </div>
                                    <div className="p-4 rounded-lg bg-secondary/50 border border-border flex items-center gap-4 text-sm text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <p>{t("checkout.payment_demo_note")}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor="cardNumber">{t("checkout.card_number")}</Label>
                                            <Input id="cardNumber" name="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry">{t("checkout.expiry")}</Label>
                                            <Input id="expiry" name="expiry" placeholder="AA/YY" value={formData.expiry} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvv">{t("checkout.cvv")}</Label>
                                            <Input id="cvv" name="cvv" placeholder="123" value={formData.cvv} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={prevStep}>
                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                            {t("common.back")}
                                        </Button>
                                        <Button onClick={nextStep} className="flex-1 md:flex-none md:px-8">
                                            {t("checkout.review_order")}
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === "review" && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 text-xl font-bold">
                                        <ShoppingBag className="h-5 w-5 text-primary" />
                                        <h2>{t("checkout.review_title")}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-xl border border-border bg-card">
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{t("checkout.shipping_to")}</h3>
                                            <p className="font-medium">{formData.name}</p>
                                            <p className="text-sm text-muted-foreground">{formData.address}</p>
                                            <p className="text-sm text-muted-foreground">{formData.city}, {formData.zip}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{t("checkout.payment_label")}</h3>
                                            <p className="font-medium">{t("checkout.card_ending", { last4: formData.cardNumber.slice(-4) })}</p>
                                            <p className="text-sm text-muted-foreground">{formData.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={prevStep} disabled={isProcessing}>
                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                            {t("common.back")}
                                        </Button>
                                        <Button onClick={handlePlaceOrder} className="flex-1 md:flex-none md:px-12 py-6 text-lg" disabled={isProcessing}>
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    {t("checkout.processing")}
                                                </>
                                            ) : (
                                                t("checkout.place_order")
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="space-y-6 lg:border-l lg:pl-12 border-border">
                            <h2 className="text-xl font-bold">{t("checkout.order_summary")}</h2>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-16 w-16 rounded bg-secondary overflow-hidden flex-shrink-0">
                                            <img
                                                src={(item as any).image || (item.images && item.images.length > 0 ? (typeof item.images[0] === "string" ? item.images[0] : item.images[0].image_url) : "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop")}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 text-sm">
                                            <p className="font-medium line-clamp-1">{item.name}</p>
                                            <p className="text-muted-foreground">{t("cart.quantity")}: {item.quantity}</p>
                                            <p className="font-bold mt-1">{formatTRY(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                {t("checkout.vat_note")}
                            </p>

                            {/* Discount code */}
                            <div className="space-y-2">
                                <Label htmlFor="discount" className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <Tag className="h-3.5 w-3.5" /> {t("checkout.discount_code")}
                                </Label>
                                {appliedDiscount ? (
                                    <div className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
                                        <span className="font-mono font-bold">{appliedDiscount.code}</span>
                                        <button
                                            type="button"
                                            onClick={handleClearDiscount}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                            aria-label={t("checkout.discount_remove")}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input
                                            id="discount"
                                            placeholder={t("checkout.discount_placeholder")}
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            className="font-mono uppercase tracking-wider"
                                            disabled={validatingDiscount}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleApplyDiscount}
                                            disabled={validatingDiscount || !discountCode.trim()}
                                        >
                                            {validatingDiscount ? <Loader2 className="h-4 w-4 animate-spin" /> : t("checkout.discount_apply")}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
                                    <span>{formatTRY(currentSubtotal)}</span>
                                </div>
                                {appliedDiscount && (
                                    <div className="flex justify-between text-sm text-emerald-600">
                                        <span>{t("checkout.discount")} ({appliedDiscount.code})</span>
                                        <span>-{formatTRY(appliedDiscount.amount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t("checkout.shipping")}</span>
                                    {shippingFee > 0 ? (
                                        <span className="font-medium">{formatTRY(shippingFee)}</span>
                                    ) : (
                                        <span className="text-green-600 font-medium">{t("checkout.shipping_included")}</span>
                                    )}
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>{t("checkout.total_with_vat")}</span>
                                    <span className="text-primary">{formatTRY(total)}</span>
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
