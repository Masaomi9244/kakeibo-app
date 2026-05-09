#!/usr/bin/env node

/** APIの接続先URL。 */
const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:8080";

/** Frontendの接続先URL。 */
const frontendBaseUrl =
  process.env.FRONTEND_BASE_URL ?? "http://localhost:3000";

/** QAで使うAsia/Tokyo基準の日付。 */
const qaDate = process.env.QA_DATE ?? formatTokyoDate(new Date());

/** QAで使う対象月。 */
const qaMonth = qaDate.slice(0, 7);

/** QAで使う対象年。 */
const qaYear = Number(qaDate.slice(0, 4));

/** QAで作成する収入の初期金額。 */
const createdIncomeAmount = 12345;

/** QAで更新する収入の金額。 */
const updatedIncomeAmount = 22222;

/** QAで作成する固定費の初期金額。 */
const createdFixedCostAmount = 3333;

/** QAで更新する固定費の金額。 */
const updatedFixedCostAmount = 4444;

/** QAで作成する出費の金額。 */
const createdExpenseAmount = 777;

/** QAで確認するFrontend route一覧。 */
const frontendRoutes = [
  "/",
  "/incomes",
  "/fixed-costs",
  "/calendar",
  "/annual-summary",
];

/** QA中に作成した収入ID。 */
let createdIncomeId = null;

/** QA中に作成した固定費ID。 */
let createdFixedCostId = null;

/** QA中に作成した出費ID。 */
let createdExpenseId = null;

/**
 * @description Asia/Tokyo基準のYYYY-MM-DD文字列を返す。
 * @param date - 変換元の日付。
 * @returns Asia/Tokyo基準の日付文字列。
 * @example
 * formatTokyoDate(new Date());
 */
function formatTokyoDate(date) {
  /** Asia/Tokyo基準の日付構成要素。 */
  const parts = new Intl.DateTimeFormat("ja-JP", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tokyo",
    year: "numeric",
  }).formatToParts(date);

  /** 日付構成要素を名前で参照するためのmap。 */
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

/**
 * @description URLを組み立てる。
 * @param baseUrl - 接続先のbase URL。
 * @param pathname - URL path。
 * @param params - query parameter。
 * @returns 組み立て済みURL。
 * @example
 * buildUrl("http://localhost:8080", "/api/health", {});
 */
function buildUrl(baseUrl, pathname, params = {}) {
  /** 組み立て対象のURL。 */
  const url = new URL(pathname, baseUrl);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

/**
 * @description APIからJSON responseを取得する。
 * @param pathname - API path。
 * @param options - fetch option。
 * @returns JSONとしてparse済みのresponse body。
 * @example
 * await requestApiJson("/api/monthly-summary", { params: { month: "2026-05" } });
 */
async function requestApiJson(pathname, options = {}) {
  /** HTTP method。 */
  const method = options.method ?? "GET";
  /** API request URL。 */
  const url = buildUrl(apiBaseUrl, pathname, options.params);
  /** API request body。 */
  const body =
    options.body === undefined ? undefined : JSON.stringify(options.body);

  /** API response。 */
  const response = await fetch(url, {
    body,
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    method,
  });

  /** API response body text。 */
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `${method} ${url.toString()} failed: ${response.status} ${responseText}`,
    );
  }

  if (responseText.length === 0) {
    return {};
  }

  return JSON.parse(responseText);
}

/**
 * @description Frontend routeが表示可能か確認する。
 * @param route - 確認対象route。
 * @returns なし。
 * @example
 * await assertFrontendRoute("/");
 */
async function assertFrontendRoute(route) {
  /** Frontend route URL。 */
  const url = buildUrl(frontendBaseUrl, route);
  /** Frontend response。 */
  const response = await fetch(url, { method: "HEAD" });

  assert(response.ok, `Frontend route ${route} should return 2xx`, {
    route,
    status: response.status,
  });
}

/**
 * @description 条件がfalseの場合に詳細付きのErrorを投げる。
 * @param condition - 成功条件。
 * @param message - 失敗時のmessage。
 * @param details - 失敗時に表示する詳細。
 * @returns なし。
 * @example
 * assert(value > 0, "value should be positive", { value });
 */
function assert(condition, message, details = {}) {
  if (!condition) {
    throw new Error(`${message}\n${JSON.stringify(details, null, 2)}`);
  }
}

/**
 * @description actualとexpectedが一致することを検証する。
 * @param actual - 実際の値。
 * @param expected - 期待値。
 * @param label - 検証対象の名前。
 * @returns なし。
 * @example
 * assertEqual(1, 1, "count");
 */
function assertEqual(actual, expected, label) {
  assert(actual === expected, `${label} should be ${expected}`, {
    actual,
    expected,
    label,
  });
}

/**
 * @description 月次サマリーを取得する。
 * @param month - 対象月。
 * @returns 月次サマリー。
 * @example
 * await fetchMonthlySummary("2026-05");
 */
async function fetchMonthlySummary(month) {
  /** 月次サマリーAPI response。 */
  const response = await requestApiJson("/api/monthly-summary", {
    params: { month },
  });

  return response.monthlySummary;
}

/**
 * @description 年間サマリーを取得する。
 * @param year - 対象年。
 * @returns 年間サマリー。
 * @example
 * await fetchAnnualSummary(2026);
 */
async function fetchAnnualSummary(year) {
  /** 年間サマリーAPI response。 */
  const response = await requestApiJson("/api/annual-summary", {
    params: { year },
  });

  return response.annualSummary;
}

/**
 * @description 出費カレンダーを取得する。
 * @param month - 対象月。
 * @param date - 選択日。
 * @returns 出費カレンダー。
 * @example
 * await fetchExpenseCalendar("2026-05", "2026-05-09");
 */
async function fetchExpenseCalendar(month, date) {
  /** 出費カレンダーAPI response。 */
  const response = await requestApiJson("/api/expense-calendar", {
    params: { date, month },
  });

  return response.expenseCalendar;
}

/**
 * @description 年間サマリーから対象月のサマリーを取得する。
 * @param annualSummary - 年間サマリー。
 * @param month - 対象月。
 * @returns 対象月の月別サマリー。
 * @example
 * findAnnualMonthSummary(summary, "2026-05");
 */
function findAnnualMonthSummary(annualSummary, month) {
  /** 対象月の月別サマリー。 */
  const monthSummary = annualSummary.months.find(
    (item) => item.month === month,
  );

  assert(
    monthSummary !== undefined,
    "annual summary should include target month",
    {
      month,
    },
  );

  return monthSummary;
}

/**
 * @description カレンダーから対象日のサマリーを取得する。
 * @param calendar - 出費カレンダー。
 * @param date - 対象日。
 * @returns 対象日のカレンダーサマリー。
 * @example
 * findCalendarDay(calendar, "2026-05-09");
 */
function findCalendarDay(calendar, date) {
  /** 対象日のカレンダーサマリー。 */
  const day = calendar.days.find((item) => item.date === date);

  assert(day !== undefined, "expense calendar should include target day", {
    date,
  });

  return day;
}

/**
 * @description 対象月から年内の有効月数を取得する。
 * @param month - 対象月。
 * @returns 対象月から12月までの月数。
 * @example
 * getRemainingMonthCountInYear("2026-05");
 */
function getRemainingMonthCountInYear(month) {
  /** 対象月の月番号。 */
  const monthNumber = Number(month.slice(5, 7));

  return 12 - monthNumber + 1;
}

/**
 * @description 月次サマリーが基準値から期待delta分だけ変化したことを検証する。
 * @param baseline - 基準の月次サマリー。
 * @param actual - 検証対象の月次サマリー。
 * @param delta - 期待する差分。
 * @returns なし。
 * @example
 * assertMonthlySummaryDelta(baseline, actual, { totalIncome: 1000 });
 */
function assertMonthlySummaryDelta(baseline, actual, delta) {
  for (const key of Object.keys(delta)) {
    assertEqual(
      actual[key],
      baseline[key] + delta[key],
      `monthlySummary.${key}`,
    );
  }
}

/**
 * @description 年間サマリーが基準値から期待delta分だけ変化したことを検証する。
 * @param baseline - 基準の年間サマリー。
 * @param actual - 検証対象の年間サマリー。
 * @param delta - 期待する差分。
 * @returns なし。
 * @example
 * assertAnnualSummaryDelta(baseline, actual, { totalIncome: 1000 });
 */
function assertAnnualSummaryDelta(baseline, actual, delta) {
  for (const key of Object.keys(delta)) {
    assertEqual(
      actual[key],
      baseline[key] + delta[key],
      `annualSummary.${key}`,
    );
  }
}

/**
 * @description 年間サマリー内の対象月が基準値から期待delta分だけ変化したことを検証する。
 * @param baseline - 基準の年間サマリー。
 * @param actual - 検証対象の年間サマリー。
 * @param month - 対象月。
 * @param delta - 期待する差分。
 * @returns なし。
 * @example
 * assertAnnualMonthSummaryDelta(baseline, actual, "2026-05", { totalIncome: 1000 });
 */
function assertAnnualMonthSummaryDelta(baseline, actual, month, delta) {
  /** 基準の対象月サマリー。 */
  const baselineMonth = findAnnualMonthSummary(baseline, month);
  /** 検証対象の対象月サマリー。 */
  const actualMonth = findAnnualMonthSummary(actual, month);

  for (const key of Object.keys(delta)) {
    assertEqual(
      actualMonth[key],
      baselineMonth[key] + delta[key],
      `annualSummary.months[${month}].${key}`,
    );
  }
}

/**
 * @description 出費カレンダーが基準値から期待delta分だけ変化したことを検証する。
 * @param baseline - 基準の出費カレンダー。
 * @param actual - 検証対象の出費カレンダー。
 * @param delta - 期待する差分。
 * @returns なし。
 * @example
 * assertExpenseCalendarDelta(baseline, actual, { expenseTotal: 1000 });
 */
function assertExpenseCalendarDelta(baseline, actual, delta) {
  for (const key of Object.keys(delta)) {
    assertEqual(
      actual[key],
      baseline[key] + delta[key],
      `expenseCalendar.${key}`,
    );
  }
}

/**
 * @description 月次サマリーが基準値に戻っていることを検証する。
 * @param baseline - 基準の月次サマリー。
 * @param actual - 検証対象の月次サマリー。
 * @returns なし。
 * @example
 * assertMonthlySummaryRestored(baseline, actual);
 */
function assertMonthlySummaryRestored(baseline, actual) {
  assertMonthlySummaryDelta(baseline, actual, {
    actualBalance: 0,
    availableIncome: 0,
    expenseTotal: 0,
    fixedCostTotal: 0,
    remainingAmount: 0,
    reservedIncome: 0,
    totalIncome: 0,
  });
}

/**
 * @description 年間サマリーが基準値に戻っていることを検証する。
 * @param baseline - 基準の年間サマリー。
 * @param actual - 検証対象の年間サマリー。
 * @returns なし。
 * @example
 * assertAnnualSummaryRestored(baseline, actual);
 */
function assertAnnualSummaryRestored(baseline, actual) {
  assertAnnualSummaryDelta(baseline, actual, {
    actualBalance: 0,
    availableBalance: 0,
    availableIncome: 0,
    expenseTotal: 0,
    fixedCostTotal: 0,
    reservedIncome: 0,
    totalIncome: 0,
  });
}

/**
 * @description 収入の横断反映を検証する。
 * @returns なし。
 * @example
 * await verifyIncomeLifecycle();
 */
async function verifyIncomeLifecycle() {
  console.log("Checking income lifecycle...");

  /** 収入検証前の月次サマリー。 */
  const baselineMonthly = await fetchMonthlySummary(qaMonth);
  /** 収入検証前の年間サマリー。 */
  const baselineAnnual = await fetchAnnualSummary(qaYear);

  /** 収入登録response。 */
  const createResponse = await requestApiJson("/api/incomes", {
    body: {
      amount: createdIncomeAmount,
      incomeDate: qaDate,
      includedInBalance: true,
      memo: "MVP横断QA 収入",
    },
    method: "POST",
  });
  createdIncomeId = createResponse.income.id;

  /** 収入登録後の月次サマリー。 */
  const afterCreateMonthly = await fetchMonthlySummary(qaMonth);
  /** 収入登録後の年間サマリー。 */
  const afterCreateAnnual = await fetchAnnualSummary(qaYear);

  assertMonthlySummaryDelta(baselineMonthly, afterCreateMonthly, {
    actualBalance: createdIncomeAmount,
    availableIncome: createdIncomeAmount,
    remainingAmount: createdIncomeAmount,
    reservedIncome: 0,
    totalIncome: createdIncomeAmount,
  });
  assertAnnualSummaryDelta(baselineAnnual, afterCreateAnnual, {
    actualBalance: createdIncomeAmount,
    availableBalance: createdIncomeAmount,
    availableIncome: createdIncomeAmount,
    reservedIncome: 0,
    totalIncome: createdIncomeAmount,
  });
  assertAnnualMonthSummaryDelta(baselineAnnual, afterCreateAnnual, qaMonth, {
    actualBalance: createdIncomeAmount,
    availableBalance: createdIncomeAmount,
    availableIncome: createdIncomeAmount,
    reservedIncome: 0,
    totalIncome: createdIncomeAmount,
  });

  await requestApiJson(`/api/incomes/${createdIncomeId}`, {
    body: {
      amount: updatedIncomeAmount,
      incomeDate: qaDate,
      includedInBalance: false,
      memo: "MVP横断QA 収入 更新",
    },
    method: "PUT",
  });

  /** 収入更新後の月次サマリー。 */
  const afterUpdateMonthly = await fetchMonthlySummary(qaMonth);
  /** 収入更新後の年間サマリー。 */
  const afterUpdateAnnual = await fetchAnnualSummary(qaYear);

  assertMonthlySummaryDelta(baselineMonthly, afterUpdateMonthly, {
    actualBalance: updatedIncomeAmount,
    availableIncome: 0,
    remainingAmount: 0,
    reservedIncome: updatedIncomeAmount,
    totalIncome: updatedIncomeAmount,
  });
  assertAnnualSummaryDelta(baselineAnnual, afterUpdateAnnual, {
    actualBalance: updatedIncomeAmount,
    availableBalance: 0,
    availableIncome: 0,
    reservedIncome: updatedIncomeAmount,
    totalIncome: updatedIncomeAmount,
  });
  assertAnnualMonthSummaryDelta(baselineAnnual, afterUpdateAnnual, qaMonth, {
    actualBalance: updatedIncomeAmount,
    availableBalance: 0,
    availableIncome: 0,
    reservedIncome: updatedIncomeAmount,
    totalIncome: updatedIncomeAmount,
  });

  await requestApiJson(`/api/incomes/${createdIncomeId}`, { method: "DELETE" });
  createdIncomeId = null;

  assertMonthlySummaryRestored(
    baselineMonthly,
    await fetchMonthlySummary(qaMonth),
  );
  assertAnnualSummaryRestored(baselineAnnual, await fetchAnnualSummary(qaYear));
}

/**
 * @description 固定費の横断反映を検証する。
 * @returns なし。
 * @example
 * await verifyFixedCostLifecycle();
 */
async function verifyFixedCostLifecycle() {
  console.log("Checking fixed cost lifecycle...");

  /** 固定費検証前の月次サマリー。 */
  const baselineMonthly = await fetchMonthlySummary(qaMonth);
  /** 固定費検証前の年間サマリー。 */
  const baselineAnnual = await fetchAnnualSummary(qaYear);
  /** 固定費検証前の出費カレンダー。 */
  const baselineCalendar = await fetchExpenseCalendar(qaMonth, qaDate);
  /** 年内で固定費が有効になる月数。 */
  const activeMonthCount = getRemainingMonthCountInYear(qaMonth);

  /** 固定費登録response。 */
  const createResponse = await requestApiJson("/api/fixed-costs", {
    body: {
      amount: createdFixedCostAmount,
      isActive: true,
      name: "MVP横断QA 固定費",
      startMonth: `${qaMonth}-01`,
    },
    method: "POST",
  });
  createdFixedCostId = createResponse.fixedCost.id;

  assertMonthlySummaryDelta(
    baselineMonthly,
    await fetchMonthlySummary(qaMonth),
    {
      actualBalance: -createdFixedCostAmount,
      fixedCostTotal: createdFixedCostAmount,
      remainingAmount: -createdFixedCostAmount,
    },
  );
  assertExpenseCalendarDelta(
    baselineCalendar,
    await fetchExpenseCalendar(qaMonth, qaDate),
    {
      fixedCostTotal: createdFixedCostAmount,
      remainingAmount: -createdFixedCostAmount,
    },
  );
  /** 固定費登録後の年間サマリー。 */
  const afterCreateAnnual = await fetchAnnualSummary(qaYear);

  assertAnnualSummaryDelta(baselineAnnual, afterCreateAnnual, {
    actualBalance: -createdFixedCostAmount * activeMonthCount,
    availableBalance: -createdFixedCostAmount * activeMonthCount,
    fixedCostTotal: createdFixedCostAmount * activeMonthCount,
  });
  assertAnnualMonthSummaryDelta(baselineAnnual, afterCreateAnnual, qaMonth, {
    actualBalance: -createdFixedCostAmount,
    availableBalance: -createdFixedCostAmount,
    fixedCostTotal: createdFixedCostAmount,
  });

  await requestApiJson(`/api/fixed-costs/${createdFixedCostId}`, {
    body: {
      amount: updatedFixedCostAmount,
      isActive: true,
      name: "MVP横断QA 固定費 更新",
      startMonth: `${qaMonth}-01`,
    },
    method: "PUT",
  });

  assertMonthlySummaryDelta(
    baselineMonthly,
    await fetchMonthlySummary(qaMonth),
    {
      actualBalance: -updatedFixedCostAmount,
      fixedCostTotal: updatedFixedCostAmount,
      remainingAmount: -updatedFixedCostAmount,
    },
  );
  assertExpenseCalendarDelta(
    baselineCalendar,
    await fetchExpenseCalendar(qaMonth, qaDate),
    {
      fixedCostTotal: updatedFixedCostAmount,
      remainingAmount: -updatedFixedCostAmount,
    },
  );
  /** 固定費更新後の年間サマリー。 */
  const afterUpdateAnnual = await fetchAnnualSummary(qaYear);

  assertAnnualSummaryDelta(baselineAnnual, afterUpdateAnnual, {
    actualBalance: -updatedFixedCostAmount * activeMonthCount,
    availableBalance: -updatedFixedCostAmount * activeMonthCount,
    fixedCostTotal: updatedFixedCostAmount * activeMonthCount,
  });
  assertAnnualMonthSummaryDelta(baselineAnnual, afterUpdateAnnual, qaMonth, {
    actualBalance: -updatedFixedCostAmount,
    availableBalance: -updatedFixedCostAmount,
    fixedCostTotal: updatedFixedCostAmount,
  });

  await requestApiJson(`/api/fixed-costs/${createdFixedCostId}`, {
    body: {
      amount: updatedFixedCostAmount,
      isActive: false,
      name: "MVP横断QA 固定費 更新",
      startMonth: `${qaMonth}-01`,
    },
    method: "PUT",
  });

  assertMonthlySummaryRestored(
    baselineMonthly,
    await fetchMonthlySummary(qaMonth),
  );
  assertAnnualSummaryRestored(baselineAnnual, await fetchAnnualSummary(qaYear));
  assertExpenseCalendarDelta(
    baselineCalendar,
    await fetchExpenseCalendar(qaMonth, qaDate),
    {
      fixedCostTotal: 0,
      remainingAmount: 0,
    },
  );

  await requestApiJson(`/api/fixed-costs/${createdFixedCostId}`, {
    method: "DELETE",
  });
  createdFixedCostId = null;

  assertMonthlySummaryRestored(
    baselineMonthly,
    await fetchMonthlySummary(qaMonth),
  );
  assertAnnualSummaryRestored(baselineAnnual, await fetchAnnualSummary(qaYear));
}

/**
 * @description 出費の横断反映を検証する。
 * @returns なし。
 * @example
 * await verifyExpenseLifecycle();
 */
async function verifyExpenseLifecycle() {
  console.log("Checking expense lifecycle...");

  /** 出費検証前の月次サマリー。 */
  const baselineMonthly = await fetchMonthlySummary(qaMonth);
  /** 出費検証前の年間サマリー。 */
  const baselineAnnual = await fetchAnnualSummary(qaYear);
  /** 出費検証前の出費カレンダー。 */
  const baselineCalendar = await fetchExpenseCalendar(qaMonth, qaDate);
  /** 出費検証前の対象日サマリー。 */
  const baselineDay = findCalendarDay(baselineCalendar, qaDate);

  /** 出費登録response。 */
  const createResponse = await requestApiJson("/api/expenses", {
    body: { amount: createdExpenseAmount },
    method: "POST",
  });
  createdExpenseId = createResponse.expense.id;

  /** 出費登録日時のAsia/Tokyo日付。 */
  const spentDate = createResponse.expense.spentAt.slice(0, 10);
  /** 出費登録日時のAsia/Tokyo月。 */
  const spentMonth = spentDate.slice(0, 7);
  /** 出費登録日時のAsia/Tokyo年。 */
  const spentYear = Number(spentDate.slice(0, 4));

  assertEqual(spentMonth, qaMonth, "created expense month");
  assertEqual(spentYear, qaYear, "created expense year");

  /** 出費登録後の出費カレンダー。 */
  const afterCreateCalendar = await fetchExpenseCalendar(spentMonth, spentDate);
  /** 出費登録後の対象日サマリー。 */
  const afterCreateDay = findCalendarDay(afterCreateCalendar, spentDate);

  assertMonthlySummaryDelta(
    baselineMonthly,
    await fetchMonthlySummary(spentMonth),
    {
      actualBalance: -createdExpenseAmount,
      expenseTotal: createdExpenseAmount,
      remainingAmount: -createdExpenseAmount,
    },
  );
  /** 出費登録後の年間サマリー。 */
  const afterCreateAnnual = await fetchAnnualSummary(spentYear);

  assertAnnualSummaryDelta(baselineAnnual, afterCreateAnnual, {
    actualBalance: -createdExpenseAmount,
    availableBalance: -createdExpenseAmount,
    expenseTotal: createdExpenseAmount,
  });
  assertAnnualMonthSummaryDelta(baselineAnnual, afterCreateAnnual, spentMonth, {
    actualBalance: -createdExpenseAmount,
    availableBalance: -createdExpenseAmount,
    expenseTotal: createdExpenseAmount,
  });
  assertExpenseCalendarDelta(baselineCalendar, afterCreateCalendar, {
    expenseTotal: createdExpenseAmount,
    remainingAmount: -createdExpenseAmount,
  });
  assertEqual(
    afterCreateDay.expenseTotal,
    baselineDay.expenseTotal + createdExpenseAmount,
    "expenseCalendar.day.expenseTotal",
  );
  assert(
    afterCreateCalendar.selectedDateExpenses.some(
      (expense) => expense.id === createdExpenseId,
    ),
    "selectedDateExpenses should include created expense",
    { createdExpenseId, spentDate },
  );

  await requestApiJson(`/api/expenses/${createdExpenseId}`, {
    method: "DELETE",
  });
  createdExpenseId = null;

  assertMonthlySummaryRestored(
    baselineMonthly,
    await fetchMonthlySummary(spentMonth),
  );
  assertAnnualSummaryRestored(
    baselineAnnual,
    await fetchAnnualSummary(spentYear),
  );
  assertExpenseCalendarDelta(
    baselineCalendar,
    await fetchExpenseCalendar(spentMonth, spentDate),
    {
      expenseTotal: 0,
      remainingAmount: 0,
    },
  );
}

/**
 * @description QA用データが残っている場合に削除する。
 * @returns なし。
 * @example
 * await cleanupCreatedData();
 */
async function cleanupCreatedData() {
  /** 削除対象のresource一覧。 */
  const resources = [
    { id: createdExpenseId, path: "/api/expenses" },
    { id: createdFixedCostId, path: "/api/fixed-costs" },
    { id: createdIncomeId, path: "/api/incomes" },
  ];

  for (const resource of resources) {
    if (resource.id === null) {
      continue;
    }

    try {
      await requestApiJson(`${resource.path}/${resource.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Failed to cleanup ${resource.path}/${resource.id}`);
      console.error(error);
    }
  }

  createdExpenseId = null;
  createdFixedCostId = null;
  createdIncomeId = null;
}

/**
 * @description MVP横断QAを実行する。
 * @returns なし。
 * @example
 * await main();
 */
async function main() {
  console.log("Running MVP cross-screen QA...");
  console.log(`API: ${apiBaseUrl}`);
  console.log(`Frontend: ${frontendBaseUrl}`);
  console.log(`QA date: ${qaDate}`);

  await requestApiJson("/health");

  for (const route of frontendRoutes) {
    await assertFrontendRoute(route);
  }

  await verifyIncomeLifecycle();
  await verifyFixedCostLifecycle();
  await verifyExpenseLifecycle();

  console.log("MVP cross-screen QA passed.");
}

try {
  await main();
} catch (error) {
  console.error("MVP cross-screen QA failed.");
  console.error(error);
  process.exitCode = 1;
} finally {
  await cleanupCreatedData();
}
