// Uygulama durumu
let currentLevel = 1;
let completedLevels = 0;
let userProgress = {};
let unlockedLevels = {1: true}; // Sadece ilk seviye açık başlasın

// Global değişkenleri window nesnesine ekle
window.currentLevel = currentLevel;
window.completedLevels = completedLevels;
window.userProgress = userProgress;
window.unlockedLevels = unlockedLevels;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Veritabanını başlat
    initDatabase();
    
    // Tüm şemaları göster
    updateSchemaDisplay();
    
    // İlk seviyeyi göster
    showLevel(window.currentLevel);
    
    // Kullanıcı ilerlemesini yükle
    loadUserProgress();
    
    // Seviye seçiciyi oluştur
    createLevelSelector();
    
    // Event listener'ları ekle - HTML'deki inline onclick'ler kaldırıldığından
    // buradaki event listener'lar çalışacak
    const runQueryBtn = document.getElementById('run-query');
    if (runQueryBtn) {
        runQueryBtn.addEventListener('click', runUserQuery);
        console.log("run-query butonuna event listener eklendi");
    } else {
        console.error("run-query butonu bulunamadı!");
    }
    
    const showSolutionBtn = document.getElementById('show-solution');
    if (showSolutionBtn) {
        showSolutionBtn.addEventListener('click', showSolution);
        console.log("show-solution butonuna event listener eklendi");
    } else {
        console.error("show-solution butonu bulunamadı!");
    }
    
    const nextLevelBtn = document.getElementById('next-level');
    if (nextLevelBtn) {
        nextLevelBtn.addEventListener('click', goToNextLevel);
        console.log("next-level butonuna event listener eklendi");
    } else {
        console.error("next-level butonu bulunamadı!");
    }
    
    console.log("Uygulama başlatıldı, event listener'lar eklendi.");
});

// Kullanıcı sorgusunu çalıştır
function runUserQuery() {
    console.log("runUserQuery fonksiyonu çağrıldı");
    
    // window.currentLevel tanımlı değilse, 1 olarak ayarla
    if (typeof window.currentLevel === 'undefined') {
        console.warn("window.currentLevel tanımlı değil, 1 olarak ayarlanıyor");
        window.currentLevel = 1;
    }
    
    console.log("Mevcut seviye:", window.currentLevel);
    
    // CodeMirror editörü var mı kontrol et
    if (!window.editor) {
        console.error("CodeMirror editörü bulunamadı!");
        return;
    }
    
    const query = window.editor.getValue();
    console.log("Sorgu:", query);
    
    if (!query.trim()) {
        console.log("Boş sorgu, işlem yapılmadı");
        return;
    }
    
    // Mevcut seviyeyi bul
    const level = levels.find(l => l.id === window.currentLevel);
    if (!level) {
        console.error("Seviye bulunamadı:", window.currentLevel);
        return;
    }
    
    // Sorguyu çalıştır
    try {
        const result = runQuery(query);
        console.log("Sorgu sonucu:", result);
        
        // Sorguyu doğrula
        let feedback = null;
        
        if (result.success) {
            feedback = validateQuery(query, level.expectedQuery, level.validation, result.data);
            console.log("Doğrulama sonucu:", feedback);
            
            // Seviye tamamlandıysa bir sonraki seviyeye geç
            if (feedback.valid) {
                // Sonucu ve geri bildirimi göster
                displayQueryResult(result, query, feedback);
                
                // Tüm seviyeleri sıralayıp mevcut seviyeden sonrakini bul
                const sortedLevels = [...levels].sort((a, b) => a.id - b.id);
                const currentIndex = sortedLevels.findIndex(l => l.id === window.currentLevel);
                
                if (currentIndex !== -1 && currentIndex < sortedLevels.length - 1) {
                    // Bir sonraki seviyeye geç (1.5 saniye sonra)
                    setTimeout(function() {
                        // Bir sonraki seviyeyi seç
                        const nextLevel = sortedLevels[currentIndex + 1];
                        window.currentLevel = nextLevel.id;
                        console.log("Sonraki seviyeye geçiliyor:", window.currentLevel);
                        
                        // Yeni seviyeyi göster
                        showLevel(window.currentLevel);
                        
                        console.log("Seviye değiştirildi:", window.currentLevel);
                    }, 100);
                } else {
                    // Tüm seviyeler tamamlandı
                    console.log("Tüm seviyeler tamamlandı");
                    
                    // Final mesajı göster
                    const historyContainer = document.getElementById('query-history');
                    if (historyContainer) {
                        const finalMessage = document.createElement('div');
                        finalMessage.className = 'history-item success';
                        finalMessage.innerHTML = `
                            <div class="query-feedback success">
                                <h3>🎉 Tebrikler! Veri Kurtarma Operasyonunu Başarıyla Tamamladınız! 🎉</h3>
                                <p>TechCorp'un veritabanını başarıyla kurtardınız ve düzelttiniz. Şirket yönetimi ve müşteriler size minnettardır.</p>
                                <p>SQL becerileriniz sayesinde kritik veriler kurtarıldı ve şirket faaliyetlerine devam edebilecek.</p>
                            </div>
                        `;
                        historyContainer.appendChild(finalMessage);
                        historyContainer.scrollTop = historyContainer.scrollHeight;
                    }
                }
                
                return; // İşlemi burada sonlandır, SQL editörünü temizlemeye gerek yok
            }
        } else {
            // Hata durumunda geri bildirim oluştur
            feedback = {
                valid: false,
                message: `Hata: ${result.error}`
            };
        }
        
        // Sonucu ve geri bildirimi göster
        displayQueryResult(result, query, feedback);
        
    } catch (error) {
        console.error("Sorgu çalıştırılırken hata:", error);
    }
    
    // SQL editörünü temizle
    window.editor.setValue('');
}

// Çözümü göster
function showSolution() {
    console.log("showSolution fonksiyonu çağrıldı");
    console.log("Mevcut seviye:", window.currentLevel);
    
    // Mevcut seviyeyi bul
    const level = levels.find(l => l.id === window.currentLevel);
    
    if (!level) {
        console.error("Seviye bulunamadı:", window.currentLevel);
        return;
    }
    
    if (window.editor) {
        window.editor.setValue(level.expectedQuery);
        console.log("Çözüm gösteriliyor:", level.expectedQuery);
    } else {
        console.error("Editor bulunamadı!");
    }
}

// Sonraki seviyeye geç
function goToNextLevel() {
    console.log("goToNextLevel fonksiyonu çağrıldı, mevcut seviye:", window.currentLevel);
    
    // window.currentLevel tanımlı değilse, 1 olarak ayarla
    if (typeof window.currentLevel === 'undefined') {
        console.warn("window.currentLevel tanımlı değil, 1 olarak ayarlanıyor");
        window.currentLevel = 1;
    }
    
    if (window.currentLevel < levels.length) {
        window.currentLevel++;
        console.log("Yeni seviye:", window.currentLevel);
        
        try {
            showLevel(window.currentLevel);
            updateLevelSelector();
            // Sonraki seviye butonunu devre dışı bırak
            const nextLevelBtn = document.getElementById('next-level');
            if (nextLevelBtn) {
                nextLevelBtn.disabled = true;
            }
            console.log("Seviye başarıyla değiştirildi:", window.currentLevel);
        } catch (error) {
            console.error("Seviye gösterilirken hata:", error);
        }
    } else {
        console.log("Tüm seviyeler tamamlandı");
    }
}

// Kullanıcı ilerlemesini yükle
function loadUserProgress() {
    const savedProgress = localStorage.getItem('sqlDetectiveProgress');
    if (savedProgress) {
        try {
            const saved = JSON.parse(savedProgress);
            userProgress = saved.progress || {};
            unlockedLevels = saved.unlocked || {1: true};
            
            completedLevels = Object.keys(userProgress).length;
            updateProgress(completedLevels);
            updateLevelSelector(); // İlerleme durumunu güncellerken seviye seçiciyi de güncelle
        } catch (e) {
            console.error('İlerleme yüklenirken hata oluştu:', e);
            userProgress = {};
            unlockedLevels = {1: true};
            completedLevels = 0;
        }
    }
}

// Kullanıcı ilerlemesini kaydet
function saveUserProgress() {
    localStorage.setItem('sqlDetectiveProgress', JSON.stringify({
        progress: userProgress,
        unlocked: unlockedLevels
    }));
}

// Seviye listesini güncelle
function updateLevelList() {
    const levelListItems = document.querySelectorAll('#level-list li');
    
    levelListItems.forEach(li => {
        const levelId = parseInt(li.dataset.levelId);
        
        // Seviye kilitli mi?
        if (unlockedLevels[levelId]) {
            li.classList.remove('locked');
            li.title = `Seviye ${levelId}`;
        } else {
            li.classList.add('locked');
            li.title = "Bu seviye henüz kilitli";
        }
        
        // Seviye tamamlandı mı?
        if (userProgress[levelId]) {
            li.classList.add('completed');
        } else {
            li.classList.remove('completed');
        }
    });
}

// Seviye seçicisini oluştur
function createLevelSelector() {
    console.log("createLevelSelector fonksiyonu çağrıldı");
    
    const levelSelector = document.getElementById('level-selector');
    if (!levelSelector) {
        console.error("level-selector elementi bulunamadı!");
        return;
    }
    
    // Mevcut butonları temizle
    levelSelector.innerHTML = '';
    
    // Her seviye için buton oluştur
    levels.forEach(level => {
        const levelButton = document.createElement('button');
        levelButton.className = 'level-btn';
        levelButton.dataset.levelId = level.id;
        levelButton.textContent = level.id;
        levelButton.title = level.title || `Seviye ${level.id}`;
        
        // Seviye kilitliyse
        if (!unlockedLevels[level.id]) {
            levelButton.classList.add('locked');
            levelButton.disabled = true;
        }
        
        // Tıklama olayı ekle
        levelButton.addEventListener('click', function() {
            if (unlockedLevels[level.id]) {
                window.currentLevel = level.id;
                showLevel(level.id);
                updateLevelSelector();
            }
        });
        
        levelSelector.appendChild(levelButton);
    });
    
    console.log("Seviye seçici oluşturuldu");
}

// Seviye seçicisini güncelle
function updateLevelSelector() {
    console.log("updateLevelSelector fonksiyonu çağrıldı");
    
    // Seviye listesi elementlerini bul
    const levelSelector = document.getElementById('level-selector');
    if (!levelSelector) {
        console.warn("level-selector elementi bulunamadı, seviye seçici güncellenmedi");
        return;
    }
    
    // Seçici boşsa, butonları oluştur
    if (levelSelector.children.length === 0) {
        createLevelSelector();
        return;
    }
    
    // Tüm seviye butonlarını güncelle
    const levelButtons = levelSelector.querySelectorAll('.level-btn');
    levelButtons.forEach(button => {
        const levelId = parseFloat(button.dataset.levelId);
        
        // Seviye tamamlandı mı?
        if (userProgress[levelId]) {
            button.classList.add('completed');
        } else {
            button.classList.remove('completed');
        }
        
        // Seviye kilitli mi?
        if (unlockedLevels[levelId]) {
            button.classList.remove('locked');
            button.disabled = false;
        } else {
            button.classList.add('locked');
            button.disabled = true;
        }
        
        // Mevcut seviye mi?
        if (levelId === window.currentLevel) {
            button.classList.add('current');
        } else {
            button.classList.remove('current');
        }
    });
    
    console.log("Seviye seçici güncellendi");
}

// Seviyeyi göster
function showLevel(levelId) {
    console.log("showLevel fonksiyonu çağrıldı, seviye:", levelId);
    
    // Sol panele animasyon ekle
    const leftPanel = document.querySelector('.left-panel');
    if (leftPanel) {
        leftPanel.classList.add('level-change-animation');
        setTimeout(() => {
            leftPanel.classList.remove('level-change-animation');
        }, 1500);
    }
    
    // Seviyeyi bul
    const level = levels.find(l => l.id === levelId);
    if (!level) {
        console.error("Seviye bulunamadı:", levelId);
        return;
    }
    
    // Seviye başlığını güncelle
    const levelTitle = document.getElementById('level-title');
    if (levelTitle) {
        levelTitle.textContent = level.title || `Seviye ${level.id}`;
    }
    
    // Seviye açıklamasını güncelle
    const levelDescription = document.getElementById('level-description');
    if (levelDescription) {
        levelDescription.textContent = level.description || "";
    }
    
    // Görevi güncelle
    const levelTask = document.getElementById('level-task');
    if (levelTask) {
        levelTask.textContent = level.task || "";
    }
    
    // İpucunu güncelle
    const levelHint = document.getElementById('level-hint');
    if (levelHint) {
        levelHint.textContent = level.hint || "";
    }
    
    // SQL editörünü temizle
    if (window.editor) {
        window.editor.setValue('');
    }
    
    // Mevcut seviyeyi güncelle
    window.currentLevel = levelId;
    
    console.log("Seviye başarıyla gösterildi:", level.title);
}

// Sayfa yüklendiğinde
window.onload = function() {
    console.log("window.onload çalıştı");
}; 