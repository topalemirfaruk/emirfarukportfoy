import * as THREE from 'three';
import Application from '../Application';
import Resources from '../Utils/Resources';

export default class Penguin {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    model: THREE.Group;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;

        this.setModel();
    }

    setModel() {
        this.model = this.resources.items.gltfModel.penguinModel.scene;

        console.log('Penguin model loaded:', this.model);

        // Fix Scale: Slightly smaller
        const s = 7;
        this.model.scale.set(s, s, s);

        // Fix Material: Scene has no lights, so we must use MeshBasicMaterial
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const oldMat = child.material as THREE.MeshStandardMaterial;
                const newMat = new THREE.MeshBasicMaterial({
                    map: oldMat.map,
                    color: oldMat.color,
                    side: THREE.DoubleSide
                });
                child.material = newMat;
            }
        });

        // Position: 
        // X: -650 (Between papers and keyboard)
        // Y: -320 (Lower even more to fix floating)
        // Z: 1000 (In the gap)
        this.model.position.set(-1400, -430, 1000);

        // Rotate to face the user
        this.model.rotation.y = Math.PI / 6;

        this.scene.add(this.model);
    }
}
