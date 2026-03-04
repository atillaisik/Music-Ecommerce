import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CartSheet() {
    const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCartStore();

    const currentSubtotal = subtotal();
    const total = currentSubtotal;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="relative p-2 text-muted-foreground transition-colors hover:text-foreground" aria-label="Cart">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems() > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {totalItems()}
                        </span>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col sm:max-w-md">
                <SheetHeader className="px-1">
                    <SheetTitle className="font-display flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Your Cart ({totalItems()})
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
                        <div className="rounded-full bg-secondary p-6">
                            <ShoppingCart className="h-10 w-10 text-muted-foreground opacity-20" />
                        </div>
                        <p className="text-center text-muted-foreground">Your cart is empty</p>
                        <Button variant="outline" asChild>
                            <SheetTrigger asChild>
                                <button>Continue Shopping</button>
                            </SheetTrigger>
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6">
                            <div className="flex flex-col gap-6 py-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between py-0.5">
                                            <div>
                                                <div className="flex justify-between gap-2">
                                                    <h4 className="line-clamp-1 text-sm font-medium">{item.name}</h4>
                                                    <p className="text-sm font-bold">${(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-0.5">{item.brand}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center rounded-md border border-border">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-muted-foreground transition-colors hover:text-destructive"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="space-y-4 pt-6">
                            <Separator />
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${currentSubtotal.toLocaleString()}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">${total.toLocaleString()}</span>
                                </div>
                            </div>
                            <SheetFooter className="mt-2">
                                <Button className="w-full font-display uppercase tracking-wider py-6" asChild>
                                    <Link to="/checkout">
                                        Checkout Now
                                    </Link>
                                </Button>
                            </SheetFooter>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
