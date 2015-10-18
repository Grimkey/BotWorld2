declare function require(name:string);
var http = require('http');
var fs = require('fs');

function Main()
{
  var builder = new CreatureBuilder();
  var battle = new Battle();

  var creatures = new Array<Creature>();
  
  fs.readFile('character.json', 'utf8', (err, data) => {
    if (err) { console.error(err); return;}
    console.log(`Data: ${data}`);
    var creatureData = JSON.parse(data);
    
    creatures = builder.new(creatureData);
    
    battle.fight(creatures[0], creatures[1]);  
  });
}

class Battle {
  curve = [1.05,1.075,1.1,1.125,1.15,1.175,1.2,1.225,1.25,1.275];
  
  fight(c1 : Creature, c2 : Creature)
  {
    var winner = "";
    
    while(winner === "")
    {
      var attack_c1 = this.calcDamage(c1.attack);
      var attack_c2 = this.calcDamage(c2.attack);
      
      c1.damage(attack_c2);
      c2.damage(attack_c1);
      
      var c1_message = `${c1.name} hit ${c2.name} for ${attack_c1}. ${c2.name} has ${c2.hitpoints} hitpoints left.`
      var c2_message = `${c2.name} hit ${c1.name} for ${attack_c2}. ${c1.name} has ${c1.hitpoints} hitpoints left. `
      console.log(c1_message);
      console.log(c2_message);
      
      if (c1.hitpoints <= 0)
      {
        winner = `${c2.name}`;
      }
      
      if (c2.hitpoints <= 0)
      {
        if (winner != "") { winner = "tie"; }
        else { winner = `${c1.name}`; }
      }
    }
    
    console.log(`The winner is ${winner}`);
  }
  
  calcDamage(max : number) : number
  {
    var damage = max * Math.random();
    
    return Math.round(damage);
  }
}

class CreatureBuilder {
  new(data : any) : Array<Creature>
  {
    var characterList = new Array<Creature>();
    
    data.characters.forEach( c => {
       characterList.push(new Creature(c.name, c.hitpoints, c.attack));
    });
    
    return characterList;
  }
}

class Monster {
  name : string;
  
  power : number;
  speed : number;
  stamina : number;
  mental: number;
}

class Creature {
  private _hitpoints : number;
  private _attack : number;
  private _name : string;
  
  constructor(name : string, hitpoint? : number, attack? : number)
  {
    this._name = name;
    this._hitpoints = hitpoint || 100;
    this._attack = attack || 12;  
  }
  
  get name() : string {
    return this._name;
  }
  
  get hitpoints() : number {
    return this._hitpoints;
  }
  
  get attack() : number {
    return this._attack;
  }
  
  damage(point : number)
  {
    this._hitpoints -= point;
  } 
  
}

Main();