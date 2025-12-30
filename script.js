// 1. SETUP THE SCENE
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.02); // Black fog for depth

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg-canvas'),
  alpha: true,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 30;

// 2. LIGHTING
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const neonLight = new THREE.PointLight(0x39ff14, 2, 50); // Green light
neonLight.position.set(10, 10, 10);
scene.add(neonLight);

// 3. THE "ENERGY CORE" OBJECT
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshStandardMaterial({
    color: 0x39ff14, // Neon Green
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const core = new THREE.Mesh(geometry, material);
scene.add(core);

// 4. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);

    // Rotate the core
    core.rotation.x += 0.005;
    core.rotation.y += 0.005;

    // Pulse effect
    const time = Date.now() * 0.001;
    core.scale.setScalar(1 + Math.sin(time) * 0.05);

    renderer.render(scene, camera);
}
animate();

// 5. PAGE SWITCHING LOGIC
window.showPage = function(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        setTimeout(() => page.classList.add('hidden'), 500);
    });

    // Show target page
    const target = document.getElementById(pageId);
    target.classList.remove('hidden');
    setTimeout(() => target.classList.add('active'), 50);

    // Move the 3D Background based on page
    if(pageId === 'home') {
        gsap.to(core.position, {x: 0, duration: 1});
        gsap.to(camera.position, {z: 30, duration: 1});
    } else {
        // Move object to the side so text is readable
        gsap.to(core.position, {x: 20, duration: 1});
        gsap.to(camera.position, {z: 25, duration: 1});
    }
}

// 6. RESIZE HANDLER
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 7. HANDLE FORM SUBMISSION (LINKED TO YOUR EMAIL)
function handleFormSubmit(event) {
    event.preventDefault(); // Stop page reload

    // --- YOUR ID IS CONFIGURED HERE ---
    const formId = "xeeqddzr"; 
    const endpoint = `https://formspree.io/f/${formId}`;
    // ----------------------------------

    const form = document.getElementById('contactForm');
    const formContainer = document.getElementById('register-form-container');
    const successMsg = document.getElementById('success-message');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Change button text to show loading
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "TRANSMITTING...";
    submitBtn.disabled = true;

    // Send data to Email
    const formData = new FormData(form);
    
    fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // SUCCESS: Hide form, Show message
            formContainer.style.display = 'none';
            successMsg.style.display = 'block';
            form.reset(); // Clear the form
        } else {
            // ERROR
            alert("Transmission Error. Please check your internet or try again.");
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    }).catch(error => {
        alert("System Error: " + error.message);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    });
}