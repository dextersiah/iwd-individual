$('.single-item').slick({
    infinite: true,
    dots: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 1000,
    cssEase: 'ease-in-out',
});

$('.quote-container').mousedown(function () {
    $('.single-item').addClass('dragging');
});
$('.quote-container').mouseup(function () {
    $('.single-item').removeClass('dragging');
});