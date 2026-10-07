(function () {
  var L = window.LANGS.so;
  L.ui.hero.what = {
    title: "Maxay tahay Computer Science?",
    text: "Computer Science waa barashada sida dhibaatooyinka loogu xalliyo kombiyuutarro: macquul, algorithms, xog iyo software. Waa waxa ku dhex jira taleefankaaga, lacagta mobilka, nidaamyada isbitaalka iyo qalab kasta oo AI ah oo aad isticmaasho."
  };
  L.ui.depts.open = "Fur bogga";
  L.ui.quiz.loading = "Waxaan raadinaynaa waaxyaha kuugu habboon…";
  L.ui.quiz.success = "Waa dhammaaday! Natiijadaada way diyaar tahay.";
  L.ui.close = "Xidh";
  L.ui.hero.photoAlt = "Arday Soomaali ah oo farta ku fiiqaya darbi ay ku yaalaan toddobada waax";
  L.ui.detail.progress = "{n} ka mid ah {t} tallaabo ayaa la dhammeeyay";
  L.ui.detail.markDone = "Calaamadee tallaabadan inay dhammaatay";
  L.ui.nav.deptAll = "Waaxyaha oo dhan";
  L.ui.dept = {
    crumb: "Waaxyaha",
    overview: "Guudmar",
    fieldsTitle: "Fagaaraha la xiriira",
    fieldsSub: "Meelaha aad ku takhasusi karto ama ka shaqeyn karto barnaamijkan kadib.",
    careersSub: "Shaqooyinka waaxdan u horseedo.",
    prereqTitle: "Shuruudaha iyo maaddooyinka aad ku fiicnaato",
    prereqSub: "Looma baahna inaad qumman tahay. Kuwani waa waxyaabaha barnaamijka fududeeya.",
    subjects: "Maaddooyinka dugsiga",
    skills: "Xirfado iyo hab-fekereed",
    ctaTitle: "Su'aal ma ka qabtaa waaxdan?",
    ctaText: "Ii soo dir fariin, ama la xiriir xafiiska is-diiwaangelinta jaamacadda.",
    ctaBtn: "La xiriir",
    admission: "Bogga is-diiwaangelinta",
    prev: "← Hore",
    nextLabel: "Xiga →",
    onThisPage: "Bogga ku jira"
  };
  L.ui.contact.pageTitle = "La xiriir · CS Career";

  var X = {
    cs: {
      fields: [
        ["Algorithms iyo aragtida", "Naqshadaynta xalal degdeg ah oo sax ah iyo fahamka sababta ay u shaqeeyaan."],
        ["Nidaamyada iyo operating systems", "Sida xusuusta, processes iyo hardware-ku ugu wada shaqeeyaan barnaamij kasta hoostiisa."],
        ["Databases iyo nidaamyada macluumaadka", "Kaydinta, abaabulka iyo weydiinta xog badan."],
        ["Luqadaha barnaamijinta iyo compilers", "Sida luqaduhu u dhisan yihiin iyo sida code-ku ugu beddelmo amarro mishiin."],
        ["Garaafiga iyo horumarinta ciyaaraha", "Sawirka adduunyo 2D iyo 3D, fiisigis iyo isdhexgalka shaashadda."]
      ],
      prereq: {
        subjects: [["Xisaabta", "Algebra, functions iyo macquul ayaa maalin walba la isticmaalaa."], ["Ingiriisiga", "Casharrada, docs iyo code-ka badankiisu waa Ingiriis."], ["Fiisigis (waa mid caawiya)", "Wuxuu dhisaa caadada xallinta dhibaatada iyo moodeelaynta."], ["Isticmaalka kombiyuutarka", "Qorista, faylasha iyo rakibidda barnaamijyada."]],
        skills: ["Fikir macquul ah", "Samir marka code-ku shaqeynin", "Adkaysi dhibaatooyin adag", "Xiiso aad ku akhriso oo tijaabiso"],
        note: "Looma baahna inaad barnaamijin hore u taqaanno. Ardayda badankood waxay ka bilaabaan eber."
      }
    },
    it: {
      fields: [
        ["Maamulka shabakadaha", "Dhisidda iyo socodsiinta shabakadaha isku xira xafiisyada, bangiyada iyo xarumaha."],
        ["Maamulka nidaamka iyo server-ka", "Rakibidda, ilaalinta iyo dayactirka server-ro iyo akoonnada isticmaalayaasha."],
        ["Cloud computing", "Ku socodsiinta adeegyada AWS, Azure ama Google Cloud halkii ay ka ahaan lahaayeen mishiinno gudaha ah."],
        ["Taageerada IT iyo maamulka adeegga", "Caawinta isticmaalayaasha, la socodka dhibaatooyinka iyo ilaalinta adeegyada."],
        ["Maamulka database-ka", "Ilaalinta xogta hay'adda mid dhaqso badan, ammaan ah oo la kaydiyay."]
      ],
      prereq: {
        subjects: [["Xisaabta", "Xisaabta aasaasiga ah iyo tirooyinka binary-ga ayaa shabakadaha ka caawiya."], ["Fiisigis ama ICT", "Fahamka aaladaha, korontada iyo calaamadaha."], ["Ingiriisiga", "Buugaagta, fariimaha khaladka iyo imtixaannada shahaadooyinka waa Ingiriis."], ["Isticmaalka kombiyuutarka", "Operating systems iyo qaybaha kombiyuutarka."]],
        skills: ["Hagaajinta cilladaha tallaabo-tallaabo", "Samir isticmaalayaasha ku saabsan", "Caado qoris/diiwaangelin wanaagsan", "Rabitaan aad ku sii barato qalab cusub"],
        note: "Layliga gacanta ayaa ka muhiimsan aragtida halkan. Lab yar oo guri (xitaa virtual ah) ayaa faa'iido weyn leh."
      }
    },
    se: {
      fields: [
        ["Horumarinta web-ka", "Websaydhyo iyo web apps ku shaqeeya browser-ka."],
        ["Horumarinta app-yada mobilka", "App-yada Android iyo iOS, sida lacagta mobilka iyo gaarsiinta."],
        ["Backend iyo APIs", "Server-ro iyo databases ka dambeeya app-yada dadku isticmaalaan."],
        ["DevOps iyo gaarsiinta cloud", "Otomaatigga tijaabinta, daabulaadda iyo la-socodka."],
        ["Tijaabinta software iyo tayada", "Hubinta in software-ku shaqeeyo ka hor intaysan isticmaalayaashu helin cilladaha."]
      ],
      prereq: {
        subjects: [["Xisaabta", "Macquulka iyo xallinta dhibaatada waa wadnaha barnaamijinta."], ["Ingiriisiga", "Code-ka, docs iyo shaqada kooxeed waxay ku shaqeeyaan Ingiriis."], ["Farshaxan ama naqshad (waa mid caawiya)", "Wuxuu kaa caawiyaa dhisidda shaashado dadku ku raaxaystaan."], ["Qorista", "Shuruudo cad, faallooyin iyo faylasha README."]],
        skills: ["Kala jajabinta dhibaatooyinka waaweyn qaybo yaryar", "Shaqada kooxeed iyo isgaarsiin cad", "Daryeelka faahfaahinta", "Is-barashada qalab cusub"],
        note: "Looma baahna code hore. Laptop iyo caado maalinle ah oo coding ayaa ugu muhiimsan."
      }
    },
    ds: {
      fields: [
        ["Falanqaynta xogta iyo business intelligence", "U beddelidda tirooyinka ceyriin warbixinno hagaya go'aamada."],
        ["Tirakoob iyo moodeelayn", "Cabbiraadda shaki-la'aanta iyo helidda waxa runtii muhiim ah."],
        ["Machine learning", "Models saadaalinaya natiijooyin sida baahida ama khatarta."],
        ["Injineernimada xogta", "Dhisidda pipelines iyo databases keena xog nadiif ah."],
        ["Muuqaalaynta xogta iyo warbixinta", "Sharaxaadda xogta adigoo isticmaalaya dashboards iyo jaantusyo cad."]
      ],
      prereq: {
        subjects: [["Xisaabta (xooggan)", "Algebra, tirakoob iyo itimaal ayaa si joogto ah loo isticmaalaa."], ["Ingiriisiga", "Datasets, maktabado iyo cilmi-baaris badankoodu waa Ingiriis."], ["Dhaqaale ama Juqraafi", "Wuxuu kaa caawiyaa fahamka xogta ku xeeran."], ["ICT / Excel", "Tallaabo fudud oo hore oo loo maro shaxanka iyo qaababka."]],
        skills: ["Xiiso aad u leedahay sababta wax u dhacaan", "Daryeel faahfaahin iyo sugnaan", "Sharaxaadda natiijooyinka si fudud", "Raaxo kula jirto tirooyinka"],
        note: "Haddii aad jeceshahay xisaabta iyo helidda qaababka, barnaamijkan ayaa kuu habboon."
      }
    },
    ai: {
      fields: [
        ["Machine learning", "Nidaamyo ka hagaaga khibrad iyo xog."],
        ["Natural language processing", "Kombiyuutarro akhriya, tarjumaya oo qora luqadda aadanaha."],
        ["Computer vision", "Barista mishiinnada inay fahmaan sawirro iyo fiidiyoow."],
        ["Robotics iyo nidaamyo caqli leh", "Mishiinno dareemaya deegaankooda oo wax qaba."],
        ["Generative AI iyo luqad-models", "Dhisidda app-yo adigoo isticmaalaya models wax qora, code qora oo wax abuura."],
        ["AI mas'uul ah iyo anshax", "Cadaalad, asturnaan iyo badbaado marka AI dadka saameeyo."]
      ],
      prereq: {
        subjects: [["Xisaabta (xooggan)", "Algebra, calculus iyo itimaal ayaa ku hoos jira model kasta."], ["Fiisigis", "Wuxuu dhisaa xirfadaha moodeelaynta iyo xallinta dhibaatada."], ["Ingiriisiga", "Cilmi-baarista iyo qalabka waxaa lagu qoray Ingiriis."], ["ICT / barnaamijin", "Python waa luqadda ugu muhiimsan ee AI."]],
        skills: ["Samir tijaabooyin guuldareysta", "Akhrinta waraaqaha farsamo", "Raaxo xisaabta kula jirto", "Fekerka anshaxa iyo cadaaladda"],
        note: "Xisaab xooggan way caawisaa, laakiin tallaabo-tallaabo ayaad dhisi kartaa barnaamijinta ag taagan."
      }
    },
    cy: {
      fields: [
        ["Amniga shabakadaha", "Ilaalinta shabakadaha dadka soo dhex gala iyo xad-gudubka."],
        ["Ethical hacking iyo penetration testing", "Tijaabinta nidaamyada si sharci ah si loo helo nuqullada daciifka ah ka hor weeraryahanka."],
        ["Digital forensics", "Baarista dhacdooyinka iyo soo celinta caddaymaha dijital ah."],
        ["Cryptography", "Ilaalinta macluumaadka sirta ah iyo xaqiijinta cidda soo dirtay."],
        ["Hawlaha amniga (SOC)", "La-socodka nidaamyada iyo jawaabta weeraradda."],
        ["Maamulka, khatarta iyo u hoggaansanaanta", "Siyaasadda amniga, hubinta iyo xeerarka ilaalinta xogta."]
      ],
      prereq: {
        subjects: [["Xisaabta", "Macquulka iyo aragtida tirooyinka waxay ka caawiyaan cryptography."], ["ICT", "Shabakadaha iyo operating systems waa aasaaska."], ["Ingiriisiga", "Warbixinnada, digniinaha iyo tababarku waa Ingiriis."], ["Tarbiyada muwaadinka ama Sharci (waa mid caawiya)", "Asturnaanta, anshaxa iyo sharciga denbiyada cyber."]],
        skills: ["Weydiinta \"sidee ayay tani u jajabi kartaa?\"", "Daacadnimo iyo anshax xooggan", "Samir iyo daryeel faahfaahin", "Deganaansho cadaadis hoostiis"],
        note: "Waligaa tijaabi nidaamyo aad leedahay ama aad ogolaansho qoran u haysato."
      }
    },
    iot: {
      fields: [
        ["Embedded systems", "Barnaamijinta kombiyuutarro yaryar oo ku jira aaladaha."],
        ["Shabakadaha wireless-ka iyo protocols", "Wi-Fi, Bluetooth, LoRa iyo MQTT ee aaladaha isku xiran."],
        ["Beeraha caqliga leh iyo magaalooyinka caqliga leh", "Sensor-ro waraabinta, biyaha, taraafikada iyo korontada."],
        ["Otomaatigga warshadaha", "La-socodka iyo xakamaynta mishiinnada iyo warshadaha."],
        ["Cloud iyo edge ee IoT", "Kaydinta xogta aaladaha iyo socodsiinta caqliga meel u dhow."],
        ["Amniga IoT", "Ilaalinta aaladaha isku xiran weeraryahannada."]
      ],
      prereq: {
        subjects: [["Fiisigis", "Korontada, circuits iyo sensor-ro."], ["Xisaabta", "Loo baahan yahay cabbirrada, calaamadaha iyo macquulka."], ["ICT ama sawirka farsamada", "Akhrinta jaantusyada iyo computing-ka aasaasiga ah."], ["Ingiriisiga", "Datasheets iyo casharradu waa Ingiriis."]],
        skills: ["Ku raaxaysiga gacan-ku-dhigga", "Maamulka badbaadada leh ee elektarooniga", "Hagaajinta hardware iyo software labadaba", "Hal-abuur xalinta dhibaatooyinka deegaanka"],
        note: "Kit yar oo jaban (Arduino ama ESP32) ayaa ku filan inaad guriga ku bilowdo barashada."
      }
    }
  };
  Object.keys(X).forEach(function (k) { Object.assign(L.depts[k], X[k]); });
})();
