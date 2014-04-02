(function () {
			function setCss(el, styles){
				for(var i in styles){
					if( styles.hasOwnProperty(i) ){
						el.style[i] = styles[i];
					}
				}
				return el;
			}
			
			function makeEl(tagName, content, styles){
				var el = document.createElement(tagName);
				if( content ) el.innerHTML = content;
				if( styles ) setCss(el, styles);
				return el;
			}
			
			function text(el, txt){
				el.innerHTML = txt;
				return el;
			}
			
			function colorText(el, color, txt){
				el.innerHTML = txt;
				el.style.color = color;
				return el;
			}
			
			function bind(el, eventName, handler){
				if( el.attachEvent ){
					el.attachEvent("on" + eventName, handler);
				}else if(el.addEventListener){
					el.addEventListener(eventName, handler, false);
				}
			}
			
			function unbind(el, eventName, handler){
				if( el.detachEvent ){
					el.detachEvent("on", + eventName, handler);
				}else if(el.removeEventListener){
					el.removeEventListener(eventName, handler, false);
				}
			}
			
			
			
			function wormGame(cont, opt) {
				if (!opt) opt = {};
				var width = opt.width || 80;
				var height = opt.height || 25;
				var board = [];
				var spans = [];
				var score = 0;
				
				
				setCss(cont, {
					width: width * 12 + "px",
					height: height * 12 + "px",
					background: "black",
					color: "silver"
				});
				
				
				
				for (var i = 0; i < width; i++) {
					board[i] = [];
					spans[i] = [];
					for (var j = 0; j < height; j++) {
						board[i][j] = "";
						spans[i][j] = makeEl("span", "&nbsp;", {display:'block', width:'12px', height:'12px', margin:0, padding:0, float:'left', fontFamily:'monospace'});
					}
				}
				
				for (var i = 0; i < height; i++) for (var j = 0; j < width; j++) cont.appendChild(spans[j][i]);
				
				for (var i = 0; i < width; i++) {
					board[i][0] = "#";
					board[i][height - 1] = "#";
					
					colorText(spans[i][0], 'gray', '#');
					colorText(spans[i][height-1], 'gray', '#');
					
				}
				
				for (var j = 0; j < height; j++) {
					board[0][j] = "#";
					board[width - 1][j] = "#";
					
					colorText(spans[0][j], 'gray', '#');
					colorText(spans[width-1][j], 'gray', '#');
				}
				
				var curX = Math.floor(width / 2);
				var curY = Math.floor(height / 2);
				var oldX = curX;
				var oldY = curY;
				var lastX = curX;
				var lastY = curY;
				var curKey = "r";
				var gotApple = false;
				var gameEnd = false;

				function up() {
					curKey = "u"
				}
				function down() {
					curKey =
						"d"
				}
				function left() {
					curKey = "l"
				}
				function right() {
					curKey = "r"
				}
				function makeApple() {
					var applePos = {
						x: 0,
						y: 0
					};
					var cnt = 0;
					while (applePos.x == 0 && applePos.y == 0) {
						var x = Math.floor(Math.random() * width);
						var y = Math.floor(Math.random() * height);
						if (board[x][y] == "") {
							applePos = {
								x: x,
								y: y
							};
							board[x][y] = "$";
							colorText(spans[x][y], 'red', '$');
							
						} else {
							cnt++;
							if (cnt >= width * height) {
								gameEnd = true;
								return
							}
						}
					}
				}
				board[curX + 10][curY] = "$";
				colorText(spans[curX + 10][curY], 'red', '$');
				
				function update() {
					if (gameEnd) {
						endGame();
						return
					}
					oldX = curX;
					oldY = curY;
					colorText(spans[oldX][oldY], 'silver', '#');
					
					if (curKey) board[curX][curY] = curKey;
					switch (curKey) {
						case "u":
							curY--;
							break;
						case "d":
							curY++;
							break;
						case "l":
							curX--;
							break;
						case "r":
							curX++;
							break
					}
					
					colorText(spans[curX][curY], 'yellow', '@');
					
					if (curX == 0 || (curX == width - 1 || (curY == 0 || curY == height - 1))) {
						endGame();
						return
					}
					if (board[curX][curY] == "$") {
						gotApple = true;
						score++;
						makeApple()
					} else if (board[curX][curY] != "") {
						endGame();
						return
					}
					board[curX][curY] = curKey;
					if (!gotApple && board[lastX][lastY] != "") {
						text(spans[lastX][lastY], " ");
						var c = board[lastX][lastY];
						board[lastX][lastY] = "";
						switch (c) {
							case "u":
								lastY--;
								break;
							case "d":
								lastY++;
								break;
							case "l":
								lastX--;
								break;
							case "r":
								lastX++;
								break
						}
					}
					gotApple = false;
					board[curX][curY] = curKey;
					setTimeout(update, Math.max(50, 300 - score * 5))
				}
				this.keyHandler = function (evt) {
					var e = evt || window.event;
					if (e.keyCode == 38) up();
					else if (e.keyCode == 40) down();
					else if (e.keyCode == 37) left();
					else if (e.keyCode == 39) right();
					else if (e.keyCode == 27) {
						gameEnd = true;
						return false;
					}
					if( e.preventDefault ) e.preventDefault();
					e.returnValue = false;
					return false;
				};

				function endGame(hasWin) {
					if (!hasWin) alert("You lose!\nScore : " + score);
					else if (hasWin) alert("You win!!\nScore : " + score);
					unbind(document, "keydown", this.keyHandler);
					cont.parentNode.removeChild(cont);
					return
				}
				bind(document, "keydown", this.keyHandler);
				setTimeout(update, 1)
			}
			
			window.startWormGame = function (cont) {
				var game = new wormGame(cont);
			}
		})();
