
  'use strict';

  var firstEnemy, secondEnemy, thirdEnemy, allEnemies;

  var Enemy = function () {
    this.x;
    this.y;
    this.w = 101;
    this.h = 171;
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
    this.w = 101;
    this.h = 171;
    this.sprite = 'images/player.png';
    this.dead = false;
  };

  Player.prototype.collision = function() {

    if  (isCollisionWithFirstEnemy() || isCollisionWithSecondEnemy() || isCollisionWithThirdEnemy()) {

      this.reset();
      updatelives();

      if (availablelives === 0) {
        gameOver();
      }
    }

    function isCollisionWithFirstEnemy () {
      return (firstEnemy.x + firstEnemy.w - 25) > player.x && firstEnemy.x < (player.x + player.w - 25) && firstEnemy.y == (player.y + 2);
    }

    function isCollisionWithSecondEnemy () {
      return  (secondEnemy.x + secondEnemy.w - 25) > player.x && secondEnemy.x < (player.x + player.w - 25) && secondEnemy.y == player.y
    }

    function isCollisionWithThirdEnemy () {
      return thirdEnemy.x + thirdEnemy.w - 25 > player.x && thirdEnemy.x < (player.x + player.w - 25) && thirdEnemy.y == (player.y - 2)
    }
  };

  Player.prototype.update = function(dt) {
    var playerPosition = this;

    if (isPlayerOnTop()) {
      changeCurrentScore();
      this.reset();
    }

    function isPlayerOnTop () {
      return playerPosition.y < 11;
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
    (maxScore < currentScore) ? maxScore = currentScore : maxScore;
    setMaxScoreOnScreen(maxScore);
  }

  function setScoreOnScreen(score) {
    $('.js-score').text(score);
  }

  function setMaxScoreOnScreen(score) {
    $('.js-maxscore').text(score);
  }

  function setAvailableLivesOnScreen(lives) {
    $('.js-lives').text(lives);
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
    firstEnemy = new Enemy();
    firstEnemy.x = -101;
    firstEnemy.y = 62;

    secondEnemy = new Enemy();
    secondEnemy.x = -101;
    secondEnemy.y = 145;

    thirdEnemy = new Enemy();
    thirdEnemy.x = -101;
    thirdEnemy.y = 228;

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
    player.dead = true;
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