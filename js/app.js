
  'use strict';

  var firstEnemy, secondEnemy, thirdEnemy, allEnemies;

  var Enemy = function (x, y) {
    this.x = x;
    this.y = y;
    this.width = 101;
    this.height = 171;
    this.speed = getRandomInt(100,200);
    this.sprite = getRandomEnemyImage();
  };

  Enemy.prototype.update = function(dt) {
    return (this.x < 500) ? this.x += this.speed * dt : this.x = -Math.random() * 300;
  };

  Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  function getRandomEnemyImage() {
      var enemies = ['images/enemy01.png', 'images/enemy02.png', 'images/enemy03.png'];
      return enemies[Math.floor((Math.random()*enemies.length))];
  }

  function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 10)) + min;
  }

  var Player = function () {
    this.x = 200;
    this.y = 400;
    this.width = 101;
    this.height = 171;
    this.sprite = 'images/player.png';
    this.dead = false;
  };

  Player.prototype.collision = function() {

    if  (this.isCollisionWithFirstEnemy() || this.isCollisionWithSecondEnemy() || this.isCollisionWithThirdEnemy()) {

      this.reset();
      updatelives();

      if (availablelives === 0) {
        gameOver();
        this.dead = true;
      }
    }
  };

  Player.prototype.isCollisionWithFirstEnemy = function() {
      return (firstEnemy.x + firstEnemy.width - 25) > this.x && firstEnemy.x < (this.x + this.width - 25) && firstEnemy.y == (this.y + 2);
  };

  Player.prototype.isCollisionWithSecondEnemy = function() {
      return  (secondEnemy.x + secondEnemy.width - 25) > this.x && secondEnemy.x < (this.x + this.width - 25) && secondEnemy.y == this.y;
  };

  Player.prototype.isCollisionWithThirdEnemy = function() {
      return thirdEnemy.x + thirdEnemy.width - 25 > this.x && thirdEnemy.x < (this.x + this.width - 25) && thirdEnemy.y == (this.y - 2);
  };


  Player.prototype.update = function(dt) {
    var playerPosition = this;

    if (playerPosition.y < 11) {
      changeCurrentScore();
      this.reset();
    }
  };

  function toggleDeadMessage() {
    $('.dead-message').toggleClass('is-hidden');
  }

  function togglePlayAgainButton() {
    $('.js-play-again').toggleClass('is-hidden');
  }

  function changeCurrentScore() {
    currentScore += 1;
    setScoreOnScreen(currentScore);
  }

  function changeMaxScore() {
    maxScore = Math.max(maxScore, currentScore);
    setMaxScoreOnScreen(maxScore);
  }

  function setText(selector, text) {
      $(selector).text(text);
  }

  function setScoreOnScreen(score) {
      setText('.js-score', score);
  }

  function setMaxScoreOnScreen(score) {
      setText('.js-maxscore', score);
  }

  function setAvailableLivesOnScreen(lives) {
      setText('.js-lives', lives);
  }

  Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  Player.prototype.handleInput = function(direction) {

      switch(direction) {
        case 'up':
          this.movePlayerUp();
          break;

        case 'down':
          this.movePlayerDown();
          break;

        case 'left':
          this.movePlayerLeft();
          break;

        case 'right':
          this.movePlayerRigth();
          break;
      }
  };

  Player.prototype.movePlayerUp = function() {
      return (this.y > 0)? this.y -= 85 : this.y;
  };

  Player.prototype.movePlayerDown = function() {
      return (this.y < 400)? this.y += 85 : this.y;
  };

  Player.prototype.movePlayerLeft = function() {
      return (this.x > 0)? this.x -= 100 : this.y;
  };

  Player.prototype.movePlayerRigth = function() {
      return (this.x < 400)? this.x += 100 : this.x;
  };

  Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
  };


  function updatelives() {
    availablelives -= 1;
    setAvailableLivesOnScreen(availablelives);
  }

  function _playAgain() {
    player.dead = false;
    Engine.init();
    currentScore = 0;
    availablelives = defaultlives;

    setScoreOnScreen(currentScore);
    setAvailableLivesOnScreen(availablelives);

    toggleDeadMessage();
    togglePlayAgainButton();
  }

  function initEnemies() {
    firstEnemy = new Enemy(-101, 62);
    secondEnemy = new Enemy(-101, 145);
    thirdEnemy = new Enemy(-101, 228);

    allEnemies = [firstEnemy, secondEnemy, thirdEnemy];
  }

  var player = new Player();

  var defaultlives = 3;
  var availablelives = defaultlives;
  var currentScore = 0;
  var maxScore = 0;

  setAvailableLivesOnScreen(availablelives);
  setScoreOnScreen(currentScore);

  $('.control-panel').on('click', '.js-play-again', _playAgain);

  function gameOver() {
    toggleDeadMessage();
    togglePlayAgainButton();
    changeMaxScore();
  }

  document.addEventListener('keyup', function(e) {
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
  });