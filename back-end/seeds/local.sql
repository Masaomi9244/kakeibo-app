-- 目的: ローカル開発でホーム・収入・固定費・カレンダー・年間サマリーを実データで確認できるseedを投入する。
INSERT INTO users (
    id,
    auth_provider_user_id,
    email
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'dev:00000000-0000-0000-0000-000000000001',
    'dev-00000000-0000-0000-0000-000000000001@example.local'
)
ON CONFLICT (id) DO UPDATE
SET
    auth_provider_user_id = excluded.auth_provider_user_id,
    email = excluded.email,
    updated_at = now();

INSERT INTO incomes (
    id,
    user_id,
    amount,
    income_date,
    memo,
    included_in_balance
)
VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        280000,
        '2026-05-24',
        '給与',
        true
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000001',
        35000,
        '2026-05-14',
        '副業収入',
        true
    )
ON CONFLICT (id) DO UPDATE
SET
    amount = excluded.amount,
    income_date = excluded.income_date,
    memo = excluded.memo,
    included_in_balance = excluded.included_in_balance,
    updated_at = now();

INSERT INTO fixed_costs (
    id,
    user_id,
    name,
    amount,
    start_month,
    is_active
)
VALUES
    (
        '20000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        '家賃',
        80000,
        '2026-05-01',
        true
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000001',
        '光熱費',
        12000,
        '2026-05-01',
        true
    ),
    (
        '20000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000001',
        'スマホ代',
        3200,
        '2026-05-01',
        true
    )
ON CONFLICT (id) DO UPDATE
SET
    name = excluded.name,
    amount = excluded.amount,
    start_month = excluded.start_month,
    is_active = excluded.is_active,
    updated_at = now();

INSERT INTO expenses (
    id,
    user_id,
    amount,
    spent_at,
    memo
)
VALUES
    (
        '30000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000001',
        160,
        now() - interval '15 minutes',
        '今日の支出'
    ),
    (
        '30000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000001',
        1200,
        now() - interval '2 hours',
        '今日の支出'
    ),
    (
        '30000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000001',
        780,
        now() - interval '5 hours',
        '今日の支出'
    )
ON CONFLICT (id) DO UPDATE
SET
    amount = excluded.amount,
    spent_at = excluded.spent_at,
    memo = excluded.memo,
    updated_at = now();

