import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

const ResetPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);

    useEffect(() => {
        const sub = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") setHasRecoverySession(true);
        });

        supabase.auth.getSession().then(({ data }) => {
            if (data.session?.user) setHasRecoverySession(true);
            else setHasRecoverySession((prev) => prev ?? false);
        });

        return () => {
            sub.data.subscription.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 8) {
            toast.error(t("reset_password.errors.min_length"));
            return;
        }
        if (password !== confirmPassword) {
            toast.error(t("reset_password.errors.no_match"));
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            toast.success(t("reset_password.success"));
            navigate("/profile");
        } catch (err: any) {
            toast.error(err?.message ?? t("reset_password.errors.update_failed"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Helmet>
                <title>{t("reset_password.title")}</title>
            </Helmet>

            <Card className="w-full max-w-md border-border/50">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <CardTitle>{t("reset_password.heading")}</CardTitle>
                    <CardDescription>{t("reset_password.subtitle")}</CardDescription>
                </CardHeader>
                <CardContent>
                    {hasRecoverySession === false ? (
                        <div className="text-sm text-muted-foreground space-y-3 text-center">
                            <p>{t("reset_password.expired_link")}</p>
                            <Button variant="outline" onClick={() => navigate("/")}>
                                {t("reset_password.back_home")}
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">{t("reset_password.new_password")}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        disabled={isLoading || hasRecoverySession === null}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">{t("reset_password.confirm_new_password")}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        className="pl-10"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        disabled={isLoading || hasRecoverySession === null}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading || hasRecoverySession === null}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("reset_password.updating")}
                                    </>
                                ) : (
                                    t("reset_password.set_password")
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
