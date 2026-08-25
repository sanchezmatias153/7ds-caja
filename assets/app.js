(function () {
  "use strict";

  var U       = window.CAJA7DS.UNITS;
  var TEAMS   = window.CAJA7DS.TEAMS;
  var BOSSES  = window.CAJA7DS.BOSSES;
  var ATTRS   = window.CAJA7DS.ATTRS;
  var CLANES  = window.CAJA7DS.CLANES;



  var KEY       = "caja7ds.v1";
  var KEY_NAME  = "caja7ds.nombre";
  var KEY_FICHA = "caja7ds.fichas";   // atributo y clan por unidad
  var KEY_MIAS  = "caja7ds.propias";  // unidades fuera de la lista meta

  var owned   = {};
  var fichas  = {};   // { idUnidad: { attr: "Velocidad", clan: "Humano" } }
  var propias = [];   // [ { id, nombre, attr, clan } ]
  var nombre  = "";
  var visitando = null;   // nombre del dueño si estamos viendo una caja ajena

  try {
    var saved = localStorage.getItem(KEY);
    if (saved) { owned = JSON.parse(saved) || {}; }
    nombre = localStorage.getItem(KEY_NAME) || "";
    fichas = JSON.parse(localStorage.getItem(KEY_FICHA) || "{}") || {};
    propias = JSON.parse(localStorage.getItem(KEY_MIAS) || "[]") || [];
  } catch (e) { owned = {}; nombre = ""; fichas = {}; propias = []; }

  function save() {
    if (visitando) { return; }   // nunca pisar la caja propia con una ajena
    try {
      localStorage.setItem(KEY, JSON.stringify(owned));
      localStorage.setItem(KEY_NAME, nombre);
      localStorage.setItem(KEY_FICHA, JSON.stringify(fichas));
      localStorage.setItem(KEY_MIAS, JSON.stringify(propias));
    } catch (e) { /* modo privado */ }
  }

  // ----- compartir: codificar / decodificar la caja en la URL -----

  function b64url(s) {
    return btoa(unescape(encodeURIComponent(s)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function unb64url(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) { s += "="; }
    return decodeURIComponent(escape(atob(s)));
  }

  function encodeCaja() {
    var ids = Object.keys(U).filter(function (id) { return !!owned[id]; });
    return b64url(JSON.stringify({ n: nombre, u: ids, f: fichas, p: propias }));
  }

  function leerCajaCompartida() {
    var m = /[#&]c=([A-Za-z0-9\-_]+)/.exec(location.hash || "");
    if (!m) { return null; }
    try {
      var data = JSON.parse(unb64url(m[1]));
      if (!data || !Array.isArray(data.u)) { return null; }
      var o = {};
      data.u.forEach(function (id) { if (U[id]) { o[id] = true; } });
      return {
        nombre: String(data.n || "").slice(0, 40),
        owned: o,
        fichas: (data.f && typeof data.f === "object") ? data.f : {},
        propias: Array.isArray(data.p) ? data.p : []
      };
    } catch (e) { return null; }
  }

  var board  = document.getElementById("board");
  var roster = document.getElementById("roster");

  // ----- build the checklist, grouped by team -----
  TEAMS.forEach(function (t, ti) {
    var block = document.createElement("div");
    block.className = "clan-block";

    var head = document.createElement("div");
    head.className = "clan-head";
    var title = document.createElement("span");
    title.className = "clan-title";
    title.textContent = t.name;
    var use = document.createElement("span");
    use.className = "clan-use";
    use.textContent = t.use;
    head.appendChild(title);
    head.appendChild(use);
    block.appendChild(head);

    t.m.forEach(function (id) {
      var u = U[id];
      var row = document.createElement("label");
      row.className = "unit";

      var box = document.createElement("input");
      box.type = "checkbox";
      box.checked = !!owned[id];
      box.setAttribute("data-unit", id);
      box.addEventListener("change", function () {
        owned[id] = box.checked;
        if (!box.checked) { delete owned[id]; }
        save();
        syncAll(id, box.checked);
        render();
      });

      var text = document.createElement("span");
      text.className = "unit-text";

      var es = document.createElement("span");
      es.className = "unit-es";
      es.textContent = u.es;

      var en = document.createElement("span");
      en.className = "unit-en";
      en.textContent = u.en;

      var meta = document.createElement("span");
      meta.className = "unit-meta";
      var tg = document.createElement("span");
      tg.className = "tag " + (u.tier === "SSS" ? "sss" : u.tier === "SS" ? "ss" : "");
      tg.textContent = "Tier " + u.tier;
      meta.appendChild(tg);
      if (u.duo) {
        var dg = document.createElement("span");
        dg.className = "tag duo";
        dg.textContent = "Unidad dúo";
        meta.appendChild(dg);
      }
      if (u.lock) {
        var lg = document.createElement("span");
        lg.className = "tag lock";
        lg.textContent = "Limitada · " + u.lock;
        meta.appendChild(lg);
      }

      text.appendChild(es);
      text.appendChild(en);
      text.appendChild(meta);
      row.appendChild(box);
      row.appendChild(text);
      block.appendChild(row);
    });

    roster.appendChild(block);
  });

  // ----- build the team board -----
  var cards = TEAMS.map(function (t, i) {
    var card = document.createElement("div");
    card.className = "team-card";

    var head = document.createElement("div");
    head.className = "team-head";
    var nm = document.createElement("span");
    nm.className = "team-name";
    nm.textContent = t.name;
    var ct = document.createElement("span");
    ct.className = "team-count";
    head.appendChild(nm);
    head.appendChild(ct);

    var pips = document.createElement("div");
    pips.className = "pips";
    var pipEls = [];
    for (var k = 0; k < 4; k++) {
      var p = document.createElement("span");
      p.className = "pip";
      pips.appendChild(p);
      pipEls.push(p);
    }

    var miss = document.createElement("div");
    miss.className = "team-missing";

    card.appendChild(head);
    card.appendChild(pips);
    card.appendChild(miss);
    board.appendChild(card);

    return { el: card, count: ct, pips: pipEls, miss: miss, team: t };
  });

  function syncAll(id, val) {
    var boxes = roster.querySelectorAll('input[data-unit="' + id + '"]');
    for (var i = 0; i < boxes.length; i++) { boxes[i].checked = val; }
  }

  function render() {
    var totalOwned = 0;
    for (var id in U) { if (owned[id]) { totalOwned++; } }

    var fullCount = 0;
    var best = null;

    cards.forEach(function (c) {
      var have = c.team.m.filter(function (id) { return !!owned[id]; });
      var missing = c.team.m.filter(function (id) { return !owned[id]; });
      var n = have.length;

      c.count.textContent = n + " / 4";
      c.pips.forEach(function (p, i) {
        if (i < n) { p.classList.add("on"); } else { p.classList.remove("on"); }
      });

      var lockedMissing = missing.filter(function (id) { return !!U[id].lock; });
      var isBlocked = lockedMissing.length > 0;

      var state = n === 4 ? "full" : isBlocked ? "blocked" : n >= 2 ? "close" : "far";
      c.el.setAttribute("data-state", state);

      if (n === 4) {
        fullCount++;
        c.miss.className = "team-missing done";
        c.miss.textContent = "Completo — puedes armarlo ya.";
      } else {
        c.miss.className = "team-missing";
        var html = "Te falta: <b>" + missing.map(function (id) {
          return U[id].es.split(" — ")[0];
        }).join(", ") + "</b>";
        if (isBlocked) {
          html += '<span class="locked-note">Bloqueado · ' + lockedMissing.length +
                  " de esas unidades salió en un banner limitado ya cerrado</span>";
        }
        c.miss.innerHTML = html;
      }

      if (n < 4 && !isBlocked && (!best || n > best.n)) { best = { n: n, team: c.team }; }
      c._blocked = isBlocked;
    });

    var reachable = cards.filter(function (c) { return !c._blocked; }).length;

    document.getElementById("s-units").textContent = totalOwned + " / 37";
    document.getElementById("s-full").textContent = String(fullCount);
    document.getElementById("s-reach").textContent = String(reachable);

    var closeEl = document.getElementById("s-close");
    var noteEl  = document.getElementById("s-close-note");
    if (totalOwned === 0) {
      closeEl.textContent = "—";
      noteEl.textContent = "Marca unidades para empezar";
    } else if (best && best.n > 0) {
      closeEl.textContent = best.team.name;
      noteEl.textContent = "Tienes " + best.n + " de 4 · todo lo que falta se puede conseguir";
    } else if (fullCount > 0) {
      closeEl.textContent = "Todo listo";
      noteEl.textContent = "No queda ninguno a medias";
    } else {
      closeEl.textContent = "Ninguno";
      noteEl.textContent = "Todos los equipos a medias necesitan unidades ya no disponibles";
    }

    buildOutput(totalOwned, fullCount);

    // marcar o desmarcar una unidad cambia qué fichas hay que completar
    // y qué le sirve a cada jefe, así que se redibujan juntas.
    if (typeof elFichas !== "undefined" && elFichas) {
      renderFichas();
      renderPropias();
      renderJefes();
      renderPosibles();
    }
  }

  function buildOutput(totalOwned, fullCount) {
    var lines = [];
    var quien = visitando ? visitando : (nombre || "");
    lines.push("CAJA 7DS DE: " + (quien || "(sin nombre)"));
    lines.push(totalOwned + "/37 unidades meta · " + fullCount + " equipo(s) completo(s)");
    lines.push("");

    var have = [];
    for (var id in U) { if (owned[id]) { have.push(U[id].en); } }
    lines.push("TENGO (" + have.length + "):");
    lines.push(have.length ? have.map(function (x) { return "  - " + x; }).join("\n") : "  (ninguna marcada)");
    lines.push("");
    lines.push("ESTADO POR EQUIPO:");

    TEAMS.forEach(function (t) {
      var missing = t.m.filter(function (id) { return !owned[id]; });
      var n = 4 - missing.length;
      if (missing.length === 0) {
        lines.push("  " + t.name + " — 4/4 COMPLETO");
      } else {
        var blocked = missing.filter(function (id) { return !!U[id].lock; });
        lines.push("  " + t.name + " — " + n + "/4" +
          (blocked.length ? " [BLOQUEADO]" : "") + " · falta: " +
          missing.map(function (id) {
            return U[id].en + (U[id].lock ? " (limitada: " + U[id].lock + ")" : "");
          }).join(", "));
      }
    });

    document.getElementById("output").value = lines.join("\n");
  }

  document.getElementById("btn-copy").addEventListener("click", function () {
    var ta = document.getElementById("output");
    var btn = this;
    ta.removeAttribute("readonly");
    ta.select();
    ta.setSelectionRange(0, 99999);
    var done = false;
    try { done = document.execCommand("copy"); } catch (e) { done = false; }
    ta.setAttribute("readonly", "readonly");

    if (!done && navigator.clipboard) {
      navigator.clipboard.writeText(ta.value).then(function () {
        btn.textContent = "Copiado";
        setTimeout(function () { btn.textContent = "Copiar resumen"; }, 1800);
      }, function () {
        btn.textContent = "Selecciona y copia a mano";
        setTimeout(function () { btn.textContent = "Copiar resumen"; }, 2600);
      });
      return;
    }
    btn.textContent = done ? "Copiado" : "Selecciona y copia a mano";
    setTimeout(function () { btn.textContent = "Copiar resumen"; }, 1800);
  });

  document.getElementById("btn-clear").addEventListener("click", function () {
    if (visitando) { return; }
    owned = {};
    save();
    var boxes = roster.querySelectorAll("input[type=checkbox]");
    for (var i = 0; i < boxes.length; i++) { boxes[i].checked = false; }
    render();
  });

  // ----- perfil: nombre de quien usa la página -----

  var inputNombre = document.getElementById("nombre");
  var quienEs     = document.getElementById("quien-es");

  function pintarTitulo() {
    var h1 = document.querySelector("h1");
    var quien = visitando || nombre;
    if (h1) {
      h1.textContent = quien ? "Caja de " + quien : "Registro de Caja Britannia";
    }
    document.title = (quien ? "Caja de " + quien : "Registro de Caja Britannia") +
                     " \u2014 7DS Grand Cross";
  }

  function pintarNombre() {
    pintarTitulo();
    if (visitando) {
      quienEs.textContent = "Estás viendo la caja de " + visitando;
    } else if (nombre) {
      quienEs.textContent = "Caja de " + nombre;
    } else {
      quienEs.textContent = "Ponle tu nombre para no confundirte con la de tu amigo";
    }
  }

  inputNombre.value = nombre;
  inputNombre.addEventListener("input", function () {
    nombre = inputNombre.value.slice(0, 40);
    save();
    pintarNombre();
    render();
  });

  // ----- compartir la caja por link -----

  document.getElementById("btn-share").addEventListener("click", function () {
    var btn = this;
    var url = location.origin + location.pathname + "#c=" + encodeCaja();
    var campo = document.getElementById("share-url");
    campo.value = url;
    campo.hidden = false;
    campo.select();

    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    if (!ok && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        btn.textContent = "Link copiado";
        setTimeout(function () { btn.textContent = "Compartir mi caja"; }, 1800);
      }, function () {
        btn.textContent = "Copia el link de abajo";
        setTimeout(function () { btn.textContent = "Compartir mi caja"; }, 2600);
      });
      return;
    }
    btn.textContent = ok ? "Link copiado" : "Copia el link de abajo";
    setTimeout(function () { btn.textContent = "Compartir mi caja"; }, 1800);
  });

  document.getElementById("btn-volver").addEventListener("click", function () {
    location.hash = "";
    location.reload();
  });

  // Si pegan un link compartido con la página ya abierta, el navegador no recarga
  // solo porque cambió el hash. Forzamos la recarga para que se aplique.
  window.addEventListener("hashchange", function () {
    location.reload();
  });

  // ----- arranque: ¿venimos de un link compartido? -----

  var compartida = leerCajaCompartida();
  if (compartida) {
    visitando = compartida.nombre || "tu amigo";
    owned = compartida.owned;
    fichas = compartida.fichas;
    propias = compartida.propias;
    document.body.classList.add("modo-visita");
    var boxes = roster.querySelectorAll("input[type=checkbox]");
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].checked = !!owned[boxes[i].getAttribute("data-unit")];
      boxes[i].disabled = true;
    }
  }


  // ================= fichas: atributo y clan por unidad =================

  var elFichas  = document.getElementById("fichas");
  var elPropias = document.getElementById("propias");
  var elJefes   = document.getElementById("jefes");
  var GANA_A    = window.CAJA7DS.GANA_A;

  function selector(opciones, valor, vacio) {
    var sel = document.createElement("select");
    var o0 = document.createElement("option");
    o0.value = ""; o0.textContent = vacio;
    sel.appendChild(o0);
    opciones.forEach(function (op) {
      var o = document.createElement("option");
      o.value = op; o.textContent = op;
      if (op === valor) { o.selected = true; }
      sel.appendChild(o);
    });
    return sel;
  }

  function nombreCorto(id) {
    return U[id].es.split(" \u2014 ")[0];
  }

  function renderFichas() {
    elFichas.innerHTML = "";
    var ids = Object.keys(U).filter(function (id) { return !!owned[id]; });

    if (!ids.length) {
      var vacio = document.createElement("p");
      vacio.className = "vacio";
      vacio.textContent = "Marca unidades en \u201cTu caja\u201d y aparecen ac\u00e1 para completarles atributo y clan.";
      elFichas.appendChild(vacio);
      return;
    }

    ids.forEach(function (id) {
      var f = fichas[id] || {};
      var fila = document.createElement("div");
      fila.className = "ficha";
      if (!f.attr || !f.clan) { fila.classList.add("incompleta"); }

      var nom = document.createElement("span");
      nom.className = "ficha-nombre";
      nom.textContent = nombreCorto(id);

      var selA = selector(ATTRS, f.attr, "Atributo\u2026");
      var selC = selector(CLANES, f.clan, "Clan\u2026");
      selA.disabled = !!visitando;
      selC.disabled = !!visitando;

      selA.addEventListener("change", function () {
        fichas[id] = fichas[id] || {};
        if (selA.value) { fichas[id].attr = selA.value; } else { delete fichas[id].attr; }
        save(); renderFichas(); renderJefes(); renderPosibles();
      });
      selC.addEventListener("change", function () {
        fichas[id] = fichas[id] || {};
        if (selC.value) { fichas[id].clan = selC.value; } else { delete fichas[id].clan; }
        save(); renderFichas(); renderJefes(); renderPosibles();
      });

      var img = document.createElement("input");
      img.type = "url";
      img.className = "ficha-img";
      img.placeholder = "URL del retrato (opcional)";
      img.value = f.img || "";
      img.disabled = !!visitando;
      img.addEventListener("change", function () {
        fichas[id] = fichas[id] || {};
        if (img.value.trim()) { fichas[id].img = img.value.trim(); }
        else { delete fichas[id].img; }
        save(); renderPosibles();
      });

      fila.appendChild(nom);
      fila.appendChild(selA);
      fila.appendChild(selC);
      fila.appendChild(img);
      elFichas.appendChild(fila);
    });
  }

  function renderPropias() {
    elPropias.innerHTML = "";
    propias.forEach(function (u, i) {
      var fila = document.createElement("div");
      fila.className = "ficha";

      var nom = document.createElement("span");
      nom.className = "ficha-nombre";
      nom.textContent = u.nombre;

      var meta = document.createElement("span");
      meta.className = "ficha-meta";
      meta.textContent = (u.attr || "sin atributo") + " \u00b7 " + (u.clan || "sin clan");

      fila.appendChild(nom);
      fila.appendChild(meta);

      if (!visitando) {
        var quitar = document.createElement("button");
        quitar.className = "ghost mini";
        quitar.textContent = "Quitar";
        quitar.addEventListener("click", function () {
          propias.splice(i, 1);
          save(); renderPropias(); renderJefes(); renderPosibles();
        });
        fila.appendChild(quitar);
      }
      elPropias.appendChild(fila);
    });
  }

  // ================= jefes =================

  function unidadesDisponibles() {
    var lista = [];
    Object.keys(U).forEach(function (id) {
      if (!owned[id]) { return; }
      var f = fichas[id] || {};
      lista.push({
        id: id, nombre: nombreCorto(id), attr: f.attr, clan: f.clan,
        tier: U[id].tier,
        img: f.img || U[id].img   // el retrato que ponga el usuario manda sobre el del wiki
      });
    });
    propias.forEach(function (u, i) {
      lista.push({
        id: "propia:" + i, nombre: u.nombre, attr: u.attr, clan: u.clan,
        tier: u.tier, img: u.img
      });
    });
    return lista;
  }

  function renderJefes() {
    elJefes.innerHTML = "";
    var mias = unidadesDisponibles();
    var conFicha = mias.filter(function (u) { return u.attr || u.clan; }).length;

    BOSSES.forEach(function (b) {
      var card = document.createElement("div");
      card.className = "jefe";

      var h = document.createElement("div");
      h.className = "jefe-head";
      var hn = document.createElement("span");
      hn.className = "jefe-nombre"; hn.textContent = b.nombre;
      var hm = document.createElement("span");
      hm.className = "jefe-modo"; hm.textContent = b.modo;
      h.appendChild(hn); h.appendChild(hm);
      card.appendChild(h);

      var ficha = document.createElement("dl");
      ficha.className = "jefe-ficha";
      function dato(k, v) {
        if (!v) { return; }
        var dt = document.createElement("dt"); dt.textContent = k;
        var dd = document.createElement("dd"); dd.textContent = v;
        ficha.appendChild(dt); ficha.appendChild(dd);
      }
      dato("Atributo del jefe", b.attr);
      dato("Ll\u00e9vale", b.counterAttr + (b.debilClan ? " y/o clan " + b.debilClan : ""));
      dato("No lleves", (b.fuerteClan ? "clan " + b.fuerteClan + ", " : "") + "atributo " + GANA_A[b.attr]);
      dato("Recomendado", b.recomendado);
      dato("Inmune a", b.inmune);
      dato("Ojo con", b.notas);
      if (b.cc && b.cc.length) {
        dato("CC recomendado", b.cc.map(function (x) {
          return x[0] + " " + x[1].toLocaleString("es-CL");
        }).join(" \u00b7 "));
      }
      card.appendChild(ficha);

      var sirven = mias.filter(function (u) {
        return (b.counterAttr && u.attr === b.counterAttr) || (b.debilClan && u.clan === b.debilClan);
      });
      var malas = mias.filter(function (u) {
        return (b.fuerteClan && u.clan === b.fuerteClan) || (u.attr && u.attr === GANA_A[b.attr]);
      });

      var res = document.createElement("div");
      res.className = "jefe-match";

      var linea = document.createElement("div");
      if (sirven.length) {
        var ok = document.createElement("span");
        ok.className = "ok";
        ok.textContent = "Te sirven (" + sirven.length + "): ";
        linea.appendChild(ok);
        linea.appendChild(document.createTextNode(
          sirven.map(function (u) {
            var por = [];
            if (b.counterAttr && u.attr === b.counterAttr) { por.push(u.attr); }
            if (b.debilClan && u.clan === b.debilClan) { por.push("clan " + u.clan); }
            return u.nombre + " (" + por.join(" + ") + ")";
          }).join(" · ")
        ));
      } else {
        var pend = document.createElement("span");
        pend.className = "pendiente";
        pend.textContent = !mias.length
          ? "Marca tus unidades para ver qu\u00e9 te sirve."
          : (conFicha === 0
              ? "Completa atributo y clan arriba para ver qu\u00e9 te sirve."
              : "Ninguna de tus unidades con ficha le hace ventaja.");
        linea.appendChild(pend);
      }
      res.appendChild(linea);

      if (malas.length) {
        var ev = document.createElement("div");
        ev.className = "evitar";
        ev.textContent = "En desventaja: " + malas.map(function (u) {
          var por = [];
          if (b.fuerteClan && u.clan === b.fuerteClan) { por.push("clan " + u.clan); }
          if (u.attr && u.attr === GANA_A[b.attr]) { por.push(u.attr); }
          return u.nombre + " (" + por.join(" + ") + ")";
        }).join(" · ");
        res.appendChild(ev);
      }

      card.appendChild(res);
      elJefes.appendChild(card);
    });
  }

  (function () {
    var selA = document.getElementById("propia-attr");
    var selC = document.getElementById("propia-clan");
    selA.appendChild(new Option("Atributo\u2026", ""));
    ATTRS.forEach(function (a) { selA.appendChild(new Option(a, a)); });
    selC.appendChild(new Option("Clan\u2026", ""));
    CLANES.forEach(function (c) { selC.appendChild(new Option(c, c)); });

    document.getElementById("btn-propia").addEventListener("click", function () {
      if (visitando) { return; }
      var inp = document.getElementById("propia-nombre");
      var n = inp.value.trim();
      if (!n) { inp.focus(); return; }
      propias.push({ nombre: n.slice(0, 60), attr: selA.value || undefined, clan: selC.value || undefined });
      inp.value = ""; selA.value = ""; selC.value = "";
      save(); renderPropias(); renderJefes(); renderPosibles();
    });
  })();


  // ================= importar caja desde un resumen pegado =================

  function normalizar(t) {
    return t.replace(/\s+/g, " ").trim().toLowerCase();
  }

  var porNombreEn = {};
  Object.keys(U).forEach(function (id) { porNombreEn[normalizar(U[id].en)] = id; });

  function importarResumen(texto) {
    var lineas = texto.split(/\r?\n/);
    var dentro = false;
    var pedidos = [];

    lineas.forEach(function (l) {
      if (/^\s*TENGO\s*\(/i.test(l)) { dentro = true; return; }
      if (/^\s*ESTADO POR EQUIPO/i.test(l)) { dentro = false; return; }
      if (!dentro) { return; }
      var m = /^\s*-\s+(.*\S)\s*$/.exec(l);
      if (m) { pedidos.push(m[1]); }
    });

    var ok = 0, noEncontradas = [];
    pedidos.forEach(function (nombre) {
      var id = porNombreEn[normalizar(nombre)];
      if (id) { owned[id] = true; ok++; }
      else if (!/ninguna marcada/i.test(nombre)) { noEncontradas.push(nombre); }
    });

    return { total: pedidos.length, ok: ok, fallaron: noEncontradas };
  }

  var btnImportar = document.getElementById("btn-importar");
  if (btnImportar) {
    btnImportar.addEventListener("click", function () {
      if (visitando) { return; }
      var ta = document.getElementById("importar-texto");
      var estado = document.getElementById("importar-estado");
      var texto = ta.value || "";

      if (!texto.trim()) {
        estado.className = "importar-estado malo";
        estado.textContent = "Pega primero el resumen.";
        return;
      }

      var r = importarResumen(texto);

      if (!r.total) {
        estado.className = "importar-estado malo";
        estado.textContent = "No encontr\u00e9 la lista de unidades. El texto tiene que traer la secci\u00f3n \u201cTENGO (n):\u201d con las unidades en l\u00edneas que empiezan con gui\u00f3n.";
        return;
      }

      save();
      var boxes = roster.querySelectorAll("input[data-unit]");
      for (var i = 0; i < boxes.length; i++) {
        boxes[i].checked = !!owned[boxes[i].getAttribute("data-unit")];
      }
      render();

      estado.className = "importar-estado " + (r.fallaron.length ? "aviso" : "bueno");
      estado.textContent = "Marqu\u00e9 " + r.ok + " de " + r.total + " unidades." +
        (r.fallaron.length ? " No reconoc\u00ed: " + r.fallaron.join("; ") + "." : "");
    });
  }

  // ================= equipos que puedes armar con lo tuyo =================

  var elPosibles = document.getElementById("posibles");

  function iniciales(nombre) {
    var limpio = nombre.replace(/[\[\]()]/g, " ").trim();
    var partes = limpio.split(/[\s,]+/).filter(Boolean);
    return partes.slice(0, 2).map(function (x) { return x.charAt(0).toUpperCase(); }).join("");
  }

  function carta(u, rol) {
    var c = document.createElement("div");
    c.className = "carta";
    if (u.attr) { c.setAttribute("data-attr", u.attr); }

    var rolEl = document.createElement("span");
    rolEl.className = "carta-rol" + (rol === "MAIN" ? " main" : "");
    rolEl.textContent = rol;
    c.appendChild(rolEl);

    var marco = document.createElement("div");
    marco.className = "carta-marco";

    if (u.clan) {
      var clanEl = document.createElement("span");
      clanEl.className = "carta-clan";
      clanEl.textContent = u.clan;
      marco.appendChild(clanEl);
    }

    var orbe = document.createElement("span");
    orbe.className = "carta-orbe";
    orbe.title = u.attr || "sin atributo";
    marco.appendChild(orbe);

    if (u.img) {
      var img = document.createElement("img");
      img.className = "carta-retrato";
      img.src = u.img;
      img.alt = u.nombre;
      img.loading = "lazy";
      img.addEventListener("error", function () {
        img.remove();
        var ini = document.createElement("span");
        ini.className = "carta-iniciales";
        ini.textContent = iniciales(u.nombre);
        marco.appendChild(ini);
      });
      marco.appendChild(img);
    } else {
      var ini2 = document.createElement("span");
      ini2.className = "carta-iniciales";
      ini2.textContent = iniciales(u.nombre);
      marco.appendChild(ini2);
    }

    if (u.tier) {
      var tier = document.createElement("span");
      tier.className = "carta-tier";
      tier.textContent = u.tier;
      tier.title = "Tier " + u.tier + " en la lista de la comunidad";
      marco.appendChild(tier);
    }

    c.appendChild(marco);

    var nom = document.createElement("span");
    nom.className = "carta-nombre";
    nom.textContent = u.nombre;
    c.appendChild(nom);

    return c;
  }

  function tarjetaGrupo(titulo, subtitulo, miembros) {
    var wrap = document.createElement("div");
    wrap.className = "equipo-juego";
    wrap.setAttribute("data-state", miembros.length >= 4 ? "full" : miembros.length >= 2 ? "close" : "far");

    var head = document.createElement("div");
    head.className = "equipo-juego-head";
    var nm = document.createElement("span");
    nm.className = "team-name"; nm.textContent = titulo;
    var ct = document.createElement("span");
    ct.className = "team-count";
    ct.textContent = Math.min(miembros.length, 4) + " / 4";
    head.appendChild(nm); head.appendChild(ct);
    wrap.appendChild(head);

    var sub = document.createElement("span");
    sub.className = "clan-use";
    sub.textContent = subtitulo;
    wrap.appendChild(sub);

    var fila = document.createElement("div");
    fila.className = "cartas";
    miembros.slice(0, 4).forEach(function (u, idx) {
      fila.appendChild(carta(u, idx === 0 ? "MAIN" : "MAIN"));
    });
    for (var k = miembros.length; k < 4; k++) {
      var vacia = document.createElement("div");
      vacia.className = "carta";
      var rolV = document.createElement("span");
      rolV.className = "carta-rol"; rolV.textContent = "LIBRE";
      var marcoV = document.createElement("div");
      marcoV.className = "carta-marco";
      var ins = document.createElement("span");
      ins.className = "carta-iniciales"; ins.textContent = "?";
      marcoV.appendChild(ins);
      vacia.appendChild(rolV); vacia.appendChild(marcoV);
      fila.appendChild(vacia);
    }
    wrap.appendChild(fila);

    if (miembros.length > 4) {
      var subs = document.createElement("div");
      subs.className = "cartas suplentes";
      miembros.slice(4).forEach(function (u) { subs.appendChild(carta(u, "SUB")); });
      wrap.appendChild(subs);
    }

    if (miembros.length < 4) {
      var falta = document.createElement("p");
      falta.className = "leyenda-cartas";
      falta.textContent = "Te faltan " + (4 - miembros.length) + " para completarlo.";
      wrap.appendChild(falta);
    }

    return wrap;
  }

  function renderPosibles() {
    if (!elPosibles) { return; }
    elPosibles.innerHTML = "";
    var mias = unidadesDisponibles();
    var conFicha = mias.filter(function (u) { return u.attr || u.clan; });

    if (!conFicha.length) {
      var aviso = document.createElement("p");
      aviso.className = "vacio";
      aviso.textContent = mias.length
        ? "Completa el atributo y el clan de tus unidades m\u00e1s abajo y ac\u00e1 aparecen los equipos que puedes armar."
        : "Marca tus unidades primero.";
      elPosibles.appendChild(aviso);
      return;
    }

    var porAttr = {}, porClan = {};
    conFicha.forEach(function (u) {
      if (u.attr) { (porAttr[u.attr] = porAttr[u.attr] || []).push(u); }
      if (u.clan) { (porClan[u.clan] = porClan[u.clan] || []).push(u); }
    });

    var grupos = [];
    Object.keys(porAttr).forEach(function (a) {
      grupos.push({ t: "Equipo " + a, s: "Por atributo", m: porAttr[a] });
    });
    Object.keys(porClan).forEach(function (c) {
      if (c === "Otro") { return; }
      grupos.push({ t: "Equipo " + c, s: "Por clan", m: porClan[c] });
    });

    grupos.sort(function (x, y) { return y.m.length - x.m.length; });
    grupos = grupos.filter(function (g) { return g.m.length >= 2; });

    if (!grupos.length) {
      var v = document.createElement("p");
      v.className = "vacio";
      v.textContent = "Todav\u00eda no tienes 2 unidades que compartan atributo o clan.";
      elPosibles.appendChild(v);
      return;
    }

    grupos.forEach(function (g) {
      elPosibles.appendChild(tarjetaGrupo(g.t, g.s, g.m));
    });
  }

  pintarNombre();
  render();
  renderFichas();
  renderPropias();
  renderJefes();
  renderPosibles();
})();