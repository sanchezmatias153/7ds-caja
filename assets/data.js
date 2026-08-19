/* Base de datos de unidades y equipos meta de 7DS: Grand Cross.
   Fuente: wiki de la comunidad, PVP Teams (act. 06-08-2026).
   Para agregar una unidad nueva: añádela a UNITS y mételá en el equipo que corresponda.
   El campo `lock` marca unidades de banners limitados ya cerrados. */

window.CAJA7DS = (function () {
  var UNITS = {
    skuld:      { es: "Skuld, Diosa del Destino — [Desafía-Destinos]", en: "(Destiny Defier) Goddess of Fate Skuld", tier: "SSS" },
    hel:        { es: "Hel, Reposo de las Almas — [Prefecta Íntegra]", en: "(Principled Prefect) Repose of Souls Hel", tier: "SS" },
    tyr:        { es: "Tyr, Dios de la Guerra — [Juventud Ardiente]", en: "(Fiery Youth) God of War Tyr — verde", tier: "SS" },
    dianeShine: { es: "Diane, Bendición de la Tierra — [Deseo Brillante]", en: "(Shining Wish) Blessing of the Earth Diane", tier: "SS" },
    kingDiane:  { es: "King y Diane — [Soberanos de la Nueva Era]", en: "(Rulers of the New Era) King & Diane", tier: "SSS", duo: true, lock: "6° Aniversario, may-2026" },
    loki:       { es: "Loki, Dios del Engaño — [Caos Desterrado]", en: "(Banished Chaos) God of Mischief Loki", tier: "SS" },
    drole:      { es: "Drole de la Paciencia, Gran Guerrero", en: "Great Warrior Drole of Patience", tier: "S" },
    tristan:    { es: "Tristán, Caballero de la Profecía — [Luz de Liones]", en: "(Light of Liones) Knight of the Prophecy Tristan", tier: "SSS" },
    lancelot:   { es: "Lancelot, Joven Caballero — [Linaje de Héroe]", en: "(Hero's Bloodline) Young Knight Lancelot", tier: "SS", lock: "5.5° Aniversario Supernova, nov-2024" },
    anghalhad:  { es: "Anghalhad, Chica Valiente — [Dulce Tentación]", en: "(Sweet Temptation) Brave Girl Anghalhad — roja", tier: "S" },
    shinra:     { es: "Shinra Kusakabe — [Héroe de las Llamas]", en: "(Hero of Flames) Shinra Kusakabe", tier: "SS", lock: "Colab Fire Force" },
    nemesis:    { es: "Nemesis Meliodas", en: "(The Seven Deadly Sins) Nemesis Meliodas", tier: "SSS", lock: "7° Aniversario, may-2026" },
    estarossa:  { es: "Estarossa", en: "LR Estarossa — verde", tier: "SSS" },
    demonKing:  { es: "Rey Demonio Opresor — [Control Incompleto]", en: "(Incomplete Control) Oppressor Demon King", tier: "SSS" },
    chandler:   { es: "Chandler, Mago — [Archisacerdote de la Desesperación]", en: "(Archpriest of Despair) Mage Chandler — verde", tier: "S" },
    cusack:     { es: "Cusack, Espadachín Dual — [Segador Dormilón]", en: "LR (Napping Reaper) Dual Swordsman Cusack", tier: "SS" },
    gelda:      { es: "Gelda, Guardiana de la Promesa — [Verano Apasionado]", en: "(Passionate Summer) Promise Keeper Gelda", tier: "SS" },
    sbabea:     { es: "Sbabea", en: "LR Sbabea", tier: "SSS", lock: "Unidad de colaboración, cerrada" },
    riyo:       { es: "Riyo", en: "Riyo", tier: "SSS", lock: "Colab Gachiakuta, cerró 16-jul-2026" },
    enjin:      { es: "Enjin", en: "Enjin", tier: "SSS", lock: "Colab Gachiakuta, cerró 16-jul-2026" },
    taizoo:     { es: "Taizoo, Campeón — [Festival de Lucha de Vaizel]", en: "(Vaizel Fight Festival) Champion Taizoo — rojo", tier: "S" },
    rudo:       { es: "Rudo", en: "Rudo", tier: "SS", lock: "Colab Gachiakuta, cerró 16-jul-2026" },
    zanka:      { es: "Zanka", en: "Zanka", tier: "S", lock: "Colab Gachiakuta, cerró 16-jul-2026" },
    roxy:       { es: "Roxy de la Locura — [Sierra Vengativa]", en: "LR (Vengeful Saw Blade) Roxy of Madness — azul", tier: "SSS" },
    salos:      { es: "Salos Pesadilla — [Cadenas de Desesperación]", en: "(Chains of Despair) Nightmare Salos", tier: "SSS", lock: "6° Aniversario, feb-2026" },
    sabunak:    { es: "Sabunak Pesadilla — [Sombra Abisal]", en: "(Abyssal Shadow) Nightmare Sabunak — rojo", tier: "SSS", lock: "6° Aniversario, feb-2026" },
    merlEsc:    { es: "Merlín y Escanor — [Juramento del Ocaso]", en: "(Dusk's Oath) Merlin & Escanor", tier: "SSS", duo: true },
    emilia:     { es: "Emilia — colab Re:ZERO", en: "Red Emilia", tier: "SSS", lock: "Colab Re:ZERO, abr-2026" },
    kingTree:   { es: "King, Guardián del Árbol — [Compañero de Clase]", en: "(Friendly Classmate) Tree Guardian King", tier: "SSS", lock: "Selección Nuevo Semestre, mar-2026" },
    tioreh:     { es: "Tioreh", en: "Blue Tioreh", tier: "S" },
    elaineXmas: { es: "Elaine de Navidad", en: "LR Christmas Elaine — roja", tier: "SSS" },
    banTrans:   { es: "Ban Trascendente — [Manos que Ayudan]", en: "Helping Hands Transcendent Ban", tier: "SSS" },
    anotherMeli:{ es: "Another Meliodas (el Meliodas mujer)", en: "(A Twisted World) Another Meliodas", tier: "SSS", lock: "Cross: IF, cerró 19-ago-2026" },
    anotherBan: { es: "Another Ban (el Ban mujer)", en: "(A Twisted World) Another Ban", tier: "SSS", lock: "Cross: IF, cerró 19-ago-2026" },
    mael:       { es: "Mael, Ángel de la Desesperación — [Alas Ennegrecidas]", en: "(Blackened Wings) Angel of Despair Mael", tier: "SS" },
    elizabeth:  { es: "Reina Elizabeth — [Regalo de Nieve]", en: "(Gift of the Snow) Queen Elizabeth", tier: "SS" },
    sariel:     { es: "Sariel, Pacto de Luz — [Vientos de Esperanza]", en: "(Winds of Hope) Covenant of Light Sariel — rojo", tier: "S" }
  };

  var TEAMS = [
    { name: "Ragnarok",            use: "Facción nórdica",      m: ["skuld","hel","tyr","dianeShine"] },
    { name: "Gigantes",            use: "Clan Gigante",         m: ["skuld","kingDiane","loki","drole"] },
    { name: "Apocalipsis",         use: "4 Caballeros",         m: ["tristan","lancelot","anghalhad","shinra"] },
    { name: "Demonios · versión A", use: "Clan Demonio",        m: ["nemesis","estarossa","demonKing","chandler"] },
    { name: "Demonios · versión B", use: "Clan Demonio",        m: ["nemesis","demonKing","cusack","gelda"] },
    { name: "Humanos · versión A",  use: "Clan Humano",         m: ["sbabea","riyo","enjin","taizoo"] },
    { name: "Humanos · versión B",  use: "Clan Humano",         m: ["rudo","riyo","enjin","zanka"] },
    { name: "Sacrificio · versión A", use: "Daño por sacrificio", m: ["roxy","salos","sabunak","merlEsc"] },
    { name: "Sacrificio · versión B", use: "Daño por sacrificio", m: ["hel","salos","sabunak","merlEsc"] },
    { name: "Hadas · versión A",   use: "Clan Hada",            m: ["sbabea","emilia","kingTree","tioreh"] },
    { name: "Hadas · versión B",   use: "Clan Hada",            m: ["sbabea","kingTree","elaineXmas","merlEsc"] },
    { name: "Pecados · versión A", use: "Los 7 Pecados",        m: ["nemesis","merlEsc","kingTree","banTrans"] },
    { name: "Pecados · versión B", use: "Los 7 Pecados",        m: ["nemesis","anotherMeli","anotherBan","merlEsc"] },
    { name: "Diosas",              use: "Clan Diosa",           m: ["tristan","mael","elizabeth","sariel"] }
  ];

  return { UNITS: UNITS, TEAMS: TEAMS };
})();
