var importMaterialStg = {};
importMaterialStg.precision = 4;


/*
 * 計算SUM(數量*單價*匯率)
 */
importMaterialStg.calSumPrice = function (arr) {
    let sum = 0;
    arr.forEach(x => {
        sum += x.LSMNG * x.NETPR * x.Rate;
    })

    return sum;
}

/*
 * 計算SUM(數量*單價*匯率)四捨5入到整數位
 */
importMaterialStg.calSumPrice45 = function (arr) {
    let sum = 0;
    arr.forEach(x => {        
        sum += round2(x.LSMNG * x.NETPR * x.Rate, 0);
    })
    
    return sum;
}

/*
 * 計算SUM(預估關稅)
 */
importMaterialStg.calSumEstimatedTariffs = function (arr) {


    let sum = 0;
    arr.forEach(x => {
        sum += +x.EstimatedTariffs 
    })

    return sum;
}

/*
 * 計算SUM(其他稅額)
 */
importMaterialStg.calSumOtherTaxVal = function (arr) {
    let sum = 0;
    arr.forEach(x => {
        sum += +x.OtherTaxVal
    })

    return sum;
}

/*
 * 計算SUM(支付關稅)
 */
importMaterialStg.calSumSAPTariff = function (arr) {
    let sum = 0;
    arr.forEach(x => {
        sum += +x.SAPTariff
    })

    return sum.toFixed(importMaterialStg.precision);
}




/*
 * 計算SAP原幣金額
 */
importMaterialStg.calSapOrigCcyAmt = function (LSMNG, NETPR) {
    return +(LSMNG * NETPR).toFixed(importMaterialStg.precision);
}

/*
 * 計算進貨金額(取整數)
 * LSMNG(數量),NETPR(單價), Rate(匯率), SumPrice(SUM(數量*單價*匯率)), Freight(報關單運費), Insurance(報關單保費), AdditionalExpenses(報關單雜費)
 */
importMaterialStg.calPurchaseAmt = function (LSMNG, NETPR, Rate, SumPrice, Freight, Insurance, AdditionalExpenses) {

    //console.log('LSMNG=' + LSMNG); 
    //console.log('NETPR=' + NETPR); 
    //console.log('Rate=' + Rate); 
    //console.log('SumPrice=' + SumPrice); 
    //console.log('Freight=' + Freight); 
    //console.log('Insurance=' + Insurance); 
    //console.log('AdditionalExpenses=' + AdditionalExpenses); 

    //(數量*單價*匯率)/SUM(數量*單價*匯率)* ( SUM(數量*單價*匯率) + 報關單運費 + 報關單保費 + 報關單雜費)
    //let result = (LSMNG * NETPR * Rate / SumPrice) * (+SumPrice + +Freight + +Insurance + +AdditionalExpenses);

    //(數量*單價*匯率) + ( (報關單運費 + 報關單保費 + 報關單雜費) * ((數量*單價*匯率) / SUM(數量*單價*匯率)) )
    let result = (LSMNG * NETPR * Rate) + ((+Freight + +Insurance + +AdditionalExpenses) * ((LSMNG * NETPR * Rate) / +SumPrice));
    //console.log('result - PurchaseAmt = ' + result);
    //↓無條件捨去
    //return parseInt(result);
    //↓四捨五入
    return result.toFixed(0);
}

/*
 * 計算預估關稅
 * tariff(進口使用稅率), specialTariff(特別關稅稅率),otherTax(其他進口稅率)
 */
importMaterialStg.calEstimatedTariffs = function (PurchaseAmt, Tariff, SpecialTariff, OtherTax) {

    //console.log('PurchaseAmt=' + PurchaseAmt);
    //console.log('tariff=' + tariff); 
    //console.log('specialTariff=' + specialTariff); 
    //console.log('otherTax=' + otherTax); 


    //預估關稅 = 進貨金額 * ((進口使用稅率 + 特別關稅稅率 + 其他進口稅率)/100)
    let estimatedTariffs = PurchaseAmt * ((+Tariff + +SpecialTariff + +OtherTax) / 100);
    //console.log('estimatedTariffs=' + round2(+estimatedTariffs, 2));
    //return +estimatedTariffs.toFixed(importMaterialStg.precision);
    return round2(+estimatedTariffs, importMaterialStg.precision);
}


/*
 * 計算支付關稅
 * EstimatedTariffs(預估關稅), OtherTaxVal(其他稅額), SumEstimatedTariffs(SUM(預估關稅)),SumOtherTaxVal(SUM(其他稅額)), TariffVal(稅單進口總關稅)
 */
importMaterialStg.calSAPTariff = function (EstimatedTariffs, OtherTaxVal, SumEstimatedTariffs, SumOtherTaxVal, TariffVal, isAccurate) {


    //console.log('EstimatedTariffs=' + EstimatedTariffs);
    //console.log('OtherTaxVal=' + OtherTaxVal);
    //console.log('SumEstimatedTariffs=' + SumEstimatedTariffs);
    //console.log('SumOtherTaxVal=' + SumOtherTaxVal);
    //console.log('TariffVal=' + TariffVal);

    //支付關稅 = ( [預估關稅] + [其他稅額] ) / SUM( [預估關稅] + [其他稅額] ) * [稅單進口總關稅]
    let sapTariff = (+EstimatedTariffs + +OtherTaxVal) / (+SumEstimatedTariffs + +SumOtherTaxVal) * +TariffVal;
    sapTariff = isNaN(sapTariff) ? 0 : sapTariff;
    if (!isAccurate)
        return +sapTariff.toFixed(importMaterialStg.precision);
    else
        return +sapTariff;
}


/*
 * 計算保證金額
 * PurchaseAmt(進貨金額), SumPrice(進貨總額), TariffMargin(保證金總額)
 */
importMaterialStg.calItemTariffMargin = function (PurchaseAmt, SumPrice, TariffMargin, TariffMarginCategory, Freight, Insurance, AdditionalExpenses) {
        
    //保證金額 = (進貨金額) / SUM(45進貨總金額+保費+運費+雜費) * (表頭保證金總額/1.17)  ////保證金額 = ( 進貨金額 ) / SUM( 進貨金額 ) * [保證金總額]
    let ItemTariffMargin = (+PurchaseAmt) / (+SumPrice + +Freight + +Insurance + +AdditionalExpenses) * +(TariffMargin / 1.17);
    ItemTariffMargin = isNaN(ItemTariffMargin) ? 0 : ItemTariffMargin;
    if (TariffMarginCategory == "MCA")  //MCA暫付款不計成本  MCB預付款要計成本
        return 0;
    else
        return +ItemTariffMargin.toFixed(2);        
}


/*
 * 計算其他計入成本
 * PurchaseAmt(進貨金額), SumPrice(進貨總額), TariffOtherCost(其他計入成本)
 */
importMaterialStg.calItemTariffOtherCost = function (PurchaseAmt, SumPrice, TariffOtherCost, TariffMarginCategory, Freight, Insurance, AdditionalExpenses) {
    //保證金額 = ( 進貨金額 ) / SUM( 進貨金額 ) * [其他計入成本]
    let ItemTariffOtherCost = (+PurchaseAmt) / (+SumPrice + +Freight + +Insurance + +AdditionalExpenses) * +TariffOtherCost;    
    ItemTariffOtherCost = isNaN(ItemTariffOtherCost) ? 0 : ItemTariffOtherCost;
    return +ItemTariffOtherCost.toFixed(2);  //暫扣稅費不連動此欄
}


/*
 * 計算付稅總計
 * SAPTariff(支付關稅), TariffMargin(保證金額), TariffOtherCost(其他計入成本)
 */
importMaterialStg.calItemTariffTotal = function (SAPTariff, TariffMargin, TariffOtherCost) {
    //計算付稅總計 = ( 支付關稅 ) + ( 保證金額 ) + (其他計入成本)
    let ItemTariffTotal = round2(+SAPTariff, 2) + round2(+TariffMargin, 2) + round2(+TariffOtherCost,2);
    
    
    ItemTariffTotal = isNaN(ItemTariffTotal) ? 0 : ItemTariffTotal;    
    return +ItemTariffTotal.toFixed(2);
}

/*
 * 計算關稅差異比率
 */
importMaterialStg.calTariffDiffRatio = function (arr) {

    let sumEstimatedTariffs = 0; //SUM(預估關稅)
    let sumOtherTaxVal = 0; //SUM(其他稅額)
    let sumSAPTariff = 0; //SUM(支付關稅)

    arr.forEach(x => {
        sumEstimatedTariffs += +x.EstimatedTariffs;
        sumOtherTaxVal += +x.OtherTaxVal;
        sumSAPTariff += +x.SAPTariff;
    });

    //關稅差異比率 = 1 – (( SUM(預估關稅) + SUM(其他稅額)) / SUM(支付關稅)) * 100  //原百分比
    //let tariffDiffRatio = (1 - ((+sumEstimatedTariffs + +sumOtherTaxVal) / sumSAPTariff)) * 100; //原百分比
    //關稅差異比率 =  SUM(預估關稅) + SUM(其他稅額) - SUM(支付關稅)  //原百分比修訂為元
    let tariffDiffRatio = +sumEstimatedTariffs + +sumOtherTaxVal - sumSAPTariff ;

    //tariffDiffRatio = parseInt(tariffDiffRatio.toFixed(0));  //原百分比
    tariffDiffRatio = isNaN(tariffDiffRatio) ? 0 : tariffDiffRatio;
    return tariffDiffRatio.toFixed(2);
}