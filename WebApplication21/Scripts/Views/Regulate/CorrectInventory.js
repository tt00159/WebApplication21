$(function () {
    $("#tabWHCNT").click(function () {
        return $("#CRUD").val() == "updateWHCNT";
	});

	$("#form").submit(function (e) {
		if (!$("#form").valid()) {
			AlertErrorMsg("form");
			return false;
		}
		//prevent Default functionality
		e.preventDefault();

		GoHandler($("#txtSystemNo").val(), BUKRS.replace("00", $("#ddlWERKS").val()), $("#ddlZWAREHS").val(), $("#txtMATNR").val(), $("#txtCustomsImportNo").val());
	});

	$("#formMENGE").submit(function (e) {
	    if (!$("#formMENGE").valid()) {
	        AlertErrorMsg("formMENGE");
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
				AlertResultMsg("formMENGE", json, "/Warehouse/MATNRRecords");
			}
		});
	});

	$("#ddlWERKS").change(function () {
	    if ($(this).val().length > 0) {
	        GetZWAREHS();
	    }
	    else {
	        $("#ddlZWAREHS option").remove();
	        $("#ddlZWAREHS").append("<option value=''></option>");
	    }
	});

	$("#txtMENGE_DIFF").change(function () {	    
	    $("#lblMENGE").text(round2(parseFloat($("#hidMENGE").val()) + parseFloat($("#txtMENGE_DIFF").val()),6));
	    if ($("#lblMENGE").text() != $("#hidMENGE").val())
	        $("#lblMENGE").css("color", "red");
	    else
	        $("#lblMENGE").css("color", "");
	});

	$("#txtWHCNT_DIFF").change(function () {
	    $("#lblWHCNT").text(round2(parseFloat($("#hidWHCNT").val()) + parseFloat($("#txtWHCNT_DIFF").val()),6));
	    if ($("#lblWHCNT").text() != $("#hidWHCNT").val())
	        $("#lblWHCNT").css("color", "red");
	    else
	        $("#lblWHCNT").css("color", "");
	});

	$("#txtMATNR").val(decodeURI(QueryString("MATNR")));
	$("#txtCustomsImportNo").val(decodeURI(QueryString("CustomsImportNo")));
	$("#ddlWERKS").val(decodeURI(QueryString("WERKS")));
	var vSystemNo = decodeURI(QueryString("SystemNo"));
	if (vSystemNo != undefined && vSystemNo.length > 0) {
	    $("#txtSystemNo").val(vSystemNo);
	    GetZWAREHS(decodeURI(QueryString("ZWAREHS")));
	    var menu = window.parent.document.getElementById("RegulateCorrectInventory");
	    $(menu).attr("url", "/Regulate/CorrectInventory");

	    setTimeout(function () {
	        $("#form").submit();
	    }, 500);
	    //$("#form").submit();
	}
})

function GetZWAREHS(val) {
	$.ajax({
		url: "/Data/ZTWAREHS",
		type: 'post',
		dataType: 'json',
		data: "BUKRS=" + BUKRS + "&WERKS=" + BUKRS.replace("00", $("#ddlWERKS").val()) + "&VKORG=" + VKORG + "&IsVirtural=False",
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

function GoHandler(SystemNo, WERKS, ZWAREHS, MATNR, CustomsImportNo) {
    if (SystemNo != undefined && WERKS != undefined && ZWAREHS != undefined &&
        CustomsImportNo != undefined && MATNR != undefined) {

        ShowBlockUI();

		$.ajax({
		    url: "/Regulate/CorrectInventory",
			type: 'get',
			dataType: 'json',
			data: "SystemNo=" + SystemNo + "&WERKS=" + WERKS + "&ZWAREHS=" + ZWAREHS + "&CustomsImportNo=" + CustomsImportNo + "&MATNR=" + MATNR + "&isDetail=true",
			success: function (json) {
			    //console.log(json);
			    if (json.ResultCode <= 0) {
			        $("#ResultData").hide();
			        document.getElementById("formMENGE").reset();
			        AlertErrorMsg("formMENGE", json.ResultMessage);
			        CloseBlockUI();
			        return;
			    }
			    $("#hidSystemNo").val(json.SystemNo);
			    $("#lblSystemNo").text(json.SystemNo);
			    $("#hidWERKS").val(json.WERKS);
			    $("#lblWERKS").text(json.WERKS);
			    $("#hidPeriodID").val(json.PeriodID);
			    $("#lblPeriodID").text(json.PeriodID);
			    $("#hidZWAREHS").val(json.ZWAREHS);
			    $("#lblZWAREHS").text(json.ZWAREHS_TXT);
			    $("#hidCustomsImportNo").val(json.CustomsImportNo);
			    $("#lblCustomsImportNo").text(json.CustomsImportNo);
			    $("#hidHSCode").val(json.HSCode);
			    $("#lblHSCode").text(json.HSCode);
			    $("#hidMATNR").val(json.MATNR);
			    $("#lblMATNR").text(json.MATNR);
			    $("#hidMENGE").val(json.MENGE);
			    $("#lblMENGE").text(json.MENGE);
			    $("#hidMEINS").val(json.MEINS);
			    $("#lblMEINS").text(json.MEINS);
			    $("#hidWHCNT").val(json.WHCNT);
			    $("#lblWHCNT").text(json.WHCNT);
			    $("#hidWHUIT").val(json.WHUIT);
			    $("#lblWHUIT").text(json.WHUIT);
			    $("#hidLSMEH").val(json.LSMEH);

			    $("#ResultData").show();
			    CloseBlockUI();

			}
		});
    }
    else {
        alert("取得參數有誤，請與系統管理員聯絡！");
    }
}