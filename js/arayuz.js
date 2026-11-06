// ARAYÜZ — ekranlar, dokunmatik etkileşim, kayıt
(function () {
  const { VERI, MOTOR } = window;
  const $ = id => document.getElementById(id);
  const KAYIT = 'baskan_kayit_v1';
  const REKOR = 'baskan_rekor_v1';
  const STAT_IKON = { h: '👥', z: '💰', o: '🪖', d: '🌐' };
  const STAT_RENK = { h: 'var(--h)', z: 'var(--z)', o: 'var(--o)', d: 'var(--d)' };

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
    $('rekor').textContent = r ? `🏆 Rekor: ${r.puan} puan (${r.bayrak} ${r.ulke})` : '';
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
    const liste = Object.values(VERI.ULKELER)
      .filter(u => (bolge === 'HEPSI' || u.bolge === bolge) && (!q || u.ad.toLocaleLowerCase('tr').includes(q)))
      .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
    $('ulke-sayisi').textContent = liste.length + ' ülke';
    $('ulke-listesi').innerHTML = liste.map(u => {
      const z = MOTOR.zorluk(u.kod);
      return `<button class="ulke-satir" data-kod="${u.kod}">
        <span class="bayrak">${u.bayrak}</span>
        <span><div class="ad">${kac(u.ad)}</div><div class="bolge">${VERI.BOLGELER[u.bolge]} · ${nufusYaz(u.nufus)}</div></span>
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
    pencereAc(`<div class="secim-onay">
      <div class="buyuk-bayrak">${u.bayrak}</div>
      <h3>${kac(u.ad)}</h3>
      <p style="text-align:center;color:var(--soluk);margin:0">${VERI.BOLGELER[u.bolge]} · ${nufusYaz(u.nufus)} · <span class="yildiz">${'★'.repeat(z)}${'☆'.repeat(5 - z)}</span></p>
      <div class="ozet">
        ${MOTOR.STATLAR.map(k => `<div>${STAT_IKON[k]} ${MOTOR.STAT_AD[k]} <b>${ornek.stat[k]}</b></div>`).join('')}
      </div>
      ${kom ? `<p style="font-size:14px;text-align:center">Komşular: ${kom}</p>` : ''}
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
  }
  function olayiGoster() {
    const o = MOTOR.aktifOlay(s);
    $('sonuc-kart').classList.add('gizli');
    $('olay-kart').classList.remove('gizli');
    $('olay-kart').style.animation = 'none'; void $('olay-kart').offsetWidth; $('olay-kart').style.animation = '';
    $('olay-kat').textContent = o.kat;
    $('olay-ikon').textContent = o.ikon;
    $('olay-baslik').textContent = o.baslik;
    $('olay-metin').textContent = o.metin;
    const ham = o.id === 'secim' ? VERI.SECIM : VERI.OLAYLAR.find(x => x.id === o.id);
    $('secenekler').innerHTML = o.secenekler.map((x, i) => {
      const noktalar = Object.entries(x.ipucu).map(([k, b]) => `<span class="nokta n${b}">${STAT_IKON[k]}<i></i></span>`).join('');
      let risk = '';
      if (x.riskli) risk = `<span class="risk">🎲 Başarı şansı %${Math.round(MOTOR.basariSansi(s, ham.sec[i].risk.stat) * 100)}</span>`;
      if (o.id === 'secim' && i === 2) risk = '<span class="risk">🎲 Yakalanma riski var</span>';
      return `<button class="secenek" data-i="${i}">
        <span class="harf">${'ABC'[i]}</span><span class="yazi">${kac(x.t)}</span>
        ${noktalar || risk ? `<div class="ipucu">${noktalar}${risk}</div>` : ''}
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
    if (r.secim) {
      html += `<div class="oy-sonuc ${r.kazandi ? 'arti' : 'eksi'}">%${r.oy.toLocaleString('tr-TR')}</div>
        <div class="oy-cubuk"><div id="oy-dolu"></div></div>
        <p style="text-align:center;font-weight:700">${r.kazandi ? '🎉 Seçimi kazandın! Yeni dönem başlıyor.' : 'Seçimi kaybettin.'}</p>`;
    }
    $('sonuc-metin').innerHTML = html;
    if (r.secim) setTimeout(() => { const d = $('oy-dolu'); if (d) d.style.width = r.oy + '%'; }, 50);
    $('sonuc-degisim').innerHTML = MOTOR.STATLAR.filter(x => r.degisim[x]).map(x =>
      `<span class="${r.degisim[x] > 0 ? 'arti' : 'eksi'}">${STAT_IKON[x]} ${r.degisim[x] > 0 ? '+' : ''}${r.degisim[x]}</span>`).join('');
    statlariCiz(r.degisim);
    bekleyenSon = !!s.bitti;
    $('btn-ileri').textContent = bekleyenSon ? 'Sonucu Gör ›' : 'Devam ›';
    kaydet();
  }
  function ileri() {
    if (bekleyenSon) return sonEkrani();
    statlariCiz();
    olayiGoster();
  }
  function titret(d) { try { navigator.vibrate && navigator.vibrate(d); } catch (e) { /* */ } }

  // ───── Son ─────
  function sonEkrani() {
    const b = MOTOR.sonBilgisi(s);
    const u = VERI.ULKELER[s.kod];
    $('son-ikon').textContent = b.ikon;
    $('son-baslik').textContent = b.baslik;
    $('son-metin').textContent = b.metin;
    $('son-sure').textContent = b.sure;
    $('son-karar').textContent = b.kararSayisi;
    $('son-puan').textContent = b.puan;
    $('son-oy').textContent = b.oy !== undefined ? `Son seçimde aldığın oy: %${b.oy.toLocaleString('tr-TR')}` : '';
    const r = depo.al(REKOR);
    if (!r || b.puan > r.puan) {
      depo.koy(REKOR, { puan: b.puan, ulke: u.ad, bayrak: u.bayrak });
      $('son-rekor').textContent = '🏆 Yeni rekor!';
    } else $('son-rekor').textContent = `Rekor: ${r.puan} puan (${r.bayrak} ${r.ulke})`;
    depo.sil(KAYIT);
    ekran('son');
  }

  // ───── Pencereler ─────
  function pencereAc(html) { $('pencere-icerik').innerHTML = html; $('pencere').classList.remove('gizli'); }
  function pencereKapat() { $('pencere').classList.add('gizli'); }
  function gunluk() {
    if (!s) return;
    const satirlar = s.gecmis.slice().reverse().map(g => `<div class="gunluk-satir">
      <div class="t">${MOTOR.tarihMetni({ tur: g.tur })} · ${kac(g.kat)}</div>
      <div><b>${kac(g.baslik)}</b></div>
      <div class="k">→ ${kac(g.secim)} ${g.basarili === false ? '✖' : ''}</div></div>`).join('');
    pencereAc(`<h3>📜 Karar Günlüğü</h3>${satirlar || '<p>Henüz karar vermedin.</p>'}`);
  }
  function menu() {
    pencereAc(`<h3>Menü</h3>
      <button class="btn ikincil" id="m-nasil">Nasıl Oynanır?</button>
      <button class="btn ikincil" id="m-ana">Ana Menüye Dön (oyun kaydedilir)</button>
      <button class="btn ikincil" id="m-istifa" style="color:var(--kirmizi)">İstifa Et (oyunu bitir)</button>`);
    $('m-nasil').onclick = nasil;
    $('m-ana').onclick = () => { pencereKapat(); kaydet(); girisGoster(); };
    $('m-istifa').onclick = () => { pencereKapat(); s.bitti = { tip: 'h0' }; s.istifa = true; sonEkrani(); $('son-baslik').textContent = 'İstifa Ettin'; $('son-metin').textContent = 'Görevini kendi isteğinle bıraktın. Belki bir gün geri dönersin.'; };
  }
  function nasil() {
    pencereAc(`<h3>Nasıl Oynanır?</h3>
      <p>Dünyadaki 197 ülkeden birinin başkanısın. Her iki ayda bir önüne yeni bir olay gelir ve <b>üç seçenekten</b> birini seçersin.</p>
      <ul>
        <li>👥 <b>Halk</b>, 💰 <b>Hazine</b>, 🪖 <b>Ordu</b>, 🌐 <b>Dış İlişkiler</b> göstergelerinden biri sıfıra düşerse görevden düşersin.</li>
        <li>🪖 Ordu 100'e ulaşırsa generaller darbe yapar. Orduyu da fazla büyütme!</li>
        <li>Seçeneklerin altındaki simgeler o kararın hangi göstergeleri etkileyeceğini gösterir. Büyük nokta = büyük etki. Yönünü sen tahmin et.</li>
        <li>🎲 işaretli seçenekler risklidir: şansın ilgili göstergenin gücüne bağlıdır.</li>
        <li>Bazı kararların sonuçları aylar sonra karşına çıkar.</li>
        <li>Her 4 yılda bir seçim var. Halk desteğin seçimi belirler. Anayasa izin vermedikçe en fazla 2 dönem görev yapabilirsin.</li>
      </ul>`);
  }

  // ───── Olaylar ─────
  $('btn-yeni').onclick = () => { bolgeleriCiz(); ulkeleriCiz(); ekran('ulke'); };
  $('btn-devam').onclick = () => { s = MOTOR.kayitYukle(depo.al(KAYIT)); if (s) oyunEkrani(); };
  $('btn-nasil').onclick = nasil;
  $('btn-tekrar').onclick = girisGoster;
  $('btn-son-gunluk').onclick = gunluk;
  $('btn-gunluk').onclick = gunluk;
  $('btn-menu').onclick = menu;
  $('btn-ileri').onclick = ileri;
  $('pencere-kapat').onclick = pencereKapat;
  $('pencere').onclick = e => { if (e.target.id === 'pencere') pencereKapat(); };
  document.querySelectorAll('[data-git]').forEach(b => b.onclick = () => girisGoster());
  $('arama').oninput = ulkeleriCiz;
  $('bolgeler').onclick = e => { const b = e.target.closest('.cip'); if (!b) return; bolge = b.dataset.b; bolgeleriCiz(); ulkeleriCiz(); };
  $('ulke-listesi').onclick = e => { const b = e.target.closest('.ulke-satir'); if (b) ulkeOnay(b.dataset.kod); };
  $('secenekler').onclick = e => { const b = e.target.closest('.secenek'); if (b) sec(+b.dataset.i); };

  girisGoster();
})();
