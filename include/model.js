
class Pile extends Stack {
  constructor(id=-1) {
    super();
    this.id  = id;
    this.div = document.createElement('div');
    this.div.id = "pile"+id;
    this.div.className = 'pile';
    this.div.style.padding = "4px";
    this.div.style.backgroundColor = 'lightgreen';
    this.div.style.border = '1px solid #333';
    this.div.style.width = '64px';
    this.div.style.height = '93px';
    this.div.style.borderRadius = '4px';
    this.div.style.display = 'inline-block';
    this.div.style.position = 'absolute';
    this.div.style.marginTop = '20px';
    this.div.style.marginLeft = '4px';
    this.div.innerHTML=""; 
    this.coords  = {x:0, y:0};
    this.arrayed = false;
  }

  add(card) {
    super.add(card);
    if (this.stacked) {
      card.setPosition(this.coords.x, this.coords.y);
    } else {
      var x = this.coords.x;
      var y = this.coords.y+((this.size()-1)*20);
      card.setPosition(x, y);
    }
  }

  setId(id) {
    this.id = id;
  }

  setAttribute(name, value) {
    this.div.setAttribute(name, value);
  }

  setArrayed(arrayed) {
    this.arrayed = arrayed;
  }

  setContent(val) {
    this.div.innerHTML=""+val; 
  }

  setTop(val) {
    this.div.style.marginTop = val+"px";
  }

  setBottom(val) {
    this.div.style.marginBottom = val+"px";
  }

  setLeft(val) {
    this.div.style.marginLeft = val+"px";
  }
      
  setRight(val) {
    this.div.style.marginRight = val+"px";
  }
      
  where() {
    var rect = this.div.getBoundingClientRect();
    this.coords.x = Math.trunc(rect.left);
    this.coords.y = Math.trunc(rect.top);
    return this.coords;
  }
}

class Hand {
  constructor() {
    this.hand = [];
  }

  size() {
    return this.hand.length;
  }

  contains(card) {
    var num  = 0;
    var suit = (card instanceof Card != true) ? card : null;
    if (suit != null) {
      // find total by suit
      for (let i = 0; i < this.items.length; i++) {
        var c = this.items[i];
        if (c.suit == suit) {
          num++;
        }
      }
    } else if (card instanceof Card == true) {
      // find total by card
      for (let i = 0; i < this.items.length; i++) {
        if (card.matches(this.items[i])) {
          num++;
        }
      }
    }
    return num;
  }
}

class Deck extends Stack {
  constructor(type=Game.REGULAR) {
    super();
    this.id = 0;
    if (type == Game.REGULAR) {
      for (let i = 0; i < Regular.ranks.length; i++) {
        for (let j = 0; j < Regular.suits.length; j++) {
          this.add(new Card(Regular.ranks[i], Regular.suits[j], this.id++));
        }
      }
    } else {
      this.size  = (type==Game.DOUBLE) ? 2 : 1;
      this.count = (type==Game.DOUBLE) ? 5 : 6;
      for (let x = 0; x < (this.size*2); x++) {
        for (let i = 0; i < this.count; i++) {
          for (let j = 0; j < Pinochle.suits.length; j++) {
            this.add(new Card(Pinochle.ranks[i], Pinochle.suits[j], this.id++));
          }
        }
      } 
    }
  }

  contains(card) {
    var num  = 0;
    var suit = (card instanceof Card != true) ? card : null;
    if (suit != null) {
      // find total by suit
      for (let i = 0; i < this.items.length; i++) {
        var c = this.items[i];
        if (c.suit == suit) {
          num++;
        }
      } 
    } else if (card instanceof Card == true) {
      // find total by card
      for (let i = 0; i < this.items.length; i++) {
        if (card.matches(this.items[i])) {  
          num++;
        }
      } 
    } 
    return num;    
  }

  shuffle() {
    var x = 0;
    while (x < 5) { 
      var shuffled = new Stack();
      while (this.size() > 0) {
        shuffled.add(this.remove(Math.floor(Math.random() * this.size())));
      }

      while (shuffled.size() > 0) {
        this.add(shuffled.remove(0));
      }
      x++;
    } // it's not necessary to shuffle five times; it's just fun
  }
  
  toString() {
    var res = null;
    for (let i = 0; i < this.items.length; i++) {
      res = (res == null) ? format("%s", this.items[i]) : format("%s %s", res, this.items[i]);
    }
    return res;
  }
}

class Model {
  constructor() {
    this.piles = [];
  }
}

class SolitaireModel extends Model {
  constructor() {
    super();
    this.tmar = 20;
    this.lmar = 20;
    this.iterator = this.pileIterator();
  }

  *pileIterator() {
    for (let i = 0; i < this.piles.length; i++) {
      yield this.piles[i];
    }
    this.iterator = this.pileIterator();
    return;
  }

  flip(name) {
    let card = this.piles[0].remove(this.piles[0].size()-1);
    card.setFaceUp();
    card.setPile(1);
    this.add(1, card);
  }

  add(num, card) {
    if (num < 0 || num > this.piles.length) return;
    card.setPile(num);
    this.piles[num].add(card);
  }

  setArrayedPiles(arr) {
    for (let i = 0; i < arr.length; i++) {
      this.piles[arr[i]].setArrayed(true);
    }
  }

  get(num) {
    return this.piles[num].peek();
  }

  show(num) {
    let s = "pile:"+num+" ";
    for (const card of this.piles[num].iterator) {
      s = s+card.toString()+" ";
    }
    console.log(s);
  }

  piles() {
    return piles.length;
  }

  getPile(num) {
    return this.piles[num];
  }

  getPiles() {
    return this.piles;
  }

  size(num=null) {
    if (num == null) {
      let siz = 0;
      for (let i = 0; i < this.piles.length; i++) {
        siz += this.piles[i].size();
      } 
      return siz;
    }
    return this.piles[num].size();
  }

  whence(name) {
    for (let i = 0; i < this.piles.length; i++) {
      for (let j = 0; j < this.piles[i].size(); j++) {
        var card = this.piles[i].get(j);
        if (card.toString() === name) {
          return i;
        }
      }
    }
    return -1;
  }
  
  reset() {
    this.iterator = this.pileIterator();
  }

  restack(src, dst) {
    if (src == dst) return; //WTF??
    while(this.piles[src].size() > 0) {
      var tmp = this.piles[src].pop();
      tmp.setFaceDown();
      this.add(dst, tmp); //XXX: the pile number is set in add(n, card)
    }
  }
}

class CanfieldModel extends SolitaireModel {
  constructor() {
    super();
    this.createPiles();
    this.base = "";
  }

  setBase(card) {
    let  str  = card.toString();
    this.base = str.replace(/.$/, "");
  }

  move(name, num) {
    console.log("move('"+name+"', "+num+")");
    for (let i = 0; i < this.piles.length; i++) {
      var j = 0;
      for (const card of this.piles[i].iterator) {
        if (card.toString() === name) {
          var okay = false;
          if (num >= 2 && num <= 5) {
            if (this.size(num) == 0 && name.startsWith(this.base)) {
              okay = true;
            } else {
              let crd = this.piles[num].peek();
              if (crd != null && card != null) {
                //okay = (crd.suit == card.suit && crd.rank+1 == card.rank) ? true : false;
                if (crd.suit == card.suit && crd.rank+1 == card.rank) {
                  okay = true;
                } else if (crd.suit == card.suit && crd.rank == Regular.KING && card.rank == Regular.ACE) {
                  okay = true;
                }
              }
            }
          }
          if (num > 6) {
            if (this.size(num) == 0) {
              okay = true;
            } else {
              let tmp = new Card(name);
              let crd = this.piles[num].peek();
              okay = (tmp.rank == crd.rank-1 && tmp.color != crd.color) ? true : false;
              if (crd.rank == Regular.ACE && tmp.rank == Regular.KING) {
                okay = (crd.color != tmp.color) ? true : false;
              }
            }
          }
          if (okay) {
            var tmp = this.piles[i].remove(j);
            tmp.setFaceUp();
            tmp.setPile(num);
            this.add(num, tmp);
            if (i > 5) {
              var crd = this.piles[i].peek();
              if (crd != null) crd.setFaceUp();
            }
          }
        }
        j++;
      }
    }
    return okay;
  }

  createPiles() {
    for (let i = 0; i < 11; i++) {
      var pile = new Pile(i);
      switch(i) {
        case 0:
          pile.setTop(this.tmar);
          pile.setLeft(this.lmar);
          break;
        case 2:
          this.lmar += 212;
          pile.setTop(this.tmar);
          pile.setLeft(this.lmar);
          break;
        case  6:
          this.tmar += 170;
          this.lmar = 126;
          pile.setTop(this.tmar);
          pile.setLeft(this.lmar);
          break;
        case  7:
          this.lmar += 212;
          pile.setTop(this.tmar);
          pile.setLeft(this.lmar);
          break;
        default:
          this.lmar += 106;
          pile.setTop(this.tmar);
          pile.setLeft(this.lmar);
          break;
      }
      this.piles.push(pile);
    }
  }

  stacks() {
    var stacks = {
      "pile7":  [],
      "pile8":  [],
      "pile9":  [],
      "pile10": [],
    }
    for (let i = 7; i < this.piles.length; i++) {
      var key = "pile"+i;
      for (const card of this.piles[i].iterator) {
        if (card.isFaceUp()) {
          stacks[key].push(card.toString());
        }
      }
    }
    return stacks;
  }
}

class KlondikeModel extends SolitaireModel {
  constructor() {
    super();
    this.createPiles();
  }

  move(name, num) {
    console.log("move("+name+", "+num+")");
    for (let i = 0; i < this.piles.length; i++) {
      var j = 0;
      for (const card of this.piles[i].iterator) {
        if (card.toString() === name) {
          var okay = false;
          if (num >= 2 && num <= 5) {
            if (this.size(num) == 0 && name.startsWith("A")) {
              okay = true;
            } else {
              let crd = this.piles[num].peek();
              if (crd != null && card != null) {
                okay = (crd.suit == card.suit && crd.rank+1 == card.rank) ? true : false;
              }
            }
          }
          if (num >= 6) {
            let tmp = new Card(name);
            let crd = this.piles[num].peek();
            if (crd == null && name.startsWith("K")) {
              okay = true;
            } else if (crd == null) {
              // A non-King was placed on an empty square. Not okay.
              okay = false;
            } else {
              okay = (tmp.rank == crd.rank-1 && tmp.color != crd.color) ? true : false;
            }
          }
          if (okay) {
            var tmp = this.piles[i].remove(j);
            tmp.setFaceUp();
            tmp.setPile(num);
            this.add(num, tmp);
            if (i > 5) {
              var crd = this.piles[i].peek();
              if (crd != null) crd.setFaceUp();
            }
          } 
        }
        j++;
      }
    }
  }

  /*restack(src, dst) {
    if (src == dst) return; //WTF??
    while(this.piles[src].size() > 0) {
      var tmp = this.piles[src].pop();
      tmp.setFaceDown();
      this.add(dst, tmp); //XXX: the pile number is set in add(n, card)
    }
  }*/

  createPiles() {
    for (let i = 0; i < 13; i++) {
      var pile = new Pile(i); 
      switch(i) {
        case 0:
          pile.setTop(this.tmar);
          pile.setLeft(this.lmar);
          break;
        case 2:
          this.lmar += 212;
          pile.setTop(this.tmar);
          pile.setLeft(this.lmar);
          break;
        case  6:
          this.tmar = 170;
          this.lmar = 20;
          pile.setTop(this.tmar);
          pile.setLeft(this.lmar);
          break
        default:
          this.lmar += 106;
          pile.setTop(this.tmar);
          pile.setLeft(this.lmar);
          break;
      }
      this.piles.push(pile);
    }
  }

  stacks() {
    var stacks = {
      "pile6":  [],
      "pile7":  [],
      "pile8":  [],
      "pile9":  [],
      "pile10": [],
      "pile11": [],
      "pile12": [],
    }
    for (let i = 6; i < this.piles.length; i++) {
      var key = "pile"+i;
      for (const card of this.piles[i].iterator) {
        if (card.isFaceUp()) {
          stacks[key].push(card.toString());
        }
      }
    }
    return stacks;
  }

  /******************************************************
  size(num=null) {
    if (num == null) {
      let siz = 0;
      for (let i = 0; i < this.piles.length; i++) {
        siz += this.piles[i].size();
      } 
      return siz;
    }
    return this.piles[num].size();
  }

  whence(name) {
    for (let i = 0; i < this.piles.length; i++) {
      for (let j = 0; j < this.piles[i].size(); j++) {
        var card = this.piles[i].get(j);
        if (card.toString() === name) {
          return i;
        }
      }
    }
    return -1;
  }
  ******************************************************/
}
