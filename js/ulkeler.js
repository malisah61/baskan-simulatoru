// Dünya ülkeleri: kod | ad | bölge | nüfus (milyon) | zenginlik 1-5 | askeri güç 1-5 | komşular
// Bölgeler: AV Avrupa, OD Orta Doğu, AS Asya, AF Afrika, KA Kuzey/Orta Amerika ve Karayipler, GA Güney Amerika, OK Okyanusya
// Adalar için "komşu" alanına en yakın ülkeler yazıldı (olaylarda komşu olarak kullanılır).
(function (G) {
  const HAM = `
AL|Arnavutluk|AV|2.8|2|2|ME,XK,MK,GR
AD|Andorra|AV|0.08|5|1|FR,ES
AT|Avusturya|AV|9|5|2|DE,CZ,SK,HU,SI,IT,CH,LI
BY|Belarus|AV|9.2|2|3|RU,UA,PL,LT,LV
BE|Belçika|AV|11.7|5|2|FR,NL,DE,LU
BA|Bosna-Hersek|AV|3.2|2|1|HR,RS,ME
BG|Bulgaristan|AV|6.4|3|2|RO,RS,MK,GR,TR
HR|Hırvatistan|AV|3.9|4|2|SI,HU,RS,BA,ME
CY|Kıbrıs|AV|1.3|4|1|TR,GR,LB
CZ|Çekya|AV|10.9|4|2|DE,PL,SK,AT
DK|Danimarka|AV|5.9|5|2|DE,SE,NO
EE|Estonya|AV|1.4|4|1|RU,LV,FI
FI|Finlandiya|AV|5.6|5|3|SE,NO,RU,EE
FR|Fransa|AV|68|5|5|BE,LU,DE,CH,IT,ES,AD,MC,GB
DE|Almanya|AV|84|5|4|DK,PL,CZ,AT,CH,FR,LU,BE,NL
GR|Yunanistan|AV|10.4|4|3|AL,MK,BG,TR,CY
HU|Macaristan|AV|9.6|4|2|AT,SK,UA,RO,RS,HR,SI
IS|İzlanda|AV|0.4|5|1|NO,GB,DK
IE|İrlanda|AV|5.3|5|1|GB
IT|İtalya|AV|59|5|4|FR,CH,AT,SI,SM,VA,MT
XK|Kosova|AV|1.6|2|1|RS,MK,AL,ME
LV|Letonya|AV|1.9|4|1|EE,LT,BY,RU
LI|Lihtenştayn|AV|0.04|5|1|CH,AT
LT|Litvanya|AV|2.9|4|1|LV,BY,PL,RU
LU|Lüksemburg|AV|0.67|5|1|BE,DE,FR
MT|Malta|AV|0.55|4|1|IT,TN,LY
MD|Moldova|AV|2.5|2|1|RO,UA
MC|Monako|AV|0.04|5|1|FR,IT
ME|Karadağ|AV|0.62|3|1|HR,BA,RS,XK,AL
NL|Hollanda|AV|17.9|5|3|DE,BE,GB
MK|Kuzey Makedonya|AV|1.8|2|1|RS,XK,AL,GR,BG
NO|Norveç|AV|5.5|5|3|SE,FI,RU
PL|Polonya|AV|37|4|4|DE,CZ,SK,UA,BY,LT,RU
PT|Portekiz|AV|10.4|4|2|ES,MA
RO|Romanya|AV|19|3|3|UA,MD,HU,RS,BG
RU|Rusya|AV|144|3|5|NO,FI,EE,LV,LT,PL,BY,UA,GE,AZ,KZ,CN,MN,KP
SM|San Marino|AV|0.03|5|1|IT
RS|Sırbistan|AV|6.6|3|2|HU,RO,BG,MK,XK,ME,BA,HR
SK|Slovakya|AV|5.4|4|2|CZ,PL,UA,HU,AT
SI|Slovenya|AV|2.1|4|1|IT,AT,HU,HR
ES|İspanya|AV|48|4|4|PT,FR,AD,MA
SE|İsveç|AV|10.5|5|3|NO,FI,DK
CH|İsviçre|AV|8.8|5|2|DE,FR,IT,AT,LI
UA|Ukrayna|AV|37|2|4|RU,BY,PL,SK,HU,RO,MD
GB|Birleşik Krallık|AV|68|5|5|IE,FR,NL
VA|Vatikan|AV|0.001|4|1|IT
TR|Türkiye|AV|85|3|5|GR,BG,GE,AM,AZ,IR,IQ,SY
IL|İsrail|OD|9.8|5|4|LB,SY,JO,EG,PS
PS|Filistin|OD|5.4|1|1|IL,EG,JO
JO|Ürdün|OD|11.3|2|2|SY,IQ,SA,IL,PS
LB|Lübnan|OD|5.5|2|1|SY,IL
SY|Suriye|OD|23|1|2|TR,IQ,JO,IL,LB
IQ|Irak|OD|45|2|3|TR,IR,KW,SA,JO,SY
IR|İran|OD|89|2|4|TR,AM,AZ,TM,AF,PK,IQ
SA|Suudi Arabistan|OD|36|4|4|JO,IQ,KW,QA,AE,OM,YE
KW|Kuveyt|OD|4.3|5|2|IQ,SA
QA|Katar|OD|2.7|5|2|SA,BH
BH|Bahreyn|OD|1.5|4|1|SA,QA
AE|Birleşik Arap Emirlikleri|OD|9.5|5|3|SA,OM
OM|Umman|OD|4.6|4|2|AE,SA,YE
YE|Yemen|OD|34|1|2|SA,OM
EG|Mısır|OD|112|2|4|LY,SD,IL,PS
AF|Afganistan|AS|41|1|2|IR,TM,UZ,TJ,CN,PK
AM|Ermenistan|AS|2.8|2|2|GE,AZ,IR,TR
AZ|Azerbaycan|AS|10.1|3|3|RU,GE,AM,IR,TR
GE|Gürcistan|AS|3.7|2|1|RU,AZ,AM,TR
KZ|Kazakistan|AS|20|3|2|RU,CN,KG,UZ,TM
KG|Kırgızistan|AS|7|1|1|KZ,CN,TJ,UZ
TJ|Tacikistan|AS|10|1|1|KG,CN,AF,UZ
TM|Türkmenistan|AS|6.5|2|2|KZ,UZ,AF,IR
UZ|Özbekistan|AS|36|2|2|KZ,KG,TJ,AF,TM
CN|Çin|AS|1410|3|5|RU,MN,KP,VN,LA,MM,IN,BT,NP,PK,AF,TJ,KG,KZ
MN|Moğolistan|AS|3.4|2|1|RU,CN
KP|Kuzey Kore|AS|26|1|4|CN,KR,RU
KR|Güney Kore|AS|51.7|5|4|KP,JP
JP|Japonya|AS|124|5|4|KR,CN,RU
TW|Tayvan|AS|23.4|5|3|CN,JP,PH
IN|Hindistan|AS|1430|2|5|PK,CN,NP,BT,BD,MM
PK|Pakistan|AS|240|1|4|IN,AF,IR,CN
BD|Bangladeş|AS|173|2|2|IN,MM
NP|Nepal|AS|30|1|1|CN,IN
BT|Butan|AS|0.78|2|1|CN,IN
LK|Sri Lanka|AS|22|2|2|IN,MV
MV|Maldivler|AS|0.52|3|1|IN,LK
MM|Myanmar|AS|54|1|3|BD,IN,CN,LA,TH
TH|Tayland|AS|72|3|3|MM,LA,KH,MY
LA|Laos|AS|7.6|1|1|CN,VN,KH,TH,MM
KH|Kamboçya|AS|17|1|1|TH,LA,VN
VN|Vietnam|AS|100|2|4|CN,LA,KH
MY|Malezya|AS|34|3|2|TH,ID,BN,SG
SG|Singapur|AS|5.9|5|2|MY,ID
ID|Endonezya|AS|278|2|4|MY,TL,PG
BN|Brunei|AS|0.45|5|1|MY
PH|Filipinler|AS|117|2|2|TW,ID,MY,VN
TL|Doğu Timor|AS|1.4|1|1|ID,AU
DZ|Cezayir|AF|45|2|3|MA,TN,LY,NE,ML,MR
MA|Fas|AF|37|2|3|DZ,ES,MR
TN|Tunus|AF|12|2|2|DZ,LY
LY|Libya|AF|7|2|2|TN,DZ,NE,TD,SD,EG
SD|Sudan|AF|48|1|2|EG,LY,TD,CF,SS,ET,ER
SS|Güney Sudan|AF|11|1|1|SD,ET,KE,UG,CD,CF
ET|Etiyopya|AF|126|1|3|ER,DJ,SO,KE,SS,SD
ER|Eritre|AF|3.7|1|2|SD,ET,DJ
DJ|Cibuti|AF|1.1|2|1|ER,ET,SO
SO|Somali|AF|18|1|1|DJ,ET,KE
KE|Kenya|AF|55|2|2|ET,SO,TZ,UG,SS
UG|Uganda|AF|48|1|2|KE,TZ,RW,CD,SS
RW|Ruanda|AF|14|1|2|UG,TZ,BI,CD
BI|Burundi|AF|13|1|1|RW,TZ,CD
TZ|Tanzanya|AF|67|1|2|KE,UG,RW,BI,CD,ZM,MW,MZ
CD|Kongo Demokratik Cumhuriyeti|AF|102|1|2|CF,SS,UG,RW,BI,TZ,ZM,AO,CG
CG|Kongo|AF|6|2|1|GA,CM,CF,CD,AO
GA|Gabon|AF|2.4|3|1|GQ,CM,CG
GQ|Ekvator Ginesi|AF|1.7|3|1|CM,GA
CM|Kamerun|AF|28|1|2|NG,TD,CF,CG,GA,GQ
CF|Orta Afrika Cumhuriyeti|AF|5.7|1|1|TD,SD,SS,CD,CG,CM
TD|Çad|AF|18|1|2|LY,SD,CF,CM,NG,NE
NE|Nijer|AF|27|1|1|DZ,LY,TD,NG,BJ,BF,ML
NG|Nijerya|AF|225|2|3|BJ,NE,TD,CM
BJ|Benin|AF|13.7|1|1|TG,BF,NE,NG
TG|Togo|AF|9|1|1|GH,BF,BJ
GH|Gana|AF|34|2|1|CI,BF,TG
CI|Fildişi Sahili|AF|29|2|1|LR,GN,ML,BF,GH
BF|Burkina Faso|AF|23|1|1|ML,NE,BJ,TG,GH,CI
ML|Mali|AF|23|1|2|DZ,NE,BF,CI,GN,SN,MR
MR|Moritanya|AF|4.9|1|1|MA,DZ,ML,SN
SN|Senegal|AF|18|1|1|MR,ML,GN,GW,GM
GM|Gambiya|AF|2.7|1|1|SN
GW|Gine-Bissau|AF|2.1|1|1|SN,GN
GN|Gine|AF|14|1|1|GW,SN,ML,CI,LR,SL
SL|Sierra Leone|AF|8.6|1|1|GN,LR
LR|Liberya|AF|5.4|1|1|SL,GN,CI
CV|Yeşil Burun Adaları|AF|0.6|2|1|SN,GM
AO|Angola|AF|36|2|2|CD,CG,ZM,NA
ZM|Zambiya|AF|20|1|1|CD,TZ,MW,MZ,ZW,BW,NA,AO
MW|Malavi|AF|20|1|1|TZ,MZ,ZM
MZ|Mozambik|AF|33|1|1|TZ,MW,ZM,ZW,ZA,SZ
ZW|Zimbabve|AF|16|1|2|ZM,MZ,ZA,BW
BW|Botsvana|AF|2.6|3|1|NA,ZM,ZW,ZA
NA|Namibya|AF|2.6|2|1|AO,ZM,BW,ZA
ZA|Güney Afrika|AF|60|3|3|NA,BW,ZW,MZ,SZ,LS
SZ|Esvatini|AF|1.2|2|1|ZA,MZ
LS|Lesotho|AF|2.3|1|1|ZA
MG|Madagaskar|AF|30|1|1|MZ,MU,KM
MU|Mauritius|AF|1.3|3|1|MG,SC
KM|Komorlar|AF|0.85|1|1|MG,MZ
SC|Seyşeller|AF|0.1|4|1|MG,MU
ST|São Tomé ve Príncipe|AF|0.23|1|1|GA,GQ
US|Amerika Birleşik Devletleri|KA|335|5|5|CA,MX
CA|Kanada|KA|40|5|3|US
MX|Meksika|KA|129|3|3|US,GT,BZ
GT|Guatemala|KA|18|2|1|MX,BZ,HN,SV
BZ|Belize|KA|0.41|2|1|MX,GT
HN|Honduras|KA|10.4|1|1|GT,SV,NI
SV|El Salvador|KA|6.3|2|1|GT,HN
NI|Nikaragua|KA|7|1|1|HN,CR
CR|Kosta Rika|KA|5.2|3|1|NI,PA
PA|Panama|KA|4.4|3|1|CR,CO
CU|Küba|KA|11|2|2|US,MX,JM
JM|Jamaika|KA|2.8|2|1|CU,HT
HT|Haiti|KA|11.7|1|1|DO,CU
DO|Dominik Cumhuriyeti|KA|11.3|3|1|HT
BS|Bahamalar|KA|0.41|4|1|US,CU
TT|Trinidad ve Tobago|KA|1.5|4|1|VE,GD
BB|Barbados|KA|0.28|4|1|TT,LC
LC|Saint Lucia|KA|0.18|3|1|VC,BB
VC|Saint Vincent ve Grenadinler|KA|0.1|3|1|LC,GD
GD|Grenada|KA|0.13|3|1|VC,TT
AG|Antigua ve Barbuda|KA|0.1|4|1|KN,DM
DM|Dominika|KA|0.07|3|1|AG,LC
KN|Saint Kitts ve Nevis|KA|0.05|4|1|AG
BR|Brezilya|GA|216|3|4|UY,AR,PY,BO,PE,CO,VE,GY,SR
AR|Arjantin|GA|46|3|2|CL,BO,PY,BR,UY
CL|Şili|GA|19.6|4|2|PE,BO,AR
CO|Kolombiya|GA|52|2|3|PA,VE,BR,PE,EC
PE|Peru|GA|34|2|2|EC,CO,BR,BO,CL
VE|Venezuela|GA|28|2|2|CO,BR,GY
EC|Ekvador|GA|18|2|1|CO,PE
BO|Bolivya|GA|12|2|1|BR,PY,AR,CL,PE
PY|Paraguay|GA|6.9|2|1|BO,BR,AR
UY|Uruguay|GA|3.4|4|1|AR,BR
GY|Guyana|GA|0.8|3|1|VE,BR,SR
SR|Surinam|GA|0.62|2|1|GY,BR
AU|Avustralya|OK|26.6|5|3|NZ,PG,ID
NZ|Yeni Zelanda|OK|5.2|5|1|AU,FJ
PG|Papua Yeni Gine|OK|10|1|1|ID,AU,SB
FJ|Fiji|OK|0.93|2|1|VU,TO,WS
SB|Solomon Adaları|OK|0.72|1|1|PG,VU
VU|Vanuatu|OK|0.33|1|1|FJ,SB
WS|Samoa|OK|0.22|2|1|TO,FJ
TO|Tonga|OK|0.1|2|1|FJ,WS
KI|Kiribati|OK|0.13|1|1|TV,MH
TV|Tuvalu|OK|0.011|1|1|KI,FJ
NR|Nauru|OK|0.013|2|1|KI,SB
MH|Marshall Adaları|OK|0.04|1|1|FM,KI
FM|Mikronezya|OK|0.11|1|1|MH,PW
PW|Palau|OK|0.018|2|1|FM,PH
`;

  const BOLGELER = {
    AV: 'Avrupa', OD: 'Orta Doğu', AS: 'Asya', AF: 'Afrika',
    KA: 'Kuzey ve Orta Amerika', GA: 'Güney Amerika', OK: 'Okyanusya'
  };

  // ISO kodundan bayrak emojisi üret
  function bayrak(kod) {
    if (kod === 'XK') return '🇽🇰';
    return String.fromCodePoint(...[...kod].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
  }

  const ULKELER = {};
  HAM.trim().split('\n').forEach(satir => {
    const [kod, ad, bolge, nufus, zen, ask, kom] = satir.split('|');
    ULKELER[kod] = {
      kod, ad, bolge, nufus: parseFloat(nufus),
      zenginlik: +zen, askeri: +ask,
      komsular: kom ? kom.split(',') : [],
      bayrak: bayrak(kod)
    };
  });
  // Var olmayan komşu kodlarını temizle
  Object.values(ULKELER).forEach(u => { u.komsular = u.komsular.filter(k => ULKELER[k] && k !== u.kod); });

  // Büyük güçler (olaylarda {guc} yerine geçer)
  const BUYUK_GUCLER = [
    { kod: 'US', ad: 'ABD' },
    { kod: 'CN', ad: 'Çin' },
    { kod: 'RU', ad: 'Rusya' },
    { kod: 'AB', ad: 'Avrupa Birliği' }
  ];

  G.VERI = Object.assign(G.VERI || {}, { ULKELER, BOLGELER, BUYUK_GUCLER });
})(typeof window !== 'undefined' ? window : globalThis);
