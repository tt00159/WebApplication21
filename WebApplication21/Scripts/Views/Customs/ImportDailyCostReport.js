$(function () {

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
						{ "field": "IsClosed", "op": "eq", "data": $("#ddlIsClosed").val() },
                        { "field": "CreateUser", "op": "eq", "data": $("#txtCreateUser").val() },                        
                        { "field": "ExcelNo", "op": "cn", "data": $("#txtExcelNo").val() },
					    { "field": "DataStatus", "op": "eq", "data": $("#ddlDataStatus").val() }                        
					]
			})
		);
	});
})
