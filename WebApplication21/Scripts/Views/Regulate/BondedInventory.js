$(function () {
    $("#tabHandle").click(function () {
        return $("#CRUD").val() == "create";
    });

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
                        { "field": "SystemNo", "op": "cn", "data": $("#txtSystemNo").val() },
                        { "field": "PeriodID", "op": "eq", "data": $("#ddlPeriodID").val() },
                        { "field": "RegulateType", "op": "eq", "data": RegulateType },
						{ "field": "ZWAREHS", "op": "eq", "data": $("#ddlZWAREHS").val() },
						//{ "field": "IO", "op": "eq", "data": 'O' },
						{ "field": "MATNR", "op": "eq", "data": $("#txtMATNR").val() },
						{ "field": "InMATNR", "op": "eq", "data": $("#txtInMATNR").val() }
                    ]
            })
        );
    });

    $("#formTransferInventory").submit(function (e) {
        if (!$("#formTransferInventory").valid()) {
            AlertErrorMsg("formTransferInventory");
            return false;
        }
        ShowBlockUI();

        //取得幣別資料
        GetCurrency();

        //prevent Default functionality
        e.preventDefault();

        //ResultData區域顯示
        $("#ResultDataList").show();

        $("#formTransferInventory input[name='RegulateType']").val(RegulateType);
        /// 預留單號 = 合同號碼 (抬頭文本)
        $("#formTransferInventory input[name='TKONN_EX']").val($("#txtRSNUM").val());

        setTimeout(function () {

            $("#" + jqGridIDList).jqGrid(
				"setGridParam",
				{
				    url: "/RFC/GetRESB_Detail",
				    datatype: "json",
				    mtype: "GET",
				    postData: { "RSNUM": $("#txtRSNUM").val(), "RegulateType": RegulateType, "isForGrid": true }
				}
			).trigger("reloadGrid");

        }, 500);
    });

    $("#formChangeInventory").submit(function (e) {
        if (!$("#formChangeInventory").valid()) {
            AlertErrorMsg("formChangeInventory");
            return false;
        }
        ShowBlockUI();

        //prevent Default functionality
        e.preventDefault();

        //get the action-url of the form
        var actionurl = e.currentTarget.action;

        //ResultData區域顯示
        $("#ResultDataList").show();

        $("#formChangeInventory input[name='RegulateType']").val(RegulateType);
        /// 預留單號 = 合同號碼 (抬頭文本)
        $("#formChangeInventory input[name='ZWAREHS_TXT']").val($("#ddlZWAREHSHandler option:selected").text());
        $("#formChangeInventory input[name='WERKS']").val(WERKS);

        $("#hidMATNR").val($("#txtOutMATNR1").val() + "," + $("#txtOutMATNR2").val());

        var Form = $("#formChangeInventory").serializeArray();
        var FormObject = {};
        $.each(Form,
            function (i, v) {
                FormObject[v.name] = v.value;
            }
        );
        //alert(JSON.stringify(FormObject));

        setTimeout(function () {

            $("#" + jqGridIDList).jqGrid(
				"setGridParam",
				{
				    url: actionurl,
				    datatype: "json",
				    mtype: "GET",
				    postData: { "json": JSON.stringify(FormObject), "isForGrid": true }
				}
			).trigger("reloadGrid");

        }, 500);
    });

    $("#btnInsert").click(function () {
        $("#CRUD").val("create");
        GoHandler();
    });

    $("#jqInsertMaterial").click(function () {
        if (!$(this).hasClass("disabled")) {
            var selarrrow = $("#" + jqGridIDList).jqGrid('getGridParam', 'selarrrow');
            var IDs = selarrrow.toString().split(',');
            var items = [];
            var errorMsg = "";
            var confirmMsg = "";
            var inNETPR = 0;
            for (var i = 0; i < IDs.length; i++) {
                var rowid = IDs[i];
                var aRow = $("#" + jqGridIDList).jqGrid('getRowData', rowid);
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
                if (parseFloat($("#txtMENGE_" + rowid).val()) != parseFloat($("#txtLSMNG_" + rowid).val())) {
                    confirmMsg += "<p>第 " + rowid + " 筆物料的法定數量與SAP數量不相同！</p>";
                }
                if (inNETPR == 0) inNETPR = parseFloat($("#txtInNETPR_" + rowid).val());
                else {
                    if (inNETPR != parseFloat($("#txtInNETPR_" + rowid).val()))
                        errorMsg += "<p>移入單價 ( " + $("#txtInNETPR_" + rowid).val() + " ) 不一致！</p>";
                }

                if (errorMsg.length == 0) {
                    var item = {
                        RegulateType: RegulateType,
                        TKONN_EX: $("#form" + RegulateType + " input[name='TKONN_EX']").val(),
                        BUKRS: BUKRS,
                        KUNNR: $("#hidKUNNR").val(),
                        KUNNR_TXT: $("#hidKUNNR_TXT").val(),
                        WERKS: aRow["WERKS"],
                        ZWAREHS: aRow["ZWAREHS"],
                        CustomsImportNo: aRow["CustomsImportNo"],
                        HSCode: aRow["HSCode"],
                        MATNR: aRow["MATNR"],
                        InMATNR: aRow["InMATNR"],
                        WAERS: $("#ddlInWAERS_" + rowid).val(),
                        NETPR: $("#txtInNETPR_" + rowid).val(),
                        MENGE: $("#txtMENGE_" + rowid).val(),
                        MEINS: aRow["MEINS"],
                        WHCNT: $("#txtWHCNT_" + rowid).val(),
                        WHUIT: aRow["WHUIT"],
                        LSMNG: $("#txtLSMNG_" + rowid).val(),
                        LSMEH: aRow["LSMEH"],
                        Remark: $("#txtRemark").val()
                    };
                    items.push(item);
                }
            }
            //alert("CRUD=" + $("#CRUD").val() + "&JSON=" + JSON.stringify(items));
            if (errorMsg.length > 0) {
                AlertErrorMsg("form" + RegulateType, errorMsg);
                return false;
            }
            if (confirmMsg.length > 0) {
                bootbox.confirm({
                    message: confirmMsg + "<br/><p>請問是否仍要新增資料？</p>",
                    callback: function (result) {
                        if (result) {
                            ShowBlockUI();
                            $.ajax({
                                url: "/Regulate/BondedInventoryHandler",
                                type: 'post',
                                //dataType: 'json',
                                data: "CRUD=" + $("#CRUD").val() + "&JSON=" + JSON.stringify(items),
                                success: function (json) {
                                    CloseBlockUI();
                                    AlertResultMsg("form" + RegulateType, json, "/Regulate/BondedInventory?RegulateType=" + RegulateType);
                                }
                            });
                        }
                    }
                })
            }
            else {
                ShowBlockUI();
                $.ajax({
                    url: "/Regulate/BondedInventoryHandler",
                    type: 'post',
                    //dataType: 'json',
                    data: "CRUD=" + $("#CRUD").val() + "&JSON=" + JSON.stringify(items),
                    success: function (json) {
                        //$("#ddlDeptIDHandler").attr('disabled', 'disabled');
                        CloseBlockUI();
                        AlertResultMsg("form" + RegulateType, json, "/Regulate/BondedInventory?RegulateType=" + RegulateType);
                    }
                });
            }
        }
    });

    $("#jqDelete").click(function () {
        if (!$(this).hasClass("disabled")) {
            bootbox.confirm({
                message: "請問是否刪除此筆(" + $("#hidSystemNo").val() + ") 全部資料？",
                callback: function (result) {
                    if (result) {
                        ShowBlockUI();
                        $("#CRUD").val("delete");

                        $.ajax({
                            url: "/Regulate/BondedInventoryHandler",
                            type: 'post',
                            dataType: 'json',
                            data: { "CRUD": "delete", "JSON": JSON.stringify({ "SystemNo": $("#hidSystemNo").val() }) },
                            success: function (json) {
                                CloseBlockUI();
                                AlertResultMsg("form", json, "/Regulate/BondedInventory?RegulateType=" + RegulateType);
                            }
                        });
                    }
                }
            });
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
                }), "tblGridDataKUNNR", "pagerKUNNR", "/Data/GetTarget"
            );
        }

        setTimeout(function () {

            $("#ResultDataKUNNR").show();

        }, 100);
    });

    setTimeout(function () {
        GetZWAREHS(WERKS, "ddlZWAREHS");
        GetZWAREHS(WERKS, "ddlZWAREHSHandler");
    }, 0);

    $("#" + RegulateType).show();
})

function GetZWAREHS(WERKS, ddlID, val) {

    $.ajax({
        url: "/Data/ZTWAREHS",
        type: 'post',
        dataType: 'json',
        data: "BUKRS=" + BUKRS + "&WERKS=" + WERKS + "&VKORG=" + VKORG,
        success: function (json) {
            $("#" + ddlID + " option").remove();
            //$("#" + ddlID).append("<option value=''></option>");
            $(json).each(function () {
                if (val != undefined && val == this.ZWAREHS)
                    $("#" + ddlID).append("<option selected value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
                else
                    $("#" + ddlID).append("<option value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
            });
        },
        error: function () {
            $("#" + ddlID + " option").remove();
            $("#" + ddlID).append("<option value=''></option>");
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


function GoHandler() {
    if ($("#CRUD").val() == "create") {
        //document.getElementById("formHandler").reset();
        $("#tabHandle").click();
    }
}

function SetClientData(KUNNR, NAME) {
    $("#txtKUNNR").val(NAME);
    $("#hidKUNNR").val(KUNNR);
    $("#hidKUNNR_TXT").val(NAME);

    $("#ResultDataKUNNR").hide();
}