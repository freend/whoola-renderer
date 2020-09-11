$(function(){

	//메뉴
	$('nav h2').on('click', function(){
		$('nav ul, .util').toggleClass('mb_hidden');
	});
	
	//메인 비주얼 슬라이드
	$('.visual ul').slick({
		arrows:false,
		autoplay: true,
		speed:1000,
		autoplaySpeed:5000,
	});
	
	//stories 텍스트 슬라이드
	$('.txt_slide').slick({
		arrows:false,
		centerMode: true,
		dots:true,
		centerPadding: '40px 40px',
		slidesToShow: 3,
		autoplay: true,
		speed:1000,
		autoplaySpeed:5000,
		variableWidth:true,
		responsive: [
				{
				  breakpoint: 981,
				  settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					centerPadding: '16px 40px',
				  }
				},
				{
				  breakpoint: 681,
				  settings: {
					centerPadding: '16px 30px',
				  }
				}

		]
	});

	//번호 입력 셀렉트 박스
	var code = $('.code'),
		codeBtn = code.find('> p'),
		codeList = code.find('ul'),
		codeDim = code.find('.dim');

	codeBtn.on('click',function(){
		codeList.toggle();
		codeDim.toggle();
	});

	codeList.find('li').on('click',function(){
		var select = $(this).find('a').html();
		
		codeList.toggle();
		codeBtn.html(select);
	});

	codeDim.on('click', function(e){
		if (e.target == this){
			codeList.hide();
			codeDim.hide();
		}
	});

	//fullpage
	$('#fullpage').fullpage({
		fitToSection:true,
		normalScrollElements : '.code',
		scrollOverflow:true,
		afterLoad: function(){
           $('input').blur();
		   if ($('.hm_wrap').is('.active')){
			   $('.chart_wrap.first , .chart_wrap.last').addClass('on');		
			}
        }
	});

});