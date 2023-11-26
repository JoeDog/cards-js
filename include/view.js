class Table {
  constructor() {
  }

  remove(id) {
    console.log("remove fired");
    var img   = document.getElementById(id);
    if (img != null) {
      img.style.display='none';
      img.parentNode.removeChild(img);
    }
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
    this.pngs = new Array(13);
  }

  /**
  remove(id) {
    var img   = document.getElementById(id);
    if (img != null) {
      img.style.display='none';
      img.parentNode.removeChild(img);
    }
  }*/

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
        img.src = card.getURL();
      }
      if (pile.arrayed) {
        img.style.top  = (pos.y+(20*space))+'px'; 
      } else {
        img.style.top  = pos.y+'px'; 
      }
      space++;
    }
    for (let i = 0; i < this.pngs.length; i++) {
      this.pngs[i] = [];
      var arr = document.querySelectorAll(format("[data-pile='%s']", i))
      for (let j = 0; j < arr.length; j++) {
        if (! arr[j].src.includes("back")) {
          var png = document.getElementById(arr[j].id);
          if (png != null) {
            this.pngs[i].push(png);
          }
        }
      }
    }
  }

  onClick(callback) {
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
          event.dataTransfer.dropEffect = 'move';
          event.dataTransfer.setData("text/plain", id);
          event.stopImmediatePropagation();
        }, false);
      }
    }
  }

  onMoves(callback, stacks) {
    this.imgs = document.getElementsByTagName("img");
    var tmp = this.pngs;
    for (let i = 0; i < this.imgs.length; i++) {
      var path = this.imgs[i].src;
      var file = path.replace(/^.*[\\\/]/, '');
      if (! file.includes("back")) {
        this.imgs[i].addEventListener('drag', function(event) {
          const x = event.clientX - this.offx;
          const y = event.clientY - this.offy;
          const p = parseInt(this.dataset.pile);
          const z = Util.indexOf(tmp[p], this);
          for (let j = z+1; j < tmp[p].length; j++) {
            var png = tmp[p][j];
            if (png != null) {
              png.style.left = x+"px"; 
              png.style.top  = y+(10*j)+"px";
            }
          }
          event.stopImmediatePropagation();
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
          event.dataTransfer.dropEffect = 'copy';
          event.preventDefault();         
          var card = event.dataTransfer.getData("text/plain");
          var img  = document.getElementById(card);
          img.parentNode.removeChild(img);
          callback(card+":"+id, event);
        }, false);
        this.divs[i].addEventListener('dragover', function(event) {
          event.dataTransfer.dropEffect = 'copy';
          event.preventDefault();         
        }, false);
      }
    }
    for (let i = 0; i < this.imgs.length; i++) { 
      let img  = this.imgs[i];
      let pile = parseInt(img.dataset.pile) || 0;
      if (! img.src.includes("back") && pile >= 2) {
        img.addEventListener('drop', function(event) {
          event.preventDefault();         
          event.dataTransfer.dropEffect = 'copy';
          var card = event.dataTransfer.getData("text/plain");
          var img   = document.getElementById(card);
          img.parentNode.removeChild(img);
          img.style.display='none';
          callback(card+":"+this.pile, event);
        }, false);
        img.addEventListener('dragover', function(event) {
          event.preventDefault();         
          this.pile = img.dataset.pile; // ???
          event.dataTransfer.dropEffect = 'copy';
          event.stopImmediatePropagation();
        }, false);
      }    
    }
    /**
     * FIX ME: XXX
     * The bdy listeners handle bad drops. Unfortunately,
     * this means the cursor displays copy over bdy element
     */
    var bdy = document.getElementById("bodyId");
    bdy.addEventListener('dragover', function(event) {
      event.preventDefault();
      document.body.style.cursor = 'auto';
    });
    bdy.addEventListener('dragleave', function(event) {
      event.preventDefault();
      document.body.style.cursor = 'auto';
    });
    bdy.addEventListener('drop', function(event) {
      document.body.style.cursor = 'auto';
      event.preventDefault();
      var card = event.dataTransfer.getData("text/plain");
      var img  = document.getElementById(card);
      if (img != null) {
        img.parentNode.removeChild(img);
        img.style.display='none';
        callback(card+":"+this.pile, event);
      }
      event.stopImmediatePropagation();
    }, false);
  }
}
