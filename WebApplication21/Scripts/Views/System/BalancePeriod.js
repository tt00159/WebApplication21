$(function () {

    $("#ddlVKORG").attr("disabled", "true");

    $("#tabHandle").click(function () {
        return $("#CRUD").val() != "";
    });

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
                        { "field": "VKORG", "op": "eq", "data": $("#ddlVKORG").val() }
                    ]
            })
        );
    });

    $("#formHandler").submit(function (e) {
        if (!$("#formHandler").valid()) {
            AlertErrorMsg("formHandler");
            return false;
        }
        if ($("#formHandler [type='submit']").hasClass("disabled")) {
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
                AlertResultMsg("formHandler", json, "/System/BalancePeriod");
            }
        });
    });

    $("#jqUpdate").click(function () {
        if (!$(this).hasClass("disabled")) {
            var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
            var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            GoHandler(rowObject['BUKRS'], rowObject['VKORG'], rowObject['PeriodID']);
        }
    });

    $("#cbIsClosed").click(function () {
        if (!$(this).hasClass("disabled")) {
            if ($(this).prop('checked'))
                $("#formHandler [type='submit']").removeClass("disabled");
            else
                $("#formHandler [type='submit']").addClass("disabled");
        }
    });

    var vSystemNo = decodeURI(QueryString("SystemNo"));
    if (vSystemNo != undefined && vSystemNo.length > 0) {
        //$("#txtSystemNo").val(vSystemNo);
        var menu = window.parent.document.getElementById("SystemBalancePeriod");
        $(menu).attr("url", "/System/BalancePeriod");
        $("#btnSubmit").click();
    }
})

function GoHandler(BUKRS, VKORG, PeriodID) {
    if (BUKRS != undefined && VKORG != undefined && PeriodID != undefined) {
        CloseBlockUI();

        $.ajax({
            url: "/System/BalancePeriod",
            type: 'get',
            dataType: 'json',
            data: "BUKRS=" + BUKRS + "&VKORG=" + VKORG + "&PeriodID=" + PeriodID,
            success: function (json) {
                $("#ddlBUKRSHandler").attr("readonly", "readonly");
                $("#txtPeriodID").attr("readonly", "readonly");
                $("#formHandler [type='submit']").addClass("disabled");
                
                $("#ddlBUKRSHandler").val(json.BUKRS);
                $("#hidVKORG").val(json.VKORG);
                $("#txtPeriodID").val(json.PeriodID);
                $("#txtBeginDate").val(json.BeginDate);
                $("#txtEndDate").val(json.EndDate);
                $("#cbIsClosed").prop('checked', json.IsClosed);

                if (json.IsClosed) {
                    $("#cbIsClosed").addClass("disabled");
                }
                else {
                    $("#cbIsClosed").removeClass("disabled");
                }
                
                convertChineseLang();
                //SAP即庫對帳有問題不可期別結轉(若有緊急需求可將WarehouseDept的該部門的ResultTXT都給Y)
                //注意此SAPLSMNGCheck的資料來源為WarehouseDept的資料倒入,非BalancePeriod的資料
                if (json.SAPLSMNGCheck != "Y") {                    
                    //bootbox.alert("期別結轉：<BR/><BR/> [ SAP保稅物料即庫查詢 ] " + json.SAPLSMNGCheck + "，不可執行期別結轉");
                    toastr.warning("[SAP保稅物料即庫查詢] " + json.SAPLSMNGCheck + "", { timeOut: 5000 })
                }
                else {
                    $("#CRUD").val("update");
                    $("#tabHandle").click();
                }
            }
        });
    }
    else {
        $("#CRUD").val("create");
        document.getElementById("formHandler").reset();
        $("#formHandler :reset").show();
        $("#tabHandle").click();
    }
}