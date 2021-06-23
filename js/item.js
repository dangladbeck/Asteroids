function Item(Type)
{
	var frame = 0;
	var frameTimer = 0;
	var dx = Math.random() * 8 - 4;
	var dy = Math.random() * 8 - 4;
	var type = Type;
	var x;
	var y;
	
	x = Math.random() * 100;
	if (x > 50) x += 700;
	y = Math.random() * 100;
	if (y > 50) y += 380;
	

	this.getX = function()
	{
		return x;
	}

	this.getY = function()
	{
		return y;
	}

	this.getRadius = function()
	{
		return 10;
	}
	
	this.getType = function()
	{
		return type;
	}
	
	this.update = function()
	{
		frameTimer++;
		if (frameTimer >= 4)
		{
			frame++;
			if (frame >= 6) frame = 0;
			frameTimer = 0;
		}

		x += dx;
		y += dy;
		if (x < -20) x = canvas.width + 20;
		if (x > canvas.width + 20) x = -20;
		if (y < -20) y = canvas.height + 20;
		if (y > canvas.height + 20) y = -20;
	}

	this.draw = function(ctx)
	{
		if (type == 0) // life item
		{
			ctx.drawImage(game.imgItems, frame * 18, 0, 18, 29, x - 9, y - 15, 18, 29);
		}
		else
		{
			ctx.drawImage(game.imgItems, frame * 18, 29, 18, 29, x - 9, y - 15, 18, 29);
		}
	}
}