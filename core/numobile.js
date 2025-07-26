function nuInitMobileView() {

	if (nuUseMobileView()) {
		if (nuFormType() == 'edit') {
			nuSetMobileView();
		} else {
			$('#nuBreadcrumbHolder').css('width', window.visualViewport.width);
		}
	}

}

function nuUseMobileView() {
	return nuIsMobile() && nuUXOptions.nuMobileView && nuCurrentProperties().mobile_view == "1";
}

function nuSetMobileView() {

	const HEIGHT_MULTIPLIER = 1.5;
	const MAX_SCALE = 0.9;
	const SPACING = 10;
	const visibleTabs = nuVisibleTabs();
	const nuBody = $('#nubody');

	const nuMobileViewGetNewObjectDimensions = (element) => {

		let height = element.outerHeight();

		if (element.is('[data-select2-id]')) {
			const additionalHeight = element.attr('multiple') ? SPACING : 5;
			height = element.data('nu-org-height') + additionalHeight;
		}

		if (!element.is("[data-nu-mobile-hidden]")) {
			maxWidth = Math.max(maxWidth, element.outerWidth());
		}

		if (element.is('input') || element.is('select')) {
			height *= HEIGHT_MULTIPLIER;
			element.height(height);
		}

		const maxHeight = element.attr('data-nu-mobile-max-height');
		if (maxHeight) {
			element.css('height', Math.min(element.nuCSSNumber('height'), parseFloat(maxHeight)));
		}

		return { height }

	}

	const nuMobileViewSetObjectProperties = (id, element, objType, top, width, isSameRow) => {

		let spacing = Number(element.attr('data-nu-mobile-same-row') || 0);

		element.css(isSameRow ? { top: previousObject.top, left: previousObject.width + spacing } : { top, left: SPACING });

		const maxObjWidth = element.attr('data-nu-mobile-max-width');
		if (maxObjWidth) {
			width = Math.min(parseFloat(maxObjWidth), parseFloat(maxWidth));
			element.css('width', width);
		}

		switch (objType) {
			case 'lookup':
				const lookupResult = nuMobileViewLookup(id, top);
				top = lookupResult.top;
				maxWidth = Math.max(maxWidth, lookupResult.width);
				break;
			case 'file':
				top = nuMobileViewFileInput(id, top);
				break;
			default:
				if (element.is('button')) {
					element.css('background-image', 'none');
				}
				break;
		}

		width = SPACING + Number(width);

		return {
			top,
			width
		};

	}

	const nuMobileViewSetLabelProperties = (id, element, top, isSameRow) => {

		const isCheckbox = element.is(':checkbox');
		const label = $('#label_' + id);
		const labelHeight = label.length === 0 ? 0 : label.outerHeight();
		const hasLabel = label.length === 1 && label.html().trim() !== '';

		let labelLeft = SPACING;
		let labelTop = top + 2;
		if (!isSameRow) {
			if (isCheckbox) {
				labelTop += 3;
				labelLeft += element.outerWidth() + 20;
			} else {
				top += labelHeight + 5;
			}
		}

		labelTop += isCheckbox ? 4 : -13;
		label.css({
			top: labelTop,
			left: labelLeft
		})
			.addClass('nuMobileViewLabel')
			.css('width', '');

		return {
			top,
			hasLabel
		};

	}

	const nuMobileViewSetObjectPositionAndLabel = (id, element, objType, top, height, width) => {

		const isSameRow = element.is('[data-nu-mobile-same-row]');
		let { top: newTop, hasLabel } = nuMobileViewSetLabelProperties(id, element, top, isSameRow);
		let { top: newTopPosition, width: newWidth } = nuMobileViewSetObjectProperties(id, element, objType, newTop, width, isSameRow);

		let previousTop = newTopPosition;
		let previousWidth = newWidth;

		const isCheckbox = element.is(':checkbox');

		if (!isSameRow) {
			newTopPosition += height + (hasLabel && !isCheckbox ? 30 : 5);
			if (isCheckbox) {
				newTopPosition += SPACING;
			}
		}

		return {
			previousTop,
			previousWidth,
			top: newTopPosition
		};

	};

	const nuMobileViewSetTransformScale = (objectWidth, screenWidth) => {

		const scale = Math.max(screenWidth / objectWidth, MAX_SCALE);
		nuBody.css({
			'width': objectWidth,
			'transform': `scale(${scale})`
		});

		return scale;

	};

	const nuMobileViewAppendTabSelect = () => {

		if (visibleTabs.length <= 1) return 0;

		const selectedTabId = nuGetSelectedTabId();

		let options = '';
		visibleTabs.each(function (_, element) {
			const $element = $(element);
			const html = $element.html();
			const tabId = $element.attr('data-nu-tab-id');
			const isSelected = tabId === selectedTabId ? 'selected' : '';
			options += `<option value="${tabId}" ${isSelected}>${html}</option>`;
		});

		const tabSelect = `
			<select class="nuMobileViewTabSelect" id="nuMobileViewTabSelect">
			${options}
			</select>`;

		$('#nuRECORD').append(tabSelect);

		const $tabSelect = $('#nuMobileViewTabSelect');
		$tabSelect.on('change', function () {
			const selectedTabId = nuGetValue(this.id);
			nuSelectTabById(selectedTabId);
			nuMobileViewTabNavUpdateStates();
		});

		return $tabSelect.outerHeight();

	};

	const nuMobileViewLookup = (id, top) => {

		const elements = {
			code: $(`#${id}code`),
			description: $(`#${id}description`),
			button: $(`#${id}button`)
		};

		const codeWidth = elements.code.outerWidth();
		const descWidth = elements.description.outerWidth();

		elements.code.css({ top: top, left: SPACING });
		elements.button.css({ top: top, left: codeWidth + 15 });

		const height = elements.code.outerHeight() * HEIGHT_MULTIPLIER;
		elements.code.height(height);
		elements.description.height(height);

		top += height + 15;

		elements.description.css({ top: top, left: SPACING, width: codeWidth - 5 });

		return { top: top, width: codeWidth + descWidth + 30 };

	};

	const nuMobileViewFileInput = (id, top) => {

		const inputElement = $(`#${id}_input`);
		top += 5;
		inputElement.css({ 'top': top, 'left': SPACING });
		return top + 5;

	};

	function nuMobileViewSetDimensionsAndScale() {

		let windowInnerWidth = nuGetWindowProperty('nuWindowInnerWidth', nuFormId());
		if (!windowInnerWidth) {
			windowInnerWidth = window.innerWidth;
			nuSetWindowProperty('nuWindowInnerWidth', nuFormId(), windowInnerWidth);
		}

		const objectWidth = maxWidth + 50;
		const scale = nuMobileViewSetTransformScale(objectWidth, windowInnerWidth);

		$('.nuBuilderLink, .nuPortraitTab, .nuAdminButton').remove();
		$('#nuTabHolder').hide();
		$('button').css('text-align', 'left');
		$('#nuBreadcrumbHolder, #nuActionHolder').css('width', nuMobileViewGetScaledDocumentWidth(scale));

		nuBody.css('width', window.visualViewport.width);
		return scale;

	}

	function nuMobileViewSetEndElement() {
		$('#nuRECORD').append(`<div id="nuMobileViewEnd" style="left:0px;height:100px;position:absolute;top:${maxHeight}px">&nbsp;</div>`);
	}

	function nuMobileViewSetTopPosition(currentTab, index, objType, objTab, top, tabVisible) {

		if (currentTab === -1 && index === 0) {
			const tabHeight = nuMobileViewAppendTabSelect();
			top += tabHeight > 0 ? tabHeight + 60 : 0;
		}

		if (objTab !== currentTab && tabVisible && window.nuSetMobileViewShowTabTitles !== false && objType !== 'contentbox') {

			if ($('.nuTab').length > 1) {
				currentTab = objTab;
				if (currentTab > 0) {
					top = 80;
				}
			}
		}

		return top;

	}

	nuBody.css('transform', 'scale(1)');
	if (nuFormType() === 'browse') return;

	let top = 0;
	let currentTab = -1;
	var maxWidth = 0;
	let maxHeight = 100;
	let previousObject = {
		width: 0,
		top: 0
	};

	nuSERVERRESPONSE.objects.forEach((obj, index) => {

		const { id, type: objType, tab: objTab, read } = obj;
		const objHidden = read == 2 || (read == 3 && !nuGlobalAccess());

		let element = $(`#${id}`);
		let { height } = nuMobileViewGetNewObjectDimensions(element);

		const tabElement = $(`#nuTab${objTab}`);
		let tabVisible = tabElement.nuIsVisible();

		top = nuMobileViewSetTopPosition(currentTab, index, objType, objTab, top, tabVisible);

		tabVisible = tabElement.nuIsVisible() || $('.nuTab').length === 1;

		if (element.is("[data-nu-mobile-hidden]") || !tabVisible || objType === 'contentbox') {
			const { componentIds } = nuObjectComponents(id);
			componentIds.forEach(compId => {
				const comp = $(`#${compId}`);
				comp.attr('data-nu-mobile-hidden', '');
				comp.hide();
			});
		} else {
			if (!objHidden) {

				if (element.is('[data-select2-id]')) {
					element = $(`#${id}_select2`);
				}

				if (window.nuOnMobileBeforeObjectPosition) {
					let objPlacement = nuOnMobileBeforeObjectPosition(id, element, top);
					top = objPlacement.top;
				}

				const newPosition = nuMobileViewSetObjectPositionAndLabel(id, element, objType, top, height, obj.width);
				previousObject.top = newPosition.previousTop;
				previousObject.width = newPosition.previousWidth;
				top = newPosition.top;

			}

		}

		maxHeight = Math.max(maxHeight, top);

	});

	nuMobileViewSetEndElement();

	if (visibleTabs.length > 1) {
		nuAddTabNavigator(20, 280);
	}

	const scale = nuMobileViewSetDimensionsAndScale();
	nuScrollToTopLeft();

	if (window.nuOnMobileViewComplete) {
		nuOnMobileViewComplete();
	}

	return scale;

}

function nuMobileViewGetScaledDocumentWidth(scale) {

	const viewportWidth = document.documentElement.clientWidth;
	const scaledWidth = viewportWidth / scale;
	return scaledWidth;

}

function nuScrollToTopLeft() {

	window.scrollTo(0, 0);
	document.getElementById("nuBreadcrumbHolder").scrollIntoView();

}

function nuTabNavCreateIcon(id, top, left, iconClass, direction) {

	const iconHTML = `
        <div id="${id}" class="nuMobileViewTabNavIcon">
            <i class="${iconClass} fa-2x"></i>
        </div>`;

	$('#nuRECORD').append(iconHTML);

	$id = $('#' + id);
	$id.css({
		top: `${top}px`,
		left: `${left}px`
	});

	$id.on("click", function () {
		nuTabNavOnClick(direction);
	});
}

function nuVisibleTabs() {
	return $('.nuTab:visible');
}

function nuAddTabNavigator(top, left) {

	nuTabNavCreateIcon('nuTabNavLast', top, left, 'fa-solid fa-angle-left', -1);
	nuTabNavCreateIcon('nuTabNavNext', top, left + 50, 'fa-solid fa-angle-right', 1);
	nuMobileViewTabNavUpdateStates();

}

function nuGetTabNavData() {

	const selectElement = $('#nuMobileViewTabSelect');
	const currentIndex = selectElement.prop('selectedIndex');
	const optionCount = selectElement.children('option').length;
	return {
		selectElement: selectElement,
		currentIndex: currentIndex,
		optionCount: optionCount
	};

}

function nuTabNavOnClick(direction) {

	const tabData = nuGetTabNavData();
	const newIndex = tabData.currentIndex + direction;

	if (newIndex >= 0 && newIndex < tabData.optionCount) {
		tabData.selectElement.prop('selectedIndex', newIndex).trigger('change');
	}

	nuMobileViewTabNavUpdateStates();

}

function nuMobileViewTabNavUpdateStates() {

	const tabData = nuGetTabNavData();
	const currentIndex = tabData.currentIndex;
	const optionCount = tabData.optionCount;

	nuMobileViewTabNavUpdateArrowStates('#nuTabNavLast', currentIndex <= 0);
	nuMobileViewTabNavUpdateArrowStates('#nuTabNavNext', currentIndex >= optionCount - 1);

}

function nuMobileViewTabNavUpdateArrowStates(arrowSelector, condition) {
	$(arrowSelector).toggleClass('nuMobileViewTabNavEnabled', !condition)
		.toggleClass('nuMobileViewTabNavDisabled', condition);
}

function nuMobileViewGetTransformScale(element) {

	if (!element) element = nuBody = $('#nubody');

	const transform = $(element).css('transform');
	if (transform === 'none') {
		return 1;
	}

	const matrix = transform.match(/^matrix\((.+)\)$/);
	if (matrix) {
		const values = matrix[1].split(', ');
		return parseFloat(values[0]);
	}

	return 1;

};


