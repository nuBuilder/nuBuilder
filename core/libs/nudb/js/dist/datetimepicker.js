"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[18],{

/***/ 1:
/***/ (function(module) {

module.exports = jQuery;

/***/ }),

/***/ 11:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


function registerDatePickerTranslations() {
  'use strict';

  if (!jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker) {
    return;
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].closeText = window.Messages.strCalendarClose;
  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].prevText = window.Messages.strCalendarPrevious;
  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].nextText = window.Messages.strCalendarNext;
  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].currentText = window.Messages.strCalendarCurrent;
  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].monthNames = [window.Messages.strMonthNameJan, window.Messages.strMonthNameFeb, window.Messages.strMonthNameMar, window.Messages.strMonthNameApr, window.Messages.strMonthNameMay, window.Messages.strMonthNameJun, window.Messages.strMonthNameJul, window.Messages.strMonthNameAug, window.Messages.strMonthNameSep, window.Messages.strMonthNameOct, window.Messages.strMonthNameNov, window.Messages.strMonthNameDec];
  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].monthNamesShort = [window.Messages.strMonthNameJanShort, window.Messages.strMonthNameFebShort, window.Messages.strMonthNameMarShort, window.Messages.strMonthNameAprShort, window.Messages.strMonthNameMayShort, window.Messages.strMonthNameJunShort, window.Messages.strMonthNameJulShort, window.Messages.strMonthNameAugShort, window.Messages.strMonthNameSepShort, window.Messages.strMonthNameOctShort, window.Messages.strMonthNameNovShort, window.Messages.strMonthNameDecShort];
  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].dayNames = [window.Messages.strDayNameSun, window.Messages.strDayNameMon, window.Messages.strDayNameTue, window.Messages.strDayNameWed, window.Messages.strDayNameThu, window.Messages.strDayNameFri, window.Messages.strDayNameSat];
  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].dayNamesShort = [window.Messages.strDayNameSunShort, window.Messages.strDayNameMonShort, window.Messages.strDayNameTueShort, window.Messages.strDayNameWedShort, window.Messages.strDayNameThuShort, window.Messages.strDayNameFriShort, window.Messages.strDayNameSatShort];
  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].dayNamesMin = [window.Messages.strDayNameSunMin, window.Messages.strDayNameMonMin, window.Messages.strDayNameTueMin, window.Messages.strDayNameWedMin, window.Messages.strDayNameThuMin, window.Messages.strDayNameFriMin, window.Messages.strDayNameSatMin];
  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].weekHeader = window.Messages.strWeekHeader;
  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].showMonthAfterYear = window.Messages.strMonthAfterYear === 'calendar-year-month';
  jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""].yearSuffix = window.Messages.strYearSuffix !== 'none' ? window.Messages.strYearSuffix : ''; // eslint-disable-next-line no-underscore-dangle

  jquery__WEBPACK_IMPORTED_MODULE_0__.extend(jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker._defaults, jquery__WEBPACK_IMPORTED_MODULE_0__.datepicker.regional[""]);
}

function registerTimePickerTranslations() {
  'use strict';

  if (!jquery__WEBPACK_IMPORTED_MODULE_0__.timepicker) {
    return;
  }

  jquery__WEBPACK_IMPORTED_MODULE_0__.timepicker.regional[""].timeText = window.Messages.strCalendarTime;
  jquery__WEBPACK_IMPORTED_MODULE_0__.timepicker.regional[""].hourText = window.Messages.strCalendarHour;
  jquery__WEBPACK_IMPORTED_MODULE_0__.timepicker.regional[""].minuteText = window.Messages.strCalendarMinute;
  jquery__WEBPACK_IMPORTED_MODULE_0__.timepicker.regional[""].secondText = window.Messages.strCalendarSecond; // eslint-disable-next-line no-underscore-dangle

  jquery__WEBPACK_IMPORTED_MODULE_0__.extend(jquery__WEBPACK_IMPORTED_MODULE_0__.timepicker._defaults, jquery__WEBPACK_IMPORTED_MODULE_0__.timepicker.regional[""]);
}

registerDatePickerTranslations();
registerTimePickerTranslations();

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(11));
/******/ }
]);
//# sourceMappingURL=datetimepicker.js.map