// Motor testi: her ülkede rastgele oyunlar oynar, hataları ve yer tutucu kaçaklarını yakalar.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const kok = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const f of ['js/ulkeler.js', 'js/olaylar.js', 'js/olaylar2.js', 'js/motor.js']) (0, eval)(readFileSync(path.join(kok, f), 'utf8'));
const { VERI, MOTOR } = globalThis;
let hata = 0;
const kontrol = (kosul, mesaj) => { if (!kosul) { hata++; if (hata < 20) console.error('HATA:', mesaj); } };

const normal = VERI.OLAYLAR.filter(o => !o.takip && !o.kriz && !o.ozel);
console.log('Ülke:', Object.keys(VERI.ULKELER).length, '| Ana senaryo:', normal.length,
  '| Takip:', VERI.OLAYLAR.filter(o => o.takip).length, '| Kriz:', VERI.OLAYLAR.filter(o => o.kriz).length);
kontrol(normal.length >= 50, 'en az 50 ana senaryo olmalı');
VERI.OLAYLAR.forEach(o => {
  kontrol(o.sec.length === 3, o.id + ' 3 seçenekli değil');
  o.sec.forEach(x => (x.sonra || []).concat((x.risk && x.risk.sonraKotu) || []).forEach(t =>
    kontrol(VERI.OLAYLAR.some(y => y.id === t.id && y.takip), o.id + ' -> bilinmeyen takip ' + t.id)));
});
Object.values(VERI.ULKELER).forEach(u => u.komsular.forEach(k => kontrol(VERI.ULKELER[k], u.kod + ' komşu ' + k)));

const sonlar = {}; let toplamTur = 0, oyun = 0; const gorulen = new Set();
for (const kod of Object.keys(VERI.ULKELER)) {
  for (let t = 0; t < 4; t++) {
    const s = MOTOR.yeniOyun(kod, 1000 + t * 7919 + kod.charCodeAt(0));
    let adim = 0;
    while (!s.bitti && adim < 300) {
      const o = MOTOR.aktifOlay(s);
      gorulen.add(o.id);
      const metin = o.baslik + o.metin + o.secenekler.map(x => x.t).join('');
      kontrol(!/\{\w+\}/.test(metin), 'doldurulmamış yer tutucu: ' + o.id + ' ' + kod);
      // Basit "akıllı" oyuncu: en düşük göstergeyi koruyan seçeneği seçmeye çalışır, ara sıra rastgele
      const r = MOTOR.secimYap(s, t % 2 ? Math.floor(Math.random() * 3) : enIyi(s, o.id));
      kontrol(r && !/\{\w+\}/.test(r.metin), 'sonuç metni: ' + o.id);
      adim++;
    }
    kontrol(s.bitti, kod + ' oyun bitmedi');
    sonlar[s.bitti.tip] = (sonlar[s.bitti.tip] || 0) + 1; toplamTur += s.tur; oyun++;
    JSON.parse(JSON.stringify(s));
  }
}
function enIyi(s, id) {
  if (id === 'secim') return 0;
  const o = MOTOR.olayBul(id, s);
  let en = 0, enPuan = -1e9;
  o.sec.forEach((x, i) => {
    let p = 0; for (const k of MOTOR.STATLAR) { const v = s.stat[k] + ((x.fx || {})[k] || 0); p += Math.min(v, 85) - (v < 25 ? 40 : 0) - (k === 'o' && v > 85 ? 40 : 0); }
    if (p > enPuan) { enPuan = p; en = i; }
  });
  return en;
}
console.log('Oyun:', oyun, '| Ortalama tur:', (toplamTur / oyun).toFixed(1), '| Sonlar:', JSON.stringify(sonlar));
const hic = VERI.OLAYLAR.filter(o => !gorulen.has(o.id)).map(o => o.id);
console.log('Hiç çıkmayan olaylar:', hic.join(', ') || 'yok');

// ───── Yeni kurallar ─────
{
  const ids = VERI.OLAYLAR.map(o => o.id);
  kontrol(new Set(ids).size === ids.length, 'tekrar eden olay kimliği var');
  // Oyun bir dönem sözüyle başlar ve kabine kurulur
  const s = MOTOR.yeniOyun('TR', 42);
  kontrol(s.aktif.id === 'vaat', 'ilk olay dönem sözü olmalı');
  kontrol(Object.keys(s.kabine).length === 3, 'kabinede 3 bakan olmalı');
  MOTOR.secimYap(s, 0);
  kontrol(s.vaat && s.vaat.donem === 1, 'söz kaydedilmeli');
  kontrol(MOTOR.vaatDurumu(s), 'söz durumu okunmalı');
  // Bakan önerileri geçerli indeksler
  for (let i = 0; i < 30 && !s.bitti; i++) {
    const on = MOTOR.oneriler(s);
    Object.values(on).forEach(v => kontrol(v >= 0 && v <= 2, 'öneri indeksi'));
    MOTOR.secimYap(s, i % 3);
  }
  // Seçim oy dökümü toplamı oy oranını vermeli
  const t = MOTOR.yeniOyun('DE', 7);
  let r = null;
  while (!t.bitti) { r = MOTOR.secimYap(t, t.aktif.id === 'secim' ? 0 : enIyi(t, t.aktif.id)); if (r.secim) break; }
  if (r && r.secim) {
    const top = r.dokum.reduce((a, k) => a + k.v, 0);
    kontrol(Math.abs(Math.max(5, Math.min(95, top)) - r.oy) < 0.6, 'oy dökümü tutarsız: ' + top + ' / ' + r.oy);
  }
  // İstifa mektubu: sadakat dibe vurunca gelir ve yer tutucuları dolu olur
  const u = MOTOR.yeniOyun('BR', 9);
  MOTOR.secimYap(u, 0);
  u.kabine.z.sadakat = 10; u.kuyruk.push({ id: 'bakan_istifa', tur: u.tur, b: { bakanK: 'z' } });
  MOTOR.secimYap(u, 0);
  if (!u.bitti) {
    const o = MOTOR.aktifOlay(u);
    kontrol(o.id === 'bakan_istifa' && !/\{\w+\}/.test(o.metin), 'istifa olayı');
    const eski = u.kabine.z.ad; MOTOR.secimYap(u, 1);
    kontrol(u.kabine.z.ad !== eski, 'yeni bakan atanmalı');
  }
  // Eski (sürüm 1) kayıt taşınmalı
  const eskiKayit = JSON.parse(JSON.stringify(MOTOR.yeniOyun('FR', 3)));
  delete eskiKayit.kabine; delete eskiKayit.iz; delete eskiKayit.rozet; delete eskiKayit.vaat; delete eskiKayit.secimler; eskiKayit.surum = 1;
  const tasinan = MOTOR.kayitYukle(eskiKayit);
  kontrol(tasinan && tasinan.surum === MOTOR.KAYIT_SURUMU && tasinan.kabine && Array.isArray(tasinan.iz), 'kayıt taşıma');
  for (let i = 0; i < 10 && !tasinan.bitti; i++) MOTOR.secimYap(tasinan, 1);
  // Miras unvanı
  kontrol(MOTOR.miras(tasinan).unvan, 'miras unvanı');
}

// ───── Denge: rastgele oyuncu, zorluk yıldızına göre ─────
{
  const say = {};
  let r0 = 12345; const rnd = () => { r0 = (r0 * 1103515245 + 12345) >>> 0; return r0 / 4294967296; };
  for (const kod of Object.keys(VERI.ULKELER)) {
    const z = MOTOR.zorluk(kod);
    for (let t = 0; t < 6; t++) {
      const s = MOTOR.yeniOyun(kod, 500 + t * 977 + kod.charCodeAt(0) * 3);
      let n = 0; while (!s.bitti && n++ < 400) MOTOR.secimYap(s, Math.floor(rnd() * 3));
      const k = say[z] = say[z] || { n: 0, iki: 0, son: {} };
      k.n++; if (['emeklilik', 'omur_boyu'].includes(s.bitti.tip) || s.donem >= 3) k.iki++;
      k.son[s.bitti.tip] = (k.son[s.bitti.tip] || 0) + 1;
    }
  }
  const tumSon = {};
  Object.keys(say).sort().forEach(z => {
    const k = say[z];
    Object.entries(k.son).forEach(([a, b]) => { tumSon[a] = (tumSon[a] || 0) + b; });
    console.log(`Rastgele oyuncu ★${z}: 2 dönem %${Math.round(k.iki / k.n * 100)} | ` +
      Object.entries(k.son).sort((a, b) => b[1] - a[1]).map(([a, b]) => a + ' %' + Math.round(b / k.n * 100)).join(', '));
  });
  kontrol(say[1].iki / say[1].n >= 0.5, 'kolay ülkelerde rastgele oyuncu çoğunlukla 2 dönemi tamamlamalı');
  kontrol(say[5].iki / say[5].n <= 0.2, 'zor ülkelerde 2 dönem nadir olmalı');
  const top = Object.values(tumSon).reduce((a, b) => a + b, 0);
  Object.entries(tumSon).forEach(([a, b]) => kontrol(b / top <= 0.5, 'baskın bitiş türü: ' + a + ' %' + Math.round(b / top * 100)));
  for (const z of [4, 5]) kontrol((say[z].son.z0 || 0) / say[z].n <= 0.6, '★' + z + ' ülkelerde iflas baskın olmamalı');
}

if (hata) { console.error(hata + ' hata'); process.exit(1); } else console.log('TAMAM ✔');
