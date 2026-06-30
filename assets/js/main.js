/* =========================================================================
   LOADING SCREEN — dismiss after page ready
   ========================================================================= */
(function () {
  var loader = document.getElementById("loader");
  if (!loader) return;
  var MIN_MS = 1800; // minimum display time so animation plays fully
  var start  = Date.now();

  function dismiss() {
    var elapsed = Date.now() - start;
    var delay   = Math.max(0, MIN_MS - elapsed);
    setTimeout(function () {
      loader.classList.add("ld-out");
      loader.addEventListener("transitionend", function () {
        loader.classList.add("ld-done");
      }, { once: true });
    }, delay);
  }

  if (document.readyState === "complete") {
    dismiss();
  } else {
    window.addEventListener("load", dismiss);
  }
})();

/* ===========================================================================
   Ajrin Portfolio - application script
   Renders content from data + wires all interactions.
   No external libraries. Respects prefers-reduced-motion.
   =========================================================================== */
(function () {
  "use strict";
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine   = window.matchMedia("(pointer: fine)").matches;

  /* ---------- palettes (colour comes from the work) ---------- */
  var PAL = [
    ["#B85C38", "#8E4127"], ["#5E7591", "#41566D"], ["#6E8B6A", "#4E6A4B"],
    ["#B98A36", "#8A6620"], ["#7A5A78", "#574057"], ["#3F7E78", "#2B5A55"],
    ["#9A5B49", "#763F30"], ["#4E5B8C", "#384268"], ["#7E7F46", "#5C5E32"],
    ["#A4524F", "#7C3B39"]
  ];

  function initials(name) {
    var clean = name.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/);
    var a = clean[0] ? clean[0][0] : "A";
    var b = clean[1] ? clean[1][0] : (clean[0] && clean[0][1] ? clean[0][1] : "");
    return (a + b).toUpperCase();
  }

  /* ---------- cover: real image if provided, else generated art ---------- */
  function cover(p) {
    if (p.img) return '<img class="cover-photo" src="' + p.img + '" alt="' + p.name + '" loading="lazy" decoding="async">';
    var pal = PAL[p._pi % PAL.length];
    var c1 = pal[0], c2 = pal[1];
    var gid = "g" + p._pi + "_" + Math.floor(Math.random() * 1e6);
    var m = p._pi % 4, shapes = "";
    if (m === 0) {
      shapes =
        '<circle cx="980" cy="120" r="360" fill="#fff" opacity="0.10"/>' +
        '<circle cx="980" cy="120" r="220" fill="#fff" opacity="0.08"/>' +
        '<circle cx="180" cy="690" r="120" fill="#fff" opacity="0.07"/>';
    } else if (m === 1) {
      shapes =
        '<circle cx="430" cy="380" r="300" fill="none" stroke="#fff" stroke-width="36" opacity="0.12"/>' +
        '<circle cx="820" cy="300" r="230" fill="none" stroke="#fff" stroke-width="36" opacity="0.10"/>';
    } else if (m === 2) {
      shapes =
        '<rect x="640" y="-120" width="420" height="900" rx="34" fill="#fff" opacity="0.08" transform="rotate(18 850 330)"/>' +
        '<rect x="120" y="120" width="260" height="260" rx="20" fill="#fff" opacity="0.10"/>';
    } else {
      shapes =
        '<path d="M1200 760 A 520 520 0 0 1 160 760 Z" fill="#fff" opacity="0.07"/>' +
        '<path d="M1200 760 A 320 320 0 0 1 560 760 Z" fill="#fff" opacity="0.09"/>';
    }
    return (
      '<svg viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + p.name + ' cover">' +
        '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/>' +
        '</linearGradient></defs>' +
        '<rect width="1200" height="760" fill="url(#' + gid + ')"/>' +
        shapes +
        '<text x="60" y="700" font-family="Plus Jakarta Sans, sans-serif" font-size="280" font-weight="800" fill="#fff" opacity="0.12" letter-spacing="-12">' + initials(p.name) + '</text>' +
      '</svg>'
    );
  }
  function smallArt(pi) {
    var pal = PAL[pi % PAL.length], gid = "s" + pi + "_" + Math.floor(Math.random() * 1e6);
    return '<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + pal[0] + '"/><stop offset="1" stop-color="' + pal[1] + '"/></linearGradient></defs>' +
      '<rect width="400" height="260" fill="url(#' + gid + ')"/><circle cx="330" cy="40" r="120" fill="#fff" opacity="0.10"/></svg>';
  }

  /* =========================================================================
     DATA
     ========================================================================= */
  var projects = [
    { name: "Qerja",              cat: "website", research: false, year: "2023", sub: "Website, Jobtech",    cs: null,       img: "assets/img/project/qerja/qerja.png" },
    { name: "Bukuku",             cat: "website", research: false, year: "2024", sub: "Website, Product",    cs: null,       img: "assets/img/project/Bukuku/bukuku.png" },
    { name: "Nyapii.id",         cat: "website", research: false, year: "2023", sub: "Website, Brand",      cs: null,       img: "assets/img/project/nyapii/nyapii.png" },
    { name: "Brock University",  cat: "website", research: false, year: "2022", sub: "Website, Education",  cs: null,       img: "assets/img/project/Brock%20uni/brock%20uni.png" },
    { name: "Erika RMS",         cat: "webapp",  research: false, year: "2023", sub: "Web App, HR Tech",    cs: null,       img: "assets/img/project/Erika/erika.png" },
    { name: "Jobs.id Jobfair",   cat: "webapp",  research: false, year: "2023", sub: "Web App, Jobtech",    cs: null,       img: "assets/img/project/Jobs.id%20jobfair/jobs.id%20jobfair.png" },
    { name: "Jastipxpress",      cat: "webapp",  research: false, year: "2022", sub: "Web App, Commerce",   cs: null,       img: "assets/img/project/Jastipxpress/jastipxpress.png" },
    { name: "Jobs.id RMS",       cat: "webapp",  research: false, year: "2023", sub: "Web App, HR Tech",    cs: null,       img: "assets/img/project/Jobs.id%20rms/jobs.id%20rms.png" },
    { name: "Education Platform",cat: "webapp",  research: true,  year: "2022", sub: "Web App, Research",   cs: "education",img: "assets/img/project/education%20platform/education%20platform.png" },
    { name: "Qazwa",             cat: "mobile",  research: false, year: "2022", sub: "Mobile, Fintech",     cs: null,       img: "assets/img/project/qazwa/qazwa.png" },
    { name: "Calo App",          cat: "mobile",  research: false, year: "2022", sub: "Mobile, Health",      cs: null,       img: "assets/img/project/calo%20app/calo%20app.png" },
    { name: "Battery App",       cat: "mobile",  research: false, year: "2023", sub: "Mobile, Automotive",  cs: null,       img: "assets/img/project/battery%20app/battery%20app.png" },
    { name: "Karir.com Revamp",  cat: "webapp",  research: false, year: "2023", sub: "Web App, Product",    cs: "karir",    selected: true, img: "assets/img/project/karir/karir.png" },
    { name: "NGBS Bank Bukopin", cat: "webapp",  research: false, year: "2022", sub: "Web App, Banking",    cs: "ngbs",     selected: true, img: "assets/img/project/Bukopin/bukopin.png" },
    { name: "Dynavolt Battery",  cat: "mobile",  research: false, year: "2023", sub: "Mobile, Automotive",  cs: "dynavolt", selected: true, img: "assets/img/project/Dynavolt%20battery/dynavolt%20battery.png" },
    { name: "Space VPN",         cat: "mobile",  research: false, year: "2022", sub: "Mobile, Product",     cs: "spacevpn", selected: true, img: "assets/img/project/Space%20vpn/space%20vpn.png" }
  ];
  projects.forEach(function (p, i) { p._pi = i; });

  var CAT_LABEL = { website: "Website", webapp: "Web App", mobile: "Mobile App" };

  var caseStudies = {
    bukuku: {
      name: "Bukuku Design System", tag: "Design System",
      tagline: "A multi-product design system that scaled the team and steadied the interface.",
      meta: [["Role", "UI/UX Lead"], ["Timeline", "2023 - Now"], ["Team", "5 designers"], ["Tools", "Figma, Notion"]],
      overview: "Bukuku ships several products that share one brand but had drifted apart in the interface. Screens looked inconsistent, design files were heavy, and small UI bugs kept reaching production.",
      problem: "Components were duplicated across products, design files used up to 80% of available memory, and avoidable UI bugs slowed every release.",
      process: "I audited the existing screens, defined design tokens, and rebuilt the core components into a single library. From there the team migrated more than a thousand screens onto the new system, with clear usage rules so it would actually stick.",
      solution: "One source of truth for colour, type, spacing, and components, documented and handed off cleanly to engineering. New screens now start from the system instead of from scratch.",
      reflection: "A design system is only as good as its adoption. Time spent on documentation and onboarding mattered as much as the components themselves.",
      impact: [["-25%", "UI bugs in production"], ["80% to 20%", "Design file memory"], ["1,000+", "Screens migrated"]]
    },
    karir: {
      name: "Karir.com Revamp", tag: "Web App",
      tagline: "A job platform revamp that made posting easier and grew listings.",
      meta: [["Role", "Product Designer"], ["Timeline", "2022 - 2023"], ["Team", "Cross-functional"], ["Tools", "Figma"]],
      overview: "Karir.com connects jobseekers and employers. The posting and discovery flows had grown cluttered, making it harder for employers to publish and for seekers to find the right roles.",
      problem: "A dated interface and friction in the posting flow were holding back both sides of the marketplace.",
      process: "I mapped the core journeys, simplified the posting flow, and reworked the search and listing layouts, validating each change with the product team.",
      solution: "Cleaner listings, a faster posting experience, and clearer calls to action across the platform.",
      reflection: "Marketplaces live or die on both sides at once. Every change had to help employers and seekers, not trade one for the other.",
      impact: [["+40%", "Job postings"], ["2 sides", "Balanced in one flow"], ["Faster", "Time to publish"]]
    },
    bpjstku: {
      name: "BPJSTKU Redesign", tag: "Mobile, UX Research",
      tagline: "A clearer benefits app for a very broad, non-technical audience.",
      meta: [["Role", "UI/UX Designer"], ["Timeline", "2023"], ["Platform", "Mobile"], ["Tools", "Figma, Maze"]],
      overview: "BPJSTKU gives workers access to their social-security benefits. The app served a huge, varied audience, many of whom found the existing flows confusing.",
      problem: "Important information was buried, and key tasks took too many steps for people who do not use complex apps every day.",
      process: "I ran usability sessions to find where people got stuck, reorganised the information architecture, and redesigned the primary flows around the most common tasks.",
      solution: "A simpler home, clearer navigation, and task flows shaped around what people actually open the app to do.",
      reflection: "Designing for a national audience means designing for the least confident user, not the most. Plain language and obvious paths won every time.",
      impact: [["Fewer", "Steps to key tasks"], ["Clearer", "Task success in testing"], ["Wider", "Reach across users"]]
    },
    ngbs: {
      name: "NGBS Bank Bukopin", tag: "Web App, Banking",
      tagline: "A cash-management platform that makes corporate banking flows clear.",
      meta: [["Role", "UI/UX Designer"], ["Timeline", "2022"], ["Platform", "Web"], ["Tools", "Figma"]],
      overview: "NGBS is KB Bukopin's cash-management platform for corporate clients, handling payroll, bulk transfers, and multi-level approvals. The flows were powerful but dense, and easy to get lost in.",
      problem: "Money-movement flows like payroll and bulk transfer ran across many steps and heavy tables, which made mistakes easy and slowed daily operations for finance teams.",
      process: "I mapped the core journeys end to end - upload, review, select source account, approve, and transfer - then redesigned the wizard steps, tables, and the approval flow so the status of every payment is always obvious.",
      solution: "A clearer step-by-step transfer wizard, readable transaction tables, simple source-account selection, and an approval flow that always shows where a payment stands.",
      reflection: "In banking, clarity is safety. Every label and confirmation step exists to prevent a costly mistake, and that constraint shaped the whole design.",
      impact: [["Clearer", "Multi-step transfer flows"], ["Fewer", "Errors in approvals"], ["Faster", "Daily operations"]]
    },
    dynavolt: {
      name: "Dynavolt Battery", tag: "Mobile, Automotive",
      tagline: "A reward and reorder app built around the seller's day.",
      meta: [["Role", "Senior UI/UX Designer"], ["Timeline", "2023 (Project)"], ["Platform", "Mobile"], ["Tools", "Figma"]],
      overview: "Dynavolt sells automotive batteries through a network of shops and mechanics. The goal was an app that rewarded sellers and made reordering effortless.",
      problem: "Sellers had no simple way to track rewards or reorder, which slowed repeat sales.",
      process: "I designed the reward and sales flows around how shops already work, keeping the most frequent actions one tap away.",
      solution: "A clear rewards system and a fast reorder flow that fit naturally into the seller's routine.",
      reflection: "When you design for people doing a job, speed beats polish. The fastest path to the next sale was the whole product.",
      impact: [["+30%", "Battery sales"], ["1 tap", "To reorder"], ["Repeat", "Sales rewarded"]]
    },
    education: {
      name: "Education Platform", tag: "Web App, Research",
      tagline: "A study-abroad platform that cut the busywork.",
      meta: [["Role", "UI/UX Designer"], ["Timeline", "2019 - 2022"], ["Platform", "Web"], ["Tools", "Figma, Adobe XD"]],
      overview: "Fortrust helps students apply to study abroad. The internal and student-facing tools were manual and slow, with a lot of back-and-forth.",
      problem: "Manual steps and scattered information made the application process slow for staff and students alike.",
      process: "I researched the end-to-end journey, then redesigned the platform to centralise information and automate the repetitive steps.",
      solution: "A single place to track applications, with clearer status and far fewer manual handoffs.",
      reflection: "Cutting steps is design work too. The biggest wins came from removing screens, not adding them.",
      impact: [["+50%", "Process efficiency"], ["1 place", "To track it all"], ["Fewer", "Manual handoffs"]]
    },
    spacevpn: {
      name: "Space VPN", tag: "Mobile, Product",
      tagline: "A VPN app that makes a technical product feel calm and trustworthy.",
      meta: [["Role", "UI/UX Designer"], ["Timeline", "2022"], ["Platform", "Mobile"], ["Tools", "Figma"]],
      overview: "Space VPN is a consumer VPN app. The goal was to make connecting feel effortless and trustworthy for everyday people who never think about servers or protocols.",
      problem: "VPN apps often feel technical and uncertain. People are not sure whether they are protected, which server they are on, or if it is even working.",
      process: "I built the whole experience around one clear action - the connect button - with unmistakable states for disconnected, connecting, and connected, plus a simple location picker showing ping and a clear free-versus-pro split.",
      solution: "A single glowing connect control with obvious states, live download and upload feedback once connected, and a clean server list with ping and lock indicators for premium locations.",
      reflection: "For a product people rely on for safety, confidence is the feature. Most of the work went into making 'you are protected' impossible to misread.",
      impact: [["1 tap", "To connect"], ["Clear", "Connection states"], ["Calmer", "A technical product, simplified"]]
    }
  };
  var csOrder = ["karir", "ngbs", "dynavolt", "spacevpn", "education", "bpjstku"];

  var services = [
    { t: "UX Research & Strategy", d: "Interviews, usability testing, and journey mapping that turn into decisions a team can act on." },
    { t: "UI Design & Design Systems", d: "High-fidelity interfaces and scalable component libraries that keep products consistent as teams grow." },
    { t: "Product & Interaction Design", d: "User flows, wireframes, prototypes, and the small interactions that make a product feel right." },
    { t: "Product Consulting", d: "Design audits, reviews, and a second pair of eyes on direction before you commit engineering time." }
  ];

  var stats = [
    { v: 30, prefix: "", suffix: "+", l: "Projects shipped" },
    { v: 6,  prefix: "", suffix: "+", l: "Years designing" },
    { v: 10, prefix: "",  suffix: "+", l: "Companies and Clients" },
    { v: 15, prefix: "",  suffix: "+", l: "Project industries" }
  ];

  // EDIT ME: your articles. Set "url" to the live link (e.g. your Medium post). Newest first.
  var articles = [
    { tag: "UX Research",  date: "Jan 2022", read: "10 min read", title: "Usability Testing Report E-learning Platform for Company Service Expansion", excerpt: "A structured usability study validating the e-learning platform redesign — uncovering friction points and guiding iterative improvements before launch.", url: "https://muhammadajrinn.medium.com/usability-testing-report-e-learning-platform-for-company-service-expansion-uix-project-8ac4948ba07c?sharedUserId=muhammadajrinn" },
    { tag: "Case Study",   date: "Dec 2021", read: "10 min read", title: "Designing E-learning Platform for Education Company", excerpt: "From discovery to high-fidelity — a full UX design process for an education company's digital learning platform, covering research, wireframing, and final UI.", url: "https://muhammadajrinn.medium.com/designing-e-learning-platform-for-education-company-ui-ux-project-b8ca547e598e?sharedUserId=muhammadajrinn" },
    { tag: "UX Research",  date: "Dec 2021", read: "8 min read",  title: "Usability Testing Report BPJSTKU Redesign", excerpt: "A usability evaluation of the redesigned BPJSTKU app, measuring task completion and identifying key pain points through moderated testing sessions.", url: "https://medium.com/@muhammadajrinn/usability-test-report-bpjstku-app-redesign-bc2f7c542190?sharedUserId=muhammadajrinn" },
    { tag: "Case Study",   date: "Sep 2021", read: "8 min read",  title: "Insurance Service Application (BPJSTKU)", excerpt: "An in-depth case study analysing BPJSTKU's existing service flows, identifying usability gaps, and proposing design improvements for a more accessible experience.", url: "https://medium.com/@muhammadajrinn/case-study-analisis-aplikasi-penyedia-layanan-jasa-asuransi-bpjstku-fe22c2edeabe?sharedUserId=muhammadajrinn" }
  ];

  var clients = ["Bukopin", "Qazwa", "Nyapii", "Dynavolt", "MCASH", "EMTEK", "Tabby", "Calo App", "Fortrust", "Magenta", "Karir.com", "Jobs.id", "Qerja", "Brock Uni", "BPJS", "Bukuku", "Jakarta Academic", "+Others"];
  var tools = ["UX Research", "Visual Design", "Usability Testing", "Data-Driven Design", "Agentic UI", "Writing", "Prototyping", "Illustration", "Motion", "AI-Assisted Design", "QA"];
  var resources = [
    { name: "User Journey Template",  meta: "Help guide your design and development process",             free: true, neu: false, url: "https://www.figma.com/community/file/1201460961731106922" },
    { name: "Competitor Analyst",     meta: "Evaluate and improve your digital product against competitors", free: true, neu: false, url: "https://www.figma.com/community/file/1201474764267940980" },
    { name: "User Persona",           meta: "Understand your users' needs, goals, and behaviors",          free: true, neu: false, url: "https://www.figma.com/community/file/1201782125741739406" },
    { name: "Empathy Map",            meta: "Understand your users' needs and emotions",                   free: true, neu: false, url: "https://www.figma.com/community/file/1202913163727315780" }
  ];

  /* =========================================================================
     BUILDERS
     ========================================================================= */
  function projCard(p) {
    var clickable = !!p.cs;
    var tag = clickable ? "button" : "div";
    var attrs = 'class="proj' + (clickable ? "" : " no-cs") + '"' +
                (clickable ? ' type="button" data-cs="' + p.cs + '" data-view="1" aria-label="Open case study: ' + p.name + '"' : ' aria-label="' + p.name + '"');
    return "<" + tag + " " + attrs + ">" +
        '<div class="cover">' + cover(p) +
          '<span class="hcx tl"></span><span class="hcx br"></span>' + (p.ongoing && !clickable ? '<span class="reg">Ongoing</span>' : "") +
        "</div>" +
        '<div class="meta">' +
          '<div><div class="title">' + p.name + '</div><div class="ttl-sub">' + p.sub + "</div></div>" +
          '<div class="year">&#8599;<span class="yr-line"></span></div>' +
        "</div>" +
      "</" + tag + ">";
  }

  function listRow(p) {
    var clickable = !!p.cs;
    var tag = clickable ? "button" : "div";
    var attrs = 'class="row' + (clickable ? "" : " no-cs") + '" data-pi="' + p._pi + '" data-cat="' + p.cat + '" data-research="' + (p.research ? 1 : 0) + '"' +
                (clickable ? ' type="button" data-cs="' + p.cs + '" data-view="1"' : "");
    var badge = p.ongoing ? '<span class="badge-on"><span class="d"></span>Ongoing</span>' : '<span class="rcat-extra"></span>';
    return "<" + tag + " " + attrs + ">" +
        '<div class="rname">' + p.name + "</div>" +
        '<div class="rcat">' + CAT_LABEL[p.cat] + "</div>" +
        '<div class="rbadge">' + badge + "</div>" +
        '<div class="rar">&#8599;</div>' +
      "</" + tag + ">";
  }

  /* ---- featured video is static markup in #feature-hero; controls wired in the FEATURED VIDEO block below ---- */

  /* ---- selected grid ---- */
  $("#work-grid").innerHTML = projects.filter(function (p) { return p.selected; }).map(projCard).join("");
  attachTilt($$("#work-grid .proj"));

  /* ---- services ---- */
  var svcGifs = [
    "assets/img/what i do 1.gif",
    "assets/img/what i do 2.gif"
  ];
  $("#svc-list").innerHTML = services.map(function (s, i) {
    var num = (i + 1 < 10 ? "0" : "") + (i + 1);
    var thumb = svcGifs[i]
      ? '<img src="' + svcGifs[i] + '" alt="" loading="lazy">'
      : smallArt(i + 2);
    return '<div class="svc" tabindex="0">' +
        '<div class="num">' + num + ".</div>" +
        '<div class="body"><h3>' + s.t + "</h3><p>" + s.d + "</p></div>" +
        '<div class="arrow">&#8599;</div>' +
        '<div class="svc-thumb">' + thumb + "</div>" +
      "</div>";
  }).join("");

  /* ---- stats ---- */
  $("#stats").innerHTML = stats.map(function (s) {
    return '<div class="stat"><div class="v" data-v="' + s.v + '" data-prefix="' + s.prefix + '" data-suffix="' + s.suffix + '">' +
      s.prefix + "0" + s.suffix + '</div><div class="l">' + s.l + "</div></div>";
  }).join("");

  /* ---- index ---- */
  var visibleProjects = projects.slice(0, 12);
  $("#index-grid").innerHTML = visibleProjects.map(projCard).join("");
  $("#index-list").innerHTML = visibleProjects.map(listRow).join("");
  $("#proj-count").textContent = "12 projects";
  attachTilt($$("#index-grid .proj"));

  /* ---- articles ---- */
  $("#articles").innerHTML = articles.map(function (a) {
    var live = a.url && a.url !== "#";
    return '<a class="art-item" href="' + (a.url || "#") + '"' + (live ? ' target="_blank" rel="noopener"' : "") + '>' +
        '<div class="art-when">' + a.date + '<span class="rt">' + a.read + "</span></div>" +
        '<div><div class="art-tag">' + a.tag + '</div><div class="art-title">' + a.title + '</div><div class="art-excerpt">' + a.excerpt + "</div></div>" +
        '<div class="art-arrow">&#8599;</div>' +
      "</a>";
  }).join("");
  // placeholder links (href="#") show a hint instead of jumping to top
  $("#articles").addEventListener("click", function (e) {
    var link = e.target.closest(".art-item");
    if (link && link.getAttribute("href") === "#") { e.preventDefault(); showToast("Add your article link in the articles list"); }
  });
  var moreArt = $("#more-articles");
  if (moreArt) moreArt.addEventListener("click", function (e) {
    if (moreArt.getAttribute("href") === "#") { e.preventDefault(); showToast("Add your Medium profile link"); }
  });

  /* ---- clients ---- */
  $("#clients").innerHTML = clients.map(function (c) { return '<span class="client-chip">' + c + "</span>"; }).join("");

  /* ---- marquee (doubled for seamless loop) ---- */
  var mItem = function (t) { return '<span class="m-item">' + t + "</span>"; };
  $("#marquee").innerHTML = tools.map(mItem).join("") + tools.map(mItem).join("");

  /* ---- resources ---- */
  var fileIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 3v5h5"/><path d="M19 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h9l5 5v12a1 1 0 0 1-1 1z"/></svg>';
  $("#res-list").innerHTML = resources.map(function (r) {
    return '<div class="res-row"><div class="ricon">' + fileIcon + "</div>" +
      '<div><h3>' + r.name + (r.free ? ' <span class="tag-free">Free</span>' : "") + (r.neu ? ' <span class="badge-on"><span class="d"></span>New</span>' : "") + "</h3>" +
      '<div class="rmeta">' + r.meta + "</div></div>" +
      '<a href="' + (r.url || "#") + '" class="link-ar res-dl" target="_blank" rel="noopener">Get it free <span class="arrow">&#8599;</span></a></div>';
  }).join("");

  /* ---- about photo is a static <img> in the HTML ---- */

  /* =========================================================================
     THEME
     ========================================================================= */
  var root = document.documentElement;
  var sun = '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4"/>';
  var moon = '<path d="M21 12.5A8.5 8.5 0 1 1 11.5 3a6.6 6.6 0 0 0 9.5 9.5z"/>';
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    var ic = $("#theme-icon"); if (ic) ic.innerHTML = (t === "dark" ? moon : sun);
    var meta = $('meta[name="theme-color"]'); if (meta) meta.setAttribute("content", t === "dark" ? "#0E0E0E" : "#F7F6F3");
  }
  var stored = null;
  try { stored = localStorage.getItem("ajrin-theme"); } catch (e) {}
  applyTheme(stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("#theme-toggle").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("ajrin-theme", next); } catch (e) {}
  });

  /* =========================================================================
     MOBILE MENU
     ========================================================================= */
  var mm = $("#mobile-menu");
  function openMenu() { mm.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeMenu() { mm.classList.remove("open"); document.body.style.overflow = ""; }
  $("#menu-btn").addEventListener("click", openMenu);
  $("#menu-close").addEventListener("click", closeMenu);
  $$("[data-mm]").forEach(function (a) { a.addEventListener("click", closeMenu); });

  /* =========================================================================
     SMOOTH ANCHOR SCROLL (with header offset)
     ========================================================================= */
  function scrollToId(id) {
    var header = $("#header");
    if (id === "top" || id === "") { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); return; }
    var el = document.getElementById(id);
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - ((header ? header.offsetHeight : 64) + 14);
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === "#" || a.classList.contains("res-dl")) return;
    a.addEventListener("click", function (e) {
      e.preventDefault();
      closeMenu();
      scrollToId(href.slice(1));
    });
  });

  /* =========================================================================
     SCROLL REVEAL + HEADER STATE + NAV ACTIVE (IntersectionObserver only)
     ========================================================================= */
  if ("IntersectionObserver" in window) {
    var revIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); revIO.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el) { revIO.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // header elevation via a top sentinel (no scroll listener)
  var sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none";
  document.body.insertBefore(sentinel, document.body.firstChild);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      $("#header").classList.toggle("scrolled", !e[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  }

  // nav active state + hide availability badge over contact
  var navMap = { work: '[data-nav][href="#work"]', about: '[data-nav][href="#about"]', contact: '[data-nav][href="#contact"]' };
  var avail = $("#avail");
  if ("IntersectionObserver" in window) {
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var id = en.target.id;
        if (navMap[id]) {
          $$(navMap[id]).forEach(function (a) { a.classList.toggle("active", en.isIntersecting); });
        }
        if (id === "contact" && avail) {
          avail.style.opacity = en.isIntersecting ? "0" : "";
          avail.style.transform = en.isIntersecting ? "translateY(20px)" : "";
          avail.style.pointerEvents = en.isIntersecting ? "none" : "";
        }
      });
    }, { threshold: 0.25 });
    ["work", "about", "contact"].forEach(function (id) { var el = document.getElementById(id); if (el) secIO.observe(el); });
  }

  /* =========================================================================
     COUNT-UP (when #stats in view)
     ========================================================================= */
  function runCount() {
    $$("#stats .v").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-v"));
      var pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "";
      if (reduce) { el.textContent = pre + target + suf; return; }
      var start = performance.now(), dur = 1400;
      function step(now) {
        var t = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = pre + Math.round(target * eased) + suf;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  if ("IntersectionObserver" in window) {
    var statIO = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { runCount(); statIO.disconnect(); }
    }, { threshold: 0.4 });
    statIO.observe($("#stats"));
  } else { runCount(); }

  /* =========================================================================
     FILTERS + VIEW TOGGLE
     ========================================================================= */
  var filterDefs = [
    { k: "all", label: "All" }, { k: "website", label: "Website" },
    { k: "webapp", label: "Web App" }, { k: "mobile", label: "Mobile App" },
  ];
  var filtersEl = $("#filters");
  filtersEl.innerHTML = '<span class="chip-slider" id="chip-slider"></span>' +
    filterDefs.map(function (f, i) {
      return '<button class="chip' + (i === 0 ? " active" : "") + '" data-filter="' + f.k + '">' + f.label + "</button>";
    }).join("");

  /* ---- sliding pill indicator ---- */
  var slider = $("#chip-slider");
  function moveSlider(chip, instant) {
    var fr = filtersEl.getBoundingClientRect();
    var cr = chip.getBoundingClientRect();
    if (instant) { slider.style.transition = "none"; void slider.offsetHeight; }
    slider.style.left   = (cr.left - fr.left) + "px";
    slider.style.top    = (cr.top  - fr.top)  + "px";
    slider.style.width  = cr.width  + "px";
    slider.style.height = cr.height + "px";
    if (instant) { void slider.offsetHeight; slider.style.transition = ""; }
  }
  requestAnimationFrame(function () {
    var first = filtersEl.querySelector(".chip.active");
    if (first) { moveSlider(first, true); filtersEl.classList.add("has-slider"); }
  });
  window.addEventListener("resize", function () {
    var active = filtersEl.querySelector(".chip.active");
    if (active) moveSlider(active, true);
  });

  /* ---- animated counter ---- */
  var pcEl = $("#proj-count"), pcTimer;
  function animateCounter(text) {
    clearTimeout(pcTimer);
    pcEl.classList.remove("cnt-out", "cnt-in");
    void pcEl.offsetHeight;
    pcEl.classList.add("cnt-out");
    pcTimer = setTimeout(function () {
      pcEl.textContent = text;
      pcEl.classList.remove("cnt-out");
      pcEl.classList.add("cnt-in");
      pcTimer = setTimeout(function () { pcEl.classList.remove("cnt-in"); }, 220);
    }, 130);
  }

  /* ---- 3D tilt on grid cards ---- */
  function attachTilt(cards) {
    if (!fine || reduce) return;
    cards.forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        if (card.classList.contains("animating")) return;
        card.style.transition = "transform 0.12s linear";
      });
      card.addEventListener("mousemove", function (e) {
        if (card.classList.contains("animating")) return;
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width  * 2 - 1;
        var y = (e.clientY - r.top)  / r.height * 2 - 1;
        card.style.transform = "perspective(800px) rotateY(" + (x * 6).toFixed(2) + "deg) rotateX(" + (-y * 4).toFixed(2) + "deg) scale(1.015)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transition = "transform 0.65s cubic-bezier(.34,1.2,.64,1)";
        card.style.transform = "";
        setTimeout(function () { card.style.transition = ""; }, 700);
      });
    });
  }

  var grid = $("#index-grid"), list = $("#index-list"), curView = "grid";

  /* ---- FLIP filter ---- */
  function applyFilter(key, noAnim) {
    var gridCards = $$("#index-grid .proj");
    var gridVisible = curView === "grid";
    var visible = 0;

    // First: record positions of currently visible cards
    var firstMap = {};
    if (!reduce && !noAnim && gridVisible) {
      gridCards.forEach(function (el, i) {
        if (el.style.display !== "none") firstMap[i] = el.getBoundingClientRect();
      });
    }

    // Apply filter
    gridCards.forEach(function (el, i) {
      var p = projects[i];
      var show = key === "all" ? true : key === "research" ? p.research : p.cat === key;
      el.style.display = show ? "" : "none";
      if (show) visible++;
    });
    $$("#index-list .row").forEach(function (el) {
      var ok = key === "all" ? true : key === "research" ?
        el.getAttribute("data-research") === "1" :
        el.getAttribute("data-cat") === key;
      el.style.display = ok ? "" : "none";
    });

    animateCounter(visible + (visible === 1 ? " project" : " projects"));

    // Last → Invert → Play
    if (!reduce && !noAnim && gridVisible) {
      requestAnimationFrame(function () {
        var stagger = 0;
        gridCards.forEach(function (el, i) {
          if (el.style.display === "none") return;
          var last  = el.getBoundingClientRect();
          var first = firstMap[i];
          if (first) {
            // card existed before: FLIP slide
            var dx = first.left - last.left;
            var dy = first.top  - last.top;
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
              el.classList.add("animating");
              el.style.transition = "none";
              el.style.transform  = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
              requestAnimationFrame(function () {
                el.style.transition = "transform 0.55s cubic-bezier(.34,1.2,.64,1)";
                el.style.transform  = "";
                el.addEventListener("transitionend", function h() {
                  el.classList.remove("animating");
                  el.style.transition = "";
                  el.removeEventListener("transitionend", h);
                });
              });
            }
          } else {
            // newly visible card: staggered fade + scale + rise
            var d = Math.min(stagger, 8) * 52;
            stagger++;
            el.classList.add("animating");
            el.style.transition = "none";
            el.style.opacity    = "0";
            el.style.transform  = "translateY(18px) scale(0.96)";
            setTimeout(function () {
              el.style.transition = "opacity 0.38s var(--ease), transform 0.38s var(--ease-out)";
              el.style.opacity    = "";
              el.style.transform  = "";
              setTimeout(function () {
                el.classList.remove("animating");
                el.style.transition = "";
              }, 420);
            }, d + 16);
          }
        });
      });
    }
  }

  $$("#filters .chip").forEach(function (c) {
    c.addEventListener("click", function () {
      $$("#filters .chip").forEach(function (x) { x.classList.remove("active"); });
      c.classList.add("active");
      moveSlider(c);
      applyFilter(c.getAttribute("data-filter"));
    });
  });

  /* ---- staggered view switch ---- */
  function staggerView(els) {
    if (reduce) return;
    var cap = Math.min(els.length, 12);
    els.forEach(function (el, i) {
      var d = Math.min(i, cap - 1) * 30 + 8;
      el.style.opacity   = "0";
      el.style.transform = "translateY(12px) scale(0.97)";
      el.style.transition = "none";
      setTimeout(function () {
        el.style.transition = "opacity 0.3s var(--ease), transform 0.3s var(--ease-out)";
        el.style.opacity    = "";
        el.style.transform  = "";
        setTimeout(function () { el.style.transition = ""; el.style.opacity = ""; el.style.transform = ""; }, 350);
      }, d);
    });
  }

  $("#view-grid").addEventListener("click", function () {
    if (curView === "grid") return;
    curView = "grid";
    list.style.display = "none"; grid.style.display = "";
    this.classList.add("active"); $("#view-list").classList.remove("active");
    staggerView($$("#index-grid .proj").filter(function (el) { return el.style.display !== "none"; }));
  });
  $("#view-list").addEventListener("click", function () {
    if (curView === "list") return;
    curView = "list";
    grid.style.display = "none"; list.style.display = "block";
    this.classList.add("active"); $("#view-grid").classList.remove("active");
    staggerView($$("#index-list .row").filter(function (el) { return el.style.display !== "none"; }));
  });

  /* =========================================================================
     FLOATING LIST THUMBNAIL (fine pointer only)
     ========================================================================= */
  var ft = $("#float-thumb");
  if (fine && ft) {
    var ftX = 0, ftY = 0, ftTX = 0, ftTY = 0, ftRot = 0, ftShown = false, ftRAF = 0;
    function ftLoop() {
      ftX += (ftTX - ftX) * 0.16;
      ftY += (ftTY - ftY) * 0.16;
      var target = Math.max(-12, Math.min(12, (ftTX - ftX) * 0.5)); // lean into movement
      ftRot += (target - ftRot) * 0.18;
      ft.style.transform = "translate3d(" + ftX.toFixed(2) + "px," + ftY.toFixed(2) + "px,0) translate(-50%,-50%) rotate(" + ftRot.toFixed(2) + "deg)";
      if (ftShown || Math.abs(ftTX - ftX) > 0.4 || Math.abs(ftTY - ftY) > 0.4 || Math.abs(ftRot) > 0.4) ftRAF = requestAnimationFrame(ftLoop);
      else ftRAF = 0;
    }
    function ftStart() { if (!ftRAF) ftRAF = requestAnimationFrame(ftLoop); }
    list.addEventListener("pointerover", function (e) {
      var row = e.target.closest(".row"); if (!row) return;
      var p = projects[parseInt(row.getAttribute("data-pi"), 10)]; if (!p) return;
      ftTX = e.clientX; ftTY = e.clientY;
      ft.innerHTML = '<div class="ft-inner">' + cover(p) + "</div>"; // re-insert replays reveal + zoom on each row
      if (reduce) { ft.style.transform = "translate3d(" + ftTX + "px," + ftTY + "px,0) translate(-50%,-50%)"; ft.classList.add("show"); return; }
      if (!ftShown) { ftX = ftTX; ftY = ftTY; ftRot = 0; } // appear at cursor, no fly-in
      ftShown = true; ft.classList.add("show"); ftStart();
    });
    list.addEventListener("pointermove", function (e) {
      ftTX = e.clientX; ftTY = e.clientY;
      if (reduce) { ft.style.transform = "translate3d(" + ftTX + "px," + ftTY + "px,0) translate(-50%,-50%)"; return; }
      ftStart();
    });
    list.addEventListener("pointerout", function (e) {
      if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(".row")) { ftShown = false; ft.classList.remove("show"); }
    });
  }

  /* =========================================================================
     COPY EMAIL + TOAST
     ========================================================================= */
  var toast = $("#toast"), toastT;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }
  var copyBtn = $("#copy-mail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var mail = copyBtn.getAttribute("data-mail");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(function () { showToast("Email copied to clipboard"); },
          function () { showToast(mail); });
      } else { showToast(mail); }
    });
  }
  // resource downloads (placeholder)
  $$(".res-dl").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); showToast("Add the file link to enable download"); });
  });
  // CV links (point at a file the owner can drop in)
  ["#cv-link", "#cv-link-2", "#cv-link-3", "#mm-cv"].forEach(function (sel) {
    var el = $(sel); if (el) { el.setAttribute("href", "https://drive.google.com/file/d/1gfbWJx07xmf0uFvOsg3N6JgOo4vGSCDV/view"); el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener"); el.removeAttribute("download"); }
  });

  /* =========================================================================
     CONTACT FORM
     ========================================================================= */
  var typeChips = $$("#type-chips .tchip");
  var chosenType = "Full-time role";
  typeChips.forEach(function (c) {
    c.addEventListener("click", function () {
      typeChips.forEach(function (x) { x.classList.remove("sel"); });
      c.classList.add("sel");
      chosenType = c.getAttribute("data-type");
    });
  });

  var form = $("#contact-form");
  function setErr(field, on) { field.classList.toggle("field-err", on); }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#f-name"), email = $("#f-email"), msg = $("#f-msg");
      var okName = name.value.trim().length > 0;
      var okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      var okMsg = msg.value.trim().length > 0;
      setErr(name, !okName); setErr(email, !okMail); setErr(msg, !okMsg);
      if (!(okName && okMail && okMsg)) {
        var firstBad = !okName ? name : !okMail ? email : msg;
        firstBad.focus();
        return;
      }
      var subject = "[" + chosenType + "] Inquiry from " + name.value.trim();
      var payload = {
        access_key: "5730ab60-89f7-4b0d-9b8a-9cd5de8531d0",
        name:    name.value.trim(),
        email:   email.value.trim(),
        message: msg.value.trim(),
        subject: subject
      };
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      fetch("https://api.web3forms.com/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body:    JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function () {
        form.style.display = "none";
        $("#form-success").classList.add("show");
      }).catch(function () {
        var s = encodeURIComponent(subject);
        var b = encodeURIComponent(msg.value.trim() + "\n\n— " + name.value.trim() + " (" + email.value.trim() + ")");
        try { window.open("mailto:ajrin.workk@gmail.com?subject=" + s + "&body=" + b); } catch (_) {}
        form.style.display = "none";
        $("#form-success").classList.add("show");
      }).finally(function () { btn.disabled = false; });
    });
  }

  /* =========================================================================
     CASE STUDY MODAL
     ========================================================================= */
  var modal = $("#cs-modal"), csScroll = $("#cs-scroll"), csProgress = $("#cs-progress");
  var lastFocused = null, progressHandler = null;

  function csImpactHTML(c) {
    return c.impact.map(function (i) {
      return '<div class="ist"><div class="iv">' + i[0] + '</div><div class="il">' + i[1] + "</div></div>";
    }).join("");
  }
  function csNavHTML(id) {
    var idx = csOrder.indexOf(id);
    var prev = csOrder[(idx - 1 + csOrder.length) % csOrder.length];
    var next = csOrder[(idx + 1) % csOrder.length];
    return '<div class="cs-nav">' +
      '<a href="#" class="prev" data-go="' + prev + '"><span class="dir">&#8592; Previous</span><span class="nt">' + caseStudies[prev].name + "</span></a>" +
      '<a href="#" class="next" data-go="' + next + '"><span class="dir">Next &#8594;</span><span class="nt">' + caseStudies[next].name + "</span></a>" +
      "</div>";
  }
  function buildCS(id) {
    var c = caseStudies[id];
    var p = projects.filter(function (x) { return x.cs === id; })[0] || { _pi: 0, name: c.name };
    var coverBig = cover(p);
    var html =
      '<div class="cs-inner">' +
        '<div class="cs-hero"><h1>' + c.name + "</h1><p class=\"tagline\">" + c.tagline + "</p></div>" +
        '<div class="cs-metarow">' + c.meta.map(function (m) {
          return '<div class="m"><div class="k">' + m[0] + '</div><div class="v">' + m[1] + "</div></div>";
        }).join("") + "</div>" +
        '<div class="cs-cover' + (p.img ? " cs-cover--img" : "") + '">' + coverBig + "</div>" +
      "</div>" +
      '<div class="cs-body">' +
        '<div class="cs-block cs-overview"><div class="cs-lab"><span class="tt">Overview</span></div><div class="cs-content"><p>' + c.overview + "</p></div></div>" +
        '<div class="cs-block"><div class="cs-lab"><span class="nn">01</span><span class="tt">The Problem</span></div><div class="cs-content"><p class="muted">' + c.problem + "</p></div></div>" +
        '<div class="cs-block"><div class="cs-lab"><span class="nn">02</span><span class="tt">The Process</span></div><div class="cs-content"><p class="muted">' + c.process + "</p>" +
          '<div class="cs-imgs"><div class="mini">' + smallArt(p._pi) + '</div><div class="mini">' + smallArt(p._pi + 3) + "</div></div></div></div>" +
        '<div class="cs-block"><div class="cs-lab"><span class="nn">03</span><span class="tt">The Solution</span></div><div class="cs-content"><p class="muted">' + c.solution + "</p>" +
          '<div class="ba" data-ba><div class="ba-layer ba-before">' + smallArtFull(p._pi + 5, true) + '<span class="ba-tag l">Before</span></div>' +
          '<div class="ba-layer ba-after">' + smallArtFull(p._pi, false) + '<span class="ba-tag r">After</span></div>' +
          '<div class="ba-handle"><span class="knob">&#8596;</span></div></div></div></div>' +
        '<div class="cs-block"><div class="cs-lab"><span class="nn">04</span><span class="tt">Impact</span></div><div class="cs-content"><div class="cs-impact">' + csImpactHTML(c) + "</div></div></div>" +
        '<div class="cs-block"><div class="cs-lab"><span class="tt">Reflection</span></div><div class="cs-content"><p>' + c.reflection + "</p></div></div>" +
      "</div>" +
      csNavHTML(id) +
      '<div class="cs-cta"><h3>Like what you see?</h3><a href="#contact" class="btn btn--solid" data-cta>Start a project <span class="arrow">&#8594;</span></a></div>';
    return html;
  }
  function smallArtFull(pi, dim) {
    var pal = PAL[pi % PAL.length], gid = "b" + pi + "_" + Math.floor(Math.random() * 1e6);
    var c1 = pal[0], c2 = pal[1];
    if (dim) { c1 = "#6f6f6f"; c2 = "#4a4a4a"; }
    return '<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>' +
      '<rect width="800" height="450" fill="url(#' + gid + ')"/><circle cx="650" cy="90" r="220" fill="#fff" opacity="0.08"/>' +
      '<rect x="80" y="300" width="240" height="60" rx="8" fill="#fff" opacity="0.14"/></svg>';
  }

  function initBASlider(scope) {
    var ba = $("[data-ba]", scope); if (!ba) return;
    var after = $(".ba-after", ba), handle = $(".ba-handle", ba);
    var dragging = false;
    function setPct(px) {
      var rect = ba.getBoundingClientRect();
      var pct = Math.max(0, Math.min(100, ((px - rect.left) / rect.width) * 100));
      after.style.clipPath = "inset(0 0 0 " + pct + "%)";
      handle.style.left = pct + "%";
    }
    handle.addEventListener("pointerdown", function (e) { dragging = true; handle.setPointerCapture(e.pointerId); });
    window.addEventListener("pointermove", function (e) { if (dragging) setPct(e.clientX); });
    window.addEventListener("pointerup", function () { dragging = false; });
    ba.addEventListener("click", function (e) { setPct(e.clientX); });
  }

  function openCS(id) {
    var c = caseStudies[id]; if (!c) return;
    lastFocused = document.activeElement;
    csScroll.innerHTML = buildCS(id);
    $("#cs-bar-name").textContent = c.name;
    $("#cs-bar-tag").textContent = c.tag;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    modal.scrollTop = 0;
    csProgress.style.width = "0%";
    initBASlider(csScroll);
    // wire prev/next + cta inside modal
    $$("[data-go]", csScroll).forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); openCS(a.getAttribute("data-go")); });
    });
    var cta = $("[data-cta]", csScroll);
    if (cta) cta.addEventListener("click", function (e) { e.preventDefault(); closeCS(); setTimeout(function () { scrollToId("contact"); }, 120); });
    $("#cs-close").focus();
    // reading progress
    if (progressHandler) modal.removeEventListener("scroll", progressHandler);
    progressHandler = function () {
      var max = modal.scrollHeight - modal.clientHeight;
      csProgress.style.width = (max > 0 ? (modal.scrollTop / max) * 100 : 0) + "%";
    };
    modal.addEventListener("scroll", progressHandler, { passive: true });
  }
  function closeCS() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (progressHandler) { modal.removeEventListener("scroll", progressHandler); progressHandler = null; }
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  $("#cs-close").addEventListener("click", closeCS);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeCS(); });

  // delegate case-study openers (cards + rows)
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-cs]");
    if (trigger && !trigger.closest(".cs-modal")) { e.preventDefault(); openCS(trigger.getAttribute("data-cs")); }
  });

  /* =========================================================================
     FEATURED VIDEO  (autoplay, muted, looping; static poster under reduced motion)
     ========================================================================= */
  (function () {
    var vid = $("#fv-video"); if (!vid) return;
    if (reduce) { try { vid.removeAttribute("autoplay"); vid.pause(); } catch (e) {} return; }
    function tryPlay() { try { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
    tryPlay();
    vid.addEventListener("canplay", tryPlay, { once: true });
    // fallback: if the browser blocks muted autoplay, start on the first user interaction
    var resume = function () {
      tryPlay();
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("touchstart", resume);
    };
    window.addEventListener("pointerdown", resume, { passive: true });
    window.addEventListener("touchstart", resume, { passive: true });
  })();

  /* =========================================================================
     CUSTOM CURSOR (fine pointer, motion allowed)
     ========================================================================= */
  if (fine && !reduce) {
    var ring = $("#cur-ring"), dot = $("#cur-dot");
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2, rxp = tx, ryp = ty;
    document.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = "translate(" + tx + "px," + ty + "px) translate(-50%,-50%)";
    });
    (function loop() {
      rxp += (tx - rxp) * 0.18; ryp += (ty - ryp) * 0.18;
      ring.style.transform = "translate(" + rxp + "px," + ryp + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("pointerover", function (e) {
      var view = e.target.closest("[data-view]");
      var inter = e.target.closest("a,button,.chip,.tchip,.vbtn,input,textarea,.svc,.client-chip");
      ring.classList.toggle("is-view", !!view);
      ring.classList.toggle("is-hover", !view && !!inter);
    });
    document.addEventListener("mouseleave", function () { ring.style.opacity = "0"; dot.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { ring.style.opacity = ""; dot.style.opacity = ""; });
  }

  /* =========================================================================
     MAGNETIC — button pulled toward cursor, springs back on leave
     ========================================================================= */
  function attachMag(el, str) {
    if (!fine || reduce) return;
    str = str || 0.28;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width  * 0.5)) * str;
      var dy = (e.clientY - (r.top  + r.height * 0.5)) * str;
      el.style.transition = "transform 0.15s var(--ease)";
      el.style.transform  = "translate(" + dx.toFixed(2) + "px," + dy.toFixed(2) + "px)";
    });
    el.addEventListener("pointerleave", function () {
      el.style.transition = "transform 0.55s cubic-bezier(.34,1.2,.64,1)";
      el.style.transform  = "";
      setTimeout(function () { el.style.transition = ""; el.style.transform = ""; }, 580);
    });
  }

  /* view-toggle buttons */
  if (fine && !reduce) {
    $$(".vbtn").forEach(function (b) { attachMag(b, 0.30); });
  }

  /* =========================================================================
     SPOTLIGHT — radial glow follows cursor over project covers
     ========================================================================= */
  if (fine && !reduce) {
    function injectSpot(root) {
      $$(".cover", root).forEach(function (cv) {
        if (cv.querySelector(".cover-spot")) return;
        var sp = document.createElement("div"); sp.className = "cover-spot";
        cv.appendChild(sp);
        cv.addEventListener("pointermove", function (e) {
          var r = cv.getBoundingClientRect();
          cv.style.setProperty("--sx", ((e.clientX - r.left) / r.width  * 100).toFixed(1) + "%");
          cv.style.setProperty("--sy", ((e.clientY - r.top)  / r.height * 100).toFixed(1) + "%");
        });
      });
    }
    injectSpot(document);
    /* when case-study modal opens: inject spotlight + CS-nav magnetic */
    var _csModal = $("#cs-modal");
    if (_csModal) {
      new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          if (m.attributeName === "class" && _csModal.classList.contains("open")) {
            var scroll = $("#cs-scroll");
            injectSpot(scroll);
            $$(".cs-nav a", scroll).forEach(function (a) { attachMag(a, 0.18); });
          }
        });
      }).observe(_csModal, { attributes: true });
    }
  }

  /* =========================================================================
     HERO AURORA — green ambient glow follows cursor with soft lag
     ========================================================================= */
   (function () {
     var au = $("#hero-aurora");
     if (!au || reduce) return;
     var tx = 0.38, ty = 0.34, cx = 0.38, cy = 0.34;
     function auLoop() {
       cx += (tx - cx) * 0.045;
       cy += (ty - cy) * 0.045;
       var vw = window.innerWidth, vh = window.innerHeight;
       au.style.transform = "translate(" + (cx * vw).toFixed(1) + "px," + (cy * vh).toFixed(1) + "px) translate(-50%,-50%)";
       requestAnimationFrame(auLoop);
     }
     requestAnimationFrame(auLoop);
     if (fine) {
       document.addEventListener("pointermove", function (e) {
         tx = Math.max(0.05, Math.min(0.95, e.clientX / window.innerWidth));
         ty = Math.max(0.0,  Math.min(1.0,  e.clientY / window.innerHeight));
       });
     }
   })();

  /* =========================================================================
     STAGGERED SCROLL REVEAL — children rise+fade in sequence
     ========================================================================= */
  (function () {
    function staggerIO(container, sel, step, cap) {
      if (!container) return;
      step = step || 62; cap = cap || 500;
      var kids = sel ? $$(sel, container) : [].slice.call(container.children);
      if (!kids.length) return;
      kids.forEach(function (el, i) {
        el.classList.add("sr-item");
        el.style.setProperty("--sd", Math.min(i * step, cap) + "ms");
      });
      if (!("IntersectionObserver" in window)) {
        kids.forEach(function (el) { el.classList.add("in"); });
        return;
      }
      var io = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) {
          kids.forEach(function (el) { el.classList.add("in"); });
          io.disconnect();
        }
      }, { threshold: 0.07, rootMargin: "0px 0px -5% 0px" });
      io.observe(container);
    }

    staggerIO($("#work-grid"), ".proj",       68, 440);
    staggerIO($("#svc-list"),  ".svc",        65, 500);
    staggerIO($("#stats"),     ".stat",       80, 380);
    staggerIO($("#articles"), ".art-item",   72, 450);
    staggerIO($("#clients"),  ".client-chip", 42, 340);
    staggerIO($("#res-list"),  ".res-row",    75, 320);
  })();

  /* 4. About photo — clip-wipe reveal + float + 3D tilt */
  (function () {
    var ap = document.getElementById("about-photo");
    if (!ap) return;

    /* Clip-path scroll reveal → then start float */
    var apIO = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      ap.classList.add("ap-in");
      apIO.disconnect();
      if (!reduce) {
        ap.addEventListener("transitionend", function onClip(e) {
          if (e.propertyName !== "clip-path") return;
          ap.classList.add("ap-float");
          ap.removeEventListener("transitionend", onClip);
        });
      }
    }, { threshold: 0.15 });
    apIO.observe(ap);

    /* 3D tilt on hover */
    if (fine && !reduce) {
      ap.addEventListener("mouseenter", function () {
        if (!ap.classList.contains("ap-in")) return;
        ap.style.animationPlayState = "paused";
        ap.style.transition = "transform 0.12s linear";
      });
      ap.addEventListener("mousemove", function (e) {
        if (!ap.classList.contains("ap-in")) return;
        var r = ap.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width  * 2 - 1;
        var y = (e.clientY - r.top)  / r.height * 2 - 1;
        ap.style.transform = "perspective(900px) rotateY(" + (x * 5).toFixed(2) + "deg) rotateX(" + (-y * 4).toFixed(2) + "deg)";
      });
      ap.addEventListener("mouseleave", function () {
        ap.style.transition = "transform 0.65s cubic-bezier(.34,1.2,.64,1)";
        ap.style.transform = "";
        setTimeout(function () {
          ap.style.transition = "";
          ap.style.animationPlayState = "";
        }, 700);
      });
    }
  })();

})();
