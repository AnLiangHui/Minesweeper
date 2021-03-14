class Mines {
  constructor(tr, td, mineNumber, wh) {
    this.tr = tr; 
    this.td = td;
    this.mineNumber = mineNumber; //雷的数量
    this.wh = wh;

    this.squares = [];  //存储所有方块的信息
    this.tdDoms = []; //存储所有方块的dom
    this.surplusMineNum = mineNumber;
    this.timeStart = false;
    this.clearTime = null;
    this.allNum = tr * td;
    
    this.timeNum = document.querySelector('.clock e');
    this.flagNum = document.querySelector('.message > .flag > e');
    this.parent = document.querySelector('.gameWrap');
    this.startBtn = document.querySelector('.start');
  }

  init() {
    
    var minePlace = this.randomMine();
    var n = 0;
    for (var i = 0; i < this.tr; i ++) {
      this.squares[i] = [];
      for (var j = 0; j < this.td; j ++) {
        if (minePlace.indexOf(n++) !== -1) {
          this.squares[i][j] = {type:'mine',x:j,y:i};
        }else {
          this.squares[i][j] = {type:'number',x:j,y:i,value:0};
        }
      }
    }
    var mine = document.querySelector('#mine')
    this.parent.oncontextmenu = function() {
      return false;
    }
    
    this.startGamePage();
    this.changeNumber();
    this.createTable();
    this.changeDif();

    let flagNumber = document.querySelector('.message > .flag > e');
    flagNumber.innerText = this.mineNumber;
  }

  startGamePage() {
    this.startBtn.addEventListener('click', function () {  
      var mine = document.querySelector('#mine')
      startGame.style.display = "none";
      mine.style.display = "block";
    });
  }

  
  randomMine() {
    var mines = new Array(this.tr * this.td);
    for (var i = 0; i < mines.length; i ++) {
      mines[i] = i;
    }
    mines.sort(function() {return 0.5 - Math.random()})
    return mines.slice(0, this.mineNumber);
  }

  createTable() {
    var This = this;
    var table = document.createElement('table');
    for (var i = 0; i < this.tr; i ++) {
      var tr = document.createElement('tr');
      this.tdDoms[i] = [];
      for(var j = 0; j < this.td; j ++) {
        var td = document.createElement('td');
        td.style.width = this.wh + 'px';
        td.style.height = this.wh + 'px';
        td.style.fontSize = this.wh / 1.5 + 'px';

        td.classList.add('tdHover');
        if (i % 2 == 0) {
          if (j % 2 == 0) {
            td.style.backgroundColor = '#A1CC4D';
          }else {
            td.style.backgroundColor = '#AAD751';
          }
        }else {
          if (j % 2 == 0) {
            td.style.backgroundColor = '#AAD751';
          }else {
            td.style.backgroundColor = '#A1CC4D';
          }
        }
        td.pos = [i, j];
        td.onmousedown = function (event) {
          This.play(event, this);
        }
        // if (this.squares[i][j].type == 'mine') {
        //   td.classList.add('mine');
        // }else {
        //   td.innerHTML = this.squares[i][j].value;
        // }
        this.tdDoms[i][j] = td;
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    this.parent.appendChild(table);
    var mine = document.querySelector('#mine')
    mine.style.width = this.td * this.wh + 'px';
  }

  getAround(square) {
    var x = square.x;
    var y = square.y;
    var arroundPlaces = [];
    for (var i = x - 1; i <= x + 1; i ++) {
      for (var j = y - 1; j <= y + 1; j ++) {
        if (i < 0 || j < 0 || i > this.td - 1 || j > this.tr - 1 || (i == x && j == y) || this.squares[j][i].type == 'mine') {
          continue;
        }
        arroundPlaces.push([j, i]);
      }
    }
    return arroundPlaces;
  }
  changeNumber() {
    for (var i = 0; i < this.tr; i ++) {
      for (var j = 0; j < this.td; j ++) {
        if (this.squares[i][j].type == 'mine') {
          var arounds = this.getAround(this.squares[i][j]);
          for (var k = 0; k < arounds.length; k ++) {
            this.squares[arounds[k][0]][arounds[k][1]].value ++;
          }
        }
      }
    }
  }

  time() {
    let time = 0
    if (this.timeStart) {
      this.clearTime = setInterval(() => {
        if (++time < 10) {
          this.timeNum.innerText = '00' + time;
        }else if (time >= 10 && time < 100){
          this.timeNum.innerText = '0' + time;
        }else {
          this.timeNum.innerText = time;
        }
      }, 1000);
    }
  }

  play(ev, obj) {
    ev.preventDefault();
    const This = this;
    let color = ['zero', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
    if (ev.which == 1 && !obj.noClick) {
      var clickTd = this.squares[obj.pos[0]][obj.pos[1]];
      if (clickTd.type == 'number') {
        this.allNum --;
        // console.log(This.allNum);
        if (!this.timeStart) {
          this.timeStart = true;
          this.time();
        }
        function clickTdBgc(clickTd, obj) {  
          if (clickTd.x % 2 == 0) {
            if (clickTd.y % 2 == 0) {
              obj.style.backgroundColor = '#E5C29F';
            }else {
              obj.style.backgroundColor = '#D7B899';
            }
          }else {
            if (clickTd.y % 2 == 0) {
              obj.style.backgroundColor = '#D7B899';
            }else {
              obj.style.backgroundColor = '#E5C29F';
            }
          }
        }
        clickTdBgc(clickTd, obj);
        obj.classList.add('clickHover');
        obj.innerHTML = clickTd.value;
        obj.classList.add(color[clickTd.value - 1]);
        obj.flag = true;
        obj.classList.remove('placeFlag');
        if (clickTd.value == 0) {
          obj.classList.remove('tdHover');
          obj.innerHTML = '';
          function getTdAround(square) {  
            let squareAround = This.getAround(square);
            for (let i = 0; i < squareAround.length; i ++) {
              let x = squareAround[i][0],
                  y = squareAround[i][1];
              if (!This.tdDoms[x][y].flag) { 
                This.tdDoms[x][y].flag = true;
                if (This.squares[x][y].value == 0) {
                  This.allNum --;
                  This.tdDoms[x][y].classList.remove('tdHover');
                  This.tdDoms[x][y].classList.remove('clickHover');
                  getTdAround(This.squares[x][y]);
                  clickTdBgc(This.squares[x][y], This.tdDoms[x][y]);
                } else if (This.squares[x][y].value > 0) {
                  This.allNum --;
                  This.tdDoms[x][y].classList.add('clickHover');
                  This.tdDoms[x][y].innerHTML = This.squares[x][y].value;
                  This.tdDoms[x][y].classList.add(color[This.squares[x][y].value - 1]);
                  clickTdBgc(This.squares[x][y], This.tdDoms[x][y]);
                }
                // console.log(This.allNum);
                This.tdDoms[x][y].classList.remove('placeFlag');
              }
            }
          }
          getTdAround(clickTd);
        }
      }else {
        obj.classList.add('mine');
        let c = 1, n = 0;
        // let color = ['zero', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
        for (let i = 0; i < this.tr; i ++) {
          for (let j = 0; j < this.td; j ++) {
            This.tdDoms[i][j].onmousedown = null;
            if (This.squares[i][j].type == 'mine' && !This.tdDoms[i][j].classList.contains('mine')) {
              // setTimeout(function () {  
                This.tdDoms[i][j].classList.add('mine');
              // },400 * c);
              // c ++;
            }
          }
        }
        setTimeout(function () {  
          This.gameOver();
        },400);  
      }
      if (this.allNum == this.mineNumber) {
        this.gameOver();
      }
    }
    if (ev.which == 3) {
      
      if (obj.classList.contains('placeFlag')) {
        obj.classList.remove('placeFlag');
        obj.noClick = false;
        this.flagNum.innerText ++;
        if (This.squares[obj.pos[0]][obj.pos[1]].type == 'mine') {
          // console.log('+');
          this.surplusMineNum ++;
        }
        // console.log(this.surplusMineNum);
      }else {
        if (!obj.flag) {
          obj.classList.add('placeFlag');
          obj.noClick = true;
          this.flagNum.innerText --;
          if (This.squares[obj.pos[0]][obj.pos[1]].type == 'mine') {
            // console.log('-');
            this.surplusMineNum --;
          }
        }
        if ((this.surplusMineNum == 0 && this.flagNum.innerText == 0)) {
          This.gameOver();
        }
        // console.log(this.surplusMineNum);
      }
    }
  }

  gameOver() {
    clearInterval(this.clearTime);
    const body = document.querySelector('body');
    let overBg = document.createElement('div'),
        overWicket = document.createElement('div'),
        clockIcon = document.createElement('div'),
        trophyIcon = document.createElement('div'),
        againBtn = document.createElement('div'),
        clockE = document.createElement('e'),
        trophyE = document.createElement('e');
    againBtn.innerText = '再试一次吧';
    againBtn.classList.add('againBtn');
    againBtn.addEventListener('click', () => {
      // let main = document.querySelector('.gameWrap');
      this.parent.innerHTML = '';
      let mine = new Mines(this.tr, this.td, this.mineNumber, this.wh);
      mine.init();
      this.timeNum.innerText = '000';
      this.flagNum.innerText = this.mineNumber;
    });
    clockIcon.classList.add('clockIcon');
    clockE.innerText = this.timeNum.innerText;
    clockIcon.append(clockE);
    overWicket.append(clockIcon);
    trophyIcon.classList.add('trophyIcon');
    trophyE.innerText = this.timeNum.innerText;
    trophyIcon.append(trophyE);
    overWicket.append(trophyIcon);

    // overBg.classList.add('overBg');
    // this.parent.append(overBg);
    overWicket.classList.add('overWicket');
    overWicket.append(againBtn);
    this.parent.append(overWicket);
  }

  changeDif() {
    let selects = document.querySelector('.difficult');
    selects.addEventListener('change', () => {
      this.parent.innerHTML = '';
      if (selects.value == 1) {
        mine = new Mines(8, 10, 10, 45);
      }else if (selects.value == 2) {
        mine = new Mines(14, 18, 40, 30);
      }else {
        mine = new Mines(20, 24, 99, 25);
      }
      mine.init();
    })
  }
}

let mine;
mine = new Mines(8, 10, 10, 45);
mine.init();
