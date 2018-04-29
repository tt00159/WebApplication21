$(function () {

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
		//if ($("#txtHSCode").val() == "" && $("#txtMATNR").val() == "") {
		//    AlertErrorMsg("form", "HSCode / 物料號碼 請擇一輸入！");
		//    return false;
		//}
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
						{ "field": "BUKRS", "op": "eq", "data": BUKRS },
						{ "field": "HSCode", "op": "eq", "data": $("#txtHSCode").val() },
						{ "field": "CustomsImportNo", "op": "eq", "data": $("#txtCustomsImportNo").val() },
						{ "field": "MATNR", "op": "cn", "data": $("#txtMATNR").val() },
						{ "field": "WERKS", "op": "eq", "data": BUKRS.replace("00", $("#ddlWERKS").val()) },
						{ "field": "ZWAREHS", "op": "eq", "data": $("#ddlZWAREHS").val() },
						{ "field": "KUNNR", "op": "eq", "data": $("#hidKUNNR").val() },
						{ "field": "CreateDate_Start", "op": "ge", "data": $("#txtCreateDate_Start").val() },
						{ "field": "CreateDate_End", "op": "le", "data": $("#txtCreateDate_End").val() },
                        { "field": "CreateUser", "op": "eq", "data": $("#txtCreateUser").val() },
                        { "field": "PeriodID", "op": "eq", "data": $("#ddlPeriodID").val() },
						{ "field": "IsClosed", "op": "eq", "data": $("#ddlIsClosed").val() }
					]
			})
		);
	});

	$("#btnKUNNR").click(function () {

	    if ($("#tblGridDataKUNNR").getGridParam("reccount") == 0) {
	        reloadGrid(
                JSON.stringify(
                {
                    "groupOp": "AND",
                    "rules":
                        [
                        ]
                }), "tblGridDataKUNNR", "pagerKUNNR", "/Data/GetClient"
            );
	    }

	    setTimeout(function () {

	        $("#ResultDataKUNNR").show();

	    }, 100);
	});

	$("#jqUpdateMENGE").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
	        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
	        var menu = window.parent.document.getElementById("RegulateCorrectInventory");

	        var params = "SystemNo=" + rowObject['SystemNo'] + "&WERKS=" + rowObject['WERKS'].replace(BUKRS.replace("00", ""), "") + "&MATNR=" + rowObject['MATNR']
                        + "&ZWAREHS=" + rowObject['ZWAREHS'] + "&CustomsImportNo=" + rowObject['CustomsImportNo'];
	        $(menu).attr("url", "/Regulate/CorrectInventory?" + params);
	        window.parent.$(menu).click();
	    }
	});

	$("#ddlWERKS").change(function () {
	    if ($(this).val().length > 0) {
	        GetZWAREHS(BUKRS.replace("00", $(this).val()), "ddlZWAREHS");
	    }
	    else {
	        $("#ddlZWAREHS option").remove();
	        $("#ddlZWAREHS").append("<option value=''></option>");
	    }
	});

	setTimeout(function () {
	    GetZWAREHS(BUKRS.replace("00", $("#ddlWERKS").val()), "ddlZWAREHS");
	}, 0);
})

function SetClientData(KUNNR, NAME) {
    $("#txtKUNNR").val(NAME);
    $("#hidKUNNR").val(KUNNR);

    $("#ResultDataKUNNR").hide();
}

function GetZWAREHS(WERKS, ddlID, val) {

    $.ajax({
        url: "/Data/ZTWAREHS",
        type: 'post',
        dataType: 'json',
        data: "BUKRS=" + BUKRS + "&WERKS=" + WERKS + "&VKORG=" + VKORG + "&IsVirtural=False",
        success: function (json) {
            $("#" + ddlID + " option").remove();
            //$("#" + ddlID).append("<option value=''></option>");
            $(json).each(function () {
                if (val != undefined && val == this.ZWAREHS)
                    $("#" + ddlID).append("<option selected value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
                else
                    $("#" + ddlID).append("<option value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
            });
        },
        error: function () {
            $("#" + ddlID + " option").remove();
            $("#" + ddlID).append("<option value=''></option>");
            alert("取得倉庫資料失敗！");
        }
    });
}