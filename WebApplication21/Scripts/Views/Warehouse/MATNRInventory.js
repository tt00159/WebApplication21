$(function () {
    GetZWAREHS();

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

		$("#" + jqGridID).jqGrid(
            "setGridParam",
            {
                url: "/Data/GetExportMaterialAmount",
                datatype: "json",
                mtype: "GET",
                postData: {
                    "BUKRS": BUKRS,
                    "WERKS": WERKS,
                    "ZWAREHS": $("#ddlZWAREHS").val(),
                    "MATNR": $("#txtMATNR").val(),
                    "isForGrid": true
                }
            }
        ).trigger("reloadGrid")
	    .navGrid("#pager",
            {
                edit: false, add: false, del: false, search: false, refresh: false, view: false
            }, {}, {}, {}, {})
        .navButtonAdd("#pager", {
	    id: 'btnExportCSV',
	    caption: '',
	    title: 'Export To CSV',
	    onClickButton: function (e) {
	        JSONToCSVConvertor(JSON.stringify($('#' + jqGridID).jqGrid('getRowData')), $('#' + jqGridID).jqGrid('getGridParam', 'colNames'));
	    },
	    buttonicon: 'fa fa-file-excel-o'
	    });
	});
})

function GetZWAREHS(val) {
    $.ajax({
        url: "/Data/ZTWAREHS",
        type: 'post',
        dataType: 'json',
        data: "BUKRS=" + BUKRS + "&WERKS=" + WERKS + "&VKORG=" + VKORG + "&IsVirtural=False",
        success: function (json) {
            $("#ddlZWAREHS option").remove();
            $("#ddlZWAREHS").append("<option value=''></option>");
            $(json).each(function () {
                if (val != undefined && val == this.ZWAREHS)
                    $("#ddlZWAREHS").append("<option selected value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
                else
                    $("#ddlZWAREHS").append("<option value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
            });
        },
        error: function () {
            $("#ddlZWAREHS option").remove();
            $("#ddlZWAREHS").append("<option value=''></option>");
            alert("取得倉庫資料失敗！");
        }
    });

}
