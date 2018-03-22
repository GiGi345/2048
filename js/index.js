var game ={
    row:4,
    col:4,
    state:0,       //0表示开始游戏，1表示游戏进行中，2表示成果一次2048 
    score:0,        //得分
    data:[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ],
    //初始化
    init:function(){
        this.renderPage();
        this.event();
    },
    //随机在某一格生成一个随机2或4
    randomNum:function(){
       while(true){
            var row = parseInt(Math.random()*this.row);
            var col = parseInt(Math.random()*this.col);
            var num = Math.random()<0.5?2:4;
            if(this.data[row][col] == 0){
                this.data[row][col] = num;
                break;
            }
       }
    },
    //渲染表格
    renderPage:function(){
        /* 渲染分数 */
        document.getElementById("score").innerHTML = this.score;
        /* 游戏刚开始，随机生成两个数 */
        if(this.state == 0){
            this.randomNum();
            this.randomNum();
            this.state = 1;
        }
        for(var i = 0;i < this.row;i++){
            for(var j = 0;j < this.col;j++){
                var row = i.toString(),
                col = j.toString();
                if(this.data[i][j] != 0){
                    document.getElementById(row+col).innerText = this.data[i][j];
                    var test = "pane"+this.data[i][j];
                    document.getElementById(row+col).classList.add(test);
                    document.getElementById(row+col).setAttribute("class","cell "+test);
                }else{
                    document.getElementById(row+col).innerText = "";
                    var test = "pane"+this.data[i][j];
                    document.getElementById(row+col).setAttribute("class","cell");
                }
            }
        }
    }, 
    //判断是否完成2048
    isWin:function(data){
        for(var i = 0;i<this.row;i++){
            for(var j = 0;j<this.col;j++){
                if(data[i][j] == 2048 && this.state!=2){
                    document.querySelector(".mask-win").style.display = "block";
                    this.state = 2;
                    return 1;
                }
            }
        }
        return 0;               //结束
    },
    //判断游戏是否结束  
    gameOver:function(data){
        for(var i = 0;i<this.row;i++){
            for(var j = 0;j<this.col;j++){
                var upValue = this.upValue(i,j);
                var downValue = this.downValue(i,j);
                var leftValue = this.leftValue(i,j);
                var rightValue = this.rightValue(i,j);
                if(data[i][j] == 0){
                    return 0;     //未结束
                }else if(upValue!=-1 && data[i][j] == data[upValue][j]){
                    return 0;     //未结束
                }else if(downValue!=-1 && data[i][j] == data[downValue][j]){
                    return 0;     //未结束
                }else if(leftValue!=-1 && data[i][j] == data[i][leftValue]){
                    return 0;     //未结束
                }else if(rightValue!=-1 && data[i][j] == data[i][rightValue]){
                    return 0;     //未结束
                }
            }
        }
        document.querySelector(".mask-over").style.display = "block";
        return 1;               //结束
    },
    //事件
    event:function(){
        var that = this,mask;
        document.onkeydown = function(event){
            var e = window.event || event;
            switch(e.keyCode){
                case 38:
                    mask = document.querySelector(".mask-win").style.display;
                    if(mask == "none"){
                        that.moveUp();
                    }
                    break;
                case 40:
                    mask = document.querySelector(".mask-win").style.display;
                    if(mask == "none"){
                        that.moveDown();
                    }
                    break;
                case 37:
                    mask = document.querySelector(".mask-win").style.display;
                    if(mask == "none"){
                        that.moveLeft();
                    }
                    break;
                case 39:
                    mask = document.querySelector(".mask-win").style.display;
                    if(mask == "none"){
                        that.moveRight();
                    } 
                    break;
            }
        }
        document.getElementById("keep").onclick = function(){
            document.querySelector(".mask-win").style.display = "none";
        }
        document.getElementById("again").onclick = function(){
           window.location.reload();
        }
        document.getElementById("overAgain").onclick = function(){
            window.location.reload();
         }
       
        
    },
    //数组深拷贝
    deepCopy:function (p,c){
        c = [];
        for(var i in p){
            c[i] = p[i].concat();
        }
        return c;
    },
    //判断当前位置的上面是否为有数值，并返回数值数
    upValue:function(row,col) {
        for(var i = row-1 ;i >=0 ;i--){
            if(this.data[i][col]!=0){
                return i;
            }
        }
       return -1;
    },
    //向上移动
    moveUp:function() {
            var origData,alteredData;
            origData = this.deepCopy(this.data,origData);
            for(var j =0;j<this.col;j++){
                //从第一行开始判断，当前表格是否为空
                var index,notEmptyIndex = 0;
                for(index = 0;index<this.row;index++){
                    if(this.data[index][j] != 0){
                         if(this.upValue(index,j)!=-1){
                            var nextValue = this.upValue(index,j);
                            if(this.data[nextValue][j] == this.data[index][j]){
                             notEmptyIndex = nextValue;
                             this.data[notEmptyIndex][j] *= 2;
                             this.score += this.data[notEmptyIndex][j];
                             this.data[index][j] = 0;
                             notEmptyIndex++;                           
                            }else{
                                 this.data[notEmptyIndex][j] = this.data[index][j];
                                 if(index != notEmptyIndex){
                                     this.data[index][j] = 0;
                                 }
                                 notEmptyIndex++;                               
                            }
                         }else{
                             this.data[notEmptyIndex][j] = this.data[index][j];
                             if(index != notEmptyIndex){
                                 this.data[index][j] = 0;
                             }
                             notEmptyIndex++;                            
                         }
                        
                     }
                }      
            }
            alteredData = this.deepCopy(this.data,alteredData);  
            if(origData.toString() != alteredData.toString()){
                this.randomNum();
            }else{
                this.gameOver(alteredData);
            }  
            this.renderPage();
            this.isWin(alteredData);        
    },
    //判断当前位置的下面是否为有数值，并返回数值数
    downValue:function(row,col) {

        for(var i = row+1 ;i <this.row ;i++){
            if(this.data[i][col]!=0){
                return i;
            }
        }
       return -1;
    },
    //向下移动
    moveDown:function() {
        var origData,alteredData;
        origData = this.deepCopy(this.data,origData);
        for(var j =0;j<this.col;j++){
            //从第一行开始判断，当前表格是否为空
            var index,notEmptyIndex = this.row-1;
            for(index = this.row-1;index>=0;index--){
                if(this.data[index][j] != 0){
                        if(this.downValue(index,j)!=-1){
                        var nextValue = this.downValue(index,j);
                        if(this.data[nextValue][j] == this.data[index][j]){
                            notEmptyIndex = nextValue;
                            this.data[notEmptyIndex][j] *= 2;
                            this.score += this.data[notEmptyIndex][j];
                            this.data[index][j] = 0;
                            notEmptyIndex--;                           
                        }else{
                                this.data[notEmptyIndex][j] = this.data[index][j];
                                if(index != notEmptyIndex){
                                    this.data[index][j] = 0;
                                }
                                notEmptyIndex--;                               
                        }
                        }else{
                            this.data[notEmptyIndex][j] = this.data[index][j];
                            if(index != notEmptyIndex){
                                this.data[index][j] = 0;
                            }
                            notEmptyIndex--;                            
                        }
                    
                    }
            }      
        }
        alteredData = this.deepCopy(this.data,alteredData);  
        if(origData.toString() != alteredData.toString()){
            this.randomNum();
        }else{
            this.gameOver(alteredData);
        }    
        this.renderPage();    
        this.isWin(alteredData);   
        
    },
    //判断当前位置的左面是否为有数值，并返回数值数
    leftValue:function(row,col) {
        for(var i = col-1 ;i >=0 ;i--){
            if(this.data[row][i]!=0){
                return i;
            }
        }
       return -1;
    },
    //向左移动
    moveLeft:function() {
        var origData,alteredData;
        origData = this.deepCopy(this.data,origData);
        for(var j =0;j<this.row;j++){
            //从第一列开始判断，当前表格是否为空
            var index,notEmptyIndex = 0;
            for(index = 0;index<this.col;index++){
                if(this.data[j][index] != 0){
                     if(this.leftValue(j,index)!=-1){
                        var nextValue = this.leftValue(j,index);
                        if(this.data[j][nextValue] == this.data[j][index]){
                         notEmptyIndex = nextValue;
                         this.data[j][notEmptyIndex] *= 2;
                         this.score += this.data[j][notEmptyIndex];
                         this.data[j][index] = 0;
                         notEmptyIndex++;                           
                        }else{
                             this.data[j][notEmptyIndex] = this.data[j][index];
                             if(index != notEmptyIndex){
                                 this.data[j][index] = 0;
                             }
                             notEmptyIndex++;                               
                        }
                     }else{
                         this.data[j][notEmptyIndex] = this.data[j][index];
                         if(index != notEmptyIndex){
                             this.data[j][index] = 0;
                         }
                         notEmptyIndex++;                            
                     }
                    
                 }
            }      
        }
        alteredData = this.deepCopy(this.data,alteredData);  
        if(origData.toString() != alteredData.toString()){
            this.randomNum();
        }else{
            this.gameOver(alteredData);
        }  
        this.renderPage(); 
        this.isWin(alteredData);      
        
    
    },
    //判断当前位置的右面是否为有数值，并返回数值数
    rightValue:function(row,col) {
        for(var i = col+1 ;i <this.col ;i++){
            if(this.data[row][i]!=0){
                return i;
            }
        }
       return -1;
    },
    //向右移动
    moveRight:function() {
        var origData,alteredData;
        origData = this.deepCopy(this.data,origData);
        for(var j =0;j<this.row;j++){
            //从第一列开始判断，当前表格是否为空
            var index,notEmptyIndex = this.col-1;
            for(index = this.col-1;index>=0;index--){
                if(this.data[j][index] != 0){
                     if(this.rightValue(j,index)!=-1){
                        var nextValue = this.rightValue(j,index);
                        if(this.data[j][nextValue] == this.data[j][index]){
                         notEmptyIndex = nextValue;
                         this.data[j][notEmptyIndex] *= 2;
                         this.score += this.data[j][notEmptyIndex];
                         this.data[j][index] = 0;
                         notEmptyIndex--;                           
                        }else{
                             this.data[j][notEmptyIndex] = this.data[j][index];
                             if(index != notEmptyIndex){
                                 this.data[j][index] = 0;
                             }
                             notEmptyIndex--;                               
                        }
                     }else{
                         this.data[j][notEmptyIndex] = this.data[j][index];
                         if(index != notEmptyIndex){
                             this.data[j][index] = 0;
                         }
                         notEmptyIndex--;                            
                     }
                    
                 }
            }      
        }
        alteredData = this.deepCopy(this.data,alteredData);  
        if(origData.toString() != alteredData.toString()){
            this.randomNum();
        }else{
            this.gameOver(alteredData);
        }    
        this.renderPage();  
        this.isWin(alteredData);   
    },
}
game.init();

