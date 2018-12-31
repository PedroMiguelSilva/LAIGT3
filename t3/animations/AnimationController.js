/**
 * Manages the animations of an object
 * Manages the starting and ending of each animation
 */
class AnimationController {
    constructor(scene){
        this.scene = scene;
        this.animations = [];
        this.currentAnimationIndex = 0;
        this.doneWithAnimations = true;
    }

    /**
     * Updates the animations in 'currentAnimationIndex' from vector 'animations'
     * If one animation ends, counter increases to next animation
     * @returns -1 if it has no longer any animation
     */
    update(timeElapsed){
        if(this.doneWithAnimations){
            return -1;
        }
        //console.log("update")

        var hasEnded = this.animations[this.currentAnimationIndex].update(timeElapsed);
        if(hasEnded){
            this.currentAnimationIndex++;
        }
        
        //If it has reached the end of the final animation
        if(this.currentAnimationIndex == this.animations.length){
            this.currentAnimationIndex = this.animations.length -1;
            this.doneWithAnimations = true;
        }
        return 0;    
    }

    /**
     * Should be called before the display of the object it contains
     */
    apply(){
        //console.log("apply")
        if(this.animations.length > 0){
            this.animations[this.currentAnimationIndex].apply();
        }
    }

    addAnimation(newAnimation){
        this.animations.push(newAnimation);
        this.doneWithAnimations = false;
    }
}