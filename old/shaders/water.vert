attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;

uniform float normScale;
uniform float timeFactor;
uniform float dirX;
uniform float dirY;

uniform sampler2D uSampler2;

void main() {

	
    vTextureCoord = aTextureCoord;

    vec3 pos = vec3(aVertexPosition.x,
                    aVertexPosition.y + texture2D(uSampler2,aTextureCoord+vec2(timeFactor,timeFactor))[1]*normScale,
                    aVertexPosition.z);

    gl_Position = uPMatrix * uMVMatrix * vec4(  pos,
                                                1.0);

}
