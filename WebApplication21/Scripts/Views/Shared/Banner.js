$(function () {

    $.ajax({
        url: "/MsgCenter/OvertimeList",
        type: 'get',
        dataType: 'json',
        data: "isGetCount=" + true,
        success: function (json) {
            $("#lblOvertimeCount").text(json.OvertimeListCount);
            $(".Notifications").each(function () {
                $(this).text(json.OvertimeListCount);
            });
        },
        error: function () {
            alert("取得 逾期資料 失敗！");
        }
    });


    $("#btnOvertime").click(function () {
        $("#MsgCenterOvertimeList").click();
    });
})