function nuDragSelectInIframe(selector) {
	return $(selector, nuGetNuDragDialogIframes(true));
}

function nuDragGetElementBounds(element) {
	const $el = $(element);
	return {
		left: $el.position().left,
		top: $el.position().top,
		width: $el.width(),
		height: $el.height(),
		right: $el.position().left + $el.width(),
		bottom: $el.position().top + $el.height()
	};
}

function nuDragSetElementPosition(element, left, top) {
	$(element).css({
		left: left + 'px',
		top: top + 'px'
	});
}

function nuDragSetElementSize(element, width, height) {
	const css = {};
	if (width !== undefined) css.width = width + 'px';
	if (height !== undefined) css.height = height + 'px';
	$(element).css(css);
}

function nuDragGetRelatedElements(elementId) {
	return {
		main: $('#' + elementId),
		contentBox: $('#frame_' + elementId),
		label: $('#label_' + elementId),
		iframeMain: nuDragSelectInIframe('#' + elementId),
		iframeContentBox: nuDragSelectInIframe('#frame_' + elementId),
		iframeLabel: nuDragSelectInIframe('#label_' + elementId)
	};
}

function nuDragButtonToggleState(buttonSelectors, enabled, useParent = true) {
	const $buttons = useParent ? nuSelectInParentDocument(buttonSelectors) : $(buttonSelectors);
	$buttons.prop('disabled', !enabled)
		.toggleClass('nuDragOptionsButtonDisabled', !enabled);
}

function nuDragIsElementInBounds(elementBounds, containerBounds) {
	const { left: eL, top: eT, right: eR, bottom: eB } = elementBounds;
	const { left: cL, top: cT, right: cR, bottom: cB } = containerBounds;

	// Check if any corner of element is within container
	return (eL >= cL && eL <= cR && eT >= cT && eT <= cB) ||
		(eR >= cL && eR <= cR && eT >= cT && eT <= cB) ||
		(eL >= cL && eL <= cR && eB >= cT && eB <= cB) ||
		(eR >= cL && eR <= cR && eB >= cT && eB <= cB) ||
		(cL >= eL && cL <= eR && cT >= eT && cT <= eB) ||
		(cR >= eL && cR <= eR && cT >= eT && cT <= eB) ||
		(cL >= eL && cL <= eR && cB >= eT && cB <= eB) ||
		(cR >= eL && cR <= eR && cB >= eT && cB <= eB) ||
		(cL >= eL && cL <= eR && cT <= eT && cB >= eB) ||
		(cL <= eL && cR >= eR && cT >= eT && cB <= eB);
}

function nuDragGetCurrentTabNumber() {
	return $('div.nuTabSelected[id^="nuTab"]', nuGetNuDragDialogIframes(true)).attr('data-nu-tab-filter') || '0';
}

function nuBindDragEvents() {

	$(document).on('mousemove.nuformdrag', function (e) {
		const arrangingObjects = window.nuFORM.breadcrumbs.length != -1 && nuArrangingObjects();

		if (arrangingObjects) {
			e.stopPropagation?.();
			e.preventDefault?.();
			e.cancelBubble = true;
			e.returnValue = false;

			if (e.buttons) {
				nuDragBox(e);
			}
		}
	});

	$(document).on('mousedown.nuformdrag', function (e) {
		window.startX = e.clientX + window.scrollX;
		window.startY = e.clientY + window.scrollY;
		window.moveX = 0;
		window.moveY = 0;

		const arrangingObjects = window.nuFORM.last != -1 && nuArrangingObjects();

		if (arrangingObjects) {
			const id = e.target.id;

			if (id === '') return;

			const isCb = $('#' + id).hasClass('nuContentBoxFrame');
			const isModifierPressed = nuIsCtrlOrCmdPressed(e);

			if (e.target === document.body || isCb || e.target === $('#nuRECORD')[0]) {
				if (!isModifierPressed) {
					$('.nuDragSelected').removeClass('nuDragSelected');
				}
				nuCreateBox(e);
			} else {
				if (!isModifierPressed && !$('#' + id).hasClass('nuDragSelected')) {
					$('.nuDragSelected').removeClass('nuDragSelected');
				}

				if ($('#' + id).attr('data-drag')) {
					$('#' + id).addClass('nuDragSelected');
				}
			}
		}

		nuUpdateDragFieldsListbox();
	});

	$(document).on('mouseup.nuformdrag', function (e) {
		const arrangingObjects = window.nuFORM.last != -1 && nuArrangingObjects();
		if (arrangingObjects) {
			if ($('#nuSelectBox').length > 0) {
				nuRemoveBox(nuIsCtrlOrCmdPressed(e));
			}
		}
		nuUpdateDragFieldsListbox();
	});

	const nuDragKeydownListener = function (e) {
		if (nuIsCtrlOrCmdPressed(e) && e.key === "a") {
			nuSelectAllDragObjects();
			nuUpdateDragFieldsListbox();
			e.preventDefault();
			return;
		}

		const keyDirection = getKeyDirection(e.key);
		if (keyDirection) {
			handleArrowKeyMovement(keyDirection, e.shiftKey);
		}
	};

	$(document).on('keydown.nuformdrag', nuDragKeydownListener);
	$(window.parent.document).on('keydown.nuformdrag', nuDragKeydownListener);

}


function getKeyDirection(key) {
	const directions = {
		'ArrowLeft': 'left',
		'ArrowRight': 'right',
		'ArrowUp': 'up',
		'ArrowDown': 'down'
	};
	return directions[key] || '';
}

function handleArrowKeyMovement(direction, isShiftPressed) {
	$('.nuDragSelected').each(function () {
		const elements = nuDragGetRelatedElements($(this).attr('id'));
		const isResize = isShiftPressed;
		const isContentBox = $(this).hasClass('nu_contentbox');

		let prop, val, labelVal;

		if (direction === 'left') {
			if (isResize) {
				prop = 'width';
				val = $(this).width() - 1;
			} else {
				prop = 'left';
				val = $(this).position().left - 1;
				if (elements.label.length !== 0) {
					labelVal = elements.label.position().left - 1;
				}
			}
		} else if (direction === 'right') {
			if (isResize) {
				prop = 'width';
				val = $(this).width() + 1;
			} else {
				prop = 'left';
				val = $(this).position().left + 1;
				if (elements.label.length !== 0) {
					labelVal = elements.label.position().left + 1;
				}
			}
		} else if (direction === 'up') {
			if (isResize) {
				prop = 'height';
				val = elements.contentBox.length == 0 ? $(this).height() - 1 : elements.contentBox.height() - 1;
			} else {
				prop = 'top';
				val = $(this).position().top - 1;
				if (elements.label.length !== 0) {
					labelVal = elements.label.position().top - 1;
				}
			}
		} else if (direction === 'down') {
			if (isResize) {
				prop = 'height';
				val = elements.contentBox.length == 0 ? $(this).height() + 1 : elements.contentBox.height() + 1;
			} else {
				prop = 'top';
				val = $(this).position().top + 1;
				if (elements.label.length !== 0) {
					labelVal = elements.label.position().top + 1;
				}
			}
		}

		// Apply changes
		if (!(prop == 'height' && isContentBox)) {
			$(this).css(prop, val + 'px');
		}

		if ((prop == 'left' || prop == 'top') && elements.label.length !== 0) {
			elements.label.css(prop, labelVal + 'px');
		}

		// ContentBox positioning
		if (elements.contentBox.length == 1) {
			let cbVal = val;
			if (prop == 'top') cbVal += 18;
			elements.contentBox.css(prop, cbVal + 'px');
		}
	});
}

function nuUnbindDragEvents() {
	$(document).off('.nuformdrag');
}

function nuUpdateDragFieldsListbox() {
	nuSelectInParentDocument('#nuDragOptionsFields option:selected').prop('selected', false);

	$('.nuDragSelected').each(function () {
		nuSelectInParentDocument('#nuDragOptionsFields option[id="drag_' + $(this).prop('id') + '"]').prop('selected', 'selected');
	});

	nuUpdateDragOptionsButtonState();
	nuCheckIfMovingTabOrderAllowed(nuSelectInParentDocument('#nuDragOptionsFields'));
	nuCheckIfMovingFieldToOtherTabAllowed(nuSelectInParentDocument('#nuDragOptionsFields'));
}

function nuUpdateDragOptionsButtonState() {
	const hasMultipleSelections = $('.nuDragSelected').length >= 2;

	nuSelectInParentDocument('.nuDragOptionsButton')
		.not('#move_tab_btn, #save_btn')
		.toggleClass('nuDragOptionsButtonDisabled', !hasMultipleSelections);

	nuSelectInParentDocument('#move_tab_btn, #save_btn').removeClass('nuDragOptionsButtonDisabled');
	nuSelectInParentDocument('#save_btn').addClass('nuSaveButtonEdited');
}

function nuCreateBox(event) {
	const box = document.createElement('div');
	box.setAttribute('id', 'nuSelectBox');
	$('body').append(box);

	$(box).css({
		'width': 1,
		'height': 1,
		'top': event.clientY + window.scrollY,
		'left': event.clientX,
		'position': 'absolute',
		'border-style': 'dashed',
		'border-width': 1,
		'border-color': 'red',
		'z-index': '4000',
		'background-color': 'transparent'
	});
}

function nuDragBox(event) {
	window.lastMoveX = window.moveX;
	window.lastMoveY = window.moveY;
	window.moveX = event.clientX - window.startX;
	window.moveY = event.clientY - window.startY;

	if ($('#nuSelectBox').length > 0) {
		nuResizeDrag(event);
	} else if ($('#nuSelectBox').length == 0 && nuCanMove()) {
		nuMoveSelected();
	}
}

function nuResizeDrag(event) {
	const selectBox = $('#nuSelectBox');
	const X = event.clientX - window.startX;
	const Y = event.clientY + window.scrollY - window.startY;

	if (X > 0) {
		selectBox.css('width', X);
	} else {
		selectBox.css({
			'width': -1 * X,
			'left': window.startX + X,
		});
	}

	if (Y > 0) {
		selectBox.css('height', Y);
	} else {
		selectBox.css({
			'height': -1 * Y,
			'top': window.startY + Y,
		});
	}
}

function nuAddDragSelected(element) {
	if (nuIsVisible(element)) {
		element.addClass('nuDragSelected');
	}
}

function nuGetNuDragDialogIframes(contents = false) {
	const iframes = $('#nuDragDialog iframe');
	return contents ? iframes.contents() : iframes;
}

function nuRemoveBox(ctrlKey) {
	const selectBox = $('#nuSelectBox');
	const bounds = {
		left: parseInt(selectBox.css('left'), 10),
		top: parseInt(selectBox.css('top'), 10) - nuGetTopArea(),
		right: 0,
		bottom: 0
	};

	bounds.bottom = bounds.top + parseInt(selectBox.css('height'), 10);
	bounds.right = bounds.left + parseInt(selectBox.css('width'), 10);

	selectBox.remove();

	const draggableObjects = $('[data-drag]');
	if (!ctrlKey) {
		$('.nuDragSelected').removeClass('nuDragSelected');
	}

	const selectedTab = $('.nuTabSelected').length > 0 ? $('.nuTabSelected')[0].id.substring(5) : 0;

	draggableObjects.each(function () {
		if ($(this).attr('data-nu-tab') == selectedTab) {
			const elementBounds = nuDragGetElementBounds(this);

			if (nuDragIsElementInBounds(elementBounds, bounds)) {
				nuAddDragSelected($(this));
			}
		}
	});
}

function nuInitialiseDragState() {
	window.nuDragOptionsState = { tabs: [] };
	let tabOrderCounter = 10;

	$('div.nuTab[id^="nuTab"]').each(function () {
		const tabObjects = {
			'tab_id': $(this).attr('data-nu-tab-id'),
			'objects': []
		};

		$('div#nuRECORD [data-nu-tab="' + $(this).prop('id').replace('nuTab', '') + '"]').each(function () {
			if (this.tagName != 'LABEL') {
				const objectPosition = $(this).position();
				const objectProperties = {
					'object_id': $(this).attr('data-nu-object-id'),
					'id': $(this).prop('id'),
					'left': objectPosition.left,
					'top': objectPosition.top,
					'width': $(this).width(),
					'height': $(this).height(),
					'tab_order': tabOrderCounter
				};
				tabObjects.objects.push(objectProperties);
				tabOrderCounter += 10;
			}
		});

		window.nuDragOptionsState.tabs.push(tabObjects);
	});
}

function nuSetTabOrderDataAttrs() {
	const currentTabNo = nuDragGetCurrentTabNumber();

	for (let i = 0; i < window.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {
		const field = window.nuDragOptionsState.tabs[currentTabNo].objects[i];
		nuSelectInParentDocument('#nuDragOptionsFields option[id="drag_' + field.id + '"]').attr('data-nu-tab-order', field.tab_order);
	}
}

function nuDragCurrentTabNumber() {
	return nuDragGetCurrentTabNumber();
}

function nuMoveUpOrder() {
	const currentTabNo = nuDragCurrentTabNumber();
	const currentSelectedFieldOption = $('select#nuDragOptionsFields option:selected');

	for (let i = 0; i < nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {
		const field = nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects[i];

		if (field.id == currentSelectedFieldOption.prop('id').replace('drag_', '')) {
			// if it's at the top, dont re-order anything
			if (field.id == $('select#nuDragOptionsFields option')[0].id.replace('drag_', '')) return;

			const previousFieldDOM = $('select#nuDragOptionsFields option[data-nu-tab-order="' + (Number(currentSelectedFieldOption.attr('data-nu-tab-order')) - 10) + '"]');
			const previousFieldSTATE = nuFindFieldInState(currentTabNo, previousFieldDOM.prop('id').replace('drag_', ''));

			field.tab_order = Number(previousFieldDOM.attr('data-nu-tab-order'));
			previousFieldSTATE.tab_order = field.tab_order + 10;

			$('option#drag_' + field.id).attr('data-nu-tab-order', field.tab_order);

			const previousFieldDOMID = previousFieldDOM.prop('id');
			previousFieldDOM.attr('data-nu-tab-order', previousFieldSTATE.tab_order);

			const previousFieldDOMHTML = $('option#' + previousFieldDOMID)[0].outerHTML;

			$('option#' + previousFieldDOMID).remove();
			$('option#drag_' + field.id).after(previousFieldDOMHTML);
		}
	}

	nuDragToggleTabOrder();
}

function nuMoveDownOrder() {
	const currentTabNo = nuDragCurrentTabNumber();
	const currentSelectedFieldOption = $('select#nuDragOptionsFields option:selected');

	for (let i = 0; i < nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {
		const field = nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects[i];

		if (field.id == currentSelectedFieldOption.prop('id').replace('drag_', '')) {
			// if it's at the bottom, dont re-order anything
			if (field.id == $('select#nuDragOptionsFields option')[($('select#nuDragOptionsFields option').length - 1)].id.replace('drag_', '')) {
				return;
			}

			const nextFieldDOM = $('select#nuDragOptionsFields option[data-nu-tab-order="' + (Number(currentSelectedFieldOption.attr('data-nu-tab-order')) + 10) + '"]');
			const nextFieldSTATE = nuFindFieldInState(currentTabNo, nextFieldDOM.prop('id').replace('drag_', ''));

			field.tab_order = Number(nextFieldDOM.attr('data-nu-tab-order'));
			nextFieldSTATE.tab_order = field.tab_order - 10;

			$('option#drag_' + field.id).attr('data-nu-tab-order', field.tab_order);

			const nextFieldDOMID = nextFieldDOM.prop('id');
			nextFieldDOM.attr('data-nu-tab-order', nextFieldSTATE.tab_order);

			const nextFieldDOMHTML = $('option#' + nextFieldDOMID)[0].outerHTML;

			$('option#' + nextFieldDOMID).remove();
			$('option#drag_' + field.id).before(nextFieldDOMHTML);
		}
	}

	nuDragToggleTabOrder();
}

function nuFindFieldInState(tabNo, fieldID) {
	for (let i = 0; i < nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects.length; i++) {
		if (nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects[i].id == fieldID) {
			return nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects[i];
		}
	}
	return null;
}

function nuDragCreateButton(id, className, iconClass, text, onClickFunction, title = "") {
	const style = text === "" ? 'padding-left: 10px; padding-right: 15px;' : '';
	return `<button id="${id}" class="${className}" onclick="${onClickFunction}();" title="${title}" style="${style}">
				<i class="${iconClass}"></i> ${text}
			</button>`;
}

function nuDragCreateSelectBox(id, className, extraStyle = '') {
	return `<select id="${id}" class="${className}" style="${extraStyle}"></select>`;
}

function nuDragCreateCheckbox(id, title, onClickFunction, iconClass, checked = true, marginLeft = '') {
	const checkedAttribute = checked ? 'checked' : '';
	return `<input type="checkbox" ${checkedAttribute} id="${id}" title="${title}" onclick="${onClickFunction}();" style="margin-left: ${marginLeft}">
			<label for="${id}"><i class="${iconClass}"></i></label>`;
}

function nuDragGenerateOptionsControlPanel(dragOptionsBoxWidth, dragOptionsBoxMinHeight, classNuDragOptionsButton) {
	return `
		<div id="nuDragOptionsBox" class="nuDragOptionsBox" style="width:${dragOptionsBoxWidth - 80}px;height:100%;min-height:${dragOptionsBoxMinHeight}px;">
			<div class="nuDragOptionsBoxContainer">
				<div id="dragOptionsTitle" class="nuDragOptionsBoxTitle">Options</div>
				<label for="nuDragOptionsFields" class="nuDragOptionsFieldsLabel">Object Tab Order</label>
				<select multiple id="nuDragOptionsFields" class="nuDragOptionsFields" onchange="nuUpdateDragSelections(this);"></select>
				<table>
					<tbody>
						<tr>
							<td>${nuDragCreateButton("move_up_btn", classNuDragOptionsButton, "nuDragOptionsIcon fa fa-arrow-up", "Up", "nuMoveUpOrder")}</td>
							<td>${nuDragCreateButton("move_top_btn", classNuDragOptionsButton, "nuDragOptionsIcon nuDragOptionsIcon270 fa fa-step-forward", "Top", "nuAlignTop")}</td>
						</tr>
						<tr>
							<td>${nuDragCreateButton("move_down_btn", classNuDragOptionsButton, "nuDragOptionsIcon fa fa-arrow-down", "Down", "nuMoveDownOrder")}</td>
							<td>${nuDragCreateButton("move_bottom_btn", classNuDragOptionsButton, "nuDragOptionsIcon nuDragOptionsIcon90 fa fa-step-forward", "Bottom", "nuAlignBottom")}</td>
						</tr>
						<tr>
							<td>${nuDragCreateButton("move_ver_btn", classNuDragOptionsButton, "nuDragOptionsIcon fa fa-bars", "Vertical", "nuSpaceVertically")}</td>
							<td>${nuDragCreateButton("move_left_btn", classNuDragOptionsButton, "nuDragOptionsIcon nuDragOptionsIcon180 fa fa-step-forward", "Left", "nuAlignLeft")}</td>
						</tr>
						<tr>
							<td>${nuDragCreateButton("move_hor_btn", classNuDragOptionsButton, "nuDragOptionsIcon nuDragOptionsIcon90 fa fa-bars", "Horizontal", "nuSpaceHorizontally")}</td>
							<td>${nuDragCreateButton("move_right_btn", classNuDragOptionsButton, "nuDragOptionsIcon fa fa-step-forward", "Right", "nuAlignRight")}</td>
						</tr>
						<tr>
							<td>${nuDragCreateButton("move_short_btn", classNuDragOptionsButton, "nuDragOptionsIcon nuDragOptionsIcon nuDragOptionsIcon135 fa-solid fa-down-left-and-up-right-to-center", "Shortest", "nuResizeToLowest")}</td>
							<td>${nuDragCreateButton("move_thin_btn", classNuDragOptionsButton, "nuDragOptionsIcon nuDragOptionsIcon nuDragOptionsIcon45 fa-solid fa-down-left-and-up-right-to-center", "Thinnest", "nuResizeToThinnest")}</td>
						</tr>
						<tr>
							<td>${nuDragCreateButton("move_tall_btn", classNuDragOptionsButton, "nuDragOptionsIcon nuDragOptionsIcon180 fa-solid fa-arrows-up-down", "Tallest", "nuResizeToHighest")}</td>
							<td>${nuDragCreateButton("move_wide_btn", classNuDragOptionsButton, "nuDragOptionsIcon nuDragOptionsIcon90 fa-solid fa-arrows-up-down", "Widest", "nuResizeToWidest")}</td>
						</tr>
						<tr>
							<td>${nuDragCreateSelectBox("nuDragOptionsTabsDropdown", "nuDragOptionsTabsDropdown", "border: none")}</td>
							<td>${nuDragCreateButton("move_tab_btn", `${classNuDragOptionsButton} fa-solid fa-angle-right`, "", "", "nuMoveNuDrag", "Move to Tab")}</td>
						</tr>
						<td>
							${nuDragCreateCheckbox("nuShowDragLabels", "Show Labels", "nuToggleDragLabels", "fa-solid fa-text-slash", false)}
							${nuDragCreateCheckbox("nuShowTaborder", "Tab Order", "nuDragToggleTabOrder", "fa-solid fa-list-ol")}
							${nuDragCreateCheckbox("nuShowHiddenObjects", "Show Hidden Objects", "nuToggleHiddenObjects", "fa-solid fa-eye-slash")}
						</td>
						<td>
							${nuDragCreateButton("save_btn", `${classNuDragOptionsButton}`, " fa-regular fa-lg fa-floppy-disk", "Save", "nuSaveNuDrag")}
						</td>
					</tbody>
				</table>
			</div>
		</div>`;
}

function nuCreateDragOptionsBox(form) {
	const dragOptionsBoxWidth = 400;
	const dragOptionsBoxMinHeight = 520;
	const classNuDragOptionsButton = "nuDragOptionsButton nuDragOptionsButtonDisabled nuButton";

	const optionsBoxHTML = nuDragGenerateOptionsControlPanel(dragOptionsBoxWidth, dragOptionsBoxMinHeight, classNuDragOptionsButton);

	nuSelectInParentDocument('#nuWindow').css('right', 15);
	nuSelectInParentDocument('#nuDragDialog')
		.css('top', 35)
		.prepend(optionsBoxHTML)
		.css('height', Math.max(dragOptionsBoxMinHeight + 10, window.innerHeight + 40))
		.css('width', nuFormWH().width + dragOptionsBoxWidth - 15);

	$('#nuBreadcrumbHolder').remove();

	nuInitialiseDragState();

	const tabSelected = $('.nuTabSelected');
	const tab = tabSelected.length > 0 ? tabSelected.attr('id').replace('nuTab', '') : 0;
	nuPopulateFieldsList(tab);
	nuPopulateTabDropdown(tab);

	setupTabClickHandlers();
	nuCheckIfMovingTabOrderAllowed($('#nuDragOptionsFields'));
	nuCheckIfMovingFieldToOtherTabAllowed($('#nuDragOptionsFields'));

	addHelpButton();
	setupInitialLayout();

	if ($('div.nuTab[id^="nuTab"]').length == 1) {
		nuSelectInParentDocument('#move_tab_btn').css('visibility', 'hidden');
		nuSelectInParentDocument('#nuDragOptionsTabsDropdown').css('visibility', 'hidden');
	}

	setupRecordDimensions();
	nuDragToggleTabOrder();
}

function setupTabClickHandlers() {
	$('.nuTab[id^="nuTab"]').prop('onclick', '')
		.on('click', function () {
			if ($(this).hasClass('nuTabSelected')) return;

			nuClearFieldsList();
			nuUnselectAllDragObjects();
			nuSelectTab(this);
			nuShowContentBoxFrames();

			const nuTabFilter = Number($(this).attr('data-nu-tab-filter'));
			nuPopulateFieldsList(nuTabFilter);
			nuPopulateTabDropdown(nuTabFilter);

			const $nuDragOptionsFields = nuSelectInParentDocument('#nuDragOptionsFields');
			nuCheckIfMovingTabOrderAllowed($nuDragOptionsFields);
			nuCheckIfMovingFieldToOtherTabAllowed($nuDragOptionsFields);

			nuDragToggleTabOrder();
		});
}

function addHelpButton() {
	const helpMessages = [
		"Use arrow keys to move selected Objects.",
		"Use arrow keys + SHIFT to resize selected Objects.",
		"Draw a square around Objects to highlight them.",
		"Hold CTRL to add Objects to the current selection."
	];

	const help = `<input id='run_sam' type='button' class='input_button nuButton' value='?'
	  onclick='nuMessage(${JSON.stringify(helpMessages)})'
	  style='top: 2px; right: 15px; width: 21px; height: 21px; text-align: center; padding-left: 5px; position: absolute;'>`;

	$('body').append(help);
	nuSelectInParentDocument('#nuDragDialog').css('min-height', '570px');
}

function setupInitialLayout() {
	nuAddContentBoxFrames();
	nuShowContentBoxFrames();
	nuToggleHiddenObjects();
}

function setupRecordDimensions() {
	$('#nuRECORD').css({
		'height': window.innerHeight,
		'width': "98%"
	});
	parent.$('#nuWindow').css("height", "90%");
}

function nuDragToggleTabOrder() {
	nuDragSelectInIframe('.nu-drag-marker').remove();

	const parentDoc = window.parent.document;
	if (!parentDoc.querySelector('#nuShowTaborder').checked) return;

	const select = parentDoc.querySelector('#nuDragOptionsFields');
	Array.from(select.options).forEach((option, index) => {
		const target = nuDragSelectInIframe('#' + option.value)[0] || document.getElementById(option.value);
		if (target && target.getAttribute('data-drag') === '1') {
			createTabOrderMarker(target, index);
		}
	});
}

function createTabOrderMarker(target, index) {
	const marker = document.createElement("div");
	marker.className = "nu-drag-marker";
	marker.textContent = index;

	const width = target.getBoundingClientRect().width;
	const baseStyle = {
		position: "absolute",
		backgroundColor: "red",
		color: "white",
		padding: "2px 5px",
		margin: "0",
		fontSize: "12px",
		zIndex: "9999",
		borderRadius: "4px",
		boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
		pointerEvents: "none"
	};

	if (width < 50) {
		Object.assign(marker.style, baseStyle, {
			top: "50%",
			left: "100%",
			transform: "translate(4px, -50%)"
		});
		if (getComputedStyle(target).overflow === "hidden") {
			target.style.overflow = "visible";
		}
	} else {
		Object.assign(marker.style, baseStyle, {
			top: "0",
			right: "0",
			left: "auto",
			transform: "translate(-2px, 2px)"
		});
	}

	if (getComputedStyle(target).position === "static") {
		target.style.position = "relative";
	}

	if (target.classList.contains('nu_contentbox')) {
		target.parentElement.querySelector('.nuContentBoxFrame').appendChild(marker);
	} else {
		target.appendChild(marker);
	}
}

function nuToggleHiddenObjects() {
	nuDragSelectInIframe('.nuDragHidden').each(function () {
		$(this).css('visibility', function (i, visibility) {
			return visibility === 'visible' ? 'hidden' : 'visible';
		});
	});
}

function nuToggleDragLabels() {
	nuDragSelectInIframe('.nuDragLabel').each(function () {
		$(this).css('visibility', function (i, visibility) {
			return visibility === 'visible' ? 'hidden' : 'visible';
		});
	});

	nuDragSelectInIframe("[data-drag-button-label]").each(function () {
		const $this = $(this);
		if ($this.is("[data-drag-value-visible]")) {
			$this.text(this.id).removeAttr('data-drag-value-visible');
		} else {
			$this.text($this.attr('data-drag-button-label')).attr('data-drag-value-visible', '');
		}
	});

	nuDragToggleTabOrder();
}

function nuShowContentBoxFrames() {
	$('.nu_contentbox').each(function () {
		const frameId = 'frame_' + $(this).attr('id');
		const frameObj = $("#" + frameId);

		if ($(this).is(":visible")) {
			frameObj.css('visibility', 'visible');
		} else {
			frameObj.css('visibility', 'hidden');
		}
	});
}

function nuAddContentBoxFrames() {
	$('.nu_contentbox').each(function () {
		const $this = $(this);
		const dimensions = {
			width: $this.nuCSSNumber('width'),
			top: $this.nuCSSNumber('top') + 18,
			left: $this.nuCSSNumber('left'),
			height: $this.nuCSSNumber('height')
		};

		const frameId = 'frame_' + $this.attr('id');
		const backgroundColor = $this.css('background-color');

		const frameDiv = `<div class="nuContentBoxFrame" id="${frameId}"
			style="position: absolute; border:2px double ${backgroundColor};
			width:${dimensions.width}px;height:${dimensions.height}px;
			top:${dimensions.top}px;left:${dimensions.left}px"></div>`;

		$(frameDiv).insertAfter($this);
	});

	$('.nu_contentbox').css('height', '16');
}

function nuDragSelected() {
	return nuDragSelectInIframe('.nuDragSelected');
}

function nuThisContentBox(element) {
	return nuDragSelectInIframe('#frame_' + $(element).attr('id'));
}

function nuThisLabel(element) {
	return nuDragSelectInIframe('#label_' + $(element).attr('id'));
}

function nuResizeToLowest() {
	const selected = nuDragSelected();
	let lowest = 1000000;

	selected.each(function () {
		const contentBox = nuThisContentBox(this);
		const height = contentBox.length == 0 ? $(this).height() : contentBox.height();
		if (height < lowest) {
			lowest = height;
		}
	});

	selected.each(function () {
		const contentBox = nuThisContentBox(this);
		if (contentBox.length == 0) {
			nuDragSetElementSize(this, undefined, lowest);
		} else {
			nuDragSetElementSize(contentBox, undefined, lowest);
		}
	});
}

function nuResizeToThinnest() {
	const selected = nuDragSelected();
	let thinnest = 1000000;

	selected.each(function () {
		if ($(this).width() < thinnest) {
			thinnest = $(this).width();
		}
	});

	selected.each(function () {
		nuDragSetElementSize(this, thinnest, undefined);
		const contentBox = nuThisContentBox(this);
		if (contentBox.length == 1) {
			nuDragSetElementSize(contentBox, thinnest, undefined);
		}
	});
}

function nuResizeToHighest() {
	const selected = nuDragSelected();
	let highest = 0;

	selected.each(function () {
		const contentBox = nuThisContentBox(this);
		const height = contentBox.length == 0 ? $(this).height() : contentBox.height();
		if (height > highest) {
			highest = height;
		}
	});

	selected.each(function () {
		const contentBox = nuThisContentBox(this);
		if (contentBox.length == 0) {
			nuDragSetElementSize(this, undefined, highest);
		} else {
			nuDragSetElementSize(contentBox, undefined, highest);
		}
	});
}

function nuResizeToWidest() {
	const selected = nuDragSelected();
	let widest = 0;

	selected.each(function () {
		if ($(this).width() > widest) {
			widest = $(this).width();
		}
	});

	selected.each(function () {
		nuDragSetElementSize(this, widest, undefined);
		const contentBox = nuThisContentBox(this);
		if (contentBox.length == 1) {
			nuDragSetElementSize(contentBox, widest, undefined);
		}
	});
}

function nuSortObjAsc(a, b) {
	return a.top - b.top;
}

function nuSpacingNotSupported() {
	const supported = nuDragSelectInIframe('.nuDragSelected').filter('.nu_contentbox').length == 0;
	if (!supported) {
		nuMessage(`${nuTranslate('Information')}`, 'Vertical spacing of ContentBox is not supported yet.');
	}
	return supported;
}

function nuSpaceHorizontally() {
	if (!nuSpacingNotSupported()) return;

	const selectedFields = [];
	nuDragSelectInIframe('.nuDragSelected').each(function () {
		selectedFields.push({
			left: $(this).position().left,
			width: $(this).width(),
			id: $(this).prop('id')
		});
	});

	selectedFields.sort(nuSortObjAsc);

	let gapTotal = 0;
	let leftTotal = 0;

	for (let i = 1; i < selectedFields.length; i++) {
		gapTotal += selectedFields[i].left - (selectedFields[i - 1].left + selectedFields[i - 1].width);
		leftTotal += selectedFields[i].left - selectedFields[i - 1].left;
	}

	const gapAvg = Math.round(gapTotal / (selectedFields.length - 1));
	const leftAvg = Math.round(leftTotal / (selectedFields.length - 1));

	if (gapAvg < 0) {
		for (let i = 1; i < selectedFields.length; i++) {
			const newLeft = nuDragSelectInIframe('#' + selectedFields[i - 1].id).position().left + leftAvg;
			nuDragSetElementPosition(nuDragSelectInIframe('#' + selectedFields[i].id), newLeft, undefined);
		}
	} else {
		for (let i = 1; i < selectedFields.length; i++) {
			const $prevField = nuDragSelectInIframe('#' + selectedFields[i - 1].id);
			const newLeft = $prevField.position().left + $prevField.width() + gapAvg;
			nuDragSetElementPosition(nuDragSelectInIframe('#' + selectedFields[i].id), newLeft, undefined);
		}
	}
}

function nuSpaceVertically() {
	if (!nuSpacingNotSupported()) return;

	const $dialogIframes = nuGetNuDragDialogIframes(true);
	const selectedFields = [];

	nuDragSelectInIframe('.nuDragSelected').each(function () {
		const $this = $(this);
		selectedFields.push({
			top: $this.position().top,
			height: $this.height(),
			id: $this.prop('id')
		});
	});

	selectedFields.sort(nuSortObjAsc);

	let gapTotal = 0;
	let topTotal = 0;
	const selectedFieldsLength = selectedFields.length;

	for (let i = 1; i < selectedFieldsLength; i++) {
		const currentField = selectedFields[i];
		const previousField = selectedFields[i - 1];
		const prevFieldTopPlusHeight = previousField.top + previousField.height;

		gapTotal += currentField.top - prevFieldTopPlusHeight;
		topTotal += currentField.top - previousField.top;
	}

	const gapAvg = Math.round(gapTotal / (selectedFieldsLength - 1));
	const topAvg = Math.round(topTotal / (selectedFieldsLength - 1));

	if (gapAvg < 0) {
		for (let i = 1; i < selectedFieldsLength; i++) {
			const newTop = nuDragSelectInIframe('#' + selectedFields[i - 1].id).position().top + topAvg;
			nuDragSetElementPosition(nuDragSelectInIframe('#' + selectedFields[i].id), undefined, newTop);
		}
	} else {
		for (let i = 1; i < selectedFieldsLength; i++) {
			const $prevField = nuDragSelectInIframe('#' + selectedFields[i - 1].id);
			const newTop = $prevField.position().top + $prevField.height() + gapAvg;
			nuDragSetElementPosition(nuDragSelectInIframe('#' + selectedFields[i].id), undefined, newTop);
		}
	}
}

function nuAlignRight() {
	const selected = nuDragSelected();
	let rightestPoint = 0;

	selected.each(function () {
		const rightEdge = $(this).position().left + $(this).width();
		if (rightEdge > rightestPoint) {
			rightestPoint = rightEdge;
		}
	});

	selected.each(function () {
		const newLeft = rightestPoint - $(this).width();
		nuDragSetElementPosition(this, newLeft, undefined);

		const label = nuThisLabel(this);
		if (label.length == 1) {
			const labelLeft = rightestPoint - $(this).width() - label.nuCSSNumber('width') - 5;
			nuDragSetElementPosition(label, labelLeft, undefined);
		}
	});
}

function nuAlignLeft() {
	const selected = nuDragSelected();
	let leftestPoint = 1000000;

	selected.each(function () {
		if ($(this).position().left < leftestPoint) {
			leftestPoint = $(this).position().left;
		}
	});

	selected.each(function () {
		nuDragSetElementPosition(this, leftestPoint, undefined);

		const contentBox = nuThisContentBox(this);
		const label = nuThisLabel(this);

		if (label.length == 1) {
			const labelLeft = leftestPoint - label.nuCSSNumber('width') - 5;
			nuDragSetElementPosition(label, labelLeft, undefined);
		}

		if (contentBox.length == 1) {
			nuDragSetElementPosition(contentBox, leftestPoint, undefined);
		}
	});
}

function nuAlignTop() {
	const selected = nuDragSelected();
	let highestPoint = 1000000;

	selected.each(function () {
		if ($(this).position().top < highestPoint) {
			highestPoint = $(this).position().top;
		}
	});

	selected.each(function () {
		nuDragSetElementPosition(this, undefined, highestPoint);

		const contentBox = nuThisContentBox(this);
		if (contentBox.length == 1) {
			nuDragSetElementPosition(contentBox, undefined, highestPoint + 18);
		}

		const label = nuThisLabel(this);
		if (label.length == 1) {
			nuDragSetElementPosition(label, undefined, highestPoint);
		}
	});
}

function nuAlignBottom() {
	const selected = nuDragSelected();
	let lowestPoint = 0;

	selected.each(function () {
		const contentBox = nuThisContentBox(this);
		const bottomEdge = contentBox.length == 0
			? $(this).position().top + $(this).height()
			: contentBox.position().top + contentBox.height();

		if (bottomEdge > lowestPoint) {
			lowestPoint = bottomEdge;
		}
	});

	selected.each(function () {
		const contentBox = nuThisContentBox(this);
		let newTop;

		if (contentBox.length == 0) {
			newTop = lowestPoint - $(this).height();
			nuDragSetElementPosition(this, undefined, newTop);
		} else {
			newTop = lowestPoint - contentBox.height() - 18;
			nuDragSetElementPosition(this, undefined, newTop);
			nuDragSetElementPosition(contentBox, undefined, newTop + 18);
		}

		const label = nuThisLabel(this);
		if (label.length == 1) {
			nuDragSetElementPosition(label, undefined, lowestPoint - $(this).height());
		}
	});
}

function nuMoveNuDrag() {
	//find tab we are moving objects to
	const moveToTab = $('#nuDragOptionsTabsDropdown').val().substring(5);

	$('#nuDragOptionsFields :selected').each(function (i, selected) {
		const fieldToMove = $(selected).text();
		const initialTab = $('#nuWindow').contents().find('#' + fieldToMove).attr('data-nu-tab');

		//hide objects on screen so they can be redrawn on correct tab.
		$('#nuWindow').contents().find('#' + fieldToMove).attr('data-nu-tab', moveToTab).hide();

		//get tab objects array
		const tabObjects = $("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab];
		let foundField = false;

		for (let i = 0; i < tabObjects.objects.length; i++) {
			if (tabObjects.objects[i].id == fieldToMove) {
				const fieldObject = $("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects[i];
				foundField = true;

				$("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[moveToTab].objects.push(fieldObject);
				$("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects.splice(i, 1);
				i--;
			} else if (foundField) {
				$("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects[i].tab_order -= 10;
			}
		}

		//update orders
		const tabObjectsU = $("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[moveToTab];
		for (let j = 0; j < tabObjectsU.objects.length; j++) {
			tabObjectsU.objects[j].tab_order = Number(j * 10) + Number(moveToTab * 100);
		}
	});

	//go to new tab
	$('#nuWindow').contents().find('#nuTab' + moveToTab).trigger("click");
}

function nuSaveNuDrag() {
	$("body").append('<div id="overlay" style="background-color:grey;position:absolute;top:0;left:0;height:100%;width:100%;z-index:999;"></div>');

	if (!nuPutFieldDimensionsIntoState()) {
		return;
	}

	if (parent.nuFORM !== undefined) {
		parent.nuFORM.edited = false;
	}

	nuSaveAfterDrag();
}

function nuAbortSaveDrag() {
	$("#overlay").remove();
}

function nuPutFieldDimensionsIntoState() {
	for (let tabNo = 0; tabNo < nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs.length; tabNo++) {
		for (let fieldNo = 0; fieldNo < nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects.length; fieldNo++) {
			const field = nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects[fieldNo];
			const contents = nuDragSelectInIframe('#' + field.id);
			const contentBox = nuDragSelectInIframe('div#frame_' + field.id);

			if (contents.length == 1) {
				contents.show();

				field.left = contents.position().left;
				field.top = contents.position().top;
				field.width = contents.width();
				field.height = contentBox.length == 0 ? contents.height() : contentBox.height();

				contents.hide();
			} else {
				alert('Error putting field dimensions into state with id: ' + field.id);
				return false;
			}
		}
	}
	return true;
}

function nuUpdateDragSelections(fieldsSelectBox) {
	nuUnselectAllDragObjects();
	nuCheckIfMovingTabOrderAllowed(fieldsSelectBox);
	nuCheckIfMovingFieldToOtherTabAllowed(fieldsSelectBox);

	$('option:selected', fieldsSelectBox).each(function () {
		nuDragSelectInIframe('#' + $(this).prop('id').replace('drag_', '')).addClass('nuDragSelected');
	});
}

function nuCheckIfMovingTabOrderAllowed(fieldsSelectBox) {
	const upDownBtnSelectors = '#move_down_btn, #move_up_btn';
	const shouldEnable = $('option:selected', fieldsSelectBox).length == 1;

	nuDragButtonToggleState(upDownBtnSelectors, shouldEnable, false);
	nuDragButtonToggleState(upDownBtnSelectors, shouldEnable, true);
}

function nuCheckIfMovingFieldToOtherTabAllowed(fieldsSelectBox) {
	const tabDropdown = nuSelectInParentDocument('#nuDragOptionsTabsDropdown');
	const hasSelection = $('option:selected', fieldsSelectBox).length >= 1;

	tabDropdown.prop('disabled', !hasSelection);
}

function nuUnselectAllDragObjects() {
	$('.nuDragSelected').removeClass('nuDragSelected');
	nuDragSelectInIframe('.nuDragSelected').removeClass('nuDragSelected');
}

function nuSelectAllDragObjects() {
	$('[data-drag]').each(function () {
		if ($(this).is(":visible")) {
			nuAddDragSelected($(this));
		}
	});

	nuDragSelectInIframe('[data-drag]').each(function () {
		if ($(this).is(":visible")) {
			nuAddDragSelected($(this));
		}
	});
}

function nuClearFieldsList() {
	nuSelectInParentDocument('#nuDragOptionsFields').html('');
	nuSelectInParentDocument('#nuDragOptionsTabsDropdown').html('');
}

function nuPopulateFieldsList(currentlySelectedTabNo) {
	let tabOrderSearch = nuGetMinTabOrderInTab(currentlySelectedTabNo);

	for (let i = 0; i < window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects.length; i++) {
		for (let j = 0; j < window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects.length; j++) {
			const field = window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects[j];

			if (field.tab_order == tabOrderSearch) {
				nuSelectInParentDocument('#nuDragOptionsFields').append('<option id="drag_' + field.id + '">' + field.id + '</option>');

				if ($('#' + field.id).css('visibility') !== 'visible') {
					nuSelectInParentDocument('#nuDragOptionsFields option[id="drag_' + field.id + '"]').css('color', 'grey');
				}
			}
		}
		tabOrderSearch += 10;
	}

	nuSetTabOrderDataAttrs();
}

function nuGetMinTabOrderInTab(currentTabNo) {
	let minTabOrder = 1000000;

	for (let i = 0; i < window.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {
		if (window.nuDragOptionsState.tabs[currentTabNo].objects[i].tab_order < minTabOrder) {
			minTabOrder = window.nuDragOptionsState.tabs[currentTabNo].objects[i].tab_order;
		}
	}

	return minTabOrder == 1000000 ? null : minTabOrder;
}

function nuMoveSelected() {
	const selectedElements = document.getElementsByClassName('nuDragSelected');
	const deltaX = window.moveX - window.lastMoveX;
	const deltaY = window.moveY - window.lastMoveY;

	for (let i = 0; i < selectedElements.length; i++) {
		const element = selectedElements[i];
		const currentStyle = element.style;
		const newLeft = parseInt(currentStyle.left, 10) + deltaX;
		const newTop = parseInt(currentStyle.top, 10) + deltaY;

		nuDragSetElementPosition(element, newLeft, newTop);

		// Move ContentBox too
		const elements = nuDragGetRelatedElements($(element).attr('id'));
		if (elements.contentBox.length == 1) {
			nuDragSetElementPosition(elements.contentBox, newLeft, newTop + 18);
		}

		if (elements.label.length !== 0) {
			nuDragSetElementPosition(elements.label, newLeft - elements.label.nuCSSNumber('width') - 5, newTop);
		}
	}
}

function nuCanMove() {
	const selectedElements = document.getElementsByClassName('nuDragSelected');
	const deltaX = window.moveX - window.lastMoveX;
	const deltaY = window.moveY - window.lastMoveY;

	for (let i = 0; i < selectedElements.length; i++) {
		const element = selectedElements[i];
		const currentStyle = element.style;
		const newLeft = parseInt(currentStyle.left, 10) + deltaX;
		const newTop = parseInt(currentStyle.top, 10) + deltaY;

		if (newLeft < 0 || newTop < 0) {
			return false;
		}
	}

	return true;
}

function nuGetTopArea() {
	const element = document.getElementById('nuRECORD');
	const rect = element.getBoundingClientRect();
	return rect.top + window.scrollY;
}

function nuPopulateTabDropdown(currentlySelectedTabNo) {
	// Create a dropdown with the values of the tabs
	$('div.nuTab[id^="nuTab"]').each(function () {
		const tabNumber = $(this).attr('data-nu-tab-filter');
		const tabName = $(this).text();

		if (tabNumber != currentlySelectedTabNo) {
			nuSelectInParentDocument('#nuDragOptionsTabsDropdown').append('<option value="nuTab' + tabNumber + '">' + tabName + '</option>');
		}
	});

	// Select the current tab
	$('#nuDragOptionsTabsDropdown').find('option:first').prop('selected', 'selected');
}

function nuDragElement(element, dragHeaderOffset) {
	let startX = 0,
		startY = 0,
		endX = 0,
		endY = 0;

	element.onmousedown = dragStart;
	element.ontouchstart = dragStart;

	function dragStart(e) {
		if (dragHeaderOffset !== undefined) {
			const touch = (e.touches?.[0]) || (e.pointerType && e.pointerType === 'touch' && e);
			const clientY = (touch || e).clientY;

			if (clientY - e.currentTarget.offsetTop > dragHeaderOffset) {
				return;
			}
		}

		e.preventDefault();

		// mouse cursor position at start
		if (e.clientX) { // mousemove
			startX = e.clientX;
			startY = e.clientY;
		} else { // touchmove - assuming a single touchpoint
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
		}

		document.onmouseup = dragStop;
		document.ontouchend = dragStop;
		document.onmousemove = elementDrag;
		document.ontouchmove = elementDrag;
	}

	function elementDrag(e) {
		e.preventDefault();

		let clientX, clientY;

		// Detect touch or mouse
		if (e.touches && e.touches.length > 0) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else if (typeof e.clientX === 'number') {
			clientX = e.clientX;
			clientY = e.clientY;
		} else {
			// Exit early if neither clientX nor touches are available
			return;
		}

		endX = startX - clientX;
		endY = startY - clientY;
		startX = clientX;
		startY = clientY;

		// Ensure element is defined
		if (typeof element !== 'undefined') {
			nuDragSetElementPosition(element, element.offsetLeft - endX, element.offsetTop - endY);
		}
	}

	function dragStop() {
		// stop moving on touch end / mouse btn is released
		document.onmouseup = null;
		document.onmousemove = null;
		document.ontouchend = null;
		document.ontouchmove = null;
	}
}
