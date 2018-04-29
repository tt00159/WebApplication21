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
        if (BUKRS == "3Y00") {            
            $("#" + jqGridIDMaterial).jqGrid('hideCol', ["PackingQty"]);
            $("#" + jqGridIDMaterial).jqGrid('hideCol', ["PackingUnit"]);
            $("#" + jqGridIDMaterial).jqGrid('hideCol', ["PackingItem"]);    //包裝項次
            $("#" + jqGridIDMaterial).jqGrid('hideCol', ["PackingCaption"]); //包裝說明  
            $("#" + jqGridIDMaterial).jqGrid('hideCol', ["NetWeight"]);      //淨重
            $("#" + jqGridIDMaterial).jqGrid('hideCol', ["GrossWeight"]);    //毛重
        }

        $("#CRUD").val("");

        setTimeout(function () {

            $("#" + jqGridID).jqGrid(
                "setGridParam",
                {
                    url: "/Customs/ImportDaily",
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


    $("#btnQueryTKONN_EX").click(function (e) {
        if (!$("#formInsert").valid()) {
            AlertErrorMsg("formInsert");
            return false;
        }
        ShowBlockUI();

        if (BUKRS == "3Y00") {
            $("#" + jqGridIDWBGT).jqGrid('hideCol', ["InvoiceQty"]);  //怡康不顯示Invoice數量
            $("#" + jqGridIDWBGT).jqGrid('hideCol', ["InvoiceUnit"]);  //怡康不顯示Invoice單位            
            $("#" + jqGridIDWBGT).jqGrid('hideCol', ["ContractQty"]);  
            $("#" + jqGridIDWBGT).jqGrid('hideCol', ["ContractUnit"]);  
            $("#" + jqGridIDWBGT).jqGrid('hideCol', ["PackingQty"]);  
            $("#" + jqGridIDWBGT).jqGrid('hideCol', ["PackingUnit"]);  
            $("#" + jqGridIDWBGT).jqGrid('hideCol', ["PackingItem"]);    //包裝項次
            $("#" + jqGridIDWBGT).jqGrid('hideCol', ["PackingCaption"]); //包裝說明  
            $("#" + jqGridIDWBGT).jqGrid('hideCol', ["NetWeight"]);      //淨重
            $("#" + jqGridIDWBGT).jqGrid('hideCol', ["GrossWeight"]);    //毛重
        }

        //ResultData區域顯示
        $("#ResultDataWBGT").show();
        $("#hidTKONN_EX").val($("#txtTKONN_EX").val());
        
        //新增修改
        $.ajax({
            url: "/Data/CheckImportSAPNo",
            type: "POST",
            dataType: 'json',
            data: "TKONN_EX=" + $("#txtTKONN_EX").val(),
            success: function (json) {
                if (json.ResultMessage != "") {
                    CloseBlockUI();
                    bootbox.confirm({
                        message: "進貨YK碼已於其他報關單" + json.ResultMessage + "綁定,不應再綁定!" + "<br/><p>請問是否仍要綁定物料？</p>",
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

        //新增搬出
        function GoSAPNo() {
            setTimeout(function () {

                $("#" + jqGridIDWBGT).jqGrid(
                    "setGridParam",
                    {
                        url: "/RFC/GetMaterialList",
                        datatype: "json",
                        mtype: "GET",
                        postData: { "SystemNo": $("#txtSystemNo").val(), "TKONN_EX": $("#txtTKONN_EX").val(), "WERKS": $("#hidWERKS").val(), "isForGrid": true }
                    }
                ).trigger("reloadGrid");

            }, 500);
        }

    });


    $("#btnQueryMATNR").click(function (e) {
        if (!$("#formInsertMATNR").valid()) {
            AlertErrorMsg("formInsertMATNR");
            return false;
        }
        ShowBlockUI();

        //ResultData區域顯示
        $("#ResultDataWBGT").show();

        setTimeout(function () {

            $("#" + jqGridIDWBGT).jqGrid(
                "setGridParam",
                {
                    url: "/Data/GetReturnMaterial",
                    datatype: "json",
                    mtype: "GET",
                    postData: {
                        "VBELN": $("#hidVBELN").val(),
                        "isForGrid": true
                    }
                }
            ).trigger("reloadGrid");

        }, 500);

    });


    $("#btnQuerySAPExport").click(function (e) {
        if (!$("#formSAPExport").valid()) {
            AlertErrorMsg("formSAPExport");
            return false;
        }
        ShowBlockUI();

        $("#ResultDataSAPExport").show();
        $("#ResultDataWBGT").hide();

        setTimeout(function () {

            $("#" + jqGridIDSAPExport).jqGrid(
                "setGridParam",
                {
                    url: "/RFC/GetOB_Header",
                    datatype: "json",
                    mtype: "GET",
                    postData: {
                        "VKORG": VKORG,
                        "WERKS": $("#hidWERKS").val(),
                        "KUNNR": $("#hidKUNNR").val(),
                        "VBELN": $("#txtVBELN").val(),
                        "IsReturn": "X",
                        "isForGrid": true
                    }
                }
            ).trigger("reloadGrid");

        }, 500);

    });

    var vSystemNo = decodeURI(QueryString("SystemNo"));
    if (vSystemNo != undefined && vSystemNo.length > 0) {
        $("#txtSystemNo").val(vSystemNo);
        var menu = window.parent.document.getElementById("CustomsImportMaterial");
        $(menu).attr("url", "/Customs/ImportMaterial");
        $("#btnSubmitQuery").click();
    }

    $("#jqUpdateMaterial").click(function () {
        if (!$(this).hasClass("disabled")) {
            var rowID = $("#" + jqGridIDMaterial).jqGrid('getGridParam', 'selrow');
            var rowObject = $("#" + jqGridIDMaterial).jqGrid('getRowData', rowID);
            GoHandler(rowObject['BUKRS'], rowObject['SystemNo'], rowObject['TKONN_EX'], rowObject['MATNR'], rowObject['NETPR']);
        }
    });

    $("#jqInsertHandle").click(function () {
        if (!$(this).hasClass("disabled")) {
            $("#CRUD").val("create");
            $("#hidSystemNo").val($("#txtSystemNo").val());
            $("#tabInsert").click();
        }
    });

    $("#jqInsertMaterial").click(function () {
        if (!$(this).hasClass("disabled")) {
            var selarrrow = $("#" + jqGridIDWBGT).jqGrid('getGridParam', 'selarrrow');
            var IDs = selarrrow.toString().split(',');
            var items = [];
            var errorMsg = "";
            var confirmMsg = "";            
            for (var i = 0; i < IDs.length; i++) {
                var rowid = IDs[i];
                var aRow = $("#" + jqGridIDWBGT).jqGrid('getRowData', rowid);
                var whuitinfo = CheckWHUIT(BUKRS, aRow["MATNR"], $("#txtWHUIT_" + rowid).val());  //倉庫單位取值

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
                //倉庫單位檢核:檢核是否有同物料不同倉庫單位
                if (whuitinfo != "OK") {
                    confirmMsg += "<p>第 " + rowid + whuitinfo+"</p>";
                }

           
                //if (aRow["TXZ01"].indexOf("NG") != -1) {
                if (aRow["TXZ01"].substring(0, 2) == "NG") {
	                errorMsg += "<p>第 " +rowid + " 筆物料非產地証物料,與表頭資料 [產地証] 不一致！</p>";
	                }
                
                if (errorMsg.length == 0) {
                    var item = {
                        SystemNo: $("#hidSystemNo").val(),
                        BUKRS: BUKRS,
                        TKONN_EX: aRow["TKONN_EX"],
                        MATNR: aRow["MATNR"],
                        HSCode: aRow["HSCode"],
                        MENGE: $("#txtMENGE_" + rowid).val(),
                        MEINS: $("#txtMEINS_" + rowid).val(),
                        WHCNT: $("#txtWHCNT_" + rowid).val(),
                        WHUIT: $("#txtWHUIT_" + rowid).val(),
                        LSMNG: $("#txtLSMNG_" + rowid).val(),
                        LSMEH: $("#txtLSMEH_" + rowid).val(),
                        InvoiceQty: $("#txtInvoiceQty_" +rowid).val(),
                        InvoiceUnit: $("#txtInvoiceUnit_" + rowid).val(),
                        ContractQty: $("#txtContractQty_" +rowid).val(),
                        ContractUnit: $("#txtContractUnit_" +rowid).val(),
                        PackingQty: $("#txtPackingQty_" + rowid).val(),
                        PackingUnit: $("#txtPackingUnit_" + rowid).val(),
                        PackingItem: $("#txtPackingItem_" +rowid).val(),
                        PackingCaption: $("#txtPackingCaption_" +rowid).val(),
                        NetWeight: $("#txtNetWeight_" + rowid).val(),
                        GrossWeight: $("#txtGrossWeight_" +rowid).val(),
                        WAERS: aRow["WAERS"],
                        NETPR: aRow["NETPR"],
                        WKURS: aRow["WKURS"],
                        Tariff: aRow["Tariff"],
                        SpecialTariff: aRow["SpecialTariff"],
                        VAT: aRow["VAT"],
                        ConsumptionTax: aRow["ConsumptionTax"],
                        OtherTax: aRow["OtherTax"],
                        ExportTaxRebate: aRow["ExportTaxRebate"],
                        Rate: $("#lblRate_" + rowid).text(),
                        EBELN: aRow["EBELN"],
                        EBELNMax: aRow["EBELNMax"],
                        EBELP: aRow["EBELP"]
                    };
                    items.push(item);
                }
            }
            //alert("CRUD=" + $("#CRUD").val() + "&JSON=" + JSON.stringify(items));
            if (errorMsg.length > 0) {
                AlertErrorMsg("formInsert", errorMsg);
                return false;
            }
            if (confirmMsg.length > 0) {
                bootbox.confirm({
                    message: confirmMsg + "<br/><p>請問是否仍要新增資料？</p>",
                    callback: function (result) {
                        if (result) {
                            ShowBlockUI();
                            $.ajax({
                                url: "/Customs/ImportMaterialHandler",
                                type: 'post',
                                //dataType: 'json',
                                data: "CRUD=" + $("#CRUD").val() + "&VBELN=" + $("#hidVBELN").val() + "&JSON=" + JSON.stringify(items),
                                success: function (json) {
                                    //$("#ddlDeptIDHandler").attr('disabled', 'disabled');
                                    CloseBlockUI();
                                    AlertResultMsg("formHandler", json, "/Customs/ImportMaterial?SystemNo=" + $("#hidSystemNo").val());
                                }
                            });
                        }
                    }
                })
            }
            else {
                ShowBlockUI();
                $.ajax({
                    url: "/Customs/ImportMaterialHandler",
                    type: 'post',
                    //dataType: 'json',
                    data: "CRUD=" + $("#CRUD").val() + "&VBELN=" + $("#hidVBELN").val() + "&JSON=" + JSON.stringify(items),
                    success: function (json) {
                        //$("#ddlDeptIDHandler").attr('disabled', 'disabled');
                        CloseBlockUI();
                        AlertResultMsg("formHandler", json, "/Customs/ImportMaterial?SystemNo=" + $("#hidSystemNo").val());
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
                        $("#hidTKONN_EX").val(rowObject['TKONN_EX']);
                        $("#hidMATNR").val(rowObject['MATNR']);

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
                                AlertResultMsg("formHandler", json, "/Customs/ImportMaterial?SystemNo=" + $("#hidSystemNo").val());
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
                    AlertResultMsg("formHandler", json, "/Customs/ImportMaterial?SystemNo=" + $("#hidSystemNo").val());
                }
            });
        }
    });

    $("#btnDelete").click(function () {
        ShowBlockUI();
        $("#CRUD").val("delete");

        $("#formHandler").submit();
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
})


/**
*倉庫單位檢核
*/
function CheckWHUIT(BUKRS, MATNR, WHUIT) {
    var whuitinfo = "";
    $.ajax({
        url: "/Data/GetWHUITImportMaterial",
        type: 'get',
        dataType: 'json',
        async: false,
        data: "BUKRS=" + BUKRS + "&MATNR=" + MATNR + "&WHUIT=" + WHUIT,
        success: function (json) {
            for (var i = 0; i < json.length; i++) {
                whuitinfo = whuitinfo + json[i].WHUIT + " ,";
            }
            var iLen = whuitinfo.length;
            whuitinfo = whuitinfo.substring(0, iLen - 1);
        }
    });
    if (whuitinfo == "") {
        whuitinfo = "OK";
    }
    else
    {
        whuitinfo = " 筆倉庫單位為：[ "+WHUIT +" ]，但系統已存在：[" + whuitinfo + "] 單位";
    }

    return whuitinfo;
}

function SetClientData(KUNNR, NAME) {
    $("#txtKUNNR").val(NAME);
    $("#hidKUNNR").val(KUNNR);

    $("#ResultDataKUNNR").hide();
}

function GoHandler(BUKRS, SystemNo, TKONN_EX, MATNR, NETPR) {    
    if (BUKRS != undefined && SystemNo != undefined &&
        TKONN_EX != undefined && MATNR != undefined && NETPR != undefined) {
        CloseBlockUI();

        $.ajax({
            url: "/Customs/ImportMaterial",
            type: 'get',
            dataType: 'json',
            data: "BUKRS=" + BUKRS + "&SystemNo=" + SystemNo + "&TKONN_EX=" + TKONN_EX + "&MATNR=" + MATNR + "&NETPR=" + NETPR,
            success: function (json) {

                $("#lblSystemNo").text(json.SystemNo);
                $("#hidSystemNo").val(json.SystemNo);
                $("#lblTKONN_EX").text(json.TKONN_EX);
                $("#hidTKONN_EX").val(json.TKONN_EX);
                $("#lblMATNR").text(json.MATNR);
                $("#hidMATNR").val(json.MATNR);
                $("#lblMATNR_TXT").text(json.MATNR_TXT);
                $("#txtMENGE").val(parseFloat(json.MENGE).toFixed(5));
                $("#txtMEINS").val(json.MEINS);
                $("#txtWHCNT").val(parseFloat(json.WHCNT).toFixed(5));
                $("#txtWHUIT").val(json.WHUIT);
                $("#txtLSMNG").val(parseFloat(json.LSMNG).toFixed(5));
                $("#txtLSMEH").val(json.LSMEH);
                $("#lblWAERS").text(json.WAERS);
                $("#lblNETPR").text(json.NETPR);
                $("#hidNETPR").val(json.NETPR);
                $("#lblWKURS").text(json.WKURS);
                $("#lblTariff").text(json.Tariff);
                $("#lblSpecialTariff").text(json.SpecialTariff);
                $("#lblVAT").text(json.VAT);
                $("#lblConsumptionTax").text(json.ConsumptionTax);
                $("#lblRate").text(json.Rate);
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
    for (i = 1; i <= jqGridCounts; i++) {
        var rowObject = $("#" + jqGridIDSAPExport).jqGrid('getRowData', i);
        if (rowObject["VBELN"] != VBELN)
            $("#" + jqGridIDSAPExport).jqGrid('delRowData', i);
    }
    $("#hidVBELN").val(VBELN);
    //$("#txtMATNR").val("auto");
    $("#btnQueryMATNR").click();
}