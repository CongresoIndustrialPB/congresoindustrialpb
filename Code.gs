// ============================================================
// IV Congreso Ingeniería Industrial - Backend Google Apps Script
// Archivo: Code.gs
// Despliega como Web App con acceso: "Cualquier persona"
// ============================================================

const SPREADSHEET_ID = '1UDkYFIqW1TiuoO-WLppqLpHQhio4DIHqwzx0svUh-5k';
const SHEET_NAME = 'diploma'; // Hoja con query de participantes con check-in

/**
 * Maneja peticiones GET (para verificar que la API funciona)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'API IV Congreso activa' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Maneja peticiones POST desde la página web
 * Body esperado: { ticket, correo, telefono }
 */
function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = JSON.parse(e.postData.contents);
    const ticket   = normalizar(body.ticket);
    const correo   = normalizar(body.correo);
    const telefono = normalizar(body.telefono);

    if (!ticket || !correo || !telefono) {
      return respond({ success: false, message: 'Todos los campos son requeridos.' }, headers);
    }

    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return respond({ success: false, message: 'Hoja "diploma" no encontrada.' }, headers);
    }

    const data = sheet.getDataRange().getValues();
    // Fila 0 = encabezados: TICKET | NOMBRE COMPLETO | CORREO | TELEFONO
    // (ajusta los índices si tu query devuelve columnas en diferente orden)
    const COL_TICKET   = 0;
    const COL_NOMBRE   = 1;
    const COL_CORREO   = 2;
    const COL_TELEFONO = 3;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowTicket   = normalizar(String(row[COL_TICKET]));
      const rowCorreo   = normalizar(String(row[COL_CORREO]));
      const rowTelefono = normalizar(String(row[COL_TELEFONO]));

      if (rowTicket === ticket && rowCorreo === correo && rowTelefono === telefono) {
        return respond({
          success: true,
          nombre: String(row[COL_NOMBRE]).trim()
        }, headers);
      }
    }

    return respond({
      success: false,
      message: 'No se encontró un participante con esos datos o no tiene check-in registrado.'
    }, headers);

  } catch (err) {
    return respond({ success: false, message: 'Error interno: ' + err.message }, headers);
  }
}

/**
 * Normaliza strings para comparación: minúsculas, sin espacios extremos
 */
function normalizar(str) {
  if (!str) return '';
  return str.toString().trim().toLowerCase();
}

/**
 * Construye respuesta JSON con headers CORS
 */
function respond(data, headers) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
