function Spaceship(Parent)
{
	var parent = Parent;
	var x = 400.0;       // position x
	var y = 240.0;       // position y
	var dx = 0.0;        // x-move in the frame
	var dy = 0.0;
	var angle = 0.0;
	var angSpeed = 0.0;
	var thrust = false;
	var maxSpeed = 6;
	var speed = 0.0;
	var alive = true;
	var shield = false;
	var shieldTimer = 0;
	
	var frameNo = 0;
	var frameTimer = 0;

	this.destroy = function()
	{
		alive = false;	
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
		if (shield) return 25;
		else return 20;
	}
	
	this.shieldOn = function()
	{
		return shield;
	}
	
	this.update = function(keyState, oldKeyState)
	{
		if (!alive) return;
		
		// Input
		if (keyState[0]) // left
		{
			angSpeed = -3;
		}
		else
		{
			if (angSpeed < 0) angSpeed = 0;
		}
		if (keyState[1]) // right
		{
			angSpeed = 3;
		}
		else
		{
			if (angSpeed > 0) angSpeed = 0;
		}
		if (keyState[2]) // up - thrust
		{
			thrust = true;
		}
		else
		{
			thrust = false;
			frameNo = 0;
		}
		if (keyState[3] && !oldKeyState[3]) // ctrl - fire
		{
			parent.fireBullet(x, y, angle);
		}
		if (keyState[4] && !oldKeyState[4] && !shield && game.shield > 0) // space - shield
		{
			shield = true;
			shieldTimer = 0;
			game.shield--;
			game.sndShield.play();
		}
		
		
		
		angle += angSpeed;
	
		if (thrust)
		{
			dx += Math.cos(angle/180*Math.PI) * 0.2;
			dy += Math.sin(angle/180*Math.PI) * 0.2;
			
			// Jet Animation
			frameTimer++;
			if (frameTimer >= 2)
			{
				frameNo++;
				if (frameNo >= 3) frameNo = 0;
				frameTimer = 0;
			}
			
		}
		else
		{
			dx *= 0.99;
			dy *= 0.99;
		}
		speed = Math.sqrt(dx*dx+dy*dy);
		if (speed > maxSpeed)
		{
			dx *= maxSpeed/speed;
			dy *= maxSpeed/speed;
		}
		x += dx;
		y += dy;
		
		if (x < -20) x = canvas.width + 20; // 20 is the half of width and height of the sprite
		if (x > canvas.width + 20) x = -20;
		if (y < -20) y = canvas.height + 20; // 20 is the half of width and height of the sprite
		if (y > canvas.height + 20) y = -20;
		
		if (shield)
		{
			shieldTimer++;
			if (shieldTimer >= 30) // half a second
			{
				shield = false;	
			}
		}
	}


	this.draw = function(ctx)
	{
		if (!alive) return;
		
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate((angle+90) /180*Math.PI);	
		ctx.drawImage(game.imgPlayer, 0, frameNo * 43, 39, 43, -20, -20, 39, 43);	
		ctx.restore();
		
		if (shield)
		{
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = "#00FFFF";
			ctx.arc(x, y, 25, 0, 2 * Math.PI);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.lineWidth = 5;
			ctx.strokeStyle = "rgba(0,170,170,0.5)";
			ctx.arc(x, y, 22, 0, 2 * Math.PI);
			ctx.stroke();
		}
	}
}