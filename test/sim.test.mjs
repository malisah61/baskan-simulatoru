// Motor testi: her ülkede rastgele oyunlar oynar, hataları ve yer tutucu kaçaklarını yakalar.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const kok = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const f of ['js/ulkeler.js', 'js/olaylar.js', 'js/motor.js']) (0, eval)(readFileSync(path.join(kok, f), 'utf8'));
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
  const o = id === 'secim' ? VERI.SECIM : VERI.OLAYLAR.find(x => x.id === id);
  if (id === 'secim') return 0;
  let en = 0, enPuan = -1e9;
  o.sec.forEach((x, i) => {
    let p = 0; for (const k of MOTOR.STATLAR) { const v = s.stat[k] + (x.fx[k] || 0); p += Math.min(v, 85) - (v < 25 ? 40 : 0) - (k === 'o' && v > 85 ? 40 : 0); }
    if (p > enPuan) { enPuan = p; en = i; }
  });
  return en;
}
console.log('Oyun:', oyun, '| Ortalama tur:', (toplamTur / oyun).toFixed(1), '| Sonlar:', JSON.stringify(sonlar));
const hic = VERI.OLAYLAR.filter(o => !gorulen.has(o.id)).map(o => o.id);
console.log('Hiç çıkmayan olaylar:', hic.join(', ') || 'yok');
if (hata) { console.error(hata + ' hata'); process.exit(1); } else console.log('TAMAM ✔');
