'use strict';
import {console_color,console_red,console_green,console_yellow,
  console_purple,console_blue,console_cyan} from './logColor.js';


// ---------------------------------------------------------------------------------------
//*                             ----- QRIOUS & SCANNER -----
// ---------------------------------------------------------------------------------------

//^ 全角文字では生成できません。＞>＞
const container = document.querySelector('.container');
  const imageWrapper = document.querySelector('.image-wrapper');
  const inputURL = document.querySelector('input');
  const form = document.querySelector('form');
  const title = document.querySelector('.title');
  const themeLists = document.querySelectorAll('li');
  let color = themeLists[0].dataset.theme; 
  let qrSize = 200;
  let protocol = 'https://';

  themeLists.forEach(list => {
    list.addEventListener('click', () => {
      resetColor();
      color = list.dataset.theme;
      list.classList.add('selected');
      inputURL.focus();
    });
  });

  title.addEventListener('click', () => {
    title.classList.toggle('active');
    if(title.classList.contains('active')) {
      protocol = '';
    } else { protocol = 'https://'}
    inputURL.focus();
  });

  document.addEventListener('keyup', () => {
    const regex = /[*]{1,}/g;
    if(inputURL.value.match(regex)) { inputURL.value = inputURL.value.replace('**', '*')}
    if(inputURL.value[0] === '*') { inputURL.value = ''}
  });


  form.addEventListener('submit', (e) => {
    e.preventDefault();
    camera.classList.add('inactive'); //*
    if(!inputURL.value) { error(); inputURL.focus(); return }
    if(!title.classList.contains('active') && !inputURL.value.includes('.')) { error(); return }
    if(!title.classList.contains('active') && inputURL.value.includes(' ')) { error(); return }
    if(!title.classList.contains('active') && isZenkaku(inputURL.value)) { error(); return }
    if(!title.classList.contains('active') && inputURL.value.match(/[!@#$%&?*^(){}\[\]<>:;,"'~`|\\+_=]/g)) { error(); return }
    if(title.classList.contains('active') && inputURL.value[0].match(/[\x20\u3000]/g) ) { error(); return }
    if(title.classList.contains('active') && inputURL.value[0].match(/\＊/g) ) { error(); return }

    let sentence = inputURL.value;
    let zenkakuSpace = (sentence.match(/\u3000/g) || []).length;
    for (let i = 0; i < zenkakuSpace; i++) { sentence = sentence.replace(/\u3000/g, ' ')}
    const zenkakuAsteriskLength = (sentence.match(/\＊/g ) || []).length;
    console.log('zenkakuAsteriskLength '+ zenkakuAsteriskLength);
    for (let i = 0; i < zenkakuAsteriskLength; i++) {
      sentence = sentence.replace('＊', '*');
    }
    const asteriskLength = (sentence.match(/\*/g ) || []).length;
    for (let i = 0; i < asteriskLength; i++) {
      sentence = sentence.replace('*', '\n');
    }
    console.log(asteriskLength);
    const prevImg = document.querySelector('#previewContainer');
    if(prevImg) return;
    const previewContainer = document.createElement('canvas');
    previewContainer.setAttribute('id', 'previewContainer');
    const downloadContainer = document.createElement('canvas');
    downloadContainer.setAttribute('id', 'downloadContainer');
    downloadContainer.setAttribute('hidden', true);
    imageWrapper.appendChild(previewContainer);
    imageWrapper.appendChild(downloadContainer);
    const url = `${protocol}${sentence}`;


    //^ 全角文字では生成できません。＞>＞
      const previewQr = (url) => {
        new QRious({
          element: document.getElementById("previewContainer"),
          value: url,
          size: 150,
          level: 'H',
          foreground: color,
          background: "#dfdfdf",
          // padding: 25,
        }); 
      }
      previewQr(url);
      
      const downloadQr = (url) => {
        new QRious({
          element: document.getElementById("downloadContainer"),
          value: url,
          size: 600,
          level: 'H',
          foreground: color,
          background: "#dfdfdf",
          // padding: 25,
        }); 
      }
      downloadQr(url);

    inputURL.blur();
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '');
    downloadAnchor.classList.add('download-anchor');
    downloadAnchor.textContent = 'Download QR Code';
    imageWrapper.appendChild(downloadAnchor);

    downloadAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      const downloadSrc = document.getElementById('downloadContainer').toDataURL();
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = downloadSrc;
      link.click();
    });
  });
  
  inputURL.addEventListener('focus', () => {
    if(!landscape) { camera.classList.remove('inactive')} //*
    const previewContainer = document.querySelector('#previewContainer');
    const downloadContainer = document.querySelector('#downloadContainer');
    if(previewContainer) { previewContainer.remove()}
    if(downloadContainer) { downloadContainer.remove()}
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

  function isZenkaku(str) {
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      if (code < 0x20 || code > 0x7E) {
        return true;
      }
    }
    return false;
  }


//^ html5 qrcode scanner ------------------------------

let landscape = window.matchMedia("(orientation: landscape)").matches;
const scannerContainer = document.querySelector('.scannerContainer');
const camera = document.querySelector('.camera');
	if(landscape) { camera.classList.add('inactive')}
const [canvasWidth, canvasHeight] = [258, 180];

camera.addEventListener('click', () => {
  container.classList.add('inactive'); 
  scannerContainer.classList.add('active'); 
	createScanner();
	camera.remove();
});

function createScanner() {
	scannerContainer.insertAdjacentHTML('afterbegin', 
		`<div id="reader"></div>
			<div id="result"></div>
		<a class="btnTop" href="">BACK TO TOP</a>`
	);
	const scanner = new Html5QrcodeScanner('reader', {
		qrbox: {width: 225, height: 225},
		fsp: 20,
	});
	scanner.render(success, error);

	const reader = document.getElementById('reader');
	const readerFirstChild = reader.querySelector('div');
		readerFirstChild.classList.add('reader__first_child');
	const info = readerFirstChild.querySelector('img');
		info.classList.add('info-icon');
	const readerDashboardSection = document.getElementById('reader__dashboard_section');
		readerDashboardSection.querySelector('div').classList.add('target');
	const target = readerDashboardSection.querySelector('.target');
		const divs = target.querySelectorAll('div');
			divs.forEach((div, index) => {
				if(index === 2) {
					div.classList.add('borderElement');
					div.style.border = '6px dashed #888';
				}
			});
		const borderElement = target.querySelector('.borderElement');
			borderElement.querySelector('div').classList.add('dropImageScan_text');
			
	function success(response) {
    if(response[0] === ' ') { error('error'); return }
		const result = document.getElementById('result');
		if(isZenkaku(response) || response.includes(' ') 
			|| !response.includes('.') || response.match(/[!@#$%&?*^(){}\[\]<>;,"'~`|\\+=]/g)) {
			result.innerHTML = `<h2>Success</h2>
			<p class="word-wrapper"></p>`;
      createRowsWithColumns(result, response);
		} else {
			result.innerHTML = `<h2>Success</h2>
			<p class="wrapper"><a class="anchor" href="${response}">${response}</a></p>`;
		}
		scanner.clear();
		document.getElementById('reader').remove();
		const btnTop = scannerContainer.querySelector('.btnTop');
		btnTop.classList.add('success');
		document.body.classList.add('success'); //*
	}

	function error(err) {
		// console.log(err); //* log
		const buttonFileSelection = document.getElementById('html5-qrcode-button-file-selection');
		buttonFileSelection.classList.add('error');
		const qrCanvasVisible = document.getElementById('qr-canvas-visible');
		qrCanvasVisible.style.width = canvasWidth + 'px';
		qrCanvasVisible.style.height = canvasHeight + 'px';
	}

	window.addEventListener('resize', () => {
		landscape = window.matchMedia("(orientation: landscape)").matches;
		const reader = document.getElementById('reader');
		const btnTop = scannerContainer.querySelector('.btnTop');
		if(!btnTop.classList.contains('success')) {
			if(landscape) { reader.classList.add('inactive');
				btnTop.classList.add('inactive');
			} else { reader.classList.remove('inactive');
				btnTop.classList.remove('inactive');
			}
		}
	});

	const scanTypeChange = document.getElementById('html5-qrcode-anchor-scan-type-change');
	scanTypeChange.addEventListener('click', () => {
		scanTypeChange.classList.toggle('active');
		const buttonFileSelection = document.getElementById('html5-qrcode-button-file-selection');
		buttonFileSelection.textContent = 'click to choose image';
		buttonFileSelection.classList.remove('error');
	});
} //* END OF CREATE SCANNER


  function createRowsWithColumns(result, response) {
    let sentence = response;
    const lastChar = sentence[sentence.length-1];
    const lineBreakLength = (sentence.match(/\n/g) || []).length;
    console.log(lineBreakLength);
    let [idx, prev] = [0,0]; 
    for (let i = 0; i < lineBreakLength+1; i++) {
      idx = sentence.indexOf('\n',idx + 1);
      console.log('idx '+ idx); //* log
      const word = document.createElement('div');
      word.classList.add(`word${i+1}`,'word');
      word.innerHTML = sentence.slice(prev,idx).replace(/\n/g,`$&`);
      if(i === lineBreakLength) { word.innerHTML += `${lastChar}`}
      prev = idx+1; 
      console.log('prev '+ prev); //* log
      if(isZenkaku(word.textContent)) { word.classList.add('zenkakuText')}
      const wordWrapper = result.querySelector('.word-wrapper');
      wordWrapper.appendChild(word); 
    }
  }
  

//* resize out of createScanner
	window.addEventListener('resize', () => {
    const qr = imageWrapper.querySelector('#previewContainer');
		landscape = window.matchMedia("(orientation: landscape)").matches;
		if(landscape) { camera.classList.add('inactive')}
		else { if(!qr) { camera.classList.remove('inactive')} }
	});




//^ ---------------------------------------------------------------------------------------

  // function createRowsWithColumns(result, response) {
  //   let sentence = response;
  //   const lastChar = sentence[sentence.length-1];
  //   let zenkakuSpace = (sentence.match(/\u3000/g) || []).length;
  //   for (let i = 0; i < zenkakuSpace; i++) { sentence = sentence.replace(/\u3000/g, ' ')}
  //   let whiteSpace = (sentence.match(/\x20/g) || []).length;
  //   // console.log(whiteSpace); //* log
  //   let [idx, prev] = [0,0]; 
  //   for (let i = 0; i < whiteSpace+1; i++) {
  //     idx = sentence.indexOf(' ',idx + 1);
  //     // console.log('idx '+ idx); //* log
  //     const word = document.createElement('div');
  //     word.classList.add(`word${i+1}`,'word');
  //     word.innerHTML = sentence.slice(prev,idx).replace(/\S/g,`$&`);
  //     if(i === whiteSpace) { word.innerHTML += `${lastChar}`}
  //     prev = idx+1; 
  //     // console.log('prev '+ prev); //* log
  //     if(word.textContent.length >= 14) { word.style.fontSize = .8 +'em'}
  //     const zenkakuAsteriskLength = (word.textContent.match(/\＊/g ) || []).length;
  //     console.log(zenkakuAsteriskLength); //*log
  //     for (let i = 0; i < zenkakuAsteriskLength; i++) {
  //       word.textContent = word.textContent.replace('＊', '*');
  //     }
  //     const asteriskLength = (word.textContent.match(/\*/g ) || []).length;
  //     for (let i = 0; i < asteriskLength; i++) {
  //       word.textContent = word.textContent.replace('*', ' ');
  //     }
  //     console.log(asteriskLength); //*log
  //     const wordWrapper = result.querySelector('.word-wrapper');
  //     wordWrapper.appendChild(word); 
  //   }
  // }

//^ ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
//                           ----- QR CODE JS DOWNLOAD 1.-----
// ---------------------------------------------------------------------------------------


// new QRCode(document.getElementById("qrcode"), {
// 	text: "hello\nworld\nhello\nworld",
// 	// text: "https://www.google.com",
// 	width: 600,
// 	height: 600,
// 	colorDark: "#f00",
// 	colorLight: "#dfdfdf",
// 	correctLevel: QRCode.CorrectLevel.H,
// });

// const qr = document.getElementById("qrcode");
// const qrImage = qr.querySelector('img');

// function downloadQR() {
//   var link = document.createElement('a');
//   link.download = 'qrcode.png';
//   link.href = qrImage.src;
//   link.click();
// } 


// document.addEventListener('click', () => {
//   downloadQR();
// });

// ---------------------------------------------------------------------------------------
//                          ----- QR CODE JS DOWNLOAD 2.-----
// ---------------------------------------------------------------------------------------

// const createQR = (url) => {
//   let qrcodeContainer = document.getElementById("qrcode");
//     qrcodeContainer.innerHTML = "";
//   let qr = new QRious({
//     element: qrcodeContainer,
//     value: url,
//     size: 600,
//     foreground: "#06f",
//     background: "#dfdfdf",
//     padding: 20,
//     // value: 'https://google.com'
//   }); 
// }

// function downloadQR() {
//   var link = document.createElement('a');
//   link.download = 'qrcode.png';
//   link.href = document.getElementById('qrcode').toDataURL()
//   link.click();
// } 

// createQR('hello\nworld\nhello\nworld');

// document.addEventListener('click', () => {
//   downloadQR();
// });


// ---------------------------------------------------------------------------------------
















