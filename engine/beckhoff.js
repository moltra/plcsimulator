/*
� ������ PLC �������������� ������ ������� 0�03 � 0�04 ModBus ������� �������� ���������:
������ ������ Holding Registers, ������ ModBus ����� ��� PLC �������: 
[%MX0.0 & %MB0 & %MW0 & %MD0]	=> 16384
[%MX1.0 & %MB1]				=> 16384 (������� ����)
[%MX2.0 & %MB2 & %MW2 & %MD2]	=> 16385
[%MX3.0 & %MB3]				=> 16385 (������� ����)
[%MX4.0 & %MB4 & %MW4 & %MD4]	=> 16386
[%MX5.0 & %MB5]				=> 16386 (������� ����)
[%MX6.0 & %MB6 & %MW6 & %MD6]	=> 16387
[%MX7.0 & %MB7]				=> 16387 (������� ����)
�.�. ������ %MD0 && %MD2 || %MD2 && %MD4 ������������� ��. �� ��.!!!
��� �������:
ST:
%MD0 := 1;
%MD2 := 2;
%MD4 := 4;
������� ��� ModBus:
16384 = 0000 0000 0000 0001 
16385 = 0000 0000 0000 0010 
16386 = 0000 0000 0000 0100
��� ����� ����������:
%MD0	 = 2#0000 0000 0000 0010  0000 0000 0000 0001
%MD2	 = 2#0000 0000 0000 0100  0000 0000 0000 0010
%MD4	 = 2#0000 0000 0000 0000  0000 0000 0000 0100
*/
// ***************************************************************************************************************
// ********************************** ��������� Beckhoff ��������� ***********************************************
// ***************************************************************************************************************
// ��������� ����� ���������� ModBus:
var BKF_iBeginSimulationAddress = 16384;
// ***************************************************************************************************************
//
var iNotSimMBAddreses = new Array();
function BKF_sPLCAddr2iMBAddr(sPLCAddr){
/* �������������� ������ ����: %dXa.b � ����� ModBus ��� Holding ��������� �.�. 
���: 
d - ����������� �������� (����/�����) � ���������� �� ����� ��������
X - X, ���� ����������� � ��������� ��� �����������
a - ����� ����� � ������� �������� ���
b - ����� ���� � �����
*/
	var RegExp = /\d+/ig; // new RegExp("\d","ig");  //Create regular expression object. ���������: \%I|Q|M\d\.\d
	var pBechoffAdr = sPLCAddr.match(RegExp);	// pBechoffAdr = ������ �� ������ � ������ ������
	var iAddress;
	//alert(sPLCAddr+": "+pBechoffAdr[0]+"."+pBechoffAdr[1]);
	RegExp = null;
	if(pBechoffAdr != null){
		iAddress = parseInt(pBechoffAdr[0],10);
		iAddress = (iAddress % 2) ? (iAddress - 1)/2 : iAddress/2;
		iAddress = (BKF_iBeginSimulationAddress + iAddress );
	}else return -1;
	// ������ > ����������� Modbus slave �� ������������
	if (iAddress < BKF_iBeginSimulationAddress + 2048){
		iMAXAddress = Math.max(iMAXAddress, iAddress);
	}else{
		iNotSimMBAddreses[iNotSimMBAddreses.length] = iAddress;
	}
	return iAddress;
}
//
function BKF_sPLCAddr2iBitMask(sPLCAddr){
/* �������������� ������ ����: %dXa.b � ����� ����
���: 
d - ����������� �������� (����/�����) � ���������� �� ����� ��������
X - X, ���� ����������� - � ��������� ��� �����������
a - ����� ����� � ������� �������� ���
b - ����� ���� � �����
*/
	var RegExp = /\d+/ig; // new RegExp("\d","ig");  //Create regular expression object. ���������: \%I|Q|M\d\.\d
	var pBechoffAdr = sPLCAddr.match(RegExp);	// pBechoffAdr = ������ �� ������ � ������ ������
	RegExp = null;
	//alert(sPLCAddr+": "+pBechoffAdr[0]+"."+pBechoffAdr[1]);
	return UNSIG2SIG( Math.pow(2,parseInt(pBechoffAdr[1],10)) );
}
//
function BKF_GetType(sPLCAddr){
/* �������� �� ������� ����: %dXa.b ����� "X" ������������ ��� ���������� (�����������)
���: 
d - ����������� �������� (����/�����) � ���������� �� ����� ��������
X - X, ���� ����������� - � ��������� ��� �����������
a - ����� ����� � ������� �������� ���
b - ����� ���� � �����
*/
	var RegExp = /X|B|W|D/i; //
	var pType = sPLCAddr.match(RegExp);
	RegExp = null;
	return pType[0].toUpperCase();
}
// ��������� � ������� ���������� ����� ���� �� ��������; ����� ����������� ��������; ModBus �����; ����� ���� (��� %MX)
function BKF_Prepare(oTags){
	for (var i = 0, len = oTags.length; i < len; i++){
		if( oTags[i] && oTags[i].sTagPLCAddress){	// �������� ��� ������ � �������� sTagPLCAddress ����������
			var sTagType = BKF_GetType(oTags[i].sTagPLCAddress);
			//
			oTags[i].sTagID = "BKF";		// ��� ������ ������� ���������� �������� ������
			oTags[i].sTagType = sTagType;
			oTags[i].className = "TagValue"+sTagType;	// ��������� ����� ����������� ������
			// ���������� ����� �� ��������
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
	var sErrorMSG = "�� ������������ ModBus ������: ";
	for (var i = 0, len = iNotSimMBAddreses.length; i < len; i++){
		sErrorMSG += iNotSimMBAddreses[i].toString()+" | ";
	}
	document.getElementById("errors").innerHTML = sErrorMSG;
}
// ����������� ������ �� ��������
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
		tmp = BKF_TagReadB(e.srcElement);
		var X=InputBox("ModBus �����: "+e.srcElement.oTag.iTagMBAddress+" (0x"+e.srcElement.oTag.iTagMBAddress.toString(16).toUpperCase()+")\n��� ����: "+e.srcElement.oTag.sTagName+"\n�������� ����: "+e.srcElement.oTag.sTagDescription+"\n\n���������:\n��� �������� - ����������� DEC �������� \n������� \"0x\" - HEX", "������� ����� ��������", tmp&0xFF );
		if(X){
			tmp =  (parseInt(X)&0x00FF) | (tmp&0xFF00);
			e.srcElement.MBS.Register(e.srcElement.oTag.iTagMBAddress - BKF_iBeginSimulationAddress) = UNSIG2SIG(tmp);
			BKF_TagReadB( e.srcElement );
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
		var X=InputBox("ModBus �����: "+e.srcElement.oTag.iTagMBAddress+" (0x"+e.srcElement.oTag.iTagMBAddress.toString(16).toUpperCase()+")\n��� ����: "+e.srcElement.oTag.sTagName+"\n�������� ����: "+e.srcElement.oTag.sTagDescription+"\n\n���������:\n��� �������� - ����������� DEC �������� \n������� \"0x\" - HEX", "������� ����� ��������",BKF_TagReadW(e.srcElement) );
		if(X){
			tmp = parseInt(X);
			e.srcElement.MBS.Register(e.srcElement.oTag.iTagMBAddress - BKF_iBeginSimulationAddress) = UNSIG2SIG(tmp&0xFFFF);
			BKF_TagReadW( e.srcElement );
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
		var X=InputBox("ModBus �����: "+e.srcElement.oTag.iTagMBAddress+" (0x"+e.srcElement.oTag.iTagMBAddress.toString(16).toUpperCase()+")\n��� ����: "+e.srcElement.oTag.sTagName+"\n�������� ����: "+e.srcElement.oTag.sTagDescription+"\n\n���������:\n��� �������� - ����������� DEC �������� \n������� \"0x\" - HEX", "������� ����� ��������",BKF_TagReadD(e.srcElement).toString(10));	// "0x"+BKF_TagReadD(e.srcElement).toString(16).toUpperCase() HEX
		if(X){
			tmp = parseInt(X);
			e.srcElement.MBS.Register(e.srcElement.oTag.iTagMBAddress - BKF_iBeginSimulationAddress) = UNSIG2SIG(tmp&0xFFFF);
			e.srcElement.MBS.Register(e.srcElement.oTag.iTagMBAddress - BKF_iBeginSimulationAddress+1) = UNSIG2SIG( (tmp>>16)&0xFFFF );
			BKF_TagReadD( e.srcElement );
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
	if (oObjects){
		document.getElementById("state").innerHTML = "� �����: "+sFileNameXLS+" ������� �������� "+oObjects.length+" �����.";
		if (oObjects.length){
			for (i = 0, len = oObjects.length; i < len; i++){
				switch(oObjects[i].oTag.sTagType){
					case "X":
						BKF_TagReadX(oObjects[i]);
						break;
					case "B":
						BKF_TagReadB(oObjects[i]);
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
function BKF_TagReadB(oObject){
	var tmp = oObject.MBS.Register(oObject.oTag.iTagMBAddress - BKF_iBeginSimulationAddress);
	oObject.innerHTML = SIG2UNSIG(tmp)&0xFF.toString();
	return SIG2UNSIG(tmp)&0xFF;
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
	//oObject.innerHTML = "0x"+DSIG2UNSIG((st)|(lt)).toString(16).toUpperCase();	// HEX
	return DSIG2UNSIG(st|lt);
}