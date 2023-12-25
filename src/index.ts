import express from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import multer from 'multer';
import { removeFile } from './utils/removeFile';
import { createWorker } from "tesseract.js";
import { preprocessImage } from './utils/preprocessImage';

const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ dest: 'uploads/', storage });

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', __dirname +'/views');

app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/ocr', upload.single('file'), async (req, res) => {

    if (!req.file) {
        res.status(400).json({
            message: "No file sent"
        })
    }
    else{
        try {
            
            let filePath = req.file.path;

            
            const worker = await createWorker({
            });
            preprocessImage(filePath);
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(filePath);
            await worker.terminate();

        
            if (text) {
                console.log(text);
                removeFile(filePath);
            }
            
            res.send({ text });
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "An unknown error occurred"
            })
        }
    }
});


server.listen(PORT, () => {
    console.log('listening on:',PORT);
});
