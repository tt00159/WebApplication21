$(function () {

    $("#tabUpload").click(function () {
        return $("#CRUD").val() == "upload";
    });
    $("#btnDelete").hide();
    $("#ddlBUKRSHandler").attr('disabled', 'disabled');
    $("#ddlDeptIDHandler").attr('disabled', 'disabled');

    //建立人員初值及唯讀屬性控制    
    if (ShowData == "P") {
        $("#txtCreateUser").val(LoginUserID);
        $("#txtCreateUser").attr('disabled', 'disabled');
    }

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
                        { "field": "SystemNo", "op": "cn", "data": $("#txtSystemNo").val() },
                        //{ "field": "PeriodID", "op": "eq", "data": $("#ddlPeriodID").val() },
                        { "field": "RegulateType", "op": "eq", "data": RegulateType },                        
						{ "field": "TKONN_EX", "op": "cn", "data": $("#txtTKONN_EX").val() },
                        { "field": "OutDeclarationNo", "op": "cn", "data": $("#txtOutDeclarationNoQuery").val() },
                        { "field": "DataStatus", "op": "eq", "data": $("#ddlDataStatus").val() },
                        { "field": "CreateUser", "op": "eq", "data": $("#txtCreateUser").val() },
                        { "field": "CreateDate_Start", "op": "ge", "data": $("#txtCreateDate_Start").val() },
						{ "field": "CreateDate_End", "op": "le", "data": $("#txtCreateDate_End").val() },
					    { "field": "IsClosed", "op": "eq", "data": $("#ddlIsClosed").val() }
                    ]
            })
        );
    });

    $("#formHandler :submit").click(function () {
        if ($(this).hasClass("disabled")) return false;
    })

    $("#formHandler").submit(function (e) {
        if (!$("#formHandler").valid()) {
            AlertErrorMsg("formHandler");
            return false;
        }
        var errMsg = "";
        if ($("#txtOutDeclarationNo").val().length > 0 && $("#txtOutDeclarationNo").val().length != 18) errMsg = errMsg + "<p>移出報關單號長度應為 18 碼！</p>";
        if ($("#txtOutCustomsExportNo").val().length > 0 && $("#txtOutCustomsExportNo").val().length != 20) errMsg = errMsg + "<p>移出海關出庫單號長度應為 20 碼！</p>";
        if ($("#txtInDeclarationNo").val().length > 0 && $("#txtInDeclarationNo").val().length != 18) errMsg = errMsg + "<p>移入報關單號長度應為 18 碼！</p>";
        if ($("#txtInCustomsImportNo").val().length > 0 && $("#txtInCustomsImportNo").val().length != 20) errMsg = errMsg + "<p>移入海關進庫單號長度應為 20 碼！</p>";
        if ($("#cbDeclareCompanyYNHandler").prop('checked') == true && $("#txtOutsourceDeclareCompany").val() == "") errMsg = errMsg + "<p>[委外申報] 項目為 Yes 時 [委外申報單位] 不可為空白！</p>";
        if ($("#cbDeclareCompanyYNHandler").prop('checked') == false && $("#txtOutsourceDeclareCompany").val() != "") errMsg = errMsg + "<p>[委外申報] 項目為 No 時 [委外申報單位] 應該為空白！</p>";
        if ($("#txtDelegateDeclarationNoHandler").val().length > 0 && $("#txtDelegateDeclarationNoHandler").val().length != 18) errMsg = errMsg + "<p>[電子委托報關協議編號] 長度應為 18 碼！</p>";
        if (errMsg != "") {
            AlertErrorMsg("formHandler", errMsg);
            return false;
        }

        ShowBlockUI();

        //prevent Default functionality
        e.preventDefault();

        //get the action-url of the form
        var actionurl = e.currentTarget.action;

        $("#hidIdentifier").val("R" + $("#ddlDeptIDHandler option:selected").attr("identifier"));
        $("#hidIsClosed").val($("#cbIsClosed").prop('checked'));
        $("#hidRegulateType").val(RegulateType);
        $("#ddlBUKRSHandler").removeAttr('disabled');
        $("#ddlDeptIDHandler").removeAttr('disabled');
        $("#ddlOutZWAREHS").removeAttr('disabled');
        $("#ddlInZWAREHS").removeAttr('disabled');
        $("#hidOriginYN").val($("#cbOriginYN").prop('checked'));
        $("#hidDeclareCompanyYN").val($("#cbDeclareCompanyYNHandler").prop('checked'));

        //AlertErrorMsg("formHandler", $(this).serialize());
        //do your own request an handle the results
        $.ajax({
            url: actionurl,
            type: 'post',
            dataType: 'json',
            data: $(this).serialize(),
            success: function (json) {
                CloseBlockUI();
                AlertResultMsg("formHandler", json, "/Regulate/BondedRegulate?RegulateType=" + RegulateType);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("jqXHR\r\nstatusText = " + jqXHR.statusText + "\r\nresponseText = " + jqXHR.responseText + "\r\nstatus = " + jqXHR.status + "\r\nreadyState = " + jqXHR.readyState);
                alert("textStatus = " + textStatus + "\r\nerrorThrown = " + errorThrown);
                CloseBlockUI();
                AlertErrorMsg("formHandler", $("#HandleStatus").text() + "失敗！");
            }
        });
    });

    $("#btnInsert").click(function () {
        GoHandler();
    });

    $("#ddlDataStatusHandler").change(function () {
        if ($("#ddlDataStatusHandler").val() == 'D') {
            $("#cbIsClosed").prop("checked", true);
            bootbox.alert("選擇 [ 作廢 ] 存檔後將刪除：<br/>1.物料綁定資料<br/>2.報關單號<br/>3.出庫單號<BR/>4.PDF");
        }
        else {
            $("#cbIsClosed").prop("checked", false);
        }
    });

    $("#jqUpdate").click(function () {
        if (!$(this).hasClass("disabled")) {
            
            //保稅轉完稅需關閉結案-統一透過作廢方式處理
            if (RegulateType == "BondedToDuty") {
                $("#cbIsClosed").attr("disabled", true);                
            }
              
            var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');            
            var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            GoHandler(rowObject['SystemNo'],rowObject['BUKRS']);
        }
    });

    $("#formUpload").submit(function (e) {
        if ($("#filePDF").val().length == 0) {
            AlertErrorMsg("formUpload", $("#filePDF").attr("data-val-required"));
            return false;
        }

        ShowBlockUI();

        //prevent Default functionality
        e.preventDefault();

        //get the action-url of the form
        var actionurl = e.currentTarget.action;

        // Checking whether FormData is available in browser  
        if (window.FormData !== undefined) {

            var fileUpload = $("#filePDF").get(0);            
            var files = fileUpload.files;

            // Create FormData object  
            var formData = new FormData();
                                    
            // Looping over all files and add it to FormData object  
            for (var i = 0; i < files.length; i++) {
                formData.append(files[i].name, files[i]);                
            }

            formData.append("SystemNo", $("#hidSystemNo").val());
            formData.append("ActionName", "BondedRegulate");
            formData.append("PDFVar", $("#hidPDFVar").val());

            $.ajax({
                url: actionurl,
                type: "POST",
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                data: formData,
                success: function (json) {
                    //$("#ddlDeptIDHandler").attr('disabled', 'disabled');
                    CloseBlockUI();
                    AlertResultMsg("formUpload", json, "/Regulate/BondedRegulate?RegulateType=" + RegulateType);
                },
                error: function (err) {
                    alert(err.statusText);
                }
            });
        } else {
            alert("FormData is not supported.");
        }
    });

    $("#jqUpload").click(function () {
        if (!$(this).hasClass("disabled")) {
            var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
            var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            $("#CRUD").val("upload");
            $("#UploadSystemNo").text(rowObject['SystemNo']);            
            $("#hidSystemNo").val(rowObject['SystemNo']);
            $("#hidPDFVar").val("A");
            $("#tabUpload").click();
            if (rowObject['PDF'] != "") {
                toastr.warning("已有PDF檔，本次為覆蓋上傳(僅提示)", "PDF上傳提示：", { timeOut: 3000 })
            }
        }
    });

    $("#jqUploadB").click(function () {
        if (!$(this).hasClass("disabled")) {
            var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
            var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            $("#CRUD").val("upload");
            $("#UploadSystemNo").text(rowObject['SystemNo']);
            $("#hidSystemNo").val(rowObject['SystemNo']);
            $("#hidPDFVar").val("B");
            $("#tabUpload").click();
            if (rowObject['PDFB'] != "") {
                toastr.warning("已有PDF檔，本次為覆蓋上傳(僅提示)", "PDF上傳提示：", { timeOut: 3000 })
            }
        }
    });

    $("#jqMaterial").click(function () {
        if (!$(this).hasClass("disabled")) {
            var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
            var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            var menu = window.parent.document.getElementById("RegulateBondedRegulateMaterial");
            $(menu).attr("url", "/Regulate/BondedRegulateMaterial?SystemNo=" + rowObject['SystemNo'] + "&RegulateType=" + RegulateType);
            window.parent.$(menu).click();
        }
    });

    $("#jqCancel").click(function () {
        if (!$(this).hasClass("disabled")) {
            bootbox.confirm({
                title: '請問是否將此筆資料進行「抽單作業」？',
                message: $("#CancelArea").html(),
                callback: function (result) {
                    if (result) {
                        ShowBlockUI();

                        var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
                        var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
                        var flag = 3;

                        $.ajax({
                            url: "/Data/CancelOperation",
                            type: 'post',
                            dataType: 'json',
                            data: "BUKRS=" + rowObject['BUKRS'] + "&SystemNo=" + rowObject['SystemNo'] + "&BUDAT=" + $(".bootbox-body #txtBUDAT").val() + "&Flag=" + flag,
                            success: function (json) {
                                CloseBlockUI();
                                AlertResultMsg("formHandler", json, "/Regulate/BondedRegulate?RegulateType=" + RegulateType);
                            }
                        });
                    }
                }
            });

            setTimeout(function () {

                $(".bootbox-body #txtBUDAT").datepicker({
                    todayBtn: "linked",
                    weekStart: 7,
                    format: 'yyyy-mm-dd',
                    endDate: "+" + 0 + "d",
                    startDate: "-" + 365 + "d",
                    language: 'zh-TW',
                    autoclose: true,
                    zIndexOffset: 1000,
                    todayHighlight: true,
                    daysOfWeekHighlighted: "0,6"
                })
		        //show datepicker when clicking on the icon
		        .next().on(ace.click_event, function () {
		            $(this).prev().focus();
		        });
            }, 100);
        }
    });

    $("#jqPayTariff").click(function () {
        if (!$(this).hasClass("disabled")) {
            let rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
            let rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            var menu = window.parent.document.getElementById("RegulateBondedRegulatePayTax");
            $(menu).attr("url", "/Regulate/BondedRegulatePayTax?SystemNo=" + rowObject['SystemNo']);
            window.parent.$(menu).click();
        }
    });

    $("#jqPrintTariff").click(function () {
        if (!$(this).hasClass("disabled")) {
            var rowID = $("#" + jqGridID).jqGrid('getGridParam', 'selrow');
            var rowObject = $("#" + jqGridID).jqGrid('getRowData', rowID);
            var menu = window.parent.document.getElementById("ReportBondedToDutyTariff");
            $(menu).attr("url", "/Report/BondedToDutyTariff?SystemNo=" + rowObject['SystemNo']);
            window.parent.$(menu).click();
        }
    });

    $("#hidOutWERKS").val($("#ddlBUKRSHandler").val().replace("00", "") + Bonded);
    if (RegulateType == "BondedToDuty") //保稅轉完稅
    {
        $("#hidInWERKS").val($("#ddlBUKRSHandler").val().replace("00", "") + Dutiable);
    }
    else if (RegulateType == "Allocation") //保稅倉移庫
    {
        $("#hidInWERKS").val($("#ddlBUKRSHandler").val().replace("00", "") + Bonded);
        $("#jqPayTariff").hide();//付稅
        $("#jqPrintTariff").hide();//付稅列印
    }
    setTimeout(function () {
        GetZWAREHS($("#hidOutWERKS").val(), "ddlOutZWAREHS");
    }, 0);
    setTimeout(function () {
        GetZWAREHS($("#hidInWERKS").val(), "ddlInZWAREHS");
    }, 100);

    var vSystemNo = decodeURI(QueryString("SystemNo"));
    if (vSystemNo != undefined && vSystemNo.length > 0) {
        //$("#txtSystemNo").val(vSystemNo);
        var menu = window.parent.document.getElementById("RegulateBondedRegulate");
        $(menu).attr("url", "/Regulate/BondedRegulate");
        $("#btnSubmit").click();
    }
})

function GetZWAREHS(WERKS, ddlID, val) {

    $.ajax({
        url: "/Data/ZTWAREHS",
        type: 'post',
        dataType: 'json',
        data: "BUKRS=" + $("#ddlBUKRSHandler").val() + "&WERKS=" + WERKS + "&VKORG=" + VKORG,
        success: function (json) {
            $("#" + ddlID + " option").remove();
            //$("#" + ddlID).append("<option value=''></option>");
            $(json).each(function () {
                if (val != undefined && val == this.ZWAREHS)
                    $("#" + ddlID).append("<option selected value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
                else
                    $("#" + ddlID).append("<option value='" + this.ZWAREHS + "'>" + this.ZWAREHS_TXT + "</option>");
            });
        },
        error: function () {
            $("#" + ddlID + " option").remove();
            $("#" + ddlID).append("<option value=''></option>");
            alert("取得倉庫資料失敗！");
        }
    });
}

function GoHandler(SystemNo, BUKRS) {
    if (SystemNo != undefined && BUKRS != undefined) {

        $.ajax({
            url: "/Regulate/BondedRegulate",
            type: 'get',
            dataType: 'json',
            data: "isDetail=" + true + "&SystemNo=" + SystemNo + "&RegulateType=" + RegulateType,
            success: function (json) {
                $("#HandleStatus").text(langUpdateData);
                //$("#btnDelete").show();
                
                $("#ddlBUKRSHandler").val(json.BUKRS);
                $("#txtSystemNoHandle").val(json.SystemNo);
                $("#hidIdentifier").val(json.Identifier);
                $("#txtPeriodID").val(json.PeriodID);
                $("#txtTKONN_EXHandle").val(json.TKONN_EX);
                $("#txtRemark").val(json.Remark);                
                $("#cbIsClosed").prop('checked', json.IsClosed);
                $("#cbOriginYN").prop('checked', json.OriginYN);
                $("#hidOldOriginYN").val(json.OriginYN);

                $("#ddlOutZWAREHS").val(json.OutZWAREHS);
                $("#txtOutDeclarationNo").val(json.OutDeclarationNo);
                $("#txtOutCustomsExportNo").val(json.OutCustomsExportNo);

                $("#ddlInZWAREHS").val(json.InZWAREHS);
                $("#txtInDeclarationNo").val(json.InDeclarationNo);
                $("#txtInCustomsImportNo").val(json.InCustomsImportNo);
                $("#txtDeclareCompany").val(json.DeclareCompany);
                $("#cbDeclareCompanyYNHandler").prop('checked', json.DeclareCompanyYN);
                $("#txtOutsourceDeclareCompany").val(json.OutsourceDeclareCompany);
                $("#txtDelegateDeclarationNoHandler").val(json.DelegateDeclarationNo);
                $("#ddlDataStatusHandler").val(json.DataStatus);

                //已綁定物料時，庫別不可變更！
                if (json.MaterialCount > 0) {
                    //$("#ddlInZWAREHS").attr("disabled", true);
                    $("#ddlOutZWAREHS").attr("disabled", true);
                }

                convertChineseLang();

                $("#tabHandle").click();
                $("#CRUD").val("update");
            }
        });
    }
    else {
        $("#HandleStatus").text(langInsertData);
        $("#CRUD").val("create");
        $("#ddlOutZWAREHS").removeAttr('disabled');
        $("#ddlInZWAREHS").removeAttr('disabled');
        document.getElementById("formHandler").reset();
        $("#btnDelete").hide();
        $("#tabHandle").click();
    }
}