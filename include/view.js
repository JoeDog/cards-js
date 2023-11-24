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
    this.pile = null;
    this.offx = 0;
    this.offy = 0;
    this.drag = false;
  }

  /**************************************************
  init(pile, id='content') {
    var test = document.getElementById(pile.div.id);
    if (test = null) { 
      return; // only add once...
    }
    document.getElementById(id).appendChild(pile.div);
    var space = 0;
    for (const card of pile.iterator) {
      var pos = pile.where();
      var img = document.createElement("img"); 
      img.src = card.getURL();
      img.id  = card.toString(); //+":"+pile.id;
      img.dataset.pile = pile.id;
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
  **************************************************/

  remove(id) {
    var img   = document.getElementById(id);
    if (img != null) {
      img.style.display='none';
      img.parentNode.removeChild(img);
    }
  }

  draw(pile, id="content") {
    if (document.getElementById(pile.div.id) == null) {
      document.getElementById(id).appendChild(pile.div);
    }
    var space = 0; 
    for (const card of pile.iterator) {
      var pos = pile.where();
      var img = document.getElementById(card.toString());
      if (img == null) {
        img = document.createElement("img"); 
        img.src = card.getURL();
        img.id  = card.toString(); //+":"+pile.id;
        img.dataset.pile = pile.id;
        document.getElementById(id).appendChild(img);
        img.style.position = "absolute";
        img.style.left = pos.x+'px';
        img.draggable = true;
      } else {
        // the controller may have flipped it
        img.src = card.getURL();
      }
      if (pile.arrayed) {
        img.style.top  = (pos.y+(20*space))+'px'; 
      } else {
        img.style.top  = pos.y+'px'; 
      }
      space++;
    }
  }

  onClick(callback) {
    console.log("onClick");
    this.imgs = document.getElementsByTagName("img");
    for (let i = 0; i < this.imgs.length; i++) {
      let id=this.imgs[i].id;
      this.imgs[i].addEventListener('click', function(event) {
        event.preventDefault();         
        event.stopImmediatePropagation();
        var img  = document.getElementById(id);
        var pile = parseInt(img.dataset.pile);
        if (pile == 0) {
          img.parentNode.removeChild(img);
          img.style.display='none';
          callback(id);
        }
      }, false);
    }
  }

  onEmpty(callback) {
    var div   = document.getElementById("pile0");
    div.addEventListener('click', function(event) {
      event.preventDefault();         
      event.stopImmediatePropagation();
      this.imgs = document.getElementsByTagName("img");
      let pack  = [];
      for (let i = 0; i < this.imgs.length; i++) {
        var pile = parseInt(this.imgs[i].dataset.pile);
        if (pile == 1) {
          pack.push(this.imgs[i]);
        } 
      }
      for (let i = 0; i < pack.length; i++) {
        let img = pack[i];
        img.style.display='none';
        img.parentNode.removeChild(img);
      }
      callback(); 
    }, false);
  }

  onDrags(callback) {
    this.imgs = document.getElementsByTagName("img");
    for (let i = 0; i < this.imgs.length; i++) {
      var path = this.imgs[i].src;
      var file = path.replace(/^.*[\\\/]/, '');
      if (! file.includes("back")) {
        let id   = this.imgs[i].id;
        this.pile = parseInt(this.imgs[i].dataset.pile) || 0;
        this.imgs[i].addEventListener('dragstart', function(event) {
          this.offx = event.clientX - this.getBoundingClientRect().left;
          this.offy = event.clientY - this.getBoundingClientRect().top;
          this.drag = true;
          //console.log("pile:"+this.dataset.pile);
          //console.log("this.pile:"+this.pile);
          event.dataTransfer.dropEffect = 'move';
          event.dataTransfer.setData("text/plain", id);
          event.stopImmediatePropagation();
        }, false);
      }
    }
  }


  onMoves(callback, stacks) {
    this.imgs = document.getElementsByTagName("img");
    for (let i = 0; i < this.imgs.length; i++) {
      var path = this.imgs[i].src;
      var file = path.replace(/^.*[\\\/]/, '');
      if (! file.includes("back")) {
        var pile = "pile"+this.imgs[i].dataset.pile;
        this.imgs[i].addEventListener('drag', function(event) {
          const x = event.clientX - this.offx;
          const y = event.clientY - this.offy;
          var ims = [];
          if (stacks != null && stacks[pile] != null) {
            for (let j = 0; j < stacks[pile].length; j++) {
              ims.push(stacks[pile][j]);
            }
          }
          /*for (let j = 0; j < ims.length; j++) {
            var png = document.getElementById(ims[j]);
            png.style.left = x+"px"; 
            png.style.top  = y+(10*j)+"px";
          }*/
          /*img1.style.left = x + 'px';
          img1.style.top = y + 'px';
          img2.style.left = x + 'px';
          img2.style.top = y + 10 + 'px';*/
          event.stopImmediatePropagation();
        }, false);
      }
    } 
  }

  onDrops(callback) {
    console.log("onDrops");
    this.divs = document.getElementsByTagName("div");
    this.imgs = document.getElementsByTagName("img");
    for (let i = 0; i < this.divs.length; i++) { 
      let id = this.divs[i].id;
      if (id.includes("pile")) { // we only want piles
        this.divs[i].addEventListener('drop', function(event) {
          this.drag = false;
          var card = event.dataTransfer.getData("text/plain");
          event.preventDefault();         
          var img   = document.getElementById(card);
          img.parentNode.removeChild(img);
          callback(card+":"+id, event);
        }, false);
        this.divs[i].addEventListener('dragover', function(event) {
          event.preventDefault();         
        }, false);
      }
    }
    for (let i = 0; i < this.imgs.length; i++) { 
      let img  = this.imgs[i];
      let pile = parseInt(img.dataset.pile) || 0;
      if (! img.src.includes("back") && pile >= 2) {
        img.addEventListener('drop', function(event) {
          var card = event.dataTransfer.getData("text/plain");
          console.log("img.evt: "+this.pile);
          event.preventDefault();         
          var img   = document.getElementById(card);
          img.parentNode.removeChild(img);
          img.style.display='none';
          callback(card+":"+this.pile, event);
        }, false);
        img.addEventListener('dragover', function(event) {
          event.preventDefault();         
          this.pile = img.dataset.pile;
          event.stopImmediatePropagation();
        }, false);
      }    
    }
  }
}
