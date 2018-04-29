$(function () {

    $("#tabHandle").click(function () {
        return $("#CRUD").val() != "";
    });

    $("#form").submit(function (e) {
        $("#CRUD").val("");
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
                        { "field": "PeriodID", "op": "eq", "data": PeriodID },
                        { "field": "RegulateType", "op": "eq", "data": RegulateType },
						//{ "field": "ZWAREHS", "op": "eq", "data": $("#ddlZWAREHS").val() },
						{ "field": "IO", "op": "eq", "data": 'O' }
                    ]
            })
        );
    });

    $("#formHandler :submit").click(function () {
        if ($(this).hasClass("disabled")) return false;
    })

    $("#formHandler").submit(function (e) {
        if (!$("#formHandler").valid()) {
            AlertErrorMsg("formHandler");
            return false;
        }

        //prevent Default functionality
        e.preventDefault();

        //get the action-url of the form
        var actionurl = e.currentTarget.action;

        bootbox.confirm({
            message: "確定要執行此作業？<br />(此作業將自動結案，無法回覆)",
            callback: function (result) {
                if (result) {
                    ShowBlockUI();

                    //do your own request an handle the results
                    $.ajax({
                        url: actionurl,
                        type: 'post',
                        dataType: 'json',
                        data: $("#formHandler").serialize(),
                        success: function (json) {
                            CloseBlockUI();
                            AlertResultMsg("formHandler", json, "/Regulate/PreordainReturn");
                        }
                    });
                }
            }
        });
    });

    $("#jqReturn").click(function(){
        if (!$(this).hasClass("disabled")) {
            ShowBlockUI();
            var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
            var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            GoHandler(rowObject['SystemNo'], rowObject['ZWAREHS'], rowObject['HSCode'],
                rowObject['CustomsImportNo'], rowObject['InMATNR']);
        }
    })
})

function GoHandler(SystemNo, ZWAREHS, HSCode, CustomsImportNo, MATNR) {
    if (SystemNo != undefined && ZWAREHS != undefined && HSCode != undefined &&
        CustomsImportNo != undefined && MATNR != undefined) {

        $("#riSystemNo").val(SystemNo);
        $("#riRegulateType").val(RegulateType);
        $("#riZWAREHS").val(ZWAREHS);
        $("#riWERKS").val(WERKS);

        $("#" + jqGridID_Preordain).jqGrid(
            "setGridParam",
            {
                datatype: "json",
                mtype: "GET",
                postData: {
                    "SystemNo": SystemNo,
                    "IO": "O",
                    "isDetail": true,
                    "isForGrid": true
                }
            }
        ).trigger("reloadGrid");

        $("#" + jqGridID_MaterialAmount).jqGrid(
            "setGridParam",
            {
                url: "/Data/GetExportMaterialAmount",
                datatype: "json",
                mtype: "GET",
                postData: {
                    "BUKRS": BUKRS,
                    "WERKS": WERKS,
                    "ZWAREHS": ZWAREHS,
                    "MATNR": MATNR,
                    "HSCode": HSCode,
                    "isForGrid": true
                }
            }
        ).trigger("reloadGrid");
        
        $("#CRUD").val("return");
        $("#tabHandle").click();
    }
    else {
        $("#ddlBUKRSHandler").removeAttr("disabled");
        $("#CRUD").val("create");
        document.getElementById("formHandler").reset();
    }
}