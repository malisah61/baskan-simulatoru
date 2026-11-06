// OYUN MOTORU — tarayıcıdan bağımsızdır (node ile test edilebilir).
(function (G) {
  const V = () => G.VERI;
  const KAYIT_SURUMU = 1;
  const TUR_AY = 2;            // her tur 2 ay
  const DONEM_TUR = 24;        // 4 yıl = 24 tur
  const DONEM_SINIRI = 2;      // anayasa değişmezse en fazla 2 dönem
  const BEKLEME = 18;          // aynı olay en az 18 tur sonra tekrar çıkar
  const STATLAR = ['h', 'z', 'o', 'd'];
  const STAT_AD = { h: 'Halk', z: 'Hazine', o: 'Ordu', d: 'Dış İlişkiler' };
  const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  // Basit tohumlu rastgele sayı üreteci (kayıtlar tutarlı kalsın)
  function rng(s) {
    s.tohum = (s.tohum * 1664525 + 1013904223) >>> 0;
    return s.tohum / 4294967296;
  }
  const sec = (s, dizi) => dizi[Math.floor(rng(s) * dizi.length)];
  const sinirla = v => Math.max(0, Math.min(100, Math.round(v)));

  function ulke(s) { return V().ULKELER[s.kod]; }

  function yeniOyun(kod, tohum) {
    const u = V().ULKELER[kod];
    if (!u) throw new Error('Ülke yok: ' + kod);
    const s = {
      surum: KAYIT_SURUMU, kod, tur: 0, donem: 1, tohum: (tohum || Date.now()) >>> 0,
      stat: {
        h: 55,
        z: 22 + u.zenginlik * 9,
        o: 24 + u.askeri * 8,
        d: 50
      },
      bayrak: {}, kuyruk: [], kullanilan: {}, gecmis: [], rakip: null, bitti: null,
      aktif: null, erkenSecim: false, kararSayisi: 0, donemSonuTur: DONEM_TUR - 1
    };
    // Tarihi rakip: komşulardan biri (yoksa bir büyük güç)
    s.rakip = u.komsular.length ? sec(s, u.komsular) : null;
    sonrakiOlay(s);
    return s;
  }

  // Zorluk: başlangıç göstergelerine göre 1 (kolay) - 5 (çok zor)
  function zorluk(kod) {
    const u = V().ULKELER[kod];
    const toplam = u.zenginlik * 9 + u.askeri * 8;
    if (toplam >= 75) return 1;
    if (toplam >= 60) return 2;
    if (toplam >= 45) return 3;
    if (toplam >= 30) return 4;
    return 5;
  }

  function tarih(s) {
    const ay = s.tur * TUR_AY;
    return { ay: AYLAR[ay % 12], yil: 2027 + Math.floor(ay / 12) };
  }
  function tarihMetni(s) { const t = tarih(s); return t.ay + ' ' + t.yil; }

  // Yer tutucuları doldur
  function baglamOlustur(s, onceki) {
    const u = ulke(s);
    const b = Object.assign({}, onceki || {});
    if (!b.komsu) {
      const kom = u.komsular.length ? sec(s, u.komsular) : null;
      b.komsu = kom ? V().ULKELER[kom].ad : 'Komşu ülke';
    }
    if (!b.guc) {
      const gucler = V().BUYUK_GUCLER.filter(g => g.kod !== s.kod);
      b.guc = sec(s, gucler).ad;
    }
    b.ulke = u.ad;
    b.rakip = s.rakip ? V().ULKELER[s.rakip].ad : b.komsu;
    return b;
  }
  function doldur(metin, b) {
    return String(metin).replace(/\{(\w+)\}/g, (m, k) => (b[k] !== undefined ? b[k] : m));
  }

  function olayBul(id) {
    if (id === 'secim') return V().SECIM;
    return V().OLAYLAR.find(o => o.id === id);
  }

  // Sıradaki olayı seç
  function sonrakiOlay(s) {
    if (s.bitti) return;
    const u = ulke(s);
    // 1) Dönem sonu ya da erken seçim
    if (s.tur >= s.donemSonuTur || s.erkenSecim) {
      s.erkenSecim = false;
      s.aktif = { id: 'secim', b: baglamOlustur(s) };
      return;
    }
    // 2) Zamanı gelen takip olayı
    const i = s.kuyruk.findIndex(k => k.tur <= s.tur);
    if (i >= 0) {
      const k = s.kuyruk.splice(i, 1)[0];
      s.aktif = { id: k.id, b: baglamOlustur(s, k.b) };
      s.kullanilan[k.id] = s.tur;
      return;
    }
    const uygun = o => !o.takip && !o.ozel && (!o.kosul || o.kosul(s, u)) &&
      (s.kullanilan[o.id] === undefined || s.tur - s.kullanilan[o.id] >= BEKLEME);
    // 3) Kriz olayları (en fazla her 3 turda bir)
    if (!s.sonKriz || s.tur - s.sonKriz >= 3) {
      const krizler = V().OLAYLAR.filter(o => o.kriz && uygun(o));
      if (krizler.length) {
        const o = sec(s, krizler);
        s.sonKriz = s.tur;
        s.kullanilan[o.id] = s.tur;
        s.aktif = { id: o.id, b: baglamOlustur(s) };
        return;
      }
    }
    // 4) Normal havuz
    let havuz = V().OLAYLAR.filter(o => !o.kriz && uygun(o));
    if (!havuz.length) havuz = V().OLAYLAR.filter(o => !o.kriz && !o.takip && !o.ozel && (!o.kosul || o.kosul(s, u)));
    // Son 2 olayın kategorisini tekrar etmemeye çalış
    const sonKat = s.gecmis.slice(-2).map(g => g.kat);
    const cesitli = havuz.filter(o => !sonKat.includes(o.kat));
    const o = sec(s, cesitli.length ? cesitli : havuz);
    s.kullanilan[o.id] = s.tur;
    s.aktif = { id: o.id, b: baglamOlustur(s) };
  }

  // Aktif olayı ekranda gösterilecek hâle getir
  function aktifOlay(s) {
    if (!s.aktif) return null;
    const o = olayBul(s.aktif.id);
    const b = s.aktif.b;
    return {
      id: o.id, kat: o.kat, ikon: o.ikon, baslik: doldur(o.baslik, b), metin: doldur(o.metin, b),
      secenekler: o.sec.map(x => ({ t: doldur(x.t, b), ipucu: ipucu(s, x), riskli: !!x.risk }))
    };
  }

  // Hangi göstergeler etkilenecek (yön gösterilmez, sadece büyüklük)
  function ipucu(s, x) {
    const r = {};
    const fx = efektHesapla(s, x.fx || {});
    STATLAR.forEach(k => { const v = Math.abs(fx[k] || 0); if (v) r[k] = v >= 10 ? 2 : 1; });
    if (x.risk) Object.keys(x.risk.fxKotu || {}).forEach(k => { r[k] = r[k] || 1; });
    return r;
  }

  // Ülkeye göre etkileri ölçekle: fakir ülkelerde masraflar daha çok acıtır
  function efektHesapla(s, fx) {
    const u = ulke(s);
    const r = {};
    const fakirlik = [1.35, 1.2, 1, 0.9, 0.8][u.zenginlik - 1];
    STATLAR.forEach(k => {
      let v = fx[k] || 0;
      if (k === 'z' && v < 0) v *= fakirlik;
      if (k === 'o' && v < 0 && u.askeri >= 4) v *= 0.85;
      r[k] = Math.round(v);
    });
    return r;
  }

  function basariSansi(s, stat) {
    const u = ulke(s);
    let p = 0.2 + (s.stat[stat] / 100) * 0.65;
    if (stat === 'o') p += (u.askeri - 3) * 0.05;
    if (stat === 'd' && s.bayrak.ittifak) p += 0.05;
    return Math.max(0.1, Math.min(0.92, p));
  }

  // Seçim yap: sonuç nesnesi döndürür
  function secimYap(s, indeks) {
    if (s.bitti || !s.aktif) return null;
    const o = olayBul(s.aktif.id);
    const x = o.sec[indeks];
    const b = s.aktif.b;
    const once = Object.assign({}, s.stat);
    let metin = x.s;
    let basarili = true;

    if (o.id === 'secim') return secimSonucu(s, x, once);

    let fx = x.fx || {};
    if (x.risk) {
      basarili = rng(s) < basariSansi(s, x.risk.stat);
      if (!basarili) { fx = x.risk.fxKotu || {}; metin = x.risk.sKotu; }
    }
    const e = efektHesapla(s, fx);
    STATLAR.forEach(k => { s.stat[k] = sinirla(s.stat[k] + e[k]); });
    if (x.bayrak && basarili) s.bayrak[x.bayrak] = true;
    if (x.sonuc && basarili) x.sonuc(s);
    const takipler = basarili ? (x.sonra || []) : (x.risk && x.risk.sonraKotu) || [];
    takipler.forEach(t => s.kuyruk.push({ id: t.id, tur: s.tur + t.tur, b: { komsu: b.komsu, guc: b.guc } }));

    s.kararSayisi++;
    s.gecmis.push({ tur: s.tur, id: o.id, kat: o.kat, baslik: doldur(o.baslik, b), secim: doldur(x.t, b), basarili });
    if (s.gecmis.length > 60) s.gecmis.shift();

    const sonuc = { metin: doldur(metin, b), basarili, riskli: !!x.risk, degisim: fark(once, s.stat) };
    ilerle(s);
    sonuc.bitti = s.bitti;
    return sonuc;
  }

  function fark(once, simdi) {
    const r = {}; STATLAR.forEach(k => { r[k] = simdi[k] - once[k]; }); return r;
  }

  function secimSonucu(s, x, once) {
    const b = s.aktif.b;
    let oy = 18 + s.stat.h * 0.5 + s.stat.z * 0.1 + s.stat.d * 0.06 + s.stat.o * 0.04 + (rng(s) * 12 - 6);
    let metin = x.s;
    if (x.secim === 'vaat') { oy += 7; s.stat.z = sinirla(s.stat.z + efektHesapla(s, x.fx).z); }
    if (x.secim === 'durust') { oy += 1; s.stat.d = sinirla(s.stat.d + 3); }
    let hileYakalandi = false;
    if (x.secim === 'hile') {
      oy += 15;
      hileYakalandi = rng(s) < 0.35;
      s.stat.d = sinirla(s.stat.d - 12);
      s.bayrak.hile = true;
      if (hileYakalandi) { s.stat.h = sinirla(s.stat.h - 25); metin += ' Ama bir sandık görevlisi her şeyi kameraya çekti!'; }
    }
    oy = Math.max(5, Math.min(95, Math.round(oy * 10) / 10));
    const kazandi = oy >= 50 && !(hileYakalandi && s.stat.h <= 0);
    s.gecmis.push({ tur: s.tur, id: 'secim', kat: 'Seçim', baslik: 'Seçim', secim: x.t, basarili: kazandi });
    s.kararSayisi++;
    const sonuc = { metin: doldur(metin, b), secim: true, oy, kazandi, degisim: fark(once, s.stat) };
    if (!kazandi) {
      s.bitti = { tip: 'secim_kaybi', oy };
    } else {
      s.donem++;
      // Dönem sınırı
      if (s.donem > DONEM_SINIRI && !s.bayrak.sinirsiz_donem) {
        s.bitti = { tip: 'emeklilik', oy };
      } else if (s.donem > 5) {
        s.bitti = { tip: 'omur_boyu', oy };
      } else {
        s.stat.h = sinirla(s.stat.h + 6); // seçim zaferi balayı
      }
    }
    if (!s.bitti) {
      s.tur++;
      s.donemSonuTur = s.tur + DONEM_TUR - 1; // yeni dönem tam 4 yıl
      bitisKontrol(s);
      sonrakiOlay(s);
    }
    sonuc.bitti = s.bitti;
    return sonuc;
  }

  function bitisKontrol(s) {
    if (s.bitti) return;
    if (s.stat.h <= 0) s.bitti = { tip: 'h0' };
    else if (s.stat.z <= 0) s.bitti = { tip: 'z0' };
    else if (s.stat.o <= 0) s.bitti = { tip: 'o0' };
    else if (s.stat.d <= 0) s.bitti = { tip: 'd0' };
    else if (s.stat.o >= 100) s.bitti = { tip: 'o100' };
  }

  function ilerle(s) {
    // Küçük pasif değişimler: zenginlik hazineyi besler, aşırı sert yönetim halkı yorar
    const u = ulke(s);
    if (s.tur % 3 === 2) s.stat.z = sinirla(s.stat.z + Math.max(-1, u.zenginlik - 3));
    // İktidar yıpranması: halk desteği zamanla azalır
    if (s.tur % 3 === 1) s.stat.h = sinirla(s.stat.h - 1);
    if (s.stat.h > 80 && s.tur % 2 === 1) s.stat.h = sinirla(s.stat.h - 1);
    bitisKontrol(s);
    s.tur++;
    if (!s.bitti) sonrakiOlay(s);
  }

  const SONLAR = {
    h0: { ikon: '🔥', baslik: 'Halk Sarayı Bastı', metin: 'Öfkeli kalabalıklar başkanlık sarayının kapılarını kırdı. Bir helikopterle gece yarısı ülkeden kaçtın.' },
    z0: { ikon: '💸', baslik: 'Devlet İflas Etti', metin: 'Hazinede tek kuruş kalmadı. Maaşlar ödenemedi, bankalar kapandı ve meclis seni görevden aldı.' },
    o0: { ikon: '🏳️', baslik: 'Ordu Dağıldı', metin: 'Maaş alamayan askerler kışlaları terk etti. {rakip} bu fırsatı kaçırmadı ve sınırı geçti.' },
    d0: { ikon: '🧱', baslik: 'Dünyadan Koptun', metin: 'Bütün dünya sana yaptırım uyguladı. Ekonomi çöktü, kabinen seni istifaya zorladı.' },
    o100: { ikon: '🎖️', baslik: 'Askeri Darbe', metin: 'Ordu o kadar güçlendi ki artık sana ihtiyacı kalmadı. Bir sabah tanklar sarayın önündeydi.' },
    secim_kaybi: { ikon: '🗳️', baslik: 'Seçimi Kaybettin', metin: 'Halk sandıkta kararını verdi. Rakibine tebrik telefonu açtın ve sarayı boşalttın.' },
    omur_boyu: { ikon: '👑', baslik: 'Ömür Boyu Başkan', metin: '20 yıl boyunca ülkeyi yönettin. Heykellerin her meydanda. Tarih seni kahraman mı diktatör mü olarak hatırlayacak, kimse bilmiyor.' },
    emeklilik: { ikon: '🏆', baslik: 'Efsane Başkan', metin: 'İki dönemi başarıyla tamamladın ve anayasaya saygı göstererek görevi devrettin. Adın okul kitaplarına yazılacak.' }
  };

  function sonBilgisi(s) {
    if (!s.bitti) return null;
    const so = SONLAR[s.bitti.tip];
    const b = { rakip: s.rakip ? V().ULKELER[s.rakip].ad : 'Komşu ülke', ulke: ulke(s).ad };
    const ay = s.tur * TUR_AY;
    return {
      tip: s.bitti.tip, ikon: so.ikon, baslik: so.baslik, metin: doldur(so.metin, b),
      oy: s.bitti.oy, sure: Math.floor(ay / 12) + ' yıl ' + (ay % 12) + ' ay',
      puan: puan(s), kararSayisi: s.kararSayisi
    };
  }

  function puan(s) {
    const st = s.stat;
    let p = s.tur * 10 + Math.round((st.h + st.z + st.o + st.d) / 4) * 2;
    if (s.bitti && s.bitti.tip === 'emeklilik') p += 300;
    if (s.bitti && s.bitti.tip === 'omur_boyu') p += 150;
    if (s.bayrak.hile) p -= 50;
    return Math.max(0, p);
  }

  function kayitYukle(veri) {
    if (!veri || typeof veri !== 'object') return null;
    if (!veri.surum) return null;
    // Gelecekteki sürümler için taşıma burada yapılır
    veri.surum = KAYIT_SURUMU;
    return veri;
  }

  G.MOTOR = {
    yeniOyun, aktifOlay, secimYap, tarihMetni, sonBilgisi, zorluk, kayitYukle, basariSansi, ulke,
    STATLAR, STAT_AD, DONEM_TUR, KAYIT_SURUMU
  };
})(typeof window !== 'undefined' ? window : globalThis);
