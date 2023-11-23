class Card {
  static RED   = 1;
  static BLACK = 2;

  constructor (rank, suit, id=-1) {
    if (typeof rank === "object") {
      this.id   = -1;
      this.rank = rank.rank;
      this.suit = suit.suit;
      // XXX: Id???
    } else if (typeof rank === "string") {
      var r, s;
      try {
        if (rank.length < 2) throw "Malformed card request";
      } catch(err) {
        console.log(format("Input: %s; %s", rank, err));
      }
      if (rank.length == 3) {
        r = "10";
        s = rank.charAt(2);
      } else {
        r = rank.charAt(0);
        s = rank.charAt(1);
      }
      this.rank = Regular.rankFromString(r);
      this.suit = Regular.suitFromString(s);
    } else {
      this.id   = id;
      this.rank = rank;
      this.suit = suit;
    }
    this.counter    = false;
    this.color      = null;
    this.pile       = -1;
    this.y          = 0;
    this.position   = {x:0, y:0};
    this.status     = 0;
    this.base       = "/home/jeff/src/cards-js"
    this.face       = null; // image holder
    this.back       = null; // image holder
    this.faceup     = false;
    this.selected   = false;
    this.melded     = false;
    this.played     = false;
    this.counter    = false;

    this._createCard();
  }

  isa (suit, rank=null) {
    if (rank == null) return (this.suit == suit);
    if (suit >= Pinochle.HEARTS && suit <= Pinochle.SPADES) return (this.suit == suit && this.rank == rank);
    return false;
  }

  getURL() {
    return (this.isFaceUp()) ? this.face : this.back;
  }

  isFaceUp() {
    return this.faceup;
  }

  setFaceUp () {
    this.faceup = true;
  }

  setFaceDown () {
    this.faceup = false;
  }

  isFaceDown () {
    return (this.faceup) ? false : true;
  }

  setPosition (x, y=null) {
    if (typeof x === "object") {
      this.position = x;
    } else if (y != null) {
      this.position.x = x;
      this.position.y = y;
    }
  }

  setPile (num) {
    this.pile = num;
  }

  value () {
    return (1+this.suit)*this.rank;
  }

  select (select) {
    this.selected = select;
  }

  matches (card) {
    if (card instanceof Card != true) return false;

    if ((this.suit == card.suit) && (this.rank == card.rank)) {
      return true;
    } else {
      return false; 
    } 
  }

  toString(full=false) {
    if (full) {
      return format("%s of %s", Regular.rankname(this.rank), Regular.suitname(this.suit));
    } else {
      return format("%s%s", Regular.rank(this.rank), Regular.suit(this.suit));
    }
  }

  _createCard() {
    if (this.rank > Pinochle.QUEEN) {
      // this is an attribute of pinochle
      this.counter = true;
    }
    if (this.suit == Regular.HEARTS || this.suit == Regular.DIAMONDS) {
      this.color = Card.RED;  
    } else {
      this.color = Card.BLACK;
    }
    if (this.face == null) {
      this.face = new URL(
        format("file://%s/include/images/cards/%s%s.png", this.base, Regular.rank(this.rank), Regular.suit(this.suit))
      );
    }
    if (this.back == null) {
      this.back = new URL(format("file://%s/include/images/cards/back.png", this.base));
    }
  }
}

class Game {
  static NORTH   = 0;
  static EAST    = 1;
  static SOUTH   = 2;
  static WEST    = 3;
  static PLAYERS = Object.seal([Game.NORTH, Game.SOUTH, Game.EAST, Game.WEST]);

  static HEARTS     = 0;
  static CLUBS      = 1;
  static DIAMONDS   = 2;
  static SPADES     = 3;

  static REGULAR    = 0; // fifty-two card deck
  static PINOCHLE   = 1; // forty-eight card pinochle deck
  static DOUBLE     = 2; // pinochle double-deck

  static suits = [  
    this.CLUBS, 
    this.SPADES,
    this.HEARTS,
    this.DIAMONDS
  ];

  static suit(suit) {
    switch(suit) {
      case this.CLUBS:
        return "C";
      case this.SPADES:
        return "S";
      case this.HEARTS:
        return "H";
      case this.DIAMONDS:
        return "D";
    }
    return null;
  }

  static suitFromString(suit) {
    switch(suit) {
      case "C":
        return this.CLUBS;
      case "S":
        return this.SPADES;
      case "H":
        return this.HEARTS;
      case "D":
        return this.DIAMONDS;
    }
    return null;
  }

  static suitname(suit) {
    switch(suit) {
      case this.CLUBS:
        return "Clubs";
      case this.SPADES:
        return "Spades";
      case this.HEARTS:
        return "Hearts";
      case this.DIAMONDS:
        return "Diamonds";
    }
    return null;
  }

  /**
   * Returns the player's seated position as String
   * <p>
   * @param  int    Pinochle.POSITION
   * @return String Name of the position
   */
  static position(position) {
    switch (position) {
      case NORTH:
        return "north";
      case EAST:
        return "east";
      case SOUTH:
        return "south";
      case WEST:
        return "west";
    }
    return null;
  }

  /**
   * Programmer's convenience This method helps create
   * a string interpretation of a hand that we can store
   * inside our memory banks....
   */
  static store (rank, suit) {
    switch(rank) {
      case ACE:
        return "A";
      case TEN:
        return "T";
      case KING:
        return "K";
      case QUEEN: 
        if (suit == Pinochle.SPADES) 
          return "S";
        else 
          return "Q";
      case JACK:
        if (suit == Pinochle.DIAMONDS) 
          return "D";
        else 
          return "J";
      case NINE:
        return "9";
    }
    return null;
  }
}

class Pinochle extends Game {
  static DEAL       = 0;  // Deal the cards
  static BID        = 1;  // Bid on the hands
  static PASS       = 2;  // Winners pass cards
  static MELD       = 3;  // Select cards for meld
  static AVOW       = 4;  // Display cards for meld
  static PLAY       = 5;  // Play the hand
  static DONE       = 6;  // The hand is completed
  static OVER       = 7;  // GAME OVER

  static ACE        = 14;
  static TEN        = 13;
  static KING       = 12;
  static QUEEN      = 11;
  static JACK       = 10;
  static NINE       = 9;

  static ranks = [      
    this.ACE,
    this.TEN,
    this.KING,  
    this.QUEEN, 
    this.JACK,  
    this.NINE
  ]; 

  static rank(rank) {
    switch(rank) {
      case this.ACE:
        return "A";
      case this.TEN:
        return "10";
      case this.KING:
        return "K";
      case this.QUEEN:
        return "Q";
      case this.JACK:
        return "J";
      case this.NINE:
        return "9";
    }
    return null;
  }
 
  static rankname(rank) {
    switch(rank) {
      case this.ACE:
        return "Ace";
      case this.TEN:
        return "10";
      case this.KING:
        return "King";
      case this.QUEEN:
        return "Queen";
      case this.JACK:
        return "Jack";
      case this.NINE:
        return "Nine";
    }
    return null;
  }
}

class Regular extends Game {
  static DEAL       = 1;  // Deal the cards
  static PLAY       = 2;  // Play the hand
  static DONE       = 3;  // The hand is completed
  static OVER       = 4;  // GAME OVER

  static KING       = 13;
  static QUEEN      = 12;
  static JACK       = 11;
  static TEN        = 10;
  static NINE       = 9;
  static EIGHT      = 8;
  static SEVEN      = 7;
  static SIX        = 6;
  static FIVE       = 5;
  static FOUR       = 4;
  static THREE      = 3;
  static TWO        = 2;
  static ACE        = 1;
  
  static ranks = [
    this.KING,
    this.QUEEN,
    this.JACK,
    this.TEN,
    this.NINE,
    this.EIGHT,
    this.SEVEN,
    this.SIX,
    this.FIVE,
    this.FOUR,
    this.THREE,
    this.TWO,
    this.ACE
  ];

  static rank(rank) {
    switch(rank) {
      case this.KING:
        return "K";
      case this.QUEEN:
        return "Q";
      case this.JACK:
        return "J";
      case this.TEN:
        return "10";
      case this.NINE:
        return "9";
      case this.EIGHT:
        return "8";
      case this.SEVEN:
        return "7";
      case this.SIX:
        return "6";
      case this.FIVE:
        return "5";
      case this.FOUR:
        return "4";
      case this.THREE:
        return "3";
      case this.TWO:
        return "2";
      case this.ACE:
        return "A";
    }
    return null;
  }

  static rankFromString(rank) {
    switch(rank) {
      case "K":
        return this.KING;
      case "Q":
        return this.QUEEN;
      case "J":
        return this.JACK;
      case "10": 
        return this.TEN;
      case "9":
        return this.NINE;
      case "8":
        return this.EIGHT;
      case "7":
        return this.SEVEN;
      case "6":
        return this.SIX;
      case "5":
        return this.FIVE;
      case "4":
        return this.FOUR;
      case "3":
        return this.THREE;
      case "2":
        return this.TWO;
      case "A":
        return this.ACE;
    }
    return null;
  }

  static rankname(rank) {
    switch(rank) {
      case this.ACE:
        return "Ace";
      case this.TEN:
        return "10";
      case this.KING:
        return "King";
      case this.QUEEN:
        return "Queen";
      case this.JACK:
        return "Jack";
      case this.NINE:
        return "Nine";
    }
    return null;
  }
}

