$(document).ready(function () {
    $(".before .unselected").click(function () {
        cssmod($(this));
        beforeLevel = (parseInt(this.textContent));
        if (afterLevel != 0) {
            calculateValor();
        };
    });
    $(".after .unselected").click(function () {
        cssmod($(this));
        afterLevel = (parseInt(this.textContent));
        if (beforeLevel != 0) {
            calculateValor();
        };
    });
    $(".atype .unselected").click(function () {
        cssmod($(this));
        armortype = (this.textContent.trim());
        if (beforeLevel != 0) {
            calculateValor();
        };
    });
});

// Defaults
var beforeLevel = 0;
var afterLevel = 0;
var armortype = "Shield / Offhand / Ring / Cloak / Bracer / Neck"
var atype = new Map();

atype.set("Shield / Offhand / Ring / Cloak / Bracer / Neck", 250);
atype.set("Trinket / Belt / Shoulder / Gloves / Boots", 400);
atype.set("Helm / Legs / Chest", 475);
atype.set("1h Agi/Str Weapon", 500);
atype.set("1h Int Weapon", 750);
atype.set("2h Weapon", 1000);

var levelsPossible = [
210,
213,
216,
220,
223,
226,
229,
233,
236,
239,
242,
246
];

function cssmod(element) {
    element.parent().children().removeClass('selected');
    element.addClass('selected');
};

function calculateValor() {
    stages = levelsPossible.indexOf(afterLevel) - levelsPossible.indexOf(beforeLevel)
    if (stages > 0) {
        final = stages * atype.get(armortype);
        $(".result").text("You need : " + final + " Valor");
    } else {
        $(".result").text("You can't downgrade dipshit");
    };
};