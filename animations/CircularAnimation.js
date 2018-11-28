/**
 * Class to describe circular animations
 */
class CircularAnimation extends Animation {

    /**
     * Constructor for a circular animation
     * @param {Duration of the animation} time 
     * @param {Coordinate of the center of the animation} coord 
     * @param {Radius of the animation} radius 
     * @param {Starting angle of the animation - radians} startAng 
     * @param {Total rotating - radians} rotAng 
     */
    constructor(scene,time,coord, radius, startAng, rotAng){
        super(scene);
        this.scene = scene;
        this.time = time*1000;
        this.center = coord;
        this.radius= radius;
        this.startAng = startAng;
        this.rotAng = rotAng;

        //Calculate angular speed
        this.angSpeed = this.rotAng/this.time;

        //Orientation
        if(this.angSpeed >= 0){
            this.orientation = Math.PI;
        }
        else{
            this.orientation = 0;
        }
        
        //Time
        this.currentTime = 0;
        
        //Angle
        this.alpha = this.startAng;
    }

    /**
     * @param {Updates the linear animation values} deltaTime 
     * @returns 
     *          -1 - animation ended
     *           0 - animation still going
     */
    update(deltaTime){
        // Update Angle
        this.alpha += this.angSpeed * deltaTime;

        //Finishing clauses
        if(this.angSpeed >= 0){
            if(this.alpha >= this.startAng + this.rotAng)
                return -1;
        }
        else if(this.angSpeed < 0){
            if(this.alpha <= this.startAng + this.rotAng)
                return -1;
        }
            
        return 0;
    }

    /**
     * Applies the geometric transformations for the animation on the scene
     */
    apply(){
        this.scene.translate(this.center.getX(),this.center.getY(),this.center.getZ());
        this.scene.rotate(this.alpha,0,1,0);
        this.scene.translate(this.radius,0,0);
        this.scene.rotate(this.orientation,0,1,0);
    }

}