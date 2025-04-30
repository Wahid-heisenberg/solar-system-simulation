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
        
        // Touch event handling
        this.touchActive = false;
        this.lastTouchTime = 0;
        this.touchStartPosition = new THREE.Vector2();
        this.touchThreshold = 10; // pixels - threshold to distinguish between tap and swipe
        
        // Get tooltip element
        this.tooltip = document.getElementById('tooltip');
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
        // Mouse events
        this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.domElement.addEventListener('click', this.onMouseClick.bind(this));
        
        // Touch events - optimized for mobile
        this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
        
        // Keyboard for switching controls
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    
    onTouchStart(event) {
        // Store the touch start time and position
        this.touchActive = true;
        this.touchStartTime = Date.now();
        
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.touchStartPosition.x = touch.clientX;
            this.touchStartPosition.y = touch.clientY;
            
            // Set mouse position for raycasting
            const rect = this.domElement.getBoundingClientRect();
            this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Show tooltip on touch
            this.checkHoverObjects(touch.clientX, touch.clientY);
        }
    }
    
    onTouchMove(event) {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            
            // Calculate movement distance to determine if it's a drag
            const moveX = Math.abs(touch.clientX - this.touchStartPosition.x);
            const moveY = Math.abs(touch.clientY - this.touchStartPosition.y);
            
            if (moveX > this.touchMoveThreshold || moveY > this.touchMoveThreshold) {
                // Hide tooltip during camera movement
                this.tooltip.classList.add('hidden');
                this.touchDragging = true;
            }
        }
    }
    
    onTouchEnd(event) {
        // Detect if this was a tap (short duration, minimal movement)
        const touchDuration = Date.now() - this.touchStartTime;
        const touchWasShort = touchDuration < 300;
        
        if (touchWasShort && !this.touchDragging && event.changedTouches.length === 1) {
            const touch = event.changedTouches[0];
            
            // Set mouse position for raycasting
            const rect = this.domElement.getBoundingClientRect();
            this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Handle as a click
            this.checkClickObjects();
        }
        
        // Reset touch state
        this.tooltip.classList.add('hidden');
        this.touchActive = false;
        this.touchDragging = false;
    }
    
    onMouseMove(event) {
        // Skip if touch is active
        if (this.touchActive) return;
        
        // Calculate mouse position
        const rect = this.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Check hover
        this.checkHoverObjects(event.clientX, event.clientY);
    }
    
    onMouseClick(event) {
        // Skip if touch is active
        if (this.touchActive) return;
        
        // Calculate mouse position
        const rect = this.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Handle click
        this.checkClickObjects();
    }
    
    onKeyDown(event) {
        // Toggle between orbit and fly controls with 'F' key
        if (event.key === 'f' || event.key === 'F') {
            this.setControlType(this.controlType === 'orbit' ? 'fly' : 'orbit');
        }
    }
    
    checkHoverObjects(clientX, clientY) {
        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(this.hoverObjects, true);
        
        // Reset cursor and hide tooltip
        this.domElement.style.cursor = 'auto';
        this.tooltip.classList.add('hidden');
        
        if (intersects.length > 0) {
            // Get the first intersected object
            let intersectedObject = intersects[0].object;
            let targetObject = null;
            let celestialBody = null;
            
            // Check the object and its parents for userData or as clickable objects
            while (intersectedObject) {
                // Check if this object is in our hover list
                if (this.hoverObjects.includes(intersectedObject)) {
                    targetObject = intersectedObject;
                }
                
                // Check if this object has celestialBody data
                if (intersectedObject.userData && intersectedObject.userData.celestialBody) {
                    celestialBody = intersectedObject.userData.celestialBody;
                }
                
                // If we've found what we need, break
                if (targetObject && celestialBody) break;
                
                // Move up to parent
                intersectedObject = intersectedObject.parent;
            }
            
            // If we found a target object, show hover effects
            if (targetObject) {
                this.domElement.style.cursor = 'pointer';
                
                // Get the name to display
                let displayName = '';
                
                // Try to get the name from the celestial body first
                if (celestialBody) {
                    displayName = celestialBody.name;
                } else if (targetObject.name) {
                    // Fallback to object name
                    displayName = targetObject.name;
                }
                
                // Show tooltip with name if we have one
                if (displayName) {
                    this.tooltip.textContent = displayName;
                    this.tooltip.style.left = (clientX + 10) + 'px';
                    this.tooltip.style.top = (clientY + 10) + 'px';
                    this.tooltip.classList.remove('hidden');
                }
            }
        }
    }
    
    checkClickObjects() {
        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            // Debug info
            // console.log("Clicked on something:", intersects[0].object);
            
            let intersectedObj = intersects[0].object;
            let foundCelestialBody = null;
            
            // Try to find the celestial body reference and the actual mesh object
            while (intersectedObj && !foundCelestialBody) {
                // Check if this object has celestialBody data
                if (intersectedObj.userData && intersectedObj.userData.celestialBody) {
                    foundCelestialBody = intersectedObj.userData.celestialBody;
                    // console.log("Found celestial body:", foundCelestialBody.originalName);
                    break;
                }
                
                // Move up to parent
                intersectedObj = intersectedObj.parent;
            }
            
            // Focus camera on the object if found
            if (foundCelestialBody) {
                // Focus on the main mesh of the celestial body
                this.focusObject(foundCelestialBody.mesh);
                
                // Open the info panel using the original name for consistent data lookup
                if (window.uiManager) {
                    window.uiManager.showInfoPanel(foundCelestialBody.originalName);
                }
            }
        }
    }
    
    addHoverObject(object) {
        if (!this.hoverObjects.includes(object)) {
            this.hoverObjects.push(object);
        }
        
        // Also add the object to the clickable objects
        this.addClickObject(object);
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
