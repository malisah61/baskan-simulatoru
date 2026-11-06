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
1. Danışman sistemi: Ekonomi, Savunma, Dışişleri bakanları; her birinin kişiliği ve sadakati, öneri verirler, istifa edebilirler.
2. Ülkeler arası ilişki puanları: her ülkeyle ayrı ilişki; komşular ve büyük güçler kararlarını hatırlasın.
3. Ülkeye özel olaylar: Türkiye, ABD, Rusya, Çin, Almanya, Brezilya, Hindistan vb. için gerçek gündeme yakın senaryolar.
4. Savaş sistemi: cephe, savaş turu, barış masası, toprak kazanıp kaybetme.
5. Bütçe ekranı: vergi oranı, savunma/sağlık/eğitim payı kaydırıcıları, her tur pasif etki.
6. Partiler ve meclis: koalisyon, yasa geçirme, muhalefet gücü.
7. Haber akışı / sosyal medya ekranı: kararlarına gelen tepkiler.
8. Başarımlar (madalyalar) ve ülke ülke en iyi skorlar.
9. Ses efektleri ve müzik (ücretsiz CC0), titreşim.
10. Dünya haritası ekranı (SVG), etkilenen ülkeleri gösterme.
11. Android APK (GitHub Actions ile).
12. Zorluk seviyeleri ve "hikâye modu" (ilk oyun rehberi).
