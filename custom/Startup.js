// Получение пути до приложения 
var fso = new ActiveXObject("Scripting.FileSystemObject");
var sPathToApp = fso.GetParentFolderName(window.document.location.pathname);
sPathToApp = sPathToApp.replace(/%20/g, " ");
var VBS = GetObject(fso.BuildPath("script:"+sPathToApp, "\\engine\\VBSFunction.wsc"));
var InputBox=VBS("InputBox");
//
// Установка размера окна
window.resizeTo(screen.availWidth, screen.availHeight);
window.moveTo(0, 0);
//
var oTags = new Array();	// Массив в котором хранятся объекты со свойствами тегов
// Считать адреса тегов из XLS таблицы
var iRegistersNumber = XLS_GetTags(fso, sPathToApp, oTags,iXLS_BeginStroke,0);
// Вычисление максимального адреса тега ( by BKF_Prepare() )
var iMAXAddress = 0;
// ***************************************************************************************************************
//                                                CUSTOM PART                                                   //
// ############################################ BECKHOFF SECTION #################################################
// Подготовка к отображению тегов
BKF_Prepare(oTags);
var iAddrCount = (iMAXAddress - BKF_iBeginSimulationAddress)+2;
if(iAddrCount > 2048) alert("Превышено ограничение OLE сервера в 2048 адресов тегов, разбейте теги на несколько блоков по 2046 адресов! \n"+iAddrCount.toString());
// Для эмуляции Beckhoff понадобится только симуляция памяти Holding Registers (функции: 0x03;0x04)
var oMBS = MBS_Start(1,BKF_iBeginSimulationAddress, iAddrCount );	// BKF_iBeginSimulationAddress - объявлен в beckhoff.js
// ####################################### END OF BECKHOFF SECTION ###############################################
// ***************************************************************************************************************
// Нарисовать GUI
TagShow(oMBS, document.getElementById("data"), oTags);
// Начальные установки при загрузке - симулируют положение оконечных устройств
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




















