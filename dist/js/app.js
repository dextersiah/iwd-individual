// init Isotope
var $grid = $(".product-grid").isotope({
    itemSelector: ".product-item",
    layoutMode: "fitRows"
});
// filter items on button click
$(".filter-button-group").on("click", function () {
    var filterValue = $(this).attr("data-filter");
    $grid.isotope({ filter: filterValue });
});