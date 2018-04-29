$(function () {

    ShowBlockUI();

    $("#ResultData").show();

    reloadGrid(
        JSON.stringify(
        {
            "groupOp": "AND",
            "rules":
                [
                    { "field": "BUKRS", "op": "eq", "data": BUKRS }
                ]
        })
    );

})

