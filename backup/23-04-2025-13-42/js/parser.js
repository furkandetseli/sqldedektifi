// SQL sorgusunu doğrula
function validateQuery(query, expectedQuery, validationFunction, results) {
    console.log("Sorgu doğrulanıyor:", query);
    console.log("Beklenen sorgu:", expectedQuery);
    
    // Sorgu boş ise
    if (!query.trim()) {
        return {
            valid: false,
            message: "Lütfen bir SQL sorgusu girin."
        };
    }
    
    // Özel doğrulama fonksiyonu varsa kullan
    if (validationFunction && typeof validationFunction === 'function') {
        if (validationFunction(query, results)) {
            return {
                valid: true,
                message: "Sorgunuz doğru! Tebrikler!"
            };
        } else {
            return {
                valid: false,
                message: "Sorgunuz beklenen sonucu vermedi. Lütfen tekrar deneyin."
            };
        }
    }
    
    // Basit string karşılaştırması
    const normalizedQuery = query.trim().replace(/\s+/g, ' ').toLowerCase();
    const normalizedExpected = expectedQuery.trim().replace(/\s+/g, ' ').toLowerCase();
    
    if (normalizedQuery === normalizedExpected) {
        return {
            valid: true,
            message: "Sorgunuz doğru! Tebrikler!"
        };
    } else {
        return {
            valid: false,
            message: "Sorgunuz beklenen sorguyla eşleşmiyor. Lütfen tekrar deneyin."
        };
    }
}

// Sorgu sonuçlarını tablo olarak formatla
function formatResultsAsTable(results) {
    if (!results || results.length === 0) {
        return "<p>Sorgu sonucunda hiç veri bulunamadı.</p>";
    }
    
    let html = '<table class="result-table">';
    
    // Tablo başlıkları
    html += '<tr>';
    for (const key in results[0]) {
        html += `<th>${key}</th>`;
    }
    html += '</tr>';
    
    // Tablo verileri
    results.forEach(row => {
        html += '<tr>';
        for (const key in row) {
            const value = row[key] === null ? 'NULL' : row[key];
            html += `<td>${value}</td>`;
        }
        html += '</tr>';
    });
    
    html += '</table>';
    return html;
} 