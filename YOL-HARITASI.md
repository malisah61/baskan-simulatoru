# Yol Haritası — Dünya Başkanı

## Mehmet Ali'nin istekleri (kalıcı)
- Gerçek ülkelerin hepsi seçilebilsin.
- Her olayda 3 seçenek; seçimler hikâyeyi ve sonraki olayları etkilesin.
- Göstergeler: Halk desteği, Hazine, Ordu, Dış ilişkiler.
- Oyun iki şekilde bitsin: halk desteği sıfırlanınca devrilme, 4 yılın sonunda seçim.
- En az 50 senaryo. Olaylar şablon sistemiyle (yapay zekâ anahtarı yok, internetsiz).
- Oyun her gece geliştirilsin; detayları Claude kendisi düşünsün.

> Yeni bir isteğin varsa bu satırın altına yaz, gece görevi önce onu yapar:

## Yapılanlar
### 2026-11-06 (gece 1) — v0.2: Kabine, dönem sözü, başarımlar
**Geliştirilen 3 özellik**
- Ekonomi dengesi: Fakir ülkelerde masraf çarpanı yumuşadı, dış ilişkileri iyi olan fakir ülkeye uluslararası yardım geliyor. ★5 ülkelerde 2 dönem %1 → %13, iflas %80 → %49.
- Seçim: "Oylar nereden geldi?" dökümü (halk, ekonomi, söz, kabine uyumu, skandallar, gurur projeleri, iktidar yorgunluğu, şans). Sansür, sert yönetim ve yolsuzluk sandıkta ceza.
- Son ekranı: görev boyunca göstergelerin grafiği (seçimler işaretli), "Tarih seni böyle hatırlayacak" miras unvanı, istifa ayrı bir son oldu.

**Yeni 3 özellik**
- 👔 Kabine: Ekonomi, Savunma, Dışişleri bakanları seçenek önerir; sadakat, istifa mektubu, sadık bakanla riskli işlerde şans bonusu.
- 🎯 Dönem sözü: Her dönem başında söz verilir, ekranda canlı takip, seçimde +6/−5 oy.
- 🏅 Başarımlar (16), sonlar koleksiyonu (9), dünya turu (7 bölge), ülke ülke rekorlar, oyun içi başarım bildirimi.

**Senaryolar:** 25 yeni olay (18 ana + 7 takip): geçmiş kararları geri getiren 11 olay, 8 bölgeye özel olay ve takipleri, bakan istifa olayı. Toplam: 69 ana + 17 takip + 5 kriz + seçim + dönem sözü.
Motor: `agirlik` ve `tek` alanları çalışıyor; kayıt sürümü 2 (eski kayıtlar otomatik taşınır).

### 2026-11-06 — İlk sürüm (v0.1)
- 197 ülke (bölge, nüfus, zenginlik, askeri güç, komşular), bölge filtresi ve arama, zorluk yıldızları.
- 51 ana senaryo + 10 takip olayı + 5 kriz olayı + seçim olayı.
- Gecikmeli sonuçlar (ör. para basmak → 3 tur sonra hiperenflasyon; yaptırım → misilleme).
- Riskli seçenekler (🎲): başarı şansı ilgili göstergeye ve ülkenin gücüne bağlı.
- Ülkeye göre ölçek: fakir ülkede masraf daha çok acıtır, güçlü orduda kayıp daha az.
- Tarihi rakip komşu, büyük güçler (ABD, Çin, Rusya, AB).
- Seçim: dürüst kampanya / vaatler / hile (yakalanma riski). 2 dönem sınırı; anayasa değişirse 5 döneme kadar.
- 7 farklı son, puan ve rekor, karar günlüğü, otomatik kayıt.

## Fikir havuzu (öncelik sırasıyla)
1. ~~Danışman sistemi~~ (v0.2'de temel hâli yapıldı) → Sonraki adım: bakanların kişiliği (şahin/güvercin), bakanlar arası çekişme olayları, bakan değiştirme ekranı.
2. Ülkeler arası ilişki puanları: her ülkeyle ayrı ilişki; komşular ve büyük güçler kararlarını hatırlasın.
3. Ülkeye özel olaylar: Türkiye, ABD, Rusya, Çin, Almanya, Brezilya, Hindistan vb. için gerçek gündeme yakın senaryolar.
4. Savaş sistemi: cephe, savaş turu, barış masası, toprak kazanıp kaybetme.
5. Bütçe ekranı: vergi oranı, savunma/sağlık/eğitim payı kaydırıcıları, her tur pasif etki.
6. Partiler ve meclis: koalisyon, yasa geçirme, muhalefet gücü.
7. Haber akışı / sosyal medya ekranı: kararlarına gelen tepkiler.
8. ~~Başarımlar ve ülke ülke en iyi skorlar~~ (v0.2) → Sonraki adım: gizli başarımlar, ülkeye özel başarımlar.
9. Ses efektleri ve müzik (ücretsiz CC0), titreşim.
10. Dünya haritası ekranı (SVG), etkilenen ülkeleri gösterme.
11. Android APK (GitHub Actions ile).
12. Zorluk seviyeleri ve "hikâye modu" (ilk oyun rehberi).
13. Halk devrilmesini anlamlı kıl: kriz_halk daha az kurtarıcı olsun, "halk sıfırlanınca devrilme" daha sık ve dramatik olsun (şu an %2-3).
14. Toplumsal gruplar (Democracy 4): işçiler, iş dünyası, gençler, emekliler, dindarlar, milliyetçiler; her kararın grupları ayrı etkilemesi ve seçimde grup bazlı oy.
15. Rakip aday ve kampanya mini-oyunu: muhalefet liderinin adı/karakteri, tartışma programı olayı.
16. Dönem sözü havuzunu büyüt (reform, altyapı, yolsuzlukla mücadele gibi karara dayalı sözler).
17. Olay zincirleri (3-4 halkalı uzun hikâyeler, Suzerain tarzı): ör. bağımsızlık referandumu, büyük skandal soruşturması.
18. Sonlar koleksiyonuna "özel sonlar": ör. sürgünde anı kitabı, Nobel Barış Ödülü, ay'a insan göndermek.
