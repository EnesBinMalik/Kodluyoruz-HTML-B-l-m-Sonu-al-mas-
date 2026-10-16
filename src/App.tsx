import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Code2, 
  Eye, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles,
  Layers,
  FileCode,
  Tag
} from 'lucide-react';
import { PURE_HTML_CODE } from './data/htmlContent';

interface TagInfo {
  tag: string;
  type: 'Semantik Bölüm' | 'Metin & Blok' | 'Satır İçi (Inline)' | 'Yapısal';
  desc: string;
  enesHocaNote: string;
  example: string;
}

const SEMANTIC_TAGS: TagInfo[] = [
  {
    tag: '<header>',
    type: 'Semantik Bölüm',
    desc: 'Sayfanın veya bir bölümün başlık, logo ve navigasyon gibi giriş unsurlarını barındırır.',
    enesHocaNote: 'Sadece sayfa başında değil, bağımsız bir <article> veya <section> içinde de kendi özel header alanı tanımlanabilir.',
    example: '<header>\n  <div class="logo">Lezzet Durağı</div>\n  <nav>...</nav>\n</header>'
  },
  {
    tag: '<nav>',
    type: 'Semantik Bölüm',
    desc: 'Ana navigasyon bağlantılarını tanımlamak için kullanılır.',
    enesHocaNote: 'Sayfadaki tüm linkler nav içinde olmaz! Sadece ana menü, sayfa içi bölümler veya sayfalama gibi yönlendirici linkler nav içerisine konur.',
    example: '<nav aria-label="Ana Menü">\n  <ul>\n    <li><a href="#hakkimizda">Hakkımızda</a></li>\n  </ul>\n</nav>'
  },
  {
    tag: '<main>',
    type: 'Semantik Bölüm',
    desc: 'Sayfanın benzersiz, merkezi içeriğini kapsar.',
    enesHocaNote: 'Çok kritik kural: Bir HTML sayfasında yalnızca 1 adet <main> etiketi bulunmalıdır ve header/footer/sidebar içinde asla yer alamaz.',
    example: '<main class="container" id="anasayfa">\n  <section>...</section>\n</main>'
  },
  {
    tag: '<section>',
    type: 'Semantik Bölüm',
    desc: 'Genel bir konuyu veya sayfa bölümünü gruplayan anlamsal alan.',
    enesHocaNote: 'Her <section> kesinlikle bir başlık (h2, h3) ile başlamalıdır. Sadece stil amaçlı kutulama için değil, tematik içerik bütünlüğü için kullanılır.',
    example: '<section id="hakkimizda">\n  <h2>Hakkımızda</h2>\n  <p>...</p>\n</section>'
  },
  {
    tag: '<article>',
    type: 'Semantik Bölüm',
    desc: 'Kendi başına anlam ifade eden, bağımsız olarak paylaşılabilir veya taşınabilir içerik birimi.',
    enesHocaNote: 'Blog yazısı, menüdeki bir yemek kartı, kullanıcı yorumu veya ürün tanıtımı gibi tek başına bir RSS okuyucuya konulduğunda anlamlı olan içeriklerdir.',
    example: '<article>\n  <h3>Taş Fırında Dana İncik</h3>\n  <p>12 saat meşe odununda pişirilmiş...</p>\n</article>'
  },
  {
    tag: '<figure> & <figcaption>',
    type: 'Yapısal',
    desc: 'Görsel, grafik veya illüstrasyonu altyazısıyla (caption) birlikte anlamsal bir demet haline getirir.',
    enesHocaNote: 'Görselleri sadece çıplak <img> olarak bırakmak yerine <figure> ile sarıp <figcaption> ile açıklamak SEO ve erişilebilirlik açısından mükemmeldir.',
    example: '<figure>\n  <img src="sufle.jpg" alt="Sufle">\n  <figcaption>Görsel 1: Sıcak sufle sunumu</figcaption>\n</figure>'
  },
  {
    tag: '<ol> & <ul> (İç İçe)',
    type: 'Metin & Blok',
    desc: 'Sıralı (<ol>) ve sırasız (<ul>) liste elemanları.',
    enesHocaNote: 'Sıra önemliyse (adım adım yemek tarifleri, aşamalar) <ol>; sıra önemsizse (malzemeler, menü maddeleri) <ul> kullanılır. İç içe listeler ile zengin menü hiyerarşisi kurulur.',
    example: '<ol>\n  <li>1. Adım\n    <ul><li>Alt not</li></ul>\n  </li>\n</ol>'
  },
  {
    tag: '<aside>',
    type: 'Semantik Bölüm',
    desc: 'Ana içerikle dolaylı olarak ilişkili yan bilgiler, püf noktaları veya kenar çubuğu içeriği.',
    enesHocaNote: 'Tarifteki "Şefin Püf Noktası", yazar biyografisi veya ilgili yan linkler için idealdir.',
    example: '<aside>\n  <h4>💡 Şefin Püf Noktası</h4>\n  <p>Fırın kapağını açmayın!</p>\n</aside>'
  },
  {
    tag: '<strong>, <em>, <mark>',
    type: 'Satır İçi (Inline)',
    desc: 'Metin içi anlamsal vurgular (önem, dikkat veya vurgu tonu).',
    enesHocaNote: '<b> ve <i> sadece görsel kalınlaştırma/eğme yaparken, <strong> ve <em> ekran okuyuculara anlamsal vurgu katar. <mark> ise dikkat çekmek için fosforlu sarı arkaplan sağlar.',
    example: '<p><strong>Dikkat:</strong> Fırın <em>200°C</em> olmalı. <mark>Önemli uyarı</mark></p>'
  },
  {
    tag: '<address> & <footer>',
    type: 'Semantik Bölüm',
    desc: 'Sayfa veya belgenin altbilgisi, telif hakları ve iletişim iletişim bilgileri.',
    enesHocaNote: '<address> etiketi sadece fiziksel adres için değil; telefon, e-posta ve iletişim kurma yöntemlerini kapsayan resmi HTML5 etiketidir.',
    example: '<footer>\n  <address>...\n  </address>\n  <p>&copy; 2026</p>\n</footer>'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'guide'>('preview');
  const [xrayMode, setXrayMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<TagInfo | null>(null);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(PURE_HTML_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = PURE_HTML_CODE;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([PURE_HTML_CODE], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      {/* Üst Bar: Başlık, Tablar ve İndir/Kopyala Butonları */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold shadow-xs">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-stone-900 leading-tight">
                  Kodluyoruz HTML Bölüm Sonu Çalışması
                </h1>
                <span className="hidden sm:inline-block text-xs px-2 py-0.5 font-medium bg-orange-50 text-orange-700 rounded border border-orange-200">
                  Enes Öztürk Standardı
                </span>
              </div>
              <p className="text-xs text-stone-500">
                100% Semantik HTML5 · Lezzet Durağı Restoranı · Bölüm Sonu Ödevi
              </p>
            </div>
          </div>

          {/* Sekmeler */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Eye className="w-4 h-4 text-orange-600" />
              <span>Canlı Sayfa</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'code'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Code2 className="w-4 h-4 text-orange-600" />
              <span>index.html Kodu</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'guide'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span>Semantik Rehber</span>
            </button>
          </div>

          {/* Eylemler */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors border ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
              title="Tüm index.html kodunu panoya kopyala"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Kodu Kopyala</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors shadow-xs"
              title="index.html dosyasını doğrudan bilgisayarına indir"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">index.html İndir</span>
              <span className="sm:hidden">İndir</span>
            </button>
          </div>

        </div>
      </header>

      {/* Ana Gövde */}
      <main className="flex-1 flex flex-col">
        {/* TAB 1: CANLI ÖNİZLEME */}
        {activeTab === 'preview' && (
          <div className="flex-1 flex flex-col">
            {/* Önizleme Kontrol Çubuğu */}
            <div className="bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Doğrudan Tarayıcıda Çalıştırılabilir HTML5 Belgesi</span>
                <span className="text-stone-300">|</span>
                <span className="hidden md:inline">Tüm semantik etiketler standartlara tam uygundur</span>
              </div>

              {/* Semantik X-Ray Modu Toggle */}
              <button
                onClick={() => setXrayMode(!xrayMode)}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-all border ${
                  xrayMode
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
                title="HTML5 semantik etiket sınırlarını renkli kutular ve etiketlerle gösterir"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{xrayMode ? 'X-Ray Modu Aktif (Etiketler Açık)' : 'Semantik Etiketleri Vurgula (X-Ray)'}</span>
              </button>
            </div>

            {/* İframe veya Render Alanı */}
            <div className="flex-1 p-2 sm:p-6 flex justify-center">
              <div className="w-full max-w-5xl bg-white rounded-xl shadow-md border border-stone-200 overflow-hidden flex flex-col">
                
                {/* Sahte Tarayıcı Üst Çubuğu */}
                <div className="bg-stone-100 border-b border-stone-200 px-4 py-2.5 flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="flex-1 bg-white border border-stone-200 rounded-md px-3 py-1 text-xs text-stone-600 font-mono truncate flex items-center gap-2">
                    <span className="text-stone-400">file:///</span>
                    <span>proje/index.html</span>
                    <span className="text-stone-300">#</span>
                    <span className="text-orange-600">lezzet-duragi-bolum-sonu</span>
                  </div>
                  <a
                    href="/kodluyoruz_bolum_sonu_calismasi_index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-500 hover:text-stone-900 transition-colors p-1"
                    title="Yeni sekmede saf HTML olarak aç"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* İçerik Render Alanı (İster X-Ray ister Normal) */}
                <div className="flex-1 relative">
                  {xrayMode && (
                    <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 text-xs text-indigo-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Tag className="w-3.5 h-3.5 text-indigo-600" />
                        X-Ray Modu: Semantik etiketler renkli çerçeveler ve etiketlerle işaretlendi.
                      </span>
                      <span className="text-indigo-600 text-[11px]">
                        HTML5 Etiketleri: &lt;header&gt;, &lt;nav&gt;, &lt;main&gt;, &lt;section&gt;, &lt;article&gt;, &lt;figure&gt;, &lt;aside&gt;, &lt;footer&gt;
                      </span>
                    </div>
                  )}

                  {/* Tam Semantic HTML Sayfası */}
                  <div className={`p-4 sm:p-8 space-y-6 ${xrayMode ? 'xray-active' : ''}`}>
                    
                    {/* 1. HEADER */}
                    <div className={xrayMode ? 'relative border-2 border-dashed border-rose-500 p-2 rounded-lg' : ''}>
                      {xrayMode && (
                        <span className="absolute -top-3 left-3 bg-rose-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider z-10">
                          &lt;header&gt; &amp; &lt;nav&gt;
                        </span>
                      )}
                      
                      <header className="bg-white border-b border-stone-200 py-4 px-4 sm:px-6 rounded-lg shadow-xs">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <a href="#anasayfa" className="text-xl sm:text-2xl font-bold tracking-tight text-orange-700">
                            Lezzet<span className="text-stone-900">Durağı</span>
                          </a>
                          <nav aria-label="Ana Menü">
                            <ul className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm font-medium text-stone-600">
                              <li><a href="#anasayfa" className="hover:text-orange-700 transition-colors">Ana Sayfa</a></li>
                              <li><a href="#hakkimizda" className="hover:text-orange-700 transition-colors">Hakkımızda</a></li>
                              <li><a href="#menumuz" className="hover:text-orange-700 transition-colors">Menümüz</a></li>
                              <li><a href="#tarif" className="hover:text-orange-700 transition-colors">Özel Tarifimiz</a></li>
                              <li><a href="#iletisim" className="hover:text-orange-700 transition-colors">İletişim</a></li>
                            </ul>
                          </nav>
                        </div>
                      </header>
                    </div>

                    {/* 2. MAIN */}
                    <div className={xrayMode ? 'relative border-2 border-dashed border-blue-500 p-3 rounded-lg space-y-6' : 'space-y-6'}>
                      {xrayMode && (
                        <span className="absolute -top-3 left-3 bg-blue-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider z-10">
                          &lt;main class="container"&gt; (Sayfada Tek)
                        </span>
                      )}

                      {/* HERO BANNER */}
                      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 border border-orange-200 rounded-xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-7 space-y-4">
                          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange-950 leading-tight">
                            Geleneksel Lezzetler, Modern Dokunuşlar
                          </h1>
                          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                            <strong>Lezzet Durağı</strong>, 1998 yılından bu yana taze ve yerel malzemelerle hazırlanan enfes tarifleri sofralarınıza taşıyor. Enes Öztürk ile Kodluyoruz HTML eğitiminin incelikleriyle inşa edilen bu platformda en özel lezzetleri keşfedin.
                          </p>
                          <div>
                            <a
                              href="#menumuz"
                              className="inline-flex items-center gap-2 bg-orange-700 hover:bg-orange-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors shadow-xs"
                            >
                              Menüyü Keşfet &rarr;
                            </a>
                          </div>
                        </div>

                        {/* FIGURE & FIGCAPTION */}
                        <div className="md:col-span-5">
                          <div className={xrayMode ? 'relative border-2 border-dashed border-emerald-500 p-1.5 rounded-lg' : ''}>
                            {xrayMode && (
                              <span className="absolute -top-3 left-3 bg-emerald-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider z-10">
                                &lt;figure&gt; &amp; &lt;figcaption&gt;
                              </span>
                            )}
                            <figure className="space-y-2">
                              <svg className="w-full h-56 rounded-lg border-2 border-white shadow-md block object-cover" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lezzet Durağı Restoranı Sıcak Atmosferi">
                                <defs>
                                  <linearGradient id="restGlow2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#7c2d12"/>
                                    <stop offset="50%" stopColor="#c2410c"/>
                                    <stop offset="100%" stopColor="#431407"/>
                                  </linearGradient>
                                  <radialGradient id="lampGlow2" cx="50%" cy="30%" r="50%">
                                    <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.8"/>
                                    <stop offset="100%" stopColor="#c2410c" stopOpacity="0"/>
                                  </radialGradient>
                                </defs>
                                <rect width="400" height="250" fill="url(#restGlow2)"/>
                                <circle cx="200" cy="70" r="120" fill="url(#lampGlow2)"/>
                                <ellipse cx="200" cy="210" rx="140" ry="35" fill="#27272a"/>
                                <ellipse cx="200" cy="195" rx="70" ry="16" fill="#f4f4f5"/>
                                <circle cx="200" cy="193" r="14" fill="#c2410c"/>
                                <path d="M120 70 L140 160 L100 160 Z" fill="#ffedd5" opacity="0.3"/>
                                <circle cx="120" cy="65" r="8" fill="#fef08a"/>
                                <path d="M280 70 L300 160 L260 160 Z" fill="#ffedd5" opacity="0.3"/>
                                <circle cx="280" cy="65" r="8" fill="#fef08a"/>
                                <text x="200" y="115" fontFamily="system-ui, sans-serif" fontSize="20" fontWeight="bold" fill="#ffffff" textAnchor="middle">LEZZET DURAĞI</text>
                                <text x="200" y="140" fontFamily="system-ui, sans-serif" fontSize="12" fill="#fed7aa" textAnchor="middle">Artisan Restoran &amp; Gurme Mutfak</text>
                              </svg>
                              <figcaption className="text-xs text-center text-stone-500 italic">
                                Görsel 1: Lezzet Durağı'nın sıcak ve otantik akşam yemeği atmosferi.
                              </figcaption>
                            </figure>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 1: HAKKIMIZDA */}
                      <div className={xrayMode ? 'relative border-2 border-dashed border-amber-500 p-2 rounded-lg' : ''}>
                        {xrayMode && (
                          <span className="absolute -top-3 left-3 bg-amber-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider z-10">
                            &lt;section id="hakkimizda"&gt;
                          </span>
                        )}
                        <section id="hakkimizda" className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
                          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 border-b border-orange-100 pb-3">
                            Hakkımızda &amp; Hikayemiz
                          </h2>
                          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                            <strong>Lezzet Durağı</strong>, mutfak tutkusuyla yola çıkan üç yakın arkadaşın İstanbul Boğazı'nın kıyısında kurduğu butik bir gastronomi durağıdır. Misyonumuz, <em>"Her tabak bir hikaye anlatmalı"</em> felsefesini yaşatarak Anadolu'nun bin yıllık lezzet mirasını modern pişirme teknikleriyle buluşturmaktır.
                          </p>
                          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                            Restoranımızda kullanılan sebzeler her sabah yerel üreticilerden doğrudan temin edilmekte, ekşi mayalı ekmeklerimiz ise <time dateTime="05:30" className="font-semibold text-stone-900">sabah 05:30</time>'da taş fırınımızda özenle pişirilmektedir. Gıda güvenliğine verdiğimiz önemi ve şeffaf mutfak standartlarımızı resmi olarak belgeleyen{' '}
                            <a
                              href="https://www.tarimorman.gov.tr"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-700 underline font-medium hover:text-orange-900 inline-flex items-center gap-0.5"
                            >
                              T.C. Tarım ve Orman Bakanlığı Denetim Raporu
                              <ExternalLink className="w-3 h-3 ml-0.5" />
                            </a>{' '}
                            bağlantısından inceleyebilirsiniz.
                          </p>
                        </section>
                      </div>

                      {/* SECTION 2: MENÜ & ARTICLES */}
                      <div className={xrayMode ? 'relative border-2 border-dashed border-purple-500 p-2 rounded-lg' : ''}>
                        {xrayMode && (
                          <span className="absolute -top-3 left-3 bg-purple-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider z-10">
                            &lt;section id="menumuz"&gt;
                          </span>
                        )}
                        <section id="menumuz" className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
                          <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 border-b border-orange-100 pb-3">
                              Öne Çıkan Menümüz
                            </h2>
                            <p className="text-stone-600 text-sm mt-2">
                              Şefimizin bu mevsime özel olarak seçtiği gurme lezzetler:
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* ARTICLE 1 */}
                            <div className={xrayMode ? 'relative border-2 border-dashed border-teal-500 p-1.5 rounded-lg' : ''}>
                              {xrayMode && (
                                <span className="absolute -top-3 left-3 bg-teal-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider z-10">
                                  &lt;article&gt;
                                </span>
                              )}
                              <article className="bg-stone-50 border border-stone-200 rounded-lg p-5 space-y-3 h-full flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <h3 className="text-lg font-bold text-orange-950">
                                      Taş Fırında Dana İncik
                                    </h3>
                                    <span className="text-xs font-semibold px-2 py-0.5 bg-orange-100 text-orange-800 rounded">
                                      Şefin Tavsiyesi
                                    </span>
                                  </div>
                                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                                    12 saat boyunca meşe odunu közünde yavaşça pişirilmiş dana incik, kereviz püresi ve arpacık soğan karamelizasyonu ile servis edilir.
                                  </p>
                                </div>
                                <ul className="space-y-1 text-xs text-stone-700 border-t border-stone-200 pt-3">
                                  <li><strong>Porsiyon Gramajı:</strong> 420 gr</li>
                                  <li><strong>Alerjen Uyarısı:</strong> <em>Kereviz ve süt ürünü içerir.</em></li>
                                  <li><strong>Önerilen Eşlikçi:</strong> <mark className="bg-amber-200 px-1 rounded">Ev yapımı fıçı limonata</mark></li>
                                </ul>
                              </article>
                            </div>

                            {/* ARTICLE 2: İÇ İÇE SIRALI VE SIRASIZ LİSTELER */}
                            <div className={xrayMode ? 'relative border-2 border-dashed border-teal-500 p-1.5 rounded-lg' : ''}>
                              {xrayMode && (
                                <span className="absolute -top-3 left-3 bg-teal-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider z-10">
                                  &lt;article&gt; (&lt;ol&gt; &amp; &lt;ul&gt; İç İçe)
                                </span>
                              )}
                              <article className="bg-stone-50 border border-stone-200 rounded-lg p-5 space-y-3 h-full">
                                <h3 className="text-lg font-bold text-orange-950">
                                  3 Aşamalı Tadım Menüsü
                                </h3>
                                <p className="text-stone-600 text-xs sm:text-sm">
                                  Aşağıda masanıza sırasıyla servis edilecek özel tadım deneyimimiz yer almaktadır:
                                </p>
                                
                                {/* Sıralı Liste (<ol>) İçinde Sırasız Liste (<ul>) */}
                                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-stone-800">
                                  <li className="font-semibold text-stone-900">
                                    1. Aşama - Başlangıç Lezzetleri:
                                    <ul className="list-disc list-inside ml-4 mt-1 font-normal text-stone-600 space-y-0.5">
                                      <li>Köz patlıcan yatağında manda burrata</li>
                                      <li>Taze fesleğenli ve cevizli ezme salata</li>
                                      <li>Zeytinyağlı mini enginar kalbi</li>
                                    </ul>
                                  </li>
                                  <li className="font-semibold text-stone-900">
                                    2. Aşama - Ana Tabaklar:
                                    <ul className="list-disc list-inside ml-4 mt-1 font-normal text-stone-600 space-y-0.5">
                                      <li>Kömür ateşinde ızgara kaya levreği <em>(Rezene salatası ile)</em></li>
                                      <li>Ağır ateşte kuzu sırtı <em>(Trüf siyez bulguru ile)</em></li>
                                    </ul>
                                  </li>
                                  <li className="font-semibold text-stone-900">
                                    3. Aşama - Tatlı Sonu:
                                    <ul className="list-disc list-inside ml-4 mt-1 font-normal text-stone-600 space-y-0.5">
                                      <li>Belçika çikolatalı meşhur suflemiz</li>
                                      <li>Damla sakızlı fırın sütlaç</li>
                                    </ul>
                                  </li>
                                </ol>

                                <div className="text-xs text-stone-500 border-t border-stone-200 pt-2">
                                  Detaylı alerjen tablosu için{' '}
                                  <a
                                    href="https://www.kodluyoruz.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-700 underline font-medium hover:text-orange-900"
                                  >
                                    Kodluyoruz Web Geliştirme Kaynakları
                                  </a>'nı inceleyin.
                                </div>
                              </article>
                            </div>

                          </div>
                        </section>
                      </div>

                      {/* SECTION 3: ÖZEL TARİF (ÇİKOLATALI SUFLE - KODLUYORUZ KLASİĞİ) */}
                      <div className={xrayMode ? 'relative border-2 border-dashed border-pink-500 p-2 rounded-lg' : ''}>
                        {xrayMode && (
                          <span className="absolute -top-3 left-3 bg-pink-600 text-white font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider z-10">
                            &lt;section id="tarif"&gt;
                          </span>
                        )}
                        <section id="tarif" className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
                          <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 border-b border-orange-100 pb-3">
                              Mutfaktan Tarif: Şefin Çikolatalı Suflesi
                            </h2>
                            <p className="text-stone-600 text-sm mt-2">
                              Kodluyoruz HTML eğitiminde Enes Öztürk hocamızın da bahsettiği o meşhur akışkan çikolatalı sufle tarifi:
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Malzemeler: UL */}
                            <article className="bg-stone-50 border border-stone-200 rounded-lg p-5 space-y-3">
                              <h3 className="text-base font-bold text-orange-950 flex items-center justify-between">
                                <span>Gerekli Malzemeler</span>
                                <span className="font-mono text-xs text-stone-500 font-normal">&lt;ul&gt; Sırasız Liste</span>
                              </h3>
                              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-stone-700">
                                <li><strong>120 gr</strong> bitter çikolata (<em>en az %70 kakao</em>)</li>
                                <li><strong>80 gr</strong> tereyağı (oda sıcaklığında)</li>
                                <li><strong>3 adet</strong> organik yumurta</li>
                                <li><strong>50 gr</strong> toz şeker (yaklaşık yarım çay bardağı)</li>
                                <li><strong>2 yemek kaşığı</strong> elenmiş un</li>
                                <li>1 çimdik deniz tuzu</li>
                              </ul>
                            </article>

                            {/* Hazırlanışı: OL */}
                            <article className="bg-stone-50 border border-stone-200 rounded-lg p-5 space-y-3">
                              <h3 className="text-base font-bold text-orange-950 flex items-center justify-between">
                                <span>Adım Adım Hazırlanışı</span>
                                <span className="font-mono text-xs text-stone-500 font-normal">&lt;ol&gt; Sıralı Liste</span>
                              </h3>
                              <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-stone-700">
                                <li>Fırını önceden <strong>200°C</strong>'ye ayarlayın ve ısıtın.</li>
                                <li>Tereyağı ile bitter çikolatayı benmari usulü eritin.</li>
                                <li>Yumurtaları ve şekeri beyaz köpük olana kadar çırpın.</li>
                                <li>Ilıyan çikolatayı yumurtaya spatula ile yedirin.</li>
                                <li>Elenmiş un ve tuzu ekleyip homojen kıvama getirin.</li>
                                <li>Kaplara paylaştırıp tam <time dateTime="PT8M" className="font-semibold text-stone-900">8 dakika</time> pişirin.</li>
                                <li>Pudra şekeri serpip hemen sıcak servis edin!</li>
                              </ol>
                            </article>

                          </div>

                          {/* ASIDE (Şefin Püf Noktası) */}
                          <div className={xrayMode ? 'relative border-2 border-dashed border-amber-600 p-1.5 rounded-lg' : ''}>
                            {xrayMode && (
                              <span className="absolute -top-3 left-3 bg-amber-700 text-white font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider z-10">
                                &lt;aside&gt; (Yan Bilgi / Püf Noktası)
                              </span>
                            )}
                            <aside className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-1.5 text-amber-950">
                              <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-amber-900">
                                <span>💡 Şefin Püf Noktası (Semantic &lt;aside&gt;)</span>
                              </h4>
                              <p className="text-xs leading-relaxed text-amber-900">
                                Sufleyi fırından erken çıkarırsanız içi tamamen sıvı kalabilir, geç çıkarırsanız kekleşebilir. Kusursuz akışkanlık için kaplarınızı fırının orta rafına yerleştirin ve fırın kapağını ilk <strong>7 dakika</strong> boyunca kesinlikle açmayın!
                              </p>
                            </aside>
                          </div>

                        </section>
                      </div>

                    </div>

                    {/* 3. FOOTER */}
                    <div className={xrayMode ? 'relative border-2 border-dashed border-gray-600 p-2 rounded-lg' : ''}>
                      {xrayMode && (
                        <span className="absolute -top-3 left-3 bg-stone-700 text-white font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider z-10">
                          &lt;footer&gt; &amp; &lt;address&gt;
                        </span>
                      )}
                      <footer id="iletisim" className="bg-stone-900 text-stone-300 rounded-xl p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Kolon 1 */}
                          <div className="space-y-2">
                            <h4 className="text-base font-bold text-white">Lezzet Durağı Restoranı</h4>
                            <p className="text-xs text-stone-400 leading-relaxed">
                              Anadolu'nun geleneksel tatlarını modern gastronomi anlayışıyla buluşturan bağımsız aile işletmesi.
                            </p>
                          </div>

                          {/* Kolon 2 */}
                          <div className="space-y-2">
                            <h4 className="text-base font-bold text-white">Hızlı Bağlantılar</h4>
                            <nav aria-label="Alt Menü">
                              <ul className="space-y-1 text-xs text-stone-400">
                                <li><a href="#anasayfa" className="hover:text-white transition-colors">Ana Sayfa</a></li>
                                <li><a href="#hakkimizda" className="hover:text-white transition-colors">Hakkımızda</a></li>
                                <li><a href="#menumuz" className="hover:text-white transition-colors">Menü &amp; Fiyatlar</a></li>
                                <li><a href="#tarif" className="hover:text-white transition-colors">Sufle Tarifi</a></li>
                              </ul>
                            </nav>
                          </div>

                          {/* Kolon 3: Address */}
                          <div className="space-y-2">
                            <h4 className="text-base font-bold text-white">Bize Ulaşın</h4>
                            <address className="not-italic text-xs text-stone-400 space-y-1">
                              <p><strong>Adres:</strong> Çengelköy Cad. No: 42, Üsküdar / İstanbul</p>
                              <p><strong>Telefon:</strong> <a href="tel:+902165550198" className="hover:text-white underline">+90 (216) 555 01 98</a></p>
                              <p><strong>E-Posta:</strong> <a href="mailto:info@lezzetduragi.com" className="hover:text-white underline">info@lezzetduragi.com</a></p>
                              <p><strong>Çalışma Saatleri:</strong> Salı - Pazar 11:30 - 23:00</p>
                            </address>
                          </div>

                        </div>

                        {/* Copyright */}
                        <div className="border-t border-stone-800 pt-4 text-center text-xs text-stone-500">
                          <p>
                            &copy; 2026 Lezzet Durağı. Tüm hakları saklıdır. Bu proje,{' '}
                            <a href="https://www.kodluyoruz.org" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline hover:text-orange-300">
                              Kodluyoruz
                            </a>{' '}
                            Frontend Web Geliştirme Patikası <strong>HTML Bölüm Sonu Çalışması</strong> (Eğitmen: Enes Öztürk) kapsamında hazırlanmıştır.
                          </p>
                        </div>
                      </footer>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INDEX.HTML KODU */}
        {activeTab === 'code' && (
          <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-4">
            <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-orange-600" />
                  index.html - Tam Bağımsız Çalıştırılabilir Kod
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Harici hiçbir kütüphaneye veya sunucuya ihtiyaç duymadan, herhangi bir tarayıcıda doğrudan çift tıklayarak açabilirsiniz.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                    copied
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-stone-900 text-white hover:bg-stone-800 border-stone-900'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Panoya Kopyalandı!' : 'Tüm Kodu Kopyala'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>index.html İndir</span>
                </button>
              </div>
            </div>

            {/* Kod Görüntüleyici */}
            <div className="bg-stone-950 text-stone-100 rounded-xl border border-stone-800 overflow-hidden shadow-lg font-mono text-xs sm:text-sm">
              <div className="bg-stone-900 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>UTF-8 · HTML5 · 338 Satır Kod</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Doğrulanmış W3C &amp; Kodluyoruz Standartları
                </span>
              </div>
              <pre className="p-4 sm:p-6 overflow-x-auto max-h-[650px] leading-relaxed selection:bg-orange-600 selection:text-white">
                <code>{PURE_HTML_CODE}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: SEMANTİK HTML REHBERİ */}
        {activeTab === 'guide' && (
          <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
            
            {/* Üst Bilgilendirme Kartı */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Enes Öztürk - Kodluyoruz HTML Eğitimi Temel İlkeleri</span>
              </div>
              <h2 className="text-xl font-bold text-stone-900">
                Neden &quot;div çorbası&quot; yerine Semantik HTML Etiketleri Kullanmalıyız?
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                Eski web geliştirmede her şey <code>&lt;div class=&quot;header&quot;&gt;</code> veya <code>&lt;div class=&quot;footer&quot;&gt;</code> ile yapılıyordu. HTML5 ile gelen anlamsal (semantic) etiketler ise tarayıcılara, arama motoru botlarına (SEO) ve görme engelli kullanıcıların kullandığı ekran okuyuculara (Screen Readers / Accessibility) sayfanın hangi kısmının ne amaçla orada olduğunu söyler.
              </p>
            </div>

            {/* Etiket Listesi Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SEMANTIC_TAGS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTag(item)}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-base font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {item.tag}
                      </span>
                      <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700">
                      {item.desc}
                    </p>
                    <div className="bg-amber-50/70 border border-amber-200/60 rounded-md p-2.5 text-xs text-amber-950">
                      <strong>💡 Enes Hoca Notu:</strong> {item.enesHocaNote}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-orange-600 font-medium">
                    <span>Kod Örneğini İncele</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Kontrol Listesi & Ödev Değerlendirme Tablosu */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Kodluyoruz Ödev Kriterleri Kontrol Listesi
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    1. Semantik İskelet
                  </div>
                  <p className="text-emerald-800">&lt;header&gt;, &lt;nav&gt;, &lt;main&gt;, &lt;section&gt;, &lt;article&gt;, &lt;footer&gt; eksiksiz uygulandı.</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    2. Sayfa İçi Navigasyon
                  </div>
                  <p className="text-emerald-800">&lt;nav&gt; ve &lt;ul&gt; ile #id bağlantılı sayfa içi menü oluşturuldu.</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    3. Başlık Hiyerarşisi
                  </div>
                  <p className="text-emerald-800">&lt;h1&gt;, &lt;h2&gt;, &lt;h3&gt; etiketleri doğru derinlik ve sırada kullanıldı.</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    4. Görsel ve Açıklama
                  </div>
                  <p className="text-emerald-800">&lt;figure&gt;, &lt;figcaption&gt; ve alt açıklamasıyla çerçevelenmiş görsel eklendi.</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    5. İç İçe Listeler
                  </div>
                  <p className="text-emerald-800">&lt;ol&gt; sıralı adımları ve &lt;ul&gt; sırasız malzeme listeleri harmanlandı.</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    6. Blok &amp; Satır İçi Uyum
                  </div>
                  <p className="text-emerald-800">&lt;strong&gt;, &lt;em&gt;, &lt;mark&gt;, &lt;time&gt;, &lt;address&gt; inline öğeleri doğru yerleştirildi.</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Modal: Etiket Detay İncelemesi */}
      {selectedTag && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                {selectedTag.tag}
              </span>
              <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-1 rounded">
                {selectedTag.type}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-stone-900">Ne İşe Yarar?</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {selectedTag.desc}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-950 space-y-1">
              <span className="font-bold">Eğitmen Önerisi (Enes Öztürk):</span>
              <p>{selectedTag.enesHocaNote}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-stone-700">Örnek Kullanım Kodu:</span>
              <pre className="bg-stone-900 text-stone-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                <code>{selectedTag.example}</code>
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTag(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alt Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 px-4 text-center text-xs text-stone-500">
        <p>
          Kodluyoruz Frontend Web Geliştirme Eğitimi · Bölüm Sonu Çalışması · Enes Öztürk Standardı
        </p>
      </footer>
    </div>
  );
}
