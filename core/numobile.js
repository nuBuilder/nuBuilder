function nuInitMobileView() {

	if (nuUseMobileView()) {
		if (nuFormType() == 'edit') {
			nuSetMobileView();
			$('button').css('text-align', 'left');
		} else {
			$('#nuBreadcrumbHolder').css('width', window.visualViewport.width);
		}
	}

}

function nuUseMobileView() {
	return nuIsMobile() && nuUXOptions.nuMobileView && nuCurrentProperties().mobile_view == "1";
}

function nuSetMobileView(columns = 1) {

	const heightMultiplier = 1.5;
	const maxScale = 0.9;
	const visibleTabs = nuVisibleTabs();

	function nuMobileViewSetObjectDimensions(id, element) {

		let height = element.outerHeight()

		if (element.is('[data-select2-id]')) {
			const incHeight = element.attr('multiple') ? 10 : 5;
			height = element.data('nu-org-height') + incHeight;
		}

		if (!element.is("[data-nu-mobile-hidden]")) {
			maxWidth = Math.max(maxWidth, element.outerWidth());
		}

		let heightLabel = $('#label_' + id).length == 0 ? 0 : $('#label_' + id).outerHeight()

		if (element.is('input') || element.is('select')) {
			height = height * heightMultiplier;
			element.height(height);
		}

		const maxHeight = element.attr('data-nu-mobile-max-height');
		if (maxHeight) {
			element.css('height', Math.min(element.nuCSSNumber('height'), parseFloat(maxHeight)));
		}

		return { height, maxWidth, heightLabel }

	}

	const nuMobileViewGetTransformScale = (element) => {

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

	const nuMobileViewSetTransformScale = (objectWidth, screenWidth) => {

		const nuBody = $('#nubody');
		const currentScale = nuMobileViewGetTransformScale(nuBody);

		nuBody.attr('nu-org-scale-attribute', currentScale);
		nuBody.attr('nu-org-width', nuBody.width());

		const scale = Math.max(screenWidth / objectWidth, maxScale);

		nuBody.css({
			'width': objectWidth,
			'transform': `scale(${scale})`
		});

		return scale;

	};

	const nuMobileViewAppendTabSelect = () => {

		if (visibleTabs.length <= 1) return 0;

		let options = '';
		visibleTabs.each(function (index, element) {

			$element = $(element);
			const html = $element.html();
			const tabId = $element.attr('data-nu-tab-id');
			if (index === 0) {
				options += `<option value="${tabId}" selected>${html}</option>`;
			} else {
				options += `<option value="${tabId}">${html}</option>`;
			}

		});

		const tabSelect = `
			<select class="nuMobileViewTabSelect"
					id="nuMobileViewTabSelectId">
			${options}
			</select>`;

		$('#nuRECORD').append(tabSelect);

		const $tabSelect = $('#nuMobileViewTabSelectId')

		$tabSelect.on('change', function () {
			const selectedTabId = nuGetValue(this.id);
			nuSelectTabById(selectedTabId);
			nuMobileViewTabNavUpdateStates();
		});

		return $tabSelect.outerHeight();

	};

	const nuMobileViewElementPosition = (element, top, sameRow, previousWidth, previousTop, labelWidth) => {

		const spacing = Number(element.attr('data-nu-mobile-same-row') || 0);
		if (sameRow) {
			element.css({ 'top': previousTop, 'left': previousWidth + spacing });
		} else {
			element.css({ 'top': top, 'left': labelWidth + 10 });
		}

		const maxWidth = element.attr('data-nu-mobile-max-width');
		if (maxWidth) {
			element.css('width', Math.min(element.nuCSSNumber('width'), parseFloat(maxWidth)));
		}

	};

	const nuMobileViewHandleLookup = (id, top, labelWidth) => {

		const elements = {
			code: $(`#${id}code`),
			description: $(`#${id}description`),
			button: $(`#${id}button`)
		};

		const codeWidth = elements.code.outerWidth();
		const descWidth = elements.description.outerWidth();

		elements.code.css({ top: top, left: labelWidth + 10 });
		elements.button.css({ top: top, left: labelWidth + codeWidth + 15 });

		const height = elements.code.outerHeight() * 1.5;
		elements.code.height(height);
		elements.description.height(height);

		top += height + 15;

		elements.description.css({ top: top, left: labelWidth + 10, width: codeWidth - 5 });

		return { top: top, width: codeWidth + descWidth + 30 };

	};

	const nuMobileViewHandleFileInput = (id, top, labelWidth) => {

		const inputElement = $(`#${id}_input`);
		top += 5;
		inputElement.css({ 'top': top, 'left': labelWidth + 10 });
		return top + 5;

	};


	const nuMobileViewLabelWidth = (objects) => {

		var labelWidth = 0
		$('label').css('width', '');

		for (let i = 0; i < objects.length; i++) {
			labelWidth = nuGetWordWidth($('#label_' + objects[i].id).html());
		}

		return labelWidth + 15;

	}

	$('#nubody').css('transform', 'scale(1)');

	if (nuFormType() === 'browse') { return; }

	// window.nuSetMobileView = true;
	$('.nuBuilderLink').remove();
	$('.nuPortraitTab').remove();
	$('.nuAdminButton').remove();

	const objects = nuSERVERRESPONSE.objects;
	const labelWidth = columns === 1 ? 0 : nuMobileViewLabelWidth(objects);

	let top = 0;
	let currentTab = -1;
	var maxWidth = 0;
	let objWidth = 0;
	let objTop = 0;
	let objCount = 0;

	objects.forEach(obj => {
		const { id, type: objType, tab: objTab, read, input } = obj;
		let element = $(`#${id}`);

		var { height, maxWidth, heightLabel } = nuMobileViewSetObjectDimensions(id, element);

		const tabElement = $(`#nuTab${objTab}`);
		let tabVisible = tabElement.nuIsVisible();

		if (currentTab === -1 && objCount === 0) {
			const tabHeight = nuMobileViewAppendTabSelect(top);
			top += (tabHeight > 0 ? tabHeight + 30 : 0);
		}

		if (objTab !== currentTab && tabVisible && window.nuSetMobileViewShowTabTitles !== false && objType !== 'contentbox') {
			if ($('.nuTab').length > 1) {
				currentTab = objTab;
				if (currentTab > 0) {
					top = 60;
				}
			}
		}

		tabVisible = tabElement.nuIsVisible() || $('.nuTab').length === 1;

		if (element.is("[data-nu-mobile-hidden]") || !tabVisible) {
			const { componentIds } = nuObjectComponents(id);
			componentIds.forEach(compId => {
				const comp = $(`#${compId}`);
				comp.attr('data-nu-mobile-hidden', '');
				comp.hide();
			});
		} else {
			if (read !== 2) {
				if (objType === 'contentbox') {
					element.attr('data-nu-mobile-hidden', '');
					element.hide();
				} else {

					let labelTop = top + 2;
					let labelLeft = 10;

					const sameRow = element.is('[data-nu-mobile-same-row]');
					if (columns === 1 && !sameRow) {
						if (!element.is(':checkbox')) {
							top += heightLabel + 5;
						} else {
							labelTop += 3;
							labelLeft = 40;
						}

					}

					$('#label_' + id).css({ 'top': labelTop - 4, 'left': labelLeft })
						.addClass('nuMobileViewLabel').css('width', '');

					if (element.is('[data-select2-id]')) {
						element = $(`#${id}_select2`);
					}

					nuMobileViewElementPosition(element, top, sameRow, objWidth, objTop, labelWidth);

					if (objType === 'lookup') {
						const lookupResult = nuMobileViewHandleLookup(id, top, labelWidth);
						top = lookupResult.top;
						maxWidth = Math.max(maxWidth, lookupResult.width);
					} else if (input === 'file') {
						top = nuMobileViewHandleFileInput(id, top, labelWidth);
					}

					objWidth = labelWidth + 10 + Number(obj.width);
					objTop = top;

					if (!sameRow) {
						top += height + 5;
					}

				}
			}
		}

		objCount++;

	});

	$('#nuTabHolder').hide();

	top += 50;
	$('#nuRECORD').append(`<div id="nuPortEnd" style="left:0px;position:absolute;top:${top}px">&nbsp;</div>`);

	// nuMobileViewAdjustLabelStyles(columns, maxWidth, labelWidth);

	let windowInnerWidth = nuGetWindowProperty('nuWindowInnerWidth', nuFormId());

	if (!windowInnerWidth) {
		windowInnerWidth = window.innerWidth;
		nuSetWindowProperty('nuWindowInnerWidth', nuFormId(), windowInnerWidth);
	};

	const objectWidth = maxWidth + labelWidth + 50;
	const scale = nuMobileViewSetTransformScale(objectWidth, windowInnerWidth);

	if (visibleTabs.length > 1) {
		nuAddTabNavigator();
	}

	nuScrollToTopLeft();

	$('#nuBreadcrumbHolder').css('width', window.visualViewport.width);



	if (window.nuOnMobileViewComplete) {
		nuOnMobileViewComplete();
	}

	return scale;

}

function nuScrollToTopLeft() {
	window.scrollTo(0, 0);
	$('html, body').scrollTop(0).scrollLeft(0);
}

function nuTabNavCreateIcon(id, top, left, iconClass, direction) {

	const icon = `
	<div id="${id}" class="nuMobileViewTabNavIcon"
		 style="top: ${top}px; left: ${left}px;">
	  <i class="${iconClass} fa-2x"></i>
	</div>`;

	$('#nuRECORD').append(icon);

	$('#' + id).on("click", function () {
		nuTabNavOnClick(direction);
	});

}

function nuVisibleTabs() {
	return $('.nuTab:visible');
}

function nuAddTabNavigator() {

	const top = 20;
	const left = 280;
	nuTabNavCreateIcon('nuTabNavLeftArrow', top, left, 'fa-solid fa-angle-left', -1);
	nuTabNavCreateIcon('nuTabNavRightArrow', top, left + 50, 'fa-solid fa-angle-right', 1);
	nuMobileViewTabNavUpdateStates();

}

function nuGetTabNavData() {

	const selectElement = $('#nuMobileViewTabSelectId');
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

	nuMobileViewTabNavUpdateArrowStates('#nuTabNavLeftArrow', currentIndex <= 0);
	nuMobileViewTabNavUpdateArrowStates('#nuTabNavRightArrow', currentIndex >= optionCount - 1);

}

function nuMobileViewTabNavUpdateArrowStates(arrowSelector, condition) {

	const arrow = $(arrowSelector);
	arrow.css({
		'pointer-events': condition ? 'none' : 'auto',
		'opacity': condition ? '0.5' : '1'
	});

}

