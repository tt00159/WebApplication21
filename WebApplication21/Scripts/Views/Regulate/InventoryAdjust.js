$(function () {

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
                        { "field": "WERKS", "op": "eq", "data": BUKRS.replace("00", "") + $("#ddlFactory").val() },
                        { "field": "ZWAREHS", "op": "eq", "data": $("#ddlZWAREHS").val() },
                        { "field": "RegulateType", "op": "eq", "data": RegulateType }
                    ]
            })
        );
    });

    $("#ddlFactory").change(function () {
        ShowBlockUI();
        GetZWAREHS();
    });

    $("#jqDelete").click(function () {
        if (!$(this).hasClass("disabled")) {

            bootbox.confirm({
                message: "請問是否刪除此筆資料？",
                callback: function (result) {
                    if (result) {

                        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
                        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
                        $("#CRUD").val("delete");
                        $("#hidBUKRS").val(BUKRS);
                        $("#hidSystemNo").val(rowObject['SystemNo']);
                        $("#hidZWAREHS").val(rowObject['ZWAREHS']);
                        $("#hidWERKS").val(rowObject['WERKS']); 
                        $("#hidMATNR").val(rowObject['MATNR']);
                        $("#hidCustomsImportNo").val(rowObject['CustomsImportNo']);
                        $("#hidPeriodID").val(rowObject['PeriodID']);
                        $("#hidRegulateType").val(RegulateType);

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
                AlertResultMsg("formHandler", json, "/Regulate/InventoryAdjust?RegulateType=AdjustInventory");
            }
        });
    });

    setTimeout(function () {
        GetZWAREHS();
    }, 0);
})


function GetZWAREHS(val) {
    $.ajax({
        url: "/Data/ZTWAREHS",
        type: 'post',
        dataType: 'json',
        data: "BUKRS=" + BUKRS + "&WERKS=" + BUKRS.replace("00", "") + $("#ddlFactory").val() + "&VKORG=" + VKORG,
        success: function (json) {
            $("#ddlZWAREHS option").remove();
            $("#ddlZWAREHS").append("<option value=''></option>");
            $(json).each(function () {
                if (val != undefined && val == this.ZWAREHS)
                    $("#ddlZWAREHS").append("<option selected value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
                else
                    $("#ddlZWAREHS").append("<option value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
            });
            CloseBlockUI();
        },
        error: function () {
            $("#ddlZWAREHS option").remove();
            $("#ddlZWAREHS").append("<option value=''></option>");
            alert("取得倉庫資料失敗！");
            CloseBlockUI();
        }
    });

}