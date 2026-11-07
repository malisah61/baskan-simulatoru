// OLAYLAR 3 (v0.3) — muhalefet lideri ve TV tartışması, halk ayaklanması, kabine kavgası,
// hikâye zincirleri (Liman Dosyası, Vadi Referandumu, Aşı Yarışı), eski kararların geri dönüşü ve bölgesel olaylar.
// Biçim için js/olaylar.js başındaki açıklamaya bak. Ek alanlar:
//   zincir: 'liman', adim: 2 -> olay bir hikâye zincirinin halkasıdır (ekranda "2/4" gösterilir)
//   muhalefet: -5            -> seçeneğin muhalefet liderinin gücüne etkisi
//   rozet: 'id'              -> seçenek başarılı olursa başarım verir
//   oncelik: true            -> kriz olaylarında öne geçer
//   metin / s fonksiyon olabilir: (s) => '...' (geçmiş kararlara göre değişen metin)
// Ek yer tutucular: {muhalif} muhalefet lideri, {bakan_z} {bakan_o} {bakan_d} bakan adları.
(function (G) {
  const O = (t, fx, s, ek) => Object.assign({ t, fx, s }, ek || {});
  const bolge = (...b) => (s, u) => b.includes(u.bolge);
  const ref = n => s => { s.refPuan = (s.refPuan || 0) + n; };
  const birlik = s => (s.refPuan || 0) >= 3;

  const YENI = [
    // ───────────── MUHALEFET VE SEÇİM ─────────────
    { id: 'tartisma', ozel: true, kat: 'Seçim', ikon: '🎙️', baslik: 'Canlı Yayında Büyük Tartışma',
      metin: 'Seçime iki ay kala bütün kanallar aynı yayını veriyor: Muhalefet lideri {muhalif} karşında, stüdyo ışıkları yanıyor. Milyonlarca seçmen bu gece kararını verecek.',
      sec: [
        O('Rakamlarla konuş, hazinenin durumunu anlat', { h: 2 }, 'Grafiklerin ve sakin tavrın stüdyoyu ikna etti. Anketlerde ibre sana döndü.', {
          risk: { stat: 'z', fxKotu: { h: -3 }, sKotu: 'Rakibin bir rakamını yalanladı ve haklı çıktı. Gecenin en çok paylaşılan anı bu oldu.' },
          sonuc: s => { s.tartisma = 4; }, sonucKotu: s => { s.tartisma = -3; }, muhalefet: -4, rozet: 'tartisma' }),
        O('Rakibinin geçmişine sert saldır', { h: 1 }, 'Rakibin cevap veremeden kekeledi. Taraftarların sosyal medyada bayram ediyor.', {
          risk: { stat: 'h', fxKotu: { h: -5 }, sKotu: 'Saldırın geri tepti: seyirciler seni kaba buldu, rakibin mağdur oldu.' },
          sonuc: s => { s.tartisma = 5; }, sonucKotu: s => { s.tartisma = -5; }, muhalefet: -6, rozet: 'tartisma' }),
        O('Tartışmaya katılma, o gece mitinge git', { h: 1, z: -2 }, 'Meydan kalabalıktı ama stüdyodaki boş kürsü bütün gece ekranda kaldı.', { sonuc: s => { s.tartisma = -1; }, muhalefet: 3 })
      ] },
    { id: 'muhalif_miting', kat: 'İç Politika', ikon: '📣', baslik: '{muhalif} Meydanı Doldurdu',
      metin: 'Muhalefet lideri {muhalif} başkentte son yılların en büyük mitingini yaptı. Kürsüden "Bu iktidarın son baharı" diye bağırdı. Anketlerde fark kapanıyor.',
      kosul: s => s.muhalefet && s.muhalefet.guc >= 50, agirlik: 2,
      sec: [
        O('Bir sonraki mitingi güvenlik gerekçesiyle yasakla', { h: -6, o: 2, d: -3 }, 'Valilik yasağı duyurdu. Muhalefet "korkuyorlar" diyerek daha da büyüdü.', { bayrak: 'sert_yonetim', muhalefet: 5 }),
        O('Aynı gün kendi mitingini yap', { h: 4, z: -4 }, 'İki meydan, iki kalabalık. Televizyonlar ekranı ikiye böldü; seninki biraz daha kalabalıktı.', { muhalefet: -3 }),
        O('Eleştirilerini dinle, bir reform paketi açıkla', { h: 5, z: -6, d: 2 }, '"Haklı oldukları yerler var" demen herkesi şaşırttı. Muhalefetin elindeki kozlar azaldı.', { muhalefet: -7 })
      ] },
    { id: 'muhalif_skandal', kat: 'Skandal', ikon: '🗂️', baslik: 'Muhalefetin Kasası',
      metin: 'Bir gazete, {muhalif} liderliğindeki partinin kampanya bağışlarında açıklanamayan milyonlar olduğunu yazdı. Senin danışmanların bu dosyayı büyütmek için sabırsızlanıyor.',
      kosul: s => !!s.muhalefet && s.tur >= 6, tek: true,
      sec: [
        O('Bütün kanallarda bu konuyu işlet', { h: 3 }, 'Haftalarca her akşam aynı haber döndü. Rakibin ağır yara aldı.', {
          risk: { stat: 'h', fxKotu: { h: -8 }, sKotu: 'Belgelerin bir kısmının sahte olduğu ortaya çıktı. Şimdi skandalın adı sensin.' },
          muhalefet: -10, sonucKotu: s => { s.muhalefet.guc = Math.min(95, s.muhalefet.guc + 12); } }),
        O('Sus, yargı işini yapsın', { d: 3, h: 1 }, 'Sessizliğin olgun bulundu. Dosya mahkemede yavaş yavaş ilerliyor.', { muhalefet: -4 }),
        O('Herkes için bağış şeffaflığı yasası çıkar', { h: 4, z: -2, d: 3 }, 'Artık her partinin kasası internette. Seninki de dahil. Seçmenler bu adımı sevdi.', { muhalefet: -5 })
      ] },
    { id: 'ulusal_birlik', kat: 'İç Politika', ikon: '🤝', baslik: 'Milli Birlik Teklifi',
      metin: 'Ülke zor günlerden geçerken muhalefet lideri {muhalif} sürpriz bir teklif getirdi: "Bir yıl boyunca kavgayı bırakalım, krizi birlikte çözelim. Karşılığında bir bakanlık istiyoruz."',
      kosul: s => !!s.muhalefet && ['h', 'z', 'd'].some(k => s.stat[k] < 28), tek: true,
      sec: [
        O('Kabul et, Dışişlerini muhalefete ver', { h: 8, d: 5 }, 'Meclis bir yıl sonra ilk kez ayakta alkışladı. Ama rakibin artık hükümette, ve görünür.', {
          muhalefet: 6, sonuc: s => { s.kabine.d = Object.assign(G.MOTOR.yeniBakan(s, [s.kabine.d.ad]), { sadakat: 35, kisilik: 'guvercin' }); } }),
        O('Kibarca reddet', { h: -3 }, '"Ülkeyi biz yönetiriz" dedin. Muhalefet bu cevabı afişe çevirdi.', { muhalefet: 4 }),
        O('Bakanlık verme ama ortak bir kriz masası kur', { h: 4, z: -2 }, 'Haftada bir ortak toplantı yapılıyor. Kimse tam memnun değil ama gerginlik düştü.', { muhalefet: 1 })
      ] },
    { id: 'kabine_kavga', kat: 'Kabine', ikon: '🥊', baslik: 'Kabinede Bütçe Kavgası',
      metin: 'Kabine toplantısında sesler yükseldi. Ekonomi Bakanı {bakan_z} "kasada para yok" diye masaya vurdu; Savunma Bakanı {bakan_o} ise yeni tanklar olmadan sınırları koruyamayacağını söylüyor. İkisi de sana bakıyor.',
      kosul: s => s.kabine && s.tur >= 5,
      sec: [
        O('Ekonomi Bakanını haklı bul', { z: 6, o: -4 }, '{bakan_z} gülümsedi, {bakan_o} toplantıyı erken terk etti.', { sonuc: s => { s.kabine.z.sadakat = Math.min(100, s.kabine.z.sadakat + 10); s.kabine.o.sadakat = Math.max(0, s.kabine.o.sadakat - 12); } }),
        O('Savunma Bakanını haklı bul', { o: 5, z: -5 }, 'Tank siparişi onaylandı. {bakan_z} ertesi gün basına "endişeliyim" dedi.', { sonuc: s => { s.kabine.o.sadakat = Math.min(100, s.kabine.o.sadakat + 10); s.kabine.z.sadakat = Math.max(0, s.kabine.z.sadakat - 12); } }),
        O('İkisini de azarla, kararı sen ver', { h: 2, z: -1, o: 1 }, 'Masaya vurdun: "Bu kabinede patron benim." Bakanlar sustu, ikisi de biraz kırgın.', { sonuc: s => { s.kabine.z.sadakat = Math.max(0, s.kabine.z.sadakat - 5); s.kabine.o.sadakat = Math.max(0, s.kabine.o.sadakat - 5); } })
      ] },

    // ───────────── HALK AYAKLANMASI (en tehlikeli kriz) ─────────────
    { id: 'ayaklanma', kriz: true, oncelik: true, kat: 'Kriz', ikon: '🔥', baslik: 'Saray Kuşatıldı',
      metin: 'Yüz binler sarayın etrafını sardı. Muhafız alayının komutanı telsizden soruyor: "Emirleriniz nedir?" Bu gece verilecek karar ya kurtuluşun ya sonun olacak.',
      kosul: s => s.stat.h <= 12,
      sec: [
        O('Muhafızlar meydanı boşaltsın', { h: 4, o: -6, d: -8 }, 'Sabaha karşı meydan boşaldı. Kimse bu geceyi unutmayacak.', {
          bayrak: 'sert_yonetim', risk: { stat: 'o', fxKotu: { h: -14, o: -5 }, sKotu: 'Askerler halka karşı yürümeyi reddetti ve silahlarını indirdi. Kalabalık kapılara yüklendi.' } }),
        O('Kalabalığın önüne çık, konuş', { h: 15 }, 'Mikrofonu aldın ve hatalarını tek tek saydın. Bir sessizlik oldu, sonra alkış. Bu gece kurtuldun.', {
          rozet: 'ayaklanma', risk: { stat: 'h', fxKotu: { h: -12 }, sKotu: 'Sözlerin ıslıklarla bastırıldı. Birileri sahneye şişe fırlattı.' } }),
        O('Hükümeti feshet, erken seçim ilan et', { h: 9, z: -5 }, 'Bütün bakanları görevden aldın ve erken seçim tarihini açıkladın. Kalabalık sevinçle dağıldı; şimdi sandık bekliyor.', {
          rozet: 'ayaklanma', sonuc: s => { s.erkenSecim = true; Object.values(s.kabine).forEach(b => { b.sadakat = 50; }); } })
      ] },

    // ───────────── HİKÂYE ZİNCİRİ: LİMAN DOSYASI ─────────────
    { id: 'liman_1', zincir: 'liman', adim: 1, tek: true, kat: 'Hikâye', ikon: '🚢', baslik: 'Limanda Kaybolan Konteynerler',
      metin: 'Gümrük müfettişi gece yarısı aradı: Ana limanda kayıtlarda görünen 300 konteyner ortada yok. "Birileri yıllardır vergi ödemeden mal sokuyor. Ve izler yukarıya çıkıyor."',
      kosul: s => s.tur >= 4,
      sec: [
        O('Gizli bir soruşturma başlat', { z: -2 }, 'Müfettişe küçük ve güvenilir bir ekip verdin. Şimdilik kimse bilmiyor.', { sonra: [{ id: 'liman_2', tur: 3 }] }),
        O('Gümrük müdürünü görevden al, konuyu kapat', { z: 2, h: -1 }, 'Müdür sessizce emekli oldu. Ama müfettiş belgelerin kopyasını birine vermişti...', { bayrak: 'liman_ortbas', sonra: [{ id: 'liman_2', tur: 3 }] }),
        O('Bunlar her limanda olur, uğraşma', { z: -3 }, 'Dosya rafa kalktı. Kaçakçılık sürüyor, hazine kaybediyor.')
      ] },
    { id: 'liman_2', takip: true, zincir: 'liman', adim: 2, kat: 'Hikâye', ikon: '📁', baslik: 'Gazetecinin Elindeki Belgeler',
      metin: 'Genç bir araştırmacı gazeteci liman belgelerine ulaştı. Belgelerde bir bakanın kayınbiraderinin şirketi var. Haber yarın sabah yayımlanacak.',
      sec: [
        O('Belgeleri savcılığa kendin gönder', { h: 4, d: 3, z: -2 }, '"Kim olursa olsun" dedin. Gazeteci haberine senin açıklamanı da ekledi.', { sonra: [{ id: 'liman_3', tur: 2 }] }),
        O('Haberi mahkeme kararıyla yasaklat', { h: -4, d: -3 }, 'Gazetenin sitesi erişime kapandı. Ama ekran görüntüleri her yerde dolaşıyor.', { bayrak: 'sansur', sonuc: s => { s.bayrak.liman_ortbas = true; }, sonra: [{ id: 'liman_3', tur: 2 }] }),
        O('Bakanı sessizce istifa ettir', { h: 1 }, 'Bakan "sağlık sorunları" nedeniyle ayrıldı. Gazeteci bu açıklamaya inanmadı.', { sonra: [{ id: 'liman_3', tur: 2 }] })
      ] },
    { id: 'liman_3', takip: true, zincir: 'liman', adim: 3, kat: 'Hikâye', ikon: '⚖️', baslik: 'Savcı Kapıda',
      metin: s => 'Başsavcı, sarayın baş danışmanını ifadeye çağırmak istiyor. ' + (s.bayrak.liman_ortbas ? 'Örtbas girişimleri artık dosyada ayrı bir başlık.' : 'Şimdiye kadarki şeffaflığın savcılıkta takdir topladı.') + ' Danışmanın senden koruma bekliyor.',
      sec: [
        O('Tam işbirliği: danışman ifade versin', { h: 5, d: 4, o: -1 }, 'Danışman dört saat ifade verdi. Kaçakçılık ağı bir bir çözülüyor.', { sonuc: s => { if (!s.bayrak.liman_ortbas) s.bayrak.liman_temiz = true; }, sonra: [{ id: 'liman_4a', tur: 3 }] }),
        O('Savcıyı görevden al', { h: -8, d: -6 }, 'Yeni savcı dosyayı "yeniden inceleme" için bekletmeye aldı. Barolar ayakta.', { bayrak: 'yolsuz', sonra: [{ id: 'liman_4b', tur: 3 }] }),
        O('Kapsamlı bir af yasası çıkar', { h: -5, z: 3 }, 'Af, kaçakçıları da kapsıyor. Meclis oylaması gürültülü geçti.', { bayrak: 'yolsuz', sonra: [{ id: 'liman_4b', tur: 3 }] })
      ] },
    { id: 'liman_4a', takip: true, zincir: 'liman', adim: 4, kat: 'Hikâye', ikon: '🧹', baslik: 'Temiz Eller',
      metin: s => 'Mahkeme kaçakçılık ağının 14 üyesini mahkûm etti. Hazineye el konulan mallardan büyük bir gelir girdi. ' + (s.bayrak.liman_temiz ? 'Gazeteler seni "en baştan beri doğru olanı yapan başkan" diye yazıyor.' : 'Gazeteler başlangıçtaki tereddüdünü de hatırlatıyor ama sonuç ortada.'),
      sec: [
        O('Mahkeme kararını halka kendin duyur', { h: 6, z: 5 }, 'Konuşman canlı yayında rekor izlendi.'),
        O('Aynı denetimi bütün limanlara yay', { z: 3, d: 5, h: 3 }, 'Dijital konteyner takibi başladı. Yabancı yatırımcılar limanlara güveniyor.', { bayrak: 'seffaf_liman' }),
        O('Gazeteciye devlet ödülü ver', { h: 4, d: 4, z: 2 }, 'Tören salonunda gazeteci "ilk kez bir başkan bana teşekkür etti" dedi.', { muhalefet: -4 })
      ] },
    { id: 'liman_4b', takip: true, zincir: 'liman', adim: 4, kat: 'Hikâye', ikon: '🗞️', baslik: 'Dosya Dünya Basınında',
      metin: 'Liman dosyasının tamamı, yabancı bir gazetede on sayfalık bir dosya olarak yayımlandı. Belgelerde örtbas talimatları da var. Yatırımcılar telefonlarını açmıyor.',
      sec: [
        O('Her şeyi reddet: "Dış güçlerin oyunu"', { h: 2, d: -8 }, 'Destekçilerin sana inandı. Geri kalan herkes inanmadı.', { muhalefet: 5 }),
        O('Baş danışmanını feda et', { h: 2, d: -2, z: -2 }, 'Danışman tutuklandı. Sorular ise bitmedi.', { muhalefet: 2 }),
        O('Bağımsız bir soruşturma komisyonu kur', { h: 4, d: 4, z: -4 }, 'Komisyonun başına saygın bir emekli yargıç geçti. Bu adım geç ama değerli bulundu.', { sonuc: s => { delete s.bayrak.yolsuz; } })
      ] },

    // ───────────── HİKÂYE ZİNCİRİ: VADİ REFERANDUMU ─────────────
    { id: 'ref_1', zincir: 'referandum', adim: 1, tek: true, kat: 'Hikâye', ikon: '🏔️', baslik: 'Vadi Referandum İstiyor',
      metin: 'Kuzeydeki dağlık vadi eyaletinin meclisi, "{ulke} içinde kalmak mı, ayrılmak mı" sorusuyla referandum yapma kararı aldı. Vadi kendi dilini konuşuyor ve yıllardır ihmal edildiğini söylüyor.',
      kosul: (s, u) => u.nufus >= 3 && s.tur >= 6 && !s.bayrak.ozerklik_verildi,
      sec: [
        O('Referanduma izin ver, kampanya serbest olsun', { d: 6, h: -3 }, 'Dünya demokratik tavrını alkışladı. Şimdi vadiyi ikna etmen gerekiyor.', { sonuc: ref(0), sonra: [{ id: 'ref_2', tur: 3 }] }),
        O('Geniş özerklik teklif et, oylamayı bir yıl ertele', { z: -6, h: 2, d: 2 }, 'Vadi meclisi teklifi tartışıyor; oylama ertelendi ama iptal edilmedi.', { sonuc: ref(2), sonra: [{ id: 'ref_2', tur: 5 }] }),
        O('Referandumu yasa dışı ilan et', { o: 2, d: -6, h: -2 }, 'Anayasa mahkemesi oylamayı iptal etti. Vadi yine de gizli sandık kurmaya hazırlanıyor.', { bayrak: 'sert_yonetim', sonuc: ref(-2), sonra: [{ id: 'ref_2', tur: 3 }] })
      ] },
    { id: 'ref_2', takip: true, zincir: 'referandum', adim: 2, kat: 'Hikâye', ikon: '🗳️', baslik: 'Vadide Kampanya Kızışıyor',
      metin: s => 'Vadide her köşede "Evet" ve "Hayır" afişleri var. ' + ((s.refPuan || 0) >= 1 ? 'Son anket birlik yanlılarının az farkla önde olduğunu söylüyor.' : 'Son anket ayrılıkçıların önde olduğunu söylüyor.') + ' Kampanyaya nasıl katılacaksın?',
      sec: [
        O('Birlik kampanyasına bütçe ayır', { z: -6, h: 2 }, 'Konserler, broşürler, televizyon reklamları... Vadi bir anda renklendi.', { sonuc: ref(2), sonra: [{ id: 'ref_3', tur: 2 }] }),
        O('Vadiye üniversite ve otoyol sözü ver', { z: -9, h: 3 }, 'Vadi halkı ilk kez başkentten somut bir söz duydu.', { sonuc: ref(3), sonra: [{ id: 'ref_3', tur: 2 }] }),
        O('{guc} yönetiminden birlik lehine açıklama iste', { d: 2, h: -2 }, '{guc} açıklamayı yaptı. Ayrılıkçılar "yabancılar karışıyor" diye öfkelendi.', { sonuc: ref(-1), sonra: [{ id: 'ref_3', tur: 2 }] })
      ] },
    { id: 'ref_3', takip: true, zincir: 'referandum', adim: 3, kat: 'Hikâye', ikon: '🌙', baslik: 'Sandıktan Önceki Gece',
      metin: 'Yarın vadide sandıklar açılacak. İstihbarat, iki tarafta da kışkırtıcıların olduğunu bildiriyor. Vadi liderleri seninle gizlice görüşmek istiyor.',
      sec: [
        O('Vadi liderleriyle gizli bir anlaşma yap', { z: -4, h: 1 }, 'Gece yarısı bir el sıkışma: vadi liderleri "tarafsız" kalacak.', { sonuc: ref(2), sonra: [{ id: 'ref_4', tur: 1 }] }),
        O('Sandık bölgelerine asker gönder', { o: -3, d: -4, h: 2 }, 'Sokaklar sakin ama vadide herkes tankları konuşuyor.', { bayrak: 'sert_yonetim', sonuc: ref(-2), sonra: [{ id: 'ref_4', tur: 1 }] }),
        O('Ulusa sesleniş: "Sonuç ne olursa olsun saygı duyacağım"', { d: 5, h: 1 }, 'Konuşman vadide de izlendi. Bazı kararsızlar bu dürüstlüğü sevdi.', { sonuc: ref(1), sonra: [{ id: 'ref_4', tur: 1 }] })
      ] },
    { id: 'ref_4', takip: true, zincir: 'referandum', adim: 4, kat: 'Hikâye', ikon: '📊', baslik: 'Referandum Sonucu',
      metin: s => birlik(s)
        ? 'Sayım bitti: Vadi halkı %57 ile {ulke} içinde kalmayı seçti. Ayrılıkçılar yenilgiyi kabul etti ama yaraların sarılması gerekiyor.'
        : 'Sayım bitti: Vadi halkı %53 ile ayrılık yönünde oy kullandı. Bütün dünya senin ne yapacağına bakıyor.',
      sec: [
        O('Sonucu kabul et ve vadiyle yeni bir anlaşma imzala', { d: 6, h: 2 }, s => birlik(s) ? 'Vadiye kendi dilinde eğitim ve yerel meclis hakkı verdin. Gergin yıllar kapandı.' : 'Uzun bir ayrılık müzakeresi başladı. Ülke küçüldü ama dünya olgunluğunu alkışladı.', {
          sonuc: s => { s.bayrak.ozerklik_verildi = true; if (!birlik(s)) { s.stat.h = Math.max(0, s.stat.h - 8); s.stat.z = Math.max(0, s.stat.z - 4); } else s.stat.h = Math.min(100, s.stat.h + 5); } }),
        O('Sonucu tanıma, vadiye olağanüstü hal ilan et', { o: 3, d: -9, h: -2 }, s => birlik(s) ? 'Kazandığın bir oylamadan sonra bile OHAL ilan etmen herkesi şaşırttı.' : 'Vadi sokakları karıştı. Yaptırım tehditleri art arda geliyor.', { bayrak: 'ohal' }),
        O('Hangi sonuç olursa olsun vadiye kalkınma fonu kur', { z: -7, h: 4, d: 3 }, s => birlik(s) ? 'Vadiye ilk kez okul, hastane ve yol yatırımı akıyor.' : 'Fon, ayrılık müzakerelerinde iyi niyetin simgesi oldu.', { sonuc: s => { s.bayrak.ozerklik_verildi = true; } })
      ] },

    // ───────────── HİKÂYE ZİNCİRİ: AŞI YARIŞI ─────────────
    { id: 'asi_1', zincir: 'salgin_asi', adim: 1, tek: true, kat: 'Hikâye', ikon: '🧪', baslik: 'Yerli Aşı Adayı',
      metin: 'Yeni bir grip türü komşu ülkelerde yayılıyor. Ulusal laboratuvarın genç bilim insanları ellerinde umut verici bir aşı adayı olduğunu söylüyor, ama denemeler için büyük kaynak gerekiyor.',
      kosul: s => s.tur >= 8,
      sec: [
        O('Laboratuvara tam kaynak ver', { z: -7, h: 2 }, 'Laboratuvarın ışıkları artık hiç sönmüyor.', { bayrak: 'bilim', sonra: [{ id: 'asi_2', tur: 2 }] }),
        O('{guc} şirketinden lisans satın al', { z: -4, d: 3 }, 'Lisans anlaşması imzalandı. Üretim yerli fabrikada yapılacak.', { sonra: [{ id: 'asi_2', tur: 2 }] }),
        O('Gerek yok, salgın buraya gelmez', { z: 1 }, 'Laboratuvar ekibi hayal kırıklığı içinde. Umarım haklısındır.', { sonra: [{ id: 'asi_3', tur: 4 }] })
      ] },
    { id: 'asi_2', takip: true, zincir: 'salgin_asi', adim: 2, kat: 'Hikâye', ikon: '📋', baslik: 'Deneme Sonuçları',
      metin: 'İlk denemeler iyi gidiyor ama son aşama aylar sürebilir. Kış yaklaşırken sağlık bakanlığı karar bekliyor.',
      sec: [
        O('Acil onay ver, hemen üretime geç', { h: 4 }, 'Aşılar kış gelmeden hastanelere ulaştı.', { risk: { stat: 'h', fxKotu: { h: -7, d: -2 }, sKotu: 'Aceleyle onaylanan aşı bazı kişilerde yan etki yaptı. Güven sarsıldı.' }, sonra: [{ id: 'asi_3', tur: 2 }] }),
        O('Denemeler tamamlansın', { z: -3, d: 2 }, 'Bilim insanları rahat bir nefes aldı. Aşı daha geç ama daha güvenilir gelecek.', { sonra: [{ id: 'asi_3', tur: 3 }] }),
        O('Komşu ülkelerle ortak deneme yap', { d: 6, z: -2 }, '{komsu} ile ortak aşı merkezi kuruldu.', { sonra: [{ id: 'asi_3', tur: 2 }] })
      ] },
    { id: 'asi_3', takip: true, zincir: 'salgin_asi', adim: 3, kat: 'Hikâye', ikon: '❄️', baslik: 'Kış Dalgası',
      metin: s => s.zincir && s.zincir.salgin_asi >= 2
        ? 'Grip dalgası ülkeye ulaştı, ama depolarda aşı var. Şimdi soru şu: aşıyı nasıl dağıtacaksın?'
        : 'Grip dalgası ülkeye ulaştı ve elinde aşı yok. Hastaneler dolmaya başladı.',
      sec: [
        O('Herkes için ücretsiz aşı ya da tedavi', { h: 6, z: -7 }, 'Sağlık merkezlerinin önünde uzun ama sakin kuyruklar var.'),
        O('Önce yaşlılar ve sağlık çalışanları', { h: 3, z: -3 }, 'Mantıklı bir sıra kuruldu. Kış zor geçti ama kontrol altında.'),
        O('Fazlasını yurt dışına sat', { z: 7, d: 2, h: -4 }, s => s.zincir && s.zincir.salgin_asi >= 2 ? 'Aşı ihracatı hazineye para getirdi. Sırada bekleyenler ise öfkeli.' : 'Satacak aşın olmadığı için ilaç ve maske stoklarını sattın. Eczaneler boşaldı.')
      ] },

    // ───────────── ESKİ KARARLARIN GERİ DÖNÜŞÜ ─────────────
    { id: 'imar_kurtardi', kat: 'Afet', ikon: '🏘️', baslik: 'Sel Geldi, Mahalleler Ayakta', agirlik: 2, tek: true,
      metin: 'Şiddetli yağmurlardan sonra nehirler taştı. Ama yıllar önce dere yataklarından kaldırdığın binaların yerinde artık kimse yaşamıyor. Komşu şehirler zarar görürken seninkiler ayakta.',
      kosul: s => !!s.bayrak.imar,
      sec: [
        O('Kararının arkasında duranlara teşekkür et', { h: 7 }, 'Eskiden seni eleştiren mühendisler bile "haklıymış" diye yazdı.'),
        O('Yardım ekiplerini {komsu} tarafına gönder', { d: 7, o: -2, h: 2 }, '{komsu} halkı yardım ekiplerini alkışlarla karşıladı.'),
        O('Bu modeli bütün ülkeye yay', { z: -5, h: 5, d: 2 }, 'Yeni imar planları dere yataklarını parklara çeviriyor.')
      ] },
    { id: 'yesil_ihracat', kat: 'Enerji', ikon: '🔋', baslik: 'Elektrik Fazlası', agirlik: 2, tek: true,
      metin: 'Yıllar önce kurduğun güneş ve rüzgâr santralleri artık ülkenin ihtiyacından fazlasını üretiyor. {komsu} yönetimi enerji krizinde ve kapını çalıyor.',
      kosul: s => !!s.bayrak.yesil_enerji,
      sec: [
        O('Piyasa fiyatından sat', { z: 9, d: 2 }, 'Kablolar sınırı geçti, para hazineye aktı.'),
        O('Kriz bitene kadar ucuza ver', { d: 9, z: 2 }, '{komsu} halkı bu iyiliği unutmayacak.'),
        O('Elektriği evlerde ucuzlat', { h: 7, z: -2 }, 'Faturalar yarı yarıya düştü. Kışın ilk kez kimse kaloriferi kısmadı.')
      ] },
    { id: 'tarafsiz_arabulucu', kat: 'Dış Politika', ikon: '🕊️', baslik: 'Barış Masası Senin Başkentinde', agirlik: 2, tek: true,
      metin: 'Tarafsızlık kararın meyvesini veriyor: {guc} ve rakipleri arasındaki gerginlikte iki taraf da arabulucu olarak seni istiyor. Zirve başkentinde yapılabilir.',
      kosul: s => !!s.bayrak.tarafsiz,
      sec: [
        O('Zirveye ev sahipliği yap', { d: 8, z: -4, h: 3 }, 'İki taraf aynı masada oturdu ve ortak bir bildiri imzalandı.', { risk: { stat: 'd', fxKotu: { d: -4, z: -2 }, sKotu: 'Zirve ilk gün dağıldı. İki taraf da seni suçluyor.' } }),
        O('Sadece aracılık et, sahneye çıkma', { d: 4 }, 'Sessiz diplomasi işe yaradı. Adın manşetlerde değil ama dosyalarda.'),
        O('Aracılık karşılığında ticaret anlaşması iste', { z: 7, d: -2 }, 'İki taraf da bu pazarlıktan hoşlanmadı ama anlaşmaları imzaladı.')
      ] },
    { id: 'fabrika_tehdit', kat: 'Ekonomi', ikon: '🏭', baslik: 'Fabrika Gitmekle Tehdit Ediyor', agirlik: 2, tek: true,
      metin: 'Yıllar önce gelen {guc} kökenli dev fabrika daha fazla vergi indirimi istiyor. Yönetim "ya yeni teşvik ya da üretimi başka ülkeye taşırız" diyor. 12 bin kişi orada çalışıyor.',
      kosul: s => !!s.bayrak.guc_yatirim && s.tur >= 8,
      sec: [
        O('Yeni teşvikleri ver', { z: -6, h: 2 }, 'Fabrika kaldı. Muhalefet "şantaja boyun eğdiler" diyor.', { muhalefet: 3 }),
        O('Blöf yapıyorlar, reddet', { z: 3, h: 2 }, 'Yönetim birkaç hafta tehdit etti, sonra sessizce geri adım attı.', { risk: { stat: 'z', fxKotu: { h: -8, z: -5 }, sKotu: 'Blöf değilmiş. Fabrika üretimi taşıdı, 12 bin kişi işsiz kaldı.' } }),
        O('Fabrikayı kamulaştır', { h: 6, z: 2, d: -10 }, 'Bayraklar fabrikaya çekildi. {guc} yönetimi büyükelçisini çağırdı.', { bayrak: 'guc_kizgin' })
      ] },
    { id: 'dijital_para_sizinti', kat: 'Teknoloji', ikon: '🔓', baslik: 'Dijital Paradan Veri Sızdı', agirlik: 2, tek: true,
      metin: 'Milli dijital paranın sistemine sızan bilgisayar korsanları milyonlarca kişinin harcama bilgisini internete döktü. Kimin hangi gazeteyi aldığı bile görülüyor.',
      kosul: s => !!s.bayrak.dijital_para,
      sec: [
        O('Sistemi durdur, nakde geri dön', { h: 3, z: -6 }, 'Dijital para askıya alındı. Bankalar önünde yine kuyruklar var.'),
        O('Gizlilik yasası çıkar, verileri silme hakkı ver', { h: 5, d: 3, z: -3 }, 'Artık herkes kendi verisini silebiliyor. Güven yavaş yavaş dönüyor.'),
        O('Korsanları yakala, gerisi önemsiz', { o: 2, h: -4 }, 'Siber birim iki kişiyi yakaladı. Sızan veriler ise hâlâ internette.', { risk: { stat: 'o', fxKotu: { h: -4, d: -3 }, sKotu: 'Korsanların {komsu} kaynaklı olduğu anlaşıldı ama yakalanamadılar.' } })
      ] },

    // ───────────── BÖLGEYE ÖZEL ─────────────
    { id: 'nehir_suyu', kat: 'Dış Politika', ikon: '💧', baslik: 'Nehir Kuruyor',
      metin: '{komsu} yönetimi nehrin yukarısında dev bir baraj doldurmaya başladı. Ülkene gelen su üçte bir azaldı; çiftçiler tarlalarının çatladığını söylüyor.',
      kosul: bolge('OD', 'AF', 'AS'),
      sec: [
        O('Uluslararası arabuluculuk iste', { d: 5, h: -2 }, 'Ortak bir su komisyonu kuruldu. Barajın dolma hızı yavaşladı.', { risk: { stat: 'd', fxKotu: { d: -2, h: -4 }, sKotu: 'Komisyon toplandı ama {komsu} masadan kalktı.' } }),
        O('Tuzdan arındırma tesisleri kur', { z: -9, h: 4 }, 'Kıyıya devasa tesisler kuruluyor. Pahalı ama bağımsız.'),
        O('Sınıra asker yığ, gözdağı ver', { o: 3, d: -7, h: 3 }, 'Gerginlik tavan yaptı. {komsu} barajın kapaklarını biraz açtı.', { sonra: [{ id: 'sinir_catisma', tur: 3 }] })
      ] },
    { id: 'kacak_balikci', kat: 'Ekonomi', ikon: '🐟', baslik: 'Kaçak Balıkçı Filoları',
      metin: 'Uydu görüntüleri, denizlerinde yüzlerce yabancı balıkçı teknesinin izinsiz avlandığını gösteriyor. Yerel balıkçılar ağlarının boş döndüğünü söylüyor.',
      kosul: bolge('OK', 'KA', 'GA', 'AF'),
      sec: [
        O('Sahil güvenliğe yeni botlar al', { z: -6, o: 4, h: 3 }, 'Yeni botlar ilk ayda 30 tekneyi limana çekti.'),
        O('Avlanma izni sat, para kazan', { z: 8, h: -5 }, 'Lisans geliri hazineye girdi. Köylerde balıkçılar öfkeli.'),
        O('Bölge ülkeleriyle ortak devriye kur', { d: 6, z: -2, o: 1 }, 'Ortak devriye anlaşması imzalandı. Uydu verileri paylaşılıyor.')
      ] },
    { id: 'mobil_para', kat: 'Teknoloji', ikon: '📲', baslik: 'Telefonla Ödeme Devrimi',
      metin: 'Banka hesabı olmayan milyonlarca kişi artık parasını cep telefonuyla gönderiyor. Yerli bir girişim bu sistemi bütün ülkeye yaymak için izin istiyor; bankalar ise karşı.',
      kosul: (s, u) => u.zenginlik <= 3,
      sec: [
        O('Girişime izin ver, önünü aç', { h: 6, z: 3, d: 1 }, 'Pazar tezgâhlarında bile artık telefonla ödeme yapılıyor.', { bayrak: 'teknoloji' }),
        O('Bankalarla ortaklık şartı koy', { z: 5, h: 1 }, 'Bankalar razı oldu, sistem biraz yavaş ama güvenli büyüyor.'),
        O('Bu işi devlet bankası yapsın', { z: -4, h: 2, o: 1 }, 'Devlet bankasının uygulaması çıktı. İlk sürüm sık sık çöküyor.')
      ] }
  ];

  G.VERI = G.VERI || {};
  G.VERI.OLAYLAR = (G.VERI.OLAYLAR || []).concat(YENI);
})(typeof window !== 'undefined' ? window : globalThis);
