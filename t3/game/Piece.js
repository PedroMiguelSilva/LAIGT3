/**
 * Piece
 */
class Piece
{
    constructor(scene, x, z, type, color,id){
        this.scene = scene;

        //Animations 
        let delta;
        if(color == "White"){
            delta = -0.01;
        }
        else{
            delta = 0.01;
        }

        let initAnime = new LinearAnimation(this.scene,0.01);
        initAnime.addControlPoint(x,0,z+delta);
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

        //Allows an extra animation to show the user that its the chosen piece
        this.selected = false;
        this.alive = true;
    }

    kill(){
        this.alive = false;
        if(this.color = "White"){
            this.deleteFromArray(this.scene.graph.game.whiteAlivePieces, this.id);
        }
        else{
            this.deleteFromArray(this.scene.graph.game.blackAlivePieces, this.id);
        }
        this.move(100,100);
    }

    deleteFromArray(array, elem){
        for(var i = array.length - 1; i >= 0; i--) {
            if(array[i] === elem) {
               array.splice(i, 1);
            }
        }
    }

    restart(){
        console.log("aqui estraga")
        if(this.x == this.startX && this.y == this.startY){
            return;
        }
        this.move(this.startX,this.startY);
        this.alive = true;
    }

    /**
     * Checks if its a valid move given the current game and board
     */
   isValidMove(){

   }

   /**
    * Creates an animation to allow the man to move from current position to the position given in arguments
    * @param {Coordinate of the destination of the move} xFinal 
    * @param {Coordinate of the destination of the move} yFinal
    */
   move(xFinal, yFinal){


        let pickUp = this.createAnimation(
                                        this.x-0.01,this.y-0.01,0,
                                        this.x,     this.y,     3.5
                                        );

        let moveAcross = this.createAnimation(
                                        this.x,     this.y,     3.5,
                                        xFinal,     yFinal,     3.5
                                        );

        let putDown = this.createAnimation(
                                        xFinal,     yFinal,     3.5,
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