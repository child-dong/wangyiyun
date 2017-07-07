function ajax(option){
	var type = option.type||'get';
	var url = option.url;
	var async = option.async||true;
	var success = option.success;

	var xml = null;
	if(window.XMLHttpRequest){
		xml = new XMLHttpRequest();
	}else{
		xml = new ActiveXobject("Microsoft.XMLHttp");
	}
	xml.open(type,url,async);

	xml.send();

	xml.onreadystatechange = function(){
		if(xml.readyState==4){
			if(xml.status == 200){
				var body = JSON.parse(xml.responseText);
				success&&success(body);
			}else{
				alert(xml.status);
			}
		}
	}
}


window.onload = function(){

	var btn = document.getElementById('btn');
	var inp = document.getElementById('inp');
	var oUl = document.getElementById('lists');
	var audi = document.getElementById('audio');
	var vide = document.getElementsByTagName('video')[0];
	var choose = document.getElementById('choose');
	var lyric = document.getElementById('lyric');
	var musicTitle = document.getElementById('music-title');
	var auPic = document.getElementById('pic');

	function pic(data){
		oUl.innerHTML = "";
		for(var i = 0; i < data.result.songs.length; i++){
			var li = document.createElement('li');
			li.style.position = 'relative';

			var img = document.createElement('img');
			img.src = data.result.songs[i].al.picUrl;
			img.setAttribute('data-id',data.result.songs[i].id)
			img.setAttribute('alt', data.result.songs[i].mv)
			img.setAttribute('title', data.result.songs[i].name)
			img.setAttribute('singer', data.result.songs[i].ar[0].name)
			li.appendChild(img);

			if(img.getAttribute('alt')!=0){
				var div = document.createElement('div');
				div.setAttribute('data-id', data.result.songs[i].mv)
				div.style.position = 'absolute';
				div.style.top = 0;
				div.style.left = 0;
				div.style.zIndex = 1000;
				div.style.height = "80%";
				div.style.width = "100%";
				div.style.borderRadius = '50%';
				div.style.backgroundColor = "rgba(8,8,8,0.7)";
				div.style.textAlign = 'center';
				div.style.lineHeight = '200px';
				div.style.fontSize = '40px';
				div.style.weight = 700;
				div.style.color = "white";
				div.innerHTML = "MV";
				li.appendChild(div)
			}

			var title = document.createElement('span');
			title.innerHTML = data.result.songs[i].name+" - ";
			li.appendChild(title);

			var singer = document.createElement('span');
			singer.innerHTML = data.result.songs[i].ar[0].name;
			li.appendChild(singer)

			oUl.appendChild(li);
		}
	}

	ajax({
		url:'https://api.imjad.cn/cloudmusic/?type=search&s=说散就散',
		success:pic
	})

	inp.onkeyup = function(){
		var reg = /[\u4e00-\u9fa5]/;
		choose.innerHTML = "";
		if(reg.test(inp.value)){
			choose.style.display = "block";
			ajax({
				url:'https://api.imjad.cn/cloudmusic/?type=search&s='+inp.value,
				success:function (data){
					for(var i =0;i<5;i++){			
						p = document.createElement('p');
						p.innerHTML = data.result.songs[i].name;
						choose.appendChild(p);
					}
				}
			})
		}else if (inp.value == "") {
			choose.style.display = 'none';
		}
	} 

	choose.onclick = function(e){
		var eve = e||window.event;
		var target = eve.srcElement||eve.target;
		if(target.nodeName.toLowerCase() == 'p'){
			inp.value = target.innerHTML;
			choose.style.display = 'none';
		}
	}

	btn.onclick = function (){
		choose.style.display = 'none';

		if(inp.value == ""){
			return false;
		}
		
		ajax({
			url:'https://api.imjad.cn/cloudmusic/?type=search&s='+inp.value,
			success:pic
		})
	}

	window.onkeydown = function(e){
		if(e.keyCode == 13){
			inp.blur();
			choose.style.display = 'none';
			if(inp.value == ""){
				return false;
			}
			
			ajax({
				url:'https://api.imjad.cn/cloudmusic/?type=search&s='+inp.value,
				success:pic
			})
		}
	}

	oUl.onclick = function(e){

		var eve = e||window.event;
		var target = eve.srcElement||eve.target;
		if(target.nodeName.toLowerCase() == 'img'){

			audi.currentTime = 0;
			audi.play();
			vide.pause();
			lyric.style.display = "block";
			audi.style.display = "block";
			auPic.innerHTML = "";
			auPic.style.display = "block";

			if(audi.play()){
				vide.style.display = "none";
			}

			ajax({
				url:'https://api.imjad.cn/cloudmusic/?type=song&id='+target.getAttribute("data-id")+"&br=128000",
				success:function (data){
					audi.setAttribute('src', data.data[0].url);
					musicTitle.innerHTML = "";

					var span = document.createElement('span');
					span.innerHTML = target.getAttribute('title')+" - ";
					musicTitle.appendChild(span);

					var span = document.createElement('span');
					span.innerHTML = target.getAttribute('singer');
					musicTitle.appendChild(span);

					var img = document.createElement('img');
					img.src = target.getAttribute("src");
					auPic.appendChild(img);

					var time = null;
					time = setInterval(function(){		
						if(audi.paused){
							img.style.animation = "imag 8s linear infinite paused";
							lyric.innerHTML = "";
						}
						else if(!audi.paused){
							img.style.animation = "imag 8s linear infinite";
						}
					},30)
				}
			})
			
			ajax({
				url:'https://api.imjad.cn/cloudmusic/?type=lyric&id='+target.getAttribute("data-id")+"&br=128000",
				success:function (data){
	
					// var lyc = data.lrc.lyric;

					// var reg = /\n/g;
					// var lyic = lyc.replace(reg,"")

					// var reg1 = /\[\d{2}:\d{2}.\d{2,3}\]/g;
					// var lyc1 = lyic.replace(reg1,'n')
					// var lycs = lyc1.split('n');
					// lycs.shift();
					// console.log(lycs);

					// var reg2 = /\d{2}\d{2}\d{2,3}/g;
					// var lyc3 = lyic.replace(/[dd:dd.dd]/g,"");
					// var times = lyc3.match(reg2);
					// console.log(times)
					
					// audi.ontimeupdate = function (argument) {
					// 	console.log(this.currentTime);

					// 	console.log(parseInt(this.currentTime))
					// 	if(times[0] = argument[0].currentTime){
					// 		lyric.innerHTML = lycs[0]
					// 	}
					// }


					var lyc = JSON.stringify(data.lrc.lyric);

					var aLyric = [];
					var reg = /\[\d{2}:\d{2}.\d{1,3}\]/g;
					var reg2 = /"|\[\d{2}:\d{2}.\d{1,3}\]/g;

					var aLyric = lyc.split(/\\n/g);

					var aTime = [];
					var aLyic = [];

					for(var i=0;i<aLyric.length-1;i++){
					 	aTime.push(aLyric[i].match(reg));
					 	aLyic.push(aLyric[i].replace(reg2, ''));
					}



					aTime.forEach( function(arr, index) {
						var arr2;
						if(arr != null){
							arr2 = arr.toString();							
						}else{
							arr2 = "[00:00:00]";
						}
						var time1 = arr2.slice(1, -1).split(':');
						aLyric.push([parseInt(time1[0], 10) * 60 + parseFloat(time1[1]), aLyic[index]])
					})

					audio.ontimeupdate = function(){
						for(var i=0;i<aLyric.length;i++){
							if(parseInt(this.currentTime) === parseInt(aLyric[i][0])){
								lyric.innerHTML = '';
								var p = document.createElement('p');
								p.innerText = aLyric[i][1];
								lyric.appendChild(p)
							}
						}
					}
				}
			})
		}
		if(target.nodeName.toLowerCase() == 'div'){

			audi.pause();
			audi.currentTime = 0;
			lyric.style.display = "none";
			audi.style.display = "none";
			musicTitle.innerHTML = "";
			auPic.innerHTML = "";
			auPic.style.display = "none";

			ajax({
				url:'https://api.imjad.cn/cloudmusic/?type=mv&id='+target.getAttribute("data-id")+"&br=128000",
				success:function (data){
					var arr = [];
					for(i in data.data.brs){
						if(data.data.brs.hasOwnProperty(i)){
							arr.push(data.data.brs[i])
						}
					}
					vide.style.display = "block";
					vide.setAttribute('src', arr[1]);
				}
			})
		}
	}
}