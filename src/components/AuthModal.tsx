import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { LogIn, Loader2, MailCheck } from "lucide-react";

interface AuthModalProps {
    defaultTab?: "login" | "signup";
    children?: React.ReactNode;
}

type AuthView = "login" | "signup" | "forgot-password" | "check-email";

export const AuthModal = ({ defaultTab = "login", children }: AuthModalProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<AuthView>(defaultTab);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [subscribedNewsletter, setSubscribedNewsletter] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error(t("auth.errors.invalid_email"));
            return;
        }

        setIsLoading(true);

        try {
            if (view === "login") {
                if (!email || !password) {
                    toast.error(t("auth.errors.fill_all"));
                    setIsLoading(false);
                    return;
                }

                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                toast.success(t("auth.success.logged_in"));
                setIsOpen(false);
                resetForm();
            } else if (view === "signup") {
                if (!email || !password || !name || !confirmPassword) {
                    toast.error(t("auth.errors.fill_all"));
                    setIsLoading(false);
                    return;
                }
                if (password !== confirmPassword) {
                    toast.error(t("auth.errors.passwords_dont_match"));
                    setIsLoading(false);
                    return;
                }
                if (!acceptedTerms) {
                    toast.error(t("auth.errors.must_accept_terms"));
                    setIsLoading(false);
                    return;
                }

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: name } },
                });

                if (error) throw error;

                if (data.session) {
                    toast.success(t("auth.success.account_created_logged_in"));
                    setIsOpen(false);
                    resetForm();
                } else {
                    setView("check-email");
                }

                if (subscribedNewsletter) {
                    toast.info(t("auth.success.newsletter_subscribed"));
                }
            } else if (view === "forgot-password") {
                if (!email) {
                    toast.error(t("auth.errors.enter_email"));
                    setIsLoading(false);
                    return;
                }

                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });

                if (error) throw error;

                toast.success(t("auth.success.reset_email_sent"));
                setView("login");
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            if (error.status === 429 || error.message?.includes("rate limit")) {
                toast.error(t("auth.errors.rate_limit"));
            } else {
                toast.error(error.message || t("auth.errors.generic"));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
        setAcceptedTerms(false);
        setSubscribedNewsletter(false);
        setIsLoading(false);
    };

    const toggleView = (newView: AuthView) => {
        setView(newView);
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                setTimeout(() => {
                    setView(defaultTab);
                    resetForm();
                }, 300);
            }
        }}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="sm" className="gap-2">
                        <LogIn className="h-4 w-4" />
                        {t("auth.sign_in")}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        {view === "login" && t("auth.welcome_back")}
                        {view === "signup" && t("auth.create_account")}
                        {view === "forgot-password" && t("auth.reset_password")}
                        {view === "check-email" && t("auth.check_email")}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground text-center">
                        {view === "login" && t("auth.login_subtitle")}
                        {view === "signup" && t("auth.signup_subtitle")}
                        {view === "forgot-password" && t("auth.forgot_subtitle")}
                        {view === "check-email" && t("auth.check_email_subtitle", { email })}
                    </p>
                </DialogHeader>

                {view === "check-email" ? (
                    <div className="space-y-4 py-4 text-center">
                        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <MailCheck className="h-7 w-7" />
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => toggleView("login")}
                        >
                            {t("auth.back_to_signin")}
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        {view === "signup" && (
                            <div className="space-y-2">
                                <Label htmlFor="name">{t("auth.full_name")}</Label>
                                <Input
                                    id="name"
                                    placeholder="Ahmet Yılmaz"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("auth.email")}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ad@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {view !== "forgot-password" && (
                            <>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">{t("auth.password")}</Label>
                                        {view === "login" && (
                                            <button
                                                type="button"
                                                className="text-xs text-primary hover:underline"
                                                onClick={() => toggleView("forgot-password")}
                                            >
                                                {t("auth.forgot_password")}
                                            </button>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                {view === "signup" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">{t("auth.confirm_password")}</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {view === "signup" && (
                            <div className="space-y-3 pt-2">
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="terms"
                                        checked={acceptedTerms}
                                        onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                                        className="mt-1"
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-tight">
                                        <Trans i18nKey="auth.terms_label">
                                            I agree to the <Link to="/kullanim-kosullari" target="_blank" className="text-primary hover:underline font-medium">Terms & Conditions</Link>
                                        </Trans>
                                    </Label>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="newsletter"
                                        checked={subscribedNewsletter}
                                        onCheckedChange={(checked) => setSubscribedNewsletter(checked as boolean)}
                                        className="mt-1"
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="newsletter" className="text-sm font-normal cursor-pointer leading-tight">
                                        {t("auth.newsletter_label")}
                                    </Label>
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("auth.please_wait")}
                                </>
                            ) : (
                                <>
                                    {view === "login" && t("auth.sign_in")}
                                    {view === "signup" && t("auth.sign_up_button")}
                                    {view === "forgot-password" && t("auth.send_reset_link")}
                                </>
                            )}
                        </Button>
                    </form>
                )}

                {view !== "check-email" && (
                    <div className="text-center text-sm">
                        {view === "login" ? (
                            <p>
                                {t("auth.no_account")}{" "}
                                <button
                                    type="button"
                                    className="text-primary font-semibold hover:underline"
                                    onClick={() => toggleView("signup")}
                                    disabled={isLoading}
                                >
                                    {t("auth.sign_up_button")}
                                </button>
                            </p>
                        ) : (
                            <p>
                                {view === "signup" ? t("auth.have_account") : t("auth.remember_password")}{" "}
                                <button
                                    type="button"
                                    className="text-primary font-semibold hover:underline"
                                    onClick={() => toggleView("login")}
                                    disabled={isLoading}
                                >
                                    {t("auth.sign_in")}
                                </button>
                            </p>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
