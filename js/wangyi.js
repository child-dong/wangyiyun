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

	function pic(data){
		oUl.innerHTML = "";
		for(var i = 0; i < data.result.songs.length; i++){
			var li = document.createElement('li');
			li.style.position = 'relative';

			var img = document.createElement('img');
			img.src = data.result.songs[i].al.picUrl;
			img.setAttribute('data-id',data.result.songs[i].id)
			img.setAttribute('alt', data.result.songs[i].mv)
			li.appendChild(img);

			if(img.getAttribute('alt')!=0){
				var div = document.createElement('div');
				div.setAttribute('data-id', data.result.songs[i].mv)
				div.style.position = 'absolute';
				div.style.top = 0;
				div.style.left = 0;
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

			var title = document.createElement('p');
			title.innerHTML = data.result.songs[i].name;
			li.appendChild(title);

			var singer = document.createElement('p');
			singer.innerHTML = data.result.songs[i].ar[0].name;
			li.appendChild(singer)

			oUl.appendChild(li);
		}
	}

	ajax({
		url:'https://api.imjad.cn/cloudmusic/?type=search&s=童话镇',
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

	oUl.onclick = function(e){
		var eve = e||window.event;
		var target = eve.srcElement||eve.target;
		if(target.nodeName.toLowerCase() == 'img'){
			ajax({
				url:'https://api.imjad.cn/cloudmusic/?type=song&id='+target.getAttribute("data-id")+"&br=128000",
				success:function (data){
					audi.setAttribute('src', data.data[0].url);
				}
			})
		}
		if(target.nodeName.toLowerCase() == 'div'){
			ajax({
				url:'https://api.imjad.cn/cloudmusic/?type=mv&id='+target.getAttribute("data-id")+"&br=128000",
				success:function (data){
					var arr = [];
					for(i in data.data.brs){
						if(data.data.brs.hasOwnProperty(i)){
							arr.push(data.data.brs[i])
						}
					}
					vide.style.display = 'block';
					vide.setAttribute('src', arr[0]);
				}
			})
		}
	}
}