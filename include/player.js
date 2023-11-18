class Player {
  static HUMAN    = 0;
  static COMPUTER = 1;

  constructor() {
    if (this.constructor == Player) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.brain  = null;
    this.meld;
    this.partner;
    this.position;
    this.type;
    this.name;
    this.maxBid = 0;
    this.myBid  = 0;
    this.pBid   = 0; 
    this.ptops  = 0;
    this.assessment;
    this.bidder = false;
    this.memory;
    //this.memtxt = System.getProperty("pinochle.memory");
    this.knowledge   = null;
    this.distance;
  }

  addHand(hand) {
    this.hand = hand;
  }

  takeCard(card) {
    this.hand.add(card);
  }

  init() {
    this.myBid     = 0;
    this.maxBid    = 0;
    this.pBid      = 0;
    this.ptops     = 0;
    if (this.hand != null) {
      this.hand.reset();
    }
    if (this.brain == null) {
      //this.brain = new Brain();
    }
    //this.brain.forget();
  }

  setup(position, partner, name, hand) {
    this.position = position;
    this.partner  = partner;
    this.name     = name;
    this.hand     = hand;
  } 

  wonBid() {
    return this.bidder;
  }

  getPosition() {
    return this.position;
  }

  getPartner() {
    return this.partner;
  }

  getMaxBid() {
    return this.maxBid;
  }

  lastBid() {
    return this.myBid;
  }

  getName() {
    return this.name;
  }

  getType () {
    return this.type;
  }

  getHand() {
    return this.hand;
  }

  /*
  public abstract void clear();
  public abstract void remember(Deck cards);
  public abstract void remember(Card card);
  public abstract Card playCard(Trick trick);
  public abstract int bid(int bid); 
  public abstract int bid(int bid, int pbid, boolean opponents);
  public abstract int nameTrump();
  public abstract Deck passCards(boolean bidder);
  public abstract void takeCards(Deck d);
  public abstract int meld();
  public abstract void clearMeld();
  */
}
