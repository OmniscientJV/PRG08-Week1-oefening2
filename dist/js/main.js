var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameObject = (function () {
    function GameObject(x, y, width, height, texture, parent, instanceTag) {
        if (parent === void 0) { parent = document.getElementById("container"); }
        if (instanceTag === void 0) { instanceTag = (GameObject._count += 1).toString(); }
        this.size = { width: 0, height: 0 };
        this.position = new Vector2(x, y);
        this.size = { width: width, height: height };
        this.instanceTag = instanceTag;
        this.div = document.createElement(texture);
        parent.appendChild(this.div);
    }
    GameObject.prototype.setPosition = function (x, y) {
        this.position.x = x;
        this.position.y = y;
    };
    GameObject.prototype.getPosition = function () {
        return this.position;
    };
    GameObject.prototype.setSize = function (width, height) {
        this.size.width = width;
        this.size.height = height;
    };
    GameObject.prototype.getSize = function () {
        return this.size;
    };
    GameObject.prototype.getInstanceTag = function () {
        return this.instanceTag;
    };
    GameObject.prototype.draw = function () {
        this.div.style.transform = "translate(" + this.position.x + "px, " + this.position.y + "px)";
    };
    GameObject._count = 0;
    return GameObject;
}());
var Wheel = (function (_super) {
    __extends(Wheel, _super);
    function Wheel(x, y, parent) {
        _super.call(this, x, y, 22, 22, "wheel", parent);
    }
    Wheel.prototype.initialize = function () { };
    Wheel.prototype.update = function () { };
    Wheel.prototype.hit = function (hitByGo) { };
    return Wheel;
}(GameObject));
var Car = (function (_super) {
    __extends(Car, _super);
    function Car(x, y, speed, instanceTag) {
        var _this = this;
        _super.call(this, x, y, 145, 45, "car", document.getElementById("container"), instanceTag);
        this.speed = speed;
        this.initialSpeed = speed;
        this.wheels = [new Wheel(15, 30, this.div), new Wheel(105, 30, this.div)];
        Game.instance().addObject(this.wheels[0], this.wheels[1]);
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
    }
    Car.prototype.initialize = function () {
        this.rockRef = Game.instance().findObject("rock");
    };
    Car.prototype.onKeyDown = function (event) {
        switch (event.keyCode) {
            default:
                this.braking = true;
                break;
        }
    };
    Car.prototype.update = function () {
        if (this.braking && this.speed > 0)
            this.speed -= 0.09;
        this.position.x += this.speed;
        if (!Game.instance().hasGameEnded()) {
            if (this.speed <= 0) {
                this.speed = 0;
                var distance = Vector2.distance(this.position, this.rockRef.getPosition()) - this.getSize().width;
                Game.instance().setScore((500 - distance) * this.initialSpeed);
                Game.instance().endGame();
            }
        }
    };
    Car.prototype.hit = function (hitByGo) {
        if (hitByGo.getInstanceTag() == "rock") {
            this.speed = 0;
            this.rockRef.hit(this);
            Game.instance().setScore(0);
            Game.instance().endGame();
        }
    };
    return Car;
}(GameObject));
var Rock = (function (_super) {
    __extends(Rock, _super);
    function Rock(x, y, instanceTag) {
        _super.call(this, x, y, 62, 62, "rock", document.getElementById("container"), instanceTag);
        this.speed = 0;
    }
    Rock.prototype.initialize = function () {
    };
    Rock.prototype.update = function () {
        this.position.y += this.speed;
        if (this.hitByCar && this.position.y < 600)
            this.speed += 0.15;
    };
    Rock.prototype.hit = function (hitByGo) {
        if (hitByGo.getInstanceTag() == "car") {
            this.hitByCar = true;
            this.speed = 1;
            this.position.x += 75;
        }
    };
    return Rock;
}(GameObject));
var Game = (function () {
    function Game() {
        var _this = this;
        this.gameObjects = new Array();
        if (Game._instance) {
            throw new Error("Kan klasse niet instantieren: Game is een singleton.");
        }
        Game._instance = this;
        this.running = true;
        this.addObject(new Car(0, 220, Math.floor(Math.random() * 5) + 2, "car"), new Rock(500, 210, "rock"));
        requestAnimationFrame(function () { return _this.gameLoop(); });
    }
    Game.instance = function () {
        if (!Game._instance)
            Game._instance = new Game();
        return Game._instance;
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        for (var _i = 0, _a = this.gameObjects; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.update();
            for (var _b = 0, _c = this.gameObjects; _b < _c.length; _b++) {
                var otherObj = _c[_b];
                if (otherObj.getInstanceTag() == obj.getInstanceTag())
                    continue;
                if (Util.checkCollision(obj, otherObj)) {
                    obj.hit(otherObj);
                    otherObj.hit(obj);
                }
            }
            obj.draw();
        }
        if (this.running)
            requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.setScore = function (score) {
        this.score = score;
    };
    Game.prototype.getScore = function () {
        return this.score;
    };
    Game.prototype.getObjectCount = function () {
        return this.gameObjects.length;
    };
    Game.prototype.endGame = function () {
        document.getElementById("score").innerHTML = "Score : " + this.score;
        this.gameEnded = true;
    };
    Game.prototype.resumeGame = function () {
        this.gameEnded = false;
    };
    Game.prototype.hasGameEnded = function () {
        return this.gameEnded;
    };
    Game.prototype.addObject = function () {
        var gos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            gos[_i - 0] = arguments[_i];
        }
        if (gos.length > 0) {
            for (var _a = 0, gos_1 = gos; _a < gos_1.length; _a++) {
                var obj = gos_1[_a];
                this.gameObjects.push(obj);
            }
        }
        for (var _b = 0, gos_2 = gos; _b < gos_2.length; _b++) {
            var obj = gos_2[_b];
            obj.initialize();
        }
    };
    Game.prototype.findObject = function (tag) {
        for (var _i = 0, _a = this.gameObjects; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.getInstanceTag() == tag)
                return obj;
        }
    };
    return Game;
}());
window.addEventListener("load", function () {
    new Game();
});
var Vector2 = (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.add = function (v1, v2) {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    };
    Vector2.min = function (v1, v2) {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    };
    Vector2.multiple = function (v1, v2) {
        return new Vector2(v1.x * v2.x, v1.y * v2.y);
    };
    Vector2.divide = function (v1, v2) {
        return new Vector2(v1.x / v2.x, v1.y / v2.y);
    };
    Vector2.distance = function (v1, v2) {
        return Vector2.min(v1, v2).length();
    };
    Vector2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    return Vector2;
}());
var Util = (function () {
    function Util() {
    }
    Util.checkCollision = function (go1, go2) {
        var collided = false;
        var go1Pos = go1.getPosition();
        var go1Size = go1.getSize();
        var go2Pos = go2.getPosition();
        var go2Size = go2.getSize();
        if (go1Pos.x < go2Pos.x + go2Size.width &&
            go1Pos.x + go1Size.width > go2Pos.x &&
            go1Pos.y < go2Pos.y + go2Size.height &&
            go1Size.height + go1Pos.y > go2Pos.y)
            collided = true;
        return collided;
    };
    return Util;
}());
//# sourceMappingURL=main.js.map