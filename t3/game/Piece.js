/**
 * Piece
 */
class Piece
{
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

        //Allows an extra animation to show the user that its the chosen piece
        this.selected = false;
        this.alive = true;

        this.xDeathWhite = 12;
        this.yDeathWhite = 9;
        this.xDeathBlack = -12;
        this.yDeathBlack = -9;
        this.width = 3;
        this.height = 4.5;
    }

    kill(){
        this.alive = false;
        this.moveToDeathPlace();
        if(this.color == "White"){
            this.deleteFromArray(this.scene.graph.game.whiteAlivePieces, this.id);
        }
        else{
            this.deleteFromArray(this.scene.graph.game.blackAlivePieces, this.id);
        }
        this.xBeforeDeath = this.x;
        this.yBeforeDeath = this.y;

        //Move to death place
        //this.move(100,100);
        
    }

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

    numberOfDead(color){
        
        if(color == "White"){
            return 7-this.scene.graph.game.whiteAlivePieces.length;
        }else{
            return 7-this.scene.graph.game.blackAlivePieces.length;
        }   
    }

    revive(){
        this.alive = true;
        if(this.color == "White"){
            this.scene.graph.game.whiteAlivePieces.push(this.id);
        }else{
            this.scene.graph.game.blackAlivePieces.push(this.id);    
        }
        this.move(this.xBeforeDeath,this.yBeforeDeath);
    }

    deleteFromArray(array, elem){
        for(var i = array.length - 1; i >= 0; i--) {
            if(array[i] === elem) {
               array.splice(i, 1);
            }
        }
    }

    restart(){
        //console.log("aqui estraga")
        if(this.x == this.startX && this.y == this.startY){
            return;
        }
        this.move(this.startX,this.startY);
        this.alive = true;
    }


   /**
    * Creates an animation to allow the man to move from current position to the position given in arguments
    * @param {Coordinate of the destination of the move} xFinal 
    * @param {Coordinate of the destination of the move} yFinal
    */
   move(xFinal, yFinal){
        let deathFactorY;
        let deathFactorX;
        if(this.alive){
            deathFactorY = this.delta;
            deathFactorX = 0;
        }else{
            deathFactorX = -this.delta;
            deathFactorY = 0;
        }

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
        this.animationController.addAnimation(pickUp);
        this.animationController.addAnimation(moveAcross);
        this.animationController.addAnimation(putDown);
        

       this.x = xFinal;
       this.y = yFinal;
   }

   createAnimation(fromX, fromY, fromZ, toX, toY, toZ){
       let anime = new LinearAnimation(this.scene, 2/this.scene.graph.game.speed);
       anime.addControlPoint(fromX, fromZ, fromY);
       anime.addControlPoint(toX, toZ, toY);
       anime.init();
       return anime;
   }

   /**
    * Select the Man
    */
   select(){
       this.selected = true;
   }

   /**
    * Unselect the Man
    */
   unselect(){
       this.selected = false;
   }
}