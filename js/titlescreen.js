function TitleScreen()
{
	// variables
	var title = true;
	var frame = 0;
	var frameTimer = 0;
	var alpha = 0.0;
	
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
		alpha += 0.05;
		if (Math.sin(alpha) < 0.2) alpha = 0.2;
		
		frameTimer++;
		if (frameTimer >= 4)
		{
			frame++;
			if (frame >= 16) frame = 0;
			frameTimer = 0;
		}
	}
	
	this.draw = function(ctx)
	{
		ctx.drawImage(game.imgBG, 0, 0, 800, 480);
		
		if (title) // if showing title logo
		{			
			ctx.drawImage(game.imgLogo, 245, 211);
			ctx.drawImage(game.imgRock, frame * 64, 0, 64, 64, 416, 211, 64, 64);
			
			ctx.font = '30px eras';
			ctx.textAlign = "center";
			ctx.fillStyle = "rgba(170,170,170," + Math.sin(alpha) + ")";
			ctx.fillText("CLICK TO BEGIN", 400, 430);
		}
		else  // if showing options
		{
			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
			
			ctx.fillStyle = "#AAAAAA";
			ctx.textAlign = "center";
			ctx.fillText("HOW TO PLAY", 400, 30);
			
			ctx.textAlign = "left";
			ctx.drawImage(game.imgIcons, 0, 0, 58, 32, 28, 90, 58, 32);
			ctx.fillText("ROTATE", 100, 115);
			ctx.drawImage(game.imgIcons, 58, 0, 29, 32, 44, 130, 29, 32);
			ctx.fillText("THRUST", 100, 155);
			ctx.drawImage(game.imgIcons, 87, 0, 37, 32, 40, 170, 37, 32);
			ctx.fillText("FIRE", 100, 195);
			ctx.drawImage(game.imgIcons, 124, 0, 74, 32, 20, 210, 74, 32);
			ctx.fillText("SHIELD (LIMITED)", 100, 235);
			ctx.drawImage(game.imgIcons, 198, 0, 47, 32, 36, 250, 47, 32);
			ctx.fillText("PAUSE", 100, 275);			
			
			ctx.fillText("YOU", 500, 90);
			ctx.drawImage(game.imgPlayer, 0, 0, 44, 38, 570, 110, 44, 38);
			ctx.fillText("GET", 500, 190);
			ctx.drawImage(game.imgItems, 0, 0, 18, 29, 570, 210, 18, 29);
			ctx.drawImage(game.imgItems, 0, 29, 18, 29, 600, 210, 18, 29);
			ctx.fillText("AVOID/DESTROY", 500, 290);
			ctx.drawImage(game.imgRock, frame * 64, 0, 64, 64, 560, 300, 64, 64);
			ctx.fillText("BEFORE THE TIME RUNS OUT", 380, 390);
			
			ctx.fillText("BACK", 30, 470);
			ctx.fillStyle = "rgba(170,170,170," + Math.sin(alpha) + ")";
			ctx.fillText("START", 670, 470);
		}
	}
	
	this.onKeyDown = function(Key) { }
	
	this.onKeyUp = function(Key) { }
	
	this.onClick = function(X, Y)
	{
		if (title) // if showing title logo
		{
			playSound(game.sndClick);
			title = false;
		}
		else  // if showing options
		{
			if (X >= 30 && X <= 110 && Y >= 440 && Y <= 470)
			{
				playSound(game.sndClick);
				title = true;
			}
			else if (X >= 670 && X <= 780 && Y >= 440 && Y <= 470)
			{
				playSound(game.sndClick);
				game.lives = 3;
				game.shield = 3;
				game.points = 0;
				game.level = 1;
				changeScreen("level");
			}
		}
	}
}