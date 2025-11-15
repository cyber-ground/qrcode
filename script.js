'use strict';
import {console_color,console_red,console_green,console_yellow,
  console_purple,console_blue,console_cyan} from './logColor.js';


// ---------------------------------------------------------------------------------------
//*                       ----- QR CODE GENERATOR & SCANNER -----
// ---------------------------------------------------------------------------------------


  let landscape = window.matchMedia("(orientation: landscape)").matches;
  const mobile = navigator.userAgent.match(/iPhone|Android.+Mobile/);
  const container = document.querySelector('.container');
  const imageWrapper = document.querySelector('.image-wrapper');
  const inputURL = document.querySelector('input');
  const form = document.querySelector('form');
  const btnSubmit = form.querySelector('button');
  const swapText = document.querySelector('.swapText');
  const iconSwapWrapper = document.querySelector('.iconSwap-wrapper');
  const iconSwap = document.querySelector('.iconSwap');
  const swapImg = iconSwap.querySelector('img');
  const themeLists = document.querySelectorAll('li');
  const btnLineBreak = container.querySelector('.btn-lineBreak');
  const btnClearText = container.querySelector('.btn-clearText');
  const regex = /[!@#$%&?*^(){}\[\]<>:;,"'~`|\\+_=]/g;
  let color = themeLists[0].dataset.theme; 
  let protocol = 'https://';
  let lastChar;
  
  const swapHowl = new Howl({src: ['mp3/swap.mp3'], volume: 0.03});
  const selectColorHowl = new Howl({src: ['mp3/selectColor.mp3'], volume: 0.05});
  const sendDataHowl = new Howl({src: ['mp3/sendData.mp3'], volume: 0.05});
  const lineBreakHowl = new Howl({src: ['mp3/lineBreak.mp3'], volume: 0.025})
  const deleteHowl = new Howl({src: ['mp3/delete.mp3'], volume: 0.15});
  const errorHowl = new Howl({src: ['mp3/error.mp3'], volume: 0.15});
  const selectCameraHowl = new Howl({src: ['mp3/selectCamera.mp3'], volume: 0.02});
  const scanTypeChangeHowl = new Howl({src: ['mp3/scanTypeChange.mp3'], volume: 0.02});
  const fileSelectionHowl = new Howl({src: ['mp3/fileSelection.mp3'], volume: 0.03});
  const scanActivationHowl = new Howl({src: ['mp3/scanActivation.mp3'], volume: 0.01});

  if(!mobile) {
    swapHowl.volume(.2); selectColorHowl.volume(.5); sendDataHowl.volume(.5);
    lineBreakHowl.volume(.3); deleteHowl.volume(1); errorHowl.volume(1);
    selectCameraHowl.volume(.3); scanTypeChangeHowl.volume(.5); fileSelectionHowl.volume(1);
    scanActivationHowl.volume(.2);
  }

  window.addEventListener('load', () => {
    if(innerWidth > 414) { inputURL.focus() }
  });

  themeLists.forEach(list => {
    list.addEventListener('click', () => {
      resetColor();
      selectColorHowl.play();
      color = list.dataset.theme;
      list.classList.add('selected');
      inputURL.focus();
    });
  });

  iconSwapWrapper.addEventListener('click', () => {
    iconSwap.classList.toggle('active');
    swapText.classList.toggle('active');
    btnLineBreak.classList.toggle('active');
    swapHowl.play();
    if(iconSwap.classList.contains('active')) {
      btnLineBreak.addEventListener('click', lineBreak);
      swapImg.src = 'svg/repeat-colored.svg';
      swapText.textContent = 'SWAP TO TYPING URL';
      inputURL.placeholder = 'Enter Text';
      protocol = '';
    } else { 
      btnLineBreak.removeEventListener('click', lineBreak);
      swapImg.src = 'svg/repeat-enabled.svg';
      swapText.textContent = 'SWAP TO TYPING TEXT'; 
      inputURL.placeholder = 'Enter URL';
      protocol = 'https://'; 
    }
    inputURL.focus();
  });

  function lineBreak() { //* EventListener
    if(iconSwap.classList.contains('active') && inputURL.value === '') { 
      error(btnLineBreak); return;
    }
    lastChar = inputURL.value.slice(-1);
    if(lastChar === '*') { error(btnLineBreak); return}
    lineBreakHowl.play();
    inputURL.value = inputURL.value + '*';
    lastChar = inputURL.value.slice(-1);
    inputURL.focus();
  }

  document.addEventListener('keyup', () => {
    lastChar = ''
    if(inputURL.value[0] === '*' || inputURL.value[0] === '＊') { 
      error(inputURL); 
      inputURL.value = '';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(!inputURL.value) return;
    deleteSpecificCharacter();
    if(!iconSwap.classList.contains('active') && inputURL.value.includes(' ')) { error(inputURL); return}
    if(!iconSwap.classList.contains('active') && !inputURL.value.includes('.')) { error(inputURL); return}
    if(!iconSwap.classList.contains('active') && isFullWidth(inputURL.value)) { error(inputURL); return}
    if(!iconSwap.classList.contains('active') && inputURL.value.match(regex)) { error(inputURL); return}
    if(inputURL.value[0].match(/[\x20\u3000]/g)) { error(inputURL); return}
    if(inputURL.value[0].match(/[\*]/g) || inputURL.value[0].match(/[\＊]/g)) { error(inputURL); return}
    camera.classList.add('inactive'); //*
    const prevImg = document.querySelector('.qr');
    if(prevImg) return;
    const qrImage = document.createElement('img');
    qrImage.classList.add('qr');
    const api = 'https://api.qrserver.com/v1/create-qr-code/';
    const previewParams = `?${color}&size=150x150&margin=10&data=`;
    const downloadParams = `?${color}&size=600x600&margin=24&data=`;
    const previewSrc = `${api}${previewParams}${protocol}${inputURL.value}`;
    const downloadSrc = `${api}${downloadParams}${protocol}${inputURL.value}`;
    qrImage.src = previewSrc;
    imageWrapper.appendChild(qrImage);
    inputURL.blur();
    btnLineBreak.classList.add('inactive');
    btnClearText.classList.remove('active');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', '');
    downloadAnchor.classList.add('download-anchor');
    downloadAnchor.textContent = 'Download QR Code';
    imageWrapper.appendChild(downloadAnchor);
    setTimeout(() => { sendDataHowl.play()}, 0);
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
    if(!landscape) { camera.classList.remove('inactive')} //*
    const prevImg = document.querySelector('.qr');
    if(prevImg) { prevImg.remove() }
    const downloadAnchor = document.querySelector('.download-anchor');
    if(downloadAnchor) { downloadAnchor.remove() }
    btnLineBreak.classList.remove('inactive');
    btnSubmit.textContent = 'Generate QR Code';
    btnClearText.classList.add('active');
  });

  inputURL.addEventListener('blur', () => {
    if(!inputURL.value) {
      btnSubmit.textContent = 'QR Code Generator';
      btnClearText.classList.remove('active');
    }
  });

  btnClearText.addEventListener('click', () => {
    const qr = imageWrapper.querySelector('.qr');
    if(qr || !inputURL.value) return;
    btnClearText.classList.remove('active');
    deleteHowl.play();
    inputURL.value = '';
    inputURL.focus();
  });

  function deleteSpecificCharacter() {
    const duplicate = /[*]{1,}/g;
    const duplicateAsteriskLength = (inputURL.value.match(duplicate) || []).length;
    for (let i = 0; i < duplicateAsteriskLength; i++) { 
      inputURL.value = inputURL.value.replace(duplicate, '*');
    }
    for (let i = 0; i < inputURL.value.length*2; i++) {
      inputURL.value = inputURL.value.trim();
      if(inputURL.value[0].match(/[\*]/g) || inputURL.value[0].match(/[\＊]/g)) { 
        inputURL.value = inputURL.value.slice(1, -1);
      }
      if(inputURL.value.slice(-1).match(/[\*]/g) || inputURL.value.slice(-1).match(/[\＊]/g)) { 
        inputURL.value = inputURL.value.slice(0, -1); 
      }
    }
    if(!iconSwap.classList.contains('active') && inputURL.value.includes(protocol)) { 
      inputURL.value = inputURL.value.replace(protocol, '');
    }
  }

  function error(element) {
    errorHowl.play();
    element.classList.add('error');
    inputURL.focus();
    setTimeout(() => {
      element.classList.remove('error');
    }, 1000);
  }

  function resetColor() {
    themeLists.forEach(list => {
      list.classList.remove('selected');
    });
  }

  function isFullWidth(str) {
    for (let i = 0; i < str.length; i++) {
      let code = str.charCodeAt(i);
      if (code < 0x20 || code > 0x7E) {
        return true;
      }
    }
    return false;
  }


//^ html5 qrcode scanner ------------------------------

const scannerContainer = document.querySelector('.scannerContainer');
const camera = document.querySelector('.camera');
	if(landscape) { camera.classList.add('inactive')}
const [canvasWidth, canvasHeight] = [258, 180];

camera.addEventListener('click', () => {
  container.classList.add('inactive'); 
  scannerContainer.classList.add('active'); 
	createScanner();
	camera.remove();
  selectCameraHowl.play();
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

  const btnCameraPermission = document.getElementById('html5-qrcode-button-camera-permission');
  if(btnCameraPermission) {
    btnCameraPermission.addEventListener('click', () => { selectCameraHowl.play()});
  }
	const scanTypeChange = document.getElementById('html5-qrcode-anchor-scan-type-change');
  const buttonFileSelection = document.getElementById('html5-qrcode-button-file-selection');
	scanTypeChange.addEventListener('click', () => {
    scanTypeChangeHowl.play();
		scanTypeChange.classList.toggle('active');
		buttonFileSelection.textContent = 'click to choose image';
		buttonFileSelection.classList.remove('error');
	});
  buttonFileSelection.addEventListener('click', () => {
    fileSelectionHowl.play();
  });
  setTimeout(() => {
    const btnCameraStart = document.getElementById('html5-qrcode-button-camera-start');
    const btnCameraStop = document.getElementById('html5-qrcode-button-camera-stop');
    if(btnCameraStart || btnCameraStop) {
      btnCameraStart.classList.add('scanActivation');
      btnCameraStop.classList.add('scanActivation');
        const scanActivations = reader.querySelectorAll('.scanActivation');
        scanActivations.forEach(btn => {
          btn.addEventListener('click', () => {
            scanActivationHowl.play();
          });
        });
    }
  }, 1000);

	function success(response) {
    if(response[0] === ' ') { error(); return }
		const result = document.getElementById('result');
		if(isFullWidth(response) || response.includes(' ') 
			|| !response.includes('.') || !response.includes('https://')
    || response.match(/[!@#$%&?*^(){}\[\]<>;,"'~`|\\+=]/g)) {
			result.innerHTML = `<h2>Success</h2>
			<p class="word-wrapper"></p>`;
      createRows(result, response);
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
} //* END OF CREATE SCANNER

  function createRows(result, response) {
    let sentence = response;
    const lastChar = sentence[sentence.length-1];
    let fullWidthSpaceLength = (sentence.match(/\u3000/g) || []).length;
    for (let i = 0; i < fullWidthSpaceLength; i++) { sentence = sentence.replace(/\u3000/g, ' ')}
    const fullWidthAsteriskLength = (sentence.match(/\＊/g) || []).length;
    for (let i = 0; i < fullWidthAsteriskLength; i++) { sentence = sentence.replace('＊', '*')}
    const asteriskLength = (sentence.match(/\*/g) || []).length;
    let [idx, prev] = [0,0]; 
    for (let i = 0; i < asteriskLength+1; i++) {
      idx = sentence.indexOf('*',idx + 1);
      // console.log('idx '+ idx); //* log
      const word = document.createElement('div');
      word.classList.add(`word${i+1}`,'word');
      word.innerHTML = sentence.slice(prev,idx).replace(/\*/g,`$&`);
      if(i === asteriskLength) { word.innerHTML += `${lastChar}`}
      prev = idx+1; 
      // console.log('prev '+ prev); //* log
      if(isFullWidth(word.textContent)) { word.classList.add('zenkakuText')}
      const wordWrapper = result.querySelector('.word-wrapper');
      wordWrapper.appendChild(word); 
    }
  }

let menubar, lastCurrentHeight;
let currentHeight = getComputedStyle(document.body).height;
const portraitSvhValue = [];
const landscapeSvhValue = [];

function getPortraitSvh() {
  if(!landscape && !portraitSvhValue[0]) {
    const portraitSvh = getComputedStyle(document.body).height;
    portraitSvhValue.push(portraitSvh);
    camera.classList.remove('dvh');
    menubar = true;
  }
} getPortraitSvh();

function getLandscapeSvh() {
  if(landscape && !landscapeSvhValue[0]) {
    const landscapeSvh = getComputedStyle(document.body).height;
    landscapeSvhValue.push(landscapeSvh);
    menubar = true;
  }
} getLandscapeSvh();

function setDesktopCameraPosition() {
  if(!mobile) {
    if(innerWidth >= 500) { camera.classList.add('desktop')}
    else { camera.classList.remove('desktop')}
  } 
} setDesktopCameraPosition();


//* resize out of createScanner
	window.addEventListener('resize', () => {
		landscape = window.matchMedia("(orientation: landscape)").matches;
    const qr = imageWrapper.querySelector('.qr');
    if(landscape) { camera.classList.add('inactive')}
    else { if(!qr) { camera.classList.remove('inactive')} }
    if(menubar) { getPortraitSvh(); getLandscapeSvh()}
    if(mobile) {
      currentHeight = getComputedStyle(document.body).height;
      if(!landscape) {
        if(currentHeight > portraitSvhValue) { camera.classList.add('dvh'); menubar = false} 
        else { camera.classList.remove('dvh'); menubar = true}
        if(currentHeight < lastCurrentHeight) { getPortraitSvh()}
      }
      if(landscape) {
        if(currentHeight >= landscapeSvhValue) { menubar = false}
        else { menubar = true}
      }
      lastCurrentHeight = currentHeight;
    }
    setDesktopCameraPosition();
	});



//^ ---------------------------------------------------------------------------------------

  // function createRows(result, response) {
  //   let sentence = response;
  //   const lastChar = sentence[sentence.length-1];
  //   let fullWidthSpaceLength = (sentence.match(/\u3000/g) || []).length;
  //   for (let i = 0; i < fullWidthSpaceLength; i++) { sentence = sentence.replace(/\u3000/g, ' ')}
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
  //     const fullWidthAsteriskLength = (word.textContent.match(/\＊/g ) || []).length;
  //     console.log(fullWidthAsteriskLength); //*log
  //     for (let i = 0; i < fullWidthAsteriskLength; i++) {
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
















