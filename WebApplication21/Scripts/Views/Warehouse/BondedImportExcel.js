$(function () {
    $("#tabUpload").click(function () {
        return $("#CRUD").val() == "upload";
    });

    $("#tabDetail").click(function () {
        return $("#CRUD").val() == "Detail";
    });

    $("#jqUpload").click(function () {
        if (!$(this).hasClass("disabled")) {
            $("#CRUD").val("upload");
            $("#tabUpload").click();
        }
    });

    $("#jqDetail").click(function () {
        if (!$(this).hasClass("disabled")) {
            ShowBlockUI();

            $("#ResultDetailData").show();

            reloadGrid(
                JSON.stringify(
                {
                    "groupOp": "AND",
                    "rules":
                        [
						    { "field": "BUKRS", "op": "eq", "data": BUKRS },
						    { "field": "SystemNo", "op": "eq", "data": $("#hidSystemNo").val() },
						    { "field": "VKORG", "op": "eq", "data": $("#hidVKORG").val() },
						    { "field": "WERKS", "op": "eq", "data": $("#hidWERKS").val() },
						    { "field": "ZWAREHS", "op": "eq", "data": $("#hidZWAREHS").val() },
						    { "field": "PeriodID", "op": "eq", "data": $("#hidPeriodID").val() }
                        ]
                }), jqGridIDDetail, "pagerDetail", "/Data/GetWarehouseInventoryDetail"
            );

            $("#" + jqGridIDDetail).jqGrid().setCaption($("#lblZWAREHS").text());

            $("#CRUD").val("Detail");
            $("#tabDetail").click();
        }
    });

    $("#formUpload").submit(function (e) {
        if ($("#fileExcel").val().length == 0) {
            AlertErrorMsg("formUpload", $("#fileExcel").attr("data-val-required"));
            return false;
        }

        ShowBlockUI();

        //prevent Default functionality
        e.preventDefault();

        //get the action-url of the form
        var actionurl = e.currentTarget.action;

        $("#hidIdentifier").val("W" + VKORG.substring(2, 3));

        $.ajax({
            url: actionurl,
            type: 'post',
            dataType: 'json',
            data: $(this).serialize(),
            success: function (json) {

                if (json.ResultCode == -1) {
                    CloseBlockUI();
                    AlertErrorMsg("formUpload", json.ResultMessage);
                    return;
                }

                // Checking whether FormData is available in browser  
                if (window.FormData !== undefined) {

                    var fileUpload = $("#fileExcel").get(0);
                    var files = fileUpload.files;

                    // Create FormData object  
                    var formData = new FormData();

                    // Looping over all files and add it to FormData object  
                    for (var i = 0; i < files.length; i++) {
                        formData.append(files[i].name, files[i]);
                    }

                    formData.append("BUKRS", BUKRS);
                    formData.append("SystemNo", json.ResultMessage);
                    formData.append("ActionName", "BondedImportExcel");
                    formData.append("JSON",
                        "{'ZWAREHS':'" + $("#hidZWAREHS").val() +
                        "','PeriodID':'" + $("#hidPeriodID").val() +
                        "','VKORG':'" + $("#hidVKORG").val() + "'}"
                    );
                    $.ajax({
                        url: "/Data/FileUpload",
                        type: "POST",
                        contentType: false, // Not to set any content header  
                        processData: false, // Not to process data  
                        data: formData,
                        success: function (json) {

                            CloseBlockUI();
                            AlertResultMsg("formUpload", json, "/Warehouse/BondedImportExcel");
                        },
                        error: function (err) {
                            alert(err.statusText);
                        }
                    });
                } else {
                    CloseBlockUI();
                    alert("FormData is not supported.");
                }
            }
        });

        
    });
})