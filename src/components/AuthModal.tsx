import { useState } from "react";
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
import { LogIn, Loader2, Mail } from "lucide-react";

interface AuthModalProps {
    defaultTab?: "login" | "signup";
    children?: React.ReactNode;
}

type AuthView = "login" | "signup" | "forgot-password";

export const AuthModal = ({ defaultTab = "login", children }: AuthModalProps) => {
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
            toast.error("Please enter a valid email address (e.g. name@example.com)");
            return;
        }

        setIsLoading(true);

        try {
            if (view === "login") {
                if (!email || !password) {
                    toast.error("Please fill in all fields");
                    setIsLoading(false);
                    return;
                }
                
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;
                
                toast.success("Successfully logged in!");
                setIsOpen(false);
                resetForm();
            } else if (view === "signup") {
                if (!email || !password || !name || !confirmPassword) {
                    toast.error("Please fill in all fields");
                    setIsLoading(false);
                    return;
                }
                if (password !== confirmPassword) {
                    toast.error("Passwords do not match");
                    setIsLoading(false);
                    return;
                }
                if (!acceptedTerms) {
                    toast.error("You must accept the Terms & Conditions");
                    setIsLoading(false);
                    return;
                }

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        }
                    }
                });

                if (error) throw error;

                if (data.session || data.user) {
                    if (data.session) {
                        toast.success("Account created and logged in!");
                    } else {
                        toast.success("Account created successfully! You can now sign in.");
                        setView("login");
                    }
                } else {
                    toast.success("Account created! Please check your email for confirmation.");
                }
                
                if (subscribedNewsletter) {
                    toast.info("Thank you for subscribing to our newsletter!");
                }
                
                if (data.session) {
                    setIsOpen(false);
                    resetForm();
                }
            } else if (view === "forgot-password") {
                if (!email) {
                    toast.error("Please enter your email");
                    setIsLoading(false);
                    return;
                }

                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });

                if (error) throw error;

                toast.success("Password reset email sent!");
                setView("login");
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            if (error.status === 429 || error.message?.includes("rate limit")) {
                toast.error("Email rate limit exceeded. Please try again in an hour or contact support.");
            } else {
                toast.error(error.message || "An error occurred during authentication");
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
        // Don't reset everything, email can be shared across views
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
                        Sign In
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        {view === "login" && "Welcome Back"}
                        {view === "signup" && "Create Account"}
                        {view === "forgot-password" && "Reset Password"}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground text-center">
                        {view === "login" && "Enter your credentials to access your account"}
                        {view === "signup" && "Join ARASOUNDS and start tracking your favorites"}
                        {view === "forgot-password" && "Enter your email to receive a reset link"}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {view === "signup" && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
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
                                    <Label htmlFor="password">Password</Label>
                                    {view === "login" && (
                                        <button 
                                            type="button" 
                                            className="text-xs text-primary hover:underline"
                                            onClick={() => toggleView("forgot-password")}
                                        >
                                            Forgot password?
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
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                                <div className="grid gap-1.5 leading-none">
                                    <Label
                                        htmlFor="terms"
                                        className="text-sm font-normal cursor-pointer leading-tight"
                                    >
                                        I agree to the <button type="button" className="text-primary hover:underline font-medium">Terms & Conditions</button>
                                    </Label>
                                </div>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="newsletter"
                                    checked={subscribedNewsletter}
                                    onCheckedChange={(checked) => setSubscribedNewsletter(checked as boolean)}
                                    className="mt-1"
                                    disabled={isLoading}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label
                                        htmlFor="newsletter"
                                        className="text-sm font-normal cursor-pointer leading-tight"
                                    >
                                        Subscribe to newsletter
                                    </Label>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait...
                            </>
                        ) : (
                            <>
                                {view === "login" && "Sign In"}
                                {view === "signup" && "Create Account"}
                                {view === "forgot-password" && "Send Reset Link"}
                            </>
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    {view === "login" ? (
                        <p>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="text-primary font-semibold hover:underline"
                                onClick={() => toggleView("signup")}
                                disabled={isLoading}
                            >
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p>
                            {view === "signup" ? "Already have an account? " : "Remembered your password? "}
                            <button
                                type="button"
                                className="text-primary font-semibold hover:underline"
                                onClick={() => toggleView("login")}
                                disabled={isLoading}
                            >
                                Sign In
                            </button>
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

