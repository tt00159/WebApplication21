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
                        //{ "field": "WERKS", "op": "eq", "data": $("#ddlBUKRS").val().replace("00", "") + $("#ddlFactory").val() },
                        { "field": "WERKS", "op": "eq", "data": $("#ddlVKORG").val().substring(0,2) + $("#ddlFactory").val() },
                        { "field": "VKORG", "op": "eq", "data": $("#ddlVKORG").val() }
                    ]
            })
        );
    });

    $("#jqConfirm").click(function () {
        if (!$(this).hasClass("disabled")) {
            var selarrrow = $("#" + jqGridID).jqGrid('getGridParam', 'selarrrow');
            var rowObject;
            var selRowIDs = "";
            for (var i = 0; i < selarrrow.length; i++) {
                rowObject = $("#" + jqGridID).jqGrid('getRowData', selarrrow[i]);
                selRowIDs += rowObject['ZWAREHS'] + ",";
            }
            selRowIDs = selRowIDs.substring(0, selRowIDs.length - 1);

            bootbox.confirm({
                message: "請問是否異動資料？",
                callback: function (result) {
                    if (result) {
                        ShowBlockUI();

                        $.ajax({
                            url: "/System/WarehouseDeptHandler",
                            type: 'post',
                            dataType: 'json',
                            data: {
                                "jsonCondition":
                                    JSON.stringify(
                                    {
                                        "groupOp": "AND",
                                        "rules":
                                            [
                                                { "field": "BUKRS", "op": "eq", "data": rowObject['BUKRS'] },
                                                { "field": "VKORG", "op": "eq", "data": $("#ddlVKORG").val() },
                                                { "field": "WERKS", "op": "eq", "data": rowObject['WERKS'] },
                                                { "field": "SelectRowIDs", "op": "cn", "data": selRowIDs }
                                            ]
                                    })
                            },
                            success: function (json) {
                                CloseBlockUI();
                                AlertResultMsg("form", json);
                            }
                        });
                    }
                }
            })
        }
    })
})