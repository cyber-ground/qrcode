'use strict';

export {console_color,console_red, console_green, 
	console_yellow, console_blue, console_purple, console_cyan}
function console_red(arg) {console.log(`\u001b[31m ${arg}`)}
function console_green(arg) {console.log(`\u001b[32m ${arg}`)}
function console_yellow(arg) {console.log(`\u001b[33m ${arg}`)}
function console_blue(arg) {console.log(`\u001b[34m ${arg}`)}
function console_purple(arg) {console.log(`\u001b[35m ${arg}`)}
function console_cyan(arg) {console.log(`\u001b[36m ${arg}`)}
function console_color(clr,fz,arg,fs,fw,tt) {
	if(fs==='i'){fs='italic'} if(fs==='b'){fw='bold'}
	if(fs==='u'){tt='uppercase'} if(fs==='l'){tt='lowercase'}
	if(fs==='ib'){fs='italic';fw='bold'}
	if(fs==='iu'){fs='italic';tt='uppercase'} 
	if(fs==='il'){fs='italic';tt='lowercase'}
	if(fs==='bu'){fw='bold';tt='uppercase'}
	if(fs==='bl'){fw='bold';tt='lowercase'}
	if(fs==='ibu'){fs='italic';fw='bold';tt='uppercase'}
	if(fs==='ibl'){fs='italic';fw='bold';tt='lowercase'}
	console.log('%c'+ arg,`color:${clr};font-size:${fz};
	font-style:${fs};font-weight:${fw};text-transform:${tt};`)}







