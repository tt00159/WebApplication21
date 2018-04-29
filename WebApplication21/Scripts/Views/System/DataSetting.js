$(function () {

    parentKeyID = decodeURI(QueryString("parentKeyID"));
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
                        { "field": "ParentKeyID", "op": "eq", "data": parentKeyID },
                        //{ "field": "BUKRS", "op": "eq", "data": $("#ddlBUKRS").val() },
                        { "field": "YN", "op": "eq", "data": $("#cbYN").prop('checked') }
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
                AlertResultMsg("formHandler", json, "/System/DataSetting?parentKeyID=" + parentKeyID);
            }
        });
    });

    $("#btnInsert").click(function () {
        GoHandler();
    });

    $("#btnDelete").click(function () {
        ShowBlockUI();
        $("#CRUD").val("delete");

        $.ajax({
            url: "/System/DataSettingHandler",
            type: 'post',
            dataType: 'json',
            data: $("#formHandler").serialize(),
            success: function (json) {
                CloseBlockUI();
                AlertResultMsg("formHandler", json, "/System/DataSetting?parentKeyID=" + parentKeyID);
            }
        });
    });

    $("#jqUpdate").click(function(){
        if (!$(this).hasClass("disabled")) {
            var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
            var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            GoHandler(rowObject['KeyID'], rowObject['BUKRS']);
        }
    })

    $("#jqDelete").click(function () {
        if (!$(this).hasClass("disabled")) {
            var selarrrow = $("#" + jqGridID).jqGrid('getGridParam', 'selarrrow');
            var rowObject;
            var selRowIDs = "";
            for (var i = 0; i < selarrrow.length; i++) {
                rowObject = $("#" + jqGridID).jqGrid('getRowData', selarrrow[i]);
                selRowIDs += rowObject['KeyID'] + ",";
            }
            selRowIDs = selRowIDs.substring(0, selRowIDs.length - 1);

            bootbox.confirm({
                message: "請問是否刪除 " + selarrrow.length + " 筆資料？<BR /><BR /> ( " + selRowIDs + " )",
                callback: function (result) {
                    if (result) {
                        ShowBlockUI();
                        $("#CRUD").val("deleteRows");
                        $("#SelectRowIDs").val(selRowIDs);

                        $.ajax({
                            url: "/System/DataSettingHandler",
                            type: 'post',
                            dataType: 'json',
                            data: $("#formHandler").serialize(),
                            success: function (json) {
                                CloseBlockUI();
                                AlertResultMsg("formHandler", json, "/System/DataSetting?parentKeyID=" + parentKeyID);
                            }
                        });
                    }
                }
            })
        }
    })
})

function GoHandler(KeyID, BUKRS) {
    if (KeyID != undefined) {
        CloseBlockUI();

        $.ajax({
            url: "/System/DataSetting",
            type: 'get',
            dataType: 'json',
            data: "KeyID=" + KeyID + "&BUKRS=" + BUKRS + "&parentKeyID=" + parentKeyID,
            success: function (json) {
                $("#HandleStatus").text(langUpdateData);
                $("#txtKeyID").attr("readonly", "readonly");
                $("#ddlBUKRSHandler").attr("readonly", "readonly");
                $("#formHandler :reset").hide();
                $("#btnDelete").show();

                $("#ddlBUKRSHandler").val(json.BUKRS);
                $("#txtKeyID").val(json.KeyID);
                $("#txtParentKeyID").val(json.ParentKeyID);
                $("#txtValue").val(json.Value);
                $("#txtIdentifier").val(json.Identifier);
                $("#txtSort").val(json.Sort);
                $("#cbYNHandler").prop('checked', json.YN == "Y");
                $("#txtRemark").val(json.Remark);

                convertChineseLang();

                $("#CRUD").val("update");
                $("#tabHandle").click();
            }
        });
    }
    else {
        $("#HandleStatus").text(langInsertData);
        $("#txtKeyID").removeAttr("readonly");
        $("#ddlBUKRSHandler").removeAttr("readonly");
        $("#CRUD").val("create");
        document.getElementById("formHandler").reset();
        $("#formHandler :reset").show();
        $("#btnDelete").hide();
        $("#tabHandle").click();
    }
}