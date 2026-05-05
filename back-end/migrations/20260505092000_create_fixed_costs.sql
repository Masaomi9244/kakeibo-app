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
