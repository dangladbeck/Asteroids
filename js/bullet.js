function Bullet(X, Y, A, Parent)
{
	var x = X;
	var y = Y;
	var angle = A;
	var dx = Math.cos(angle/180*Math.PI) * 10;
	var dy = Math.sin(angle/180*Math.PI) * 10;
	var ttl = 30; // time to live
	var world = Parent;

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
		return 5;
	}

	this.update = function()
	{
		x += dx;
		y += dy;		
		
		if (x < -8) x = canvas.width + 8; // 8 is the half of width and height of the sprite
		if (x > canvas.width + 8) x = -8;
		if (y < -8) y = canvas.height + 8; // 8 is the half of width and height of the sprite
		if (y > canvas.height + 8) y = -8;
		
		ttl--;
		if (ttl <= 0) world.removeBullet(this);
	}

	this.draw = function(ctx)
	{
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((angle+90) /180*Math.PI);	
		ctx.drawImage(game.imgBullet, 0, 0, 32, 64, -10, -4, 16, 32);
		ctx.restore();
	}
}