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
        if (getMonthRate() == "N") {
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
        var promiseId = getRegulateMaterialMaster();
        var promiseIm = getRegulateMaterialDetail();

        $.when(promiseId, promiseIm).done((rtnId, rtnIm) => {

            if (rtnId && rtnId[0] && !jQuery.isEmptyObject(rtnId[0])) {
                let RegulateMaterialMaster = rtnId[0]; //The ajax returns {object, status}
                let RegulateMaterialDetails = rtnIm[0]; //The ajax returns {object, status}

                //Render RegulateMaterialMaster
                renderRegulateMaterialMaster(RegulateMaterialMaster);
                
                //Create base model
                createBase(RegulateMaterialMaster, RegulateMaterialDetails);
                updateBase('Initial');
                renderRegulateMaterialDetail(base.Materials).then(() => {
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
            console.log("fail call when");
            console.log(data);
            console.log(err);
            CloseBlockUI();
        });
    });

    /*
     * Update callback
     */
    $("#btnUpdate").click(function () {
        
        //Set base RegulateMaterialMaster values from dom
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
        let updateData = { materials: [] };
        updateData.SystemNo = base.SystemNo;
        updateData.BUKRS = base.BUKRS;
        updateData.ApplicationDate = base.ApplicationDate;
        updateData.DeclareCompany = base.DeclareCompany;
        updateData.DeclarationNo = base.DeclarationNo;
        updateData.CustomsImportNo = base.CustomsImportNo;
        updateData.ImportDate = base.ImportDate;
        updateData.PayTaxDate = base.PayTaxDate;
        updateData.TariffVal = base.TariffVal;
        updateData.VATVal = base.VATVal;
        updateData.Insurance = base.Insurance;
        updateData.Freight = base.Freight;
        updateData.AdditionalExpenses = base.AdditionalExpenses;
        updateData.TariffMarginCategory = base.TariffMarginCategory;
        updateData.TariffMargin = base.TariffMargin;
        updateData.TariffOtherCost = base.TariffOtherCost;
        updateData.TariffCostDescription = base.TariffCostDescription;
        
        updateData.Materials = [];

        for (let i = 0; i < base.Materials.length; i++) {
            let ml = base.Materials[i];

            updateData.Materials.push({
                SystemNo: base.SystemNo,
                BUKRS: base.BUKRS,
                MATNR: ml.MATNR,
                WHUIT: ml.WHUIT,
                Rate: ml.Rate,
                OtherTaxVal: ml.OtherTaxVal,
                SAPTariff: ml.SAPTariff,
                ItemTariffMargin: ml.ItemTariffMargin,
                ItemTariffOtherCost: ml.ItemTariffOtherCost
            });
        }

        //console.log(JSON.stringify(updateData));
        //return;
        ShowBlockUI();
        let putUri = "/Regulate/UpdateRegulateTariff";
        $.ajax({
            url: putUri,
            type: "PUT",
            data: JSON.stringify(updateData),
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            timeout: 5000,
            success: function (json) {
                CloseBlockUI();
                bootbox.confirm({
                    message: "<br />資料處理完畢！<br />請問是否要前往打印頁面？",
                    callback: function (result) {
                        if (result) {
                            var menu = window.parent.document.getElementById("ReportBondedToDutyTariff");
                            $(menu).attr("url", "/Report/BondedToDutyTariff?SystemNo=" + $("#txtSystemNo").val());
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

        if ($(this).val().length > 0){
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
                        renderRegulateMaterialDetail(base.Materials);

                        CloseBlockUI();
                    },
                    error: function () {
                        AlertErrorMsg("form", "查無此日期 (" + $(this).val() + ") 的匯率！");

                        CloseBlockUI();
                    }
                });
            }
        }
        else
        {
            base.Materials.forEach(x => {
                x.Rate = '';
            });

            updateBase('付稅日期');
            renderRegulateMaterialDetail(base.Materials);

            CloseBlockUI();
        }
    });

    /*
     * Set Menu URL 
     */
    var vSystemNo = decodeURI(QueryString("SystemNo"));
    if (vSystemNo != undefined && vSystemNo.length > 0) {
        $("#txtSystemNo").val(vSystemNo);
        var menu = window.parent.document.getElementById("RegulateBondedRegulatePayTax");
        $(menu).attr("url", "/Regulate/BondedRegulatePayTax");
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
    let sumSAPTariff = RegulateMaterialDetailStg.calSumSAPTariff(base.Materials);

    //console.log("SUM(支付關稅) ="+ +sumSAPTariff);
    //console.log("稅單進口總關稅 ="+ +base.TariffVal);

    if (base.IsManualUptSAPTariff==true && + sumSAPTariff !== +base.TariffVal) {
        alert('稅單進口總關稅加總不平!');
        return false;
    }


    return true;

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


function eableInputs(isEnabled) {
    //$('#declarationNo').prop('disabled', !isEnabled);
    //$('#customsImportNo').prop('disabled', !isEnabled);
    $('#PayTaxDate').prop('disabled', !isEnabled);
    $('#tariffVal').prop('disabled', !isEnabled);
    $('#vatVal').prop('disabled', !isEnabled);
    $('#insurance').prop('disabled', !isEnabled);
    $('#freight').prop('disabled', !isEnabled);
    $('#additionalExpenses').prop('disabled', !isEnabled);    
}

/**
 * Ajax for getting RegulateMaterialMaster
 */
function getRegulateMaterialMaster() {

    var systemNo = $("#txtSystemNo").val();

    return $.ajax({
        url: "/Regulate/BondedRegulate?systemNo=" + systemNo + "&RegulateType=BondedToDuty",
        type: "GET",
        dataType: "json",
        success: function (data) {            
        },
        error: function (jqXHR, textStatus, err) {
        }
    });
}

/**
 * Ajax for getting RegulateMaterialDetail
 */
function getRegulateMaterialDetail() {

    var systemNo = $("#txtSystemNo").val();
    return $.ajax({
        url: "/Regulate/BondedRegulateMaterial?systemNo=" + systemNo + "&IO=I&isShowView=false",
        type: "GET",
        dataType: "json",
        success: function (data) {
        },
        error: function (jqXHR, textStatus, err) {
        }
    });
}


/**
 * Render RegulateMaterialDetail to jqGrid
 */
function renderRegulateMaterialDetail(data) {

    var deferred = $.Deferred();

    $("#" + jqGridID).jqGrid(
        "setGridParam",
        {
            //url: "/Regulate/BondedRegulateMaterial",
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
 * Render data to RegulateMaterialMaster columns
 */
function renderRegulateMaterialMaster(data) {

    $('#systemNo').val(data.SystemNo);
    $('#bukrs').val(data.BUKRS);
    //$('#declarationNo').val(data.DeclarationNo);
    //$('#customsImportNo').val(data.CustomsImportNo);
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
function createBase(RegulateMaterialMaster, RegulateMaterialDetails) {

    //console.log("=== RegulateMaterialMaster ===");
    //console.log(RegulateMaterialMaster);
    //console.log("=== RegulateMaterialDetails ===");
    //console.log(RegulateMaterialDetails);

    base.SystemNo = RegulateMaterialMaster.SystemNo; //系統單號
    base.BUKRS = RegulateMaterialMaster.BUKRS; //公司代碼
    base.IsClosed = RegulateMaterialMaster.IsClosed; //是否結案
    base.TariffVal = RegulateMaterialMaster.TariffVal || 0; //稅單進口總關稅
    base.VATVal = RegulateMaterialMaster.VATVal || 0; //稅單進口增值稅
    base.Freight = RegulateMaterialMaster.Freight || 0;//報關單運費
    base.Insurance = RegulateMaterialMaster.Insurance || 0;//報關單保費
    base.AdditionalExpenses = RegulateMaterialMaster.AdditionalExpenses || 0;//報關單雜費
    base.IsManualUptSAPTariff = false; //使用者是否自行異動任一筆支付關稅，而非系統算出
    base.OrigSumSAPTariff = 0; //原始在資料庫的SUM(支付關稅) 
    base.TariffMarginCategory = RegulateMaterialMaster.TariffMarginCategory; //表頭保證金類別
    base.TariffMargin = RegulateMaterialMaster.TariffMargin; //表頭保證金總額
    base.TariffOtherCost = RegulateMaterialMaster.TariffOtherCost; //表頭其他成本總額
    base.Materials = RegulateMaterialDetails;
    
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
        ml.ItemTariffMargin = +ml.ItemTariffMargin || 0; //保證金額
        ml.ItemTariffOtherCost = +ml.ItemTariffOtherCost || 0; //保證金額

        //特別計算原始在資料庫的SUM(支付關稅)，用來判斷是否要在Loading時改變各筆支付關稅的值
        base.OrigSumSAPTariff += +ml.SAPTariff;
    }
    //console.log("=== base ===");
    //console.log(base);

    base.SumPrice = RegulateMaterialDetailStg.calSumPrice(base.Materials);  //計算SUM(數量*單價*匯率)
    base.SumEstimatedTariffs = RegulateMaterialDetailStg.calSumEstimatedTariffs(base.Materials); //計算SUM(預估關稅)
    base.SumOtherTaxVal = RegulateMaterialDetailStg.calSumOtherTaxVal(base.Materials); //計算SUM(其他稅額)    
    base.SumPurchaseAmt = RegulateMaterialDetailStg.calSumPurchaseAmt(base.Materials);  //*取得總進貨金額(含分攤後)

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
        renderRegulateMaterialDetail(base.Materials);
    });
    subscriptions$.push(subTariffVal$);

    //Watch 稅單進口增值稅
    let elVATVal = document.getElementById('vatVal');
    let vatVal$ = Rx.Observable.fromEvent(elVATVal, 'keyup').map(e => e.target.value);
    let subVatVal$ = vatVal$.switchMap(delyInput).subscribe(value => {
        base.VATVal = +value;
        updateBase('稅單進口增值稅');
        renderRegulateMaterialDetail(base.Materials);
    });
    subscriptions$.push(subVatVal$);


    //Watch 報關單保費
    let elInsurance = document.getElementById('insurance');
    let insurance$ = Rx.Observable.fromEvent(elInsurance, 'keyup').map(e => e.target.value);
    let subInsurance$ = insurance$.switchMap(delyInput).subscribe(value => {
        base.Insurance = +value;
        updateBase('報關單保費');
        renderRegulateMaterialDetail(base.Materials);
    });
    subscriptions$.push(subInsurance$);

    //Watch 報關單運費
    let elFreight = document.getElementById('freight');
    let freight$ = Rx.Observable.fromEvent(elFreight, 'keyup').map(e => e.target.value);
    let subFreight$ = freight$.switchMap(delyInput).subscribe(value => {
        base.Freight = +value;
        updateBase('報關單運費');
        renderRegulateMaterialDetail(base.Materials);
    });
    subscriptions$.push(subFreight$);

    //Watch 報關單雜費
    let elAdditionalExpenses = document.getElementById('additionalExpenses');
    let additionalExpenses$ = Rx.Observable.fromEvent(elAdditionalExpenses, 'keyup').map(e => e.target.value);
    let subAdditionalExpenses$ = additionalExpenses$.switchMap(delyInput).subscribe(value => {
        base.AdditionalExpenses = +value;
        updateBase('報關單雜費');
        renderRegulateMaterialDetail(base.Materials);
    });
    subscriptions$.push(subAdditionalExpenses$);

    //Watch 保證金類別
    let elTariffMarginCategory = document.getElementById('ddlTariffMarginCategory');
    let ddlTariffMarginCategory$ = Rx.Observable.fromEvent(elTariffMarginCategory, 'mouseup').map(e => e.target.value);
    let subTariffMarginCategory$ = ddlTariffMarginCategory$.switchMap(delyInput).subscribe(value => {
        base.TariffMarginCategory = value;   //不可取+value ??     
        updateBase('保證金類別');
        renderRegulateMaterialDetail(base.Materials);
    });
    subscriptions$.push(subTariffMarginCategory$);
   
    
    //Watch 保證金總額
    let elTariffMargin = document.getElementById('txtTariffMargin');
    let txtTariffMargin$ = Rx.Observable.fromEvent(elTariffMargin, 'keyup').map(e => e.target.value);
    let subTariffMargin$ = txtTariffMargin$.switchMap(delyInput).subscribe(value => {
        base.TariffMargin = +value;        
        updateBase('保證金總額');
        renderRegulateMaterialDetail(base.Materials);
    });
    subscriptions$.push(subTariffMargin$);    

    //Watch 其他成本總額
    let elTariffOtherCost = document.getElementById('txtTariffOtherCost');
    let txtTariffOtherCost$ = Rx.Observable.fromEvent(elTariffOtherCost, 'keyup').map(e => e.target.value);
    let subTariffOtherCost$ = txtTariffOtherCost$.switchMap(delyInput).subscribe(value => {
        base.TariffOtherCost = +value;
        updateBase('其他成本總額');
        renderRegulateMaterialDetail(base.Materials);
    });
    subscriptions$.push(subTariffOtherCost$);

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
        renderRegulateMaterialDetail(base.Materials);
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
            renderRegulateMaterialDetail(base.Materials);
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

    base.SumPrice = RegulateMaterialDetailStg.calSumPrice(base.Materials);  //計算SUM(數量*單價*匯率)
    base.SumOtherTaxVal = RegulateMaterialDetailStg.calSumOtherTaxVal(base.Materials); //計算SUM(其他稅額)


    //(A)指定新值
    base.Materials.forEach(x => {
        x.SapOrigCcyAmt = RegulateMaterialDetailStg.calSapOrigCcyAmt(x.LSMNG, x.NETPR);
        x.PurchaseAmt = RegulateMaterialDetailStg.calPurchaseAmt(x.LSMNG, x.NETPR, x.Rate, base.SumPrice, base.Freight, base.Insurance, base.AdditionalExpenses);
        x.EstimatedTariffs = RegulateMaterialDetailStg.calEstimatedTariffs(x.PurchaseAmt, x.Tariff, x.SpecialTariff, x.OtherTax);        
    });
    base.SumEstimatedTariffs = RegulateMaterialDetailStg.calSumEstimatedTariffs(base.Materials); //計算SUM(預估關稅)
    base.SumPurchaseAmt = RegulateMaterialDetailStg.calSumPurchaseAmt(base.Materials);  //*取得總進貨金額(含分攤後)
    //預估關稅為0卻輸入進口總關稅提示
    if (base.SumEstimatedTariffs == 0 && base.TariffVal > 0) {
        alert("資料異常請確認!(表身 [預估關稅] 總計為 0 , 表頭[稅單進口總關稅]不為 0)");
    }

    //(B)指定新值 : 與(A)有相依性之欄位    
    base.Materials.forEach(x => {
        let newSAPTariff = RegulateMaterialDetailStg.calSAPTariff(x.EstimatedTariffs, x.OtherTaxVal, base.SumEstimatedTariffs, base.SumOtherTaxVal, base.TariffVal);
        x.ItemTariffMargin = RegulateMaterialDetailStg.calItemTariffMargin(x.PurchaseAmt, base.SumPurchaseAmt, base.TariffMargin, base.TariffMarginCategory);  //*計算保證金額
        x.ItemTariffOtherCost = RegulateMaterialDetailStg.calItemTariffOtherCost(x.PurchaseAmt, base.SumPurchaseAmt, base.TariffOtherCost, base.TariffMarginCategory);  //*計算其他成本
        x.ItemTariffAmt = (newSAPTariff + x.ItemTariffMargin + x.ItemTariffOtherCost);  //*計算總計

        if (changedCellTitle !== "支付關稅") { //When not editting SAPTariff, calculate the new value

            let isSetToNewSAPTariff = true;

            //當使用者強制改變支付關稅的值並儲存，則下次Loading不主動計算及更新支付關稅
            if (changedCellTitle == "Initial" && x.SAPTariff != null && x.SAPTariff !== newSAPTariff && base.OrigSumSAPTariff !== 0) {
                isSetToNewSAPTariff = false;
            }

            if (isSetToNewSAPTariff === true)
                x.SAPTariff = newSAPTariff;

            //設定是否手動更改支付關稅註記為false
            base.IsManualUptSAPTariff = false;
        }
        else {
            //設定是否手動更改支付關稅註記為true
            base.IsManualUptSAPTariff = true;
        }

    });
}