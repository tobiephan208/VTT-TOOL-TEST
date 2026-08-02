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
    { id: 'bac_sss', name: 'Bậc SSS', icon: './assets/bac-skin/SSS-HUU-HAN.png' },
    { id: 'bac_mystic', name: 'Bậc Mystic', icon: './assets/bac-skin/Mystic.png' }
];

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
                const aspect = skinImg.height / skinImg.width;
                const maxW = canvas.width;

                const scaledW = maxW * (pState.scale / 100);
                const scaledH = scaledW * aspect;

                const centerX = (canvas.width - scaledW) / 2;
                const centerY = (canvas.height - scaledH) / 2;

                const maxOffsetX = (canvas.width - scaledW) / 2;
                const maxOffsetY = (canvas.height - scaledH) / 2;

                const finalX = centerX + (maxOffsetX * (pState.posX / 100));
                const finalY = centerY - (maxOffsetY * (pState.posY / 100));

                ctx.drawImage(skinImg, finalX, finalY, scaledW, scaledH);

                updatePreviewUI(platform, canvas.toDataURL('image/png'));
            };

            skinImg.onerror = () => {
                console.warn("Không tìm thấy file icon Bậc Skin:", badgeObj.icon);
                updatePreviewUI(platform, canvas.toDataURL('image/png'));
            };
        }
    };
}

function updatePreviewUI(platform, finalDataUrl) {
    const placeholder = document.getElementById(`${platform}ImgPlaceholder`);
    const previewImg = document.getElementById(`${platform}ImgPreview`);

    if (placeholder) placeholder.style.display = 'none';
    if (previewImg) {
        previewImg.style.display = 'block';
        previewImg.src = finalDataUrl;
    }
}

function toggleMusic(e) {
    e.preventDefault();
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicToggleBtn');

    if (!audio) return;

    if (audio.paused) {
        audio.play();
        btn.classList.add('playing');
    } else {
        audio.pause();
        btn.classList.remove('playing');
    }
}

function handleHarUpload(e) {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('harText').innerText = file.name;
        document.getElementById('harIcon').className = 'fa-solid fa-file-code big-icon';
    }
}

function submitIosProcess() {
    const previewImg = document.getElementById('iosImgPreview');
    if (!previewImg.src || previewImg.style.display === 'none') {
        Swal.fire('Lỗi', 'Vui lòng chọn và cắt ảnh trước!', 'error');
        return;
    }
    document.getElementById('iosStatusBadge').innerText = 'Đang xử lý...';
    document.getElementById('iosStatusLog').innerText = 'Đã nhận file ảnh ghép Bậc Skin. Đang tiến hành tạo gói dữ liệu...';
}

function submitAndroidProcess() {
    const tokenInput = document.getElementById('androidTokenInput');
    const token = tokenInput ? tokenInput.value : '';
    const previewImg = document.getElementById('androidImgPreview');

    if (!token) {
        Swal.fire('Lỗi', 'Vui lòng nhập Token Android!', 'error');
        return;
    }
    if (!previewImg || !previewImg.src || previewImg.style.display === 'none') {
        Swal.fire('Lỗi', 'Vui lòng chọn và cắt ảnh trước!', 'error');
        return;
    }
    document.getElementById('androidStatusBadge').innerText = 'Đang xử lý...';
    document.getElementById('androidStatusLog').innerText = 'Đã nhận file ảnh ghép Bậc Skin & Token. Đang tiến hành gửi lệnh...';
}
