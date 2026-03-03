-- 1. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 2. Track Order Status History
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS NULL OR OLD.status <> NEW.status) THEN
        INSERT INTO order_status_history (order_id, status)
        VALUES (NEW.id, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_order_status_change
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();

-- 3. Daily Analytics Snapshots (Simplified)
-- In a real scenario, this would be a cron job (pg_cron)
CREATE OR REPLACE FUNCTION create_daily_analytics_snapshot()
RETURNS void AS $$
DECLARE
    today DATE := CURRENT_DATE;
BEGIN
    INSERT INTO analytics_snapshots (snapshot_date, total_sold, revenue, units_sold)
    SELECT 
        today,
        COUNT(id) as total_sold,
        SUM(total_amount) as revenue,
        SUM((SELECT SUM(quantity) FROM order_items WHERE order_id = orders.id)) as units_sold
    FROM orders
    WHERE created_at::date = today
    ON CONFLICT (snapshot_date) DO UPDATE SET
        total_sold = EXCLUDED.total_sold,
        revenue = EXCLUDED.revenue,
        units_sold = EXCLUDED.units_sold;
END;
$$ language 'plpgsql';

-- 4. Inventory Change Tracking
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    old_quantity INTEGER,
    new_quantity INTEGER,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION log_inventory_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.stock_quantity <> NEW.stock_quantity) THEN
        INSERT INTO inventory_logs (product_id, old_quantity, new_quantity)
        VALUES (NEW.id, OLD.stock_quantity, NEW.stock_quantity);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_inventory_change
AFTER UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION log_inventory_change();
