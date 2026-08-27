/* Base de datos de unidades y equipos meta de 7DS: Grand Cross.
   Fuente: wiki de la comunidad, PVP Teams (act. 06-08-2026).
   Para agregar una unidad nueva: añádela a UNITS y mételá en el equipo que corresponda.
   El campo `lock` marca unidades de banners limitados ya cerrados. */

window.CAJA7DS = (function () {
  var UNITS = {
    skuld:      { es: "Skuld, Diosa del Destino — [Desafía-Destinos]", en: "(Destiny Defier) Goddess of Fate Skuld", tier: "SSS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/3/3d/%28Destiny_Defier%29_Goddess_of_Fate_Skuld.png/revision/latest/scale-to-width-down/128" },
    hel:        { es: "Hel, Reposo de las Almas — [Prefecta Íntegra]", en: "(Principled Prefect) Repose of Souls Hel", tier: "SS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/8/8b/%28Principled_Prefect%29_Repose_of_Souls_Hel.png/revision/latest/scale-to-width-down/128" },
    tyr:        { es: "Tyr, Dios de la Guerra — [Juventud Ardiente]", en: "(Fiery Youth) God of War Tyr — verde", tier: "SS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/9/9f/%28Fiery_Youth%29_God_of_War_Tyr.png/revision/latest/scale-to-width-down/128" },
    dianeShine: { es: "Diane, Bendición de la Tierra — [Deseo Brillante]", en: "(Shining Wish) Blessing of the Earth Diane", tier: "SS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/d/d9/%28Shining_Wish%29_Blessing_of_the_Earth_Diane.png/revision/latest/scale-to-width-down/128" },
    kingDiane:  { es: "King y Diane — [Soberanos de la Nueva Era]", en: "(Rulers of the New Era) King & Diane", tier: "SSS", duo: true, lock: "6° Aniversario, may-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/c/c6/%28Rulers_of_the_New_Era%29_King_%26_Diane.png/revision/latest/scale-to-width-down/128" },
    loki:       { es: "Loki, Dios del Engaño — [Caos Desterrado]", en: "(Banished Chaos) God of Mischief Loki", tier: "SS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/3/30/%28Banished_Chaos%29_God_of_Mischief_Loki.png/revision/latest/scale-to-width-down/128" },
    drole:      { es: "Drole de la Paciencia, Gran Guerrero", en: "Great Warrior Drole of Patience", tier: "S", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/7/74/Drole_of_Patience.png/revision/latest/scale-to-width-down/128" },
    tristan:    { es: "Tristán, Caballero de la Profecía — [Luz de Liones]", en: "(Light of Liones) Knight of the Prophecy Tristan", tier: "SSS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/5/54/%28Light_of_Liones%29_Knight_of_the_Prophecy_Tristan.png/revision/latest/scale-to-width-down/128" },
    lancelot:   { es: "Lancelot, Joven Caballero — [Linaje de Héroe]", en: "(Hero's Bloodline) Young Knight Lancelot", tier: "SS", lock: "5.5° Aniversario Supernova, nov-2024", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/a/ad/%28Hero%27s_Bloodline%29_Young_Knight_Lancelot.png/revision/latest/scale-to-width-down/128" },
    anghalhad:  { es: "Anghalhad, Chica Valiente — [Dulce Tentación]", en: "(Sweet Temptation) Brave Girl Anghalhad — roja", tier: "S", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/6/63/%28Sweet_Temptation%29_Brave_Girl_Anghalhad.png/revision/latest/scale-to-width-down/128" },
    shinra:     { es: "Shinra Kusakabe — [Héroe de las Llamas]", en: "(Hero of Flames) Shinra Kusakabe", tier: "SS", lock: "Colab Fire Force", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/3/38/%28Hero_of_Flames%29_Shinra_Kusakabe.png/revision/latest/scale-to-width-down/128" },
    nemesis:    { es: "Nemesis Meliodas", en: "(The Seven Deadly Sins) Nemesis Meliodas", tier: "SSS", lock: "7° Aniversario, may-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/b/ba/Nemesis_Meliodas.png/revision/latest/scale-to-width-down/128" },
    estarossa:  { es: "Estarossa", en: "LR Estarossa — verde", tier: "SSS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/9/9a/LR_estarossa.png/revision/latest/scale-to-width-down/128" },
    demonKing:  { es: "Rey Demonio Opresor — [Control Incompleto]", en: "(Incomplete Control) Oppressor Demon King", tier: "SSS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/2/21/%28Incomplete_Control%29_Oppressor_Demon_King.png/revision/latest/scale-to-width-down/128" },
    chandler:   { es: "Chandler, Mago — [Archisacerdote de la Desesperación]", en: "(Archpriest of Despair) Mage Chandler — verde", tier: "S", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/2/29/%28Archpriest_of_Despair%29_Mage_Chandler.png/revision/latest/scale-to-width-down/128" },
    cusack:     { es: "Cusack, Espadachín Dual — [Segador Dormilón]", en: "LR (Napping Reaper) Dual Swordsman Cusack", tier: "SS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/2/2c/LR_%28Napping_Reaper%29_Dual_Swordsman_Cusack.png/revision/latest/scale-to-width-down/128" },
    gelda:      { es: "Gelda, Guardiana de la Promesa — [Verano Apasionado]", en: "(Passionate Summer) Promise Keeper Gelda", tier: "SS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/d/d8/%28Passionate_Summer%29_Promise_Keeper_Gelda.png/revision/latest/scale-to-width-down/128" },
    sbabea:     { es: "Sbabea", en: "LR Sbabea", tier: "SSS", lock: "Unidad de colaboración, cerrada", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/1/19/LrSbabea.png/revision/latest/scale-to-width-down/128" },
    riyo:       { es: "Riyo", en: "Riyo", tier: "SSS", lock: "Colab Gachiakuta, cerró 16-jul-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/f/fd/Riyo.png/revision/latest/scale-to-width-down/128" },
    enjin:      { es: "Enjin", en: "Enjin", tier: "SSS", lock: "Colab Gachiakuta, cerró 16-jul-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/c/c2/Enjin.png/revision/latest/scale-to-width-down/128" },
    taizoo:     { es: "Taizoo, Campeón — [Festival de Lucha de Vaizel]", en: "(Vaizel Fight Festival) Champion Taizoo — rojo", tier: "S", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/d/d3/%28Vaizel_Fight_Festival%29_Champion_Taizoo.png/revision/latest/scale-to-width-down/128" },
    rudo:       { es: "Rudo", en: "Rudo", tier: "SS", lock: "Colab Gachiakuta, cerró 16-jul-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/e/e1/Rudo.png/revision/latest/scale-to-width-down/128" },
    zanka:      { es: "Zanka", en: "Zanka", tier: "S", lock: "Colab Gachiakuta, cerró 16-jul-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/8/86/Zanka.png/revision/latest/scale-to-width-down/128" },
    roxy:       { es: "Roxy de la Locura — [Sierra Vengativa]", en: "LR (Vengeful Saw Blade) Roxy of Madness — azul", tier: "SSS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/f/f1/LR_%28Vengeful_Saw_Blade%29_Roxy_of_Madness.png/revision/latest/scale-to-width-down/128" },
    salos:      { es: "Salos Pesadilla — [Cadenas de Desesperación]", en: "(Chains of Despair) Nightmare Salos", tier: "SSS", lock: "6° Aniversario, feb-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/5/59/%28Chains_of_Despair%29_Nightmare_Salos.png/revision/latest/scale-to-width-down/128" },
    sabunak:    { es: "Sabunak Pesadilla — [Sombra Abisal]", en: "(Abyssal Shadow) Nightmare Sabunak — rojo", tier: "SSS", lock: "6° Aniversario, feb-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/b/ba/%28Abyssal_Shadow%29_Nightmare_Sabunak.png/revision/latest/scale-to-width-down/128" },
    merlEsc:    { es: "Merlín y Escanor — [Juramento del Ocaso]", en: "(Dusk's Oath) Merlin & Escanor", tier: "SSS", duo: true, img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/1/16/%28Dusk%27s_Oath%29_Merlin_%26_Escanor.png/revision/latest/scale-to-width-down/128" },
    emilia:     { es: "Emilia — colab Re:ZERO", en: "Red Emilia", tier: "SSS", lock: "Colab Re:ZERO, abr-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/d/dd/Red_Emilia_icon.png/revision/latest/scale-to-width-down/128" },
    kingTree:   { es: "King, Guardián del Árbol — [Compañero de Clase]", en: "(Friendly Classmate) Tree Guardian King", tier: "SSS", lock: "Selección Nuevo Semestre, mar-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/0/04/%28Friendly_Classmate%29_Tree_Guardian_King.png/revision/latest/scale-to-width-down/128" },
    tioreh:     { es: "Tioreh", en: "Blue Tioreh", tier: "S", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/3/39/Blue_Tioreh.png/revision/latest/scale-to-width-down/128" },
    elaineXmas: { es: "Elaine de Navidad", en: "LR Christmas Elaine — roja", tier: "SSS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/5/5f/LR_Christmas_Elaine.png/revision/latest/scale-to-width-down/128" },
    banTrans:   { es: "Ban Trascendente — [Manos que Ayudan]", en: "Helping Hands Transcendent Ban", tier: "SSS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/4/44/Helping_Hands_Transcendent_Ban.png/revision/latest/scale-to-width-down/128" },
    anotherMeli:{ es: "Another Meliodas (el Meliodas mujer)", en: "(A Twisted World) Another Meliodas", tier: "SSS", lock: "Cross: IF, cerró 19-ago-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/5/56/Anr_meliodas.png/revision/latest/scale-to-width-down/128" },
    anotherBan: { es: "Another Ban (el Ban mujer)", en: "(A Twisted World) Another Ban", tier: "SSS", lock: "Cross: IF, cerró 19-ago-2026", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/6/63/Anr_ban.png/revision/latest/scale-to-width-down/128" },
    mael:       { es: "Mael, Ángel de la Desesperación — [Alas Ennegrecidas]", en: "(Blackened Wings) Angel of Despair Mael", tier: "SS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/a/ab/%28Blackened_Wings%29_Angel_of_Despair_Mael.png/revision/latest/scale-to-width-down/128" },
    elizabeth:  { es: "Reina Elizabeth — [Regalo de Nieve]", en: "(Gift of the Snow) Queen Elizabeth", tier: "SS", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/d/df/%28Gift_of_the_Snow%29_Queen_Elizabeth.png/revision/latest/scale-to-width-down/128" },
    sariel:     { es: "Sariel, Pacto de Luz — [Vientos de Esperanza]", en: "(Winds of Hope) Covenant of Light Sariel — rojo", tier: "S", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/b/b9/%28Winds_of_Hope%29_Covenant_of_Light_Sariel.png/revision/latest/scale-to-width-down/128" },
    gawain:     { es: "Gawain, Caballero del Sol — [Magia Dorada]", en: "(Gold-Colored Magic) Knight of the Sun Gawain", tier: "SSS", activa: "Festival 6.5° Aniversario — garantizado a 900 de mileage", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/a/a9/Knight_of_the_Sun_Gawain.png/revision/latest/scale-to-width-down/128" },
    percival:   { es: "Percival, Pequeño Héroe — [Poder Desconocido]", en: "(Unknown Power) Little Hero Percival", tier: "S", img: "https://static.wikia.nocookie.net/7dsgc_mobile_game/images/8/8f/%28Unknown_Power%29_Little_Hero_Percival.png/revision/latest/scale-to-width-down/128" }
  };

  var TEAMS = [
    { name: "Ragnarok",              use: "Facción nórdica",       m: ["skuld","hel","tyr","dianeShine"] },
    { name: "Gigantes",              use: "Clan Gigante",          m: ["skuld","kingDiane","loki","drole"] },
    { name: "Apocalipsis",           use: "4 Caballeros",          m: ["tristan","gawain","percival","tioreh"] },
    { name: "Demonios",              use: "Clan Demonio",          m: ["nemesis","estarossa","anotherMeli","chandler"] },
    { name: "Humanos · versión A",   use: "Clan Humano",           m: ["sbabea","riyo","enjin","taizoo"] },
    { name: "Humanos · versión B",   use: "Clan Humano",           m: ["rudo","riyo","enjin","taizoo"] },
    { name: "Sacrificio · versión A", use: "Daño por sacrificio",  m: ["roxy","salos","sabunak","merlEsc"] },
    { name: "Sacrificio · versión B", use: "Daño por sacrificio",  m: ["hel","salos","sabunak","merlEsc"] },
    { name: "Hadas · versión A",     use: "Clan Hada",             m: ["sbabea","emilia","kingTree","tioreh"] },
    { name: "Hadas · versión B",     use: "Clan Hada",             m: ["sbabea","kingTree","elaineXmas","merlEsc"] },
    { name: "Pecados · versión A",   use: "Los 7 Pecados",         m: ["nemesis","merlEsc","kingTree","banTrans"] },
    { name: "Pecados · versión B",   use: "Los 7 Pecados",         m: ["nemesis","anotherMeli","anotherBan","merlEsc"] },
    { name: "Diosas",                use: "Clan Diosa",            m: ["tristan","mael","elizabeth","sariel"] }
  ];

  /* Atributos y clanes del juego. El triangulo es: Fuerza > HP > Velocidad > Fuerza. */
  var ATTRS = ["Fuerza", "Velocidad", "HP", "Luz", "Oscuridad"];
  var GANA_A = { Fuerza: "HP", HP: "Velocidad", Velocidad: "Fuerza" };
  var CLANES = ["Humano", "Gigante", "Hada", "Demonio", "Diosa", "Otro"];

  /* Jefes de Death Match. Datos del wiki de la comunidad, fichas por jefe.
     counterAttr = el atributo que le gana (el jefe es debil a ese). */
  var BOSSES = [
    {
      id: "redDemon", nombre: "Demonio Rojo", en: "Red Demon", modo: "Death Match",
      attr: "Fuerza", counterAttr: "Velocidad",
      debilClan: "Humano", fuerteClan: "Hada",
      recomendado: "Freeze o Petrify. Las habilidades con efecto Carga le hacen +50%.",
      inmune: "Sangrado, Veneno, Shock y Corrosion (dano en el tiempo)",
      notas: "Toma postura al inicio y cada 3 turnos: +50% HP y -30% dano recibido. Los ultimates le hacen -30%, asi que no son tu fuente principal de dano. En Infierno solo se permiten Azul, Luz y Oscuridad.",
      cc: [["Normal", 80000], ["Dificil", 120000], ["Extremo", 160000], ["Infierno", 300000]]
    },
    {
      id: "grayDemon", nombre: "Demonio Gris", en: "Gray Demon", modo: "Death Match",
      attr: "Velocidad", counterAttr: "HP",
      debilClan: "Hada", fuerteClan: "Gigante",
      recomendado: "Ataques a distancia mientras tenga el buff de Vuelo.",
      inmune: "Debuff y Dissolve. El control y el drenaje de barra de ultimate NO le afectan.",
      notas: "Mientras tenga el buff de Vuelo, los ataques cuerpo a cuerpo no le hacen nada. El Bad Blood de King le baja el dano un 30%.",
      cc: [["Normal", 100000], ["Dificil", 140000], ["Extremo", 180000], ["Infierno", 300000]]
    },
    {
      id: "howlex", nombre: "Howlex (Demonio Carmesi)", en: "Howlex (Crimson Demon)", modo: "Death Match",
      attr: "HP", counterAttr: "Fuerza",
      debilClan: "Demonio", fuerteClan: "Diosa",
      recomendado: "Ignite, Punto Debil e Infect. Recibe +50% de dano extra por Punto Debil.",
      inmune: "Incapacitacion, Disable y reduccion de stats",
      notas: "Reduce un 30% el dano de los contraataques. El Bad Blood de Meliodas le baja el dano un 30%.",
      cc: []
    },
    {
      id: "originalDemon", nombre: "Demonio Original", en: "Original Demon", modo: "Death Match",
      attr: "HP", counterAttr: "Fuerza",
      debilClan: "Gigante", fuerteClan: "Diosa",
      recomendado: "Taunt, Cancelar Debuffs y Power Strike.",
      inmune: "(sin inmunidades destacadas)",
      notas: "En fases 1 y 2 no puedes quitarle mas del 40% de su HP maximo con un solo ataque, asi que el dano de un golpe no sirve. El Bad Blood de Diane le baja el dano un 30%.",
      cc: []
    },
    {
      id: "bellmoth", nombre: "Bellmoth", en: "Bellmoth", modo: "Death Match",
      attr: "Velocidad", counterAttr: "HP",
      debilClan: null, fuerteClan: null,
      recomendado: "Cancelar Posturas y ataques con Carga.",
      inmune: "Esquiva los ataques a distancia (menos los ultimates)",
      notas: "Reduce un 50% el dano de los ultimates. Toma postura cada 2 turnos. No tiene ventaja ni desventaja de clan. El Bad Blood de Jericho le baja el dano un 30%.",
      cc: []
    }
  ];

  return { UNITS: UNITS, TEAMS: TEAMS, BOSSES: BOSSES, ATTRS: ATTRS, CLANES: CLANES, GANA_A: GANA_A };
})();
