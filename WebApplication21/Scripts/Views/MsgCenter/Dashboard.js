$(function () {

    ShowBlockUI();

    $("#ResultData").show();

    setTimeout(function () {

        $("#" + jqGridID).jqGrid(
            "setGridParam",
            {
                url: "/MsgCenter/Dashboard",
                datatype: "json",
                mtype: "GET",
                postData: { "dataType": "StatisticalData", "isForGrid": true }
            }
        ).trigger("reloadGrid");

        //ResultData區域顯示
        $("#ResultData").show();
    }, 500);
})

