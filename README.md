# 🎓 IV Congreso Ingeniería Industrial — Instrucciones de Despliegue

## Archivos del proyecto

```
tu-repositorio/
├── diploma.html          ← Página web principal de diplomas
├── diploma_fondo.png   ← Imagen del diploma (ver paso 1)
└── README.md           ← Este archivo
```

---

## PASO 1 — Convertir el PDF del diploma a imagen PNG

Tienes dos opciones:

### Opción A — Online (rápido)
1. Ve a https://pdf2png.com
2. Sube el archivo `DIPLOMA_IV_CONGRESO_2026.pdf`
3. Descarga el PNG resultante
4. Renómbralo como `diploma_fondo.png`

### Opción B — Con Adobe Acrobat / Canva / similar
- Exporta la página como PNG a 150 dpi mínimo
- Guárdalo como `diploma_fondo.png`

> ⚠️ IMPORTANTE: El nombre debe ser exactamente `diploma_fondo.png`

---

## PASO 2 — Configurar Google Apps Script (Backend)

1. Abre tu Google Sheets:
   https://docs.google.com/spreadsheets/d/1UDkYFIqW1TiuoO-WLppqLpHQhio4DIHqwzx0svUh-5k

2. Ve al menú: **Extensiones → Apps Script**

3. Borra el código existente y pega el contenido de `Code.gs`

4. Guarda el proyecto (Ctrl+S). Ponle un nombre como "IV Congreso API"

5. Despliega como Web App:
   - Clic en **"Implementar" → "Nueva implementación"**
   - Tipo: **Aplicación web**
   - Descripción: `v1`
   - Ejecutar como: **Yo (tu cuenta)**
   - Quién tiene acceso: **Cualquier persona**
   - Clic en **"Implementar"**
   - **Copia la URL** que aparece (empieza con `https://script.google.com/macros/s/...`)

6. Abre `index.html` y reemplaza en la línea:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/TU_ID_AQUI/exec';
   ```
   con tu URL real. Ejemplo:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxABC123.../exec';
   ```

---

## PASO 3 — Ajustar posición del nombre en el diploma

El nombre se escribe sobre la línea del diploma. Si necesitas ajustar su
posición vertical, edita en `index.html`:

```javascript
const NOMBRE_Y = 535; // ← cambia este valor
```

- Número más grande = baja el nombre
- Número más pequeño = sube el nombre

Para probar, abre el archivo localmente en tu navegador, ingresa datos
reales y observa dónde cae el nombre.

---

## PASO 4 — Publicar en GitHub Pages

### Si aún no tienes repositorio:
1. Ve a https://github.com y crea una cuenta si no tienes
2. Crea un repositorio nuevo (Ej: `iv-congreso-diplomas`)
3. Márcalo como **Público**

### Subir los archivos:
1. En el repositorio, clic en **"Add file" → "Upload files"**
2. Sube los tres archivos:
   - `index.html`
   - `diploma_fondo.png`
   - `Code.gs` (solo de referencia, no es necesario publicarlo)
3. Clic en **"Commit changes"**

### Activar GitHub Pages:
1. Ve a **Settings** (del repositorio)
2. Menú izquierdo: **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** / **root**
5. Clic en **Save**

### Tu URL pública será:
```
https://TU_USUARIO.github.io/iv-congreso-diplomas/
```
(GitHub tarda ~2 minutos en activarla)

---

## PASO 5 — Verificar que funciona

1. Abre la URL de GitHub Pages
2. Ingresa un ticket, correo y teléfono de prueba que SÍ exista en tu hoja
   con check-in registrado
3. Debe mostrarse el diploma con el nombre y el botón de descarga

---

## Solución de problemas comunes

| Problema | Solución |
|----------|----------|
| "Error de conexión" | Verifica que la URL de Apps Script sea correcta y esté desplegada |
| El nombre aparece en lugar incorrecto | Ajusta `NOMBRE_Y` en index.html |
| El fondo del diploma no carga | Verifica que `diploma_fondo.png` esté en la raíz del repositorio |
| "No se encontró participante" | Verifica que el ticket/correo/teléfono coincidan exactamente con la hoja |
| Apps Script pide permisos | Acepta los permisos de Google al desplegar por primera vez |

---

## Estructura de la hoja "diploma" esperada

La hoja debe tener estos encabezados en la fila 1:

| A: TICKET | B: NOMBRE COMPLETO | C: CORREO | D: TELEFONO |

Con la fórmula QUERY recomendada en la hoja "diploma":
```
=QUERY(checkin!A:N,"SELECT C,A,J,K WHERE L IS NOT NULL AND L <> '' LABEL C 'TICKET', A 'NOMBRE COMPLETO', J 'CORREO', K 'TELEFONO'",1)
```

---

*Sistema desarrollado para el IV Congreso de Ingeniería Industrial*
*Universidad Mariano Gálvez de Guatemala — Centro Universitario Puerto Barrios*
