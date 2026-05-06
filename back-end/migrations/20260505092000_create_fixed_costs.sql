-- 目的: 毎月の予算から自動控除する固定費を管理するfixed_costs tableを作成する。
CREATE TABLE fixed_costs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    amount integer NOT NULL,
    start_month date NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fixed_costs_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fixed_costs_name_check
    CHECK (length(trim(name)) > 0),
    CONSTRAINT fixed_costs_amount_check
    CHECK (amount > 0),
    CONSTRAINT fixed_costs_start_month_check
    CHECK (start_month = date_trunc('month', start_month)::date)
);

CREATE INDEX fixed_costs_user_id_start_month_idx
ON fixed_costs (user_id, start_month);

COMMENT ON TABLE fixed_costs IS '利用者ごとの毎月発生する固定費を管理するtable';

COMMENT ON COLUMN fixed_costs.id IS '固定費recordのUUID primary key';
COMMENT ON COLUMN fixed_costs.user_id IS '固定費を所有するusers.id';
COMMENT ON COLUMN fixed_costs.name IS '固定費名。空白のみは禁止する';
COMMENT ON COLUMN fixed_costs.amount IS '固定費金額。1円以上のみ許可する';
COMMENT ON COLUMN fixed_costs.start_month IS '固定費を予算計算へ含め始める月初日';
COMMENT ON COLUMN fixed_costs.is_active IS '固定費が現在有効かどうか';
COMMENT ON COLUMN fixed_costs.created_at IS '固定費recordの作成日時';
COMMENT ON COLUMN fixed_costs.updated_at IS '固定費recordの最終更新日時';

COMMENT ON INDEX fixed_costs_user_id_start_month_idx IS '利用者と開始月による有効固定費一覧・集計を高速化するindex';
