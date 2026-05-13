import type { APIRequestContext, Locator, Page } from "@playwright/test";

import { expect, request, test } from "@playwright/test";

/**
 * 月次サマリーAPIのresponse body。
 */
type MonthlySummaryResponse = {
  /** 月次サマリー */
  readonly monthlySummary: MonthlySummary;
};

/**
 * 月次サマリー。
 */
type MonthlySummary = {
  /** 対象月 */
  readonly month: string;
  /** 全収入 */
  readonly totalIncome: number;
  /** 使える収入 */
  readonly availableIncome: number;
  /** 貯める収入 */
  readonly reservedIncome: number;
  /** 固定費合計 */
  readonly fixedCostTotal: number;
  /** 出費合計 */
  readonly expenseTotal: number;
  /** 生活費残り */
  readonly remainingAmount: number;
  /** 実収支 */
  readonly actualBalance: number;
};

/**
 * 年間サマリーAPIのresponse body。
 */
type AnnualSummaryResponse = {
  /** 年間サマリー */
  readonly annualSummary: AnnualSummary;
};

/**
 * 年間サマリー。
 */
type AnnualSummary = {
  /** 対象年 */
  readonly year: number;
  /** 年間全収入 */
  readonly totalIncome: number;
  /** 年間使える収入 */
  readonly availableIncome: number;
  /** 年間貯める収入 */
  readonly reservedIncome: number;
  /** 年間固定費 */
  readonly fixedCostTotal: number;
  /** 年間出費 */
  readonly expenseTotal: number;
  /** 年間実収支 */
  readonly actualBalance: number;
  /** 年間生活費残り */
  readonly availableBalance: number;
  /** 月別サマリー一覧 */
  readonly months: readonly AnnualMonthSummary[];
};

/**
 * 年間サマリーに含まれる月別サマリー。
 */
type AnnualMonthSummary = {
  /** 対象月 */
  readonly month: string;
  /** 月間全収入 */
  readonly totalIncome: number;
  /** 月間使える収入 */
  readonly availableIncome: number;
  /** 月間貯める収入 */
  readonly reservedIncome: number;
  /** 月間固定費 */
  readonly fixedCostTotal: number;
  /** 月間出費 */
  readonly expenseTotal: number;
  /** 月間実収支 */
  readonly actualBalance: number;
  /** 月間生活費残り */
  readonly availableBalance: number;
};

/**
 * 出費カレンダーAPIのresponse body。
 */
type ExpenseCalendarResponse = {
  /** 出費カレンダー */
  readonly expenseCalendar: ExpenseCalendar;
};

/**
 * 出費カレンダー。
 */
type ExpenseCalendar = {
  /** 対象月 */
  readonly month: string;
  /** 使える収入 */
  readonly availableIncome: number;
  /** 固定費合計 */
  readonly fixedCostTotal: number;
  /** 出費合計 */
  readonly expenseTotal: number;
  /** 生活費残り */
  readonly remainingAmount: number;
  /** 日別カレンダー */
  readonly days: readonly ExpenseCalendarDay[];
  /** 選択日の出費一覧 */
  readonly selectedDateExpenses: readonly Expense[];
};

/**
 * 出費カレンダーの日別情報。
 */
type ExpenseCalendarDay = {
  /** 対象日 */
  readonly date: string;
  /** 対象日の出費合計 */
  readonly expenseTotal: number;
  /** 対象日終了時点の生活費残り */
  readonly remainingAmount: number;
};

/**
 * 出費。
 */
type Expense = {
  /** 出費ID */
  readonly id: string;
  /** 出費金額 */
  readonly amount: number;
  /** 出費日時 */
  readonly spentAt: string;
};

/**
 * 出費一覧APIのresponse body。
 */
type ExpenseListResponse = {
  /** 出費一覧 */
  readonly items: readonly Expense[];
};

/**
 * 収入登録・更新APIのresponse body。
 */
type IncomeResponse = {
  /** 登録または更新された収入 */
  readonly income: {
    /** 収入ID */
    readonly id: string;
    /** 収入金額 */
    readonly amount: number;
    /** 入金日 */
    readonly incomeDate: string;
    /** 収入名 */
    readonly memo: string | null;
    /** 予算計算に含めるか */
    readonly includedInBalance: boolean;
  };
};

/**
 * 収入一覧APIのresponse body。
 */
type IncomeListResponse = {
  /** 収入一覧 */
  readonly items: ReadonlyArray<IncomeResponse["income"]>;
};

/**
 * 固定費登録・更新APIのresponse body。
 */
type FixedCostResponse = {
  /** 登録または更新された固定費 */
  readonly fixedCost: {
    /** 固定費ID */
    readonly id: string;
    /** 固定費名 */
    readonly name: string;
    /** 固定費金額 */
    readonly amount: number;
    /** 開始月 */
    readonly startMonth: string;
    /** 有効か */
    readonly isActive: boolean;
  };
};

/**
 * 固定費一覧APIのresponse body。
 */
type FixedCostListResponse = {
  /** 固定費一覧 */
  readonly items: ReadonlyArray<FixedCostResponse["fixedCost"]>;
};

/**
 * API requestに指定するquery parameter。
 */
type QueryParams = Readonly<Record<string, number | string>>;

/**
 * API request option。
 */
type ApiRequestOptions = {
  /** HTTP method */
  readonly method?: "DELETE" | "GET" | "POST" | "PUT";
  /** request body */
  readonly body?: unknown;
  /** query parameter */
  readonly params?: QueryParams;
};

/**
 * QA中に作成したresource ID。
 */
type CreatedIds = {
  /** 収入ID */
  incomeId: string | undefined;
  /** 固定費ID */
  fixedCostId: string | undefined;
  /** 出費ID */
  expenseId: string | undefined;
};

/**
 * @description Asia/Tokyo基準のYYYY-MM-DD文字列を返す。
 * @param date - 変換元の日付。
 * @returns Asia/Tokyo基準の日付文字列。
 * @example
 * formatTokyoDate(new Date());
 */
function formatTokyoDate(date: Date): string {
  /** Asia/Tokyo基準の日付構成要素。 */
  const parts = new Intl.DateTimeFormat("ja-JP", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tokyo",
    year: "numeric",
  }).formatToParts(date);

  /** 日付構成要素を名前で参照するためのmap。 */
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values["year"] ?? ""}-${values["month"] ?? ""}-${values["day"] ?? ""}`;
}

/** API E2Eの接続先URL。 */
const apiBaseURL = process.env["E2E_API_BASE_URL"] ?? "http://localhost:8080";

/** E2Eで使うAsia/Tokyo基準の日付。 */
const qaDate = process.env["E2E_QA_DATE"] ?? formatTokyoDate(new Date());

/** E2Eで使う対象月。 */
const qaMonth = qaDate.slice(0, 7);

/** E2Eで使う対象年。 */
const qaYear = Number(qaDate.slice(0, 4));

/** E2Eデータ名を一意にするためのsuffix。 */
const qaSuffix = String(Date.now());

/** E2Eで登録する収入名。 */
const incomeName = `E2E収入-${qaSuffix}`;

/** E2Eで更新する収入名。 */
const updatedIncomeName = `E2E収入更新-${qaSuffix}`;

/** E2Eで登録する固定費名。 */
const fixedCostName = `E2E固定費-${qaSuffix}`;

/** E2Eで更新する固定費名。 */
const updatedFixedCostName = `E2E固定費更新-${qaSuffix}`;

/** E2Eで削除操作を確認する固定費名。 */
const deletableFixedCostName = `E2E固定費削除-${qaSuffix}`;

/** E2Eで登録する出費金額。 */
const expenseAmount = 789;

/** E2Eで登録する収入金額。 */
const incomeAmount = 12_345;

/** E2Eで更新する収入金額。 */
const updatedIncomeAmount = 22_222;

/** E2Eで登録する固定費金額。 */
const fixedCostAmount = 3_333;

/** E2Eで更新する固定費金額。 */
const updatedFixedCostAmount = 4_444;

/** E2E中に作成したresource ID。 */
const createdIds: CreatedIds = {
  expenseId: undefined,
  fixedCostId: undefined,
  incomeId: undefined,
};

/**
 * @description 数値を画面と同じ日本円表記へ変換する。
 * @param amount - 金額。
 * @returns 日本円表記。
 * @example
 * formatYen(1200);
 */
function formatYen(amount: number): string {
  /** 日本円表示に使うformatter。 */
  const formatter = new Intl.NumberFormat("ja-JP", {
    currency: "JPY",
    maximumFractionDigits: 0,
    style: "currency",
  });

  return formatter.format(amount);
}

/**
 * @description API request URLを組み立てる。
 * @param pathname - API path。
 * @param params - query parameter。
 * @returns API request URL。
 * @example
 * buildApiUrl("/api/monthly-summary", { month: "2026-05" });
 */
function buildApiUrl(pathname: string, params: QueryParams = {}): string {
  /** API request URL。 */
  const url = new URL(pathname, apiBaseURL);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  return url.pathname + url.search;
}

/**
 * @description APIからJSON responseを取得する。
 * @param apiContext - Playwright API request context。
 * @param pathname - API path。
 * @param options - API request option。
 * @returns JSONとしてparse済みのresponse body。
 * @example
 * await requestApiJson<MonthlySummaryResponse>(apiContext, "/api/monthly-summary", { params: { month: "2026-05" } });
 */
async function requestApiJson<T>(
  apiContext: APIRequestContext,
  pathname: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  /** HTTP method。 */
  const method = options.method ?? "GET";
  /** API request URL。 */
  const url = buildApiUrl(pathname, options.params);
  /** API response。 */
  const response = await apiContext.fetch(url, {
    data: options.body,
    method,
  });

  await expect(response, `${method} ${url}`).toBeOK();

  return (await response.json()) as T;
}

/**
 * @description 月次サマリーを取得する。
 * @param apiContext - Playwright API request context。
 * @returns 月次サマリー。
 * @example
 * await fetchMonthlySummary(apiContext);
 */
async function fetchMonthlySummary(
  apiContext: APIRequestContext,
): Promise<MonthlySummary> {
  /** 月次サマリーAPI response。 */
  const response = await requestApiJson<MonthlySummaryResponse>(
    apiContext,
    "/api/monthly-summary",
    { params: { month: qaMonth } },
  );

  return response.monthlySummary;
}

/**
 * @description 年間サマリーを取得する。
 * @param apiContext - Playwright API request context。
 * @returns 年間サマリー。
 * @example
 * await fetchAnnualSummary(apiContext);
 */
async function fetchAnnualSummary(
  apiContext: APIRequestContext,
): Promise<AnnualSummary> {
  /** 年間サマリーAPI response。 */
  const response = await requestApiJson<AnnualSummaryResponse>(
    apiContext,
    "/api/annual-summary",
    { params: { year: qaYear } },
  );

  return response.annualSummary;
}

/**
 * @description 出費カレンダーを取得する。
 * @param apiContext - Playwright API request context。
 * @returns 出費カレンダー。
 * @example
 * await fetchExpenseCalendar(apiContext);
 */
async function fetchExpenseCalendar(
  apiContext: APIRequestContext,
): Promise<ExpenseCalendar> {
  /** 出費カレンダーAPI response。 */
  const response = await requestApiJson<ExpenseCalendarResponse>(
    apiContext,
    "/api/expense-calendar",
    { params: { date: qaDate, month: qaMonth } },
  );

  return response.expenseCalendar;
}

/**
 * @description 対象日の出費一覧を取得する。
 * @param apiContext - Playwright API request context。
 * @returns 対象日の出費一覧。
 * @example
 * await fetchDailyExpenses(apiContext);
 */
async function fetchDailyExpenses(
  apiContext: APIRequestContext,
): Promise<readonly Expense[]> {
  /** 出費一覧API response。 */
  const response = await requestApiJson<ExpenseListResponse>(
    apiContext,
    "/api/expenses",
    { params: { date: qaDate } },
  );

  return response.items;
}

/**
 * @description 対象月の収入一覧から指定名の収入IDを取得する。
 * @param apiContext - Playwright API request context。
 * @param memo - 収入名。
 * @returns 収入ID。
 * @example
 * await findIncomeIdByMemo(apiContext, "給与");
 */
async function findIncomeIdByMemo(
  apiContext: APIRequestContext,
  memo: string,
): Promise<string> {
  /** 収入一覧API response。 */
  const response = await requestApiJson<IncomeListResponse>(
    apiContext,
    "/api/incomes",
    {
      params: { month: qaMonth },
    },
  );
  /** 指定名に一致する収入。 */
  const income = response.items.find((item) => item.memo === memo);

  expect(income).toBeDefined();

  return income?.id ?? "";
}

/**
 * @description 対象月の固定費一覧から指定名の固定費IDを取得する。
 * @param apiContext - Playwright API request context。
 * @param name - 固定費名。
 * @returns 固定費ID。
 * @example
 * await findFixedCostIdByName(apiContext, "家賃");
 */
async function findFixedCostIdByName(
  apiContext: APIRequestContext,
  name: string,
): Promise<string> {
  /** 固定費一覧API response。 */
  const response = await requestApiJson<FixedCostListResponse>(
    apiContext,
    "/api/fixed-costs",
    { params: { month: qaMonth } },
  );
  /** 指定名に一致する固定費。 */
  const fixedCost = response.items.find((item) => item.name === name);

  expect(fixedCost).toBeDefined();

  return fixedCost?.id ?? "";
}

/**
 * @description 対象月から年内の有効月数を返す。
 * @returns 対象月から12月までの月数。
 * @example
 * getRemainingMonthCountInYear();
 */
function getRemainingMonthCountInYear(): number {
  /** 対象月の月番号。 */
  const monthNumber = Number(qaMonth.slice(5, 7));

  return 12 - monthNumber + 1;
}

/**
 * @description 年間サマリーから対象月の月別サマリーを取得する。
 * @param summary - 年間サマリー。
 * @returns 対象月の月別サマリー。
 * @example
 * findAnnualTargetMonth(summary);
 */
function findAnnualTargetMonth(summary: AnnualSummary): AnnualMonthSummary {
  /** 対象月の月別サマリー。 */
  const targetMonth = summary.months.find((month) => month.month === qaMonth);

  if (targetMonth === undefined) {
    throw new Error(`annual summary does not include ${qaMonth}`);
  }

  return targetMonth;
}

/**
 * @description カレンダーから対象日の情報を取得する。
 * @param calendar - 出費カレンダー。
 * @returns 対象日のカレンダー情報。
 * @example
 * findCalendarTargetDay(calendar);
 */
function findCalendarTargetDay(calendar: ExpenseCalendar): ExpenseCalendarDay {
  /** 対象日のカレンダー情報。 */
  const targetDay = calendar.days.find((day) => day.date === qaDate);

  if (targetDay === undefined) {
    throw new Error(`expense calendar does not include ${qaDate}`);
  }

  return targetDay;
}

/**
 * @description 画面が読み込み中やエラー状態で止まっていないことを確認する。
 * @param page - Playwright page。
 * @returns なし。
 * @example
 * await expectPageReady(page);
 */
async function expectPageReady(page: Page): Promise<void> {
  await expect(page.getByText(/読み込んでいます|読み込み中です/)).toHaveCount(0);
  await expect(
    page.getByText(
      /取得できませんでした|登録できませんでした|更新できませんでした|削除できませんでした/,
    ),
  ).toHaveCount(0);
}

/**
 * @description 指定pathを開いて画面が利用可能になるまで待つ。
 * @param page - Playwright page。
 * @param path - 遷移先path。
 * @returns なし。
 * @example
 * await openPage(page, "/incomes");
 */
async function openPage(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page).toHaveURL(new RegExp(`${path === "/" ? "/" : path}$`));
  await expectPageReady(page);
}

/**
 * @description 収入一覧から指定名の行を取得する。
 * @param page - Playwright page。
 * @param name - 収入名。
 * @returns 収入一覧行。
 * @example
 * incomeRow(page, "給与");
 */
function incomeRow(page: Page, name: string): Locator {
  return page.getByTestId("income-list-item").filter({ hasText: name }).first();
}

/**
 * @description 固定費一覧から指定名の行を取得する。
 * @param page - Playwright page。
 * @param name - 固定費名。
 * @returns 固定費一覧行。
 * @example
 * fixedCostRow(page, "家賃");
 */
function fixedCostRow(page: Page, name: string): Locator {
  return page.getByTestId("fixed-cost-list-item").filter({ hasText: name }).first();
}

/**
 * @description 収入フォームを入力して送信する。
 * @param page - Playwright page。
 * @param name - 収入名。
 * @param amount - 収入金額。
 * @returns なし。
 * @example
 * await submitIncomeForm(page, "給与", 250000);
 */
async function submitIncomeForm(
  page: Page,
  name: string,
  amount: number,
): Promise<void> {
  await page.getByLabel("収入名").fill(name);
  await page.getByLabel("金額").fill(String(amount));
  await page.getByLabel("入金日").fill(qaDate);
  await page.getByRole("button", { name: /登録する|更新する/ }).click();
}

/**
 * @description 固定費フォームを入力して送信する。
 * @param page - Playwright page。
 * @param name - 固定費名。
 * @param amount - 固定費金額。
 * @returns なし。
 * @example
 * await submitFixedCostForm(page, "家賃", 80000);
 */
async function submitFixedCostForm(
  page: Page,
  name: string,
  amount: number,
): Promise<void> {
  await page.getByLabel("固定費名").fill(name);
  await page.getByLabel("金額").fill(String(amount));
  await page.getByLabel("開始月").fill(qaMonth);
  await page.getByRole("button", { name: /登録する|更新する/ }).click();
}

/**
 * @description QA用データを削除する。
 * @param apiContext - Playwright API request context。
 * @returns なし。
 * @example
 * await cleanupQaData(apiContext);
 */
async function cleanupQaData(apiContext: APIRequestContext): Promise<void> {
  if (createdIds.expenseId !== undefined) {
    await requestApiJson(apiContext, `/api/expenses/${createdIds.expenseId}`, {
      method: "DELETE",
    });
    createdIds.expenseId = undefined;
  }

  if (createdIds.fixedCostId !== undefined) {
    await requestApiJson(apiContext, `/api/fixed-costs/${createdIds.fixedCostId}`, {
      method: "DELETE",
    });
    createdIds.fixedCostId = undefined;
  }

  if (createdIds.incomeId !== undefined) {
    await requestApiJson(apiContext, `/api/incomes/${createdIds.incomeId}`, {
      method: "DELETE",
    });
    createdIds.incomeId = undefined;
  }
}

/**
 * @description 失敗した過去E2EのQA用データを削除する。
 * @param apiContext - Playwright API request context。
 * @returns なし。
 * @example
 * await cleanupStaleQaData(apiContext);
 */
async function cleanupStaleQaData(apiContext: APIRequestContext): Promise<void> {
  /** 対象月の収入一覧API response。 */
  const incomes = await requestApiJson<IncomeListResponse>(apiContext, "/api/incomes", {
    params: { month: qaMonth },
  });
  /** 対象月の固定費一覧API response。 */
  const fixedCosts = await requestApiJson<FixedCostListResponse>(
    apiContext,
    "/api/fixed-costs",
    { params: { month: qaMonth } },
  );
  /** 対象日の出費一覧。 */
  const expenses = await fetchDailyExpenses(apiContext);

  for (const income of incomes.items) {
    if (income.memo?.startsWith("E2E収入") === true) {
      await requestApiJson(apiContext, `/api/incomes/${income.id}`, {
        method: "DELETE",
      });
    }
  }

  for (const fixedCost of fixedCosts.items) {
    if (fixedCost.name.startsWith("E2E固定費")) {
      await requestApiJson(apiContext, `/api/fixed-costs/${fixedCost.id}`, {
        method: "DELETE",
      });
    }
  }

  for (const expense of expenses) {
    if (expense.amount === expenseAmount) {
      await requestApiJson(apiContext, `/api/expenses/${expense.id}`, {
        method: "DELETE",
      });
    }
  }
}

test.describe.configure({ mode: "serial" });

test.describe("MVP主要画面の実データE2E", () => {
  /** E2E用API request context。 */
  let apiContext: APIRequestContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext({ baseURL: apiBaseURL });
    await requestApiJson(apiContext, "/health");
    await cleanupStaleQaData(apiContext);
  });

  test.afterAll(async () => {
    await cleanupQaData(apiContext);
    await cleanupStaleQaData(apiContext);
    await apiContext.dispose();
  });

  test("主要画面の操作と横断集計反映を確認できる", async ({ page }) => {
    /** E2E開始前の月次サマリー。 */
    const baselineMonthly = await fetchMonthlySummary(apiContext);
    /** E2E開始前の年間サマリー。 */
    const baselineAnnual = await fetchAnnualSummary(apiContext);
    /** E2E開始前の出費カレンダー。 */
    const baselineCalendar = await fetchExpenseCalendar(apiContext);
    /** E2E開始前の対象日カレンダー。 */
    const baselineCalendarDay = findCalendarTargetDay(baselineCalendar);
    /** 年内で固定費が有効になる月数。 */
    const activeMonthCount = getRemainingMonthCountInYear();

    await openPage(page, "/");
    await expect(
      page.getByText(formatYen(baselineMonthly.remainingAmount)).first(),
    ).toBeVisible();

    await page.getByPlaceholder("金額を入力").fill(String(expenseAmount));
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: formatYen(expenseAmount) }),
    ).toBeVisible();

    /** 出費登録後の月次サマリー。 */
    const afterExpenseMonthly = await fetchMonthlySummary(apiContext);
    /** 出費登録後の年間サマリー。 */
    const afterExpenseAnnual = await fetchAnnualSummary(apiContext);
    /** 出費登録後の出費カレンダー。 */
    const afterExpenseCalendar = await fetchExpenseCalendar(apiContext);
    /** 出費登録後の対象日カレンダー。 */
    const afterExpenseCalendarDay = findCalendarTargetDay(afterExpenseCalendar);
    /** 出費登録後の選択日出費。 */
    const createdExpense = afterExpenseCalendar.selectedDateExpenses.find(
      (expense) => expense.amount === expenseAmount,
    );

    expect(createdExpense).toBeDefined();
    createdIds.expenseId = createdExpense?.id;
    expect(afterExpenseMonthly.expenseTotal).toBe(
      baselineMonthly.expenseTotal + expenseAmount,
    );
    expect(afterExpenseAnnual.expenseTotal).toBe(
      baselineAnnual.expenseTotal + expenseAmount,
    );
    expect(afterExpenseCalendar.expenseTotal).toBe(
      baselineCalendar.expenseTotal + expenseAmount,
    );
    expect(afterExpenseCalendarDay.expenseTotal).toBe(
      baselineCalendarDay.expenseTotal + expenseAmount,
    );

    await openPage(page, "/calendar");
    await expect(
      page.getByText(formatYen(afterExpenseCalendar.expenseTotal)).first(),
    ).toBeVisible();
    await expect(page.getByText("合計")).toBeVisible();

    await openPage(page, "/annual-summary");
    await expect(
      page.getByText(formatYen(afterExpenseAnnual.expenseTotal)).first(),
    ).toBeVisible();

    await openPage(page, "/incomes");
    await submitIncomeForm(page, incomeName, incomeAmount);
    await expect(incomeRow(page, incomeName)).toContainText(formatYen(incomeAmount));
    createdIds.incomeId = await findIncomeIdByMemo(apiContext, incomeName);

    /** 収入登録後の月次サマリー。 */
    const afterIncomeCreateMonthly = await fetchMonthlySummary(apiContext);
    /** 収入登録後の年間サマリー。 */
    const afterIncomeCreateAnnual = await fetchAnnualSummary(apiContext);
    /** 収入登録後の対象月年間サマリー。 */
    const afterIncomeCreateAnnualMonth = findAnnualTargetMonth(afterIncomeCreateAnnual);
    /** 収入登録後の収入行。 */
    const createdIncomeRow = incomeRow(page, incomeName);

    expect(afterIncomeCreateMonthly.availableIncome).toBe(
      afterExpenseMonthly.availableIncome + incomeAmount,
    );
    expect(afterIncomeCreateAnnual.availableIncome).toBe(
      afterExpenseAnnual.availableIncome + incomeAmount,
    );
    expect(afterIncomeCreateAnnualMonth.availableIncome).toBe(
      findAnnualTargetMonth(afterExpenseAnnual).availableIncome + incomeAmount,
    );

    await createdIncomeRow
      .getByRole("button", { name: `収入を編集 ${incomeName}` })
      .click();
    await submitIncomeForm(page, updatedIncomeName, updatedIncomeAmount);
    await expect(incomeRow(page, updatedIncomeName)).toContainText(
      formatYen(updatedIncomeAmount),
    );

    /** 収入更新後の月次サマリー。 */
    const afterIncomeUpdateMonthly = await fetchMonthlySummary(apiContext);
    /** 収入更新後の年間サマリー。 */
    const afterIncomeUpdateAnnual = await fetchAnnualSummary(apiContext);

    expect(afterIncomeUpdateMonthly.availableIncome).toBe(
      afterExpenseMonthly.availableIncome + updatedIncomeAmount,
    );
    expect(afterIncomeUpdateAnnual.availableIncome).toBe(
      afterExpenseAnnual.availableIncome + updatedIncomeAmount,
    );

    /** 収入予算対象checkbox。 */
    const incomeBudgetCheckbox = incomeRow(page, updatedIncomeName).getByRole(
      "checkbox",
      { name: `予算対象を切り替え ${updatedIncomeName}` },
    );

    await incomeBudgetCheckbox.click();
    await expect(incomeBudgetCheckbox).not.toBeChecked();
    await expect(incomeRow(page, updatedIncomeName)).not.toContainText("予算に含む");

    /** 収入予算対象外切り替え後の月次サマリー。 */
    const afterIncomeToggleMonthly = await fetchMonthlySummary(apiContext);
    /** 収入予算対象外切り替え後の年間サマリー。 */
    const afterIncomeToggleAnnual = await fetchAnnualSummary(apiContext);

    expect(afterIncomeToggleMonthly.availableIncome).toBe(
      afterExpenseMonthly.availableIncome,
    );
    expect(afterIncomeToggleMonthly.reservedIncome).toBe(
      afterExpenseMonthly.reservedIncome + updatedIncomeAmount,
    );
    expect(afterIncomeToggleAnnual.availableIncome).toBe(
      afterExpenseAnnual.availableIncome,
    );

    await openPage(page, "/");
    await expect(
      page.getByText(formatYen(afterIncomeToggleMonthly.availableIncome)).first(),
    ).toBeVisible();
    await openPage(page, "/annual-summary");
    await expect(
      page.getByText(formatYen(afterIncomeToggleAnnual.availableIncome)).first(),
    ).toBeVisible();

    await openPage(page, "/incomes");
    await incomeRow(page, updatedIncomeName)
      .getByRole("button", { name: `収入を削除 ${updatedIncomeName}` })
      .click();
    await expect(incomeRow(page, updatedIncomeName)).toHaveCount(0);
    createdIds.incomeId = undefined;

    await openPage(page, "/fixed-costs");
    await submitFixedCostForm(page, fixedCostName, fixedCostAmount);
    await expect(fixedCostRow(page, fixedCostName)).toContainText(
      formatYen(fixedCostAmount),
    );
    createdIds.fixedCostId = await findFixedCostIdByName(apiContext, fixedCostName);

    /** 固定費登録後の月次サマリー。 */
    const afterFixedCostCreateMonthly = await fetchMonthlySummary(apiContext);
    /** 固定費登録後の年間サマリー。 */
    const afterFixedCostCreateAnnual = await fetchAnnualSummary(apiContext);
    /** 固定費登録後の出費カレンダー。 */
    const afterFixedCostCreateCalendar = await fetchExpenseCalendar(apiContext);

    expect(afterFixedCostCreateMonthly.fixedCostTotal).toBe(
      afterExpenseMonthly.fixedCostTotal + fixedCostAmount,
    );
    expect(afterFixedCostCreateAnnual.fixedCostTotal).toBe(
      afterExpenseAnnual.fixedCostTotal + fixedCostAmount * activeMonthCount,
    );
    expect(afterFixedCostCreateCalendar.fixedCostTotal).toBe(
      afterExpenseCalendar.fixedCostTotal + fixedCostAmount,
    );

    await fixedCostRow(page, fixedCostName)
      .getByRole("button", { name: `固定費を編集 ${fixedCostName}` })
      .click();
    await submitFixedCostForm(page, updatedFixedCostName, updatedFixedCostAmount);
    await expect(fixedCostRow(page, updatedFixedCostName)).toContainText(
      formatYen(updatedFixedCostAmount),
    );

    /** 固定費更新後の月次サマリー。 */
    const afterFixedCostUpdateMonthly = await fetchMonthlySummary(apiContext);
    /** 固定費更新後の年間サマリー。 */
    const afterFixedCostUpdateAnnual = await fetchAnnualSummary(apiContext);
    /** 固定費更新後の出費カレンダー。 */
    const afterFixedCostUpdateCalendar = await fetchExpenseCalendar(apiContext);

    expect(afterFixedCostUpdateMonthly.fixedCostTotal).toBe(
      afterExpenseMonthly.fixedCostTotal + updatedFixedCostAmount,
    );
    expect(afterFixedCostUpdateAnnual.fixedCostTotal).toBe(
      afterExpenseAnnual.fixedCostTotal + updatedFixedCostAmount * activeMonthCount,
    );
    expect(afterFixedCostUpdateCalendar.fixedCostTotal).toBe(
      afterExpenseCalendar.fixedCostTotal + updatedFixedCostAmount,
    );

    await openPage(page, "/");
    await expect(
      page.getByText(formatYen(afterFixedCostUpdateMonthly.fixedCostTotal)).first(),
    ).toBeVisible();
    await openPage(page, "/calendar");
    await expect(
      page.getByText(formatYen(afterFixedCostUpdateCalendar.expenseTotal)).first(),
    ).toBeVisible();
    await openPage(page, "/annual-summary");
    await expect(
      page.getByText(formatYen(afterFixedCostUpdateAnnual.fixedCostTotal)).first(),
    ).toBeVisible();

    await openPage(page, "/fixed-costs");
    await fixedCostRow(page, updatedFixedCostName)
      .getByRole("button", { name: `固定費を削除 ${updatedFixedCostName}` })
      .click();
    await expect(fixedCostRow(page, updatedFixedCostName)).toHaveCount(0);
    createdIds.fixedCostId = undefined;

    await submitFixedCostForm(page, deletableFixedCostName, fixedCostAmount);
    await expect(fixedCostRow(page, deletableFixedCostName)).toContainText(
      formatYen(fixedCostAmount),
    );
    await fixedCostRow(page, deletableFixedCostName)
      .getByRole("button", { name: `固定費を削除 ${deletableFixedCostName}` })
      .click();
    await expect(fixedCostRow(page, deletableFixedCostName)).toHaveCount(0);

    if (createdIds.expenseId !== undefined) {
      await requestApiJson(apiContext, `/api/expenses/${createdIds.expenseId}`, {
        method: "DELETE",
      });
      createdIds.expenseId = undefined;
    }

    expect(await fetchMonthlySummary(apiContext)).toMatchObject({
      actualBalance: baselineMonthly.actualBalance,
      availableIncome: baselineMonthly.availableIncome,
      expenseTotal: baselineMonthly.expenseTotal,
      fixedCostTotal: baselineMonthly.fixedCostTotal,
      remainingAmount: baselineMonthly.remainingAmount,
      reservedIncome: baselineMonthly.reservedIncome,
      totalIncome: baselineMonthly.totalIncome,
    });
    expect(await fetchAnnualSummary(apiContext)).toMatchObject({
      actualBalance: baselineAnnual.actualBalance,
      availableBalance: baselineAnnual.availableBalance,
      availableIncome: baselineAnnual.availableIncome,
      expenseTotal: baselineAnnual.expenseTotal,
      fixedCostTotal: baselineAnnual.fixedCostTotal,
      reservedIncome: baselineAnnual.reservedIncome,
      totalIncome: baselineAnnual.totalIncome,
    });
  });
});
