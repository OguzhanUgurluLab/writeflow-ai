
---

## 📌 ADIM 3: GitHub'a Push

Terminal'de proje klasöründe (`C:\Users\ugurl\Projeler\writeflow-ai`):

### Yeni repo oluşturuyorsan:

**Önce GitHub'da repo oluştur:**
1. https://github.com/new aç
2. Repository name: `writeflow-ai`
3. Public seç
4. **README, .gitignore, license EKLEME** (zaten var)
5. Create repository

**Sonra terminal'de:**

```bash
# Git başlat (eğer başlatılmadıysa)
git init

# Tüm dosyaları ekle
git add .

# Commit
git commit -m "feat: complete WriteFlow AI SaaS with auth, AI generation, history, and settings"

# Branch ismi
git branch -M main

# Remote ekle (URL'yi kendi repo URL'inle değiştir!)
git remote add origin https://github.com/KULLANICI_ADIN/writeflow-ai.git

# Push
git push -u origin main