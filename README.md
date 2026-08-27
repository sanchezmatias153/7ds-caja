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

## Retratos de las cartas

Las 37 unidades traen retrato. Salen del wiki de la comunidad
(`static.wikia.nocookie.net`), a 128 px.

El mapeo **no se hizo adivinando**: la página PVP Teams del wiki trae cada imagen etiquetada
con el nombre de la unidad, así que se cruzó nombre contra nombre y después se verificó que el
nombre del archivo contuviera el título entre paréntesis de cada versión. Esa verificación
pilló un error real: Anghalhad tiene dos versiones y el cruce automático había tomado
`(A_New_Adventure)` en vez de `(Sweet_Temptation)`.

> El primer intento fue con el repo público de assets, y no sirve: nombra los archivos por
> número de variante (`icon_hero_ban_0006_s.png`) sin tabla que los relacione.

Para cambiar un retrato, pega otra URL en el campo "URL del retrato" de la ficha de esa unidad;
lo que pongas manda sobre el del wiki. Si una imagen falla, la carta vuelve sola a las iniciales.

Son assets del juego, propiedad de Netmarble, enlazados desde el wiki de fans.

## Cache de los assets

`index.html` enlaza el CSS y los JS con `?v=AAAAMMDDHHMM`. **Al publicar un cambio hay que subir
ese número**, si no los navegadores que ya visitaron la página siguen con la versión vieja.

**2. Métela en un equipo**, en el array `TEAMS`:

```js
{ name: "Apocalipsis", use: "4 Caballeros", m: ["tristan", "lancelot", "gawain", "shinra"] },
```

Cada equipo lleva exactamente **4** ids. Si un id no existe en `UNITS`, la app no lo dibuja —
conviene revisar que esté bien escrito.

**3. El total se calcula solo** desde `UNITS`. En `index.html` conviene igualar el valor inicial
de `#s-units` para que no parpadee.

## Fuente de los datos

Las composiciones salen de la página [PVP Teams](https://7dsgc.fandom.com/wiki/PVP_Teams)
del wiki de la comunidad, actualizada el **21 de agosto de 2026**.

El estado de obtenibilidad (campo `lock`) viene de los avisos oficiales de invocación
del [foro de Netmarble](https://forum.netmarble.com/7ds_en/list/1/1).

> Ojo: el meta cambia con cada parche. Último repaso de datos: **27 de agosto de 2026**.

Campo `activa`: marca una unidad **limitada pero obtenible ahora mismo**, con el banner y la
condición. Se distingue de `lock`, que es limitada y ya cerrada. En la grilla sale con etiqueta
verde "¡disponible!".

## Cómo está armada la página

Barra superior fija con **4 pestañas**: Mi caja · Equipos · Jefes · Compartir.
La pestaña abierta se recuerda entre visitas. Antes era una sola página de 14 pantallas
de scroll; ahora cada pestaña son 2-3.

Las unidades se muestran como **grilla de retratos** (una por unidad, no una por equipo:
antes se repetían las que salen en varias composiciones, 56 filas para 37 unidades).
Las que no tienes salen en gris; al marcarlas toman color y borde verde.

## Secciones

- **Pizarra de equipos** y **Tu caja** — los 14 equipos meta de PvP y qué te falta.
- **Cargar mi caja desde un resumen pegado** — dentro de "Tu caja". Pegas un resumen generado
  por la app (tuyo o de un amigo) y marca las unidades solo. No borra lo que ya tenías marcado,
  y acepta tanto el formato nuevo (`CAJA 7DS DE:`) como el viejo (`MI CAJA 7DS`).
- **Equipos que puedes armar** — no sale del wiki: agrupa TUS unidades por atributo y por clan
  y te muestra cuáles llegan a 4, con suplentes. Se dibujan como **cartas estilo juego**:
  marco morado, orbe del atributo arriba a la derecha, clan arriba a la izquierda y tier abajo.
  Los huecos salen como carta "LIBRE".
- **Fichas de tus unidades** — atributo y clan de cada unidad que marcaste. Es lo que
  alimenta el cálculo de los jefes. También puedes agregar unidades tuyas que no estén
  en la lista meta.
- **Jefes** — ficha real de cada jefe de Death Match y qué de tu caja le hace ventaja.

## Cómo agregar jefes

En `assets/data.js`, en el array `BOSSES`:

```js
{
  id: "nuevoJefe", nombre: "Nombre en español", en: "English Name", modo: "Death Match",
  attr: "Fuerza",            // atributo del jefe
  counterAttr: "Velocidad",  // el atributo que le gana
  debilClan: "Humano",       // clan que le hace daño extra (o null)
  fuerteClan: "Hada",        // clan al que resiste (o null)
  recomendado: "Freeze o Petrify.",
  inmune: "Sangrado, Veneno...",
  notas: "Lo que hay que saber para no perder.",
  cc: [["Normal", 80000], ["Extremo", 160000]]
}
```

El triángulo está en `GANA_A`: Fuerza > HP > Velocidad > Fuerza.

## Pendientes

- [ ] Sumar los jefes de Jefe Final / Templo con sus inmunidades
- [ ] Prellenar atributo y clan de las 37 unidades meta para no tener que completarlas a mano
- [ ] Botón "Copiar contexto para Claude" que arme el bloque completo de una
- [ ] Guardar nivel y despertar por unidad para mostrarlos en la carta como en el juego
