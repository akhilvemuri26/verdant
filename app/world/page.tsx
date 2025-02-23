"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useAuthContext } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';

export default function WorldPage() {
  const mountRef = useRef<HTMLDivElement>(null)
  const { user } = useAuthContext()
  const [ecoScore, setEcoScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadEcoScore()
  }, [user])

  async function loadEcoScore() {
    try {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("eco_score")
        .eq("user_id", user!.id)
        .single()

      if (profile) setEcoScore(profile.eco_score)
    } catch (error) {
      console.error("Error loading eco-score:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!mountRef.current || loading) return

    const mount = mountRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.z = 12

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5)
    scene.add(hemisphereLight)

    const geometry = new THREE.SphereGeometry(5, 256, 256)

    // Improved terrain generation using Perlin noise
    const noise = new ImprovedNoise();
    const generateHeight = (x: number, y: number, z: number, score: number): number => {
      let height = 0;
      const roughness = 0.3 - score * 0.002; // Adjust roughness based on score
      height += noise.noise(x * 1.5, y * 1.5, z * 1.5) * roughness;
      height += noise.noise(x * 3, y * 3, z * 3) * roughness / 2; // Higher frequency for detail
      height += noise.noise(x * 6, y * 6, z * 6) * roughness / 4; // Even higher frequency for fine detail
      return height;
    };

    const applyTerrain = (geom: THREE.SphereGeometry, score: number) => {
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vertex = new THREE.Vector3().fromBufferAttribute(pos, i);
        const normalized = vertex.clone().normalize();
        const height = generateHeight(normalized.x, normalized.y, normalized.z, score);
        vertex.addScaledVector(normalized, height * (score < 50 ? 0.8 : 0.4)); // Scale height adjustment
        pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      pos.needsUpdate = true;
      geom.computeVertexNormals();
    };

    const getColorBasedOnEcoScore = (score: number): THREE.Color => {
      const ranges = [
        "#5a5a5a", // 1-10: Grey barren
        "#7a6b55", // 11-20: Sparse vegetation
        "#9c8555", // 21-30: Dry grass
        "#a7a27a", // 31-40: Patchy green
        "#8db374", // 41-50: Grass with sparse trees
        "#6faa5b", // 51-60: Lush grass
        "#4c8c4a", // 61-70: Dense vegetation
        "#3f7f3f", // 71-80: Thick forests with rivers
        "#2f702f", // 81-90: Nearly perfect world
        "#1f5e1f"  // 91-100: Perfect lush world
      ];
      return new THREE.Color(ranges[Math.min(Math.floor((score - 1) / 10), 9)]);
    };

    const material = new THREE.MeshStandardMaterial({
      color: getColorBasedOnEcoScore(ecoScore),
      roughness: 0.7,
      metalness: 0.1,
      flatShading: false,
    });

    const globe = new THREE.Mesh(geometry, material);
    applyTerrain(geometry, ecoScore);
    scene.add(globe);

    // Add volcanoes and lava for scores 20-40
    if (ecoScore >= 0 && ecoScore <= 45) {
      const volcanoGeometry = new THREE.ConeGeometry(0.5, 1.5, 32);
      const volcanoMaterial = new THREE.MeshStandardMaterial({ color: 0x603913, roughness: 0.8, metalness: 0.0 });
      const lavaMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0xff4500, emissiveIntensity: 1, roughness: 0.9 });

      for (let i = 0; i < 3; i++) { // Create a few volcanoes
        const volcano = new THREE.Mesh(volcanoGeometry, volcanoMaterial);
        const lava = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), lavaMaterial);

        // Randomly position the volcanoes
        const angle = Math.random() * Math.PI * 2;
        const distance = 4.0;
        volcano.position.x = Math.cos(angle) * distance;
        volcano.position.z = Math.sin(angle) * distance;
        volcano.position.y = generateHeight(volcano.position.x, 0, volcano.position.z, ecoScore) + 0.5; // Adjust height

        lava.position.copy(volcano.position);
        lava.position.y += 1.0; // Position lava at the top of the volcano

        scene.add(volcano);
        scene.add(lava);
      }
    }

    // Add details for scores 40-70 (Trees and Flowers)
    if (ecoScore > 40 && ecoScore <= 70) {
      // Trees
      const treeGeometry = new THREE.ConeGeometry(0.2, 0.7, 32);
      const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.7, metalness: 0.0 });

      for (let i = 0; i < 5; i++) {
        const tree = new THREE.Mesh(treeGeometry, treeMaterial);

        const angle = Math.random() * Math.PI * 2;
        const distance = 4.0;

        tree.position.x = Math.cos(angle) * distance;
        tree.position.z = Math.sin(angle) * distance;
        tree.position.y = generateHeight(tree.position.x, 0, tree.position.z, ecoScore) + 0.4; // Adjust height

        scene.add(tree);
      }

      // Flowers
      const flowerGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const flowerMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA07A, roughness: 0.7, metalness: 0.0 });

      for (let i = 0; i < 8; i++) {
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);

        const angle = Math.random() * Math.PI * 2;
        const distance = 4.2; // Spread flowers slightly further

        flower.position.x = Math.cos(angle) * distance;
        flower.position.z = Math.sin(angle) * distance;
        flower.position.y = generateHeight(flower.position.x, 0, flower.position.z, ecoScore) + 0.2; // Adjust height

        scene.add(flower);
      }
    }

    // Lush Forests and Flowers for higher scores
    if (ecoScore > 70) {
      const forestGeometry = new THREE.ConeGeometry(0.3, 1.0, 32);
      const forestMaterial = new THREE.MeshStandardMaterial({ color: 0x006400, roughness: 0.7, metalness: 0.0 });

      for (let i = 0; i < 10; i++) {
        const forest = new THREE.Mesh(forestGeometry, forestMaterial);

        const angle = Math.random() * Math.PI * 2;
        const distance = 4.0;

        forest.position.x = Math.cos(angle) * distance;
        forest.position.z = Math.sin(angle) * distance;
        forest.position.y = generateHeight(forest.position.x, 0, forest.position.z, ecoScore) + 0.5; // Adjust height

        scene.add(forest);
      }

      const flowerGeometry = new THREE.SphereGeometry(0.07, 8, 8);
      const flowerMaterial = new THREE.MeshStandardMaterial({ color: 0x90EE90, roughness: 0.7, metalness: 0.0 });

      for (let i = 0; i < 12; i++) {
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);

        const angle = Math.random() * Math.PI * 2;
        const distance = 4.3; // Spread flowers slightly further

        flower.position.x = Math.cos(angle) * distance;
        flower.position.z = Math.sin(angle) * distance;
        flower.position.y = generateHeight(flower.position.x, 0, flower.position.z, ecoScore) + 0.3; // Adjust height

        scene.add(flower);
      }
    }

     // Add water layer for scores >= 61
     if (ecoScore >= 61) {
        const waterGeometry = new THREE.SphereGeometry(5.02, 256, 256); // Slightly larger radius
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#4a90e2"),
            transparent: true,
            opacity: 0.4, // Adjust opacity for better visibility
            roughness: 0.1, // Make it smoother
            metalness: 0.2,
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        scene.add(water);
    }

    // Improved Clouds for scores >= 81
    if (ecoScore >= 81) {
        const cloudGeometry = new THREE.SphereGeometry(5.1, 128, 128);
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#ffffff"),
            transparent: true,
            opacity: 0.4,
            roughness: 0.8,
            metalness: 0,
        });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        scene.add(clouds);
    }

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = false

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    const animate = () => {
      requestAnimationFrame(animate)
      globe.rotation.y += 0.0015
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      mount.removeChild(renderer.domElement)
    }
  }, [ecoScore, loading])

  return (
    <div className="container py-8 h-[calc(100vh-8rem)]">
      <div ref={mountRef} className="w-full h-full rounded-lg overflow-hidden" />
    </div>
  )
}

