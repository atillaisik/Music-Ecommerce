import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-destructive/5 rounded-3xl border-2 border-dashed border-destructive/20 space-y-6">
                    <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <AlertTriangle className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-black uppercase tracking-tight italic">Something went wrong</h2>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            {this.state.error?.message || "An unexpected error occurred while rendering this component."}
                        </p>
                    </div>
                    <Button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        variant="outline"
                        className="gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
