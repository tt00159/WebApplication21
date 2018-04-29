$(function () {

    //建立人員初值及唯讀屬性控制
    if (ShowData == "P") {
        $("#txtCreateUser").val(LoginUserID);
        $("#txtCreateUser").attr('disabled', 'disabled');
    }

     $("#btnPrint").click(function () { 
        var qSystemNo = $("#txtSystemNo").val();   //未維護視同全部     
             var qIsClosed = $("#ddlIsClosed").val();   //未選即空白表示全部
        if (qIsClosed == "True") {
            qIsClosed = 1;  //結案   (不可用布林,會變只有是或否可顯示無全部)
            }
        else if (qIsClosed == "False") {
            qIsClosed = 0;  //未結
            }
        var qDataStatus = $("#ddlDataStatus").val();        
        var qCreateUser = $("#txtCreateUser").val();
        var qCreateDate_Start = $("#txtCreateDate_Start").val();
        var qCreateDate_End = $("#txtCreateDate_End").val();
        var qWERKS = BUKRS.replace("00", "") + $("#ddlFactory").val();
        var qBUKRS = BUKRS;
        var qVKORG = VKORG;        
        
        var url = "http://portalqas/sites/ReportCenter/OA/_layouts/ReportServer/RSViewerPage.aspx?rv:RelativeReportUrl=/sites/ReportCenter/OA/DocLib3/CMS_ImportDailyReport.rdl&rp%3aSystemNo=" +qSystemNo + "&rp%3aIsClosed=" + qIsClosed + "&rp%3aDataStatus=" + qDataStatus + "&rp%3aCreateUser=" +qCreateUser + "&rp%3aCreateDate=" +qCreateDate_Start + "&rp%3aCreateDateEnd=" +qCreateDate_End + "&rp%3aWERKS=" +qWERKS + "&rp%3aBUKRS=" +qBUKRS + "&rp%3aVKORG=" +qVKORG + "";       
        window.open(url, '_blank')
       });

	$("#form").submit(function (e) {
		if (!$("#form").valid()) {
			AlertErrorMsg("form");
			return false;
		}
		ShowBlockUI();

		//prevent Default functionality
		e.preventDefault();

		//ResultData區域顯示
		$("#ResultData").show();

        reloadGrid(
			JSON.stringify(
			{
				"groupOp": "AND",
				"rules":
					[
						//{ "field": "PeriodID", "op": "eq", "data": $("#ddlPeriodID").val() },
                        { "field": "SystemNo", "op": "cn", "data": $("#txtSystemNo").val() },
						{ "field": "WERKS", "op": "eq", "data": BUKRS.replace("00", "") + $("#ddlFactory").val() },
						//{ "field": "ReceiveFilesDate_Start", "op": "ge", "data": $("#txtReceiveFilesDate_Start").val() },
						//{ "field": "ReceiveFilesDate_End", "op": "le", "data": $("#txtReceiveFilesDate_End").val() },
						{ "field": "IsClosed", "op": "eq", "data": $("#ddlIsClosed").val() },
                        { "field": "CreateUser", "op": "eq", "data": $("#txtCreateUser").val() },
                        { "field": "CreateDate_Start", "op": "ge", "data": $("#txtCreateDate_Start").val() },
						{ "field": "CreateDate_End", "op": "le", "data": $("#txtCreateDate_End").val() },
					    { "field": "DataStatus", "op": "eq", "data": $("#ddlDataStatus").val() }                        
					]
			})
		);
	});
})
