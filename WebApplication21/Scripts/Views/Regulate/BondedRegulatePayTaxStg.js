var RegulateMaterialDetailStg = {};
RegulateMaterialDetailStg.precision = 2;


/*
 * 計算SUM(數量*單價*匯率)
 */
RegulateMaterialDetailStg.calSumPrice = function (arr) {
    let sum = 0;
    arr.forEach(x => {
        sum += x.LSMNG * x.NETPR * x.Rate;
    })

    return sum;
}


/*
 * 計算SUM(預估關稅)
 */
RegulateMaterialDetailStg.calSumEstimatedTariffs = function (arr) {


    let sum = 0;
    arr.forEach(x => {
        sum += +x.EstimatedTariffs 
    })

    return sum;
}

/*
 * 計算SUM(其他稅額)
 */
RegulateMaterialDetailStg.calSumOtherTaxVal = function (arr) {
    let sum = 0;
    arr.forEach(x => {
        sum += +x.OtherTaxVal
    })

    return sum;
}

/*
 * 計算SUM(支付關稅)
 */
RegulateMaterialDetailStg.calSumSAPTariff = function (arr) {
    let sum = 0;
    arr.forEach(x => {
        sum += +x.SAPTariff
    })

    return sum.toFixed(RegulateMaterialDetailStg.precision);
}




/*
 * 計算SAP原幣金額
 */
RegulateMaterialDetailStg.calSapOrigCcyAmt = function (LSMNG, NETPR) {
    return +(LSMNG * NETPR).toFixed(RegulateMaterialDetailStg.precision);
}

/*
 * 計算進貨金額(取整數)
 * LSMNG(數量),NETPR(單價), Rate(匯率), SumPrice(SUM(數量*單價*匯率)), Freight(報關單運費), Insurance(報關單保費), AdditionalExpenses(報關單雜費)
 */
RegulateMaterialDetailStg.calPurchaseAmt = function (LSMNG, NETPR, Rate, SumPrice, Freight, Insurance, AdditionalExpenses) {

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
 * 計算SUM(進貨金額含已分攤)
 */
RegulateMaterialDetailStg.calSumPurchaseAmt = function (arr) {

    let sum = 0;
    arr.forEach(x => {
        sum += +x.PurchaseAmt
    })

    return sum;
}


/*
 * 計算Item保證金額 
 */
RegulateMaterialDetailStg.calItemTariffMargin = function (PurchaseAmt, SUMPurchaseAmt, TariffMargin, TariffMarginCategory) {    
    let result=0;
    //(進貨金額) /SUM(進貨金額) * 表頭保證金總額/1.17  (暫扣稅費不計算成本MCA)
    if (TariffMarginCategory == 'MCB') {        
        result = PurchaseAmt / SUMPurchaseAmt * (TariffMargin / 1.17);
    }
    return round2(result,2);
}

/*
 * 計算Item其他成本
 */
RegulateMaterialDetailStg.calItemTariffOtherCost = function (PurchaseAmt, SUMPurchaseAmt, TariffOtherCost, TariffMarginCategory) {
        
    //(進貨金額) /SUM(進貨金額) * 表頭其他成本總額 
    let result = PurchaseAmt / SUMPurchaseAmt * TariffOtherCost;    
    return round2(result, 2);
}


/*
 * 計算預估關稅
 * tariff(進口使用稅率), specialTariff(特別關稅稅率),otherTax(其他進口稅率)
 */
RegulateMaterialDetailStg.calEstimatedTariffs = function (PurchaseAmt, Tariff, SpecialTariff, OtherTax) {

    //console.log('purchaseAmt=' + PurchaseAmt);
    //console.log('tariff=' + tariff); 
    //console.log('specialTariff=' + specialTariff); 
    //console.log('otherTax=' + otherTax); 


    //預估關稅 = 進貨金額 * ((進口使用稅率 + 特別關稅稅率 + 其他進口稅率)/100)
    let estimatedTariffs = PurchaseAmt * ((+Tariff + +SpecialTariff + +OtherTax) / 100);
    //console.log('estimatedTariffs=' + round2(+estimatedTariffs, 2));
    //return +estimatedTariffs.toFixed(RegulateMaterialDetailStg.precision);
    return round2(+estimatedTariffs, RegulateMaterialDetailStg.precision);
}


/*
 * 計算支付關稅
 * EstimatedTariffs(預估關稅), OtherTaxVal(其他稅額), SumEstimatedTariffs(SUM(預估關稅)),SumOtherTaxVal(SUM(其他稅額)), TariffVal(稅單進口總關稅)
 */
RegulateMaterialDetailStg.calSAPTariff = function (EstimatedTariffs, OtherTaxVal, SumEstimatedTariffs, SumOtherTaxVal, TariffVal, isAccurate) {


    //console.log('EstimatedTariffs=' + EstimatedTariffs);
    //console.log('OtherTaxVal=' + OtherTaxVal);
    //console.log('SumEstimatedTariffs=' + SumEstimatedTariffs);
    //console.log('SumOtherTaxVal=' + SumOtherTaxVal);
    //console.log('TariffVal=' + TariffVal);

    //支付關稅 = ( [預估關稅] + [其他稅額] ) / SUM( [預估關稅] + [其他稅額] ) * [稅單進口總關稅]
    let sapTariff = (+EstimatedTariffs + +OtherTaxVal) / (+SumEstimatedTariffs + +SumOtherTaxVal) * +TariffVal;
    sapTariff = isNaN(sapTariff) ? 0 : sapTariff;
    if (!isAccurate)
        return +sapTariff.toFixed(RegulateMaterialDetailStg.precision);
    else
        return +sapTariff;
}


/*
 * 計算關稅差異比率
 */
RegulateMaterialDetailStg.calTariffDiffRatio = function (arr) {

    let sumEstimatedTariffs = 0; //SUM(預估關稅)
    let sumOtherTaxVal = 0; //SUM(其他稅額)
    let sumSAPTariff = 0; //SUM(支付關稅)

    arr.forEach(x => {
        sumEstimatedTariffs += +x.EstimatedTariffs;
        sumOtherTaxVal += +x.OtherTaxVal;
        sumSAPTariff += +x.SAPTariff;
    });

    ////關稅差異比率 = 1 – (( SUM(預估關稅) + SUM(其他稅額)) / SUM(支付關稅)) * 100    
    //let tariffDiffRatio = (1 - ((+sumEstimatedTariffs + +sumOtherTaxVal) / sumSAPTariff)) * 100;
    //tariffDiffRatio = parseInt(tariffDiffRatio.toFixed(0));
    //tariffDiffRatio = isNaN(tariffDiffRatio) ? 0 : tariffDiffRatio;
    //return tariffDiffRatio;

    //修訂成關稅差異金額
    let tariffDiffRatio = (+sumEstimatedTariffs + +sumOtherTaxVal) - sumSAPTariff;
    return round2(tariffDiffRatio,2);
}