# 🌍 Dünya Başkanı

Mehmet Ali'nin (malisah61) mobil başkanlık simülatörü. Dünyadaki 197 ülkeden birini seç, her iki ayda bir gelen olaylarda üç seçenekten birini seç. Her karar halkı, hazineyi, orduyu ve dış ilişkileri değiştirir; bazı kararların sonuçları aylar sonra geri döner.

## Nasıl oynanır
- `index.html` dosyasını telefonda bir tarayıcıda (ya da Acode önizlemesinde) aç. İnternet gerekmez.
- 👥 Halk, 💰 Hazine, 🪖 Ordu, 🌐 Dış İlişkiler: biri 0'a düşerse görevden düşersin. Ordu 100'e çıkarsa darbe olur.
- Her 4 yılda (24 tur) seçim var. Anayasa değişmedikçe en fazla 2 dönem.

## Yapı
| Dosya | İçerik |
|---|---|
| `js/ulkeler.js` | 197 ülke: bölge, nüfus, zenginlik (1-5), askeri güç (1-5), komşular |
| `js/olaylar.js` | Senaryolar (ana, takip, kriz) ve seçim olayı |
| `js/motor.js` | Oyun kuralları. Tarayıcıdan bağımsız, node ile test edilir |
| `js/arayuz.js` | Ekranlar, dokunmatik etkileşim, kayıt (localStorage) |
| `css/stil.css` | Mobil öncelikli koyu tema |
| `test/sim.test.mjs` | Her ülkede yüzlerce oyun oynatan motor testi |

## Test
```
node test/sim.test.mjs
```

## Senaryo yazmak
`js/olaylar.js` başındaki açıklamaya bak. Yer tutucular: `{ulke}`, `{komsu}`, `{rakip}`, `{guc}`. Yer tutucudan hemen sonra Türkçe ek getirme ("{komsu} ile", "{komsu} hükümeti" gibi yaz), çünkü ülke adına göre ek değişir.

Gelişim planı ve yapılanlar: [YOL-HARITASI.md](YOL-HARITASI.md)
