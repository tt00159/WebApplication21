$(function () {

	$("#tabUpdate").click(function () {
		return $("#CRUD").val() == "update";
	});

	$("#tabInsert").click(function () {
		return $("#CRUD").val() == "create";
	});

	$("#btnSubmitQuery").click(function (e) {
		if (!$("#form").valid()) {
			AlertErrorMsg("form");
			return false;
		}
		ShowBlockUI();

		$("#CRUD").val("");
		$("#hidForMATNR").val("");
		$("#QueryMaterialHSCode").hide();
		$("#hidSystemNo").val($("#txtSystemNo").val());

		setTimeout(function () {

			$("#" + jqGridID).jqGrid(
				"setGridParam",
				{
					url: "/Regulate/BondedRegulate",
					datatype: "json",
					mtype: "GET",
					postData: { "SystemNo": $("#txtSystemNo").val(), "BUKRS": BUKRS, "RegulateType": $("#ddlRegulateType").val(), "isDetail": true, "isForGrid": true }
				}
			).trigger("reloadGrid");

			$("#" + jqGridID).jqGrid('navGrid', '#pager',
			{
				edit: false, add: false, del: false, search: false, refresh: false,
				view: true, viewicon: 'ace-icon fa fa-search-plus grey',
			});

			//ResultData區域顯示
			$("#ResultData").show();
		}, 500);

	});

	$("#btnQueryMaterial").click(function (e) {
	    if (!$("#formRSNUM").valid()) {
	        AlertErrorMsg("formRSNUM");
			return false;
		}
	    ShowBlockUI();

        //取得幣別資料
	    GetCurrency();
	    //ResultData區域顯示
		$("#ResultDataMaterialAmount").show();
		RSNUM = padLeft($("#txtRSNUM").val(), 10);

		setTimeout(function () {

		    $("#" + jqGridIDMaterialAmount).jqGrid(
				"setGridParam",
				{
				    url: "/RFC/GetRESB_Detail",
				    datatype: "json",
				    mtype: "GET",
				    postData: { "RSNUM": RSNUM, "RegulateType": $("#ddlRegulateType").val(), "SystemNo": $("#txtSystemNo").val(), "isForGrid": true }
				}
			).trigger("reloadGrid");

		}, 500);

	});

	if (RegulateType != undefined && RegulateType.length > 0) {
	    $("#ddlRegulateType").val(RegulateType);
	}
	var vSystemNo = decodeURI(QueryString("SystemNo"));
	if (vSystemNo != undefined && vSystemNo.length > 0) {
	    $("#txtSystemNo").val(vSystemNo);
	    var menu = window.parent.document.getElementById("RegulateBondedRegulateMaterial");
	    $(menu).attr("url", "/Regulate/BondedRegulateMaterial");
		$("#btnSubmitQuery").click();
	}

	$("#jqUpdateMaterial").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        var rowID = $("#" + jqGridIDMaterial).jqGrid('getGridParam', 'selrow');
	        var rowObject = $("#" + jqGridIDMaterial).jqGrid('getRowData', rowID);
	        GoHandler(rowObject['SystemNo'], rowObject['CustomsImportNo'], rowObject['MATNR']
                , rowObject['IO']);
	    }
	});

	$("#jqInsertHandle").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        $("#CRUD").val("create");
	        $("#txtHSCode").val("");
	        $("#hidForMATNR").val("");
	        $("#QueryMaterialHSCode").hide();
	        $("#txtMATNR").val("");
	        $("#ResultDataMaterialAmount").hide();
	        $("#tabInsert").click();
	    }
	});

	$("#jqPreordainMaterial").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        var rowID = $("#" + jqGridIDMaterial).jqGrid('getGridParam', 'selrow');
	        var rowObject = $("#" + jqGridIDMaterial).jqGrid('getRowData', rowID);
	        $("#CRUD").val("create");
	        $("#txtHSCode").val(rowObject['HSCode']);
	        $("#hidForMATNR").val(rowObject['MATNR']);
	        $("#QueryMaterialHSCode").show();
	        $("#txtMATNR").val("");
	        $("#ResultDataMaterialAmount").hide();
	        $("#tabInsert").click();
	    }
	});

	$("#jqInsertMaterial").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        var selarrrow = $("#" + jqGridIDMaterialAmount).jqGrid('getGridParam', 'selarrrow');
	        var masterObject = $("#" + jqGridID).jqGrid('getRowData', 1);
	        var IDs = selarrrow.toString().split(',');
	        var items = [];
	        var checkItems = [];
	        var errorMsg = "";
	        var confirmMsg = "";
	        var diffWAERS = "";
	        for (var i = 0; i < IDs.length; i++) {
	            var rowid = IDs[i];
	            var aRow = $("#" + jqGridIDMaterialAmount).jqGrid('getRowData', rowid);

	            checkItems.push({
	                id: rowid,
	                MATNR: aRow["MATNR"],
	                NETPR: $("#txtInNETPR_" + rowid).val()
	            });

                /// 移入物料只允許一個單價
	            for (var j = 0 ; j < checkItems.length - 1; j++) {
	                if(aRow["MATNR"] == checkItems[j].MATNR && 
                        parseFloat($("#txtInNETPR_" + rowid).val()).toFixed(5) != parseFloat(checkItems[j].NETPR).toFixed(5)) {
	                    errorMsg += "<p>物料 ( " + checkItems[j].MATNR + " ) 有不同移入單價！</p>";
	                }
	            }

	            if ($("#txtMENGE_" + rowid).val().length == 0 ||
					parseFloat($("#txtMENGE_" + rowid).val()) == 0) {
	                errorMsg += "<p>第 " + rowid + " 筆物料的法定數量不可空白或為0！</p>";
	            }
	            if ($("#txtWHCNT_" + rowid).val().length == 0 ||
					parseFloat($("#txtWHCNT_" + rowid).val()) == 0) {
	                errorMsg += "<p>第 " + rowid + " 筆物料的倉庫數量不可空白或為0！</p>";
	            }
	            if ($("#txtLSMNG_" + rowid).val().length == 0 ||
					parseFloat($("#txtLSMNG_" + rowid).val()) == 0) {
	                errorMsg += "<p>第 " + rowid + " 筆物料的SAP數量不可空白或為0！</p>";
	            }
	            if ($("#txtInNETPR_" + rowid).val().length == 0 ||
					parseFloat($("#txtInNETPR_" + rowid).val()) == 0) {
	                errorMsg += "<p>第 " + rowid + " 筆物料的移入單價不可空白或為0！</p>";
	            }
	            if ($("#ddlInWAERS_" + rowid).val().length == 0) {
	                errorMsg += "<p>第 " + rowid + " 筆物料的移入幣別不可空白！</p>";
	            }
	            //if (diffWAERS == "") diffWAERS = $("#ddlInWAERS_" + rowid).val();
	            //else {
	            //    if ($("#ddlInWAERS_" + rowid).val() != diffWAERS)
	            //        errorMsg += "<p>第 " + rowid + " 筆物料的移入幣別有誤！</p>";
	            //}  //不清楚為何加此限制,討論小夏要求不檢核(RP17090025)
	            if (parseFloat($("#txtMENGE_" + rowid).val()) != parseFloat($("#txtLSMNG_" + rowid).val())) {
	                confirmMsg += "<p>第 " + rowid + " 筆物料的法定數量與SAP數量不相同！</p>";
	            }
	            if (aRow["CustomsImportNo"].length == 0) {
	                errorMsg += "<p>第 " + rowid + " 筆物料於關務系統並無庫存資料。</p>";
	            }
	            if (aRow["ZWAREHS"] != masterObject["OutZWAREHS"]) {
	                errorMsg += "<p>第 " + rowid + " 筆物料移出庫別 (" + aRow["ZWAREHS_TXT"] + ") 不正確！ 應為 (" + masterObject["OutZWAREHS_TXT"] + ")。</p>";
	            }
	            if (aRow["LSMEH"] != aRow["LSMEHM"]) {
	                errorMsg += "<p>第 " + rowid + " 保留單 [SAP單位] 與進庫單 [SAP單位] 不一致,請修訂SAP系統該保留單單位！  </p>";
	            }
	            if (aRow["InZWAREHS"] != masterObject["InZWAREHS"]) {
	                errorMsg += "<p>第 " + rowid + " 筆物料移入庫別 (" + aRow["InZWAREHS_TXT"] + ") 不正確！ 應為 (" + masterObject["InZWAREHS_TXT"] + ")。</p>";
	            }
                if (aRow["OriginMATNR"].indexOf("NG") != -1)  {
	                errorMsg += "<p>第 " +rowid + " 筆物料非產地証物料,與表頭資料 [產地証] 不一致！</p>";
	            }
	            
	            if (errorMsg.length == 0) {
	                var item = {
	                    SystemNo: $("#hidSystemNo").val(),
	                    BUKRS: BUKRS,
	                    ZWAREHS: aRow["ZWAREHS"],
                        IO: "O",
                        WERKS: aRow["WERKS"],
	                    CustomsImportNo: aRow["CustomsImportNo"],
	                    MATNR: aRow["MATNR"],
	                    RSNUM: RSNUM,
	                    HSCode: aRow["HSCode"],
	                    //ForMATNR: $("#hidForMATNR").val(),
	                    WAERS: $("#lblOutWAERS_" + rowid).text(),
	                    NETPR: $("#lblOutNETPR_" + rowid).text(),
	                    MENGE: $("#txtMENGE_" + rowid).val(),
	                    MEINS: aRow["MEINS"],
	                    WHCNT: $("#txtWHCNT_" + rowid).val(),
	                    WHUIT: aRow["WHUIT"],
	                    //WHUIT: $("#lblWHUIT_" + rowid).text(),
	                    LSMNG: $("#txtLSMNG_" + rowid).val(),
	                    LSMEH: aRow["LSMEH"],
	                    Tariff: aRow["Tariff"],
	                    SpecialTariff: aRow["SpecialTariff"],
	                    VAT: aRow["VAT"],
	                    ConsumptionTax: aRow["ConsumptionTax"],
	                    OtherTax: aRow["OtherTax"],
	                    ExportTaxRebate: aRow["ExportTaxRebate"]
	                };
	                items.push(item);
                    
	                item = {
	                    SystemNo: $("#hidSystemNo").val(),
	                    BUKRS: BUKRS,
	                    ZWAREHS: aRow["InZWAREHS"],
	                    IO: "I",
	                    WERKS: aRow["UMWRK"],
	                    CustomsImportNo: aRow["CustomsImportNo"],
	                    MATNR: aRow["MATNR"],
	                    RSNUM: RSNUM,
	                    HSCode: aRow["HSCode"],
	                    //ForMATNR: "",
	                    WAERS: $("#ddlInWAERS_" + rowid).val(),
	                    NETPR: $("#txtInNETPR_" + rowid).val(),
	                    MENGE: $("#txtMENGE_" + rowid).val(),
	                    MEINS: aRow["MEINS"],
	                    WHCNT: $("#txtWHCNT_" + rowid).val(),
	                    WHUIT: aRow["WHUIT"],
	                    //WHUIT: $("#lblWHUIT_" + rowid).text(),
	                    LSMNG: $("#txtLSMNG_" + rowid).val(),
	                    LSMEH: aRow["LSMEH"],
	                    Tariff: aRow["Tariff"],
	                    SpecialTariff: aRow["SpecialTariff"],
	                    VAT: aRow["VAT"],
	                    ConsumptionTax: aRow["ConsumptionTax"],
	                    OtherTax: aRow["OtherTax"],
	                    ExportTaxRebate: aRow["ExportTaxRebate"]
	                };
	                items.push(item);
	            }
	        }
	        console.log(checkItems);
	        if (errorMsg.length > 0) {
	            AlertErrorMsg("formRSNUM", errorMsg);
	            return false;
	        }
	        //console.log(JSON.stringify(items));
	        //return false;
	        if (confirmMsg.length > 0) {
	            bootbox.confirm({
	                message: confirmMsg + "<br/><p>請問是否仍要新增資料？</p>",
	                callback: function (result) {
	                    if (result) {
	                        ShowBlockUI();
	                        $.ajax({
	                            url: "/Regulate/BondedRegulateMaterialHandler",
	                            type: 'post',
	                            //dataType: 'json',
	                            data: "CRUD=" + $("#CRUD").val() + "&JSON=" + JSON.stringify(items),
	                            success: function (json) {
	                                //$("#ddlDeptIDHandler").attr('disabled', 'disabled');
	                                CloseBlockUI();
	                                AlertResultMsg("formHandler", json, "/Regulate/BondedRegulateMaterial?SystemNo=" + $("#hidSystemNo").val() + "&RegulateType=" + $("#ddlRegulateType").val());
	                            },
	                            error: function (err) {
	                                alert(err.statusText);
	                                CloseBlockUI();
	                            }
	                        });
	                    }
	                }
	            })
	        }
	        else {
	            ShowBlockUI();
	            $.ajax({
	                url: "/Regulate/BondedRegulateMaterialHandler",
	                type: 'post',
	                //dataType: 'json',
	                data: "CRUD=" + $("#CRUD").val() + "&JSON=" + JSON.stringify(items),
	                success: function (json) {
	                    //$("#ddlDeptIDHandler").attr('disabled', 'disabled');
	                    CloseBlockUI();
	                    AlertResultMsg("formHandler", json, "/Regulate/BondedRegulateMaterial?SystemNo=" + $("#hidSystemNo").val() + "&RegulateType=" + $("#ddlRegulateType").val());
	                },
	                error: function (err) {
	                    alert(err.statusText);
	                    CloseBlockUI();
	                }
	            });
	        }
	    }
	});

	$("#jqDeleteMaterial").click(function () {
	    if (!$(this).hasClass("disabled")) {

	        bootbox.confirm({
	            message: "請問是否刪除此筆資料？",
	            callback: function (result) {
	                if (result) {
	                    ShowBlockUI();

	                    var rowID = $("#" + jqGridIDMaterial).jqGrid('getGridParam', 'selrow');
	                    var rowObject = $("#" + jqGridIDMaterial).jqGrid('getRowData', rowID);
	                    $("#CRUD").val("delete");
	                    $("#hidSystemNo").val(rowObject['SystemNo']);
	                    $("#hidZWAREHSHandler").val(rowObject['ZWAREHS']);
	                    $("#hidIO").val(rowObject['IO']);
	                    $("#hidWERKS").val(rowObject['WERKS']);
	                    $("#hidMATNR").val(rowObject['MATNR']);
	                    $("#txtMENGE").val(rowObject['MENGE']);
	                    $("#txtWHCNT").val(rowObject['WHCNT']);
	                    $("#hidWHUIT").val(rowObject['WHUIT']);
	                    $("#txtLSMNG").val(rowObject['LSMNG']);
	                    $("#hidCustomsImportNo").val(rowObject['CustomsImportNo']);
	                    $("#hidRSNUM").val(rowObject['RSNUM']);

	                    $("#formHandler").submit();
	                }
	            }
	        })
	    }
	});

	$("#formHandler").submit(function (e) {
	    if (!$("#formHandler").valid()) {
	        AlertErrorMsg("formHandler");
	        return false;
	    }

	    //prevent Default functionality
	    e.preventDefault();

	    if ((parseFloat($("#txtMENGE").val()) != parseFloat($("#txtLSMNG").val())) &&
            ($("#CRUD").val() != "delete")) {
	        bootbox.confirm({
	            message: "<p>法定數量與SAP數量不相同！</p><br/><p>請問是否仍要修改資料？</p>",
	            callback: function (result) {
	                if (result) {
	                    ShowBlockUI();

	                    //get the action-url of the form
	                    var actionurl = e.currentTarget.action;

	                    //do your own request an handle the results
	                    $.ajax({
	                        url: actionurl,
	                        type: 'post',
	                        dataType: 'json',
	                        data: $("#formHandler").serialize(),
	                        success: function (json) {
	                            CloseBlockUI();
	                            AlertResultMsg("formHandler", json, "/Regulate/BondedRegulateMaterial?SystemNo=" + $("#hidSystemNo").val() + "&RegulateType=" + $("#ddlRegulateType").val());
	                        }
	                    });
	                }
	            }
	        })
	    }
	    else {
	        ShowBlockUI();

	        //get the action-url of the form
	        var actionurl = e.currentTarget.action;

	        //do your own request an handle the results
	        $.ajax({
	            url: actionurl,
	            type: 'post',
	            dataType: 'json',
	            data: $("#formHandler").serialize(),
	            success: function (json) {
	                CloseBlockUI();
	                AlertResultMsg("formHandler", json, "/Regulate/BondedRegulateMaterial?SystemNo=" + $("#hidSystemNo").val() + "&RegulateType=" + $("#ddlRegulateType").val());
	            }
	        });
	    }
	});

	$("#btnDelete").click(function () {
	    ShowBlockUI();
	    $("#CRUD").val("delete");

	    $("#formHandler").submit();
	});
})

function GetZWAREHS(val) {
    $.ajax({
        url: "/Data/ZTWAREHS",
        type: 'post',
        dataType: 'json',
        data: "BUKRS=" + BUKRS + "&WERKS=" + $("#hidWERKS").val() + "&VKORG=" + VKORG,
        success: function (json) {

            $("#ddlZWAREHS option").remove();
            //$("#ddlZWAREHS").append("<option value=''></option>");
            $(json).each(function () {
                if (val != undefined && val == convertText(this.ZWAREHS, clientLang9))
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

function GetCurrency() {
    $.ajax({
        url: "/System/DataSetting",
        type: 'GET',
        dataType: 'json',
        data: "BUKRS=" + BUKRS + "&parentKeyID=Currency",
        success: function (json) {
            currency = "";
            for (var i = 0; i < json.length; i++) {
                //currency[json[i].KeyID] = json[i].Value;
                currency += json[i].KeyID + "|";
            }
        },
        error: function () {
            alert("取得幣別資料失敗！");
        }
    });
}

function GoHandler(SystemNo, CustomsImportNo, MATNR, IO) {
	if (SystemNo != undefined &&
		CustomsImportNo != undefined && MATNR != undefined &&
		IO != undefined) {

		$.ajax({
		    url: "/Regulate/BondedRegulateMaterial",
			type: 'get',
			dataType: 'json',
			data: "SystemNo=" + SystemNo + "&CustomsImportNo=" + CustomsImportNo + "&MATNR=" + MATNR
                     + "&IO=" + IO + "&isDetail=true",
			success: function (json) {

				$("#lblSystemNo").text(json.SystemNo);
				$("#hidSystemNo").val(json.SystemNo);
				$("#hidWERKS").val(json.WERKS);
				$("#hidZWAREHSHandler").val(json.ZWAREHS);
				$("#lblCustomsImportNo").text(json.CustomsImportNo);
				$("#hidCustomsImportNo").val(json.CustomsImportNo);
				$("#lblMATNR").text(json.MATNR);
				$("#hidMATNR").val(json.MATNR);
				$("#lblMATNR_TXT").text(json.MATNR_TXT);
				$("#txtMENGE").val(parseFloat(json.MENGE).toFixed(DecimalPlaces));
				$("#lblMEINS").text(json.MEINS);
				$("#txtWHCNT").val(parseFloat(json.WHCNT).toFixed(DecimalPlaces));
				$("#lblWHUIT").text(json.WHUIT);
				$("#hidWHUIT").val(json.WHUIT);
				$("#txtLSMNG").val(parseFloat(json.LSMNG).toFixed(DecimalPlaces));
				$("#lblLSMEH").text(json.LSMEH);
				$("#lblHSCode").text(json.HSCode);
				$("#hidIO").val(json.IO);

				convertChineseLang();
				GetZWAREHS(json.ZWAREHS);
				if ($("#ddlRegulateType").val() == "BondedToDuty" && json.IO == "I") {
				    $("#divInZWAREHS").show();
				}
				else $("#divInZWAREHS").hide();

				if (json.IO == "I") {
				    $("#txtMENGE").attr("readonly", "true");
				    $("#txtWHCNT").attr("readonly", "true");
				    $("#txtLSMNG").attr("readonly", "true");
				}
				else {
				    $("#txtMENGE").removeAttr("readonly");
				    $("#txtWHCNT").removeAttr("readonly");
				    $("#txtLSMNG").removeAttr("readonly");
				}

				$("#CRUD").val("update");
				$("#tabUpdate").click();

				CloseBlockUI();
			}
		});
	}
	else {
		$("#CRUD").val("");
	}
}