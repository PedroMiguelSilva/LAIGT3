class CameraAnimation {
    constructor(camera,time,startAng,rotAng){
        this.camera = camera;
        this.time = time*1000;
        this.rotAng = rotAng;
        this.startAng = startAng;

        this.finalAngle = startAng + rotAng;
       
        this.angSpeed = this.rotAng/this.time;

        this.currentTime = 0;
        this.alpha = this.startAng;
        this.previousAlpha = this.startAng;
    }

    /**
     * Update the position of the camera
     * @param {Delta time} deltaTime
     * @returns   -1 - animation ended
     *            0 - animation to be continued
     */
    update(deltaTime){
        this.alpha += this.angSpeed * deltaTime;

        if(this.angSpeed >= 0){
            if(this.alpha >= this.startAng + this.rotAng){
                this.camera.orbit(vec3.fromValues(0,1,0),this.finalAngle - this.previousAlpha);
                return -1;
            }
                
        }
        else if(this.angSpeed < 0){
            if(this.alpha <= this.startAng + this.rotAng){
                this.camera.orbit(vec3.fromValues(0,1,0),this.finalAngle - this.previousAlpha);
                return -1;
            }
                
        }
        this.camera.orbit(vec3.fromValues(0,1,0),this.alpha-this.previousAlpha);
        this.previousAlpha = this.alpha;
        return 0;
    }

    apply(){
        
    }
}