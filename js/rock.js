function Rock(Big, X, Y)
{
	var frame = 0;
	var frameTimer = 0;
	var rotationSpeed = Math.random() * 4 + 2;
	var rotation = Math.random() * Math.PI*2;
	var dx = Math.random() * 8 - 4;
	var dy = Math.random() * 8 - 4;
	var big = Big;
	var x;
	var y;
	if (big)
	{
		x = Math.random() * 100;
		if (x > 50) x += 700;
		y = Math.random() * 100;
		if (y > 50) y += 380;
	}
	else
	{
		x = X;
		y = Y;
	}


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
		if (big) return 20;
		else return 8;
	}
	
	this.isBig = function()
	{
		return big;
	}

	this.update = function()
	{
		frameTimer++;
		if (frameTimer >= rotationSpeed)
		{
			frame++;
			if (frame >= 16) frame = 0;
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
		//ctx.drawImage(game.imgRock, frame * 64, 0, 64, 64, x - 32, y - 32, 64, 64);
		var img = big ? game.imgRock : game.imgRock2;

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rotation);	
		ctx.drawImage(img, frame * 64, 0, 64, 64, -32, -32, 64, 64);
		ctx.restore();
	}
}