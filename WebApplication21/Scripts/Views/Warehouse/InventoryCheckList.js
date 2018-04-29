$(function () {
    $("#tabHandle").click(function () {
        return $("#CRUD").val() == "adjust";
	});

	GetZWAREHS();

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
						{ "field": "BUKRS", "op": "eq", "data": BUKRS },
						{ "field": "PeriodID", "op": "eq", "data": $("#ddlPeriodID").val() },
						{ "field": "ZWAREHS", "op": "eq", "data": $("#ddlZWAREHS").val() },
						{ "field": "CustomsImportNo", "op": "cn", "data": $("#txtCustomsImportNo").val() },
						{ "field": "WERKS", "op": "eq", "data": BUKRS.replace("00", "") + Bonded }
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

		$("#hidIdentifier").val("U" + $("#ddlDeptIDHandler option:selected").attr("identifier"));
		$("#hidWERKS").val(BUKRS.replace("00", "") + Bonded);

		//do your own request an handle the results
		$.ajax({
			url: actionurl,
			type: 'post',
			dataType: 'json',
			data: $(this).serialize(),
			success: function (json) {
				CloseBlockUI();
				AlertResultMsg("formHandler", json, "/Warehouse/InventoryCheckList");
			}
		});
	});

	$("#jqAdjust").click(function () {
		if (!$(this).hasClass("disabled")) {
			var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
			var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
			GoHandler(rowObject['ZWAREHS'], rowObject['PeriodID'], rowObject['CustomsImportNo'], rowObject['HSCode']);
		}
	});

	$("#ddlMATNR").change(function () {
	    if ($(this).val() != "") {
	        var option = $("#ddlMATNR option:selected");
	        $("#lblMEINS").text($(option).attr("meins"));
	        $("#hidMEINS").val($(option).attr("meins"));
	        $("#hidWHUIT").val($(option).attr("whuit"));
	        $("#hidLSMEH").val($(option).attr("lsmeh"));
	    }
	});
})

function GetZWAREHS(val) {
	$.ajax({
		url: "/Data/ZTWAREHS",
		type: 'post',
		dataType: 'json',
		data: "BUKRS=" + BUKRS + "&WERKS=" + BUKRS.replace("00", "") + Bonded + "&VKORG=" + VKORG + "&IsVirtural=False",
		success: function (json) {
			$("#ddlZWAREHS option").remove();
			$("#ddlZWAREHS").append("<option value=''></option>");
			$(json).each(function () {
				if (val != undefined && val == this.ZWAREHS)
				    $("#ddlZWAREHS").append("<option selected value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
				else
				    $("#ddlZWAREHS").append("<option value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
			});
		},
		error: function () {
		    $("#ddlZWAREHS option").remove();
		    $("#ddlZWAREHS").append("<option value=''></option>");
			alert("取得倉庫資料失敗！");
		}
	});

}

function GoHandler(ZWAREHS, PeriodID, CustomsImportNo, HSCode) {
    if (ZWAREHS != undefined && PeriodID != undefined &&
        CustomsImportNo != undefined && HSCode != undefined) {

        ShowBlockUI();

		$.ajax({
			url: "/Warehouse/InventoryCheckList",
			type: 'get',
			dataType: 'json',
			data: "ZWAREHS=" + ZWAREHS + "&PeriodID=" + PeriodID + "&CustomsImportNo=" + CustomsImportNo + "&HSCode=" + HSCode,
			success: function (json) {
				$("#formHandler :reset").hide();

				$("#lblPeriodID").text(json.PeriodID);
				$("#lblZWAREHS").text(json.ZWAREHS_TXT);
				$("#lblCustomsImportNo").text(json.CustomsImportNo);
				$("#lblHSCode").text(json.HSCode);
				$("#lblMENGE").text(json.MENGE);
				$("#lblMEINS").text(json.MEINS);
				$("#lblMENGE_UC").text(json.MENGE_UC);
				$("#lblMENGE_WI").text(json.MENGE_WI);
				$("#lblMENGE_DIFF").text(json.MENGE_DIFF);
				$("#txtMENGE_DIFF").val(parseFloat(json.MENGE_DIFF * -1).toFixed(5));
				$("#hidZWAREHS").val(json.ZWAREHS);
				$("#hidHSCode").val(json.HSCode);
				$("#hidCustomsImportNo").val(json.CustomsImportNo);

				var ddlID = "ddlMATNR";
				$.ajax({
				    url: "/Data/GetMATNRFromMaterialRecords",
				    type: 'get',
				    dataType: 'json',
				    data: "WERKS=" + BUKRS.replace("00", "") + Bonded + "&ZWAREHS=" + ZWAREHS + "&CustomsImportNo=" + CustomsImportNo + "&HSCode=" + json.HSCode,
				    success: function (json) {
				        $("#" + ddlID + " option").remove();
				        $("#" + ddlID).append("<option value=''></option>");
				        $(json).each(function () {
				            $("#" + ddlID).append("<option value='" + this.MATNR + "' WHUIT='" + this.WHUIT + "' LSMEH='" + this.LSMEH + "'MEINS='" + this.MEINS + "'>【" + this.MATNR + "】 " + this.MATNR_TXT + "</option>");
				        });

				        convertChineseLang();

				        $("#CRUD").val("adjust");
				        $("#tabHandle").click();

				        CloseBlockUI();
				    },
				    error: function () {
				        $("#" + ddlID + " option").remove();
				        $("#" + ddlID).append("<option value=''></option>");
				        alert("取得物料資料失敗！");
				    }
				});
			}
		});
    }
    else {
        alert("取得參數有誤，請與系統管理員聯絡！");
        alert("ZWAREHS = " + ZWAREHS + "\r\nPeriodID = " + PeriodID + "\r\nCustomsImportNo = " + CustomsImportNo + "\r\nHSCode = " + HSCode);
    }
}