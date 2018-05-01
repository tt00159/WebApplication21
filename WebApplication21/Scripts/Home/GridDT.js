$(function () {
    $("#btnSubmitQuery").click(function (e) {               
        setTimeout(function () {
            $("#grid_id").jqGrid(
                "setGridParam",
                {
                    url: "/Home/GridDT",
                    datatype: "json",
                    mtype: "GET",                    
                    postData: { "SystemNo":"bbb" }
                }
            ).trigger("reloadGrid");        

            //ResultData區域顯示
            //$("#ResultData").show();
        }, 500);

    });
})

