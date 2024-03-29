class Controller {
  constructor(model, view) {
    this.model = model;
    this.view  = view;
  }
}

class SolitaireController extends Controller {
  constructor(model, view) {
    super(model, view);
    this.addListeners(this.draw.bind(this), this.remove.bind(this));
  }

  addListeners(draw, remove) {
    var dropzoneId = "bodyId";
    window.addEventListener("dragover", function(e) {
      if (e.target.id == dropzoneId) {
        e.preventDefault();
        e.dataTransfer.effectAllowed = "all";
      }
    });
    window.addEventListener("drop", function(e) {
      if (e.target.id == dropzoneId) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";
        var pit = null;
        var bdy = document.getElementById(dropzoneId);
        var img = bdy.getElementsByTagName("img");
        for (let i = 0; i < img.length; i++) {
          if (img[i].nextElementSibling==null) {
            remove(img[i]);
          }
        }
        draw();
      }
    });
  }

  remove(id) {
    this.view.remove(id);
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
    var res   = model.move(card, pile);
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

class CanfieldController extends SolitaireController {
  constructor(model, view) {
    super(model, view);
    this.model.setArrayedPiles([6,7,8,9,10]);
    var deck = new Deck(Game.REGULAR);
    var ones = [2, 7, 8, 9, 10];

    deck.shuffle();
    for (let i = 0; i < ones.length; i++) {
      var card = deck.pop();
      card.setFaceUp();
      this.model.add(ones[i], card);
      if (ones[i] == 2) model.setBase(card);
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

    let len = deck.size();
    for (let i = 0; i < len; i++) {
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
    let pile = model.getPile(6);
    if (pile.size() > 0) {
      /**
       * If any of piles 7 thru 10 are empty we'll
       * automatically move a card from the flop
       */
      for (let i = 7; i < 11; i++) {
        if ((model.getPile(i)).size() == 0) {
          let tmp = pile.peek();
          model.move(tmp.toString(), i);
          view.remove(tmp.toString());
          this.draw();
        }
      }
    }
  }
}

class KlondikeController extends SolitaireController {
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
}


