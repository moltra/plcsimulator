/////////////////////////////////////////////
// SlaveID	The slave address 1 to 255
// Address	data address (Base 0)
// Length	number of data. 1 to 127 
/////////////////////////////////////////////
function MBS_Start(SlaveID,Address,Length){
	var Status, oMBS, Show;
	oMBS = new ActiveXObject("mbslave.Document");
	Status = oMBS.CreateSlave(SlaveID,3,Address,Length);	// 3 - start holding registres simulate
	//Use this lines if you want to show the windows in Modbus Slave (FOR DEBUG)
	if(ShowTheSlave){
		//oMBS.DisplayFormat = 1;	// UNSIGNED
		//oMBS.DisplayFormat = 2;	// HEX
		oMBS.DisplayFormat = 3;	// BIN
		Show = oMBS.ShowWindow();
	}
	//
	if(Status) return oMBS;
	else return null;
}




