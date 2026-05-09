import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatTRY } from "@/lib/currency";

export default function CheckoutSuccess() {
    const { t } = useTranslation();
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
            <Helmet>
                <title>{t("checkout_success.title")}</title>
            </Helmet>
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-xl w-full text-center space-y-8 py-12 animate-in zoom-in duration-500">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="h-12 w-12 text-primary" />
                        </div>
                        <h1 className="text-4xl font-display font-bold">{t("checkout_success.heading")}</h1>
                        <p className="text-muted-foreground">{t("checkout_success.subtitle")}</p>
                    </div>

                    <div className="p-8 rounded-2xl border border-border bg-card text-left space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                                    {t("checkout_success.order_number")}
                                </p>
                                <p className="text-xl font-mono font-bold text-primary">
                                    #{String(orderId).substring(0, 8).toUpperCase()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold">
                                    {t("checkout_success.total")}
                                </p>
                                <p className="text-xl font-bold">{formatTRY(Number(total ?? 0))}</p>
                            </div>
                        </div>

                        {items && items.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    {t("checkout.order_summary")}
                                </p>
                                <div className="space-y-3">
                                    {items.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <span className="line-clamp-1">{item.name} × {item.quantity}</span>
                                            <span className="font-bold">{formatTRY(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-left p-6 rounded-2xl border border-primary/20 bg-primary/5">
                        <h3 className="font-bold text-sm uppercase tracking-widest mb-3">
                            {t("checkout_success.what_next")}
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• {t("checkout_success.step_1")}</li>
                            <li>• {t("checkout_success.step_2")}</li>
                            <li>• {t("checkout_success.step_3")}</li>
                        </ul>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center pt-4">
                        <Button variant="outline" asChild className="w-full md:w-auto">
                            <Link to="/profile">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                {t("checkout_success.view_orders")}
                            </Link>
                        </Button>
                        <Button asChild className="w-full md:w-auto px-8">
                            <Link to="/shop">
                                {t("checkout_success.continue_shopping")}
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
