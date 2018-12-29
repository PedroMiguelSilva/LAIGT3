/**
 * Piece
 */
class Piece
{
    constructor(scene, x, z) {
       this.scene = scene;

       //Animations 
       this.animation = new LinearAnimation(this.scene,0.01);
       this.animation.addControlPoint(x-0.01,0,z);
       this.animation.addControlPoint(x,0,z);
       this.animation.init();
       
       this.x = x;
       this.z = z;

       this.move_state = {
           PLAIN : "Plain",
           CANTER : "Canter",
           JUMP : "Jump"
       }

       //Allows an extra animation to show the user that its the chosen piece
       this.selected = false;
    }

    /**
     * 
     */
    getRow() {
       var distZ = -this.z + 21;
       return distZ / 3;
    }

    /**
     * 
     */
    getColumn() {
       var distX = this.x + 12;
       return distX / 3;
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
   move(xFinal, zFinal){
       // note - save the end position of the animatino in the x and z values of this object for next animation reference
        let newAnime = new LinearAnimation(this.scene,5);
        newAnime.addControlPoint(this.x,0,this.z);
        newAnime.addControlPoint(xFinal,0,zFinal);
        newAnime.init();
        this.animation = newAnime;
        this.x = xFinal;
        this.z = zFinal;
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

   display(){

   }
}