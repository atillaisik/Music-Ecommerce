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
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";

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
    const login = useAuthStore((state) => state.login);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || (tab === "signup" && !name)) {
            toast.error("Please fill in all fields");
            return;
        }

        // Mock authentication
        if (tab === "login") {
            login(email, "Aras User"); // Mock name for login
            toast.success("Successfully logged in!");
        } else {
            login(email, name);
            toast.success("Account created successfully!");
        }

        setIsOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setEmail("");
        setName("");
        setPassword("");
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
