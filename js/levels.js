// Seviyeler ve beklenen sorgular
const levels = [
    {
        id: 1,
        title: "Seviye 1: Veri Keşfi",
        description: "TechCorp şirketinin veritabanı bir siber saldırı sonucu zarar görmüş. Veri güvenliği ekibi olarak göreviniz, verileri kurtarmak ve düzeltmek. İlk adım olarak, mevcut verileri incelemeniz gerekiyor.",
        task: "Müşteriler tablosundaki tüm verileri görüntüleyerek durumu değerlendirin.",
        hint: "SELECT * FROM tableName komutu, bir tablodaki tüm verileri görüntülemek için kullanılır.",
        expectedQuery: "SELECT * FROM musteriler",
        validation: function(query, results) {
            return results && results.length > 0;
        }
    },
    {
        id: 2,
        title: "Seviye 2: Kayıp E-postalar",
        description: "Saldırganlar bazı müşterilerin e-posta adreslerini silmiş. Bu müşterileri tespit etmeniz gerekiyor ki onlarla iletişime geçilebilsin.",
        task: "E-posta adresi eksik olan (NULL) müşterileri bulun.",
        hint: "WHERE koşulu ile NULL değerleri kontrol etmek için IS NULL operatörünü kullanabilirsiniz.",
        expectedQuery: "SELECT * FROM musteriler WHERE email IS NULL",
        validation: function(query, results) {
            const hasIsNull = query.toUpperCase().includes("IS NULL");
            const hasEmail = query.toLowerCase().includes("email");
            return hasIsNull && hasEmail;
        }
    },
    {
        id: 3,
        title: "Seviye 3: E-posta Güncelleme",
        description: "Kayıp e-posta adreslerini şirket kayıtlarından buldunuz. Şimdi veritabanını güncelleyerek bu bilgileri eklemeniz gerekiyor.",
        task: "ID'si 3 olan müşterinin e-posta adresini 'mehmet.demir@techcorp.com' olarak güncelleyin.",
        hint: "UPDATE komutu ile verileri güncelleyebilirsiniz. WHERE koşulu ile hangi kaydı güncelleyeceğinizi belirtin.",
        expectedQuery: "UPDATE musteriler SET email = 'mehmet.demir@techcorp.com' WHERE id = 3",
        validation: function(query, results) {
            const hasUpdate = query.toUpperCase().includes("UPDATE");
            const hasSet = query.toUpperCase().includes("SET");
            const hasEmail = query.includes("mehmet.demir@techcorp.com");
            const hasWhere = query.toUpperCase().includes("WHERE");
            const hasId = query.includes("id = 3");
            return hasUpdate && hasSet && hasEmail && hasWhere && hasId;
        },
        postExecution: function() {
            // E-posta adresini güncelle
            try {
                alasql("UPDATE musteriler SET email = 'mehmet.demir@techcorp.com' WHERE id = 3");
                return true;
            } catch (error) {
                console.error("E-posta güncellenirken hata:", error);
                return false;
            }
        }
    },
    {
        id: 4,
        title: "Seviye 4: Bozuk Fiyatlar",
        description: "Saldırganlar sipariş fiyatlarını değiştirmiş. Bazı ürünlerin fiyatları anormal derecede yüksek veya düşük görünüyor.",
        task: "Fiyatı 10000 TL'den yüksek olan siparişleri bulun. Bu değerler muhtemelen manipüle edilmiş.",
        hint: "WHERE koşulu ile fiyat filtrelemesi yapabilirsiniz.",
        expectedQuery: "SELECT * FROM siparisler WHERE fiyat > 10000",
        validation: function(query, results) {
            const hasWhere = query.toUpperCase().includes("WHERE");
            const hasGreaterThan = query.includes(">");
            const hasValue = query.includes("10000");
            return hasWhere && hasGreaterThan && hasValue;
        }
    },
    {
        id: 5,
        title: "Seviye 5: Fiyat Düzeltme",
        description: "Manipüle edilmiş fiyatları düzeltmeniz gerekiyor. Orijinal fiyat kayıtlarına göre, ID'si 7 olan siparişin doğru fiyatı 300 TL olmalı.",
        task: "ID'si 7 olan siparişin fiyatını 300 TL olarak güncelleyin.",
        hint: "UPDATE komutu ile fiyatı güncelleyebilirsiniz.",
        expectedQuery: "UPDATE siparisler SET fiyat = 300 WHERE id = 7",
        validation: function(query, results) {
            const hasUpdate = query.toUpperCase().includes("UPDATE");
            const hasSet = query.toUpperCase().includes("SET");
            const hasFiyat = query.toLowerCase().includes("fiyat");
            const hasValue = query.includes("300");
            const hasWhere = query.toUpperCase().includes("WHERE");
            const hasId = query.includes("id = 7");
            return hasUpdate && hasSet && hasFiyat && hasValue && hasWhere && hasId;
        },
        postExecution: function() {
            // Fiyatı güncelle
            try {
                alasql("UPDATE siparisler SET fiyat = 300 WHERE id = 7");
                return true;
            } catch (error) {
                console.error("Fiyat güncellenirken hata:", error);
                return false;
            }
        }
    },
    {
        id: 6,
        title: "Seviye 6: Kayıp Sipariş",
        description: "Bazı siparişlerin tamamen silindiği tespit edildi. Yedeklerden bir siparişi geri yüklemeniz gerekiyor.",
        task: "Yeni bir sipariş ekleyin: müşteri_id=5, ürün_id=8, miktar=1, fiyat=1500, siparis_tarihi='2022-04-10'",
        hint: "INSERT INTO komutu ile yeni kayıt ekleyebilirsiniz.",
        expectedQuery: "INSERT INTO siparisler (musteri_id, urun_id, miktar, fiyat, siparis_tarihi) VALUES (5, 8, 1, 1500, '2022-04-10')",
        validation: function(query, results) {
            const hasInsert = query.toUpperCase().includes("INSERT INTO");
            const hasValues = query.toUpperCase().includes("VALUES");
            const hasMusteri = query.includes("5");
            const hasUrun = query.includes("8");
            const hasMiktar = query.includes("1");
            const hasFiyat = query.includes("1500");
            const hasTarih = query.includes("2022-04-10");
            return hasInsert && hasValues && hasMusteri && hasUrun && hasMiktar && hasFiyat && hasTarih;
        },
        postExecution: function() {
            // Yeni sipariş ekle
            try {
                alasql("INSERT INTO siparisler (id, musteri_id, urun_id, miktar, fiyat, siparis_tarihi) VALUES (13, 5, 8, 1, 1500, '2022-04-10')");
                return true;
            } catch (error) {
                console.error("Sipariş eklenirken hata:", error);
                return false;
            }
        }
    },
    {
        id: 7,
        title: "Seviye 7: Sahte Müşteri",
        description: "Saldırganlar sisteme sahte bir müşteri kaydı eklemiş. Bu kaydı tespit edip silmeniz gerekiyor.",
        task: "E-posta adresi 'hacker@evil.com' olan müşteriyi silin.",
        hint: "DELETE FROM komutu ile kayıt silebilirsiniz. WHERE koşulu ile hangi kaydı sileceğinizi belirtin.",
        expectedQuery: "DELETE FROM musteriler WHERE email = 'hacker@evil.com'",
        validation: function(query, results) {
            const hasDelete = query.toUpperCase().includes("DELETE FROM");
            const hasWhere = query.toUpperCase().includes("WHERE");
            const hasEmail = query.includes("hacker@evil.com");
            return hasDelete && hasWhere && hasEmail;
        },
        preExecution: function() {
            // Sahte müşteri ekle
            try {
                alasql("INSERT INTO musteriler (id, ad, soyad, email, kayit_tarihi) VALUES (9, 'Sahte', 'Kullanıcı', 'hacker@evil.com', '2023-01-01')");
                return true;
            } catch (error) {
                console.error("Sahte müşteri eklenirken hata:", error);
                return false;
            }
        },
        postExecution: function() {
            // Sahte müşteriyi sil
            try {
                alasql("DELETE FROM musteriler WHERE email = 'hacker@evil.com'");
                return true;
            } catch (error) {
                console.error("Sahte müşteri silinirken hata:", error);
                return false;
            }
        }
    },
    {
        id: 8,
        title: "Seviye 8: Veri Tutarsızlığı",
        description: "Bazı siparişlerin müşteri ID'leri değiştirilmiş ve artık mevcut müşterilerle eşleşmiyor. Bu tutarsızlıkları tespit etmeniz gerekiyor.",
        task: "Mevcut olmayan müşteri ID'lerine sahip siparişleri bulun (LEFT JOIN ve IS NULL kullanarak).",
        hint: "LEFT JOIN ile siparişleri müşterilerle eşleştirin ve müşteri bilgisi NULL olanları filtrelemek için IS NULL kullanın.",
        expectedQuery: "SELECT s.* FROM siparisler s LEFT JOIN musteriler m ON s.musteri_id = m.id WHERE m.id IS NULL",
        validation: function(query, results) {
            const hasLeftJoin = query.toUpperCase().includes("LEFT JOIN");
            const hasIsNull = query.toUpperCase().includes("IS NULL");
            return hasLeftJoin && hasIsNull;
        },
        preExecution: function() {
            // Tutarsız sipariş ekle
            try {
                alasql("INSERT INTO siparisler (id, musteri_id, urun_id, miktar, fiyat, siparis_tarihi) VALUES (14, 99, 1, 1, 1000, '2022-06-01')");
                return true;
            } catch (error) {
                console.error("Tutarsız sipariş eklenirken hata:", error);
                return false;
            }
        }
    },
    {
        id: 9,
        title: "Seviye 9: Veri Düzeltme",
        description: "Tutarsız siparişleri düzeltmeniz gerekiyor. ID'si 14 olan siparişin müşteri ID'sini geçerli bir müşteri ID'si ile değiştirin.",
        task: "ID'si 14 olan siparişin müşteri ID'sini 8 olarak güncelleyin.",
        hint: "UPDATE komutu ile müşteri ID'sini güncelleyebilirsiniz.",
        expectedQuery: "UPDATE siparisler SET musteri_id = 8 WHERE id = 14",
        validation: function(query, results) {
            const hasUpdate = query.toUpperCase().includes("UPDATE");
            const hasSet = query.toUpperCase().includes("SET");
            const hasMusteri = query.toLowerCase().includes("musteri_id");
            const hasValue = query.includes("8");
            const hasWhere = query.toUpperCase().includes("WHERE");
            const hasId = query.includes("id = 14");
            return hasUpdate && hasSet && hasMusteri && hasValue && hasWhere && hasId;
        },
        postExecution: function() {
            // Müşteri ID'sini güncelle
            try {
                alasql("UPDATE siparisler SET musteri_id = 8 WHERE id = 14");
                return true;
            } catch (error) {
                console.error("Müşteri ID'si güncellenirken hata:", error);
                return false;
            }
        }
    },
    {
        id: 10,
        title: "Seviye 10: Veri Analizi",
        description: "Veritabanı düzeltildikten sonra, şirket yönetimine sunmak üzere kapsamlı bir rapor hazırlamak.",
        task: "Her müşterinin adını, soyadını ve toplam harcamasını (fiyat * miktar) hesaplayın ve toplam harcamaya göre azalan sırada listeleyin.",
        hint: "JOIN, GROUP BY ve SUM fonksiyonlarını kullanarak toplam harcamayı hesaplayabilirsiniz.",
        expectedQuery: "SELECT m.ad, m.soyad, SUM(s.fiyat * s.miktar) AS toplam_harcama FROM musteriler m JOIN siparisler s ON m.id = s.musteri_id GROUP BY m.id, m.ad, m.soyad ORDER BY toplam_harcama DESC",
        validation: function(query, results) {
            const hasJoin = query.toUpperCase().includes("JOIN");
            const hasGroupBy = query.toUpperCase().includes("GROUP BY");
            const hasSum = query.toUpperCase().includes("SUM");
            const hasOrderBy = query.toUpperCase().includes("ORDER BY");
            return hasJoin && hasGroupBy && hasSum && hasOrderBy;
        }
    },
    {
        id: 11,
        title: "Seviye 11: Veri Yedekleme",
        description: "Veritabanı düzeltme işlemi tamamlandı. Şimdi gelecekteki sorunlara karşı bir yedekleme stratejisi oluşturmanız gerekiyor. İlk adım olarak, müşteri verilerini yeni bir tabloya yedekleyin.",
        task: "Müşteriler tablosunun bir kopyasını 'musteriler_yedek' adında yeni bir tablo olarak oluşturun.",
        hint: "Önce CREATE TABLE ile boş bir tablo oluşturun, sonra INSERT INTO ile verileri kopyalayın.",
        expectedQuery: "CREATE TABLE musteriler_yedek (id INT, ad VARCHAR(50), soyad VARCHAR(50), email VARCHAR(100), kayit_tarihi DATE)",
        validation: function(query, results) {
            const hasCreate = query.toUpperCase().includes("CREATE TABLE");
            const hasYedek = query.toLowerCase().includes("musteriler_yedek");
            return hasCreate && hasYedek;
        },
        postExecution: function() {
            // Yedek tablo oluştur
            try {
                alasql("CREATE TABLE musteriler_yedek (id INT, ad VARCHAR(50), soyad VARCHAR(50), email VARCHAR(100), kayit_tarihi DATE)");
                return true;
            } catch (error) {
                console.error("Yedek tablo oluşturulurken hata:", error);
                return false;
            }
        }
    },
    {
        id: 11.5,
        title: "Seviye 11.5: Veri Kopyalama",
        description: "Yedek tablo oluşturuldu. Şimdi müşteri verilerini bu tabloya kopyalamanız gerekiyor.",
        task: "Müşteriler tablosundaki tüm verileri yeni oluşturduğunuz musteriler_yedek tablosuna kopyalayın.",
        hint: "INSERT INTO ... SELECT ... FROM ... komutu ile bir tablodan diğerine veri kopyalayabilirsiniz.",
        expectedQuery: "INSERT INTO musteriler_yedek SELECT * FROM musteriler",
        validation: function(query, results) {
            const hasInsert = query.toUpperCase().includes("INSERT INTO");
            const hasSelect = query.toUpperCase().includes("SELECT");
            const hasFrom = query.toUpperCase().includes("FROM");
            const hasYedek = query.toLowerCase().includes("musteriler_yedek");
            const hasMusteriler = query.toLowerCase().includes("musteriler");
            return hasInsert && hasSelect && hasFrom && hasYedek && hasMusteriler;
        },
        postExecution: function() {
            // Verileri kopyala
            try {
                alasql("INSERT INTO musteriler_yedek SELECT * FROM musteriler");
                return true;
            } catch (error) {
                console.error("Veriler kopyalanırken hata:", error);
                return false;
            }
        }
    },
    {
        id: 12,
        title: "Seviye 12: Final Raporu",
        description: "Tebrikler! Veritabanını başarıyla kurtardınız ve düzelttiniz. Son göreviniz, şirket yönetimine sunmak üzere kapsamlı bir rapor hazırlamak.",
        task: "Müşterilerin adını, soyadını, sipariş sayısını, toplam harcamasını ve en son sipariş tarihini içeren bir rapor oluşturun.",
        hint: "JOIN, GROUP BY, COUNT, SUM ve MAX fonksiyonlarını kullanarak raporu oluşturabilirsiniz.",
        expectedQuery: "SELECT m.ad, m.soyad, COUNT(s.id) AS siparis_sayisi, SUM(s.fiyat * s.miktar) AS toplam_harcama, MAX(s.siparis_tarihi) AS son_siparis_tarihi FROM musteriler m LEFT JOIN siparisler s ON m.id = s.musteri_id GROUP BY m.id, m.ad, m.soyad ORDER BY toplam_harcama DESC",
        validation: function(query, results) {
            const hasJoin = query.toUpperCase().includes("JOIN");
            const hasGroupBy = query.toUpperCase().includes("GROUP BY");
            const hasCount = query.toUpperCase().includes("COUNT");
            const hasSum = query.toUpperCase().includes("SUM");
            const hasMax = query.toUpperCase().includes("MAX");
            return hasJoin && hasGroupBy && hasCount && hasSum && hasMax;
        }
    }
];

// Seviyelerin ID'lerini kontrol et ve düzelt
console.log("Seviyeler:", levels);

// Seviyelerin ID'lerini düzelt
for (let i = 0; i < levels.length; i++) {
    levels[i].id = i + 1;
}

console.log("Düzeltilmiş seviyeler:", levels);

// Seviyeleri yükle
function loadLevels() {
    // Toplam seviye sayısını güncelle
    document.getElementById('total-levels').textContent = levels.length;
}

// Seviyeyi göster
function showLevel(levelId) {
    console.log("Seviye gösteriliyor:", levelId);
    const level = levels.find(l => l.id === levelId);
    if (!level) {
        console.error("Seviye bulunamadı:", levelId);
        return;
    }
    
    // Seviye başlığını güncelle
    document.getElementById('current-level-title').textContent = level.title;
    
    // Seviye açıklamasını güncelle
    document.getElementById('level-description').textContent = level.description;
    
    // Görevi güncelle
    document.getElementById('current-task').textContent = level.task;
    
    // İpucunu güncelle
    document.getElementById('level-hint').textContent = level.hint;
    
    // SQL editörünü temizle
    if (window.editor) {
        window.editor.setValue('');
    }
    
    // Geri bildirim alanını temizle
    const feedbackElement = document.getElementById('query-feedback');
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback-area';
    
    // Sonraki seviye butonunu devre dışı bırak
    document.getElementById('next-level').disabled = true;
    
    // İlerleme durumunu güncelle
    updateProgress(completedLevels);
    
    console.log("Seviye başarıyla gösterildi:", level.title);
}

// Şema görüntüleme fonksiyonu - tüm tabloları göster
function updateSchemaDisplay() {
    console.log("Şema görüntüleniyor");
    
    // Sol paneldeki şema
    const schemaDisplay = document.getElementById('schema-display');
    // Sağ paneldeki şema
    const rightSchemaDisplay = document.getElementById('right-schema-display');
    
    let schemaHTML = '';
    
    // Tüm tabloları göster
    const allTables = {
        tables: ["musteriler", "urunler", "siparisler"],
        details: {
            musteriler: ["id (INT)", "ad (VARCHAR)", "soyad (VARCHAR)", "email (VARCHAR)", "kayit_tarihi (DATE)"],
            urunler: ["id (INT)", "ad (VARCHAR)", "kategori (VARCHAR)", "stok (INT)", "fiyat (DECIMAL)"],
            siparisler: ["id (INT)", "musteri_id (INT)", "urun_id (INT)", "miktar (INT)", "fiyat (DECIMAL)", "siparis_tarihi (DATE)"]
        }
    };
    
    allTables.tables.forEach(tableName => {
        schemaHTML += `
            <div class="schema-table">
                <div class="schema-table-name">${tableName}</div>
                <div class="schema-columns">
                    ${allTables.details[tableName].map(column => `<div>${column}</div>`).join('')}
                </div>
            </div>
        `;
    });
    
    // Her iki şema görüntüleme alanını da güncelle
    if (schemaDisplay) {
        schemaDisplay.innerHTML = schemaHTML;
    }
    
    if (rightSchemaDisplay) {
        rightSchemaDisplay.innerHTML = schemaHTML;
    }
    
    console.log("Şema başarıyla görüntülendi");
}

// Seviye ID'lerini güncelle
for (let i = 12; i < levels.length; i++) {
    levels[i].id = i + 0.5;
} 