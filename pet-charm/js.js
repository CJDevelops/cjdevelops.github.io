function calculate(){
    var days = new Date();
    days = new Date(2021,6,days.getDate());
    var endDate = new Date(2021,6,30);
    var daysLeft = (endDate.getTime() - days.getTime())/86400000;

    var charms = $("#input").val();
    var needed = 10000 - charms;
    var daily = needed / daysLeft;

    document.getElementById("needed").innerHTML = "You need : " + daily + " charms a day :)";

};
$(document).ready(function(){
    $("#input").on("input", function(){
        calculate();
    });
});
