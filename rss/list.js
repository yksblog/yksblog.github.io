const ykykUrl = "https://yangk.net";

const rssUrlOrigin = ykykUrl + "/api/blog_rss";

function updateRss(){

    const url = rssUrlOrigin + "/sync_rss"
    const xhr=new XMLHttpRequest()
    //2.初始化 设置请求方法和url
    xhr.open("POST", url)
    //3.发送
    xhr.send()

    document.getElementById("addRssResult").innerHTML="<p><b>【更新订阅已触发】</b></p>";

}

    function showOrHideRssUpdateDiv(){

	if("none" == $("#rss-add-update-div-id").css("display")){
	    $("#rss-add-update-div-id").show();
	}else{
	    $("#rss-add-update-div-id").hide();
	}
    }



function addRss(){

    const url = rssUrlOrigin;

    const addRssResult=document.getElementById("addRssResult");
    const rssTitle=document.getElementById("rssTitle").value;
    const rssUrl=document.getElementById("rssUrl").value;

    var opt={"title": rssTitle, "url": rssUrl}

    //1.创建对象
    const xhr=new XMLHttpRequest()
    //2.初始化 设置请求方法和url
    xhr.open("POST", url);//?后面是get请求加参数方法
    // 设置POST请求的请求头
    xhr.setRequestHeader("Content-Type", "application/json");

    //3.发送
    xhr.send(JSON.stringify(opt))
    //4.事件绑定 处理服务端返回的结果
    xhr.onreadystatechange=function(){
	if(xhr.readyState===4){
	    //判断响应状态码
	    if(xhr.status>=200 && xhr.status<=300){
		addRssResult.innerHTML="<p><b>ok-"+rssTitle+"<b></p>";
	    }
	}
    }
}


function findPage(){
    const result=document.getElementById("rss-result");
    const rssTotalNumber=document.getElementById("rss-total-number");
    const rssId=document.getElementById("rssId").value;

    let url = rssUrlOrigin + "/page";

    if (rssId != "0") {
	url += "?rss="+ rssId;
    }

    //1.创建对象
    const xhr=new XMLHttpRequest()
    //2.初始化 设置请求方法和url
    xhr.open("GET", url);//?后面是get请求加参数方法
    //3.发送
    xhr.send()
    //4.事件绑定 处理服务端返回的结果
    xhr.onreadystatechange=function(){
	if(xhr.readyState===4){
	    //判断响应状态码
	    if(xhr.status>=200 && xhr.status<=300){

		const list = JSON.parse(xhr.response);

		let resultHtml = "";

		for (let i=0;i<list.length;i++){
		    let o = list[i]
		    resultHtml += "<p>"
		        + "<b>"+ o.blogTitle +"</b>"
			+ " ➣ <a href =\"" + o.linkUrl+ "\"target='_blank'> "+o.title+" </a>"
			+ "<span class='rss-list-timestamp'>" + o.publishTime + "</span>"
			+"</p>"
		}

		result.innerHTML=resultHtml;
		rssTotalNumber.innerHTML="共<b>"+ list.length +"</b>条"

	    }
	}
    }
}

function rssMenuItem(){

    const rssId=document.getElementById("rssId");
    const rssUpdateTime=document.getElementById("rss-update-time");

    const url = rssUrlOrigin + "/rss_option_item";

    //1.创建对象
    const xhr=new XMLHttpRequest()
    //2.初始化 设置请求方法和url
    xhr.open("GET", url);//?后面是get请求加参数方法
    //3.发送
    xhr.send()
    //4.事件绑定 处理服务端返回的结果
    xhr.onreadystatechange=function(){
	if(xhr.readyState===4){
	    //判断响应状态码
	    if(xhr.status>=200 && xhr.status<=300){

		const d = JSON.parse(xhr.response);
		const updateTime = d.updateTime
		const list = d.list
		let resultHtml = "<Option value='0'>所有</option>"

		for (let i=0;i<list.length;i++){
		    let o = list[i]
		    resultHtml += "<Option value='"+ o.id +"'>"+ o.title +"</option>"
		}

		rssId.innerHTML=resultHtml;
		rssUpdateTime.innerHTML="<p><span onclick='showOrHideRssUpdateDiv()' class='rss-list-timestamp'>上次更新时间：</span><b>"+updateTime+"</b></p>";
	    }
	}
    }
}

window.onload = function (){

    rssMenuItem();
    findPage();

    if(window.location.host != ''){
	let opt={"title": location.pathname}
	let url= ykykUrl + "/api/blog_record"
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
}
