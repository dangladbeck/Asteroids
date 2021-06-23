function GameOverScreen()
{
	
	
	// public methods
	this.update = function()
	{
		
	}
	
	this.draw = function(ctx)
	{
		ctx.drawImage(game.imgBG, 0, 0, 800, 480);
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
		
		ctx.font = '30px eras';
		ctx.textAlign = "center";
		ctx.fillStyle = "#AAAAAA";
		ctx.fillText("GAME OVER", 400, 200);
		ctx.fillText("CLICK TO RETURN", 400, 430);
		
		ctx.font = '15px eras';
		ctx.fillText("SCORE: " + game.points, 400, 230);
	}
	
	this.onKeyDown = function(Key) { }
	
	this.onKeyUp = function(Key) { }
	
	this.onClick = function(X, Y)
	{
		game.sndClick.play();
		changeScreen("title");
	}
}