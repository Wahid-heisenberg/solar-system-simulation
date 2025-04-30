class ControlsManager {
    constructor(camera, renderer, scene) {
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;
        this.domElement = renderer.domElement;
        this.orbitControls = null;
        this.flyControls = null;
        this.activeControls = null;
        this.controlType = 'orbit'; // 'orbit' or 'fly'
        this.targetObject = null;
        this.originalPosition = null;
        this.isTransitioning = false;
        this.focusDistance = 5; // Default distance when focusing on an object
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoverObjects = [];
        this.clickableObjects = [];
    }
    
    initialize() {
        // Initialize OrbitControls
        this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.rotateSpeed = 0.5;
        this.orbitControls.minDistance = 1;
        this.orbitControls.maxDistance = 100;
        
        // Initialize FlyControls
        this.flyControls = new THREE.FlyControls(this.camera, this.renderer.domElement);
        this.flyControls.movementSpeed = 3;
        this.flyControls.rollSpeed = 0.5;
        this.flyControls.dragToLook = true;
        
        // Set default control
        this.setControlType(this.controlType);
        
        // Add event listeners
        this.addEventListeners();
    }
    
    setControlType(type) {
        this.controlType = type;
        
        // Disable both controls first
        this.orbitControls.enabled = false;
        this.flyControls.enabled = false;
        
        // Enable selected control
        if (type === 'orbit') {
            this.activeControls = this.orbitControls;
            this.orbitControls.enabled = true;
        } else if (type === 'fly') {
            this.activeControls = this.flyControls;
            this.flyControls.enabled = true;
        }
    }
    
    addEventListeners() {
        // Mouse move for hover effects
        this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Mouse click for selection
        this.domElement.addEventListener('click', this.onMouseClick.bind(this));
        
        // Keyboard for switching controls
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    
    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        const rect = this.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.checkHoverObjects();
    }
    
    onMouseClick(event) {
        // Calculate mouse position in normalized device coordinates
        const rect = this.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.checkClickObjects();
    }
    
    onKeyDown(event) {
        // Toggle between orbit and fly controls with 'F' key
        if (event.key === 'f' || event.key === 'F') {
            this.setControlType(this.controlType === 'orbit' ? 'fly' : 'orbit');
        }
    }
    
    checkHoverObjects() {
        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(this.hoverObjects, true);
        
        // Reset cursor
        this.domElement.style.cursor = 'auto';
        
        // Hide all tooltips
        document.getElementById('tooltip').classList.add('hidden');
        
        if (intersects.length > 0) {
            // Find parent object that is in our clickable list
            let targetObject = intersects[0].object;
            while (targetObject.parent && !this.hoverObjects.includes(targetObject)) {
                targetObject = targetObject.parent;
            }
            
            if (this.hoverObjects.includes(targetObject)) {
                // Show hover effect
                this.domElement.style.cursor = 'pointer';
                
                // Get data for tooltip
                const name = targetObject.name;
                if (name && name !== '') {
                    // Show tooltip
                    const tooltip = document.getElementById('tooltip');
                    tooltip.textContent = name;
                    tooltip.style.left = (event.clientX + 10) + 'px';
                    tooltip.style.top = (event.clientY + 10) + 'px';
                    tooltip.classList.remove('hidden');
                }
            }
        }
    }
    
    checkClickObjects() {
        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(this.clickableObjects, true);
        
        if (intersects.length > 0) {
            // Find parent object that is in our clickable list
            let targetObject = intersects[0].object;
            while (targetObject.parent && !this.clickableObjects.includes(targetObject)) {
                targetObject = targetObject.parent;
            }
            
            if (this.clickableObjects.includes(targetObject)) {
                this.focusObject(targetObject);
                
                // Trigger info panel
                if (window.uiManager) {
                    window.uiManager.showInfoPanel(targetObject.name);
                }
            }
        }
    }
    
    addHoverObject(object) {
        if (!this.hoverObjects.includes(object)) {
            this.hoverObjects.push(object);
        }
    }
    
    addClickObject(object) {
        if (!this.clickableObjects.includes(object)) {
            this.clickableObjects.push(object);
        }
    }
    
    focusObject(object) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.targetObject = object;
        
        // Save current camera position
        this.originalPosition = this.camera.position.clone();
        
        // Target position relative to the object
        const objectWorldPosition = new THREE.Vector3();
        object.getWorldPosition(objectWorldPosition);
        
        // Calculate target distance based on object size
        let targetDistance = this.focusDistance;
        if (object.geometry && object.geometry.boundingSphere) {
            targetDistance = object.geometry.boundingSphere.radius * 5;
        }
        
        // Calculate target position
        const direction = new THREE.Vector3().subVectors(this.camera.position, objectWorldPosition).normalize();
        const targetPosition = objectWorldPosition.clone().add(direction.multiplyScalar(targetDistance));
        
        // Animate camera
        const duration = 1000; // milliseconds
        const startTime = Date.now();
        
        const animate = () => {
            const currentTime = Date.now();
            let t = (currentTime - startTime) / duration;
            
            if (t > 1) t = 1;
            
            // Ease in-out function
            t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            
            this.camera.position.lerpVectors(this.originalPosition, targetPosition, t);
            this.camera.lookAt(objectWorldPosition);
            
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation finished
                this.isTransitioning = false;
                
                // Update orbit controls target
                if (this.orbitControls) {
                    this.orbitControls.target.copy(objectWorldPosition);
                }
            }
        };
        
        animate();
    }
    
    resetView() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Save current position
        const originalPosition = this.camera.position.clone();
        
        // Target position
        const targetPosition = new THREE.Vector3(0, 20, 30);
        
        // Animate camera
        const duration = 1000; // milliseconds
        const startTime = Date.now();
        
        const animate = () => {
            const currentTime = Date.now();
            let t = (currentTime - startTime) / duration;
            
            if (t > 1) t = 1;
            
            // Ease in-out function
            t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            
            this.camera.position.lerpVectors(originalPosition, targetPosition, t);
            this.camera.lookAt(0, 0, 0);
            
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation finished
                this.isTransitioning = false;
                
                // Update orbit controls target
                if (this.orbitControls) {
                    this.orbitControls.target.set(0, 0, 0);
                }
            }
        };
        
        animate();
    }
    
    topView() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Save current position
        const originalPosition = this.camera.position.clone();
        
        // Target position
        const targetPosition = new THREE.Vector3(0, 50, 0.1);
        
        // Animate camera
        const duration = 1000; // milliseconds
        const startTime = Date.now();
        
        const animate = () => {
            const currentTime = Date.now();
            let t = (currentTime - startTime) / duration;
            
            if (t > 1) t = 1;
            
            // Ease in-out function
            t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            
            this.camera.position.lerpVectors(originalPosition, targetPosition, t);
            this.camera.lookAt(0, 0, 0);
            
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation finished
                this.isTransitioning = false;
                
                // Update orbit controls target
                if (this.orbitControls) {
                    this.orbitControls.target.set(0, 0, 0);
                }
            }
        };
        
        animate();
    }
    
    update(delta) {
        if (this.controlType === 'orbit') {
            this.orbitControls.update();
        } else if (this.controlType === 'fly') {
            this.flyControls.update(delta);
        }
    }
}
