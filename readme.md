# 🚀 Gulp Modern Front-end Workflow

Bu proje; **Pug**, **Sass**, **TypeScript** ve gelişmiş görüntü optimizasyonu özelliklerini barındıran, otomatikleştirilmiş bir front-end geliştirme ortamıdır.

## ✨ Özellikler

* **Pug (Jade):** HTML şablonlama ile daha temiz ve hızlı yapı.
* **Sass:** Modern CSS özellikleri, otomatik prefix (`-webkit-` vb.) ve küçültme (minify).
* **TypeScript:** Statik tipleme ile hatasız JavaScript yazımı ve ES6+ desteği.
* **Görüntü İşleme:** Görselleri otomatik olarak **WebP** formatına çevirme ve kayıpsız sıkıştırma.
* **Sourcemaps:** Tarayıcı üzerinden orijinal `.sass` ve `.ts` dosyalarında kolayca hata ayıklama.
* **Notify:** Derleme sırasındaki hataları bildirim olarak verir.
* **Watch Mode:** Siz dosyayı kaydettiğiniz anda her şey otomatik olarak derlenir.

---

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükleme
Terminali projenin kök dizininde açın ve şu komutu çalıştırın:
```bash
npm install

### Eğer ana dizinde tsconfig.json dosyanız yoksa oluşturmak için:
npx tsc --init

### Çalıştırmadan önce şu paketlerin yüklü olduğundan emin ol: 
npm install gulp gulp-cli sass gulp-sass gulp-clean-css gulp-autoprefixer gulp-pug gulp-typescript gulp-terser gulp-if gulp-sharp-optimize-images gulp-plumber gulp-sourcemaps gulp-notify --save-dev

### Geliştirme sürecini başlatmak, tüm dosyaları derlemek ve izlemeye (watch) almak için terminale yazın:
npx gulp