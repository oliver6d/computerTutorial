var Desktop = {
    options: {
        windowArea: ".window-area",
        windowAreaClass: "",
        taskBar: ".task-bar > .tasks",
        taskBarClass: ""
    },

    openWindows: {},

    setup: function(options){
        this.options = $.extend( {}, this.options, options );   //add extra options        
        return this;
    },

    addToTaskBar: function(wnd){
        var wID = wnd.win.attr("id");
        var item = $('<span' + wnd.options.popover +'>').addClass("task-bar-item started").html(wnd.getIcon());
        item.click(()=>{
            if(item.hasClass('minimized')){
                item.removeClass("minimized"); // uncolor in taskbar
                wnd.win.removeClass("minimized"); // open window
                item.data('popover').hide();
                item.data('popover').options.popoverText = "click to minimize";
            }
            else {
                item.addClass("minimized"); // color in taskbar
                wnd.win.addClass("minimized"); // minimize window
                item.data('popover').hide();
                item.data('popover').options.popoverText = "click to open";
            }
        });
        item.data("wID", wID);
        item.appendTo($(this.options.taskBar));
    },

    minimizeToTaskBar: function(wnd){
        var wID = wnd.win.attr("id");
        var that = this;
        $.each($(".task-bar-item"), function(){
            var item = $(this);
            if (item.data("wID") === wID) {
                item.addClass("minimized"); // color in taskbar
                item.data('popover').show();
                item.data('popover').options.popoverText = "click to open";
            }
        })
    },

    removeFromTaskBar: function(win){
        var wID = win.attr("id");
        var that = this;
        $.each($(".task-bar-item"), function(){
            var item = $(this);
            if (item.data("wID") === wID) {
                delete that.openWindows[wID];
                item.remove();
            }
        })
    },

    goFullscreen: function(){
        addEventListener("click", function() {
            var el = document.documentElement, rfs = el.requestFullScreen
            || el.webkitRequestFullScreen || el.mozRequestFullScreen;
            rfs.call(el);
        });
        //TODO: their computer's taskbar should be hidden, not cover the new one
    },

    createWindow: function(o){
        var that = this;
        o.onDragStart = function(pos, el){
            win = $(el);
            $(".window").css("z-index", 1);
            if (!win.hasClass("modal"))
                win.css("z-index", 3);
        };
        o.onDragStop = function(pos, el){
            win = $(el);
            if (!win.hasClass("modal"))
                win.css("z-index", 2);
        };
        o.onWindowDestroy = function(win){
            that.removeFromTaskBar(win);
        };

        // create window and put in DOM
        var w = $("<div>").appendTo($(this.options.windowArea));
        var wnd = w.window(o).data("window");
        // move each successive window to a different location
        if (wnd.options.place === "auto" && wnd.options.top === "auto" && wnd.options.left === "auto") {
            wnd.win.css({
                top: Metro.utils.objectLength(this.openWindows) * 32 + 50,
                left: Metro.utils.objectLength(this.openWindows) * 32 + 50
            });
        }

        this.openWindows[wnd.win.attr("id")] = wnd;
        this.addToTaskBar(wnd);
        return wnd;
    }
};


$(".window-area").on("click", function(){
    Metro.charms.close("#charm");
});

$(".charm-tile").on("click", function(){
    $(this).toggleClass("active");
});


function createObjectWindow(){
    var index = Metro.utils.random(0, 3);
    Desktop.createWindow({
        resizable: true, draggable: true,
        width: 800, height: 300,
        icon: "<span class='mif-question'></span>",
        title: "Tutorial",
        place: "center",
        content: '<object type="text/html" data="calculator.html" width="100%" height="100%">'
    });
}

function createChromeWindow(){
    var index = Metro.utils.random(0, 3);
    Desktop.createWindow({
        resizable: true, draggable: true,
        width: 800, height: 300,
        icon: "<span class='mif-question'></span>",
        title: "Web Browser",
        place: "center",
        clsWindow: "search",
        content: '\
        <input id="addressbar" class="address place-left" type="text" data-role="input" data-prepend="Website:">\
        <!-input id="searchbar" class="place-right" type="text" data-role="input" data-search-button="true"-->\
        <iframe is="x-frame-bypass" id="frame" src="https://www.google.com" width="100%" height="100%"></iframe>',
        //TODO: should this be one combined input box?
        //TODO: add a refresh button
        //TODO: add tabs
        //TODO: add back button
        onWindowCreate: function(){
            input = document.getElementById("addressbar");
            iframe = document.getElementById("frame");
            input.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {   //enter
                    //iframe.setAttribute("src", input.value);
                    link = "http://www.google.com/search?q=" + input.value.replace(' ','+');
                    iframe.setAttribute("src", link);
                    /*
                    $.ajax({
                        type: 'HEAD',
                        url: input.value,
                        success: function() {
                            iframe.setAttribute("src", input.value);
                        },
                        error: function() {
                            link = "http://www.google.com/search?q=" + input.value.replace(' ','+');
                            iframe.setAttribute("src", link);
                        }
                    });
                    */
                }
            });
        }
    });
}


//TODO: make it able to open more than one wordpad window at once
function createWordPadWindow(){
    var index = Metro.utils.random(0, 3);
    Desktop.createWindow({
        resizable: true, draggable: true,
        width: 600, height: 400,
        icon: "<span class='mif-question'></span>",
        title: "Word Processor",
        place: "center",
        clsWindow: "wordpad",
        content: '\
<nav data-role="ribbonmenu">\
    <ul class="tabs-holder">\
        <li><a href="#home-section">Home</a></li>\
    </ul>\
    <div class="content-holder">\
    <div class="section" id="home-section">\
        <div class="group" id="file_group" style="display:none;"><span class="title">File</span></div>\
        <div class="group" id="edit_group" style="display:none;"><span class="title">Edit</span></div>\
        <div class="group" id="font_group" style="display:none;"><span class="title">Font</span></div>\
        <div class="group" id="paragraph_group" style="display:none;"><span class="title">Paragraph</span></div>\
        <div class="group" id="insert_group" style="display:none;"><span class="title">Insert</span></div>\
    </div>\
    </div>\
</nav>\
<textarea id="area1" data-role="textarea" data-clear-button="false"></textarea>\
',
        onWindowCreate: function(){
            myNicEditor = new nicEditor().panelInstance('area1');
            ribbon = myNicEditor.nicPanel;
            textarea = document.getElementById("textarea");
            textarea.innerHTML = "Let's learn how to use a word processor. <br> Start by typing some more text:";
            textarea.addEventListener('blur', function(){
                textarea.focus();
            });
            nextStage();
        }
    });
}

function createOptionsWindow(){
    var newwin = Desktop.createWindow({
        resizable: true,
        draggable: true,
        width: 300,
        icon: "<span class='mif-cogs'></span>",
        title: "Modal window",
        content: "<div class='p-2'>This is desktop demo created with Metro 4 Components Library</div>",
        overlay: true,
        //overlayColor: "transparent",
        place: "center",
        onClose: function(win){
            win.addClass("ani-swoopOutTop");
        },
        actions: [
            {
                caption: "Agree",
                cls: "js-dialog-close alert",
                onclick: function(){
                    alert("You clicked Agree action");
                }
            },
            {
                caption: "Disagree",
                cls: "js-dialog-close",
                onclick: function(){
                    alert("You clicked Disagree action");
                }
            }
        ],
    });
}


function openDialog(dial_str){
    dial = TUTORIAL[dial_str];
    Metro.dialog.create({
        title: dial.title,
        content: dial.content,
        onClose: dial.nextDial
    });
}

//TODO: Resize horizontal, vertical
//TOOD: change cursor when resizing
function openFirstWindow(){
    step = 0;
    wnd = Desktop.createWindow({
        popover:  ' data-role="popover" data-cls-popover="popover" data-popover-text="click to minimize"',
        btnClose:false,
        btnMin: false,
        btnMax: false,
        resizable: true,
        draggable: true,
        icon: "<span class='mif-info'></span>",
        width: 300,
        title: "My first window",
        content: '<div>Drag this window by clicking and holding on the blue bar above</div>',
        clsWindow: 'firstWindow',
        place:"center",
        onDragMove: (e)=>{
            //TODO: make drag further
            if (step == 0){ step++;
                $('.firstWindow .window-content div').text('Now resize by dragging the green corner ◢');
            }
        },
        onResize: (e)=>{
            //TODO: make resize more
            if (step == 1){ step++
                $('.firstWindow .window-caption .buttons').append('<span class="button btn-max sys-button"></span>');
                $('.firstWindow .window-content div').text('Make the window full screen by clicking the box 🗖');
            }
        },
        onMaxClick: (e)=>{
            if (step == 2){ step++;
                $('.firstWindow .window-content div').text('Click the same button again to make the window smaller ❐');
            }
            else if (step == 3){ step++;
                $('.firstWindow .window-caption .buttons').append('<span class="button btn-min sys-button"></span>');
                $('.firstWindow .window-content div').text('Click the minimize button to hide the window in the task bar 🗕');
                // add animation to task bar
                // add hint
            }
        },
        onMinClick: (e)=>{
            if (step == 4){ step++;
                $('.firstWindow .window-caption .buttons').append('<span class="button btn-close sys-button"></span>');
                $('.firstWindow .window-content div').text('finally, click the x to close ✖');
            }
            Desktop.minimizeToTaskBar(wnd);
        },
    });
}

const TUTORIAL = {
    welcome1: {
        title: "Welcome to the desktop",
        content: "<div>(click ok to continue)</div>",
    /*
        nextDial: ()=>{ openDialog("welcome2"); }
    }, welcome2: {
        title: " This is where you view apps",
    */
        nextDial: ()=>{ openFirstWindow(); }
    }, welcome3: {
        title: "Your First Window",
    }};


function openCharm() {
    var charm = $("#charm").data("charms");
    charm.toggle();
}



//TODO: uncommet
Desktop.setup();
Desktop.goFullscreen();
openDialog("welcome1");
