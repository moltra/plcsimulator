//

function RefreshData(){
	MBS_Simulator();
	BKF_TagRefreshValue();
// ��������� ������� �� ������� � �� ��������!!!
setTimeout("RefreshData()",RefreshPeriod);
}