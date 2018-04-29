$(function () {
    $("#tabHandle").click(function () {
        return $("#hidDeclarationNo").val().length > 0;
    });
    $("#tabQuery").click(function () {
        $("#hidDeclarationNo").val("");
        $("#ulDeclarationNo").empty();
    });

    //建立人員初值及唯讀屬性控制    
    if (ShowData == "P") {
        $("#txtCreateUser").val(LoginUserID);        
        $("#txtCreateUser").attr('disabled', 'disabled');
    }

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
						{ "field": "WERKS", "op": "eq", "data": BUKRS.replace("00", "") + $("#ddlFactory").val() },
					    //{ "field": "ApplicationDate_Start", "op": "ge", "data": $("#txtApplicationDate_Start").val() },
						//{ "field": "ApplicationDate_End", "op": "le", "data": $("#txtApplicationDate_End").val() },
						{ "field": "HasReceiveDeclaration", "op": "eq", "data": $("#ddlHasReceiveDeclaration").val() },                        
                        { "field": "SystemNo", "op": "cn", "data": $("#txtSystemNo").val() },
                        { "field": "IsClosed", "op": "eq", "data": $("#ddlIsClosed").val() },
					    { "field": "DataStatus", "op": "eq", "data": $("#ddlDataStatus").val() },
                        { "field": "CreateUser", "op": "eq", "data": $("#txtCreateUser").val() },
                        { "field": "CreateDate_Start", "op": "ge", "data": $("#txtCreateDate_Start").val() },
						{ "field": "CreateDate_End", "op": "le", "data": $("#txtCreateDate_End").val() }
    ]
			})
		);
	});

	$("#formHandler").submit(function (e) {
	    if (!$("#formHandler").valid()) {
	        AlertErrorMsg("formHandler");
	        return false;
	    }

	    ShowBlockUI();

	    //prevent Default functionality
	    e.preventDefault();

	    //get the action-url of the form
	    var actionurl = e.currentTarget.action;

	    //do your own request an handle the results
	    $.ajax({
	        url: actionurl,
	        type: 'post',
	        dataType: 'json',
	        data: $(this).serialize(),
	        success: function (json) {
	            CloseBlockUI();
	            AlertResultMsg("formHandler", json, "/Customs/ExportDailyReport");
	        }
	    });
	});

	$("#jqReceiveDate").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        $("#ulDeclarationNo").empty();
	        var selarrrow = $("#" + jqGridID).jqGrid('getGridParam', 'selarrrow');
	        var rowObject;
	        var selRowIDs = "";
	        for (var i = 0; i < selarrrow.length; i++) {
	            rowObject = $("#" + jqGridID).jqGrid('getRowData', selarrrow[i]);
	            if (selRowIDs.indexOf(rowObject['DeclarationNo']) == -1) {
	                selRowIDs += rowObject['DeclarationNo'] + ",";
	                $("#ulDeclarationNo").append('<li><i class="ace-icon fa fa-caret-right blue"></i>' + rowObject['DeclarationNo'] + '</li>');
	            }
	        }
	        selRowIDs = selRowIDs.substring(0, selRowIDs.length - 1);
	        $("#hidDeclarationNo").val(selRowIDs);
	        $("#tabHandle").click();
	    }
	});
})
