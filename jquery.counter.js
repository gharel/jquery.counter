(function ($) {
	const defaults = {
		duration: 2000,
		easing: 'swing',
		start: 0,
		delay: 0
	}

	$.fn.counter = function (options) {
		if (this.length === 0) {
			return this
		}

		// support multiple elements
		if (this.length > 1) {
			this.each(function () {
				$(this).counter(options)
			})
			return this
		}

		const counter = {}

		// set a reference to our slider element
		const el = this

		// Return if slider is already initialized
		if ($(el).data('counter')) {
			return
		}

		function init() {
			// Return if slider is already initialized
			if ($(el).data('counter')) {
				return
			}
			// merge user-supplied options with the defaults
			counter.settings = $.extend({}, defaults, options)

			counter.settings.duration = $(el).data('duration')
			counter.settings.delay = $(el).data('delay')

			counter.from = counter.settings.start
			counter.to = parseFloat(el.text().replace(/ /g, '').replace(/,/g, '.'))

			startCounter()

			let flag = 0
			$(window).on('scroll.counter', () => {
				const round = getRound(getDecimal(counter.to))
				const top = el.offset().top - window.innerHeight
				const numberFrom = {count: counter.from}
				const numberTo = {count: counter.to}
				const opts = {
					duration: counter.settings.duration,
					easing: counter.settings.easing,
					step: (now) => {
						$(el).text((Math.round(now * round) / round).toLocaleString())
					},
					complete: endCounter
				}
				if (flag === 0 && $(window).scrollTop() > top) {
					$(numberFrom).delay(counter.settings.delay).animate(numberTo, opts)
					flag = 1
				}
			})
		}

		function getDecimal(num) {
			if (Math.floor(num.valueOf()) === num.valueOf()) {
				return 0
			}
			return num.toString().split('.')[1].length || 0
		}

		function getRound(num) {
			let result = '1'
			for (let i = 0; i < num; i++) {
				result += '0'
			}
			result = parseInt(result, 10)
			return result
		}

		function startCounter() {
			$(el).text(counter.from.toLocaleString())
		}

		function endCounter() {
			$(el).text(counter.to.toLocaleString())
		}

		init()

		$(el).data('counter', this)

		// returns the current jQuery object
		return this
	}
})(jQuery)
