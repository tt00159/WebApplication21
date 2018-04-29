$(function () {
    $("#tabHandle").click(function () {
        return $("#CRUD").val() == "create" || $("#CRUD").val() == "update";
    });

    //建立人員初值及唯讀屬性控制    
    if (ShowData == "P") {
        $("#txtCreateUser").val(LoginUserID);
        $("#txtCreateUser").attr('disabled', 'disabled');
    }

    $("#ddlTradeKind").change(function () {
        if ($(this).val() == "Import") {
            $("#txtDestinationID").val("");
            $("#txtDestination").val("");
            $("#ExportTrade").hide();
            $("#ImportTrade").show();
        }
        else {
            $("#txtOriginID").val("");
            $("#txtOrigin").val("");
            $("#ImportTrade").hide();
            $("#ExportTrade").show();
        }
    });

    var vTradeKind = decodeURI(QueryString("TradeKind"));
    if (vTradeKind != undefined && vTradeKind.length > 0) {
        $("#ddlTradeKind").val(vTradeKind);
        $("#hidTradeKind").val(vTradeKind);
    }
    var vDeclarationNo = decodeURI(QueryString("DeclarationNo"));
    if (vDeclarationNo != undefined && vDeclarationNo.length > 0) {
        $("#txtDeclarationNo").val(vDeclarationNo);
        var menu = window.parent.document.getElementById("CustomsDeclarationMaterial");
        $(menu).attr("url", "/Customs/DeclarationMaterial");
        setTimeout(function () {
            $("#form :submit").click();
        }, 100);
    }

	$("#form").submit(function (e) {
		if (!$("#form").valid()) {
			AlertErrorMsg("form");
			return false;
		}
		ShowBlockUI();
		$("#CRUD").val("");
		$("#hidTradeKind").val($("#ddlTradeKind").val());
		$("#NoDataFound").hide();

		//prevent Default functionality

		e.preventDefault();
		$.ajax({
		    url: "/Customs/" + $("#hidTradeKind").val() + "Declaration",
		    type: 'get',
		    dataType: 'json',
		    data: "isDetail=true&DeclarationNo=" + $('#txtDeclarationNo').val(),
            error: function (jqXHR, textStatus, errorThrown) {
                //alert("jqXHR\r\nstatusText = " + jqXHR.statusText + "\r\nresponseText = " + jqXHR.responseText + "\r\nstatus = " + jqXHR.status + "\r\nreadyState = " + jqXHR.readyState);
                //alert("textStatus = " + textStatus + "\r\nerrorThrown = " + errorThrown);

                $("#NoDataFound").show();
                convertChineseLang();
                CloseBlockUI();
            }, 
            success: function (json) {
                $("#NoDataFound").hide();
		        var TradeKind = $("#hidTradeKind").val();

		        $('#lblDeclarationNo').text(json.DeclarationNo);
		        $('#lblTradeCategory_TXT').text(json.TradeCategory_TXT);
		        $('#lblPreentryNo').text(json.PreentryNo);

		        if (TradeKind == "Import") {
		            $('#lblConsignNo').text("(" + json.ConsigneeNo + ")");
		            $('#lblConsign').text(json.Consignee);
		            $('#lblPortNo').text("(" + json.ImportPortNo + ")");
		            $('#lblPort').text(json.ImportPort);
		            $('#ImportPort').show();
		            $('#ExportPort').hide();
		            $('#lblDate').text(json.ImportDate);
		            $('#ImportDate').show();
		            $('#ExportDate').hide();
		            $('#lblHeaderUnitNo').text(json.ConsumeUsedNo);
		            $('#lblHeaderUnit').text(json.ConsumeUsed);
		            $('#ConsumeUsed').show();
		            $('#ProduceSale').hide();
		            $('#lblCountryNo').text("(" + json.OriginCountryNo + ")");
		            $('#lblCountry').text(json.OriginCountry);
		            $('#OriginCountry').show();
		            $('#DestinationCountry').hide();
		            $('#lblLocationPortNo').text("(" + json.LoadingPortNo + ")");
		            $('#lblLocationPort').text(json.LoadingPort);
		            $('#LoadingPort').show();
		            $('#DestinationPort').hide();
		            $('#lblPlaceNo').text("(" + json.DestinationNo + ")");
		            $('#lblPlace').text(json.Destination);
		            $('#Destination').show();
		            $('#OriginalPlace').hide();
		        }
		        else {
		            $('#lblConsignNo').text("(" + json.ConsignorNo + ")");
		            $('#lblConsign').text(json.Consignor);
		            $('#lblPortNo').text("(" + json.ExportPortNo + ")");
		            $('#lblPort').text(json.ExportPort);
		            $('#ExportPort').show();
		            $('#ImportPort').hide();
		            $('#lblDate').text(json.ExportDate);
		            $('#ExportDate').show();
		            $('#ImportDate').hide();
		            $('#lblHeaderUnitNo').text("(" + json.ProduceSaleNo + ")");
		            $('#lblHeaderUnit').text(json.ProduceSale);
		            $('#ProduceSale').show();
		            $('#ConsumeUsed').hide();
		            $('#lblCountryNo').text("(" + json.DestinationCountryNo + ")");
		            $('#lblCountry').text(json.DestinationCountry);
		            $('#DestinationCountry').show();
		            $('#OriginCountry').hide();
		            $('#lblLocationPortNo').text("(" + json.DestinationPortNo + ")");
		            $('#lblLocationPort').text(json.DestinationPort);
		            $('#DestinationPort').show();
		            $('#LoadingPort').hide();
		            $('#lblPlaceNo').text("(" + json.OriginalPlaceNo + ")");
		            $('#lblPlace').text(json.OriginalPlace);
		            $('#OriginalPlace').show();
		            $('#Destination').hide();
		        }

		        $('#lblRecordNo').text(json.RecordNo);
		        $('#lblApplicationDate').text(json.ApplicationDate);
		        $('#lblTransportationNo').text(json.TransportationNo);
		        $('#lblTransportation').text(json.Transportation);
		        $('#lblBillLadingNo').text(json.BillLadingNo);
		        $('#lblDeclareCompanyNo').text("(" + json.DeclareCompanyNo + ")");
		        $('#lblDeclareCompany').text(json.DeclareCompany);
		        $('#lblTradeModeNo').text("(" + json.TradeModeNo + ")");
		        $('#lblTradeMode').text(json.TradeMode);
		        $('#lblTaxKindNo').text("(" + json.TaxKindNo + ")");
		        $('#lblTaxKind').text(json.TaxKind);
		        $('#lblLicenseNo').text(json.LicenseNo);
		        $('#lblTradingCountryNo').text("(" + json.TradingCountryNo + ")");
		        $('#lblTradingCountry').text(json.TradingCountry);
		        $('#lblTradeTerms').text(json.TradeTerms);
		        $('#lblFreight').text(json.Freight);
		        $('#lblInsurance').text(json.Insurance);
		        $('#lblAdditionalExpenses').text(json.AdditionalExpenses);
		        $('#lblContractNo').text(json.ContractNo);
		        $('#lblPackages').text(json.Packages);
		        $('#lblPackageType').text(json.PackageType);
		        $('#lblGrossWeight').text(json.GrossWeight);
		        $('#lblNetWeight').text(json.NetWeight);
		        $('#lblContainerNo').text(json.ContainerNo);
		        $('#lblAttachedDocuments').text(json.AttachedDocuments);
		        $('#lblRemarks').text(json.Remarks);

		        //ResultData區域顯示
		        $("#ResultData").show();

		        reloadGrid(
                    JSON.stringify(
                    {
                        "groupOp": "AND",
                        "rules":
                            [
                                { "field": "DeclarationNo", "op": "eq", "data": $("#txtDeclarationNo").val() },
                                { "field": "CreateUser", "op": "eq", "data": $("#txtCreateUser").val() }                                
                            ]
                    }), jqGridIDMaterial, "pagerMaterial"
                );

		        //ResultData區域顯示
		        $("#ResultDataMaterial").show();

		        convertChineseLang();

		        CloseBlockUI();
		    }
		});
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
				AlertResultMsg("formHandler", json, "/Customs/DeclarationMaterial?TradeKind=" + $("#hidTradeKind").val() + "&DeclarationNo=" + $('#txtDeclarationNoHandler').val());
			}
		});
	});

	$("#btnDelete").click(function () {
		bootbox.confirm({
			message: "<br />請問是否刪除此筆資料？<br />",
			callback: function (result) {
				if (result) {
					ShowBlockUI();
					$("#CRUD").val("delete");

					$.ajax({
					    url: "/Customs/DeclarationMaterialHandler",
						type: 'post',
						dataType: 'json',
						data: $("#formHandler").serialize(),
						success: function (json) {
						    CloseBlockUI();
						    AlertResultMsg("formHandler", json, "/Customs/DeclarationMaterial?TradeKind=" + $("#hidTradeKind").val() + "&DeclarationNo=" + $('#txtDeclarationNoHandler').val());
						}
					});
				}
			}
		})
	});

	$("#jqUpdate").click(function () {
		if (!$(this).hasClass("disabled")) {
		    var rowID = $("#" + jqGridIDMaterial).jqGrid('getGridParam', 'selrow');
		    var rowObject = $("#" + jqGridIDMaterial).jqGrid('getRowData', rowID);
			GoHandler(rowObject['ItemNo'], rowObject['DeclarationNo']);
		}
	});

	$("#jqInsert").click(function () {
		GoHandler();
	});

	$("#jqDelete").click(function () {
	    if (!$(this).hasClass("disabled")) {

	        bootbox.confirm({
	            message: "<br />請問是否刪除此筆資料？<br />",
	            callback: function (result) {
	                if (result) {
	                    ShowBlockUI();
	                    $("#CRUD").val("delete");

	                    var rowID = $("#" + jqGridIDMaterial).jqGrid('getGridParam', 'selrow');
	                    var rowObject = $("#" + jqGridIDMaterial).jqGrid('getRowData', rowID);
	                    $("#txtDeclarationNoHandler").val(rowObject['DeclarationNo']);
	                    $("#txtItemNo").val(rowObject['ItemNo']);

	                    $("#formHandler").submit();
	                }
	            }
	        })
	    }
	});
})

function GoHandler(ItemNo, DeclarationNo) {
    if (ItemNo != undefined && DeclarationNo != undefined) {
		ShowBlockUI();

		$.ajax({
		    url: "/Customs/DeclarationMaterial",
			type: 'get',
			dataType: 'json',
			data: "DeclarationNo=" + DeclarationNo + "&ItemNo=" + ItemNo,
			success: function (json) {
				$("#HandleStatus").text(langUpdateData);
				$("#btnDelete").show();

				$('#txtDeclarationNoHandler').val(json.DeclarationNo);
				$('#txtItemNo').val(json.ItemNo);
				$('#txtHSCode').val(json.HSCode);
				$('#txtMATNR').val(json.MATNR);
				$('#txtCommodity').val(json.Commodity);
				$('#txtSpecification').val(json.Specification);
				$('#txtQuantity1').val(json.Quantity1);
				$('#txtUnit1').val(json.Unit1);
				$('#txtQuantity2').val(json.Quantity2);
				$('#txtUnit2').val(json.Unit2);
				$('#txtQuantity3').val(json.Quantity3);
				$('#txtUnit3').val(json.Unit3);
				$('#txtOriginID').val(json.OriginID);
				$('#txtOrigin').val(json.Origin);
				$('#txtDestinationID').val(json.DestinationID);
				$('#txtDestination').val(json.Destination);
				$('#txtUnitPrice').val(json.UnitPrice);
				$('#txtTotalAmount').val(json.TotalAmount);
				$('#txtCurrencyID').val(json.CurrencyID);
				$('#txtCurrency').val(json.Currency);
				$('#txtTaxation').val(json.Taxation);


				convertChineseLang();

				$('#txtItemNo').attr("readonly", true);

				$("#CRUD").val("update");
				$("#tabHandle").click();

				CloseBlockUI();
			}
		});
	}
	else {
		$("#HandleStatus").text(langInsertData);
		$("#CRUD").val("create");
		document.getElementById("formHandler").reset();
		$('#txtDeclarationNoHandler').val($('#lblDeclarationNo').text());
		$('#txtItemNo').attr("readonly", false);
		if ($("#hidTradeKind").val() == "Import") {
		    $("#ExportTrade").hide();
		    $("#ImportTrade").show();
		}
		else {
		    $("#ImportTrade").hide();
		    $("#ExportTrade").show();
		}

		$("#NoDataFound").hide();
		$("#btnDelete").hide();
		$("#tabHandle").click();
	}
}