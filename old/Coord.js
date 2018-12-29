/**
 * Coord
 * @constructor
 */
class Coord {

    /**
     * Creates a coordinate with x,y and z values
     * @param {X coordinate} x 
     * @param {Y coordinate} y 
     * @param {Z coordinate} z 
     */
    constructor(x, y, z){
        
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Returns the vector going from this to the destination coordinate
     * @param {Destination coordinate} coord 
     */
    getVector(coord){

        var deltaX = coord.x - this.x;
        var deltaY = coord.y - this.y;
        var deltaZ = coord.z - this.z;

        return vec3.fromValues(deltaX,deltaY,deltaZ);
    }

    /**
     * Calculates the distance between two coordinates
     * @param {Destination Coordinate} coord 
     */
    getDistance(coord){

        var deltaX = coord.x - this.x;
        var deltaY = coord.y - this.y;
        var deltaZ = coord.z - this.z;

        return Math.sqrt(deltaX*deltaX + deltaY*deltaY + deltaZ*deltaZ);
    }

    /**
     * Calculates the angle in radians that this does with the argument coordinate
     * @param {Coordinate} coord 
     */
    getAngle2D(coord){
        //vec3
        let vector = this.getVector(coord);
        let x = vector[0];
        let z = vector[2];

        if(x == 0){
            if(z < 0) return Math.PI;
            else return 0;
        }
        else if(z == 0){
            if(x < 0) return -Math.PI/2;
            else return Math.PI/2;
        }
        else if(x < 0 && z < 0){
            return Math.atan(x/z)-Math.PI;
        }
        else if(z < 0 && x > 0){
            return Math.atan(x/z)+Math.PI;
        }
        else{
            return Math.atan(x/z);
        }
    }

    /**
     * Returns this Coordinate in the format of a vec3
     */
    getVec3(){
        return vec3.fromValues(this.x,this.y,this.z);
    }

    /**
     * Calculates the position of a component with start in this and end in finalCoord at segmentRatio of its way
     * @param {Coordinate of the destination} finalCoord 
     * @param {Percentage of the way} segmentRatio 
     */
    getCurrentPosition(finalCoord,segmentRatio){
        var vector = this.getVector(finalCoord);
        var finalX = vector[0]*segmentRatio + this.x;
        var finalY = vector[1]*segmentRatio + this.y;
        var finalZ = vector[2]*segmentRatio + this.z;
        return vec3.fromValues(finalX,finalY,finalZ);
    }

    getX(){
        return this.x;
    }
    
    getZ(){
        return this.z;
    }

    getY(){
        return this.y;
    }
}