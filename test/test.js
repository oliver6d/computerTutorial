const textarea = document.getElementsByTagName('textarea')[0];
const buttons = document.getElementById('buttons');
const title_text = document.getElementById('title_text');
const logo_map = document.getElementById('logo_map');
const ribbon_map = document.getElementById('ribbon_map');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); 

//TODO: remove mouseover cheats from image map
// TODO: add intro and explanation
//TODO: don't highlight photo on wrong click
//TODO: skip when wrong answer clicked
//TODO: points for time
//TODO: scrolling

function skip_clicked(){
	nextStage(true);
}
function exit_clicked(){
	nextSection("finish");
}
function changeText(new_title){
	title_text.innerHTML = new_title;
}

function nextStage(failed){
	if(!failed && stage.name){
		SECTIONS["finish"].score += 1;
		section.score += 1;
		stage.score = 1;		
	}
	if(stage.next){
		stage = section.stages[stage.next];
		changeText(stage.text);
		if(stage.onStart) stage.onStart();
	} else{
		nextSection();
	}
}

function nextSection(newsection){
	if(newsection){
		section = SECTIONS[newsection];
	} else{
		section.totalTime = Math.floor((new Date()-startTime) / 1000);
		section = SECTIONS[section.next];
	}

	if(section.onStart) section.onStart();
	if(section.first){
		stage = section.stages[section.first];
		changeText(stage.text);
		if(stage.onStart) stage.onStart();
	}
	startTime = new Date();

}

function click_logo(item){
	if (item == stage.name) nextStage();
}

function contains(mouse, rect) {
	return  (rect.x <= mouse.x) && (rect.x + rect.w >= mouse.x) &&
	(rect.y <= mouse.y) && (rect.y + rect.h >= mouse.y);
}

function getMouse(e, drag){
	if (drag == undefined) drag = {x:0, y:0};
	var new_mouse = {
		x: e.pageX - clickOffset.x - (drag.x || 0), 
		y: e.pageY - clickOffset.y - (drag.y || 0)
	}
	return new_mouse;
}

clickOffset = {x:0, y:0};
box = {
	x:800, y:80,
	w:100, h:100,
};	
outline = {
	x:790, y:300,
	w:125, h:125,
}
var SECTIONS = {
	clicking_section: {
		name: "Clicking",
		score: 0,
		first: "single_click",
		next: "typing_section",
		totalTime: "",
		onStart: function(){
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			ctx.fillStyle = "hsl(30,80%,50%)";
			ctx.strokeStyle = "hsl(30,80%,50%)";
			ctx.lineWidth = 5;
			ctx.setLineDash([5,10]);
			ctx.fillRect(box.x, box.y, box.w, box.h);
			canvas.addEventListener('selectstart', function(e) { 
				e.preventDefault(); return false; 
			}, false);
		},
		stages: {
			single_click: {
				name: "single clicking",
				score: 0,
				text: "Click on the box",
				next: "double_click",
				onStart: function(){
					canvas.addEventListener('click', function(e) {
						if (contains(getMouse(e), box)) {
							nextStage();
							this.removeEventListener('click',arguments.callee,false);
						}
					});
				}
			}, double_click: {
				name: "double clicking",
				score: 0,
				text: "Double click the box",
				next: "right_click",
				onStart: function(){
					canvas.addEventListener('dblclick', function(e) {
						if (contains(getMouse(e), box)) {
							nextStage();
							this.removeEventListener('dblclick',arguments.callee,false);
						}
					});
				}
			}, right_click: {
				name: "right clicking",
				score: 0,
				text: "Right click the box",
				next: "drag",
				onStart: function(){
					canvas.addEventListener('contextmenu', function(e) {
						if (contains(getMouse(e), box)) {
							nextStage();
							this.removeEventListener('contextmenu',arguments.callee,false);
						}
					});
				}
			}, drag: {
				name: "dragging",
				score: 0,
				text: "Drag the box into the outlined area",
				onStart: function(){
					var dragging = false;
					var dragOffset = {x:0, y:0};
					var valid = false;
					setInterval(function draw() {
						if (!valid) {
							ctx.clearRect(0, 0, canvas.width, canvas.height);
							ctx.fillRect(box.x, box.y, box.w, box.h);
							ctx.strokeRect(outline.x,outline.y,outline.w,outline.h);
							valid = true;
						}
					}, 30);
					mousedown = canvas.addEventListener('mousedown', function(e) {
						mouse = getMouse(e);
						if (contains(mouse, box)) {
							dragging = true;
							dragOffset = {x: mouse.x - box.x,  y: mouse.y - box.y};
						}
					});
					mousemove = canvas.addEventListener('mousemove', function(e) {
						mouse = getMouse(e, dragOffset);
						if (dragging){
							box.x = mouse.x;
							box.y = mouse.y;   
							valid = false;
						}
					});
					canvas.addEventListener('mouseup', function(e) {
						if (dragging && contains(mouse, outline)) {
							this.removeEventListener('mousedown',mousedown);
							this.removeEventListener('mousemove',mousemove);
							this.removeEventListener('mouseup',arguments.callee);
							nextStage();
						}
						dragging = false;
					});
				}
			}
		}
	}, typing_section: {
		name: "Typing",
		score: 0,
		first: "space",
		next: "icons_section",
		totalTime: "",
		onStart: function(){
			canvas.style.display="none";
			textarea.style.display="inline";
		},
		stages: {
			space: {
				text: 'Type the sentence "Today is a nice day."' ,
				name: "space",
				score: 0,
				next: "capital",
				onStart: function(){
					textarea.addEventListener('keyup', function(event){
						if(event.key == " "){
							this.removeEventListener('keyup',arguments.callee);
							nextStage();
						}
					});
				},
			}, capital: {
				text: 'Type the sentence "Today is a nice day."' ,
				name: "capital",
				score: 0,
				next: "backspace",
				onStart: function(){
					textarea.addEventListener('keyup', function(){
						if (typing_scores.capitals){
							this.removeEventListener('keyup',arguments.callee);
							stage.score = 1;
							textarea.addEventListener('keyup', function(){
								if (typing_scores.period){
									this.removeEventListener('keyup',arguments.callee);
									nextStage();
								}
							});
						}
					});
				},
			}, backspace: {
				text: "Backspace the '.'" ,
				name: "backspace",
				score: 0,
				next: "exclamation",
				onStart: function(){
					textarea.addEventListener('keyup', function(event) {
						if(event.key == "Backspace"){
							this.removeEventListener('keyup',arguments.callee);
							nextStage();
						}
					});
				},
			}, exclamation: {
				text: "Type a '!'" ,
				name: "exclamation",
				score: 0,
				next: "highlight",
				onStart: function(){
					textarea.addEventListener('keyup', function(event) {
						if(event.key == "!"){
							this.removeEventListener('keyup',arguments.callee);
							nextStage();
						}
					});
				},
			}, highlight: {
				name: "highlight",
				score: 0,
				text: "Highlight the sentence" ,
				next: "copy",
				onStart: function(){
					textarea.addEventListener('click', function(){
						if(textarea.selectionEnd - textarea.selectionStart > 3){
							this.removeEventListener('click',arguments.callee);
							nextStage();
						}
					});
				},
			}, copy: {
				name: "copy & paste",
				score: 0,
				text: "Copy and Paste the sentence" ,
				onStart: function(){
					textarea.addEventListener('copy', function(){
						if(textarea.selectionStart != textarea.selectionEnd){
							this.removeEventListener('click',arguments.callee);
							textarea.addEventListener('paste', function(){
								this.removeEventListener('paste',arguments.callee);
								nextStage();
							});
						}
					});
				},
			}
		}
	}, icons_section: {
		name: "Icons",
		score: 0,
		first: "close",
		next: "applications_section",
		onStart: function(){
			textarea.style.display="none";
			ribbon_map.style.display="inline";
		},
		stages: {
			close: {
				name: "close",
				score: 0,
				text: "Click the button that would close the window",
				next: "bold",
			}, bold: {
				name: "bold",
				score: 0,
				text: "Click the button that would make your text bold",
				next: "size",
			}, size: {
				name: "size",
				score: 0,
				text: "Click the button that would change the size of text",
				next: "center",
			}, center: {
				name: "center",
				score: 0,
				text: "Click the button that would make text centered",
				next: "undo",
			}, undo: {
				name: "undo",
				score: 0,
				text: "Click the button that would undo an action",
				next: "save",
			}, save: {
				name: "save",
				score: 0,
				text: "Click the button that would save a file",
			}
		}
	}, applications_section: {
		name: "Apps",
		score: 0,
		first: "word",
		next: "finish",
		onStart: function(){
			ribbon_map.style.display="none";
			logo_map.style.display="inline";
		},
		stages: {
			word: {
				name: "word",
				score: 0,
				text: "Click the icon to open a word document",
				next: "excel",
			}, paint: {
				name: "paint",
				score: 0,
				text: "Click the icon to open a program to draw a picture",
				next: "settings",
			}, settings: {
				name: "settings",
				score: 0,
				text: "Click the icon to open computer settings",
				next: "gmail",
			}, google: {
				name: "google",
				score: 0,
				text: "Click the icon to a website for searching the internet",
			}, gmail: {
				name: "gmail",
				score: 0,
				text: "Click the icon to a website for emailing people",
				next: "youtube",
			}, youtube: {
				name: "youtube",
				score: 0,
				text: "Click the icon to a website for watching videos",
				next: "google",
			}
		}
	}, finish: {
		name: "Total",
		score: 0,
		onStart: function(){
			textarea.style.display="none";
			title_text.style.display="none";
			logo_map.style.display="none";
			ribbon_map.style.display="none";
			buttons.style.display="none";
			canvas.style.display="none";

			for(sectionname in SECTIONS){
				section = SECTIONS[sectionname];

				if(section.name == "Total"){
					var title = document.createElement("H3");
					title.innerHTML = section.name + ":   " + section.score;
					document.body.appendChild(title);
					break;
				}

				var column = document.createElement("DIV");
				document.body.appendChild(column);
				var title = document.createElement("H2");
				title.innerHTML = section.name + ":   " + section.score;
				column.appendChild(title);

				for(stagename in section.stages){
					stage = section.stages[stagename];
					var line = document.createElement("p");
					line.innerHTML = stage.name + ":   " + stage.score;
					column.appendChild(line);
				}
				if (section.totalTime){
					var line = document.createElement("p");
					line.innerHTML = "total time:   " + section.totalTime + "s";
					column.appendChild(line);
				}
			}
		}
	}
}

var section;
var stage;
var startTime;
nextSection("clicking_section");

var typing_scores = {
	capitals: 0,
	space: 0,
	period: 0,
	backspace: 0,
}
document.addEventListener('keydown', (event) => {
	var keyname = event.key;
	if(keyname==keyname.match("[A-Z]")){
		typing_scores.capitals = 1;
	}
	if(keyname==" "){
		typing_scores.space = 1;
	}
	if(keyname=="."){
		typing_scores.period = 1;
	}
	if(keyname=="Backspace"){
		typing_scores.backspace = 1;
	}
}, true);