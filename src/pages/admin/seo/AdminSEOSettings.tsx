import React, { useEffect, useMemo, useState } from "react";
import { Search, Save, Globe2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    KNOWN_SEO_ROUTES,
    useSEOMetaList,
    useUpdateSEOMeta,
    type SEOMeta,
} from "@/lib/seoAPI";

const empty = (path: string): SEOMeta => ({
    path,
    title: "",
    description: "",
    keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
    canonical: "",
    robots: "index, follow",
    schema_jsonld: "",
});

const AdminSEOSettings = () => {
    const { data: byPath = {}, isLoading } = useSEOMetaList();
    const updateMeta = useUpdateSEOMeta();
    const [activePath, setActivePath] = useState<string>("/");
    const [form, setForm] = useState<SEOMeta>(empty("/"));

    const allRoutes = useMemo(() => {
        const known = new Set(KNOWN_SEO_ROUTES.map((r) => r.path));
        const stored = Object.keys(byPath).filter((p) => !known.has(p));
        return [
            ...KNOWN_SEO_ROUTES,
            ...stored.map((p) => ({ path: p, label: p, description: "Özel rota" })),
        ];
    }, [byPath]);

    useEffect(() => {
        const existing = byPath[activePath];
        setForm(existing ? { ...empty(activePath), ...existing, path: activePath } : empty(activePath));
    }, [activePath, byPath]);

    const handleSave = async () => {
        await updateMeta.mutateAsync({
            ...form,
            path: activePath,
        });
    };

    const handleField = (key: keyof SEOMeta, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const titleLength = form.title.length;
    const descLength = form.description.length;

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">SEO Ayarları</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Her sayfa için meta etiketleri, Open Graph görselleri ve yapılandırılmış veri.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={updateMeta.isPending} className="gap-2">
                    {updateMeta.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Kaydet
                </Button>
            </header>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* Route picker */}
                <Card className="bg-card">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest">Sayfa</CardTitle>
                        <CardDescription className="text-xs">Düzenlemek istediğiniz rotayı seçin.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1 p-2">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))
                        ) : (
                            allRoutes.map((r) => {
                                const overridden = !!byPath[r.path];
                                return (
                                    <button
                                        key={r.path}
                                        type="button"
                                        onClick={() => setActivePath(r.path)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                            activePath === r.path
                                                ? "bg-primary/10 text-primary border border-primary/20"
                                                : "hover:bg-secondary border border-transparent"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-bold truncate">{r.label}</span>
                                            {overridden && (
                                                <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400">
                                                    Özel
                                                </span>
                                            )}
                                        </div>
                                        <code className="text-[10px] text-muted-foreground">{r.path}</code>
                                    </button>
                                );
                            })
                        )}
                    </CardContent>
                </Card>

                {/* Editor */}
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe2 className="h-4 w-4" />
                            <code className="text-sm">{activePath}</code>
                        </CardTitle>
                        <CardDescription>
                            Boş bırakılan alanlar için sayfanın varsayılan değeri kullanılır.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="title">Başlık (title)</Label>
                                <span
                                    className={`text-[10px] font-bold ${
                                        titleLength > 60 ? "text-amber-500" : "text-muted-foreground"
                                    }`}
                                >
                                    {titleLength} / 60 önerilen
                                </span>
                            </div>
                            <Input
                                id="title"
                                value={form.title}
                                onChange={(e) => handleField("title", e.target.value)}
                                placeholder="ARASOUNDS — Premium Müzik Aletleri"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="description">Meta açıklama</Label>
                                <span
                                    className={`text-[10px] font-bold ${
                                        descLength > 160 ? "text-amber-500" : "text-muted-foreground"
                                    }`}
                                >
                                    {descLength} / 160 önerilen
                                </span>
                            </div>
                            <Textarea
                                id="description"
                                rows={3}
                                value={form.description}
                                onChange={(e) => handleField("description", e.target.value)}
                                placeholder="Türkiye'nin en geniş enstrüman seçkisi..."
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="keywords">Anahtar kelimeler</Label>
                                <Input
                                    id="keywords"
                                    value={form.keywords ?? ""}
                                    onChange={(e) => handleField("keywords", e.target.value)}
                                    placeholder="gitar, piyano, davul"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="canonical">Canonical URL</Label>
                                <Input
                                    id="canonical"
                                    value={form.canonical ?? ""}
                                    onChange={(e) => handleField("canonical", e.target.value)}
                                    placeholder="https://arasounds.com/shop"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="robots">Robots</Label>
                            <Input
                                id="robots"
                                value={form.robots ?? ""}
                                onChange={(e) => handleField("robots", e.target.value)}
                                placeholder="index, follow"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Örnekler: <code>index, follow</code> · <code>noindex, nofollow</code>
                            </p>
                        </div>

                        <div className="border-t border-border/50 pt-6 space-y-6">
                            <h3 className="font-bold text-sm uppercase tracking-widest">Open Graph (Sosyal medya)</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="og_title">OG Başlık</Label>
                                    <Input
                                        id="og_title"
                                        value={form.og_title ?? ""}
                                        onChange={(e) => handleField("og_title", e.target.value)}
                                        placeholder="(boşsa başlık kullanılır)"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="og_image">OG Görsel URL</Label>
                                    <Input
                                        id="og_image"
                                        value={form.og_image ?? ""}
                                        onChange={(e) => handleField("og_image", e.target.value)}
                                        placeholder="https://.../og.jpg (1200×630)"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="og_description">OG Açıklama</Label>
                                <Textarea
                                    id="og_description"
                                    rows={2}
                                    value={form.og_description ?? ""}
                                    onChange={(e) => handleField("og_description", e.target.value)}
                                    placeholder="(boşsa meta açıklama kullanılır)"
                                />
                            </div>
                        </div>

                        <div className="border-t border-border/50 pt-6 space-y-2">
                            <h3 className="font-bold text-sm uppercase tracking-widest">JSON-LD Yapılandırılmış Veri</h3>
                            <Textarea
                                rows={6}
                                value={form.schema_jsonld ?? ""}
                                onChange={(e) => handleField("schema_jsonld", e.target.value)}
                                className="font-mono text-xs"
                                placeholder='{"@context":"https://schema.org","@type":"Organization",...}'
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Geçerli JSON-LD eklerseniz <code>{`<script type="application/ld+json">`}</code> olarak
                                sayfaya enjekte edilir.
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/50 pt-6">
                            <Button variant="outline" onClick={() => setForm(empty(activePath))}>
                                Sıfırla
                            </Button>
                            <Button onClick={handleSave} disabled={updateMeta.isPending} className="gap-2">
                                {updateMeta.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Kaydet
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminSEOSettings;
