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
	else if (ShowData == "A") {
	    $("#txtCreateDate_Start").val("2017-01-01");
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
						{ "field": "BUKRS", "op": "eq", "data": BUKRS },
						{ "field": "SystemNo", "op": "cn", "data": $("#txtSystemNo").val() },
						{ "field": "DeclarationNo", "op": "cn", "data": $("#txtDeclarationNo").val() },
						//{ "field": "SendFilesDate_Start", "op": "ge", "data": $("#txtSendFilesDate_Start").val() },
						//{ "field": "SendFilesDate_End", "op": "le", "data": $("#txtSendFilesDate_End").val() },
						{ "field": "TradeCategory", "op": "eq", "data": $("#ddlTradeCategory").val() },
						{ "field": "DataStatus", "op": "eq", "data": $("#ddlDataStatus").val() },
					    { "field": "KUNNR", "op": "eq", "data": $("#hidKUNNRQuery").val() },
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
		if (!$("#cbIsPurchasesReturnsHandler").prop('checked') && $("#txtKUNNR").val() == "") {
		    AlertErrorMsg("formHandler", "客戶 不可空白！");
		    return false;
		}
		var errMsg = "";
		if ($("#txtApplicationDate").val() != "") {
		    if ($("#txtDeclareCompany").val() == "") errMsg = errMsg + "申報單位";
		    // 20170220 取消控管
		    //if ($("#txtDeclarationNoHandler").val() == "" &&
            //    $("#ddlTradeBondedHandler").val() != "Move") {
		    //    errMsg = errMsg + "、報關單號";
		    //}
		    //if ($("#txtCustomsExportNoHandler").val() == "") errMsg = errMsg + "、海關出庫單號";
		    if (errMsg != "") errMsg = "<p>" + errMsg + " 不可空白！</p>";
		}
		if ($("#txtDeclarationNoHandler").val().length > 0 && $("#txtDeclarationNoHandler").val().length != 18) errMsg = errMsg + "<p>報關單號長度應為 18 碼！</p>";
		if ($("#txtCustomsExportNoHandler").val().length > 0 && $("#txtCustomsExportNoHandler").val().length != 20) errMsg = errMsg + "<p>海關出庫單號長度應為 20 碼！</p>";
		if ($("#cbDeclareCompanyYNHandler").prop('checked') == true && $("#txtOutsourceDeclareCompany").val() == "") errMsg = errMsg + "<p>[是否委外申報] 項目為 Yes 時 [委外申報單位] 不可為空白！</p>";
		if ($("#cbDeclareCompanyYNHandler").prop('checked') == false && $("#txtOutsourceDeclareCompany").val() != "") errMsg = errMsg + "<p>[是否委外申報] 項目為 No 時 [委外申報單位] 應該為空白！</p>";
		if ($("#txtDelegateDeclarationNoHandler").val().length > 0 && $("#txtDelegateDeclarationNoHandler").val().length != 18) errMsg = errMsg + "<p>[電子委托報關協議編號] 長度應為 18 碼！</p>";
		if (errMsg != "") {
		    AlertErrorMsg("formHandler", errMsg);
		    return false;
		}

		ShowBlockUI();

		//prevent Default functionality
		e.preventDefault();

		//get the action-url of the form
		var actionurl = e.currentTarget.action;

		$("#hidIdentifier").val("E" + $("#ddlDeptIDHandler option:selected").attr("identifier"));
		$("#hidZWAREHS").val($("#ddlZWAREHSHandler").val());
		$("#hidIsPurchasesReturns").val($("#cbIsPurchasesReturnsHandler").prop('checked'));
		$("#ddlDeptIDHandler").removeAttr('disabled');
		$("#hidDeclareCompanyYN").val($("#cbDeclareCompanyYNHandler").prop('checked'));

		//do your own request an handle the results
		$.ajax({
			url: actionurl,
			type: 'post',
			dataType: 'json',
			data: $(this).serialize(),
			success: function (json) {
				//$("#ddlDeptIDHandler").attr('disabled', 'disabled');
				CloseBlockUI();
				AlertResultMsg("formHandler", json, "/Customs/ExportDaily");
			}
		});
	});
        
	$("#jqUpdateDeclaration").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
	        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
	        $("#CRUD").val("updateDeclaration");
	        $("#hidSystemNo4UD").val(rowObject['SystemNo']);
	        $("#hidDSAPNo").val(rowObject['SAPNo']);	        
	        $("#txtOldDeclarationNo").val(rowObject['DeclarationNo']);
	        $("#txtNewDeclarationNo").val("");
	        $("#txtOldCustomsExportNo").val(rowObject['CustomsExportNo']);
	        $("#txtNewCustomsExportNo").val("");
	        $("#tabUpdateDeclaration").click();	        
	        //20170724增判若為三方且報關單空白則直接填入ThirdTrans,SAP才可批配更新
	        if (rowObject['TradeCategory'] == "ThirdTrans" && rowObject['DeclarationNo'] == "") {
	            $("#txtOldDeclarationNo").val("ThirdTrans");
	        }
	        //20170728新進庫單不可修改取原進庫單資料(三方為空由後端給空白)
	        $("#txtNewCustomsExportNo").val($("#txtOldCustomsExportNo").val());
	        $("#txtNewCustomsExportNo").attr("readonly", true);
	    }
	});
    
	$("#formUpdateDeclaration").submit(function (e) {
	    if (!$("#formUpdateDeclaration").valid()) {
	        AlertErrorMsg("formUpdateDeclaration");
	        return false;
	    }
	    var errMsg = "";
	    if ($("#txtNewDeclarationNo").val().length > 0 && $("#txtNewDeclarationNo").val().length != 18) errMsg = errMsg + "<p>(新)報關單號長度應為 18 碼！</p>";
	    if ($("#txtNewCustomsExportNo").val().length > 0 && $("#txtNewCustomsExportNo").val().length != 20) errMsg = errMsg + "<p>(新)海關進庫單號長度應為 20 碼！</p>";
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
	            CloseBlockUI();
	            AlertResultMsg("formUpdateDeclaration", json, "/Customs/ExportDaily");
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
			formData.append("ActionName", "ExportDaily");
			formData.append("PDFVar", $("#hidPDFVar").val());
  
			$.ajax({  
				url: actionurl,  
				type: "POST",  
				contentType: false, // Not to set any content header  
				processData: false, // Not to process data  
				data: formData,
				success: function (json) {
					//$("#ddlDeptIDHandler").attr('disabled', 'disabled');
					CloseBlockUI();
					AlertResultMsg("formUpload", json, "/Customs/ExportDaily");
				},  
				error: function (err) {  
					alert(err.statusText);  
				}  
			});  
		} else {  
			alert("FormData is not supported.");  
		}  
	});

	$("#btnInsert").click(function () {
		GoHandler();
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
						url: "/Customs/ExportDailyHandler",
						type: 'post',
						dataType: 'json',
						data: $("#formHandler").serialize(),
						success: function (json) {
							CloseBlockUI();
							AlertResultMsg("formHandler", json, "/Customs/ExportDaily");
						}
					});
				}
			}
		})
	});

	$("#ddlDataStatusHandler").change(function () {
	    if ($("#ddlDataStatusHandler").val() == 'D') {
	        bootbox.alert("選擇 [ 作廢 ] 存檔後將刪除：<BR/>1.物料綁定資料<BR/>2.報關單號<BR/>3.出庫單號<BR/>4.PDF");
	    }
	});

	$("#jqUpdate").click(function () {
		if (!$(this).hasClass("disabled")) {
			var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
			var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
			GoHandler(rowObject['BUKRS'], rowObject['SystemNo']);
		}
	});

	$("#jqUpload").click(function () {
		if (!$(this).hasClass("disabled")) {
			var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
			var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
			$("#CRUD").val("upload");
			$("#UploadSystemNo").text(rowObject['SystemNo']);
			$("#hidSystemNo").val(rowObject['SystemNo']);
			$("#hidPDFVar").val("A");
			$("#tabUpload").click();
			if (rowObject['PDF'] != "") {
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
	        $("#hidPDFVar").val("B");
	        $("#tabUpload").click();	        
	        if (rowObject['PDFB'] != "") {
	            toastr.warning("已有PDF檔，本次為覆蓋上傳(僅提示)", "PDF上傳提示：", { timeOut: 3000 })
	        }
	    }
	});

	$("#jqMaterial").click(function () {
		if (!$(this).hasClass("disabled")) {
			var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
			var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
			var menu = window.parent.document.getElementById("CustomsExportMaterial");
			$(menu).attr("url", "/Customs/ExportMaterial?SystemNo=" + rowObject['SystemNo']);
			//location.href = "/Customs/ImportMaterial?SystemNo=" + rowObject['SystemNo'];
			window.parent.$(menu).click();
		}
	});

	$("#jqCancel").click(function () {
	    if (!$(this).hasClass("disabled")) {
	        bootbox.confirm({
	            title: '請問是否將此筆資料進行「抽單作業」？',
	            message: $("#CancelArea").html(),
	            callback: function (result) {
	                if (result) {
	                    ShowBlockUI();

	                    var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
	                    var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
	                    var flag = 1;
	                    if (rowObject['IsPurchasesReturns'] == yes) flag = 2;

	                    $.ajax({
	                        url: "/Data/CancelOperation",
	                        type: 'post',
	                        dataType: 'json',
	                        data: "BUKRS=" + rowObject['BUKRS'] + "&SystemNo=" + rowObject['SystemNo'] + "&BUDAT=" + $(".bootbox-body #txtBUDAT").val() + "&Flag=" + flag,
	                        success: function (json) {
	                            CloseBlockUI();
	                            AlertResultMsg("formHandler", json, "/Customs/ExportDaily?SystemNo=" + rowObject['SystemNo'] + "&SendFilesDate=" + rowObject['SendFilesDate']);
	                        }
	                    });
	                }
	            }
	        });

	        setTimeout(function () {

	            $(".bootbox-body #txtBUDAT").datepicker({
	                todayBtn: "linked",
	                weekStart: 7,
	                format: 'yyyy-mm-dd',
	                endDate: "+" + 0 + "d",
	                startDate: "-" + 365 + "d",
	                language: 'zh-TW',
	                autoclose: true,
	                zIndexOffset: 1000,
	                todayHighlight: true,
	                daysOfWeekHighlighted: "0,6"
	            })
		        //show datepicker when clicking on the icon
		        .next().on(ace.click_event, function () {
		            $(this).prev().focus();
		        });
	        }, 100);
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

	$("#btnKUNNRQuery").click(function () {

	    if ($("#tblGridDataKUNNRQuery").getGridParam("reccount") == 0) {
	        reloadGrid(
                JSON.stringify(
                {
                    "groupOp": "AND",
                    "rules":
                        [
                        ]
                }), "tblGridDataKUNNRQuery", "pagerKUNNRQuery", "/Data/GetClient"
            );
	    }

	    setTimeout(function () {

	        $("#ResultDataKUNNRQuery").show();

	    }, 100);
	});

	var vSendFilesDate = decodeURI(QueryString("QueryDate"));
	if (vSendFilesDate != undefined && vSendFilesDate.length > 0) {
	    $("#txtSendFilesDate_Start").val(vSendFilesDate);
	    $("#txtSendFilesDate_End").val(vSendFilesDate);
	}
	var vSystemNo = decodeURI(QueryString("SystemNo"));
	if (vSystemNo != undefined && vSystemNo.length > 0) {
	    $("#txtSystemNo").val(vSystemNo);
	    var menu = window.parent.document.getElementById("CustomsExportDaily");
	    $(menu).attr("url", "/Customs/ExportDaily");
	    $("#btnSubmit").click();
	}
})

function SetClientDataQuery(KUNNR, NAME) {
    $("#txtKUNNRQuery").val(NAME);
    $("#hidKUNNRQuery").val(KUNNR);

    $("#ResultDataKUNNRQuery").hide();
}

function SetClientData(KUNNR, NAME) {
    $("#txtKUNNR").val(NAME);
    $("#hidKUNNR").val(KUNNR);

    $("#ResultDataKUNNR").hide();
}

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
			url: "/Customs/ExportDaily",
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
				$("#hidKUNNR").val(json.KUNNR);
				$("#txtKUNNR").val(json.KUNNR_TXT);
				$("#hidSAPNo").val(json.SAPNo);
				$("#ddlTradeCategoryHandler").val(json.TradeCategory);
				$("#txtSendFilesDateHandler").val(json.SendFilesDate);
				$("#ddlTransportHandler").val(json.Transport);
				$("#txtETDHandler").val(json.ETD);
				$("#txtETAHandler").val(json.ETA);
				$("#txtContainerHandler").val(json.Container);
				$("#txtIENHandler").val(json.IEN);
				$("#ddlTradeBondedHandler").val(json.TradeBonded);
				$("#ddlTradeDutiableHandler").val(json.TradeDutiable);
				$("#txtApplicationDate").val(json.ApplicationDate);
				$("#txtDeclareCompany").val(json.DeclareCompany);
				$("#txtDeclarationNoHandler").val(json.DeclarationNo);
				$("#txtCustomsExportNoHandler").val(json.CustomsExportNo);
				//$("#txtReceiveDeclarationDate").val(json.ReceiveDeclarationDate);
				$("#hidWERKS").val(json.WERKS);
				$("#txtExportDateHandler").val(json.ExportDate);
				$("#txtRemarkHandler").val(json.Remark);
				$("#cbIsPurchasesReturnsHandler").prop('checked', json.IsPurchasesReturns);
				$("#ddlDataStatusHandler").val(json.DataStatus);
				$("#txtPaymentCountryHandler").val(json.PaymentCountry);
				$("#txtOverseasDeliveryHandler").val(json.OverseasDelivery);
				$("#cbDeclareCompanyYNHandler").prop('checked', json.DeclareCompanyYN);
                $("#txtOutsourceDeclareCompany").val(json.OutsourceDeclareCompany);
                $("#txtDelegateDeclarationNoHandler").val(json.DelegateDeclarationNo);
				$("#txtAdvancePaymentHandler").val(json.AdvancePayment);
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
		//$("#txtReceiveDeclarationDate").val("");
		$("#txtExportDateHandler").val("");
		$("#txtETDHandler").val("");
		$("#txtETAHandler").val("");
		$("#btnDelete").hide();
		$("#tabHandle").click();
	}
}