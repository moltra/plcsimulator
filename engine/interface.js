//
//
var sJSCode = 'alert(iMAXAddress);'
function DebugConsole(ParentNode,r,c){
	//
	var textArea = document.createElement('TEXTAREA');
	textArea.setAttribute('id', 'console');
	textArea.setAttribute('rows', r);
	textArea.setAttribute('cols', c);
	textArea.setAttribute('value', sJSCode);
	ParentNode.appendChild(textArea);
	//
	ParentNode.appendChild(document.createElement('BR'));
	//
	var button = document.createElement('BUTTON');
	button.setAttribute('id', 'enter');
	button.setAttribute('value', 'Выполнить');
	button.attachEvent('onclick', RunCode);
	ParentNode.appendChild(button);
	textArea = null;
	button = null;
//	ParentNode = null;
}
function RunCode(){
	eval(console.value);
	window.event.cancelBubble = true;
}
// Перехват нажатия кнопок клавиатуры:
function fnTrapKD(){
/*	if(event.keyCode == 115 ){
		//document.getElementById("ECode").innerHTML = event.keyCode + ": "+String.fromCharCode(event.keyCode);
		alert("Key "+ event.keyCode + " is restricted!");
		event.returnValue=false;
	} */
}
//
var iAnchors=0;
function ShowDelimeter(Text,Color) {
	iAnchors++;
	var str = "<div delimeter='true' class='Delimeter' ALIGN=center style=background-color:'"+Color+"';>"+Text.anchor('#'+iAnchors.toString())+"</div>";
	document.write(str);
	var Link = document.createElement('div');
	Link.innerHTML = Text;
	Link.href = iAnchors.toString();
	Link.title="Click to GO!";
	Link.className ='Link';
	Link.style.backgroundColor = Color;
	Link.attachEvent('onclick',GoToAnchor);
	leftmenu.appendChild(Link);
	Link = null;
}
//
function GoToAnchor(){
	if (!e) var e = window.event;
	// handle event
	if(e.srcElement.href !=  null ){
		window.location = "#"+e.srcElement.href;
	}else{ alert( "GoToAnchor() error: "+e.srcElement ); }
	//
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return;
}
//
function Mask2NumberBit(x)
{
	var i;
	var h = 0;
	if(x == -0x8000) return 15;
	if ( (x&(x-1)) == 0){
		for (i = 16; i >= 1; i >>= 1) {
			if (x >> i) {
				h += i;
				x >>= i;
			}
		}
		return h;
	}
	return 0xFFFF;
}
//
function UNSIG2SIG(x){
	if(0x8000 == x) return -0x8000;
	if(x > 0x8000){
		return -0x8000+(x-0x8000);
	}
	return x;
}
function SIG2UNSIG(x){
	if( -0x8000 == x) return 0x8000;
	if(x < 0){
		return (x+0x8000*2)&0xFFFF;
	}
	return x&0xFFFF;
}
// преобразование Double
function DSIG2UNSIG(x){
	if( -0x80000000 == x) return 0x80000000;
	if(x < 0){
		return (x+0x80000000)+0x80000000;
	}
	return x;
}
// 
function LeftFillZeros(sString, iWidth){
	var i;
	var iNumbers;
	if(sString.length <= iWidth){
		iNumbers = iWidth-(iWidth - sString.length);
		for( i = iNumbers ; i < iWidth; i++){
			sString = "0"+sString;
		}
	}else{
		return sString.substring(1, iWidth+1);
	}
	return sString;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function TagShow(oMBS,oParentNode, oTagsArray){
	for (var i = 0, len = oTagsArray.length; i < len; i++){
		if(oTagsArray[i]){
			// Формирование текста 
			var ShowTagText = document.createElement('div');
			ShowTagText.className ='TagShow';
			ShowTagText.title = "";
			ShowTagText.appendChild(document.createElement("<input type='checkbox'>"));
			ShowTagText.appendChild(document.createTextNode(oTagsArray[i].iTagMBAddress+(oTagsArray[i].iTagMask?("/0x"+LeftFillZeros(oTagsArray[i].iTagMask.toString(16).toUpperCase(),4)):" ")+" "+oTagsArray[i].sTagName+" "+oTagsArray[i].sTagDescription));
			// Формирование показа значения тега
			var ShowTagValue = document.createElement('div');
			ShowTagValue.oTag = oTagsArray[i];
			ShowTagValue.className =oTagsArray[i].className;
			ShowTagValue.MBS = oMBS;
			ShowTagValue.id = oTagsArray[i].sTagID;
			ShowTagValue.attachEvent('onclick', oTagsArray[i].sClickHandler);
			ShowTagValue.title="Click to change";
			// Отображение значения тега
			ShowTagValue.appendChild(document.createTextNode("E"));
			// Компоновка текста, показа значения тега в один Node
			ShowTagText.appendChild(ShowTagValue);
			//
			oParentNode.appendChild(ShowTagText);
			ShowTagText = null;
			ShowTagValue = null;
		}
	}
	return;
}







