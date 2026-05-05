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
