
class nuSelectObject {

	constructor() {

		this.boxID = '';
		this.table = '';
		this.joins = [];
		this.boxes = [];
		this.tempTables = [];
		this.tempJoins = [];

	}

	addBox(tableName, id) {

		this.table = tableName;
		const tableSchema = parent.nuFORM.tableSchema;
		const fieldNames = tableSchema[tableName].names;
		const fieldTypes = tableSchema[tableName].types;
		const boxIdSuffix = arguments.length === 1 ? nuID() : String(id).substring(3);
		this.boxID = 'box' + boxIdSuffix;
		this.scrollID = 'scroll' + boxIdSuffix;
		const boxWidth = this.boxWidth(tableSchema, tableName);
		const boxElement = document.createElement('div');

		this.boxes.push(this.boxID);

		boxElement.setAttribute('id', this.boxID);
		$('body').append(boxElement);
		$('#' + this.boxID).css({
			'width': boxWidth,
			'height': Math.min(20 + (fieldNames.length * 20), 190),
			'top': 25 + (25 * $('.nuBox').length),
			'left': 22 + (22 * $('.nuBox').length),
			'position': 'absolute',
			'border': 'solid grey 1px',
			'overflow': 'hidden',
			'padding-top': '5px',
			'background-color': '#c5c3c3',
			'z-index': 5,
		})
			.addClass('nuBox nuDragNoSelect nuBoxHeader nuBoxShadow');

		const scrollElement = document.createElement('div');
		scrollElement.setAttribute('id', this.scrollID);
		$('#' + this.boxID).append(scrollElement);
		$('#' + scrollElement.id).css({
			'width': boxWidth,
			'height': Math.min(20 + (fieldNames.length * 20), 175),
			'top': 22,
			'left': 0,
			'overflow': 'scroll',
			'overflow-x': 'hidden',
			'line-height': 1,
		})
			.addClass('nuDragNoSelect nuBoxHeader');

		const tableNameElement = document.createElement('div');
		tableNameElement.setAttribute('id', 'tablename' + this.boxID);
		$('#' + this.boxID).append(tableNameElement);
		$('#' + tableNameElement.id)
			.css({
				'position': 'absolute',
				'width': 280,
				'height': 15,
				'top': 2,
				'left': 0,
				'padding-left': 22,
				'text-align': 'left',
				'border': 'none',
				'font-weight': 'bold',
				'background-color': '#c5c3c3',
			})
			.html(tableName)
			.addClass('nuDragNoSelect nuTableName nuBoxTitle');

		const checkAllBox = document.createElement('input');
		checkAllBox.setAttribute('id', 'checkall' + this.boxID);
		$('#' + this.boxID).append(checkAllBox);
		$('#' + checkAllBox.id)
			.css({
				'position': 'absolute',
				'width': 20,
				'top': 2,
				'left': -1,
			})
			.attr('type', 'checkbox')
			.attr('onchange', 'window.nuSQL.buildSQL("table","' + this.boxID + '")')
			.prop('checked', true);

		const aliasInput = document.createElement('input');
		aliasInput.setAttribute('id', 'alias' + this.boxID);
		$('#' + this.boxID).append(aliasInput);
		$('#' + aliasInput.id)
			.css({
				'position': 'absolute',
				'width': 30,
				'top': 2,
				'right': 18,
				'background-color': '#c5c3c3',
			})
			.change(function () {
				nuSQL.buildSQL();
			});

		fieldNames.forEach((fieldName, index) => {
			this.boxRow(index, fieldName, fieldTypes[index], boxWidth);
		});

		const closeBoxElement = document.createElement('div');
		closeBoxElement.setAttribute('id', 'nuBoxClose' + this.boxID);
		$('#' + this.boxID).append(closeBoxElement);
		$('#' + closeBoxElement.id).css({
			'width': 16,
			'height': 15,
			'top': 3,
			'right': 1,
			'position': 'absolute',
			'color': 'black',
			'text-align': 'center',
		})
			.html('<img onclick="$(this).parent().parent().remove();nuSQL.buildSQL()" id="nbc' + this.boxID + '" src="graphics/nu_box_close.png" width="10px" height="10px">')
			.addClass('nuDragNoSelect nuButtonHover nuClose');

	}

	buildSQL(context, boxId) {

		if (parent.$('#sse_edit').val() == 1) { return; }

		nuAngle();

		const selectClause = this.buildSelect(context, boxId);
		const fromClause = this.buildFrom();
		const clauses = this.buildClauses();

		parent.$('#sse_sql')
			.val(`${selectClause}${fromClause}${clauses}\n`)
			.trigger("change");

		parent.$('#sse_json')
			.val(this.buildJSON())
			.trigger("change");

		if (parent.$('#nuSaveToTextareaButton').length == 1) {
			parent.$('#nuSaveToTextareaButton').hide();
			parent.$('#nuSaveButton').show();
		}

	}

	buildSelect(checkType, boxID) {

		if (checkType === 'field') {
			$('#checkall' + boxID).prop('checked', false);
		}

		if (checkType === 'table') {
			$('.checkfield.' + boxID).prop('checked', false);
		}

		let selectClauses = [];

		for (let i = 0; i < this.boxes.length; i++) {
			let currentBoxID = this.boxes[i];

			if ($('#' + currentBoxID).length === 1) {
				let tableName = $('#tablename' + currentBoxID).html();
				let aliasName = $('#alias' + currentBoxID).val();
				let fullTableName = this.justAlias(tableName, aliasName);

				if ($('#checkall' + currentBoxID).is(':checked')) {
					selectClauses.push(fullTableName + '.*');
				} else {
					$('.checkfield.' + currentBoxID).each(function () {
						let fieldID = 'field' + this.id.substr(6);
						if ($(this).is(':checked')) {
							let fieldBoxID = String(this.id).split('_')[2];
							let fieldAlias = $('#alias' + fieldBoxID).val();
							let fieldName = $('#' + fieldID).html();

							if (!fieldAlias) {
								selectClauses.push(fullTableName + '.' + fieldName);
							} else {
								selectClauses.push(fullTableName + '.' + fieldName + ' AS ' + fullTableName + '_' + fieldName);
							}
						}
					});
				}
			}
		}

		let sqlSelect = "SELECT\n " + selectClauses.join(',\n    ') + "\n";
		return sqlSelect;

	}

	buildFrom() {

		this.tempTables = this.usedTables();
		this.tempJoins = this.getJoinObjects(); // current visible joins

		const tableOrder = (table1, table2) => table2.joins.length - table1.joins.length;

		for (let tableIndex = 0; tableIndex < this.tempTables.length; tableIndex++) {
			if (this.tempTables[tableIndex].used !== -1) {
				const sortedTables = this.tempTables.sort(tableOrder);
				let hasMoreJoins = true;

				let initialAlias = this.tempTables[tableIndex].alias;
				let lastAliasUsed = this.fromAlias(sortedTables[0].table, sortedTables[0].alias);
				let definedAliases = [lastAliasUsed, initialAlias];
				let joinDetails;

				while (hasMoreJoins) {
					[hasMoreJoins, joinDetails] = this.getJoinObject(definedAliases);

					if (hasMoreJoins) {
						const joinType = joinDetails.type === 'LEFT' ? "\n        LEFT JOIN " : "\n        JOIN ";

						let currentAlias = this.justAlias(joinDetails.tables[0], joinDetails.aliases[0]);

						let tableAlias;
						if (definedAliases.indexOf(lastAliasUsed) === -1 || definedAliases.indexOf(currentAlias) === -1) {
							tableAlias = this.buildAlias(joinDetails.tables[0], joinDetails.aliases[0]);
							lastAliasUsed = this.justAlias(joinDetails.tables[0], joinDetails.aliases[0]);
						} else {
							tableAlias = this.buildAlias(joinDetails.tables[1], joinDetails.aliases[1]);
							lastAliasUsed = this.justAlias(joinDetails.tables[1], joinDetails.aliases[1]);
						}

						definedAliases.push(lastAliasUsed);
						definedAliases.push(currentAlias);

						this.markTableAsUsed(joinDetails.tables[0], joinDetails.aliases[0]);
						this.markTableAsUsed(joinDetails.tables[1], joinDetails.aliases[1]);

						const joinConditions = joinDetails.joins.join(' AND ');

						this.tempTables[tableIndex].joins.push(joinType + tableAlias + ' ON ' + joinConditions);
					}
				}
			}
		}

		const finalSortedTables = this.tempTables.sort(tableOrder);
		const finalJoins = [];

		for (let i = 0; i < finalSortedTables.length; i++) {
			if (finalSortedTables[i].joins.length > 0 || finalSortedTables[i].used !== -1) {
				const aliasDefinition = this.fromAlias(finalSortedTables[i].table, finalSortedTables[i].alias);
				const joins = finalSortedTables[i].joins.join("");

				finalJoins.push("\n    " + aliasDefinition + joins);
			}
		}

		return "\nFROM" + finalJoins.join('');

	}

	markTableAsUsed(table, alias) {

		for (let i = 0; i < this.tempTables.length; i++) {
			if (this.tempTables[i].table === table || this.tempTables[i].alias === alias) {
				this.tempTables[i].used = -1;
				return;
			}
		}

	}

	usedTables() {

		const tablesWithUsage = [];
		const context = this;
		this.tempJoins = this.getJoinObjects(); // current visible joins

		$('.nuBox').each(function () {
			const boxId = $(this)[0].id;
			const tableName = $('#tablename' + boxId).html();
			const aliasName = $('#alias' + boxId).val();
			let usageCount = 0;

			for (const joinKey in context.joins) {
				const join = context.joins[joinKey];
				if (join.fromalias === aliasName || join.fromtable === tableName || join.toalias === aliasName || join.totable === tableName) {
					usageCount++;
				}
			}

			tablesWithUsage.push({ 'table': tableName, 'alias': context.justAlias(tableName, aliasName), 'used': usageCount, 'joins': [] });
		});

		const compareUsage = (firstTable, secondTable) => firstTable.used < secondTable.used;

		tablesWithUsage.sort(compareUsage);

		return tablesWithUsage;

	}


	getJoinObject(aliasList) {

		const tempJoins = this.tempJoins;
		const aliases = [];

		for (let i = 0; i < aliasList.length; i++) {
			const splitAlias = aliasList[i].split(' ');
			aliases.push(splitAlias[0], splitAlias[splitAlias.length - 1]);
		}

		for (let i = 0; i < tempJoins.length; i++) {
			const joinObject = tempJoins[i];
			const firstAlias = this.justAlias(joinObject.tables[0], joinObject.aliases[0]);
			const secondAlias = this.justAlias(joinObject.tables[1], joinObject.aliases[1]);

			if (aliases.indexOf(firstAlias) !== -1 || aliases.indexOf(secondAlias) !== -1) {
				this.tempJoins.splice(i, 1);
				return [true, joinObject];
			}
		}

		return [false, {}];

	}

	getJoinObjects() {

		const joinData = this.joins;
		const joinMap = {};
		const joinList = [];

		for (const key in joinData) {
			const join = joinData[key];
			const fromTableAlias = this.justAlias(join.fromtable, join.fromalias);
			const toTableAlias = this.justAlias(join.totable, join.toalias);
			const joinCondition = `${fromTableAlias}.${join.fromfield} = ${toTableAlias}.${join.tofield}`;
			const joinId = [fromTableAlias, toTableAlias].sort().join('--');

			if (joinMap[joinId] === undefined) {
				joinMap[joinId] = {
					'tables': [join.fromtable, join.totable],
					'aliases': [join.fromalias, join.toalias],
					'type': join.join,
					'joins': [joinCondition],
					'used': false
				};
			} else {
				joinMap[joinId].joins.push(joinCondition);
				if (join.type === 'LEFT') {
					join.type = 'LEFT';
				}
			}
		}

		for (const key in joinMap) {
			joinList.push(joinMap[key]);
		}

		return joinList;
	}

	fromAlias(t, a) {
		return a === t ? t : `${t} AS ${a}`;
	}

	buildAlias(t, a) {
		return a === '' ? t : `${t} AS ${a}`;
	}

	justAlias(t, a) {
		return a === '' ? t : a;
	}

	refreshJoins(relationships) {

		this.joins = [];
		for (let relationshipKey in relationships) {
			let [fromField, toField] = relationshipKey.split('--');
			let fromTable = fromField.split('_')[2];
			let toTable = toField.split('_')[2];
			let relationshipObject = {
				'from': fromField,
				'fromtable': $('#tablename' + fromTable).html(),
				'fromalias': $('#alias' + fromTable).val(),
				'fromfield': $('#' + fromField).html(),
				'to': toField,
				'totable': $('#tablename' + toTable).html(),
				'toalias': $('#alias' + toTable).val(),
				'tofield': $('#' + toField).html(),
				'join': relationships[relationshipKey],
			};
			this.joins[fromField + '--' + toField] = relationshipObject;
		}

	}

	buildClauses() {

		const orderFunction = (b, a) => (b[1] + 10000 + Number(b[4])) - (a[1] + 10000 + Number(a[4]));
		const selectClauses = parent.nuFORM.subform('zzzzsys_select_clause_sf').rows;
		selectClauses.sort(orderFunction);
		let clauses = '';
		let whereClauses = [];
		let orderByClauses = [];
		let groupByClauses = [];
		let havingClauses = [];

		for (let i = 0; i < selectClauses.length; i++) {
			let [_, type, field, condition, sortOrder, , display] = selectClauses[i];
			let isClauseValid = field != '' && condition != '';
			let isGroupOrOrderValid = field != '' && sortOrder != '';

			if (display == 0) {
				if (type == 1 && isClauseValid) { whereClauses.push('(' + field + ' ' + condition + ')'); }
				if (type == 4 && isClauseValid) { havingClauses.push('(' + field + condition + ')'); }
				if (type == 2 && isGroupOrOrderValid) { groupByClauses.push(field + ' ' + sortOrder); }
				if (type == 3 && isGroupOrOrderValid) { orderByClauses.push(field + ' ' + sortOrder); }
			}
		}

		if (whereClauses.length > 0) { clauses += "\n\nWHERE\n    (" + whereClauses.join(" AND \n    ") + ")\n"; }
		if (groupByClauses.length > 0) { clauses += "\nGROUP BY\n    " + groupByClauses.join(",\n    ") + "\n"; }
		if (havingClauses.length > 0) { clauses += "\nHAVING\n    " + havingClauses.join(" AND \n    ") + "\n"; }
		if (orderByClauses.length > 0) { clauses += "\nORDER BY\n    " + orderByClauses.join(",\n    ") + "\n"; }

		return clauses;

	}


	boxWidth(tableSchema, t) {

		let wordWidth = nuGetWordWidth(t) + 130;

		for (let i = 0; i < tableSchema[t].names.length; i++) {
			wordWidth = Math.max(wordWidth, nuGetWordWidth(tableSchema[t].names[i]));
		}

		return wordWidth;

	}

	boxRow(i, v, t, w) {

		this.boxColumn('select', i, 0, 18, v, '');
		this.boxColumn('field', i, 22, 300, v, t, w);

	}

	boxColumn(c, t, l, w, v, title) {

		var suf = '_' + t + '_' + this.boxID;

		const col = document.createElement(c == 'select' ? 'input' : 'span');

		col.setAttribute('id', c + suf);

		$('#' + this.scrollID).append(col);

		$('#' + col.id)
			.css({
				'position': 'absolute',
				'width': w,
				'top': t * 18,
				'left': l,
			})
			.attr('title', title);

		if (c == 'select') {			//-- checkbox

			$('#' + col.id)
				.attr('data-nu-field', 'field' + suf)
				.attr('onchange', 'window.nuSQL.buildSQL("field","' + this.boxID + '")')
				.attr('type', 'checkbox')
				.addClass(this.boxID)
				.addClass('checkfield');

		} else {

			$('#' + col.id)
				.addClass('nuBoxTitle')
				.addClass('nuBoxField')
				.addClass(this.boxID)
				.css('width', Number(w))
				.css('padding-top', 2)
				.hover(

					function (event) {
						if (event.buttons == 1 && window.nuCurrentID != '') {

							$(this).css('color', 'green');
							$(this).css('cursor', 'e-resize');

						} else {

							$(this).css('color', 'red');
							$(this).css('cursor', 'e-resize');

						}
					},
					function () {

						$(this).css('color', '');
						$(this).css('cursor', 'default');

					})

				.html(v);

		}

	}

	buildJSON() {

		const jsonResult = {};
		const tables = [];
		const self = this;

		$('.nuBox').each(function () {
			const id = this.id;
			const tableObject = {
				id: id,
				position: $(this).position(),
				tablename: $(`#tablename${id}`).html(),
				alias: $(`#alias${id}`).val(),
				checkall: $(`#checkall${id}`).is(':checked'),
				checkboxes: self.getCheckboxes(id)
			};
			tables.push(tableObject);
		});

		jsonResult.tables = tables;
		const joins = {};
		const relations = this.joins;

		for (const key in relations) {
			const { from, to, join } = relations[key];
			joins[`${from}--${to}`] = join;
		}

		jsonResult.joins = joins;

		return JSON.stringify(jsonResult);

	}

	getCheckboxes(b) {

		let checkBoxes = [];

		$(':checkbox.' + b).each(function () {
			checkBoxes.push($(this).is(':checked'));
		});

		return checkBoxes;

	}

	rebuildGraphic() {

		const jsonString = $('#sse_json', parent.document).val();

		if (!jsonString) { return true; }

		const jsonData = JSON.parse(jsonString);

		for (const table of jsonData.tables) {
			if (!parent.nuFORM.tableSchema[table.tablename]) {
				nuMessage([`No table named <b>${table.tablename}</b>.`]);
				return false;
			}
		}

		for (const table of jsonData.tables) {
			this.addBox(table.tablename, table.id);

			$(`#${table.id}`)
				.css('top', table.position.top)
				.css('left', table.position.left);

			$(`#tablename${table.id}`).html(table.tablename);
			$(`#alias${table.id}`).val(table.alias);
			$(`#checkall${table.id}`).prop('checked', table.checkall);

			table.checkboxes.forEach((checkbox, index) => {
				$(`#select_${index}_${table.id}`).prop('checked', checkbox);
			});
		}

		const joins = jsonData.joins;
		for (const key in joins) {
			const [startIndex, endIndex] = key.split('--');
			this.joins[`${startIndex}--${endIndex}`] = joins[key];
		}

		nuAngle();

		return true;

	}

	addJoin(key, v) {

		const jsonString = parent.$('#sse_json').val();
		let Joins = { 'joins': [] };
		if (jsonString !== '') {
			Joins = JSON.parse(jsonString);
		}

		Joins.joins[key] = v;

		const sseJson = JSON.stringify(Joins);
		parent.$('#sse_json').val(sseJson);

	}


}

//=========functions==========================================================================

function nuUp(event) {

	const element = $(event.target);

	if (element.hasClass('nuTableName')) {
		const parentStyle = element.parent().css(['top', 'left']);
		window.nuY = parseInt(parentStyle.top, 10);
		window.nuX = parseInt(parentStyle.left, 10);
	}

	if (element.hasClass('nuBoxField')) {
		const currentId = String(window.nuCurrentID);

		if (currentId.split('_').length === 3) {
			const fieldId = currentId;
			const targetId = event.target.id;

			if (fieldId.split('_')[2] !== targetId.split('_')[2]) {
				nuSQL.addJoin(`${fieldId}--${targetId}`, '');
				nuAngle();
			}
		}
	}

	window.nuCurrentID = '';
	nuSQL.buildSQL();

}

function nuDown(event) {

	const element = $(event.target);

	if (element.hasClass('nuRelationships')) {
		nuChangeJoin(event);
		return;
	}

	window.nuCurrentID = event.target.id;

	if (element.hasClass('nuTableName')) {
		const parentStyle = element.parent().css(['top', 'left']);
		window.nuY = event.clientY - parseInt(parentStyle.top, 10);
		window.nuX = event.clientX - parseInt(parentStyle.left, 10);
	}

}

function nuMove(event) {

	if (window.nuCurrentID === '') { return; }

	const movingElement = $('#' + window.nuCurrentID);

	if (movingElement.hasClass('nuTableName')) {
		if (event.buttons === 1) {
			const newYPosition = event.clientY - window.nuY;
			const newXPosition = event.clientX - window.nuX;

			if (newYPosition > 0) {
				movingElement.parent().css('top', newYPosition);
			}
			if (newXPosition > 0) {
				movingElement.parent().css('left', newXPosition);
			}

			nuAngle();
		}
	}

}

function nuAngle() {

	$('.nuRelationships').remove();

	const jsonData = parent.$('#sse_json').val();
	if (jsonData == '') { return; }

	const parsedData = JSON.parse(jsonData);
	const joins = parsedData.joins;
	const validJoins = [];

	//-- remove links to closed boxes

	for (const key in joins) {
		let fromId = key.split('--')[0];
		let toId = key.split('--')[1];

		if ($('#' + fromId).length === 1 && $('#' + toId).length === 1) {
			validJoins[key] = joins[key];
		}
	}

	nuSQL.refreshJoins(validJoins);

	for (let key in nuSQL.joins) {

		let fromElement = $('#' + nuSQL.joins[key].from);
		let toElement = $('#' + nuSQL.joins[key].to);
		let fromOffset = fromElement.offset();
		let toOffset = toElement.offset();
		let angle = Math.atan2(toOffset.top - fromOffset.top, toOffset.left - fromOffset.left) * 180 / Math.PI;		//-- angle in degrees
		let distance = Math.sqrt(Math.pow(fromOffset.top - toOffset.top, 2) + Math.pow(fromOffset.left - toOffset.left, 2));
		let joinId = 'joins' + nuID();
		let joinType = nuSQL.joins[key].join;
		let leftMargin = 7;

		//-- relationship box (line)

		let $lineElement = document.createElement('div');
		$lineElement.setAttribute('id', joinId);

		$('body').append($lineElement);

		$('#' + $lineElement.id).css({
			'width': joinType == 'LEFT' ? distance - leftMargin : distance,
			'height': 6,
			'left': fromOffset.left,
			'top': fromOffset.top,
			'position': 'absolute',
			'text-align': 'center',
			'border': 'rgba(255, 153, 0, .5) 0px solid',
			'border-left-width': joinType == 'LEFT' ? leftMargin : 0,
			'border-left-color': 'purple',
			'background-color': 'rgba(255, 153, 0, .5)',
			'transform': 'rotate(' + angle + 'deg)',
			'z-index': 10
		})
			.attr('data-nu-join', key)
			.attr('title', joinType + ' JOIN ON ' + nuSQL.joins[key].fromfield + ' = ' + nuSQL.joins[key].tofield + ' (Click to Change Join)')
			.addClass('nuRelationships')
			.hover(function () {
				$(this).css({
					'border-top-width': '2px',
					'border-bottom-width': '2px'
				});
			}, function () {
				$(this).css({
					'border-top-width': '0',
					'border-bottom-width': '0'
				});
			});

		$lineElement = $('#' + $lineElement.id);
		let top = parseInt(fromOffset.top + fromOffset.top - $lineElement.top, 10);
		let left = parseInt(fromOffset.left + fromOffset.left - $lineElement.left, 10);

		$('#' + joinId).css({
			'top': `${top}px`,
			'left': `${left}px`
		});

		let lTop = parseInt($lineElement.css('top'), 10);
		let lLeft = parseInt($lineElement.css('left'), 10);

		if (fromElement.offset().top < toElement.offset().top) {
			$lineElement.css('top', 7 + lTop + fromElement.offset().top - $lineElement.offset().top);
		} else {
			$lineElement.css('top', 7 + lTop + $lineElement.offset().top - fromElement.offset().top);
		}

		if (fromElement.offset().left < toElement.offset().left) {
			$lineElement.css('left', -20 + lLeft - ($lineElement.offset().left - fromElement.offset().left));
		} else {
			$lineElement.css('left', -20 + lLeft - ($lineElement.offset().left - toElement.offset().left));
		}

	}

}

function nuChangeJoin(e) {

	const jsonInputElement = parent.$('#sse_json');
	let jsonString = jsonInputElement.val();
	const parsedJson = JSON.parse(jsonString);
	const joinIndex = $(e.target).attr('data-nu-join');

	parsedJson.joins[joinIndex] = parsedJson.joins[joinIndex] === '' ? 'LEFT' : '';

	jsonInputElement
		.val(JSON.stringify(parsedJson))
		.trigger("change");

	nuSQL.buildSQL();

}



