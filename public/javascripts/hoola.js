 $(document).ready(function () {
     $(".btn_hamburger").on("click", function () {
         $(".gnb_wrap").slideToggle();
         $(this).parents("header").toggleClass("bg_white")
     });
     $(".mypage_open h2").on("click", function () {
         $(".mypage_menu").slideToggle();
         $(this).children("i").toggleClass('rotate');
         $(this).toggleClass('bold');
     });

     $(".accordion").on("click", function () {
         $(this).parents(".notice_list").siblings().children(".panel").slideUp(200);
         $(this).parents(".notice_list").siblings().children(".accordion").removeClass("active");
         $(this).next(".panel").slideToggle();
         $(this).toggleClass("active")

     });
       $(".purchase_box").click(function(){
                $(this).siblings().removeClass("on");
                $(this).addClass("on");
            });
     $(".pricing_box").click(function(){
                $(this).siblings().removeClass("on");
                $(this).addClass("on");
            });
 })


 $(window).scroll(function () {
     if ($(this).scrollTop() > 60) {
         $('header').css("background-color", "rgba(255,255,255,1)");
     } else {
         $('header').css("background-color", "rgba(255,255,255,0)");
     }
 });