class Controller {
  constructor(model, view) {
    this.model = model;
    this.view  = view;
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
    console.log("control.draw");
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
    let imgs = document.getElementsByTagName("img");
    console.log(imgs.length);
  }

  handleMouseClick(id) {
    console.log("mouseClick");
    model.move(id, 1);
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
    console.log("mouseDrags");
    //this.draw();
  }

  handleMouseDrops(id, evt) {
    console.log("mouseDrops");
    const arr = id.split(":");
    if (arr.length != 2) return;
    var card  = arr[0];
    var pile  = parseInt(arr[1].replace("pile", ""));
    var res   = model.move(card, pile);
    this.draw();
    evt.stopImmediatePropagation();
  }
}


