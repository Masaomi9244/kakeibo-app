-- 目的: ホーム画面の即時支出記録と日別・月別集計を管理するexpenses tableを作成する。
CREATE TABLE expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    amount integer NOT NULL,
    spent_at timestamptz NOT NULL,
    memo text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT expenses_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT expenses_amount_check
    CHECK (amount > 0),
    CONSTRAINT expenses_memo_length_check
    CHECK (memo IS NULL OR length(memo) <= 255)
);

CREATE INDEX expenses_user_id_spent_at_idx
ON expenses (user_id, spent_at);

COMMENT ON TABLE expenses IS '利用者ごとの日々の支出を管理するtable';

COMMENT ON COLUMN expenses.id IS '支出recordのUUID primary key';
COMMENT ON COLUMN expenses.user_id IS '支出を所有するusers.id';
COMMENT ON COLUMN expenses.amount IS '支出金額。1円以上のみ許可する';
COMMENT ON COLUMN expenses.spent_at IS '支出を記録した日時';
COMMENT ON COLUMN expenses.memo IS '任意の支出メモ。255文字以内';
COMMENT ON COLUMN expenses.created_at IS '支出recordの作成日時';
COMMENT ON COLUMN expenses.updated_at IS '支出recordの最終更新日時';

COMMENT ON INDEX expenses_user_id_spent_at_idx IS '利用者と支出日時による日別・月別支出一覧と集計を高速化するindex';
