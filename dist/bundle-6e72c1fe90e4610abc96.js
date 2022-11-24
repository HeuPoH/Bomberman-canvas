/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack:///./src/style.css?");

/***/ }),

/***/ "./src/Bomb.ts":
/*!*********************!*\
  !*** ./src/Bomb.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {\r\n    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {\r\n        if (ar || !(i in from)) {\r\n            if (!ar) ar = Array.prototype.slice.call(from, 0, i);\r\n            ar[i] = from[i];\r\n        }\r\n    }\r\n    return to.concat(ar || Array.prototype.slice.call(from));\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Bomb = void 0;\r\nvar images_1 = __webpack_require__(/*! ./images/images */ \"./src/images/images.ts\");\r\nvar BombStatus;\r\n(function (BombStatus) {\r\n    BombStatus[\"Installed\"] = \"Installed\";\r\n    BombStatus[\"Countdown\"] = \"Countdown\";\r\n    BombStatus[\"Fired\"] = \"Fired\";\r\n})(BombStatus || (BombStatus = {}));\r\nvar Bomb = /** @class */ (function () {\r\n    function Bomb(pos, flamePos, size, detonationBomb) {\r\n        this.duration = 3000;\r\n        this.pos = pos;\r\n        this.size = size;\r\n        this.flamePos = __spreadArray(__spreadArray([], flamePos, true), [pos], false);\r\n        this.startTime = performance.now();\r\n        this.detonationBomb = detonationBomb;\r\n    }\r\n    Bomb.prototype.getPosition = function () {\r\n        return this.pos;\r\n    };\r\n    Bomb.prototype.getFlamePos = function () {\r\n        return this.flamePos;\r\n    };\r\n    Bomb.prototype.draw = function (ctx) {\r\n        var timeFraction = (performance.now() - this.startTime) / this.duration;\r\n        var bombStatus = this.getBombStatus(timeFraction);\r\n        this.drawBomb(ctx, this.size, bombStatus);\r\n        this.drawFlamePos(ctx, this.size, bombStatus);\r\n        if (timeFraction >= 1) {\r\n            this.detonationBomb(this);\r\n        }\r\n    };\r\n    Bomb.prototype.drawBomb = function (ctx, size, status) {\r\n        if (status === BombStatus.Fired) {\r\n            return;\r\n        }\r\n        var _a = this.pos, column = _a[0], row = _a[1];\r\n        var image = this.getImage(status);\r\n        ctx.drawImage(image, column * size, row * size, size, size);\r\n    };\r\n    Bomb.prototype.drawFlamePos = function (ctx, size, status) {\r\n        if (status !== BombStatus.Fired) {\r\n            return;\r\n        }\r\n        this.flamePos.forEach(function (pos) {\r\n            var x = pos[0], y = pos[1];\r\n            ctx.drawImage(images_1.flame, x * size, y * size, size, size);\r\n        });\r\n    };\r\n    Bomb.prototype.getBombStatus = function (timeFraction) {\r\n        if (timeFraction >= 0 && timeFraction < 0.5) {\r\n            return BombStatus.Installed;\r\n        }\r\n        else if (timeFraction >= 0.5 && timeFraction < 0.9) {\r\n            return BombStatus.Countdown;\r\n        }\r\n        else {\r\n            return BombStatus.Fired;\r\n        }\r\n    };\r\n    Bomb.prototype.getImage = function (bombStatus) {\r\n        switch (bombStatus) {\r\n            case BombStatus.Installed:\r\n                return images_1.imageBomb1;\r\n            case BombStatus.Countdown:\r\n                return images_1.imageBomb2;\r\n            default:\r\n                return images_1.flame;\r\n        }\r\n    };\r\n    return Bomb;\r\n}());\r\nexports.Bomb = Bomb;\r\n\n\n//# sourceURL=webpack:///./src/Bomb.ts?");

/***/ }),

/***/ "./src/Canvas.ts":
/*!***********************!*\
  !*** ./src/Canvas.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Canvas = void 0;\r\nvar Canvas = /** @class */ (function () {\r\n    function Canvas() {\r\n        var _this = this;\r\n        this.canvas = document.getElementById('canvas');\r\n        this.width = 0;\r\n        this.height = 0;\r\n        this.updateSize = function () {\r\n            _this.width = document.body.clientWidth;\r\n            _this.height = document.body.clientHeight;\r\n            _this.canvas.width = _this.width;\r\n            _this.canvas.height = _this.height;\r\n        };\r\n        this.updateSize();\r\n        window.addEventListener('resize', this.updateSize);\r\n    }\r\n    Canvas.prototype.getContext = function () {\r\n        return this.canvas.getContext('2d');\r\n    };\r\n    Canvas.prototype.getSize = function () {\r\n        return {\r\n            width: this.width,\r\n            height: this.height\r\n        };\r\n    };\r\n    Canvas.prototype.clear = function () {\r\n        var _a;\r\n        (_a = this.canvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.width, this.height);\r\n    };\r\n    return Canvas;\r\n}());\r\nexports.Canvas = Canvas;\r\n\n\n//# sourceURL=webpack:///./src/Canvas.ts?");

/***/ }),

/***/ "./src/Field.ts":
/*!**********************!*\
  !*** ./src/Field.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Field = void 0;\r\nvar images_1 = __webpack_require__(/*! ./images/images */ \"./src/images/images.ts\");\r\nvar Players_1 = __webpack_require__(/*! ./Players */ \"./src/Players.ts\");\r\nvar CellType;\r\n(function (CellType) {\r\n    CellType[CellType[\"Empty\"] = 0] = \"Empty\";\r\n    CellType[CellType[\"FullStatic\"] = 1] = \"FullStatic\";\r\n    CellType[CellType[\"FullDynamic\"] = 2] = \"FullDynamic\";\r\n})(CellType || (CellType = {}));\r\nvar CellSubType;\r\n(function (CellSubType) {\r\n    CellSubType[CellSubType[\"Bomb\"] = 2] = \"Bomb\";\r\n})(CellSubType || (CellSubType = {}));\r\nvar Field = /** @class */ (function () {\r\n    function Field(canvas) {\r\n        this.countRows = 11;\r\n        this.countColumns = 15;\r\n        this.positions = [];\r\n        this.canvas = canvas;\r\n        this.prepareField();\r\n        this.players = new Players_1.Players(this);\r\n    }\r\n    Field.prototype.draw = function () {\r\n        var _this = this;\r\n        var ctx = this.canvas.getContext();\r\n        if (!ctx) {\r\n            return;\r\n        }\r\n        var cellSize = this.getCellSize();\r\n        this.drawFieldLayout();\r\n        this.positions.forEach(function (row, i) {\r\n            row.forEach(function (cell, j) {\r\n                var image = _this.getCellFillImage(cell.type);\r\n                var x = i * cellSize;\r\n                var y = j * cellSize;\r\n                ctx.drawImage(image, x, y, cellSize, cellSize);\r\n            });\r\n        });\r\n        this.players.draw();\r\n    };\r\n    Field.prototype.getCanvas = function () {\r\n        return this.canvas;\r\n    };\r\n    Field.prototype.getOffsets = function (cellSize) {\r\n        if (cellSize === void 0) { cellSize = this.getCellSize(); }\r\n        var _a = this.canvas.getSize(), width = _a.width, height = _a.height;\r\n        var offsetLeft = (width - cellSize * this.countColumns) / 2;\r\n        var offsetTop = (height - cellSize * this.countRows) / 2;\r\n        return {\r\n            left: offsetLeft,\r\n            top: offsetTop\r\n        };\r\n    };\r\n    Field.prototype.putBomb = function (pos) {\r\n        var column = pos[0], row = pos[1];\r\n        this.positions[column][row].subType = CellSubType.Bomb;\r\n    };\r\n    Field.prototype.firedBomb = function (positions) {\r\n        var _this = this;\r\n        positions.forEach(function (pos) {\r\n            _this.clearCell(pos);\r\n            _this.deleteBomb(pos);\r\n        });\r\n    };\r\n    Field.prototype.clearCell = function (pos) {\r\n        var column = pos[0], row = pos[1];\r\n        this.positions[column][row].type = CellType.Empty;\r\n    };\r\n    Field.prototype.deleteBomb = function (pos) {\r\n        var column = pos[0], row = pos[1];\r\n        this.positions[column][row].subType = undefined;\r\n    };\r\n    Field.prototype.getCellSize = function () {\r\n        var _a = this.canvas.getSize(), width = _a.width, height = _a.height;\r\n        var size = Math.min(width, height);\r\n        return size / Math.max(this.countRows, this.countColumns);\r\n    };\r\n    Field.prototype.getCellType = function (column, row) {\r\n        if ((column <= 1 && row === 0) || (column === 0 && row <= 1)) {\r\n            return CellType.Empty;\r\n        }\r\n        return Math.round(column % 2) === 0 || Math.round(row % 2) === 0\r\n            ? CellType.FullDynamic\r\n            : CellType.FullStatic;\r\n    };\r\n    Field.prototype.isCellEmpty = function (pos) {\r\n        var _a;\r\n        var column = pos[0], row = pos[1];\r\n        var position = (_a = this.positions[column]) === null || _a === void 0 ? void 0 : _a[row];\r\n        if ((position === null || position === void 0 ? void 0 : position.type) !== CellType.Empty || position.subType) {\r\n            return false;\r\n        }\r\n        return true;\r\n    };\r\n    Field.prototype.isCellDestroy = function (pos) {\r\n        var _a;\r\n        var column = pos[0], row = pos[1];\r\n        var cell = (_a = this.positions[column]) === null || _a === void 0 ? void 0 : _a[row];\r\n        if (!cell) {\r\n            return false;\r\n        }\r\n        return this.positions[column][row].type !== CellType.FullStatic;\r\n    };\r\n    Field.prototype.getCellFillImage = function (type) {\r\n        switch (type) {\r\n            case CellType.FullStatic:\r\n                return images_1.imageStone;\r\n            case CellType.FullDynamic:\r\n                return images_1.imageWood;\r\n            default:\r\n                return images_1.imageGrass;\r\n        }\r\n    };\r\n    Field.prototype.drawFieldLayout = function () {\r\n        var ctx = this.canvas.getContext();\r\n        var cellSize = this.getCellSize();\r\n        ctx.save();\r\n        var fieldWidth = cellSize * this.countColumns;\r\n        var fieldHeight = cellSize * this.countRows;\r\n        ctx.drawImage(images_1.imageGrass, 0, 0, fieldWidth, fieldHeight);\r\n        ctx.restore();\r\n    };\r\n    Field.prototype.prepareField = function () {\r\n        var _a;\r\n        var _b;\r\n        for (var i = 0; i < this.countColumns; i++) {\r\n            (_a = (_b = this.positions)[i]) !== null && _a !== void 0 ? _a : (_b[i] = []);\r\n            for (var j = 0; j < this.countRows; j++) {\r\n                var cellType = this.getCellType(i, j);\r\n                this.positions[i][j] = { type: cellType };\r\n            }\r\n        }\r\n    };\r\n    return Field;\r\n}());\r\nexports.Field = Field;\r\n\n\n//# sourceURL=webpack:///./src/Field.ts?");

/***/ }),

/***/ "./src/Player.ts":
/*!***********************!*\
  !*** ./src/Player.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports) {

eval("\r\nvar __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {\r\n    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {\r\n        if (ar || !(i in from)) {\r\n            if (!ar) ar = Array.prototype.slice.call(from, 0, i);\r\n            ar[i] = from[i];\r\n        }\r\n    }\r\n    return to.concat(ar || Array.prototype.slice.call(from));\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Player = void 0;\r\nvar Player = /** @class */ (function () {\r\n    function Player(players) {\r\n        var _this = this;\r\n        this.onKeyDown = function (e) {\r\n            switch (e.key) {\r\n                case ' ':\r\n                    _this.players.playerPutBomb(_this);\r\n                    break;\r\n                case 'ArrowRight':\r\n                case 'ArrowLeft':\r\n                case 'ArrowDown':\r\n                case 'ArrowUp':\r\n                    _this.moveTo(e.key);\r\n                    break;\r\n            }\r\n        };\r\n        var _a = players.addPlayer(), id = _a.id, pos = _a.pos;\r\n        this.id = id;\r\n        this.pos = pos;\r\n        this.players = players;\r\n        // to do - вынести в players\r\n        window.addEventListener('keydown', this.onKeyDown);\r\n    }\r\n    Player.prototype.draw = function (ctx) {\r\n        var cellSize = this.players.getCellSize();\r\n        var x = cellSize * this.pos[0] + cellSize / 2;\r\n        var y = cellSize * this.pos[1] + cellSize / 2;\r\n        ctx.fillStyle = 'green';\r\n        ctx.arc(x, y, cellSize / 2, 0, Math.PI * 2);\r\n        ctx.fill();\r\n        ctx.beginPath();\r\n    };\r\n    Player.prototype.getId = function () {\r\n        return this.id;\r\n    };\r\n    Player.prototype.getPlayerPos = function () {\r\n        return this.pos;\r\n    };\r\n    Player.prototype.getFlamePos = function () {\r\n        var _a = this.pos, column = _a[0], row = _a[1];\r\n        var hor = [\r\n            [column + 1, row],\r\n            [column - 1, row]\r\n        ];\r\n        var vert = [\r\n            [column, row + 1],\r\n            [column, row - 1]\r\n        ];\r\n        return __spreadArray(__spreadArray([], hor, true), vert, true);\r\n    };\r\n    Player.prototype.moveTo = function (key) {\r\n        var newPos = this.pos.slice();\r\n        switch (key) {\r\n            case 'ArrowRight':\r\n                newPos[0] += 1;\r\n                break;\r\n            case 'ArrowLeft':\r\n                newPos[0] -= 1;\r\n                break;\r\n            case 'ArrowDown':\r\n                newPos[1] += 1;\r\n                break;\r\n            case 'ArrowUp':\r\n                newPos[1] -= 1;\r\n                break;\r\n        }\r\n        if (!this.players.playerMoveTo(newPos)) {\r\n            return;\r\n        }\r\n        this.pos = newPos;\r\n    };\r\n    return Player;\r\n}());\r\nexports.Player = Player;\r\n\n\n//# sourceURL=webpack:///./src/Player.ts?");

/***/ }),

/***/ "./src/Players.ts":
/*!************************!*\
  !*** ./src/Players.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Players = void 0;\r\nvar Bomb_1 = __webpack_require__(/*! ./Bomb */ \"./src/Bomb.ts\");\r\nvar common_1 = __webpack_require__(/*! ./common/common */ \"./src/common/common.ts\");\r\nvar Player_1 = __webpack_require__(/*! ./Player */ \"./src/Player.ts\");\r\nvar Players = /** @class */ (function () {\r\n    function Players(field) {\r\n        this.players = [];\r\n        this.bombs = {};\r\n        this.field = field;\r\n        this.players = [new Player_1.Player(this)];\r\n    }\r\n    Players.prototype.draw = function () {\r\n        var ctx = this.field.getCanvas().getContext();\r\n        var bombs = Object.values(this.bombs).flat();\r\n        bombs.forEach(function (bomb) { return bomb.draw(ctx); });\r\n        this.players.forEach(function (player) { return player.draw(ctx); });\r\n    };\r\n    Players.prototype.getCellSize = function () {\r\n        return this.field.getCellSize();\r\n    };\r\n    Players.prototype.addPlayer = function () {\r\n        var id = this.players.length + 1;\r\n        return { pos: [0, 0], id: id };\r\n    };\r\n    Players.prototype.playerMoveTo = function (newPos) {\r\n        return this.field.isCellEmpty(newPos);\r\n    };\r\n    Players.prototype.playerPutBomb = function (player) {\r\n        var _this = this;\r\n        var _a;\r\n        var _b;\r\n        var playerId = player.getId();\r\n        (_a = (_b = this.bombs)[playerId]) !== null && _a !== void 0 ? _a : (_b[playerId] = []);\r\n        if (this.bombs[playerId].length > 0) {\r\n            return;\r\n        }\r\n        var pos = player.getPlayerPos();\r\n        var flamePos = player.getFlamePos().filter(function (pos) { return _this.field.isCellDestroy(pos); });\r\n        var bomb = new Bomb_1.Bomb(pos, flamePos, this.getCellSize(), function (bomb) { return _this.detonationBomb(playerId, bomb); });\r\n        this.bombs[playerId].push(bomb);\r\n        this.field.putBomb(pos);\r\n    };\r\n    Players.prototype.detonationBomb = function (playerId, bomb) {\r\n        var flamePos = bomb.getFlamePos();\r\n        this.deleteBomb(playerId, bomb);\r\n        this.deleteDiedPlayers(flamePos);\r\n        this.field.firedBomb(flamePos);\r\n    };\r\n    Players.prototype.deleteDiedPlayers = function (flamePos) {\r\n        var _loop_1 = function (i) {\r\n            var player = this_1.players[i];\r\n            var isDie = flamePos.find(function (pos) { return (0, common_1.isEqualPos)(player.getPlayerPos(), pos); });\r\n            if (!isDie) {\r\n                return \"continue\";\r\n            }\r\n            this_1.players.splice(player.getId(), 1);\r\n        };\r\n        var this_1 = this;\r\n        for (var i = 0; i < this.players.length; i++) {\r\n            _loop_1(i);\r\n        }\r\n    };\r\n    Players.prototype.deleteBomb = function (playerId, bomb) {\r\n        this.bombs[playerId] = this.bombs[playerId].filter(function (b) { return !(0, common_1.isEqualPos)(b.getPosition(), bomb.getPosition()); });\r\n    };\r\n    return Players;\r\n}());\r\nexports.Players = Players;\r\n\n\n//# sourceURL=webpack:///./src/Players.ts?");

/***/ }),

/***/ "./src/common/common.ts":
/*!******************************!*\
  !*** ./src/common/common.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.isEqualPos = void 0;\r\nfunction isEqualPos(pos, pos2) {\r\n    var column = pos[0], row = pos[1];\r\n    var column2 = pos2[0], row2 = pos2[1];\r\n    return column === column2 && row === row2;\r\n}\r\nexports.isEqualPos = isEqualPos;\r\n\n\n//# sourceURL=webpack:///./src/common/common.ts?");

/***/ }),

/***/ "./src/images/images.ts":
/*!******************************!*\
  !*** ./src/images/images.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.flame = exports.imageBomb2 = exports.imageBomb1 = exports.imageWood = exports.imageGrass = exports.imageStone = void 0;\r\nexports.imageStone = new Image();\r\nexports.imageStone.src = 'images/stone.png';\r\nexports.imageGrass = new Image();\r\nexports.imageGrass.src = 'images/grass.png';\r\nexports.imageWood = new Image();\r\nexports.imageWood.src = 'images/wood.png';\r\nexports.imageBomb1 = new Image();\r\nexports.imageBomb1.src = 'images/bomb1.png';\r\nexports.imageBomb2 = new Image();\r\nexports.imageBomb2.src = 'images/bomb2.png';\r\nexports.flame = new Image();\r\nexports.flame.src = 'images/flame.png';\r\n\n\n//# sourceURL=webpack:///./src/images/images.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\n__webpack_require__(/*! ./style.css */ \"./src/style.css\");\r\nvar Canvas_1 = __webpack_require__(/*! ./Canvas */ \"./src/Canvas.ts\");\r\nvar Field_1 = __webpack_require__(/*! ./Field */ \"./src/Field.ts\");\r\nvar canvas = new Canvas_1.Canvas();\r\nvar field = new Field_1.Field(canvas);\r\nvar ctx = canvas.getContext();\r\n(function loop() {\r\n    canvas.clear();\r\n    var _a = field.getOffsets(), left = _a.left, top = _a.top;\r\n    ctx === null || ctx === void 0 ? void 0 : ctx.save();\r\n    ctx === null || ctx === void 0 ? void 0 : ctx.translate(left, top);\r\n    field.draw();\r\n    ctx === null || ctx === void 0 ? void 0 : ctx.restore();\r\n    requestAnimationFrame(loop);\r\n})();\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;