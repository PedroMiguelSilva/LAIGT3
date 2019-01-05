/**
 * Piece
 */
class Piece
{
    /**
     * Creates a piece that represents an element to be played
     */
    constructor(scene, x, z, type, color,id){
        this.scene = scene;

        //Animations 
        this.delta;
        if(color == "White"){
            this.delta = -0.01;
        }
        else{
            this.delta = 0.01;
        }

        let initAnime = new LinearAnimation(this.scene,0.01);
        initAnime.addControlPoint(x,0,z+this.delta);
        initAnime.addControlPoint(x,0,z);
        initAnime.init();

        this.startX = x;
        this.startY = z;

        this.id = id;
        
        this.x = x;
        this.y = z;

        this.animationController = new AnimationController(this.scene);
        this.animationController.addAnimation(initAnime);

        this.type = type;
        this.color = color;

        this.move_state = {
            PLAIN : "Plain",
            CANTER : "Canter",
            JUMP : "Jump"
        }

        this.xBeforeDeath = null;
        this.yBeforeDeath = null;

        this.alive = true;

        this.xDeathWhite = 12;
        this.yDeathWhite = 9;
        this.xDeathBlack = -12;
        this.yDeathBlack = -9;
        this.width = 3;
        this.height = 4.5;

        this.nameOfMaterial;
        if(this.color == "White"){
            this.nameOfMaterial = "light tiles"
        }else{
            this.nameOfMaterial = "dark tiles"
        }
        
        this.material = this.scene.graph.materials[this.nameOfMaterial];
        this.display();
        this.loaded = true;
        this.variablesUpdatedFromGraph = false;
    }

    /* Makes sure the graph has already been loaded */
    isGraphLoaded(){
        if(!this.scene.sceneInited || !this.variablesUpdatedFromGraph){
            this.material = this.scene.graph.materials[this.nameOfMaterial];
            this.variablesUpdatedFromGraph = true;
            return false;
        }
        return true;
    }

    /**
     * Display the piece
     */
    display(){
        /* Dont do anything if still loading */
        if(!this.isGraphLoaded()){
            return;
        }

        /* Apply animation from animation controller */
        if(this.animationController){
            this.animationController.apply();
        }

        /* Get geometry of the piece */
        let geometryToPrint;
        if(this.type == "Man"){
            geometryToPrint = this.scene.graph.game.nameOfMan;
        }else{
            geometryToPrint = this.scene.graph.game.nameOfKnight;
        }

        /* Register for picking and display*/
        this.scene.registerForPick(this.id,this.scene.graph.components[geometryToPrint]);
        this.scene.graph.components[geometryToPrint].display(this.material,null,null,0);
    }

    /**
     * Kills the piece
     */
    kill(){
        /* Save place where it was killed */
        this.xBeforeDeath = this.x;
        this.yBeforeDeath = this.y;

        /* Update status */
        this.alive = false;

        /* Move it */
        this.moveToDeathPlace();

        /* Update game variables */
        if(this.color == "White"){
            this.deleteFromArray(this.scene.graph.game.whiteAlivePieces, this.id);
        }
        else{
            this.deleteFromArray(this.scene.graph.game.blackAlivePieces, this.id);
        }
    }

    /**
     * Moves a piece to the side of the board
     */
    moveToDeathPlace(){
        let numberOfDead;
        if(this.color == "White"){
            numberOfDead = this.numberOfDead("White");
            this.move(this.xDeathWhite, this.yDeathWhite - numberOfDead*this.width);
        }else{
            numberOfDead = this.numberOfDead("Black");
            this.move(this.xDeathBlack, this.yDeathBlack + numberOfDead*this.width);
        }
    }

    /**
     * Calculates the number of pieces that are dead from color 'color'
     * @param {Color of pieces} color 
     */
    numberOfDead(color){
        if(color == "White"){
            return 7-this.scene.graph.game.whiteAlivePieces.length;
        }else{
            return 7-this.scene.graph.game.blackAlivePieces.length;
        }   
    }

    /**
     * Revives the piece after it has been killed
     */
    revive(){
        /* Revive its status */
        this.alive = true;

        /* Revive it in the game information */
        if(this.color == "White"){
            this.scene.graph.game.whiteAlivePieces.push(this.id);
        }else{
            this.scene.graph.game.blackAlivePieces.push(this.id);    
        }
        
        /* Move to the position it was before beeing killed */
        this.move(this.xBeforeDeath,this.yBeforeDeath);
    }

    /**
     * Deletes element 'elem' from array 'array'
     * @param {Array} array 
     * @param {Element to be deleted} elem 
     */
    deleteFromArray(array, elem){
        for(var i = array.length - 1; i >= 0; i--) {
            if(array[i] === elem) {
               array.splice(i, 1);
            }
        }
    }

    /**
     * Restart this piece for when the game is restarting
     */
    restart(){
        /* If the piece never left starting position, then do nothing */
        if(this.x == this.startX && this.y == this.startY){
            return;
        }

        /* Move to starting position */
        this.move(this.startX,this.startY);

        /* Revive if its dead */
        this.alive = true;
    }


   /**
    * Creates an animation to allow the man to move from current position to the position given in arguments
    * @param {Coordinate of the destination of the move} xFinal 
    * @param {Coordinate of the destination of the move} yFinal
    */
   move(xFinal, yFinal){
       /* Calculate orientation of the piece according to its color and alive status */
        let deathFactorY;
        let deathFactorX;
        if(this.alive){
            deathFactorY = this.delta;
            deathFactorX = 0;
        }else{
            deathFactorX = -this.delta;
            deathFactorY = 0;
        }

        /* Create animations to pick, move and put down the piece */
        let pickUp = this.createAnimation(
                                        this.x,this.y+deathFactorY,0,
                                        this.x,     this.y,     this.height
                                        );

        let moveAcross = this.createAnimation(
                                        this.x,     this.y,     this.height,
                                        xFinal,     yFinal,     this.height
                                        );

        let putDown = this.createAnimation(
                                        xFinal+deathFactorX,     yFinal+deathFactorY,     this.height,
                                        xFinal,     yFinal,     0
                                        );

        /* Add animations to the animation controller of this piece */
        this.animationController.addAnimation(pickUp);
        this.animationController.addAnimation(moveAcross);
        this.animationController.addAnimation(putDown);
        
        /* Update coordinates of the piece */
        this.x = xFinal;
        this.y = yFinal;
   }

   /**
    * Creates an animation from starting coordinates to ending coordinates
    * @param {Startin X} fromX 
    * @param {Starting Y} fromY 
    * @param {Startin Z} fromZ 
    * @param {Ending X} toX 
    * @param {Ending Y} toY 
    * @param {Ending Z} toZ 
    */
   createAnimation(fromX, fromY, fromZ, toX, toY, toZ){
       let anime = new LinearAnimation(this.scene, 2/this.scene.graph.game.speed);
       anime.addControlPoint(fromX, fromZ, fromY);
       anime.addControlPoint(toX, toZ, toY);
       anime.init();
       return anime;
   }
}