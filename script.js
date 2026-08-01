const SKIN_BADGES = [
    { id: 'none', name: 'Không bậc', icon: '' },
    { id: 'bac_a', name: 'Bậc A', icon: './assets/bac-skin/A.png' },
    { id: 'bac_a_huu_han', name: 'Bậc A Hữu Hạn', icon: './assets/bac-skin/A-HUU-HAN.png' },
    { id: 'bac_s', name: 'Bậc S', icon: './assets/bac-skin/S.png' },
    { id: 'bac_s_huu_han', name: 'Bậc S Hữu Hạn', icon: './assets/bac-skin/S-HUU-HAN.png' },
    { id: 'bac_s_plus', name: 'Bậc S+', icon: './assets/bac-skin/S+.png' },
    { id: 'bac_s_plus_huu_han', name: 'Bậc S+ Hữu Hạn', icon: './assets/bac-skin/S+HUU-HAN.png' },
    { id: 'bac_ss', name: 'Bậc SS', icon: './assets/bac-skin/SS.png' },
    { id: 'bac_sss', name: 'Bậc SSS', icon: './assets/bac-skin/SSS-HUU-HAN.png' }
];

let state = {
    ios: {
        rawImgSrc: null,
        croppedBase64: null,
        selectedSkinId: 'none',
        scale: 100,
        posX: 0,
        posY: 0
    },
    android: {
        rawImgSrc: null,
        croppedBase64: null,
        selectedSkinId: 'none',
        scale: 100,
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

    state[platform].scale = parseInt(scale);
    state[platform].posX = parseInt(posX);
    state[platform].posY = parseInt(posY);

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
    event.target.value = ''; // Reset input
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

    document.getElementById(`${platform}SkinEditor`).classList.remove('hidden');

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
                
                const baseWidth = 220; 
                const baseHeight = (skinImg.height / skinImg.width) * baseWidth;

                
                const scaledW = baseWidth * (pState.scale / 100);
                const scaledH = baseHeight * (pState.scale / 100);

                
                const defaultX = 1080 - scaledW - 50;
                const defaultY = 60;

                const finalX = defaultX + (pState.posX * 5);
                const finalY = defaultY + (pState.posY * 5);

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

    placeholder.style.display = 'none';
    previewImg.style.display = 'block';
    previewImg.src = finalDataUrl;
}

function toggleMusic(e) {
    e.preventDefault();
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicToggleBtn');

    if (audio.paused) {
        audio.play();
        btn.classList.add('playing');
    } else {
        audio.pause();
        btn.classList.remove('playing');
    }
}

function openNycModal() {
    Swal.fire({
        title: 'VTT Tools AOV',
        text: 'Website hỗ trợ thay ảnh loading Liên Quân Mobile chuyên nghiệp!',
        imageUrl: 'https://i.ibb.co/Ngz34v2H/9-D7-CDCBF-8235-4-A08-95-BE-20-AF6-AE84223.jpg',
        imageWidth: 120,
        imageHeight: 120,
        imageAlt: 'Logo',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#38bdf8'
    });
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
    const token = document.getElementById('androidTokenInput').value;
    const previewImg = document.getElementById('androidImgPreview');

    if (!token) {
        Swal.fire('Lỗi', 'Vui lòng nhập Token Android!', 'error');
        return;
    }
    if (!previewImg.src || previewImg.style.display === 'none') {
        Swal.fire('Lỗi', 'Vui lòng chọn và cắt ảnh trước!', 'error');
        return;
    }
    document.getElementById('androidStatusBadge').innerText = 'Đang xử lý...';
    document.getElementById('androidStatusLog').innerText = 'Đã nhận file ảnh ghép Bậc Skin & Token. Đang tiến hành gửi lệnh...';
}
