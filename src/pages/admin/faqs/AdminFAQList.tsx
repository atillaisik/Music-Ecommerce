import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ToggleLeft,
    ToggleRight,
    AlertTriangle,
    HelpCircle,
    GripVertical,
    Save,
    X
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { faqAPI } from '@/lib/faqAPI';
import { FAQ, FAQInsert, FAQUpdate } from '@/types/faq';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const AdminFAQList = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentFaq, setCurrentFaq] = useState<Partial<FAQ> | null>(null);
    const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchFaqs = async () => {
        try {
            setIsLoading(true);
            const data = await faqAPI.getAll();
            setFaqs(data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            toast.error('Failed to load FAQs');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleToggleActive = async (faq: FAQ) => {
        try {
            const updated = await faqAPI.update(faq.id, { is_active: !faq.is_active });
            setFaqs(faqs.map(f => f.id === faq.id ? updated : f));
            toast.success(`FAQ ${updated.is_active ? 'activated' : 'deactivated'}`);
        } catch (error) {
            console.error('Error toggling FAQ status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async () => {
        if (!faqToDelete) return;
        try {
            await faqAPI.delete(faqToDelete.id);
            setFaqs(faqs.filter(f => f.id !== faqToDelete.id));
            toast.success('FAQ deleted successfully');
            setFaqToDelete(null);
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            toast.error('Failed to delete FAQ');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentFaq?.question || !currentFaq?.answer) {
            toast.error('Question and Answer are required');
            return;
        }

        try {
            setIsSaving(true);
            if (currentFaq.id) {
                const updated = await faqAPI.update(currentFaq.id, {
                    question: currentFaq.question,
                    answer: currentFaq.answer,
                    order_index: currentFaq.order_index
                });
                setFaqs(faqs.map(f => f.id === updated.id ? updated : f));
                toast.success('FAQ updated');
            } else {
                const created = await faqAPI.create({
                    question: currentFaq.question,
                    answer: currentFaq.answer,
                    order_index: faqs.length,
                    is_active: true
                });
                setFaqs([...faqs, created]);
                toast.success('FAQ created');
            }
            setIsDialogOpen(false);
            setCurrentFaq(null);
        } catch (error) {
            console.error('Error saving FAQ:', error);
            toast.error('Failed to save FAQ');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary drop-shadow-sm">FAQ Management</h1>
                    <p className="text-muted-foreground text-sm font-medium">Manage frequently asked questions displayed on the contact page.</p>
                </div>
                <Button
                    onClick={() => {
                        setCurrentFaq({ question: '', answer: '' });
                        setIsDialogOpen(true);
                    }}
                    className="gap-2 shadow-lg shadow-primary/20 h-10 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all"
                >
                    <Plus className="h-4 w-4" />
                    New FAQ
                </Button>
            </div>

            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder="Search FAQs..."
                    className="pl-9 bg-white/50 dark:bg-black/20 border-border/50 focus-visible:ring-primary/20 transition-all rounded-xl h-11"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="border border-border/50 rounded-2xl overflow-hidden bg-white/30 dark:bg-black/10 backdrop-blur-md shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
                <Table>
                    <TableHeader className="bg-muted/40 text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead className="py-4">Question & Answer</TableHead>
                            <TableHead className="text-center py-4 w-[120px]">Status</TableHead>
                            <TableHead className="w-[120px] text-right py-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-border/40">
                                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                                    <TableCell>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-1/3 rounded-full" />
                                            <Skeleton className="h-4 w-2/3 rounded-full" />
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-6 w-12 mx-auto rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-16 ml-auto rounded-lg" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredFaqs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                                        <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                                            <HelpCircle className="h-8 w-8 text-primary" />
                                        </div>
                                        <p className="text-lg font-bold uppercase italic">No FAQs found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredFaqs.map((faq) => (
                                <TableRow key={faq.id} className="hover:bg-primary/5 transition-colors border-border/40 group">
                                    <TableCell className="text-muted-foreground/30">
                                        <GripVertical className="h-4 w-4 cursor-grab" />
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="space-y-1">
                                            <p className="font-bold text-foreground group-hover:text-primary transition-colors">{faq.question}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-transparent h-fit p-0"
                                            onClick={() => handleToggleActive(faq)}
                                        >
                                            {faq.is_active ?
                                                <ToggleRight className="h-7 w-7 text-primary" /> :
                                                <ToggleLeft className="h-7 w-7 text-muted-foreground" />
                                            }
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                                                onClick={() => {
                                                    setCurrentFaq(faq);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all"
                                                onClick={() => setFaqToDelete(faq)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-primary">
                            {currentFaq?.id ? 'Edit FAQ' : 'Create New FAQ'}
                        </DialogTitle>
                        <DialogDescription>
                            Enter the question and answer for the knowledge base.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">The Question</label>
                            <Input
                                value={currentFaq?.question || ''}
                                onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                                placeholder="e.g. What is your return policy?"
                                className="bg-accent/30 border-none h-12 rounded-xl focus-visible:ring-primary/30 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">The Answer</label>
                            <Textarea
                                value={currentFaq?.answer || ''}
                                onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                                placeholder="Provide a detailed answer..."
                                className="bg-accent/30 border-none min-h-[150px] rounded-xl focus-visible:ring-primary/30 resize-none leading-relaxed"
                            />
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsDialogOpen(false)}
                                className="rounded-xl font-bold uppercase tracking-widest text-[10px]"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving ? 'Saving...' : 'Save Knowledge Item'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!faqToDelete} onOpenChange={(open) => !open && setFaqToDelete(null)}>
                <AlertDialogContent className="rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 text-destructive mb-2 bg-destructive/10 w-fit px-3 py-1.5 rounded-full border border-destructive/20">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDialogTitle className="text-sm font-black uppercase tracking-widest italic">Delete FAQ</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription>
                            Are you sure you want to delete this FAQ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="rounded-xl font-black uppercase tracking-widest text-[10px] bg-destructive text-white hover:bg-destructive/90"
                        >
                            Delete Permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminFAQList;
