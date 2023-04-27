'use strict';
import {console_color,console_red,console_green,console_yellow,
  console_purple,console_blue,console_cyan} from './logColor.js';


// ---------------------------------------------------------------------------------------
//                            ----- QR CODE GENERATOR -----
// ---------------------------------------------------------------------------------------
// cyber-ground.github.io/qrcode
//'color=a3ffff&bgcolor=0ff';



const imageWrapper = document.querySelector('.image-wrapper');
const inputURL = document.querySelector('input');
const form = document.querySelector('form');

let color;
const themeLists = document.querySelectorAll('li');
themeLists.forEach(list => {
  list.addEventListener('click', () => {
    resetColor();
    color = list.dataset.theme;
    list.classList.add('selected');
    inputURL.focus();
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if(!inputURL.value) { error(); inputURL.focus(); return }
  if(inputURL.value.includes(' ')) { error(); return }
  const prevImg = document.querySelector('.qr');
  if(prevImg) return;
  const qrImage = document.createElement('img');
  qrImage.classList.add('qr');
  const api = 'https://api.qrserver.com/v1/create-qr-code/';
  const previewSrcParams = `?${color}&size=150x150&margin=5&data=`;
  const downloadParams = `?${color}&size=600x600&margin=24&data=`;
  const previewSrc = `${api}${previewSrcParams}https://${inputURL.value}`;
  const downloadSrc = `${api}${downloadParams}https://${inputURL.value}`;
  qrImage.src = previewSrc;
  imageWrapper.appendChild(qrImage);
  inputURL.blur();
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', '');
  downloadAnchor.classList.add('download-anchor');
  downloadAnchor.textContent = 'Download QR Code';
  imageWrapper.appendChild(downloadAnchor);
  downloadAnchor.addEventListener('click', async (e) => {
    e.preventDefault();
    const response = await fetch(downloadSrc);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${inputURL.value}.png`;
    link.click();
    setTimeout(() => { URL.revokeObjectURL(url) }, 0);
  });
});

inputURL.addEventListener('focus', () => {
  const prevImg = document.querySelector('.qr');
  if(prevImg) { prevImg.remove() }
  const downloadAnchor = document.querySelector('.download-anchor');
  if(downloadAnchor) { downloadAnchor.remove() }
});

inputURL.addEventListener('click', () => {
  inputURL.value = '';
});

window.addEventListener('load', () => {
  if(innerWidth > 414) { inputURL.focus() }
});

function error() {
  inputURL.classList.add('error');
  setTimeout(() => {
    inputURL.classList.remove('error');
  }, 1000);
}

function resetColor() {
  themeLists.forEach(list => {
    list.classList.remove('selected');
  });
}

//* colored qrcode ---
  //" const params = 'color=ff0&bgcolor=f00&margin=5';
  //" const src = `${api}?size=150x150&${params}&data=https://${inputURL.value}`;
//* ------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
//                           ----- QR CODE JS DOWNLOAD 1.-----
// ---------------------------------------------------------------------------------------


// new QRCode(document.getElementById("qrcode"), {
// 	text: "https://www.google.com",
// 	width: 150,
// 	height: 150,
// 	colorDark: "#f00",
// 	colorLight: "#ff0",
// 	correctLevel: QRCode.CorrectLevel.H
// });

// const qr = document.getElementById("qrcode");
// const qrImage = qr.querySelector('img');

// function downloadQR() {
//   var link = document.createElement('a');
//   link.download = 'qrcode.png';
//   link.href = qrImage.src;
//   link.click();
// } 

// // setTimeout(() => {
// //   downloadQR()
// // }, 1000);


// ---------------------------------------------------------------------------------------
//                          ----- QR CODE JS DOWNLOAD 2.-----
// ---------------------------------------------------------------------------------------

// const createQR = (url) => {
//   let qrcodeContainer = document.getElementById("qrcode");
//     qrcodeContainer.innerHTML = "";
//   new QRious({
//     element: qrcodeContainer,
//     value: url,
//     size: 200,
//     foreground: "#f00",
//     background: "#fff",
//     padding: 12,
//   }); 
//   // downloadQR(); 
// }

// function downloadQR() {
//   var link = document.createElement('a');
//   link.download = 'qrcode.png';
//   link.href = document.getElementById('qrcode').toDataURL()
//   link.click();
// } 

// createQR('https://google.com');





// ---------------------------------------------------------------------------------------
















