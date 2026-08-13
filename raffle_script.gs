/**
 * Промебель — бэкенд розыгрыша для Google Sheets.
 *
 * Лист "Участники":
 *   A: Контрагент     B: Сумма
 *   Каюмов Рустам     167024.85
 *   ...
 *
 * Просто вставляешь экспорт из 1С (два столбца) — страница подтянет автоматически.
 *
 * Развернуть: Расширения → Apps Script → вставить этот код →
 *   заменить SHEET_ID → Развернуть → Новое развёртывание →
 *   Тип: Веб-приложение → Доступ: Все → скопировать URL в raffle_signage.html (API_URL).
 */

const SHEET_ID   = "ВСТАВЬ_ID_ТАБЛИЦЫ";   // из URL: /spreadsheets/d/ВОТ_ЭТО/edit
const SHEET_NAME = "Участники";
const RANGE      = "A2:B";                 // без заголовка

function doGet() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const rows  = sheet.getRange(RANGE).getValues();

    const participants = rows
      .filter(r => String(r[0]).trim() !== "")
      .map(r => ({
        name:   String(r[0]).trim(),
        amount: parseAmount(r[1])
      }))
      .filter(p => p.amount > 0);

    return json({ ok: true, participants: participants, updated: new Date().toISOString() });
  } catch (e) {
    return json({ ok: false, error: String(e), participants: [] });
  }
}

// "167 024,85" / "167024.85" / число → 167024.85
function parseAmount(v) {
  if (typeof v === "number") return v;
  const s = String(v).replace(/\s/g, "").replace(/,/g, ".").replace(/[^\d.]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
