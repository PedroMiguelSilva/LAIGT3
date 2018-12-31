/**
 * Piece
 */
class Piece
{
    constructor(scene, x, z, type, color,id){
       this.scene = scene;

       //Animations 
       this.animation = new LinearAnimation(this.scene,0.01);
       this.animation.addControlPoint(x-0.01,0,z);
       this.animation.addControlPoint(x,0,z);
       this.animation.init();

       this.startX = x;
       this.startY = z;

       this.id = id;
       
       this.x = x;
       this.y = z;

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
            this.scene.graph.game.whiteAlivePieces.splice(this.id-1, 1);
        }
        else{
            this.scene.graph.game.blackAlivePieces.splice(this.id-1, 1);
        }
    }

    restart(){
        this.move(this.startX,this.startY);
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
        //console.log("Piece moved from (" + this.x + "," + this.y + ") to (" + xFinal + "," + yFinal + ")");
       // note - save the end position of the animatino in the x and z values of this object for next animation reference
        let newAnime = new LinearAnimation(this.scene,2);
        newAnime.addControlPoint(this.x-0.01,0,this.y-0.01);
        newAnime.addControlPoint(xFinal,0,yFinal);
        newAnime.init();
        this.animation = newAnime;
        this.x = xFinal;
        this.y = yFinal;
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