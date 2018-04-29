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
                        { "field": "Currency", "op": "cn", "data": $("#ddlCurrency").val() }
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

        $("#txtBeginDate").removeAttr('disabled');
        $("#ddlBUKRSHandler").removeAttr("disabled");
        $("#ddlCurrencyHandler").removeAttr("disabled");

        //do your own request an handle the results
        $.ajax({
            url: actionurl,
            type: 'post',
            dataType: 'json',
            data: $(this).serialize(),
            success: function (json) {
                CloseBlockUI();
                AlertResultMsg("formHandler", json, "/System/CustomsRate");
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
                    $("#txtBeginDate").removeAttr('disabled');
                    $("#ddlBUKRSHandler").removeAttr("disabled");
                    $("#ddlCurrencyHandler").removeAttr("disabled");

                    $.ajax({
                        url: "/System/CustomsRateHandler",
                        type: 'post',
                        dataType: 'json',
                        data: $("#formHandler").serialize(),
                        success: function (json) {
                            CloseBlockUI();
                            AlertResultMsg("formHandler", json, "/System/CustomsRate");
                        }
                    });
                }
            }
        })
    });

    $("#jqUpdate").click(function(){
        if (!$(this).hasClass("disabled")) {
            var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
            var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            GoHandler(rowObject['BUKRS'], rowObject['Currency'], rowObject['BeginDate']);
        }
    })

    $("#jqDelete").click(function () {
        if (!$(this).hasClass("disabled")) {

            bootbox.confirm({
                message: "請問是否刪除此筆資料？",
                callback: function (result) {
                    if (result) {
                        ShowBlockUI();

                        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
                        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
                        $("#CRUD").val("delete");
                        $("#txtBeginDate").removeAttr('disabled');
                        $("#ddlBUKRSHandler").removeAttr("disabled");
                        $("#ddlCurrencyHandler").removeAttr("disabled");

                        $("#ddlBUKRSHandler").val(rowObject['BUKRS']);
                        $("#ddlCurrencyHandler").val(rowObject['Currency']);
                        $("#txtBeginDate").val(rowObject['BeginDate']);

                        $.ajax({
                            url: "/System/CustomsRateHandler",
                            type: 'post',
                            dataType: 'json',
                            data: $("#formHandler").serialize(),
                            success: function (json) {
                                document.getElementById("formHandler").reset();
                                CloseBlockUI();
                                AlertResultMsg("formHandler", json, "/System/CustomsRate");
                            }
                        });
                    }
                }
            })
        }
    })
})

function GoHandler(BUKRS, Currency, BeginDate) {
    if (BUKRS != undefined && Currency != undefined && BeginDate != undefined) {
        CloseBlockUI();

        $.ajax({
            url: "/System/CustomsRate",
            type: 'get',
            dataType: 'json',
            data: "BUKRS=" + BUKRS + "&Currency=" + Currency + "&BeginDate=" + BeginDate,
            success: function (json) {
                $("#HandleStatus").text(langUpdateData);
                $("#ddlCurrencyHandler").attr("disabled", true);
                $("#ddlBUKRSHandler").attr("disabled", true);
                $("#txtBeginDate").attr("disabled", true);
                $("#formHandler :reset").hide();
                $("#btnDelete").show();

                $("#ddlBUKRSHandler").val(json.BUKRS);
                $("#ddlCurrencyHandler").val(json.Currency);
                $("#txtBeginDate").val(json.BeginDate);
                $("#txtRate").val(json.Rate);

                convertChineseLang();

                $("#tabHandle").click();
                $("#CRUD").val("update");
            }
        });
    }
    else {
        $("#HandleStatus").text(langInsertData);
        $("#ddlBUKRSHandler").removeAttr("disabled");
        $("#ddlCurrencyHandler").removeAttr("disabled");
        $("#txtBeginDate").removeAttr('disabled');
        $("#CRUD").val("create");
        document.getElementById("formHandler").reset();
        $("#formHandler :reset").show();
        $("#btnDelete").hide();
        $("#tabHandle").click();
    }
}