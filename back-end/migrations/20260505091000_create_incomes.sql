-- 目的: 月次予算に含める収入と貯蓄用収入を管理するincomes tableを作成する。
CREATE TABLE incomes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    amount integer NOT NULL,
    income_date date NOT NULL,
    memo text,
    included_in_balance boolean NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT incomes_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT incomes_amount_check
    CHECK (amount > 0),
    CONSTRAINT incomes_memo_length_check
    CHECK (memo IS NULL OR length(memo) <= 255)
);

CREATE INDEX incomes_user_id_income_date_idx
ON incomes (user_id, income_date);

COMMENT ON TABLE incomes IS '利用者ごとの収入と月次予算への反映有無を管理するtable';

COMMENT ON COLUMN incomes.id IS '収入recordのUUID primary key';
COMMENT ON COLUMN incomes.user_id IS '収入を所有するusers.id';
COMMENT ON COLUMN incomes.amount IS '収入金額。1円以上のみ許可する';
COMMENT ON COLUMN incomes.income_date IS '収入が発生した日付';
COMMENT ON COLUMN incomes.memo IS '任意の収入メモ。255文字以内';
COMMENT ON COLUMN incomes.included_in_balance IS '月次予算の使える収入に含めるかどうか';
COMMENT ON COLUMN incomes.created_at IS '収入recordの作成日時';
COMMENT ON COLUMN incomes.updated_at IS '収入recordの最終更新日時';

COMMENT ON INDEX incomes_user_id_income_date_idx IS '利用者と収入日付による月次収入一覧・集計を高速化するindex';
