const fileInput = document.getElementById('inputGroupFile03');
const button = document.getElementById('cbtn');
const inputImage = document.getElementById('i-img');
const progressModal = document.getElementById('progress-modal');
const progressBar = document.getElementById('upload-progress');
const modalCloseBtn = document.getElementById('md-close');
const pCanvas = document.getElementById('o-art');
const spinner = document.getElementById('l-spinner');

const maxFileSize = (1024 * 1024) * 2; 
let selectedFile;


fileInput.addEventListener('change', (event) => {
    
    const file = event.target.files[0];
    selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
        if (reader.readyState === 2) {
            //console.log(reader.result);
            inputImage.setAttribute('src', reader.result);
        }
    };

    if (file) {
        console.log(file.size, "-", maxFileSize);
        if (file.size > maxFileSize) {
            alert("File is too big. Maximum file size allowed is 2MB.");
            fileInput.value = ""; 
            return;
        }
        reader.readAsDataURL(file);
        button.removeAttribute('disabled');
    }
});


button.addEventListener('click', () => {

    spinner.classList.remove('d-none');
    button.setAttribute('disabled', '');

    const form = new FormData();
    console.log(selectedFile);
    form.append('file', selectedFile);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/ocr');
    xhr.send(form);

    xhr.onload = () => {

        if (xhr.status === 500 || xhr.status === 400) {
            spinner.classList.add('d-none');
            const response = JSON.parse(xhr.responseText);
            alert(response.message);
            modalCloseBtn.click();
            button.removeAttribute('disabled');
        }

        if (xhr.status === 200) {
    
            spinner.classList.add('d-none');
        
            const response = JSON.parse(xhr.responseText);
            pCanvas.innerText = response.text;
            
        }
    };
    
});
