// ARAYÜZ — ekranlar, dokunmatik etkileşim, kayıt
(function () {
  const { VERI, MOTOR } = window;
  const $ = id => document.getElementById(id);
  const KAYIT = 'baskan_kayit_v1';
  const REKOR = 'baskan_rekor_v1';
  const PROFIL = 'baskan_profil_v1';   // başarımlar, görülen sonlar, ülke rekorları
  const STAT_IKON = { h: '👥', z: '💰', o: '🪖', d: '🌐' };
  const STAT_RENK = { h: 'var(--h)', z: 'var(--z)', o: 'var(--o)', d: 'var(--d)' };
  const STAT_HEX = { h: '#5aa9ff', z: '#e8b54a', o: '#8bc34a', d: '#b48cff' };

  let s = null;          // oyun durumu
  let bolge = 'HEPSI';
  let bekleyenSon = false;

  // ───── Güvenli depolama ─────
  const depo = {
    al(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    koy(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* önemli değil */ } },
    sil(k) { try { localStorage.removeItem(k); } catch (e) { /* */ } }
  };
  const kaydet = () => { if (s && !s.bitti) depo.koy(KAYIT, s); else depo.sil(KAYIT); };
  function profil() {
    const p = depo.al(PROFIL) || {};
    p.rozet = p.rozet || {}; p.sonlar = p.sonlar || {}; p.ulkeRekor = p.ulkeRekor || {}; p.bolgeler = p.bolgeler || {};
    p.oyun = p.oyun || 0;
    return p;
  }

  function ekran(ad) {
    document.querySelectorAll('.ekran').forEach(e => e.classList.remove('aktif'));
    $('ekran-' + ad).classList.add('aktif');
  }
  const kac = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ───── Giriş ─────
  function girisGoster() {
    const k = MOTOR.kayitYukle(depo.al(KAYIT));
    $('btn-devam').classList.toggle('gizli', !k);
    if (k) $('btn-devam').textContent = '▶ Devam Et — ' + VERI.ULKELER[k.kod].bayrak + ' ' + VERI.ULKELER[k.kod].ad;
    const r = depo.al(REKOR);
    const p = profil();
    const rz = Object.keys(p.rozet).length, toplam = Object.keys(MOTOR.ROZETLER).length;
    $('rekor').innerHTML = (r ? `🏆 Rekor: ${r.puan} puan (${r.bayrak} ${kac(r.ulke)})<br>` : '') +
      (p.oyun ? `🏅 ${rz}/${toplam} başarım · 📖 ${Object.keys(p.sonlar).length}/${Object.keys(MOTOR.SONLAR).length} son` : '');
    ekran('giris');
  }

  // ───── Ülke seçimi ─────
  function bolgeleriCiz() {
    const kutu = $('bolgeler');
    const liste = [['HEPSI', 'Hepsi'], ...Object.entries(VERI.BOLGELER)];
    kutu.innerHTML = liste.map(([k, ad]) => `<button class="cip${k === bolge ? ' secili' : ''}" data-b="${k}">${ad}</button>`).join('');
  }
  function ulkeleriCiz() {
    const q = $('arama').value.trim().toLocaleLowerCase('tr');
    const ur = profil().ulkeRekor;
    const liste = Object.values(VERI.ULKELER)
      .filter(u => (bolge === 'HEPSI' || u.bolge === bolge) && (!q || u.ad.toLocaleLowerCase('tr').includes(q)))
      .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
    $('ulke-sayisi').textContent = liste.length + ' ülke';
    $('ulke-listesi').innerHTML = liste.map(u => {
      const z = MOTOR.zorluk(u.kod);
      const rek = ur[u.kod];
      return `<button class="ulke-satir" data-kod="${u.kod}">
        <span class="bayrak">${u.bayrak}</span>
        <span><div class="ad">${kac(u.ad)}</div><div class="bolge">${VERI.BOLGELER[u.bolge]} · ${nufusYaz(u.nufus)}${rek ? ` · 🏆 ${rek.puan}` : ''}</div></span>
        <span class="zorluk">Zorluk<br><span class="yildiz">${'★'.repeat(z)}${'☆'.repeat(5 - z)}</span></span>
      </button>`;
    }).join('') || '<p style="color:var(--soluk);text-align:center">Ülke bulunamadı.</p>';
  }
  function nufusYaz(n) {
    if (n >= 1) return (n >= 100 ? Math.round(n) : n.toLocaleString('tr-TR', { maximumFractionDigits: 1 })) + ' milyon';
    return Math.round(n * 1000).toLocaleString('tr-TR') + ' bin';
  }
  function ulkeOnay(kod) {
    const u = VERI.ULKELER[kod];
    const ornek = MOTOR.yeniOyun(kod, 1);
    const z = MOTOR.zorluk(kod);
    const kom = u.komsular.slice(0, 4).map(k => VERI.ULKELER[k].bayrak).join(' ');
    const rek = profil().ulkeRekor[kod];
    pencereAc(`<div class="secim-onay">
      <div class="buyuk-bayrak">${u.bayrak}</div>
      <h3>${kac(u.ad)}</h3>
      <p style="text-align:center;color:var(--soluk);margin:0">${VERI.BOLGELER[u.bolge]} · ${nufusYaz(u.nufus)} · <span class="yildiz">${'★'.repeat(z)}${'☆'.repeat(5 - z)}</span></p>
      <div class="ozet">
        ${MOTOR.STATLAR.map(k => `<div>${STAT_IKON[k]} ${MOTOR.STAT_AD[k]} <b>${ornek.stat[k]}</b></div>`).join('')}
      </div>
      ${kom ? `<p style="font-size:14px;text-align:center">Komşular: ${kom}</p>` : ''}
      ${rek ? `<p style="font-size:14px;text-align:center;color:var(--altin2)">🏆 Bu ülkedeki rekorun: ${rek.puan} puan · ${kac(rek.unvan || '')}</p>` : ''}
      <button class="btn ana" id="btn-basla">Göreve Başla</button>
    </div>`);
    $('btn-basla').onclick = () => { pencereKapat(); oyunaBasla(kod); };
  }

  // ───── Oyun ─────
  function oyunaBasla(kod) {
    s = MOTOR.yeniOyun(kod);
    kaydet();
    oyunEkrani();
  }
  function oyunEkrani() {
    const u = VERI.ULKELER[s.kod];
    $('o-bayrak').textContent = u.bayrak;
    $('o-ulke').textContent = u.ad;
    ekran('oyun');
    statlariCiz();
    olayiGoster();
  }
  function statlariCiz(degisim) {
    $('statlar').innerHTML = MOTOR.STATLAR.map(k => {
      const v = s.stat[k];
      const tehlike = v <= 20 || (k === 'o' && v >= 85);
      const d = degisim && degisim[k];
      return `<div class="stat${tehlike ? ' tehlike' : ''}">
        <div class="ikon">${STAT_IKON[k]}</div>
        <div class="deger">${v}</div>
        <div class="ad">${MOTOR.STAT_AD[k]}</div>
        <div class="cubuk"><div class="dolu" style="width:${v}%;background:${STAT_RENK[k]}"></div></div>
        ${d ? `<span class="ucan ${d > 0 ? 'arti' : 'eksi'}">${d > 0 ? '+' : ''}${d}</span>` : ''}
      </div>`;
    }).join('');
    $('o-tarih').textContent = MOTOR.tarihMetni(s) + ' · ' + s.donem + '. dönem';
    const bas = s.donemSonuTur - MOTOR.DONEM_TUR + 1;
    const ilerleme = Math.min(1, (s.tur - bas + 1) / MOTOR.DONEM_TUR);
    $('donem-dolu').style.width = (ilerleme * 100) + '%';
    const kalan = Math.max(0, s.donemSonuTur - s.tur);
    $('donem-yazi').textContent = kalan ? `Seçime ${kalan * 2} ay` : 'Seçim zamanı!';
    // Dönem sözü
    const v = MOTOR.vaatDurumu(s);
    const c = $('vaat-cip');
    c.classList.toggle('gizli', !v);
    if (v) {
      c.className = 'vaat-cip ' + (v.tutuyor ? 'iyi' : 'kotu');
      c.innerHTML = `🎯 <b>Söz:</b> ${kac(v.kisa)} <span>${v.tutuyor ? '✔ tutuyor' : '✖ tutmuyor'}</span>`;
    }
  }
  function olayiGoster() {
    const o = MOTOR.aktifOlay(s);
    $('sonuc-kart').classList.add('gizli');
    $('olay-kart').classList.remove('gizli');
    $('olay-kart').style.animation = 'none'; void $('olay-kart').offsetWidth; $('olay-kart').style.animation = '';
    $('olay-kart').classList.toggle('ozel-kart', o.id === 'vaat' || o.id === 'bakan_istifa');
    $('olay-kat').textContent = o.kat;
    $('olay-ikon').textContent = o.ikon;
    $('olay-baslik').textContent = o.baslik;
    $('olay-metin').textContent = o.metin;
    $('secenekler').innerHTML = o.secenekler.map((x, i) => {
      const noktalar = Object.entries(x.ipucu).map(([k, b]) => `<span class="nokta n${b}">${STAT_IKON[k]}<i></i></span>`).join('');
      let risk = '';
      if (x.riskli) risk = `<span class="risk">🎲 Başarı şansı %${Math.round(x.sans * 100)}</span>`;
      if (o.id === 'secim' && i === 2) risk = '<span class="risk">🎲 Yakalanma riski var</span>';
      const oneri = x.oneren.map(k => `<span class="oneri" title="${MOTOR.BAKANLIKLAR[k].ad} Bakanı önerir">${MOTOR.BAKANLIKLAR[k].ikon}</span>`).join('');
      return `<button class="secenek" data-i="${i}">
        <span class="harf">${'ABC'[i]}</span><span class="yazi">${kac(x.t)}</span>
        ${noktalar || risk || oneri ? `<div class="ipucu">${noktalar}${risk}${oneri ? `<span class="oneriler">${oneri}</span>` : ''}</div>` : ''}
      </button>`;
    }).join('');
    $('secenekler').classList.remove('gizli');
    document.querySelector('.sahne').scrollTop = 0;
  }
  function sec(i) {
    const r = MOTOR.secimYap(s, i);
    if (!r) return;
    titret(r.basarili === false || r.kazandi === false ? [60, 40, 60] : 20);
    $('secenekler').classList.add('gizli');
    $('olay-kart').classList.add('gizli');
    const k = $('sonuc-kart');
    k.classList.remove('gizli');
    k.style.animation = 'none'; void k.offsetWidth; k.style.animation = '';
    let html = '';
    if (r.riskli) html += `<b class="${r.basarili ? 'arti' : 'basarisiz'}">${r.basarili ? '✔ Başardın!' : '✖ Ters gitti!'}</b><br>`;
    html += kac(r.metin);
    if (r.dinlenen && r.dinlenen.length) {
      html += `<div class="kabine-not">${r.dinlenen.map(k => `${MOTOR.BAKANLIKLAR[k].ikon} ${kac(s.kabine[k].ad)}`).join(', ')} önerisinin dinlenmesinden memnun.</div>`;
    }
    if (r.secim) {
      html += `<div class="oy-sonuc ${r.kazandi ? 'arti' : 'eksi'}">%${r.oy.toLocaleString('tr-TR')}</div>
        <div class="oy-cubuk"><div id="oy-dolu"></div></div>
        <p style="text-align:center;font-weight:700">${r.kazandi ? '🎉 Seçimi kazandın! Yeni dönem başlıyor.' : 'Seçimi kaybettin.'}</p>
        ${r.vaat ? `<p class="vaat-sonuc ${r.vaat.tuttu ? 'arti' : 'eksi'}">🎯 ${kac(r.vaat.kisa)}: ${r.vaat.tuttu ? 'Sözünü tuttun!' : 'Sözünü tutamadın.'}</p>` : ''}
        <details class="dokum" open><summary>Oylar nereden geldi?</summary>
        ${r.dokum.map(d => `<div class="dokum-satir"><span>${kac(d.ad)}</span><b class="${d.v >= 0 ? 'arti' : 'eksi'}">${d.v > 0 ? '+' : ''}${d.v.toLocaleString('tr-TR')}</b></div>`).join('')}
        </details>`;
    }
    $('sonuc-metin').innerHTML = html;
    if (r.secim) setTimeout(() => { const d = $('oy-dolu'); if (d) d.style.width = r.oy + '%'; }, 50);
    $('sonuc-degisim').innerHTML = MOTOR.STATLAR.filter(x => r.degisim[x]).map(x =>
      `<span class="${r.degisim[x] > 0 ? 'arti' : 'eksi'}">${STAT_IKON[x]} ${r.degisim[x] > 0 ? '+' : ''}${r.degisim[x]}</span>`).join('');
    statlariCiz(r.degisim);
    bekleyenSon = !!s.bitti;
    $('btn-ileri').textContent = bekleyenSon ? 'Sonucu Gör ›' : 'Devam ›';
    rozetleriIsle(r.yeniRozet);
    kaydet();
  }
  function ileri() {
    if (bekleyenSon) return sonEkrani();
    statlariCiz();
    olayiGoster();
  }
  function titret(d) { try { navigator.vibrate && navigator.vibrate(d); } catch (e) { /* */ } }

  // ───── Başarımlar ─────
  let bildirimZaman = null;
  function rozetleriIsle(yeni) {
    if (!yeni || !yeni.length) return;
    const p = profil();
    const ilkKez = yeni.filter(id => !p.rozet[id]);
    yeni.forEach(id => { if (!p.rozet[id]) p.rozet[id] = new Date().toISOString().slice(0, 10); });
    depo.koy(PROFIL, p);
    if (!ilkKez.length) return;
    const R = MOTOR.ROZETLER[ilkKez[0]];
    const b = $('bildirim');
    b.innerHTML = `<span class="b-ikon">${R.ikon}</span><span><small>Yeni başarım${ilkKez.length > 1 ? ` (+${ilkKez.length - 1})` : ''}</small><b>${kac(R.ad)}</b></span>`;
    b.classList.remove('gizli');
    b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
    clearTimeout(bildirimZaman);
    bildirimZaman = setTimeout(() => b.classList.add('gizli'), 2800);
  }
  function basarimlar() {
    const p = profil();
    const R = MOTOR.ROZETLER, S = MOTOR.SONLAR;
    const rozetHtml = Object.keys(R).map(id => {
      const var_ = p.rozet[id];
      return `<div class="rozet${var_ ? ' acik' : ''}"><span class="r-ikon">${var_ ? R[id].ikon : '🔒'}</span>
        <span><b>${kac(R[id].ad)}</b><small>${kac(R[id].aciklama)}</small></span></div>`;
    }).join('');
    const sonHtml = Object.keys(S).map(t => {
      const n = p.sonlar[t];
      return `<div class="son-koleksiyon${n ? ' acik' : ''}"><span>${n ? S[t].ikon : '❔'}</span><small>${n ? kac(S[t].baslik) + ` ×${n}` : '???'}</small></div>`;
    }).join('');
    const rek = Object.entries(p.ulkeRekor).sort((a, b) => b[1].puan - a[1].puan).slice(0, 10).map(([kod, r], i) =>
      `<div class="rekor-satir"><span>${i + 1}. ${VERI.ULKELER[kod].bayrak} ${kac(VERI.ULKELER[kod].ad)}</span><b>${r.puan}</b></div>`).join('');
    const bolgeSay = Object.keys(p.bolgeler).length;
    pencereAc(`<h3>🏅 Başarımlar <small class="soluk">${Object.keys(p.rozet).length}/${Object.keys(R).length}</small></h3>
      <div class="rozetler">${rozetHtml}</div>
      <h3 style="margin-top:18px">📖 Sonlar Koleksiyonu <small class="soluk">${Object.keys(p.sonlar).length}/${Object.keys(S).length}</small></h3>
      <div class="sonlar-izgara">${sonHtml}</div>
      <h3 style="margin-top:18px">🌍 Dünya Turu <small class="soluk">${bolgeSay}/${Object.keys(VERI.BOLGELER).length} bölge</small></h3>
      <p class="soluk" style="margin-top:0">${Object.keys(VERI.BOLGELER).map(b => (p.bolgeler[b] ? '✅ ' : '⬜ ') + VERI.BOLGELER[b]).join(' · ')}</p>
      <h3 style="margin-top:18px">🏆 Ülke Rekorların</h3>
      ${rek || '<p class="soluk">Henüz bitmiş bir oyunun yok.</p>'}`);
  }

  // ───── Son ─────
  function grafikCiz(iz) {
    if (!iz || iz.length < 2) return '';
    const G = 320, Y = 110, n = iz.length;
    const x = i => (i / (n - 1) * (G - 8) + 4).toFixed(1);
    const y = v => (Y - 4 - v / 100 * (Y - 8)).toFixed(1);
    const cizgiler = MOTOR.STATLAR.map((k, j) =>
      `<polyline fill="none" stroke="${STAT_HEX[k]}" stroke-width="2" stroke-linejoin="round" points="${iz.map((r, i) => x(i) + ',' + y(r[j])).join(' ')}"/>`).join('');
    // Seçim anları
    const secimler = (s.secimler || []).map(e => {
      const i = Math.min(n - 1, e.tur);
      return `<line x1="${x(i)}" x2="${x(i)}" y1="2" y2="${Y - 2}" stroke="${e.kazandi ? '#4cd38a' : '#ff5d6c'}" stroke-dasharray="3 3" stroke-width="1"/>`;
    }).join('');
    return `<div class="grafik-baslik">Görev süren boyunca göstergeler</div>
      <svg viewBox="0 0 ${G} ${Y}" preserveAspectRatio="none" role="img" aria-label="Gösterge grafiği">
        <line x1="0" x2="${G}" y1="${y(50)}" y2="${y(50)}" stroke="#2a3a5e" stroke-width="1"/>
        ${secimler}${cizgiler}
      </svg>
      <div class="grafik-lejant">${MOTOR.STATLAR.map(k => `<span><i style="background:${STAT_HEX[k]}"></i>${MOTOR.STAT_AD[k]}</span>`).join('')}<span><i class="kesik"></i>Seçim</span></div>`;
  }
  function sonEkrani() {
    const b = MOTOR.sonBilgisi(s);
    const u = VERI.ULKELER[s.kod];
    $('son-ikon').textContent = b.ikon;
    $('son-baslik').textContent = b.baslik;
    $('son-metin').textContent = b.metin;
    $('son-miras').innerHTML = `<small>Tarih seni böyle hatırlayacak</small><b>“${kac(b.miras.unvan)}”</b><span>${kac(b.miras.aciklama)}</span>`;
    $('son-sure').textContent = b.sure;
    $('son-karar').textContent = b.kararSayisi;
    $('son-puan').textContent = b.puan;
    $('son-oy').textContent = b.oy !== undefined ? `Son seçimde aldığın oy: %${b.oy.toLocaleString('tr-TR')}` : '';
    $('son-grafik').innerHTML = grafikCiz(b.iz);
    // Profil: sonlar koleksiyonu, ülke rekoru, bölge, başarımlar
    const p = profil();
    const yeniSon = !p.sonlar[b.tip];
    p.sonlar[b.tip] = (p.sonlar[b.tip] || 0) + 1;
    p.bolgeler[u.bolge] = 1;
    p.oyun++;
    b.rozetler.forEach(id => { if (!p.rozet[id]) p.rozet[id] = new Date().toISOString().slice(0, 10); });
    const eskiUR = p.ulkeRekor[s.kod];
    if (!eskiUR || b.puan > eskiUR.puan) p.ulkeRekor[s.kod] = { puan: b.puan, unvan: b.miras.unvan };
    depo.koy(PROFIL, p);
    $('son-rozet').innerHTML = (yeniSon ? `<div class="yeni-son">📖 Yeni son keşfettin! (${Object.keys(p.sonlar).length}/${Object.keys(MOTOR.SONLAR).length})</div>` : '') +
      (b.rozetler.length ? `<div class="rozet-sira">${b.rozetler.map(id => `<span title="${kac(MOTOR.ROZETLER[id].ad)}">${MOTOR.ROZETLER[id].ikon} ${kac(MOTOR.ROZETLER[id].ad)}</span>`).join('')}</div>` : '');
    const r = depo.al(REKOR);
    if (!r || b.puan > r.puan) {
      depo.koy(REKOR, { puan: b.puan, ulke: u.ad, bayrak: u.bayrak });
      $('son-rekor').textContent = '🏆 Yeni rekor!';
    } else $('son-rekor').textContent = `Rekor: ${r.puan} puan (${r.bayrak} ${r.ulke})`;
    depo.sil(KAYIT);
    ekran('son');
    $('ekran-son').scrollTop = 0;
  }

  // ───── Pencereler ─────
  function pencereAc(html) { $('pencere-icerik').innerHTML = html; $('pencere').classList.remove('gizli'); $('pencere-icerik').parentNode.scrollTop = 0; }
  function pencereKapat() { $('pencere').classList.add('gizli'); }
  function gunluk() {
    if (!s) return;
    const satirlar = s.gecmis.slice().reverse().map(g => `<div class="gunluk-satir">
      <div class="t">${MOTOR.tarihMetni({ tur: g.tur })} · ${kac(g.kat)}</div>
      <div><b>${kac(g.baslik)}</b></div>
      <div class="k">→ ${kac(g.secim)} ${g.basarili === false ? '✖' : ''}</div></div>`).join('');
    pencereAc(`<h3>📜 Karar Günlüğü</h3>${satirlar || '<p>Henüz karar vermedin.</p>'}`);
  }
  function kabine() {
    if (!s || !s.kabine) return;
    const satir = Object.keys(MOTOR.BAKANLIKLAR).map(k => {
      const B = MOTOR.BAKANLIKLAR[k], b = s.kabine[k];
      const ruh = b.sadakat >= 70 ? 'Sana çok bağlı' : b.sadakat >= 40 ? 'İşini yapıyor' : b.sadakat > 15 ? 'Huzursuz' : 'İstifanın eşiğinde';
      const renk = b.sadakat >= 70 ? 'var(--yesil)' : b.sadakat >= 40 ? 'var(--altin)' : 'var(--kirmizi)';
      return `<div class="bakan">
        <div class="bakan-ikon">${B.ikon}</div>
        <div class="bakan-bilgi"><b>${kac(b.ad)}</b><small>${B.ad} Bakanı · ${STAT_IKON[k]} ${MOTOR.STAT_AD[k]} göstergesini korur</small>
          <div class="cubuk"><div class="dolu" style="width:${b.sadakat}%;background:${renk}"></div></div>
          <small style="color:${renk}">Sadakat ${b.sadakat} · ${ruh}</small></div>
      </div>`;
    }).join('');
    pencereAc(`<h3>👔 Kabine</h3>
      <p class="soluk" style="margin-top:0">Bakanlar her olayda kendi alanını koruyan seçeneği önerir (seçeneklerin altındaki 💼 🛡️ 🕊️ simgeleri). Önerileri dinlenen bakanın sadakati artar; alanına zarar veren kararlar sadakati düşürür. Sadakati 70 üstü olan bakan kendi alanındaki riskli işlerde şansını artırır, dibe vuran bakan istifa mektubu getirir. Kabine uyumu seçimde de oy getirir.</p>
      ${satir}`);
  }
  function menu() {
    pencereAc(`<h3>Menü</h3>
      <button class="btn ikincil" id="m-kabine">👔 Kabine</button>
      <button class="btn ikincil" id="m-basarim">🏅 Başarımlar</button>
      <button class="btn ikincil" id="m-nasil">Nasıl Oynanır?</button>
      <button class="btn ikincil" id="m-ana">Ana Menüye Dön (oyun kaydedilir)</button>
      <button class="btn ikincil" id="m-istifa" style="color:var(--kirmizi)">İstifa Et (oyunu bitir)</button>`);
    $('m-kabine').onclick = kabine;
    $('m-basarim').onclick = basarimlar;
    $('m-nasil').onclick = nasil;
    $('m-ana').onclick = () => { pencereKapat(); kaydet(); girisGoster(); };
    $('m-istifa').onclick = () => { pencereKapat(); MOTOR.istifa(s); sonEkrani(); };
  }
  function nasil() {
    pencereAc(`<h3>Nasıl Oynanır?</h3>
      <p>Dünyadaki 197 ülkeden birinin başkanısın. Her iki ayda bir önüne yeni bir olay gelir ve <b>üç seçenekten</b> birini seçersin.</p>
      <ul>
        <li>👥 <b>Halk</b>, 💰 <b>Hazine</b>, 🪖 <b>Ordu</b>, 🌐 <b>Dış İlişkiler</b> göstergelerinden biri sıfıra düşerse görevden düşersin.</li>
        <li>🪖 Ordu 100'e ulaşırsa generaller darbe yapar. Orduyu da fazla büyütme!</li>
        <li>Seçeneklerin altındaki simgeler o kararın hangi göstergeleri etkileyeceğini gösterir. Büyük nokta = büyük etki. Yönünü sen tahmin et.</li>
        <li>💼 🛡️ 🕊️ simgeleri o seçeneği hangi bakanının önerdiğini gösterir. Bakanlarını dinlemezsen istifa edebilirler (👔 Kabine).</li>
        <li>🎯 Her dönemin başında halka bir <b>söz</b> verirsin. Tutarsan seçimde oy kazanırsın, tutamazsan kaybedersin.</li>
        <li>🎲 işaretli seçenekler risklidir: şansın ilgili göstergenin gücüne bağlıdır.</li>
        <li>Bazı kararların sonuçları aylar, hatta yıllar sonra karşına çıkar. Sansür, sert yönetim, çevre ve büyük güçlerle kavgalar unutulmaz.</li>
        <li>Her 4 yılda bir seçim var. Oyların nereden geldiğini seçim sonucunda görürsün. Anayasa izin vermedikçe en fazla 2 dönem görev yapabilirsin.</li>
        <li>🏅 Başarımları topla, 9 farklı sonu keşfet ve her ülkede rekorunu kır.</li>
      </ul>`);
  }

  // ───── Olaylar ─────
  $('btn-yeni').onclick = () => { bolgeleriCiz(); ulkeleriCiz(); ekran('ulke'); };
  $('btn-devam').onclick = () => { s = MOTOR.kayitYukle(depo.al(KAYIT)); if (s) oyunEkrani(); };
  $('btn-nasil').onclick = nasil;
  $('btn-basarim').onclick = basarimlar;
  $('btn-tekrar').onclick = girisGoster;
  $('btn-son-gunluk').onclick = gunluk;
  $('btn-gunluk').onclick = gunluk;
  $('btn-kabine').onclick = kabine;
  $('btn-menu').onclick = menu;
  $('btn-ileri').onclick = ileri;
  $('vaat-cip').onclick = () => {
    const v = MOTOR.vaatDurumu(s); if (!v) return;
    pencereAc(`<h3>🎯 Dönem Sözün</h3><p><b>${kac(v.kisa)}</b></p>
      <p>Şu an: ${v.tutuyor ? '<span class="arti">sözünü tutuyorsun ✔</span>' : '<span class="eksi">sözünü tutmuyorsun ✖</span>'}</p>
      <p class="soluk">Seçim günü sözün kontrol edilir: Tutarsan +6 oy, tutamazsan −5 oy.</p>`);
  };
  $('bildirim').onclick = () => { $('bildirim').classList.add('gizli'); basarimlar(); };
  $('pencere-kapat').onclick = pencereKapat;
  $('pencere').onclick = e => { if (e.target.id === 'pencere') pencereKapat(); };
  document.querySelectorAll('[data-git]').forEach(b => b.onclick = () => girisGoster());
  $('arama').oninput = ulkeleriCiz;
  $('bolgeler').onclick = e => { const b = e.target.closest('.cip'); if (!b) return; bolge = b.dataset.b; bolgeleriCiz(); ulkeleriCiz(); };
  $('ulke-listesi').onclick = e => { const b = e.target.closest('.ulke-satir'); if (b) ulkeOnay(b.dataset.kod); };
  $('secenekler').onclick = e => { const b = e.target.closest('.secenek'); if (b) sec(+b.dataset.i); };

  girisGoster();
})();
