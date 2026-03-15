import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAdminStore } from '@/lib/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Music, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
    const navigate = useNavigate();
    const login = useAdminStore((state) => state.login);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        try {
            // 1. Sign in with Supabase Auth — this sets auth.uid() for RLS
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (authError || !authData.user) {
                let errorMessage = 'Please check your email and password.';
                
                if (authError?.message === 'Email not confirmed') {
                    errorMessage = 'Your email address has not been confirmed yet. Please check your inbox or contact the system administrator.';
                } else if (authError?.message === 'Invalid login credentials') {
                    errorMessage = 'The email or password you entered is incorrect.';
                }

                toast.error('Login failed', {
                    description: errorMessage,
                });
                return;
            }

            // 2. Verify the user is in the admin_users table with an active role
            const { data: adminUser, error: adminError } = await supabase
                .from('admin_users')
                .select('id, email, role, is_active')
                .eq('id', authData.user.id)
                .single();

            if (adminError || !adminUser) {
                // Not an admin — sign them out and reject
                await supabase.auth.signOut();
                toast.error('Access denied', {
                    description: 'Your account does not have admin privileges. If this is a new account, ensure it has been added to the admin_users table.',
                });
                return;
            }

            if (!adminUser.is_active) {
                await supabase.auth.signOut();
                toast.error('Account inactive', {
                    description: 'Your admin account has been deactivated. Please contact the system administrator.',
                });
                return;
            }

            // 3. Store the session in the admin store
            login(
                adminUser.email,
                adminUser.email.split('@')[0],
                adminUser.role,
                authData.session?.access_token ?? ''
            );

            toast.success('Login successful', {
                description: 'Welcome back to the Admin Dashboard.',
            });
            navigate('/admin');
        } catch (err: any) {
            toast.error('Login failed', {
                description: err.message ?? 'An unexpected error occurred.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl opacity-50" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary shadow-lg border border-primary/20">
                        <Music className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">ARASOUNDS</h1>
                    <p className="text-muted-foreground mt-2 flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Admin Control Center
                    </p>
                </div>

                <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Admin Authentication</CardTitle>
                        <CardDescription>
                            Enter your credentials to access the administrative panel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input placeholder="admin@arasounds.com" className="pl-10" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Authenticating...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <span>Log In</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-0">
                        <div className="w-full text-center text-xs text-muted-foreground border-t pt-4">
                            Powered by ARASOUNDS Infrastructure
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
