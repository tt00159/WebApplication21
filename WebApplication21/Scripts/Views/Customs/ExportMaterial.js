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
		$("#txtHSCode").val("");
		$("#hidForMATNR").val("");
		$("#QueryMaterialHSCode").hide();
		$("#hidSystemNo").val($("#txtSystemNo").val());

		setTimeout(function () {

			$("#" + jqGridID).jqGrid(
				"setGridParam",
				{
					url: "/Customs/ExportDaily",
					datatype: "json",
					mtype: "GET",
					postData: { "SystemNo": $("#txtSystemNo").val(), "isDetail": true, "isForGrid": true }
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
		if (!$("#formInsert").valid()) {
			AlertErrorMsg("formInsert");
			return false;
		}
		ShowBlockUI();

		//ResultData區域顯示
		$("#ResultDataMaterialAmount").show();

		setTimeout(function () {

            //驗收單號
		    var MBLNR = $("#hidMBLNR").val();

		    if (MBLNR.length == 0) {

                //保稅
		        //var url = "/Data/GetExportMaterialAmount";
		        var url = "/Data/GetExportMaterialAmountFilter";
		        if ($("#txtWERKS").val() == BUKRS.replace("00", "") + Dutiable) {
		            //完稅
		            //url = "/Data/GetVBELNMaterial";
		            url = "/Data/GetVBELNMaterialFilter";
		        }

		        $("#" + jqGridIDMaterialAmount).jqGrid(
                    "setGridParam",
                    {
                        url: url,
                        datatype: "json",
                        mtype: "GET",
                        postData: {
                            "SystemNo": $("#txtSystemNo").val(),
                            "MBLNR": $("#txtVBELN").val(),
                            "BUKRS": BUKRS,
                            "WERKS": $("#txtWERKS").val(),
                            "ZWAREHS": $("#hidZWAREHS").val(),
                            "MATNR": $("#txtMATNR").val(),
                            "HSCode": $("#txtHSCode").val(),
                            "VBELN": $("#hidVBELN").val(),
                            "isForGrid": true
                        }
                    }
                ).trigger("reloadGrid");
		    }
		    else {
		        $("#" + jqGridIDMaterialAmount).jqGrid(
                    "setGridParam",
                    {
                        url: "/Data/GetMBLNRMaterial",
                        datatype: "json",
                        mtype: "GET",
                        postData: {                            
                            "BUKRS": BUKRS,
                            "WERKS": $("#txtWERKS").val(),
                            "ZWAREHS": $("#hidZWAREHS").val(),
                            "MBLNR": MBLNR,
                            "isForGrid": true
                        }
                    }
                ).trigger("reloadGrid");
		    }

		}, 500);

	});

    
	$("#btnQuerySAPExport").click(function (e) {
	    if (!$("#formSAPExport").valid()) {
	        AlertErrorMsg("formSAPExport");
	        return false;
	    }
	    ShowBlockUI();

	    $("#ResultDataSAPExport").show();
	    $("#ResultDataMaterialAmount").hide();

	    $("#" + jqGridIDSAPExport).jqGrid("clearGridData");  //先清除避免重選出貨單時看到前單資料	    
	    $.ajax({
	        url: "/Data/CheckExportSAPNo",
	        type: "POST",
	        dataType: 'json',
	        data: "VBELN=" + $("#txtVBELN").val(),
	        success: function (json) {	            
	            if (json.ResultMessage != "") {
	                CloseBlockUI();
	                bootbox.confirm({
	                    message: "出貨單已於其他報關單" + json.ResultMessage + "綁定,不應再綁定!"+ "<br/><p>請問是否仍要綁定物料？</p>",
	                    callback: function (result) {
	                        if (result) {
	                            ShowBlockUI();
	                            GoSAPNo();	                            
	                        }
	                        else {
	                            $("#ResultDataSAPExport").hide();
	                        }
	                    }
	                }
                  )
	            }
	            else {
	                GoSAPNo();
	            }
	        }
	    });

	    function GoSAPNo() {
	        setTimeout(function () {
	            $("#" + jqGridIDSAPExport).jqGrid(
	                "setGridParam",
	                {
	                    url: "/RFC/GetOB_Header",
	                    datatype: "json",
	                    mtype: "GET",
	                    postData: {
	                        "VKORG": VKORG,
	                        "WERKS": $("#txtWERKS").val(),
	                        "KUNNR": $("#hidKUNNR").val(),
	                        "VBELN": $("#txtVBELN").val(),
	                        "IsReturn": "",
	                        "isForGrid": true
	                    }
	                }
	            ).trigger("reloadGrid");

	        }, 500);
	    }	   	    
	});

	

	$("#btnQuerySAPImport").click(function (e) {
	    if (!$("#formSAPImport").valid()) {
	        AlertErrorMsg("formSAPImport");
	        return false;
	    }
	    ShowBlockUI();

	    $("#ResultDataSAPImport").show();
	    $("#ResultDataMaterialAmount").hide();

	    setTimeout(function () {

	        $("#" + jqGridIDSAPImport).jqGrid(
				"setGridParam",
				{
				    url: "/RFC/GetMD_Header",
				    datatype: "json",
				    mtype: "GET",
				    postData: {
				        "EKORG": VKORG,
				        "WERKS": $("#hidWERKS").val(),
				        "TKONN_EX": $("#txtTKONN_EX").val(),
				        "StartDate": $("#txtBUDATDate_Start").val(),
				        "EndDate": $("#txtBUDATDate_End").val(),
				        "isForGrid": true
				    }
				}
			).trigger("reloadGrid");

	    }, 500);

	});

	var vSystemNo = decodeURI(QueryString("SystemNo"));
	if (vSystemNo != undefined && vSystemNo.length > 0) {
	    $("#txtSystemNo").val(vSystemNo);
	    var menu = window.parent.document.getElementById("CustomsExportMaterial");
	    $(menu).attr("url", "/Customs/ExportMaterial");
		$("#btnSubmitQuery").click();
	}

	$("#jqUpdateMaterial").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        var rowID = $("#" + jqGridIDMaterial).jqGrid('getGridParam', 'selrow');
	        var rowObject = $("#" + jqGridIDMaterial).jqGrid('getRowData', rowID);
	        GoHandler(rowObject['BUKRS'], rowObject['SystemNo'], rowObject['CustomsImportNo'], rowObject['MATNR'], rowObject['MBLNR']);
	    }
	});

	$("#jqInsertHandle").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        $("#CRUD").val("create");
	        $("#txtHSCode").val("");
	        $("#hidForMATNR").val("");
	        $("#txtMATNR").val("");
	        if (IsPurchasesReturns == yes) {
	            $("#SAPExportMaster").hide();
	            $("#SAPImportMaster").show();
	        }
	        else {
	            $("#SAPImportMaster").hide();
	            $("#SAPExportMaster").show();
	        }
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
	        $("#ResultDataSAPExport").hide();
	        $("#ResultDataSAPImport").hide();
	        $("#SAPExportMaster").hide();
	        $("#SAPImportMaster").hide();
	        $("#ExportMaterial").show();
	        $("#tabInsert").click();
	    }
	});

	$("#jqInsertMaterial").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        var UNIT = "";
	        var jqGridCounts = $("#" + jqGridIDMaterial).getGridParam("reccount");
	        if (jqGridCounts > 0) {
	            var rowObject = $("#" + jqGridIDMaterial).jqGrid('getRowData', 1);
	            UNIT = rowObject["WHUIT"];
	        }

	        var MBLNR = $("#hidVBELN").val();
	        if (MBLNR == undefined || MBLNR.length == 0) MBLNR = $("#hidMBLNR").val();
	        
	        var selarrrow = $("#" + jqGridIDMaterialAmount).jqGrid('getGridParam', 'selarrrow');	        
	        var IDs = selarrrow.toString().split(',');
	        var items = [];
	        var errorMsg = "";
	        var confirmMsg = "";
	        var matnrtxt = "";   //sap物料總量提示需求
	        var SAPTotal = 0;    
	        var UserTotal = 0;
	        var totalrow = $("#" + jqGridIDMaterialAmount).jqGrid('getGridParam', 'records');   //jqGrid總筆數	        
	        for (var i = 0; i < totalrow; i++) {	            
	            var aRow = $("#" + jqGridIDMaterialAmount).jqGrid('getRowData', i+1);
	            if (matnrtxt != aRow["MATNR"]) {
	                matnrtxt = aRow["MATNR"];	                	                
	                SAPTotal += parseFloat($("#hidLSMNG_" + (i + 1).toString()).val());
	                if ($("#txtWERKS").val() == "3Y10") {
	                    matnrtxt = "@#$";  //完稅品數量要全加(保稅品同物料只加一組)
	                }
	            }
	        }
	        IDs = IDs.sort();    //避免物料挑選順序為1,3,2物料判定會出錯(matnrtxt)
	        for (var i = 0; i < IDs.length; i++) {
	            var rowid = IDs[i];	            
	            var aRow = $("#" + jqGridIDMaterialAmount).jqGrid('getRowData', rowid);	            
	            if (UNIT == "") UNIT = $("#txtWHUIT_" + rowid).val();
	            //「報關手冊」 (排除三方貿易)
	            if ($("#hidTradeCategory").val() != "ThirdTrans" && $("#hidTradeBonded").val().indexOf("Manual") > 0) {
	                if ($("#txtWHUIT_" + rowid).val() != UNIT) {	                    
	                    confirmMsg += "<p>第 " + rowid + " 筆物料的倉庫單位有誤！</p>";
	                }
	            }
	            if ($("#txtMENGE_" + rowid).val().length == 0 ||
					parseFloat($("#txtMENGE_" + rowid).val()) == 0) {
	                errorMsg += "<p>第 " + rowid + " 筆物料的法定數量不可空白或為0！</p>";
	            }
	            if ($("#txtMEINS_" + rowid).val() == null) {
	                errorMsg += "<p>第 " + rowid + " 筆物料的法定單位不可空白！</p>";
	            }
	            if ($("#txtWHCNT_" + rowid).val().length == 0 ||
					parseFloat($("#txtWHCNT_" + rowid).val()) == 0) {
	                errorMsg += "<p>第 " + rowid + " 筆物料的倉庫數量不可空白或為0！</p>";
	            }
	            if ($("#txtWHUIT_" + rowid).val() == null) {
	                errorMsg += "<p>第 " + rowid + " 筆物料的倉庫單位不可空白！</p>";
	            }
	            if ($("#txtLSMNG_" + rowid).val().length == 0 ||
					parseFloat($("#txtLSMNG_" + rowid).val()) == 0) {
	                errorMsg += "<p>第 " + rowid + " 筆物料的SAP數量不可空白或為0！</p>";
	            }
	            if (parseFloat($("#txtMENGE_" + rowid).val()) != parseFloat($("#txtLSMNG_" + rowid).val())) {
	                confirmMsg += "<p>第 " + rowid + " 筆物料的法定數量與SAP數量不相同！</p>";
	            }
	            if (parseFloat($("#hidMENGE_" + rowid).val()) - parseFloat($("#txtMENGE_" + rowid).val()) < 0) {
	                errorMsg += "<p>第 " + rowid + " 筆物料的法定數量不足 (上限為 " + parseFloat($("#hidMENGE_" + rowid).val()) + " )！</p>";
	            }
	            //if (parseFloat($("#hidLSMNG_" +rowid).val()) != parseFloat($("#txtLSMNG_" +rowid).val())) {
	            //    confirmMsg += "<p>第 " + rowid + " 筆物料的SAP原始數量:" + parseFloat($("#hidLSMNG_" + rowid).val()) + "已變更為:" +parseFloat($("#txtLSMNG_" +rowid).val()) + " ！</p>";
	            //}   
	            //20170830增sap原始物料總量與挑選物料總量不平提示(分2段)	          
	            //if (matnrtxt != aRow["MATNR"]) {	                
	            //    matnrtxt = aRow["MATNR"];
	            //    SAPTotal += parseFloat($("#hidLSMNG_" + rowid).val());
	            //}
	            UserTotal += parseFloat($("#txtLSMNG_" + rowid).val());
	            if (errorMsg.length == 0) {
	                var item = {
	                    SystemNo: $("#hidSystemNo").val(),
	                    BUKRS: BUKRS,
	                    CustomsImportNo: aRow["CustomsImportNo"],
	                    MATNR: aRow["MATNR"],
	                    MBLNR: MBLNR,
	                    HSCode: aRow["HSCode"],
	                    ForMATNR: $("#hidForMATNR").val(),
	                    MENGE: $("#txtMENGE_" + rowid).val(),
	                    MEINS: $("#txtMEINS_" + rowid).val(),
	                    WHCNT: $("#txtWHCNT_" + rowid).val(),
	                    WHUIT: $("#txtWHUIT_" + rowid).val(),
	                    LSMNG: $("#txtLSMNG_" + rowid).val(),
	                    LSMEH: aRow["LSMEH"]
	                };
	                items.push(item);
	            }
	           
	        }
	        //alert("CRUD=" + $("#CRUD").val() + "&JSON=" + JSON.stringify(items));
	        
	        if (SAPTotal != UserTotal) {
	           confirmMsg += "<p>SAP物料總數量:" + SAPTotal + " 與挑選物料總量:" + UserTotal + " 不平,請確認 ！</p>";
	           
	        }

	        if (errorMsg.length > 0) {
	            AlertErrorMsg("formInsert", errorMsg);
	            return false;
	        }

	        var SAPNo = $("#hidSAPNo").val();
	        if (SAPNo != "" && SAPNo.indexOf(MBLNR) == -1) {
	            SAPNo = SAPNo + "," + MBLNR;
	        }
	        else if (SAPNo == "") {
	            SAPNo = MBLNR;
	        }

	        if (confirmMsg.length > 0) {
	            bootbox.confirm({
	                message: confirmMsg + "<br/><p>請問是否仍要新增資料？</p>",
	                callback: function (result) {
	                    if (result) {
	                        ShowBlockUI();

	                        $.ajax({
	                            url: "/Customs/ExportMaterialHandler",
	                            type: 'post',
	                            //dataType: 'json',
	                            data: "CRUD=" + $("#CRUD").val() + "&SAPNo=" + SAPNo + "&TradeCategory=" + $("#hidTradeCategory").val() + "&JSON=" + JSON.stringify(items),
	                            success: function (json) {
	                                //$("#ddlDeptIDHandler").attr('disabled', 'disabled');
	                                CloseBlockUI();
	                                AlertResultMsg("formHandler", json, "/Customs/ExportMaterial?SystemNo=" + $("#hidSystemNo").val());
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
	                url: "/Customs/ExportMaterialHandler",
	                type: 'post',
	                //dataType: 'json',
	                data: "CRUD=" + $("#CRUD").val() + "&SAPNo=" + SAPNo + "&TradeCategory=" + $("#hidTradeCategory").val() + "&JSON=" + JSON.stringify(items),
	                success: function (json) {
	                    //$("#ddlDeptIDHandler").attr('disabled', 'disabled');
	                    CloseBlockUI();
	                    AlertResultMsg("formHandler", json, "/Customs/ExportMaterial?SystemNo=" + $("#hidSystemNo").val());
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
	                    $("#hidCustomsImportNo").val(rowObject['CustomsImportNo']);
	                    $("#hidMATNR").val(rowObject['MATNR']);
	                    $("#hidMBLNRHandler").val(rowObject['MBLNR']);

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
	                            AlertResultMsg("formHandler", json, "/Customs/ExportMaterial?SystemNo=" + $("#hidSystemNo").val());
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
	                AlertResultMsg("formHandler", json, "/Customs/ExportMaterial?SystemNo=" + $("#hidSystemNo").val());
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


function GoHandler(BUKRS, SystemNo, CustomsImportNo, MATNR, MBLNR) {
	if (BUKRS != undefined && SystemNo != undefined &&
		CustomsImportNo != undefined && MATNR != undefined && MBLNR != undefined) {
		CloseBlockUI();

		$.ajax({
			url: "/Customs/ExportMaterial",
			type: 'get',
			dataType: 'json',
			data: "BUKRS=" + BUKRS + "&SystemNo=" + SystemNo + "&CustomsImportNo=" + CustomsImportNo + "&MATNR=" + MATNR + "&MBLNR=" + MBLNR,
			success: function (json) {

				$("#lblSystemNo").text(json.SystemNo);
				$("#hidSystemNo").val(json.SystemNo);
				$("#hidWERKS").val(json.WERKS);
				$("#hidZWAREHSHandler").val(json.ZWAREHS);
				$("#lblCustomsImportNo").text(json.CustomsImportNo);
				$("#hidCustomsImportNo").val(json.CustomsImportNo);
				$("#lblMBLNR").text(json.MBLNR);
				$("#hidMBLNRHandler").val(json.MBLNR);
				$("#lblMATNR").text(json.MATNR);
				$("#hidMATNR").val(json.MATNR);
				$("#lblMATNR_TXT").text(json.MATNR_TXT);
				$("#txtMENGE").val(parseFloat(json.MENGE).toFixed(5));
				$("#hidMENGE").val(parseFloat(json.MENGE).toFixed(5));
				$("#lblMEINS").text(json.MEINS);
				$("#txtWHCNT").val(parseFloat(json.WHCNT).toFixed(5));
				$("#hidWHCNT").val(parseFloat(json.WHCNT).toFixed(5));
				$("#lblWHUIT").text(json.WHUIT);
				$("#txtLSMNG").val(parseFloat(json.LSMNG).toFixed(5));
				$("#hidLSMNG").val(parseFloat(json.LSMNG).toFixed(5));
				$("#lblLSMEH").text(json.LSMEH);
				$("#lblHSCode").text(json.HSCode);

				convertChineseLang();

				$("#CRUD").val("update");
				$("#tabUpdate").click();
			}
		});
	}
	else {
		$("#CRUD").val("");
	}
}

function GetMaterialList(VBELN) {
    var jqGridCounts = $("#" + jqGridIDSAPExport).getGridParam("reccount");
    for (i = 1; i <= jqGridCounts ; i++) {
        var rowObject = $("#" + jqGridIDSAPExport).jqGrid('getRowData', i);
        if (rowObject["VBELN"] != VBELN)
            $("#" + jqGridIDSAPExport).jqGrid('delRowData', i);
    }
    $("#hidVBELN").val(VBELN);
    $("#txtMATNR").val("auto");
    $("#btnQueryMaterial").click();
}

function GetImportMaterialList(MBLNR) {
    var jqGridCounts = $("#" + jqGridIDSAPImport).getGridParam("reccount");
    for (i = 1; i <= jqGridCounts ; i++) {
        var rowObject = $("#" + jqGridIDSAPImport).jqGrid('getRowData', i);
        if (rowObject["MBLNR"] != MBLNR)
            $("#" + jqGridIDSAPImport).jqGrid('delRowData', i);
    }
    $("#hidMBLNR").val(MBLNR);
    $("#txtMATNR").val("auto");
    $("#btnQueryMaterial").click();
}