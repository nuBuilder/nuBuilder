function nuBindDragEvents() {

	$(document).on('mousemove.nuformdrag', function (e) {

		let arrangingObjects = window.nuFORM.breadcrumbs.length != -1 && nuArrangingObjects();

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

			let id = e.target.id;

			if (id === '')
				return;

			const isCb = $('#' + id).hasClass('nuContentBoxFrame');

			if (e.target === document.body || isCb || e.target === $('#nuRECORD')[0]) {

				if (!(nuIsMacintosh() ? e.metaKey : e.ctrlKey)) {
					$('.nuDragSelected').removeClass('nuDragSelected');
				}

				nuCreateBox(e);

			} else {

				if (!(nuIsMacintosh() ? e.metaKey : e.ctrlKey) && !$('#' + id).hasClass('nuDragSelected')) {
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
				nuRemoveBox((nuIsMacintosh() ? e.metaKey : e.ctrlKey));
			}

		}

		nuUpdateDragFieldsListbox();

	});

	var nuDragKeydownListener = function (e) {

		if ((nuIsMacintosh() ? e.metaKey : e.ctrlKey) && e.key === "a") {
			nuSelectAllDragObjects();
			nuUpdateDragFieldsListbox();
			e.preventDefault();
			return;

		}

		var keyDirection = '';

		if (e.key == 'ArrowLeft') {
			keyDirection = 'left';
		} else if (e.key == 'ArrowRight') {
			keyDirection = 'right';
		} else if (e.key == 'ArrowUp') {
			keyDirection = 'up';
		} else if (e.key == 'ArrowDown') {
			keyDirection = 'down';
		}

		if (keyDirection != '') {

			$('.nuDragSelected').each(function () {

				var prop = '';
				var val = '';

				var t = $(this);
				var tLabel = $('#label_' + t.attr('id'));
				var cb = $('#frame_' + t.attr('id'));

				if (keyDirection == 'left') {

					if (e.shiftKey) {

						prop = 'width';
						val = t.width() - 1;

					} else {

						prop = 'left';
						val = t.position().left - 1;
						if (tLabel.length !== 0)
							valLabel = tLabel.position().left - 1;

					}

				} else if (keyDirection == 'right') {

					if (e.shiftKey) {

						prop = 'width';
						val = t.width() + 1;

					} else {

						prop = 'left';
						val = t.position().left + 1;
						if (tLabel.length !== 0)
							valLabel = tLabel.position().left + 1;

					}

				} else if (keyDirection == 'up') {

					if (e.shiftKey) {

						prop = 'height';
						val = cb.length == 0 ? t.height() - 1 : cb.height() - 1;

					} else {

						prop = 'top';
						val = t.position().top - 1;
						if (tLabel.length !== 0)
							valLabel = tLabel.position().top - 1;

					}

				} else if (keyDirection == 'down') {

					if (e.shiftKey) {

						prop = 'height';
						val = cb.length == 0 ? t.height() + 1 : cb.height() + 1;

					} else {

						prop = 'top';
						val = t.position().top + 1;
						if (tLabel.length !== 0)
							valLabel = tLabel.position().top + 1;

					}

				}

				if (!(prop == 'height' && t.hasClass('nu_contentbox'))) {
					t.css(prop, val + 'px');
				}

				if ((prop == 'left' || prop == 'top') && (tLabel.length !== 0)) {
					tLabel.css(prop, valLabel + 'px');
				}

				// ContentBox
				var cb = $('#frame_' + t.attr('id'));
				if (cb.length == 1) {
					if (prop == 'top')
						val += 18;
					cb.css(prop, val + 'px');
				}

			});
		}
	}

	$(document).on('keydown.nuformdrag', nuDragKeydownListener);
	$(window.parent.document).on('keydown.nuformdrag', nuDragKeydownListener);

}

function nuUnbindDragEvents() {
	$(document).off('.nuformdrag');
}

function nuUpdateDragFieldsListbox() {

	$('#nuDragOptionsFields option:selected', window.parent.document.body).prop('selected', false);

	$('.nuDragSelected').each(function () {
		$('#nuDragOptionsFields option[id="drag_' + $(this).prop('id') + '"]', window.parent.document.body).prop('selected', 'selected');
	});

	nuCheckIfMovingTabOrderAllowed($('#nuDragOptionsFields', window.parent.document.body));
	nuCheckIfMovingFieldToOtherTabAllowed($('#nuDragOptionsFields', window.parent.document.body));
}

function nuCreateBox(event) {

	var e = document.createElement('div');

	e.setAttribute('id', 'nuSelectBox');

	$('body').append(e);

	$('#' + e.id).css({
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
	} else {

		if ($('#nuSelectBox').length == 0 && nuCanMove()) {
			nuMoveSelected();
		}

	}

}

function nuResizeDrag(event) {

	var selectBox = $('#nuSelectBox');
	var X = event.clientX - window.startX;
	var Y = event.clientY + window.scrollY - window.startY;

	if (X > 0) {

		selectBox.css({
			'width': X
		});

	} else {

		selectBox.css({
			'width': -1 * X,
			'left': window.startX + X,
		});

	}

	if (Y > 0) {

		selectBox.css({
			'height': Y
		});

	} else {

		selectBox.css({
			'height': -1 * Y,
			'top': window.startY + Y,
		});

	}

}

function nuAddDragSelected(t) {

	if (nuIsVisible(t)) {
		t.addClass('nuDragSelected');
	}

}

function nuGetNuDragDialogIframes(contents = false) {

	const iframes = $('#nuDragDialog iframe');
	return contents ? iframes.contents() : iframes;

}

function nuRemoveBox(ctrlKey) {

	var selectBox = $('#nuSelectBox');

	var L = parseInt(selectBox.css('left'), 10);
	var T = parseInt(selectBox.css('top'), 10) - nuGetTopArea();
	var B = T + parseInt(selectBox.css('height'), 10);
	var R = L + parseInt(selectBox.css('width'), 10);

	selectBox.remove();

	var o = $('[data-drag]');

	if (!ctrlKey) {
		$('.nuDragSelected').removeClass('nuDragSelected');
	}

	var selectedTab = $('.nuTabSelected').length > 0 ? $('.nuTabSelected')[0].id.substring(5) : 0;

	o.each(function () {

		if ($(this).attr('data-nu-tab') == selectedTab) {
			var l = parseInt($(this).css('left'), 10);
			var t = parseInt($(this).css('top'), 10);
			var b = t + parseInt($(this).css('height'), 10);
			var r = l + parseInt($(this).css('width'), 10);

			//drag around selected objects points
			if (l >= L && l <= R && t >= T && t <= B) {
				nuAddDragSelected($(this));
			} else if (r >= L && r <= R && t >= T && t <= B) {
				nuAddDragSelected($(this));
			} else if (l >= L && l <= R && b >= T && b <= B) {
				nuAddDragSelected($(this));
			} else if (r >= L && r <= R && b >= T && b <= B) {
				nuAddDragSelected($(this));
			}

			//drag within selected objects points
			if (L >= l && L <= r && T >= t && T <= b) {
				nuAddDragSelected($(this));
			} else if (R >= l && R <= r && T >= t && T <= b) {
				nuAddDragSelected($(this));
			} else if (L >= l && L <= r && B >= t && B <= b) {
				nuAddDragSelected($(this));
			} else if (R >= l && R <= r && B >= t && B <= b) {
				nuAddDragSelected($(this));
			}

			//drag through object but not through any points
			if (L >= l && L <= r && T <= t && B >= b) {
				nuAddDragSelected($(this));
			} else if (L <= l && R >= r && T >= t && B <= b) {
				nuAddDragSelected($(this));
			}

		}

	});

}

function nuInitialiseDragState() {

	window.nuDragOptionsState = {
		'tabs': []
	};

	let tabOrderCounter = 10;

	$('div.nuTab[id^="nuTab"]').each(function () {

		var objects = {
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

				objects.objects.push(objectProperties);
				tabOrderCounter = tabOrderCounter + 10;

			}

		});

		window.nuDragOptionsState.tabs.push(objects);

	});

}

function nuSetTabOrderDataAttrs() {

	var currentTabNo = $('div.nuTabSelected[id^="nuTab"]').attr('data-nu-tab-filter') || '0';

	for (var i = 0; i < window.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {

		var field = window.nuDragOptionsState.tabs[currentTabNo].objects[i];

		$('#nuDragOptionsFields option[id="drag_' + field.id + '"]', window.parent.document.body).attr('data-nu-tab-order', field.tab_order);

	}

}

function nuDragCurrentTabNumber() {
	return $('div.nuTabSelected[id^="nuTab"]', nuGetNuDragDialogIframes(true)).attr('data-nu-tab-filter') || '0'
}

function nuMoveUpOrder() {

	var currentTabNo = nuDragCurrentTabNumber();
	var currentSelectedFieldOption = $('select#nuDragOptionsFields option:selected');

	for (var i = 0; i < nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {

		var field = nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects[i];

		if (field.id == currentSelectedFieldOption.prop('id').replace('drag_', '')) {

			// if it's at the top, dont re-order anything
			if (field.id == $('select#nuDragOptionsFields option')[0].id.replace('drag_', ''))
				return;

			var previousFieldDOM = $('select#nuDragOptionsFields option[data-nu-tab-order="' + (Number(currentSelectedFieldOption.attr('data-nu-tab-order')) - 10) + '"]');
			var previousFieldSTATE = nuFindFieldInState(currentTabNo, previousFieldDOM.prop('id').replace('drag_', ''));

			field.tab_order = Number(previousFieldDOM.attr('data-nu-tab-order'));
			previousFieldSTATE.tab_order = field.tab_order + 10;

			$('option#drag_' + field.id).attr('data-nu-tab-order', field.tab_order);

			var previousFieldDOMID = previousFieldDOM.prop('id');
			previousFieldDOM.attr('data-nu-tab-order', previousFieldSTATE.tab_order);

			var previousFieldDOMHTML = $('option#' + previousFieldDOMID)[0].outerHTML;

			$('option#' + previousFieldDOMID).remove();
			$('option#drag_' + field.id).after(previousFieldDOMHTML);

		}

	}

	nuDragToggleTabOrder();

}

function nuMoveDownOrder() {

	var currentTabNo = nuDragCurrentTabNumber();
	var currentSelectedFieldOption = $('select#nuDragOptionsFields option:selected');

	for (var i = 0; i < nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {

		var field = nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects[i];

		if (field.id == currentSelectedFieldOption.prop('id').replace('drag_', '')) {

			// if it's at the bottom, dont re-order anything
			if (field.id == $('select#nuDragOptionsFields option')[($('select#nuDragOptionsFields option').length - 1)].id.replace('drag_', '')) {
				return;
			}

			var nextFieldDOM = $('select#nuDragOptionsFields option[data-nu-tab-order="' + (Number(currentSelectedFieldOption.attr('data-nu-tab-order')) + 10) + '"]');
			var nextFieldSTATE = nuFindFieldInState(currentTabNo, nextFieldDOM.prop('id').replace('drag_', ''));

			field.tab_order = Number(nextFieldDOM.attr('data-nu-tab-order'));
			nextFieldSTATE.tab_order = field.tab_order - 10;

			$('option#drag_' + field.id).attr('data-nu-tab-order', field.tab_order);

			var nextFieldDOMID = nextFieldDOM.prop('id');

			nextFieldDOM.attr('data-nu-tab-order', nextFieldSTATE.tab_order);

			var nextFieldDOMHTML = $('option#' + nextFieldDOMID)[0].outerHTML;

			$('option#' + nextFieldDOMID).remove();
			$('option#drag_' + field.id).before(nextFieldDOMHTML);

		}

	}

	nuDragToggleTabOrder();

}

function nuFindFieldInState(tabNo, fieldID) {

	for (var i = 0; i < nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects.length; i++) {

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
							<td>${nuDragCreateButton("move_tab_btn", `${classNuDragOptionsButton} nuDragOptionsSaveButtonEdited fa-solid fa-angle-right`, "", "", "nuMoveNuDrag", "Move to Tab")}</td>
						</tr>
						<td>
							${nuDragCreateCheckbox("nuShowDragLabels", "Show Labels", "nuToggleDragLabels", "fa-solid fa-text-slash", false)}
							${nuDragCreateCheckbox("nuShowTaborder", "Tab Order", "nuDragToggleTabOrder", "fa-solid fa-list-ol")}
							${nuDragCreateCheckbox("nuShowHiddenObjects", "Show Hidden Objects", "nuToggleHiddenObjects", "fa-solid fa-eye-slash")}
						</td>
						<td>
							${nuDragCreateButton("save_btn", `${classNuDragOptionsButton} nuDragOptionsSaveButtonEdited`, " fa-regular fa-lg fa-floppy-disk", "Save", "nuSaveNuDrag")}
						</td>
					</tbody>
				</table>
			</div>
		</div>`;

}

function nuCreateDragOptionsBox(form) {

	const dragOptionsBoxWidth = 400;
	const dragOptionsBoxMinHeight = 520;
	const classNuDragOptionsButton = "nuDragOptionsButton nuButton";

	const optionsBoxHTML = nuDragGenerateOptionsControlPanel(dragOptionsBoxWidth, dragOptionsBoxMinHeight, classNuDragOptionsButton);

	$('#nuWindow', window.parent.document.body).css('right', 15);
	$('#nuDragDialog', window.parent.document.body)
		.css('top', 35)
		.prepend(optionsBoxHTML)
		.css('height', Math.max(dragOptionsBoxMinHeight + 10, window.innerHeight + 40))
		.css('width', nuFormWH().width + dragOptionsBoxWidth - 15);

	$('#nuBreadcrumbHolder').remove();

	nuInitialiseDragState();

	let tabSelected = $('.nuTabSelected');
	let tab = tabSelected.length > 0 ? tabSelected.attr('id').replace('nuTab', '') : 0;
	nuPopulateFieldsList(tab);
	nuPopulateTabDropdown(tab);

	$('.nuTab[id^="nuTab"]').prop('onclick', '')
		.on('click', function () {

			if ($(this).hasClass('nuTabSelected')) {
				return;
			}

			nuClearFieldsList();
			nuUnselectAllDragObjects();
			nuSelectTab(this);
			nuShowContentBoxFrames();

			const nuTabFilter = Number($(this).attr('data-nu-tab-filter'));
			nuPopulateFieldsList(nuTabFilter);
			nuPopulateTabDropdown(nuTabFilter);

			const $nuDragOptionsFields = $('#nuDragOptionsFields', window.parent.document.body);
			nuCheckIfMovingTabOrderAllowed($nuDragOptionsFields);
			nuCheckIfMovingFieldToOtherTabAllowed($nuDragOptionsFields);

			nuDragToggleTabOrder();

		});

	nuCheckIfMovingTabOrderAllowed($('#nuDragOptionsFields'));
	nuCheckIfMovingFieldToOtherTabAllowed($('#nuDragOptionsFields'));

	let helpMessages = [
		"Use arrow keys to move selected Objects.",
		"Use arrow keys + SHIFT to resize selected Objects.",
		"Draw a square around Objects to highlight them.",
		"Hold CTRL to add Objects to the current selection."
	];

	let help = `<input id='run_sam' type='button' class='input_button nuButton' value='?'
	  onclick='nuMessage(${JSON.stringify(helpMessages)})'
	  style='top: 2px; right: 15px; width: 21px; height: 21px; text-align: center; padding-left: 5px; position: absolute;'>`;

	$('body').append(help);
	$('#nuDragDialog', window.parent.document.body).css('min-height','570px');

	nuAddContentBoxFrames();
	nuShowContentBoxFrames();
	nuToggleHiddenObjects();


	if ($('div.nuTab[id^="nuTab"]').length == 1) {
		$('#move_tab_btn', window.parent.document.body).css('visibility', 'hidden');
		$('#nuDragOptionsTabsDropdown', window.parent.document.body).css('visibility', 'hidden');
	}

	$('#nuRECORD').css('height', window.innerHeight);
	$('.nuRECORD').css("width", "99.3%");

	nuDragToggleTabOrder();

}

function nuDragToggleTabOrder() {

	$('.nu-drag-marker', nuGetNuDragDialogIframes(true)).remove();

	const parentDoc = window.parent.document;
	if (!parentDoc.querySelector('#nuShowTaborder').checked) return;

	const select = parentDoc.querySelector('#nuDragOptionsFields');
	Array.from(select.options).forEach((option, index) => {
		const target =
			$('#' + option.value, nuGetNuDragDialogIframes(true))[0] ||
			document.getElementById(option.value);
		if (target && target.getAttribute('data-drag') === '1') {
			const marker = document.createElement("div");
			marker.className = "nu-drag-marker";
			marker.textContent = index;
			const width = target.getBoundingClientRect().width;
			if (width < 50) {
				marker.style.position = "absolute";
				marker.style.top = "50%";
				marker.style.left = "100%";
				marker.style.transform = "translate(4px, -50%)";
				if (getComputedStyle(target).overflow === "hidden") {
					target.style.overflow = "visible";
				}
			} else {
				marker.style.position = "absolute";
				marker.style.top = "0";
				marker.style.right = "0";
				marker.style.left = "auto";
				marker.style.transform = "translate(-2px, 2px)";
			}
			marker.style.backgroundColor = "red";
			marker.style.color = "white";
			marker.style.padding = "2px 5px";
			marker.style.margin = "0";
			marker.style.fontSize = "12px";
			marker.style.zIndex = "9999";
			marker.style.borderRadius = "4px";
			marker.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
			marker.style.pointerEvents = "none";

			if (getComputedStyle(target).position === "static") {
				target.style.position = "relative";
			}

			if (target.classList.contains('nu_contentbox')) {
				target.parentElement.querySelector('.nuContentBoxFrame').appendChild(marker);
			} else {
				target.appendChild(marker);
			}

		}
	});

}

function nuToggleHiddenObjects() {
	$('.nuDragHidden', nuGetNuDragDialogIframes(true)).each(function () {
		$(this).css('visibility', function (i, visibility) {
			return visibility === 'visible' ? 'hidden' : 'visible';
		});
	});
}

function nuToggleDragLabels() {

	$('.nuDragLabel', nuGetNuDragDialogIframes(true)).each(function () {
		$(this).css('visibility', function (i, visibility) {
			return visibility === 'visible' ? 'hidden' : 'visible';
		});
	});

	$("[data-drag-button-label]", nuGetNuDragDialogIframes(true)).each(function () {
		let $this = $(this);
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

		var id = 'frame_' + $(this).attr('id');
		var obj = $("#" + id);

		if ($(this).is(":visible")) {
			obj.css('visibility', 'visible')
		} else {
			obj.css('visibility', 'hidden')
		}
	})

}

function nuAddContentBoxFrames() {

	$('.nu_contentbox').each(function () {
		var w = $(this).nuCSSNumber('width');
		var t = $(this).nuCSSNumber('top') + 18;
		var l = $(this).nuCSSNumber('left');
		var h = $(this).nuCSSNumber('height');
		var id = 'frame_' + $(this).attr('id');
		var bg = $(this).css('background-color');
		var div = '<div class="nuContentBoxFrame" id="' + id + '" style="position: absolute; border:2px double ' + bg + ';width:' + w + 'px;height:' + h + 'px;top:' + t + 'px;left:' + l + 'px"></div>';
		$(div).insertAfter($(this));
	});

	$('.nu_contentbox').css({
		'height': '16'
	});

}

function nuDragSelected() {
	return $('.nuDragSelected', nuGetNuDragDialogIframes(true));
}

function nuThisContentBox(t) {
	return $('#frame_' + $(t).attr('id'), nuGetNuDragDialogIframes(true));
}

function nuThisLabel(t) {
	return $('#label_' + $(t).attr('id'), nuGetNuDragDialogIframes(true));
}

// Shortest
function nuResizeToLowest() {

	var lowest = 1000000;
	var selected = nuDragSelected();

	selected.each(function () {

		var cb = nuThisContentBox(this);
		const h = cb.length == 0 ? $(this).height() : cb.height();

		if (h < lowest) {
			lowest = h;
		}

	});

	selected.each(function () {

		var cb = nuThisContentBox(this);
		if (cb.length == 0) {
			$(this).css('height', lowest + 'px');
		} else {
			cb.css('height', lowest + 'px');
		}
	});

}

function nuResizeToThinnest() {

	var thinnest = 1000000;
	var selected = nuDragSelected();

	selected.each(function () {

		if ($(this).width() < thinnest) {
			thinnest = $(this).width();
		}

	});

	selected.each(function () {
		$(this).css('width', thinnest + 'px');
		var cb = nuThisContentBox(this);
		if (cb.length == 1)
			cb.css('width', thinnest + 'px');
	});

}

// Tallest
function nuResizeToHighest() {

	var highest = 0;
	var selected = nuDragSelected();

	selected.each(function () {

		var cb = nuThisContentBox(this);
		const h = cb.length == 0 ? $(this).height() : cb.height();

		if (h > highest) {
			highest = h;
		}

	});

	selected.each(function () {
		var cb = nuThisContentBox(this);
		if (cb.length == 0) {
			$(this).css('height', highest + 'px');
		} else {
			cb.css('height', highest + 'px');
		}
	});

}

function nuResizeToWidest() {

	var widest = 0;
	var selected = nuDragSelected();

	selected.each(function () {

		if ($(this).width() > widest) {
			widest = $(this).width();
		}

	});

	selected.each(function () {
		$(this).css('width', widest + 'px');
		var cb = nuThisContentBox(this);
		if (cb.length == 1)
			cb.css('width', widest + 'px');
	});

}

function nuSortObjAsc(a, b) {

	return a.top - b.top;

}

function nuSpacingNotSupported() {

	const supported = $('.nuDragSelected', nuGetNuDragDialogIframes(true)).filter('.nu_contentbox').length == 0;
	if (!supported) {
		nuMessage(`${nuTranslate('Information')}`, 'Vertical spacing of ContentBox is not supported yet.');
	}

	return supported;

}

function nuSpaceHorizontally() {

	if (!nuSpacingNotSupported())
		return;

	var selectedFields = [];

	$('.nuDragSelected', nuGetNuDragDialogIframes(true)).each(function () {

		selectedFields.push({
			left: $(this).position().left,
			width: $(this).width(),
			id: $(this).prop('id')
		});

	});

	selectedFields.sort(nuSortObjAsc);

	var gapTotal = 0;
	var leftTotal = 0;

	for (var i = 1; i < selectedFields.length; i++) {

		gapTotal += selectedFields[i].left - (selectedFields[i - 1].left + selectedFields[i - 1].width);
		leftTotal += selectedFields[i].left - selectedFields[i - 1].left;

	}

	var gapAvg = Math.round(gapTotal / (selectedFields.length - 1));
	var leftAvg = Math.round(leftTotal / (selectedFields.length - 1));

	if (gapAvg < 0) {

		for (var i = 1; i < selectedFields.length; i++) {
			$('#' + selectedFields[i].id, nuGetNuDragDialogIframes(true)).css('left', ($('#' + selectedFields[i - 1].id, nuGetNuDragDialogIframes(true)).position().left + leftAvg) + 'px');
		}

	} else {

		for (var i = 1; i < selectedFields.length; i++) {
			$('#' + selectedFields[i].id, nuGetNuDragDialogIframes(true)).css('left', ($('#' + selectedFields[i - 1].id, nuGetNuDragDialogIframes(true)).position().left + $('#' + selectedFields[i - 1].id, nuGetNuDragDialogIframes(true)).width() + gapAvg) + 'px');
		}

	}

}

function nuSpaceVertically() {

	if (!nuSpacingNotSupported())
		return;

	const $dialogIframes = nuGetNuDragDialogIframes(true);
	const selectedFields = [];

	$('.nuDragSelected', $dialogIframes).each(function () {
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
		let top = 0;
		for (let i = 1; i < selectedFieldsLength; i++) {
			top = $('#' + selectedFields[i - 1].id, $dialogIframes).position().top + topAvg;
			$('#' + selectedFields[i].id, $dialogIframes).css('top', `${top}px`);
		}
	} else {
		let top = 0;
		for (let i = 1; i < selectedFieldsLength; i++) {
			const $prevField = $('#' + selectedFields[i - 1].id, $dialogIframes);
			top = $prevField.position().top + $prevField.height() + gapAvg;
			$('#' + selectedFields[i].id, $dialogIframes).css('top', `${top}px`);
		}
	}

}

function nuAlignRight() {

	var rightestPoint = 0;
	var selected = nuDragSelected();

	selected.each(function () {

		if ($(this).position().left + $(this).width() > rightestPoint) {

			rightestPoint = $(this).position().left + $(this).width();

		}

	});

	selected.each(function () {
		$(this).css('left', (rightestPoint - $(this).width()) + 'px');

		var tLabel = nuThisLabel(this);
		if (tLabel.length == 1)
			tLabel.css('left', rightestPoint - $(this).width() - tLabel.nuCSSNumber('width') - 5 + 'px');

	});

}

function nuAlignLeft() {

	var leftestPoint = 1000000;

	var selected = nuDragSelected();

	selected.each(function () {

		if ($(this).position().left < leftestPoint) {

			leftestPoint = $(this).position().left;

		}

	});

	selected.each(function () {
		$(this).css('left', leftestPoint + 'px');
		var cb = nuThisContentBox(this);

		var tLabel = nuThisLabel(this);
		if (tLabel.length == 1)
			tLabel.css('left', leftestPoint - tLabel.nuCSSNumber('width') - 5 + 'px');

		if (cb.length == 1) {
			cb.css('left', leftestPoint + 'px');
		}
	});

}

function nuAlignTop() {

	var highestPoint = 1000000;

	var selected = nuDragSelected();

	selected.each(function () {

		if ($(this).position().top < highestPoint) {

			highestPoint = $(this).position().top;

		}

	});

	selected.each(function () {

		$(this).css('top', highestPoint + 'px');
		var cb = nuThisContentBox(this);
		if (cb.length == 1)
			cb.css('top', highestPoint + 18 + 'px');

		var tLabel = nuThisLabel(this);
		if (tLabel.length == 1)
			tLabel.css('top', highestPoint + 'px');

	});

}

function nuAlignBottom() {

	// its 0 here because technically top: 0px is the highest...
	var lowestPoint = 0;

	var selected = nuDragSelected();

	selected.each(function () {

		if ($(this).position().top + $(this).height() > lowestPoint) {

			lowestPoint = $(this).position().top + $(this).height();

			var cb = nuThisContentBox(this);
			lowestPoint = cb.length == 0 ? $(this).position().top + $(this).height() : cb.position().top + cb.height();

		}

	});

	selected.each(function () {

		var cb = nuThisContentBox(this);
		if (cb.length == 0) {
			$(this).css('top', (lowestPoint - $(this).height()) + 'px');
		} else {
			$(this).css('top', (lowestPoint - cb.height() - 18) + 'px');
			cb.css('top', $(this).nuCSSNumber('top') + 18 + 'px');
		}

		var tLabel = nuThisLabel(this);
		if (tLabel.length == 1)
			tLabel.css('top', lowestPoint - $(this).height() + 'px');

	});
}

function nuMoveNuDrag() {

	//find tab we are moving objects to
	var moveToTab = $('#nuDragOptionsTabsDropdown').val().substring(5);

	$('#nuDragOptionsFields :selected').each(function (i, selected) {

		var fieldToMove = $(selected).text();
		var initialTab = $('#nuWindow').contents().find('#' + fieldToMove).attr('data-nu-tab');

		//hide objects on screen so they can be redrawn on correct tab.
		$('#nuWindow').contents().find('#' + fieldToMove).attr('data-nu-tab', moveToTab).hide();

		//get tab objects array
		var tabObjects = $("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab];
		var foundField = false;

		for (var i = 0; i < tabObjects.objects.length; i++) {

			if (tabObjects.objects[i].id == fieldToMove) {

				var fieldObject = $("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects[i];

				foundField = true;

				$("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[moveToTab].objects.push(fieldObject);
				$("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects.splice(i, 1);

				i--;

			} else if (foundField) {
				$("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects[i].tab_order -= 10;
			}
		}

		//update orders
		var tabObjectsU = $("#nuWindow")[0].contentWindow.nuDragOptionsState.tabs[moveToTab];

		for (var j = 0; j < tabObjectsU.objects.length; j++) {
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

	for (var tabNo = 0; tabNo < nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs.length; tabNo++) {

		for (var fieldNo = 0; fieldNo < nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects.length; fieldNo++) {

			var field = nuGetNuDragDialogIframes()[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects[fieldNo];

			var contents = $('#' + field.id, nuGetNuDragDialogIframes(true));
			var cb = $('div#frame_' + field.id, nuGetNuDragDialogIframes(true));

			if (contents.length == 1) {

				contents.show();

				field.left = contents.position().left;
				field.top = contents.position().top;
				field.width = contents.width();

				if (cb.length == 0) {
					field.height = contents.height();
				} else {
					field.height = cb.height();
				}

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
		$('#' + $(this).prop('id').replace('drag_', ''), nuGetNuDragDialogIframes(true)).addClass('nuDragSelected');
	});

}

function nuCheckIfMovingTabOrderAllowed(fieldsSelectBox) {

	function nuToggleButtonState(buttons, enabled) {
		buttons.prop('disabled', !enabled)
			.toggleClass('nuDragOptionsButtonDisabled', !enabled);
	}

	const upDownBtn = $('#move_down_btn, #move_up_btn'),
		upDownBtnParent = $('#move_down_btn, #move_up_btn', window.parent.document.body);

	const shouldEnable = $('option:selected', fieldsSelectBox).length == 1;

	nuToggleButtonState(upDownBtn, shouldEnable);
	nuToggleButtonState(upDownBtnParent, shouldEnable);

}


function nuCheckIfMovingFieldToOtherTabAllowed(fieldsSelectBox) {

	var tabDropdown = $('#nuDragOptionsTabsDropdown', window.parent.document.body);

	if ($('option:selected', fieldsSelectBox).length >= 1) {
		tabDropdown.prop('disabled', false);
	} else {
		tabDropdown.prop('disabled', 'disabled');
	}

}

function nuUnselectAllDragObjects() {

	$('.nuDragSelected').each(function () {
		$(this).removeClass('nuDragSelected');
	});

	$('.nuDragSelected', nuGetNuDragDialogIframes(true)).each(function () {
		$(this).removeClass('nuDragSelected');
	});

}

function nuSelectAllDragObjects() {

	$('[data-drag]').each(function () {
		if ($(this).is(":visible")) {
			nuAddDragSelected($(this));
		}
	});

	$('[data-drag]', nuGetNuDragDialogIframes(true)).each(function () {
		if ($(this).is(":visible")) {
			nuAddDragSelected($(this));
		}
	});

}

function nuClearFieldsList() {

	$('#nuDragOptionsFields', window.parent.document.body).html('');
	$('#nuDragOptionsTabsDropdown', window.parent.document.body).html('');

}

function nuPopulateFieldsList(currentlySelectedTabNo) {

	var tabOrderSearch = nuGetMinTabOrderInTab(currentlySelectedTabNo);
	var field = null;

	for (var i = 0; i < window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects.length; i++) {

		for (var j = 0; j < window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects.length; j++) {

			field = window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects[j];

			if (field.tab_order == tabOrderSearch) {
				$('#nuDragOptionsFields', window.parent.document.body).append('<option id="drag_' + field.id + '">' + field.id + '</option>');

				if ($('#' + field.id).css('visibility') !== 'visible') {
					$('#nuDragOptionsFields option[id="drag_' + field.id + '"]', window.parent.document.body).css('color', 'grey');
				}
			}

		}

		tabOrderSearch = tabOrderSearch + 10;

	}

	nuSetTabOrderDataAttrs();

}

function nuGetMinTabOrderInTab(currentTabNo) {

	var minTabOrder = 1000000;

	for (var i = 0; i < window.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {

		if (window.nuDragOptionsState.tabs[currentTabNo].objects[i].tab_order < minTabOrder)
			minTabOrder = window.nuDragOptionsState.tabs[currentTabNo].objects[i].tab_order;

	}

	if (minTabOrder == 1000000) {
		return null;
	}

	return minTabOrder;
}

function nuMoveSelected() {

	var s = document.getElementsByClassName('nuDragSelected');
	var l = 0;
	var t = 0;
	var o = {};

	for (var i = 0; i < s.length; i++) {

		o = s[i].style;
		l = parseInt(o.left, 10) + (window.moveX - window.lastMoveX);
		t = parseInt(o.top, 10) + (window.moveY - window.lastMoveY);
		o.left = l + 'px';
		o.top = t + 'px';

		// Move ContentBox too
		var cb = $('#frame_' + $(s[i]).attr('id'));
		if (cb.length == 1) {
			cb.css('left', l);
			cb.css('top', t + 18);
		}

		var tLabel = $('#label_' + $(s[i]).attr('id'));
		if (tLabel.length !== 0) {
			tLabel.css('left', l - tLabel.nuCSSNumber('width') - 5);
			tLabel.css('top', t);
		}

	}
}

function nuCanMove() {

	var s = document.getElementsByClassName('nuDragSelected');
	var l = 0;
	var t = 0;
	var o = {};

	for (var i = 0; i < s.length; i++) {

		o = s[i].style;
		l = parseInt(o.left, 10) + (window.moveX - window.lastMoveX);
		r = l + parseInt(o.width, 10);
		t = parseInt(o.top, 10) + (window.moveY - window.lastMoveY);
		b = t + parseInt(o.height, 10);

		if (l < 0) {
			return false;
		}

		if (t < 0) {
			return false;
		}

	}

	return true;

}

function nuGetTopArea() {

	const element = document.getElementById('nuRECORD');
	const rect = element.getBoundingClientRect();
	const absoluteTop = rect.top + window.scrollY;

	return absoluteTop;

}

function nuPopulateTabDropdown(currentlySelectedTabNo) {

	// Create a dropdown with the values of the tabs
	$('div.nuTab[id^="nuTab"]').each(function () {

		var tabNumber = $(this).attr('data-nu-tab-filter');
		var tabName = $(this).text();

		if (tabNumber != currentlySelectedTabNo) {
			$('#nuDragOptionsTabsDropdown', window.parent.document.body).append('<option value="nuTab' + tabNumber + '">' + tabName + '</option>');
		}

	});

	// Select the current tab
	$('#nuDragOptionsTabsDropdown').find('option:first').prop('selected', 'selected');

}

function nuDragElement(element, dragHeaderOffset) {

	var startX = 0,
		startY = 0,
		endX = 0,
		endY = 0;
	element.onmousedown = dragStart;
	element.ontouchstart = dragStart;

	function dragStart(e) {
		if (dragHeaderOffset !== undefined) {

			let touch = (e.touches?.[0]) || (e.pointerType && e.pointerType === 'touch' && e);
			let clientY = (touch || e).clientY;

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
			startX = e.touches[0].clientX
			startY = e.touches[0].clientY
		}
		document.onmouseup = dragStop;
		document.ontouchend = dragStop;
		document.onmousemove = elementDrag; // call whenever the cursor moves
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
			element.style.left = (element.offsetLeft - endX) + "px";
			element.style.top = (element.offsetTop - endY) + "px";
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
