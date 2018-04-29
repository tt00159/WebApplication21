$(function () {

    $("#form").submit(function (e) {
        if (!$("#form").valid()) {
            AlertErrorMsg("form");
            return false;
        }
        ShowBlockUI();

        //prevent Default functionality
        e.preventDefault();

        $(".tempTable").remove();
        $("#MasterData tr:gt(0)").remove();

        $.ajax({
            type: 'post',
            dataType: 'json',
            data: "SystemNo=" + $("#txtSystemNo").val(),
            success: function (json) {
                //console.log(json);

                if (json.length > 0) {
                    for (i = 0; i < json[0].HSCodeRate.length; i++) {
                        var tr = "<tr>";
                        tr += "<td class='center'>" + json[0].HSCodeRate[i].HSCode + "</td>";
                        tr += "<td class='center'>" + json[0].HSCodeRate[i].Tariff + "</td>";
                        tr += "<td class='center'>" + json[0].HSCodeRate[i].SpecialTariff + "</td>";
                        tr += "<td class='center'>" + json[0].HSCodeRate[i].OtherTax + "</td>";
                        tr += "</tr>";
                        $("#MasterData").append(tr);

                        var detailTable = $("#DetailData").clone();
                        $(detailTable).attr("id", "DetailData" + i);
                        $(detailTable).addClass("tempTable");

                        for (j = 0; j < json[0].HSCodeRate[i].Materials.length; j++) {
                            tr = "<tr>";
                            tr += "<td class='center'>" + json[0].HSCodeRate[i].Materials[j].TKONN_EX + "</td>";
                            tr += "<td class='center'>" + json[0].HSCodeRate[i].Materials[j].MATNR + "</td>";
                            tr += "<td class='text-right'>" + json[0].HSCodeRate[i].Materials[j].LSMNG.toLocaleString() + "</td>";
                            tr += "<td class='center'>" + json[0].HSCodeRate[i].Materials[j].LSMEH + "</td>";
                            tr += "<td class='center'>" + json[0].HSCodeRate[i].Materials[j].NETPR.toLocaleString() + "</td>";
                            tr += "<td class='center'>" + json[0].HSCodeRate[i].Materials[j].WAERS + "</td>";
                            tr += "<td class='center'>" + json[0].HSCodeRate[i].Materials[j].Rate + "</td>";
                            tr += "<td class='text-right'>" + json[0].HSCodeRate[i].Materials[j].PurchaseAmt.toLocaleString() + "</td>";
                            tr += "<td class='text-right'>" + json[0].HSCodeRate[i].Materials[j].EstimatedTariffs.toLocaleString(undefined, { minimumFractionDigits: 2 }) + "</td>";
                            tr += "<td class='text-right'>" + json[0].HSCodeRate[i].Materials[j].OtherTaxVal.toLocaleString() + "</td>";
                            tr += "<td class='text-right'>" + json[0].HSCodeRate[i].Materials[j].SAPTariff.toLocaleString() + "</td>";
                            tr += "<td class='text-right'>" + json[0].HSCodeRate[i].Materials[j].TariffDiffRatio.toFixed(2) + "</td>";
                            tr += "<td class='text-right'>" + round2(json[0].HSCodeRate[i].Materials[j].ItemTariffMargin,2) + "</td>";
                            tr += "<td class='text-right'>" + round2(json[0].HSCodeRate[i].Materials[j].ItemTariffOtherCost,2) + "</td>";
                            tr += "<td class='text-right'>" + round2(json[0].HSCodeRate[i].Materials[j].ItemTariffAmt,2) + "</td>";
                            tr += "</tr>";
                            $(detailTable).append(tr);
                        }
                        if (json[0].HSCodeRate[i].Materials.length > 0) {
                            tr = "<tr><td style='border-right-width: 0px;'></td><td id='MasterRow" + i + "' colspan='3' style='border-left-width: 0px;'></td></tr>";
                            $("#MasterData").append(tr);

                            $("#MasterData #MasterRow" + i).append($(detailTable));
                            detailTable = null;
                        }
                    }

                    $("#lblSystemNo").text(json[0].SystemNo);
                    $("#lblDeclarationNo").text(json[0].DeclarationNo);
                    $("#lblTariffVal").text(json[0].TariffVal.toLocaleString());
                    $("#lblVATVal").text(json[0].VATVal.toLocaleString());
                    $("#lblDeclareFreight").text(json[0].Freight.toLocaleString());
                    $("#lblDeclarePremium").text(json[0].Insurance.toLocaleString());
                    $("#lblDeclareCharges").text(json[0].AdditionalExpenses.toLocaleString());
                    $("#lblTariffMarginCategory_TXT").text(json[0].TariffMarginCategory_TXT);
                    $("#lblTariffMargin").text(json[0].TariffMargin);
                    $("#lblTariffOtherCost").text(json[0].TariffOtherCost);
                    $("#lblTariffCostDescription").text(json[0].TariffCostDescription);
                    $("#lblDeclareCompany").text(json[0].DeclareCompany);
                    $("#lblOutsourceDeclareCompany").text(json[0].OutsourceDeclareCompany);
                    $("#lblDelegateDeclarationNo").text(json[0].DelegateDeclarationNo);
                    //ResultData區域顯示
                    $("#ResultData").show();
                    $("#btnPrint").show();
                    $("#NoDataFound").hide();
                }
                else {
                    $("#NoDataFound").show();
                    $("#ResultData").hide();
                    $("#btnPrint").hide();
                }
                convertChineseLang();
                CloseBlockUI();
            }
        });
    });

    var vSystemNo = decodeURI(QueryString("SystemNo"));
    if (vSystemNo != undefined && vSystemNo.length > 0) {
        $("#txtSystemNo").val(vSystemNo);
        var menu = window.parent.document.getElementById("ReportBondedToDutyTariff");
        $(menu).attr("url", "/Report/BondedToDutyTariff");
        $("#btnSubmit").click();
    }

    $("#btnPrint").click(function () {
        window.open('/Static/PrintData.html', '保稅轉完稅付稅', config = 'left=0,top=0,height=500,width=1000,toolbar=no,scrollbars=no,resizable=no,location=no,menubar=no,status=no');
    });
});
