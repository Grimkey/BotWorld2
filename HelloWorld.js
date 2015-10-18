var http = require('http');
var fs = require('fs');
function Main() {
    var builder = new CreatureBuilder();
    var battle = new Battle();
    for (var x in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        console.log("" + 1 / (Math.pow(10, (-(x * x)))));
    }
    var creatures = new Array();
    fs.readFile('character.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Data: " + data);
        var creatureData = JSON.parse(data);
        creatures = builder.new(creatureData);
        battle.fight(creatures[0], creatures[1]);
    });
}
var Battle = (function () {
    function Battle() {
    }
    Battle.prototype.fight = function (c1, c2) {
        var winner = "";
        while (winner === "") {
            var attack_c1 = this.calcDamage(c1.attack);
            var attack_c2 = this.calcDamage(c2.attack);
            c1.damage(attack_c2);
            c2.damage(attack_c1);
            var c1_message = c1.name + " hit " + c2.name + " for " + attack_c1 + ". " + c2.name + " has " + c2.hitpoints + " hitpoints left.";
            var c2_message = c2.name + " hit " + c1.name + " for " + attack_c2 + ". " + c1.name + " has " + c1.hitpoints + " hitpoints left. ";
            console.log(c1_message);
            console.log(c2_message);
            if (c1.hitpoints <= 0) {
                winner = "" + c2.name;
            }
            if (c2.hitpoints <= 0) {
                if (winner != "") {
                    winner = "tie";
                }
                else {
                    winner = "" + c1.name;
                }
            }
        }
        console.log("The winner is " + winner);
    };
    Battle.prototype.calcDamage = function (max) {
        var damage = max * Math.random();
        return Math.round(damage);
    };
    return Battle;
})();
var CreatureBuilder = (function () {
    function CreatureBuilder() {
    }
    CreatureBuilder.prototype.new = function (data) {
        var characterList = new Array();
        data.characters.forEach(function (c) {
            characterList.push(new Creature(c.name, c.hitpoints, c.attack));
        });
        return characterList;
    };
    return CreatureBuilder;
})();
var Creature = (function () {
    function Creature(name, hitpoint, attack) {
        this._name = name;
        this._hitpoints = hitpoint || 100;
        this._attack = attack || 12;
    }
    Object.defineProperty(Creature.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Creature.prototype, "hitpoints", {
        get: function () {
            return this._hitpoints;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Creature.prototype, "attack", {
        get: function () {
            return this._attack;
        },
        enumerable: true,
        configurable: true
    });
    Creature.prototype.damage = function (point) {
        this._hitpoints -= point;
    };
    return Creature;
})();
Main();
