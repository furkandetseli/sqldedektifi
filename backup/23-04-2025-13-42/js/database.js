// Veritabanı ve tabloları oluştur
function initDatabase() {
    console.log("Veritabanı başlatılıyor...");
    try {
        // Alasql veritabanını oluştur
        alasql('CREATE DATABASE IF NOT EXISTS sqldedektifi');
        alasql('USE sqldedektifi');
        
        // Tabloları temizle (eğer varsa)
        alasql('DROP TABLE IF EXISTS musteriler');
        alasql('DROP TABLE IF EXISTS urunler');
        alasql('DROP TABLE IF EXISTS siparisler');
        alasql('DROP TABLE IF EXISTS musteriler_yedek');
        
        // Müşteriler tablosunu oluştur
        alasql(`
            CREATE TABLE musteriler (
                id INT PRIMARY KEY,
                ad VARCHAR(50),
                soyad VARCHAR(50),
                email VARCHAR(100),
                kayit_tarihi DATE
            )
        `);
        
        // Ürünler tablosunu oluştur
        alasql(`
            CREATE TABLE urunler (
                id INT PRIMARY KEY,
                ad VARCHAR(100),
                kategori VARCHAR(50),
                stok INT,
                fiyat DECIMAL(10,2)
            )
        `);
        
        // Siparişler tablosunu oluştur
        alasql(`
            CREATE TABLE siparisler (
                id INT PRIMARY KEY,
                musteri_id INT,
                urun_id INT,
                miktar INT,
                fiyat DECIMAL(10,2),
                siparis_tarihi DATE
            )
        `);
        
        // Müşteri verilerini ekle
        alasql(`
            INSERT INTO musteriler VALUES
            (1, 'Ali', 'Yılmaz', 'ali.yilmaz@email.com', '2020-01-15'),
            (2, 'Ayşe', 'Kaya', 'ayse.kaya@email.com', '2020-02-20'),
            (3, 'Mehmet', 'Demir', NULL, '2020-03-10'),
            (4, 'Fatma', 'Şahin', 'fatma.sahin@email.com', '2020-04-05'),
            (5, 'Ahmet', 'Çelik', 'ahmet.celik@email.com', '2021-01-25'),
            (6, 'Zeynep', 'Yıldız', NULL, '2021-02-14'),
            (7, 'Mustafa', 'Arslan', 'mustafa.arslan@email.com', '2021-03-30'),
            (8, 'Elif', 'Öztürk', 'elif.ozturk@email.com', '2021-04-22')
        `);
        
        // Ürün verilerini ekle
        alasql(`
            INSERT INTO urunler VALUES
            (1, 'Laptop', 'Elektronik', 50, 5000.00),
            (2, 'Akıllı Telefon', 'Elektronik', 100, 3000.00),
            (3, 'Tablet', 'Elektronik', 30, 2000.00),
            (4, 'Kulaklık', 'Aksesuar', 200, 500.00),
            (5, 'Klavye', 'Aksesuar', 150, 300.00),
            (6, 'Mouse', 'Aksesuar', 200, 200.00),
            (7, 'Monitör', 'Elektronik', 40, 2000.00),
            (8, 'Yazıcı', 'Elektronik', 25, 1500.00),
            (9, 'Hoparlör', 'Aksesuar', 100, 400.00),
            (10, 'Harici Disk', 'Depolama', 80, 800.00)
        `);
        
        // Sipariş verilerini ekle
        alasql(`
            INSERT INTO siparisler VALUES
            (1, 1, 1, 1, 5000.00, '2022-01-10'),
            (2, 1, 4, 2, 1000.00, '2022-01-10'),
            (3, 2, 2, 1, 3000.00, '2022-01-15'),
            (4, 3, 3, 1, 2000.00, '2022-02-05'),
            (5, 4, 5, 1, 300.00, '2022-02-20'),
            (6, 5, 6, 2, 400.00, '2022-03-15'),
            (7, 7, 5, 2, 15000.00, '2022-03-20'),
            (8, 7, 10, 1, 800.00, '2022-03-20'),
            (9, 8, 8, 1, 1500.00, '2022-05-01'),
            (10, 8, 9, 2, 400.00, '2022-05-01'),
            (11, 1, 2, 1, 5000.00, '2022-05-15'),
            (12, 2, 7, 1, 2000.00, '2022-05-20')
        `);
        
        console.log('Veritabanı başarıyla oluşturuldu.');
    } catch (error) {
        console.error('Veritabanı oluşturulurken hata:', error);
    }
}

// Sorguyu çalıştır
function runQuery(query) {
    console.log("Sorgu çalıştırılıyor:", query);
    try {
        // Seviye öncesi hazırlık
        if (typeof window.currentLevel !== 'undefined') {
            const level = levels.find(l => l.id === window.currentLevel);
            if (level && level.preExecution) {
                level.preExecution();
            }
        }
        
        // Sorguyu çalıştır
        const results = alasql(query);
        console.log("Sorgu sonucu:", results);
        
        // Seviye sonrası işlem
        if (typeof window.currentLevel !== 'undefined') {
            const level = levels.find(l => l.id === window.currentLevel);
            if (level && level.postExecution) {
                level.postExecution();
            }
        }
        
        return {
            success: true,
            data: results
        };
    } catch (error) {
        console.error("Sorgu hatası:", error);
        return {
            success: false,
            error: error.message
        };
    }
} 