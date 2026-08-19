# Registro de Caja Britannia — 7DS: Grand Cross

Checklist para llevar la cuenta de qué unidades meta tienes en **The Seven Deadly Sins: Grand Cross**
y saber a qué equipo estás realmente más cerca de armar.

Marcas lo que tienes y la app calcula sola:

- cuántas de las 37 unidades meta llevas,
- cuántos equipos puedes armar completos,
- **cuáles ya no son alcanzables** porque exigen unidades de banners limitados que cerraron,
- y quién te falta exactamente en cada uno de los 14 equipos.

Cada persona guarda su propia caja en su navegador (`localStorage`), así que la puedes compartir
sin que se te mezclen los datos con los de otro.

## Usarla entre dos o más personas

**Tu nombre.** Arriba hay un campo donde pones quién eres. Queda guardado y encabeza el resumen
que copias, así se sabe de quién es cada texto.

**Compartir tu caja.** El botón *Compartir mi caja* genera un link con tus marcas codificadas
dentro (en el `#` de la URL, no en ningún servidor). Se lo mandas a quien sea y al abrirlo ve
**tu** caja, en modo solo lectura, con un aviso arriba y un botón para volver a la suya.

Lo importante: **ver una caja ajena nunca pisa la propia**. Mientras estás en modo visita no se
guarda nada, los checkboxes quedan bloqueados y los botones de compartir y borrar se esconden.

## Cómo arrancarlo

1. Doble clic en **`start.bat`**.
   - Levanta un servidor estático y abre el navegador en `http://localhost:8010`.
2. Para cerrarlo: cierra la ventana negra.

> Requiere Python instalado (el mismo que usa `altok-panel`).
> Las tipografías se cargan desde Google Fonts, así que la primera vez necesitas conexión.

También puedes abrir `index.html` con doble clic — funciona igual, sin servidor.

## Entrar desde el celular

Estando en la **misma red WiFi**, abre en el celular `http://[IP-DE-TU-PC]:8010`.
Tu IP la ves con `ipconfig` en una terminal (busca "Dirección IPv4").

## Estructura

```
7ds-caja/
├── index.html          La página
├── start.bat           Levanta el servidor local
└── assets/
    ├── styles.css      Estilos (tema claro y oscuro)
    ├── data.js         Base de datos de unidades y equipos  <-- lo que más vas a tocar
    └── app.js          Lógica: marcar, calcular, resumen
```

## Cómo agregar unidades nuevas

Todo vive en **`assets/data.js`**. No hay que tocar nada más.

**1. Agrega la unidad** al objeto `UNITS`:

```js
gawain: {
  es: "Gawain, Caballero del Sol — [Título en español]",
  en: "(English Title) Gawain",
  tier: "SSS",
  lock: "Festival Gawain, ago-2026"   // solo si es de banner limitado; si no, omítelo
},
```

Campos:

| Campo  | Para qué sirve |
|--------|----------------|
| `es`   | Nombre visible. Lo que va antes de `—` es lo que se muestra en "te falta X" |
| `en`   | Nombre original, para buscar guías y ubicarla en el juego |
| `tier` | `SSS`, `SS` o `S` — pinta la etiqueta de color |
| `duo`  | `true` si son dos personajes en una carta (King y Diane, Merlín y Escanor) |
| `lock` | Texto del banner limitado. Si existe, la unidad se marca como no obtenible |

**2. Métela en un equipo**, en el array `TEAMS`:

```js
{ name: "Apocalipsis", use: "4 Caballeros", m: ["tristan", "lancelot", "gawain", "shinra"] },
```

Cada equipo lleva exactamente **4** ids. Si un id no existe en `UNITS`, la app no lo dibuja —
conviene revisar que esté bien escrito.

**3. Actualiza el total** si cambiaste la cantidad de unidades: busca `/ 37` en `index.html`
y en `app.js` (`totalOwned + " / 37"`).

## Fuente de los datos

Las composiciones salen de la página [PVP Teams](https://7dsgc.fandom.com/wiki/PVP_Teams)
del wiki de la comunidad, actualizada el **6 de agosto de 2026**.

El estado de obtenibilidad (campo `lock`) viene de los avisos oficiales de invocación
del [foro de Netmarble](https://forum.netmarble.com/7ds_en/list/1/1).

> Ojo: el meta cambia con cada parche. Estos datos son del corte de agosto de 2026 y
> **no incluyen a Gawain**, que salió el 19 de agosto.

## Pendientes

- [ ] Agregar a Gawain y rehacer el equipo Apocalipsis cuando se conozca su kit
- [ ] Marcar el atributo (rojo / verde / azul) de cada unidad para filtrar por triángulo
- [ ] Marcar el clan (Gigante, Hada, Demonio, Diosa, Humano) para armar equipos de evento
