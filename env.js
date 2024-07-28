export const PB_URL =
  new URL(window.location.href).searchParams.get("pb_url") ||
  localStorage.getItem("pb_url");
export const CONFIG_RECORD_ID =
  new URL(window.location.href).searchParams.get("config_record_id") ||
  localStorage.getItem("config_record_id");
export const ROUTINE_DATE =
  new URL(window.location.href).searchParams.get("routine_date") ||
  dayjs().format("YYYY-MM-DD");
export const DB_PREFIX = "smst";
