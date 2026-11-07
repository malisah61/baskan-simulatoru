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
### 2026-11-07 (gece 2) — v0.3: Bütçe, muhalefet lideri, hikâye zincirleri
**Geliştirilen 3 özellik**
- Halk tehlikesi: Halk 20 altında "sokak öfkesi" (her tur −1), kasa 15 altında maaşlar gecikir, halk 12 altında "Saray Kuşatıldı" krizi; kırmızı uyarı şeridi. Eski kriz olayı daha az kurtarıcı.
- Kabine: Bakan kişilikleri (Şahin, Güvercin, Teknokrat, Popülist) önerileri etkiliyor; bakanı görevden alma (yılda bir); bakanlar arası kavga olayı.
- Dönem sözü: 6 → 11 söz; karar tarzına dayalı sözler (temiz yönetim, büyük proje, uyumlu kabine, vergi artırmama, barışçı dönem), bazıları daha çok oy getiriyor.

**Yeni 3 özellik**
- 🧮 Yıllık bütçe: vergi, savunma, sosyal harcama, diplomasi kolları; 6 ayda bir etki, yılda bir değişiklik, seçime yansıyor.
- 📣 Muhalefet lideri ve 🎙️ TV tartışması: gücü halka göre değişen rakip, seçimden 2 ay önce canlı yayın tartışması, oy dökümünde satır.
- 📖 Hikâye zincirleri: Liman Dosyası (4 halka, 2 son), Vadi Referandumu (sonuç önceki kararlara göre), Aşı Yarışı (3 halka); kartta ilerleme rozeti, geçmişe göre değişen metinler.

**Senaryolar:** 26 yeni olay (15 ana, 9 takip, 1 kriz, 1 özel). Toplam: 84 ana + 26 takip + 6 kriz + TV tartışması + seçim + dönem sözü = 119.
Yeni başarımlar: Kürsünün Hâkimi, Hikâyenin Sonu, Rakipsiz, Kıl Payı Kurtuluş (toplam 20). Yeni miras unvanları: Temiz Eller, Birliğin Mimarı. Kayıt sürümü 3 (eski kayıtlar otomatik taşınır).
İflas ★5'te %52 → %43, ★4'te %43 → %34 (rastgele oyuncu).

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
1. ~~Danışman sistemi~~ (v0.2) → ~~kişilik, çekişme, görevden alma~~ (v0.3) → Sonraki adım: bakanın kendi gündemi (her bakanın bir dönem hedefi), bakan skandalları.
2. Ülkeler arası ilişki puanları: her ülkeyle ayrı ilişki; komşular ve büyük güçler kararlarını hatırlasın.
3. Ülkeye özel olaylar: Türkiye, ABD, Rusya, Çin, Almanya, Brezilya, Hindistan vb. için gerçek gündeme yakın senaryolar.
4. Savaş sistemi: cephe, savaş turu, barış masası, toprak kazanıp kaybetme.
5. ~~Bütçe ekranı~~ (v0.3: 4 kollu yıllık bütçe) → Sonraki adım: borçlanma/tahvil, bütçe açığına göre faiz.
6. Partiler ve meclis: koalisyon, yasa geçirme, muhalefet gücü.
7. Haber akışı / sosyal medya ekranı: kararlarına gelen tepkiler.
8. ~~Başarımlar ve ülke ülke en iyi skorlar~~ (v0.2) → Sonraki adım: gizli başarımlar, ülkeye özel başarımlar.
9. Ses efektleri ve müzik (ücretsiz CC0), titreşim.
10. Dünya haritası ekranı (SVG), etkilenen ülkeleri gösterme.
11. Android APK (GitHub Actions ile).
12. Zorluk seviyeleri ve "hikâye modu" (ilk oyun rehberi).
13. ~~Halk devrilmesini anlamlı kıl~~ (v0.3: sokak öfkesi, saray kuşatması; h0 %2 → %3-4, hâlâ düşük): kriz_halk daha az kurtarıcı olsun, "halk sıfırlanınca devrilme" daha sık ve dramatik olsun (şu an %2-3).
14. Toplumsal gruplar (Democracy 4): işçiler, iş dünyası, gençler, emekliler, dindarlar, milliyetçiler; her kararın grupları ayrı etkilemesi ve seçimde grup bazlı oy.
15. ~~Rakip aday ve tartışma~~ (v0.3) → Sonraki adım: kampanya mini-oyunu (şehir şehir miting), rakibin kendi vaatleri. muhalefet liderinin adı/karakteri, tartışma programı olayı.
16. ~~Dönem sözü havuzunu büyüt~~ (v0.3: 11 söz) (reform, altyapı, yolsuzlukla mücadele gibi karara dayalı sözler).
17. ~~Olay zincirleri~~ (v0.3: 3 zincir) → Sonraki adım: her oyunda en az bir zincir garanti, darbe girişimi zinciri, büyük deprem sonrası yeniden inşa zinciri. ör. bağımsızlık referandumu, büyük skandal soruşturması.
18. Sonlar koleksiyonuna "özel sonlar": ör. sürgünde anı kitabı, Nobel Barış Ödülü, ay'a insan göndermek.
19. Toplumsal gruplar ile halkı daha oynak yapmak (öncelik yükseldi: rastgele oyuncuda halk nadiren 10 altına iniyor).
20. Haber akışı: her karardan sonra 2-3 kısa tepki (esnaf, öğrenci, yabancı basın).
21. "Bir önceki başkan" mirası: yeni oyuna önceki oyunun unvanına göre küçük bir başlangıç bonusu/cezası (Reigns'teki hanedan hissi).
22. Kayıtlı ülkeye özel olaylar için güvenli, tarafsız şablon: coğrafyaya (kıyı, ada, çöl, dağ) göre olaylar; ülke verisine coğrafya alanı eklemek.
