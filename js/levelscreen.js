function LevelScreen()
{
	// variables
	var gameState = "start";
	var levelTime = (game.level * 30) * 60;
	var timer = 0;
	var alpha = 0;
	var fadein = true;
	var pause = false;
	var spaceship = new Spaceship(this);
	var bullets = [];
	var asteroids = [];
	var explosions = [];
	var powerup = null;
	
	var keyState = [false, false, false, false, false, false]; // left, right, up, ctrl, space, enter
	var oldKeyState;
	
	function collision(A, B)
	{
		var ax = A.getX();
		var ay = A.getY();
		var ar = A.getRadius();
		var bx = B.getX();
		var by = B.getY();
		var br = B.getRadius();

		return (bx - ax) * (bx - ax) + (by - ay) * (by - ay) < (br + ar) * (br + ar);
	}
	
	function playSound(sound)
	{
		if (!sound.paused && sound.currentTime > 0)
		{
			sound.pause();
			sound.currentTime = 0;
		}
		sound.play();
	}
	
	// public methods
	this.update = function()
	{
		if (gameState == "start")
		{
			if (alpha == 1)
			{
				timer++;
				if (timer >= 60)
				{
					alpha -= 0.08;
					fadein = false;	
				}
			}
			else if (fadein)
			{
				alpha += 0.08;
				if (alpha >= 1) alpha = 1;
			}
			else
			{
				alpha -= 0.08;
				if (alpha <= 0)
				{
					gameState = "play";
					// create asteroids
					for (var n = 0; n < game.level; n++)
					{
						asteroids[n] = new Rock(true); // big rocks
					}
					// item
					if (powerup == null)
					{
						if (game.lives < 3 && game.level % 3 == 0)
						{
							powerup = new Item(0);	// life
						}
						else if (game.shield < 3)
						{
							powerup = new Item(1);	// shield
						}
					}
					
				}
			}
			
			spaceship.update(keyState, oldKeyState);
			for (var n = 0; n < bullets.length; n++)
			{
				bullets[n].update();
			}
		}
		else if (gameState == "play")
		{
			if (keyState[5] && !oldKeyState[5]) // Pause
			{
				pause = !pause;
			}
			
			
			if (!pause)
			{
				levelTime--;
				if (levelTime <= 0) // TIME OVER
				{
					gameState = "timeover";
					timer = 0;
					return;
				}
				
				spaceship.update(keyState, oldKeyState);
				for (var n = 0; n < bullets.length; n++)
				{
					bullets[n].update();
				}
				for (var n = 0; n < asteroids.length; n++)
				{
					asteroids[n].update();
				}
				for (var n = 0; n < explosions.length; n++)
				{
					explosions[n].update();
				}
				if (powerup != null) powerup.update();			
				
				// collisions: spaceship vs item
				if (powerup != null && collision(spaceship, powerup))
				{
					if (powerup.getType() == 0) // life
					{
						game.lives++;
					}
					else // shield
					{
						game.shield++;
					}
					game.sndItem.play();
					powerup = null;
				}
				
				// collisions: spaceship vs rocks
				for (var n = 0; n < asteroids.length; n++)
				{
					if (collision(spaceship, asteroids[n]))
					{
						if (spaceship.shieldOn())
						{
							if (asteroids[n].isBig()) game.points += 20;
							else game.points += 10;
							playSound(game.sndExplosionB);
							explosions.push(new Explosion(asteroids[n].getX(), asteroids[n].getY(), false, this));
							asteroids.splice(n, 1);
						}
						else
						{
							playSound(game.sndExplosionA);
							explosions.push(new Explosion(spaceship.getX(), spaceship.getY(), true, this));
							spaceship.destroy();
							gameState = "dead";
							timer = 0;							
						}
						break;
					}
				}
				
				// collisions: bullets vs rocks
				for (var n = 0; n < bullets.length; n++)
				{
					for (var m = 0; m < asteroids.length; m++)
					{
						if (collision(bullets[n], asteroids[m]))
						{
							playSound(game.sndExplosionB);
							explosions.push(new Explosion(asteroids[m].getX(), asteroids[m].getY(), false, this));
							if (asteroids[m].isBig())
							{
								game.points += 20;
								asteroids.push(new Rock(false, asteroids[m].getX(), asteroids[m].getY()));  // small rocks
								asteroids.push(new Rock(false, asteroids[m].getX(), asteroids[m].getY()));	
							}
							else
							{
								game.points += 10;
							}
							asteroids.splice(m, 1);
							bullets.splice(n, 1);
							break;
						}
					}
				}
				// no more rocks: win
				if (asteroids.length == 0)
				{
					gameState = "win";
					timer = 0;
					alpha = 1.0;
				}
			}			
		}
		else if (gameState == "dead")
		{
			for (var n = 0; n < bullets.length; n++)
			{
				bullets[n].update();
			}
			for (var n = 0; n < asteroids.length; n++)
			{
				asteroids[n].update();
			}
			for (var n = 0; n < explosions.length; n++)
			{
				explosions[n].update();
			}
			if (powerup != null) powerup.update();
			
			timer++;
			if (timer >= 120)
			{
				timer = 0;				
				game.lives--;
				if (game.lives == 0)
				{
					changeScreen("gameover");
				}
				else
				{
					changeScreen("level"); // restart game
				}
			}
		}	
		else if (gameState == "win")
		{
			spaceship.update(keyState, oldKeyState);
			for (var n = 0; n < bullets.length; n++)
			{
				bullets[n].update();
			}
			for (var n = 0; n < explosions.length; n++)
			{
				explosions[n].update();
			}
			if (powerup != null) powerup.update();
			
			timer++;
			if (timer >= 180)
			{
				alpha -= 0.08;
				if (alpha <= 0)
				{
					gameState = "start";
					game.points += Math.floor(levelTime / 60) * 10;
					game.level++;
					levelTime = (game.level * 30) * 60;
					timer = 0;	
					fadein = true;
				}
			}
		}
		else if (gameState == "timeover")
		{
			timer++;
			if (timer >= 120)
			{
				timer = 0;				
				game.lives--;
				if (game.lives == 0)
				{
					changeScreen("gameover");
				}
				else
				{
					changeScreen("level"); // restart game
				}
			}
		}
		
		oldKeyState = keyState.concat();
	}
	
	this.fireBullet = function(x, y, angle)
	{
		playSound(game.sndShot);
		bullets.push(new Bullet(x, y, angle, this));
	}
	
	this.removeBullet = function(bullet)
	{
		bullets.splice(bullets.indexOf(bullet), 1);
	}
	this.removeExplosion = function(explosion)
	{
		explosions.splice(explosions.indexOf(explosion), 1);
	}
	
	// Writes leading zeros for a given number
	function zeroPad(num, places)
	{
  		var zero = places - num.toString().length + 1;
  		return Array(+(zero > 0 && zero)).join("0") + num;
	}
	
	// Formats time in tick to minutes and seconds
	function formatTime()
	{
		var minutes = Math.floor(levelTime / 60 / 60);
		var seconds = zeroPad(Math.floor(levelTime / 60) % 60, 2);
		
		return minutes + ":" + seconds;
	}
	
	this.draw = function(ctx)
	{
		ctx.drawImage(game.imgBG, 0, 0);
		
		for (var n = 0; n < bullets.length; n++)
		{
			bullets[n].draw(ctx);
		}
		spaceship.draw(ctx);
		for (var n = 0; n < asteroids.length; n++)
		{
			asteroids[n].draw(ctx);
		}
		if (powerup != null) powerup.draw(ctx);
		for (var n = 0; n < explosions.length; n++)
		{
			explosions[n].draw(ctx);
		}
		
		// HUD
		ctx.font = '15px eras';
		ctx.textAlign = "left";
		ctx.fillStyle = "#AAAAAA";		
		ctx.drawImage(game.imgIcons, 276, 0, 35, 32, 6, 6, 17, 16);
		ctx.fillText("X " + game.lives, 26, 20);		
		ctx.drawImage(game.imgIcons, 311, 0, 30, 32, 66, 6, 15, 16);
		ctx.fillText("X " + game.shield, 86, 20);		
		ctx.fillText(zeroPad(game.points, 6), 370, 20);
		ctx.fillText(formatTime(), 760, 20);
		
		
		
		
		if (gameState == "start")
		{
			ctx.font = '30px eras';
			ctx.textAlign = "center";
			ctx.fillStyle = "rgba(170,170,170," + alpha + ")";
			ctx.fillText("LEVEL " + game.level, 400, 200);
		}
		else if (gameState == "win")
		{
			ctx.font = '30px eras';
			ctx.textAlign = "center";
			ctx.fillStyle = "rgba(170,170,170," + alpha + ")";
			ctx.fillText("LEVEL COMPLETE", 400, 200);
			ctx.fillText("TIME BONUS: " + (Math.floor(levelTime / 60) * 10), 400, 240);
		}
		else if (gameState == "timeover")
		{
			ctx.font = '30px eras';
			ctx.textAlign = "center";
			ctx.fillStyle = "#AAAAAA";
			ctx.fillText("TIME OVER", 400, 240);
		}
		
		
		
		if (pause)
		{
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
			ctx.font = '30px eras';
			ctx.textAlign = "center";
			ctx.fillStyle = "#AAAAAA";
			ctx.fillText("PAUSE", 400, 240);
		}
	}
	
	
	
	this.onKeyDown = function(Key)
	{
		if (Key == 37) // left
		{
			keyState[0] = true;
		}
		else if (Key == 39) // right
		{
			keyState[1] = true;
		}
		else if (Key == 38) // up
		{
			keyState[2] = true;
		}
		else if (Key == 17) // left CTRL
		{
			keyState[3] = true;
		}
		else if (Key == 32) // space bar
		{
			keyState[4] = true;
		}
		else if (Key == 13 || Key == 27) // Enter or Esc
		{
			keyState[5] = true;
		}
	}
	
	this.onKeyUp = function(Key)
	{
		if (Key == 37) // left
		{
			keyState[0] = false;
		}
		else if (Key == 39) // right
		{
			keyState[1] = false;
		}
		else if (Key == 38) // up
		{
			keyState[2] = false;
		}
		else if (Key == 17) // left CTRL
		{
			keyState[3] = false;
		}
		else if (Key == 32) // space bar
		{
			keyState[4] = false;
		}
		else if (Key == 13 || Key == 27) // Enter or Esc
		{
			keyState[5] = false;
		}
	}
	
	this.onClick = function(X, Y)
	{
		
	}
}