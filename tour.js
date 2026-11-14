/* ==================================================================
   The guided demo ("Run demo").

   PART 1 is the story, as plain data. Edit the words here.
   PART 2 draws the cartoon characters.
   PART 3 is the player. It plays the story on top of the real page:
   the cursor presses the real buttons, and the numbers on screen are
   the calculator's own results for the story's factory.

   The visitor's own numbers are put aside when the demo starts and
   put back when it ends.
================================================================== */
(function () {
  "use strict";

  /* ================= PART 1: THE STORY ================= */

  var CHAPTERS = [
    { en: "Welcome", ar: "مرحبًا" },
    { en: "Hassan's guess", ar: "تقدير حسن" },
    { en: "The bill nobody sends", ar: "فاتورة لا يرسلها أحد" },
    { en: "Karim is not so sure", ar: "كريم غير مقتنع" },
    { en: "One week later", ar: "بعد أسبوع" },
    { en: "What it is worth", ar: "كم يساوي الحل" },
    { en: "Your turn", ar: "دورك" }
  ];

  var SPEAKERS = {
    hassan: { en: "Hassan, factory owner", ar: "حسن، صاحب المصنع" },
    karim: { en: "Karim, shift supervisor", ar: "كريم، مشرف الوردية" },
    daim: { en: "Da'im", ar: "دائم" }
  };

  /* The story's factory. Hassan's first guess is three breakdowns; the cursor corrects it to two. */
  var SEED = {
    days: 6, shifts: 1, hours: 8, mode: "estimate", breakdowns: 3, avgHours: 2, smallMin: 0, share: 1,
    sales: 1500000, material: 55, workers: 20, wage: 8000, recover: 0, repair: 5000, scrap: 1500, penalty: 0,
    whatif: 30, touched: true
  };

  /* Karim's week: [days ago, minutes stopped, note]. Two long breakdowns, nine short stops. */
  var WEEK = [
    [7, 47, { en: "Machine 3, jam", ar: "الماكينة 3، تعليق" }],
    [7, 12, { en: "Waiting for material", ar: "انتظار خامة" }],
    [6, 15, { en: "Machine 1, adjustment", ar: "الماكينة 1، ضبط" }],
    [5, 180, { en: "Machine 2, heater", ar: "الماكينة 2، السخان" }],
    [5, 10, { en: "Machine 3, jam", ar: "الماكينة 3، تعليق" }],
    [4, 20, { en: "Changeover ran late", ar: "تأخر تغيير الاسطمبة" }],
    [3, 8, { en: "Machine 1, adjustment", ar: "الماكينة 1، ضبط" }],
    [2, 25, { en: "Waiting for material", ar: "انتظار خامة" }],
    [1, 18, { en: "Machine 3, jam", ar: "الماكينة 3، تعليق" }],
    [1, 14, { en: "Machine 2, sensor", ar: "الماكينة 2، الحساس" }],
    [0, 22, { en: "Machine 1, adjustment", ar: "الماكينة 1، ضبط" }]
  ];
  var JAM_NOTE = WEEK[0][2];

  /* Words in {curly brackets} are filled in from the calculator's live result. */
  var BEATS = [
    { chapter: 0, kind: "card", scene: "intro",
      title: { en: "What do stoppages really cost?", ar: "كم تكلّف التوقفات فعلًا؟" },
      text: { en: "A two-minute story about a factory owner, his shift supervisor, and a number nobody had ever added up.",
              ar: "قصة في دقيقتين عن صاحب مصنع ومشرف ورديته ورقم لم يجمعه أحد من قبل." } },

    { chapter: 1, kind: "card", scene: "hassan", mood: "worried", prop: "bill",
      title: { en: "Meet Hassan", ar: "تعرّف على حسن" },
      text: { en: "He owns a small plastics factory. When a machine stops, he calls the technician, pays the bill and moves on. He has never added it up.",
              ar: "يملك مصنع بلاستيك صغيرًا. عندما تتوقف ماكينة يتصل بالفني ويدفع الفاتورة ويكمل يومه. لم يجمع هذه التكاليف ولو مرة." } },
    { chapter: 1, kind: "screen", target: "#step1", who: "daim",
      text: { en: "Hassan opens the free calculator. Six days a week, one eight-hour shift: about 208 working hours a month.",
              ar: "يفتح حسن الحاسبة المجانية. ستة أيام في الأسبوع ووردية واحدة من ثماني ساعات: حوالي 208 ساعة تشغيل في الشهر." } },
    { chapter: 1, kind: "screen", target: "#estimateBox", click: '[data-for="breakdowns"][data-dir="-1"]', who: "hassan",
      text: { en: "“Three breakdowns a month? No, two. About two hours each. Small stops? I never counted those.”",
              ar: "«ثلاثة أعطال في الشهر؟ لا، اثنان. كل عطل ساعتان تقريبًا. والتوقفات الصغيرة؟ لم أعدّها أبدًا.»" } },
    { chapter: 1, kind: "screen", target: "#worthBox", who: "hassan",
      text: { en: "He sells about 1.5 million pounds a month. A little over half of that goes on plastic and packaging.",
              ar: "مبيعاته حوالي 1.5 مليون جنيه في الشهر، وأكثر من نصفها بقليل يذهب للخامات والتعبئة." } },

    { chapter: 2, kind: "card", scene: "bill",
      title: { en: "The bill nobody sends", ar: "فاتورة لا يرسلها أحد" },
      text: { en: "Stoppages never arrive as an invoice. The calculator adds them up while Hassan answers.",
              ar: "التوقفات لا تأتي في فاتورة. الحاسبة تجمعها وحسن يجيب عن الأسئلة." } },
    { chapter: 2, kind: "screen", target: "#headline", who: "daim",
      text: { en: "About {year} a year, from two breakdowns a month. Hassan had never seen it as one number.",
              ar: "حوالي {year} في السنة من عطلين في الشهر. لم يرَ حسن هذا الرقم مجموعًا من قبل." } },
    { chapter: 2, kind: "screen", target: "#boardBlock", who: "daim",
      text: { en: "Each square is a working day. The red is production that stoppages took away, and it comes back every month.",
              ar: "كل مربع يوم عمل. الأحمر إنتاج أخذته التوقفات، ويتكرر كل شهر." } },
    { chapter: 2, kind: "screen", target: "#rowsBlock", who: "daim",
      text: { en: "The biggest part is not the repair bill. It is the sales he could not make while the line stood still.",
              ar: "الجزء الأكبر ليس فاتورة الإصلاح، بل المبيعات التي لم تتحقق والخط متوقف." } },

    { chapter: 3, kind: "card", scene: "karim", mood: "worried", prop: "phone",
      title: { en: "Karim is not so sure", ar: "كريم غير مقتنع" },
      text: { en: "Karim runs the shift. “Only two? The machines stop far more often than that. We just never write it down.”",
              ar: "كريم يدير الوردية. «عطلان فقط؟ الماكينات تتوقف أكثر من ذلك بكثير، لكننا لا نكتب شيئًا.»" } },
    { chapter: 3, kind: "screen", target: '[data-seg="mode"]', click: '[data-seg="mode"] [data-val="log"]', who: "daim",
      text: { en: "So they stop guessing. The calculator has a second way in, for people who do not know their numbers.",
              ar: "فيتوقفان عن التخمين. في الحاسبة طريق آخر لمن لا يعرف أرقامه." } },
    { chapter: 3, kind: "screen", target: "#logStart", click: "#logStart", after: "#logTimer", who: "karim",
      text: { en: "“Machine 3 just jammed.” Karim taps once on his phone and goes to fix it. No app to install, no account.",
              ar: "«الماكينة 3 علّقت الآن.» يضغط كريم مرة واحدة على هاتفه ويذهب لإصلاحها. بلا تطبيق وبلا حساب." } },
    { chapter: 3, kind: "screen", target: "#logTimer", click: "#logStop", who: "karim", setup: "later", hold: 1,
      stamp: { en: "Logged ✓", ar: "سُجّل ✓" },
      text: { en: "Forty-seven minutes later it runs again. One more tap, and the stoppage is on record with its real length.",
              ar: "بعد سبع وأربعين دقيقة تعود للعمل. ضغطة أخرى ويُسجَّل التوقف بمدته الحقيقية." } },

    { chapter: 4, kind: "card", scene: "week",
      title: { en: "One week of tapping", ar: "أسبوع من التسجيل" },
      text: { en: "Karim logs every stop for eight days. The long ones, and the short ones nobody used to mention.",
              ar: "يسجّل كريم كل توقف لمدة ثمانية أيام: الطويل منها، والقصير الذي لم يكن يذكره أحد." } },
    { chapter: 4, kind: "screen", target: "#logList", who: "karim", setup: "week",
      text: { en: "{count} stoppages in {days} days. Most were short ones that Hassan never heard about.",
              ar: "{count} توقفًا في {days} أيام. أغلبها توقفات قصيرة لم يسمع بها حسن." } },
    { chapter: 4, kind: "screen", target: "#headline", who: "daim", hold: 1,
      text: { en: "The log replaces the guess. Not {guess} a year. {year}.",
              ar: "السجل يحل محل التخمين. ليس {guess} في السنة، بل {year}." } },
    { chapter: 4, kind: "screen", target: "#notesBlock", who: "daim",
      text: { en: "The machines are stopped about {hours} hours a month. Small stops alone are {smallPct}% of that time.",
              ar: "الماكينات متوقفة حوالي {hours} ساعة في الشهر، والتوقفات الصغيرة وحدها {smallPct}% من هذا الوقت." } },

    { chapter: 5, kind: "card", scene: "hassan", mood: "happy", prop: "tick",
      title: { en: "A number Hassan can act on", ar: "رقم يستطيع حسن أن يتصرف به" },
      text: { en: "Now he knows what stoppages cost him. The next question is what fixing them is worth.",
              ar: "الآن يعرف كم تكلّفه التوقفات. والسؤال التالي: كم يساوي حلّها؟" } },
    { chapter: 5, kind: "screen", target: "#whatif", who: "daim",
      text: { en: "If planned maintenance cut his stoppages by 30%, Hassan would keep about {save} a year.",
              ar: "لو خفّضت الصيانة المخططة توقفاته بنسبة 30%، سيوفّر حسن حوالي {save} في السنة." } },
    { chapter: 5, kind: "screen", target: "#waBtn", who: "hassan",
      text: { en: "One tap puts his result in a WhatsApp message, ready to send. The conversation starts from real numbers.",
              ar: "ضغطة واحدة تضع نتيجته في رسالة واتساب جاهزة للإرسال. فيبدأ الحديث من أرقام حقيقية." } },

    { chapter: 6, kind: "card", scene: "end",
      title: { en: "You cannot fix what you never counted", ar: "ما لا تحسبه لا تستطيع إصلاحه" },
      text: { en: "The calculator is free, and your numbers stay on your device. Try it with your own factory.",
              ar: "الحاسبة مجانية وأرقامك تبقى على جهازك. جرّبها بأرقام مصنعك." } }
  ];

  var UI = {
    en: { chapter: "Chapter {n} of {t}", back: "Back", next: "Next", play: "Play", pause: "Pause", close: "Close the demo",
          again: "Watch again", own: "Use my own numbers", hint: "New here? Watch the 2-minute demo" },
    ar: { chapter: "الفصل {n} من {t}", back: "السابق", next: "التالي", play: "تشغيل", pause: "إيقاف مؤقت", close: "إغلاق العرض",
          again: "شاهد مرة أخرى", own: "استخدم أرقامي", hint: "أول زيارة؟ شاهد العرض في دقيقتين" }
  };

  /* ---- what the story does to the page (kept beside the script because it is part of it) ---- */
  var SETUPS = {
    /* Time passes in the story: the machine has now been stopped for 47 minutes. */
    later: function () {
      if (log.running) log.running.t0 = Date.now() - 47 * 60000 - 20000;
      document.getElementById("logNote").value = JAM_NOTE[lang];
    },
    /* A week passes: Karim's full log. */
    week: function () {
      var today = dayNumber(todayStr());
      var entries = WEEK.map(function (w, i) {
        var d = new Date((today - w[0]) * 86400000);
        var date = d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + String(d.getUTCDate()).padStart(2, "0");
        return { id: i + 1, date: date, min: w[1], note: w[2][lang] };
      });
      log = { start: entries[0].date, entries: entries, running: null };
    }
  };

  /* ================= PART 2: THE DRAWINGS ================= */

  var INK = "#0c2125";
  var SKIN = { hassan: "#e2b08a", karim: "#c98f66" };

  function face(mood, y) {
    return '<g transform="translate(0 ' + (y || 0) + ')">' +
      (mood === "worried" ? '<g stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"><path d="M43 51l11-3"/><path d="M77 51l-11-3"/></g>' : "") +
      '<circle cx="49" cy="59" r="3.4" fill="' + INK + '"/><circle cx="71" cy="59" r="3.4" fill="' + INK + '"/>' +
      '<circle cx="42" cy="68" r="5" fill="#e8846b" opacity=".28"/><circle cx="78" cy="68" r="5" fill="#e8846b" opacity=".28"/>' +
      (mood === "worried"
        ? '<path d="M51 75q9-6 18 0" fill="none" stroke="' + INK + '" stroke-width="2.600" stroke-linecap="round"/>'
        : '<path d="M50 70q10 9 20 0" fill="none" stroke="' + INK + '" stroke-width="2.600" stroke-linecap="round"/>') + "</g>";
  }
  function head(who) {
    var c = SKIN[who];
    return '<rect x="52" y="82" width="16" height="18" rx="6" fill="' + c + '"/><circle cx="29" cy="60" r="6" fill="' + c + '"/>' +
      '<circle cx="91" cy="60" r="6" fill="' + c + '"/><circle cx="60" cy="58" r="31" fill="' + c + '"/>';
  }
  var PEOPLE = {
    /* The owner: suit, brass tie. */
    hassan: function (mood) {
      return '<path d="M14 142c0-30 18-46 46-46s46 16 46 46z" fill="#0e5a64"/><path d="M48 97l12 16 12-16-4-3H52z" fill="#fff"/>' +
        '<path d="M57 104h6l3 26-6 7-6-7z" fill="#a8833c"/>' + head("hassan") +
        '<path d="M29 54c-2-22 14-33 31-33s33 11 31 33c-6-9-12-14-22-15-12-1-28 2-40 15z" fill="#4a4442"/>' +
        face(mood);
    },
    /* The supervisor: overalls and a hard hat. */
    karim: function (mood) {
      return '<path d="M14 142c0-30 18-46 46-46s46 16 46 46z" fill="#e9eef0"/><path d="M34 142v-34l10-9h32l10 9v34z" fill="#2f6fb0"/>' +
        '<circle cx="46" cy="112" r="3" fill="#f2b632"/><circle cx="74" cy="112" r="3" fill="#f2b632"/>' + head("karim") +
        '<path d="M40 80q20 12 40 0v6q-20 12-40 0z" fill="#2b2320" opacity=".18"/>' + face(mood, 2) +
        '<path d="M27 50a33 33 0 0 1 66 0z" fill="#f2b632"/><rect x="20" y="46" width="80" height="9" rx="4.500" fill="#f2b632"/>' +
        '<rect x="20" y="52" width="80" height="3" rx="1.500" fill="#d99a1c"/><rect x="56" y="18" width="8" height="30" rx="4" fill="#f7cd62"/>';
    }
  };
  var MARK = '<rect width="40" height="40" rx="9" fill="#a8833c"/><path d="M20 20c-2.600-3.600-4.900-5.400-7.600-5.400a5.400 5.400 0 1 0 0 10.800c2.700 0 5-1.800 7.600-5.400Zm0 0c2.600 3.600 4.900 5.400 7.600 5.400a5.400 5.400 0 1 0 0-10.800c-2.700 0-5 1.800-7.600 5.400Z" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';

  function character(who, mood, size, cls) {
    return '<svg viewBox="0 0 120 142" width="' + size + '" height="' + (size * 142 / 120) + '" class="' + (cls || "") + '" aria-hidden="true">' + PEOPLE[who](mood || "happy") + "</svg>";
  }
  function avatar(who) {
    if (who === "daim") return '<span class="tour-avatar"><svg viewBox="-6 -6 52 52" aria-hidden="true">' + MARK + "</svg></span>";
    return '<span class="tour-avatar"><svg viewBox="8 14 104 104" aria-hidden="true">' + PEOPLE[who]("happy") + "</svg></span>";
  }
  /* A phone showing the stoppage log: a red button and a running clock. */
  function phone(h) {
    return '<svg viewBox="0 0 80 130" height="' + h + '" aria-hidden="true"><rect x="4" y="4" width="72" height="122" rx="14" fill="' + INK + '"/>' +
      '<rect x="10" y="12" width="60" height="106" rx="8" fill="#f5f6f6"/><rect x="10" y="12" width="60" height="16" rx="8" fill="#0c2125"/>' +
      '<rect x="16" y="36" width="48" height="26" rx="6" fill="#fbe9e7"/><rect x="24" y="45" width="32" height="8" rx="4" fill="#c8372c"/>' +
      '<rect x="16" y="70" width="48" height="16" rx="6" fill="#17764d"/><rect x="16" y="94" width="34" height="6" rx="3" fill="#c9d1d1"/>' +
      '<rect x="16" y="105" width="42" height="6" rx="3" fill="#c9d1d1"/></svg>';
  }
  /* A long receipt with a red total. */
  function receipt(h) {
    var lines = "";
    [34, 50, 66, 82].forEach(function (y, i) {
      lines += '<rect x="20" y="' + y + '" width="' + [44, 36, 48, 30][i] + '" height="7" rx="3.500" fill="#c9d1d1"/><rect x="74" y="' + y + '" width="16" height="7" rx="3.500" fill="#9fb0b2"/>';
    });
    return '<svg viewBox="0 0 110 150" height="' + h + '" aria-hidden="true"><path d="M8 8h94v128l-12-8-11 8-12-8-12 8-12-8-12 8-11-8-12 8z" fill="#fff" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<rect x="20" y="18" width="40" height="8" rx="4" fill="#0e5a64"/>' + lines +
      '<path d="M20 98h70" stroke="' + INK + '" stroke-width="3" stroke-dasharray="3 5"/><rect x="20" y="106" width="70" height="14" rx="5" fill="#c8372c"/></svg>';
  }
  /* Eight days on a wall chart, with the stopped time in red. */
  function weekChart(h) {
    var cells = "", fills = [.5, .2, 1, .25, .1, .3, .35, .25];
    for (var i = 0; i < 8; i++) {
      var x = 16 + (i % 4) * 34, y = 40 + Math.floor(i / 4) * 40;
      cells += '<rect x="' + x + '" y="' + y + '" width="28" height="32" rx="5" fill="#dcecee"/>' +
        '<rect x="' + x + '" y="' + (y + 32 - 32 * fills[i]) + '" width="28" height="' + (32 * fills[i]) + '" rx="4" fill="#c8372c"/>';
    }
    return '<svg viewBox="0 0 164 134" height="' + h + '" aria-hidden="true"><rect x="4" y="12" width="156" height="118" rx="12" fill="#fff" stroke="' + INK + '" stroke-width="4"/>' +
      '<rect x="6" y="14" width="152" height="18" rx="9" fill="#0e5a64"/><rect x="36" y="2" width="8" height="20" rx="4" fill="' + INK + '"/><rect x="120" y="2" width="8" height="20" rx="4" fill="' + INK + '"/>' + cells + "</svg>";
  }
  function gear(cls) {
    var teeth = "";
    for (var i = 0; i < 8; i++) teeth += '<rect x="43" y="2" width="14" height="24" rx="4" transform="rotate(' + (i * 45) + ' 50 50)"/>';
    return '<svg viewBox="0 0 100 100" class="tour-gear ' + cls + '" aria-hidden="true"><g fill="currentColor">' + teeth + '<circle cx="50" cy="50" r="33"/></g><circle cx="50" cy="50" r="13" fill="var(--scene)"/></svg>';
  }

  var SCENES = {
    intro: { bg: "#0c2125", dark: true }, end: { bg: "#0c2125", dark: true },
    hassan: { bg: "#dcecee" }, karim: { bg: "#fdeec4" }, bill: { bg: "#f3e6c8" }, week: { bg: "#dff0e6" }
  };

  function illustration(b) {
    if (b.scene === "intro") {
      return '<div class="tour-cast"><div>' + character("hassan", "worried", 130, "tour-bob") + "</div><div>" + character("karim", "happy", 130, "tour-bob") +
        '</div><div><svg viewBox="-8 -8 56 56" width="110" height="110" class="tour-bob" aria-hidden="true">' + MARK + "</svg></div></div>";
    }
    if (b.scene === "end") {
      return '<div class="tour-cast"><div>' + character("hassan", "happy", 160, "tour-bob") + "</div><div>" + character("karim", "happy", 160, "tour-bob") + "</div></div>";
    }
    if (b.scene === "bill") {
      return '<div class="tour-stage flat"><span class="tour-pop">' + receipt(210) + "</span>" + character("hassan", "worried", 150, "tour-bob") + "</div>";
    }
    if (b.scene === "week") {
      return '<div class="tour-stage flat"><span class="tour-pop">' + weekChart(190) + "</span>" + character("karim", "happy", 150, "tour-bob") + "</div>";
    }
    var prop = "";
    if (b.prop === "phone") prop = '<span class="tour-prop tour-pop">' + phone(150) + "</span>";
    if (b.prop === "bill") prop = '<span class="tour-prop tour-pop">' + receipt(140) + "</span>";
    if (b.prop === "tick") prop = '<span class="tour-prop top tour-pop"><svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="#a8833c" stroke="' + INK + '" stroke-width="4"/><path d="M20 33l8 8 16-17" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
    return '<div class="tour-stage">' + character(b.scene, b.mood, 250, "tour-bob") + prop + "</div>";
  }

  /* ================= PART 3: THE PLAYER ================= */

  var S = { active: false, index: 0, playing: true, elapsed: 0, ready: false, fired: false, frozen: null, token: 0 };
  var saved = null, el = {}, clock = null, raf = 0, guessYear = 0;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tr(o) { return o[lang] || o.en; }
  function ui(k, v) { var s = UI[lang][k]; if (v) for (var x in v) s = s.split("{" + x + "}").join(v[x]); return s; }
  function lay() {
    var w = window.innerWidth, h = window.innerHeight, m = w < 640;
    return { w: w, h: h, mobile: m, bar: m ? 96 : 72, bubbleW: Math.min(400, w - 24), top: m ? 10 : 16 };
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function thousands(v) { return Math.round(v / 1000) * 1000; }

  function fill(text) {
    var r = compute(state, log, todayStr());
    var vars = {
      year: money(thousands(r.year)), guess: money(thousands(guessYear)), save: money(thousands(r.year * state.whatif / 100)),
      hours: n1(r.downH), smallPct: n0(r.smallPct), count: n0(r.log.count), days: n0(r.log.days)
    };
    for (var k in vars) text = text.split("{" + k + "}").join(vars[k]);
    return text;
  }
  function durationOf(b) {
    var reading = fill(tr(b.text)).length * 34;
    if (b.kind === "card") return 2600 + reading + tr(b.title).length * 30;
    return 2200 + reading + (b.click ? 1700 : 0) + (b.hold || 0) * 1000;
  }
  function press(sel) { var t = document.querySelector(sel); if (t) t.click(); }

  /* Rebuild the story's world up to a beat: start from the seed and redo every earlier action.
     This is what keeps skipping ahead and stepping back consistent. */
  function replay(i) {
    state = Object.assign({}, DEFAULTS, SEED);
    log = { start: null, entries: [], running: null };
    document.getElementById("logNote").value = "";
    document.getElementById("logMin").value = "";
    for (var j = 0; j <= i; j++) {
      var b = BEATS[j];
      if (b.setup) SETUPS[b.setup]();
      if (b.click && j < i) press(b.click);
    }
    render(); tickClock();
  }

  function build() {
    var root = document.createElement("div");
    root.id = "tour"; root.hidden = true;
    root.innerHTML =
      '<div class="tour-shade"></div><div class="tour-spot" hidden></div><div class="tour-card" hidden></div>' +
      '<div class="tour-bubble" hidden></div>' +
      '<div class="tour-cursor" hidden><svg width="34" height="34" viewBox="0 0 24 24"><path d="M5 3l14 8.500-6.200 1.300 3.600 6.600-2.800 1.500-3.600-6.600L5.500 18.800z" fill="#fff" stroke="#0c2125" stroke-width="1.600" stroke-linejoin="round"/></svg></div>' +
      '<div class="tour-stamp" hidden></div>' +
      '<aside class="tour-bar"><div class="tour-bar-in"><div class="tour-info"><small></small><b></b></div><div class="tour-segs"></div>' +
      '<div class="tour-ctrl">' +
      '<button type="button" class="flip" data-t="back"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.500" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<button type="button" class="main" data-t="play"></button>' +
      '<button type="button" class="flip" data-t="next"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.500" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
      '<button type="button" data-t="close"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.500" stroke-linecap="round"/></svg></button>' +
      "</div></div></aside>";
    document.body.appendChild(root);
    el.root = root;
    ["shade", "spot", "card", "bubble", "cursor", "stamp", "bar", "segs"].forEach(function (k) { el[k] = root.querySelector(".tour-" + k); });
    el.info = root.querySelector(".tour-info");
    el.segs.innerHTML = CHAPTERS.map(function (c, i) { return '<button type="button" data-chap="' + i + '"><i><em style="width:0"></em></i></button>'; }).join("");

    root.addEventListener("click", function (ev) {
      var b = ev.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-chap")) {
        var c = +b.getAttribute("data-chap");
        for (var i = 0; i < BEATS.length; i++) if (BEATS[i].chapter === c) { goTo(i); break; }
        return;
      }
      var t = b.getAttribute("data-t");
      if (t === "back") goTo(S.index - 1);
      else if (t === "next") goTo(S.index + 1);
      else if (t === "play") { S.playing = !S.playing; paintBar(); }
      else if (t === "close") exit(false);
      else if (t === "again") { S.playing = true; goTo(0); }
      else if (t === "own") exit(true);
    });
  }

  function paintBar() {
    var b = BEATS[S.index];
    el.info.firstChild.textContent = ui("chapter", { n: b.chapter + 1, t: CHAPTERS.length });
    el.info.lastChild.textContent = tr(CHAPTERS[b.chapter]);
    Array.prototype.forEach.call(el.segs.children, function (seg, i) {
      seg.setAttribute("aria-label", tr(CHAPTERS[i]));
      seg.title = tr(CHAPTERS[i]);
    });
    var q = function (t) { return el.bar.querySelector('[data-t="' + t + '"]'); };
    q("back").setAttribute("aria-label", ui("back")); q("back").disabled = S.index === 0;
    q("next").setAttribute("aria-label", ui("next")); q("next").disabled = S.index === BEATS.length - 1;
    q("close").setAttribute("aria-label", ui("close"));
    q("play").setAttribute("aria-label", ui(S.playing ? "pause" : "play"));
    q("play").innerHTML = S.playing
      ? '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
    paintProgress();
  }
  function paintProgress() {
    var b = BEATS[S.index], inChap = BEATS.filter(function (x) { return x.chapter === b.chapter; });
    var pos = inChap.indexOf(b), frac = (pos + Math.min(1, S.elapsed / durationOf(b))) / inChap.length;
    Array.prototype.forEach.call(el.segs.children, function (seg, i) {
      seg.querySelector("em").style.width = (i < b.chapter ? 100 : i === b.chapter ? frac * 100 : 0) + "%";
    });
  }

  function showCard(b) {
    var sc = SCENES[b.scene], last = S.index === BEATS.length - 1;
    el.card.className = "tour-card" + (sc.dark ? " dark" : "");
    el.card.style.background = sc.bg;
    el.card.style.setProperty("--scene", sc.bg);
    el.card.innerHTML = gear("g1") + gear("g2") +
      '<div class="tour-card-in"><div class="tour-art">' + illustration(b) + '</div><div class="tour-copy">' +
      '<p class="tour-chap">' + esc(tr(CHAPTERS[b.chapter])) + "</p><h1>" + esc(tr(b.title)) + '</h1><p class="tour-text">' + esc(fill(tr(b.text))) + "</p>" +
      (last ? '<div class="tour-end"><button type="button" class="primary" data-t="own">' + ui("own") + '</button><button type="button" data-t="again">' + ui("again") + "</button></div>" : "") +
      "</div></div>";
    el.card.hidden = false;
    el.spot.hidden = true; el.bubble.hidden = true; el.cursor.hidden = true; el.stamp.hidden = true;
    el.shade.classList.remove("dim");
  }

  function visible(node) { return node && node.getClientRects().length > 0; }

  function showScreen(b) {
    var token = S.token;
    el.card.hidden = true; el.stamp.hidden = true; el.cursor.hidden = true;
    el.cursor.classList.remove("press");
    el.bubble.hidden = false;
    el.bubble.style.visibility = "hidden";
    el.bubble.classList.remove("pop");
    el.bubble.style.width = lay().bubbleW + "px";
    el.bubble.innerHTML = '<div class="tour-who">' + avatar(b.who) + "<span>" + esc(tr(SPEAKERS[b.who])) + "</span></div><p>" + esc(fill(tr(b.text))) + "</p>";

    var target = document.querySelector(b.target), tries = 0;
    if (!visible(target)) {   // never stall: carry on without a spotlight
      el.spot.hidden = true; el.shade.classList.add("dim");
      S.ready = true; el.bubble.style.visibility = ""; el.bubble.classList.add("pop");
      return;
    }
    el.shade.classList.remove("dim");

    function aim() {
      var L = lay(), r = target.getBoundingClientRect(), bh = el.bubble.offsetHeight;
      var avail = L.h - L.bar - L.top - 12, want;
      if (r.height + bh + 28 <= avail) want = L.top + Math.min(110, (avail - r.height - bh - 28) / 2) + 6;
      else want = L.top + 6;
      return r.top - want;
    }
    /* Scroll by our own animation, so we know exactly when it has finished. */
    function scrollBy(delta, done) {
      var from = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      var to = Math.max(0, Math.min(max, from + delta)), t0 = performance.now(), dur = reduce ? 0 : 480;
      if (Math.abs(to - from) < 1) { done(false); return; }
      (function step() {   // a timer, not an animation frame, so it still finishes if the tab is in the background
        if (token !== S.token) return;
        var p = dur ? Math.min(1, (performance.now() - t0) / dur) : 1, e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        window.scrollTo({ top: from + (to - from) * e, behavior: "instant" });
        if (p < 1) setTimeout(step, 16); else done(true);
      })();
    }
    function settle() {
      if (token !== S.token) return;
      var delta = aim(), before = target.getBoundingClientRect().top;
      if (Math.abs(delta) > 10 && tries < 3) {
        tries++;
        scrollBy(delta, function (moved) {
          // a target inside the pinned result panel may not move when the page does: then stop trying
          if (moved && Math.abs(target.getBoundingClientRect().top - before) > 2) settle(); else show();
        });
      } else show();
    }
    function show() {
      if (token !== S.token) return;
      S.ready = true;
      el.spot.hidden = false;
      el.bubble.style.visibility = ""; el.bubble.classList.add("pop");
      if (b.click) startCursor(b);
    }
    settle();
  }

  var cursorAt = null;
  function startCursor(b) {
    var L = lay();
    if (!cursorAt) cursorAt = { x: L.w * (document.documentElement.dir === "rtl" ? 0.3 : 0.7), y: L.h * 0.55 };
    el.cursor.style.transition = "none";
    el.cursor.style.left = cursorAt.x + "px"; el.cursor.style.top = cursorAt.y + "px";
    el.cursor.hidden = false;
    el.cursor.querySelectorAll(".tour-ripple").forEach(function (n) { n.remove(); });
    void el.cursor.offsetWidth;
    el.cursor.style.transition = "";
  }

  /* Runs every frame while the demo is open: keeps the spotlight, bubble and cursor on their target. */
  function frame() {
    raf = requestAnimationFrame(frame);
    if (!S.active) return;
    var b = BEATS[S.index];
    if (b.kind !== "screen" || !S.ready) return;
    var L = lay(), target = document.querySelector(S.fired && b.after ? b.after : b.target), r = null;
    if (visible(target)) { var q = target.getBoundingClientRect(); r = { top: q.top, left: q.left, width: q.width, height: q.height }; }
    if (S.fired && S.frozen && (!r || b.stamp)) r = S.frozen;   // the pressed thing may have gone: keep the light where it was
    if (!r) { el.spot.hidden = true; return; }
    var pad = 6, s = el.spot.style;
    el.spot.hidden = false;
    el.spot.classList.add("live");
    s.top = (r.top - pad) + "px"; s.left = (r.left - pad) + "px"; s.width = (r.width + pad * 2) + "px"; s.height = (r.height + pad * 2) + "px";

    var bh = el.bubble.offsetHeight, bw = L.bubbleW, top;
    var below = L.h - L.bar - (r.top + r.height + pad), above = r.top - pad - L.top;
    if (below >= bh + 20) top = r.top + r.height + pad + 12;
    else if (above >= bh + 20) top = r.top - pad - bh - 12;
    else top = L.h - L.bar - bh - 12;   // tall target: sit over its lower end
    var rtl = document.documentElement.dir === "rtl";
    var left = rtl ? r.left + r.width - bw : r.left;
    left = Math.max(12, Math.min(L.w - bw - 12, left));
    el.bubble.style.top = Math.max(L.top, top) + "px"; el.bubble.style.left = left + "px";

    if (b.click && !S.fired && S.elapsed > 150) {
      var c = document.querySelector(b.click);
      if (visible(c)) {
        var cr = c.getBoundingClientRect();
        cursorAt = { x: cr.left + cr.width / 2, y: cr.top + cr.height / 2 };
        el.cursor.style.left = cursorAt.x + "px"; el.cursor.style.top = cursorAt.y + "px";
      }
    }
  }

  function fire(b) {
    S.fired = true;
    var target = document.querySelector(b.target);
    if (visible(target)) { var q = target.getBoundingClientRect(); S.frozen = { top: q.top, left: q.left, width: q.width, height: q.height }; }
    el.cursor.classList.add("press");
    var rip = document.createElement("span"); rip.className = "tour-ripple"; el.cursor.appendChild(rip);
    setTimeout(function () { el.cursor.classList.remove("press"); }, 250);
    press(b.click);                       // the real button, really pressed
    render();
    if (b.stamp && cursorAt) {
      el.stamp.innerHTML = "<div>" + esc(tr(b.stamp)) + "</div>";
      el.stamp.style.left = Math.max(120, Math.min(lay().w - 120, cursorAt.x)) + "px"; el.stamp.style.top = cursorAt.y + "px";
      el.stamp.hidden = false;
    }
  }

  function tick() {
    if (!S.active || !S.playing || !S.ready) return;
    var b = BEATS[S.index];
    S.elapsed += 100;
    if (b.kind === "screen" && b.click && !S.fired && S.elapsed >= 1300) fire(b);
    paintProgress();
    if (S.elapsed >= durationOf(b) && S.index < BEATS.length - 1) goTo(S.index + 1);
  }

  function goTo(i) {
    i = Math.max(0, Math.min(BEATS.length - 1, i));
    S.index = i; S.elapsed = 0; S.ready = false; S.fired = false; S.frozen = null; S.token++;
    el.spot.classList.remove("live");
    replay(i);
    var b = BEATS[i];
    if (b.kind === "card") { showCard(b); S.ready = true; cursorAt = null; }
    else showScreen(b);
    paintBar();
  }

  function start() {
    if (S.active) return;
    if (!el.root) build();
    saved = { state: JSON.stringify(state), log: JSON.stringify(log) };
    guessYear = compute(Object.assign({}, DEFAULTS, SEED, { breakdowns: SEED.breakdowns - 1 }), { entries: [] }, todayStr()).year;
    var L = lay();
    window.__tourActive = true; window.__tourBar = L.bar;
    document.documentElement.style.setProperty("--demo-bar", L.bar + "px");
    document.body.classList.add("touring");
    hideHint();
    S.active = true; S.playing = true;
    el.root.hidden = false;
    if (typeof placeResult === "function") placeResult();
    goTo(0);
    clock = setInterval(tick, 100);
    raf = requestAnimationFrame(frame);
  }

  function exit(toForm) {
    if (!S.active) return;
    S.active = false; S.token++;
    clearInterval(clock); cancelAnimationFrame(raf);
    el.root.hidden = true;
    state = JSON.parse(saved.state); log = JSON.parse(saved.log);
    document.getElementById("logNote").value = ""; document.getElementById("logMin").value = "";
    window.__tourActive = false; window.__tourBar = 0;
    document.body.classList.remove("touring");
    render(); tickClock();
    if (typeof placeResult === "function") placeResult();
    var y = toForm ? document.getElementById("step1").getBoundingClientRect().top + window.scrollY - 12 : 0;
    window.scrollTo({ top: y, behavior: "instant" });
  }

  window.addEventListener("resize", function () {
    if (!S.active) return;
    var L = lay();
    window.__tourBar = L.bar;
    document.documentElement.style.setProperty("--demo-bar", L.bar + "px");
    el.bubble.style.width = L.bubbleW + "px";
  });

  document.addEventListener("keydown", function (ev) {
    if (!S.active) return;
    var rtl = document.documentElement.dir === "rtl";
    if (ev.key === "Escape") { exit(false); }
    else if (ev.key === " ") { S.playing = !S.playing; paintBar(); }
    else if (ev.key === "ArrowRight") { goTo(S.index + (rtl ? -1 : 1)); }
    else if (ev.key === "ArrowLeft") { goTo(S.index + (rtl ? 1 : -1)); }
    else return;
    ev.preventDefault();
  }, true);

  /* ---------- the button and the first-visit hint ---------- */
  var hint = null;
  function hideHint() { if (hint) { hint.remove(); hint = null; } window.removeEventListener("scroll", hideHint); }
  function showHint() {
    try { if (sessionStorage.getItem("daim-demo-hint")) return; sessionStorage.setItem("daim-demo-hint", "1"); } catch (e) {}
    var btn = document.getElementById("demoBtn"), box = btn.parentNode;
    hint = document.createElement("div");
    hint.className = "tour-hint";
    hint.textContent = ui("hint");
    box.appendChild(hint);   // anchored to the buttons, so it follows them on any screen size
    var b = btn.getBoundingClientRect(), c = box.getBoundingClientRect();
    var fromEnd = document.documentElement.dir === "rtl" ? b.left + b.width / 2 - c.left : c.right - (b.left + b.width / 2);
    hint.style.setProperty("--tip", Math.max(12, fromEnd - 7) + "px");
    window.addEventListener("scroll", hideHint, { passive: true });
    setTimeout(hideHint, 12000);
  }

  document.getElementById("demoBtn").addEventListener("click", start);
  document.getElementById("langBtn").addEventListener("click", hideHint);
  window.addEventListener("load", function () { setTimeout(showHint, 600); });
  window.__tour = { start: start, exit: exit, goTo: goTo, state: S, beats: BEATS };
})();
