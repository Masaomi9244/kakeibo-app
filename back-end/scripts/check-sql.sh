#!/bin/sh
set -eu

mode="${1:-lint}"
migration_dir="migrations"
sql_files="$(find "${migration_dir}" -type f -name '*.sql' | sort)"

if [ -z "${sql_files}" ]; then
  exit 0
fi

invalid_names="$(printf '%s\n' "${sql_files}" | grep -Ev '/[0-9]{14}_[a-z0-9_]+\.sql$' || true)"
if [ -n "${invalid_names}" ]; then
  printf '%s\n' "Invalid migration filename. Use YYYYMMDDHHMMSS_snake_case.sql:" >&2
  printf '%s\n' "${invalid_names}" >&2
  exit 1
fi

duplicate_timestamps="$(
  printf '%s\n' "${sql_files}" \
    | sed -E 's#^.*/([0-9]{14})_.*#\1#' \
    | sort \
    | uniq -d
)"
if [ -n "${duplicate_timestamps}" ]; then
  printf '%s\n' "Duplicate migration timestamp:" >&2
  printf '%s\n' "${duplicate_timestamps}" >&2
  exit 1
fi

if command -v sqlfluff >/dev/null 2>&1; then
  sqlfluff_cmd="sqlfluff"
elif python3 -m sqlfluff --version >/dev/null 2>&1; then
  sqlfluff_cmd="python3 -m sqlfluff"
else
  printf '%s\n' "sqlfluff is required when SQL migrations exist." >&2
  printf '%s\n' "Install sqlfluff and ensure the sqlfluff command is in PATH." >&2
  exit 1
fi

case "${mode}" in
  lint)
    ${sqlfluff_cmd} lint ${sql_files}
    ;;
  fix)
    ${sqlfluff_cmd} fix ${sql_files}
    ;;
  format-check)
    ${sqlfluff_cmd} lint ${sql_files}
    ;;
  *)
    printf '%s\n' "Unknown mode: ${mode}" >&2
    exit 1
    ;;
esac
