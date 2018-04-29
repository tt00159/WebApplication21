$(function () {
    /*$(document).bind("contextmenu", function (event) {
    return false;
    });
    $(document).bind("selectstart", function (event) {
    return false;
    });
    $(document).bind("dragstart", function (event) {
    return false;
    });*/
    //InputFocus();

    if ($.jgrid != undefined) {
        $.jgrid.defaults = {
            recordtext: "第 {0} - {1} 筆，共{2}筆",
            emptyrecords: "查無此條件下相符之資料！",
            loadtext: "載入中...",
            pgtext: "目前在第{0}頁/共{1}頁",
            datatype: "local",
            rowNum: 10,
            rowList: [10, 30, 50, 70, 90, 100, 200, 500, 1000],
            altclass: "altClass",
            gridview: true,
            viewrecords: true,
            multiselect: true,
            autowidth: true,
            frozenColumns: true,
            shrinkToFit: false,
            height: 'auto',
            width: 'auto',
            cmTemplate: { sortable: false, resizable: false, align: "center" }
            //rownumWidth: 50,
            //autoencode: true,
            //rownumbers: true
            //toppager: true
        };
    }

    $(window).resize(function () {
        ResizeIFrame("PageContent");
    });

    $("[data-rel=tooltip]").tooltip();
});

//完稅廠
var Dutiable = "10";
//保稅廠
var Bonded = "20";
//小數點位數
var DecimalPlaces = 5;
var fixGridHeight = "500";

function ResizeIFrame(iframeID) {
    //隨內容伸展 iframe 高度
    var height = document.documentElement.clientHeight - $("#navbar").height() - $("#breadcrumbs").height() - 15;
    $("#" + iframeID).height(height);
}

function ResetInput() {
    $("input[type='text']").each(function () {
        $(this).val("");
    });
    InputFocus();
}

function ShowBlockUI(msg) {
    if (msg == undefined) msg = "處理中...";
    $.blockUI({ 
        css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff'
        }, 
        message: '<h4 style="font-weight: bolder">' + msg +'</h4>'
    });
}

function CloseBlockUI() {
    $.unblockUI();
}

function CopyText(obj) {
    clipboardData.setData('text', $(obj).html());
    alert("已複製資料：" + $(obj).html());
}

function ConfirmBlockUI() {
    $.blockUI({ message: $("#ConfirmMsg"), css: { border: 'none', width: '450px'} });
}

function AlertErrorMsg(formID, appendMsg) {
    if (appendMsg != undefined && appendMsg.length > 0) {
        if (appendMsg.indexOf("PRIMARY KEY") > 0) appendMsg = "主要識別資料已存在！無法新增。";

        $("#ErrorList_" + formID).text("");
        $("#ErrorList_" + formID).append("<li>" + appendMsg + "</li>");
    }

    bootbox.dialog({
        title: "",
        message: $("#AlertErrorMsg_" + formID).html(),
        buttons: {
            success: {
                label: "確定",
                className: "btn-success"
            }
        }
    });
}

function AlertResultMsg(formID, jsonResult, successRedirectURL, subTitleMsg) {
    if (jsonResult != undefined && jsonResult.ResultCode != -1) {
        if (subTitleMsg != undefined && subTitleMsg.length > 0) {
            $("#rowCount").text(subTitleMsg);
        }
        else {
            $("#rowCount").text("資料處理 " + jsonResult.RowCount + " 筆！");
        }

        if (jsonResult.ResultMessage != undefined && jsonResult.ResultMessage.length > 0)
            $("#resultMsg").text(jsonResult.ResultMessage);
        else
            $("#resultMsg").text("處理完畢！");

        bootbox.dialog({
            title: "",
            message: $("#AlertResultMsg").html(),
            buttons: {
                success: {
                    label: "確定",
                    className: "btn-success",
                    callback: function () {
                        if (jsonResult.ResultCode != -1 && successRedirectURL != undefined && successRedirectURL.length > 0) {
                            location.href = successRedirectURL;
                        }
                    }
                }
            }
        });
    }
    else {
        AlertErrorMsg(formID, jsonResult.ResultMessage);
    }
    convertChineseLang();
}

function RedirectToLogin(msg) {
    if (msg != undefined && msg.length > 0)
        alert(msg);

    parent.location.replace("/");
}

// 顯示倒數秒數
function showTime(countDown) {
    countDown -= 1;
    $("#lblCountDown").html(countDown);

    if (countDown == 0) {
        parent.location.replace("/");
    }

    // 每秒執行一次,showTime()
    setTimeout("showTime(" + countDown + ")", 1000);
}

// 修數時間到向 Server Request
function keepConnection(countDown) {
    countDown -= 1;

    if (countDown == 0) {
        $.ajax({
            url: "/Public/KeepConnection",
            type: 'post',
            dataType: 'json',
            success: function (json) {
                if (json != undefined && json != null && json.ResultCode > 0) {
                    //alert("ResultCode：" + json.ResultCode + "\r\nMsg：" + json.Msg);
                    keepConnection(300);
                }
                else {
                    alert("ResultCode：" + json.ResultCode + "\r\nMsg：" + json.Msg);
                }
            }
        });
    }

    // 每秒執行一次,keepConnection()
    setTimeout("keepConnection(" + countDown + ")", 1000);
}

function InputFocus(id) {
    if (id != undefined) {
        document.getElementById(id).focus();
    }
    else
        $("input:first").focus();
}

function reloadGrid(data, gridID, pagerID, url) {
    if (gridID == undefined) gridID = "tblGridData";
    if (pagerID == undefined) pagerID = "pager";
    if (url == undefined) url = "";

    $("#" + gridID).jqGrid(
        "setGridParam",
        {
            url: url,
            datatype: "json",
            mtype: "POST",
            postData: {
                "jsonCondition": data
            }
        }
    ).trigger("reloadGrid", [{ current: true, page: 1 }])
    .navGrid("#" + pagerID,
		{
			edit: false,
			add: false,
			del: false,
			search: true,
			searchicon: 'ace-icon fa fa-search orange',
			refresh: true,
			refreshicon: 'ace-icon fa fa-refresh green',
			view: true,
			viewicon: 'ace-icon fa fa-search-plus grey',
		},
        {}, // edit options
        {}, // add options
        {}, // delete options
		{
			//search form
			recreateForm: true,
			afterShowSearch: function (e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function () {
				$("select.opsel").remove();
				style_search_filters($(this));
			},
			multipleSearch: true,
			sopt: ['cn', 'eq', 'ne', 'lt', 'le', 'gt', 'ge']
		},
		{
			//view record form
			recreateForm: true,
			beforeShowForm: function (e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		})
    .navButtonAdd("#" + pagerID, {
            id: 'btnExportCSV',
            caption: '',
            title: 'Export To CSV',
            onClickButton : function(e)
            {
                //console.log(JSON.stringify($('#' + gridID).jqGrid('getRowData')));
                //console.log($('#' + gridID).jqGrid('getGridParam', 'colNames'));
                JSONToCSVConvertor(JSON.stringify($('#' + gridID).jqGrid('getRowData')), $('#' + gridID).jqGrid('getGridParam', 'colNames'));
            },
            buttonicon: 'fa fa-file-excel-o'
        });
}

//replace icons with FontAwesome icons like above
function updatePagerIcons(table) {
    var replacement =
    {
        'ui-icon-seek-first': 'ace-icon fa fa-angle-double-left bigger-140',
        'ui-icon-seek-prev': 'ace-icon fa fa-angle-left bigger-140',
        'ui-icon-seek-next': 'ace-icon fa fa-angle-right bigger-140',
        'ui-icon-seek-end': 'ace-icon fa fa-angle-double-right bigger-140'
    };
    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
    })
}

function JSONToCSVConvertor(JSONData, ColumnNames) {
    //ColumnNames is array => $("#tableGrid").jqGrid('getGridParam','colModel')

    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    //console.log(arrData);

    var CSV = '';

    //This condition will generate the Label/Header
    if (Array.isArray(ColumnNames)) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in ColumnNames) {

            if (ColumnNames[index].indexOf("<input") == -1) {
                //Now convert each value to string and comma-seprated
                row += ColumnNames[index] + ',';
            }
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';

        //console.log(CSV);
    }
    else
    {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        if (arrData[i]["PDF"] != "") arrData[i]["PDF"] = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (arrData[i][index] == " ") arrData[i][index] = "";
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "ExcelData";

    //console.log(CSV);

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    //console.log(document.body);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function style_search_filters(form) {
    form.find('.delete-rule').val('X');
    form.find('.add-rule').addClass('btn btn-xs btn-primary');
    form.find('.add-group').addClass('btn btn-xs btn-success');
    form.find('.delete-group').addClass('btn btn-xs btn-danger');
}
function style_search_form(form) {
    var dialog = form.closest('.ui-jqdialog');
    var buttons = dialog.find('.EditTable')
    buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'ace-icon fa fa-retweet');
    buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'ace-icon fa fa-comment-o');
    buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'ace-icon fa fa-search');
}

var yes = "是";
var no = "否"
//cellvalue - 當前cell的值
//options - 該cell的options設置，包括{rowId, colModel, pos, gid}
//rowObject - 該row所有cell的值，如{ rowObject['D8_NO'] ...}
function BoleanFormat(cellvalue, options, rowObject) {
    if (cellvalue == "true" || cellvalue == "Y" || cellvalue == "1") return yes;
    else return no;
}
