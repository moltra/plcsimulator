// ��������� ���� �� ���������� 
var fso = new ActiveXObject("Scripting.FileSystemObject");
var sPathToApp = fso.GetParentFolderName(window.document.location.pathname);
sPathToApp = sPathToApp.replace(/%20/g, " ");
var VBS = GetObject(fso.BuildPath("script:"+sPathToApp, "\\engine\\VBSFunction.wsc"));
var InputBox=VBS("InputBox");
//
// ��������� ������� ����
window.resizeTo(screen.availWidth, screen.availHeight);
window.moveTo(0, 0);
//
var oTags = new Array();	// ������ � ������� �������� ������� �� ���������� �����
// ������� ������ ����� �� XLS �������
var iRegistersNumber = XLS_GetTags(fso, sPathToApp, oTags,iXLS_BeginStroke,0);
// ���������� ������������� ������ ���� ( by BKF_Prepare() )
var iMAXAddress = 0;
// ***************************************************************************************************************
//                                                CUSTOM PART                                                   //
// ############################################ BECKHOFF SECTION #################################################
// ���������� � ����������� �����
BKF_Prepare(oTags);
var iAddrCount = (iMAXAddress - BKF_iBeginSimulationAddress)+2;
if(iAddrCount > 2048) alert("��������� ����������� OLE ������� � 2048 ������� �����, �������� ���� �� ��������� ������ �� 2046 �������! \n"+iAddrCount.toString());
// ��� �������� Beckhoff ����������� ������ ��������� ������ Holding Registers (�������: 0x03;0x04)
var oMBS = MBS_Start(1,BKF_iBeginSimulationAddress, iAddrCount );	// BKF_iBeginSimulationAddress - �������� � beckhoff.js
// ####################################### END OF BECKHOFF SECTION ###############################################
// ***************************************************************************************************************
// ���������� GUI
TagShow(oMBS, document.getElementById("data"), oTags);
// ��������� ��������� ��� �������� - ���������� ��������� ��������� ���������
/*
// INPUTS
oInputs.Register(0) = UNSIG2SIG(0xFFFC);	// 
oInputs.Register(1) = UNSIG2SIG(0x003F);	// 
oInputs.Register(2) = UNSIG2SIG(0x3800);	// 
oInputs.Register(3) = UNSIG2SIG(0xBB8E);	// 
oInputs.Register(4) = UNSIG2SIG(0x0000);	// 
oInputs.Register(5) = UNSIG2SIG(0x4800);	// 
oInputs.Register(6) = UNSIG2SIG(0x1FF8);	// 
oInputs.Register(7) = UNSIG2SIG(0x0000);	// 
oInputs.Register(8) = UNSIG2SIG(0x0000);	// 
// OUTPUTS
oOutputs.Register(8+1) = UNSIG2SIG(0x0000);	// 
oOutputs.Register(8+2) = UNSIG2SIG(0xFB80);	// 
oOutputs.Register(8+3) = UNSIG2SIG(0x1FFF);	// 
oOutputs.Register(8+4) = UNSIG2SIG(0x0000);	// 
*/




















