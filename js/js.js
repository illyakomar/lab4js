class Ball {
  constructor(x, y, radius, speedX, speedY, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.speedX = speedX;
      this.speedY = speedY;
      this.color = color;
  }

  draw() {
      
      ctx.save();

      
      ctx.translate(this.x, this.y);

      ctx.fillStyle = this.color;
      ctx.fillStyle = this.color;
      
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
      ctx.fill();

      
      ctx.restore();
  }
  move(globalSpeedMutiplier) {
      this.x += (this.speedX * globalSpeedMutiplier);
      this.y += (this.speedY * globalSpeedMutiplier);

      this.testCollisionBallWithWalls();
  }
  testCollisionBallWithWalls() {
      
      if ((this.x + this.radius) > w) {
          
          this.speedX = -this.speedX;

          this.x = w - this.radius;
      } else if ((this.x - this.radius) < 0) {

          this.speedX = -this.speedX;

          this.x = this.radius;
      }

      if ((this.y + this.radius) > h) {
         
          this.speedY = -this.speedY;

          this.y = h - this.radius;
      } else if ((this.y - this.radius) < 0) {
         
          this.speedY = -this.speedY;

          this.Y = this.radius;
      }
  }
}

class Balls {
  constructor(n, globalSpeedMutiplier) {
      this.ballsArray = [];
      for (var i = 0; i < n; i++) {
          var ball = new Ball(w / 2, h / 2, 5 + 20 * Math.random(), -2 + 4 * Math.random(), -2 + 4 * Math.random(), getARandomColor());
          this.ballsArray.push(ball);
      }
      this.globalSpeedMutiplier = globalSpeedMutiplier;
  }
  add(x, y, radius, speedX, speedY, color) {
      let ball = new Ball(x, y, radius, speedX, speedY, color);
      this.ballsArray.push(ball);
  }
  draw() {
      for (var i = 0; i < this.ballsArray.length; i++) {
          this.ballsArray[i].draw();
      };
  }
  drawBallNumbers() {
      ctx.save();
      ctx.font = "20px Arial";

      if (gameState === "displayGameOverMenu") {
          ctx.fillText("Гра завершена!", 20, 30);
          
          restartEl.style.display = "block";

          
          let ballGames = JSON.parse(localStorage.ballGames);
          var d = new Date();

          let ballGame = { 'date': d, 'level': gameLevel };
          ballGames.push(ballGame);
          ballGames.sort(function(a, b) {
              return b.level - a.level;
          });
          localStorage.ballGames = JSON.stringify(ballGames);

          let end = 10;
          if (ballGames.length < end) {
              end = ballGames.length;
          }
          for (var i = 0; i < end; i++) {
              let pEl = document.createElement('p');
              ballGames[i].date = new Date(ballGames[i].date);
              pEl.innerText = '№' + '' + (i + 1) + ' Рівень: ' + ballGames[i].level + ' дата: ' + ballGames[i].date.getFullYear() + '/' + ballGames[i].date.getMonth() + '/' + ballGames[i].date.getDate() + '  ' + ballGames[i].date.getHours() + ":" + ballGames[i].date.getMinutes() + ":" + ballGames[i].date.getSeconds();
              historyEl.append(pEl);
          }
          return;
      } else if (goodBallsEaten === numberOfGoodBalls) {
         
          gameLevel++;
          gameLevelEl.innerHTML = 'Ігровий рівень: ' + gameLevel;
          numberOfBalls++;
          startGame();
      } else {
          ctx.fillText("Всього: " + this.ballsArray.length, 420, 30);
          ctx.fillText("Гарні кульки : " + goodBallsEaten, 420, 50);
          ctx.fillText("Погані кульки : " + wrongBallsEaten, 420, 70);
      }
      ctx.restore();
  }
  move() {
      for (var i = 0; i < this.ballsArray.length; i++) {
          this.ballsArray[i].move(this.globalSpeedMutiplier);
          this.testCollisionWithPlayer(i);
      };
  }
  countNumberOfGoodBalls(colorToEat) {
      var nb = 0;

      for (var i = 0; i < this.ballsArray.length; i++) {
          if (this.ballsArray[i].color === colorToEat) {
              nb++;
          }
      };

      return nb;
  }
  testCollisionWithPlayer(index) {
      if (circRectsOverlap(player.x, player.y,
              player.width, player.height,
              this.ballsArray[index].x, this.ballsArray[index].y, this.ballsArray[index].radius)) {
          
          if (this.ballsArray[index].color === colorToEat) {
              
              goodBallsEaten += 1;
          } else {
              wrongBallsEaten += 1;
              if (wrongBallsEaten >= numberOfWrongBalls) {
                  gameState = "displayGameOverMenu";
              }
          }


          balls.ballsArray.splice(index, 1);
      }
  }
}

function getARandomColor() {
  var colors = ['red', 'blue', 'cyan', 'purple', 'pink', 'green', 'yellow'];
  
  var colorIndex = Math.round((colors.length - 1) * Math.random());
  var c = colors[colorIndex];

  
  return c;
}



function changeNbBalls(nb) {
  numberOfBalls = nb;
  startGame();
}

function changeNbWrongBalls(nb) {
  numberOfWrongBalls = nb;
  startGame();
}

function changeColorToEat(color) {
  colorToEat = color;
}



function changeBallSpeed() {
  balls.globalSpeedMutiplier = speedEl.value * 1;
}


var canvas, ctx, w, h;
var mousePos;

var historyEl;
var gameLevel;
var gameState;
var numberOfBalls;
var numberOfBallsEl;
var numberOfWrongBalls;
var numberOfWrongBallsEl;
var numberOfWrongBallsMax;
var gameLevelEl;
var restartEl;
var speedEl;

const goalkeeper = new Image();
goalkeeper.src = "942027.png";


var player = {
  x: 10,
  y: 10,
  width: 50,
  height: 50,
  color: 'green'
}

let colorToEat = 'red';


window.onload = function init() {


  canvas = document.querySelector("#myCanvas");

  if (localStorage.ballGames === undefined) {
      let ballGames = [];
      localStorage.ballGames = JSON.stringify(ballGames);
  }

  numberOfBallsEl = document.querySelector("#nbBalls");
  numberOfBalls = numberOfBallsEl.value * 1; 
  numberOfWrongBallsEl = document.querySelector("#nbWrongBalls");
  numberOfWrongBalls = numberOfWrongBallsEl.value * 1; 

  
  speedEl = document.querySelector("#ballSpeed");
  speedEl.addEventListener("input", changeBallSpeed);

  
  gameLevelEl = document.querySelector("#gameLevel");

  
  restartEl = document.querySelector("#restart");
  restartEl.addEventListener("click", init);

  
  historyEl = document.querySelector("#history");

  
  w = canvas.width;
  h = canvas.height;

  ctx = canvas.getContext('2d');

 
  gameLevel = 1;
 
  startGame();

  
  canvas.addEventListener('mousemove', mouseMoved);

  mainLoop();
};

function startGame() {
  do {
      balls = new Balls(numberOfBalls, speedEl.value * 1);
      initialNumberOfBalls = numberOfBalls;
      numberOfGoodBalls = balls.countNumberOfGoodBalls(colorToEat);
  } while (numberOfGoodBalls === 0);

  wrongBallsEaten = goodBallsEaten = 0;

  gameState = "gameRunning";

  
  gameLevelEl.innerHTML = 'Ігровий рівень: ' + gameLevel;

  
  restartEl.style.display = "none";

  
  historyEl.innerHTML = '';

}

 function mouseMoved(evt) {
  mousePos = getMousePos(canvas, evt);
} 


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
  };
}



function movePlayerWithMouse() {
  if (mousePos !== undefined) {
      player.x = mousePos.x;
      player.y = mousePos.y;
  }
}

function testCollisionPlayerWithWalls() {
  if(player.x + player.width > canvas.width){
        player.x = canvas.width - player.width;
    }
    if(player.x - player.width < 0){
        player.x = 0 + player.width;
    }
    if(player.y + player.height > canvas.height){
        player.y = canvas.height - player.height;
    }
    if(player.y - player.height < 0){
        player.y = 0 + player.height;
    }
}

function mainLoop() {
  ctx.clearRect(0, 0, w, h);

  drawFilledRectangle(player);
  balls.draw();
  balls.drawBallNumbers();
  if (gameState === "displayGameOverMenu") {
      return;
  }




  balls.move();

  movePlayerWithMouse();
  testCollisionPlayerWithWalls();
  

 
  requestAnimationFrame(mainLoop);
}


function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
  var testX = cx;
  var testY = cy;
  if (testX < x0) testX = x0;
  if (testX > (x0 + w0)) testX = (x0 + w0);
  if (testY < y0) testY = y0;
  if (testY > (y0 + h0)) testY = (y0 + h0);
  return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
}




function drawFilledRectangle(r) {
 
  ctx.save();

  ctx.translate(r.x, r.y);

  ctx.fillStyle = r.color;
  
  ctx.fillRect(0, 0, r.width, r.height);
  ctx.drawImage(goalkeeper, 0, 0, 50,50);
  ctx.restore();
}