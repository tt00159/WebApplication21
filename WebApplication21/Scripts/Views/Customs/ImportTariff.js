//Global variables
let lastSelection;
let delayInputTime = 1500; //1.5 sec
let base = { materials: [] }; //建立Base object
let subscriptions$ = [];
let subGridCells$ = [];


$(function () {

    $("#btnSubmitQuery").click(function (e) {      
        
        if (!$("#form").valid()) {
            AlertErrorMsg("form");
            return false;
        }
        
        //月初匯率資料檢核
        if (getMonthRate() == "N")
        {
            AlertErrorMsg("form", "當月匯率資料尚未維護,請通知小孟!");
            return false;
        }
      
        ShowBlockUI();

        //Clear jqGrid
        $("#" + jqGridID).jqGrid("clearGridData");
        //Clear base
        base = { Materials: [] };
        //Unsubscribe observables
        disposeObservables();


        //Start ajax calls
        var promiseId = getImportDaily();    //取得表頭資料
        var promiseIm = getImportMaterial(); //取得表身資料

        $.when(promiseId, promiseIm).done((rtnId, rtnIm) => {

            if (rtnId && rtnId[0] && !jQuery.isEmptyObject(rtnId[0])) {
                let importDaily = rtnId[0]; //The ajax returns {object, status}
                let importMaterials = rtnIm[0]; //The ajax returns {object, status}

                //Render ImportDaily
                renderImportDaily(importDaily);

                //Create base model
                createBase(importDaily, importMaterials);
                updateBase('Initial');
                renderImportMaterial(base.Materials).then(() => {
                    $("#ResultData").show(); //ResultData區域顯示
                    createObservables();  //Create observables 
                    CloseBlockUI();
                })

                //Disable editable elements when the data is closed
                if (base.IsClosed === true) {
                    eableInputs(false);
                    $("#ResultControls").hide(); //ResultControls區域隱藏
                }
                else {
                    eableInputs(true);
                    $("#ResultControls").show(); //ResultControls區域顯示
                }

            }
            else {
                $("#ResultData").hide(); //ResultData區域隱藏
                $("#ResultControls").hide(); //ResultControls區域隱藏
                AlertErrorMsg("form", "查無此系統單號資料");
                CloseBlockUI();
            }

        }).fail((data, err) => {
            CloseBlockUI();
        });
    });

    /*
     * Update callback
     */
    $("#btnUpdate").click(function () {

        //Set base ImportDaily values from dom
        base.ApplicationDate = $('#applicationDate').val();
        base.DeclareCompany = $('#declareCompanyNo').val();
        base.DeclarationNo = $('#declarationNo').val();
        base.CustomsImportNo = $('#customsImportNo').val();
        base.ImportDate = $('#importWarehouseDate').val();
        base.PayTaxDate = $('#PayTaxDate').val();
        base.TariffVal = $('#tariffVal').val();
        base.VATVal = $('#vatVal').val();
        base.Insurance = $('#insurance').val();
        base.Freight = $('#freight').val();
        base.AdditionalExpenses = $('#additionalExpenses').val();
        base.TariffMarginCategory = $('#ddlTariffMarginCategory').val();
        base.TariffMargin = $('#txtTariffMargin').val();
        base.TariffOtherCost = $('#txtTariffOtherCost').val();
        base.TariffCostDescription = $('#txtTariffCostDescription').val();
        
        if (!validateForms()) {
            return false;
        }

        // 防止 JSON 過大，僅回傳需要的欄位
        let updataData = { materials: [] };
        updataData.SystemNo = base.SystemNo;
        updataData.BUKRS = base.BUKRS;
        updataData.ApplicationDate = base.ApplicationDate;
        updataData.DeclareCompany = base.DeclareCompany;
        updataData.DeclarationNo = base.DeclarationNo;
        updataData.CustomsImportNo = base.CustomsImportNo;
        updataData.ImportDate = base.ImportDate;
        updataData.PayTaxDate = base.PayTaxDate;
        updataData.TariffVal = base.TariffVal;
        updataData.VATVal = base.VATVal;
        updataData.Insurance = base.Insurance;
        updataData.Freight = base.Freight;
        updataData.AdditionalExpenses = base.AdditionalExpenses;
        updataData.Materials = [];
        updataData.TariffMarginCategory = base.TariffMarginCategory;
        updataData.TariffMargin = base.TariffMargin;
        updataData.TariffOtherCost = base.TariffOtherCost;
        updataData.TariffCostDescription = base.TariffCostDescription;
        
        for (let i = 0; i < base.Materials.length; i++) {
            let ml = base.Materials[i];            
            updataData.Materials.push({
                SystemNo: base.SystemNo,
                BUKRS: base.BUKRS,
                TKONN_EX: ml.TKONN_EX,
                MATNR: ml.MATNR,
                NETPR: ml.NETPR,
                Rate: ml.Rate,
                OtherTaxVal: ml.OtherTaxVal,
                SAPTariff: ml.SAPTariff,
                ItemTariffMargin: ml.ItemTariffMargin,
                ItemTariffOtherCost: ml.ItemTariffOtherCost
            });
        }

        //console.log(JSON.stringify(updataData));
        //return;
        ShowBlockUI();
        let putUri = "/customs/UpdateImportTariff";
        $.ajax({
            url: putUri,
            type: "PUT",
            data: JSON.stringify(updataData),
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            timeout: 5000,
            success: function (json) {
                CloseBlockUI();
                bootbox.confirm({
                    message: "<br />資料處理完畢！<br />請問是否要前往打印頁面？",
                    callback: function (result) {
                        if (result) {
                            var menu = window.parent.document.getElementById("ReportImportTariff");
                            $(menu).attr("url", "/Report/ImportTariff?SystemNo=" + $("#txtSystemNo").val());
                            window.parent.$(menu).click();
                        }
                    }
                })
            },
            error: function (jqXHR, textStatus, err) {
                CloseBlockUI();
            }
        });
    });

    $("#PayTaxDate").change(function () {

        var jqGridCounts = $("#" + jqGridID).getGridParam("reccount");
        if (jqGridCounts > 0) {

            ShowBlockUI();

            $.ajax({
                url: "/Data/CurrentCustomsRate",
                type: 'POST',
                dataType: 'json',
                data: "BUKRS=" + BUKRS + "&BeginDate=" + $(this).val(),
                success: function (json) {
                    //20170928原程式碼未支援同報關單多幣別
                    //var currency = {};
                    //for (var i = 0; i < json.length; i++) {
                    //    currency[json[i].Currency] = json[i].Rate;
                    //}

                    //var rowData = $("#" + jqGridID).jqGrid('getRowData', 1);
                    //base.Materials.forEach(x => {
                    //    x.Rate = currency[rowData.WAERS];
                    //});

                    base.Materials.forEach(x => {
                        for (var i = 0; i < json.length; i++) {
                            if (x.WAERS == json[i].Currency)
                                x.Rate = json[i].Rate;
                        }
                    });

                    updateBase('付稅日期');
                    renderImportMaterial(base.Materials);

                    CloseBlockUI();
                },
                error: function () {
                    AlertErrorMsg("form", "查無此日期 (" + $(this).val() + ") 的匯率！");

                    CloseBlockUI();
                }
            });
        }
    });

    /*
     * Set Menu URL 
     */
    var vSystemNo = decodeURI(QueryString("SystemNo"));
    if (vSystemNo != undefined && vSystemNo.length > 0) {
        $("#txtSystemNo").val(vSystemNo);
        var menu = window.parent.document.getElementById("CustomsImportTariff");
        $(menu).attr("url", "/Customs/ImportTariff");
        $("#btnSubmitQuery").click();
    }
})

/**
 * Edit row callback 
 */
function editRow(id) {
    var grid = $("#" + jqGridID);
    if (id && id !== lastSelection) {
        grid.jqGrid('restoreRow', lastSelection);
        lastSelection = id;
    }

    if (base.IsClosed === false) {
        //Make the row editable
        grid.jqGrid('editRow', id, { keys: false });

        //Create Grid cell observables
        createGridCellObservable(id);
    }
}

/**
 * 驗證輸入項目
 */
function validateForms() {

    //SUM(支付關稅)!=稅單進口總關稅
    let sumSAPTariff = importMaterialStg.calSumSAPTariff(base.Materials);

    //console.log("SUM(支付關稅) ="+ +sumSAPTariff);
    //console.log("稅單進口總關稅 ="+ +base.TariffVal);

    if (base.IsManualUptSAPTariff==true && + sumSAPTariff !== +base.TariffVal) {
        alert('稅單進口總關稅加總不平!');
        return false;
    }


    return true;

}


function eableInputs(isEnabled) {
    $('#applicationDate').prop('disabled', !isEnabled);
    $('#declareCompanyNo').prop('disabled', !isEnabled);
    $('#declarationNo').prop('disabled', !isEnabled);
    $('#customsImportNo').prop('disabled', !isEnabled);
    $('#importWarehouseDate').prop('disabled', !isEnabled);
    $('#PayTaxDate').prop('disabled', !isEnabled);
    $('#tariffVal').prop('disabled', !isEnabled);
    $('#vatVal').prop('disabled', !isEnabled);
    $('#insurance').prop('disabled', !isEnabled);
    $('#freight').prop('disabled', !isEnabled);
    $('#additionalExpenses').prop('disabled', !isEnabled);
    $('#ddlTariffMarginCategory').prop('disabled', !isEnabled);
    $('#txtTariffMargin').prop('disabled', !isEnabled);
    $('#txtTariffOtherCost').prop('disabled', !isEnabled);
    $('#txtTariffCostDescription').prop('disabled', !isEnabled);
        
}

/**
*匯率資料檢核
*/
function getMonthRate() {
    var rateyn = "Y";
    var today = new Date();    
    var nowday = today.getFullYear() + "-" + (today.getMonth() + 1 < 10 ? '0' : '') + (today.getMonth() + 1) + "-" + (today.getDate() < 10 ? '0' : '') + today.getDate();
    $.ajax({
        url: "/Data/CurrentCustomsRate",
        type: 'POST',
        dataType: 'json',
        async: false,
        data: "BUKRS=" + BUKRS + "&BeginDate=" + nowday,
        success: function (json) {
            for (var i = 0; i < json.length; i++) {
                if (json[i].Currency == "USD" && json[i].BeginDate.substring(0, 7) != nowday.substring(0, 7))
                    rateyn = "N"; //月初匯率資料檢核(多筆僅針對UDS)--例當日為2017-12-01或3號但找不到2017-12的USD資料
            }
        }
    });
    return rateyn;
}


/**
 * Ajax for getting ImportDaily
 */
function getImportDaily() {
    
    var systemNo = $("#txtSystemNo").val();
    var bukrs = $("#hiddenBukrs").val();

    return $.ajax({
        url: "/Customs/GetImportDaily?systemNo=" + systemNo + "&bukrs=" + bukrs,
        type: "GET",
        dataType: "json",
        success: function (data) {
        },
        error: function (jqXHR, textStatus, err) {
        }
    });
}

/**
 * Ajax for getting ImportMaterial
 */
function getImportMaterial() {

    var systemNo = $("#txtSystemNo").val();
    var bukrs = $("#hiddenBukrs").val();

    return $.ajax({
        url: "/Customs/GetImportMaterial?systemNo=" + systemNo + "&bukrs=" + bukrs,
        type: "GET",
        dataType: "json",
        success: function (data) {
        },
        error: function (jqXHR, textStatus, err) {
        }
    });
}


/**
 * Render ImportMaterial to jqGrid
 */
function renderImportMaterial(data) {

    var deferred = $.Deferred();

    $("#" + jqGridID).jqGrid(
        "setGridParam",
        {
            //url: "/Customs/GetImportMaterial",
            //datatype: "json",
            //mtype: "GET",
            //postData: { "SystemNo": $("#txtSystemNo").val(), "BUKRS": $("#bukrs").val() }
            datatype: "local",
            data: data
        }
    ).trigger("reloadGrid");

    $("#" + jqGridID).jqGrid('navGrid', '#pager',
        {
            edit: false, add: false, del: false, search: false, refresh: false,
            view: false, viewicon: 'ace-icon fa fa-search-plus grey',
        });

    deferred.resolve();
    return deferred.promise();
}

/**
 * Render data to ImportDaily columns
 */
function renderImportDaily(data) {

    $('#systemNo').val(data.SystemNo);
    $('#bukrs').val(data.BUKRS);
    $('#applicationDate').val(data.ApplicationDate);
    $('#declareCompanyNo').val(data.DeclareCompany);
    $('#declarationNo').val(data.DeclarationNo);
    $('#customsImportNo').val(data.CustomsImportNo);
    $('#importWarehouseDate').val(data.ImportDate);
    $('#PayTaxDate').val(data.PayTaxDate);
    $('#tariffVal').val(data.TariffVal);
    $('#vatVal').val(data.VATVal);
    $('#insurance').val(data.Insurance);
    $('#freight').val(data.Freight);
    $('#additionalExpenses').val(data.AdditionalExpenses);
    $('#ddlTariffMarginCategory').val(data.TariffMarginCategory);
    $('#txtTariffMargin').val(data.TariffMargin);
    $('#txtTariffOtherCost').val(data.TariffOtherCost);
    $('#txtTariffCostDescription').val(data.TariffCostDescription);
    
}


/**
 * Render data to ImportMateria columns
 */
function createBase(importDaily, importMaterials) {

    base.SystemNo = importDaily.SystemNo; //系統單號
    base.BUKRS = importDaily.BUKRS; //公司代碼
    base.IsClosed = importDaily.IsClosed; //是否結案
    base.TariffVal = importDaily.TariffVal || 0; //稅單進口總關稅
    base.VATVal = importDaily.VATVal || 0; //稅單進口增值稅
    base.Freight = importDaily.Freight || 0;//報關單運費
    base.Insurance = importDaily.Insurance || 0;//報關單保費
    base.AdditionalExpenses = importDaily.AdditionalExpenses || 0;//報關單雜費
    base.IsManualUptSAPTariff = false; //使用者是否自行異動任一筆支付關稅，而非系統算出
    base.OrigSumSAPTariff = 0; //原始在資料庫的SUM(支付關稅) 
    base.Materials = importMaterials;
    base.TariffMarginCategory = importDaily.TariffMarginCategory ; //
    base.TariffMargin = importDaily.TariffMargin || 0; //保證金總額(進入取值供即時計算)
    base.TariffOtherCost = importDaily.TariffOtherCost || 0; //其他進入成本(進入取值供即時計算)
            
    for (let i = 0; i < base.Materials.length; i++) {
        let ml = base.Materials[i];
        ml.RowId = i + 1;
        ml.LSMNG = +ml.LSMNG || 0;//數量
        ml.NETPR = +ml.NETPR || 0;//單價
        ml.Rate = +ml.Rate || 0;//匯率
        ml.Tariff = +ml.Tariff || 0;//進口使用稅率
        ml.SpecialTariff = +ml.SpecialTariff || 0;//特別關稅稅率
        ml.OtherTax = +ml.OtherTax || 0;//其他進口稅率
        ml.EstimatedTariffs = +ml.EstimatedTariffs || 0;//預估關稅
        ml.OtherTaxVal = +ml.OtherTaxVal || 0;//其他稅額
        ml.SAPTariff = +ml.SAPTariff || 0;//支付關稅
        
        //特別計算原始在資料庫的SUM(支付關稅)，用來判斷是否要在Loading時改變各筆支付關稅的值
        base.OrigSumSAPTariff += +ml.SAPTariff;
    }
    
    base.SumPrice = importMaterialStg.calSumPrice(base.Materials);  //計算SUM(數量*單價*匯率)    
    base.SumPrice45 = importMaterialStg.calSumPrice45(base.Materials);  //計算SUM(數量*單價*匯率) 四捨5入   
    base.SumEstimatedTariffs = importMaterialStg.calSumEstimatedTariffs(base.Materials); //計算SUM(預估關稅)
    base.SumOtherTaxVal = importMaterialStg.calSumOtherTaxVal(base.Materials); //計算SUM(其他稅額)        
}


/**
 * Create observables
 */
function createObservables() {


    //Watch 稅單進口總關稅
    let elTariffVal = document.getElementById('tariffVal');
    let tariffVal$ = Rx.Observable.fromEvent(elTariffVal, 'keyup').map(e => e.target.value);
    let subTariffVal$ = tariffVal$.switchMap(delyInput).subscribe(value => {
        base.TariffVal = +value;
        updateBase('稅單進口總關稅');
        renderImportMaterial(base.Materials);
    });
    subscriptions$.push(subTariffVal$);

    //Watch 稅單進口增值稅
    let elVATVal = document.getElementById('vatVal');
    let vatVal$ = Rx.Observable.fromEvent(elVATVal, 'keyup').map(e => e.target.value);
    let subVatVal$ = vatVal$.switchMap(delyInput).subscribe(value => {
        base.VATVal = +value;
        updateBase('稅單進口增值稅');
        renderImportMaterial(base.Materials);
    });
    subscriptions$.push(subVatVal$);


    //Watch 報關單保費
    let elInsurance = document.getElementById('insurance');
    let insurance$ = Rx.Observable.fromEvent(elInsurance, 'keyup').map(e => e.target.value);
    let subInsurance$ = insurance$.switchMap(delyInput).subscribe(value => {
        base.Insurance = +value;
        updateBase('報關單保費');
        renderImportMaterial(base.Materials);
    });
    subscriptions$.push(subInsurance$);

    //Watch 報關單運費
    let elFreight = document.getElementById('freight');
    let freight$ = Rx.Observable.fromEvent(elFreight, 'keyup').map(e => e.target.value);
    let subFreight$ = freight$.switchMap(delyInput).subscribe(value => {
        base.Freight = +value;
        updateBase('報關單運費');
        renderImportMaterial(base.Materials);
    });
    subscriptions$.push(subFreight$);


    //Watch 報關單雜費
    let elAdditionalExpenses = document.getElementById('additionalExpenses');
    let additionalExpenses$ = Rx.Observable.fromEvent(elAdditionalExpenses, 'keyup').map(e => e.target.value);
    let subAdditionalExpenses$ = additionalExpenses$.switchMap(delyInput).subscribe(value => {
        base.AdditionalExpenses = +value;
        updateBase('報關單雜費');
        renderImportMaterial(base.Materials);
    });
    subscriptions$.push(subAdditionalExpenses$);

    //Watch 保證金總額
    let elTariffMargin = document.getElementById('txtTariffMargin');
    let TariffMargin$ = Rx.Observable.fromEvent(elTariffMargin, 'keyup').map(e => e.target.value);
    let subTariffMargin$ = TariffMargin$.switchMap(delyInput).subscribe(value => {
        base.TariffMargin = +value;
        updateBase('保證金總額');
        renderImportMaterial(base.Materials);
    });
    subscriptions$.push(subTariffMargin$);

    //Watch 其他計入成本
    let elTariffOtherCost = document.getElementById('txtTariffOtherCost');
    let TariffOtherCost$ = Rx.Observable.fromEvent(elTariffOtherCost, 'keyup').map(e => e.target.value);
    let subTariffOtherCost$ = TariffOtherCost$.switchMap(delyInput).subscribe(value => {
        base.TariffOtherCost = +value;
        updateBase('其他計入成本');
        renderImportMaterial(base.Materials);
    });
    subscriptions$.push(subTariffOtherCost$);

    //Watch 保證金類別  
    let elTariffMarginCategory = document.getElementById('ddlTariffMarginCategory'); 
    let TariffMarginCategory$ = Rx.Observable.fromEvent(elTariffMarginCategory, 'mouseup').map(e => e.target.value);
    let subTariffMarginCategory$ = TariffMarginCategory$.switchMap(delyInput).subscribe(value => {
        base.TariffMarginCategory = value;        
        updateBase('保證金類別');
        renderImportMaterial(base.Materials);
    });
    subscriptions$.push(subTariffMarginCategory$);
    
}


/**
 * Create observables
 */
function createGridCellObservable(rowid) {

    if (subGridCells$) {
        subGridCells$.forEach(x => {
            x.dispose();
        })
    }

    //Watch 其他稅額
    let elOtherTaxVal = document.getElementById(rowid + "_OtherTaxVal");
    let otherTaxVal$ = Rx.Observable.fromEvent(elOtherTaxVal, 'keyup').map(e => e.target.value);
    let subOtherTaxVal$ = otherTaxVal$.switchMap(delyInput).subscribe(value => {
        base.Materials.find(x => x.RowId == rowid).OtherTaxVal = +value;
        updateBase('其他稅額');
        renderImportMaterial(base.Materials);
    });
    subGridCells$.push(subOtherTaxVal$);


    //Watch 支付關稅
    let elSAPTariff = document.getElementById(rowid + "_SAPTariff");
    let oldSAPTariff = elSAPTariff.value;
    let sapTariff$ = Rx.Observable.fromEvent(elSAPTariff, 'keyup').map(e => {
        return { keyCode: e.keyCode, value: e.target.value, oldValue: oldSAPTariff };
    });
    let subSapTariff$ = sapTariff$.switchMap(delyInput).subscribe(seq => {
        if (seq.value != seq.oldValue) {
            base.Materials.find(x => x.RowId == rowid).SAPTariff = +seq.value;
            updateBase("支付關稅");
            renderImportMaterial(base.Materials);
        }
    });
    subGridCells$.push(subSapTariff$);   
}


/**
 * Unsubscribe observables
 */
function disposeObservables() {

    if (subscriptions$) {
        subscriptions$.forEach(x => {
            x.dispose();
        })
    }

}

/**
 * Delay input
 */
function delyInput(value) {
    return Rx.Observable.of(value).delay(delayInputTime);
}

/**
 * Update jqGrid cells
 */
function updateBase(changedCellTitle) {

    console.log('updateBase!(' + changedCellTitle + ')');

    base.SumPrice = importMaterialStg.calSumPrice(base.Materials);  //計算SUM(數量*單價*匯率)
    base.SumOtherTaxVal = importMaterialStg.calSumOtherTaxVal(base.Materials); //計算SUM(其他稅額)
    
    //(A)指定新值
    base.Materials.forEach(x => {
        x.SapOrigCcyAmt = importMaterialStg.calSapOrigCcyAmt(x.LSMNG, x.NETPR);
        x.PurchaseAmt = importMaterialStg.calPurchaseAmt(x.LSMNG, x.NETPR, x.Rate, base.SumPrice, base.Freight, base.Insurance, base.AdditionalExpenses);
        x.EstimatedTariffs = importMaterialStg.calEstimatedTariffs(x.PurchaseAmt, x.Tariff, x.SpecialTariff, x.OtherTax);        
    });
    base.SumEstimatedTariffs = importMaterialStg.calSumEstimatedTariffs(base.Materials); //計算SUM(預估關稅)

    //預估關稅為0卻輸入進口總關稅提示
    if (base.SumEstimatedTariffs == 0 && base.TariffVal > 0) {
        toastr.warning("資料異常! [預估關稅] 總計為 0 ", { timeOut: 3000 })
    }
    
    //(B)指定新值 : 與(A)有相依性之欄位        
    base.Materials.forEach(x => {
        let newSAPTariff = importMaterialStg.calSAPTariff(x.EstimatedTariffs, x.OtherTaxVal, base.SumEstimatedTariffs, base.SumOtherTaxVal, base.TariffVal);        
        x.ItemTariffMargin = importMaterialStg.calItemTariffMargin(x.PurchaseAmt, base.SumPrice45, base.TariffMargin, base.TariffMarginCategory, base.Freight, base.Insurance, base.AdditionalExpenses);        
        x.ItemTariffOtherCost = importMaterialStg.calItemTariffOtherCost(x.PurchaseAmt, base.SumPrice45, base.TariffOtherCost, base.TariffMarginCategory, base.Freight, base.Insurance, base.AdditionalExpenses);
                
        if (changedCellTitle !== "支付關稅") { //When not editting SAPTariff, calculate the new value

            let isSetToNewSAPTariff = true;

            //當使用者強制改變支付關稅的值並儲存，則下次Loading不主動計算及更新支付關稅
            if (changedCellTitle == "Initial" && x.SAPTariff != null && x.SAPTariff !== newSAPTariff && base.OrigSumSAPTariff !== 0) {
                isSetToNewSAPTariff = false;
            }

            if (isSetToNewSAPTariff === true) {
                x.SAPTariff = newSAPTariff;        
            }            

            //設定是否手動更改支付關稅註記為false
            base.IsManualUptSAPTariff = false;
        }
        else {
            //設定是否手動更改支付關稅註記為true
            base.IsManualUptSAPTariff = true;
        }

    });
    //計算總計
    base.Materials.forEach(x => {        
        x.ItemTariffTotal = importMaterialStg.calItemTariffTotal(x.SAPTariff, x.ItemTariffMargin, x.ItemTariffOtherCost);
    });
}