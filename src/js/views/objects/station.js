define(['underscore', 'backbone', 'leaflet', 'views/dialog'], function(_, Backbone, L, DialogView) {
	'use strict';

	return Backbone.View.extend({
		initialize: function(params) {
			params.object.setIcon(this.markerIcon(params.data.size));
			params.object.setHint(typeof this.hintText == 'function' ? this.hintText(params) : this.hintText);
			this.listenTo(params.object, 'click', this.onClick);

			this.params = params;
		},
		hintText: function(params) {
			return (!/платформа/i.test(params.data.caption) ? 'Платформа ' : '') + '«' + params.data.caption + '»';
		},
		markerIcon: function(size) {
			return L.icon({
				iconUrl: '/img/objects/station.svg',
				iconSize: [size, size]
			});
		},
		dialogContent: function(data) {
			return _.template($('#station-dialog').html())(data);
		},
		onClick: function() {
			var dialog = new DialogView(this.params.data.caption, $body),
				$body = $(this.dialogContent(this.params.data));

			if (typeof(this.params.data.list) !== 'undefined') {
				var $list = $body.find('.streams-list'),
					app = this.params.appModel;

				_.each(this.params.data.list, function(item) {
					$('<li>')
						.html(item.caption)
						.addClass('icon ' + item.type)
						.click(function() {
							app.load(item.region, item.map, { x: item.x, y: item.y });
							dialog.close();
						})
						.hint(item.region + '/' + item.map)
						.appendTo($list);
				});
			}

			dialog
				.setCaption(this.params.data.caption)
				.setContent($body)
				.open();
		}
	});

});