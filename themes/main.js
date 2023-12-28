'use strict';
import './assets/lib/jquery.min.js';
import {
    isCurPage,
    initCardPages,
    initEncryptedPages,
    initMouseClickAnimate,
    initImageZoom,
    browserRedirect,
    scrollToTop,
    betterLocalStorage as bls,
    throttle,
    debounce,
    initHtmlxnkllantern
} from './assets/js/utils.js';

const myhost = window.location.origin;
const nullHost = window.location.host == '';

const pageSuffix = "/blog"
const listHtml = "/list.html";
const indexHtml =  "/index.html";
const blogHtml =  "/archive.html";
const rssXml = "/rss.xml";

const mypath = myhost + location.pathname;
const pagePrefix = myhost + pageSuffix;
const currentPath = location.pathname.replace(pageSuffix, "");

const createDate = $('#postamble .date')[0].innerText.substring(6);

const isPC = browserRedirect() === 'PC';
const isMB = !isPC;
// Init global dom variables
const TOC = $('#table-of-contents');
const BODY = $('body');
const TITLE = $('.title');
const CONTENT = $('#content');

// ------------------------------------------------------------------
function darkColor(){
    document.body.style.backgroundColor = "#333333";
    document.body.style.color = "wheat";
    document.getElementById("content").style.backgroundColor = "#333333";
    document.getElementById("content").style.color = "wheat";
    localStorage.setItem('ykykIsLightThemes', '0');
}
function lightColor(){
    document.body.style.backgroundColor = "white";
    document.body.style.color = "black";
    document.getElementById("content").style.backgroundColor = "white";
    document.getElementById("content").style.color = "black";
    localStorage.setItem('ykykIsLightThemes', '1');
}
// Encapsulation darkreader and bind it to title.
// ---------------------------------

const ykykIsLightThemes = localStorage.getItem('ykykIsLightThemes');
if (ykykIsLightThemes === '0') {
    darkColor();
}else if (ykykIsLightThemes === '1') {
    lightColor();
}else{
    lightColor();
}

function toggleColor(e) {
    const ykykIsLightThemes = localStorage.getItem('ykykIsLightThemes');
    if (ykykIsLightThemes === '0') {
	lightColor();
    }else if (ykykIsLightThemes === '1') {
	darkColor();
    }
}

// insertWordCountInfo
function insertWordCountInfo(){

    let dateArr = createDate.split(" ");
    const date = dateArr[0] +" "+ dateArr[2] +" "+  weekFormatHash[dateArr[1]]

    let words = $("#content").html().replace(/<.*?>/g,"").replace(/\n/g,"");
    let wordStr = wordCount(words) + "字";

    $('#postamble .date')[0].innerText = date

    if(![indexHtml, "/rss/list.html", "/"].includes(currentPath)){

	$(`<div class="article-info">
        <ul>
            <li><span id="ykykHideDir">${date}</span></li>
            <li>${wordStr}</li>
            <li>&nbsp;&nbsp;</li>
            <li><span id="color">🌞🌛</span></li>
        </ul>
    </div>`).insertAfter('.title');

	$('#ykykHideDir').click(ykykHideDir);
	$('#color').click(toggleColor);
    }
}

// 字数统计
function wordCount(data){
    var pattern = /[a-zA-Z0-9_\u0392-\u03c9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
    var m =data.match(pattern);
    var count = 0;
    if(m==null){return count;}
    for(var i=0;i<m.length;i++){
	if(m[i].charCodeAt(0)>=0x4E00){
            count +=m[i].length;
	}else{
            count += 1;
	}
    }
    return count;
}

const weekFormatHash = {
    "Mon": "周一",
    "Tue": "周二",
    "Wed": "周三",
    "Thu": "周四",
    "Fri": "周五",
    "Sat": "周六",
    "Sun": "周日",
    "Monday": "周一",
    "Tuesday": "周二",
    "Wednesday": "周三",
    "Thursday": "周四",
    "Friday": "周五",
    "Saturday": "周六",
    "Sunday": "周日"
};

// 图片预览
// initImageZoom();

function isBlog() {
    return currentPath == "/" || currentPath.includes(indexHtml) || currentPath.includes(listHtml) || currentPath.includes(blogHtml);
}

function whetherShowAboutAndIDX() {
    if(nullHost || location.pathname == pageSuffix+indexHtml || location.pathname == pageSuffix || location.pathname == pageSuffix+"/"){
	return false;
    }
    return true;
}

// Hide directory when click it
function ykykHideDir(){

    if(isMB){
	return;
    }

    let ele = document.getElementById('table-of-contents');
    let _opacity = getComputedStyle(ele).opacity;

    if (_opacity == 1) {
        ele.style.opacity = 0;
	ele.style.left = "-16%";

    } else {
        ele.style.opacity = 1;
	ele.style.left = "0";
    }
}

if(isMB){
    let ele = document.getElementById('table-of-contents');
    if(ele != null){
	let _opacity = getComputedStyle(ele).opacity;
	ele.style.opacity = 0;
	ele.style.left = "-16%";
    }

}else{
    let ele = document.getElementById('table-of-contents');
    if(ele != null){
	let _opacity = getComputedStyle(ele).opacity;
	ele.style.opacity = 1;
	ele.style.left = "0";
    }

}

// Customize BLOG page style
// ---------------------------------
if (isBlog()) {
    BODY.addClass('js-nav-body');

    $('table').hide();
    $('<div class="js-nav-link-container"></div>').insertAfter(TITLE);

    $('td a').each(function (idx, item) {
        $(this).attr('target', '_blank');
        $('.js-nav-link-container').append(item);
    });

    $('.org-ul a').each(function () {
        $(this).attr('target', '_blank');
    });

    let NL = $('.js-nav-link-container a');
    let _len = NL.length,
        _remainder = 0;

    _remainder = _len % 5;

    if (_remainder == 0) _remainder = 5;

    for (let i = 0; i < 5 - _remainder; i++) {
        $('.js-nav-link-container').append('<a></a>');
    }

}

// Customize annotations
// ------------------------------------------
$('.jk-drawer .collapsible').each(function () {
    $(this).click(function () {
        this.classList.toggle('active');
        let _ctx = this.nextElementSibling;
        if (_ctx.style.maxHeight) {
            _ctx.style.maxHeight = null;
        } else {
            _ctx.style.maxHeight = _ctx.scrollHeight + 'px';
        }
    });
});


// Add mouse-click animation
// ---------------------------------
if (isPC) { initMouseClickAnimate() }

// Show type of code block
// ---------------------------------
$('.src').each(function () {
    let str = $(this)[0].className.split(' src-')[1];
    $('<span class="js-code-src">' + str + '</span>').prependTo($(this));
});

// Hide line number when copy
$('pre').each(function () {
    $(this).dblclick(function () {
        let _this = $(this);
        _this.addClass('js-pre-dblclick');
        setTimeout(function () { _this.removeClass('js-pre-dblclick') }, 10000);
    });
});

// Toggle fold headlines - h2-h4
toggleHeadLevel(2);
toggleHeadLevel(3);
toggleHeadLevel(4);

function toggleHeadLevel(_level) {
    $('.outline-' + _level).each(function (idx, item) {
        // console.log(idx + ' --- ' ,  item.id);
        // console.log(item.id.slice(18));
        let _nodeid = item.id.slice(18);
        $('#' + _nodeid).click(function () {
            // console.log($('#' + _nodeid))
            $('#' + _nodeid).toggleClass('has-folded');
            $('#text-' + _nodeid).toggle();
            $(`#${item.id} .outline`).toggle();
        })
    })
}

// ==================================================================

// Scroll listener
// ---------------------------------

// DIR -- Highlight current headline
// ---------------------------------
// Re-construct <a> of '#table-of-contents'
$(document).ready(function () {
    let _links = $('#text-table-of-contents a');

    _links.each(function () {
        let _class = $(this).attr('href').split('#')[1];
        $(this).addClass('links ' + _class);
    });

    $.each([2, 3, 4, 5, 6], function (index, val) {
        if ($('.outline-' + val)) {
            let _outlines = $('.outline-' + val);

            _outlines.each(function () { $(this).addClass('outline') });
        }
    });
});

// Scroll
$(window).scroll(function () {
    var $sections = $('.outline');              // get all content blocks
    var currentScroll = $(this).scrollTop();    // height of window scroll
    var $currentSection;                        // current content block

    // just for getting the distance from the first headline to top
    var _arrTop = [];

    $sections.each(function () {
        var divPosition = $(this).offset().top;

        _arrTop.push(divPosition);

        if (divPosition - 1 < currentScroll) { $currentSection = $(this) }

        // Avoid there no block at current height
        if (currentScroll >= _arrTop[0]) {
            let _id = $currentSection.attr('id');
            let _idArr = _id.split('-');
            _id = _idArr[_idArr.length - 1];

            $('.links').removeClass('js-link-active');
            $('.' + _id).addClass('js-link-active');
        }
    });
});

window.onload = function (){
    if(nullHost){
	return;
    }
    let opt={"title": location.pathname}
    let url= "https://yangk.net/api/blog_record"
    $.ajax({
	type: "post",
	url: url,
        dataType : "json",
        contentType : "application/json",
        data: JSON.stringify(opt),
	success: function (d) {
            console.log(d);
	}
    });
}


if(![indexHtml, "/"].includes(currentPath)){
    insertWordCountInfo();
}

// 挂灯笼
if(!nullHost){
    // initHtmlxnkllantern();
}
