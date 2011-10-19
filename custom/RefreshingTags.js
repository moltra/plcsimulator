//

function RefreshData(){
	MBS_Simulator();
	BKF_TagRefreshValue();
// Следующую строчку не удалять и не изменять!!!
setTimeout("RefreshData()",RefreshPeriod);
}