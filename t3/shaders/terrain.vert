attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float normScale;

void main() {

    vTextureCoord = aTextureCoord;

    vec3 pos = vec3(aVertexPosition.x,
                    aVertexPosition.y + texture2D(uSampler2,aTextureCoord)[1]*normScale,
                    aVertexPosition.z);

    gl_Position = uPMatrix * uMVMatrix * vec4(  pos,
                                                1.0);
    

}
