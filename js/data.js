/* ============================================================
   LIMON — Dehqondan do'konga B2B platforma
   MA'LUMOTLAR BAZASI (mock backend)
   ============================================================ */

const DB = {
  /* ----------- KATEGORIYALAR ----------- */
  categories: [
    { id: "sabzavot",    name: "Sabzavotlar",            icon: "🥕", color: "#FF8C42" },
    { id: "meva",        name: "Mevalar",                icon: "🍎", color: "#E63946" },
    { id: "sut",         name: "Sut mahsulotlari",       icon: "🥛", color: "#4DA8DA" },
    { id: "don",         name: "Don va un",              icon: "🌾", color: "#D4A373" },
    { id: "quritilgan",  name: "Quritilgan mahsulotlar", icon: "🥜", color: "#9C6644" },
    { id: "asal",        name: "Asal va arichilik",      icon: "🍯", color: "#F4A300" },
    { id: "tuxum",       name: "Tuxum va parranda",      icon: "🥚", color: "#FFB703" },
    { id: "ziravor",     name: "Ziravorlar",             icon: "🌶️", color: "#C1121F" }
  ],

  /* ----------- VILOYATLAR ----------- */
  regions: [
    "Toshkent", "Toshkent viloyati", "Andijon", "Farg'ona", "Namangan",
    "Samarqand", "Buxoro", "Xorazm", "Navoiy", "Qashqadaryo",
    "Surxondaryo", "Jizzax", "Sirdaryo", "Qoraqalpog'iston"
  ],

  /* ----------- DEHQONLAR (Farmerlar) ----------- */
  farmers: [
    { id:"f1",  name:"Akmal Toirov",       farm:"Toirov fermer xo'jaligi",     region:"Andijon",        years:12, rating:4.9, deliveries:847,  verified:true, phone:"+998 90 123 11 11", avatar:"AT" },
    { id:"f2",  name:"Ravshan Yo'ldoshev", farm:"Yo'ldoshev uzumchilik",       region:"Samarqand",      years:18, rating:4.9, deliveries:512,  verified:true, phone:"+998 91 222 33 44", avatar:"RY" },
    { id:"f3",  name:"Dilshod Karimov",    farm:"Karimov dehqon xo'jaligi",    region:"Farg'ona",       years:8,  rating:4.7, deliveries:1245, verified:true, phone:"+998 93 333 22 11", avatar:"DK" },
    { id:"f4",  name:"Sherzod Otaboyev",   farm:"Otaboyev donchilik",          region:"Buxoro",         years:15, rating:4.8, deliveries:678,  verified:true, phone:"+998 94 555 66 77", avatar:"SO" },
    { id:"f5",  name:"Bahodir Norov",      farm:"Norov anor bog'i",            region:"Surxondaryo",    years:22, rating:5.0, deliveries:421,  verified:true, phone:"+998 95 444 11 22", avatar:"BN" },
    { id:"f6",  name:"Gulnoza Saidova",    farm:"Saidova sut fermasi",         region:"Toshkent viloyati",years:6, rating:4.8, deliveries:923, verified:true, phone:"+998 97 888 99 00", avatar:"GS" },
    { id:"f7",  name:"Sodiqjon Egamberdiyev",farm:"Egamberdiyev mevachilik",   region:"Namangan",       years:10, rating:4.7, deliveries:589,  verified:true, phone:"+998 98 111 22 33", avatar:"SE" },
    { id:"f8",  name:"Rustam Tursunov",    farm:"Tursunov bug'doy maydoni",    region:"Qashqadaryo",    years:25, rating:4.9, deliveries:312,  verified:true, phone:"+998 99 666 77 88", avatar:"RT" },
    { id:"f9",  name:"Anvar Mirzayev",     farm:"Mirzayev sabzavotchilik",     region:"Jizzax",         years:7,  rating:4.6, deliveries:734,  verified:true, phone:"+998 90 555 44 33", avatar:"AM" },
    { id:"f10", name:"Nodira Yusupova",    farm:"Yusupova asalarichilik",      region:"Xorazm",         years:14, rating:4.9, deliveries:267,  verified:true, phone:"+998 91 999 88 77", avatar:"NY" },
    { id:"f11", name:"Bekzod Rajabov",     farm:"Rajabov sut va tvorog",       region:"Sirdaryo",       years:9,  rating:4.7, deliveries:456,  verified:true, phone:"+998 93 444 55 66", avatar:"BR" },
    { id:"f12", name:"Aliboy Hamidov",     farm:"Hamidov parrandachilik",      region:"Toshkent viloyati",years:11,rating:4.8, deliveries:1102, verified:true, phone:"+998 94 222 11 33", avatar:"AH" }
  ],

  /* ----------- MAHSULOTLAR ----------- */
  /* B2B: minOrder = minimum to'plam, narx — kg yoki dona uchun */
  products: [
    /* ===== SABZAVOTLAR ===== */
    { id:1,  cat:"sabzavot", farmerId:"f3", name:"Pomidor (Bahor)",            unit:"kg",   price:6500,  oldPrice:8000,  minOrder:20, stock:1200, harvest:"2026-05-08", organic:true,  badge:"YANGI HOSIL", img:"https://images.unsplash.com/photo-1561136594-7f68413baa99?w=800&q=80", desc:"Issiqxonada yetishtirilgan, shirin pomidor. Andijon va Farg'ona vodiysidan." },
    { id:2,  cat:"sabzavot", farmerId:"f3", name:"Bodring (Issiqxona)",        unit:"kg",   price:7200,  oldPrice:9000,  minOrder:15, stock:800,  harvest:"2026-05-10", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&q=80", desc:"Toza, achchimagan bodring. Pestitsidlar ishlatilmagan." },
    { id:3,  cat:"sabzavot", farmerId:"f9", name:"Kartoshka (Jizzax)",         unit:"kg",   price:4800,  oldPrice:5500,  minOrder:50, stock:5000, harvest:"2026-04-25", organic:false, badge:"OPTOM",       img:"https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80", desc:"Sariq kartoshka, oilaviy yetishtirilgan. Uzoq saqlanadi." },
    { id:4,  cat:"sabzavot", farmerId:"f9", name:"Piyoz (Sariq)",              unit:"kg",   price:3500,  oldPrice:4200,  minOrder:50, stock:8000, harvest:"2026-04-20", organic:false, badge:"-17%",        img:"https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=800&q=80", desc:"Saqlash uchun ideal. Jizzax sortidan." },
    { id:5,  cat:"sabzavot", farmerId:"f9", name:"Sabzi",                      unit:"kg",   price:5200,  oldPrice:6000,  minOrder:25, stock:1500, harvest:"2026-05-01", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80", desc:"Shirin, qizil sabzi. Ko'k qism bilan." },
    { id:6,  cat:"sabzavot", farmerId:"f3", name:"Bulg'or qalampiri",          unit:"kg",   price:12000, oldPrice:14500, minOrder:10, stock:400,  harvest:"2026-05-09", organic:true,  badge:"PREMIUM",     img:"https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&q=80", desc:"Qizil va sariq aralash. Salat va pishirish uchun." },
    { id:7,  cat:"sabzavot", farmerId:"f9", name:"Karam (Oq)",                 unit:"kg",   price:4000,  oldPrice:4800,  minOrder:30, stock:2200, harvest:"2026-05-05", organic:false, badge:"",            img:"https://images.unsplash.com/photo-1551278034-3858dfaa90ad?w=800&q=80", desc:"Yangi yig'ilgan, og'ir karam." },
    { id:8,  cat:"sabzavot", farmerId:"f9", name:"Baqlajon",                   unit:"kg",   price:6800,  oldPrice:8000,  minOrder:15, stock:300,  harvest:"2026-05-07", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1659261200133-5dd17b13b243?w=800&q=80", desc:"Mayda dona, qovurish uchun ideal." },
    { id:9,  cat:"sabzavot", farmerId:"f9", name:"Qovoq (Sariq)",              unit:"kg",   price:4500,  oldPrice:5500,  minOrder:30, stock:1800, harvest:"2026-04-30", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=800&q=80", desc:"Pishirish va saqlash uchun." },

    /* ===== MEVALAR ===== */
    { id:10, cat:"meva", farmerId:"f1", name:"Olma (Andijon)",                 unit:"kg",   price:8500,  oldPrice:10000, minOrder:20, stock:3200, harvest:"2026-04-15", organic:true,  badge:"BESTSELLER",  img:"https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80", desc:"Andijon olmasi — shirin, suvli, uzoq saqlanadi." },
    { id:11, cat:"meva", farmerId:"f2", name:"Uzum (Husayni)",                 unit:"kg",   price:18000, oldPrice:22000, minOrder:10, stock:600,  harvest:"2026-05-08", organic:true,  badge:"PREMIUM",     img:"https://images.unsplash.com/photo-1599819177626-bd0a39e3a4f5?w=800&q=80", desc:"Samarqand Husayni uzumi. Yangi terilgan." },
    { id:12, cat:"meva", farmerId:"f5", name:"Anor (Surxondaryo)",             unit:"kg",   price:22000, oldPrice:26000, minOrder:15, stock:850,  harvest:"2026-05-02", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1574580458192-a4cef3eb33f7?w=800&q=80", desc:"Qizil donli, shirin anor. Sharbat uchun ideal." },
    { id:13, cat:"meva", farmerId:"f1", name:"Behi",                           unit:"kg",   price:12000, oldPrice:14500, minOrder:15, stock:420,  harvest:"2026-04-28", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1633380110125-f6e685676160?w=800&q=80", desc:"Murabbo va kompot uchun ideal." },
    { id:14, cat:"meva", farmerId:"f7", name:"Nok (Konferens)",                unit:"kg",   price:14000, oldPrice:16000, minOrder:15, stock:380,  harvest:"2026-05-05", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=800&q=80", desc:"Yumshoq, shirin nok." },
    { id:15, cat:"meva", farmerId:"f7", name:"Anjir",                          unit:"kg",   price:28000, oldPrice:32000, minOrder:5,  stock:120,  harvest:"2026-05-09", organic:true,  badge:"PREMIUM",     img:"https://images.unsplash.com/photo-1601379760883-1bb497a7d023?w=800&q=80", desc:"Yangi terilgan anjir. Tezda yetkazib beriladi." },
    { id:16, cat:"meva", farmerId:"f9", name:"Tarvuz",                         unit:"kg",   price:3500,  oldPrice:4500,  minOrder:50, stock:4500, harvest:"2026-05-10", organic:false, badge:"MAVSUM",      img:"https://images.unsplash.com/photo-1563114773-84221bd62daa?w=800&q=80", desc:"Suvli, qizil ichli tarvuz. Mirzachul sortidan." },
    { id:17, cat:"meva", farmerId:"f9", name:"Qovun (Mirzachul)",              unit:"kg",   price:8000,  oldPrice:9500,  minOrder:30, stock:1500, harvest:"2026-05-08", organic:true,  badge:"BESTSELLER",  img:"https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=800&q=80", desc:"Sariq, shirin Mirzachul qovuni." },
    { id:18, cat:"meva", farmerId:"f1", name:"Olxo'ri",                        unit:"kg",   price:16000, oldPrice:18500, minOrder:10, stock:280,  harvest:"2026-05-04", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1601566983687-26abdd23b06d?w=800&q=80", desc:"Qora olxo'ri, juda shirin." },
    { id:19, cat:"meva", farmerId:"f7", name:"O'rik",                          unit:"kg",   price:12000, oldPrice:14000, minOrder:15, stock:520,  harvest:"2026-05-06", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1595475207225-428b62bda831?w=800&q=80", desc:"Asal o'rik — quritish va sharbat uchun." },

    /* ===== SUT MAHSULOTLARI ===== */
    { id:20, cat:"sut", farmerId:"f6",  name:"Sut (Tabiiy, 1L)",               unit:"litr", price:8500,  oldPrice:10000, minOrder:30, stock:600,  harvest:"2026-05-12", organic:true,  badge:"KUNDALIK",    img:"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80", desc:"Kunlik sog'iladi. 4 soat ichida yetkazib beriladi." },
    { id:21, cat:"sut", farmerId:"f11", name:"Tvorog (Uy)",                    unit:"kg",   price:28000, oldPrice:32000, minOrder:10, stock:180,  harvest:"2026-05-12", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1559561853-08451507cbe7?w=800&q=80", desc:"Yangi tayyorlangan tvorog." },
    { id:22, cat:"sut", farmerId:"f11", name:"Smetana (25%)",                  unit:"kg",   price:32000, oldPrice:36000, minOrder:10, stock:150,  harvest:"2026-05-12", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80", desc:"Qalin, tabiiy smetana." },
    { id:23, cat:"sut", farmerId:"f6",  name:"Qatiq",                          unit:"litr", price:12000, oldPrice:14000, minOrder:20, stock:240,  harvest:"2026-05-12", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=800&q=80", desc:"Tabiiy zakvaska bilan." },
    { id:24, cat:"sut", farmerId:"f11", name:"Suzma",                          unit:"kg",   price:35000, oldPrice:40000, minOrder:8,  stock:90,   harvest:"2026-05-11", organic:true,  badge:"PREMIUM",     img:"https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80", desc:"Qalin, tuzli suzma." },
    { id:25, cat:"sut", farmerId:"f6",  name:"Pishloq (Suluguni)",             unit:"kg",   price:65000, oldPrice:72000, minOrder:5,  stock:60,   harvest:"2026-05-11", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80", desc:"Tuzlangan, mazali pishloq." },
    { id:26, cat:"sut", farmerId:"f6",  name:"Sariyog' (Uy)",                  unit:"kg",   price:95000, oldPrice:110000,minOrder:5,  stock:45,   harvest:"2026-05-10", organic:true,  badge:"PREMIUM",     img:"https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80", desc:"Tabiiy sut yog'idan." },

    /* ===== DON VA UN ===== */
    { id:27, cat:"don", farmerId:"f8", name:"Bug'doy uni (Oliy nav)",         unit:"kg",   price:6800,  oldPrice:7800,  minOrder:50, stock:8000, harvest:"2026-04-10", organic:false, badge:"OPTOM",       img:"https://images.unsplash.com/photo-1574323347407-f5e1c0cf4b59?w=800&q=80", desc:"Toshkent tegirmonida tortilgan. Non va pishiriqlar uchun." },
    { id:28, cat:"don", farmerId:"f4", name:"Guruch (Chungara)",              unit:"kg",   price:18000, oldPrice:21000, minOrder:30, stock:2400, harvest:"2026-03-15", organic:true,  badge:"BESTSELLER",  img:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80", desc:"Asl Chungara guruchi — palov uchun ideal." },
    { id:29, cat:"don", farmerId:"f4", name:"Mosh",                           unit:"kg",   price:22000, oldPrice:25000, minOrder:25, stock:1500, harvest:"2026-03-20", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80", desc:"Yashil mosh — sho'rva uchun." },
    { id:30, cat:"don", farmerId:"f4", name:"No'xat",                         unit:"kg",   price:18000, oldPrice:21000, minOrder:25, stock:1800, harvest:"2026-03-20", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1604908554007-dec7e94d57c4?w=800&q=80", desc:"Sariq no'xat — sho'rva va shavla uchun." },
    { id:31, cat:"don", farmerId:"f8", name:"Makka uni",                      unit:"kg",   price:9500,  oldPrice:11000, minOrder:30, stock:1200, harvest:"2026-04-05", organic:false, badge:"",            img:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80", desc:"Mayda tortilgan makka uni." },

    /* ===== QURITILGAN ===== */
    { id:32, cat:"quritilgan", farmerId:"f10", name:"Mayiz (Kishmish)",       unit:"kg",   price:65000, oldPrice:75000, minOrder:10, stock:480,  harvest:"2025-10-15", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1599582909646-2bf6f4f50c64?w=800&q=80", desc:"Quyoshda quritilgan, urug'siz." },
    { id:33, cat:"quritilgan", farmerId:"f10", name:"Quritilgan o'rik",       unit:"kg",   price:85000, oldPrice:95000, minOrder:8,  stock:320,  harvest:"2025-08-20", organic:true,  badge:"PREMIUM",     img:"https://images.unsplash.com/photo-1597306838104-d3f87dd6c91d?w=800&q=80", desc:"Asal o'rikdan quritilgan." },
    { id:34, cat:"quritilgan", farmerId:"f10", name:"Bodom mag'zi",           unit:"kg",   price:145000,oldPrice:165000,minOrder:5,  stock:180,  harvest:"2025-09-10", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80", desc:"Toza, yangi mag'iz." },
    { id:35, cat:"quritilgan", farmerId:"f10", name:"Yong'oq mag'zi",         unit:"kg",   price:125000,oldPrice:145000,minOrder:5,  stock:220,  harvest:"2025-10-20", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1623492821677-c4eea30c8da7?w=800&q=80", desc:"Toza yong'oq mag'zi, oq rangli." },

    /* ===== ASAL ===== */
    { id:36, cat:"asal", farmerId:"f10", name:"Tog' asali",                   unit:"kg",   price:95000, oldPrice:120000,minOrder:5,  stock:140,  harvest:"2026-04-01", organic:true,  badge:"PREMIUM",     img:"https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80", desc:"Chimyon tog'laridagi gullardan." },
    { id:37, cat:"asal", farmerId:"f10", name:"Beda asali",                   unit:"kg",   price:75000, oldPrice:90000, minOrder:5,  stock:220,  harvest:"2026-04-15", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&q=80", desc:"Yengil ta'mli, ochiq rangli." },

    /* ===== TUXUM ===== */
    { id:38, cat:"tuxum", farmerId:"f12", name:"Tovuq tuxumi (30 dona)",      unit:"dona", price:32000, oldPrice:36000, minOrder:20, stock:1200, harvest:"2026-05-12", organic:true,  badge:"KUNDALIK",    img:"https://images.unsplash.com/photo-1486824899830-2fb3c97a2cc7?w=800&q=80", desc:"Erkin yurib boqilgan tovuqlardan. 30 donalik to'plam." },
    { id:39, cat:"tuxum", farmerId:"f12", name:"Bedana tuxumi (20 dona)",     unit:"dona", price:25000, oldPrice:28000, minOrder:15, stock:600,  harvest:"2026-05-12", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1610208344659-37afc1e4cb64?w=800&q=80", desc:"Foydali bedana tuxumi. 20 donalik to'plam." },

    /* ===== ZIRAVOR ===== */
    { id:40, cat:"ziravor", farmerId:"f4", name:"Zira (Asl)",                 unit:"kg",   price:85000, oldPrice:95000, minOrder:3,  stock:90,   harvest:"2025-09-01", organic:true,  badge:"",            img:"https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80", desc:"Asl Buxoro zirasi — palov uchun." },
    { id:41, cat:"ziravor", farmerId:"f4", name:"Qora murch (Tuyilgan)",      unit:"kg",   price:62000, oldPrice:72000, minOrder:3,  stock:110,  harvest:"2025-09-10", organic:false, badge:"",            img:"https://images.unsplash.com/photo-1599909533730-c1d8e35d96f4?w=800&q=80", desc:"Yangi tuyilgan murch." }
  ],

  /* ----------- BUYURTMA STATUSLARI ----------- */
  orderStatuses: [
    { code:"new",        label:"Yangi buyurtma",          desc:"Dehqonga yuborildi" },
    { code:"accepted",   label:"Dehqon qabul qildi",       desc:"Tayyorlash boshlandi" },
    { code:"preparing",  label:"Tayyorlanmoqda",           desc:"Mahsulot qadoqlanmoqda" },
    { code:"shipping",   label:"Yo'lda",                   desc:"Haydovchi yo'lga chiqdi" },
    { code:"delivered",  label:"Yetkazib berildi",         desc:"Do'konga topshirildi" },
    { code:"cancelled",  label:"Bekor qilindi",            desc:"" }
  ],

  /* ----------- PROMO KODLAR ----------- */
  promoCodes: {
    "YANGI10":  { discount:10, type:"percent", minOrder:500000,  label:"10% — yangi mijoz" },
    "OPTOM15":  { discount:15, type:"percent", minOrder:2000000, label:"15% — yirik buyurtma" },
    "BEPUL":    { discount:50000, type:"fixed", minOrder:300000, label:"Bepul yetkazib berish" }
  },

  /* ----------- FOYDALANUVCHI SHARHLARI ----------- */
  testimonials: [
    { name:"Botir Ergashev",   role:"\"Ergash\" do'koni egasi",    region:"Toshkent",   text:"Bozordan emas, dehqondan to'g'ridan-to'g'ri olganim uchun foyda 20% ortdi. Mahsulot ham toza, yangi.", rating:5 },
    { name:"Mahliyo Olimova",  role:"\"Yangi market\" tarmog'i",   region:"Samarqand",  text:"5 ta do'konimga har kuni Limon orqali sut va sabzavot keladi. Logistika g'amini yedik.", rating:5 },
    { name:"Sanjar Qodirov",   role:"\"Sanjar minimarket\"",       region:"Farg'ona",   text:"Avval 4-5 ta vositachidan sotib olardim. Endi 1 ta dehqondan — narx pasaydi, sifat oshdi.", rating:5 },
    { name:"Dilfuza Rahmonova",role:"\"Oila\" do'koni",            region:"Andijon",    text:"Tarvuz va qovun mavsumida 100 kg gacha buyurtma beraman. Dehqon to'g'ridan-to'g'ri yetkazadi.", rating:5 },
    { name:"Olim Karimov",     role:"\"Olim Aka\" do'koni",        region:"Buxoro",     text:"Guruch va mosh narxida 18% tejadim. Ko'p yillik mijoz bo'lib qoldim.", rating:5 },
    { name:"Zarina Yo'ldoshova",role:"\"Toza Mahsulot\" do'koni",  region:"Toshkent",   text:"Sifat nazorati zo'r. Har bir partiyaga sertifikat va dehqon ma'lumoti biriktirilgan.", rating:5 }
  ],

  /* ----------- FAQ ----------- */
  faq: [
    { q:"Limon nima va u qanday ishlaydi?",
      a:"Limon — bu B2B platforma. Biz dehqonlar (yetishtiruvchilar) va do'kon egalari o'rtasida vositachilarsiz to'g'ridan-to'g'ri aloqa o'rnatamiz. Do'kon egasi platformadan mahsulot tanlaydi, dehqon to'plamni tayyorlaydi, biz logistika orqali yetkazib beramiz." },
    { q:"Nima uchun bozordan ko'ra arzonroq?",
      a:"Oddiy zanjirda 3-5 ta vositachi bo'ladi: dehqon → ulgurji bozor → yarim ulgurji → chakana → do'kon. Bizda 1 bosqich: dehqon → do'kon. Shu sababli narx 15-30% gacha pasayadi." },
    { q:"Eng kam buyurtma qancha?",
      a:"Har bir mahsulot uchun ko'rsatilgan minimal hajm (masalan, pomidor uchun 20 kg). B2B yo'nalish bo'lgani uchun bu bozor narxlari bilan moslashtirilgan." },
    { q:"Yetkazib berish qancha vaqt oladi?",
      a:"Toshkent shahri ichida — 4 soat. Viloyatlarga — 24 soat. Sut va meva kabi yangi mahsulotlar — kun ichida." },
    { q:"To'lov qanday amalga oshiriladi?",
      a:"Click, Payme, Uzcard, bank o'tkazmasi yoki yetkazib berishda naqd. Doimiy mijozlar uchun — 7 kunlik kredit liniyasi." },
    { q:"Sifatga kim javob beradi?",
      a:"Har bir dehqon platformaga ro'yxatdan o'tishda tekshiruvdan o'tadi (xo'jalik hujjatlari, namuna tekshirish). Sifat bo'yicha shikoyat bo'lsa, biz 100% mablag'ni qaytaramiz." },
    { q:"Dehqon bo'lib qo'shilish mumkinmi?",
      a:"Albatta! Ro'yxatdan o'tishda 'Dehqon' rolini tanlang. Hujjatlaringizni yuklang, biz 2-3 kun ichida tekshirib, mahsulotlaringizni platformaga qo'yamiz." }
  ],

  /* ----------- STATISTIKA (Landing page uchun) ----------- */
  stats: {
    farmers: 1240,
    shops: 3850,
    products: 850,
    regions: 14,
    deliveries: 28500,
    savedSum: 4200000000  // 4.2 mlrd so'm tejalgan
  }
};

/* ============================================================
   localStorage KALITLARI
   ============================================================ */
const STORAGE_KEYS = {
  USERS:    "limon_users",
  SESSION:  "limon_session",
  CART:     "limon_cart",
  ORDERS:   "limon_orders",
  WISHLIST: "limon_wishlist",
  REVIEWS:  "limon_reviews",
  CUSTOM_PRODUCTS: "limon_custom_products" // dehqonlar qo'shgan
};

function storageGet(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch { return defaultValue; }
}
function storageSet(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function storageRemove(key)     { localStorage.removeItem(key); }

/* ============================================================
   DEMO AKKAUNTLARNI SEED QILISH
   ============================================================ */
(function seedDemoUsers() {
  const users = storageGet(STORAGE_KEYS.USERS, []);
  let changed = false;

  if (!users.find(u => u.email === "dukon@limon.uz")) {
    users.push({
      id: "u_shop_demo",
      role: "shop",
      name: "Demo Do'kon",
      email: "dukon@limon.uz",
      phone: "+998 90 111 22 33",
      password: "demo123",
      shopName: "Yangi Market",
      address: "Toshkent sh., Yunusobod 5-mavze",
      region: "Toshkent",
      createdAt: new Date().toISOString()
    });
    changed = true;
  }
  if (!users.find(u => u.email === "dehqon@limon.uz")) {
    users.push({
      id: "u_farmer_demo",
      role: "farmer",
      name: "Demo Dehqon",
      email: "dehqon@limon.uz",
      phone: "+998 91 444 55 66",
      password: "demo123",
      farmName: "Toza Bog'",
      region: "Andijon",
      address: "Andijon vil., Asaka tum.",
      createdAt: new Date().toISOString()
    });
    changed = true;
  }
  if (changed) storageSet(STORAGE_KEYS.USERS, users);
})();
