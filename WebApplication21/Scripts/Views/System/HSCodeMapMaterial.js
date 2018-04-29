$(function () {
    $("#btnDelete").hide();

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
                        //{ "field": "BUKRS", "op": "eq", "data": $("#ddlBUKRS").val() },
                        { "field": "HSCode", "op": "cn", "data": $("#txtHSCode").val() },
                        { "field": "MATNR", "op": "cn", "data": $("#txtMATNR").val() }
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
                AlertResultMsg("formHandler", json,
                    "/System/HSCodeMapMaterial?HSCode=" + $("#txtHSCodeHandler").val() + 
                    "&Material=" + $("#txtMATNRHandler").val());
            }
        });
    });

    $("#btnInsert").click(function () {
        GoHandler();
    });

    $("#btnDelete").click(function () {
        bootbox.confirm({
            message: "請問是否刪除此筆資料？",
            callback: function (result) {
                if (result) {
                    ShowBlockUI();
                    $("#CRUD").val("delete");

                    $.ajax({
                        url: "/System/HSCodeMapMaterialHandler",
                        type: 'post',
                        dataType: 'json',
                        data: $("#formHandler").serialize(),
                        success: function (json) {
                            CloseBlockUI();
                            AlertResultMsg("formHandler", json, "/System/HSCodeMapMaterial");
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
            GoHandler(rowObject['BUKRS'], rowObject['HSCode'], rowObject['MATNR'], rowObject['YN']);
        }
    });

    $("#jqDelete").click(function () {
        if (!$(this).hasClass("disabled")) {

            bootbox.confirm({
                message: "請問是否刪除此筆資料？",
                callback: function (result) {
                    if (result) {
                        ShowBlockUI();

                        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
                        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
                        var YN = "Y";
                        if (rowObject['YN'] == yes) YN = "Y"; else YN = N;
                        $("#CRUD").val("delete");
                        $("#ddlBUKRSHandler").val(rowObject['BUKRS']);
                        $("#txtHSCodeHandler").val(rowObject['HSCode']);
                        $("#txtMATNRHandler").val(rowObject['MATNR']);
                        $("#hidOriginalYN").val(YN);

                        $.ajax({
                            url: "/System/HSCodeMapMaterialHandler",
                            type: 'post',
                            dataType: 'json',
                            data: $("#formHandler").serialize(),
                            success: function (json) {
                                document.getElementById("formHandler").reset();
                                CloseBlockUI();
                                AlertResultMsg("formHandler", json, "/System/HSCodeMapMaterial");
                            }
                        });
                    }
                }
            })
        }
    });

    var vHSCode = decodeURI(QueryString("HSCode"));
    var vMaterial = decodeURI(QueryString("Material"));
    if (vHSCode != undefined && vHSCode.length > 0) {
        $("#txtHSCode").val(vHSCode);
    }
    if (vMaterial != undefined && vMaterial.length > 0) {
        $("#txtMATNR").val(vMaterial);
    }
    if (vHSCode.length > 0 || vMaterial.length > 0) {
        $("#btnSubmit").click();
    }
})

function GoHandler(BUKRS, HSCode, MATNR, YN) {
    if (BUKRS != undefined && HSCode != undefined && MATNR != undefined && YN != undefined) {
        var paramYN = "Y";
        if (YN != yes) paramYN = "N";

        $.ajax({
            url: "/System/HSCodeMapMaterial",
            type: 'get',
            dataType: 'json',
            data: "BUKRS=" + BUKRS + "&HSCode=" + HSCode + "&MATNR=" + MATNR + "&YN=" + paramYN,
            success: function (json) {
                $("#HandleStatus").text(langUpdateData);
                $("#ddlBUKRSHandler").attr("readonly", "readonly");
                $("#txtHSCodeHandler").attr("readonly", "readonly");
                $("#formHandler :reset").hide();
                $("#btnDelete").show();

                $("#ddlBUKRSHandler").val(json.BUKRS);
                $("#txtHSCodeHandler").val(json.HSCode);
                $("#txtMATNRHandler").val(json.MATNR);
                $("#cbYNHandler").prop('checked', json.YN == "Y");
                $("#cbOriginMATNRHandler").prop('checked', json.OriginMATNR == "Y");

                $("#txtBeginDate").val(json.BeginDate);
                $("#txtTariff").val(json.Tariff);
                $("#txtOriginTariff").val(json.OriginTariff);
                $("#txtSpecialTariff").val(json.SpecialTariff);
                $("#txtVAT").val(json.VAT);
                $("#txtConsumptionTax").val(json.ConsumptionTax);                
                $("#hidOriginalYN").val(json.YN);

                $("#txtOtherTax").val(json.OtherTax);
                $("#txtExportTaxRebate").val(json.ExportTaxRebate);
                $("#txtMEINS1").val(json.MEINS1);
                $("#txtMEINS2").val(json.MEINS2);
                $("#txtHSProductName").val(json.HSProductName);
                $("#txtHSBrands").val(json.HSBrands);
                $("#txtHSModel").val(json.HSModel);
                $("#txtHSOrigin").val(json.HSOrigin);
                $("#txtHSColor").val(json.HSColor);
                $("#txtHSShape").val(json.HSShape);
                $("#txtHSIngredients").val(json.HSIngredients);
                $("#txtHSIndividual").val(json.HSIndividual);
                $("#txtHSType").val(json.HSType);
                $("#txtHSLevel").val(json.HSLevel);
                $("#txtHSChange").val(json.HSChange);
                $("#txtHSSaturation").val(json.HSSaturation);
                convertChineseLang();

                $("#tabHandle").click();
                $("#CRUD").val("update");
                CloseBlockUI();
            }
        });
    }
    else {
        $("#HandleStatus").text(langInsertData);
        $("#txtHSCodeHandler").removeAttr("readonly");
        $("#ddlBUKRSHandler").removeAttr("readonly");
        $("#CRUD").val("create");
        document.getElementById("formHandler").reset();
        $("#formHandler :reset").show();
        $("#btnDelete").hide();

        if ($("#" + jqGridID).jqGrid('getGridParam', 'records') == 0) {
            $("#txtHSCodeHandler").val($("#txtHSCode").val());
            $("#txtMATNRHandler").val($("#txtMATNR").val());
        }
        $("#tabHandle").click();
    }
}