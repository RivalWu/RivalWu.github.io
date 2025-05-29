// Menunggu sampai seluruh dokumen HTML selesai dimuat oleh browser
// sebelum kita menjalankan kode JavaScript ini. Ini penting agar
// elemen-elemen HTML yang kita panggil sudah siap.
document.addEventListener('DOMContentLoaded', function() {

    // ======================================================
    // === BAGIAN UNTUK SPLASH SCREEN DAN KONTROL MUSIK ===
    // ======================================================

    // Mengambil elemen-elemen dari HTML dan menyimpannya di dalam variabel
    // agar mudah digunakan nanti.
    const splashScreen = document.getElementById('splash-screen');
    const enterButton = document.getElementById('enter-button');
    const backgroundMusic = document.getElementById('background-music');
    const volumeIcon = document.querySelector('#volume-control i');
    const volumeSlider = document.getElementById('volume-slider');

    // Ini adalah variabel untuk menyimpan nilai volume terakhir sebelum musik di-mute.
    // Berguna saat kita ingin meng-unmute musik kembali ke volume semula.
    let lastVolume = 1;

    // Mengatur volume musik awal sesuai dengan posisi default dari slider.
    backgroundMusic.volume = volumeSlider.value;

    // Menambahkan 'event listener' ke tombol 'Enter'.
    // Artinya, kita "mendengarkan" jika ada event 'click' pada tombol tersebut.
    // Jika ada, jalankan fungsi yang ada di dalamnya.
    enterButton.addEventListener('click', function() {
        // Memulai musik latar belakang.
        // Ini perlu dipicu oleh interaksi pengguna (seperti klik) agar bisa
        // berjalan otomatis di kebanyakan browser modern.
        backgroundMusic.play();

        // Menambahkan class CSS bernama 'hidden' ke elemen splash screen.
        // Class 'hidden' ini sudah kita atur di file CSS untuk membuat
        // elemen menghilang dengan efek transisi (fade-out).
        splashScreen.classList.add('hidden');
    });


    // --- Logika untuk Kontrol Volume ---

    // Event listener untuk SLIDER VOLUME.
    // Fungsi ini dijalankan setiap kali slider digeser (event 'input').
    volumeSlider.addEventListener('input', function() {
        // Mengatur volume musik sesuai dengan nilai slider saat ini (nilainya antara 0 dan 1).
        backgroundMusic.volume = this.value;

        // Jika slider digeser sampai ke 0, maka musiknya kita mute (bisukan).
        if (this.value == 0) {
            backgroundMusic.muted = true;
        } else {
            backgroundMusic.muted = false;
        }
    });

    // Event listener untuk IKON SPEAKER.
    // Fungsi ini dijalankan ketika ikon speaker di-klik.
    volumeIcon.addEventListener('click', function() {
        // Cek dulu, apakah musik sedang di-mute ATAU volumenya 0?
        if (backgroundMusic.muted || backgroundMusic.volume === 0) {
            // Jika iya, maka kita hidupkan kembali musiknya.
            backgroundMusic.muted = false;
            // Kembalikan volume ke nilai terakhir yang tersimpan sebelum di-mute.
            backgroundMusic.volume = lastVolume;
            // Atur juga posisi slider agar sesuai dengan volume yang sudah kembali.
            volumeSlider.value = lastVolume;
        } else {
            // Jika musik sedang menyala, berarti kita ingin mematikannya (mute).
            // Simpan dulu nilai volume saat ini ke variabel 'lastVolume'.
            lastVolume = backgroundMusic.volume;
            // Lalu, mute musiknya.
            backgroundMusic.muted = true;
            // Terakhir, atur posisi slider ke 0.
            volumeSlider.value = 0;
        }
    });

    // Event listener ini untuk mengubah ikon speaker secara otomatis
    // sesuai dengan kondisi volume (nyala, kecil, atau mati).
    backgroundMusic.addEventListener('volumechange', function() {
        // Setiap kali volume berubah, kita hapus dulu semua class ikon volume yang mungkin ada
        // agar tidak tumpang tindih.
        volumeIcon.classList.remove('fa-volume-high', 'fa-volume-low', 'fa-volume-xmark');

        // Cek kondisi volume saat ini.
        if (backgroundMusic.muted || backgroundMusic.volume === 0) {
            // Jika di-mute atau volume 0, tampilkan ikon 'x' (mute).
            volumeIcon.classList.add('fa-volume-xmark');
        } else if (backgroundMusic.volume < 0.5) {
            // Jika volume di bawah 50%, tampilkan ikon 'low'.
            volumeIcon.classList.add('fa-volume-low');
        } else {
            // Jika volume 50% atau lebih, tampilkan ikon 'high'.
            volumeIcon.classList.add('fa-volume-high');
        }
    });


    // ==========================================
    // === BAGIAN UNTUK EFEK TEKS MENGETIK ===
    // ==========================================

    // Ini adalah kumpulan teks yang akan ditampilkan secara bergantian.
    const textsToType = [
        "a person who pursues a money-making venture with uncertain methods",
        "just another side character",
        "im making more than average"
    ];

    // Pengaturan untuk kecepatan dan jeda waktu animasi.
    const typingSpeed = 80; // Kecepatan mengetik (80 milidetik per karakter).
    const deletingSpeed = 40; // Kecepatan menghapus (40 milidetik per karakter).
    const delayAfterTyping = 2500; // Jeda setelah selesai mengetik satu kalimat (2.5 detik).
    const delayBeforeTyping = 500; // Jeda sebelum mulai mengetik kalimat baru (0.5 detik).

    // Mengambil elemen 'span' dari HTML untuk menjadi tempat kita menampilkan teks.
    const textElement = document.getElementById("typing-text");

    // Variabel-variabel ini untuk melacak posisi kita saat ini.
    let textIndex = 0; // Melacak index kalimat mana yang sedang aktif di array 'textsToType'.
    let charIndex = 0; // Melacak index karakter mana yang sedang aktif di kalimat.
    let isDeleting = false; // Status untuk tahu apakah kita sedang mengetik (false) atau menghapus (true).

    // Ini adalah fungsi utama yang akan terus berulang (loop) untuk menciptakan efek ketikan.
    function typeLoop() {
        // Ambil kalimat yang aktif saat ini dari array berdasarkan 'textIndex'.
        const currentText = textsToType[textIndex];

        // Cek apakah kita sedang dalam mode menghapus.
        if (isDeleting) {
            // Jika ya, kita kurangi teks yang ditampilkan satu per satu dari belakang.
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex = charIndex - 1;
        } else {
            // Jika tidak (sedang mengetik), kita tambahkan teks satu per satu dari depan.
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex = charIndex + 1;
        }

        // --- Bagian ini adalah otak dari loop untuk mengontrol kapan harus berhenti, lanjut, atau ganti arah ---

        // Cek jika KALIMAT SUDAH SELESAI DIKETIK.
        // Kondisinya: tidak sedang menghapus DAN index karakter sudah sama dengan panjang kalimat.
        if (!isDeleting && charIndex === currentText.length) {
            // Jika sudah selesai, kita ubah status menjadi 'menghapus'.
            isDeleting = true;
            // Beri jeda sejenak (sesuai 'delayAfterTyping') sebelum mulai menghapus.
            setTimeout(typeLoop, delayAfterTyping);
        }
        // Cek jika KALIMAT SUDAH SELESAI DIHAPUS.
        // Kondisinya: sedang menghapus DAN index karakter sudah mencapai 0.
        else if (isDeleting && charIndex === 0) {
            // Jika sudah habis, kita ubah status menjadi 'mengetik' lagi.
            isDeleting = false;
            // Pindah ke kalimat selanjutnya di dalam array.
            textIndex = textIndex + 1;

            // Jika sudah di kalimat terakhir, kita kembali lagi ke kalimat pertama.
            if (textIndex === textsToType.length) {
                textIndex = 0;
            }

            // Beri jeda sejenak (sesuai 'delayBeforeTyping') sebelum mulai mengetik kalimat baru.
            setTimeout(typeLoop, delayBeforeTyping);
        }
        // Jika belum selesai mengetik atau menghapus.
        else {
            // Tentukan kecepatan berdasarkan status saat ini.
            let speed;
            if (isDeleting) {
                speed = deletingSpeed; // Kalau sedang menghapus, pakai kecepatan menghapus.
            } else {
                speed = typingSpeed; // Kalau sedang mengetik, pakai kecepatan mengetik.
            }
            // Panggil kembali fungsi 'typeLoop' ini setelah jeda waktu sesuai 'speed'.
            // Inilah yang membuat prosesnya berjalan karakter per karakter.
            setTimeout(typeLoop, speed);
        }
    }

    // Memulai loop mengetik untuk pertama kalinya saat halaman dimuat.
    typeLoop();

});