//cell_size ==> 网格的边长
var cell_size = 15;
//rows ==> 总行数
var rows = 30;
//cols ==> 总列数
var cols = 30;

//绘图对象
var canvas = null;
var ctx = null;

//当前要下降的形状数据
var currentFall = null;

//是否运行态
var isPlaying = true;
//计时 
var curTime = null;
//最大分数
var maxScore = null;
//当前分数
var curScore = null;
//当前速度
var curSpeed = null;

//背景颜色，黑色
var defBackGroundColor = "#080808";
//线体颜色，白色
var defLineColor = "#fbf8f8";

var createCanvas = function(rows,cols,cell_size) {
	canvas = document.createElement("canvas");
	canvas.width = cols * cell_size;
	canvas.height = rows * cell_size;
	canvas.style.border = "1px solid " + "#fbf8f8";

	ctx = canvas.getContext("2d");
	//创建路径
	ctx.beginPath();
	//绘制横向网格
	for (var i = 1; i < rows; i++) {
		ctx.moveTo(0, i * cell_size);
		ctx.lineTo(cols * cell_size, i * cell_size);
	}
	//绘制纵向网格
	for (var i = 1; i < cols; i++) {
		ctx.moveTo(i * cell_size, 0);
		ctx.lineTo(i * cell_size, rows * cell_size);
	}

	//关闭路径
	ctx.closePath();
	//设置线条颜色
	ctx.strokeStyle = defLineColor;
	//设置线宽
	ctx.lineWidth = 0.1;
	//绘制
	ctx.stroke();
}

//定义7种形状
var blockArr = [
	//1. Z方块
	[
		{x:cols/2 -1, y:0, color:"#304df1"},
		{x:cols/2 , y:0, color:"#304df1"},
		{x:cols/2 , y:1, color:"#304df1"},
		{x:cols/2 +1 , y:1, color:"#304df1"}
	],
	//2. 反Z方块
	[
		{x:cols/2 +1, y:0, color:"#ffc107"},
		{x:cols/2 , y:0, color:"#ffc107"},
		{x:cols/2 , y:1, color:"#ffc107"},
		{x:cols/2 -1, y:1, color:"#ffc107"}
	],
	//3. 田方块
	[
		{x:cols/2 -1, y:0, color:"#03a9f4"},
		{x:cols/2 , y:0, color:"#03a9f4"},
		{x:cols/2 -1 , y:1, color:"#03a9f4"},
		{x:cols/2 , y:1, color:"#03a9f4"}
	],
	//4. L方块
	[
		{x:cols/2 -1, y:0, color:"#ffeb3b"},
		{x:cols/2 -1, y:1, color:"#ffeb3b"},
		{x:cols/2 -1 , y:2, color:"#ffeb3b"},
		{x:cols/2 , y:2, color:"#ffeb3b"}
	],
	//5. J方块
	[
		{x:cols/2 , y:0, color:"#2fa734"},
		{x:cols/2 , y:1, color:"#2fa734"},
		{x:cols/2  , y:2, color:"#2fa734"},
		{x:cols/2 -1, y:2, color:"#2fa734"}
	],
	//6. |方块
	[
		{x:cols/2 , y:0, color:"#d81507"},
		{x:cols/2 , y:1, color:"#d81507"},
		{x:cols/2  , y:2, color:"#d81507"},
		{x:cols/2 , y:3, color:"#d81507"}
	],
	//7. _|_方块
	[
		{x:cols/2 , y:0, color:"#9c27b0"},
		{x:cols/2 , y:1, color:"#9c27b0"},
		{x:cols/2 -1 , y:1, color:"#9c27b0"},
		{x:cols/2 +1, y:1, color:"#9c27b0"}
	]
];

//初始化所有表格NxM，都标记为0，表示没有元素覆盖
var poi = new Array();
for (var i = 0; i < rows; i++) {
	poi[i] = new Array();
	for (var j = 0; j < cols; j++) {
		poi[i][j] = 0;
	}
}

var initBlock = function(){
	//随机得到1~7之间的数，Math.random()表示得到0~1之间的随机数，Math.floor()表示向下取整
	var rand = Math.floor(Math.random() * blockArr.length);
	currentFall = [
		{x:blockArr[rand][0].x, y:blockArr[rand][0].y, color:blockArr[rand][0].color},
		{x:blockArr[rand][1].x, y:blockArr[rand][1].y, color:blockArr[rand][1].color},
		{x:blockArr[rand][2].x, y:blockArr[rand][2].y, color:blockArr[rand][2].color},
		{x:blockArr[rand][3].x, y:blockArr[rand][3].y, color:blockArr[rand][3].color}
	];

	/*
	//初始化时，绘制，感觉从第一行出现，要不要都行
	for (var i = 0; i < currentFall.length; i++) {
		ctx.fillStyle = currentFall[i].color;
		ctx.fillRect(currentFall[i].x * cell_size, currentFall[i].y* cell_size,
		 cell_size,cell_size
		 );
	}*/
}

var moveDown = function(){
	var canDown = true;
	for (var i = 0; i < currentFall.length; i++) {
		// 判断，若已经到最下面，结束向下运动过程
		if (currentFall[i].y >= rows -1) {
			canDown = false;
			break;
		}

		//判断，若下方有方块，结束向下运动过程
		if (poi[currentFall[i].y+1][currentFall[i].x] != 0) {
			canDown = false;
			break;
		}
	}
	if (canDown) {
		//向下前，每个块变成背景色
		for (var i = 0; i < currentFall.length; i++) {
			ctx.fillStyle = defBackGroundColor;
			ctx.fillRect(currentFall[i].x * cell_size + 1,
				currentFall[i].y * cell_size + 1,
				cell_size - 2, cell_size - 2);
		}

		//自身的块向下一格
		for (var i = 0; i < currentFall.length; i++) {
			currentFall[i].y ++;
		}

		//绘制
		for (var i = 0; i < currentFall.length; i++) {
			ctx.fillStyle = currentFall[i].color;
			ctx.fillRect(currentFall[i].x * cell_size + 1,
			currentFall[i].y * cell_size + 1,
				cell_size - 2, cell_size - 2);
		}
	} else {
		for (var i = 0; i < currentFall.length; i++) {
			//到顶，说明输了，保存当前分数
			if (currentFall[i].y < 2) {
				//清除原有的当前分数，速度，位置点
				localStorage.removeItem("curScore");
				localStorage.removeItem("poi");
				localStorage.removeItem("curSpeed");

				//获取本地存储的最大分数，判断，若大于上一次分数则保存
				if (confirm("Game Over!!!  是否参与排名？")) {
					maxScore = localStorage.getItem("maxScore");
					maxScore = maxScore == null ? 0: maxScore;
					if (curScore >= maxScore) {
						localStorage.setItem("maxScore", curScore);
					}
				}
				
				//游戏结束
				isPlaying = false;
				clearInterval(curTime);
				return;
			} 
			poi[currentFall[i].y][currentFall[i].x] = 1;
		}
		//判断是否有一行已经满了
		lineFull();
		//将当前位置点状态保存
		localStorage.setItem("poi", JSON.stringify(poi));
		initBlock();	
	}
}

var moveLeft = function(){
	var canLeft = true;
	for (var i = 0; i < currentFall.length; i++) {
		//到了最左边，不能再往左了
		if (currentFall[i].x <= 0) {
			canLeft = false;
			break;
		}

        //左边的位置，已被占
		if (poi[currentFall[i].y][currentFall[i].x -1] != 0) {
			canLeft = false;
			break;
		}
	}

	if (canLeft) {
		//向左前，每个的块变成背景色
		for (var i = 0; i < currentFall.length; i++) {
			ctx.fillStyle = defBackGroundColor;
			ctx.fillRect(currentFall[i].x * cell_size + 1,
				currentFall[i].y * cell_size + 1,
				cell_size - 2, cell_size - 2);
		}

		//自身的块向下一格
		for (var i = 0; i < currentFall.length; i++) {
			currentFall[i].x --;
		}

		//绘制
		for (var i = 0; i < currentFall.length; i++) {
			ctx.fillStyle = currentFall[i].color;
			ctx.fillRect(currentFall[i].x * cell_size + 1,
			currentFall[i].y * cell_size + 1,
				cell_size - 2, cell_size - 2);
		}
	}
}

var moveRight = function(){
	var canRight = true;
	for (var i = 0; i < currentFall.length; i++) {
		//到了最左边，不能再往左了
		if (currentFall[i].x >= cols -1) {
			canRight = false;
			break;
		}

        //左边的位置，已被占
		if (poi[currentFall[i].y][currentFall[i].x+1] != 0) {
			canRight = false;
			break;
		}
	}

	if (canRight) {
		//向右前，每个的块变成背景色
		for (var i = 0; i < currentFall.length; i++) {
			ctx.fillStyle = defBackGroundColor;
			ctx.fillRect(currentFall[i].x * cell_size + 1,
				currentFall[i].y * cell_size + 1,
				cell_size - 2, cell_size - 2);
		}

		//自身的块向下一格
		for (var i = 0; i < currentFall.length; i++) {
			currentFall[i].x ++;
		}

		//绘制
		for (var i = 0; i < currentFall.length; i++) {
			ctx.fillStyle = currentFall[i].color;
			ctx.fillRect(currentFall[i].x * cell_size + 1,
			currentFall[i].y * cell_size + 1,
				cell_size - 2, cell_size - 2);
		}
	}
}

var moveRotate = function(){
	var canRotate = true;
	for (var i = 0; i < currentFall.length; i++) {
		var preX = currentFall[i].x;
		var preY = currentFall[i].y;
		//以第三个点为中心点旋转
		if (i != 2) {
			//旋转后的中心点坐标
			var afterRotateX = currentFall[2].x + preY - currentFall[2].y;
			var afterRotateY = currentFall[2].y  -preX + currentFall[2].x;

			//旋转后的位置已被占
			if (poi[afterRotateY][afterRotateX+1] != 0) {
				canRotate = false;
				break;
			}

			//旋转后的坐标超出左边界
			if (afterRotateX < 0 || poi[afterRotateY-1][afterRotateX] != 0) {
				moveRight();
				afterRotateX = currentFall[2].x + preY - currentFall[2].y;
				afterRotateY = currentFall[2].y - preX + currentFall[2].x ;
				break;
			}

			if (afterRotateX >= cols-1 || poi[afterRotateY][afterRotateX+1] != 0) {
				moveLeft();
				afterRotateX = currentFall[2].x + preY - currentFall[2].y;
				afterRotateY = currentFall[2].y - preX + currentFall[2].x ;
				break;
			}
		}
	}

	if (canRotate) {
		//旋转前，每个的块变成背景色
		for (var i = 0; i < currentFall.length; i++) {
			ctx.fillStyle = defBackGroundColor;
			ctx.fillRect(currentFall[i].x * cell_size + 1,
				currentFall[i].y * cell_size + 1,
				cell_size - 2, cell_size - 2);
		}

		//自身的块向下一格
		for (var i = 0; i < currentFall.length; i++) {
			var preX = currentFall[i].x;
			var preY = currentFall[i].y;

			if (i != 2) {
				currentFall[i].x = currentFall[2].x + preY - currentFall[2].y;
				currentFall[i].y = currentFall[2].y - preX + currentFall[2].x;
			}
		}

		//绘制
		for (var i = 0; i < currentFall.length; i++) {
			ctx.fillStyle = currentFall[i].color;
			ctx.fillRect(currentFall[i].x * cell_size + 1,
			currentFall[i].y * cell_size + 1,
				cell_size - 2, cell_size - 2);
		}
	}
}

var lineFull = function(){
	for (var i = 0; i < rows; i++) {
		var flag = true;
		for (var j = 0; j < cols; j++) {
			var dd = j;
			if (poi[i][j] == 0) {
				flag = false;
				break;
			}
		}
		if (flag) {
			curScoreElm.innerHTML = curScore += 10;
			localStorage.setItem("curScore", curScore);
			//增加游戏积分判断是否升级的环节
			if (curScore >= curSpeed * curSpeed * 500) {
				curSpeedElm.innerHTML = curSpeed += 1;
				localStorage.setItem("curSpeed", curSpeed);
				clearInterval(curTime);
				curTime = setInterval("moveDown();" , 500/curSpeed);
			}

			//此行满了，删除，所有元素下降一格
			for (var k = i; k >0; k--) {
				for (var l = 0; l < cols; l++) {
					poi[k][l] = poi[k-1][l];//这里要测
				}
			}

			drawBlock();
		}
	}
}

var drawBlock = function(){
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (poi[i][j] == 0) {
				ctx.fillStyle = defBackGroundColor;
				ctx.fillRect(j*cell_size + 1, i*cell_size +1, cell_size-2, cell_size-2);
			} 
			
			//没有实现暂停功能。待续
			//表格NxM的poi标记不为0，表示需要绘制元素颜色
			/*
			if (poi[i][j] != 0) {
				ctx.fillStyle = "#080808";
				ctx.fillRect(j*cell_size + 1, i*cell_size +1, cell_size-2, cell_size-2);
			} 
			//表格NxM的poi标记为0，表示需要绘制背景颜色
			else {
				ctx.filStyle = "#080808";
				ctx.fillRect(j*cell_size + 1, i*cell_size + 1, cell_size-2, cell_size-2);
			}*/
		}
	}
}

window.onload = function(){
	//创建Canvas组件
	createCanvas(rows,cols,cell_size);
	//添加canvas节点
	document.body.appendChild(canvas);

	//获取速度，当前积分，最高积分节点
	curSpeedElm = document.getElementById("currentSpeed");
	curScoreElm = document.getElementById("currentScore");
	maxScoreElm = document.getElementById("maxScore");

    //没有实现暂停保存当前状态
	//读取本地存储中的poi，即暂停的网格节点状态
	//var tmpStatus = localStorage.getItem("poi");
	//poi = tmpStatus == null ? poi:JSON.parse(tmpStatus);
	//drawBlock();
	
	//获取本地存储中的当前分数
	curScore = localStorage.getItem("curScore");
	curScore = curScore == null ? 0:parseInt(curScore);
	curScoreElm.innerHTML = curScore;

	//获取本地存储中的当前速度
	curSpeed = localStorage.getItem("curSpeed");
	curSpeed = curSpeed == null ? 1:parseInt(curSpeed);
	curSpeedElm.innerHTML = curSpeed;

	//获取本地存储中的最大分数
	maxScore = localStorage.getItem("maxScore");
	maxScore = maxScore == null ? 0:parseInt(maxScore);
	maxScoreElm.innerHTML = maxScore;

	initBlock();
	curTime = setInterval("moveDown();", 500/curSpeed);
}

//监听"上下左右"按键,"空格"为暂停键, "回车键"为再次开始
window.onkeydown = function(evt){
	switch(evt.keyCode){
		//press "down" key
		case 40:
		if (!isPlaying) {
			return;
		}
		moveDown();
		break;

		//press "left" key
		case 37:
		if (!isPlaying) {
			return;
		}
		moveLeft();
		break;

		//press "right" key
		case 39:
		if (!isPlaying) {
			return;
		}
		moveRight();
		break;

		//press "up" key
		case 38:
		if (!isPlaying) {
			return;
		}
		moveRotate();
		break;

		//press "space" key
		case 32:
		if (isPlaying) {
			isPlaying == false;			
		}
		clearInterval(curTime);	
		break;	

		//press "Enter" key
		case 13:
		curTime = setInterval("moveDown();", 500/curSpeed);
		break;				
	}
}
