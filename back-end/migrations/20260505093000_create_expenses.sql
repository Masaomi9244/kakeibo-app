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
