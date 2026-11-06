// OYUN MOTORU — tarayıcıdan bağımsızdır (node ile test edilebilir).
(function (G) {
  const V = () => G.VERI;
  const KAYIT_SURUMU = 2;
  const TUR_AY = 2;            // her tur 2 ay
  const DONEM_TUR = 24;        // 4 yıl = 24 tur
  const DONEM_SINIRI = 2;      // anayasa değişmezse en fazla 2 dönem
  const BEKLEME = 18;          // aynı olay en az 18 tur sonra tekrar çıkar
  const STATLAR = ['h', 'z', 'o', 'd'];
  const STAT_AD = { h: 'Halk', z: 'Hazine', o: 'Ordu', d: 'Dış İlişkiler' };
  const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  // ───── Kabine (danışmanlar) ─────
  // Her bakan bir göstergeyi korur, her olayda bir seçenek önerir. Dinlenmezse sadakati düşer.
  const BAKANLIKLAR = {
    z: { ad: 'Ekonomi', ikon: '💼' },
    o: { ad: 'Savunma', ikon: '🛡️' },
    d: { ad: 'Dışişleri', ikon: '🕊️' }
  };
  // Kurmaca isimler (gerçek kişiler değildir)
  const ISIMLER = {
    TR: ['Selin Aksoy', 'Kemal Yıldız', 'Deniz Arslan', 'Murat Kaya', 'Ece Demir', 'Burak Şahin', 'Zeynep Tunç', 'Levent Öztürk'],
    AV: ['Elena Varga', 'Tomas Lindqvist', 'Marco Bellini', 'Ana Kovač', 'Pierre Duval', 'Katja Novak', 'Jonas Berg', 'Irena Petrova'],
    OD: ['Omar Haddad', 'Layla Nasser', 'Karim Saleh', 'Yasmin Farouk', 'Tarek Mansour', 'Rania Aziz', 'Samir Khalil', 'Dina Rashed'],
    AS: ['Kenji Sato', 'Mei Lin', 'Arjun Mehta', 'Siti Rahman', 'Minh Tran', 'Aigerim Sadykova', 'Ravi Kapoor', 'Hana Kim'],
    AF: ['Amara Okafor', 'Kwame Mensah', 'Fatou Diallo', 'Thabo Ndlovu', 'Zainab Bello', 'Yared Tesfaye', 'Nia Kamau', 'Moussa Traoré'],
    KA: ['Carlos Rivera', 'Emily Carter', 'Sofia Morales', 'Daniel Brooks', 'Lucía Herrera', 'Marcus Reid', 'Rosa Jiménez', 'Andre Baptiste'],
    GA: ['Mateo Silva', 'Valentina Rojas', 'Diego Fernández', 'Camila Souza', 'Andrés Castillo', 'Luana Costa', 'Tomás Vargas', 'Julieta Paz'],
    OK: ['Tane Walker', 'Mere Tuilagi', 'Isaac Kami', 'Leilani Fono', 'James Hale', 'Ana Vaka', 'Sione Latu', 'Ruby Moana']
  };

  // ───── Dönem sözleri (her dönemin başında biri seçilir) ─────
  const VAATLER = {
    hazine: { t: 'Kasayı dolduracağım (Hazine ≥ 60)', kisa: 'Hazine ≥ 60', s: 'Mitingde "bu dönemin sonunda kasa dolu olacak" dedin. Ekonomistler not aldı.', kontrol: s => s.stat.z >= 60, deger: s => s.stat.z },
    halk: { t: 'Herkesin yüzünü güldüreceğim (Halk ≥ 60)', kisa: 'Halk ≥ 60', s: '"Mutlu bir ülke" sözü afişlere yazıldı. Şimdi herkes seni izliyor.', kontrol: s => s.stat.h >= 60, deger: s => s.stat.h },
    dunya: { t: 'Dünyada saygın olacağız (Dış İlişkiler ≥ 60)', kisa: 'Dış İlişkiler ≥ 60', s: 'Diplomatlar "dünyaya açılım" planını hazırlamaya başladı.', kontrol: s => s.stat.d >= 60, deger: s => s.stat.d },
    guvenlik: { t: 'Güçlü ama ölçülü bir ordu (Ordu 45-75)', kisa: 'Ordu 45-75 arası', s: 'Generaller de barış yanlıları da bu sözden memnun.', kontrol: s => s.stat.o >= 45 && s.stat.o <= 75, deger: s => s.stat.o },
    denge: { t: 'Hiçbir alanı ihmal etmeyeceğim (hiçbiri 30 altına düşmesin)', kisa: 'Hiçbir gösterge 30 altına düşmesin', s: '"Dengeli yönetim" sözü verdin. Tek bir hata bu sözü bozabilir.', kontrol: s => !s.vaat.ihlal && STATLAR.every(k => s.stat[k] >= 30), deger: s => Math.min(...STATLAR.map(k => s.stat[k])) },
    sakin: { t: 'Kriz değil istikrar (en fazla 2 kriz olayı)', kisa: 'En fazla 2 kriz', s: '"Artık kriz haberleri bitecek" dedin. Gazeteciler sayacak.', kontrol: s => (s.vaat.kriz || 0) <= 2, deger: s => s.vaat.kriz || 0 }
  };

  // ───── Başarımlar ─────
  const ROZETLER = {
    ilk_secim: { ikon: '🗳️', ad: 'Sandık Zaferi', aciklama: 'Bir seçim kazan.' },
    efsane: { ikon: '🏆', ad: 'Efsane', aciklama: 'İki dönemi tamamlayıp görevi devret.' },
    omur: { ikon: '👑', ad: 'Taht Kurdun', aciklama: '5 dönem boyunca iktidarda kal.' },
    dengeli: { ikon: '⚖️', ad: 'Altın Denge', aciklama: 'Dört göstergeyi aynı anda 65 ve üstüne çıkar.' },
    sevilen: { ikon: '❤️', ad: 'Halkın Kahramanı', aciklama: 'Halk desteğini 90\'a çıkar.' },
    zengin: { ikon: '💎', ad: 'Dolu Kasa', aciklama: 'Hazineyi 90\'a çıkar.' },
    heyelan: { ikon: '🌊', ad: 'Heyelan Zafer', aciklama: 'Bir seçimi %70 ve üstüyle kazan.' },
    kil_payi: { ikon: '😅', ad: 'Kıl Payı', aciklama: 'Bir seçimi %52\'nin altında kazan.' },
    sozunu_tutan: { ikon: '🤝', ad: 'Sözünün Eri', aciklama: 'Bir dönem sözünü yerine getir.' },
    sadik_kabine: { ikon: '👔', ad: 'Sadık Kabine', aciklama: 'Üç bakanın sadakatini aynı anda 80\'e çıkar.' },
    zor_ulke: { ikon: '⛰️', ad: 'İmkânsızı Başardın', aciklama: '5 yıldız zorluktaki bir ülkede seçim kazan.' },
    mevsimlik: { ikon: '🍂', ad: 'Mevsimlik Başkan', aciklama: 'Bir yıl dolmadan görevden düş.' },
    kara_altin: { ikon: '🛢️', ad: 'Kara Altın', aciklama: 'Petrol bul.' },
    uzay: { ikon: '🚀', ad: 'Uzay Çağı', aciklama: 'Uzay programı başlat.' },
    temiz: { ikon: '🕊️', ad: 'Tertemiz Sicil', aciklama: 'Sansür, sert yönetim, yolsuzluk ve hile olmadan iki dönemi tamamla.' },
    darbe: { ikon: '🎖️', ad: 'Tanklar Kapıda', aciklama: 'Ordunu o kadar büyüt ki darbe yapsın.' }
  };

  // Basit tohumlu rastgele sayı üreteci (kayıtlar tutarlı kalsın)
  function rng(s) {
    s.tohum = (s.tohum * 1664525 + 1013904223) >>> 0;
    return s.tohum / 4294967296;
  }
  const sec = (s, dizi) => dizi[Math.floor(rng(s) * dizi.length)];
  const sinirla = v => Math.max(0, Math.min(100, Math.round(v)));

  function ulke(s) { return V().ULKELER[s.kod]; }

  function isimHavuzu(u) { return ISIMLER[u.kod === 'TR' ? 'TR' : u.bolge] || ISIMLER.AV; }
  function yeniBakan(s, haric) {
    const kullanilan = Object.values(s.kabine || {}).map(b => b.ad).concat(haric || []);
    const havuz = isimHavuzu(ulke(s)).filter(a => !kullanilan.includes(a));
    return { ad: sec(s, havuz.length ? havuz : isimHavuzu(ulke(s))), sadakat: 55 };
  }
  function kabineKur(s) {
    s.kabine = {};
    Object.keys(BAKANLIKLAR).forEach(k => { s.kabine[k] = yeniBakan(s); s.kabine[k].sadakat = 50; });
  }

  function yeniOyun(kod, tohum) {
    const u = V().ULKELER[kod];
    if (!u) throw new Error('Ülke yok: ' + kod);
    const s = {
      surum: KAYIT_SURUMU, kod, tur: 0, donem: 1, tohum: (tohum || Date.now()) >>> 0,
      stat: {
        h: 55,
        z: 30 + u.zenginlik * 7,
        o: 26 + u.askeri * 7,
        d: 50
      },
      bayrak: {}, kuyruk: [], kullanilan: {}, gecmis: [], rakip: null, bitti: null,
      aktif: null, erkenSecim: false, kararSayisi: 0, donemSonuTur: DONEM_TUR - 1,
      kabine: null, vaat: null, iz: [], rozet: {}, secimler: []
    };
    // Tarihi rakip: komşulardan biri (yoksa bir büyük güç)
    s.rakip = u.komsular.length ? sec(s, u.komsular) : null;
    kabineKur(s);
    s.iz.push(STATLAR.map(k => s.stat[k]));
    s.vaatBekliyor = true;
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
    if (b.bakanK && s.kabine && s.kabine[b.bakanK]) {
      b.bakan = s.kabine[b.bakanK].ad;
      b.bakanlik = BAKANLIKLAR[b.bakanK].ad;
    }
    return b;
  }
  function doldur(metin, b) {
    return String(metin).replace(/\{(\w+)\}/g, (m, k) => (b[k] !== undefined ? b[k] : m));
  }

  const O = (t, fx, so, ek) => Object.assign({ t, fx, s: so }, ek || {});
  function vaatOlayi(s) {
    const ids = (s.aktif && s.aktif.vaatlar) || ['hazine', 'halk', 'dunya'];
    return {
      id: 'vaat', ozel: true, kat: 'Dönem Sözü', ikon: '🎯',
      baslik: s.donem === 1 ? 'Göreve Başlarken Bir Söz' : s.donem + '. Dönemin Sözü',
      metin: 'Yemin töreninden sonra kameralar sana döndü. Bu dönem halka ne söz vereceksin? Sözünü tutarsan seçimde ödüllendirilirsin, tutamazsan hesabı sorulur.',
      sec: ids.map(v => O(VAATLER[v].t, { h: 2 }, VAATLER[v].s, { vaat: v }))
    };
  }

  function olayBul(id, s) {
    if (id === 'secim') return V().SECIM;
    if (id === 'vaat') return vaatOlayi(s);
    return V().OLAYLAR.find(o => o.id === id);
  }

  function agirlikliSec(s, havuz) {
    const top = havuz.reduce((a, o) => a + (o.agirlik || 1), 0);
    let r = rng(s) * top;
    for (const o of havuz) { r -= (o.agirlik || 1); if (r < 0) return o; }
    return havuz[havuz.length - 1];
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
    // 2) Yeni dönemin sözü
    if (s.vaatBekliyor) {
      s.vaatBekliyor = false;
      const hepsi = Object.keys(VAATLER);
      const secilen = [];
      while (secilen.length < 3) { const v = sec(s, hepsi); if (!secilen.includes(v)) secilen.push(v); }
      s.aktif = { id: 'vaat', b: baglamOlustur(s), vaatlar: secilen };
      return;
    }
    // 3) Zamanı gelen takip olayı
    const i = s.kuyruk.findIndex(k => k.tur <= s.tur);
    if (i >= 0) {
      const k = s.kuyruk.splice(i, 1)[0];
      s.aktif = { id: k.id, b: baglamOlustur(s, k.b) };
      s.kullanilan[k.id] = s.tur;
      return;
    }
    const uygun = o => !o.takip && !o.ozel && (!o.kosul || o.kosul(s, u)) &&
      !(o.tek && s.kullanilan[o.id] !== undefined) &&
      (s.kullanilan[o.id] === undefined || s.tur - s.kullanilan[o.id] >= BEKLEME);
    // 4) Kriz olayları (en fazla her 3 turda bir)
    if (s.sonKriz === undefined || s.tur - s.sonKriz >= 3) {
      const krizler = V().OLAYLAR.filter(o => o.kriz && uygun(o));
      if (krizler.length) {
        const o = sec(s, krizler);
        s.sonKriz = s.tur;
        s.kullanilan[o.id] = s.tur;
        if (s.vaat) s.vaat.kriz = (s.vaat.kriz || 0) + 1;
        s.aktif = { id: o.id, b: baglamOlustur(s) };
        return;
      }
    }
    // 5) Normal havuz (ağırlıklı: geçmiş kararlarına bağlı olaylar daha sık çıkar)
    let havuz = V().OLAYLAR.filter(o => !o.kriz && uygun(o));
    if (!havuz.length) havuz = V().OLAYLAR.filter(o => !o.kriz && !o.takip && !o.ozel && !o.tek && (!o.kosul || o.kosul(s, u)));
    // Son 2 olayın kategorisini tekrar etmemeye çalış
    const sonKat = s.gecmis.slice(-2).map(g => g.kat);
    const cesitli = havuz.filter(o => !sonKat.includes(o.kat));
    const o = agirlikliSec(s, cesitli.length ? cesitli : havuz);
    s.kullanilan[o.id] = s.tur;
    s.aktif = { id: o.id, b: baglamOlustur(s) };
  }

  // Bir seçeneğin beklenen etkisi (riskliyse başarı şansıyla ağırlıklı)
  function beklenenEtki(s, x) {
    const iyi = efektHesapla(s, x.fx || {});
    if (!x.risk) return iyi;
    const p = basariSansi(s, x.risk.stat);
    const kotu = efektHesapla(s, x.risk.fxKotu || {});
    const r = {}; STATLAR.forEach(k => { r[k] = p * iyi[k] + (1 - p) * kotu[k]; });
    return r;
  }

  // Bakanların önerileri: { z: 1, o: 0, d: 2 } (seçenek indeksleri)
  function oneriler(s) {
    const r = {};
    if (!s.aktif || !s.kabine) return r;
    const o = olayBul(s.aktif.id, s);
    if (!o || o.ozel) return r;
    const etkiler = o.sec.map(x => beklenenEtki(s, x));
    Object.keys(BAKANLIKLAR).forEach(k => {
      let en = -1, enV = -1e9, tum = new Set();
      etkiler.forEach((e, i) => {
        let v = e[k];
        // Savunma bakanı bile darbeyi istemez
        if (k === 'o' && s.stat.o + v >= 95) v = -v;
        tum.add(Math.round(v));
        if (v > enV) { enV = v; en = i; }
      });
      if (tum.size > 1 && enV > 0) r[k] = en;
    });
    return r;
  }

  // Aktif olayı ekranda gösterilecek hâle getir
  function aktifOlay(s) {
    if (!s.aktif) return null;
    const o = olayBul(s.aktif.id, s);
    const b = s.aktif.b;
    const on = oneriler(s);
    return {
      id: o.id, kat: o.kat, ikon: o.ikon, baslik: doldur(o.baslik, b), metin: doldur(o.metin, b),
      secenekler: o.sec.map((x, i) => ({
        t: doldur(x.t, b), ipucu: ipucu(s, x), riskli: !!x.risk,
        sans: x.risk ? basariSansi(s, x.risk.stat) : null,
        oneren: Object.keys(on).filter(k => on[k] === i)
      }))
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
    const fakirlik = [1.15, 1.1, 1, 0.92, 0.85][u.zenginlik - 1];
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
    // Sadık bakan işini iyi yapar
    if (s.kabine && s.kabine[stat] && s.kabine[stat].sadakat >= 70) p += 0.06;
    return Math.max(0.1, Math.min(0.92, p));
  }

  // Bakanların sadakati: önerisi dinlenirse artar, alanına zarar veren karar alınırsa düşer
  function sadakatGuncelle(s, on, indeks, etkiler) {
    Object.keys(on).forEach(k => {
      const b = s.kabine[k];
      if (on[k] === indeks) b.sadakat = sinirla(b.sadakat + 4);
      else if (etkiler[indeks][k] < 0) b.sadakat = sinirla(b.sadakat - 6);
      else b.sadakat = sinirla(b.sadakat - 2);
    });
    // Sadakati dibe vuran bakan istifa mektubunu getirir
    Object.keys(s.kabine).forEach(k => {
      const b = s.kabine[k];
      if (b.sadakat <= 15 && !b.uyardi && !s.kuyruk.some(q => q.id === 'bakan_istifa')) {
        b.uyardi = true;
        s.kuyruk.push({ id: 'bakan_istifa', tur: s.tur + 1, b: { bakanK: k } });
      }
    });
  }

  // Seçim yap: sonuç nesnesi döndürür
  function secimYap(s, indeks) {
    if (s.bitti || !s.aktif) return null;
    const o = olayBul(s.aktif.id, s);
    const x = o.sec[indeks];
    if (!x) return null;
    const b = s.aktif.b;
    const once = Object.assign({}, s.stat);
    let metin = x.s;
    let basarili = true;

    if (o.id === 'secim') return secimSonucu(s, x, once);

    const on = oneriler(s);
    const etkiler = o.sec.map(y => beklenenEtki(s, y));

    let fx = x.fx || {};
    if (x.risk) {
      basarili = rng(s) < basariSansi(s, x.risk.stat);
      if (!basarili) { fx = x.risk.fxKotu || {}; metin = x.risk.sKotu; }
    }
    const e = efektHesapla(s, fx);
    STATLAR.forEach(k => { s.stat[k] = sinirla(s.stat[k] + e[k]); });
    if (x.bayrak && basarili) s.bayrak[x.bayrak] = true;
    if (x.vaat) s.vaat = { id: x.vaat, donem: s.donem, kriz: 0, ihlal: false };
    if (x.sonuc && basarili) x.sonuc(s);
    if (x.sonucKotu && !basarili) x.sonucKotu(s);
    const takipler = basarili ? (x.sonra || []) : (x.risk && x.risk.sonraKotu) || [];
    takipler.forEach(t => s.kuyruk.push({ id: t.id, tur: s.tur + t.tur, b: { komsu: b.komsu, guc: b.guc } }));

    // Kimin önerisini dinledin?
    const dinlenen = Object.keys(on).filter(k => on[k] === indeks);
    if (s.kabine) sadakatGuncelle(s, on, indeks, etkiler);

    s.kararSayisi++;
    s.gecmis.push({ tur: s.tur, id: o.id, kat: o.kat, baslik: doldur(o.baslik, b), secim: doldur(x.t, b), basarili });
    if (s.gecmis.length > 60) s.gecmis.shift();

    const sonuc = { metin: doldur(metin, b), basarili, riskli: !!x.risk, degisim: fark(once, s.stat), dinlenen };
    ilerle(s);
    sonuc.bitti = s.bitti;
    sonuc.yeniRozet = s.yeniRozet || [];
    s.yeniRozet = [];
    return sonuc;
  }

  function fark(once, simdi) {
    const r = {}; STATLAR.forEach(k => { r[k] = simdi[k] - once[k]; }); return r;
  }

  // Seçim: oy oranı kalemlere ayrılır (oyuncu neden kazandığını/kaybettiğini görür)
  function oyDokumu(s, kampanya) {
    const st = s.stat;
    const d = [];
    d.push(['Sadık seçmen tabanı', 18]);
    d.push(['Halk desteği', st.h * 0.5]);
    d.push(['Ekonomi', st.z * 0.1]);
    d.push(['Dünyadaki itibar', st.d * 0.06]);
    d.push(['Güvenlik', st.o * 0.04]);
    if (kampanya === 'vaat') d.push(['Vaat yağmuru', 7]);
    if (kampanya === 'durust') d.push(['Dürüst kampanya', 1]);
    if (kampanya === 'hile') d.push(['Sandık hilesi', 15]);
    if (s.vaat && s.vaat.donem === s.donem) {
      const tuttu = VAATLER[s.vaat.id].kontrol(s);
      d.push([tuttu ? 'Sözünü tuttun' : 'Sözünü tutamadın', tuttu ? 6 : -5]);
    }
    if (s.kabine) {
      const ort = Object.values(s.kabine).reduce((a, b) => a + b.sadakat, 0) / 3;
      const v = Math.round((ort - 50) * 0.06 * 10) / 10;
      if (v) d.push(['Kabine uyumu', v]);
    }
    if (s.bayrak.yolsuz) d.push(['Yolsuzluk skandalı', -3]);
    if (s.bayrak.sansur) d.push(['Basına güvensizlik', -2]);
    if (s.bayrak.sert_yonetim) d.push(['Sert yönetim tepkisi', -2]);
    const gurur = ['olimpiyat', 'uzay', 'yerli_otomobil', 'yerli_savunma'].filter(f => s.bayrak[f]).length;
    if (gurur) d.push(['Gurur projeleri', Math.min(3, gurur * 1.5)]);
    if (s.donem > 1) d.push(['İktidar yorgunluğu', -(s.donem - 1) * 3]);
    return d;
  }

  function secimSonucu(s, x, once) {
    const b = s.aktif.b;
    let metin = x.s;
    if (x.secim === 'vaat') s.stat.z = sinirla(s.stat.z + efektHesapla(s, x.fx).z);
    if (x.secim === 'durust') s.stat.d = sinirla(s.stat.d + 3);
    const dokum = oyDokumu(s, x.secim);
    const sans = Math.round((rng(s) * 12 - 6) * 10) / 10;
    dokum.push(['Seçim günü sürprizleri', sans]);
    let oy = dokum.reduce((a, k) => a + k[1], 0);
    let hileYakalandi = false;
    if (x.secim === 'hile') {
      hileYakalandi = rng(s) < 0.35;
      s.stat.d = sinirla(s.stat.d - 12);
      s.bayrak.hile = true;
      if (hileYakalandi) { s.stat.h = sinirla(s.stat.h - 25); metin += ' Ama bir sandık görevlisi her şeyi kameraya çekti!'; }
    }
    oy = Math.max(5, Math.min(95, Math.round(oy * 10) / 10));
    const kazandi = oy >= 50 && !(hileYakalandi && s.stat.h <= 0);
    s.gecmis.push({ tur: s.tur, id: 'secim', kat: 'Seçim', baslik: 'Seçim', secim: x.t, basarili: kazandi });
    s.secimler.push({ tur: s.tur, oy, kazandi });
    s.kararSayisi++;
    const vaatSonuc = s.vaat && s.vaat.donem === s.donem ? { kisa: VAATLER[s.vaat.id].kisa, tuttu: VAATLER[s.vaat.id].kontrol(s) } : null;
    const sonuc = {
      metin: doldur(metin, b), secim: true, oy, kazandi, degisim: fark(once, s.stat),
      dokum: dokum.map(([ad, v]) => ({ ad, v: Math.round(v * 10) / 10 })), vaat: vaatSonuc
    };
    if (kazandi) {
      rozetVer(s, 'ilk_secim');
      if (oy >= 70) rozetVer(s, 'heyelan');
      if (oy < 52) rozetVer(s, 'kil_payi');
      if (zorluk(s.kod) === 5) rozetVer(s, 'zor_ulke');
    }
    if (vaatSonuc && vaatSonuc.tuttu) rozetVer(s, 'sozunu_tutan');
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
      s.vaatBekliyor = true;
      izEkle(s);
      bitisKontrol(s);
      sonrakiOlay(s);
    } else bitisRozetleri(s);
    sonuc.bitti = s.bitti;
    sonuc.yeniRozet = s.yeniRozet || [];
    s.yeniRozet = [];
    return sonuc;
  }

  function rozetVer(s, id) {
    if (!s.rozet) s.rozet = {};
    if (s.rozet[id]) return;
    s.rozet[id] = true;
    (s.yeniRozet = s.yeniRozet || []).push(id);
  }
  function anlikRozetler(s) {
    const st = s.stat;
    if (STATLAR.every(k => st[k] >= 65)) rozetVer(s, 'dengeli');
    if (st.h >= 90) rozetVer(s, 'sevilen');
    if (st.z >= 90) rozetVer(s, 'zengin');
    if (s.kabine && Object.values(s.kabine).every(b => b.sadakat >= 80)) rozetVer(s, 'sadik_kabine');
    if (s.bayrak.petrol) rozetVer(s, 'kara_altin');
    if (s.bayrak.uzay) rozetVer(s, 'uzay');
  }
  function bitisRozetleri(s) {
    if (!s.bitti) return;
    const t = s.bitti.tip;
    if (t === 'emeklilik') {
      rozetVer(s, 'efsane');
      if (!['sansur', 'sert_yonetim', 'yolsuz', 'hile'].some(f => s.bayrak[f])) rozetVer(s, 'temiz');
    }
    if (t === 'omur_boyu') rozetVer(s, 'omur');
    if (t === 'o100') rozetVer(s, 'darbe');
    if (s.tur < 6 && t !== 'istifa') rozetVer(s, 'mevsimlik');
  }

  function bitisKontrol(s) {
    if (s.bitti) return;
    if (s.stat.h <= 0) s.bitti = { tip: 'h0' };
    else if (s.stat.z <= 0) s.bitti = { tip: 'z0' };
    else if (s.stat.o <= 0) s.bitti = { tip: 'o0' };
    else if (s.stat.d <= 0) s.bitti = { tip: 'd0' };
    else if (s.stat.o >= 100) s.bitti = { tip: 'o100' };
    if (s.bitti) bitisRozetleri(s);
  }

  function izEkle(s) {
    if (!s.iz) s.iz = [];
    s.iz.push(STATLAR.map(k => s.stat[k]));
    if (s.iz.length > 200) s.iz.shift();
  }

  function ilerle(s) {
    const u = ulke(s);
    // Pasif ekonomi: zengin ülkeler vergiyle büyür, fakir ülkeler dış yardımla ayakta kalır
    if (s.tur % 3 === 2) {
      let gelir = u.zenginlik - 3;
      if (u.zenginlik <= 2 && s.stat.d >= 35) gelir = 1;        // uluslararası yardım
      else if (u.zenginlik <= 2) gelir = 0;
      s.stat.z = sinirla(s.stat.z + Math.max(-1, Math.min(2, gelir)));
    }
    // İktidar yıpranması: halk desteği zamanla azalır
    if (s.tur % 3 === 1) s.stat.h = sinirla(s.stat.h - 1);
    if (s.stat.h > 80 && s.tur % 2 === 1) s.stat.h = sinirla(s.stat.h - 1);
    // Söz takibi: "denge" sözü bir kez bozulursa geri gelmez
    if (s.vaat && s.vaat.donem === s.donem && STATLAR.some(k => s.stat[k] < 30)) s.vaat.ihlal = true;
    anlikRozetler(s);
    bitisKontrol(s);
    s.tur++;
    izEkle(s);
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
    emeklilik: { ikon: '🏆', baslik: 'Efsane Başkan', metin: 'İki dönemi başarıyla tamamladın ve anayasaya saygı göstererek görevi devrettin. Adın okul kitaplarına yazılacak.' },
    istifa: { ikon: '🚪', baslik: 'İstifa Ettin', metin: 'Görevini kendi isteğinle bıraktın. Belki bir gün geri dönersin.' }
  };

  // Başkanlığın tarihe geçeceği unvan
  function miras(s) {
    const iz = s.iz && s.iz.length ? s.iz : [STATLAR.map(k => s.stat[k])];
    const ort = STATLAR.map((k, i) => iz.reduce((a, r) => a + r[i], 0) / iz.length);
    const [h, z, o, d] = ort;
    const t = s.bitti && s.bitti.tip;
    const B = s.bayrak;
    if (B.hile) return { unvan: 'Sandık Sihirbazı', aciklama: 'Seçim sonuçlarını sandıktan önce bilen başkan olarak anılacaksın.' };
    if (B.sansur && B.sert_yonetim) return { unvan: 'Demir Yumruk', aciklama: 'Düzeni sağladın ama sessizliğin bedeli ağırdı.' };
    if (t === 'omur_boyu') return { unvan: 'Ebedi Lider', aciklama: 'Bir neslin tanıdığı tek başkan sendin.' };
    if (s.tur < 6) return { unvan: 'Mevsimlik Başkan', aciklama: 'Adını öğrenmeye fırsat bulamadılar.' };
    if (B.uzay && B.cevreci) return { unvan: 'Geleceğin Mimarı', aciklama: 'Hem gökyüzüne hem doğaya yatırım yaptın.' };
    if (B.cevreci) return { unvan: 'Yeşil Başkan', aciklama: 'Ormanlar ve nehirler senin döneminde nefes aldı.' };
    if (h >= 62) return { unvan: 'Halkın Sevgilisi', aciklama: 'Meydanlarda adın hâlâ sevgiyle anılıyor.' };
    if (z >= 65) return { unvan: 'Hazinenin Bekçisi', aciklama: 'Kasayı hep dolu tuttun; bazıları seni cimri buldu.' };
    if (d >= 65) return { unvan: 'Barış Elçisi', aciklama: 'Dünya başkentlerinde kapılar sana hep açıktı.' };
    if (o >= 70) return { unvan: 'Generallerin Başkanı', aciklama: 'Askeri geçit törenleri döneminin simgesiydi.' };
    if (B.uzay) return { unvan: 'Yıldızlara Uzanan', aciklama: 'Ülkeni uzay çağına taşıdın.' };
    if (h < 35) return { unvan: 'Sevilmeyen Başkan', aciklama: 'Kararların doğru muydu, tarih karar verecek.' };
    return { unvan: 'Sessiz Yönetici', aciklama: 'Büyük fırtınalar koparmadan ülkeyi yönettin.' };
  }

  function sonBilgisi(s) {
    if (!s.bitti) return null;
    const so = SONLAR[s.bitti.tip];
    const b = { rakip: s.rakip ? V().ULKELER[s.rakip].ad : 'Komşu ülke', ulke: ulke(s).ad };
    const ay = s.tur * TUR_AY;
    return {
      tip: s.bitti.tip, ikon: so.ikon, baslik: so.baslik, metin: doldur(so.metin, b),
      oy: s.bitti.oy, sure: Math.floor(ay / 12) + ' yıl ' + (ay % 12) + ' ay',
      puan: puan(s), kararSayisi: s.kararSayisi, miras: miras(s),
      rozetler: Object.keys(s.rozet || {}), iz: s.iz || [], secimler: s.secimler || []
    };
  }

  function puan(s) {
    const st = s.stat;
    let p = s.tur * 10 + Math.round((st.h + st.z + st.o + st.d) / 4) * 2;
    if (s.bitti && s.bitti.tip === 'emeklilik') p += 300;
    if (s.bitti && s.bitti.tip === 'omur_boyu') p += 150;
    if (s.bayrak.hile) p -= 50;
    p += Object.keys(s.rozet || {}).length * 15;
    return Math.max(0, p);
  }

  function istifa(s) {
    if (!s || s.bitti) return;
    s.bitti = { tip: 'istifa' };
    s.istifa = true;
  }

  // Dönem sözünün anlık durumu (arayüz için)
  function vaatDurumu(s) {
    if (!s.vaat || s.vaat.donem !== s.donem) return null;
    const v = VAATLER[s.vaat.id];
    return { id: s.vaat.id, kisa: v.kisa, tutuyor: v.kontrol(s), deger: v.deger(s) };
  }

  function kayitYukle(veri) {
    if (!veri || typeof veri !== 'object') return null;
    if (!veri.surum || !veri.kod || !V().ULKELER[veri.kod]) return null;
    // Sürüm 1 → 2: kabine, dönem sözü, gösterge izi ve rozetler eklendi
    if (veri.surum < 2) {
      if (!veri.kabine) kabineKur(veri);
      veri.vaat = veri.vaat || null;
      veri.iz = veri.iz || [STATLAR.map(k => veri.stat[k])];
      veri.rozet = veri.rozet || {};
      veri.secimler = veri.secimler || [];
      if (veri.bitti && veri.istifa) veri.bitti.tip = 'istifa';
    }
    veri.surum = KAYIT_SURUMU;
    return veri;
  }

  G.MOTOR = {
    yeniOyun, aktifOlay, secimYap, tarihMetni, sonBilgisi, zorluk, kayitYukle, basariSansi, ulke,
    olayBul, oneriler, yeniBakan, vaatDurumu, istifa, miras, puan,
    STATLAR, STAT_AD, DONEM_TUR, KAYIT_SURUMU, BAKANLIKLAR, ROZETLER, SONLAR, VAATLER
  };
})(typeof window !== 'undefined' ? window : globalThis);
