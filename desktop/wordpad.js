//INTERNET: create gifs
//INTERNET: icons for Font color
//INTERNET: fix paste
//TODO: fix hover so that it points to button (popovers) OR highlight thing to click on
//TOOD: add '?' option to reopen help image
//TODO: add hint popover to font
//TODO: check that text is selected when using functions
//TODO: remove check for highlight on what doesnt need it
//*TODO: fix hint hover flashing on and off
//*TODO: buttons should be selected when selected text matches
//TODO:: other things: insert picture, link
//INTERNET: teach how to save
//TODO: close font or wait for selecting a font
//TODO TODO TODO right clicking
/*
function cursorEmphasis(x, y, ex, ey){
	var cursor = document.getElementById("cursor");
	cursor.setAttribute("style", "top:"+ ey +"px; left:" + ex +"px; opacity: 0.7;");
	cursor.style.transform = 'translate('+(x-ex)+'px, '+(y-ey)+'px)';
	setTimeout(function(){	
		cursor.setAttribute("style", "top:"+ y +"px; left:" + x +"px; opacity: 1; height: 40px");
		setTimeout(function(){
			cursor.setAttribute("style", "top:-20px; left:-20px; opacity: 0;");
			cursor.style.transform = '';
		}, 1500);
	}, 1000);
}
*/

function errorText(new_error){
	Metro.toast.create(
		new_error,null,null,null,
		{
			timeout: 2000,
			distance: 80,
			clsToast: "toast-box",
		});
}

var openboxes = [];
function nextStage(){
	openboxes.forEach((box)=>{box.close();});
	openboxes = [];
	stage = STAGES[stage.next];
	if(stage.dialog && stage.dialog_image){
		//TODO: add reopen dialog
		//TOFIX: fix dialog opens after making gifs
		Metro.infobox.create(
			'<div>'+stage.dialog+'</div>' + '<img class="dlg-img" src="' + stage.dialog_image +'">', "",
			{
				overlay: true,
				removeOnClose: true,
				bottom: "10em",
				clsBox: "dlg-box",
				height: "auto",
				onClose: function(){
					nextStage();
					textarea.focus();
				},
			});
	} else if(stage.dialog){
		//TODO: add reopen dialog
		//TOFIX: fix dialog opens after making gifs
		Metro.infobox.create(
			'<div>'+stage.dialog+'</div>', "",
			{
				overlay: true,
				removeOnClose: true,
				clsBox: "dlg-box",
				height: "auto",
				onClose: function(){
					nextStage();
					textarea.focus();
				},
			});
	}
	if (stage.help_text){
		Metro.infobox.create(
			'<p>'+stage.help_text+'</p>', "",
			{
				overlay: false,
				right: "20px",
				width: "300",
				removeOnClose: true,
				closeButton: false,
				onOpen: function(){
					openboxes.push($(this).data("infobox"));
				}
		    });
	}
	if (stage.help_image){
		Metro.infobox.create(
			'<img src="' + stage.help_image +'">', "",
			{
		        overlay: false,
		        right: "30px",
		        bottom: "50px",
		        width: "280",
		        clsBox: "image-box",
		        removeOnClose: true,
		        closeButton: false,
		        onOpen: function(){
		        	openboxes.push($(this).data("infobox"));
		        }
		    });
	}
	if (stage.timeout_text){
		thatstage = stage;
		setTimeout(function(){
			if(thatstage == stage)
				errorText(stage.timeout_text);
		}, 2000);
	}
	if(stage.onStart) stage.onStart();
}


const STAGES = {
	start:{
		next: "click",
	},
	click: {
		timeout_text: "click inside the window to add text",
		next: "type",
		onStart: function(){
			var listen = textarea.addEventListener('focus', function(){	//or click
				this.removeEventListener('focus',arguments.callee,false);
				nextStage();
			});
		},
	}, type: {
		timeout_text: "type more text",
		next: "highlight_dialog",
		onStart: function(){
			var numTyped = 0;
			textarea.addEventListener('keydown', function(){
				numTyped += 1;
				if (numTyped > 10){
					textarea.removeEventListener('keydown',arguments.callee,false);
					nextStage();
				}
				// set timeout for when done typing
			});
		},
	}, highlight_dialog: {
		dialog: "To select the text we will change, we highlight it. \
				This is done by clicking and dragging",
		dialog_image: "../images/animation/highlight.gif",
		next:"highlight",
	}, highlight: {
		help_text: "Click and drag on text to select it" ,
		help_image: "../images/trackpad/click_drag.gif",
		next: "bold",
		onStart: function(){
			textarea.addEventListener('click', function(){
				selected = window.getSelection();
				//if(Math.abs(selected.focusOffset - selected.anchorOffset) > 3){
					textarea.removeEventListener('click',arguments.callee,false);
					nextStage();
			});
		},
	}, bold: {
		help_text: "Click on bold to make text thick",
		next: "underline",
		onStart: function(){
			ribbon.findButton('bold').show();
			ribbon.findButton('bold').hoverOn();
			ribbon.findButton('bold').onClick(function(){
				//TODO: this removes listener even if failed distance
				nextStage();
			});
		},
	}, underline: {
		help_text: "Click on underline",
		next: "unbold",
		onStart: function(){
			//ribbon.findButton('underline').hoverOn();
			ribbon.findButton('underline').onClick(function(){
				//ribbon.findButton('underline').hoverOff();
				nextStage();
			});
		},
	}, unbold: {
		help_text: "Click on bold AGAIN to change it back",
		next: "hover_dialog",
		onStart: function(){
			ribbon.findButton('bold').hoverOn();
			ribbon.findButton('bold').onClick(function(){
					ribbon.findButton('bold').hoverOff();
					nextStage();
			});
		},
	}, hover_dialog: {
		dialog: "You can learn what something does by trying it, <br>\
			or move your cursor over it slowly for a hint.",
		//dialog_image: "../images/animation/hover.gif",
		next: "hover",
	// TODO: add more buttons here
	}, hover: {
		help_text: "Move your cursor over each of the buttons to see what they do",
		next: "dropdown_dialog",
		onStart: function(){
			var moused = 0;
			ribbon.findButton('list').show();
			for(var i=0;i<ribbon.panelButtons.length;i++) {
				button = ribbon.panelButtons[i];
				if (button.onMouseOver) button.onMouseOver(function(){
					moused += 1;
					if (moused == 7){
						this.removeEventListener('mouseover',arguments.callee,false);
						nextStage();
					}
				});
			}
		},
	}, dropdown_dialog: {
		dialog: "This is a dropdown. Click once to open it, and click again to select something.",
		dialog_image: "../images/animation/dropdown.gif",
		next: "font",
	}, font: {
		help_text: "Change the way text looks by clicking font",
		next: "undo",
		onStart: function(){
			ribbon.findButton('fontSize').show();
			ribbon.findButton('fontFamily').show();
			//ribbon.findButton('fontFamily').hoverOn();
			ribbon.findButton('fontFamily').onClick(function(){
					//ribbon.findButton('fontFamily').hoverOff();	
					nextStage();
			});
			//TODO: add a hover to dropdowns
			//errorText("keep mouse inside when selecting from dropdowns")
		},

// TODO: font size, font color

	}, undo: {
		help_text: "Pretend we made a mistake! Click undo.",
		next: "redo",
		onStart: function(){
			ribbon.findButton('undo').show();
			ribbon.findButton('redo').show();
			ribbon.findButton('undo').hoverOn();
			ribbon.findButton('undo').onClick(function(){
				ribbon.findButton('undo').hoverOff();
				nextStage();
			});
		},
	}, redo: {
		help_text: "Pretend we changed our mind.  Click redo.",
		next: "end",
		onStart: function(){
			ribbon.findButton('redo').hoverOn();
			ribbon.findButton('redo').onClick(function(){
				ribbon.findButton('redo').hoverOff();
				nextStage();
			});
		},
	}, copy_dialog: {
		dialog: "To make multiple of the same text we use copy and paste" ,
		dialog_image: "../images/animation/copypaste.gif" ,
		next: "copy",
	}, copy: {
		next: "paste",
		onStart: function(){
			clickListen = textarea.addEventListener('click', function(){
				if(textarea.selectionStart == textarea.selectionEnd){
					errorText("Oops! Clicking away will remove the highlight.");
				}
			});
			ribbon.findButton('copy').show();
			ribbon.findButton('paste').show();
			ribbon.findButton('copy').hoverOn();
			ribbon.findButton('copy').onClick(function(){
				textarea.removeEventListener('click',clickListen,false);
				ribbon.findButton('undo').hoverOff();
				nextStage();
			});
		},
	}, paste: {
		help_text: "Now click somewhere else and then paste",
		next: "end",
		onStart: function(){
			textarea.addEventListener('click', function(){
				if(textarea.selectionStart == textarea.selectionEnd){
					ribbon.findButton('paste').hoverOn();
					ribbon.findButton('paste').onClick(function(){
						ribbon.findButton('paste').hoverOn(); //TODO change to "paste AGAIN"
						ribbon.findButton('paste').onClick(function(){
							ribbon.findButton('paste').hoverOff();
							nextStage();
						});
					});
				} else {
					errorText("Click where you would like text to be placed, do not highlight")
				}
			});	
		},
	}, end: {
		//TODO: check that this works
		onStart: function(){
			textarea.removeEventListener('blur', giveFocus(),false);
		}
	},
	// TODO: save
}


var textarea;
var stage = STAGES.start;

//TODO: give error, explanation
document.addEventListener("drag", function(event) {
	errorText("You just dragged text from one space to another! Ctrl-Z will undo");
}, false);
giveFocus =  function(){
    textarea.focus();
};