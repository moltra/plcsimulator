// Начальный адрес симулятора ModBus:
var MB_iBeginSimulationAddress = 0;
//
var iNotSimMBAddreses = new Array();
function MB_sPLCAddr2iMBAddr(sPLCAddr){
	var iAddress;
	//alert(sPLCAddr+": "+pBechoffAdr[0]+"."+pBechoffAdr[1]);
	if(null != sPLCAddr || "" != sPLCAddr)
		iAddress = (MB_iBeginSimulationAddress + parseInt(sPLCAddr) );
	else return -1;
	// Адреса > ограничения Modbus slave не симулируются
	if (iAddress < MB_iBeginSimulationAddress + 2048){
		iMAXAddress = Math.max(iMAXAddress, iAddress);
	}else{
		iNotSimMBAddreses[iNotSimMBAddreses.length] = iAddress;
	}
	return iAddress;
}
//
function BKF_sPLCAddr2iBitMask(sPLCAddr){
/* Преобразование адреса вида: %dXa.b в маску бита
где: 
d - направление регистра (ввод/вывод) в симуляторе не имеет значения
X - X, есть обозначение - в программе для контроллера
a - номер байта в который упакован бит
b - номер бита в байте
*/
	var RegExp = /\d+/ig; // new RegExp("\d","ig");  //Create regular expression object. полностью: \%I|Q|M\d\.\d
	var pBechoffAdr = sPLCAddr.match(RegExp);	// pBechoffAdr = ссылка на первую и вторую цифирь
	RegExp = null;
	//alert(sPLCAddr+": "+pBechoffAdr[0]+"."+pBechoffAdr[1]);
	return UNSIG2SIG( Math.pow(2,parseInt(pBechoffAdr[1])) );
}
//
function BKF_GetType(sPLCAddr){
/* Получить из строчки вида: %dXa.b букву "X" обозначающую тип переменной (размерность)
где: 
d - направление регистра (ввод/вывод) в симуляторе не имеет значения
X - X, есть обозначение - в программе для контроллера
a - номер байта в который упакован бит
b - номер бита в байте
*/
	var RegExp = /X|B|W|D/i; //
	var pType = sPLCAddr.match(RegExp);
	RegExp = null;
	return pType[0].toUpperCase();
}
// Добавляет к объекту обработчик клика мыши на значении; стиль отображения значения; ModBus адрес; Маска бита (для %MX)
function BKF_Prepare(oTags){
	for (var i = 0, len = oTags.length; i < len; i++){
		if( oTags[i] && oTags[i].sTagPLCAddress){	// проверка что объект и значение sTagPLCAddress существуют
			var sTagType = BKF_GetType(oTags[i].sTagPLCAddress);
			//
			oTags[i].sTagID = "BKF";		// для работы функции обновления значения данных
			oTags[i].sTagType = sTagType;
			oTags[i].className = "TagValue"+sTagType;	// Назначить стиль отображения данных
			// обработчик клика на значении
			switch (sTagType){
				case "X":
					oTags[i].sClickHandler = BKF_ClickHandlerX;
					oTags[i].iTagMBAddress = BKF_sPLCAddr2iMBAddr(oTags[i].sTagPLCAddress);
					oTags[i].iTagMask = BKF_sPLCAddr2iBitMask(oTags[i].sTagPLCAddress);
					break;
				case "B":
					oTags[i].sClickHandler = BKF_ClickHandlerB;
					oTags[i].iTagMBAddress = BKF_sPLCAddr2iMBAddr(oTags[i].sTagPLCAddress);
					break;
				case "W":
					oTags[i].sClickHandler = BKF_ClickHandlerW;
					oTags[i].iTagMBAddress = BKF_sPLCAddr2iMBAddr(oTags[i].sTagPLCAddress);
					break;
				case "D":
					oTags[i].sClickHandler = BKF_ClickHandlerD;
					oTags[i].iTagMBAddress = BKF_sPLCAddr2iMBAddr(oTags[i].sTagPLCAddress);
					break;
				default: 
					oTags[i].sClickHandler = BKF_ClickHandlerError;
			}
		}
	}
	var sErrorMSG = "Не симулируемые ModBus адреса: ";
	for (var i = 0, len = iNotSimMBAddreses.length; i < len; i++){
		sErrorMSG += iNotSimMBAddreses[i].toString()+" | ";
	}
	document.getElementById("errors").innerHTML = sErrorMSG;
}
// Обработчики кликов на значении
function BKF_ClickHandlerX(){
	var tmp=0;
	if (!e) var e = window.event;
	// handle event
	if(e.srcElement.MBS){
		tmp = e.srcElement.MBS.Register(e.srcElement.oTag.iTagMBAddress - BKF_iBeginSimulationAddress);
		if(tmp & e.srcElement.oTag.iTagMask) tmp &= (~e.srcElement.oTag.iTagMask);
		else tmp |= e.srcElement.oTag.iTagMask;
		//
		e.srcElement.MBS.Register(e.srcElement.oTag.iTagMBAddress - BKF_iBeginSimulationAddress) = UNSIG2SIG(tmp);
		BKF_TagReadX( e.srcElement );
		//
	}else{ alert( "BKF_ClickHandlerX error"); }
	//
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return;
}
function BKF_ClickHandlerB(){
	var tmp=0;
	if (!e) var e = window.event;
	// handle event
	if(e.srcElement.MBS){
		tmp = BKF_TagReadW(e.srcElement);
		var X=InputBox("ModBus адрес: "+e.srcElement.oTag.iTagMBAddress+" (0x"+e.srcElement.oTag.iTagMBAddress.toString(16).toUpperCase()+")\nИмя тега: "+e.srcElement.oTag.sTagName+"\nОписание тега: "+e.srcElement.oTag.sTagDescription+"\n\nПодсказка:\nБез префикса - принимается DEC значение \nПрефикс \"0x\" - HEX", "Введите новое значение", tmp&0xFF );
		if(X){
			tmp =  (parseInt(X)&0x00FF) | (tmp&0xFF00);
			e.srcElement.MBS.Register(e.srcElement.oTag.iTagMBAddress - BKF_iBeginSimulationAddress) = UNSIG2SIG(tmp);
		}
	}else{ alert( "BKF_ClickHandlerB error"); }
	//
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return;
}
function BKF_ClickHandlerW(){
	var tmp=0;
	if (!e) var e = window.event;
	// handle event
	if(e.srcElement.MBS){
		var X=InputBox("ModBus адрес: "+e.srcElement.oTag.iTagMBAddress+" (0x"+e.srcElement.oTag.iTagMBAddress.toString(16).toUpperCase()+")\nИмя тега: "+e.srcElement.oTag.sTagName+"\nОписание тега: "+e.srcElement.oTag.sTagDescription+"\n\nПодсказка:\nБез префикса - принимается DEC значение \nПрефикс \"0x\" - HEX", "Введите новое значение",BKF_TagReadW(e.srcElement) );
		if(X){
			tmp = parseInt(X);
			e.srcElement.MBS.Register(e.srcElement.oTag.iTagMBAddress - BKF_iBeginSimulationAddress) = UNSIG2SIG(tmp&0xFFFF);
		}
	}else{ alert( "BKF_ClickHandlerW error"); }
	//
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return;
}
function BKF_ClickHandlerD(){
	var tmp=0;
	if (!e) var e = window.event;
	// handle event
	if(e.srcElement.MBS){
		var X=InputBox("ModBus адрес: "+e.srcElement.oTag.iTagMBAddress+" (0x"+e.srcElement.oTag.iTagMBAddress.toString(16).toUpperCase()+")\nИмя тега: "+e.srcElement.oTag.sTagName+"\nОписание тега: "+e.srcElement.oTag.sTagDescription+"\n\nПодсказка:\nБез префикса - принимается DEC значение \nПрефикс \"0x\" - HEX", "Введите новое значение",BKF_TagReadD(e.srcElement).toString(10));	// "0x"+BKF_TagReadD(e.srcElement).toString(16).toUpperCase() HEX
		if(X){
			tmp = parseInt(X);
			e.srcElement.MBS.Register(e.srcElement.oTag.iTagMBAddress - BKF_iBeginSimulationAddress) = UNSIG2SIG(tmp&0xFFFF);
			e.srcElement.MBS.Register(e.srcElement.oTag.iTagMBAddress - BKF_iBeginSimulationAddress+1) = UNSIG2SIG( (tmp>>16)&0xFFFF );
		}
	}else{ alert( "BKF_ClickHandlerD error: No ModBus address"); }
	//
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return;
}
function BKF_ClickHandlerError(){
	var tmp=0;
	if (!e) var e = window.event;
	// handle event
	alert("ERROR: Check the "+sFileNameXLS+" for valid values (the pattern: %[M|X|Q][X|B|W|D][\d|\d.\d]) of Address = "+e.srcElement.sTagPLCAddress);
	//
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	return;
}
//
function BKF_TagRefreshValue(){
	var oObjects = document.all.item("BKF");
	var tmp = 0;
	if (oObjects != null){
		document.getElementById("state").innerHTML = "В файле: "+sFileNameXLS+" найдено описание "+oObjects.length+" тегов.";
		if (oObjects.length != null){
			for (i = 0, len = oObjects.length; i < len; i++){
				switch(oObjects[i].oTag.sTagType){
					case "X":
						BKF_TagReadX(oObjects[i]);
						break;
					case "B":
						BKF_TagReadW(oObjects[i]);
						break;
					case "W":
						BKF_TagReadW(oObjects[i]);
						break;
					case "D":
						BKF_TagReadD(oObjects[i]);
						break;
					default:
				}
			}
		}
		else{
			alert("MBS_TagRefreshValue X3 error: "+oObject.sTagName);
		}
	}
	return;
}
//
function BKF_TagReadX(oObject){
	var tmp = oObject.MBS.Register(oObject.oTag.iTagMBAddress - BKF_iBeginSimulationAddress);
	if(true && (tmp&oObject.oTag.iTagMask)){
		oObject.style.background = DEFColor_ON;
		oObject.innerHTML = "1";
		return true;
	}else{
		oObject.style.background = DEFColor_OFF;
		oObject.innerHTML = "0";
		return false;
	}
}
function BKF_TagReadW(oObject){
	var tmp = oObject.MBS.Register(oObject.oTag.iTagMBAddress - BKF_iBeginSimulationAddress);
	oObject.innerHTML = SIG2UNSIG(tmp).toString();
	return SIG2UNSIG(tmp);
}
function BKF_TagReadD(oObject){
	var st =  SIG2UNSIG(oObject.MBS.Register(oObject.oTag.iTagMBAddress - BKF_iBeginSimulationAddress + 1) ) << 16;
	var lt =  SIG2UNSIG(oObject.MBS.Register(oObject.oTag.iTagMBAddress - BKF_iBeginSimulationAddress) );
	oObject.innerHTML = DSIG2UNSIG(st|lt).toString(10);	// DEC
	//oObject.innerHTML = DSIG2UNSIG((st)|(lt)).toString(16).toUpperCase();	// HEX
	return DSIG2UNSIG(st|lt);
}