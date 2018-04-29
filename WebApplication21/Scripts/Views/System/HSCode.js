$(function () {
    $("#tabHandle").click(function () {
        if ($("#CRUD").val() == "create") {
            $("#AddMaterial").show();
            $("#ModifyTariff").hide();
        }
        else if ($("#CRUD").val() == "update") {
            $("#ModifyTariff").show();
            $("#AddMaterial").hide();
        }
    });

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
                        { "field": "HSCode", "op": "cn", "data": $("#txtHSCode").val() }
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
                AlertResultMsg("formHandler", json, "/System/HSCode?HSCode=" + $("#txtHSCodeHandler").val());
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
                        url: "/System/HSCodeHandler",
                        type: 'post',
                        dataType: 'json',
                        data: $("#formHandler").serialize(),
                        success: function (json) {
                            CloseBlockUI();
                            AlertResultMsg("formHandler", json, "/System/HSCode");
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

            GoHandler(rowObject['BUKRS'], rowObject['HSCode']);
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
                        $("#hidOriginalYN").val(YN);

                        $.ajax({
                            url: "/System/HSCodeHandler",
                            type: 'post',
                            dataType: 'json',
                            data: $("#formHandler").serialize(),
                            success: function (json) {
                                document.getElementById("formHandler").reset();
                                CloseBlockUI();
                                AlertResultMsg("formHandler", json, "/System/HSCode");
                            }
                        });
                    }
                }
            })
        }
    });

    var vHSCode = decodeURI(QueryString("HSCode"));
    if (vHSCode != undefined && vHSCode.length > 0) {
        $("#txtHSCode").val(vHSCode);
        $("#btnSubmit").click();
    }
})

function GoHandler(BUKRS, HSCode) {
    if (BUKRS != undefined && HSCode != undefined) {
        CloseBlockUI();

        $.ajax({
            url: "/System/HSCode",
            type: 'get',
            dataType: 'json',
            data: "BUKRS=" + BUKRS + "&HSCode=" + HSCode,
            success: function (json) {
                $("#HandleStatus").text(langUpdateData);
                $("#txtHSCodeHandler").attr("readonly", "readonly");
                $("#ddlBUKRSHandler").attr("readonly", "readonly");
                $("#formHandler :reset").hide();
                $("#btnDelete").show();

                $("#ddlBUKRSHandler").val(json.BUKRS);
                $("#txtHSCodeHandler").val(json.HSCode);
                $("#txtHSDescHandler").val(json.HSDesc);
                $("#cbYNHandler").prop('checked', json.YN == "Y");
                $("#hidOriginalYN").val(json.YN);

                convertChineseLang();

                $("#CRUD").val("update");
                $("#ModifyTariff").show();
                $("#AddMaterial").hide();
                $("#tabHandle").click();
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
        }
        $("#AddMaterial").show();
        $("#ModifyTariff").hide();
        $("#tabHandle").click();
    }
}