// UI ile ilgili fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    console.log("UI başlatılıyor...");
    
    // CodeMirror editörünü başlat
    try {
        window.editor = CodeMirror.fromTextArea(document.getElementById('sql-query'), {
            mode: 'text/x-sql',
            theme: 'dracula',
            lineNumbers: true,
            indentWithTabs: true,
            smartIndent: true,
            lineWrapping: true,
            matchBrackets: true,
            autofocus: true,
            placeholder: "SQL sorgunuzu buraya yazın...",
            extraKeys: {
                "Ctrl-Enter": function(cm) {
                    console.log("Ctrl+Enter tuşuna basıldı");
                    runUserQuery();
                }
            }
        });
        
        // Editör yüksekliğini ayarla
        window.editor.setSize(null, 200);
        console.log("CodeMirror editörü başarıyla başlatıldı");
    } catch (error) {
        console.error("CodeMirror editörü başlatılırken hata:", error);
    }
    
    // Mobil navigasyonu kur
    setupMobileNavigation();
});

// Sorgu geçmişini sakla
let queryHistory = [];

// Sorgu sonucunu göster
function displayQueryResult(result, query, feedback = null) {
    console.log("displayQueryResult fonksiyonu çağrıldı");
    
    const historyContainer = document.getElementById('query-history');
    if (!historyContainer) {
        console.error("query-history elementi bulunamadı!");
        return;
    }
    
    // Yeni bir geçmiş öğesi oluştur
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    // Sorgu başarılı mı?
    if (result.success) {
        historyItem.classList.add('success');
    } else {
        historyItem.classList.add('error');
    }
    
    // Sorgu metni
    const queryText = document.createElement('div');
    queryText.className = 'query-text';
    queryText.innerHTML = `<pre>${query}</pre>`;
    historyItem.appendChild(queryText);
    
    // Sorgu sonucu
    const queryResult = document.createElement('div');
    queryResult.className = 'query-result';
    
    if (result.success) {
        if (Array.isArray(result.data) && result.data.length > 0) {
            queryResult.innerHTML = formatResultsAsTable(result.data);
        } else if (Array.isArray(result.data) && result.data.length === 0) {
            queryResult.innerHTML = "<p>Sorgu sonucunda hiç veri bulunamadı.</p>";
        } else {
            queryResult.innerHTML = `<p>Sorgu başarıyla çalıştırıldı. Etkilenen satır sayısı: ${result.data}</p>`;
        }
    } else {
        queryResult.innerHTML = `<p class="error">Hata: ${result.error}</p>`;
    }
    
    historyItem.appendChild(queryResult);
    
    // Geri bildirim varsa ekle
    if (feedback) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'query-feedback';
        
        if (feedback.valid) {
            feedbackDiv.classList.add('success');
            feedbackDiv.innerHTML = `<p>✅ ${feedback.message}</p>`;
        } else {
            feedbackDiv.classList.add('error');
            feedbackDiv.innerHTML = `<p>❌ ${feedback.message}</p>`;
        }
        
        historyItem.appendChild(feedbackDiv);
    }
    
    // Zaman damgası
    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    const now = new Date();
    timestamp.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    historyItem.appendChild(timestamp);
    
    // Geçmiş öğesini geçmiş konteynerine ekle
    historyContainer.appendChild(historyItem);
    
    // Geçmişi en son öğeye kaydır
    historyContainer.scrollTop = historyContainer.scrollHeight;
    
    // Geçmişi sakla
    queryHistory.push({
        query: query,
        result: result,
        feedback: feedback,
        timestamp: now
    });
    
    console.log("Sorgu sonucu başarıyla gösterildi");
}

// Geri bildirim göster
function displayFeedback(feedback) {
    console.log("displayFeedback fonksiyonu çağrıldı:", feedback);
    
    // Sonraki seviye butonunu güncelle
    if (feedback && feedback.valid) {
        const nextLevelButton = document.getElementById('next-level');
        if (nextLevelButton) {
            nextLevelButton.disabled = false;
        }
    }
}

// İlerleme durumunu güncelle
function updateProgress(completedLevels) {
    console.log("updateProgress fonksiyonu çağrıldı:", completedLevels);
    
    const totalLevels = levels.length;
    const percentage = Math.round((completedLevels / totalLevels) * 100);
    
    const completedElement = document.getElementById('completed-levels');
    if (completedElement) {
        completedElement.textContent = completedLevels;
    }
    
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    const percentageElement = document.getElementById('progress-percentage');
    if (percentageElement) {
        percentageElement.textContent = `${percentage}%`;
    }
}

// Seviye değiştiğinde geçmişi temizle
function clearHistory() {
    const historyContainer = document.getElementById('query-history');
    historyContainer.innerHTML = '';
    queryHistory = [];
}

// Seviyeyi göster
function showLevel(levelId) {
    console.log("showLevel fonksiyonu çağrıldı, seviye:", levelId);
    
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
        console.log("Seviye başlığı güncellendi:", level.title);
    } else {
        console.warn("level-title elementi bulunamadı, oluşturuluyor...");
        const levelInfoDiv = document.querySelector('.level-info');
        if (levelInfoDiv) {
            const titleElement = document.createElement('h2');
            titleElement.id = 'level-title';
            titleElement.textContent = level.title || `Seviye ${level.id}`;
            levelInfoDiv.prepend(titleElement);
            console.log("level-title elementi oluşturuldu");
        }
    }
    
    // Seviye açıklamasını güncelle
    const levelDescription = document.getElementById('level-description');
    if (levelDescription) {
        levelDescription.textContent = level.description || "";
        console.log("Seviye açıklaması güncellendi:", level.description);
    } else {
        console.warn("level-description elementi bulunamadı, oluşturuluyor...");
        const levelInfoDiv = document.querySelector('.level-info');
        if (levelInfoDiv) {
            const descElement = document.createElement('p');
            descElement.id = 'level-description';
            descElement.textContent = level.description || "";
            levelInfoDiv.insertBefore(descElement, levelInfoDiv.children[1]);
            console.log("level-description elementi oluşturuldu");
        }
    }
    
    // Görevi güncelle
    const levelTask = document.getElementById('level-task');
    if (levelTask) {
        levelTask.textContent = level.task || "";
        console.log("Görev güncellendi:", level.task);
    } else {
        console.warn("level-task elementi bulunamadı, oluşturuluyor...");
        const taskContainer = document.querySelector('.task-container');
        if (taskContainer) {
            const taskElement = document.createElement('p');
            taskElement.id = 'level-task';
            taskElement.textContent = level.task || "";
            taskContainer.appendChild(taskElement);
            console.log("level-task elementi oluşturuldu");
        }
    }
    
    // İpucunu güncelle
    const levelHint = document.getElementById('level-hint');
    if (levelHint) {
        levelHint.textContent = level.hint || "";
        console.log("İpucu güncellendi:", level.hint);
    } else {
        console.warn("level-hint elementi bulunamadı, oluşturuluyor...");
        const hintContainer = document.querySelector('.hint-container');
        if (hintContainer) {
            const hintElement = document.createElement('p');
            hintElement.id = 'level-hint';
            hintElement.textContent = level.hint || "";
            hintContainer.appendChild(hintElement);
            console.log("level-hint elementi oluşturuldu");
        }
    }
    
    // Seviye numarasını güncelle
    const levelNumber = document.getElementById('level-number');
    if (levelNumber) {
        levelNumber.textContent = level.id;
        console.log("Seviye numarası güncellendi:", level.id);
    } else {
        console.warn("level-number elementi bulunamadı, oluşturuluyor...");
        const levelNumberContainer = document.querySelector('.level-number-container');
        if (levelNumberContainer) {
            const numberElement = document.createElement('span');
            numberElement.id = 'level-number';
            numberElement.textContent = level.id;
            levelNumberContainer.appendChild(numberElement);
            console.log("level-number elementi oluşturuldu");
        }
    }
    
    // Mevcut seviyeyi güncelle
    window.currentLevel = levelId;
    
    console.log("Seviye başarıyla gösterildi:", level.title);
}

// Mobil navigasyon
function setupMobileNavigation() {
    // Mobil olup olmadığını kontrol et
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) return;
    
    // Mobil navigasyon HTML'ini oluştur
    const mobileNavHTML = `
        <div class="mobile-nav">
            <div class="mobile-nav-tab active" data-target="left-panel">Görev</div>
            <div class="mobile-nav-tab" data-target="center-panel">Sorgu Geçmişi</div>
            <div class="mobile-nav-tab database-tab" data-target="right-panel">Veritabanı</div>
        </div>
    `;
    
    // Mobil navigasyonu ekle
    document.querySelector('.main-content').insertAdjacentHTML('beforeend', mobileNavHTML);
    
    // Tab geçişi için olay dinleyicileri ekle
    document.querySelectorAll('.mobile-nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetPanel = this.getAttribute('data-target');
            
            // Tüm tabları inaktif yap
            document.querySelectorAll('.mobile-nav-tab').forEach(t => t.classList.remove('active'));
            
            // Tıklanan tabı aktif yap
            this.classList.add('active');
            
            // Tüm panelleri gizle
            document.querySelector('.left-panel').classList.add('hidden');
            document.querySelector('.center-panel').classList.remove('visible');
            document.querySelector('.right-panel').classList.remove('visible');
            
            // Hedef paneli göster
            if (targetPanel === 'left-panel') {
                document.querySelector('.left-panel').classList.remove('hidden');
            } else if (targetPanel === 'center-panel') {
                document.querySelector('.center-panel').classList.add('visible');
            } else if (targetPanel === 'right-panel') {
                document.querySelector('.right-panel').classList.add('visible');
            }
        });
    });
}

// Pencere boyutu değiştiğinde mobil navigasyonu tekrar kur
window.addEventListener('resize', function() {
    // Mevcut mobil navigasyonu kaldır
    const existingNav = document.querySelector('.mobile-nav');
    if (existingNav) {
        existingNav.remove();
    }
    
    // Mobil navigasyonu tekrar kur
    setupMobileNavigation();
}); 