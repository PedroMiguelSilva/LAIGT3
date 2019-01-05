/**
 * Cell
 * @constructor
 */
class Cell {

    /**
     * 
     * @param {Scene} scene 
     * @param {X1} x1 
     * @param {Y1} y1 
     * @param {X2} x2 
     * @param {Y2} y2 
     * @param {Id which is going to be used to pick the Cell} pickingId 
     */
    constructor(scene, x1, y1, x2, y2, pickingId) {

        this.scene = scene;

        this.active = false;

        this.x = x1 + 1.5;
        this.y = -(y1 + 1.5);

        this.pickingId = pickingId;

        this.rectangle = new MyRectangle(this.scene, x1, y1, x2, y2);
        this.activeMaterial = this.scene.graph.materials['red'];
    }

    /**
     * Check if all the values this class uses from graph are already loaded properly
     */
    isAllLoaded(){
        if(!this.rectangle || !this.activeMaterial){
            this.activeMaterial = this.scene.graph.materials['red'];
            return false;
        }
        return true;
    }

    /**
     * Activate the cell
     */
    activate(){
        this.active = true;
    }

    /**
     * Deactivate the cell
     */
    deactivate(){
        this.active = false;
    }

    /**
     * Displays the cell
     * @param {Current material beeing used} currentMaterial 
     */
    display(currentMaterial) {
        /* Check if information from graph is loaded */
        if(!this.isAllLoaded()){
            return;
        }

        /* Check if cell is active */
        if(this.active){
            this.activeMaterial.apply();
        }

        /* Display cell */
        this.scene.pushMatrix();
            this.rectangle.display();
        this.scene.popMatrix();

        /* Put the current material back on */
        if(this.active){
           this.scene.graph.materials[currentMaterial].apply(); 
        }
    }
}