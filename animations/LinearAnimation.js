/**
 * Class to describe linear animations
 */
class LinearAnimation extends Animation {

    constructor(scene, time){

        super(scene);

        //Controlpoints and time (in miliseconds)
        this.points = [];
        this.time = time*1000;

        //To control the current time at the animation
        this.currentTime = 0;

        //Saves the instant it reaches each controlpoint
        this.totalTimes = [];        //only used to update segmentCounter
        this.totalDistance;

        //Saves the time it takes during each segment of the travel
        this.segmentTimes = [];      //to calculate the position of the component
        this.segmentCounter = 0;    //which points to keep in mind when computing the positions
        
        //Rotation in yy to point to next controlpoint (Last position of the vector should be the last angle of the movement)
        this.allAngles = [];

        //Control variables: current position, segment counter
        this.currentPosition;

        //Indicates if animation ended
        this.hasFinishedAnimations = false;
    }

    /**
     * Initiates the Linear animation members
     */
    init(){

        //Calculates total distance
        this.totalDistance = this.getTotalDistance();

        //Fills this.segmentTimes and this.totalTimes
        this.setTimes();

        //Saves initial position
        this.currentPosition = this.points[0].getVec3();

        //Init the angles of segments
        for(var i = 0; i < this.points.length-1 ; i++) {
            this.allAngles.push(this.points[i].getAngle2D(this.points[i+1]));
        }
        //Last position angle
        this.allAngles.push(this.allAngles[this.allAngles.length-1])
    }

    /**
     * Calculates total distance of the travel (moving trough all controlpoints)
     */
    getTotalDistance(){
        var distance = 0;

        for(var i=0; i < this.points.length - 1; i++){
            distance += this.points[i].getDistance(this.points[i+1]);
        }

        return distance;
    }

    
    /**
     * Saves times to travel each segment (segmentTimes) and instants to reach each controlpoint (totalTimes)
     */
    setTimes(){
        this.totalTimes.push(0);
        var segmentDistance;
        var segmentTime;

        for(var i = 0; i < this.points.length - 1; i++){

            segmentDistance = this.points[i].getDistance(this.points[i+1]);
            segmentTime = segmentDistance*this.time/this.totalDistance;

            this.segmentTimes[i] = segmentTime;
            this.totalTimes[i+1] = this.totalTimes[i] + segmentTime;  
        }
    }
    
    /**
     * @param {Updates the linear animation values} deltaTime 
     * @returns 
     *          -1 - animation ended
     *           0 - animation still going
     */
    update(deltaTime){
        //Calculate current time
        this.currentTime += deltaTime;

        //Updates current segment and updates alpha if needed
        var i = this.segmentCounter;
        while(this.totalTimes[i] < this.currentTime)
            i++;
        this.segmentCounter = i - 1;

        /*
        if(this.currentTime >= this.totalTimes[this.segmentCounter + 1]) {
            this.segmentCounter++;
        }
        */

        //index of Fragment points
        var init = this.segmentCounter; 
        var end = this.segmentCounter + 1;
        
        //Verify if animation ended
        if(end == this.points.length) {
            this.currentPosition = this.points[this.points.length-1].getVec3();
            return -1;
        }

        //Fragment points (animation still going)
        var initPoint = this.points[init];
        var endPoint = this.points[end]; 

        //Update position
        var segmentTime = this.currentTime - this.totalTimes[init];
        var ratio = segmentTime / this.segmentTimes[init];
        this.currentPosition = initPoint.getCurrentPosition(endPoint,ratio);

        //Animation didn't end
        return 0;
    }

    /**
     * Applies the Animation transformations.
     */
    apply(){
        this.scene.translate(this.currentPosition[0],this.currentPosition[1],this.currentPosition[2]);
        this.scene.rotate(this.allAngles[this.segmentCounter], 0, 1, 0);
    }

    /**
     * Add controlpoint to the Linear Animation.
     * @param {X position of control point} x 
     * @param {Y position of control point} y 
     * @param {Z position of control point} z 
     */
    addControlPoint(x,y,z){
        this.points.push(new Coord(x,y,z));
    }
}