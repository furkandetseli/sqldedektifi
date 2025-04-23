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
            
            // Seviye tamamlandıysa otomatik olarak sonraki seviyeye geç
            if (feedback.valid) {
                // Sonucu ve geri bildirimi göster
                displayQueryResult(result, query, feedback);
                
                // Sonraki seviyeye geç (1 saniye sonra)
                if (window.currentLevel < levels.length) {
                    setTimeout(function() {
                        // Bir sonraki seviyeye geç
                        window.currentLevel++;
                        
                        // Yeni seviyeyi bul
                        const newLevel = levels.find(l => l.id === window.currentLevel);
                        if (!newLevel) {
                            console.error("Sonraki seviye bulunamadı:", window.currentLevel);
                            return;
                        }
                        
                        // Seviye başlığını güncelle
                        const titleElement = document.getElementById('level-title');
                        if (titleElement) {
                            titleElement.textContent = newLevel.title;
                            console.log("Seviye başlığı güncellendi:", newLevel.title);
                        } else {
                            console.error("level-title elementi bulunamadı!");
                        }
                        
                        // Seviye açıklamasını güncelle
                        const descElement = document.getElementById('level-description');
                        if (descElement) {
                            descElement.textContent = newLevel.description;
                            console.log("Seviye açıklaması güncellendi:", newLevel.description);
                        } else {
                            console.error("level-description elementi bulunamadı!");
                        }
                        
                        // Görevi güncelle
                        const taskElement = document.getElementById('level-task');
                        if (taskElement) {
                            taskElement.textContent = newLevel.task;
                            console.log("Görev güncellendi:", newLevel.task);
                        } else {
                            console.error("level-task elementi bulunamadı!");
                        }
                        
                        // İpucunu güncelle
                        const hintElement = document.getElementById('level-hint');
                        if (hintElement) {
                            hintElement.textContent = newLevel.hint;
                            console.log("İpucu güncellendi:", newLevel.hint);
                        } else {
                            console.error("level-hint elementi bulunamadı!");
                        }
                        
                        console.log("Sonraki seviyeye geçildi:", window.currentLevel);
                    }, 1000);
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
                
                // SQL editörünü temizle
                window.editor.setValue('');
                return;
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

// Seviyeyi göster (ui.js içindeki fonksiyona alternatif)
function showLevel(levelId) {
    console.log("showLevel fonksiyonu çağrıldı, seviye:", levelId);
    
    // Seviyeyi bul
    const level = levels.find(l => l.id === levelId);
    if (!level) {
        console.error("Seviye bulunamadı:", levelId);
        return;
    }
    
    // Seviye başlığını güncelle
    const titleElement = document.getElementById('level-title');
    if (titleElement) {
        titleElement.textContent = level.title;
        console.log("Seviye başlığı güncellendi:", level.title);
    } else {
        console.error("level-title elementi bulunamadı!");
    }
    
    // Seviye açıklamasını güncelle
    const descElement = document.getElementById('level-description');
    if (descElement) {
        descElement.textContent = level.description;
        console.log("Seviye açıklaması güncellendi:", level.description);
    } else {
        console.error("level-description elementi bulunamadı!");
    }
    
    // Görevi güncelle
    const taskElement = document.getElementById('level-task');
    if (taskElement) {
        taskElement.textContent = level.task;
        console.log("Görev güncellendi:", level.task);
    } else {
        console.error("level-task elementi bulunamadı!");
    }
    
    // İpucunu güncelle
    const hintElement = document.getElementById('level-hint');
    if (hintElement) {
        hintElement.textContent = level.hint;
        console.log("İpucu güncellendi:", level.hint);
    } else {
        console.error("level-hint elementi bulunamadı!");
    }
    
    // SQL editörünü temizle
    if (window.editor) {
        window.editor.setValue('');
    }
    
    // Mevcut seviyeyi güncelle
    window.currentLevel = levelId;
    
    console.log("Seviye başarıyla gösterildi:", level.title);
} 