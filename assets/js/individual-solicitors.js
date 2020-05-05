$(document).ready(function() {
    $('.individual-solicitors-carousel-container').slick({
        infinite: true,
        slidesToShow: 5,
        prevArrow: '<button class="isol-prev" href=""></button>',
        nextArrow: '<button class="isol-next" href=""></button>',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    })
});