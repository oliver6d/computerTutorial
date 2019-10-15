const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d'); 

const title_text = document.getElementById('title_text');
const help_text = document.getElementById('help_text');
const error_text = document.getElementById('error_text');
const buttons = document.getElementById('buttons');
const img = document.getElementById('img');

//TODO: add scrolling
//TODO: more rewarding clicks
//TOFIX: BUGGY - double click?
//TOFIX: fade in trackpad images

function practice_clicked(){
	buttons.style.display = "none"
	stage = STAGES.single_click;
	changeText(stage.help_text, stage.title);
	stage_success = false;
}

function changeText(new_help, new_title){
	help_text.innerHTML = new_help;
	if(new_title != undefined){
		title_text.innerHTML = new_title;
		error_text.innerHTML = "";
	}
}
function changeImage(){
	if(stage.img){
		img.src = stage.img;
	}
}

function errorText(new_error){
	if (stage != STAGES.next){
		error_text.innerHTML = new_error;
	}
}

function getColor(old){
	do{
		color = "hsl("+ Math.ceil(Math.random()*10) * 36 + ",80%,50%)";
	} while (color == old);
	return color;
}

// Determine if a point is inside the shape's bounds
function contains(mx, my, rect) {
	// Area between shape's X and (X + Width) and its Y and (Y + Height)
	return  (rect.x <= mx) && (rect.x + rect.w >= mx) &&
	(rect.y <= my) && (rect.y + rect.h >= my);
}

function getMouse(e, drag, old_mouse){
	if (drag == undefined) drag = {x:0, y:0};
	var new_mouse = {
		x: e.pageX - clickOffset.x - (drag.x || 0), 
		y: e.pageY - clickOffset.y - (drag.y || 0)
	}
	if (old_mouse != undefined){
		drag_distance += Math.sqrt(
			Math.pow(new_mouse.x - old_mouse.x, 2) + Math.pow(new_mouse.y - old_mouse.y, 2));
	}
	return new_mouse;
}

setInterval(function draw() {
	if (!valid) {
		ctx.font = "60px Verdana";
		ctx.textAlign = "center"; 
		ctx.fillText("Click on the shapes", window.innerWidth/2, 100);

		var shape = rectangle;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = shape.fill;
		ctx.fillRect(shape.x, shape.y, shape.w, shape.h);

		valid = true;

		/* if (this.selection != null) {	// outline
			ctx.strokeStyle = '#cc0000';
			ctx.lineWidth = this.selectionWidth;
			var mySel = this.selection;
			ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
		} */			
	}
}, 30);


function getLocation(shape){
	shape.x = Math.random()*500;
	shape.y = Math.random()*500;
}

var rectangle = {
	x:200, y:200,
	w:100, h:100,
	fill: "hsl(140,70%,50%)",
}
var shape = rectangle;
var mouse = {x: 0, y: 0};
var clickOffset = {x:0, y:0}; // if canvas had padding around it
var dragOffset = {x:0, y:0}; // Where in shape clicked
var dragging = false; // Keep track of when we are dragging
var clicking = false;
var drag_distance = 0;
var selection = null;	// Current selected object
var valid = false; // when set to false, the canvas will redraw everything

const STAGES = {
	moving: {
		help_text: "peleka mshale kwenye sanduku la kijani",
		//help_text: "move your cursor to the green box",
		img: "../images/trackpad/move_cursor.gif",
		next: "single_click",
		num_left: 2,
		//TODO: add cursor animation
	}, single_click: {
		//title: "Click on the box",
		//help_text: "Tap the trackpad with your finger" ,
		title: "bonyeza kwenye sanduku",
		help_text: "bonyeza kwenye sanduku" ,
		img: "../images/trackpad/tap.gif",
		next: "double_click",
		num_left: 1,
		//TODO: add cursor animation
	}, double_click: {
		//title: "Double click the box",
		//help_text: "Tap the trackpad twice quickly" ,
		title: "bonyeza mara mbili",
		help_text: "bonyeza mara mbili kwenye sanduku bila kupumzika" ,
		img: "../images/trackpad/double_tap.gif",
		next: "right_click",
		num_left: 2,
		//TODO: error when single click
	}, right_click: {
		//title: "Right click the box",
		//help_text: "PRESS down on the LOWER RIGHT corner of your trackpad" ,
		title: "bonyeza upande wa kulia wa sanduku",
		help_text: "bonyeza upande wa kulia wa trackpad kwenye sanduku" ,
		img: "../images/trackpad/right_click.gif",
		next: "drag",
		num_left: 1,
		//TODO: add personalized menu for right click "RIGHT CICKED!"
	}, drag: {
		//title: "Drag the box",
		//help_text: "Use your left hand to PRESS the lower left corner. <br> \
		//		At the same time, move the cursor with your right hand." ,
		title: "beba sanduku",
		help_text: "tumia mkono wa kushoto kubonyeza kwenye kona ya upande wa kushoto. <br> \
				kwa muda huohuo, peleka mshale kwa kutumia mkono wa kulia." ,
		img: "../images/trackpad/click_drag.gif",
		next: "next",
		num_left: 3,
	}, next: {
		//title: "Great job!",
		//help_text: "Now click on the \"next\" button to continue, or \"practice\" to restart." ,
		title: "bomba bomba!",
		help_text: "chagua unachotaka" ,
		//TODO: error when click something other than buttons
	}
	// TODO: scrolling

}
var stage = STAGES.moving;
var stage_success = false;

nextStage = function(){
	getLocation(shape);
	valid=false;
	if(stage.num_left > 0){
		//errorText("Great, do it again!");
		errorText("rudia tena");
		stage.num_left -= 1;
	} else {
		stage = STAGES[stage.next];
		if(stage == STAGES.next){
			img.style.display = "none";
			buttons.style.display = "block";
		}
		changeText(stage.help_text, stage.title);
		changeImage();
		stage_success = false;
	}
}

canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
canvas.addEventListener('contextmenu', function(e) {
	// Error: right clicking
	if (stage != STAGES.right_click){
		stage_success = false;
//		errorText("That was a RIGHT click.");
		errorText("hapo ulikuwa umebonyeza upande wa kulia");
	} else {
		//TODO add a right click menu for below
		e.stopPropogation();
	}
}, true);
canvas.addEventListener('dblclick', function(e) {
	double_clicking = false;
	// Error: double clicking
	if (stage != STAGES.double_click){
		stage_success = false;
//		errorText("That was a DOUBLE click.");
		errorText("hapo ulikuwa umebonyeza mara mbili");
	}
	// Error: moving during double click
	else if (drag_distance > 150){
		stage_success = false;
//		errorText("Do not move your cursor between clicks");
		errorText("usisogeze mshale ukiwa unabonyeza");
	}
}, true);

canvas.addEventListener('mousemove', function(e) {
	mouse = getMouse(e, dragOffset, mouse)		
	if (dragging){
		selection.x = mouse.x;
		selection.y = mouse.y;   
		valid = false; // Something's dragging so we must redraw
	}
	if (stage == STAGES.moving){
		if (contains(mouse.x, mouse.y, shape)) {
			nextStage();
		}
	}
}, true);
// DRAGGING:
canvas.addEventListener('click', function(e) {
	// Error: moving mouse during SINGLE click
	if (stage != STAGES.drag){
		if (drag_distance > 120){
			stage_success = false;
//			errorText("That was dragging. Do not move while clicking.");
			errorText("hiyo ilikuwa kubeba. usisogeze ukiwa unabonyeza.");
		} else if (drag_distance > 75){
			stage_success = false;
//			errorText("Do not move your cursor while clicking");
			errorText("usisogeze mshale ukiwa unabonyeza.");
		}
	}
	// Error: left clicking
	if (stage == STAGES.right_click){
		stage_success = false;
//		errorText("That was a left click.");
		errorText("hiyo ilikuwa upande wa kushoto.");
	}

	if(stage == STAGES.drag){
		// Error: not moving
		if(drag_distance < 200){
			stage_success = false;
//			errorText("You need to move your mouse");
			errorText("unatakiwa usogeze mshale");
		}
		// Error: moving after clicking
		drag_distance = 0;
		setTimeout(function(){ 
			if(drag_distance > 200){
				stage_success = false;
//				errorText("You must hold the button down while dragging.  Press with your left finger while using your other hand to move.");
				errorText("uatakiwa ushikilie kitufe wakati unabeba. bonyeza kwa kutumia kidole cha kushoto wakati mkono mwingine unasogeza.");
			}
		}, 750);
	}
}, true);
// INSIDE BOX:
canvas.addEventListener('mouseup', function(e) {
	clicking = false;
	dragging = false;
	mouse = getMouse(e);

	if (!contains(mouse.x, mouse.y, shape)) {
		// Error: not clicking inside of an object
//		errorText("Move your cursor to the green box");
		errorText("peleka mshale kwenye sanduku la kijani");
		stage_success = false;
	}
}, true);
canvas.addEventListener('mousedown', function(e) {
	mouse = getMouse(e);
	drag_distance = 0;

	// Wait to determine if success
	stage_success = true;
	//TOFIX: stage_success might not work
	//TOFIX: triple click passes anything

	setTimeout(function(){ 
		if(stage_success) nextStage();
	}, 700);

	// Error: single click lasting too long
	clicking = true;
	setTimeout(function(){ 
		if(stage == STAGES.single_click && clicking){
			stage_success = false;
//			errorText("That click lasted too long, they should be fast.");
			errorText("kubonyeza kumekaa sana,inatakiwa iwe haraka.");
		}
	}, 300);

	// Error: double click lasting too long
	double_clicking = true;
	setTimeout(function(){ 
		if(stage == STAGES.double_click && double_clicking){
			stage_success = false;
//			errorText("click TWICE with no pause between");
			errorText("bonyeza mara mbili bila kupumzika.");
		}
	}, 500);

	// What is being clicked?
	if (contains(mouse.x, mouse.y, shape)) {
		var mySel = shape;
		dragOffset = {x: mouse.x - mySel.x,  y: mouse.y - mySel.y};
		dragging = true;
		selection = mySel;
		valid = false;
		return;
	}
}, true);