class Table {
  constructor() {
    //this.piles = [];
  }
}

class KlondikeView extends Table {
  constructor() {
    super();
    this.imgs = null; 
    this.divs = null;
  }

  draw(pile, id='content') {
    document.getElementById(id).appendChild(pile.div);
    var space = 0;
    for (const card of pile.iterator) {
      var pos = pile.where();
      var img = document.createElement("img"); 
      img.src = card.getURL();
      img.id  = card.toString(); //+":"+pile.id;
      document.getElementById(id).appendChild(img);
      img.style.position = "absolute";
      img.style.left = pos.x+'px';
      img.draggable = true;
      if (pile.arrayed) {
        img.style.top  = (pos.y+(20*space))+'px'; 
      } else {
        img.style.top  = pos.y+'px'; 
      }
      space++;
    }
  }

  onClick(callback) {
    this.imgs = document.getElementsByTagName("img");
    for (let i = 0; i < this.imgs.length; i++) {
      let id=this.imgs[i].id;
      this.imgs[i].addEventListener('click', function() {
        callback(id);
      }, false);
    }
  }

  onEmpty(callback) {
    var div = document.getElementById("pile0");
    div.addEventListener('click', callback);
  }

  onDrags(callback) {
    // On drag start
    this.imgs = document.getElementsByTagName("img");
    for (let i = 0; i < this.imgs.length; i++) {
      var path = this.imgs[i].src;
      var file = path.replace(/^.*[\\\/]/, '');
      if (! file.includes("back")) {
        let id=this.imgs[i].id;
        this.imgs[i].addEventListener('dragstart', function(event) {
          event.dataTransfer.dropEffect = 'move';
          event.dataTransfer.setData("text/plain", id);
        }, false);
      }
    }
  }

  onDrops(callback) {
    this.divs = document.getElementsByTagName("div");
    this.imgs = document.getElementsByTagName("img");
    for (let i = 0; i < this.divs.length; i++) { 
      let id = this.divs[i].id;
      if (id.includes("pile")) { // we only want piles
        this.divs[i].addEventListener('drop', function(event) {
          var card = event.dataTransfer.getData("text/plain");
          event.preventDefault();         
          var img   = document.getElementById(card);
          img.parentNode.removeChild(img);
          callback(card+":"+id);
        }, false);
        this.divs[i].addEventListener('dragover', function(event) {
          event.preventDefault();         
        }, false);
      }
    }
  }
}
