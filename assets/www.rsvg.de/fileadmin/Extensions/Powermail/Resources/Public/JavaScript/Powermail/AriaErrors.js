(function ($) {
	if (!$ || typeof $.listen !== "function") {
		return;
	}

	var MARKER_FROM_NAME = /\[field\]\[([^\]]+)\]/;

	function markerFromElement($el) {
		var name = $el.attr("name") || "";
		var match = name.match(MARKER_FROM_NAME);
		return match ? match[1] : null;
	}

	function inputsForField(fieldInstance) {
		var $el = fieldInstance.$element;
		var name = $el.attr("name");
		if (!name) {
			return $el;
		}

		var $form = $el.closest("form");
		var $scope = $form.length ? $form : $(document);
		return $scope.find('[name="' + name.replace(/"/g, '\\"') + '"]');
	}

	function describedByTokens($el) {
		var raw = ($el.attr("aria-describedby") || "").split(/\s+/);

		return raw.filter(function (token) {
			return token.length > 0;
		});
	}

	function addDescribedBy($el, id) {
		var tokens = describedByTokens($el);
		if (tokens.indexOf(id) === -1) {
			tokens.push(id);
		}

		$el.attr("aria-describedby", tokens.join(" "));
	}

	function removeDescribedBy($el, id) {
		var tokens = describedByTokens($el).filter(function (token) {
			return token !== id;
		});

		if (tokens.length) {
			$el.attr("aria-describedby", tokens.join(" "));
		} else {
			$el.removeAttr("aria-describedby");
		}
	}

	function clearStaticMessage(id) {
		document
			.querySelectorAll("#" + id + " .powermail_field_error_message")
			.forEach(function (el) {
				el.parentNode.removeChild(el);
			});
	}

	$.listen("parsley:field:error", function (fieldInstance) {
		var marker = markerFromElement(fieldInstance.$element);
		if (!marker) {
			return;
		}

		var id = "powermail_field_error_" + marker;
		clearStaticMessage(id);
		inputsForField(fieldInstance).each(function () {
			var $input = $(this);
			$input.attr("aria-invalid", "true");
			addDescribedBy($input, id);
		});
	});

	$.listen("parsley:field:success", function (fieldInstance) {
		var marker = markerFromElement(fieldInstance.$element);
		if (!marker) {
			return;
		}

		var id = "powermail_field_error_" + marker;
		clearStaticMessage(id);
		inputsForField(fieldInstance).each(function () {
			var $input = $(this);
			$input.removeAttr("aria-invalid");
			removeDescribedBy($input, id);
		});
	});
})(typeof jQuery !== "undefined" ? jQuery : null);
