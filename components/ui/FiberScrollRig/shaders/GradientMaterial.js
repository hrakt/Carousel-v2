import { ShaderMaterial } from 'three';

export default class GradientMaterial extends ShaderMaterial {
    constructor(options) {
        super({
            vertexShader: `
            varying vec3 vUv; 

            void main() {
              vUv = position; 
        
              vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * modelViewPosition; 
            }`,
            fragmentShader: `
            uniform vec3 colorA; 
            uniform vec3 colorB; 
            varying vec3 vUv;
        
            void main() {
              gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
            }`,
            uniforms: {
                colorA: { type: 'vec3', value: options.colorA },
                colorB: { type: 'vec3', value: options.colorB },
            },
        });
    }
}
