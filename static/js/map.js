// map.js - Three.js Implementation for Aerial View of Restaurant
document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('three-map');
    if (!mapContainer) return;

    // Escena, Cámara y Renderizador
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f7f6); // Mismo fondo que CSS para fusionarse bien
    
    // Cámara ortográfica para plano aéreo
    const aspect = mapContainer.clientWidth / mapContainer.clientHeight;
    const d = 50;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(0, 100, 0); // Altura para vista aérea
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mapContainer.clientWidth, mapContainer.clientHeight);
    mapContainer.appendChild(renderer.domElement);

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(20, 100, 20);
    scene.add(dirLight);

    // Piso del Restaurante
    const floorGeometry = new THREE.PlaneGeometry(80, 60);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Mesas (Verdes)
    const tableGeometry = new THREE.BoxGeometry(8, 2, 8);
    const tableMaterialFree = new THREE.MeshStandardMaterial({ color: 0x009A44 }); // Verde UTCH
    const tableMaterialSelected = new THREE.MeshStandardMaterial({ color: 0xF39C12 }); // Amarillo/Naranja

    const tablesData = [
        { id: 'Mesa 1', x: -20, z: -15 },
        { id: 'Mesa 2', x: 0, z: -15 },
        { id: 'Mesa 3', x: 20, z: -15 },
        { id: 'Mesa 4', x: -20, z: 15 },
        { id: 'Mesa 5', x: 0, z: 15 },
        { id: 'Mesa 6', x: 20, z: 15 },
    ];

    const tablesMeshes = [];

    tablesData.forEach(data => {
        const table = new THREE.Mesh(tableGeometry, tableMaterialFree.clone());
        table.position.set(data.x, 1, data.z);
        table.userData = { id: data.id, status: 'free' };
        scene.add(table);
        tablesMeshes.push(table);
    });

    // Interacción (Raycaster)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedTableMesh = null;

    mapContainer.addEventListener('mousedown', onDocumentMouseDown, false);

    function onDocumentMouseDown(event) {
        event.preventDefault();
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / mapContainer.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / mapContainer.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(tablesMeshes);

        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            
            // Restablecer material previo
            if (selectedTableMesh) {
                selectedTableMesh.material.color.setHex(0x009A44);
            }
            
            // Marcar nueva selección
            selectedTableMesh = mesh;
            mesh.material.color.setHex(0xF39C12);
            
            // Actualizar formulario UI
            document.getElementById('selectedTable').value = mesh.userData.id;
        }
    }

    // Animación / Render Loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        if(!mapContainer) return;
        const width = mapContainer.clientWidth;
        const height = mapContainer.clientHeight;
        renderer.setSize(width, height);
        const aspect = width / height;
        camera.left = -d * aspect;
        camera.right = d * aspect;
        camera.top = d;
        camera.bottom = -d;
        camera.updateProjectionMatrix();
    });
});
