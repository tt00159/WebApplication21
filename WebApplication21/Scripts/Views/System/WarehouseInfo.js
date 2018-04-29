$(function () {

    $("#tabHandle").click(function () {
        return $("#CRUD").val() != "";
    });

    $.ajax({
        url: "/System/DataSetting",
        type: 'get',
        dataType: 'json',
        data: "BUKRS=" + $("#ddlBUKRS").val() + "&parentKeyID=CustomsArea",
        success: function (json) {
            $("#ddlCustomsArea option").remove();
            $("#ddlCustomsArea").append("<option value=''></option>");
            $(json).each(function () {
                $("#ddlCustomsArea").append("<option value='" + this.KeyID + "'>" + this.Value + "</option>");
            });
        }
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
                        { "field": "WERKS", "op": "eq", "data": $("#ddlBUKRS").val().replace("00", "") + $("#ddlFactory").val() },
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
                AlertResultMsg("formHandler", json, "/System/WarehouseInfo");
            }
        });
    });

    $("#jqUpdate").click(function(){
        if (!$(this).hasClass("disabled")) {
            var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
            var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            GoHandler(rowObject['WERKS'], rowObject['ZWAREHS']);
        }
    })
})

function GoHandler(WERKS, ZWAREHS) {
    if (WERKS != undefined && ZWAREHS != undefined) {
        CloseBlockUI();

        $.ajax({
            url: "/System/WarehouseInfo",
            type: 'get',
            dataType: 'json',
            data: "WERKS=" + WERKS + "&ZWAREHS=" + encodeURIComponent(ZWAREHS),
            success: function (json) {
                $("#ddlBUKRSHandler").attr("readonly", "readonly");
                $("#formHandler :reset").hide();

                if (json.BUKRS) {
                    $("#ddlBUKRSHandler").val(json.BUKRS);
                    $("#CRUD").val("update");
                }
                else {
                    $("#CRUD").val("create");
                }
                if (json.CustomsArea) {
                    $("#ddlCustomsArea").val(json.CustomsArea);
                }
                if (json.WERKS.indexOf("20") >= 0) {
                    $("#BondedWarehouse").show();
                }
                else {
                    $("#BondedWarehouse").hide();
                }
                $("#hidWERKS").val(json.WERKS);
                $("#lblWERKS").text(json.WERKS);
                $("#hidZWAREHS").val(json.ZWAREHS);
                $("#txtZWAREHS").val(json.ZWAREHS_TXT);
                //$("#lblZWAREHS").text(json.ZWAREHS_TXT);
                $("#cbYNHandler").prop('checked', json.YN == "Y");
                $("#cbIsVirtural").prop('checked', json.IsVirtural);
                $("#txtCustomsStockID").val(json.CustomsStockID);

                convertChineseLang();

                $("#tabHandle").click();
            }
        });
    }
    else {
        $("#ddlBUKRSHandler").removeAttr("disabled");
        $("#CRUD").val("create");
        document.getElementById("formHandler").reset();
        $("#formHandler :reset").show();
    }
}