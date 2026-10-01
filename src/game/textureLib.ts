import * as THREE from "three";

const URLS: Record<string, string> = {
  asphalt: "/textures/asphalt.jpg",
  sand: "/textures/sand.jpg",
  ice: "/textures/ice.jpg",
  cobble: "/textures/cobble.jpg",
  wood: "/textures/wood.jpg",
  magma: "/textures/magma.jpg",
  dirt: "/textures/dirt.jpg",
  cyber: "/textures/cyber.jpg",
  ground_beach: "/textures/ground_beach.jpg",
  ground_spooky: "/textures/ground_spooky.jpg",
  ground_ice: "/textures/ground_ice.jpg",
  ground_volcano: "/textures/ground_volcano.jpg",
  ground_cyber: "/textures/ground_cyber.jpg",
  ground_sky: "/textures/ground_sky.jpg",
  sky_beach: "/textures/sky_beach.jpg",
  sky_spooky: "/textures/sky_spooky.jpg",
  sky_cyber: "/textures/sky_cyber.jpg",
  sky_ice: "/textures/sky_ice.jpg",
  sky_volcano: "/textures/sky_volcano.jpg",
  sky_sky: "/textures/sky_sky.jpg",
};

const images: Record<string, HTMLImageElement | "loading" | "fail"> = {};

export function preloadTextures() {
  if (typeof Image === "undefined") return;
  for (const [key, url] of Object.entries(URLS)) {
    if (images[key]) continue;
    images[key] = "loading";
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      images[key] = img;
    };
    img.onerror = () => {
      images[key] = "fail";
    };
    img.src = url;
  }
}

preloadTextures();

export function getLoadedImage(name: string): HTMLImageElement | null {
  const v = images[name];
  return v instanceof HTMLImageElement ? v : null;
}

export function applyAlbedoMap(
  name: string,
  fallback: THREE.Texture,
  repeatY = 40,
): THREE.Texture {
  const img = getLoadedImage(name);
  const tex = img ? new THREE.Texture(img) : fallback;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, repeatY);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

export function repeatingGround(name: string, repeat = 48): THREE.Texture {
  const img = getLoadedImage(name);
  const tex = img ? new THREE.Texture(img) : new THREE.Texture();
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = !!img;
  return tex;
}

export function skyTexture(theme: string): THREE.Texture | null {
  const key = `sky_${theme === "beach" ? "beach" : theme === "spooky" ? "spooky" : theme === "cyber" ? "cyber" : theme === "ice" ? "ice" : theme === "volcano" ? "volcano" : "sky"}`;
  const img = getLoadedImage(key);
  if (!img) return null;
  const tex = new THREE.Texture(img);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export const GROUND_BY_THEME: Record<string, string> = {
  beach: "ground_beach",
  spooky: "ground_spooky",
  cyber: "ground_cyber",
  ice: "ground_ice",
  volcano: "ground_volcano",
  sky: "ground_sky",
};
