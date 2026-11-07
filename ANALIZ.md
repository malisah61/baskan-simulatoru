# Analiz — Dünya Başkanı

Her gece en yeni analiz en üste yazılır.

---

## 2026-11-07 (gece 2) — v0.2 üzerine analiz

### (a) Oynayarak ve test betiğiyle analiz

**Yöntem.** 197 ülkenin her birinde 30'ar oyun (5.910 oyun) rastgele seçim yapan oyuncuyla; ayrıca testteki "akıllı" oyuncuyla 788 oyun. Kafada Türkiye (★2), Brezilya (★3) ve Nijer (★5) ile birer dönem oynandı. Ek ölçümler: bir oyunda aynı olayın tekrar oranı, kriz payı, bitiş yılı dağılımı, en düşük halk desteği, hangi bayrakların hiç okunmadığı.

**Zorluk yıldızlarına göre bitiş dağılımı (v0.2, rastgele oyuncu, 5.910 oyun):**

| Zorluk | 2 dönem | 1. bitiş | 2. bitiş | Halk devrilmesi (h0) |
|---|---|---|---|---|
| ★1 | %64 | Efsane %51 | Seçim kaybı %33 | %2 |
| ★2 | %55 | Efsane %40 | Seçim kaybı %34 | %2 |
| ★3 | %37 | Seçim kaybı %37 | İflas %31 | %2 |
| ★4 | %25 | **İflas %43** | Seçim kaybı %34 | %2 |
| ★5 | %13 | **İflas %52** | Seçim kaybı %36 | %2 |

**Diğer sayılar:** olayların %14,4'ü aynı oyunda ikinci kez çıkıyor; oyunların 2.170'i (%37) 2.-3. yılda bitiyor (çoğu iflas); bir karar ortalama hazineye −1,3, halka +1,0 etki ediyor; oyuncuların yalnızca %7'sinde halk 10'un altına iniyor.

**Bulgular**
1. **Oyunun adı "halk" ama halk öldürmüyor.** Halk sıfırlanarak devrilme bütün zorluklarda %2. Halk düştüğünde kriz olayı +12 ile kurtarıyor; düşük halkın hiçbir sürekli bedeli yok. Oyuncu "halkım 15'te" diye heyecanlanmıyor.
2. **★4-★5'te iflas hâlâ baskın (%43-52) ve oyuncunun elinde ekonomiyi yönetecek bir kol yok.** Hazineyi sadece olay seçenekleriyle etkileyebiliyorsun; uzun vadeli bir ekonomi politikası kurmak mümkün değil. Democracy/Suzerain'deki bütçe kararı eksik.
3. **Seçim yüzsüz.** Kime karşı yarıştığın belli değil; rakip yok, kampanya tek tıklık. Seçime giden aylarda gerilim kurulmuyor.
4. **Kabine tek boyutlu.** Üç bakan da aynı mantıkla öneri yapıyor; istemediğin bakanı kendin değiştiremiyorsun, bakanlar arası çatışma yok.
5. **Hikâyeler tek perdelik.** Takip olayları en fazla 2 halkalı. Suzerain'in gücü olan, birkaç ay süren ve ilk kararına göre farklı biten hikâyeler yok.
6. **Okunmayan bayraklar:** imar, yesil_enerji, tarafsiz, guc_yatirim, dijital_para bırakılıyor ama hiçbir olay onlara bakmıyor.
7. **Dönem sözleri sadece gösterge eşiği.** 6 sözün 5'i "X ≥ 60" tipinde; karar tarzına dayalı söz yok (temiz yönetim, büyük proje, vergi artırmama).
8. Küçük: bölgeye özel olay sayısı az (Afrika ve Okyanusya'ya özgü sadece 1-2 olay).

### (b) Benzer oyunlar araştırması — "bir tur daha" hissi

- **Suzerain** — Yıllık bütçe kararı oyunun omurgası; bakanların kendi gündemi var ve görevden alınabiliyor; muhalefet ve basınla kurulan çok perdeli hikâyeler (dava, referandum) ilk karara göre farklı bitiyor. Seçim/referandum öncesi tartışmalar ve "kimi ikna ettin" hissi güçlü.
- **Democracy 4** — Vergi ve harcama kolları her tur pasif etki yapar; değişiklikler siyasi sermayeyle sınırlı. Seçmen grupları ve muhalefetin güçlenmesi görünür; oyuncu seçimden aylar önce "rakip yükseliyor" diye önlem alır.
- **Reigns** — Tehlike göstergesi uçlara yaklaştıkça olaylar dramatikleşir; ölüm ani değil, hissedilerek gelir.
- **Football Manager** — Yönetim kurulu hedefleri (bizde dönem sözü) farklı tiplerde: sonuç, oyun tarzı, mali denge.
- **Hearts of Iron** — Uzun vadeli kararlar (odak ağacı) ve geçmiş seçimlerin yıllar sonra karşılığı.

**Eksikler:** yıllık bütçe/vergi kolu, yüzü olan bir rakip ve seçim öncesi tartışma, ölümün "yaklaştığını" hissettiren halk tehlikesi, çok halkalı ve dallanan hikâyeler, bakan kişilikleri ve görevden alma, karar tarzına dayalı sözler.

### Karar — bu gecenin 3 + 3 maddesi

**Geliştirilecek 3 özellik**
1. **Halk tehlikesi anlamlı oldu** (Bulgu 1, Reigns): Halk 20'nin altında "sokak öfkesi" her tur −1; kasa 15'in altındayken maaşlar gecikir ve halk erir; halk 12'nin altına inince öncelikli "Saray Kuşatıldı" krizi (3 seçeneğin ikisi riskli, biri erken seçim). Eski kriz olayı daha az kurtarıcı (+12 → +9). Ekranda kırmızı uyarı şeridi.
2. **Kabine derinleşti** (Bulgu 4, Suzerain): Her bakanın kişiliği var (🦅 Şahin, 🕊️ Güvercin, 📐 Teknokrat, 📣 Popülist) ve önerilerine bu da karışıyor; bakanı kabine ekranından görevden alabilirsin (yılda bir, bedelli); yeni "Kabinede Bütçe Kavgası" olayı.
3. **Dönem sözleri karar tarzına bağlandı** (Bulgu 7, Football Manager): 6 → 11 söz. Temiz yönetim (+8 oy), büyük proje (+7), uyumlu kabine, vergi artırmama, barışçı dönem.

**Eklenecek 3 yeni özellik**
1. **🧮 Yıllık bütçe** (Bulgu 2, Democracy 4): Vergi, savunma, sosyal harcama ve diplomasi kolları (düşük/normal/yüksek), her 6 ayda bir pasif etki, yılda bir değişiklik. Yüksek vergi seçimde −2, vergi indirimi +2 oy. Oyuncuya iflasa karşı gerçek bir araç.
2. **📣 Muhalefet lideri ve 🎙️ TV tartışması** (Bulgu 3): Kurmaca isimli bir rakip; gücü halk küskünken artar, halk mutluyken söner; seçimde oy dökümünde ayrı satır. Her seçimden iki ay önce canlı yayın tartışması (rakamlarla konuş / saldır / katılma). 3 muhalefet olayı.
3. **📖 Hikâye zincirleri** (Bulgu 5, Suzerain): Liman Dosyası (4 halka, iki farklı son), Vadi Referandumu (4 halka, sonuç önceki üç kararın toplamına göre değişir), Aşı Yarışı (3 halka). Kartta "📖 Liman Dosyası 2/4" rozeti; olay metinleri geçmiş kararlara göre değişebiliyor (motor desteği eklendi).

**Senaryolar:** 26 yeni olay — zincirler (11), muhalefet ve tartışma (4), ayaklanma krizi, kabine kavgası, okunmayan 5 bayrağın geri dönüşü (imar, yeşil enerji, tarafsızlık, yabancı fabrika, dijital para), 3 bölgesel olay (nehir suyu, kaçak balıkçılar, telefonla ödeme).

### Uygulama sonrası ölçüm (aynı yöntem, 5.910 oyun, rastgele oyuncu)

| Zorluk | 2 dönem (önce → sonra) | İflas (önce → sonra) | h0 (önce → sonra) |
|---|---|---|---|
| ★1 | %64 → %60 | %4 → %3 | %2 → %4 |
| ★2 | %55 → %49 | %16 → %12 | %2 → %3 |
| ★3 | %37 → %37 | %31 → %23 | %2 → %3 |
| ★4 | %25 → %25 | %43 → %34 | %2 → %4 |
| ★5 | %13 → %15 | %52 → %43 | %2 → %3 |

Tekrar oranı %14,4 → %12,3. Rastgele oyuncu bütçeye dokunmuyor; gerçek oyuncu vergi kolu ile iflası daha da azaltabilir. **Kalan sorun:** halk devrilmesi rastgele oyuncuda hâlâ %3-4; rastgele oyuncunun halkı nadiren 10'un altına iniyor (%8). Bir sonraki adım: toplumsal gruplar (her grubun ayrı memnuniyeti) halkı daha oynak yapabilir.

---

## 2026-11-06 (gece 1) — v0.1 üzerine analiz

### (a) Oynayarak ve test betiğiyle analiz

**Yöntem.** 197 ülkenin her birinde 30'ar oyun (toplam 5.910 oyun) rastgele seçim yapan bir oyuncuyla oynatıldı; ayrıca kafada TR, DE, BR, Nijer gibi farklı zorluktaki ülkelerle birer dönem oynandı.

**Zorluk yıldızlarına göre bitiş dağılımı (v0.1, rastgele oyuncu):**

| Zorluk | Ülke | 2 dönemi tamamlayan | Baskın son | Ort. tur |
|---|---|---|---|---|
| ★1 | 8 | %73 | Efsane %52 | 52 |
| ★2 | 22 | %62 | Efsane %41 | 50 |
| ★3 | 28 | %38 | **İflas %37** | 39 |
| ★4 | 59 | %22 | **İflas %58** | 31 |
| ★5 | 80 | %1 | **İflas %80** | 19 |

**Bulgular**
1. **Denge kırık: hazine iflası her şeyi yutuyor.** Ülkelerin %70'i ★4-★5 ve bu ülkelerde oyun neredeyse her zaman "Devlet İflas Etti" ile bitiyor. ★5'te 2 dönem %1, yani pratikte imkânsız. Neden: fakir ülkede masraf çarpanı 1.35, pasif gelir her 3 turda −1, başlangıç hazinesi 31. Halk sıfırlanarak devrilme (oyunun ana fikri) sadece %3.
2. **Kararlar iz bırakıyor ama iz geri dönmüyor.** 30 farklı bayrak konuyor (sansur, sert_yonetim, cevreci, guc_kizgin, yolsuz, multeci, ohal, sulama, yerli_otomobil…) fakat bunların yalnızca 4'ü bir yerde okunuyor. Oyuncu "gazeteyi kapattım" diyor ve bunun hiçbir sonucu olmuyor. Reigns/Suzerain hissinin özü olan "geçmiş peşini bırakmıyor" duygusu eksik.
3. **Seçim kara kutu.** Oy oranı tek bir sayı olarak çıkıyor; oyuncu neden kaybettiğini anlamıyor, bir sonraki oyunda neyi farklı yapacağını bilmiyor.
4. **Uzun vadeli hedef yok.** 48 tur boyunca tek amaç "ölmemek". Kısa hedefler (Reigns'teki görevler, Democracy'deki vaatler) olmadığından ortalarda tekrarlı hissediyor.
5. **Karar verirken danışacak kimse yok.** Seçeneklerin yönü gizli (iyi bir tasarım), ama bu yüzden ilk oyunlarda kararlar yazı-tura gibi geliyor. Bir yönlendirici ses yok.
6. **Oyun bitince geriye bir şey kalmıyor.** Sadece tek bir genel rekor var. Toplanacak bir şey (sonlar, rozetler, ülke rekorları) olmadığı için "bir tur daha" isteği zayıf.
7. **Bölge farkı yok.** Tonga'da da Almanya'da da aynı olaylar çıkıyor; bölgeye özel tek olay yok.
8. Küçük: `agirlik` alanı açıklamada var ama motor kullanmıyor. "İstifa" bitişi "h0" gibi sayılıyor.

### (b) Benzer oyunlar araştırması — "bir tur daha" hissi

- **Reigns** — Her ölüm bir "son" olarak koleksiyona girer (Memento Mori; 26+ ölüm). Oyuncu ölmeyi bile merak eder. Kısa görevler bir sonraki hükümdarlığa hedef verir.
- **Suzerain** — Bakanların kendi gündemi ve sadakati var; her karar birini memnun edip diğerini kızdırır. Verilen sözler kayda geçer ve geri döner.
- **Democracy 4** — Seçimde her seçmen grubunun neden sana oy verdiğini/vermediğini gösterir; kayıp bir derse dönüşür.
- **Football Manager** — Sezon sonu değerlendirme ve hedefler (yönetim beklentisi); hedefin yaşayan ilerleme çubuğu.
- **Hearts of Iron** — Uzun vadeli kararların yıllar sonra etkisi; olay zincirleri.

**Eksikler (bizde olmayan):** son koleksiyonu ve başarımlar, bakan/danışman ilişkisi, seçimde "neden" dökümü, dönem hedefi/vaat, geçmiş kararların geri dönmesi, bitişte göstergelerin zaman grafiği ve "tarih seni nasıl hatırlayacak" yorumu.

### Karar — bu gecenin 3 + 3 maddesi

**Geliştirilecek 3 özellik**
1. **Ekonomi dengesi ve ülke ölçeği** — Bulgu 1. Fakir ülke çarpanı yumuşatıldı (1.35→1.15), fakir ülkelere dış ilişkiler 35+ ise "uluslararası yardım" pasif geliri, başlangıç hazinesi yeniden ayarlandı. Hedef: ★5'te 2 dönem nadir ama mümkün (%10-15), iflas hiçbir zorlukta %60'ı geçmesin.
2. **Seçim sistemi: oy dökümü** — Bulgu 3. Oy oranı kalemlere ayrıldı (halk, ekonomi, itibar, kampanya, söz, kabine uyumu, skandallar, gurur projeleri, iktidar yorgunluğu, şans) ve sonuç kartında "Oylar nereden geldi?" listesi gösteriliyor. Sansür, sert yönetim ve yolsuzluk bayrakları artık sandıkta ceza.
3. **Son ekranı: miras unvanı + gösterge grafiği** — Bulgu 6. Görev boyunca göstergelerin çizgi grafiği (seçim anları işaretli) ve kararlara göre "Tarih seni böyle hatırlayacak" unvanı (Demir Yumruk, Yeşil Başkan, Halkın Sevgilisi…). İstifa artık ayrı bir son.

**Eklenecek 3 yeni özellik**
1. **Kabine (danışmanlar)** — Bulgu 5, Suzerain. Ekonomi, Savunma ve Dışişleri bakanları (kurmaca isimler, bölgeye göre) her olayda kendi alanını koruyan seçeneği önerir (💼 🛡️ 🕊️). Dinlenen bakanın sadakati artar, alanına zarar veren karar düşürür. Sadık bakan riskli işlerde şansı artırır; dibe vuran bakan istifa mektubu getirir.
2. **Dönem sözü** — Bulgu 4, Football Manager/Democracy. Her dönemin başında 3 sözden biri seçilir; ekranda canlı "tutuyor/tutmuyor" çipi. Seçimde +6 / −5 oy.
3. **Başarımlar, sonlar koleksiyonu ve ülke rekorları** — Bulgu 6, Reigns. 16 başarım, 9 sonluk koleksiyon, 7 bölgelik "dünya turu", ülke ülke en iyi puan; oyun içinde yeni başarım bildirimi.

**Senaryolar:** Geçmiş bayrakları geri getiren 11 olay (basın raporu, insan hakları heyeti, yeşil fon, {guc} intikamı, yolsuzluk dosyası, mülteci uyumu, OHAL, yerli otomobil, beyin dönüşü, rekor hasat), 8 bölgeye özel olay (Avrupa kışı, çekirge, orman, deniz yükselmesi, kasırga, çip fabrikası, maden, muson) ve bunların takipleri. Bayrağa bağlı olaylar havuzda 2 kat ağırlıklı (`agirlik` artık çalışıyor), bir kez çıkması gerekenler `tek: true`.

### Uygulama sonrası ölçüm (aynı yöntem, 5.910 oyun)

| Zorluk | 2 dönem (önce → sonra) | İflas (önce → sonra) |
|---|---|---|
| ★1 | %73 → %64 | %4 → %7 |
| ★2 | %62 → %52 | %15 → %18 |
| ★3 | %38 → %37 | %37 → %34 |
| ★4 | %22 → %24 | %58 → %44 |
| ★5 | %1 → %13 | %80 → %49 |

Kalan sorun (sonraki geceye): Halk sıfırlanarak devrilme hâlâ %2-3; kriz olayı halkı çok kolay kurtarıyor. Halk düşüşü daha çok seçim kaybı olarak ortaya çıkıyor.
