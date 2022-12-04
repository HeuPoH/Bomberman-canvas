/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/Bomb.ts":
/*!*********************!*\
  !*** ./src/Bomb.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bomb = void 0;
var images_1 = __webpack_require__(/*! ./images/images */ "./src/images/images.ts");
var BombStatus;
(function (BombStatus) {
    BombStatus["Installed"] = "Installed";
    BombStatus["Countdown"] = "Countdown";
    BombStatus["Fired"] = "Fired";
})(BombStatus || (BombStatus = {}));
var Bomb = /** @class */ (function () {
    function Bomb(pos, flamePos, size, detonationBomb) {
        this.duration = 3000;
        this.pos = pos;
        this.size = size;
        this.flamePos = __spreadArray(__spreadArray([], flamePos, true), [pos], false);
        this.startTime = performance.now();
        this.detonationBomb = detonationBomb;
    }
    Bomb.prototype.getPosition = function () {
        return this.pos;
    };
    Bomb.prototype.getFlamePos = function () {
        return this.flamePos;
    };
    Bomb.prototype.draw = function (ctx) {
        var timeFraction = (performance.now() - this.startTime) / this.duration;
        var bombStatus = this.getBombStatus(timeFraction);
        this.drawBomb(ctx, this.size, bombStatus);
        this.drawFlamePos(ctx, this.size, bombStatus);
        if (bombStatus === BombStatus.Fired) {
            var isDeleteBomb = timeFraction >= 1;
            this.detonationBomb(this, isDeleteBomb);
        }
    };
    Bomb.prototype.drawBomb = function (ctx, size, status) {
        if (status === BombStatus.Fired) {
            return;
        }
        var _a = this.pos, column = _a[0], row = _a[1];
        var image = this.getImage(status);
        var sizeBomb = size * 0.8;
        var offset = (size - sizeBomb) / 2;
        ctx.drawImage(image, column * size + offset, row * size + offset, sizeBomb, sizeBomb);
    };
    Bomb.prototype.drawFlamePos = function (ctx, size, status) {
        if (status !== BombStatus.Fired) {
            return;
        }
        this.flamePos.forEach(function (pos) {
            var x = pos[0], y = pos[1];
            ctx.drawImage(images_1.flame, x * size, y * size, size, size);
        });
    };
    Bomb.prototype.getBombStatus = function (timeFraction) {
        if (timeFraction >= 0 && timeFraction < 0.5) {
            return BombStatus.Installed;
        }
        else if (timeFraction >= 0.5 && timeFraction < 0.9) {
            return BombStatus.Countdown;
        }
        else {
            return BombStatus.Fired;
        }
    };
    Bomb.prototype.getImage = function (bombStatus) {
        switch (bombStatus) {
            case BombStatus.Installed:
                return images_1.imageBomb1;
            case BombStatus.Countdown:
                return images_1.imageBomb2;
            default:
                return images_1.flame;
        }
    };
    return Bomb;
}());
exports.Bomb = Bomb;


/***/ }),

/***/ "./src/Canvas.ts":
/*!***********************!*\
  !*** ./src/Canvas.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Canvas = void 0;
var Canvas = /** @class */ (function () {
    function Canvas() {
        var _this = this;
        this.canvas = document.getElementById('canvas');
        this.width = 0;
        this.height = 0;
        this.updateSize = function () {
            _this.width = document.body.clientWidth;
            _this.height = document.body.clientHeight;
            _this.canvas.width = _this.width;
            _this.canvas.height = _this.height;
        };
        this.updateSize();
        window.addEventListener('resize', this.updateSize);
    }
    Canvas.prototype.getContext = function () {
        return this.canvas.getContext('2d');
    };
    Canvas.prototype.getSize = function () {
        return {
            width: this.width,
            height: this.height
        };
    };
    Canvas.prototype.clear = function () {
        var _a;
        (_a = this.canvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.width, this.height);
    };
    return Canvas;
}());
exports.Canvas = Canvas;


/***/ }),

/***/ "./src/Field.ts":
/*!**********************!*\
  !*** ./src/Field.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Field = void 0;
var common_1 = __webpack_require__(/*! ./common/common */ "./src/common/common.ts");
var images_1 = __webpack_require__(/*! ./images/images */ "./src/images/images.ts");
var Players_1 = __webpack_require__(/*! ./Players */ "./src/Players.ts");
var settings_1 = __webpack_require__(/*! ./settings */ "./src/settings.ts");
var CellType;
(function (CellType) {
    CellType[CellType["Empty"] = 0] = "Empty";
    CellType[CellType["SolidBlock"] = 1] = "SolidBlock";
    CellType[CellType["ExplodableBlock"] = 2] = "ExplodableBlock";
})(CellType || (CellType = {}));
var CellSubType;
(function (CellSubType) {
    CellSubType[CellSubType["Bomb"] = 2] = "Bomb";
})(CellSubType || (CellSubType = {}));
var Field = /** @class */ (function () {
    function Field(canvas) {
        this.positions = [];
        this.canvas = canvas;
        this.prepareField();
        this.players = new Players_1.Players(this);
    }
    Field.prototype.draw = function () {
        var _this = this;
        var ctx = this.canvas.getContext();
        if (!ctx) {
            return;
        }
        var cellSize = this.getCellSize();
        this.positions.forEach(function (row, i) {
            row.forEach(function (cell, j) {
                var image = _this.getCellFillImage(cell.type);
                var x = i * cellSize;
                var y = j * cellSize;
                ctx.drawImage(image, x, y, cellSize, cellSize);
            });
        });
        this.players.draw();
    };
    Field.prototype.getCanvas = function () {
        return this.canvas;
    };
    Field.prototype.isCellEmpty = function (pos) {
        var _a;
        var column = pos[0], row = pos[1];
        var position = (_a = this.positions[column]) === null || _a === void 0 ? void 0 : _a[row];
        if ((position === null || position === void 0 ? void 0 : position.type) !== CellType.Empty || position.subType) {
            return false;
        }
        return true;
    };
    Field.prototype.isCellDestroy = function (pos) {
        var column = pos[0], row = pos[1];
        return this.positions[column][row].type !== CellType.SolidBlock;
    };
    Field.prototype.getOffsets = function () {
        var cellSize = this.getCellSize();
        var _a = this.canvas.getSize(), width = _a.width, height = _a.height;
        var offsetLeft = (width - cellSize * settings_1.countColumns) / 2;
        var offsetTop = (height - cellSize * settings_1.countRows) / 2;
        return {
            left: offsetLeft,
            top: offsetTop
        };
    };
    Field.prototype.getCellSize = function () {
        var _a = this.canvas.getSize(), width = _a.width, height = _a.height;
        var size = Math.min(width, height);
        var items = size === width ? settings_1.countColumns : settings_1.countRows;
        return size / items;
    };
    Field.prototype.putBomb = function (pos) {
        var column = pos[0], row = pos[1];
        this.positions[column][row].subType = CellSubType.Bomb;
    };
    Field.prototype.detonationBomb = function (positions) {
        var _this = this;
        positions.forEach(function (pos) {
            _this.clearCell(pos);
            _this.deleteBomb(pos);
        });
    };
    Field.prototype.clearCell = function (pos) {
        var column = pos[0], row = pos[1];
        this.positions[column][row].type = CellType.Empty;
    };
    Field.prototype.deleteBomb = function (pos) {
        var column = pos[0], row = pos[1];
        this.positions[column][row].subType = undefined;
    };
    Field.prototype.getCellType = function (column, row) {
        var emptyPos = [
            [1, 1],
            [1, 2],
            [2, 1],
            [settings_1.countColumns - 2, 1],
            [settings_1.countColumns - 3, 1],
            [settings_1.countColumns - 2, 2],
            [settings_1.countColumns - 2, settings_1.countRows - 2],
            [settings_1.countColumns - 2, settings_1.countRows - 3],
            [settings_1.countColumns - 3, settings_1.countRows - 2],
            [1, settings_1.countRows - 2],
            [1, settings_1.countRows - 3],
            [2, settings_1.countRows - 2]
        ];
        if (emptyPos.find(function (pos) { return (0, common_1.isEqualPos)(pos, [column, row]); })) {
            return CellType.Empty;
        }
        return Math.round((column - 1) % 2) === 0 || Math.round((row - 1) % 2) === 0
            ? CellType.ExplodableBlock
            : CellType.SolidBlock;
    };
    Field.prototype.getCellFillImage = function (type) {
        switch (type) {
            case CellType.SolidBlock:
                return images_1.solidBlock;
            case CellType.ExplodableBlock:
                return images_1.explodableBlock;
            default:
                return images_1.grassBlock;
        }
    };
    Field.prototype.prepareField = function () {
        var _a;
        var _b;
        for (var i = 0; i < settings_1.countColumns; i++) {
            (_a = (_b = this.positions)[i]) !== null && _a !== void 0 ? _a : (_b[i] = []);
            for (var j = 0; j < settings_1.countRows; j++) {
                if (i === 0 || i === settings_1.countColumns - 1 || j === 0 || j === settings_1.countRows - 1) {
                    this.positions[i][j] = { type: CellType.SolidBlock };
                    continue;
                }
                var cellType = this.getCellType(i, j);
                this.positions[i][j] = { type: cellType };
            }
        }
    };
    return Field;
}());
exports.Field = Field;


/***/ }),

/***/ "./src/Player.ts":
/*!***********************!*\
  !*** ./src/Player.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports) {


var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
var Player = /** @class */ (function () {
    function Player(players) {
        var _this = this;
        this.onKeyDown = function (e) {
            var _a = _this.control, up = _a.up, right = _a.right, down = _a.down, left = _a.left, putBomb = _a.putBomb;
            switch (e.code) {
                case putBomb:
                    _this.players.playerPutBomb(_this);
                    break;
                case up:
                case right:
                case down:
                case left:
                    _this.moveTo(e.code);
                    break;
            }
        };
        var _a = players.addPlayer(), id = _a.id, pos = _a.pos, control = _a.control, image = _a.image;
        this.id = id;
        this.pos = pos;
        this.players = players;
        this.control = control;
        this.image = image;
        // to do - вынести в players
        window.addEventListener('keydown', this.onKeyDown);
    }
    Player.prototype.draw = function (ctx) {
        var cellSize = this.players.getCellSize();
        var playerSize = cellSize * 0.7;
        var x = cellSize * this.pos[0] + cellSize / 2;
        var y = cellSize * this.pos[1] + cellSize / 2;
        ctx.fillStyle = this.image;
        ctx.arc(x, y, playerSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
    };
    Player.prototype.getId = function () {
        return this.id;
    };
    Player.prototype.getPlayerPos = function () {
        return this.pos;
    };
    Player.prototype.getFlamePos = function () {
        var _a = this.pos, column = _a[0], row = _a[1];
        var hor = [
            [column + 1, row],
            [column - 1, row]
        ];
        var vert = [
            [column, row + 1],
            [column, row - 1]
        ];
        return __spreadArray(__spreadArray([], hor, true), vert, true);
    };
    Player.prototype.removeListener = function () {
        window.removeEventListener('keydown', this.onKeyDown);
    };
    Player.prototype.moveTo = function (code) {
        var newPos = this.pos.slice();
        var _a = this.control, up = _a.up, right = _a.right, down = _a.down, left = _a.left;
        switch (code) {
            case right:
                newPos[0] += 1;
                break;
            case left:
                newPos[0] -= 1;
                break;
            case down:
                newPos[1] += 1;
                break;
            case up:
                newPos[1] -= 1;
                break;
        }
        if (!this.players.playerMoveTo(newPos)) {
            return;
        }
        this.pos = newPos;
    };
    return Player;
}());
exports.Player = Player;


/***/ }),

/***/ "./src/Players.ts":
/*!************************!*\
  !*** ./src/Players.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Players = void 0;
var common_1 = __webpack_require__(/*! ./common/common */ "./src/common/common.ts");
var Bomb_1 = __webpack_require__(/*! ./Bomb */ "./src/Bomb.ts");
var Player_1 = __webpack_require__(/*! ./Player */ "./src/Player.ts");
var settings_1 = __webpack_require__(/*! ./settings */ "./src/settings.ts");
var Players = /** @class */ (function () {
    function Players(field) {
        this.players = [];
        this.bombs = {};
        this.field = field;
        for (var i = 0; i < settings_1.playersInit.length; i++) {
            var player = new Player_1.Player(this);
            this.players.push(player);
        }
    }
    Players.prototype.draw = function () {
        var ctx = this.field.getCanvas().getContext();
        var bombs = Object.values(this.bombs).flat();
        bombs.forEach(function (bomb) { return bomb.draw(ctx); });
        this.players.forEach(function (player) { return player.draw(ctx); });
    };
    Players.prototype.getCellSize = function () {
        return this.field.getCellSize();
    };
    Players.prototype.addPlayer = function () {
        var id = this.players.length;
        var _a = settings_1.playersInit[id], pos = _a.pos, control = _a.control, image = _a.image;
        return { pos: pos, id: id, control: control, image: image };
    };
    Players.prototype.playerMoveTo = function (newPos) {
        return this.field.isCellEmpty(newPos);
    };
    Players.prototype.playerPutBomb = function (player) {
        var _this = this;
        var _a;
        var _b;
        var playerId = player.getId();
        (_a = (_b = this.bombs)[playerId]) !== null && _a !== void 0 ? _a : (_b[playerId] = []);
        if (this.bombs[playerId].length > 0) {
            return;
        }
        var pos = player.getPlayerPos();
        var flamePos = player.getFlamePos().filter(function (pos) { return _this.field.isCellDestroy(pos); });
        var bomb = new Bomb_1.Bomb(pos, flamePos, this.getCellSize(), function (bomb, isDelete) { return _this.detonationBomb(playerId, bomb, isDelete); });
        this.bombs[playerId].push(bomb);
        this.field.putBomb(pos);
    };
    Players.prototype.detonationBomb = function (playerId, bomb, isDeleteBomb) {
        var flamePos = bomb.getFlamePos();
        isDeleteBomb && this.deleteBomb(playerId, bomb);
        this.deleteDiedPlayers(flamePos);
        this.field.detonationBomb(flamePos);
    };
    Players.prototype.deleteDiedPlayers = function (flamePos) {
        var _loop_1 = function (i) {
            var player = this_1.players[i];
            var isDie = flamePos.find(function (pos) { return (0, common_1.isEqualPos)(player.getPlayerPos(), pos); });
            if (!isDie) {
                return "continue";
            }
            player.removeListener();
            this_1.players.splice(player.getId(), 1);
        };
        var this_1 = this;
        for (var i = 0; i < this.players.length; i++) {
            _loop_1(i);
        }
    };
    Players.prototype.deleteBomb = function (playerId, bomb) {
        this.bombs[playerId] = this.bombs[playerId].filter(function (b) { return !(0, common_1.isEqualPos)(b.getPosition(), bomb.getPosition()); });
    };
    return Players;
}());
exports.Players = Players;


/***/ }),

/***/ "./src/common/common.ts":
/*!******************************!*\
  !*** ./src/common/common.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isEqualPos = void 0;
function isEqualPos(pos, pos2) {
    var column = pos[0], row = pos[1];
    var column2 = pos2[0], row2 = pos2[1];
    return column === column2 && row === row2;
}
exports.isEqualPos = isEqualPos;


/***/ }),

/***/ "./src/images/images.ts":
/*!******************************!*\
  !*** ./src/images/images.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.flame = exports.imageBomb2 = exports.imageBomb1 = exports.explodableBlock = exports.grassBlock = exports.solidBlock = void 0;
exports.solidBlock = new Image();
exports.solidBlock.src = 'images/solidBlock.png';
exports.grassBlock = new Image();
exports.grassBlock.src = 'images/grassBlock.png';
exports.explodableBlock = new Image();
exports.explodableBlock.src = 'images/explodableBlock.png';
exports.imageBomb1 = new Image();
exports.imageBomb1.src = 'images/bomb1.png';
exports.imageBomb2 = new Image();
exports.imageBomb2.src = 'images/bomb2.png';
exports.flame = new Image();
exports.flame.src = 'images/flame.png';


/***/ }),

/***/ "./src/settings.ts":
/*!*************************!*\
  !*** ./src/settings.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.playersInit = exports.countColumns = exports.countRows = void 0;
exports.countRows = 15;
exports.countColumns = 19;
exports.playersInit = [
    {
        control: {
            up: 'ArrowUp',
            right: 'ArrowRight',
            down: 'ArrowDown',
            left: 'ArrowLeft',
            putBomb: 'Space'
        },
        image: 'yellow',
        pos: [1, 1]
    },
    {
        control: {
            up: 'KeyW',
            right: 'KeyD',
            down: 'KeyS',
            left: 'KeyA',
            putBomb: 'KeyE'
        },
        image: 'red',
        pos: [exports.countColumns - 2, exports.countRows - 2]
    }
];


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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./style.css */ "./src/style.css");
var Canvas_1 = __webpack_require__(/*! ./Canvas */ "./src/Canvas.ts");
var Field_1 = __webpack_require__(/*! ./Field */ "./src/Field.ts");
var canvas = new Canvas_1.Canvas();
var field = new Field_1.Field(canvas);
var ctx = canvas.getContext();
(function loop() {
    canvas.clear();
    var _a = field.getOffsets(), left = _a.left, top = _a.top;
    ctx === null || ctx === void 0 ? void 0 : ctx.save();
    ctx === null || ctx === void 0 ? void 0 : ctx.translate(left, top);
    field.draw();
    ctx === null || ctx === void 0 ? void 0 : ctx.restore();
    requestAnimationFrame(loop);
})();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOQSwwREFBcUI7QUFFckIsc0VBQWtDO0FBQ2xDLG1FQUFnQztBQUVoQyxJQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO0FBQzVCLElBQU0sS0FBSyxHQUFHLElBQUksYUFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUVoQyxDQUFDLFNBQVMsSUFBSTtJQUNaLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUVULFNBQWdCLEtBQUssQ0FBQyxVQUFVLEVBQUUsRUFBaEMsSUFBSSxZQUFFLEdBQUcsU0FBdUIsQ0FBQztJQUN6QyxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsSUFBSSxFQUFFLENBQUM7SUFDWixHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMxQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDYixHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsT0FBTyxFQUFFLENBQUM7SUFFZixxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixDQUFDLENBQUMsRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlLmNzcz82ZGYzIiwid2VicGFjazovLy8uL3NyYy9Cb21iLnRzIiwid2VicGFjazovLy8uL3NyYy9DYW52YXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0ZpZWxkLnRzIiwid2VicGFjazovLy8uL3NyYy9QbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BsYXllcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1vbi9jb21tb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltYWdlcy9pbWFnZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NldHRpbmdzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IHsgUG9zaXRpb24gfSBmcm9tICcuL2NvbW1vbi90eXBlcyc7XHJcbmltcG9ydCB7IGZsYW1lLCBpbWFnZUJvbWIxLCBpbWFnZUJvbWIyIH0gZnJvbSAnLi9pbWFnZXMvaW1hZ2VzJztcclxuXHJcbmVudW0gQm9tYlN0YXR1cyB7XHJcbiAgSW5zdGFsbGVkID0gJ0luc3RhbGxlZCcsXHJcbiAgQ291bnRkb3duID0gJ0NvdW50ZG93bicsXHJcbiAgRmlyZWQgPSAnRmlyZWQnXHJcbn1cclxuICBcclxuZXhwb3J0IGNsYXNzIEJvbWIge1xyXG4gIHByaXZhdGUgcG9zOiBQb3NpdGlvbjtcclxuICBwcml2YXRlIHNpemU6IG51bWJlcjtcclxuICBwcml2YXRlIGZsYW1lUG9zOiBQb3NpdGlvbltdO1xyXG4gIHByaXZhdGUgc3RhcnRUaW1lOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBkZXRvbmF0aW9uQm9tYjogKGJvbWI6IEJvbWIsIGRlbGV0ZUJvbWI/OiBib29sZWFuKSA9PiB2b2lkO1xyXG4gIHByaXZhdGUgZHVyYXRpb24gPSAzMDAwO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHBvczogUG9zaXRpb24sXHJcbiAgICBmbGFtZVBvczogUG9zaXRpb25bXSxcclxuICAgIHNpemU6IG51bWJlcixcclxuICAgIGRldG9uYXRpb25Cb21iOiAoYm9tYjogQm9tYiwgZGVsZXRlQm9tYj86IGJvb2xlYW4pID0+IHZvaWRcclxuICApIHtcclxuICAgIHRoaXMucG9zID0gcG9zO1xyXG4gICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgIHRoaXMuZmxhbWVQb3MgPSBbLi4uZmxhbWVQb3MsIHBvc107XHJcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgdGhpcy5kZXRvbmF0aW9uQm9tYiA9IGRldG9uYXRpb25Cb21iO1xyXG4gIH1cclxuXHJcbiAgZ2V0UG9zaXRpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wb3M7XHJcbiAgfVxyXG5cclxuICBnZXRGbGFtZVBvcygpIHtcclxuICAgIHJldHVybiB0aGlzLmZsYW1lUG9zO1xyXG4gIH1cclxuXHJcbiAgZHJhdyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgY29uc3QgdGltZUZyYWN0aW9uID0gKHBlcmZvcm1hbmNlLm5vdygpIC0gdGhpcy5zdGFydFRpbWUpIC8gdGhpcy5kdXJhdGlvbjtcclxuICAgIGNvbnN0IGJvbWJTdGF0dXMgPSB0aGlzLmdldEJvbWJTdGF0dXModGltZUZyYWN0aW9uKTtcclxuXHJcbiAgICB0aGlzLmRyYXdCb21iKGN0eCwgdGhpcy5zaXplLCBib21iU3RhdHVzKTtcclxuICAgIHRoaXMuZHJhd0ZsYW1lUG9zKGN0eCwgdGhpcy5zaXplLCBib21iU3RhdHVzKTtcclxuXHJcbiAgICBpZiAoYm9tYlN0YXR1cyA9PT0gQm9tYlN0YXR1cy5GaXJlZCkge1xyXG4gICAgICBjb25zdCBpc0RlbGV0ZUJvbWIgPSB0aW1lRnJhY3Rpb24gPj0gMTtcclxuICAgICAgdGhpcy5kZXRvbmF0aW9uQm9tYih0aGlzLCBpc0RlbGV0ZUJvbWIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkcmF3Qm9tYihcclxuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gICAgc2l6ZTogbnVtYmVyLFxyXG4gICAgc3RhdHVzOiBCb21iU3RhdHVzXHJcbiAgKSB7XHJcbiAgICBpZiAoc3RhdHVzID09PSBCb21iU3RhdHVzLkZpcmVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBbY29sdW1uLCByb3ddID0gdGhpcy5wb3M7XHJcbiAgICBjb25zdCBpbWFnZSA9IHRoaXMuZ2V0SW1hZ2Uoc3RhdHVzKTtcclxuICAgIGNvbnN0IHNpemVCb21iID0gc2l6ZSAqIDAuODtcclxuICAgIGNvbnN0IG9mZnNldCA9IChzaXplIC0gc2l6ZUJvbWIpIC8gMjtcclxuICAgIGN0eC5kcmF3SW1hZ2UoaW1hZ2UsIGNvbHVtbiAqIHNpemUgKyBvZmZzZXQsIHJvdyAqIHNpemUgKyBvZmZzZXQsIHNpemVCb21iLCBzaXplQm9tYik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRyYXdGbGFtZVBvcyhcclxuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gICAgc2l6ZTogbnVtYmVyLFxyXG4gICAgc3RhdHVzOiBCb21iU3RhdHVzXHJcbiAgKSB7XHJcbiAgICBpZiAoc3RhdHVzICE9PSBCb21iU3RhdHVzLkZpcmVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmZsYW1lUG9zLmZvckVhY2gocG9zID0+IHtcclxuICAgICAgY29uc3QgW3gsIHldID0gcG9zO1xyXG4gICAgICBjdHguZHJhd0ltYWdlKGZsYW1lLCB4ICogc2l6ZSwgeSAqIHNpemUsIHNpemUsIHNpemUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEJvbWJTdGF0dXModGltZUZyYWN0aW9uOiBudW1iZXIpOiBCb21iU3RhdHVzIHtcclxuICAgIGlmICh0aW1lRnJhY3Rpb24gPj0gMCAmJiB0aW1lRnJhY3Rpb24gPCAwLjUpIHtcclxuICAgICAgcmV0dXJuIEJvbWJTdGF0dXMuSW5zdGFsbGVkO1xyXG4gICAgfSBlbHNlIGlmICh0aW1lRnJhY3Rpb24gPj0gMC41ICYmIHRpbWVGcmFjdGlvbiA8IDAuOSkge1xyXG4gICAgICByZXR1cm4gQm9tYlN0YXR1cy5Db3VudGRvd247XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gQm9tYlN0YXR1cy5GaXJlZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0SW1hZ2UoYm9tYlN0YXR1czogQm9tYlN0YXR1cykge1xyXG4gICAgc3dpdGNoIChib21iU3RhdHVzKSB7XHJcbiAgICAgIGNhc2UgQm9tYlN0YXR1cy5JbnN0YWxsZWQ6XHJcbiAgICAgICAgcmV0dXJuIGltYWdlQm9tYjE7XHJcbiAgICAgIGNhc2UgQm9tYlN0YXR1cy5Db3VudGRvd246XHJcbiAgICAgICAgcmV0dXJuIGltYWdlQm9tYjI7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIGZsYW1lO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJ0eXBlIFJlY3QgPSB7XHJcbiAgd2lkdGg6IG51bWJlcjtcclxuICBoZWlnaHQ6IG51bWJlcjtcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYW52YXMge1xyXG4gIHByaXZhdGUgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIHByaXZhdGUgd2lkdGggPSAwO1xyXG4gIHByaXZhdGUgaGVpZ2h0ID0gMDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnVwZGF0ZVNpemUoKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnVwZGF0ZVNpemUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29udGV4dCgpIHtcclxuICAgIHJldHVybiB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2l6ZSgpOiBSZWN0IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY2xlYXIoKSB7XHJcbiAgICB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpPy5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVTaXplID0gKCkgPT4ge1xyXG4gICAgdGhpcy53aWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcbiAgICB0aGlzLmhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cclxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcclxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9zaXRpb24gfSBmcm9tICcuL2NvbW1vbi90eXBlcyc7XHJcbmltcG9ydCB7IGlzRXF1YWxQb3MgfSBmcm9tICcuL2NvbW1vbi9jb21tb24nO1xyXG5cclxuaW1wb3J0IHsgZXhwbG9kYWJsZUJsb2NrLCBncmFzc0Jsb2NrLCBzb2xpZEJsb2NrIH0gZnJvbSAnLi9pbWFnZXMvaW1hZ2VzJztcclxuaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSAnLi9DYW52YXMnO1xyXG5pbXBvcnQgeyBQbGF5ZXJzIH0gZnJvbSAnLi9QbGF5ZXJzJztcclxuaW1wb3J0IHsgY291bnRDb2x1bW5zLCBjb3VudFJvd3MgfSBmcm9tICcuL3NldHRpbmdzJztcclxuXHJcbmludGVyZmFjZSBGaWVsZENlbGxTdGF0dXMge1xyXG4gIHR5cGU6IENlbGxUeXBlO1xyXG4gIHN1YlR5cGU/OiBDZWxsU3ViVHlwZTtcclxufVxyXG5cclxuZW51bSBDZWxsVHlwZSB7XHJcbiAgRW1wdHkgPSAwLFxyXG4gIFNvbGlkQmxvY2sgPSAxLFxyXG4gIEV4cGxvZGFibGVCbG9jayA9IDJcclxufVxyXG5cclxuZW51bSBDZWxsU3ViVHlwZSB7XHJcbiAgQm9tYiA9IDJcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxkIHtcclxuICBwcml2YXRlIGNhbnZhczogQ2FudmFzO1xyXG4gIHByaXZhdGUgcG9zaXRpb25zOiBGaWVsZENlbGxTdGF0dXNbXVtdID0gW107XHJcbiAgcHJpdmF0ZSBwbGF5ZXJzOiBQbGF5ZXJzO1xyXG5cclxuICBjb25zdHJ1Y3RvcihjYW52YXM6IENhbnZhcykge1xyXG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICB0aGlzLnByZXBhcmVGaWVsZCgpO1xyXG5cclxuICAgIHRoaXMucGxheWVycyA9IG5ldyBQbGF5ZXJzKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZHJhdygpIHtcclxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoKTtcclxuICAgIGlmICghY3R4KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjZWxsU2l6ZSA9IHRoaXMuZ2V0Q2VsbFNpemUoKTtcclxuICAgIHRoaXMucG9zaXRpb25zLmZvckVhY2goKHJvdywgaSkgPT4ge1xyXG4gICAgICByb3cuZm9yRWFjaCgoY2VsbCwgaikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGltYWdlID0gdGhpcy5nZXRDZWxsRmlsbEltYWdlKGNlbGwudHlwZSk7XHJcbiAgICAgICAgY29uc3QgeCA9IGkgKiBjZWxsU2l6ZTtcclxuICAgICAgICBjb25zdCB5ID0gaiAqIGNlbGxTaXplO1xyXG5cclxuICAgICAgICBjdHguZHJhd0ltYWdlKGltYWdlLCB4LCB5LCBjZWxsU2l6ZSwgY2VsbFNpemUpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucGxheWVycy5kcmF3KCk7XHJcbiAgfVxyXG5cclxuICBnZXRDYW52YXMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYW52YXM7XHJcbiAgfVxyXG5cclxuICBpc0NlbGxFbXB0eShwb3M6IFBvc2l0aW9uKSB7XHJcbiAgICBjb25zdCBbY29sdW1uLCByb3ddID0gcG9zO1xyXG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uc1tjb2x1bW5dPy5bcm93XTtcclxuICAgIGlmIChwb3NpdGlvbj8udHlwZSAhPT0gQ2VsbFR5cGUuRW1wdHkgfHwgcG9zaXRpb24uc3ViVHlwZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBpc0NlbGxEZXN0cm95KHBvczogUG9zaXRpb24pIHtcclxuICAgIGNvbnN0IFtjb2x1bW4sIHJvd10gPSBwb3M7XHJcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbnNbY29sdW1uXVtyb3ddLnR5cGUgIT09IENlbGxUeXBlLlNvbGlkQmxvY2s7XHJcbiAgfVxyXG5cclxuICBnZXRPZmZzZXRzKCkge1xyXG4gICAgY29uc3QgY2VsbFNpemUgPSB0aGlzLmdldENlbGxTaXplKCk7XHJcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuY2FudmFzLmdldFNpemUoKTtcclxuICAgIGNvbnN0IG9mZnNldExlZnQgPSAod2lkdGggLSBjZWxsU2l6ZSAqIGNvdW50Q29sdW1ucykgLyAyO1xyXG4gICAgY29uc3Qgb2Zmc2V0VG9wID0gKGhlaWdodCAtIGNlbGxTaXplICogY291bnRSb3dzKSAvIDI7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbGVmdDogb2Zmc2V0TGVmdCxcclxuICAgICAgdG9wOiBvZmZzZXRUb3BcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXRDZWxsU2l6ZSgpIHtcclxuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5jYW52YXMuZ2V0U2l6ZSgpO1xyXG4gICAgY29uc3Qgc2l6ZSA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgY29uc3QgaXRlbXMgPSBzaXplID09PSB3aWR0aCA/IGNvdW50Q29sdW1ucyA6IGNvdW50Um93cztcclxuICAgIHJldHVybiBzaXplIC8gaXRlbXM7XHJcbiAgfVxyXG5cclxuICBwdXRCb21iKHBvczogUG9zaXRpb24pIHtcclxuICAgIGNvbnN0IFtjb2x1bW4sIHJvd10gPSBwb3M7XHJcbiAgICB0aGlzLnBvc2l0aW9uc1tjb2x1bW5dW3Jvd10uc3ViVHlwZSA9IENlbGxTdWJUeXBlLkJvbWI7XHJcbiAgfVxyXG5cclxuICBkZXRvbmF0aW9uQm9tYihwb3NpdGlvbnM6IFBvc2l0aW9uW10pIHtcclxuICAgIHBvc2l0aW9ucy5mb3JFYWNoKHBvcyA9PiB7XHJcbiAgICAgIHRoaXMuY2xlYXJDZWxsKHBvcyk7XHJcbiAgICAgIHRoaXMuZGVsZXRlQm9tYihwb3MpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNsZWFyQ2VsbChwb3M6IFBvc2l0aW9uKSB7XHJcbiAgICBjb25zdCBbY29sdW1uLCByb3ddID0gcG9zO1xyXG4gICAgdGhpcy5wb3NpdGlvbnNbY29sdW1uXVtyb3ddLnR5cGUgPSBDZWxsVHlwZS5FbXB0eTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZGVsZXRlQm9tYihwb3M6IFBvc2l0aW9uKSB7XHJcbiAgICBjb25zdCBbY29sdW1uLCByb3ddID0gcG9zO1xyXG4gICAgdGhpcy5wb3NpdGlvbnNbY29sdW1uXVtyb3ddLnN1YlR5cGUgPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldENlbGxUeXBlKGNvbHVtbjogbnVtYmVyLCByb3c6IG51bWJlcik6IENlbGxUeXBlIHtcclxuICAgIGNvbnN0IGVtcHR5UG9zOiBQb3NpdGlvbltdID0gW1xyXG4gICAgICBbMSwgMV0sXHJcbiAgICAgIFsxLCAyXSxcclxuICAgICAgWzIsIDFdLFxyXG4gICAgICBbY291bnRDb2x1bW5zIC0gMiwgMV0sXHJcbiAgICAgIFtjb3VudENvbHVtbnMgLSAzLCAxXSxcclxuICAgICAgW2NvdW50Q29sdW1ucyAtIDIsIDJdLFxyXG4gICAgICBbY291bnRDb2x1bW5zIC0gMiwgY291bnRSb3dzIC0gMl0sXHJcbiAgICAgIFtjb3VudENvbHVtbnMgLSAyLCBjb3VudFJvd3MgLSAzXSxcclxuICAgICAgW2NvdW50Q29sdW1ucyAtIDMsIGNvdW50Um93cyAtIDJdLFxyXG4gICAgICBbMSwgY291bnRSb3dzIC0gMl0sXHJcbiAgICAgIFsxLCBjb3VudFJvd3MgLSAzXSxcclxuICAgICAgWzIsIGNvdW50Um93cyAtIDJdXHJcbiAgICBdO1xyXG5cclxuICAgIGlmIChlbXB0eVBvcy5maW5kKHBvcyA9PiBpc0VxdWFsUG9zKHBvcywgW2NvbHVtbiwgcm93XSkpKSB7XHJcbiAgICAgIHJldHVybiBDZWxsVHlwZS5FbXB0eTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gTWF0aC5yb3VuZCgoY29sdW1uIC0gMSkgJSAyKSA9PT0gMCB8fCBNYXRoLnJvdW5kKChyb3cgLSAxKSAlIDIpID09PSAwXHJcbiAgICAgID8gQ2VsbFR5cGUuRXhwbG9kYWJsZUJsb2NrXHJcbiAgICAgIDogQ2VsbFR5cGUuU29saWRCbG9jaztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0Q2VsbEZpbGxJbWFnZSh0eXBlOiBDZWxsVHlwZSkge1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgQ2VsbFR5cGUuU29saWRCbG9jazpcclxuICAgICAgICByZXR1cm4gc29saWRCbG9jaztcclxuICAgICAgY2FzZSBDZWxsVHlwZS5FeHBsb2RhYmxlQmxvY2s6XHJcbiAgICAgICAgcmV0dXJuIGV4cGxvZGFibGVCbG9jaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gZ3Jhc3NCbG9jaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcHJlcGFyZUZpZWxkKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudENvbHVtbnM7IGkrKykge1xyXG4gICAgICB0aGlzLnBvc2l0aW9uc1tpXSA/Pz0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdW50Um93czsgaisrKSB7XHJcbiAgICAgICAgaWYgKGkgPT09IDAgfHwgaSA9PT0gY291bnRDb2x1bW5zIC0gMSB8fCBqID09PSAwIHx8IGogPT09IGNvdW50Um93cyAtIDEpIHtcclxuICAgICAgICAgIHRoaXMucG9zaXRpb25zW2ldW2pdID0geyB0eXBlOiBDZWxsVHlwZS5Tb2xpZEJsb2NrIH07XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbGxUeXBlID0gdGhpcy5nZXRDZWxsVHlwZShpLCBqKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uc1tpXVtqXSA9IHsgdHlwZTogY2VsbFR5cGUgfTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBLZXlDb2RlLCBQbGF5ZXJDb250cm9sLCBQb3NpdGlvbiB9IGZyb20gJy4vY29tbW9uL3R5cGVzJztcclxuaW1wb3J0IHsgUGxheWVycyB9IGZyb20gJy4vUGxheWVycyc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyIHtcclxuICBwcml2YXRlIGlkOiBudW1iZXI7XHJcbiAgcHJpdmF0ZSBwb3M6IFBvc2l0aW9uO1xyXG4gIHByaXZhdGUgcGxheWVyczogUGxheWVycztcclxuICBwcml2YXRlIGNvbnRyb2w6IFBsYXllckNvbnRyb2w7XHJcbiAgcHJpdmF0ZSBpbWFnZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwbGF5ZXJzOiBQbGF5ZXJzKSB7XHJcbiAgICBjb25zdCB7IGlkLCBwb3MsIGNvbnRyb2wsIGltYWdlIH0gPSBwbGF5ZXJzLmFkZFBsYXllcigpO1xyXG4gICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgdGhpcy5wb3MgPSBwb3M7XHJcbiAgICB0aGlzLnBsYXllcnMgPSBwbGF5ZXJzO1xyXG4gICAgdGhpcy5jb250cm9sID0gY29udHJvbDtcclxuICAgIHRoaXMuaW1hZ2UgPSBpbWFnZTtcclxuXHJcbiAgICAvLyB0byBkbyAtINCy0YvQvdC10YHRgtC4INCyIHBsYXllcnNcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5vbktleURvd24pO1xyXG4gIH1cclxuXHJcbiAgZHJhdyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgY29uc3QgY2VsbFNpemUgPSB0aGlzLnBsYXllcnMuZ2V0Q2VsbFNpemUoKTtcclxuICAgIGNvbnN0IHBsYXllclNpemUgPSBjZWxsU2l6ZSAqIDAuNztcclxuICAgIGNvbnN0IHggPSBjZWxsU2l6ZSAqIHRoaXMucG9zWzBdICsgY2VsbFNpemUgLyAyO1xyXG4gICAgY29uc3QgeSA9IGNlbGxTaXplICogdGhpcy5wb3NbMV0gKyBjZWxsU2l6ZSAvIDI7XHJcblxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuaW1hZ2U7XHJcbiAgICBjdHguYXJjKHgsIHksIHBsYXllclNpemUgLyAyLCAwLCBNYXRoLlBJICogMik7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0SWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pZDtcclxuICB9XHJcblxyXG4gIGdldFBsYXllclBvcygpIHtcclxuICAgIHJldHVybiB0aGlzLnBvcztcclxuICB9XHJcblxyXG4gIGdldEZsYW1lUG9zKCk6IFBvc2l0aW9uW10ge1xyXG4gICAgY29uc3QgW2NvbHVtbiwgcm93XSA9IHRoaXMucG9zO1xyXG4gICAgY29uc3QgaG9yOiBQb3NpdGlvbltdID0gW1xyXG4gICAgICBbY29sdW1uICsgMSwgcm93XSxcclxuICAgICAgW2NvbHVtbiAtIDEsIHJvd11cclxuICAgIF07XHJcbiAgICBjb25zdCB2ZXJ0OiBQb3NpdGlvbltdID0gW1xyXG4gICAgICBbY29sdW1uLCByb3cgKyAxXSxcclxuICAgICAgW2NvbHVtbiwgcm93IC0gMV1cclxuICAgIF07XHJcblxyXG4gICAgcmV0dXJuIFsuLi5ob3IsIC4uLnZlcnRdO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlTGlzdGVuZXIoKSB7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlEb3duKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25LZXlEb3duID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHsgdXAsIHJpZ2h0LCBkb3duLCBsZWZ0LCBwdXRCb21iIH0gPSB0aGlzLmNvbnRyb2w7XHJcbiAgICBzd2l0Y2ggKGUuY29kZSkge1xyXG4gICAgICBjYXNlIHB1dEJvbWI6XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzLnBsYXllclB1dEJvbWIodGhpcyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgdXA6XHJcbiAgICAgIGNhc2UgcmlnaHQ6XHJcbiAgICAgIGNhc2UgZG93bjpcclxuICAgICAgY2FzZSBsZWZ0OlxyXG4gICAgICAgIHRoaXMubW92ZVRvKGUuY29kZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBtb3ZlVG8oY29kZTogS2V5Q29kZSkge1xyXG4gICAgY29uc3QgbmV3UG9zOiBQb3NpdGlvbiA9IHRoaXMucG9zLnNsaWNlKCkgYXMgUG9zaXRpb247XHJcbiAgICBjb25zdCB7IHVwLCByaWdodCwgZG93biwgbGVmdCB9ID0gdGhpcy5jb250cm9sO1xyXG5cclxuICAgIHN3aXRjaCAoY29kZSkge1xyXG4gICAgICBjYXNlIHJpZ2h0OlxyXG4gICAgICAgIG5ld1Bvc1swXSArPSAxO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGxlZnQ6XHJcbiAgICAgICAgbmV3UG9zWzBdIC09IDE7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgZG93bjpcclxuICAgICAgICBuZXdQb3NbMV0gKz0gMTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSB1cDpcclxuICAgICAgICBuZXdQb3NbMV0gLT0gMTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMucGxheWVycy5wbGF5ZXJNb3ZlVG8obmV3UG9zKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wb3MgPSBuZXdQb3M7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGlzRXF1YWxQb3MgfSBmcm9tICcuL2NvbW1vbi9jb21tb24nO1xyXG5pbXBvcnQgeyBQbGF5ZXJDb250cm9sLCBQb3NpdGlvbiB9IGZyb20gJy4vY29tbW9uL3R5cGVzJztcclxuXHJcbmltcG9ydCB7IEJvbWIgfSBmcm9tICcuL0JvbWInO1xyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gJy4vRmllbGQnO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tICcuL1BsYXllcic7XHJcbmltcG9ydCB7IHBsYXllcnNJbml0IH0gZnJvbSAnLi9zZXR0aW5ncyc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVycyB7XHJcbiAgcHJpdmF0ZSBmaWVsZDogRmllbGQ7XHJcbiAgcHJpdmF0ZSBwbGF5ZXJzOiBQbGF5ZXJbXSA9IFtdO1xyXG4gIHByaXZhdGUgYm9tYnM6IHsgW3BsYXllcklkOiBudW1iZXJdOiBCb21iW10gfSA9IHt9O1xyXG5cclxuICBjb25zdHJ1Y3RvcihmaWVsZDogRmllbGQpIHtcclxuICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllcnNJbml0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIodGhpcyk7XHJcbiAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkcmF3KCkge1xyXG4gICAgY29uc3QgY3R4ID0gdGhpcy5maWVsZC5nZXRDYW52YXMoKS5nZXRDb250ZXh0KCkhO1xyXG4gICAgY29uc3QgYm9tYnMgPSBPYmplY3QudmFsdWVzKHRoaXMuYm9tYnMpLmZsYXQoKTtcclxuXHJcbiAgICBib21icy5mb3JFYWNoKGJvbWIgPT4gYm9tYi5kcmF3KGN0eCkpO1xyXG4gICAgdGhpcy5wbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHBsYXllci5kcmF3KGN0eCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q2VsbFNpemUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmZpZWxkLmdldENlbGxTaXplKCk7XHJcbiAgfVxyXG5cclxuICBhZGRQbGF5ZXIoKTogeyBpZDogbnVtYmVyOyBwb3M6IFBvc2l0aW9uOyBjb250cm9sOiBQbGF5ZXJDb250cm9sOyBpbWFnZTogc3RyaW5nIH0ge1xyXG4gICAgY29uc3QgaWQgPSB0aGlzLnBsYXllcnMubGVuZ3RoO1xyXG4gICAgY29uc3QgeyBwb3MsIGNvbnRyb2wsIGltYWdlIH0gPSBwbGF5ZXJzSW5pdFtpZF07XHJcbiAgICByZXR1cm4geyBwb3MsIGlkLCBjb250cm9sLCBpbWFnZSB9O1xyXG4gIH1cclxuXHJcbiAgcGxheWVyTW92ZVRvKG5ld1BvczogUG9zaXRpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmZpZWxkLmlzQ2VsbEVtcHR5KG5ld1Bvcyk7XHJcbiAgfVxyXG5cclxuICBwbGF5ZXJQdXRCb21iKHBsYXllcjogUGxheWVyKSB7XHJcbiAgICBjb25zdCBwbGF5ZXJJZCA9IHBsYXllci5nZXRJZCgpO1xyXG4gICAgdGhpcy5ib21ic1twbGF5ZXJJZF0gPz89IFtdO1xyXG5cclxuICAgIGlmICh0aGlzLmJvbWJzW3BsYXllcklkXS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwb3MgPSBwbGF5ZXIuZ2V0UGxheWVyUG9zKCk7XHJcbiAgICBjb25zdCBmbGFtZVBvcyA9IHBsYXllci5nZXRGbGFtZVBvcygpLmZpbHRlcihwb3MgPT4gdGhpcy5maWVsZC5pc0NlbGxEZXN0cm95KHBvcykpO1xyXG4gICAgY29uc3QgYm9tYiA9IG5ldyBCb21iKHBvcywgZmxhbWVQb3MsIHRoaXMuZ2V0Q2VsbFNpemUoKSwgKGJvbWIsIGlzRGVsZXRlKSA9PiB0aGlzLmRldG9uYXRpb25Cb21iKHBsYXllcklkLCBib21iLCBpc0RlbGV0ZSkpO1xyXG5cclxuICAgIHRoaXMuYm9tYnNbcGxheWVySWRdLnB1c2goYm9tYik7XHJcblxyXG4gICAgdGhpcy5maWVsZC5wdXRCb21iKHBvcyk7XHJcbiAgfVxyXG5cclxuICBkZXRvbmF0aW9uQm9tYihwbGF5ZXJJZDogbnVtYmVyLCBib21iOiBCb21iLCBpc0RlbGV0ZUJvbWI/OiBib29sZWFuKSB7XHJcbiAgICBjb25zdCBmbGFtZVBvcyA9IGJvbWIuZ2V0RmxhbWVQb3MoKTtcclxuXHJcbiAgICBpc0RlbGV0ZUJvbWIgJiYgdGhpcy5kZWxldGVCb21iKHBsYXllcklkLCBib21iKTtcclxuICAgIHRoaXMuZGVsZXRlRGllZFBsYXllcnMoZmxhbWVQb3MpO1xyXG4gICAgdGhpcy5maWVsZC5kZXRvbmF0aW9uQm9tYihmbGFtZVBvcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRlbGV0ZURpZWRQbGF5ZXJzKGZsYW1lUG9zOiBQb3NpdGlvbltdKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLnBsYXllcnNbaV07XHJcbiAgICAgIGNvbnN0IGlzRGllID0gZmxhbWVQb3MuZmluZChwb3MgPT4gaXNFcXVhbFBvcyhwbGF5ZXIuZ2V0UGxheWVyUG9zKCksIHBvcykpO1xyXG5cclxuICAgICAgaWYgKCFpc0RpZSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBwbGF5ZXIucmVtb3ZlTGlzdGVuZXIoKTtcclxuICAgICAgdGhpcy5wbGF5ZXJzLnNwbGljZShwbGF5ZXIuZ2V0SWQoKSwgMSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRlbGV0ZUJvbWIocGxheWVySWQ6IG51bWJlciwgYm9tYjogQm9tYikge1xyXG4gICAgdGhpcy5ib21ic1twbGF5ZXJJZF0gPSB0aGlzLmJvbWJzW3BsYXllcklkXS5maWx0ZXIoYiA9PiAhaXNFcXVhbFBvcyhiLmdldFBvc2l0aW9uKCksIGJvbWIuZ2V0UG9zaXRpb24oKSkpO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZnVuY3Rpb24gaXNFcXVhbFBvcyhwb3M6IFtudW1iZXIsIG51bWJlcl0sIHBvczI6IFtudW1iZXIsIG51bWJlcl0pIHtcclxuICBjb25zdCBbY29sdW1uLCByb3ddID0gcG9zO1xyXG4gIGNvbnN0IFtjb2x1bW4yLCByb3cyXSA9IHBvczI7XHJcblxyXG4gIHJldHVybiBjb2x1bW4gPT09IGNvbHVtbjIgJiYgcm93ID09PSByb3cyO1xyXG59IiwiZXhwb3J0IGNvbnN0IHNvbGlkQmxvY2sgPSBuZXcgSW1hZ2UoKTtcclxuc29saWRCbG9jay5zcmMgPSAnaW1hZ2VzL3NvbGlkQmxvY2sucG5nJztcclxuXHJcbmV4cG9ydCBjb25zdCBncmFzc0Jsb2NrID0gbmV3IEltYWdlKCk7XHJcbmdyYXNzQmxvY2suc3JjID0gJ2ltYWdlcy9ncmFzc0Jsb2NrLnBuZyc7XHJcblxyXG5leHBvcnQgY29uc3QgZXhwbG9kYWJsZUJsb2NrID0gbmV3IEltYWdlKCk7XHJcbmV4cGxvZGFibGVCbG9jay5zcmMgPSAnaW1hZ2VzL2V4cGxvZGFibGVCbG9jay5wbmcnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGltYWdlQm9tYjEgPSBuZXcgSW1hZ2UoKTtcclxuaW1hZ2VCb21iMS5zcmMgPSAnaW1hZ2VzL2JvbWIxLnBuZyc7XHJcblxyXG5leHBvcnQgY29uc3QgaW1hZ2VCb21iMiA9IG5ldyBJbWFnZSgpO1xyXG5pbWFnZUJvbWIyLnNyYyA9ICdpbWFnZXMvYm9tYjIucG5nJztcclxuXHJcbmV4cG9ydCBjb25zdCBmbGFtZSA9IG5ldyBJbWFnZSgpO1xyXG5mbGFtZS5zcmMgPSAnaW1hZ2VzL2ZsYW1lLnBuZyc7IiwiaW1wb3J0IHsgUGxheWVySW5pdCB9IGZyb20gJy4vY29tbW9uL3R5cGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBjb3VudFJvd3MgPSAxNTtcclxuZXhwb3J0IGNvbnN0IGNvdW50Q29sdW1ucyA9IDE5O1xyXG5cclxuZXhwb3J0IGNvbnN0IHBsYXllcnNJbml0OiBQbGF5ZXJJbml0W10gPSBbXHJcbiAge1xyXG4gICAgY29udHJvbDoge1xyXG4gICAgICB1cDogJ0Fycm93VXAnLFxyXG4gICAgICByaWdodDogJ0Fycm93UmlnaHQnLFxyXG4gICAgICBkb3duOiAnQXJyb3dEb3duJyxcclxuICAgICAgbGVmdDogJ0Fycm93TGVmdCcsXHJcbiAgICAgIHB1dEJvbWI6ICdTcGFjZSdcclxuICAgIH0sXHJcbiAgICBpbWFnZTogJ3llbGxvdycsXHJcbiAgICBwb3M6IFsxLCAxXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgY29udHJvbDoge1xyXG4gICAgICB1cDogJ0tleVcnLFxyXG4gICAgICByaWdodDogJ0tleUQnLFxyXG4gICAgICBkb3duOiAnS2V5UycsXHJcbiAgICAgIGxlZnQ6ICdLZXlBJyxcclxuICAgICAgcHV0Qm9tYjogJ0tleUUnXHJcbiAgICB9LFxyXG4gICAgaW1hZ2U6ICdyZWQnLFxyXG4gICAgcG9zOiBbY291bnRDb2x1bW5zIC0gMiwgY291bnRSb3dzIC0gMl1cclxuICB9XHJcbl07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vc3R5bGUuY3NzJztcblxuaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSAnLi9DYW52YXMnO1xuaW1wb3J0IHsgRmllbGQgfSBmcm9tICcuL0ZpZWxkJztcblxuY29uc3QgY2FudmFzID0gbmV3IENhbnZhcygpO1xuY29uc3QgZmllbGQgPSBuZXcgRmllbGQoY2FudmFzKTtcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCk7XG5cbihmdW5jdGlvbiBsb29wKCkge1xuICBjYW52YXMuY2xlYXIoKTtcblxuICBjb25zdCB7IGxlZnQsIHRvcCB9ID0gZmllbGQuZ2V0T2Zmc2V0cygpO1xuICBjdHg/LnNhdmUoKTtcbiAgY3R4Py50cmFuc2xhdGUobGVmdCwgdG9wKTtcbiAgZmllbGQuZHJhdygpO1xuICBjdHg/LnJlc3RvcmUoKTtcblxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG59KSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9