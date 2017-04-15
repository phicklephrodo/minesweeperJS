// 0 for beginner, 1 for intermediate, 2 for advanced. 
let gameMode = 1;
const boardSizes = [[8,8,10], [16,16,40],[24,24,99]];
const imagePaths = {
    0: 'images/0block.png',
    1: 'images/1block.png',
    2: 'images/2block.png',
    3: 'images/3block.png',
    4: 'images/4block.png',
    5: 'images/5block.png',
    6: 'images/6block.png',
    7: 'images/7block.png',
    8: 'images/8block.png',
    9: 'images/9block.png',
    bomb: 'images/bomblock.png',
    flag: 'images/flagblock.png',
    face: 'images/unselectedblock.png'
};
const tileSize = 30;
class Board {
    constructor(height,width,bombs,div){
        this.height = height;
        this.width = width;
        this.bombs = bombs;
        // [bombLocation, bombCount, tileTurned]
        this.board = this.initializeBoard(); 
        this.boardDiv = div;
        div.addEventListener('click', e => this.onClick(e,this), false);
    }
    initializeBoard(){
        let bombLocation = new Array();
        let bombCount = new Array();
        let tileTurned = new Array();
        // Fill with zeros
        for(let i = 0; i < this.height; i++){
            bombLocation[i] = new Array();
            bombCount[i] = new Array();
            tileTurned[i] = new Array();
            for(let j = 0; j < this.width; j++){
                bombLocation[i][j] = 0
                bombCount[i][j] = 0
                tileTurned[i][j] = 0
            }
        }
        // Populate with mines
        let mineCount = 0;
        while(mineCount <= boardSizes[gameMode][2]){
            let x = Math.floor(Math.random()*(this.height-1))
            let y = Math.floor(Math.random()*(this.width-1))
            if(bombLocation[x][y] == 0){
                bombLocation[x][y] = 1;
                mineCount++;
            }
        }

        for(let i = 0; i < this.height; i++){
            for(let j = 0; j < this.width; j++){
                bombCount[i][j] = this.bombCount(bombLocation,i,j);
            }
        }

        return [bombLocation, bombCount, tileTurned];
    } 

    drawBoard(){
        for(let i = 0; i < this.height; i++){
            let row = document.createElement('div');
            this.boardDiv.appendChild(row);
            for(let j = 0; j < this.width; j++){
                let curPath = this.getImage(i,j);
                let img = document.createElement('img');
                img.setAttribute('id',`${i},${j}`);
                img.setAttribute('src',curPath);
                img.setAttribute('style',`height:${tileSize};width:${tileSize}`)
                row.appendChild(img);
            }
        }
    } 

    bombCount(board,x,y){
        let count = 0;
        let surroundingX = [x-1,x,x+1,x+1,x+1,x,x-1,x-1];
        let surroundingY = [y-1,y+1,y-1,y,y+1,y+1,y+1,y];
        for (let i = 0; i < surroundingX.length; i++){
            let curX = surroundingX[i];
            let curY = surroundingY[i];
            if(curX >= 0 && curX < this.width && curY >= 0 && curX < this.height){
                let tile = board[curX][curY];
                if(tile === 1)
                    count++;
            }
        }
        return count;
    }

    getImage(x,y){
        if(this.board[2][x][y] == 1){
            if(this.board[0][x][y] === 1){
                return imagePaths.bomb;
            } else {
                return imagePaths[this.board[1][x][y]];
            }
        } else {
            return imagePaths.face;    
        }
    }

    flipTile(x,y,elem){
        this.board[2][x][y] = 1;
        let path = this.getImage(x,y);
        //console.log(path);
        elem.src = path;
    }
    onClick(e,scope){
        let coord = document.elementFromPoint(e.clientX,e.clientY).getAttribute('id').split(',')
            .map(x => Number(x));
        let x = coord[0], y = coord[1];
        scope.flipTile(x,y,e.target);
    }
}

function run(){
    let boardDiv = document.getElementById('game');
    let board = new Board(boardSizes[gameMode][0], boardSizes[gameMode][1], 
        boardSizes[gameMode][2],boardDiv);
    board.drawBoard();
}

run();