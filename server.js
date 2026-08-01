const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/upload', upload.fields([{ name: 'har_file' }, { name: 'image' }]), (req, res) => {
    try {
        const jobId = 'JOB_' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        res.json({
            success: true,
            job_id: jobId,
            message: 'Đã nhận file thành công!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/check/:jobId', (req, res) => {
    const { jobId } = req.params;
    res.json({
        success: true,
        data: {
            job_id: jobId,
            status: 'completed',
            message: 'Xử lý thành công!'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server Node.js đang chạy tại: http://localhost:${PORT}`);
});
