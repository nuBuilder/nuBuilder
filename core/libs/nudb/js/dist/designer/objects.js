"use strict";
(self["webpackChunkphpmyadmin"] = self["webpackChunkphpmyadmin"] || []).push([[23],{

/***/ 27:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
var DesignerObjects = {
  PdfPage: function (dbName, pageDescr, tblCords) {
    // no dot set the auto increment before put() in the database
    // issue #12900
    // eslint-disable-next-line no-unused-vars
    var pgNr;
    this.dbName = dbName;
    this.pageDescr = pageDescr;
    this.tblCords = tblCords;
  },
  TableCoordinate: function (dbName, tableName, pdfPgNr, x, y) {
    // no dot set the auto increment before put() in the database
    // issue #12900
    // var id;
    this.dbName = dbName;
    this.tableName = tableName;
    this.pdfPgNr = pdfPgNr;
    this.x = x;
    this.y = y;
  }
};
window.DesignerObjects = DesignerObjects;

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ var __webpack_exports__ = (__webpack_exec__(27));
/******/ }
]);
//# sourceMappingURL=objects.js.map