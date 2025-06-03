let automata;
let neighborhood;
let gen0;
let test;
let alpha = 500;
let beta = 8;
let rule;
let label;

function setup() {
  rectMode(CENTER)
  let cnv = createCanvas(500, 500);
  cnv.parent('canvas')
  gen0 = new Generation();
  frameRate(12);
  gen0.automata[31][31].changeState(1);
  label = createElement('em', "rule #"+gen0.rule)
  label.parent('label')
  //let previous = createA("#", "<").attribute("onclick", "reset()");
  //previous.parent('label')
  let index = []
  for (let q=0; q<1024; q++){
    let r = str(q+1)
    if (r.length < 3) {
      r = nf(r, 3);
      index[q] = createA("#", ' #'+r)
    } else {
      index[q] = createA("#", ' #'+`${q+1} `)
    }
    index[q].attribute('onclick', 'jump('+`${q}`+')');
    index[q].parent('index');
}
}

function jump(n){
  gen0.changeRule(n);
  gen0.reset();
  label.html("rule #"+`${gen0.rule + 1}`) 
}

function rando(){
  gen0.changeRule(floor(random(0,1024)))
  gen0.reset();
  label.html("rule #"+gen0.rule);
}

function previous(){
  if (gen0.rule > 0){
    gen0.changeRule(gen0.rule - 1);
    gen0.reset();
    label.html("rule #"+gen0.rule);
  }
  if (gen0.rule == 0) {
  rando()
  }
}

function next(){
  if (gen0.rule < 1023){
    gen0.changeRule(gen0.rule + 1);
    gen0.reset();
    label.html("rule #"+gen0.rule);
  }
  if (gen0.rule == 1023){
  rando()
  }
}


function touchStarted() {
    for (let x = 1; x < alpha / beta - 1; x++) {
    for (let y = 1; y < alpha / beta - 1; y++) {
      gen0.automata[x][y].click(touch.x, touch.y);
      //gen0.calcNeighborhood(x, y);
    }
  }
}

function mousePressed() {
  for (let x = 1; x < alpha / beta - 1; x++) {
    for (let y = 1; y < alpha / beta - 1; y++) {
      gen0.automata[x][y].click(mouseX, mouseY);
      //gen0.calcNeighborhood(x, y);
    }
  }
}

function mouseDragged() {
  for (let x = 1; x < alpha / beta - 1; x++) {
    for (let y = 1; y < alpha / beta - 1; y++) {
      gen0.automata[x][y].click(mouseX, mouseY);      
      //gen0.calcNeighborhood(x, y);
    }
  }
}

function draw() {
  background("black");
  gen0.display();
  gen0.evolve();
}

class Automaton {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.state =  0//random([1, 0]);
    this.neighborhood = 0; 
  }

  changeState(x) {
    this.state = x;
  }
  
  display() {
    if (this.state == 1) {
      rect(this.x, this.y, 5, 5);
    }
    
    //color for testing
    if (this.x == 160 && this.y == 80) {
      push();
      //fill(255, 0, 255);
      //rect(this.x, this.y, 5, 5);
      pop();
    }
  }

  click(x, y) {
    if (x < this.x + 4 && x > this.x - 4 && y < this.y + 4 && y > this.y - 4) {
      this.state = !this.state;
      //print(this.x, this.y, this.neighborhood);
    }
  }
}

class Generation {
  constructor() {
    this.automata = []; //2D array of automata
    for (let i = 0; i < alpha / beta ; i++) {
      this.automata[i] = [];
      for (let j = 0; j < alpha / beta ; j++) {
        this.automata[i][j] = new Automaton(i * beta, j * beta);
      }
    }
    
    //int ruleset
    let x;
    let y;
    rule = floor(random(0,1024));
    this.rule = rule;
    
    x = this.rule.toString(2);
    y = int(x);
    if (x.length < 10) {
      y = nf(x, 10);
    }
    
    let z = y.toString().split("");
    for (let a = 0; a < 10; a++){
      z[a] = int(z[a])
    }
    

    this.ruleset = z 
    //[1, 0, 1, 1, 1, 1, 0, 0, 1, 1]
    //[0, 0, 1, 1, 0, 0, 1, 1, 1, 0] // sqaure houses
    // [0,1,0,1,0,1,1,1,1,1]   
     // [0, 1, 0, 0, 0, 0, 0, 0, 1, 0]//interactive phaseshift
       //[1,1,1,0,1,1,1,0,1,0]
        // [0,1,0,1,0,0,0,1,1,0]
       //[0,1,0,0,1,1,0,0,1,0]
      
     // [1, 1, 1, 0, 1, 1, 0, 1, 0, 1]; // fast periodic fractal
    // [1,1,1,1,0,1,1,0,1] // rly cool fractal
    // [0,0,0,1,0,0,1,1,1,1] // quick caves
    // [1,1,1,1,0,1,1,0,1,1] // cool caves, game of life equilibrium
  }

  calcNeighborhood(x, y) {
    if (this.automata[x][y].state == 0) {
      this.automata[x][y].neighborhood =
        this.automata[x][y - 1].state +
        this.automata[x - 1][y].state +
        this.automata[x + 1][y].state +
        this.automata[x][y + 1].state
    }
    if (this.automata[x][y].state == 1) {
      this.automata[x][y].neighborhood =
        5 +
        this.automata[x][y - 1].state +
        this.automata[x - 1][y].state +
        this.automata[x + 1][y].state +
        this.automata[x][y + 1].state
    }
  }

  changeRule(x) {
    this.rule = x;
    let a;
    let b;
    a = this.rule.toString(2);
    b = int(a);
    if (a.length < 10) {
      b = nf(b, 10);
    }
    let z = b.toString().split("");
    for (let a = 0; a < 10; a++){
      z[a] = int(z[a])
    }
    this.ruleset = z
  }

  display() {
    for (let x = 1; x < (alpha / beta) -1; x++) {
      for (let y = 1; y < (alpha / beta) -1; y++) {
        if (this.automata[x][y].state == 1) {
          noStroke();
          this.automata[x][y].display();
        }
      }
    }
  }

  evolve() {
    for (let i = 1; i < (alpha / beta) - 1; i++) {
      for (let j = 1; j < (alpha / beta) - 1; j++) {
    this.calcNeighborhood(i, j)
      }
    }
    
    for (let i = 0; i < (alpha / beta) ; i++) {
      for (let j = 0; j < (alpha / beta) ; j++) {
        // this.automata[i][j].evolve()
        for (let k = 0; k < 10; k++) {
          if (k < 5 && this.automata[i][j].neighborhood == k) {
            this.automata[i][j].changeState(this.ruleset[k]);
          }
          if (k >= 5 && this.automata[i][j].neighborhood == k) {
            this.automata[i][j].changeState(this.ruleset[k]);
          }
          
        }
      }
    }
  }
  
  reset() {
    for (let i = 0; i < (alpha / beta) ; i++) {
      for (let j = 0; j < (alpha / beta) ; j++) {
        this.automata[i][j].state = 0;
      }
    }
    this.automata[31][31].changeState(1);
    
    }

  evolveButton() {
    if (keyIsDown(RIGHT_ARROW)) {
      this.evolve();
      print("one stage");
    }
  }
}
