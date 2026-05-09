import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Helmet>
        <title>{t("not_found.title")}</title>
      </Helmet>
      <div className="text-center max-w-md">
        <h1 className="font-display text-7xl font-black text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-bold uppercase tracking-tight">
          {t("not_found.heading")}
        </h2>
        <p className="mt-3 text-muted-foreground">{t("not_found.subtitle")}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">{t("not_found.go_home")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/shop">{t("not_found.go_shop")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
