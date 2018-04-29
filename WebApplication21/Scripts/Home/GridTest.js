$(function () {
    $("#btnSubmitQuery").click(function (e) {               
        setTimeout(function () {
            $("#grid_id").jqGrid(
                "setGridParam",
                {
                    url: "/Home/GridTest",
                    datatype: "json",
                    mtype: "GET",                    
                    postData: { "SystemNo":"aaa" }
                }
            ).trigger("reloadGrid");        

            //ResultData區域顯示
            //$("#ResultData").show();
        }, 500);

    });
})

