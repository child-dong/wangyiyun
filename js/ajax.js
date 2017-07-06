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