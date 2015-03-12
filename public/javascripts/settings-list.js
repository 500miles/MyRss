/**
 * @file:	settings-list页面 js 效果
 * @author	sqrtthree@foxmail.com
 * @update:	2015年03月05日
 */
(function($) {
	$(function() {
		$('.settings-box .del-btn').click(function() {
			var name = $(this).parents('tr').data('name');
			var that = this;

			$.ajax({
				url: '/settings/deleteRss',
				type: 'DELETE',
				dataType: 'json',
				data: {
					"name": name
				}
			})
			.done(function(data) {
				if (data.status == '1') {
					$(that).parents('tr').remove();
				} else {
					alert(data.message);
				}
			})
		});
	});
})(jQuery);
