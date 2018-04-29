$(function () {    
	$("#tabUpload").click(function () {
		return $("#CRUD").val() == "upload";
	});
	$("#tabUpdateDeclaration").click(function () {
	    return $("#CRUD").val() == "updateDeclaration";
	});	
	$("#btnDelete").hide();
	$("#ddlDeptIDHandler").attr('disabled', 'disabled');

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
        
	    //公司別不同顯示控制
		if (BUKRS == "3Y00") {
		    $("#" + jqGridID).jqGrid('hideCol', ["ReviewUser"]);  //怡康不顯示單証審核人員
		}

		//ResultData區域顯示
		$("#ResultData").show();

		reloadGrid(
			JSON.stringify(
			{
				"groupOp": "AND",
				"rules":
					[
						{ "field": "BUKRS", "op": "eq", "data": BUKRS },
						{ "field": "SystemNo", "op": "cn", "data": $("#txtSystemNo").val() },
						{ "field": "DeclarationNo", "op": "cn", "data": $("#txtDeclarationNo").val() },
						{ "field": "TKONN_EX", "op": "cn", "data": $("#txtTKONN_EX").val() },
						//{ "field": "ReceiveFilesDate_Start", "op": "ge", "data": $("#txtReceiveFilesDate_Start").val() },
						//{ "field": "ReceiveFilesDate_End", "op": "le", "data": $("#txtReceiveFilesDate_End").val() },                        
						{ "field": "TradeCategory", "op": "eq", "data": $("#ddlTradeCategory").val() },
                        { "field": "DataStatus", "op": "eq", "data": $("#ddlDataStatus").val() },
                        { "field": "CreateUser", "op": "eq", "data": $("#txtCreateUser").val() },
                        { "field": "CreateDate_Start", "op": "ge", "data": $("#txtCreateDate_Start").val() },
						{ "field": "CreateDate_End", "op": "le", "data": $("#txtCreateDate_End").val() },
					    { "field": "IsClosed", "op": "eq", "data": $("#ddlIsClosed").val() }
					]
			})
		);
	});

	$("#formHandler").submit(function (e) {
		if (!$("#formHandler").valid()) {
			AlertErrorMsg("formHandler");
			return false;
		}
		var errMsg = "";
		if ($("#txtApplicationDate").val() != "") {
		    if ($("#txtDeclareCompany").val() == "") errMsg = errMsg + "申報單位";
            // 20170220 取消控管
		    //if ($("#txtDeclarationNoHandler").val() == "") errMsg = errMsg + "、報關單號";
		    //if ($("#txtCustomsImportNoHandler").val() == "") errMsg = errMsg + "、海關進庫單號";
		    if (errMsg != "") errMsg = "<p>" + errMsg + " 不可空白！</p>";
		}
		if ($("#txtDeclarationNoHandler").val().length > 0 && $("#txtDeclarationNoHandler").val().length != 18) errMsg = errMsg + "<p>報關單號長度應為 18 碼！</p>";
		if ($("#txtCustomsImportNoHandler").val().length > 0 && $("#txtCustomsImportNoHandler").val().length != 20) errMsg = errMsg + "<p>海關進庫單號長度應為 20 碼！</p>";
		if ($("#cbDeclareCompanyYNHandler").prop('checked') == true && $("#txtOutsourceDeclareCompany").val() == "") errMsg = errMsg + "<p>[委外申報] 項目為 Yes 時 [委外申報單位] 不可為空白！</p>";
		if ($("#cbDeclareCompanyYNHandler").prop('checked') == false && $("#txtOutsourceDeclareCompany").val() != "") errMsg = errMsg + "<p>[委外申報] 項目為 No 時 [委外申報單位] 應該為空白！</p>";
		if ($("#txtDelegateDeclarationNoHandler").val().length > 0 && $("#txtDelegateDeclarationNoHandler").val().length != 17) errMsg = errMsg + "<p>[電子委托報關協議編號] 長度應為 17 碼！</p>";
		if (errMsg != "") {
		    AlertErrorMsg("formHandler", errMsg);
		    return false;
		}

		ShowBlockUI();

		//prevent Default functionality
		e.preventDefault();

		//get the action-url of the form
		var actionurl = e.currentTarget.action;

		$("#hidIdentifier").val("I" + $("#ddlDeptIDHandler option:selected").attr("identifier"));
		$("#hidZWAREHS").val($("#ddlZWAREHSHandler").val());
		$("#hidIsSalesReturns").val($("#cbIsSalesReturnsHandler").prop('checked'));
		$("#hidOriginYN").val($("#cbOriginYNHandler").prop('checked'));
		$("#hidDeclareCompanyYN").val($("#cbDeclareCompanyYNHandler").prop('checked'));
		$("#ddlDeptIDHandler").removeAttr('disabled');

		//do your own request an handle the results
		$.ajax({
			url: actionurl,
			type: 'post',
			dataType: 'json',
			data: $(this).serialize(),
			success: function (json) {
				//$("#ddlDeptIDHandler").attr('disabled', 'disabled');
			    CloseBlockUI();			    
				AlertResultMsg("formHandler", json, "/Customs/ImportDaily");
			}
		});
	});

	$("#formUpload").submit(function (e) {
	    if ($("#filePDF").val().length == 0) {
	        AlertErrorMsg("formUpload", $("#filePDF").attr("data-val-required"));
			return false;
		}

		ShowBlockUI();

		//prevent Default functionality
		e.preventDefault();

		//get the action-url of the form
		var actionurl = e.currentTarget.action;
  
		// Checking whether FormData is available in browser  
		if (window.FormData !== undefined) {  
  
			var fileUpload = $("#filePDF").get(0);  
			var files = fileUpload.files;  
			  
			// Create FormData object  
			var formData = new FormData();  
  
			// Looping over all files and add it to FormData object  
			for (var i = 0; i < files.length; i++) {  
			    formData.append(files[i].name, files[i]);
			}

			formData.append("SystemNo", $("#hidSystemNo").val());
			formData.append("ActionName", "ImportDaily");
			formData.append("PDFVar", $("#hidPDFField").val());
			
			$.ajax({  
				url: actionurl,  
				type: "POST",  
				contentType: false, // Not to set any content header  
				processData: false, // Not to process data  
				data: formData,
				success: function (json) {
					//$("#ddlDeptIDHandler").attr('disabled', 'disabled');
				    CloseBlockUI();				    
					AlertResultMsg("formUpload", json, "/Customs/ImportDaily");
				},  
				error: function (err) {  
					alert(err.statusText);  
				}  
			});  
		} else {  
			alert("FormData is not supported.");  
		}  
	});

	$("#formUpdateDeclaration").submit(function (e) {
	    if (!$("#formUpdateDeclaration").valid()) {
	        AlertErrorMsg("formUpdateDeclaration");
	        return false;
	    }
	    var errMsg = "";
	    if ($("#txtNewDeclarationNo").val().length > 0 && $("#txtNewDeclarationNo").val().length != 18) errMsg = errMsg + "<p>(新)報關單號長度應為 18 碼！</p>";
	    if ($("#txtNewCustomsImportNo").val().length > 0 && $("#txtNewCustomsImportNo").val().length != 20) errMsg = errMsg + "<p>(新)海關進庫單號長度應為 20 碼！</p>";
	    if (errMsg != "") {
	        AlertErrorMsg("formUpdateDeclaration", errMsg);
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
	            //$("#ddlDeptIDHandler").attr('disabled', 'disabled');
	            CloseBlockUI();
	            AlertResultMsg("formUpdateDeclaration", json, "/Customs/ImportDaily");
	        }
	    });
	});

	$("#btnInsert").click(function () {
		GoHandler(BUKRS);
	});
    	
	$("#btnDelete").click(function () {
		bootbox.confirm({
			message: "<br />請問是否刪除此筆資料？<br />",
			callback: function (result) {
				if (result) {
					ShowBlockUI();
					$("#CRUD").val("delete");
					$("#ddlDeptIDHandler").removeAttr('disabled');

					$.ajax({
						url: "/Customs/ImportDailyHandler",
						type: 'post',
						dataType: 'json',
						data: $("#formHandler").serialize(),
						success: function (json) {
							CloseBlockUI();
							AlertResultMsg("formHandler", json, "/Customs/ImportDaily");
						}
					});
				}
			}
		})
	});
    
	$("#jqUpdate").click(function () {	    
	    if (!$(this).hasClass("disabled")) {	        
			var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
			var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
			if (BUKRS == "3Y00") {	//怡康原功能	
			    GoHandler(rowObject['BUKRS'], rowObject['SystemNo']);
			}
			else if (BUKRS == "3G00") {
			    var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
			    var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
			    if (rowObject['CreateUser'] == LoginUserID) {
			        GoHandler(rowObject['BUKRS'], rowObject['SystemNo']);
			    }
			    else {
			        toastr.warning("非開單人員不可修改!", "修改提示：", { timeOut: 3000 })
			    }
			}
	    }	    
	});
	
	$("#jqUpload").click(function () {
		if (!$(this).hasClass("disabled")) {
			var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
			var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
			$("#CRUD").val("upload");
			$("#UploadSystemNo").text(rowObject['SystemNo']);
			$("#hidSystemNo").val(rowObject['SystemNo']);
			$("#hidPDFField").val("A");
			$("#tabUpload").click();
            if (rowObject['PDF']!= "") {
                //bootbox.alert("PDF上傳提示：<BR/><BR/> 已有上傳PDF檔，本次為覆蓋上傳(僅提示)");
                toastr.warning("已有PDF檔，本次為覆蓋上傳(僅提示)", "PDF上傳提示：", { timeOut: 3000 })
	            }
		}
	});

	$("#jqUploadB").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
	        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
	        $("#CRUD").val("upload");
	        $("#UploadSystemNo").text(rowObject['SystemNo']);
	        $("#hidSystemNo").val(rowObject['SystemNo']);
	        $("#hidPDFField").val("B");
	        $("#tabUpload").click();
	        if (rowObject['PDFB'] != "") {
	            //bootbox.alert("PDF上傳提示：<BR/><BR/> 已有上傳PDF檔，本次為覆蓋上傳(僅提示)");
	            toastr.warning("已有PDF檔，本次為覆蓋上傳(僅提示)", "PDF上傳提示：", { timeOut: 3000 })
	        }
	    }	     
	});
       
	$("#jqExportExcel").click(function () {
	    if (!$(this).hasClass("disabled")) {

	        ShowBlockUI();

	        $.ajax({
	            url: "/Customs/ImportDaily",
	            type: 'post',
	            dataType: 'json',
	            data: {
	                "jsonCondition": JSON.stringify(
			        {
			            "groupOp": "AND",
			            "rules":
					        [
						        { "field": "BUKRS", "op": "eq", "data": BUKRS },
						        { "field": "SystemNo", "op": "cn", "data": $("#txtSystemNo").val() },
						        { "field": "DeclarationNo", "op": "cn", "data": $("#txtDeclarationNo").val() },
						        { "field": "TKONN_EX", "op": "cn", "data": $("#txtTKONN_EX").val() },
						        { "field": "ReceiveFilesDate_Start", "op": "ge", "data": $("#txtReceiveFilesDate_Start").val() },
						        { "field": "ReceiveFilesDate_End", "op": "le", "data": $("#txtReceiveFilesDate_End").val() },
						        { "field": "TradeCategory", "op": "eq", "data": $("#ddlTradeCategory").val() }
					        ]
			        }),
	                "page": 1,
	                "rows": 0,
	                "sidx": "",
	                "sord": "",
	                "filters": ""
	            },
	            success: function (json) {
	                CloseBlockUI();
	                //console.log(json);
	                JSONToCSVConvertor(JSON.stringify(json.rows));
	            }
	        });
	        
	    }
    });

    $("#jqPayTariff").click(function () {
        if (!$(this).hasClass("disabled")) {
            let rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
            let rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            var menu = window.parent.document.getElementById("CustomsImportTariff");
            $(menu).attr("url", "/Customs/ImportTariff?SystemNo=" + rowObject['SystemNo']);
            window.parent.$(menu).click();
        }
    })

	$("#jqMaterial").click(function () {
		if (!$(this).hasClass("disabled")) {
			var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
			var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
			var menu = window.parent.document.getElementById("CustomsImportMaterial");
			if (BUKRS == "3G00" && rowObject['CreateUser'] != LoginUserID) {
			    toastr.warning("非開單人員不可修改!", "物料修改提示：", { timeOut: 3000 })
			}
			else {  //原怡康功能
			    $(menu).attr("url", "/Customs/ImportMaterial?SystemNo=" + rowObject['SystemNo']);
			    //location.href = "/Customs/ImportMaterial?SystemNo=" + rowObject['SystemNo'];
			    window.parent.$(menu).click();
			}
		}
	});

	$("#jqPrintTariff").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
	        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
	        var menu = window.parent.document.getElementById("ReportImportTariff");
	        $(menu).attr("url", "/Report/ImportTariff?SystemNo=" + rowObject['SystemNo']);
	        window.parent.$(menu).click();
	    }
	});

	$("#jqPrintInvoice").click(function () {	    
	    var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
	    var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
	    if (rowObject['ReviewUser'] != "") {
	        var url = "http://portalqas/sites/ReportCenter/OA/_layouts/ReportServer/RSViewerPage.aspx?rv:RelativeReportUrl=/sites/ReportCenter/OA/DocLib3/Invoice.rdl&rp%3aSystemNo=" + rowObject['SystemNo'] + "&rp%3aBUKRS=" + rowObject['BUKRS'] + "";
	        window.open(url, '_blank')
	    }
	    else {
	        toastr.warning("未審核不可打印!", "Invoice打印提示：", { timeOut: 3000 })	        
	    }
	});

    $("#jqPrintPacking").click(function() {
	    var rowID = $("#" +jqGridID).jqGrid('getGridParam', 'selrow');
	    var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
	    if (rowObject['ReviewUser'] != "") {
	        var url = "http://portalqas/sites/ReportCenter/OA/_layouts/ReportServer/RSViewerPage.aspx?rv:RelativeReportUrl=/sites/ReportCenter/OA/DocLib3/Packing.rdl&rp%3aSystemNo=" + rowObject['SystemNo'] + "&rp%3aBUKRS=" + rowObject['BUKRS'] + "";
	        window.open(url, '_blank')
	    }
	    else {
	        toastr.warning("未審核不可打印!", "Packing打印提示：", { timeOut: 3000 })
	    }
        });

    $("#jqPrintContract").click(function () {
        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
        if (rowObject['ReviewUser'] != "") {
            var url = "http://portalqas/sites/ReportCenter/OA/_layouts/ReportServer/RSViewerPage.aspx?rv:RelativeReportUrl=/sites/ReportCenter/OA/DocLib3/Contract.rdl&rp%3aSystemNo=" + rowObject['SystemNo'] + "&rp%3aBUKRS=" + rowObject['BUKRS'] + "";
            window.open(url, '_blank')
        }
        else{
            toastr.warning("未審核不可打印!", "合同打印提示：", { timeOut: 3000 })
        }
    });

    $("#jqUpdateReview").click(function () {  //報關單証審核
        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
        if (rowObject['CreateUser'] == LoginUserID || rowObject['ModifyUser'] == LoginUserID) {
            toastr.warning("審核人員不可為開單人員!", "報關單証審核提示：", { timeOut: 3000 })
        }
        else if (rowObject['ReviewUser'] != "") {
            toastr.warning("已審核不可再審核!", "報關單証審核提示：", { timeOut: 3000 })  //考量A審變B審
        }
        else {
            bootbox.confirm({
                message: "<br />請問是否審核此筆資料？<br />",
                callback: function (result) {
                    if (result) {
                        ShowBlockUI();
                        $("#CRUD").val("updateReview");
                        $("#txtSystemNoHandler").val(rowObject['SystemNo']);
                        $.ajax({
                            url: "/Customs/ImportDailyHandler",
                            type: 'post',
                            dataType: 'json',
                            data: $("#formHandler").serialize(),
                            success: function (json) {
                                CloseBlockUI();
                                $("#btnSubmit").click();  //更新頁面
                            }
                        });
                    }
                }
            })
        }
    });

    $("#jqUpdateReviewCancel").click(function () {  //取消單証審核
        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
        if (rowObject['ReviewUser'] != LoginUserID) {
            toastr.warning("取消審核人員需為單証審核人員!", "取消單証審核提示：", { timeOut: 3000 })
        }
        else {
            bootbox.confirm({
                message: "<br />請問是否審核此筆資料？<br />",
                callback: function (result) {
                    if (result) {
                        ShowBlockUI();
                        $("#CRUD").val("updateReviewCancel");
                        $("#txtSystemNoHandler").val(rowObject['SystemNo']);
                        $.ajax({
                            url: "/Customs/ImportDailyHandler",
                            type: 'post',
                            dataType: 'json',
                            data: $("#formHandler").serialize(),
                            success: function (json) {
                                CloseBlockUI();
                                $("#btnSubmit").click();  //更新頁面
                            }
                        });
                    }
                }
            })
        }
    });

	$("#jqUpdateDeclaration").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
	        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
	        $("#CRUD").val("updateDeclaration");
	        $("#hidSystemNo4UD").val(rowObject['SystemNo']);
	        $("#hidBELNR").val(rowObject['BELNR']);
	        $("#txtOldDeclarationNo").val(rowObject['DeclarationNo']);
	        $("#txtNewDeclarationNo").val("");
	        $("#txtOldCustomsImportNo").val(rowObject['CustomsImportNo']);
	        $("#txtNewCustomsImportNo").val("");
	        $("#tabUpdateDeclaration").click();

	        //20170724增判若為三方且報關單空白則直接填入ThirdTrans,SAP才可批配更新
	        if (rowObject['TradeCategory'] == "ThirdTrans" && rowObject['DeclarationNo'] == "") {
	            $("#txtOldDeclarationNo").val("ThirdTrans");
	        }
	        //20170728新進庫單不可修改取原進庫單資料(三方為空由後端給空白)
	        $("#txtNewCustomsImportNo").val($("#txtOldCustomsImportNo").val());
	        $("#txtNewCustomsImportNo").attr("readonly", true);
	    }
	});

	$("#ddlDataStatusHandler").change(function () {	   
	    if ($("#ddlDataStatusHandler").val() == 'D') {	        
	        bootbox.alert("選擇 [ 作廢 ] 存檔後將刪除：<BR/>1.物料綁定資料<BR/>2.報關單號<BR/>3.進庫單號<BR/>4.PDF");
	    }
	});

	$("#ddlTradeBondedHandler").change(function () {
		if ($(this).val().length > 0) {
			$("#ddlTradeDutiableHandler").val("");
			if ($("#hidWERKS").val() != BUKRS.replace("00", "") + Bonded) {
			    $("#hidWERKS").val(BUKRS.replace("00", "") + Bonded);
				GetZWAREHS();
			}
		}
		else {
			$("#ddlZWAREHSHandler option").remove();
			$("#ddlZWAREHSHandler").append("<option value=''></option>");
		}
	});

	$("#ddlTradeDutiableHandler").change(function () {
		if ($(this).val().length > 0) {
			$("#ddlTradeBondedHandler").val("");
			if ($("#hidWERKS").val() != BUKRS.replace("00", "") + Dutiable) {
			    $("#hidWERKS").val(BUKRS.replace("00", "") + Dutiable);
				GetZWAREHS();
			}
		}
		else {
			$("#ddlZWAREHSHandler option").remove();
			$("#ddlZWAREHSHandler").append("<option value=''></option>");
		}
	});

	$("#btnAutoNo").click(function () {
	    var autoNo = VKORG + "I" + moment().format('YYMMDDHHmmss');
	    $("#txtDeclarationNoHandler").val(autoNo + "0");
	    $("#txtCustomsImportNoHandler").val(autoNo + "000");
	    return false;
	});

	var vQueryDate = decodeURI(QueryString("QueryDate"));
	if (vQueryDate != undefined && vQueryDate.length > 0) {
	    $("#txtReceiveFilesDate_Start").val(vQueryDate);
	    $("#txtReceiveFilesDate_End").val(vQueryDate);
	}
	var vSystemNo = decodeURI(QueryString("SystemNo"));
	if (vSystemNo != undefined && vSystemNo.length > 0) {
	    $("#txtSystemNo").val(vSystemNo);
	    var menu = window.parent.document.getElementById("CustomsImportDaily");
	    $(menu).attr("url", "/Customs/ImportDaily");
	    $("#btnSubmit").click();
	}

	$("#formUploadCost").submit(function (e) {
	    if ($("#fileExcel").val().length == 0) {
	        AlertErrorMsg("formUpload", $("#fileExcel").attr("data-val-required"));
	        return false;
	    }
	    
	    ShowBlockUI();

	    //prevent Default functionality
	    e.preventDefault();

	    //get the action-url of the form
	    var actionurl = e.currentTarget.action;

	    $("#hidIdentifierCost").val("C" + VKORG.substring(2, 3));  //C:Cost
	    $("#hidVKORGCost").val(VKORG.substring(2, 3));
	    $("#hidPeriodIDCost").val("------");
	    $("#hidWERKSCost").val("----");
	    $("#hidZWAREHSCost").val("--");
	    
	    $.ajax({
	        url: actionurl,
	        type: 'post',
	        dataType: 'json',
	        data: $(this).serialize(),
	        success: function (json) {            	            
	            if (json.ResultCode == -1) {
	                CloseBlockUI();
	                AlertErrorMsg("formUpload", json.ResultMessage);
	                return;
	            }
                
	            // Checking whether FormData is available in browser  
	            if (window.FormData !== undefined) {

	                var fileUpload = $("#fileExcel").get(0);
	                var files = fileUpload.files;

	                // Create FormData object  
	                var formData = new FormData();

	                // Looping over all files and add it to FormData object  
	                for (var i = 0; i < files.length; i++) {
	                    formData.append(files[i].name, files[i]);
	                }

	                formData.append("BUKRS", BUKRS);
	                formData.append("SystemNo", json.ResultMessage);
	                formData.append("ActionName", "CostImportExcel");
	                formData.append("JSON",
                        "{'ZWAREHS':'" + $("#hidZWAREHSCost").val() +
                        "','PeriodID':'" + $("#hidPeriodIDCost").val() +
                        "','VKORG':'" + $("#hidVKORGCost").val() + "'}"
                    );
	                $.ajax({
	                    url: "/Data/FileUpload",
	                    type: "POST",
	                    contentType: false, // Not to set any content header  
	                    processData: false, // Not to process data  
	                    data: formData,
	                    success: function (json) {

	                        CloseBlockUI();	                        
	                        AlertResultMsg("formHandler", json, "/Customs/ImportDaily");
	                    },
	                    error: function (err) {
	                        alert(err.statusText);
	                    }
	                });
	            } else {
	                CloseBlockUI();
	                alert("FormData is not supported.");
	            }
	        }
	    });
	});
})

function GetZWAREHS(val) {
	$.ajax({
		url: "/Data/ZTWAREHS",
		type: 'post',
		dataType: 'json',
		data: "BUKRS=" + BUKRS + "&WERKS=" + $("#hidWERKS").val() + "&VKORG=" + VKORG,
		success: function (json) {
			$("#ddlZWAREHSHandler option").remove();
			$("#ddlZWAREHSHandler").append("<option value=''></option>");
			$(json).each(function () {
				if (val != undefined && val == this.ZWAREHS)
					$("#ddlZWAREHSHandler").append("<option selected value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
				else
					$("#ddlZWAREHSHandler").append("<option value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
			});
		},
		error: function () {
			$("#ddlZWAREHSHandler option").remove();
			$("#ddlZWAREHSHandler").append("<option value=''></option>");
			alert("取得倉庫資料失敗！");
		}
	});

}

function GoHandler(BUKRS, SystemNo) {
	if (BUKRS != undefined && SystemNo != undefined) {
		CloseBlockUI();

		$.ajax({
			url: "/Customs/ImportDaily",
			type: 'get',
			dataType: 'json',
			data: "isDetail=" + true + "&SystemNo=" + SystemNo,
			success: function (json) {
				$("#HandleStatus").text(langUpdateData);
				$("#formHandler :reset").hide();
			    //$("#btnDelete").show();
			    
				$("#txtSystemNoHandler").val(json.SystemNo);
				$("#hidIdentifier").val(json.Identifier);
				$("#txtPeriodIDHandler").val(json.PeriodID);
				$("#ddlTradeCategoryHandler").val(json.TradeCategory);
				$("#txtReceiveFilesDateHandler").val(json.ReceiveFilesDate);
				$("#ddlTransportHandler").val(json.Transport);
				$("#txtETDHandler").val(json.ETD);
				$("#txtETAHandler").val(json.ETA);
				$("#txtContainerHandler").val(json.Container);
				$("#txtIENHandler").val(json.IEN);
				$("#ddlTradeBondedHandler").val(json.TradeBonded);
				$("#ddlTradeDutiableHandler").val(json.TradeDutiable);
				$("#txtSendDateHandler").val(json.SendDate);
				$("#txtApplicationDate").val(json.ApplicationDate);
				$("#txtDeclareCompany").val(json.DeclareCompany);
				$("#txtDeclarationNoHandler").val(json.DeclarationNo);
				$("#txtCustomsImportNoHandler").val(json.CustomsImportNo);
				$("#hidWERKS").val(json.WERKS);
				$("#txtImportDateHandler").val(json.ImportDate);
				$("#txtTKONN_EXHandler").val(json.TKONN_EX);
				$("#txtRemarkHandler").val(json.Remark);
				$("#cbIsSalesReturnsHandler").prop('checked', json.IsSalesReturns);
				$("#cbOriginYNHandler").prop('checked', json.OriginYN);
				$("#hidOldOriginYN").val(json.OriginYN);				
				$("#cbDeclareCompanyYNHandler").prop('checked', json.DeclareCompanyYN);
				$("#txtOutsourceDeclareCompany").val(json.OutsourceDeclareCompany);
				$("#txtDelegateDeclarationNoHandler").val(json.DelegateDeclarationNo);
				$("#ddlDataStatusHandler").val(json.DataStatus);  
				$("#hidSAPNo").val(json.SAPNo);

				GetZWAREHS(json.ZWAREHS);

				convertChineseLang();				
				$("#tabHandle").click();
				$("#CRUD").val("update");
			}
		});
	}
	else {
		$("#HandleStatus").text(langInsertData);
		$("#CRUD").val("create");
		document.getElementById("formHandler").reset();
		$("#ddlZWAREHSHandler option").remove();
		$("#ddlZWAREHSHandler").append("<option value=''></option>");
		$("#txtApplicationDate").val("");
		$("#txtImportDateHandler").val("");
		$("#txtETDHandler").val("");
		$("#txtETAHandler").val("");
		$("#txtSendDateHandler").val("");
		$("#btnDelete").hide();
		$("#tabHandle").click();
		if (BUKRS == "3G00") {	
		    $("#ddlDeptIDHandler").removeAttr('disabled');                //華港開放可選部門			    
		    $("#hidWERKS").val("3G10");                                   //新增時不選貿易方式故需另給值
		    $("#ddlTradeBondedHandler").attr('disabled', 'disabled');	  //東莞的保稅貿易選項關閉	    
		    $("#ddlTradeDutiableHandler").val("Duty");                    //完稅貿易初值給[一般貿易]
		    //$("#ddlZWAREHSHandler").attr('disabled', 'disabled');       //庫別只有一個預設給值不要再選
		    $("#ddlZWAREHSHandler").append("<option selected value='GE'> 重慶公司庫 </option>");	    		    		    
		}
	}
}