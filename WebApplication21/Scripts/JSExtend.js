
// Trim() , Ltrim() , RTrim()
String.prototype.trim = function () { return this.replace(/(^\s*)|(\s*$)/g, ""); } //去除頭尾空白
String.prototype.lTrim = function () { return this.replace(/(^\s*)/g, ""); }       //去除左側（頭）空白
String.prototype.rTrim = function () { return this.replace(/(\s*$)/g, ""); }       //去除右側（尾）空白
String.prototype.Trim = function () { return this.lTrim().rTrim(); }                //利用LTrim、RTrim來實做的trim

function QueryString(name) {
    var AllVars = window.location.search.substring(1);
    var Vars = AllVars.split("&");
    for (i = 0; i < Vars.length; i++) {
        var Var = Vars[i].split("=");
        if (Var[0] == name) return Var[1];
    }
    return "";
}

////////////////////////////////////////////////
function padLeft(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return padLeft("0" + str, lenght);
}
function padRight(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return padRight(str + "0", lenght);
}
// 使用方式
//var strValue = "1";
//padLeft(strValue, 2);
//  會輸出 01

////////////////////////////////////////////////

function round2(number, fractionDigits) {
    with (Math) {
        return round(number * pow(10, fractionDigits)) / pow(10, fractionDigits);
    }
}
//var money=0.00542;
//alert(round2(money,2));//0.01 