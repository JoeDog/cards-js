class Controller {
  constructor(model, view) {
    this.model = model;
    this.view  = view;
  }
}

class CanfieldController extends Controller {
  constructor(model, view) {
    super(model, view);
    this.model.setArrayedPiles([5,6,7,8,9]);
    var deck = new Deck(Game.REGULAR);
    var ones = [2, 7, 8, 9, 10];

    deck.shuffle();
    for (let i = 0; i < ones.length; i++) {
      var card = deck.pop();
      card.setFaceUp();
      this.model.add(ones[i], card);
    }
    for (let i = 0; i < 13; i++) {
      var card = deck.pop();
      if (i == 12) {
        card.setFaceUp();
      } else {
        card.setFaceDown();
      }
      this.model.add(6, card);
    }
    for (let i = 0; i < deck.size(); i++) {
      var card = deck.pop();
      card.setFaceDown();
      this.model.add(0, card);
    }
    this.draw();
  }

  draw(arr=null) {
    if (arr != null) {
      for (let i = 0; i < arr.length; i++) {
        this.view.draw(model.getPile(i));
      }
    } else {
      for (const pile of model.iterator) {
        this.view.draw(pile);
      }
    }
    this.view.onClick(this.handleMouseClick.bind(this));
    this.view.onDrags(this.handleMouseDrags.bind(this));
    this.view.onDrops(this.handleMouseDrops.bind(this));
    this.view.onMoves(this.handleMouseMoves.bind(this), this.model.stacks());
    let imgs = document.getElementsByTagName("img");
  }

  handleMouseClick(id) {
    model.flip(id);
    this.draw([0, 1]);
    if (model.size(0) == 0) {
      this.view.onEmpty(this.handleEmptyClick.bind(this));
    }
  }

  handleEmptyClick() {
    model.restack(1, 0);
    this.draw([0,1]);
  }

  handleMouseDrags(event, img, src) {
  }

  handleMouseMoves(img) {
  }

  handleMouseDrops(id, evt) {
    const arr = id.split(":");
    if (arr.length != 2) return;
    var indx  = 0;
    var hand  = model.stacks();
    var card  = arr[0];
    var from  = "pile"+model.whence(card);
    var pile  = parseInt(arr[1].replace("pile", ""));
    var res = model.move(card, pile);
    this.draw();
    if (hand[from] != null) {
      for (let i = 0; i < hand[from].length; i++) {
        model.move(hand[from][i], pile);
        view.remove(hand[from][i]);
        this.draw();
      }
    }
    evt.stopImmediatePropagation();
  }
}

class KlondikeController extends Controller {
  constructor(model, view) {
    super(model, view);
    this.model.setArrayedPiles([6,7,8,9,10,11,12]);
    var deck = new Deck(Game.REGULAR);
    deck.shuffle();

    let st = 0; 
    while (st < 7) {
      for (let i = st; i < 7; i++) {
        if (i == st) {
          var card = deck.pop(); 
          card.setFaceUp();
          this.model.add(i+6, card);
        } else {
          var card = deck.pop(); 
          card.setFaceDown();
          this.model.add(i+6, card);
        }
      }
      st++;
    }
    while (deck.size() > 0) {
      this.model.add(0, deck.pop());
    }
    this.draw();
  }  

  draw(arr=null) {
    if (arr != null) {
      for (let i = 0; i < arr.length; i++) {
        this.view.draw(model.getPile(i));
      }
    } else {
      for (const pile of model.iterator) {
        this.view.draw(pile);
      }
    }
    this.view.onClick(this.handleMouseClick.bind(this));
    this.view.onDrags(this.handleMouseDrags.bind(this));
    this.view.onDrops(this.handleMouseDrops.bind(this));
    this.view.onMoves(this.handleMouseMoves.bind(this), this.model.stacks());
    let imgs = document.getElementsByTagName("img");
  }

  handleMouseClick(id) {
    model.flip(id);
    this.draw([0, 1]); 
    if (model.size(0) == 0) {
      this.view.onEmpty(this.handleEmptyClick.bind(this));
    }
  } 

  handleEmptyClick() {
    model.restack(1, 0);
    this.draw([0,1]); 
  }

  handleMouseDrags(event, img, src) {
  }

  handleMouseMoves(img) {
  }

  handleMouseDrops(id, evt) {
    const arr = id.split(":");
    if (arr.length != 2) return;
    var indx  = 0;
    var hand  = model.stacks();
    var card  = arr[0];
    var from  = "pile"+model.whence(card);
    var pile  = parseInt(arr[1].replace("pile", ""));
    var res = model.move(card, pile);
    this.draw();
    if (hand[from] != null) {
      for (let i = 0; i < hand[from].length; i++) {
        model.move(hand[from][i], pile);
        view.remove(hand[from][i]);
        this.draw();
      }
    }
    evt.stopImmediatePropagation();
  }
}


