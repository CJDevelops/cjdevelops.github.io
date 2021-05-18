$(document).ready(function () {
    $(".before .unselected").click(function () {
        $(this).parent().children().removeClass('selected');
        $(this).addClass('selected');
        beforeLevel = (parseInt(this.textContent));
        if(afterLevel != 0) {
            calculateValor();
        };
    });
    $(".after .unselected").click(function () {
        $(this).parent().children().removeClass('selected');
        $(this).addClass('selected');
        afterLevel = (parseInt(this.textContent));
        if(beforeLevel != 0) {
            calculateValor();
        };
    });
    $(".atype .unselected").click(function () {
        $(this).parent().children().removeClass('selected');
        $(this).addClass('selected');
        atype = (this.textContent.trim());
        if(beforeLevel != 0) {
            calculateValor();
        };
    });
});

var beforeLevel = 0;
var afterLevel = 0;
modifier = 250;
atype = "Shield / Offhand / Ring / Cloak / Bracer / Neck";

var levelsPossible = [184,187,190,194,197,200,203,207,210,213,216,220];

function calculateValor() {
    if(atype == "Shield / Offhand / Ring / Cloak / Bracer / Neck") {modifier = 250};
    if(atype == "Trinket / Belt / Shoulder / Gloves / Boots") {modifier = 400};
    if(atype == "Helm / Legs / Chest") {modifier = 475};
    if(atype == "1h Agi/Str Weapon") {modifier = 500};
    if(atype == "1h Int Weapon") {modifier = 750};
    if(atype == "2h Weapon") {modifier = 1000};

    stages = levelsPossible.indexOf(afterLevel) - levelsPossible.indexOf(beforeLevel)
    if(stages > 0) {
        final = stages * modifier;
        $(".result").text("You need : " + final + " Valor");
    };
};