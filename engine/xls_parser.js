// Занесение в массив объектов, парамтров тегов из XLS файла находящегося рядом с HTA приложением
function XLS_GetTags(fso, sPathToApp,oTags, iBeginStroke,iCountStrokes){	// TODO: Сделать обработку ошибок открытия файла
	var sFullFileNameXLS = fso.BuildPath(sPathToApp, sFileNameXLS);
	//
	var excel = new ActiveXObject("Excel.Application");
	var excel_file = excel.Workbooks.Open(sFullFileNameXLS);
	var excel_sheet = excel.Worksheets(excel.Worksheets.Item(1).Name);
	//
	var i = iBeginStroke;
	var sTagNumber = null;
	var sTagPLCAddress = null;
	//
	while (1)
	{
		if (0 == iCountStrokes) iBeginStroke = i+1;
		//sTagNumber = excel_sheet.Cells(i,1).Value;
		sTagNumber = excel_sheet.Cells(i,2).Value;
		if (sTagNumber && i < iBeginStroke+iCountStrokes){	// Если iCountStrokes !=0 то симулировать только iCountStrokes тегов
			sTagPLCAddress = excel_sheet.Cells(i,11).Value;
			if(sTagPLCAddress){
				oTags[i] = new Object;
				oTags[i].sTagNumber = sTagNumber;
				oTags[i].sTagPLCAddress = sTagPLCAddress;
				oTags[i].sTagName = excel_sheet.Cells(i,8).Value;
				oTags[i].sTagDescription = excel_sheet.Cells(i,9).Value;
//				oTags[i].sTagModuleName = excel_sheet.Cells(i,2).Value;
//				oTags[i].sTagChannelName = excel_sheet.Cells(i,4).Value;
			}
			i++;
		}else{
			excel.Workbooks.Close();
			excel.Application.Quit();
			excel.Quit();
			excel = null;
			//WshShell.Exec("%comspec% /c TASKKILL /F /IM EXCEL.exe /T")	// контрольный в голову нах...
			break;
		}
	}
	return oTags.length;
}
//