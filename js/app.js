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
    
    // Event listener'ları ekle
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
            
            // Seviye tamamlandıysa ilerlemeyi kaydet
            if (feedback.valid && !userProgress[window.currentLevel]) {
                userProgress[window.currentLevel] = true;
                completedLevels++;
                updateProgress(completedLevels);
                saveUserProgress();
                
                // Sonraki seviyeyi aç
                if (window.currentLevel < levels.length) {
                    const nextLevelId = window.currentLevel + 1;
                    unlockedLevels[nextLevelId] = true;
                    saveUserProgress();
                    
                    // Seviye seçiciyi güncelle
                    updateLevelSelector();
                    
                    // Sonraki seviyeye geç (1.5 saniye sonra)
                    setTimeout(function() {
                        // Bir sonraki seviyeye geç
                        window.currentLevel = nextLevelId;
                        
                        // Yeni seviyeyi göster
                        showLevel(window.currentLevel);
                        
                        // Seviye seçiciyi güncelle
                        updateLevelSelector();
                        
                        console.log("Sonraki seviyeye geçildi:", window.currentLevel);
                    }, 1500);
                } else {
                    // Tüm seviyeler tamamlandı
                    console.log("Tüm seviyeler tamamlandı");
                    
                    // Final mesajı göster (sadece tüm seviyeler tamamlandığında)
                    if (completedLevels >= levels.length) {
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
                }
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
    const level = levels.find(l => l.id === currentLevel);
    if (level && window.editor) {
        window.editor.setValue(level.expectedQuery);
        // Otomatik çalıştırma kaldırıldı
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

// Diğer fonksiyonlar... 

// Sayfa yüklendiğinde
window.onload = function() {
    console.log("window.onload çalıştı");
}; 