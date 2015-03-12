/**
 * @file:	首页(技术)和文章页 js 效果
 * @author:	sqrtthree@foxmail.com
 * @update:	2015年03月06日
 */
;(function($) {
	$(function() {
		/**
		 * 右侧导航切换效果
		 */
		$('#nav-box li').click(function() {
			$('#nav-box li').removeClass('active');

			$(this).addClass('active');
		});
	});
})(jQuery);
