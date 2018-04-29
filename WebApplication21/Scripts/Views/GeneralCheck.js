$(function () {


})

//差異天數計算
function getDiffDays(endDate) {
    var date1 = new Date();
    var date2 = new Date(Date.parse(endDate.replace("-", "/")));
    var date3 = date1.getTime() - date2.getTime();//時間差的毫秒数 
    var days = Math.floor(date3 / (24 * 3600 * 1000));//相差天數
    return days;
};


//取得公司上傳天數限制
function PDFDaySetting(BUKRS) {
    var days = 0;
    $.ajax({
        url: "/Data/PDFDay",
        type: "GET",
        dataType: "json",
        data: "BUKRS=" + BUKRS,
        async: false,
        success: function (data) {
            days = data.KeyID;            
        },
        error: function (jqXHR, textStatus, err) {
        }
    });    
    return days;
}