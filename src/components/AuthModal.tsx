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
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

interface AuthModalProps {
    defaultTab?: "login" | "signup";
    children?: React.ReactNode;
}

export const AuthModal = ({ defaultTab = "login", children }: AuthModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState<"login" | "signup">(defaultTab);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [subscribedNewsletter, setSubscribedNewsletter] = useState(false);
    const login = useAuthStore((state) => state.login);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address (e.g. name@example.com)");
            return;
        }

        if (tab === "login") {
            if (!email || !password) {
                toast.error("Please fill in all fields");
                return;
            }
            // Mock authentication
            login(email, "Aras User"); // Mock name for login
            toast.success("Successfully logged in!");
        } else {
            if (!email || !password || !name) {
                toast.error("Please fill in all fields");
                return;
            }
            if (!acceptedTerms) {
                toast.error("You must accept the Terms & Conditions");
                return;
            }

            login(email, name);
            toast.success("Account created successfully!");
            if (subscribedNewsletter) {
                toast.info("Thank you for subscribing to our newsletter!");
            }
        }

        setIsOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setEmail("");
        setName("");
        setPassword("");
        setAcceptedTerms(false);
        setSubscribedNewsletter(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                        {tab === "login" ? "Welcome Back" : "Create Account"}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground text-center">
                        {tab === "login"
                            ? "Enter your credentials to access your account"
                            : "Join ARASOUNDS and start tracking your favorites"}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {tab === "signup" && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {tab === "signup" && (
                        <div className="space-y-3 pt-2">
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={acceptedTerms}
                                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                                    className="mt-1"
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

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        {tab === "login" ? "Sign In" : "Create Account"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    {tab === "login" ? (
                        <p>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="text-primary font-semibold hover:underline"
                                onClick={() => setTab("signup")}
                            >
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="text-primary font-semibold hover:underline"
                                onClick={() => setTab("login")}
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

