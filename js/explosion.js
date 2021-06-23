function Explosion(X, Y, Player, Parent)
{
	var x = X;
	var y = Y;
	var frame = 0;
	var frameTimer = 0;
	var totalFrames = Player ? 64 : 20;
	var world = Parent;
	
	this.getDone = function()
	{
		return (frame > totalFrames);
	}

	this.update = function()
	{
		frameTimer++;
		if (frameTimer >= 4)
		{
			frame++;
			if (frame >= totalFrames)
			{
				world.removeExplosion(this);
				return; // done
			}
		}
	}

	this.draw = function(ctx)
	{
		if (totalFrames == 64)
		{
			ctx.drawImage(game.imgExplosionB, frame * 192, 0, 192, 192, x - 25, y - 25, 50, 50);	
		}
		else
		{
			ctx.drawImage(game.imgExplosionA, frame * 50, 0, 50, 50, x - 25, y - 25, 50, 50);	
		}
		
	}
}