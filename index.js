
document.addEventListener('DOMContentLoaded', ()=>{
    let gameboard = [[],[],[],[],[],[],[]]
    let playersTurn = true || false 
    let gameover = false
    let whoWon = 1 || 2
    
    let initalizeGameboard = (g) => {
        for(let j=0; j< g.length; j++){
            for(let i=0;i<7;i++){
                g[j].push(0)
            }
        }
        return g
    }
    
    let addPiece = (turn, board, location) => {
        spot = convertToNumber(turn)
        //read 2d array bottom up
        for(let i = board.length-1; i > -1; i--){
            //if 0 place turn
            if (board[i][location] === 0){
                board[i][location] = spot
                gameover = winCondition(board, spot)
                return board
            }
            
        }
        return -1
         //if no -1 then return error?
    }
    
    let flip = () => {
        if(playersTurn) playersTurn = false
        else playersTurn = true
    }
    
    let convertToNumber = (turn) =>{
        if(turn === true) return 1
        else return 2
    }
    
    let coinflip = () =>{
        if(getRandomInt(100)%2===0) return true
        else return false
    }
    
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    let evaluateGameboard = (gameboard, piece) =>{
        let score = 0
        otherpiece = 0
        if(piece === 2) otherpiece = 1
        else otherpiece = 2

        function Counter(segment, piece){
            let number = 0
            for(let i of segment){
                if(i === piece) number++
            }
            return number
        }

        if(Counter(gameboard, piece) === 4) score = score + 100
        else if(Counter(gameboard, piece) === 3 && Counter(gameboard, 0) === 1) score = score + 5
        else if(Counter(gameboard, piece) === 2 && Counter(gameboard, 0) === 2) score = score + 2
        if(Counter(gameboard, otherpiece) === 3 && Counter(gameboard, 0) === 1) score = score - 4
        return score
    }

    let scorePosition = (board, piece) =>{
        let score = 0

        for(i=0;i<board.length-3;i++){
            for(j=0;j<board[i].length;j++){
                score = score + evaluateGameboard([board[i][j],board[i+1][j],board[i+2][j],board[i+3][j]], piece)
            }
        }
        for(i=0;i<board.length;i++){
            for(j=0;j<board[i].length-3;j++){
                score = score + evaluateGameboard([board[i][j],board[i][j+1],board[i][j+2],board[i][j+3]], piece)
            }
        }
        for(i=0;i<board.length-3;i++){
            for(j=0;j<board[i].length-3;j++){
                score = score + evaluateGameboard([board[i][j],board[i+1][j+1],board[i+2][j+2],board[i+3][j+3]], piece)
            }
        }
        for(i=3;i<board.length;i++){
            for(j=0;j<board[i].length-3;j++){
                score = score + evaluateGameboard([board[i][j],board[i-1][j+1],board[i-2][j+2],board[i-3][j+3]], piece)
            }            
        }
        return score
    }

    let winCondition = (board, piece) =>{
        //use try except indexError instead
        for(let i=0;i<board.length-3;i++){
            for(let j=0;j<board[i].length;j++){
                if(board[i][j] === piece && board[i+1][j] === piece && board[i+2][j] === piece && board[i+3][j] === piece) {
                    whoWon = piece
                    return true
                }
            }
        }
        for(let i=0;i<board.length;i++){
            for(let j=0;j<board[i].length-3;j++){
                if(board[i][j] === piece && board[i][j+1] === piece && board[i][j+2] === piece && board[i][j+3] === piece){
                    whoWon = piece
                    return true
                }
            }
        }

        for(let i=0;i<board.length-3;i++){
            for(let j=0;j<board[i].length-3;j++){
                if(board[i][j] === piece && board[i+1][j+1] === piece && board[i+2][j+2] === piece && board[i+3][j+3] === piece) {//
                    whoWon = piece
                    return true
                }
            }
        }
        for(let i=3;i<board.length;i++){
            for(let j=0;j<board[i].length-3;j++){
                if(board[i][j] === piece && board[i-1][j+1] === piece && board[i-2][j+2] === piece && board[i-3][j+3] === piece){
                    whoWon = piece
                    return true
                }
            }
        }
    }


    let getValidLocations = (board) => {
        let validlocations = []
        for(column in board){//iterate through columns
            for(let i = board.length-1; i > -1; i--){ //look through rows bottom up
                if (board[i][column] === 0){ //location is valid
                    validlocations.push(parseInt(column))//add location to the list
                    break
                }
            }    
        }
        return validlocations 
    }

    let isValidLocation = (board, col) =>{
        //read 2d array bottom up
        for(let i = board.length-1; i > -1; i--){
            if (board[i][col] === 0)return true            
        }
       return false

    }

    let isTeminalNode = (board) => {
        return winCondition(board, convertToNumber(true)) || winCondition(board,convertToNumber(false)) || getValidLocations.length === 0
    }

    let deepCopy = (board) => {
        return JSON.parse(JSON.stringify(board))
    }

    let minimax = (originalgameboard, depth, maximizingPlayer)=>{
        let board = deepCopy(originalgameboard)
        let validLocations = getValidLocations(board)
        let is_terminal = isTeminalNode(board)

        if(depth === 0 || is_terminal){
            if(is_terminal){
                if(winCondition(board,convertToNumber(maximizingPlayer)))return [null, Infinity]
                else if(winCondition(board,convertToNumber(!maximizingPlayer)))return [null, -Infinity]
                else return [null, 0]
            }
            else{
                return [null, scorePosition(board, !maximizingPlayer)]
            }
        }
        if(maximizingPlayer){
            let value = -Infinity
            let column = validLocations[getRandomInt(validLocations.length)]
            for (col in validLocations){
                let copy = deepCopy(board)
                addPiece(maximizingPlayer,board, column)
                newScore = minimax(copy, depth-1, !maximizingPlayer)[1]
                if(newScore>value){
                    value = newScore
                    column = col
                }
            }
            return [column, value]
        }
        else{
            let value = Infinity
            let column = validLocations[getRandomInt(validLocations.length)]
            for (col in validLocations){
                let copy = deepCopy(board)
                addPiece(maximizingPlayer,board, column)
                newScore = minimax(copy, depth-1, maximizingPlayer)[1]
                if(newScore<value){
                    value = newScore
                    column = col
                }
            }
            return [column, value]

        }

    }

    let minimaxAB = (originalgameboard, depth, alpha, beta, maximizingPlayer)=>{
        let board = deepCopy(originalgameboard)
        let validLocations = getValidLocations(board)
        let is_terminal = isTeminalNode(board)

        if(depth === 0 || is_terminal){
            if(is_terminal){
                if(winCondition(board,convertToNumber(maximizingPlayer)))return [null, Infinity]
                else if(winCondition(board,convertToNumber(!maximizingPlayer)))return [null, -Infinity]
                else return [null, 0]
            }
            else{
                return [null, scorePosition(board, !maximizingPlayer)]
            }
        }
        if(maximizingPlayer){
            let value = -Infinity
            let column = validLocations[getRandomInt(validLocations.length)]
            for (col in validLocations){
                let copy = deepCopy(board)
                addPiece(maximizingPlayer,board, column)
                newScore = minimax(copy, depth-1, !maximizingPlayer)[1]
                if(newScore>value){
                    value = newScore
                    column = col
                }
                alpha = Math.max(alpha, value)
                if(alpha>=beta) break
            }
            return [column, value]
        }
        else{
            let value = Infinity
            let column = validLocations[getRandomInt(validLocations.length)]
            for (col in validLocations){
                let copy = deepCopy(board)
                addPiece(maximizingPlayer,board, column)
                newScore = minimax(copy, depth-1, maximizingPlayer)[1]
                if(newScore<value){
                    value = newScore
                    column = col
                }
                beta = Math.min(beta, value)
                if(alpha>=beta) break
            }
            return [column, value]

        }

    }
    let magic = []
    
    playersTurn = coinflip(playersTurn)
    gameboard = initalizeGameboard(gameboard)
    magic.push(deepCopy(gameboard))

    let turn = 0
    while(!gameover){
        if(turn%2 == 0 && !gameover){
            maxplayer = minimax(gameboard,6,true)
            if(isValidLocation(gameboard, maxplayer[0])){
                addPiece(true, gameboard, maxplayer[0])
                if(winCondition(gameboard, maxplayer[0])){
                    gameover = true
                }
                magic.push(deepCopy(gameboard))//deep copy
                turn++
            }
        }
        else if(turn%2 == 1 && !gameover){
            minplayer = minimax(gameboard,6,false)
            if(isValidLocation(gameboard, minplayer[0])){
                addPiece(false, gameboard, minplayer[0])
                if(winCondition(gameboard, minplayer[0])){
                    gameover = true
                }
                magic.push(deepCopy(gameboard))//deep copy
                turn++
            }
        }
    }
    console.log(magic)

    
    //front end stuff...
    let settingUpGameboard = (board) =>{
        let viewGameboard = document.getElementsByClassName("gameboard")[0]
        for(let i=0; i<board.length; i++){
            let row = document.createElement('div')
            row.classList.add('row')
            viewGameboard.appendChild(row)
        }
        let rows = document.getElementsByClassName('row')
        for(const row of rows){
            for(let i = 0; i<board[0].length;i++){
                let slot = document.createElement('div')
                slot.classList.add('slot')
                row.appendChild(slot)
            }
        }

    }

    let addToBoard = (board) =>{
        let r = document.getElementsByClassName('row')
        let slots = document.getElementsByClassName('slot')
        let counter = 0
        
        for(let i =0;i<board.length;i++){
            for(let j = 0; j<board[0].length;j++){
                if(board[i][j] === 0){
                    slots[counter].innerHTML = `🤡`
                }
                else if(board[i][j] === 1){
                    slots[counter].innerHTML =`😌`
                }
                else if(board[i][j] === 2){
                    slots[counter].innerHTML = `😠`
                }
                counter++
            }
        } 
    }
    
    settingUpGameboard(gameboard)
    addToBoard(gameboard)
})
