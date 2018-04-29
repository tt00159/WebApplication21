$(function () {
    $("#btnDelete").hide();

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
						{ "field": "BUKRS", "op": "eq", "data": BUKRS },
						{ "field": "DeclarationNo", "op": "cn", "data": $("#txtDeclarationNo").val() },
                        { "field": "CreateUser", "op": "cn", "data": $("#txtCreateUser").val() },
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
				AlertResultMsg("formHandler", json, "/Customs/ExportDeclaration");
			}
		});
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

					$.ajax({
					    url: "/Customs/ExportDeclarationHandler",
						type: 'post',
						dataType: 'json',
						data: $("#formHandler").serialize(),
						success: function (json) {
							CloseBlockUI();
							AlertResultMsg("formHandler", json, "/Customs/ExportDeclaration");
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
			GoHandler(rowObject['BUKRS'], rowObject['DeclarationNo']);
		}
	});

	$("#jqMaterial").click(function () {
		if (!$(this).hasClass("disabled")) {
			var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
			var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
			var menu = window.parent.document.getElementById("CustomsDeclarationMaterial");
			$(menu).attr("url", "/Customs/DeclarationMaterial?TradeKind=Export&DeclarationNo=" + rowObject['DeclarationNo']);
			window.parent.$(menu).click();
		}
	});
})

function GoHandler(BUKRS, DeclarationNo) {
    if (BUKRS != undefined && DeclarationNo != undefined) {
		CloseBlockUI();

		$.ajax({
		    url: "/Customs/ExportDeclaration",
			type: 'get',
			dataType: 'json',
			data: "isDetail=true&DeclarationNo=" + DeclarationNo,
			success: function (json) {
				$("#HandleStatus").text(langUpdateData);
				//$("#btnDelete").show();

				$('#txtDeclarationNoHandler').val(json.DeclarationNo);
				$('#txtTradeCategory').val(json.TradeCategory);
				$('#txtPreentryNo').val(json.PreentryNo);
				$('#txtConsignorNo').val(json.ConsignorNo);
				$('#txtConsignor').val(json.Consignor);
				$('#txtExportPortNo').val(json.ExportPortNo);
				$('#txtExportPort').val(json.ExportPort);
				$('#txtRecordNo').val(json.RecordNo);
				$('#txtExportDate').val(json.ExportDate);
				$('#txtApplicationDate').val(json.ApplicationDate);
				$('#txtProduceSaleNo').val(json.ProduceSaleNo);
				$('#txtProduceSale').val(json.ProduceSale);
				$('#txtTransportationNo').val(json.TransportationNo);
				$('#txtTransportation').val(json.Transportation);
				$('#txtBillLadingNo').val(json.BillLadingNo);
				$('#txtDeclareCompanyNo').val(json.DeclareCompanyNo);
				$('#txtDeclareCompany').val(json.DeclareCompany);
				$('#txtTradeModeNo').val(json.TradeModeNo);
				$('#txtTradeMode').val(json.TradeMode);
				$('#txtTaxKindNo').val(json.TaxKindNo);
				$('#txtTaxKind').val(json.TaxKind);
				$('#txtLicenseNo').val(json.LicenseNo);
				$('#txtTradingCountryNo').val(json.TradingCountryNo);
				$('#txtTradingCountry').val(json.TradingCountry);
				$('#txtDestinationCountryNo').val(json.DestinationCountryNo);
				$('#txtDestinationCountry').val(json.DestinationCountry);
				$('#txtDestinationPortNo').val(json.DestinationPortNo);
				$('#txtDestinationPort').val(json.DestinationPort);
				$('#txtOriginalPlaceNo').val(json.OriginalPlaceNo);
				$('#txtOriginalPlace').val(json.OriginalPlace);
				$('#txtTradeTerms').val(json.TradeTerms);
				$('#txtFreight').val(json.Freight);
				$('#txtInsurance').val(json.Insurance);
				$('#txtAdditionalExpenses').val(json.AdditionalExpenses);
				$('#txtContractNo').val(json.ContractNo);
				$('#txtPackages').val(json.Packages);
				$('#txtPackageType').val(json.PackageType);
				$('#txtGrossWeight').val(json.GrossWeight);
				$('#txtNetWeight').val(json.NetWeight);
				$('#txtContainerNo').val(json.ContainerNo);
				$('#txtAttachedDocuments').val(json.AttachedDocuments);
				$('#txtRemarks').val(json.Remarks);


				convertChineseLang();

				$('#txtDeclarationNoHandler').attr("readonly", true);
				$('#txtPreentryNo').attr("readonly", true);

				$("#tabHandle").click();
				$("#CRUD").val("update");
			}
		});
	}
	else {
		$("#HandleStatus").text(langInsertData);
		$("#CRUD").val("create");
		document.getElementById("formHandler").reset();
		$('#txtDeclarationNoHandler').attr("readonly", false);
		$('#txtPreentryNo').attr("readonly", false);
		$("#btnDelete").hide();
		$("#tabHandle").click();
	}
}