 $(document).ready(function () {
     $(".btn_hamburger").on("click", function () {
         $(".gnb_wrap").slideToggle();
         $(this).parents("header").toggleClass("bg_white")
     });
     $(".mypage_open h2").on("click", function () {
         
         $(".mypage_menu").slideToggle();
         $(this).parents("li").siblings().find(".mypage_menu").hide();
         $(this).children("i").toggleClass('rotate');
         $(this).toggleClass('bold');
     });

     $(".accordion").on("click", function () {
         $(this).parents(".notice_list").siblings().children(".panel").slideUp(200);
         $(this).parents(".faq_list").siblings().children(".panel").slideUp(200);
         $(this).parents(".notice_list").siblings().children(".accordion").removeClass("active");
         $(this).parents(".faq_list").siblings().children(".accordion").removeClass("active");
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
     $(".ssc_box").click(function(){
                $(this).siblings().removeClass("on");
                $(this).addClass("on");
            });
     
     $(".tip").click(function(){
         $(this).next(".tipTxt").toggle()
     })
     
     $(".close").click(function(){
         $(this).parent(".tipTxt").hide()
     })
 })


 $(window).scroll(function () {
     if ($(this).scrollTop() > 60) {
         $('header').css("background-color", "rgba(255,255,255,1)");
         $('.head_wrap').css("padding", "10px 0px");
     } else {
         $('header').css("background-color", "rgba(255,255,255,0)");
         $('.head_wrap').css("padding", "");
     }
 });