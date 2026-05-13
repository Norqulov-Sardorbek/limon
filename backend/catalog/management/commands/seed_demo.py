"""Seed the DB with the same demo data the frontend js/data.js exposes."""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from catalog.models import Category, Farmer, Product
from promo.models import PromoCode
from content.models import Testimonial, FAQ, Stats

User = get_user_model()


CATEGORIES = [
    ("sabzavot",    "Sabzavotlar",            "🥕", "#FF8C42"),
    ("meva",        "Mevalar",                "🍎", "#E63946"),
    ("sut",         "Sut mahsulotlari",       "🥛", "#4DA8DA"),
    ("don",         "Don va un",              "🌾", "#D4A373"),
    ("quritilgan",  "Quritilgan mahsulotlar", "🥜", "#9C6644"),
    ("asal",        "Asal va arichilik",      "🍯", "#F4A300"),
    ("tuxum",       "Tuxum va parranda",      "🥚", "#FFB703"),
    ("ziravor",     "Ziravorlar",             "🌶️", "#C1121F"),
]

FARMERS = [
    ("f1",  "Akmal Toirov",        "Toirov fermer xo'jaligi",     "Andijon",            12, 4.9,  847, True, "+998 90 123 11 11", "AT"),
    ("f2",  "Ravshan Yo'ldoshev",  "Yo'ldoshev uzumchilik",       "Samarqand",          18, 4.9,  512, True, "+998 91 222 33 44", "RY"),
    ("f3",  "Dilshod Karimov",     "Karimov dehqon xo'jaligi",    "Farg'ona",            8, 4.7, 1245, True, "+998 93 333 22 11", "DK"),
    ("f4",  "Sherzod Otaboyev",    "Otaboyev donchilik",          "Buxoro",             15, 4.8,  678, True, "+998 94 555 66 77", "SO"),
    ("f5",  "Bahodir Norov",       "Norov anor bog'i",            "Surxondaryo",        22, 5.0,  421, True, "+998 95 444 11 22", "BN"),
    ("f6",  "Gulnoza Saidova",     "Saidova sut fermasi",         "Toshkent viloyati",   6, 4.8,  923, True, "+998 97 888 99 00", "GS"),
    ("f7",  "Sodiqjon Egamberdiyev","Egamberdiyev mevachilik",    "Namangan",           10, 4.7,  589, True, "+998 98 111 22 33", "SE"),
    ("f8",  "Rustam Tursunov",     "Tursunov bug'doy maydoni",    "Qashqadaryo",        25, 4.9,  312, True, "+998 99 666 77 88", "RT"),
    ("f9",  "Anvar Mirzayev",      "Mirzayev sabzavotchilik",     "Jizzax",              7, 4.6,  734, True, "+998 90 555 44 33", "AM"),
    ("f10", "Nodira Yusupova",     "Yusupova asalarichilik",      "Xorazm",             14, 4.9,  267, True, "+998 91 999 88 77", "NY"),
    ("f11", "Bekzod Rajabov",      "Rajabov sut va tvorog",       "Sirdaryo",            9, 4.7,  456, True, "+998 93 444 55 66", "BR"),
    ("f12", "Aliboy Hamidov",      "Hamidov parrandachilik",      "Toshkent viloyati",  11, 4.8, 1102, True, "+998 94 222 11 33", "AH"),
]

# (id, cat, farmerId, name, unit, price, oldPrice, minOrder, stock, harvest, organic, badge, img, desc)
PRODUCTS = [
    (1,  "sabzavot", "f3",  "Pomidor (Bahor)",            "kg",   6500,   8000,  20, 1200, "2026-05-08", True,  "YANGI HOSIL", "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=800&q=80", "Issiqxonada yetishtirilgan, shirin pomidor."),
    (2,  "sabzavot", "f3",  "Bodring (Issiqxona)",        "kg",   7200,   9000,  15,  800, "2026-05-10", True,  "",            "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&q=80", "Toza, achchimagan bodring."),
    (3,  "sabzavot", "f9",  "Kartoshka (Jizzax)",         "kg",   4800,   5500,  50, 5000, "2026-04-25", False, "OPTOM",       "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80", "Sariq kartoshka, oilaviy yetishtirilgan."),
    (4,  "sabzavot", "f9",  "Piyoz (Sariq)",              "kg",   3500,   4200,  50, 8000, "2026-04-20", False, "-17%",        "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=800&q=80", "Saqlash uchun ideal."),
    (5,  "sabzavot", "f9",  "Sabzi",                      "kg",   5200,   6000,  25, 1500, "2026-05-01", True,  "",            "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80", "Shirin, qizil sabzi."),
    (6,  "sabzavot", "f3",  "Bulg'or qalampiri",          "kg",  12000,  14500,  10,  400, "2026-05-09", True,  "PREMIUM",     "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&q=80", "Qizil va sariq aralash."),
    (7,  "sabzavot", "f9",  "Karam (Oq)",                 "kg",   4000,   4800,  30, 2200, "2026-05-05", False, "",            "https://images.unsplash.com/photo-1551278034-3858dfaa90ad?w=800&q=80", "Yangi yig'ilgan, og'ir karam."),
    (8,  "sabzavot", "f9",  "Baqlajon",                   "kg",   6800,   8000,  15,  300, "2026-05-07", True,  "",            "https://images.unsplash.com/photo-1659261200133-5dd17b13b243?w=800&q=80", "Mayda dona, qovurish uchun ideal."),
    (9,  "sabzavot", "f9",  "Qovoq (Sariq)",              "kg",   4500,   5500,  30, 1800, "2026-04-30", True,  "",            "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=800&q=80", "Pishirish va saqlash uchun."),
    (10, "meva",     "f1",  "Olma (Andijon)",             "kg",   8500,  10000,  20, 3200, "2026-04-15", True,  "BESTSELLER",  "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80", "Andijon olmasi."),
    (11, "meva",     "f2",  "Uzum (Husayni)",             "kg",  18000,  22000,  10,  600, "2026-05-08", True,  "PREMIUM",     "https://images.unsplash.com/photo-1599819177626-bd0a39e3a4f5?w=800&q=80", "Samarqand Husayni uzumi."),
    (12, "meva",     "f5",  "Anor (Surxondaryo)",         "kg",  22000,  26000,  15,  850, "2026-05-02", True,  "",            "https://images.unsplash.com/photo-1574580458192-a4cef3eb33f7?w=800&q=80", "Qizil donli, shirin anor."),
    (13, "meva",     "f1",  "Behi",                       "kg",  12000,  14500,  15,  420, "2026-04-28", True,  "",            "https://images.unsplash.com/photo-1633380110125-f6e685676160?w=800&q=80", "Murabbo va kompot uchun ideal."),
    (14, "meva",     "f7",  "Nok (Konferens)",            "kg",  14000,  16000,  15,  380, "2026-05-05", True,  "",            "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=800&q=80", "Yumshoq, shirin nok."),
    (15, "meva",     "f7",  "Anjir",                      "kg",  28000,  32000,   5,  120, "2026-05-09", True,  "PREMIUM",     "https://images.unsplash.com/photo-1601379760883-1bb497a7d023?w=800&q=80", "Yangi terilgan anjir."),
    (16, "meva",     "f9",  "Tarvuz",                     "kg",   3500,   4500,  50, 4500, "2026-05-10", False, "MAVSUM",      "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=800&q=80", "Suvli, qizil ichli tarvuz."),
    (17, "meva",     "f9",  "Qovun (Mirzachul)",          "kg",   8000,   9500,  30, 1500, "2026-05-08", True,  "BESTSELLER",  "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=800&q=80", "Sariq, shirin Mirzachul qovuni."),
    (18, "meva",     "f1",  "Olxo'ri",                    "kg",  16000,  18500,  10,  280, "2026-05-04", True,  "",            "https://images.unsplash.com/photo-1601566983687-26abdd23b06d?w=800&q=80", "Qora olxo'ri."),
    (19, "meva",     "f7",  "O'rik",                      "kg",  12000,  14000,  15,  520, "2026-05-06", True,  "",            "https://images.unsplash.com/photo-1595475207225-428b62bda831?w=800&q=80", "Asal o'rik."),
    (20, "sut",      "f6",  "Sut (Tabiiy, 1L)",           "litr", 8500,  10000,  30,  600, "2026-05-12", True,  "KUNDALIK",    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80", "Kunlik sog'iladi."),
    (21, "sut",      "f11", "Tvorog (Uy)",                "kg",  28000,  32000,  10,  180, "2026-05-12", True,  "",            "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=800&q=80", "Yangi tayyorlangan tvorog."),
    (22, "sut",      "f11", "Smetana (25%)",              "kg",  32000,  36000,  10,  150, "2026-05-12", True,  "",            "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80", "Qalin, tabiiy smetana."),
    (23, "sut",      "f6",  "Qatiq",                      "litr",12000,  14000,  20,  240, "2026-05-12", True,  "",            "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=800&q=80", "Tabiiy zakvaska bilan."),
    (24, "sut",      "f11", "Suzma",                      "kg",  35000,  40000,   8,   90, "2026-05-11", True,  "PREMIUM",     "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80", "Qalin, tuzli suzma."),
    (25, "sut",      "f6",  "Pishloq (Suluguni)",         "kg",  65000,  72000,   5,   60, "2026-05-11", True,  "",            "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80", "Tuzlangan, mazali pishloq."),
    (26, "sut",      "f6",  "Sariyog' (Uy)",              "kg",  95000, 110000,   5,   45, "2026-05-10", True,  "PREMIUM",     "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80", "Tabiiy sut yog'idan."),
    (27, "don",      "f8",  "Bug'doy uni (Oliy nav)",     "kg",   6800,   7800,  50, 8000, "2026-04-10", False, "OPTOM",       "https://images.unsplash.com/photo-1574323347407-f5e1c0cf4b59?w=800&q=80", "Toshkent tegirmonida tortilgan."),
    (28, "don",      "f4",  "Guruch (Chungara)",          "kg",  18000,  21000,  30, 2400, "2026-03-15", True,  "BESTSELLER",  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80", "Asl Chungara guruchi."),
    (29, "don",      "f4",  "Mosh",                       "kg",  22000,  25000,  25, 1500, "2026-03-20", True,  "",            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80", "Yashil mosh."),
    (30, "don",      "f4",  "No'xat",                     "kg",  18000,  21000,  25, 1800, "2026-03-20", True,  "",            "https://images.unsplash.com/photo-1604908554007-dec7e94d57c4?w=800&q=80", "Sariq no'xat."),
    (31, "don",      "f8",  "Makka uni",                  "kg",   9500,  11000,  30, 1200, "2026-04-05", False, "",            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80", "Mayda tortilgan makka uni."),
    (32, "quritilgan","f10","Mayiz (Kishmish)",           "kg",  65000,  75000,  10,  480, "2025-10-15", True,  "",            "https://images.unsplash.com/photo-1599582909646-2bf6f4f50c64?w=800&q=80", "Quyoshda quritilgan."),
    (33, "quritilgan","f10","Quritilgan o'rik",           "kg",  85000,  95000,   8,  320, "2025-08-20", True,  "PREMIUM",     "https://images.unsplash.com/photo-1597306838104-d3f87dd6c91d?w=800&q=80", "Asal o'rikdan quritilgan."),
    (34, "quritilgan","f10","Bodom mag'zi",               "kg", 145000, 165000,   5,  180, "2025-09-10", True,  "",            "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80", "Toza, yangi mag'iz."),
    (35, "quritilgan","f10","Yong'oq mag'zi",             "kg", 125000, 145000,   5,  220, "2025-10-20", True,  "",            "https://images.unsplash.com/photo-1623492821677-c4eea30c8da7?w=800&q=80", "Toza yong'oq mag'zi."),
    (36, "asal",      "f10","Tog' asali",                 "kg",  95000, 120000,   5,  140, "2026-04-01", True,  "PREMIUM",     "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80", "Chimyon tog'laridagi gullardan."),
    (37, "asal",      "f10","Beda asali",                 "kg",  75000,  90000,   5,  220, "2026-04-15", True,  "",            "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&q=80", "Yengil ta'mli."),
    (38, "tuxum",     "f12","Tovuq tuxumi (30 dona)",     "dona",32000,  36000,  20, 1200, "2026-05-12", True,  "KUNDALIK",    "https://images.unsplash.com/photo-1486824899830-2fb3c97a2cc7?w=800&q=80", "Erkin yurib boqilgan tovuqlardan."),
    (39, "tuxum",     "f12","Bedana tuxumi (20 dona)",    "dona",25000,  28000,  15,  600, "2026-05-12", True,  "",            "https://images.unsplash.com/photo-1610208344659-37afc1e4cb64?w=800&q=80", "Foydali bedana tuxumi."),
    (40, "ziravor",   "f4", "Zira (Asl)",                 "kg",  85000,  95000,   3,   90, "2025-09-01", True,  "",            "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80", "Asl Buxoro zirasi."),
    (41, "ziravor",   "f4", "Qora murch (Tuyilgan)",      "kg",  62000,  72000,   3,  110, "2025-09-10", False, "",            "https://images.unsplash.com/photo-1599909533730-c1d8e35d96f4?w=800&q=80", "Yangi tuyilgan murch."),
]

PROMOS = [
    ("YANGI10", "percent", 10,  500000, "10% — yangi mijoz"),
    ("OPTOM15", "percent", 15, 2000000, "15% — yirik buyurtma"),
    ("BEPUL",   "fixed", 50000,  300000, "Bepul yetkazib berish"),
]

TESTIMONIALS = [
    ("Botir Ergashev",      "\"Ergash\" do'koni egasi",    "Toshkent",  "Bozordan emas, dehqondan to'g'ridan-to'g'ri olganim uchun foyda 20% ortdi. Mahsulot ham toza, yangi.", 5),
    ("Mahliyo Olimova",     "\"Yangi market\" tarmog'i",   "Samarqand", "5 ta do'konimga har kuni Limon orqali sut va sabzavot keladi. Logistika g'amini yedik.", 5),
    ("Sanjar Qodirov",      "\"Sanjar minimarket\"",       "Farg'ona",  "Avval 4-5 ta vositachidan sotib olardim. Endi 1 ta dehqondan — narx pasaydi, sifat oshdi.", 5),
    ("Dilfuza Rahmonova",   "\"Oila\" do'koni",            "Andijon",   "Tarvuz va qovun mavsumida 100 kg gacha buyurtma beraman. Dehqon to'g'ridan-to'g'ri yetkazadi.", 5),
    ("Olim Karimov",        "\"Olim Aka\" do'koni",        "Buxoro",    "Guruch va mosh narxida 18% tejadim. Ko'p yillik mijoz bo'lib qoldim.", 5),
    ("Zarina Yo'ldoshova",  "\"Toza Mahsulot\" do'koni",   "Toshkent",  "Sifat nazorati zo'r. Har bir partiyaga sertifikat va dehqon ma'lumoti biriktirilgan.", 5),
]

FAQS = [
    ("Limon nima va u qanday ishlaydi?",
     "Limon — bu B2B platforma. Biz dehqonlar (yetishtiruvchilar) va do'kon egalari o'rtasida vositachilarsiz to'g'ridan-to'g'ri aloqa o'rnatamiz. Do'kon egasi platformadan mahsulot tanlaydi, dehqon to'plamni tayyorlaydi, biz logistika orqali yetkazib beramiz."),
    ("Nima uchun bozordan ko'ra arzonroq?",
     "Oddiy zanjirda 3-5 ta vositachi bo'ladi: dehqon → ulgurji bozor → yarim ulgurji → chakana → do'kon. Bizda 1 bosqich: dehqon → do'kon. Shu sababli narx 15-30% gacha pasayadi."),
    ("Eng kam buyurtma qancha?",
     "Har bir mahsulot uchun ko'rsatilgan minimal hajm (masalan, pomidor uchun 20 kg). B2B yo'nalish bo'lgani uchun bu bozor narxlari bilan moslashtirilgan."),
    ("Yetkazib berish qancha vaqt oladi?",
     "Toshkent shahri ichida — 4 soat. Viloyatlarga — 24 soat. Sut va meva kabi yangi mahsulotlar — kun ichida."),
    ("To'lov qanday amalga oshiriladi?",
     "Click, Payme, Uzcard, bank o'tkazmasi yoki yetkazib berishda naqd. Doimiy mijozlar uchun — 7 kunlik kredit liniyasi."),
    ("Sifatga kim javob beradi?",
     "Har bir dehqon platformaga ro'yxatdan o'tishda tekshiruvdan o'tadi (xo'jalik hujjatlari, namuna tekshirish). Sifat bo'yicha shikoyat bo'lsa, biz 100% mablag'ni qaytaramiz."),
    ("Dehqon bo'lib qo'shilish mumkinmi?",
     "Albatta! Ro'yxatdan o'tishda 'Dehqon' rolini tanlang. Hujjatlaringizni yuklang, biz 2-3 kun ichida tekshirib, mahsulotlaringizni platformaga qo'yamiz."),
]

STATS = {
    "farmers": 1240,
    "shops": 3850,
    "products": 850,
    "regions": 14,
    "deliveries": 28500,
    "saved_sum": 4_200_000_000,
}


class Command(BaseCommand):
    help = "Seed demo data (categories, farmers, products, promo codes, demo users)."

    @transaction.atomic
    def handle(self, *args, **opts):
        for slug, name, icon, color in CATEGORIES:
            Category.objects.update_or_create(
                slug=slug, defaults={"name": name, "icon": icon, "color": color}
            )
        self.stdout.write(self.style.SUCCESS(f"Categories: {Category.objects.count()}"))

        for slug, name, farm, region, years, rating, deliveries, verified, phone, avatar in FARMERS:
            Farmer.objects.update_or_create(
                slug=slug,
                defaults=dict(
                    name=name, farm=farm, region=region, years=years,
                    rating=rating, deliveries=deliveries, verified=verified,
                    phone=phone, avatar=avatar,
                ),
            )
        self.stdout.write(self.style.SUCCESS(f"Farmers: {Farmer.objects.count()}"))

        for (pid, cat, farmer_id, name, unit, price, old, min_o, stock,
             harvest, organic, badge, img, desc) in PRODUCTS:
            Product.objects.update_or_create(
                id=pid,
                defaults=dict(
                    category_id=cat, farmer_id=farmer_id, name=name, unit=unit,
                    price=price, old_price=old, min_order=min_o, stock=stock,
                    harvest=harvest, organic=organic, badge=badge, img=img,
                    description=desc, custom=False,
                ),
            )
        self.stdout.write(self.style.SUCCESS(f"Products: {Product.objects.count()}"))

        for code, type_, discount, min_order, label in PROMOS:
            PromoCode.objects.update_or_create(
                code=code,
                defaults=dict(type=type_, discount=discount, min_order=min_order, label=label, active=True),
            )
        self.stdout.write(self.style.SUCCESS(f"Promo codes: {PromoCode.objects.count()}"))

        # Demo users (same as js/data.js)
        shop, created = User.objects.get_or_create(
            email="dukon@limon.uz",
            defaults=dict(
                role="shop", name="Demo Do'kon", phone="+998 90 111 22 33",
                shop_name="Yangi Market", region="Toshkent",
                address="Toshkent sh., Yunusobod 5-mavze",
            ),
        )
        if created:
            shop.set_password("demo123")
            shop.save()

        farmer_user, created = User.objects.get_or_create(
            email="dehqon@limon.uz",
            defaults=dict(
                role="farmer", name="Demo Dehqon", phone="+998 91 444 55 66",
                farm_name="Toza Bog'", region="Andijon",
                address="Andijon vil., Asaka tum.",
            ),
        )
        if created:
            farmer_user.set_password("demo123")
            farmer_user.save()

        self.stdout.write(self.style.SUCCESS("Demo users ready: dukon@limon.uz / dehqon@limon.uz (parol: demo123)"))

        Testimonial.objects.all().delete()
        for i, (name, role, region, text, rating) in enumerate(TESTIMONIALS):
            Testimonial.objects.create(name=name, role=role, region=region, text=text, rating=rating, order=i)
        self.stdout.write(self.style.SUCCESS(f"Testimonials: {Testimonial.objects.count()}"))

        FAQ.objects.all().delete()
        for i, (q, a) in enumerate(FAQS):
            FAQ.objects.create(question=q, answer=a, order=i)
        self.stdout.write(self.style.SUCCESS(f"FAQs: {FAQ.objects.count()}"))

        Stats.objects.update_or_create(id=1, defaults=STATS)
        self.stdout.write(self.style.SUCCESS("Stats: 1 row"))
