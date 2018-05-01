$(function () {
    $("#btnSubmitQuery").click(function (e) {               
        setTimeout(function () {
            $("#grid_id").jqGrid(
                "setGridParam",
                {
                    url: "/Home/GridModify",
                    datatype: "json",
                    mtype: "GET",                    
                    postData: { "SystemNo":"bbb" }
                }
            ).trigger("reloadGrid");        

            //ResultData區域顯示
            //$("#ResultData").show();
        }, 500);

    });

    $("#jqInsertMaterial").click(function () {
       

        if (!$(this).hasClass("disabled")) {
            var selarrrow = $("#grid_id").jqGrid('getGridParam', 'selarrrow');
            var IDs = selarrrow.toString().split(',');
            var items = [];
            var errorMsg = "";
            var confirmMsg = "";
            for (var i = 0; i < IDs.length; i++) {
                var rowid = IDs[i];
                var aRow = $("#grid_id").jqGrid('getRowData', rowid);
                           
                if (errorMsg.length == 0) {
                    var item = {
                        NameA: aRow["NameA"]                    
                        
                    };
                    items.push(item);
                }
            }
            //alert("CRUD=" + $("#CRUD").val() + "&JSON=" + JSON.stringify(items));
            var qq = "H66";
            $.ajax({
                url: "/Home/GridModifyHandler",
                type: 'post',                
                data: "CRUD=" + JSON.stringify(items),
                success: function (json) {
                    alert("q1");
            }
            });
            
        }
    });
})

