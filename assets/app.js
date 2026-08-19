(function () {
  "use strict";

  var U = window.CAJA7DS.UNITS;
  var TEAMS = window.CAJA7DS.TEAMS;



  var KEY = "caja7ds.v1";
  var owned = {};

  try {
    var saved = localStorage.getItem(KEY);
    if (saved) { owned = JSON.parse(saved) || {}; }
  } catch (e) { owned = {}; }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(owned)); } catch (e) { /* modo privado */ }
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
  }

  function buildOutput(totalOwned, fullCount) {
    var lines = [];
    lines.push("MI CAJA 7DS — " + totalOwned + "/37 unidades meta · " + fullCount + " equipo(s) completo(s)");
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
    owned = {};
    save();
    var boxes = roster.querySelectorAll("input[type=checkbox]");
    for (var i = 0; i < boxes.length; i++) { boxes[i].checked = false; }
    render();
  });

  render();
})();