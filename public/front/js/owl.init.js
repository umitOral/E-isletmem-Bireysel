//Owl Carousel
$('#customer-testi').owlCarousel({
  loop:true,
  nav: false,
  dots: true,
  autoplay:true,
  autoplayTimeout:3000,
  autoplayHoverPause:true,
  responsive:{
      0:{
          items:1
      },
      600:{
          items:2
      },
      1000:{
          items:3
      }
  }
});
$('#customer-test2').owlCarousel({
  loop:true,
  nav: false,
  dots: true,
  autoplay:true,
  margin:10,
  autoplayTimeout:3000,
  autoplayHoverPause:true,
  responsive:{
      0:{
          items:2
      },
      600:{
          items:3
      },
      1000:{
          items:6
      }
  }
});

$('#client-four').owlCarousel({
  loop:true,
  nav: false,
  dots: true,
  autoplay:true,
  autoplayTimeout:3000,
  autoplayHoverPause:true,
  responsive:{
      0:{
          items:1
      },
      600:{
          items:2
      },
      1000:{
          items:4
      }
  }
});

$('#owl-fade').owlCarousel({
  loop:true,
  nav: false,
  dots: true,
  autoplay:true,
  autoplayTimeout:3000,
  autoplayHoverPause:true,
  animateOut: 'fadeOut',
  items: 1,
})


$('#single-owl').owlCarousel({
  loop:true,
  nav: false,
  dots: true,
  autoplay:true,
  autoplayTimeout:5000,
  autoplayHoverPause:true,
  items: 1,
})

$('#six-slide').owlCarousel({
  loop:true,
  nav: false,
  dots: true,
  autoplay:true,
  autoplayTimeout:3000,
  autoplayHoverPause:true,
  responsive:{
      0:{
          items:1
      },
      600:{
          items:3
      },
      900:{
          items:4
      },
      1100:{
          items:6
      }
  }
});