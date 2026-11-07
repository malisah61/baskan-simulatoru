// OLAYLAR (senaryolar)
// Her olayın 3 seçeneği vardır. Etkiler: h = halk desteği, z = hazine, o = ordu, d = dış ilişkiler.
// Yer tutucular: {ulke} oyuncunun ülkesi, {komsu} rastgele bir komşu, {rakip} oyunun başında belirlenen tarihi rakip,
//                {guc} rastgele bir büyük güç. Takip olayları, kendisini tetikleyen olayın {komsu}/{guc} değerlerini devralır.
// Seçenek ekleri:
//   sonra: [{ id, tur }]  -> 'tur' kadar tur sonra takip olayı gelir
//   bayrak: 'ad'          -> kalıcı bir iz bırakır (başka olaylar buna bakar)
//   risk: { stat, fxKotu, sKotu } -> başarı şansı ilgili göstergeye bağlıdır; başarısızlıkta fxKotu uygulanır
// Olay ekleri:
//   kosul(s, u)  -> olay ancak bu doğruysa çıkar (s: oyun durumu, u: ülke)
//   takip: true  -> sadece başka bir olaydan tetiklenir
//   kriz: true   -> gösterge kritik seviyeye düşünce öncelikli çıkar
//   agirlik      -> çıkma sıklığı (varsayılan 1)
(function (G) {
  const O = (t, fx, s, ek) => Object.assign({ t, fx, s }, ek || {});

  const OLAYLAR = [
    // ───────────── EKONOMİ ─────────────
    { id: 'grev', kat: 'Ekonomi', ikon: '🏭', baslik: 'Genel Grev',
      metin: 'Başkentteki fabrika işçileri düşük maaşlar yüzünden greve çıktı. Üretim durdu, limanlarda yük bekliyor.',
      sec: [
        O('Maaşlara %20 zam yap', { h: 12, z: -12 }, 'İşçiler sevinçle işe döndü. Maliye Bakanı ise kara kara düşünüyor.'),
        O('Grevi polisle dağıt', { h: -14, z: 4, o: 3 }, 'Üretim yeniden başladı ama sokaklarda öfke büyüyor.', { bayrak: 'sert_yonetim' }),
        O('Sendika ve patronları masaya oturt', { h: 5, z: -4 }, 'Uzun pazarlıklardan sonra orta yol bulundu. Kimse tam mutlu değil ama kimse küs de değil.')
      ] },
    { id: 'enflasyon', kat: 'Ekonomi', ikon: '📈', baslik: 'Fiyatlar Uçtu',
      metin: 'Ekmek, kira ve akaryakıt bir yılda neredeyse iki katına çıktı. Merkez Bankası başkanı senden talimat bekliyor.',
      sec: [
        O('Faizleri sert şekilde artır', { h: -9, z: 8, d: 3 }, 'Krediler pahalandı, esnaf söyleniyor. Ama yatırımcılar sana güvenmeye başladı.'),
        O('Temel gıdaya fiyat tavanı koy', { h: 7, z: -8 }, 'Raflardaki fiyatlar düştü... ama bazı ürünler raflardan kayboldu.'),
        O('Para bas, maaşları artır', { h: 10, z: 10 }, 'Herkesin cebinde daha çok para var. Şimdilik.', { sonra: [{ id: 'hiperenflasyon', tur: 3 }] })
      ] },
    { id: 'yatirim', kat: 'Ekonomi', ikon: '🏗️', baslik: 'Dev Fabrika Teklifi',
      metin: '{guc} merkezli dev bir otomobil şirketi {ulke} topraklarında fabrika kurmak istiyor. Karşılığında 20 yıl vergi muafiyeti talep ediyor.',
      sec: [
        O('Teklifi olduğu gibi kabul et', { h: 6, z: 6, d: 6 }, 'Temel atma töreninde binlerce kişi iş başvurusu yaptı.', { bayrak: 'guc_yatirim' }),
        O('Yerli ortaklık şartı koy', { h: 3, z: 9, d: -2 }, 'Uzun pazarlıktan sonra şirket yüzde 30 yerli ortaklığı kabul etti.'),
        O('Reddet, yerli markayı destekle', { h: 5, z: -10, d: -4 }, 'Milli otomobil projesi için hazineden büyük kaynak ayrıldı.', { bayrak: 'yerli_otomobil' })
      ] },
    { id: 'vergi', kat: 'Ekonomi', ikon: '🧾', baslik: 'Bütçe Açığı',
      metin: 'Maliye Bakanı bütçede büyük bir delik olduğunu söylüyor. Gelir bulunmazsa maaşlar gecikebilir.',
      sec: [
        O('Zenginlere servet vergisi', { h: 8, z: 10, d: -3 }, 'Halk alkışladı. Bazı iş insanları ise servetlerini yurt dışına taşımaya başladı.'),
        O('KDV oranını artır', { h: -10, z: 13 }, 'Hazine rahatladı ama market fişleri herkesin canını sıkıyor.'),
        O('Vergi affı çıkar', { h: 3, z: 7 }, 'Yıllardır vergi kaçıran şirketler sıraya girdi. Dürüst vergi verenler ise kızgın.')
      ] },
    { id: 'issizlik', kat: 'Ekonomi', ikon: '🎓', baslik: 'Diplomalı İşsizler',
      metin: 'Üniversite mezunlarının üçte biri iş bulamıyor. Gençler sosyal medyada "bu ülkede gelecek yok" diye yazıyor.',
      sec: [
        O('Kamuya 200 bin kişi al', { h: 10, z: -12 }, 'Devlet daireleri kalabalıklaştı. Gençler mutlu, bütçe değil.'),
        O('Gençlere girişim kredisi ver', { h: 5, z: -6 }, 'Binlerce küçük şirket kuruldu. Bir kısmı batacak, bir kısmı büyüyecek.', { sonra: [{ id: 'girisim_basarisi', tur: 4 }] }),
        O('"Herkes iş arasın" de, karışma', { h: -8, z: 2 }, 'Açıklaman sosyal medyada alay konusu oldu. Bazı gençler yurt dışına göç ediyor.')
      ] },
    { id: 'petrol', kat: 'Ekonomi', ikon: '🛢️', baslik: 'Petrol Bulundu!',
      metin: 'Jeologlar kıyı açıklarında büyük bir petrol yatağı buldu. Haber yayılır yayılmaz {guc} yetkilileri telefonla aradı.',
      kosul: (s, u) => !s.bayrak.petrol && u.zenginlik <= 4,
      sec: [
        O('Devlet şirketi çıkarsın', { h: 6, z: -8 }, 'Sondaj kulesi kuruluyor. Gelirler birkaç ay sonra gelmeye başlayacak.', { bayrak: 'petrol', sonra: [{ id: 'petrol_geliri', tur: 3 }] }),
        O('İhaleyi {guc} şirketine ver', { z: 10, d: 7, h: -3 }, 'Peşin para hazineye girdi. Muhalefet "ülkeyi sattınız" diyor.', { bayrak: 'petrol' }),
        O('Çevre için yatağı koru', { h: 2, d: 6, z: -2 }, 'Çevreciler seni alkışladı. Ekonomistler ise kaçan fırsata yanıyor.', { bayrak: 'cevreci' })
      ] },
    { id: 'banka', kat: 'Ekonomi', ikon: '🏦', baslik: 'Banka Batıyor',
      metin: 'Ülkenin en büyük ikinci bankası iflasın eşiğinde. Şubelerin önünde paralarını çekmek isteyenler kuyruk oluşturdu.',
      sec: [
        O('Bankayı devlet parasıyla kurtar', { z: -14, h: 3 }, 'Panik durdu ama faturayı vergi mükellefleri ödeyecek.'),
        O('Mevduatlara devlet garantisi ver', { z: -6, h: 6 }, 'Kuyruklar dağıldı. Banka küçülerek ayakta kaldı.'),
        O('Bırak batsın', { h: -12, z: 3, d: -3 }, 'Banka kapandı. Birikimlerini kaybeden binlerce aile sokakta.')
      ] },
    { id: 'kuraklik', kat: 'Ekonomi', ikon: '🌾', baslik: 'Kuraklık',
      metin: 'İki yıldır yeterli yağmur yağmadı. Çiftçiler hasadın yarısını kaybetti ve borçlarını ödeyemiyor.',
      sec: [
        O('Çiftçi borçlarını sil', { h: 9, z: -11 }, 'Köylerde bayram havası var. Bankalar ise memnun değil.'),
        O('Gıdayı yurt dışından ithal et', { h: 2, z: -6, d: 3 }, 'Fiyatlar dengelendi ama yerli üretici zor durumda.'),
        O('Dev sulama projesi başlat', { h: 4, z: -9 }, 'İş makineleri yola çıktı. Sonuçlar yıllar sürecek ama kalıcı olacak.', { bayrak: 'sulama' })
      ] },
    { id: 'olimpiyat', kat: 'Ekonomi', ikon: '🏅', baslik: 'Olimpiyat Adaylığı',
      metin: 'Uluslararası Olimpiyat Komitesi, {ulke} için olimpiyat ev sahipliği kapısını araladı. Ama stadyumlar ve köy için milyarlar gerekiyor.',
      kosul: (s, u) => u.zenginlik >= 2 && !s.bayrak.olimpiyat,
      sec: [
        O('Adaylık başvurusu yap', { z: -12, d: 8, h: 5 }, 'Şantiyeler kuruldu. Bütün dünyanın gözü sende olacak.', { bayrak: 'olimpiyat', sonra: [{ id: 'olimpiyat_sonu', tur: 5 }] }),
        O('{komsu} ile ortak aday ol', { z: -6, d: 10 }, 'İki ülkenin liderleri ortak basın toplantısında el sıkıştı.', { bayrak: 'olimpiyat' }),
        O('Parayı hastanelere harca', { h: 5, d: -2 }, 'Spor yazarları üzgün, doktorlar mutlu.')
      ] },
    { id: 'kripto', kat: 'Ekonomi', ikon: '🪙', baslik: 'Kripto Çılgınlığı',
      metin: 'Gençlerin yarısı birikimini kripto paraya yatırmış. Bir dolandırıcılık borsası çökünce milyonlarca kişi zarar etti.',
      sec: [
        O('Kriptoyu tamamen yasakla', { h: -6, z: 3, d: 2 }, 'İşlemler durdu. Gençler VPN ile devam ediyor.'),
        O('Sıkı ama adil kurallar koy', { h: 3, z: 4, d: 3 }, 'Lisanslı borsalar dönemi başladı. Uzmanlar memnun.'),
        O('Milli dijital para çıkar', { h: 2, z: 6, d: -3 }, '"Dijital {ulke} parası" tanıtıldı. Muhalefet bunun gözetleme aracı olduğunu söylüyor.', { bayrak: 'dijital_para' })
      ] },

    // ───────────── DIŞ POLİTİKA VE SAVAŞ ─────────────
    { id: 'sinir', kat: 'Dış Politika', ikon: '🪖', baslik: 'Sınırda Askeri Yığınak',
      metin: '{komsu} sınırının hemen ötesine tanklar ve binlerce asker yığdı. Resmi açıklama: "tatbikat".',
      kosul: (s, u) => u.komsular.length > 0,
      sec: [
        O('Seferberlik ilan et', { o: 8, z: -10, h: 4, d: -5 }, 'Yedek askerler birliklerine katıldı. Sınır hattı kilitlendi.'),
        O('Diplomatlarını gönder', { d: 6, h: -2 }, 'Diplomatların gerginliği düşürdü. {komsu} askerlerini geri çekti.', { risk: { stat: 'd', fxKotu: { d: -4, h: -5 }, sKotu: 'Görüşmeler çöktü. Sınırda ilk silah sesleri duyuldu.', sonraKotu: [{ id: 'sinir_catisma', tur: 1 }] } }),
        O('{guc} yönetiminden destek iste', { o: 6, d: 4 }, '{guc} bölgeye savaş gemileri gönderdi. Ama bu desteğin bir bedeli olacak.', { sonra: [{ id: 'guc_fatura', tur: 4 }] })
      ] },
    { id: 'ittifak', kat: 'Dış Politika', ikon: '🤝', baslik: 'Askeri İttifak Teklifi',
      metin: '{guc} sana askeri ittifak teklif ediyor: Silah, eğitim ve koruma. Karşılığında ülkene bir askeri üs kurmak istiyor.',
      kosul: s => !s.bayrak.ittifak,
      sec: [
        O('İttifaka katıl', { o: 12, d: 5, h: -6 }, 'Ortak tatbikatlar başladı. Bazı vatandaşlar "bağımsızlığımızı kaybettik" diye protesto ediyor.', { bayrak: 'ittifak' }),
        O('Tarafsız kal', { h: 4, d: -2 }, 'Kimsenin askeri olmayacağını açıkladın. Tarafsızlık seni hem güçlü hem yalnız kılıyor.', { bayrak: 'tarafsiz' }),
        O('Üssü kirala ama ittifaka girme', { z: 12, h: -5, d: 2 }, 'Kira parası hazineye akıyor. Muhalefet "toprak satışı" diyor.')
      ] },
    { id: 'yaptirim', kat: 'Dış Politika', ikon: '🚫', baslik: 'Yaptırım Baskısı',
      metin: '{guc} senden {komsu} hükümetine ekonomik yaptırım uygulamanı istiyor. Ama {komsu} en büyük ticaret ortaklarından biri.',
      kosul: (s, u) => u.komsular.length > 0,
      sec: [
        O('Yaptırımları uygula', { d: 6, z: -7 }, '{guc} memnun. {komsu} ise intikam yemini etti.', { sonra: [{ id: 'misilleme', tur: 2 }] }),
        O('Reddet, ticarete devam', { d: -8, z: 4 }, '{guc} büyükelçisini görüşmeye çağırdı. Ama ticaret sürüyor.'),
        O('İki taraf arasında arabulucu ol', { d: 4, h: 2 }, 'Başkentin barış zirvesine ev sahipliği yaptı.', { risk: { stat: 'd', fxKotu: { d: -6 }, sKotu: 'Zirve sonuçsuz kaldı, iki taraf da sana kırgın.' } })
      ] },
    { id: 'multeci', kat: 'Dış Politika', ikon: '⛺', baslik: 'Mülteci Akını',
      metin: '{komsu} içinde iç savaş çıktı. Yarım milyon insan sınır kapılarında bekliyor; aralarında binlerce çocuk var.',
      kosul: (s, u) => u.komsular.length > 0,
      sec: [
        O('Kapıları aç', { d: 10, h: -7, z: -8 }, 'Dünya basını insanlığını övüyor. Ama şehirlerde kira ve iş gerginliği artıyor.', { bayrak: 'multeci' }),
        O('Sınırı kapat', { d: -10, h: 4 }, 'Kapılar kapandı. Sınırdaki görüntüler dünya gazetelerinin manşetinde.'),
        O('Sınırda kamp kur, BM\'den para iste', { d: 4, z: -3, h: -1 }, 'Çadır kentler kuruldu. BM yardımın bir kısmını gönderdi.')
      ] },
    { id: 'casus', kat: 'Dış Politika', ikon: '🕵️', baslik: 'Casus Yakalandı',
      metin: 'İstihbarat, Savunma Bakanlığı\'nda çalışan bir memurun yıllardır {rakip} için casusluk yaptığını ortaya çıkardı.',
      kosul: s => !!s.rakip,
      sec: [
        O('Canlı yayında ifşa et', { h: 7, d: -6 }, 'Halk öfkeli, milliyetçi duygular kabardı. {rakip} büyükelçisi sınır dışı edildi.'),
        O('Gizlice casus takası yap', { d: 3, o: 3 }, '{rakip} hapishanesindeki iki ajanın geri döndü. Kimse bir şey duymadı.'),
        O('Ona sahte bilgi sızdırt', { o: 5 }, 'Casus, {rakip} yönetimine sahte planlar taşımaya devam ediyor.', { risk: { stat: 'o', fxKotu: { o: -6, h: -4 }, sKotu: 'Oyun fark edildi! Casus kaçtı ve gerçek planları da götürdü.' } })
      ] },
    { id: 'bm', kat: 'Dış Politika', ikon: '🇺🇳', baslik: 'BM Oylaması',
      metin: 'BM Genel Kurulu\'nda {guc} aleyhine bir insan hakları kararı oylanacak. Senin oyun dengeyi değiştirebilir.',
      sec: [
        O('Evet oyu ver', { d: 2, h: 3 }, 'Karar kabul edildi. {guc} soğuk bir açıklama yaptı.', { bayrak: 'guc_kizgin' }),
        O('Hayır oyu ver', { d: 3, z: 4, h: -3 }, '{guc} teşekkür mektubu ve yeni bir ticaret anlaşması gönderdi.'),
        O('Çekimser kal', { d: -1 }, 'Herkes biraz kırıldı ama kimse çok kızmadı.')
      ] },
    { id: 'savas_ucagi', kat: 'Dış Politika', ikon: '✈️', baslik: 'Savaş Uçağı İhalesi',
      metin: 'Hava kuvvetlerinin uçakları 40 yaşında. Generaller acilen yeni uçak istiyor.',
      sec: [
        O('{guc} ülkesinden hazır al', { o: 10, z: -12, d: 4 }, 'İlk filo teslim edildi. Yedek parça için {guc} sana bağımlı.'),
        O('Yerli uçak projesi başlat', { o: 3, z: -10, h: 7 }, 'Mühendisler çalışmaya başladı. Prototip yıllar sürecek ama gurur verici.', { bayrak: 'yerli_savunma' }),
        O('Bütçe yok, eski uçakları onar', { o: -5, z: -2 }, 'Generaller toplantıdan surat asarak çıktı.')
      ] },
    { id: 'nukleer_program', kat: 'Dış Politika', ikon: '☢️', baslik: 'Gizli Program',
      metin: 'Baş bilim danışmanın, beş yılda nükleer silah üretebileceklerini fısıldıyor. "Kimse bize bir daha meydan okuyamaz" diyor.',
      kosul: (s, u) => u.askeri >= 2 && u.askeri <= 4 && !s.bayrak.nukleer && u.nufus > 5,
      sec: [
        O('Gizlice başlat', { o: 14, z: -10 }, 'Dağların altında bir tesis inşa ediliyor...', { bayrak: 'nukleer', sonra: [{ id: 'nukleer_ifsa', tur: 4 }] }),
        O('Sadece sivil enerji için kullan', { z: -6, d: 5, h: 2 }, 'Uluslararası denetçiler programı övdü.'),
        O('Projeyi tamamen reddet', { d: 3, o: -2 }, 'Bilim danışmanı istifa etti. Diplomatlar rahatladı.')
      ] },
    { id: 'deniz', kat: 'Dış Politika', ikon: '🚢', baslik: 'Tartışmalı Sular',
      metin: '{komsu} sondaj gemisini iki ülke arasındaki tartışmalı sulara gönderdi. Muhalefet "egemenlik hakkımız çiğneniyor" diye bağırıyor.',
      kosul: (s, u) => u.komsular.length > 0,
      sec: [
        O('Donanmayı gönder', { h: 8, d: -6 }, '{komsu} gemisi geri çekildi. Halk zaferi kutluyor.', { risk: { stat: 'o', fxKotu: { o: -10, h: -6 }, sKotu: 'Gemiler çarpıştı! Bir fırkateyn ağır hasar aldı ve geri çekilmek zorunda kaldın.' } }),
        O('Uluslararası mahkemeye başvur', { d: 6, h: -4 }, 'Dava yıllar sürecek ama hukuken güçlüsün.'),
        O('Ortak işletme teklif et', { d: 8, z: 6, h: -6 }, 'Kaynaklar paylaşılacak. Milliyetçiler "teslimiyet" diyor.')
      ] },
    { id: 'ziyaret', kat: 'Dış Politika', ikon: '🛬', baslik: 'Liderin Ziyareti',
      metin: '{guc} lideri resmi ziyaret için başkente geliyor. Ancak muhalefet ziyareti protesto etmeye hazırlanıyor.',
      sec: [
        O('Kırmızı halıyla karşıla', { d: 9, h: -4, z: 3 }, 'Görkemli tören dünyaya canlı yayınlandı. 12 anlaşma imzalandı.'),
        O('Sade bir iş toplantısı yap', { d: 4 }, 'Kısa ve verimli bir görüşme oldu.'),
        O('Son anda ziyareti iptal et', { h: 6, d: -10 }, 'Muhalefet bile seni alkışladı. {guc} ise bunu unutmayacak.', { bayrak: 'guc_kizgin' })
      ] },
    { id: 'teror', kat: 'Güvenlik', ikon: '💥', baslik: 'Bombalı Saldırı',
      metin: 'Başkentin en kalabalık meydanında bombalı saldırı oldu. Ülke yasta, herkes senden güçlü bir cevap bekliyor.',
      sec: [
        O('Sert askeri operasyon başlat', { o: 6, h: 6, d: -4, z: -6 }, 'Saldırganların kampları vuruldu. Halk birlik içinde.'),
        O('İstihbaratı yeniden yapılandır', { o: 3, z: -5, h: 2 }, 'Yeni bir güvenlik teşkilatı kuruldu. Sonuçlar zaman alacak.'),
        O('Olağanüstü hal ilan et', { o: 8, h: -5, d: -6 }, 'Sokağa çıkma yasakları başladı. İnsan hakları örgütleri endişeli.', { bayrak: 'ohal' })
      ] },

    // ───────────── İÇ POLİTİKA ─────────────
    { id: 'muhalefet', kat: 'İç Politika', ikon: '🗳️', baslik: 'Muhalefet Lideri',
      metin: 'Muhalefet liderinin anketlerdeki oyu seninkini geçti. Danışmanların onun eski bir yolsuzluk dosyasını ortaya çıkarabileceğini söylüyor; ama kanıtlar zayıf.',
      sec: [
        O('Tutuklanmasını sağla', { h: -10, d: -8, o: 2 }, 'Muhalefet lideri gözaltında. Sokaklar karıştı, dünya basını "diktatörlük" yazıyor.', { bayrak: 'sert_yonetim' }),
        O('Dosyayı bağımsız yargıya bırak', { d: 3, h: 2 }, 'Hukuka saygın takdir topladı. Yarış devam ediyor.'),
        O('Dosyayı basına sızdır', { h: 4, d: -2 }, 'Haber patladı. Gerçek mi yalan mı kimse bilmiyor ama rakibin yara aldı.', { risk: { stat: 'h', fxKotu: { h: -10 }, sKotu: 'Sızıntının senden geldiği ortaya çıktı! Büyük skandal.' } })
      ] },
    { id: 'basin', kat: 'İç Politika', ikon: '📰', baslik: 'Muhalif Gazete',
      metin: 'Ülkenin en çok okunan gazetesi her gün seni eleştiren manşetler atıyor. Bugünkü manşet: "Başkan Uyuyor".',
      sec: [
        O('Gazeteyi kapat', { h: -8, d: -9 }, 'Matbaalar mühürlendi. Gazeteciler yurt dışından yayına devam ediyor.', { bayrak: 'sansur' }),
        O('Görmezden gel', { d: 3, h: -2 }, 'Basın özgürlüğü endekslerinde yükseldin. Manşetler sürüyor.'),
        O('Gazeteye özel röportaj ver', { h: 6 }, 'Zor sorulara içtenlikle cevap verdin. Herkes şaşırdı.', { risk: { stat: 'h', fxKotu: { h: -7 }, sKotu: 'Röportajda söylediğin bir cümle bağlamından koparılıp viral oldu.' } })
      ] },
    { id: 'anayasa', kat: 'İç Politika', ikon: '📜', baslik: 'Anayasa Değişikliği',
      metin: 'Danışmanların, başkanlık yetkilerini genişleten yeni bir anayasa taslağı hazırladı. Görev süresi sınırı da kalkıyor.',
      kosul: s => !s.bayrak.anayasa,
      sec: [
        O('Halkı referanduma götür', { h: -3, d: 2 }, 'Referandum kabul edildi! Artık dönem sınırın yok.', { bayrak: 'anayasa', risk: { stat: 'h', fxKotu: { h: -8 }, sKotu: 'Referandum reddedildi. Ağır bir siyasi yenilgi.' }, sonuc: s => { s.bayrak.sinirsiz_donem = true; } }),
        O('Meclisten zorla geçir', { o: 3, h: -10, d: -8 }, 'Gece yarısı yapılan oylamayla anayasa değişti. Artık dönem sınırın yok.', { bayrak: 'anayasa', sonuc: s => { s.bayrak.sinirsiz_donem = true; s.bayrak.sert_yonetim = true; } }),
        O('Taslağı çöpe at', { h: 5, d: 4 }, '"Demokrasi benden büyüktür" sözün manşetlere çıktı.', { bayrak: 'anayasa' })
      ] },
    { id: 'yolsuzluk', kat: 'İç Politika', ikon: '💰', baslik: 'Bakan Rüşvet Aldı',
      metin: 'Ulaştırma Bakanı\'nın bir köprü ihalesinde milyonlarca rüşvet aldığı ortaya çıktı. Bakan, senin en eski dostun.',
      sec: [
        O('Görevden al ve yargıla', { h: 9, d: 3 }, 'Halk "kimse kanunun üstünde değil" mesajını sevdi. Dostun sana küs.'),
        O('Onu koru', { h: -10, z: 2 }, 'Bakan görevde kaldı. Anketlerde sert düşüş var.', { bayrak: 'yolsuz' }),
        O('Sessizce istifa ettir', { h: 2 }, 'Bakan "sağlık sorunları" nedeniyle çekildi. Herkes gerçeği biliyor ama konu kapandı.')
      ] },
    { id: 'protesto', kat: 'İç Politika', ikon: '✊', baslik: 'Park Protestosu',
      metin: 'Şehir merkezindeki son parkın yerine alışveriş merkezi yapılmasına karşı başlayan küçük eylem, yüz binlerin katıldığı bir harekete dönüştü.',
      sec: [
        O('Projeyi iptal et, gençleri dinle', { h: 9, z: -4 }, 'Park kurtuldu. Gençler ilk defa seni alkışladı.'),
        O('Polisi gönder', { h: -12, o: 2, d: -5 }, 'Biber gazı görüntüleri dünyaya yayıldı.', { bayrak: 'sert_yonetim' }),
        O('Karşı miting düzenle', { h: -2, z: -3 }, 'Taraftarların meydanı doldurdu. Ülke ikiye bölündü.')
      ] },
    { id: 'egitim', kat: 'İç Politika', ikon: '📚', baslik: 'Eğitim Reformu',
      metin: 'Uluslararası testlerde {ulke} öğrencileri son sıralarda. Öğretmenler düşük maaştan, veliler kalabalık sınıflardan şikâyetçi.',
      sec: [
        O('Öğretmen maaşlarını ikiye katla', { h: 7, z: -11 }, 'En iyi mezunlar öğretmen olmak için sıraya giriyor.', { bayrak: 'egitim' }),
        O('Her okula tablet ve internet', { h: 5, z: -7 }, 'Teknoloji okullara girdi. Bazı öğretmenler nasıl kullanacağını bilmiyor.'),
        O('Özel okullara teşvik ver', { h: -4, z: 3 }, 'Zengin aileler memnun. Devlet okulları daha da yalnız.')
      ] },
    { id: 'saglik', kat: 'İç Politika', ikon: '🏥', baslik: 'Hastane Kuyrukları',
      metin: 'Devlet hastanelerinde randevu bulmak üç ay sürüyor. Bir hastanın acil serviste beklerken hayatını kaybetmesi ülkeyi sarstı.',
      sec: [
        O('50 yeni şehir hastanesi yap', { h: 9, z: -13 }, 'Vinçler şehirlerin silüetini değiştirdi.'),
        O('Özel sigortayı zorunlu yap', { h: -6, z: 7 }, 'Bekleme süreleri kısaldı, ama sigorta parası ödeyemeyenler zor durumda.'),
        O('Yurt dışından doktor getir', { h: 4, z: -5, d: 3 }, 'Binlerce yabancı doktor işe başladı. Dil sorunları var ama kuyruklar kısalıyor.')
      ] },
    { id: 'emekli', kat: 'İç Politika', ikon: '👴', baslik: 'Emekliler Sokakta',
      metin: 'Emekli maaşlarının kiraya bile yetmediği söyleniyor. Binlerce emekli bakanlık önünde oturma eylemi yapıyor.',
      sec: [
        O('Emekli maaşlarına büyük zam', { h: 10, z: -12 }, 'Yaşlılar seni dualarla anıyor.'),
        O('Emeklilik yaşını yükselt', { h: -11, z: 10, d: 2 }, 'Uluslararası kredi kuruluşları seni övdü. Çalışanlar ise öfkeli.'),
        O('Ücretsiz ulaşım ve indirim kartı', { h: 4, z: -4 }, 'Küçük ama hoş bir jest. Emekliler biraz yumuşadı.')
      ] },
    { id: 'ozerklik', kat: 'İç Politika', ikon: '🗺️', baslik: 'Özerklik Talebi',
      metin: 'Ülkenin dağlık bölgesinde yaşayan halk, kendi dilinde eğitim ve yerel özerklik istiyor. Bölgede gerginlik tırmanıyor.',
      sec: [
        O('Geniş özerklik ver', { h: -5, d: 7, o: -3 }, 'Bölgede bayram havası. Milliyetçiler "ülke bölünüyor" diyor.'),
        O('Kültürel haklar ver, özerklik değil', { h: 3, d: 4 }, 'Orta yol çoğu kişiyi tatmin etti.'),
        O('Talepleri sert şekilde bastır', { o: 4, h: -4, d: -9 }, 'Bölge askeri kontrole alındı. Gerilim yeraltına indi.', { bayrak: 'sert_yonetim', sonra: [{ id: 'isyan', tur: 4 }] })
      ] },
    { id: 'asgari', kat: 'İç Politika', ikon: '💵', baslik: 'Asgari Ücret',
      metin: 'Sendikalar asgari ücrete %50 zam istiyor. İşverenler bunun binlerce küçük işletmeyi batıracağını söylüyor.',
      sec: [
        O('%50 zam ver', { h: 11, z: -6, d: -2 }, 'Milyonlar sevindi. Bazı küçük işletmeler kapandı.'),
        O('%20 zam ver', { h: 3, z: -2 }, 'Kimse çok mutlu değil, kimse çok kızgın değil.'),
        O('Zam yok, vergi indirimi yap', { h: -6, z: -5 }, 'İşverenler rahatladı, işçiler yürüyüş başlattı.')
      ] },

    // ───────────── AFETLER ─────────────
    { id: 'deprem', kat: 'Afet', ikon: '🏚️', baslik: 'Büyük Deprem',
      metin: 'Gece 04:17\'de 7,4 büyüklüğünde bir deprem sanayi şehrini yerle bir etti. Enkaz altında binlerce kişi var.',
      sec: [
        O('Orduyu kurtarmaya gönder', { h: 8, o: -4, z: -8 }, 'Askerler 72 saat boyunca uyumadan çalıştı. Mucize kurtarışlar yaşandı.'),
        O('Uluslararası yardım çağrısı yap', { d: 8, h: 3, z: -4 }, 'Dünyanın dört bir yanından arama kurtarma ekipleri geldi.'),
        O('Yerel yönetimlere bırak', { h: -15, z: -2 }, 'Kurtarma çok yavaş ilerledi. Öfkeli halk "devlet nerede?" diye soruyor.')
      ] },
    { id: 'salgin', kat: 'Afet', ikon: '🦠', baslik: 'Yeni Salgın',
      metin: 'Bilinmeyen bir virüs hızla yayılıyor. Hastaneler dolmaya başladı. Bilim kurulu acil önlem istiyor.',
      sec: [
        O('Tam kapanma ilan et', { h: -6, z: -12, d: 3 }, 'Sokaklar boşaldı. Vaka sayıları düştü, ekonomi de.'),
        O('Maske, test ve aşı kampanyası', { h: 3, z: -7, d: 2 }, 'Dengeli plan işe yarıyor. Salgın kontrol altına alınıyor.'),
        O('"Basit bir grip" de, hayat devam etsin', { h: 4, z: 3 }, 'Virüs beklenenden hafif çıktı. Ekonominin çarkları dönmeye devam etti.', { risk: { stat: 'h', fxKotu: { h: -16, d: -6 }, sKotu: 'Hastaneler çöktü. Ölüm sayıları korkunç boyutlara ulaştı.' } })
      ] },
    { id: 'sel', kat: 'Afet', ikon: '🌊', baslik: 'Sel Felaketi',
      metin: 'Üç gün süren sağanak yağış nehirleri taşırdı. Onlarca köy sular altında, köprüler yıkıldı.',
      sec: [
        O('Afetzedelere yeni evler yap', { h: 8, z: -10 }, 'Bir yılda yeni mahalleler kuruldu.'),
        O('Dere yataklarındaki binaları yık', { h: -6, z: -4 }, 'Kaçak yapılar yıkılıyor. Sahipleri kızgın, uzmanlar memnun.', { bayrak: 'imar' }),
        O('Hızlı nakit yardımı dağıt', { h: 5, z: -5 }, 'Aileler acil ihtiyaçlarını karşıladı.')
      ] },
    { id: 'yangin', kat: 'Afet', ikon: '🔥', baslik: 'Orman Yangınları',
      metin: 'Sıcak hava dalgasıyla ormanlar alev aldı. Yangın turistik bir kasabaya dayanmak üzere.',
      sec: [
        O('{guc} yönetiminden uçak kirala', { h: 5, z: -6, d: 3 }, 'Yangın söndürme uçakları birkaç saat içinde geldi.'),
        O('Orduyu ve gönüllüleri seferber et', { h: 7, o: -3 }, 'Binlerce gönüllü kova ve hortumla yangına koştu.'),
        O('Kasabayı tahliye et, yanmaya bırak', { h: -9, d: -2 }, 'Can kaybı yok ama binlerce dönüm orman küle döndü.')
      ] },
    { id: 'enerji', kat: 'Afet', ikon: '⚡', baslik: 'Kış ve Doğalgaz',
      metin: '{komsu} doğalgaz boru hattında "teknik arıza" olduğunu açıkladı. Ülkenin depolarında iki haftalık gaz kaldı.',
      kosul: (s, u) => u.komsular.length > 0,
      sec: [
        O('{komsu} şartlarını kabul et', { d: 4, z: -9 }, 'Gaz akmaya başladı. Fiyat iki katına çıktı.'),
        O('Kömür santrallerini aç', { z: -4, d: -5, h: 2 }, 'Evler ısındı ama gökyüzü griye döndü.'),
        O('Tasarruf kampanyası başlat', { h: -7, z: 3 }, 'Okullar bir haftalığına kapandı, sokak lambaları kısıldı.')
      ] },
    { id: 'kitlik', kat: 'Afet', ikon: '🍞', baslik: 'Ekmek Kuyrukları',
      metin: 'Küresel buğday fiyatları rekor kırdı. Fırınların önünde uzun kuyruklar oluştu.',
      sec: [
        O('Ekmeği devlet sübvanse etsin', { h: 8, z: -9 }, 'Ekmek fiyatı sabitlendi.'),
        O('{guc} ile buğday anlaşması yap', { h: 4, z: -4, d: 4 }, 'Gemiler buğday yüklü limana yanaştı.'),
        O('Karaborsacılara sert ceza', { h: 4, o: 1 }, 'Depolarda saklanan tonlarca un bulundu.', { risk: { stat: 'h', fxKotu: { h: -6 }, sKotu: 'Baskınlar işe yaramadı, kuyruklar uzamaya devam ediyor.' } })
      ] },

    // ───────────── SKANDAL VE MEDYA ─────────────
    { id: 'ses_kaydi', kat: 'Skandal', ikon: '🎙️', baslik: 'Sızan Ses Kaydı',
      metin: 'Sosyal medyada, senin bir toplantıda halkı küçümseyen sözler söylediğin iddia edilen bir ses kaydı yayıldı.',
      sec: [
        O('"Yapay zekâ ile üretilmiş" de', { h: -2 }, 'Uzmanlar kaydın montaj olduğunu açıkladı. Rahat bir nefes aldın.', { risk: { stat: 'h', fxKotu: { h: -12, d: -3 }, sKotu: 'Uzmanlar kaydın gerçek olduğunu doğruladı. Yalanın daha büyük bir skandal oldu.' } }),
        O('Canlı yayında özür dile', { h: 4 }, 'Samimi özrün çoğu kişiyi yumuşattı.'),
        O('Sızdıranı bul ve kovuştur', { h: -5, o: 3 }, 'Sızdıran bir danışman çıktı. Ama kayıttaki sözler hâlâ konuşuluyor.')
      ] },
    { id: 'aile', kat: 'Skandal', ikon: '🛥️', baslik: 'Yeğenin Yatı',
      metin: 'Yeğenin, devlet ihalelerini kazanan bir şirketin sahibi çıktı. Lüks yatıyla çekilmiş fotoğrafları gazetelerde.',
      sec: [
        O('İhaleleri iptal et, soruşturma aç', { h: 8, d: 2 }, 'Aile yemekleri artık gergin geçiyor, ama halk etkilendi.'),
        O('Haberleri yasaklat', { h: -6, d: -5 }, 'Haberler kaldırıldı ama ekran görüntüleri her yerde.', { bayrak: 'sansur' }),
        O('PR ajansı tut', { h: 2, z: -4 }, 'Yeğenin bir hayır kurumu açtı. Herkes ikna olmadı.')
      ] },
    { id: 'sosyal_medya', kat: 'Skandal', ikon: '📱', baslik: 'Sosyal Medya Fırtınası',
      metin: '#İstifa etiketi üç gündür dünya gündeminin zirvesinde. Bir kısmı gerçek hesap, bir kısmı yabancı bot.',
      sec: [
        O('Platformu ülkede yasakla', { h: -8, d: -6 }, 'Uygulama erişime kapandı. Gençler VPN indiriyor.', { bayrak: 'sansur' }),
        O('Kendi dijital ordunu kur', { h: 3, z: -4, d: -2 }, 'Destekçi hesaplar etiketi geri püskürttü.'),
        O('Canlı soru-cevap yap', { h: 5 }, 'Saatlerce soruları cevapladın.', { risk: { stat: 'h', fxKotu: { h: -6 }, sKotu: 'Yayın troller tarafından ele geçirildi ve alay konusu oldun.' } })
      ] },
    { id: 'futbol', kat: 'Toplum', ikon: '⚽', baslik: 'Milli Takım Finalde!',
      metin: '{ulke} milli takımı tarihinde ilk kez büyük bir turnuvanın finaline yükseldi. Ülke çılgına döndü.',
      sec: [
        O('Final günü resmi tatil ilan et', { h: 8, z: -4 }, 'Meydanlar dev ekranlarla doldu.'),
        O('Oyunculara dev prim sözü ver', { h: 4, z: -6 }, 'Oyuncular motivasyon dolu.', { risk: { stat: 'h', fxKotu: { h: -4 }, sKotu: 'Takım finali kaybetti. Prim sözün alay konusu oldu.' } }),
        O('Stada git, sade kutla', { h: 3 }, 'Tribünde halkla birlikte maç izledin.')
      ] },
    { id: 'gazeteci', kat: 'Skandal', ikon: '🔒', baslik: 'Yabancı Gazeteci',
      metin: '{guc} vatandaşı bir gazeteci, askeri bir bölgede fotoğraf çekerken gözaltına alındı. Casusluk iddiası var.',
      sec: [
        O('Hemen serbest bırak', { d: 6, h: -3 }, 'Gazeteci ülkesine döndü. Milliyetçiler kızgın.'),
        O('Yargılansın', { h: 4, d: -8, o: 2 }, 'Dava dünya gündeminde.', { bayrak: 'guc_kizgin' }),
        O('Bir mahkumla takas et', { d: 2, o: 3 }, '{guc} hapishanesindeki bir vatandaşın da eve döndü.')
      ] },
    { id: 'anket', kat: 'İç Politika', ikon: '📊', baslik: 'Kötü Anketler',
      metin: 'Danışmanın yeni anket sonuçlarını masana bıraktı. "Bu gidişle seçimi kaybederiz efendim" diyor.',
      kosul: s => s.stat.h < 55,
      sec: [
        O('Herkese bayram ikramiyesi', { h: 10, z: -12 }, 'Banka hesaplarına para yattı. Anketler hemen kıpırdadı.'),
        O('Devlet televizyonunda propaganda', { h: 4, d: -3 }, 'Haber bültenleri sadece başarılarını gösteriyor.', { bayrak: 'sansur' }),
        O('Halkın arasına karış, şehir şehir gez', { h: 6, z: -2 }, 'Köy kahvelerinde çay içtin, pazarlarda esnafla sohbet ettin.')
      ] },

    // ───────────── TEKNOLOJİ VE ÇEVRE ─────────────
    { id: 'yapay_zeka', kat: 'Teknoloji', ikon: '🤖', baslik: 'Robotlar İş Alıyor',
      metin: 'Fabrikalar ve çağrı merkezleri yapay zekâya geçiyor. Bir yılda yüz binlerce kişi işini kaybetti.',
      sec: [
        O('Robot vergisi koy', { h: 6, z: 6, d: -3 }, 'Şirketler söyleniyor ama işsizlere destek fonu kuruldu.'),
        O('Yapay zekâ şirketlerini teşvik et', { z: 9, h: -6, d: 3 }, '{ulke} bölgenin teknoloji merkezi olmaya başladı.', { bayrak: 'teknoloji' }),
        O('Ücretsiz yeniden eğitim programı', { h: 5, z: -7 }, 'Milyonlarca kişi yeni beceriler öğreniyor.')
      ] },
    { id: 'uzay', kat: 'Teknoloji', ikon: '🚀', baslik: 'Uzay Programı',
      metin: 'Genç mühendisler, beş yıl içinde Ay\'a robot araç gönderebileceklerini söylüyor. Tek ihtiyaçları para.',
      kosul: (s, u) => !s.bayrak.uzay && u.zenginlik >= 2,
      sec: [
        O('Projeye tam destek', { h: 6, z: -11, d: 4 }, 'Ulusal uzay ajansı kuruldu.', { bayrak: 'uzay', sonra: [{ id: 'roket', tur: 4 }] }),
        O('{guc} ile ortak program', { z: -5, d: 7 }, 'Senin astronotun {guc} roketiyle uçacak.', { bayrak: 'uzay' }),
        O('Önce yeryüzündeki sorunlar', { h: -2, z: 2 }, 'Mühendislerin bir kısmı yurt dışındaki şirketlere geçti.')
      ] },
    { id: 'iklim', kat: 'Çevre', ikon: '🌍', baslik: 'İklim Zirvesi',
      metin: 'Dünya liderleri iklim zirvesinde toplandı. Senden 2040\'a kadar kömürü tamamen bırakma sözü vermen isteniyor.',
      sec: [
        O('Sözü ver ve yeşil fon kur', { d: 10, z: -8, h: -2 }, 'Zirvenin yıldızı oldun. Maden bölgeleri ise endişeli.', { bayrak: 'cevreci' }),
        O('Yavaş geçiş planı sun', { d: 4, z: -2 }, 'Makul bir plan olarak karşılandı.'),
        O('"Önce kalkınma" deyip reddet', { d: -9, z: 5, h: 2 }, 'Kömür işçileri seni alkışladı. Dünya basını eleştiriyor.')
      ] },
    { id: 'siber', kat: 'Güvenlik', ikon: '💻', baslik: 'Siber Saldırı',
      metin: 'Bankaların ve elektrik şebekesinin bilgisayarları çöktü. İzler {rakip} sınırları içindeki sunuculara çıkıyor.',
      kosul: s => !!s.rakip,
      sec: [
        O('Karşı siber saldırı başlat', { o: 4, d: -5, h: 4 }, '{rakip} sunucuları saatlerce çöktü. Mesaj alındı.', { risk: { stat: 'o', fxKotu: { o: -4, z: -6 }, sKotu: 'Karşı saldırı başarısız oldu ve {rakip} daha da sert vurdu.' } }),
        O('Dev siber güvenlik yatırımı', { o: 5, z: -8 }, 'Yeni bir siber savunma merkezi kuruldu.'),
        O('Kanıtları BM\'ye sun', { d: 7, h: -3 }, 'Dünya {rakip} yönetimini kınadı. Halk daha sert bir cevap bekliyordu.')
      ] },
    { id: 'nukleer_santral', kat: 'Teknoloji', ikon: '🏭', baslik: 'Nükleer Santral',
      metin: 'Enerji ihtiyacı hızla artıyor. {guc} şirketi ülkene anahtar teslim nükleer santral yapmayı teklif ediyor.',
      kosul: s => !s.bayrak.santral,
      sec: [
        O('Teklifi kabul et', { z: -6, d: 5, h: -3 }, 'Temel atıldı. Çevreciler kıyıda zincir oluşturdu.', { bayrak: 'santral' }),
        O('Güneş ve rüzgâra yatırım yap', { z: -8, h: 4, d: 3 }, 'Tarlalar güneş panelleriyle kaplanıyor.', { bayrak: 'cevreci' }),
        O('Daha fazla doğalgaz ithal et', { z: -4, d: -2 }, 'Kısa vadede sorun çözüldü, uzun vadede bağımlılık arttı.')
      ] },
    { id: 'baraj', kat: 'Çevre', ikon: '🏞️', baslik: 'Mega Baraj',
      metin: 'Mühendisler nehrin üzerine dev bir baraj kurmayı öneriyor. Ama 30 köy sular altında kalacak ve {komsu} nehrin suyunun azalacağından endişeli.',
      kosul: (s, u) => u.komsular.length > 0 && !s.bayrak.baraj,
      sec: [
        O('Barajı yap', { z: 8, h: -4, d: -8 }, 'Elektrik ve sulama sorunu çözüldü. {komsu} sert tepki gösterdi.', { bayrak: 'baraj' }),
        O('{komsu} ile su anlaşması yap, sonra inşa et', { z: 4, d: 4, h: -2 }, 'Ortak komisyon kuruldu. Baraj daha küçük yapılacak.', { bayrak: 'baraj' }),
        O('Projeyi iptal et', { h: 3, z: -3 }, 'Köyler kurtuldu, enerji sorunu sürüyor.')
      ] },

    { id: 'beyin_gocu', kat: 'Toplum', ikon: '🧳', baslik: 'Beyin Göçü',
      metin: 'Geçen yıl 80 bin doktor, mühendis ve yazılımcı ülkeyi terk etti. Hastanelerde uzman, şirketlerde mühendis bulunmuyor.',
      sec: [
        O('Geri dönenlere vergi muafiyeti', { h: 3, z: -6, d: 2 }, 'Havalimanında "Hoş geldin" afişleri asıldı. İlk dönüşler başladı.'),
        O('Mezunlara zorunlu hizmet getir', { h: -8, z: 2 }, 'Gençler öfkeli. Bazıları hizmet bitince gitmeye kararlı.'),
        O('Maaşları ve araştırma bütçesini artır', { h: 5, z: -10 }, 'Üniversiteler ve hastaneler yeniden cazip hâle geliyor.', { bayrak: 'bilim' })
      ] },
    { id: 'turizm', kat: 'Ekonomi', ikon: '🏖️', baslik: 'Turizm Rekoru',
      metin: 'Bu yıl {ulke} rekor sayıda turist ağırladı. Ama kıyı kasabalarında kiralar yerli halkın ödeyemeyeceği seviyeye çıktı.',
      sec: [
        O('Turist vergisi koy', { z: 7, h: 3, d: -2 }, 'Toplanan para yerel halk için konut projelerine aktarıldı.'),
        O('Daha çok otel izni ver', { z: 9, h: -6 }, 'Sahiller betonla doldu. Turizm patlıyor, yerliler taşınıyor.'),
        O('Kısa süreli kiralamayı sınırla', { h: 7, z: -3 }, 'Kiralar düştü. Ev sahipleri dava açmaya hazırlanıyor.')
      ] },

    // ───────────── TAKİP OLAYLARI (sadece bir seçimden sonra gelir) ─────────────
    { id: 'hiperenflasyon', takip: true, kat: 'Ekonomi', ikon: '🔥', baslik: 'Para Pul Oldu',
      metin: 'Bastığın paralar geri döndü: Fiyatlar her gün değişiyor. Market etiketleri sabah ve akşam yeniden basılıyor.',
      sec: [
        O('Yeni para birimine geç', { h: -6, z: 6, d: 3 }, 'Eski paradan altı sıfır atıldı. Kafalar karışık ama fiyatlar duruldu.'),
        O('IMF\'den kredi al', { z: 14, d: 4, h: -8 }, 'Kredi geldi, ama ağır kemer sıkma şartlarıyla.'),
        O('Daha fazla para bas', { h: -10, z: -6 }, 'Felaket derinleşiyor. Halk dövize sığınıyor.')
      ] },
    { id: 'petrol_geliri', takip: true, kat: 'Ekonomi', ikon: '💸', baslik: 'Petrol Geliri Geldi',
      metin: 'İlk petrol satışlarından büyük bir gelir hazineye girdi. Herkes bu paranın ne olacağını merak ediyor.',
      sec: [
        O('Varlık fonu kur, geleceğe sakla', { z: 16, h: -2 }, 'Norveç modeli bir fon kuruldu.'),
        O('Halka nakit dağıt', { h: 12, z: 5 }, 'Her vatandaşın hesabına "petrol payı" yattı.'),
        O('Orduyu modernleştir', { o: 12, z: 6, d: -3 }, 'Yeni tanklar ve gemiler sipariş edildi.')
      ] },
    { id: 'misilleme', takip: true, kat: 'Dış Politika', ikon: '⚔️', baslik: 'Misilleme',
      metin: '{komsu} yaptırımlarına cevap verdi: Senin ürünlerini yasakladı ve ülkendeki şirketlerine el koydu.',
      sec: [
        O('Sen de onların şirketlerine el koy', { h: 5, z: 3, d: -6 }, 'Ticaret savaşı resmen başladı.'),
        O('{guc} yönetiminden tazminat iste', { z: 6, d: 2 }, '{guc} kısmi bir yardım paketi gönderdi.'),
        O('Yaptırımları kaldır, barış yap', { d: -3, z: 5, h: -4 }, 'Ticaret normale döndü. {guc} hayal kırıklığına uğradı.')
      ] },
    { id: 'olimpiyat_sonu', takip: true, kat: 'Ekonomi', ikon: '🏟️', baslik: 'Olimpiyat Kararı',
      metin: 'Olimpiyat Komitesi kararını açıkladı. Ama stadyum inşaatlarında bütçe üç katına çıkmış durumda.',
      sec: [
        O('Ne pahasına olursa olsun bitir', { z: -12, d: 10, h: 6 }, 'Açılış töreni muhteşem oldu. Bütçe ise yerle bir.'),
        O('Projeleri küçült', { z: -4, d: 3 }, '"Sade olimpiyat" sloganı tuttu.'),
        O('Ev sahipliğinden çekil', { z: 6, d: -10, h: -6 }, 'Dünya basını {ulke} ile alay ediyor.')
      ] },
    { id: 'sinir_catisma', takip: true, kat: 'Savaş', ikon: '💣', baslik: 'Sınırda Çatışma',
      metin: '{komsu} birlikleri sınır karakollarına saldırdı. Askerlerin emir bekliyor.',
      sec: [
        O('Karşı taarruz başlat', { h: 8, z: -10 }, '{komsu} birlikleri geri püskürtüldü. Orduyu zafer havası sardı.', { risk: { stat: 'o', fxKotu: { o: -15, h: -12 }, sKotu: 'Taarruz püskürtüldü. Ağır kayıplar verdin.' } }),
        O('Savun ve ateşkes iste', { o: -4, d: 6 }, 'BM gözetiminde ateşkes ilan edildi.'),
        O('{guc} yönetimini savaşa çağır', { o: 6, d: -2, h: -3 }, '{guc} uçakları sınırı geçti. Artık bölgesel bir krizin parçasısın.', { sonra: [{ id: 'guc_fatura', tur: 3 }] })
      ] },
    { id: 'guc_fatura', takip: true, kat: 'Dış Politika', ikon: '🧾', baslik: 'Faturayı İstiyorlar',
      metin: '{guc} yardımının karşılığını istiyor: Limanlarının 99 yıllığına kiralanması.',
      sec: [
        O('Kabul et', { z: 8, d: 6, h: -10 }, 'Limanlarda yabancı bayraklar dalgalanıyor.'),
        O('Para ile öde', { z: -12, d: 3 }, 'Hazineden büyük bir ödeme yapıldı.'),
        O('Reddet', { d: -12, h: 6 }, '"Hiçbir toprak satılık değil!" sözün halkı coşturdu. {guc} ise kızgın.', { bayrak: 'guc_kizgin' })
      ] },
    { id: 'nukleer_ifsa', takip: true, kat: 'Dış Politika', ikon: '🛰️', baslik: 'Uydu Fotoğrafları',
      metin: 'Dünya basını, dağlardaki gizli nükleer tesisinin uydu fotoğraflarını yayınladı. BM Güvenlik Konseyi acil toplanıyor.',
      sec: [
        O('Programı sürdür, geri adım yok', { o: 10, d: -18, z: -6, h: 5 }, 'Ağır yaptırımlar başladı ama artık caydırıcı bir gücün var.'),
        O('Denetçilere kapıları aç', { d: 6, o: -8, h: -3 }, 'Program dondu. Yaptırımlar engellendi.'),
        O('Programı pazarlık kozu yap', { z: 10, d: -4 }, 'Yaptırımların kalkması karşılığında programı yavaşlatmayı kabul ettin.')
      ] },
    { id: 'isyan', takip: true, kat: 'Güvenlik', ikon: '🏔️', baslik: 'Dağlarda İsyan',
      metin: 'Bastırılan bölgede silahlı bir isyan başladı. İsyancılar iki kasabayı kontrol ediyor.',
      sec: [
        O('Askeri harekât', { h: 3, z: -8 }, 'İsyancılar teslim oldu, kasabalar geri alındı.', { risk: { stat: 'o', fxKotu: { o: -10, h: -8, d: -5 }, sKotu: 'Harekât çıkmaza girdi. Kayıplar artıyor.' } }),
        O('Barış görüşmesi başlat', { h: -4, d: 6 }, 'Arabulucular dağlara çıktı.'),
        O('Özerklik ver', { h: -6, d: 8, o: 2 }, 'Silahlar sustu.')
      ] },
    { id: 'roket', takip: true, kat: 'Teknoloji', ikon: '🌕', baslik: 'Fırlatma Günü',
      metin: 'İlk milli roket fırlatma rampasında. Bütün ülke televizyon başında geri sayımı izliyor.',
      sec: [
        O('Fırlatmayı canlı yayınla', { h: 7, d: 6 }, '3... 2... 1... Roket yörüngede! Milyonlar sokaklarda kutluyor.', { risk: { stat: 'z', fxKotu: { h: -8, d: -3 }, sKotu: 'Roket havada infilak etti. Canlı yayın kararın büyük hataydı.' } }),
        O('Gizli fırlat, başarırsa duyur', { d: 4, h: 2 }, 'Roket yörüngeye ulaştı. Sabah haberleri müjdeyle açıldı.'),
        O('Bir test daha yap, ertele', { z: -4 }, 'Mühendisler bir ay daha çalışacak.')
      ] },
    { id: 'girisim_basarisi', takip: true, kat: 'Ekonomi', ikon: '🦄', baslik: 'Milli Unicorn',
      metin: 'Kredi programından çıkan bir genç şirket 1 milyar dolar değere ulaştı! {guc} merkezli bir dev onu satın almak istiyor.',
      sec: [
        O('Satışa izin ver', { z: 8, d: 4 }, 'Kurucular zengin oldu, şirket yurt dışına taşındı.'),
        O('Satışı engelle, yerli kalsın', { h: 6, d: -3, z: 2 }, 'Şirket ülkede büyümeye devam ediyor.'),
        O('Devlet ortak olsun', { z: 5, h: 2, d: -2 }, 'Hazine şirketin %20\'sine ortak oldu.')
      ] },

    // ───────────── KRİZ OLAYLARI (göstergeler tehlikeli seviyedeyken) ─────────────
    { id: 'kriz_halk', kriz: true, kat: 'Kriz', ikon: '🚨', baslik: 'Sokaklar Karıştı',
      metin: 'Meydanlar "İstifa!" diye bağıran kalabalıklarla dolu. Polis şefleri kalabalığı ne kadar tutabileceklerinden emin değil.',
      kosul: s => s.stat.h < 22,
      sec: [
        O('Kabineyi tamamen değiştir', { h: 7, d: 2, z: -4 }, 'Yeni yüzler biraz nefes aldırdı.'),
        O('Orduyu sokağa indir', { h: 4, o: -6, d: -10 }, 'Tanklar meydanlarda. Kalabalık dağıldı ama korku her yerde.', { bayrak: 'sert_yonetim' }),
        O('Halka sesleniş, erken seçim sözü', { h: 9, o: -2 }, 'Sözün kalabalığı yatıştırdı. Ama bir dahaki seçim yakın.', { sonuc: s => { s.erkenSecim = true; } })
      ] },
    { id: 'kriz_hazine', kriz: true, kat: 'Kriz', ikon: '🏦', baslik: 'Kasada Para Yok',
      metin: 'Maliye Bakanı titreyen ellerle raporu uzattı: Gelecek ay memur maaşlarını ödeyecek para yok.',
      kosul: s => s.stat.z < 18,
      sec: [
        O('IMF ile anlaş', { z: 18, h: -8, d: 4 }, 'Kredi geldi, kemer sıkma başladı.'),
        O('{guc} yönetiminden borç al', { z: 15, d: -4 }, 'Para geldi, ama bir sürü gizli şartla.'),
        O('Devlet şirketlerini sat', { z: 14, h: -6 }, 'Havalimanı, limanlar ve telekom şirketi özelleştirildi.')
      ] },
    { id: 'kriz_dis', kriz: true, kat: 'Kriz', ikon: '🌐', baslik: 'Dünyada Yalnız',
      metin: 'Büyükelçiliklerin birer birer kapanıyor. Hiçbir ülke resmi ziyaret teklifini kabul etmiyor.',
      kosul: s => s.stat.d < 20,
      sec: [
        O('Barış ve uzlaşma turu', { d: 12, z: -5 }, 'Başkentleri tek tek dolaştın, köprüleri onardın.'),
        O('Siyasi tutukluları serbest bırak', { d: 10, h: 3, o: -3 }, 'Dünya bu adımı memnuniyetle karşıladı.'),
        O('"Kimseye ihtiyacımız yok" de', { h: 4, d: -4 }, 'Milliyetçi destek arttı ama kapılar daha da kapandı.')
      ] },
    { id: 'kriz_ordu_dusuk', kriz: true, kat: 'Kriz', ikon: '🛡️', baslik: 'Ordu Çöküyor',
      metin: 'Askerler maaş alamıyor, tanklar yakıtsız. {rakip} bu zayıflığı yakından izliyor.',
      kosul: s => s.stat.o < 20 && !!s.rakip,
      sec: [
        O('Acil savunma bütçesi', { o: 14, z: -10 }, 'Ordu yeniden toparlanıyor.'),
        O('Zorunlu askerliği uzat', { o: 9, h: -7 }, 'Kışlalar doldu ama gençler öfkeli.'),
        O('{rakip} ile saldırmazlık paktı', { d: 6, o: 3, h: -4 }, 'Pakt imzalandı. Şimdilik güvendesin.')
      ] },
    { id: 'kriz_ordu_yuksek', kriz: true, kat: 'Kriz', ikon: '🎖️', baslik: 'Generaller Huzursuz',
      metin: 'Ordu artık devletin içinde bir devlet. Genelkurmay Başkanı akşam yemeğine davet edildiği halde gelmedi.',
      kosul: s => s.stat.o > 82,
      sec: [
        O('Generalleri emekliye ayır', { o: -14, h: 3 }, 'Yeni ve sadık komutanlar atandı.', { risk: { stat: 'h', fxKotu: { o: 6, h: -6 }, sKotu: 'Generaller emri tanımadı. Tehlikeli bir sessizlik var.' } }),
        O('Savunma bütçesini kıs', { o: -10, z: 8 }, 'Para okullara ve hastanelere aktarıldı.'),
        O('Generallere bakanlık ver', { o: -5, h: -6, d: -4 }, 'Kabine üniformalı yüzlerle doldu.')
      ] }
  ];

  // Seçim olayı (dönem sonunda motor tarafından çağrılır)
  const SECIM = { id: 'secim', ozel: true, kat: 'Seçim', ikon: '🗳️', baslik: 'Seçim Günü Yaklaşıyor',
    metin: 'Görev süren doluyor. Seçime sadece birkaç hafta kaldı ve kampanya stratejini belirlemen gerekiyor.',
    sec: [
      O('Dürüst bir kampanya yürüt', {}, 'Başarılarını ve hatalarını açıkça anlattın.', { secim: 'durust' }),
      O('Vaatler yağdır, kesenin ağzını aç', { z: -12 }, 'Bedava konut, vergi indirimi, zam... Kampanya otobüsün her yerde.', { secim: 'vaat' }),
      O('Seçime hile karıştır', {}, 'Sandık kurulları sadık isimlerle dolduruldu...', { secim: 'hile' })
    ] };

  G.VERI = Object.assign(G.VERI || {}, { OLAYLAR, SECIM });
})(typeof window !== 'undefined' ? window : globalThis);
