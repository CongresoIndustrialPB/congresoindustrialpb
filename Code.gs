// ============================================================
// IV Congreso Ingeniería Industrial - Backend Google Apps Script
// Archivo: Code.gs
// Despliega como Web App con acceso: "Cualquier persona"
// ============================================================

const SPREADSHEET_ID = '1UDkYFIqW1TiuoO-WLppqLpHQhio4DIHqwzx0svUh-5k';
const SHEET_NAME = 'diploma'; // Hoja con query de participantes con check-in

/**
 * Maneja peticiones GET
 * Puede usarse como ping (?ping=1) o para verificar participante (?ticket=...&correo=...&telefono=...)
 */
function doGet(e) {
  const params = e.parameter;

  // Si no vienen parámetros de verificación, responde con estado OK
  if (!params.ticket && !params.correo && !params.telefono) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', message: 'API IV Congreso activa' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Verificación de participante
  try {
    const ticket   = normalizar(params.ticket);
    const correo   = normalizar(params.correo);
    const telefono = normalizar(params.telefono);

    if (!ticket || !correo || !telefono) {
      return respond({ success: false, message: 'Todos los campos son requeridos.' });
    }

    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return respond({ success: false, message: 'Hoja "diploma" no encontrada.' });
    }

    const data = sheet.getDataRange().getValues();
    // Fila 0 = encabezados: TICKET | NOMBRE COMPLETO | CORREO | TELEFONO
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
        });
      }
    }

    return respond({
      success: false,
      message: 'No se encontró un participante con esos datos o no tiene check-in registrado.'
    });

  } catch (err) {
    return respond({ success: false, message: 'Error interno: ' + err.message });
  }
}

/**
 * doPost se mantiene por compatibilidad pero ya no es necesario
 */
function doPost(e) {
  return doGet(e);
}

/**
 * Normaliza strings para comparación: minúsculas, sin espacios extremos
 */
function normalizar(str) {
  if (!str) return '';
  return str.toString().trim().toLowerCase();
}

/**
 * Construye respuesta JSON
 */
function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
