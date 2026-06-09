<a href="README.md">
 <img src="https://img.shields.io/badge/Language-English-blue?style=flat-square&logo=google-translate&logoColor=white" alt="English">
</a>
<a href="README-TR.md">
 <img src="https://img.shields.io/badge/Dil-Türkçe-red?style=flat-square&logo=google-translate&logoColor=white" alt="Türkçe">
</a>

  <br />
  <br />

<div align="center">
  <img src="app/icon.svg" width="120" height="120" alt="Wynncraft Logo" />
  <br />
  <br />

  <p>
    Wynncraft istatistik, guild ve oyuncu analiz platformu.
  </p>

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide-FF69B4?style=for-the-badge&logo=lucide&logoColor=white)
![Wynncraft API](https://img.shields.io/badge/Wynncraft_API_v3-6495ED?style=for-the-badge)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

  <p>    
    <a href="#modules">Modüller</a> •
    <a href="#technologies">Teknolojiler</a> •
    <a href="#installation">Kurulum</a> •
    <a href="#license">Lisans</a>
  </p>

  <br />
  <br />
</div>

## 📷 Demo Link

- [https://wynncraft-explorer.vercel.app/](https://wynncraft-explorer.vercel.app/)

## 📋 Hakkında

**Wynncraft Explorer**, popüler Minecraft MMORPG'si Wynncraft için geliştirilmiş modern ve hızlı bir veri analiz platformudur. Next.js, React, TypeScript ve modern web teknolojileri ile inşa edilmiş olup; oyuncular, karakterler, guild'ler, sınıflar (classes), yetenek ağaçları (ability trees) ve liderlik tabloları (leaderboards) hakkında detaylı istatistikleri resmi Wynncraft API'si aracılığıyla incelemek için zengin ve estetik bir arayüz sunar. Proje; güçlü bir TypeScript tabanlı mimari ve Next.js App Router kullanarak performansa, güvenilirliğe ve akıcı bir kullanıcı deneyimine odaklanır.

## 📦 Modüller <a id="modules"></a>

### 👤 Oyuncu Modülü (`app/player/`)

Oyuncu istatistiklerini, gelişimini ve ekipmanlarını gösteren, projenin en temel modülüdür.

- **`player/[uuid]`**: Belirli bir oyuncunun genel istatistiklerini içerir; katılım tarihi, rank, guild bilgisi, toplam oyun süresi ve skor/durum verileri.
- **`player/[uuid]/characters`**: Oyuncunun sahip olduğu karakterleri (Mage, Archer, Warrior vb.) tek bir sayfada özet verilerle listeler.
- **`player/[uuid]/characters/[characterUuid]`**: Belirli bir karakterin derinlemesine ve mikro düzeyde analizini kapsar. Temel savaş seviyelerini, meslekleri (Mining, Woodcutting, Crafting gibi toplama/üretim seviyeleri), tamamlanan zindan (dungeon) ve görev (quest) istatistiklerini ve varsa yetenek puanı dağılımlarını listeler.

<details>
  <summary>📸 Ekran Görüntüleri</summary>
  <br />
  <img src="md/20260415095527746.jpg" width="300" /> <img src="md/20260415095527814.jpg" width="300" />
</details>

### 🛡️ Guild Modülü (`app/guilds/`)

Sunucudaki devasa guild sistemini ekranlara taşıyan, yüksek etkileşimli guild araştırma bölümleridir.

- **`guilds/`**: Ana guild portalı. Sistemde kayıtlı popüler veya aranan guild'leri listeler (`GuildListClient` arayüzünü kullanır).
- **`guilds/[name]`**: Belirli bir guild'in tüm istatistikleridir. Guild üye listesini (`GuildMemberListClient`), bu üyelerin rütbelerini _(Owner, Chief, Strategist, Captain, Recruiter, Recruit)_, guild seviyesini, XP miktarlarını ve genel gelişim metriklerini içerir.
- **`guilds/territories/`**: Guild'ler tarafından ele geçirilen bölgeleri (territories) incelemek veya listelemek için kullanılan alandır.
- **`guilds/prefix/`**: Guild'leri tam adı yerine kısaltma önekleriyle (örneğin "ANO") hızlıca bulmayı sağlayan alt rotadır.

<details>
  <summary>📸 Ekran Görüntüleri</summary>
  <br />
  <img src="md/20260415095528005.jpg" width="300" /> <img src="md/20260415095527881.jpg" width="300" />
  <br />
  <br />
  <img src="md/20260415095527939.jpg" width="300" />
</details>

### ⚔️ Sınıf ve Yetenek Sistemi (`app/classes/`)

Wynncraft'ın karmaşık karakter sınıf şablonlarını inceler.

- **`classes/`**: Oyundaki mevcut ana sınıfları ve bunların işleme mekanizmalarını listeleyen temel bilgi yapısıdır.
- **`classes/[className]`**: Seçilen sınıfa özel detaylı görünümler sunar (Archer/Hunter, Warrior/Knight vb.). Sınıflara ait temel yetenekleri ve gelişimleri içeren şablon bilgileri gösterilir.

<details>
  <summary>📸 Ekran Görüntüleri</summary>
  <br />
  <img src="md/20260415095528122.jpg" width="300" /> <img src="md/20260415095528066.jpg" width="300" />
</details>

### 🏆 Liderlik Tabloları (`app/leaderboards/`)

- **`leaderboards/`**: Oyundaki tüm liderlik tablolarının listesidir.
- **`leaderboards/[type]`**: Oyuncuların ve guild'lerin farklı kategorilerdeki genel rekabet durumunu yansıtır. "PvP", "Combat" veya "Guild" tabanlı küresel rekor sıralamaları alt rotalar aracılığıyla getirilir.

<details>
  <summary>📸 Ekran Görüntüleri</summary>
  <br />
  <img src="md/20260415095528204.jpg" width="300" /> <img src="md/20260415095528264.jpg" width="300" />
</details>

### 📰 Haberler (`app/news/`)

- Wynncraft yönetimi tarafından yayınlanan genel sunucu duyurularının ve güncelleme notlarının listelenmesini ve okunmasını sağlar.

<details>
  <summary>📸 Ekran Görüntüleri</summary>
  <br />
  <img src="md/20260415095528343.jpg" width="300" />
</details>

## 🛠️ Teknolojiler <a id="technologies"></a>

- **Next.js**: Optimum performans için App Router ve Server Components kullanan modern React framework'ü.
- **React 19**: Eşzamanlı (concurrent) render etme ve sunucu eylemlerini (server actions) içeren temel kullanıcı arayüzü kütüphanesi.
- **Tailwind CSS**: Hızlı ve modern duyarlı (responsive) tasarım için utility-first CSS framework'ü.
- **Lucide Icons**: Modern web arayüzleri için güzel ve tutarlı SVG ikon kütüphanesi.
- **TypeScript**: Güvenilir ve ölçeklenebilir geliştirme için JavaScript üzerine inşa edilmiş strongly typed (güçlü tipli) programlama dili.
- **Wynncraft API v3**: Gerçek zamanlı oyun verilerini, oyuncuları ve guild'leri çekmek için kullanılan resmi genel servis.

## 🚀 Kurulum <a id="installation"></a>

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz.

1. **Depoyu Klonlayın**

   ```bash
   git clone https://github.com/xkintaro/wynncraft-explorer.git
   cd wynncraft-explorer
   ```

2. **Bağımlılıkları Yükleyin**

   ```bash
   npm install
   ```

3. **Geliştirme Sunucusunu Başlatın**

   ```bash
   npm run dev
   ```

   Uygulama arka planda derlenecek ve varsayılan olarak **`http://localhost:3000`** adresinde erişilebilir olacaktır.

## 🔌 API / Servis Entegrasyonları (`api/` Klasörü)

Verileri güvenli ve modüler bir yapıda kullanıcı arayüzüne besleyen iş zekası / servis katmanımızdır. İstekler bu noktada işlenerek Client veya Server Component'lere sunulur:

- **`wynnClient.ts`**: Tüm API verilerinin çekildiği ve uç nokta (endpoint) yollarının yapılandırıldığı temel fetch (bağlantı) aracı.
- **`playerService.ts`**: Oyuncu profillerini ve UUID arama işlevlerini yöneten servis katmanı.
- **`guildService.ts`**: Guild ile ilgili verileri (üye detayları, XP, bölgeler) çeken özel istek yöneticisi.
- **`classService.ts` & `abilityService.ts`**: Oyun içi sınıf yeteneklerini modelleyen servis yapıları.
- **`leaderboardsService.ts` & `newsService.ts`**: Liderlik tabloları ve haber isteklerini yürüten API bağlayıcıları.

## 📄 Yasal Uyarı ve Lisans <a id="license"></a>

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. Topluluğun yararına açık kaynak kodlu olarak geliştirilmektedir. Wynncraft oyun verileri, isim hakları ve oyun içi materyaller tamamen **Wynncraft LLC**'ye aittir. Bu web sayfası resmi bir Wynncraft ürünü değildir.

#

<p align="center">
  <sub>❤️ Developed by "Mustafa TAŞAL" (kintaro)</sub>
</p>
