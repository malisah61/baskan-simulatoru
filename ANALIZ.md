# Analiz — Dünya Başkanı

Her gece en yeni analiz en üste yazılır.

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
