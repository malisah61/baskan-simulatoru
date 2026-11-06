// OLAYLAR 2 — geçmiş kararların geri döndüğü olaylar, bölgeye özel senaryolar ve kabine olayları.
// Biçim için js/olaylar.js başındaki açıklamaya bak. Ek alanlar:
//   tek: true      -> olay bir oyunda yalnızca bir kez çıkar
//   agirlik: 2     -> havuzda iki kat sık çıkar (bayrağa bağlı geri dönüş olayları için)
(function (G) {
  const O = (t, fx, s, ek) => Object.assign({ t, fx, s }, ek || {});
  const bolge = (...b) => (s, u) => b.includes(u.bolge);

  const YENI = [
    // ───────────── GEÇMİŞ KARARLARIN GERİ DÖNÜŞÜ ─────────────
    { id: 'basin_endeksi', kat: 'İç Politika', ikon: '📉', baslik: 'Basın Özgürlüğü Raporu', agirlik: 2,
      metin: 'Uluslararası bir gazetecilik örgütü yıllık raporunu yayımladı: {ulke}, basın özgürlüğünde listenin en altlarına geriledi. Rapor, kapatılan yayınları tek tek sayıyor.',
      kosul: s => !!s.bayrak.sansur,
      sec: [
        O('Sansür yasalarını kaldır', { d: 9, h: 3, o: -2 }, 'Kapatılan yayınlar yeniden açıldı. İlk manşetleri pek de nazik değil, ama dünya bu adımı alkışladı.', { sonuc: s => { delete s.bayrak.sansur; } }),
        O('Bir halkla ilişkiler şirketi tut', { z: -7, d: 4 }, 'Yabancı gazetelerde "{ulke} değişiyor" başlıklı ilanlar çıktı. Kimin yazdığını herkes biliyor.'),
        O('"İç işlerimize karışmayın" de', { d: -7, h: 3 }, 'Sert açıklaman milliyetçi kesimde karşılık buldu. Rapor ise dünyada daha çok okundu.')
      ] },
    { id: 'insan_haklari', kat: 'Dış Politika', ikon: '⚖️', baslik: 'İnsan Hakları Heyeti', agirlik: 2,
      metin: 'Uluslararası bir insan hakları heyeti, gözaltılar ve sert müdahaleler hakkında ülkede inceleme yapmak istiyor. Reddedersen yeni yaptırımlar gündeme gelebilir.',
      kosul: s => !!s.bayrak.sert_yonetim,
      sec: [
        O('Heyete tüm kapıları aç', { d: 10, o: -4, h: 2 }, 'Heyet cezaevlerini gezdi. Raporu eleştirel ama "işbirliğine açık" ifadesi umut verdi.', { sonuc: s => { delete s.bayrak.sert_yonetim; } }),
        O('Göstermelik bir ziyaret düzenle', { d: 3, z: -3 }, 'Heyete boyası yeni kurumuş bir cezaevi gösterildi.', { risk: { stat: 'd', fxKotu: { d: -10, h: -3 }, sKotu: 'Bir gardiyan heyete gerçek koğuşların fotoğraflarını verdi. Skandal büyüdü.' } }),
        O('Heyeti sınırdan geri çevir', { d: -9, o: 3 }, 'Heyet havalimanından geri döndü. {guc} "ciddi endişe" bildirdi.')
      ] },
    { id: 'yesil_fon', kat: 'Çevre', ikon: '🌱', baslik: 'Yeşil Fon Teklifi', agirlik: 2, tek: true,
      metin: 'Daha önceki çevreci kararların dikkat çekti. Uluslararası bir iklim fonu {ulke} için büyük bir hibe öneriyor; karşılığında ormanları ve kıyıları koruma altına almanı istiyor.',
      kosul: s => !!s.bayrak.cevreci,
      sec: [
        O('Hibeyi al, koruma alanlarını genişlet', { z: 10, d: 6, h: -3 }, 'Fon ilk taksiti gönderdi. Bazı çiftçiler tarlalarının koruma alanında kalmasına kızgın.'),
        O('Parayı güneş ve rüzgâr santrallerine yatır', { z: 4, d: 4, h: 4 }, 'Çöl kenarında güneş panelleri, tepelerde rüzgâr türbinleri yükseliyor.', { bayrak: 'yesil_enerji' }),
        O('Teklifi reddet, kendi yolumuzu çizeriz', { h: 2, d: -4 }, '"Kimsenin parasıyla koşul kabul etmeyiz" dedin. Çevreciler hayal kırıklığında.')
      ] },
    { id: 'guc_intikam', kat: 'Dış Politika', ikon: '🥶', baslik: 'Soğuk Rüzgârlar', agirlik: 2,
      metin: 'Daha önce {guc} yönetimini kızdırmıştın. Şimdi {ulke} ihracatına yeni gümrük vergileri geldi ve öğrenci vizeleri askıya alındı.',
      kosul: s => !!s.bayrak.guc_kizgin,
      sec: [
        O('Özel temsilci gönder, barış yap', { d: 7, h: -3 }, 'Uzun bir akşam yemeğinden sonra buzlar çözüldü. Muhalefet "boyun eğdi" diyor.', { sonuc: s => { delete s.bayrak.guc_kizgin; } }),
        O('Karşılık ver: onların mallarına da vergi', { h: 5, z: -6, d: -4 }, 'Ticaret savaşı başladı. Marketlerde bazı ithal ürünlerin fiyatı ikiye katlandı.'),
        O('Yeni pazarlar ara', { z: -3, d: 4 }, 'Ticaret heyetleri başka kıtalara uçtu. Kısa vadede zor, uzun vadede belki daha sağlam.', { risk: { stat: 'd', fxKotu: { z: -6 }, sKotu: 'Yeni pazarlar beklenenden küçük çıktı. İhracatçılar zararda.' } })
      ] },
    { id: 'yolsuz_dosya', kat: 'İç Politika', ikon: '📂', baslik: 'Dosya Yeniden Açıldı', agirlik: 2, tek: true,
      metin: 'Daha önce koruduğun bakanla ilgili yeni belgeler ortaya çıktı: Bu kez yüzlerce milyonluk bir ihale söz konusu. Araştırmacı bir gazeteci senin de bildiğini iddia ediyor.',
      kosul: s => !!s.bayrak.yolsuz,
      sec: [
        O('Bakanı kendin yargıya teslim et', { h: 6, d: 4, z: 3 }, 'Bakan gözaltına alındı, el konulan para hazineye döndü. "Geç ama doğru" yorumları yapılıyor.', { sonuc: s => { delete s.bayrak.yolsuz; } }),
        O('Gazeteciyi karalama kampanyası başlat', { h: -4, d: -6 }, 'Devlet medyası gazeteciyi hedef aldı. Sosyal medyada etiket tersine döndü.', { bayrak: 'sansur' }),
        O('"Hiçbir şey bilmiyordum" açıklaması yap', { h: -6 }, 'Kimse tam inanmadı ama konu bir süre sonra gündemden düştü.')
      ] },
    { id: 'multeci_uyum', kat: 'Toplum', ikon: '🏫', baslik: 'Mülteci Çocuklar Okulda', agirlik: 2, tek: true,
      metin: 'Kapılarını açtığın mülteciler artık şehirlerde yaşıyor. Okullarda sınıflar kalabalık, bazı veliler şikâyetçi; mülteci aileler ise çalışma izni istiyor.',
      kosul: s => !!s.bayrak.multeci,
      sec: [
        O('Dil kursu ve çalışma izni ver', { z: -6, h: -2, d: 4 }, 'Kurslar doldu taştı. Bazı mahallelerde ilk ortak dükkânlar açıldı.', { sonra: [{ id: 'multeci_girisim', tur: 5 }] }),
        O('Ayrı kamplarda eğitim ver', { z: -3, d: -4, h: 3 }, 'Gerginlik azaldı ama kamplardaki gençler geleceksiz hissediyor.'),
        O('Gönüllü geri dönüş programı', { h: 4, d: -2, z: -2 }, 'Bir kısım aile, savaşın bittiği bölgelere geri döndü.')
      ] },
    { id: 'multeci_girisim', takip: true, kat: 'Ekonomi', ikon: '🥙', baslik: 'Yeni Komşular, Yeni İşler',
      metin: 'Çalışma izni verdiğin mülteciler arasından binlerce küçük işletme çıktı. Bir lokanta zinciri ülkenin dört bir yanına yayıldı.',
      sec: [
        O('Başarılarını kutla, vatandaşlık yolu aç', { z: 5, d: 5, h: -2 }, 'Tören kalabalıktı. Bazı muhafazakâr çevreler rahatsız.'),
        O('Vergilerini artır', { z: 7, h: 1, d: -2 }, 'Hazine kazandı. İşletmeciler "bizi cezalandırıyorsunuz" diyor.'),
        O('Sessiz kal, işlerini yapsınlar', { z: 4 }, 'Ekonomi sessizce büyüdü.')
      ] },
    { id: 'ohal_uzatma', kat: 'Güvenlik', ikon: '🚧', baslik: 'Olağanüstü Hal Bitiyor', agirlik: 2,
      metin: 'İlan ettiğin olağanüstü halin süresi doluyor. Güvenlik birimleri uzatma isterken iş dünyası ve turizmciler normalleşme bekliyor.',
      kosul: s => !!s.bayrak.ohal,
      sec: [
        O('Olağanüstü hali kaldır', { h: 5, d: 6, o: -3, z: 3 }, 'Sokağa çıkma yasakları kalktı, kafeler gece yarısına kadar dolu.', { sonuc: s => { delete s.bayrak.ohal; } }),
        O('Altı ay daha uzat', { o: 4, h: -5, d: -4 }, 'Kontrol noktaları yerinde kalıyor. İnsanlar yorgun.'),
        O('Kalıcı yasaya dönüştür', { o: 6, h: -8, d: -8 }, 'Olağanüstü yetkiler artık sıradan yasa. Muhalefet "yeni normal" diyor.', { bayrak: 'sert_yonetim', sonuc: s => { delete s.bayrak.ohal; } })
      ] },
    { id: 'yerli_otomobil_cikti', kat: 'Ekonomi', ikon: '🚗', baslik: 'Yerli Otomobil Banttan İndi', agirlik: 2, tek: true,
      metin: 'Yıllar önce desteklediğin milli otomobil projesinin ilk araçları üretildi. Ön sipariş kuyruğu uzun ama ilk testlerde yazılım hataları çıktı.',
      kosul: s => !!s.bayrak.yerli_otomobil,
      sec: [
        O('Gösterişli bir tanıtım yap', { h: 7, z: -4 }, 'Araç başkanlık konvoyunun başında meydanları dolaştı.', { risk: { stat: 'z', fxKotu: { h: -6, d: -2 }, sKotu: 'Canlı yayında araç yokuşta durdu. Görüntüler dünyada viral oldu.' } }),
        O('Satışı erteleyip hataları düzelt', { z: -5, h: -2, d: 2 }, 'Mühendisler altı ay daha çalışacak. Sabırsız alıcılar söyleniyor.'),
        O('Yabancı bir şirketle ortak üret', { z: 6, d: 4, h: -4 }, 'Ortaklıkla kalite arttı ama "milli" etiketi tartışmalı.')
      ] },
    { id: 'diaspora', kat: 'Toplum', ikon: '🛫', baslik: 'Beyinler Geri Dönüyor', agirlik: 2, tek: true,
      metin: 'Eğitim ve bilime yaptığın yatırımlar konuşuluyor. Yurt dışında çalışan yüzlerce bilim insanı ve mühendis "doğru koşullarda dönmeye hazırız" diye ortak mektup yazdı.',
      kosul: s => !!(s.bayrak.egitim || s.bayrak.bilim || s.bayrak.teknoloji),
      sec: [
        O('Araştırma merkezleri kur, maaş garantisi ver', { z: -8, h: 4, d: 4 }, 'İlk 300 bilim insanı döndü. Laboratuvarlarda yeni projeler başladı.', { bayrak: 'bilim' }),
        O('Vergi indirimiyle çağır', { z: -3, h: 2 }, 'Bazıları döndü, bazıları "maaş değil ortam önemli" dedi.'),
        O('"Kalanlar yeterli" de', { h: -3, d: -2 }, 'Mektubu imzalayanlar hayal kırıklığını sosyal medyada paylaştı.')
      ] },
    { id: 'sulama_hasat', kat: 'Ekonomi', ikon: '🍅', baslik: 'Rekor Hasat', agirlik: 2, tek: true,
      metin: 'Başlattığın sulama projesi sonunda meyvesini verdi: Kurak ovalar yeşerdi, hasat rekor kırdı. Depolar dolu, çiftçiler ne yapacağını soruyor.',
      kosul: s => !!s.bayrak.sulama,
      sec: [
        O('Fazlayı ihraç et', { z: 9, d: 3 }, 'Gemiler domates, buğday ve meyveyle doldu.'),
        O('Gıda fiyatlarını düşür', { h: 8, z: 2 }, 'Pazar fiyatları yıllardır ilk kez geriledi.'),
        O('Kıtlık çeken {komsu} halkına yardım gönder', { d: 9, h: 2, z: -2 }, 'Yardım tırları sınırı geçti. {komsu} hükümeti teşekkür etti.')
      ] },

    // ───────────── BÖLGEYE ÖZEL ─────────────
    { id: 'kis_enerji', kat: 'Enerji', ikon: '🥶', baslik: 'Sert Kış Geliyor',
      metin: 'Meteoroloji yılların en soğuk kışını bekliyor. Doğalgaz depoları yarı yarıya dolu ve fiyatlar her hafta artıyor.',
      kosul: bolge('AV'),
      sec: [
        O('{guc} ile uzun vadeli gaz anlaşması', { z: -4, d: 2, h: 4 }, 'Depolar doldu. Anlaşmanın şartları ise birkaç yıl seni bağlayacak.'),
        O('Faturaları devlet desteklesin', { h: 8, z: -10 }, 'Evler sıcak, bütçe soğuk.'),
        O('Tasarruf kampanyası: termostatı 19 dereceye', { h: -5, z: 3, d: 2 }, 'Kamu binalarında kazaklar giyildi. Bazıları şikâyetçi ama depolar yetti.')
      ] },
    { id: 'cekirge', kat: 'Felaket', ikon: '🦗', baslik: 'Çekirge Sürüsü',
      metin: 'Ufukta kara bir bulut belirdi: Milyarlarca çekirge tarlalara iniyor. Çiftçiler hasatlarının birkaç gün içinde yok olacağından korkuyor.',
      kosul: bolge('AF', 'OD', 'AS'),
      sec: [
        O('Havadan ilaçlama yap', { z: -7, h: 4, d: -2 }, 'Uçaklar tarlaların üzerinden geçti. Sürü dağıldı ama arıcılar ve çevreciler endişeli.'),
        O('{komsu} ile ortak mücadele ekibi kur', { d: 6, z: -4, h: 2 }, 'İki ülkenin uzmanları sürüyü sınırda birlikte karşıladı.'),
        O('Çiftçilere zarar tazminatı öde', { h: 5, z: -9 }, 'Hasat kayboldu ama köylüler devletin yanında olduğunu gördü.')
      ] },
    { id: 'orman', kat: 'Çevre', ikon: '🌳', baslik: 'Ormanlar Yanıyor mu, Kesiliyor mu?',
      metin: 'Uydu görüntüleri ormanların hızla tarlaya ve meraya dönüştüğünü gösteriyor. Büyük tarım şirketleri "ekonomi büyüyor" diyor; yerli topluluklar ise topraklarını kaybediyor.',
      kosul: bolge('GA', 'AF', 'AS'),
      sec: [
        O('Kesimi tamamen yasakla', { d: 8, z: -6, h: -2 }, 'Orman bekçileri artırıldı. Tarım lobisi öfkeli.', { bayrak: 'cevreci' }),
        O('Yerli topluluklara toprak tapusu ver', { h: 4, d: 6, z: -3 }, 'Yüzyıllardır yaşadıkları topraklar artık resmen onların.', { bayrak: 'cevreci' }),
        O('Tarım ihracatı büyüsün', { z: 9, d: -7 }, 'Soya ve sığır ihracatı rekor kırdı. Yabancı basın "ciğerler kesiliyor" yazıyor.', { sonra: [{ id: 'orman_boykot', tur: 4 }] })
      ] },
    { id: 'orman_boykot', takip: true, kat: 'Dış Politika', ikon: '🛒', baslik: 'Ürün Boykotu',
      metin: 'Orman kesimi yüzünden {guc} pazarındaki büyük market zincirleri {ulke} ürünlerini raflardan kaldırdı.',
      sec: [
        O('Sertifika sistemi kur', { z: -3, d: 6 }, 'Ormansızlaşmaya yol açmayan ürünler artık etiketli. Raflar yavaş yavaş geri açılıyor.'),
        O('Başka pazarlara sat', { z: -2, d: -3 }, 'Fiyatlar düştü ama ürünler satıldı.'),
        O('Dünya Ticaret Örgütü\'ne şikâyet et', { d: -2, h: 3 }, 'Dava açıldı. Sonuç yıllar sürebilir.', { risk: { stat: 'd', fxKotu: { z: -5, d: -3 }, sKotu: 'Şikâyet reddedildi, boykot genişledi.' } })
      ] },
    { id: 'deniz_yukseliyor', kat: 'Çevre', ikon: '🌊', baslik: 'Deniz Yükseliyor',
      metin: 'Kıyıdaki köylerin bazıları artık her dolunayda su altında kalıyor. Bilim insanları birkaç on yıl içinde bazı adaların yaşanmaz olacağını söylüyor.',
      kosul: (s, u) => u.bolge === 'OK' || u.nufus < 1,
      sec: [
        O('Dünya iklim zirvesinde sesini yükselt', { d: 10, h: 3 }, 'Konuşman dünya basınında manşet oldu. Büyük ülkeler fon sözü verdi.', { bayrak: 'cevreci' }),
        O('Set ve dalgakıran inşa et', { z: -9, h: 5 }, 'Beton setler kıyıları koruyor. Ama deniz yükselmeye devam ediyor.'),
        O('Halk için başka ülkede toprak satın al', { z: -6, d: 3, h: -4 }, 'Tarihi bir anlaşma: Gelecekte gerekirse halkın taşınabileceği bir yer var artık.')
      ] },
    { id: 'kasirga', kat: 'Felaket', ikon: '🌀', baslik: 'Kasırga Yaklaşıyor',
      metin: 'Beşinci kategoride bir kasırga 48 saat içinde kıyıya ulaşacak. Kıyı kasabalarında yüz binlerce insan yaşıyor.',
      kosul: bolge('KA', 'OK', 'AS'),
      sec: [
        O('Zorunlu tahliye başlat', { h: 4, z: -6, o: -2 }, 'Kasırga kasabaları yerle bir etti ama can kaybı çok az oldu. Herkes yeniden inşayı soruyor.', { sonra: [{ id: 'yeniden_insa', tur: 2 }] }),
        O('Gönüllü tahliye, paniği önle', { z: -2 }, 'Çoğu insan evinde kaldı.', { risk: { stat: 'h', fxKotu: { h: -12, d: 2 }, sKotu: 'Kasırga beklenenden sert vurdu. Kurtarma ekipleri çatılardaki insanlara yetişemedi.' }, sonra: [{ id: 'yeniden_insa', tur: 2 }], sonraKotu: [{ id: 'yeniden_insa', tur: 2 }] } ),
        O('Ordu ve uluslararası yardım ekiplerini çağır', { o: -3, d: 5, h: 3, z: -3 }, 'Yabancı kurtarma ekipleri ve askerler birlikte çalıştı.', { sonra: [{ id: 'yeniden_insa', tur: 2 }] })
      ] },
    { id: 'yeniden_insa', takip: true, kat: 'Felaket', ikon: '🏘️', baslik: 'Yeniden İnşa',
      metin: 'Kasırganın vurduğu kasabalarda insanlar hâlâ çadırlarda. Müteahhitler hızlı ve ucuz, mühendisler yavaş ama sağlam inşaat öneriyor.',
      sec: [
        O('Kasırgaya dayanıklı yeni şehirler kur', { z: -9, h: 5, d: 2 }, 'Yükseltilmiş temeller ve güçlü çatılar... Bir dahaki fırtına daha az acıtacak.', { bayrak: 'imar' }),
        O('Hızlı ve ucuz konut', { z: -4, h: 4 }, 'Evler üç ayda teslim edildi.', { sonra: [{ id: 'cokuk_konut', tur: 6 }] }),
        O('Aileler kendi evini yapsın, devlet kredi versin', { z: -3, h: -2 }, 'Yavaş ama herkes kendi evinin sahibi.')
      ] },
    { id: 'cokuk_konut', takip: true, kat: 'Toplum', ikon: '🏚️', baslik: 'Çatlayan Duvarlar',
      metin: 'Hızlı yapılan afet konutlarının duvarlarında çatlaklar belirdi. İlk yağmurda çatılar akıttı ve aileler sokağa döküldü.',
      sec: [
        O('Müteahhitleri yargıla, evleri yeniden yap', { z: -7, h: 6 }, 'Müteahhitler mahkemede. Yeni evler bu kez denetimli yapılacak.'),
        O('Onarım parası ver', { z: -4, h: 1 }, 'Çatlaklar sıvandı. Ama güven geri gelmedi.'),
        O('Suçu doğaya at', { h: -8 }, '"Olağanüstü yağış" açıklaması kimseyi ikna etmedi.')
      ] },
    { id: 'cip_fabrikasi', kat: 'Teknoloji', ikon: '💾', baslik: 'Çip Fabrikası Yarışı',
      metin: 'Dünyanın en büyük yarı iletken şirketlerinden biri yeni fabrikası için {ulke} ile başka iki ülke arasında seçim yapacak. Çok büyük teşvik istiyor.',
      kosul: (s, u) => u.zenginlik >= 3 && ['AS', 'AV', 'KA', 'OD'].includes(u.bolge),
      sec: [
        O('Dev teşvik paketiyle kazan', { z: -11, h: 4, d: 5 }, 'Fabrikanın temeli atıldı. Binlerce mühendis işe alınacak.', { bayrak: 'teknoloji', sonra: [{ id: 'cip_krizi', tur: 5 }] }),
        O('Makul teklif ver, olmazsa olmasın', { z: -3 }, 'Şirket fabrikayı başka bir ülkeye kurdu ama iki tasarım merkezini sana bıraktı.', { risk: { stat: 'z', fxKotu: { h: -3 }, sKotu: 'Şirket bütün yatırımı rakip ülkeye götürdü. Gazeteler "kaçan fırsat" yazıyor.' } }),
        O('Kendi çip şirketimizi kuralım', { z: -8, h: 5, d: -3 }, 'Devlet destekli bir çip girişimi kuruldu. Yolu uzun.', { bayrak: 'teknoloji' })
      ] },
    { id: 'cip_krizi', takip: true, kat: 'Teknoloji', ikon: '🔌', baslik: 'Çip Savaşları',
      metin: 'Yeni çip fabrikan küresel rekabetin ortasında kaldı. {guc} yönetimi, ürettiğin çiplerin rakiplerine satılmamasını istiyor.',
      sec: [
        O('Talebe uy', { d: 6, z: -4 }, '{guc} memnun. Bazı müşteriler siparişlerini iptal etti.'),
        O('Herkese satarız, tarafsızız', { z: 7, d: -6 }, 'Siparişler patladı ama {guc} ihracat kısıtlaması tehdidi savuruyor.', { bayrak: 'guc_kizgin' }),
        O('Pazarlık et: kısmi kısıtlama karşılığında yatırım', { z: 3, d: 3 }, 'Zorlu müzakereler başarılı oldu.', { risk: { stat: 'd', fxKotu: { d: -5, z: -3 }, sKotu: 'Pazarlık iki tarafı da kızdırdı.' } })
      ] },
    { id: 'maden_ihalesi', kat: 'Ekonomi', ikon: '⛏️', baslik: 'Değerli Maden Yatağı',
      metin: 'Pil üretiminde kullanılan değerli bir madenin dev yatağı bulundu. {guc} merkezli bir şirket hemen teklif verdi; yatağın üstünde ise köyler ve kutsal sayılan bir vadi var.',
      kosul: (s, u) => u.zenginlik <= 3 && ['AF', 'GA', 'AS', 'OK'].includes(u.bolge) && !s.bayrak.maden,
      sec: [
        O('Şirkete ver, hızlıca çıkarsın', { z: 11, d: 4, h: -6 }, 'Sondajlar başladı. Köylüler yeni evlerine taşınmaya zorlanıyor.', { bayrak: 'maden', sonra: [{ id: 'maden_protesto', tur: 3 }] }),
        O('Önce işleme tesisi şartı koy', { z: 5, h: 3, d: -2 }, 'Maden ülkede işlenecek. Daha yavaş ama daha çok iş yaratacak.', { bayrak: 'maden' }),
        O('Köylülere sor, vadiyi koru', { h: 6, z: -2, d: 2 }, 'Köy meclisleri madene hayır dedi. Kararına saygı gösterdin.', { bayrak: 'cevreci' })
      ] },
    { id: 'maden_protesto', takip: true, kat: 'Toplum', ikon: '✊', baslik: 'Vadi Direnişi',
      metin: 'Maden sahasına giden yolu yüzlerce köylü kapattı. Şirket güvenlik istiyor, kameralar ise her şeyi kaydediyor.',
      sec: [
        O('Köylülere gelirden pay ver', { z: -4, h: 6, d: 2 }, 'Maden gelirinin bir kısmı artık köylerin okullarına gidiyor.'),
        O('Jandarmayla yolu aç', { h: -8, o: 2, d: -5 }, 'Yol açıldı ama görüntüler dünyayı dolaştı.', { bayrak: 'sert_yonetim' }),
        O('Projeyi askıya al', { z: -6, h: 5, d: -3 }, '{guc} şirketi tazminat davası açacağını söyledi.')
      ] },
    { id: 'muson', kat: 'Felaket', ikon: '🌧️', baslik: 'Muson Gecikti',
      metin: 'Yağmur mevsimi bu yıl üç hafta gecikti. Pirinç tarlaları kurumaya başladı; pazarlarda fiyatlar yükseliyor.',
      kosul: bolge('AS'),
      sec: [
        O('Pirinç ihracatını yasakla', { h: 6, d: -6, z: -2 }, 'İç piyasada fiyatlar düştü. İthalatçı ülkeler kızgın.'),
        O('Bulut tohumlama dene', { z: -4 }, 'Uçaklar bulutlara gümüş iyodür püskürttü.', { risk: { stat: 'z', fxKotu: { h: -4, z: -2 }, sKotu: 'Bulutlar umursamadı. Para boşa gitti.' }, sonuc: s => { s.stat.h = Math.min(100, s.stat.h + 5); } }),
        O('Devlet depolarını aç', { h: 4, z: -6 }, 'Stoklar dağıtıldı. Muson nihayet geldiğinde herkes rahatladı.')
      ] },

    // ───────────── KABİNE ─────────────
    { id: 'bakan_istifa', takip: true, kat: 'Kabine', ikon: '📨', baslik: 'İstifa Mektubu',
      metin: '{bakanlik} Bakanı {bakan} istifa mektubunu masana bıraktı: "Önerilerim aylardır görmezden geliniyor. Ya bana yetki verirsiniz ya da giderim."',
      sec: [
        O('Taleplerini kabul et, bütçe ayır', { z: -5 }, 'Bakan mektubunu geri aldı. Bakanlığına ek kaynak aktarıldı.', {
          sonuc: s => { const k = s.aktif.b.bakanK; const b = s.kabine[k]; b.sadakat = 65; b.uyardi = false; s.stat[k] = Math.min(100, s.stat[k] + 5); } }),
        O('İstifasını kabul et', { h: -2 }, 'Yerine yeni bir isim atandı. Eski bakan ise anılarını yazmaya başladı bile.', {
          sonuc: s => { const k = s.aktif.b.bakanK; const eski = s.kabine[k].ad; s.kabine[k] = yeniBakanAl(s, eski); s.stat[k] = Math.max(0, s.stat[k] - 3); } }),
        O('Onu kamuoyu önünde savun, ikna etmeye çalış', { h: 2 }, 'Uzun bir akşam yemeğinde dertleştiniz. Bakan "bir şans daha" dedi.', {
          risk: { stat: 'h', fxKotu: { h: -7 }, sKotu: 'Bakan ertesi gün televizyona çıkıp her şeyi anlattı. Yerine yenisini atamak zorunda kaldın.' },
          sonuc: s => { const b = s.kabine[s.aktif.b.bakanK]; b.sadakat = 50; b.uyardi = false; },
          sonucKotu: s => { const k = s.aktif.b.bakanK; s.kabine[k] = yeniBakanAl(s, s.kabine[k].ad); } })
      ] }
  ];

  // Yeni bakan (motor yüklendikten sonra çağrılır)
  const yeniBakanAl = (s, eski) => G.MOTOR.yeniBakan(s, [eski]);

  G.VERI = G.VERI || {};
  G.VERI.OLAYLAR = (G.VERI.OLAYLAR || []).concat(YENI);
})(typeof window !== 'undefined' ? window : globalThis);
