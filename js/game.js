var game = 
{
	// global variables
	canvas: null,
	ctx: null,
	imgBG: new Image(),
	imgLogo: new Image(),
	imgIcons: new Image(),
	imgRock: new Image(),
	imgRock2: new Image(),
	imgPlayer: new Image(),
	imgItems: new Image(),
	imgBullet: new Image(),
	imgExplosionA: new Image(),
	imgExplosionB: new Image(),
	sndClick: new Audio(),
	sndShot: new Audio(),
	sndShield: new Audio(),
	sndItem: new Audio(),
	sndExplosionA: new Audio(),
	sndExplosionB: new Audio(),

	lives: 3,
	shield: 3,
	points: 0,
	level: 1
};

var currentScreen;
var resLoaded;

var transition = false;
var fadein = true;
var alpha = 0;

window.onload = function()
{
	// initialize canvas
	game.canvas = document.getElementById("canvas");
	game.canvas.addEventListener("click", onClick, false);
	addEventListener("keydown", onKeyDown, false);
	addEventListener("keyup", onKeyUp, false);
	game.ctx = game.canvas.getContext('2d');
	
	resLoaded = 0;
	
	// Load all resources, in the form:
	game.imgBG.src = "img/background.jpg";
	game.imgBG.onload = loadRes;
	game.imgLogo.src = "img/logo.png";
	game.imgLogo.onload = loadRes;
	game.imgRock.src = "img/rock.png";
	game.imgRock.onload = loadRes;
	game.imgRock2.src = "img/rock_small.png";
	game.imgRock2.onload = loadRes;
	game.imgIcons.src = "img/icons.png";
	game.imgIcons.onload = loadRes;
	game.imgPlayer.src = "img/spaceship.png";
	game.imgPlayer.onload = loadRes;
	game.imgItems.src = "img/items.png";
	game.imgItems.onload = loadRes;
	game.imgBullet.src = "img/fire_blue.png";
	game.imgBullet.onload = loadRes;
	game.imgExplosionA.src = "img/type_A.png";
	game.imgExplosionA.onload = loadRes;
	game.imgExplosionB.src = "img/type_B.png";
	game.imgExplosionB.onload = loadRes;
	
	game.sndShot.src = "snd/laser.ogg";
	game.sndShot.onloadeddata = loadRes;
	game.sndClick.src = "snd/click.ogg";
	game.sndClick.onloadeddata = loadRes;
	game.sndShield.src = "snd/shield.ogg";
	game.sndShield.onloadeddata = loadRes;
	game.sndItem.src = "snd/item.ogg";
	game.sndItem.onloadeddata = loadRes;
	game.sndExplosionA.src = "snd/explosionA.ogg";
	game.sndExplosionA.onloadeddata = loadRes;
	game.sndExplosionB.src = "snd/explosionB.ogg";
	game.sndExplosionB.onloadeddata = loadRes;
}

function loadRes()
{
	resLoaded++;	
	if (resLoaded == 16) // if this is the last resource loaded
	{
		run();	
	}
}

function run()
{
	document.getElementById("loadtxt").style.display = "none";
	game.canvas.style.display = "block";
	
	// set game loop - at fixed frame rate
	setInterval(loop, 1000 / 60); // 60 fps
	
	// begin with first screen
	currentScreen = new TitleScreen();
}

function loop()
{
	// call update and draw methods
    update();
    draw();
}

function update()
{
	currentScreen.update(); // update screen
	
	if (transition)
	{
		if (fadein)
		{
			alpha += 0.06;
			if (alpha >= 1)
			{
				alpha = 1;
				fadein = false;
				// change screen
				changeS();
			}
		}
		else
		{
			alpha -= 0.06;
			if (alpha <= 0)
			{
				transition = false;
				game.canvas.addEventListener("click", onClick, false);
				addEventListener("keydown", onKeyDown, false);
				addEventListener("keyup", onKeyUp, false);
			}
		}
	}
}

function draw()
{
	currentScreen.draw(game.ctx);  // draw current screen
	
	if (transition)
	{
		game.ctx.globalAlpha = alpha;
		game.ctx.fillStyle = "#000000";
		game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
		game.ctx.globalAlpha = 1;
	}
}

function onClick(e)
{
	currentScreen.onClick(e.offsetX, e.offsetY);	
}

function onKeyDown(e)
{
	currentScreen.onKeyDown(e.keyCode);
	e.preventDefault();
}

function onKeyUp(e)
{
	currentScreen.onKeyUp(e.keyCode);
	e.preventDefault();	
}

function changeScreen(next)
{
	nextScreen = next;
	fadein = true;
	alpha = 0;
	transition = true;
	game.canvas.removeEventListener("click", onClick, false);
	removeEventListener("keydown", onKeyDown, false);
	removeEventListener("keyup", onKeyUp, false);
}

function changeS()
{
	if (nextScreen == "title")
	{
		currentScreen = new TitleScreen();
	}
	if (nextScreen == "level")
	{
		currentScreen = new LevelScreen();
	}
	if (nextScreen == "gameover")
	{
		currentScreen = new GameOverScreen();
	}
}




