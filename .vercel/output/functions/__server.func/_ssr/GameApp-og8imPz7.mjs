import { i as __toESM } from "../_runtime.mjs";
import { G as require_jsx_runtime, K as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as CircleHelp, E as Aperture, S as Circle, T as ChevronLeft, _ as Flag, a as Volume2, b as Crosshair, c as TriangleAlert, d as Shield, f as RotateCcw, g as Gauge, h as Hammer, i as VolumeX, l as Star, m as Play, n as X, o as User, p as Rocket, r as Wrench, s as Trophy, t as Zap, u as Snowflake, v as Eye, w as ChevronRight, x as CloudLightning, y as Droplets } from "../_libs/lucide-react.mjs";
import { A as Object3D, B as ShapeGeometry, C as LinearMipmapLinearFilter, D as MeshLambertMaterial, E as MeshBasicMaterial, F as RepeatWrapping, H as Texture, I as RingGeometry, L as SRGBColorSpace, M as PerspectiveCamera, N as PlaneGeometry, O as MeshPhysicalMaterial, P as PointLight, R as Scene, S as LinearFilter, T as Mesh, U as TorusGeometry, V as SphereGeometry, W as Vector3, _ as FogExp2, a as BufferAttribute, b as IcosahedronGeometry, c as CatmullRomCurve3, d as ConeGeometry, f as CylinderGeometry, g as Float32BufferAttribute, h as ExtrudeGeometry, i as BoxGeometry, j as OctahedronGeometry, k as MeshStandardMaterial, l as CircleGeometry, m as DodecahedronGeometry, n as WebGLRenderer, o as BufferGeometry, p as DirectionalLight, r as AmbientLight, s as CanvasTexture, t as PMREMGenerator, u as Color, v as Group, w as MathUtils, x as InstancedMesh, y as HemisphereLight, z as Shape } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GameApp-og8imPz7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var URLS = {
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
	sky_sky: "/textures/sky_sky.jpg"
};
var images = {};
function preloadTextures() {
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
function getLoadedImage(name) {
	const v = images[name];
	return v instanceof HTMLImageElement ? v : null;
}
function applyAlbedoMap(name, fallback, repeatY = 40) {
	const img = getLoadedImage(name);
	const tex = img ? new Texture(img) : fallback;
	tex.wrapS = RepeatWrapping;
	tex.wrapT = RepeatWrapping;
	tex.repeat.set(1, repeatY);
	tex.anisotropy = 8;
	tex.colorSpace = SRGBColorSpace;
	tex.needsUpdate = true;
	tex.minFilter = LinearMipmapLinearFilter;
	tex.magFilter = LinearFilter;
	tex.generateMipmaps = true;
	return tex;
}
function repeatingGround(name, repeat = 48) {
	const img = getLoadedImage(name);
	const tex = img ? new Texture(img) : new Texture();
	tex.wrapS = RepeatWrapping;
	tex.wrapT = RepeatWrapping;
	tex.repeat.set(repeat, repeat);
	tex.anisotropy = 8;
	tex.colorSpace = SRGBColorSpace;
	tex.needsUpdate = !!img;
	return tex;
}
function skyTexture(theme) {
	const img = getLoadedImage(`sky_${theme === "beach" ? "beach" : theme === "spooky" ? "spooky" : theme === "cyber" ? "cyber" : theme === "ice" ? "ice" : theme === "volcano" ? "volcano" : "sky"}`);
	if (!img) return null;
	const tex = new Texture(img);
	tex.colorSpace = SRGBColorSpace;
	tex.needsUpdate = true;
	return tex;
}
var GROUND_BY_THEME = {
	beach: "ground_beach",
	spooky: "ground_spooky",
	cyber: "ground_cyber",
	ice: "ground_ice",
	volcano: "ground_volcano",
	sky: "ground_sky"
};
var TurtlePath = class {
	x = 0;
	y = 0;
	z = 0;
	heading = 0;
	points = [];
	constructor(startX = 0, startY = 0, startZ = 0, startHeading = 0) {
		this.x = startX;
		this.y = startY;
		this.z = startZ;
		this.heading = startHeading;
		this.points.push([
			this.x,
			this.y,
			this.z
		]);
	}
	forward(dist, elevationChange = 0, resolution = 15) {
		const steps = Math.max(1, Math.ceil(dist / resolution));
		const stepDist = dist / steps;
		const stepY = elevationChange / steps;
		const rad = this.heading * Math.PI / 180;
		for (let i = 0; i < steps; i++) {
			this.x += Math.sin(rad) * stepDist;
			this.z += Math.cos(rad) * stepDist;
			this.y += stepY;
			this.points.push([
				this.x,
				this.y,
				this.z
			]);
		}
	}
	turn(angle, radius, elevationChange = 0, resolution = 15) {
		const arcLen = Math.abs(angle) / 360 * 2 * Math.PI * radius;
		const steps = Math.max(1, Math.ceil(arcLen / resolution));
		const stepAngle = angle / steps;
		const stepY = elevationChange / steps;
		for (let i = 0; i < steps; i++) {
			const startRad = this.heading * Math.PI / 180;
			const dir = angle > 0 ? 1 : -1;
			const centerHeading = startRad + dir * Math.PI / 2;
			const cx = this.x + Math.sin(centerHeading) * radius;
			const cz = this.z + Math.cos(centerHeading) * radius;
			this.heading = (this.heading + stepAngle) % 360;
			const endRad = this.heading * Math.PI / 180;
			this.x = cx - Math.sin(endRad + dir * Math.PI / 2) * radius;
			this.z = cz - Math.cos(endRad + dir * Math.PI / 2) * radius;
			this.y += stepY;
			this.points.push([
				this.x,
				this.y,
				this.z
			]);
		}
	}
	/**
	* Smoothly bridges the track back to (0, 0, -straightApproach) facing exactly forward along +Z,
	* then adds a flat, straight approach right into the start line (0, 0, 0).
	* This guarantees that every track starts and finishes in the exact same forward direction,
	* with perfectly aligned grid slots and no orientation anomalies.
	*/
	closeTrack(straightApproach = 90, resolution = 18) {
		const p0 = new Vector3(this.x, this.y, this.z);
		const curRad = this.heading * Math.PI / 180;
		const p1 = new Vector3(0, 0, -straightApproach);
		const distToTarget = p0.distanceTo(p1);
		const tanScale = Math.max(55, distToTarget * .65);
		const v0 = new Vector3(Math.sin(curRad), 0, Math.cos(curRad)).multiplyScalar(tanScale);
		const v1 = new Vector3(0, 0, 1).multiplyScalar(tanScale);
		const bridgeSteps = Math.max(4, Math.ceil(distToTarget / resolution));
		for (let i = 1; i <= bridgeSteps; i++) {
			const t = i / bridgeSteps;
			const t2 = t * t;
			const t3 = t2 * t;
			const h00 = 2 * t3 - 3 * t2 + 1;
			const h10 = t3 - 2 * t2 + t;
			const h01 = -2 * t3 + 3 * t2;
			const h11 = t3 - t2;
			const x = h00 * p0.x + h10 * v0.x + h01 * p1.x + h11 * v1.x;
			const y = h00 * p0.y + h10 * v0.y + h01 * p1.y + h11 * v1.y;
			const z = h00 * p0.z + h10 * v0.z + h01 * p1.z + h11 * v1.z;
			this.points.push([
				x,
				y,
				z
			]);
		}
		const straightSteps = Math.max(2, Math.floor(straightApproach / resolution));
		for (let i = 1; i < straightSteps; i++) {
			const frac = i / straightSteps;
			const z = -straightApproach + frac * straightApproach;
			this.points.push([
				0,
				0,
				z
			]);
		}
		return this.points;
	}
};
function generateGrandPrixPoints() {
	const t = new TurtlePath(0, 0, 0);
	t.forward(360, 0);
	t.turn(90, 130, 10);
	t.turn(-35, 90, 4);
	t.turn(35, 90, 4);
	t.forward(260, 0);
	t.turn(90, 130, -10);
	t.forward(220, -8);
	t.turn(-40, 85, 0);
	t.turn(40, 85, 0);
	t.turn(90, 120, 0);
	t.forward(220, 0);
	t.turn(90, 120, 0);
	return t.closeTrack(90);
}
function generateSpookyPoints() {
	const t = new TurtlePath(0, 0, 0);
	t.forward(300, 0);
	t.turn(90, 110, 12);
	t.forward(220, 8);
	t.turn(45, 80, -2);
	t.turn(-45, 80, -2);
	t.forward(160, -4);
	t.turn(90, 110, -8);
	t.forward(250, -4);
	t.turn(90, 100, 0);
	t.turn(-40, 75, 0);
	t.turn(40, 75, 0);
	t.forward(220, 0);
	t.turn(90, 110, 0);
	return t.closeTrack(90);
}
function generateCyberPoints() {
	const t = new TurtlePath(0, 0, 0);
	t.forward(320, 0);
	t.turn(-90, 130, 14);
	t.forward(240, 12);
	t.forward(200, 0);
	t.turn(-90, 120, -16);
	t.forward(200, -8);
	t.turn(45, 90, 0);
	t.turn(-45, 90, 0);
	t.forward(240, 0);
	t.turn(-90, 130, 0);
	t.forward(260, 0);
	t.turn(-90, 120, 0);
	return t.closeTrack(90);
}
function generateIcePoints() {
	const t = new TurtlePath(0, 0, 0);
	t.forward(300, 0);
	t.turn(90, 110, 12);
	t.turn(-40, 80, 8);
	t.turn(40, 80, 6);
	t.forward(220, 0);
	t.turn(90, 120, -14);
	t.forward(200, -6);
	t.turn(90, 110, -4);
	t.turn(-40, 80, 0);
	t.turn(40, 80, 0);
	t.forward(240, -2);
	t.turn(90, 110, 0);
	return t.closeTrack(90);
}
function generateVolcanoPoints() {
	const t = new TurtlePath(0, 0, 0);
	t.forward(320, 0);
	t.turn(90, 120, 14);
	t.forward(240, 10);
	t.turn(90, 120, -8);
	t.forward(220, -6);
	t.turn(90, 110, -8);
	t.forward(250, -2);
	t.turn(-40, 80, 0);
	t.turn(40, 80, 0);
	t.turn(90, 110, 0);
	return t.closeTrack(90);
}
function generateSkyPoints() {
	const t = new TurtlePath(0, 0, 0);
	t.forward(350, 0);
	t.turn(-90, 130, 16);
	t.forward(240, 12);
	t.turn(-90, 140, -12);
	t.forward(260, -6);
	t.turn(40, 90, 0);
	t.turn(-40, 90, 0);
	t.forward(220, -4);
	t.turn(-90, 130, -4);
	t.turn(-90, 130, -2);
	return t.closeTrack(90);
}
var TRACK_DEFINITIONS = [
	{
		id: "sunny_beach",
		name: "Päikeseranna Grand Prix (Sunny Beach)",
		theme: "beach",
		difficulty: "Medium",
		description: "Täiuslikult sujuv ja matemaatiliselt täpne Grand Prix ringrada. Pikad kiired sirged, kõrge sild ja professionaalsed S-kurvid pakuvad tõelist sõiduelamust.",
		lengthMeters: 4200,
		lapsDefault: 3,
		skyColor: 3718648,
		fogColor: 12248829,
		groundColor: 16707722,
		trackColor: 3359061,
		curbColorA: 15680580,
		curbColorB: 16777215,
		points: generateGrandPrixPoints()
	},
	{
		id: "spooky_castle",
		name: "Kummituslossi Ralli (Spooky Castle)",
		theme: "spooky",
		difficulty: "Medium",
		description: "Keskaegne lossitee: Udused kalmistud, iidsed kindluseväravad, tõstesild ja valgustatud kõrvitsad!",
		lengthMeters: 4200,
		lapsDefault: 3,
		skyColor: 593174,
		fogColor: 1973067,
		groundColor: 1976635,
		trackColor: 1579035,
		curbColorA: 11032055,
		curbColorB: 2278750,
		points: generateSpookyPoints()
	},
	{
		id: "cyber_canyon",
		name: "Küberkanjoni Magistraal (Cyber Canyon)",
		theme: "cyber",
		difficulty: "Medium",
		description: "Futuristlik neoon-megapolis: Hologrammid, kiired klaassillad, laser-hüpertunnel ja pilvelõhkujate kanjon!",
		lengthMeters: 4400,
		lapsDefault: 3,
		skyColor: 132631,
		fogColor: 988970,
		groundColor: 593174,
		trackColor: 988970,
		curbColorA: 440020,
		curbColorB: 16007006,
		points: generateCyberPoints()
	},
	{
		id: "frozen_peak",
		name: "Külmunud Liustik (Frozen Peak Glacier)",
		theme: "ice",
		difficulty: "Hard",
		description: "Lumised mäetipud: Libe liustikujää, lumememmed, talvised männimetsad ja kristallkoopad!",
		lengthMeters: 4600,
		lapsDefault: 3,
		skyColor: 12248829,
		fogColor: 14742270,
		groundColor: 15857145,
		trackColor: 3359061,
		curbColorA: 3718648,
		curbColorB: 16317180,
		points: generateIcePoints()
	},
	{
		id: "volcano_island",
		name: "Kraatrisügavik GP (Abyssal Caldera)",
		theme: "volcano",
		difficulty: "Hard",
		description: "Võimas vulkaanirada: Hõõguvad laavajõed, dinosauruse luustikukaar, basaltsambad ja voolav kaldeera!",
		lengthMeters: 4500,
		lapsDefault: 3,
		skyColor: 4524554,
		fogColor: 8330525,
		groundColor: 1579035,
		trackColor: 2565930,
		curbColorA: 16347926,
		curbColorB: 15680580,
		points: generateVolcanoPoints()
	},
	{
		id: "sky_metropolis",
		name: "Taevalinnaku Kiirtee (Sky Metropolis)",
		theme: "sky",
		difficulty: "Hard",
		description: "Stratosfääri pilvemagistraal: Läbipaistvad klaassillad, päikesepaneelid, hõljuvad kosmosejaamad ja pilvemeri!",
		lengthMeters: 4800,
		lapsDefault: 3,
		skyColor: 165063,
		fogColor: 3718648,
		groundColor: 15793652,
		trackColor: 1976635,
		curbColorA: 16436245,
		curbColorB: 3718648,
		points: generateSkyPoints()
	}
];
/**
* Returns distinct surface zones along each track for terrain variety
*/
function getTrackSectors(theme) {
	switch (theme) {
		case "beach": return [
			{
				startT: 0,
				endT: .25,
				surface: "asphalt",
				name: "Rannatee",
				icon: "🛣️"
			},
			{
				startT: .25,
				endT: .44,
				surface: "wood",
				name: "Puidust Rippsild",
				icon: "🪵"
			},
			{
				startT: .44,
				endT: .62,
				surface: "dirt",
				name: "Merikoobas",
				icon: "🪨"
			},
			{
				startT: .62,
				endT: .82,
				surface: "sand",
				name: "Kuldrand",
				icon: "🏖️"
			},
			{
				startT: .82,
				endT: 1,
				surface: "asphalt",
				name: "Tuletorni Sirge",
				icon: "🛣️"
			}
		];
		case "spooky": return [
			{
				startT: 0,
				endT: .22,
				surface: "cobblestone",
				name: "Kalmistu Munakivitee",
				icon: "🪨"
			},
			{
				startT: .22,
				endT: .42,
				surface: "asphalt",
				name: "Lossi Sisehoov",
				icon: "🏰"
			},
			{
				startT: .42,
				endT: .6,
				surface: "dirt",
				name: "Lossikeldri Krüpt",
				icon: "🕯️"
			},
			{
				startT: .6,
				endT: .78,
				surface: "wood",
				name: "Vana Tõstesild",
				icon: "🪵"
			},
			{
				startT: .78,
				endT: 1,
				surface: "cobblestone",
				name: "Gooti Munakivisirge",
				icon: "🪨"
			}
		];
		case "cyber": return [
			{
				startT: 0,
				endT: .24,
				surface: "asphalt",
				name: "Kübermagistraal",
				icon: "⚡"
			},
			{
				startT: .24,
				endT: .44,
				surface: "glass",
				name: "Holo-Klaassild",
				icon: "💎"
			},
			{
				startT: .44,
				endT: .62,
				surface: "cyber_grid",
				name: "Laser-Hüpertunnel",
				icon: "🌀"
			},
			{
				startT: .62,
				endT: .82,
				surface: "wood",
				name: "Titaani Võrestik",
				icon: "⛓️"
			},
			{
				startT: .82,
				endT: 1,
				surface: "asphalt",
				name: "Neoonsirge",
				icon: "⚡"
			}
		];
		case "ice": return [
			{
				startT: 0,
				endT: .24,
				surface: "dirt",
				name: "Lumitee Pass",
				icon: "❄️"
			},
			{
				startT: .24,
				endT: .44,
				surface: "ice",
				name: "Libe Liustikujää",
				icon: "⛸️"
			},
			{
				startT: .44,
				endT: .62,
				surface: "ice",
				name: "Liustikukoobas",
				icon: "🧊"
			},
			{
				startT: .62,
				endT: .8,
				surface: "wood",
				name: "Külmunud Puutsild",
				icon: "🪵"
			},
			{
				startT: .8,
				endT: 1,
				surface: "dirt",
				name: "Suusalaskumise Sirge",
				icon: "❄️"
			}
		];
		case "volcano": return [
			{
				startT: 0,
				endT: .15,
				surface: "asphalt",
				name: "Basaltkanjoni Kiirtee",
				icon: "🌋"
			},
			{
				startT: .15,
				endT: .3,
				surface: "dirt",
				name: "Magmakoobaste Šikaan",
				icon: "🔥"
			},
			{
				startT: .3,
				endT: .5,
				surface: "asphalt",
				name: "Tsentraalne Spiraaltõus",
				icon: "🚀"
			},
			{
				startT: .5,
				endT: .65,
				surface: "magma_rock",
				name: "Kitsas Laavasild",
				icon: "☄️"
			},
			{
				startT: .65,
				endT: .75,
				surface: "asphalt",
				name: "Kiirlaskumine",
				icon: "🎢"
			},
			{
				startT: .75,
				endT: .85,
				surface: "dirt",
				name: "Leviataani Parabolica",
				icon: "🦴"
			},
			{
				startT: .85,
				endT: 1,
				surface: "asphalt",
				name: "Geisrite Finiš",
				icon: "🌋"
			}
		];
		case "sky": return [
			{
				startT: 0,
				endT: .24,
				surface: "asphalt",
				name: "Taevalinnaku Kiirtee",
				icon: "☁️"
			},
			{
				startT: .24,
				endT: .44,
				surface: "glass",
				name: "Läbipaistev Klaassild",
				icon: "💎"
			},
			{
				startT: .44,
				endT: .62,
				surface: "glass",
				name: "Pilve-Aerotunnel",
				icon: "🚀"
			},
			{
				startT: .62,
				endT: .82,
				surface: "cyber_grid",
				name: "Päikesepaneelide Sild",
				icon: "☀️"
			},
			{
				startT: .82,
				endT: 1,
				surface: "asphalt",
				name: "Pilvetippude Finiš",
				icon: "☁️"
			}
		];
	}
}
/**
* Creates procedural high-res asphalt racetrack texture with lane lines
*/
function createAsphaltTexture(trackColor, theme) {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	ctx.fillStyle = "#" + trackColor.toString(16).padStart(6, "0");
	ctx.fillRect(0, 0, 512, 512);
	const imgData = ctx.getImageData(0, 0, 512, 512);
	const data = imgData.data;
	for (let i = 0; i < data.length; i += 4) {
		const n = (Math.random() - .5) * 16;
		data[i] = Math.min(255, Math.max(0, data[i] + n));
		data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
		data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
	}
	ctx.putImageData(imgData, 0, 0);
	ctx.strokeStyle = theme === "cyber" ? "#06b6d4" : theme === "ice" ? "#bae6fd" : theme === "volcano" ? "#f97316" : theme === "sky" ? "#38bdf8" : "#ffffff";
	ctx.lineWidth = 14;
	ctx.beginPath();
	ctx.moveTo(32, 0);
	ctx.lineTo(32, 512);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(480, 0);
	ctx.lineTo(480, 512);
	ctx.stroke();
	ctx.strokeStyle = theme === "cyber" ? "#f43f5e" : theme === "spooky" ? "#a855f7" : theme === "volcano" ? "#ef4444" : "#facc15";
	ctx.lineWidth = 10;
	ctx.setLineDash([34, 30]);
	ctx.beginPath();
	ctx.moveTo(256, 0);
	ctx.lineTo(256, 512);
	ctx.stroke();
	const texture = new CanvasTexture(canvas);
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(1, 40);
	texture.anisotropy = 8;
	return texture;
}
/**
* Creates rich wooden bridge planks texture
*/
function createWoodTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	ctx.fillStyle = "#78350f";
	ctx.fillRect(0, 0, 512, 512);
	const plankHeight = 32;
	for (let y = 0; y < 512; y += plankHeight) {
		const shade = y / plankHeight % 3;
		ctx.fillStyle = shade === 0 ? "#92400e" : shade === 1 ? "#854d0e" : "#713f12";
		ctx.fillRect(0, y + 2, 512, 28);
		ctx.fillStyle = "#291705";
		ctx.fillRect(0, y, 512, 3);
		ctx.strokeStyle = "rgba(67, 20, 7, 0.4)";
		ctx.lineWidth = 1;
		for (let g = 0; g < 3; g++) {
			ctx.beginPath();
			ctx.moveTo(0, y + 6 + g * 8);
			ctx.bezierCurveTo(150, y + 4 + g * 8, 350, y + 8 + g * 8, 512, y + 6 + g * 8);
			ctx.stroke();
		}
		ctx.fillStyle = "#1c1917";
		[
			40,
			256,
			472
		].forEach((rx) => {
			ctx.beginPath();
			ctx.arc(rx, y + plankHeight / 2, 3.5, 0, Math.PI * 2);
			ctx.fill();
		});
	}
	const texture = new CanvasTexture(canvas);
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(1, 40);
	texture.anisotropy = 8;
	return texture;
}
/**
* Creates historic cobblestone paver road texture
*/
function createCobblestoneTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	ctx.fillStyle = "#1e293b";
	ctx.fillRect(0, 0, 512, 512);
	const rowH = 28;
	const colW = 36;
	const stoneColors = [
		"#475569",
		"#64748b",
		"#334155",
		"#4b5563",
		"#374151"
	];
	for (let y = 0; y < 512; y += rowH) {
		const offsetX = Math.floor(y / rowH) % 2 * (colW / 2);
		for (let x = -36; x < 548; x += colW) {
			ctx.fillStyle = stoneColors[Math.abs(Math.floor(x * 7 + y * 13)) % stoneColors.length];
			const stoneX = x + offsetX + 3;
			const stoneY = y + 3;
			const stoneW = 30;
			const stoneH = 22;
			ctx.beginPath();
			ctx.rect(stoneX, stoneY, stoneW, stoneH);
			ctx.fill();
			ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
			ctx.fillRect(stoneX + 2, stoneY + 2, 26, 3);
		}
	}
	const texture = new CanvasTexture(canvas);
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(1, 35);
	texture.anisotropy = 8;
	return texture;
}
/**
* Creates sunny beach sand road texture
*/
function createSandTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	ctx.fillStyle = "#fde047";
	ctx.fillRect(0, 0, 512, 512);
	ctx.fillStyle = "#eab308";
	for (let y = 0; y < 512; y += 18) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.bezierCurveTo(120, y + 8, 380, y - 8, 512, y);
		ctx.lineTo(512, y + 4);
		ctx.bezierCurveTo(380, y - 4, 120, y + 12, 0, y + 4);
		ctx.fill();
	}
	ctx.fillStyle = "rgba(161, 98, 7, 0.3)";
	for (let y = 0; y < 512; y += 8) {
		ctx.fillRect(100, y, 40, 4);
		ctx.fillRect(372, y, 40, 4);
	}
	ctx.fillStyle = "#ffffff";
	for (let i = 0; i < 45; i++) ctx.fillRect(Math.random() * 512, Math.random() * 512, 2.5, 2.5);
	const texture = new CanvasTexture(canvas);
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(1, 40);
	texture.anisotropy = 8;
	return texture;
}
/**
* Creates crystal blue ice surface texture
*/
function createIceTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	const grad = ctx.createLinearGradient(0, 0, 512, 512);
	grad.addColorStop(0, "#0284c7");
	grad.addColorStop(.5, "#38bdf8");
	grad.addColorStop(1, "#0ea5e9");
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 512, 512);
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth = 2;
	for (let i = 0; i < 8; i++) {
		ctx.beginPath();
		let sx = Math.random() * 512;
		let sy = Math.random() * 512;
		ctx.moveTo(sx, sy);
		for (let k = 0; k < 4; k++) {
			sx += (Math.random() - .5) * 80;
			sy += (Math.random() - .5) * 80;
			ctx.lineTo(sx, sy);
		}
		ctx.stroke();
	}
	ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
	ctx.fillRect(80, 0, 25, 512);
	ctx.fillRect(340, 0, 35, 512);
	const texture = new CanvasTexture(canvas);
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(1, 40);
	texture.anisotropy = 8;
	return texture;
}
/**
* Creates cracked molten magma rock surface texture
*/
function createMagmaTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	ctx.fillStyle = "#18181b";
	ctx.fillRect(0, 0, 512, 512);
	ctx.strokeStyle = "#ef4444";
	ctx.lineWidth = 6;
	for (let i = 0; i < 10; i++) {
		ctx.beginPath();
		let mx = Math.random() * 512;
		let my = Math.random() * 512;
		ctx.moveTo(mx, my);
		for (let j = 0; j < 4; j++) {
			mx += (Math.random() - .5) * 110;
			my += (Math.random() - .5) * 110;
			ctx.lineTo(mx, my);
		}
		ctx.stroke();
	}
	ctx.strokeStyle = "#fef08a";
	ctx.lineWidth = 2;
	for (let i = 0; i < 10; i++) {
		ctx.beginPath();
		let mx = Math.random() * 512;
		let my = Math.random() * 512;
		ctx.moveTo(mx, my);
		for (let j = 0; j < 3; j++) {
			mx += (Math.random() - .5) * 80;
			my += (Math.random() - .5) * 80;
			ctx.lineTo(mx, my);
		}
		ctx.stroke();
	}
	const texture = new CanvasTexture(canvas);
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(1, 35);
	texture.anisotropy = 8;
	return texture;
}
/**
* Creates cyber futuristic glowing grid glass road texture
*/
function createCyberGlassTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	ctx.fillStyle = "#090d16";
	ctx.fillRect(0, 0, 512, 512);
	ctx.strokeStyle = "#06b6d4";
	ctx.lineWidth = 3;
	for (let x = 0; x <= 512; x += 64) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, 512);
		ctx.stroke();
	}
	for (let y = 0; y <= 512; y += 64) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(512, y);
		ctx.stroke();
	}
	ctx.fillStyle = "#ec4899";
	for (let y = 32; y < 512; y += 128) {
		ctx.beginPath();
		ctx.moveTo(256, y);
		ctx.lineTo(276, y + 22);
		ctx.lineTo(266, y + 22);
		ctx.lineTo(256, y + 10);
		ctx.lineTo(246, y + 22);
		ctx.lineTo(236, y + 22);
		ctx.closePath();
		ctx.fill();
	}
	const texture = new CanvasTexture(canvas);
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(1, 40);
	texture.anisotropy = 8;
	return texture;
}
/**
* Creates dirt gravel / cave trail road texture
*/
function createDirtTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	ctx.fillStyle = "#451a03";
	ctx.fillRect(0, 0, 512, 512);
	ctx.fillStyle = "#78350f";
	for (let i = 0; i < 160; i++) ctx.fillRect(Math.random() * 512, Math.random() * 512, 3 + Math.random() * 5, 3 + Math.random() * 5);
	ctx.fillStyle = "rgba(24, 9, 2, 0.4)";
	ctx.fillRect(80, 0, 65, 512);
	ctx.fillRect(367, 0, 65, 512);
	const texture = new CanvasTexture(canvas);
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(1, 40);
	texture.anisotropy = 8;
	return texture;
}
/**
* Creates natural road shoulder / verge texture
*/
function createShoulderTexture(theme) {
	const canvas = document.createElement("canvas");
	canvas.width = 128;
	canvas.height = 256;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	ctx.fillStyle = theme === "beach" ? "#ca8a04" : theme === "spooky" ? "#1c1917" : theme === "cyber" ? "#0f172a" : theme === "ice" ? "#e0f2fe" : theme === "volcano" ? "#27272a" : "#0369a1";
	ctx.fillRect(0, 0, 128, 256);
	ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
	for (let i = 0; i < 120; i++) ctx.fillRect(Math.random() * 128, Math.random() * 256, 3, 3);
	const texture = new CanvasTexture(canvas);
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(1, 50);
	texture.anisotropy = 8;
	return texture;
}
/**
* Creates alternating red/white or theme-colored curb rumble strip texture
*/
function createCurbTexture(colorA, colorB) {
	const canvas = document.createElement("canvas");
	canvas.width = 64;
	canvas.height = 128;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	const hexA = "#" + colorA.toString(16).padStart(6, "0");
	const hexB = "#" + colorB.toString(16).padStart(6, "0");
	ctx.fillStyle = hexA;
	ctx.fillRect(0, 0, 64, 64);
	ctx.fillStyle = hexB;
	ctx.fillRect(0, 64, 64, 64);
	const texture = new CanvasTexture(canvas);
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.repeat.set(1, 55);
	texture.anisotropy = 8;
	return texture;
}
/**
* Creates a start/finish checkered line texture
*/
function createStartLineTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 64;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	const tileSize = 32;
	for (let x = 0; x < 256; x += tileSize) for (let y = 0; y < 64; y += tileSize) {
		ctx.fillStyle = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0 ? "#18181b" : "#ffffff";
		ctx.fillRect(x, y, tileSize, tileSize);
	}
	const texture = new CanvasTexture(canvas);
	texture.anisotropy = 8;
	return texture;
}
/**
* Creates high-contrast yellow & black warning chevron arrow texture
*/
function createChevronTexture(direction) {
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 128;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	ctx.fillStyle = "#eab308";
	ctx.fillRect(0, 0, 256, 128);
	ctx.fillStyle = "#0f172a";
	for (let i = 0; i < 3; i++) {
		const startX = 40 + i * 75;
		ctx.beginPath();
		if (direction === "right") {
			ctx.moveTo(startX, 15);
			ctx.lineTo(startX + 40, 64);
			ctx.lineTo(startX, 113);
			ctx.lineTo(startX + 22, 113);
			ctx.lineTo(startX + 62, 64);
			ctx.lineTo(startX + 22, 15);
		} else {
			ctx.moveTo(startX + 45, 15);
			ctx.lineTo(startX + 5, 64);
			ctx.lineTo(startX + 45, 113);
			ctx.lineTo(startX + 23, 113);
			ctx.lineTo(startX - 17, 64);
			ctx.lineTo(startX + 23, 15);
		}
		ctx.closePath();
		ctx.fill();
	}
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 8;
	ctx.strokeRect(4, 4, 248, 120);
	return new CanvasTexture(canvas);
}
/**
* Creates high-contrast braking distance warning boards ("150m", "100m", "50m")
*/
function createDistanceSignTexture(distText, stripes) {
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 128;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, 256, 128);
	ctx.fillStyle = "#ef4444";
	for (let s = 0; s < stripes; s++) {
		const sx = 20 + s * 24;
		ctx.beginPath();
		ctx.moveTo(sx, 120);
		ctx.lineTo(sx + 14, 8);
		ctx.lineTo(sx + 26, 8);
		ctx.lineTo(sx + 12, 120);
		ctx.closePath();
		ctx.fill();
	}
	ctx.fillStyle = "#09090b";
	ctx.font = "900 52px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(distText, 168, 64);
	ctx.strokeStyle = "#18181b";
	ctx.lineWidth = 8;
	ctx.strokeRect(4, 4, 248, 120);
	return new CanvasTexture(canvas);
}
/**
* Creates dynamic high-contrast arcade sponsor graphic textures for trackside billboards
*/
function createBillboardTexture(title, subtitle, bgColor, accentColor) {
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 256;
	const ctx = canvas.getContext("2d");
	if (!ctx) return new CanvasTexture(canvas);
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, 512, 256);
	ctx.fillStyle = accentColor;
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(95, 0);
	ctx.lineTo(35, 256);
	ctx.lineTo(0, 256);
	ctx.closePath();
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(410, 0);
	ctx.lineTo(512, 0);
	ctx.lineTo(512, 95);
	ctx.closePath();
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(360, 256);
	ctx.lineTo(512, 256);
	ctx.lineTo(470, 145);
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth = 12;
	ctx.strokeRect(6, 6, 500, 244);
	ctx.strokeStyle = accentColor;
	ctx.lineWidth = 4;
	ctx.strokeRect(18, 18, 476, 220);
	ctx.fillStyle = "#ffffff";
	ctx.font = "900 44px \"Arial Black\", Impact, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.shadowColor = "rgba(0,0,0,0.85)";
	ctx.shadowBlur = 10;
	ctx.fillText(title, 256, 100);
	ctx.fillStyle = accentColor;
	ctx.font = "800 24px \"Arial Black\", sans-serif";
	ctx.shadowBlur = 4;
	ctx.fillText(subtitle, 256, 172);
	const texture = new CanvasTexture(canvas);
	texture.anisotropy = 4;
	return texture;
}
/**
* Creates 3D walk-through tunnel geometry with arches, portal entrances, ceiling details, and interior lighting
*/
function createTunnel(curve, theme, trackWidth) {
	const tunnelGroup = new Group();
	let startT = .44;
	let endT = .62;
	let wallColor = 5716516;
	let portalColor = 7877903;
	let lightColor = 16096779;
	const lightIntensity = 1.6;
	switch (theme) {
		case "beach":
			startT = .44;
			endT = .62;
			wallColor = 7877903;
			portalColor = 9584654;
			lightColor = 16096779;
			break;
		case "spooky":
			startT = .42;
			endT = .6;
			wallColor = 1976635;
			portalColor = 988970;
			lightColor = 1096065;
			break;
		case "cyber":
			startT = .44;
			endT = .62;
			wallColor = 593174;
			portalColor = 440020;
			lightColor = 440020;
			break;
		case "ice":
			startT = .44;
			endT = .62;
			wallColor = 165063;
			portalColor = 3718648;
			lightColor = 3718648;
			break;
		case "volcano":
			startT = .15;
			endT = .3;
			wallColor = 1579035;
			portalColor = 15680580;
			lightColor = 16347926;
			break;
		case "sky":
			startT = .44;
			endT = .62;
			wallColor = 223649;
			portalColor = 3718648;
			lightColor = 14742270;
	}
	const upVec = new Vector3(0, 1, 0);
	const steps = 24;
	const tunnelWidth = trackWidth + 14;
	const tunnelHeight = 15.5;
	const positions = [];
	const indices = [];
	const uvs = [];
	const profileOffsets = [
		{
			x: -tunnelWidth * .5,
			y: 0
		},
		{
			x: -tunnelWidth * .54,
			y: tunnelHeight * .45
		},
		{
			x: -tunnelWidth * .35,
			y: tunnelHeight * .88
		},
		{
			x: 0,
			y: tunnelHeight
		},
		{
			x: tunnelWidth * .35,
			y: tunnelHeight * .88
		},
		{
			x: tunnelWidth * .54,
			y: tunnelHeight * .45
		},
		{
			x: tunnelWidth * .5,
			y: 0
		}
	];
	const numProfilePts = profileOffsets.length;
	for (let s = 0; s <= steps; s++) {
		const t = startT + (endT - startT) * (s / steps);
		const pt = curve.getPointAt(t);
		const tangent = curve.getTangentAt(t).normalize();
		const right = new Vector3().crossVectors(tangent, upVec).normalize();
		const up = new Vector3().crossVectors(right, tangent).normalize();
		for (let p = 0; p < numProfilePts; p++) {
			const prof = profileOffsets[p];
			const vert = pt.clone().addScaledVector(right, prof.x).addScaledVector(up, prof.y);
			positions.push(vert.x, vert.y, vert.z);
			uvs.push(p / (numProfilePts - 1), s / steps * 10);
		}
		if (s < steps) for (let p = 0; p < numProfilePts - 1; p++) {
			const i0 = s * numProfilePts + p;
			const i1 = i0 + 1;
			const i2 = (s + 1) * numProfilePts + p;
			const i3 = i2 + 1;
			indices.push(i0, i2, i1);
			indices.push(i1, i2, i3);
		}
		if (s > 0 && s < steps && s % 6 === 0) {
			const lightPos = pt.clone().addScaledVector(up, tunnelHeight * .88);
			const ptLight = new PointLight(lightColor, lightIntensity, 45, 1.2);
			ptLight.position.copy(lightPos);
			tunnelGroup.add(ptLight);
			const lampGeo = new SphereGeometry(.5, 8, 8);
			const lampMat = new MeshBasicMaterial({ color: lightColor });
			const lampMesh = new Mesh(lampGeo, lampMat);
			lampMesh.position.copy(lightPos);
			tunnelGroup.add(lampMesh);
			if (theme === "cyber") {
				const neonBarGeo = new BoxGeometry(tunnelWidth * .8, .2, .4);
				const neonBarMat = new MeshBasicMaterial({ color: 440020 });
				const neonBar = new Mesh(neonBarGeo, neonBarMat);
				neonBar.position.copy(pt).addScaledVector(up, tunnelHeight * .94);
				neonBar.rotation.y = Math.atan2(tangent.x, tangent.z);
				tunnelGroup.add(neonBar);
			} else if (theme === "ice") for (let ic = -2; ic <= 2; ic += 2) {
				const icicleGeo = new ConeGeometry(.3, 1.6, 5);
				icicleGeo.rotateX(Math.PI);
				const icicleMat = new MeshStandardMaterial({
					color: 14742270,
					roughness: .1,
					metalness: .3
				});
				const icicleMesh = new Mesh(icicleGeo, icicleMat);
				icicleMesh.position.copy(pt).addScaledVector(right, ic * 3.5).addScaledVector(up, 14.7);
				tunnelGroup.add(icicleMesh);
			}
		}
	}
	const tunnelGeo = new BufferGeometry();
	tunnelGeo.setAttribute("position", new Float32BufferAttribute(positions, 3));
	tunnelGeo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
	tunnelGeo.setIndex(indices);
	tunnelGeo.computeVertexNormals();
	const tunnelMat = new MeshStandardMaterial({
		color: wallColor,
		roughness: theme === "ice" || theme === "sky" ? .3 : .85,
		metalness: theme === "cyber" || theme === "sky" ? .4 : .1,
		side: 2
	});
	const tunnelMesh = new Mesh(tunnelGeo, tunnelMat);
	tunnelMesh.castShadow = true;
	tunnelMesh.receiveShadow = true;
	tunnelGroup.add(tunnelMesh);
	[startT, endT].forEach((portalT, pIdx) => {
		const pt = curve.getPointAt(portalT);
		const tangent = curve.getTangentAt(portalT).normalize();
		const rotY = Math.atan2(tangent.x, tangent.z);
		const portalFrame = new Group();
		portalFrame.position.copy(pt);
		portalFrame.rotation.y = rotY;
		const pillarGeo = new BoxGeometry(2.4, 17.5, 3.2);
		const pMat = new MeshStandardMaterial({
			color: portalColor,
			roughness: .8,
			metalness: .2
		});
		const pLeft = new Mesh(pillarGeo, pMat);
		pLeft.position.set(-tunnelWidth * .5 - 2.8, 8.75, 0);
		portalFrame.add(pLeft);
		const pRight = new Mesh(pillarGeo, pMat);
		pRight.position.set(tunnelWidth * .5 + 2.8, 8.75, 0);
		portalFrame.add(pRight);
		const beamGeo = new BoxGeometry(tunnelWidth + 8.4, 2.2, 3.6);
		const beam = new Mesh(beamGeo, pMat);
		beam.position.set(0, 17.3, 0);
		portalFrame.add(beam);
		if (theme === "volcano" && pIdx === 0) {
			const skullGeo = new ConeGeometry(3.5, 6, 5);
			skullGeo.rotateX(Math.PI / 2);
			const skullMat = new MeshStandardMaterial({
				color: 16707722,
				roughness: .7
			});
			const skull = new Mesh(skullGeo, skullMat);
			skull.position.set(0, 19.7, 0);
			portalFrame.add(skull);
		}
		tunnelGroup.add(portalFrame);
	});
	return tunnelGroup;
}
/**
* Builds the complete 3D racing track with rich scenery, asphalt markings, dense centerline, and robust collision detection
*/
function buildTrack(trackDef) {
	const vectors = trackDef.points.map((p) => new Vector3(p[0], p[1], p[2]));
	const curve = new CatmullRomCurve3(vectors, true, "centripetal", .5);
	const origGetPointAt = curve.getPointAt.bind(curve);
	const origGetTangentAt = curve.getTangentAt.bind(curve);
	curve.getPointAt = (u, optionalTarget) => {
		if (isNaN(u) || !isFinite(u)) return origGetPointAt(0, optionalTarget);
		const safeU = Math.min(.99999, Math.max(0, (u % 1 + 1) % 1));
		return origGetPointAt(safeU, optionalTarget);
	};
	curve.getTangentAt = (u, optionalTarget) => {
		if (isNaN(u) || !isFinite(u)) return origGetTangentAt(0, optionalTarget);
		const safeU = Math.min(.99999, Math.max(0, (u % 1 + 1) % 1));
		return origGetTangentAt(safeU, optionalTarget);
	};
	const trackWidth = 22;
	const halfW = trackWidth * .5;
	const curbW = 2.4;
	const shoulderW = 28;
	const sectors = getTrackSectors(trackDef.theme);
	const shortcutZones = (() => {
		switch (trackDef.theme) {
			case "beach": return [
				{
					startT: .12,
					endT: .28,
					side: -1,
					extraWidth: 32,
					surface: "sand",
					name: "Palmi-ranna Cut",
					icon: "🏖️"
				},
				{
					startT: .35,
					endT: .5,
					side: 1,
					extraWidth: 40,
					surface: "wood",
					name: "Lõunakai Pikendus",
					icon: "🪵"
				},
				{
					startT: .6,
					endT: .78,
					side: -1,
					extraWidth: 28,
					surface: "sand",
					name: "Rannikuliiva Lõige",
					icon: "🏖️"
				},
				{
					startT: .82,
					endT: .94,
					side: 1,
					extraWidth: 25,
					surface: "asphalt",
					name: "Hotelli Hoov Cut",
					icon: "🏨"
				}
			];
			case "spooky": return [
				{
					startT: .15,
					endT: .3,
					side: -1,
					extraWidth: 35,
					surface: "dirt",
					name: "Metsakalmistu Lõige",
					icon: "🪦"
				},
				{
					startT: .4,
					endT: .55,
					side: 1,
					extraWidth: 28,
					surface: "wood",
					name: "Nõiamaja Tõstesild",
					icon: "🕯️"
				},
				{
					startT: .65,
					endT: .82,
					side: -1,
					extraWidth: 40,
					surface: "dirt",
					name: "Kummitusmetsa Otsetee",
					icon: "🌲"
				}
			];
			case "cyber": return [
				{
					startT: .1,
					endT: .25,
					side: 1,
					extraWidth: 42,
					surface: "cyber_grid",
					name: "Holo-Kiirtee Cut",
					icon: "🌀"
				},
				{
					startT: .3,
					endT: .48,
					side: -1,
					extraWidth: 38,
					surface: "glass",
					name: "Pilvelõhkuja Katus",
					icon: "🏢"
				},
				{
					startT: .55,
					endT: .72,
					side: 1,
					extraWidth: 45,
					surface: "cyber_grid",
					name: "Alamlinna Metroo Cut",
					icon: "💎"
				},
				{
					startT: .78,
					endT: .92,
					side: -1,
					extraWidth: 30,
					surface: "glass",
					name: "Neoon-Allee",
					icon: "⚡"
				}
			];
			case "ice": return [
				{
					startT: .15,
					endT: .3,
					side: 1,
					extraWidth: 38,
					surface: "ice",
					name: "Liustikujää Kiirlõige",
					icon: "⛸️"
				},
				{
					startT: .38,
					endT: .55,
					side: -1,
					extraWidth: 32,
					surface: "dirt",
					name: "Lumine Männikoridor",
					icon: "❄️"
				},
				{
					startT: .65,
					endT: .85,
					side: 1,
					extraWidth: 45,
					surface: "ice",
					name: "Külmunud Jõe Cut",
					icon: "🌊"
				}
			];
			case "volcano": return [
				{
					startT: .2,
					endT: .28,
					side: -1,
					extraWidth: 35,
					surface: "magma_rock",
					name: "Laavajärve Lõiketee",
					icon: "🔥"
				},
				{
					startT: .35,
					endT: .45,
					side: 1,
					extraWidth: 28,
					surface: "dirt",
					name: "Spiraali Sisemine Cut",
					icon: "🌋"
				},
				{
					startT: .78,
					endT: .85,
					side: -1,
					extraWidth: 42,
					surface: "magma_rock",
					name: "Leviataani Saba Otsetee",
					icon: "🦴"
				}
			];
			default: return [
				{
					startT: .15,
					endT: .3,
					side: -1,
					extraWidth: 35,
					surface: "cyber_grid",
					name: "Päikesepaneeli Hüpe",
					icon: "☀️"
				},
				{
					startT: .4,
					endT: .55,
					side: 1,
					extraWidth: 38,
					surface: "glass",
					name: "Klaasist Taevakoridor",
					icon: "💎"
				},
				{
					startT: .65,
					endT: .85,
					side: -1,
					extraWidth: 45,
					surface: "cyber_grid",
					name: "Pilveteki Lõige",
					icon: "☁️"
				}
			];
		}
	})();
	const denseCount = 320;
	const centerlinePoints = [];
	const upVec = new Vector3(0, 1, 0);
	for (let i = 0; i < denseCount; i++) {
		const t = i / denseCount;
		const pt = curve.getPointAt(t);
		const tangent = curve.getTangentAt(t).normalize();
		const right = new Vector3().crossVectors(tangent, upVec).normalize();
		centerlinePoints.push({
			point: pt,
			tangent,
			right,
			t
		});
	}
	const _tmpSeg = new Vector3();
	const _tmpToPos = new Vector3();
	const _tmpCandidate = new Vector3();
	const _tmpToCar = new Vector3();
	const _resClosestPt = new Vector3();
	const _resTangent = new Vector3();
	const _resRight = new Vector3();
	const _resWallNormal = new Vector3();
	const _cachedTrackInfo = {
		closestPoint: _resClosestPt,
		tangent: _resTangent,
		right: _resRight,
		distanceToCenter: 0,
		signedDistance: 0,
		t: 0,
		closestIndex: 0,
		isOffroad: false,
		isOnCurb: false,
		isWallHit: false,
		wallNormal: _resWallNormal,
		wallDistance: 14,
		surface: "asphalt",
		surfaceName: "Rannatee",
		surfaceIcon: "🛣️",
		isShortcut: false
	};
	const getCenterlinePointAt = (t) => {
		const safeT = (t % 1 + 1) % 1;
		const idx = Math.min(319, Math.max(0, Math.floor(safeT * denseCount)));
		return centerlinePoints[idx];
	};
	const getTrackInfo = (pos, hintIdx) => {
		const pX = pos.x;
		const pY = pos.y;
		const pZ = pos.z;
		let bestDistSq = Infinity;
		let bestIdx = 0;
		if (hintIdx !== void 0 && hintIdx >= 0 && hintIdx < denseCount) {
			const windowStart = hintIdx - 12;
			const windowEnd = hintIdx + 24;
			for (let i = windowStart; i <= windowEnd; i++) {
				const idx = (i + denseCount) % denseCount;
				const cp = centerlinePoints[idx].point;
				const dx = cp.x - pX;
				const dy = cp.y - pY;
				const dz = cp.z - pZ;
				const dSq = dx * dx + dz * dz + dy * dy * 3.5;
				if (dSq < bestDistSq) {
					bestDistSq = dSq;
					bestIdx = idx;
				}
			}
		}
		if (bestDistSq > 1225) {
			bestDistSq = Infinity;
			const step = 16;
			let coarseBestIdx = 0;
			for (let i = 0; i < denseCount; i += step) {
				const cp = centerlinePoints[i].point;
				const dx = cp.x - pX;
				const dy = cp.y - pY;
				const dz = cp.z - pZ;
				const dSq = dx * dx + dz * dz + dy * dy * 3.5;
				if (dSq < bestDistSq) {
					bestDistSq = dSq;
					coarseBestIdx = i;
				}
			}
			bestIdx = coarseBestIdx;
			const startSearch = coarseBestIdx - step;
			const endSearch = coarseBestIdx + step;
			for (let i = startSearch; i <= endSearch; i++) {
				const idx = (i + denseCount) % denseCount;
				const cp = centerlinePoints[idx].point;
				const dx = cp.x - pX;
				const dy = cp.y - pY;
				const dz = cp.z - pZ;
				const dSq = dx * dx + dz * dz + dy * dy * 3.5;
				if (dSq < bestDistSq) {
					bestDistSq = dSq;
					bestIdx = idx;
				}
			}
		}
		const prevIdx = (bestIdx - 1 + denseCount) % denseCount;
		const nextIdx = (bestIdx + 1) % denseCount;
		const testSegments = [[centerlinePoints[prevIdx], centerlinePoints[bestIdx]], [centerlinePoints[bestIdx], centerlinePoints[nextIdx]]];
		_resClosestPt.copy(centerlinePoints[bestIdx].point);
		let bestSegmentDistSq = Infinity;
		_resTangent.copy(centerlinePoints[bestIdx].tangent);
		_resRight.copy(centerlinePoints[bestIdx].right);
		let finalT = centerlinePoints[bestIdx].t;
		for (let sIdx = 0; sIdx < 2; sIdx++) {
			const pA = testSegments[sIdx][0];
			const pB = testSegments[sIdx][1];
			_tmpSeg.subVectors(pB.point, pA.point);
			const segLenSq = _tmpSeg.lengthSq();
			if (segLenSq > 1e-4) {
				_tmpToPos.set(pX - pA.point.x, pY - pA.point.y, pZ - pA.point.z);
				const s = MathUtils.clamp(_tmpToPos.dot(_tmpSeg) / segLenSq, 0, 1);
				_tmpCandidate.copy(pA.point).addScaledVector(_tmpSeg, s);
				const cdx = _tmpCandidate.x - pX;
				const cdy = _tmpCandidate.y - pY;
				const cdz = _tmpCandidate.z - pZ;
				const cDistSq = cdx * cdx + cdz * cdz + cdy * cdy * 3.5;
				if (cDistSq < bestSegmentDistSq) {
					bestSegmentDistSq = cDistSq;
					_resClosestPt.copy(_tmpCandidate);
					_resTangent.lerpVectors(pA.tangent, pB.tangent, s).normalize();
					_resRight.lerpVectors(pA.right, pB.right, s).normalize();
					let diffT = pB.t - pA.t;
					while (diffT > .5) diffT -= 1;
					while (diffT < -.5) diffT += 1;
					finalT = Math.min(.99999, Math.max(0, ((pA.t + diffT * s) % 1 + 1) % 1));
				}
			}
		}
		const distToCenter = Math.hypot(pX - _resClosestPt.x, pZ - _resClosestPt.z);
		_tmpToCar.set(pX - _resClosestPt.x, 0, pZ - _resClosestPt.z);
		const signedDistance = _tmpToCar.dot(_resRight);
		_resWallNormal.copy(_resRight).multiplyScalar(signedDistance > 0 ? -1 : 1);
		const isElevatedBridge = _resClosestPt.y > 3;
		const isCliffEdge = finalT > .15 && finalT < .35 || finalT > .65 && finalT < .85;
		let inTunnel = false;
		if (trackDef.theme === "beach" && finalT >= .44 && finalT <= .62) inTunnel = true;
		if (trackDef.theme === "spooky" && finalT >= .42 && finalT <= .6) inTunnel = true;
		if (trackDef.theme === "cyber" && finalT >= .44 && finalT <= .62) inTunnel = true;
		if (trackDef.theme === "ice" && finalT >= .44 && finalT <= .62) inTunnel = true;
		if (trackDef.theme === "volcano" && finalT >= .15 && finalT <= .3) inTunnel = true;
		let wallDist = 13.4;
		if (!isElevatedBridge && !isCliffEdge && !inTunnel) wallDist += 26;
		else if (inTunnel) wallDist = 17.5;
		let activeSector = sectors[0];
		for (let sIdx = 0; sIdx < sectors.length; sIdx++) {
			const s = sectors[sIdx];
			if (finalT >= s.startT && finalT < s.endT) {
				activeSector = s;
				break;
			}
		}
		let surface = activeSector.surface;
		let surfaceName = activeSector.name;
		let surfaceIcon = activeSector.icon;
		let isShortcut = false;
		for (let scIdx = 0; scIdx < shortcutZones.length; scIdx++) {
			const sc = shortcutZones[scIdx];
			if (finalT >= sc.startT && finalT < sc.endT) {
				if (sc.side > 0 && signedDistance > 0 || sc.side < 0 && signedDistance < 0 || sc.side === 0) {
					wallDist = Math.max(wallDist, halfW + sc.extraWidth + 1.2);
					if (distToCenter > halfW && distToCenter <= halfW + sc.extraWidth) {
						surface = sc.surface;
						surfaceName = sc.name;
						surfaceIcon = sc.icon;
						isShortcut = true;
					}
				}
				break;
			}
		}
		let isOnCurb = !isShortcut && distToCenter > halfW && distToCenter <= 13.4;
		let isOffroad = !isShortcut && distToCenter > 13.4 && distToCenter < wallDist;
		let isWallHit = distToCenter >= wallDist - .15;
		_cachedTrackInfo.distanceToCenter = distToCenter;
		_cachedTrackInfo.signedDistance = signedDistance;
		_cachedTrackInfo.t = finalT;
		_cachedTrackInfo.closestIndex = bestIdx;
		_cachedTrackInfo.isOffroad = isOffroad;
		_cachedTrackInfo.isOnCurb = isOnCurb;
		_cachedTrackInfo.isWallHit = isWallHit;
		_cachedTrackInfo.wallDistance = wallDist;
		_cachedTrackInfo.surface = surface;
		_cachedTrackInfo.surfaceName = surfaceName;
		_cachedTrackInfo.surfaceIcon = surfaceIcon;
		_cachedTrackInfo.isShortcut = isShortcut;
		return _cachedTrackInfo;
	};
	const segments = 200;
	const roadGeo = new BufferGeometry();
	const roadVertices = [];
	const roadUvs = [];
	const roadIndices = [];
	const curbVerticesA = [];
	const curbIndicesA = [];
	const curbUvsA = [];
	const curbVerticesB = [];
	const curbIndicesB = [];
	const curbUvsB = [];
	const shoulderVertices = [];
	const shoulderUvs = [];
	const shoulderIndices = [];
	const wallsGroup = new Group();
	const decorations = new Group();
	if (trackDef.theme === "cyber" || trackDef.theme === "ice" || trackDef.theme === "volcano") {
		const tunnelGroup = createTunnel(curve, trackDef.theme, trackWidth);
		decorations.add(tunnelGroup);
	}
	const bridgePillarMat = new MeshStandardMaterial({
		color: trackDef.theme === "cyber" ? 988970 : trackDef.theme === "ice" ? 3718648 : trackDef.theme === "volcano" ? 1579035 : trackDef.theme === "beach" ? 7877903 : 3359061,
		roughness: .8,
		metalness: trackDef.theme === "cyber" || trackDef.theme === "sky" ? .7 : .2
	});
	new MeshStandardMaterial({
		color: trackDef.theme === "cyber" ? 440020 : trackDef.theme === "ice" ? 14742270 : trackDef.theme === "volcano" ? 16347926 : trackDef.theme === "sky" ? 16436245 : 9741240,
		roughness: .3,
		metalness: .6
	});
	new MeshStandardMaterial({
		color: 15680580,
		emissive: 14251782,
		emissiveIntensity: .35,
		roughness: .4
	});
	new MeshStandardMaterial({
		color: 16436245,
		emissive: 15381256,
		emissiveIntensity: 1.3,
		roughness: .2
	});
	const surfaceToMatIdx = {
		asphalt: 0,
		wood: 1,
		cobblestone: 2,
		sand: 3,
		dirt: 4,
		ice: 5,
		magma_rock: 6,
		glass: 7,
		cyber_grid: 8
	};
	for (let i = 0; i <= segments; i++) {
		const t = i / segments % 1;
		const pt = curve.getPointAt(t);
		const tangent = curve.getTangentAt(t).normalize();
		const right = new Vector3().crossVectors(tangent, upVec).normalize();
		const leftPt = pt.clone().add(right.clone().multiplyScalar(-11));
		const rightPt = pt.clone().add(right.clone().multiplyScalar(halfW));
		roadVertices.push(leftPt.x, leftPt.y + .04, leftPt.z);
		roadVertices.push(rightPt.x, rightPt.y + .04, rightPt.z);
		const vCoord = i / segments * 60;
		roadUvs.push(0, vCoord);
		roadUvs.push(1, vCoord);
		if (i < segments) {
			const idx = i * 2;
			roadIndices.push(idx, idx + 1, idx + 2);
			roadIndices.push(idx + 1, idx + 3, idx + 2);
			const segT = (i + .5) / segments;
			const matIdx = surfaceToMatIdx[(sectors.find((sec) => segT >= sec.startT && segT < sec.endT) || sectors[0]).surface] ?? 0;
			roadGeo.addGroup(i * 6, 6, matIdx);
		}
		const curbLeftOuter = leftPt.clone().add(right.clone().multiplyScalar(-2.4));
		const curbRightOuter = rightPt.clone().add(right.clone().multiplyScalar(curbW));
		const cLIdx = i * 2;
		curbVerticesA.push(curbLeftOuter.x, curbLeftOuter.y + .14, curbLeftOuter.z);
		curbVerticesA.push(leftPt.x, leftPt.y + .08, leftPt.z);
		curbUvsA.push(0, vCoord);
		curbUvsA.push(1, vCoord);
		curbVerticesB.push(rightPt.x, rightPt.y + .08, rightPt.z);
		curbVerticesB.push(curbRightOuter.x, curbRightOuter.y + .14, curbRightOuter.z);
		curbUvsB.push(0, vCoord);
		curbUvsB.push(1, vCoord);
		if (i < segments) {
			curbIndicesA.push(cLIdx, cLIdx + 1, cLIdx + 2);
			curbIndicesA.push(cLIdx + 1, cLIdx + 3, cLIdx + 2);
			curbIndicesB.push(cLIdx, cLIdx + 1, cLIdx + 2);
			curbIndicesB.push(cLIdx + 1, cLIdx + 3, cLIdx + 2);
		}
		const shLeftOuter = curbLeftOuter.clone().add(right.clone().multiplyScalar(-28));
		shLeftOuter.y -= .14;
		const shRightOuter = curbRightOuter.clone().add(right.clone().multiplyScalar(shoulderW));
		shRightOuter.y -= .14;
		const shIdx = i * 4;
		shoulderVertices.push(shLeftOuter.x, shLeftOuter.y, shLeftOuter.z);
		shoulderVertices.push(curbLeftOuter.x, curbLeftOuter.y + .06, curbLeftOuter.z);
		shoulderVertices.push(curbRightOuter.x, curbRightOuter.y + .06, curbRightOuter.z);
		shoulderVertices.push(shRightOuter.x, shRightOuter.y, shRightOuter.z);
		shoulderUvs.push(0, vCoord);
		shoulderUvs.push(1, vCoord);
		shoulderUvs.push(0, vCoord);
		shoulderUvs.push(1, vCoord);
		if (i < segments) {
			shoulderIndices.push(shIdx, shIdx + 1, shIdx + 4);
			shoulderIndices.push(shIdx + 1, shIdx + 5, shIdx + 4);
			shoulderIndices.push(shIdx + 2, shIdx + 3, shIdx + 6);
			shoulderIndices.push(shIdx + 3, shIdx + 7, shIdx + 6);
		}
		if (pt.y >= 7 && i % 8 === 0) {
			const pillarHeight = Math.max(1, pt.y - 1.2);
			const pillarGroup = new Group();
			pillarGroup.position.set(pt.x, pillarHeight * .5, pt.z);
			const rotY = Math.atan2(tangent.x, tangent.z);
			pillarGroup.rotation.y = rotY;
			[-12.8, 12.8].forEach((sideX) => {
				const pillar = new Mesh(new CylinderGeometry(1.2, 1.6, pillarHeight, 8), bridgePillarMat);
				pillar.position.set(sideX, 0, 0);
				pillar.castShadow = true;
				pillarGroup.add(pillar);
			});
			const beam = new Mesh(new BoxGeometry(29.2, .9, 2.2), bridgePillarMat);
			beam.position.y = pillarHeight * .5 - .45;
			pillarGroup.add(beam);
			decorations.add(pillarGroup);
		}
	}
	const numCheckpoints = 48;
	const checkpoints = [];
	for (let cpIdx = 0; cpIdx < numCheckpoints; cpIdx++) {
		const cpPt = curve.getPointAt(cpIdx / numCheckpoints);
		checkpoints.push(cpPt);
	}
	roadGeo.setAttribute("position", new Float32BufferAttribute(roadVertices, 3));
	roadGeo.setAttribute("uv", new Float32BufferAttribute(roadUvs, 2));
	roadGeo.setIndex(roadIndices);
	roadGeo.computeVertexNormals();
	const asphaltTex = applyAlbedoMap("asphalt", createAsphaltTexture(trackDef.trackColor, trackDef.theme), 40);
	const woodTex = applyAlbedoMap("wood", createWoodTexture(), 40);
	const cobbleTex = applyAlbedoMap("cobble", createCobblestoneTexture(), 35);
	const sandTex = applyAlbedoMap("sand", createSandTexture(), 40);
	const dirtTex = applyAlbedoMap("dirt", createDirtTexture(), 40);
	const iceTex = applyAlbedoMap("ice", createIceTexture(), 40);
	const magmaTex = applyAlbedoMap("magma", createMagmaTexture(), 35);
	const cyberGlassTex = applyAlbedoMap("cyber", createCyberGlassTexture(), 40);
	const roadMaterials = [
		new MeshStandardMaterial({
			map: asphaltTex,
			roughness: .62,
			metalness: .18,
			envMapIntensity: .7
		}),
		new MeshStandardMaterial({
			map: woodTex,
			roughness: .82,
			metalness: .08,
			envMapIntensity: .35
		}),
		new MeshStandardMaterial({
			map: cobbleTex,
			roughness: .88,
			metalness: .12,
			envMapIntensity: .4
		}),
		new MeshStandardMaterial({
			map: sandTex,
			roughness: .94,
			metalness: .04,
			envMapIntensity: .25
		}),
		new MeshStandardMaterial({
			map: dirtTex,
			roughness: .9,
			metalness: .08,
			envMapIntensity: .3
		}),
		new MeshPhysicalMaterial({
			map: iceTex,
			roughness: .12,
			metalness: .35,
			clearcoat: .55,
			clearcoatRoughness: .2,
			envMapIntensity: 1.1
		}),
		new MeshStandardMaterial({
			map: magmaTex,
			emissive: 14251782,
			emissiveIntensity: .85,
			roughness: .55,
			metalness: .22,
			envMapIntensity: .5
		}),
		new MeshPhysicalMaterial({
			map: cyberGlassTex,
			transparent: true,
			opacity: .9,
			roughness: .12,
			metalness: .55,
			transmission: .18,
			envMapIntensity: 1
		}),
		new MeshStandardMaterial({
			map: cyberGlassTex,
			emissive: 440020,
			emissiveIntensity: 1.05,
			roughness: .22,
			metalness: .65,
			envMapIntensity: .9
		})
	];
	const trackMesh = new Mesh(roadGeo, roadMaterials);
	trackMesh.receiveShadow = true;
	const curbGeoA = new BufferGeometry();
	curbGeoA.setAttribute("position", new Float32BufferAttribute(curbVerticesA, 3));
	curbGeoA.setAttribute("uv", new Float32BufferAttribute(curbUvsA, 2));
	curbGeoA.setIndex(curbIndicesA);
	curbGeoA.computeVertexNormals();
	const curbGeoB = new BufferGeometry();
	curbGeoB.setAttribute("position", new Float32BufferAttribute(curbVerticesB, 3));
	curbGeoB.setAttribute("uv", new Float32BufferAttribute(curbUvsB, 2));
	curbGeoB.setIndex(curbIndicesB);
	curbGeoB.computeVertexNormals();
	const curbTex = createCurbTexture(trackDef.curbColorA, trackDef.curbColorB);
	const curbMat = new MeshStandardMaterial({
		map: curbTex,
		roughness: .45,
		metalness: .15
	});
	const curbMeshA = new Mesh(curbGeoA, curbMat);
	const curbMeshB = new Mesh(curbGeoB, curbMat);
	curbMeshA.receiveShadow = true;
	curbMeshB.receiveShadow = true;
	const curbsGroup = new Group();
	curbsGroup.add(curbMeshA);
	curbsGroup.add(curbMeshB);
	const shoulderGeo = new BufferGeometry();
	shoulderGeo.setAttribute("position", new Float32BufferAttribute(shoulderVertices, 3));
	shoulderGeo.setAttribute("uv", new Float32BufferAttribute(shoulderUvs, 2));
	shoulderGeo.setIndex(shoulderIndices);
	shoulderGeo.computeVertexNormals();
	const shoulderTex = createShoulderTexture(trackDef.theme);
	const shoulderMat = new MeshStandardMaterial({
		map: shoulderTex,
		roughness: .95,
		metalness: .05
	});
	const shoulderMesh = new Mesh(shoulderGeo, shoulderMat);
	shoulderMesh.receiveShadow = true;
	decorations.add(shoulderMesh);
	const startArch = new Group();
	const startPt = curve.getPointAt(0);
	const startTangent = curve.getTangentAt(0).normalize();
	new Vector3().crossVectors(startTangent, upVec).normalize();
	startArch.position.copy(startPt);
	const angle = Math.atan2(startTangent.x, startTangent.z);
	startArch.rotation.y = angle;
	const startStripGeo = new PlaneGeometry(trackWidth, 3.2);
	const startStripTex = createStartLineTexture();
	const startStripMat = new MeshStandardMaterial({
		map: startStripTex,
		roughness: .5
	});
	const startStrip = new Mesh(startStripGeo, startStripMat);
	startStrip.rotation.x = -Math.PI / 2;
	startStrip.position.set(0, .06, 0);
	startArch.add(startStrip);
	const gridBoxGeo = new PlaneGeometry(3, 4.8);
	const gridBoxMat = new MeshBasicMaterial({
		color: 16777215,
		wireframe: true
	});
	for (let slot = 0; slot < 6; slot++) {
		const gBox = new Mesh(gridBoxGeo, gridBoxMat);
		const sideX = (slot % 2 === 0 ? -1 : 1) * 2.8;
		const backZ = -(slot * 7 + 4.5);
		gBox.rotation.x = -Math.PI / 2;
		gBox.position.set(sideX, .07, backZ);
		startArch.add(gBox);
	}
	const gantryPillarDist = 16.9;
	const pillarGeo = new CylinderGeometry(.55, .7, 10, 16);
	const pillarMat = new MeshStandardMaterial({
		color: 2450411,
		metalness: .6,
		roughness: .2
	});
	const pL = new Mesh(pillarGeo, pillarMat);
	pL.position.set(-16.9, 5, 0);
	pL.castShadow = true;
	startArch.add(pL);
	const pR = new Mesh(pillarGeo, pillarMat);
	pR.position.set(gantryPillarDist, 5, 0);
	pR.castShadow = true;
	startArch.add(pR);
	const trussGeo = new BoxGeometry(36.8, 1.4, 1.2);
	const trussMat = new MeshStandardMaterial({
		color: 1976635,
		metalness: .8,
		roughness: .2
	});
	const truss = new Mesh(trussGeo, trussMat);
	truss.position.set(0, 9.8, 0);
	truss.castShadow = true;
	startArch.add(truss);
	const bannerGeo = new BoxGeometry(trackWidth * .75, 1.8, .25);
	const bannerMat = new MeshStandardMaterial({
		color: 16436245,
		emissive: 15381256,
		emissiveIntensity: .35,
		roughness: .3
	});
	const banner = new Mesh(bannerGeo, bannerMat);
	banner.position.set(0, 9.8, .65);
	startArch.add(banner);
	[
		-1.5,
		0,
		1.5
	].forEach((offsetX, idx) => {
		const lightHousing = new Mesh(new BoxGeometry(.7, 1.4, .4), new MeshStandardMaterial({ color: 988970 }));
		lightHousing.position.set(offsetX * 2.2, 8.2, .6);
		const colors = [
			15680580,
			15381256,
			2278750
		];
		const bulb = new Mesh(new SphereGeometry(.22, 12, 12), new MeshStandardMaterial({
			color: colors[idx],
			emissive: colors[idx],
			emissiveIntensity: .8
		}));
		bulb.position.set(0, 0, .22);
		lightHousing.add(bulb);
		startArch.add(lightHousing);
	});
	const itemBoxes = [];
	const itemStations = [
		.06,
		.14,
		.23,
		.33,
		.43,
		.53,
		.63,
		.73,
		.83,
		.92
	];
	const sharedCubeGeo = new BoxGeometry(1.35, 1.35, 1.35);
	const sharedCubeMat = new MeshStandardMaterial({
		color: 16498468,
		emissive: 14251782,
		emissiveIntensity: .9,
		roughness: .15,
		metalness: .2,
		transparent: true,
		opacity: .88
	});
	const sharedGemGeo = new OctahedronGeometry(.52, 0);
	const sharedGemMat = new MeshStandardMaterial({
		color: 16777215,
		emissive: 16707722,
		emissiveIntensity: 1.3,
		metalness: .85,
		roughness: .1
	});
	const sharedStarGeo = new DodecahedronGeometry(.12);
	const sharedStarMat = new MeshBasicMaterial({ color: 16707722 });
	itemStations.forEach((t) => {
		const pt = curve.getPointAt(t);
		const tangent = curve.getTangentAt(t).normalize();
		const right = new Vector3().crossVectors(tangent, upVec).normalize();
		[
			-3.2,
			0,
			3.2
		].forEach((offset) => {
			const boxPos = pt.clone().add(right.clone().multiplyScalar(offset));
			boxPos.y = pt.y + 1.35;
			const boxGroup = new Group();
			boxGroup.position.copy(boxPos);
			const cube = new Mesh(sharedCubeGeo, sharedCubeMat);
			boxGroup.add(cube);
			const gem = new Mesh(sharedGemGeo, sharedGemMat);
			boxGroup.add(gem);
			for (let orb = 0; orb < 2; orb++) {
				const star = new Mesh(sharedStarGeo, sharedStarMat);
				const orbAngle = orb / 2 * Math.PI * 2;
				star.position.set(Math.cos(orbAngle) * .95, 0, Math.sin(orbAngle) * .95);
				boxGroup.add(star);
			}
			itemBoxes.push({
				x: boxPos.x,
				y: boxPos.y,
				z: boxPos.z,
				mesh: boxGroup,
				active: true,
				respawnTime: 0
			});
		});
	});
	const boostPads = [];
	[
		.1,
		.22,
		.34,
		.46,
		.58,
		.7,
		.82,
		.93
	].forEach((t) => {
		const pt = curve.getPointAt(t);
		const tangent = curve.getTangentAt(t).normalize();
		const rotY = Math.atan2(tangent.x, tangent.z);
		const padGroup = new Group();
		padGroup.position.set(pt.x, pt.y + .04, pt.z);
		padGroup.rotation.y = rotY;
		const padWidth = 3.6;
		const baseGeo = new PlaneGeometry(padWidth, 4.2);
		const baseMat = new MeshStandardMaterial({
			color: 988970,
			roughness: .4,
			metalness: .8
		});
		const baseMesh = new Mesh(baseGeo, baseMat);
		baseMesh.rotation.x = -Math.PI / 2;
		padGroup.add(baseMesh);
		const chevronColor = trackDef.theme === "cyber" ? 440020 : trackDef.theme === "ice" ? 3718648 : trackDef.theme === "volcano" ? 16347926 : 16436245;
		const chevronMat = new MeshBasicMaterial({ color: chevronColor });
		for (let c = -1; c <= 1; c++) {
			const arrowGeo = new ConeGeometry(.85, 1.2, 3);
			arrowGeo.rotateX(-Math.PI / 2);
			const arrowMesh = new Mesh(arrowGeo, chevronMat);
			arrowMesh.position.set(0, .02, c * 1.2);
			padGroup.add(arrowMesh);
			[-3.6 * .46, padWidth * .46].forEach((sideX) => {
				const sideStrip = new Mesh(new PlaneGeometry(.24, .9), chevronMat);
				sideStrip.rotation.x = -Math.PI / 2;
				sideStrip.position.set(sideX, .02, c * 1.2);
				padGroup.add(sideStrip);
			});
		}
		boostPads.push({
			x: pt.x,
			y: pt.y + .04,
			z: pt.z,
			rotY,
			mesh: padGroup
		});
	});
	const jumpRamps = [];
	[
		.18,
		.48,
		.76
	].forEach((t) => {
		const pt = curve.getPointAt(t);
		const tangent = curve.getTangentAt(t).normalize();
		const rotY = Math.atan2(tangent.x, tangent.z);
		const rampGroup = new Group();
		rampGroup.position.set(pt.x, pt.y, pt.z);
		rampGroup.rotation.y = rotY;
		const rampWidth = 9;
		const rampLength = 6.5;
		const rampHeight = 2.2;
		const rampShape = new Shape();
		rampShape.moveTo(-6.5 / 2, 0);
		rampShape.lineTo(rampLength / 2, rampHeight);
		rampShape.lineTo(rampLength / 2, 0);
		rampShape.closePath();
		const rampGeo = new ExtrudeGeometry(rampShape, {
			depth: rampWidth,
			bevelEnabled: true,
			bevelSegments: 2,
			steps: 1,
			bevelSize: .1,
			bevelThickness: .1
		});
		rampGeo.center();
		rampGeo.rotateY(Math.PI / 2);
		const rampMat = new MeshStandardMaterial({
			color: trackDef.theme === "cyber" ? 440020 : trackDef.theme === "ice" ? 3718648 : trackDef.theme === "volcano" ? 16347926 : 16096779,
			roughness: .3,
			metalness: .7
		});
		const rampMesh = new Mesh(rampGeo, rampMat);
		rampMesh.position.y = rampHeight * .48;
		rampGroup.add(rampMesh);
		const arrowMat = new MeshBasicMaterial({ color: 16776171 });
		for (let a = -1; a <= 1; a++) {
			const arrow = new Mesh(new ConeGeometry(.9, 1.4, 3), arrowMat);
			arrow.rotation.x = -Math.PI / 2 + .32;
			arrow.position.set(a * 2.4, rampHeight * .55, .4);
			rampGroup.add(arrow);
		}
		const railMat = new MeshStandardMaterial({
			color: 15680580,
			metalness: .8,
			roughness: .2
		});
		[-9 / 2, rampWidth / 2].forEach((sideX) => {
			const rail = new Mesh(new BoxGeometry(.3, 2.8000000000000003, rampLength), railMat);
			rail.position.set(sideX, 2.8000000000000003 / 2, 0);
			rampGroup.add(rail);
		});
		decorations.add(rampGroup);
		jumpRamps.push({
			x: pt.x,
			y: pt.y,
			z: pt.z,
			rotY,
			width: rampWidth,
			jumpForce: 23,
			boostBonus: 14,
			mesh: rampGroup
		});
	});
	const stuntRings = [];
	[
		.21,
		.51,
		.79
	].forEach((t) => {
		const pt = curve.getPointAt(t);
		const tangent = curve.getTangentAt(t).normalize();
		const rotY = Math.atan2(tangent.x, tangent.z);
		const ringGroup = new Group();
		const ringY = pt.y + 7.5;
		ringGroup.position.set(pt.x, ringY, pt.z);
		ringGroup.rotation.y = rotY;
		const torusGeo = new TorusGeometry(3.6, .4, 16, 32);
		const torusMat = new MeshStandardMaterial({
			color: 16436245,
			emissive: 15381256,
			emissiveIntensity: 1.4,
			metalness: .9,
			roughness: .1
		});
		const torusMesh = new Mesh(torusGeo, torusMat);
		ringGroup.add(torusMesh);
		const orbGeo = new SphereGeometry(.4, 12, 12);
		const orbMat = new MeshBasicMaterial({ color: 6809849 });
		for (let o = 0; o < 4; o++) {
			const orb = new Mesh(orbGeo, orbMat);
			const angle = o / 4 * Math.PI * 2;
			orb.position.set(Math.cos(angle) * 3.6, Math.sin(angle) * 3.6, 0);
			ringGroup.add(orb);
		}
		decorations.add(ringGroup);
		stuntRings.push({
			x: pt.x,
			y: ringY,
			z: pt.z,
			radius: 3.6,
			pointsBonus: 500,
			collectedBy: [],
			mesh: ringGroup
		});
	});
	const hazards = [];
	const hazardConfigs = [];
	if (trackDef.theme === "spooky") hazardConfigs.push({
		t: .38,
		type: "pendulum",
		name: "Hauakambri Lõikur-Pendel",
		speed: 2.5,
		range: 6.5
	}, {
		t: .42,
		type: "pendulum",
		name: "Nõiutud Raudkirves",
		speed: 2.8,
		range: 6.5
	}, {
		t: .85,
		type: "fireball",
		name: "Kummitustuli",
		speed: 3.2,
		range: 4.5
	});
	else if (trackDef.theme === "cyber") hazardConfigs.push({
		t: .28,
		type: "laser_sweeper",
		name: "Küber-Laserbarjäär Alpha",
		speed: 3,
		range: 7
	}, {
		t: .65,
		type: "laser_sweeper",
		name: "Küber-Laserbarjäär Beta",
		speed: 3.5,
		range: 7
	});
	else if (trackDef.theme === "ice") hazardConfigs.push({
		t: .35,
		type: "snow_boulder",
		name: "Liustiku Hiid-Lumepall",
		speed: 2.2,
		range: 5.5
	}, {
		t: .68,
		type: "snow_boulder",
		name: "Laviini Jäärahk",
		speed: 2.6,
		range: 5.5
	});
	else if (trackDef.theme === "volcano") hazardConfigs.push({
		t: .32,
		type: "magma_geyser",
		name: "Magma Geiser",
		speed: 2,
		range: 5
	}, {
		t: .6,
		type: "fireball",
		name: "Tuline Laavapall",
		speed: 3.2,
		range: 6
	}, {
		t: .88,
		type: "magma_geyser",
		name: "Kraatri Purskekaev",
		speed: 2.4,
		range: 5
	});
	else if (trackDef.theme === "sky") hazardConfigs.push({
		t: .36,
		type: "laser_sweeper",
		name: "Ioon-Pikselaeng",
		speed: 3.2,
		range: 6
	}, {
		t: .7,
		type: "laser_sweeper",
		name: "Stratosfääri Plasmasild",
		speed: 3.6,
		range: 6
	});
	else hazardConfigs.push({
		t: .36,
		type: "water_spout",
		name: "Merelaine Geiser",
		speed: 2.2,
		range: 5.5
	}, {
		t: .68,
		type: "water_spout",
		name: "Rannikupurske Veesein",
		speed: 2.4,
		range: 5.5
	});
	hazardConfigs.forEach((cfg) => {
		const pt = curve.getPointAt(cfg.t);
		const tangent = curve.getTangentAt(cfg.t).normalize();
		const right = new Vector3().crossVectors(tangent, upVec).normalize();
		Math.atan2(tangent.x, tangent.z);
		const hazardGroup = new Group();
		hazardGroup.position.set(pt.x, pt.y, pt.z);
		if (cfg.type === "pendulum") {
			const archGeo = new CylinderGeometry(.3, .3, 11, 8);
			const archMat = new MeshStandardMaterial({
				color: 3359061,
				metalness: .8,
				roughness: .3
			});
			const leftPillar = new Mesh(archGeo, archMat);
			leftPillar.position.set(-right.x * 6.5, 5.5, -right.z * 6.5);
			hazardGroup.add(leftPillar);
			const rightPillar = new Mesh(archGeo, archMat);
			rightPillar.position.set(right.x * 6.5, 5.5, right.z * 6.5);
			hazardGroup.add(rightPillar);
			const topBar = new Mesh(new CylinderGeometry(.35, .35, 14, 8), archMat);
			topBar.rotation.z = Math.PI / 2;
			topBar.position.y = 10.5;
			hazardGroup.add(topBar);
			const swingArm = new Group();
			swingArm.position.y = 10.5;
			swingArm.name = "swing_arm";
			const chain = new Mesh(new CylinderGeometry(.12, .12, 8.5, 6), archMat);
			chain.position.y = -4.25;
			swingArm.add(chain);
			const bladeGeo = new CylinderGeometry(2.4, 2.4, .18, 16, 1, false, 0, Math.PI);
			const bladeMat = new MeshStandardMaterial({
				color: 14870768,
				metalness: .95,
				roughness: .1,
				emissive: 14427686,
				emissiveIntensity: .25
			});
			const blade = new Mesh(bladeGeo, bladeMat);
			blade.rotation.x = Math.PI / 2;
			blade.position.y = -8.5;
			swingArm.add(blade);
			hazardGroup.add(swingArm);
		} else if (cfg.type === "laser_sweeper") {
			const pylonMat = new MeshStandardMaterial({
				color: 988970,
				metalness: .9,
				roughness: .2
			});
			const pylonGeo = new BoxGeometry(.9, 4.5, .9);
			const pLeft = new Mesh(pylonGeo, pylonMat);
			pLeft.position.set(-right.x * 6, 2.25, -right.z * 6);
			hazardGroup.add(pLeft);
			const pRight = new Mesh(pylonGeo, pylonMat);
			pRight.position.set(right.x * 6, 2.25, right.z * 6);
			hazardGroup.add(pRight);
			const laserArm = new Group();
			laserArm.name = "laser_beam";
			const laserGeo = new CylinderGeometry(.2, .2, 12, 8);
			laserGeo.rotateZ(Math.PI / 2);
			const laserMat = new MeshBasicMaterial({ color: 16711765 });
			const laserMesh = new Mesh(laserGeo, laserMat);
			laserMesh.position.y = 1.6;
			laserArm.add(laserMesh);
			hazardGroup.add(laserArm);
		} else if (cfg.type === "snow_boulder") {
			const boulderMat = new MeshStandardMaterial({
				color: 14870768,
				roughness: .8,
				metalness: .1
			});
			const boulderMesh = new Mesh(new DodecahedronGeometry(2.4, 1), boulderMat);
			boulderMesh.position.y = 2.4;
			boulderMesh.name = "rolling_boulder";
			hazardGroup.add(boulderMesh);
		} else if (cfg.type === "magma_geyser" || cfg.type === "water_spout") {
			const isMagma = cfg.type === "magma_geyser";
			const spoutMat = new MeshStandardMaterial({
				color: isMagma ? 16347926 : 3718648,
				emissive: isMagma ? 15680580 : 165063,
				emissiveIntensity: 1.2,
				transparent: true,
				opacity: .85
			});
			const spout = new Mesh(new CylinderGeometry(1.6, 2.4, 7, 12), spoutMat);
			spout.position.y = 3.5;
			spout.name = "erupting_spout";
			hazardGroup.add(spout);
		} else {
			const fireballMat = new MeshStandardMaterial({
				color: 15680580,
				emissive: 16096779,
				emissiveIntensity: 1.6
			});
			const fireball = new Mesh(new SphereGeometry(2.2, 16, 16), fireballMat);
			fireball.position.y = 2.2;
			fireball.name = "fireball_mesh";
			hazardGroup.add(fireball);
		}
		decorations.add(hazardGroup);
		hazards.push({
			id: `hazard_${cfg.t}_${cfg.type}`,
			type: cfg.type,
			name: cfg.name,
			x: pt.x,
			y: pt.y,
			z: pt.z,
			radius: 2.2,
			active: true,
			sweepProgress: 0,
			sweepSpeed: cfg.speed,
			sweepRange: cfg.range,
			mesh: hazardGroup
		});
	});
	const isTooCloseToTrack = (pos, minDist = 17, objBottomY = pos.y - 1.5, objTopY = pos.y + 12) => {
		const minDistSq = minDist * minDist;
		for (let s = 0; s < denseCount; s++) {
			const samplePt = centerlinePoints[s].point;
			const dx = pos.x - samplePt.x;
			const dz = pos.z - samplePt.z;
			if (dx * dx + dz * dz < minDistSq) {
				const roadBottom = samplePt.y - 3.5;
				const roadTop = samplePt.y + 7.5;
				if (objTopY >= roadBottom && objBottomY <= roadTop) return true;
			}
		}
		return false;
	};
	const addGrandstands = () => {
		const standCount = 8;
		const boxGeo = new BoxGeometry(15, 3.4, 6.5);
		const seatMat = new MeshLambertMaterial({ color: 1976635 });
		const stands = new InstancedMesh(boxGeo, seatMat, standCount);
		const roofGeo = new BoxGeometry(16, .4, 7.5);
		const roofMat = new MeshLambertMaterial({ color: 3359061 });
		const roofs = new InstancedMesh(roofGeo, roofMat, standCount);
		const spectatorHeadGeo = new SphereGeometry(.42, 8, 8);
		const spectatorMat = new MeshLambertMaterial();
		const maxSpectators = 144;
		const spectatorMesh = new InstancedMesh(spectatorHeadGeo, spectatorMat, maxSpectators);
		const spectatorColors = [
			new Color(15680580),
			new Color(3900150),
			new Color(1096065),
			new Color(16096779),
			new Color(15485081),
			new Color(9133302),
			new Color(440020),
			new Color(16317180)
		];
		const dummy = new Object3D();
		let placed = 0;
		let specIdx = 0;
		for (let i = 0; i < 24 && placed < standCount; i++) {
			const t = (.08 + i * .11) % 1;
			const pt = centerlinePoints[Math.floor(t * denseCount) % denseCount];
			const side = placed % 2 === 0 ? 1 : -1;
			const pos = pt.point.clone().add(pt.right.clone().multiplyScalar(side * 27.5));
			if (isTooCloseToTrack(pos, 15, pt.point.y, pt.point.y + 9)) continue;
			dummy.position.set(pos.x, pt.point.y + 1.5, pos.z);
			dummy.lookAt(pt.point.x, pt.point.y + 1.5, pt.point.z);
			dummy.updateMatrix();
			stands.setMatrixAt(placed, dummy.matrix);
			dummy.position.set(pos.x, pt.point.y + 6.2, pos.z);
			dummy.lookAt(pt.point.x, pt.point.y + 6.2, pt.point.z);
			dummy.rotateX(.1);
			dummy.updateMatrix();
			roofs.setMatrixAt(placed, dummy.matrix);
			const forwardDir = new Vector3().subVectors(pt.point, pos).normalize();
			const rightDir = new Vector3().crossVectors(upVec, forwardDir).normalize();
			for (let row = 0; row < 2; row++) for (let col = -4; col <= 4; col++) if (specIdx < maxSpectators) {
				const specPos = pos.clone().addScaledVector(rightDir, col * 1.5).addScaledVector(forwardDir, (row - .5) * 1.8);
				specPos.y = pt.point.y + 3.4 + row * 1.2;
				dummy.position.copy(specPos);
				dummy.rotation.set(0, 0, 0);
				dummy.lookAt(pt.point.x, specPos.y, pt.point.z);
				dummy.scale.set(1, 1.2, 1);
				dummy.updateMatrix();
				spectatorMesh.setMatrixAt(specIdx, dummy.matrix);
				spectatorMesh.setColorAt(specIdx, spectatorColors[specIdx * 5 % spectatorColors.length]);
				specIdx++;
			}
			placed++;
		}
		stands.instanceMatrix.needsUpdate = true;
		stands.receiveShadow = true;
		decorations.add(stands);
		roofs.instanceMatrix.needsUpdate = true;
		decorations.add(roofs);
		if (specIdx > 0) {
			spectatorMesh.instanceMatrix.needsUpdate = true;
			if (spectatorMesh.instanceColor) spectatorMesh.instanceColor.needsUpdate = true;
			decorations.add(spectatorMesh);
		}
		const billboardDefs = [
			{
				title: "TURBO NITRO",
				subtitle: "★ 100% MAXIMUM BOOST ★",
				bg: "#0f172a",
				accent: "#f97316"
			},
			{
				title: "BANANA MOTORS",
				subtitle: "★ SLIP & SLIDE RACING ★",
				bg: "#ca8a04",
				accent: "#fef08a"
			},
			{
				title: "SUPER STAR",
				subtitle: "★ INVINCIBLE SPEEDWAY ★",
				bg: "#1e1b4b",
				accent: "#c084fc"
			},
			{
				title: "CYBER GP",
				subtitle: "★ HYPERLINK OVERDRIVE ★",
				bg: "#083344",
				accent: "#06b6d4"
			},
			{
				title: "DRIFT KINGDOM",
				subtitle: "★ APEX CORNERING TECH ★",
				bg: "#450a0a",
				accent: "#ef4444"
			},
			{
				title: "LAVA BLASTERS",
				subtitle: "★ FEEL THE VOLCANIC HEAT ★",
				bg: "#292524",
				accent: "#eab308"
			}
		];
		const bBoardGeo = new BoxGeometry(9.5, 4, .35);
		const bPostGeo = new CylinderGeometry(.25, .32, 6, 8);
		const bPostMat = new MeshStandardMaterial({
			color: 3359061,
			metalness: .8,
			roughness: .25
		});
		let bPlaced = 0;
		for (let i = 0; i < 18 && bPlaced < billboardDefs.length; i++) {
			const t = (.13 + i * .14) % 1;
			const pt = centerlinePoints[Math.floor(t * denseCount) % denseCount];
			const side = bPlaced % 2 === 0 ? -1 : 1;
			const pos = pt.point.clone().add(pt.right.clone().multiplyScalar(side * 23));
			if (isTooCloseToTrack(pos, 15, pt.point.y, pt.point.y + 8)) continue;
			const bGroup = new Group();
			bGroup.position.set(pos.x, pt.point.y, pos.z);
			bGroup.lookAt(pt.point.x, pt.point.y, pt.point.z);
			[-3.6, 3.6].forEach((px) => {
				const post = new Mesh(bPostGeo, bPostMat);
				post.position.set(px, 3, 0);
				bGroup.add(post);
			});
			const bDef = billboardDefs[bPlaced];
			const bTex = createBillboardTexture(bDef.title, bDef.subtitle, bDef.bg, bDef.accent);
			const bMat = new MeshStandardMaterial({
				map: bTex,
				roughness: .4,
				metalness: .1
			});
			const boardMesh = new Mesh(bBoardGeo, bMat);
			boardMesh.position.set(0, 5.2, 0);
			bGroup.add(boardMesh);
			decorations.add(bGroup);
			bPlaced++;
		}
	};
	addGrandstands();
	let waterMesh;
	let lighthouseBeam;
	const animatedProps = [];
	if (trackDef.theme === "beach") {
		const oceanGeo = new PlaneGeometry(3400, 3400, 24, 24);
		const oceanMat = new MeshLambertMaterial({
			color: 165063,
			transparent: true,
			opacity: .75,
			side: 2
		});
		waterMesh = new Mesh(oceanGeo, oceanMat);
		waterMesh.rotation.x = -Math.PI / 2;
		waterMesh.position.y = -1.2;
		waterMesh.receiveShadow = true;
		decorations.add(waterMesh);
		const palmTrunkMat = new MeshLambertMaterial({ color: 7877903 });
		const palmLeafMat = new MeshLambertMaterial({ color: 1409085 });
		const coconutMat = new MeshLambertMaterial({ color: 4528643 });
		const umbrellaPoleMat = new MeshLambertMaterial({ color: 14870768 });
		const chairMat = new MeshLambertMaterial({ color: 16707722 });
		const torchStickMat = new MeshLambertMaterial({ color: 7877903 });
		const torchFlameMat = new MeshLambertMaterial({
			color: 16347926,
			emissive: 15357964,
			emissiveIntensity: .85
		});
		const palmTrunkGeo = new CylinderGeometry(.35, .6, 7.5, 7);
		const coconutGeo = new SphereGeometry(.28, 6, 6);
		const leafGeo = new ConeGeometry(2.4, 1.2, 5);
		const umbrellaPoleGeo = new CylinderGeometry(.08, .08, 3.5, 6);
		const canopyGeo = new ConeGeometry(2.2, 1.2, 8);
		const chairGeo = new BoxGeometry(1.6, .4, .8);
		const torchStickGeo = new CylinderGeometry(.12, .15, 3.2, 6);
		const flameGeo = new ConeGeometry(.35, .7, 6);
		for (let i = 0; i < 42; i++) {
			const t = (i / 42 + Math.sin(i * 99) * .015 + 1) % 1;
			const pt = curve.getPointAt(t);
			const tangent = curve.getTangentAt(t).normalize();
			const right = new Vector3().crossVectors(tangent, upVec).normalize();
			const side = i % 2 === 0 ? 1 : -1;
			const dist = side * (16 + Math.random() * 26);
			const propPos = pt.clone().add(right.multiplyScalar(dist));
			propPos.y = Math.max(0, pt.y);
			if (isTooCloseToTrack(propPos, 15.5, propPos.y, propPos.y + 10)) continue;
			if (i % 3 === 0) {
				const tree = new Group();
				tree.position.copy(propPos);
				const trunk = new Mesh(palmTrunkGeo, palmTrunkMat);
				trunk.position.y = 3.75;
				trunk.rotation.z = side * .15;
				trunk.castShadow = true;
				tree.add(trunk);
				for (let c = 0; c < 3; c++) {
					const coconut = new Mesh(coconutGeo, coconutMat);
					coconut.position.set((c - 1) * .35, 7.2, .2);
					tree.add(coconut);
				}
				for (let l = 0; l < 7; l++) {
					const leaf = new Mesh(leafGeo, palmLeafMat);
					leaf.position.set(0, 7.4, 0);
					leaf.rotation.y = l / 7 * Math.PI * 2;
					leaf.rotation.z = .55;
					leaf.castShadow = true;
					tree.add(leaf);
				}
				decorations.add(tree);
			} else if (i % 3 === 1) {
				const beachSet = new Group();
				beachSet.position.copy(propPos);
				const pole = new Mesh(umbrellaPoleGeo, umbrellaPoleMat);
				pole.position.y = 1.75;
				beachSet.add(pole);
				const canopyColor = i % 2 === 0 ? 15680580 : 165063;
				const canopy = new Mesh(canopyGeo, new MeshLambertMaterial({ color: canopyColor }));
				canopy.position.y = 3.2;
				canopy.castShadow = true;
				beachSet.add(canopy);
				const chair = new Mesh(chairGeo, chairMat);
				chair.position.set(1, .2, 0);
				chair.rotation.y = Math.random() * Math.PI;
				beachSet.add(chair);
				decorations.add(beachSet);
			} else {
				const torch = new Group();
				torch.position.copy(propPos);
				const stick = new Mesh(torchStickGeo, torchStickMat);
				stick.position.y = 1.6;
				torch.add(stick);
				const flame = new Mesh(flameGeo, torchFlameMat);
				flame.position.y = 3.3;
				torch.add(flame);
				decorations.add(torch);
			}
		}
		const lighthouse = new Group();
		lighthouse.position.set(150, 0, -180);
		const base = new Mesh(new CylinderGeometry(5.5, 7.5, 26, 16), new MeshStandardMaterial({
			color: 16317180,
			roughness: .4
		}));
		base.position.y = 13;
		base.castShadow = true;
		lighthouse.add(base);
		for (let b = 0; b < 2; b++) {
			const band = new Mesh(new CylinderGeometry(6.1 - b * .8, 6.7 - b * .8, 4.5, 16), new MeshStandardMaterial({ color: 15680580 }));
			band.position.y = 8 + b * 9;
			lighthouse.add(band);
		}
		const lampDome = new Mesh(new SphereGeometry(3.5, 16, 16), new MeshStandardMaterial({
			color: 16707722,
			emissive: 16436245,
			emissiveIntensity: 1
		}));
		lampDome.position.y = 27;
		lighthouse.add(lampDome);
		const beamGeo = new ConeGeometry(14, 75, 16, 1, true);
		beamGeo.rotateX(Math.PI / 2);
		beamGeo.translate(0, 0, 37.5);
		const beamMat = new MeshBasicMaterial({
			color: 16707722,
			transparent: true,
			opacity: .28,
			side: 2,
			depthWrite: false
		});
		lighthouseBeam = new Mesh(beamGeo, beamMat);
		lighthouseBeam.position.set(150, 27, -180);
		decorations.add(lighthouseBeam);
		decorations.add(lighthouse);
		const boatHullGeo = new BoxGeometry(4.2, 1.8, 11);
		const boatHullMat = new MeshStandardMaterial({
			color: 16317180,
			roughness: .3
		});
		const mastGeo = new CylinderGeometry(.12, .15, 13, 6);
		const mastMat = new MeshStandardMaterial({ color: 7877903 });
		const sailGeo = new BufferGeometry();
		sailGeo.setAttribute("position", new Float32BufferAttribute([
			0,
			1.2,
			0,
			0,
			12.5,
			0,
			0,
			2,
			5
		], 3));
		sailGeo.computeVertexNormals();
		const sailMat = new MeshLambertMaterial({
			color: 165063,
			side: 2
		});
		[
			{
				x: 95,
				z: 320,
				rot: .5
			},
			{
				x: 190,
				z: 360,
				rot: -.7
			},
			{
				x: 270,
				z: 335,
				rot: 1.1
			}
		].forEach((b) => {
			const boat = new Group();
			boat.position.set(b.x, -.2, b.z);
			boat.rotation.y = b.rot;
			const hull = new Mesh(boatHullGeo, boatHullMat);
			hull.position.y = .9;
			boat.add(hull);
			const mast = new Mesh(mastGeo, mastMat);
			mast.position.y = 7.5;
			boat.add(mast);
			const sail = new Mesh(sailGeo, sailMat);
			boat.add(sail);
			decorations.add(boat);
		});
	} else if (trackDef.theme === "spooky") {
		const gateGroup = new Group();
		const gateT = .45;
		const gatePt = curve.getPointAt(gateT);
		const gateTangent = curve.getTangentAt(gateT).normalize();
		new Vector3().crossVectors(gateTangent, upVec).normalize();
		gateGroup.position.copy(gatePt);
		gateGroup.rotation.y = Math.atan2(gateTangent.x, gateTangent.z);
		const gateClearance = 16.9;
		const towerGeo = new CylinderGeometry(2.6, 3.2, 18, 12);
		const stoneMat = new MeshStandardMaterial({
			color: 3359061,
			roughness: .9
		});
		const tLeft = new Mesh(towerGeo, stoneMat);
		tLeft.position.set(-16.9, 9, 0);
		gateGroup.add(tLeft);
		const tRight = new Mesh(towerGeo, stoneMat);
		tRight.position.set(gateClearance, 9, 0);
		gateGroup.add(tRight);
		const bridgeGeo = new BoxGeometry(38.8, 3.2, 4.5);
		const bridge = new Mesh(bridgeGeo, stoneMat);
		bridge.position.set(0, 15, 0);
		gateGroup.add(bridge);
		const gargoyleGeo = new DodecahedronGeometry(1.2, 0);
		const gargoyleLeft = new Mesh(gargoyleGeo, stoneMat);
		gargoyleLeft.position.set(-16.9, 19, 0);
		gateGroup.add(gargoyleLeft);
		const gargoyleRight = new Mesh(gargoyleGeo, stoneMat);
		gargoyleRight.position.set(gateClearance, 19, 0);
		gateGroup.add(gargoyleRight);
		decorations.add(gateGroup);
		const pumpkinMat = new MeshLambertMaterial({
			color: 15357964,
			emissive: 12730636,
			emissiveIntensity: .6
		});
		const pumpkinGeo = new SphereGeometry(1.2, 10, 10);
		const tombMat = new MeshLambertMaterial({ color: 4674921 });
		const tombGeo = new BoxGeometry(1.4, 2.8, .45);
		const stemMat = new MeshLambertMaterial({ color: 1409085 });
		const stemGeo = new CylinderGeometry(.12, .16, .6, 6);
		for (let i = 0; i < 40; i++) {
			const t = i / 40 % 1;
			const pt = curve.getPointAt(t);
			const tangent = curve.getTangentAt(t).normalize();
			const right = new Vector3().crossVectors(tangent, upVec).normalize();
			const dist = (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 22);
			const propPos = pt.clone().add(right.multiplyScalar(dist));
			propPos.y = pt.y;
			if (isTooCloseToTrack(propPos, 16, propPos.y, propPos.y + 10)) continue;
			const propGroup = new Group();
			propGroup.position.copy(propPos);
			if (i % 3 === 0) {
				const pumpkin = new Mesh(pumpkinGeo, pumpkinMat);
				pumpkin.scale.set(1.3, .95, 1.3);
				pumpkin.position.y = .9;
				propGroup.add(pumpkin);
				const stem = new Mesh(stemGeo, stemMat);
				stem.position.y = 1.8;
				propGroup.add(stem);
			} else if (i % 3 === 1) {
				const tomb = new Mesh(tombGeo, tombMat);
				tomb.position.y = 1.4;
				tomb.rotation.y = (Math.random() - .5) * .6;
				propGroup.add(tomb);
			} else {
				const deadTree = new Group();
				const trunk = new Mesh(new CylinderGeometry(.3, .7, 7, 7), new MeshStandardMaterial({
					color: 2565930,
					roughness: .95
				}));
				trunk.position.y = 3.5;
				trunk.rotation.z = (Math.random() - .5) * .4;
				deadTree.add(trunk);
				for (let b = 0; b < 3; b++) {
					const branch = new Mesh(new CylinderGeometry(.12, .25, 3.5, 5), new MeshStandardMaterial({ color: 1579035 }));
					branch.position.set((b - 1) * .8, 5.5 + b * .6, 0);
					branch.rotation.z = (b - 1) * .7;
					deadTree.add(branch);
				}
				propGroup.add(deadTree);
			}
			decorations.add(propGroup);
		}
	} else if (trackDef.theme === "cyber") for (let i = 0; i < 42; i++) {
		const t = i / 42 % 1;
		const pt = curve.getPointAt(t);
		const tangent = curve.getTangentAt(t).normalize();
		const right = new Vector3().crossVectors(tangent, upVec).normalize();
		const dist = (i % 2 === 0 ? 1 : -1) * (23 + Math.random() * 26);
		const pPos = pt.clone().add(right.clone().multiplyScalar(dist));
		pPos.y = pt.y;
		const towerW = 5 + Math.random() * 4;
		const towerD = 5 + Math.random() * 4;
		const towerH = 24 + Math.random() * 32;
		if (!isTooCloseToTrack(pPos, 19, pPos.y, pPos.y + towerH + 8)) {
			const pGroup = new Group();
			pGroup.position.copy(pPos);
			const towerGeo = new BoxGeometry(towerW, towerH, towerD);
			const towerMat = new MeshStandardMaterial({
				color: 329745,
				roughness: .3,
				metalness: .85
			});
			const tower = new Mesh(towerGeo, towerMat);
			tower.position.y = towerH * .5;
			pGroup.add(tower);
			const spireGeo = new CylinderGeometry(.1, .4, 8, 6);
			const spireMat = new MeshStandardMaterial({
				color: 3359061,
				metalness: .9
			});
			const spire = new Mesh(spireGeo, spireMat);
			spire.position.set(0, towerH + 4, 0);
			pGroup.add(spire);
			const beaconGeo = new SphereGeometry(.5, 8, 8);
			const beaconColor = i % 2 === 0 ? 16007006 : 440020;
			const beaconMat = new MeshBasicMaterial({ color: beaconColor });
			const beacon = new Mesh(beaconGeo, beaconMat);
			beacon.position.set(0, towerH + 8, 0);
			pGroup.add(beacon);
			const signColor = i % 3 === 0 ? 440020 : i % 3 === 1 ? 16007006 : 11032055;
			const signGeo = new BoxGeometry(6.5, 3.8, .4);
			const signMat = new MeshStandardMaterial({
				color: signColor,
				emissive: signColor,
				emissiveIntensity: 1.2,
				roughness: .2
			});
			const sign = new Mesh(signGeo, signMat);
			sign.position.set(0, Math.min(towerH - 4, 22), towerD * .5 + .3);
			pGroup.add(sign);
			decorations.add(pGroup);
		}
		if (i % 7 === 0) {
			const archGroup = new Group();
			archGroup.position.copy(pt);
			archGroup.rotation.y = Math.atan2(tangent.x, tangent.z);
			const archClearance = 16.9;
			const archPillarGeo = new BoxGeometry(1.4, 12, 1.4);
			const archPillarMat = new MeshStandardMaterial({
				color: 988970,
				metalness: .8,
				roughness: .4
			});
			const archP1 = new Mesh(archPillarGeo, archPillarMat);
			archP1.position.set(-16.9, 6, 0);
			archGroup.add(archP1);
			const archP2 = new Mesh(archPillarGeo, archPillarMat);
			archP2.position.set(archClearance, 6, 0);
			archGroup.add(archP2);
			const archBeamGeo = new BoxGeometry(36.8, 1.2, 1.8);
			const archBeam = new Mesh(archBeamGeo, archPillarMat);
			archBeam.position.set(0, 12, 0);
			archGroup.add(archBeam);
			const neonStripGeo = new BoxGeometry(34.8, .3, .2);
			const neonStripMat = new MeshBasicMaterial({ color: i / 7 % 2 === 0 ? 440020 : 16007006 });
			const neonStrip = new Mesh(neonStripGeo, neonStripMat);
			neonStrip.position.set(0, 12, .95);
			archGroup.add(neonStrip);
			decorations.add(archGroup);
		}
	}
	else if (trackDef.theme === "ice") for (let i = 0; i < 40; i++) {
		const t = i / 40 % 1;
		const pt = curve.getPointAt(t);
		const tangent = curve.getTangentAt(t).normalize();
		const right = new Vector3().crossVectors(tangent, upVec).normalize();
		const dist = (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 24);
		const propPos = pt.clone().add(right.multiplyScalar(dist));
		propPos.y = pt.y;
		if (isTooCloseToTrack(propPos, 16, propPos.y, propPos.y + 8)) continue;
		const propGroup = new Group();
		propGroup.position.copy(propPos);
		if (i % 3 === 0) {
			const snowman = new Group();
			const snowMat = new MeshStandardMaterial({
				color: 16777215,
				roughness: .7
			});
			const b1 = new Mesh(new SphereGeometry(1.3, 12, 12), snowMat);
			b1.position.y = 1.1;
			b1.castShadow = true;
			snowman.add(b1);
			const b2 = new Mesh(new SphereGeometry(.9, 12, 12), snowMat);
			b2.position.y = 2.7;
			b2.castShadow = true;
			snowman.add(b2);
			const b3 = new Mesh(new SphereGeometry(.6, 12, 12), snowMat);
			b3.position.y = 3.8;
			b3.castShadow = true;
			snowman.add(b3);
			const carrot = new Mesh(new ConeGeometry(.15, .6, 8), new MeshStandardMaterial({ color: 16347926 }));
			carrot.rotation.x = Math.PI / 2;
			carrot.position.set(0, 3.8, .65);
			snowman.add(carrot);
			const hat = new Mesh(new CylinderGeometry(.4, .55, .7, 10), new MeshStandardMaterial({ color: 1976635 }));
			hat.position.y = 4.5;
			snowman.add(hat);
			propGroup.add(snowman);
		} else if (i % 3 === 1) {
			const pine = new Group();
			const trunk = new Mesh(new CylinderGeometry(.3, .45, 2.5, 8), new MeshStandardMaterial({ color: 7877903 }));
			trunk.position.y = 1.25;
			pine.add(trunk);
			const needleMat = new MeshStandardMaterial({
				color: 1467700,
				roughness: .7
			});
			const snowMat = new MeshStandardMaterial({
				color: 16317180,
				roughness: .4
			});
			for (let tier = 0; tier < 3; tier++) {
				const cone = new Mesh(new ConeGeometry(2.6 - tier * .6, 2.2, 7), needleMat);
				cone.position.y = 2.8 + tier * 1.5;
				cone.castShadow = true;
				pine.add(cone);
				const snowRim = new Mesh(new ConeGeometry(1.8 - tier * .4, .7, 7), snowMat);
				snowRim.position.y = 3.6 + tier * 1.5;
				pine.add(snowRim);
			}
			propGroup.add(pine);
		} else {
			const crystalMat = new MeshStandardMaterial({
				color: 3718648,
				emissive: 165063,
				emissiveIntensity: .6,
				roughness: .15,
				metalness: .4,
				transparent: true,
				opacity: .88
			});
			for (let c = 0; c < 3; c++) {
				const crystal = new Mesh(new OctahedronGeometry(1.2 - c * .25, 0), crystalMat);
				crystal.scale.set(.6, 2.6, .6);
				crystal.position.set((c - 1) * .8, 1.4, 0);
				crystal.rotation.set((c - 1) * .25, c * .6, 0);
				propGroup.add(crystal);
			}
		}
		decorations.add(propGroup);
	}
	else if (trackDef.theme === "volcano") {
		const lavaGeo = new PlaneGeometry(3400, 3400, 48, 48);
		const lavaMat = new MeshStandardMaterial({
			color: 14427686,
			emissive: 10033947,
			emissiveIntensity: .85,
			roughness: .35,
			metalness: .2,
			side: 2
		});
		waterMesh = new Mesh(lavaGeo, lavaMat);
		waterMesh.rotation.x = -Math.PI / 2;
		waterMesh.position.y = -10;
		decorations.add(waterMesh);
		for (let r = 0; r < 6; r++) {
			const ribT = (.72 + r * .018) % 1;
			const ribPt = curve.getPointAt(ribT);
			const ribTan = curve.getTangentAt(ribT).normalize();
			const ribRotY = Math.atan2(ribTan.x, ribTan.z);
			const ribGroup = new Group();
			ribGroup.position.set(ribPt.x, ribPt.y, ribPt.z);
			ribGroup.rotation.y = ribRotY;
			const boneMat = new MeshStandardMaterial({
				color: 16707722,
				roughness: .7
			});
			const archRib = new Mesh(new TorusGeometry(19.9, .75, 8, 20, Math.PI), boneMat);
			archRib.position.y = .5;
			ribGroup.add(archRib);
			decorations.add(ribGroup);
		}
		for (let i = 0; i < 36; i++) {
			const t = i / 36 % 1;
			const pt = curve.getPointAt(t);
			const tangent = curve.getTangentAt(t).normalize();
			const right = new Vector3().crossVectors(tangent, upVec).normalize();
			const dist = (i % 2 === 0 ? 1 : -1) * (29 + Math.random() * 20);
			const pPos = pt.clone().add(right.multiplyScalar(dist));
			pPos.y = pt.y;
			const colHeight = 5 + Math.random() * 10;
			if (isTooCloseToTrack(pPos, 17, pPos.y, pPos.y + colHeight + 3)) continue;
			const pGroup = new Group();
			pGroup.position.copy(pPos);
			if (i % 3 === 0) {
				const col = new Mesh(new CylinderGeometry(1.4, 1.6, colHeight, 6), new MeshStandardMaterial({
					color: 1579035,
					roughness: .9
				}));
				col.position.y = colHeight * .5;
				pGroup.add(col);
				const cap = new Mesh(new CylinderGeometry(1.2, 1.4, .4, 6), new MeshStandardMaterial({
					color: 16347926,
					emissive: 15357964,
					emissiveIntensity: .9
				}));
				cap.position.y = colHeight;
				pGroup.add(cap);
			} else if (i % 3 === 1) {
				const crystalMat = new MeshStandardMaterial({
					color: 16347926,
					emissive: 14251782,
					emissiveIntensity: .8,
					roughness: .2,
					metalness: .5
				});
				const cMesh = new Mesh(new OctahedronGeometry(1.4, 0), crystalMat);
				cMesh.scale.set(.7, 2.4, .7);
				cMesh.position.y = 1.6;
				pGroup.add(cMesh);
			} else {
				const rock = new Mesh(new DodecahedronGeometry(2.2, 1), new MeshStandardMaterial({
					color: 2565930,
					roughness: .95
				}));
				rock.position.y = 1.6;
				rock.scale.set(1.4, .9, 1.2);
				pGroup.add(rock);
			}
			decorations.add(pGroup);
		}
	} else if (trackDef.theme === "sky") {
		const cloudSeaGeo = new PlaneGeometry(3800, 3800, 48, 48);
		const cloudSeaMat = new MeshStandardMaterial({
			color: 15793652,
			roughness: .9,
			metalness: .05,
			transparent: true,
			opacity: .88,
			side: 2
		});
		waterMesh = new Mesh(cloudSeaGeo, cloudSeaMat);
		waterMesh.rotation.x = -Math.PI / 2;
		waterMesh.position.y = -6;
		decorations.add(waterMesh);
		for (let i = 0; i < 36; i++) {
			const t = i / 40 % 1;
			const pt = curve.getPointAt(t);
			const tangent = curve.getTangentAt(t).normalize();
			const right = new Vector3().crossVectors(tangent, upVec).normalize();
			const dist = (i % 2 === 0 ? 1 : -1) * (25 + Math.random() * 24);
			const pPos = pt.clone().add(right.multiplyScalar(dist));
			pPos.y = pt.y - 12;
			const towerHeight = 35 + Math.random() * 30;
			if (isTooCloseToTrack(pPos, 19, pPos.y, pPos.y + towerHeight + 6)) continue;
			const pGroup = new Group();
			pGroup.position.copy(pPos);
			const tower = new Mesh(new CylinderGeometry(2.4, 3.8, towerHeight, 8), new MeshStandardMaterial({
				color: 16317180,
				roughness: .25,
				metalness: .8
			}));
			tower.position.y = towerHeight * .5;
			pGroup.add(tower);
			const ring = new Mesh(new TorusGeometry(3.6, .25, 8, 16), new MeshStandardMaterial({
				color: 3718648,
				emissive: 165063,
				emissiveIntensity: 1.1
			}));
			ring.rotation.x = Math.PI / 2;
			ring.position.y = towerHeight * .75;
			pGroup.add(ring);
			decorations.add(pGroup);
		}
	}
	const grandstandGroup = new Group();
	const gsT = .98;
	const gsPt = curve.getPointAt(gsT);
	const gsTangent = curve.getTangentAt(gsT).normalize();
	const gsRight = new Vector3().crossVectors(gsTangent, upVec).normalize();
	const gsRotY = Math.atan2(gsTangent.x, gsTangent.z);
	grandstandGroup.position.copy(gsPt).add(gsRight.clone().multiplyScalar(18.9));
	grandstandGroup.position.y = gsPt.y;
	grandstandGroup.rotation.y = gsRotY + Math.PI;
	const standMat = new MeshStandardMaterial({
		color: 3359061,
		roughness: .6
	});
	const roofMat = new MeshStandardMaterial({
		color: 15680580,
		roughness: .4
	});
	const seatColors = [
		3900150,
		1096065,
		16096779,
		15485081
	];
	for (let tier = 0; tier < 3; tier++) {
		const tierMesh = new Mesh(new BoxGeometry(22, .8, 2.2), standMat);
		tierMesh.position.set(0, .4 + tier * .9, -tier * 1.8);
		grandstandGroup.add(tierMesh);
		for (let s = -4; s <= 4; s++) {
			const spectator = new Group();
			spectator.position.set(s * 2.2 + (Math.random() - .5) * .4, .8 + tier * .9, -tier * 1.8);
			const bodyMat = new MeshStandardMaterial({ color: seatColors[Math.abs(s + tier) % seatColors.length] });
			const body = new Mesh(new CylinderGeometry(.35, .4, .8, 8), bodyMat);
			body.position.y = .4;
			spectator.add(body);
			const head = new Mesh(new SphereGeometry(.3, 8, 8), new MeshStandardMaterial({ color: 16638023 }));
			head.position.y = .95;
			spectator.add(head);
			const hat = new Mesh(new CylinderGeometry(.2, .35, .25, 8), new MeshStandardMaterial({ color: 165063 }));
			hat.position.y = 1.15;
			spectator.add(hat);
			grandstandGroup.add(spectator);
		}
	}
	const roof = new Mesh(new BoxGeometry(24, .3, 7.5), roofMat);
	roof.position.set(0, 4.8, -1.8);
	roof.rotation.x = .15;
	grandstandGroup.add(roof);
	[-11, 11].forEach((x) => {
		const post = new Mesh(new CylinderGeometry(.2, .2, 4.8, 6), new MeshStandardMaterial({
			color: 9741240,
			metalness: .8
		}));
		post.position.set(x, 2.4, 1.2);
		grandstandGroup.add(post);
	});
	for (let f = -3; f <= 3; f++) {
		const flagPole = new Mesh(new CylinderGeometry(.08, .08, 6.5, 6), new MeshStandardMaterial({
			color: 14870768,
			metalness: .7
		}));
		flagPole.position.set(f * 3.8, 3.25, 2.4);
		grandstandGroup.add(flagPole);
		const flagMesh = new Mesh(new ConeGeometry(.7, 1.4, 3), new MeshStandardMaterial({
			color: f % 2 === 0 ? 16436245 : 15680580,
			side: 2
		}));
		flagMesh.position.set(f * 3.8 + .6, 6, 2.4);
		flagMesh.rotation.z = -Math.PI / 2;
		grandstandGroup.add(flagMesh);
	}
	decorations.add(grandstandGroup);
	const leftChevronTex = createChevronTexture("left");
	const rightChevronTex = createChevronTexture("right");
	const chevronGeo = new PlaneGeometry(3.6, 1.8);
	const chevronSignMatL = new MeshStandardMaterial({
		map: leftChevronTex,
		roughness: .3
	});
	const chevronSignMatR = new MeshStandardMaterial({
		map: rightChevronTex,
		roughness: .3
	});
	const sampleCount = 60;
	for (let s = 0; s < sampleCount; s++) {
		const tA = s / sampleCount;
		const tB = (s + 2) % sampleCount / sampleCount;
		const ptA = curve.getPointAt(tA);
		const tanA = curve.getTangentAt(tA).normalize();
		const tanB = curve.getTangentAt(tB).normalize();
		const crossY = tanA.x * tanB.z - tanA.z * tanB.x;
		if (Math.abs(crossY) > .05) {
			const rightA = new Vector3().crossVectors(tanA, upVec).normalize();
			const rotY = Math.atan2(tanA.x, tanA.z);
			const isCurvingRight = crossY > 0;
			const outsideSide = isCurvingRight ? -1 : 1;
			const chevronPos = ptA.clone().add(rightA.clone().multiplyScalar(outsideSide * 16.9));
			chevronPos.y = ptA.y + 1.6;
			const signPost = new Group();
			signPost.position.copy(chevronPos);
			signPost.rotation.y = rotY + (outsideSide < 0 ? -.2 : .2);
			const post = new Mesh(new CylinderGeometry(.1, .1, 2.6, 6), new MeshStandardMaterial({ color: 6583435 }));
			post.position.y = -.4;
			signPost.add(post);
			const board = new Mesh(chevronGeo, isCurvingRight ? chevronSignMatR : chevronSignMatL);
			board.position.y = .6;
			signPost.add(board);
			decorations.add(signPost);
			const insideSide = -outsideSide;
			const skidGeo = new PlaneGeometry(.75, 4.2);
			const skidMat = new MeshBasicMaterial({
				color: 592139,
				transparent: true,
				opacity: .38,
				depthWrite: false
			});
			const skid = new Mesh(skidGeo, skidMat);
			skid.rotation.x = -Math.PI / 2;
			skid.rotation.z = Math.PI / 2;
			const skidPos = ptA.clone().add(rightA.clone().multiplyScalar(insideSide * (halfW * .42)));
			skid.position.set(skidPos.x, ptA.y + .05, skidPos.z);
			decorations.add(skid);
			const distBoardGeo = new PlaneGeometry(2.4, 1.3);
			const distTex100 = createDistanceSignTexture("100m", 2);
			const distTex50 = createDistanceSignTexture("50m", 1);
			[{
				dtFrac: -.032,
				tex: distTex100
			}, {
				dtFrac: -.016,
				tex: distTex50
			}].forEach((db) => {
				const dbT = ((tA + db.dtFrac) % 1 + 1) % 1;
				const dbPt = curve.getPointAt(dbT);
				const dbTan = curve.getTangentAt(dbT).normalize();
				const dbRight = new Vector3().crossVectors(dbTan, upVec).normalize();
				const dbRotY = Math.atan2(dbTan.x, dbTan.z);
				const dbGroup = new Group();
				const dbPos = dbPt.clone().add(dbRight.clone().multiplyScalar(outsideSide * 16.9));
				dbGroup.position.set(dbPos.x, dbPt.y + 1.2, dbPos.z);
				dbGroup.rotation.y = dbRotY;
				const dbMesh = new Mesh(distBoardGeo, new MeshStandardMaterial({
					map: db.tex,
					roughness: .3
				}));
				dbGroup.add(dbMesh);
				const dbPost = new Mesh(new CylinderGeometry(.08, .08, 2.2, 6), new MeshStandardMaterial({ color: 4674921 }));
				dbPost.position.y = -.6;
				dbGroup.add(dbPost);
				decorations.add(dbGroup);
			});
		}
	}
	if (trackDef.theme === "beach") [{
		pos: new Vector3(80, 62, 100),
		colorA: 15680580,
		colorB: 16436245
	}, {
		pos: new Vector3(-110, 75, -80),
		colorA: 165063,
		colorB: 16317180
	}].forEach((balloon) => {
		const bGroup = new Group();
		bGroup.position.copy(balloon.pos);
		const envelope = new Mesh(new SphereGeometry(9, 16, 16), new MeshStandardMaterial({
			color: balloon.colorA,
			roughness: .4
		}));
		envelope.scale.set(1, 1.35, 1);
		bGroup.add(envelope);
		const stripe = new Mesh(new TorusGeometry(8.9, .6, 8, 24), new MeshStandardMaterial({ color: balloon.colorB }));
		stripe.rotation.x = Math.PI / 2;
		bGroup.add(stripe);
		const basket = new Mesh(new BoxGeometry(2.8, 2.2, 2.8), new MeshStandardMaterial({
			color: 7877903,
			roughness: .9
		}));
		basket.position.y = -15;
		bGroup.add(basket);
		const burner = new Mesh(new SphereGeometry(.8, 8, 8), new MeshStandardMaterial({
			color: 16347926,
			emissive: 15357964,
			emissiveIntensity: 1
		}));
		burner.position.y = -12.5;
		bGroup.add(burner);
		decorations.add(bGroup);
	});
	else if (trackDef.theme === "spooky") {
		const moonGroup = new Group();
		moonGroup.position.set(-60, 80, -220);
		const moon = new Mesh(new SphereGeometry(18, 24, 24), new MeshStandardMaterial({
			color: 16710083,
			emissive: 16436245,
			emissiveIntensity: .75,
			roughness: .8
		}));
		moonGroup.add(moon);
		for (let c = 0; c < 5; c++) {
			const crater = new Mesh(new SphereGeometry(2.5 - c * .3, 8, 8), new MeshStandardMaterial({
				color: 13273604,
				roughness: .9
			}));
			const angle = c * 1.3;
			crater.position.set(Math.cos(angle) * 11, Math.sin(angle) * 8, 14);
			moonGroup.add(crater);
		}
		decorations.add(moonGroup);
	} else if (trackDef.theme === "cyber") {
		const blimpGroup = new Group();
		blimpGroup.position.set(40, 70, 60);
		blimpGroup.rotation.y = .45;
		const hull = new Mesh(new SphereGeometry(14, 20, 20), new MeshStandardMaterial({
			color: 988970,
			roughness: .3,
			metalness: .8
		}));
		hull.scale.set(1, .75, 2.8);
		blimpGroup.add(hull);
		const blimpSign = new Mesh(new BoxGeometry(.4, 5, 28), new MeshStandardMaterial({
			color: 440020,
			emissive: 561586,
			emissiveIntensity: 1
		}));
		blimpSign.position.set(14.2, 0, 0);
		blimpGroup.add(blimpSign);
		decorations.add(blimpGroup);
	} else if (trackDef.theme === "ice") {
		const peakGeo = new ConeGeometry(95, 180, 8);
		const rockMat = new MeshStandardMaterial({
			color: 3359061,
			roughness: .9
		});
		const snowCapGeo = new ConeGeometry(42, 75, 8);
		const snowCapMat = new MeshStandardMaterial({
			color: 16317180,
			roughness: .4
		});
		for (let m = 0; m < 10; m++) {
			const angle = m / 10 * Math.PI * 2;
			const dist = 680 + m % 2 * 90;
			const mGroup = new Group();
			mGroup.position.set(Math.cos(angle) * dist, -5, Math.sin(angle) * dist);
			const mountain = new Mesh(peakGeo, rockMat);
			mountain.position.y = 90;
			mGroup.add(mountain);
			const snowCap = new Mesh(snowCapGeo, snowCapMat);
			snowCap.position.y = 145;
			mGroup.add(snowCap);
			decorations.add(mGroup);
		}
	} else if (trackDef.theme === "volcano") {
		const vGroup = new Group();
		vGroup.position.set(250, -40, 150);
		const volcanoCone = new Mesh(new CylinderGeometry(90, 230, 240, 32), new MeshStandardMaterial({
			color: 1841431,
			roughness: .95
		}));
		volcanoCone.position.y = 110;
		vGroup.add(volcanoCone);
		const craterMagma = new Mesh(new CylinderGeometry(85, 85, 6, 32), new MeshStandardMaterial({
			color: 15680580,
			emissive: 14251782,
			emissiveIntensity: 1.2
		}));
		craterMagma.position.y = 220;
		vGroup.add(craterMagma);
		decorations.add(vGroup);
	} else if (trackDef.theme === "sky") {
		const sGroup = new Group();
		sGroup.position.set(240, 120, -360);
		const hub = new Mesh(new SphereGeometry(22, 16, 16), new MeshStandardMaterial({
			color: 16317180,
			roughness: .2,
			metalness: .85
		}));
		sGroup.add(hub);
		const solarRing = new Mesh(new TorusGeometry(40, 1.8, 8, 32), new MeshStandardMaterial({
			color: 165063,
			emissive: 223649,
			emissiveIntensity: .9
		}));
		solarRing.rotation.x = Math.PI / 2.3;
		sGroup.add(solarRing);
		decorations.add(sGroup);
	}
	const railSegments = 160;
	for (let i = 0; i < railSegments; i += 2) {
		const t = i / railSegments;
		const pt = curve.getPointAt(t);
		const tangent = curve.getTangentAt(t).normalize();
		const right = new Vector3().crossVectors(tangent, upVec).normalize();
		const rotY = Math.atan2(tangent.x, tangent.z);
		if (pt.y > 3 || t > .15 && t < .35 || t > .65 && t < .85) {
			const railGeo = new BoxGeometry(.35, 1.1, 4.4);
			const railColor = trackDef.theme === "cyber" ? 440020 : trackDef.theme === "ice" ? 3718648 : trackDef.theme === "volcano" ? 16347926 : trackDef.theme === "sky" ? 16436245 : 9741240;
			const railMat = new MeshStandardMaterial({
				color: railColor,
				metalness: .6,
				roughness: .3
			});
			const leftWall = new Mesh(railGeo, railMat);
			leftWall.position.copy(pt).add(right.clone().multiplyScalar(-15.4));
			leftWall.position.y += .55;
			leftWall.rotation.y = rotY;
			wallsGroup.add(leftWall);
			const rightWall = new Mesh(railGeo, railMat);
			rightWall.position.copy(pt).add(right.clone().multiplyScalar(14.6));
			rightWall.position.y += .55;
			rightWall.rotation.y = rotY;
			wallsGroup.add(rightWall);
		}
	}
	if (trackDef.theme !== "sky") {
		const poleMat = new MeshLambertMaterial({ color: 6583435 });
		const flagMat = new MeshLambertMaterial({ color: trackDef.curbColorA });
		const rockMat = new MeshLambertMaterial({ color: 5722958 });
		const poleGeo = new CylinderGeometry(.12, .18, 4.5, 6);
		const flagGeo = new BoxGeometry(1.8, 1, .08);
		const rockGeo = new DodecahedronGeometry(.9, 0);
		for (let i = 0; i < 28; i++) {
			const t = (i + .5) / 20;
			const cp = centerlinePoints[Math.floor(t * denseCount) % denseCount];
			const side = i % 2 === 0 ? 1 : -1;
			const base = cp.point.clone().add(cp.right.clone().multiplyScalar(side * 16.5));
			if (isTooCloseToTrack(base, 15, cp.point.y, cp.point.y + 5)) continue;
			if (i % 2 === 0) {
				const pole = new Mesh(poleGeo, poleMat);
				pole.position.copy(base);
				pole.position.y = cp.point.y + 2.2;
				decorations.add(pole);
				const flag = new Mesh(flagGeo, flagMat);
				flag.position.copy(base);
				flag.position.y = cp.point.y + 4;
				flag.position.x += side * .9;
				decorations.add(flag);
			} else {
				const rock = new Mesh(rockGeo, rockMat);
				rock.position.copy(base);
				rock.position.y = cp.point.y + .4;
				rock.rotation.set(Math.random(), Math.random(), Math.random());
				decorations.add(rock);
			}
		}
	}
	new MeshLambertMaterial({ color: 10576391 });
	new MeshLambertMaterial({ color: 16639626 });
	new MeshLambertMaterial({ color: 12248829 });
	new MeshLambertMaterial({ color: 8330525 });
	new MeshLambertMaterial({ color: 537412 });
	for (const sc of shortcutZones) {
		const samples = 14;
		for (let i = 0; i < samples; i++) {
			const t = sc.startT + (sc.endT - sc.startT) * (i / samples);
			const cp = centerlinePoints[Math.floor(t * denseCount) % denseCount];
			const side = sc.side === 0 ? 1 : sc.side;
			const off = halfW + sc.extraWidth * .45;
			const stripPos = cp.point.clone().add(cp.right.clone().multiplyScalar(side * off));
			if (i % 3 === 0) {
				const outerRailPos = cp.point.clone().add(cp.right.clone().multiplyScalar(side * (off + sc.extraWidth * .52)));
				const railPost = new Mesh(new CylinderGeometry(.12, .16, 1.2, 6), new MeshStandardMaterial({
					color: 16436245,
					emissive: 13273604,
					emissiveIntensity: .4
				}));
				railPost.position.set(outerRailPos.x, cp.point.y + .6, outerRailPos.z);
				decorations.add(railPost);
			}
			if (i === Math.floor(samples * .5)) {
				const padGroup = new Group();
				padGroup.position.set(stripPos.x, cp.point.y + .08, stripPos.z);
				padGroup.rotation.y = Math.atan2(cp.tangent.x, cp.tangent.z);
				const padGeo = new PlaneGeometry(2.8, 3.2);
				const padMat = new MeshStandardMaterial({
					color: 15357964,
					emissive: 12730636,
					emissiveIntensity: 1.1,
					roughness: .2
				});
				const padMesh = new Mesh(padGeo, padMat);
				padMesh.rotation.x = -Math.PI / 2;
				padGroup.add(padMesh);
				const scChevronGeo = new ConeGeometry(.8, 1.2, 3);
				scChevronGeo.rotateX(-Math.PI / 2);
				const scChevronMat = new MeshBasicMaterial({ color: 16436245 });
				const scChevron = new Mesh(scChevronGeo, scChevronMat);
				scChevron.position.set(0, .02, 0);
				padGroup.add(scChevron);
				boostPads.push({
					x: stripPos.x,
					y: cp.point.y + .08,
					z: stripPos.z,
					rotY: Math.atan2(cp.tangent.x, cp.tangent.z),
					mesh: padGroup
				});
				decorations.add(padGroup);
				const boxGroup = new Group();
				boxGroup.position.set(stripPos.x, cp.point.y + 1.4, stripPos.z);
				const cube = new Mesh(sharedCubeGeo, sharedCubeMat);
				boxGroup.add(cube);
				const gem = new Mesh(sharedGemGeo, sharedGemMat);
				boxGroup.add(gem);
				itemBoxes.push({
					x: stripPos.x,
					y: cp.point.y + 1.4,
					z: stripPos.z,
					mesh: boxGroup,
					active: true,
					respawnTime: 0
				});
				decorations.add(boxGroup);
			}
		}
	}
	const freezeStatic = (root) => {
		root.traverse((obj) => {
			obj.matrixAutoUpdate = false;
			obj.updateMatrix();
		});
	};
	freezeStatic(decorations);
	freezeStatic(wallsGroup);
	freezeStatic(startArch);
	if (trackMesh) freezeStatic(trackMesh);
	if (curbsGroup) freezeStatic(curbsGroup);
	itemBoxes.forEach((b) => {
		b.mesh.traverse((o) => {
			o.matrixAutoUpdate = true;
		});
	});
	boostPads.forEach((p) => {
		p.mesh?.traverse((o) => {
			o.matrixAutoUpdate = true;
		});
	});
	jumpRamps.forEach((r) => {
		r.mesh?.traverse((o) => {
			o.matrixAutoUpdate = true;
		});
	});
	stuntRings.forEach((sr) => {
		sr.mesh?.traverse((o) => {
			o.matrixAutoUpdate = true;
		});
	});
	hazards.forEach((h) => {
		h.mesh?.traverse((o) => {
			o.matrixAutoUpdate = true;
		});
	});
	if (waterMesh) waterMesh.matrixAutoUpdate = true;
	if (lighthouseBeam) lighthouseBeam.matrixAutoUpdate = true;
	return {
		id: trackDef.id,
		curve,
		trackWidth,
		checkpoints,
		centerlinePoints,
		getTrackInfo,
		getCenterlinePointAt,
		itemBoxes,
		boostPads,
		jumpRamps,
		hazards,
		stuntRings,
		decorations,
		trackMesh,
		curbsMesh: curbsGroup,
		wallsMesh: wallsGroup,
		startArch,
		theme: trackDef.theme,
		waterMesh,
		lighthouseBeam,
		animatedProps
	};
}
var CAR_DEFINITIONS = [
	{
		id: "speedy_turbo",
		name: "Speedy Turbo",
		driverName: "Tommy Rocket",
		driverAvatar: "🚀",
		description: "Sujuv ja välkkiire punane võidusõidukorv. Parim tippkiirus sirgetel!",
		primaryColor: "#ef4444",
		secondaryColor: "#ffffff",
		type: "speed",
		stats: {
			speed: 9,
			accel: 7,
			handling: 6,
			armor: 5
		}
	},
	{
		id: "buster_bull",
		name: "Buster Bull",
		driverName: "Bulldog Bob",
		driverAvatar: "🐂",
		description: "Raske kollane jõumasin. Tõukab vastased teelt ja ei karda kokkupõrkeid!",
		primaryColor: "#eab308",
		secondaryColor: "#1e293b",
		type: "heavy",
		stats: {
			speed: 6,
			accel: 6,
			handling: 5,
			armor: 10
		}
	},
	{
		id: "crazy_doc",
		name: "Crazy Doc",
		driverName: "Doc Wattson",
		driverAvatar: "⚡",
		description: "Hullu teadlase elektriline retroauto. Kiirendab silmapilkselt ja kestab kaua!",
		primaryColor: "#06b6d4",
		secondaryColor: "#a855f7",
		type: "tech",
		stats: {
			speed: 7,
			accel: 9,
			handling: 7,
			armor: 6
		}
	},
	{
		id: "kitten_cruiser",
		name: "Kitten Cruiser",
		driverName: "Mia Purr",
		driverAvatar: "🐱",
		description: "Kassikõrvadega armas roosa rotster. Võtab kurve uskumatult täpselt ja libiseb ideaalselt!",
		primaryColor: "#ec4899",
		secondaryColor: "#fbcfe8",
		type: "agile",
		stats: {
			speed: 7,
			accel: 8,
			handling: 10,
			armor: 4
		}
	},
	{
		id: "banana_bandit",
		name: "Banana Bandit",
		driverName: "Peel Pete",
		driverAvatar: "🍌",
		description: "Lõbus banaanikujuline kollane hot-rod hiiglaslike leegitorudega!",
		primaryColor: "#facc15",
		secondaryColor: "#16a34a",
		type: "wild",
		stats: {
			speed: 8,
			accel: 7,
			handling: 7,
			armor: 6
		}
	},
	{
		id: "police_donut",
		name: "Police Donut",
		driverName: "Officer Sarge",
		driverAvatar: "🚓",
		description: "Vilkuvate sinipunaste tulukestega patrullauto. Rammib korda majja!",
		primaryColor: "#2563eb",
		secondaryColor: "#ffffff",
		type: "cop",
		stats: {
			speed: 7,
			accel: 7,
			handling: 8,
			armor: 8
		}
	}
];
/**
* Creates a detailed, high-poly 3D cartoon arcade car with unique archetype bodies,
* spoilers, animated wheels with brake calipers, glowing headlights, and driver.
*/
function createToonCarMesh(carDef, colorOverride, customization) {
	const root = new Group();
	const bodyGroup = new Group();
	root.add(bodyGroup);
	const mainColor = colorOverride || carDef.primaryColor;
	let bodyRoughness = .25;
	let bodyMetalness = .15;
	if (customization?.finish === "metallic") {
		bodyRoughness = .18;
		bodyMetalness = .8;
	} else if (customization?.finish === "matte") {
		bodyRoughness = .85;
		bodyMetalness = .05;
	}
	const bodyMaterial = new MeshPhysicalMaterial({
		color: new Color(mainColor),
		roughness: bodyRoughness,
		metalness: bodyMetalness,
		clearcoat: .7,
		clearcoatRoughness: .12
	});
	const secondaryMaterial = new MeshStandardMaterial({
		color: new Color(carDef.secondaryColor),
		roughness: .28,
		metalness: .2
	});
	const darkTrimMaterial = new MeshStandardMaterial({
		color: 1579035,
		roughness: .85
	});
	const carbonMaterial = new MeshStandardMaterial({
		color: 1841431,
		roughness: .4,
		metalness: .3
	});
	const blackRubber = new MeshStandardMaterial({
		color: 2565930,
		roughness: .8
	});
	const brakeRotorMat = new MeshStandardMaterial({
		color: 13948120,
		metalness: .9,
		roughness: .18
	});
	const brakeCaliperMat = new MeshStandardMaterial({
		color: 15680580,
		roughness: .3
	});
	let rimColor = 16053493;
	let rimMetalness = .75;
	let rimRoughness = .2;
	let rimEmissive = void 0;
	if (customization?.rimStyle === "gold") {
		rimColor = 16498468;
		rimMetalness = .92;
		rimRoughness = .12;
	} else if (customization?.rimStyle === "cyber") {
		rimColor = 440020;
		rimMetalness = .6;
		rimRoughness = .2;
		rimEmissive = 440020;
	} else if (customization?.rimStyle === "monster") {
		rimColor = 1579035;
		rimMetalness = .3;
		rimRoughness = .75;
	}
	const rimMaterial = new MeshStandardMaterial({
		color: rimColor,
		metalness: rimMetalness,
		roughness: rimRoughness,
		...rimEmissive ? {
			emissive: rimEmissive,
			emissiveIntensity: .6
		} : {}
	});
	const glassMaterial = new MeshPhysicalMaterial({
		color: 13630206,
		transmission: .78,
		opacity: .92,
		transparent: true,
		roughness: .05,
		ior: 1.48
	});
	const chromeMaterial = new MeshStandardMaterial({
		color: 16317180,
		metalness: .95,
		roughness: .08
	});
	if (customization?.underglow && customization.underglow !== "none") {
		const ugColor = new Color(customization.underglow);
		const glowGeo = new PlaneGeometry(2.1, 2.9);
		const glowMat = new MeshBasicMaterial({
			color: ugColor,
			transparent: true,
			opacity: .65,
			side: 2,
			depthWrite: false
		});
		const glowPlane = new Mesh(glowGeo, glowMat);
		glowPlane.rotation.x = Math.PI / 2;
		glowPlane.position.y = .08;
		root.add(glowPlane);
	}
	const isHeavy = carDef.type === "heavy";
	const chassisWidth = isHeavy ? 1.85 : 1.65;
	const chassisHeight = isHeavy ? .55 : .46;
	const chassisLength = isHeavy ? 3 : 2.8;
	const chassisGeo = new BoxGeometry(chassisWidth, chassisHeight, chassisLength);
	const chassis = new Mesh(chassisGeo, bodyMaterial);
	chassis.position.y = isHeavy ? .62 : .48;
	chassis.castShadow = true;
	chassis.receiveShadow = true;
	bodyGroup.add(chassis);
	const stripeGeo = new PlaneGeometry(.32, chassisLength - .1);
	const stripeMesh = new Mesh(stripeGeo, secondaryMaterial);
	stripeMesh.rotation.x = -Math.PI / 2;
	stripeMesh.position.set(0, (isHeavy ? .62 : .48) + chassisHeight * .5 + .01, 0);
	bodyGroup.add(stripeMesh);
	const hoodGeo = new BoxGeometry(chassisWidth - .08, .26, .95);
	const hood = new Mesh(hoodGeo, bodyMaterial);
	hood.position.set(0, isHeavy ? .72 : .58, .95);
	hood.rotation.x = -.15;
	hood.castShadow = true;
	bodyGroup.add(hood);
	const cabinWidth = isHeavy ? 1.42 : 1.24;
	const cabinHeight = isHeavy ? .68 : .58;
	const cabinGeo = new BoxGeometry(cabinWidth, cabinHeight, isHeavy ? 1.35 : 1.45);
	const cabin = new Mesh(cabinGeo, bodyMaterial);
	cabin.position.set(0, isHeavy ? 1.08 : .88, isHeavy ? .05 : -.15);
	cabin.castShadow = true;
	bodyGroup.add(cabin);
	const windshieldGeo = new BoxGeometry(cabinWidth + .02, cabinHeight * .88, .55);
	const windshield = new Mesh(windshieldGeo, glassMaterial);
	windshield.position.set(0, isHeavy ? 1.05 : .86, isHeavy ? .65 : .46);
	windshield.rotation.x = -Math.PI * .14;
	bodyGroup.add(windshield);
	const rearWinGeo = new BoxGeometry(cabinWidth + .02, cabinHeight * .82, .4);
	const rearWin = new Mesh(rearWinGeo, glassMaterial);
	rearWin.position.set(0, isHeavy ? 1.05 : .88, isHeavy ? -.55 : -.78);
	rearWin.rotation.x = Math.PI * .12;
	bodyGroup.add(rearWin);
	[-cabinWidth * .5 - .15, cabinWidth * .5 + .15].forEach((xPos, i) => {
		const mirror = new Mesh(new BoxGeometry(.18, .12, .16), bodyMaterial);
		mirror.position.set(xPos, isHeavy ? .98 : .82, isHeavy ? .4 : .35);
		mirror.rotation.y = (i === 0 ? 1 : -1) * .15;
		bodyGroup.add(mirror);
	});
	const frontBumper = new Mesh(new BoxGeometry(chassisWidth + .1, .22, .25), chromeMaterial);
	frontBumper.position.set(0, isHeavy ? .44 : .32, 1.45);
	frontBumper.castShadow = true;
	bodyGroup.add(frontBumper);
	const rearBumper = new Mesh(new BoxGeometry(chassisWidth + .1, .22, .25), chromeMaterial);
	rearBumper.position.set(0, isHeavy ? .44 : .32, -1.45);
	rearBumper.castShadow = true;
	bodyGroup.add(rearBumper);
	const grille = new Mesh(new BoxGeometry(chassisWidth * .7, .24, .15), darkTrimMaterial);
	grille.position.set(0, isHeavy ? .54 : .42, 1.43);
	bodyGroup.add(grille);
	let sirenLight;
	let sirenRed;
	let sirenBlue;
	if (carDef.type === "speed") {
		const splitter = new Mesh(new BoxGeometry(1.85, .05, .45), carbonMaterial);
		splitter.position.set(0, .2, 1.55);
		bodyGroup.add(splitter);
		[-.88, .88].forEach((xP) => {
			const pod = new Mesh(new BoxGeometry(.18, .26, .9), carbonMaterial);
			pod.position.set(xP, .46, .1);
			bodyGroup.add(pod);
		});
		const wingUpper = new Mesh(new BoxGeometry(1.7, .06, .45), secondaryMaterial);
		wingUpper.position.set(0, 1.25, -1.3);
		wingUpper.castShadow = true;
		bodyGroup.add(wingUpper);
		[-.6, .6].forEach((xP) => {
			const stand = new Mesh(new CylinderGeometry(.025, .035, .55), chromeMaterial);
			stand.position.set(xP, .98, -1.3);
			bodyGroup.add(stand);
		});
		const wheelGroup = new Mesh(new TorusGeometry(.12, .025, 8, 16), darkTrimMaterial);
		wheelGroup.position.set(0, .82, .2);
		wheelGroup.rotation.x = -Math.PI * .22;
		bodyGroup.add(wheelGroup);
	} else if (carDef.type === "heavy") {
		const blowerBase = new Mesh(new BoxGeometry(.55, .35, .65), chromeMaterial);
		blowerBase.position.set(0, .92, .75);
		blowerBase.castShadow = true;
		bodyGroup.add(blowerBase);
		const scoop = new Mesh(new BoxGeometry(.48, .2, .35), darkTrimMaterial);
		scoop.position.set(0, 1.08, .85);
		bodyGroup.add(scoop);
		[
			-.12,
			0,
			.12
		].forEach((xP) => {
			const butterfly = new Mesh(new CylinderGeometry(.045, .045, .05, 8), brakeCaliperMat);
			butterfly.rotation.x = Math.PI / 2;
			butterfly.position.set(xP, 1.08, .98);
			bodyGroup.add(butterfly);
		});
		[-.65, .65].forEach((xP, i) => {
			const horn = new Mesh(new ConeGeometry(.12, .65, 8), new MeshStandardMaterial({
				color: 16498468,
				metalness: .8,
				roughness: .2
			}));
			horn.position.set(xP, .72, 1.48);
			horn.rotation.z = (i === 0 ? 1 : -1) * .65;
			horn.rotation.x = .45;
			bodyGroup.add(horn);
		});
		[-.72, .72].forEach((xP) => {
			const stack = new Mesh(new CylinderGeometry(.08, .09, 1.4, 12), chromeMaterial);
			stack.position.set(xP, 1.45, -.65);
			bodyGroup.add(stack);
			const cap = new Mesh(new CylinderGeometry(.09, .09, .2, 12), chromeMaterial);
			cap.position.set(xP, 2.15, -.72);
			cap.rotation.x = -.5;
			bodyGroup.add(cap);
		});
	} else if (carDef.type === "tech") {
		const reactorBox = new Mesh(new BoxGeometry(1.1, .35, .7), new MeshStandardMaterial({
			color: 988970,
			metalness: .8,
			roughness: .3
		}));
		reactorBox.position.set(0, .85, -1);
		bodyGroup.add(reactorBox);
		const plasmaTube = new Mesh(new CylinderGeometry(.15, .15, .8, 16), new MeshStandardMaterial({
			color: 440020,
			emissive: 440020,
			emissiveIntensity: 1.2
		}));
		plasmaTube.rotation.z = Math.PI / 2;
		plasmaTube.position.set(0, .98, -1);
		bodyGroup.add(plasmaTube);
		const antenna = new Mesh(new CylinderGeometry(.03, .04, 1.1, 8), chromeMaterial);
		antenna.position.set(0, 1.6, -.4);
		bodyGroup.add(antenna);
		const sparkSphere = new Mesh(new SphereGeometry(.14, 12, 12), new MeshStandardMaterial({
			color: 11032055,
			emissive: 12616956,
			emissiveIntensity: 1.5
		}));
		sparkSphere.position.set(0, 2.15, -.4);
		bodyGroup.add(sparkSphere);
	} else if (carDef.type === "agile") {
		[-.42, .42].forEach((xP, i) => {
			const outerEar = new Mesh(new ConeGeometry(.24, .44, 4), bodyMaterial);
			outerEar.position.set(xP, 1.35, -.1);
			outerEar.rotation.z = (i === 0 ? -1 : 1) * .28;
			bodyGroup.add(outerEar);
			const innerEar = new Mesh(new ConeGeometry(.14, .32, 4), secondaryMaterial);
			innerEar.position.set(xP, 1.35, -.07);
			innerEar.rotation.z = (i === 0 ? -1 : 1) * .28;
			bodyGroup.add(innerEar);
		});
		const tailBase = new Mesh(new CylinderGeometry(.04, .05, .7, 8), secondaryMaterial);
		tailBase.position.set(0, .95, -1.2);
		tailBase.rotation.x = -.6;
		bodyGroup.add(tailBase);
		const bell = new Mesh(new SphereGeometry(.1, 10, 10), new MeshStandardMaterial({
			color: 16436245,
			metalness: .9,
			roughness: .1
		}));
		bell.position.set(0, 1.25, -1.45);
		bodyGroup.add(bell);
	} else if (carDef.type === "wild") {
		const engineBlock = new Mesh(new BoxGeometry(.65, .42, .8), chromeMaterial);
		engineBlock.position.set(0, .88, .65);
		bodyGroup.add(engineBlock);
		for (let r = 0; r < 4; r++) [-.18, .18].forEach((xP) => {
			const stack = new Mesh(new CylinderGeometry(.05, .035, .28, 8), chromeMaterial);
			stack.position.set(xP, 1.15, .4 + r * .18);
			bodyGroup.add(stack);
		});
		[-.88, .88].forEach((xP, i) => {
			for (let p = 0; p < 4; p++) {
				const pipe = new Mesh(new CylinderGeometry(.04, .04, .35, 8), chromeMaterial);
				pipe.position.set(xP, .42, .4 + p * .16);
				pipe.rotation.z = (i === 0 ? 1 : -1) * .55;
				pipe.rotation.y = .2;
				bodyGroup.add(pipe);
			}
		});
	} else if (carDef.type === "cop") {
		const pushBar = new Mesh(new BoxGeometry(1.2, .45, .15), darkTrimMaterial);
		pushBar.position.set(0, .42, 1.58);
		bodyGroup.add(pushBar);
		const lightBarFrame = new Mesh(new BoxGeometry(.95, .12, .25), chromeMaterial);
		lightBarFrame.position.set(0, 1.24, -.15);
		bodyGroup.add(lightBarFrame);
		sirenBlue = new Mesh(new SphereGeometry(.14, 12, 12), new MeshStandardMaterial({
			color: 3900150,
			emissive: 2450411,
			emissiveIntensity: 1.2
		}));
		sirenBlue.position.set(-.32, 1.32, -.15);
		bodyGroup.add(sirenBlue);
		sirenRed = new Mesh(new SphereGeometry(.14, 12, 12), new MeshStandardMaterial({
			color: 15680580,
			emissive: 14427686,
			emissiveIntensity: 1.4
		}));
		sirenRed.position.set(.32, 1.32, -.15);
		bodyGroup.add(sirenRed);
	}
	const lightGeo = new SphereGeometry(.22, 16, 16);
	const lightMat = new MeshStandardMaterial({
		color: 16707722,
		emissive: 16707722,
		emissiveIntensity: .95,
		roughness: .1
	});
	const lightY = isHeavy ? .65 : .52;
	const lightZ = isHeavy ? 1.48 : 1.38;
	const lightSpacing = chassisWidth * .5 - .25;
	[-lightSpacing, lightSpacing].forEach((xPos) => {
		const eye = new Mesh(lightGeo, lightMat);
		eye.position.set(xPos, lightY, lightZ);
		eye.scale.set(1, 1, .7);
		bodyGroup.add(eye);
		const pupil = new Mesh(new SphereGeometry(.08, 12, 12), new MeshBasicMaterial({ color: 592139 }));
		pupil.position.set(xPos, lightY, lightZ + .14);
		bodyGroup.add(pupil);
		const beamGeo = new ConeGeometry(.65, 4.2, 12);
		const beamMat = new MeshBasicMaterial({
			color: 16710083,
			transparent: true,
			opacity: .18,
			depthWrite: false
		});
		const beam = new Mesh(beamGeo, beamMat);
		beam.position.set(xPos, lightY, lightZ + 2.1);
		beam.rotation.x = Math.PI / 2;
		bodyGroup.add(beam);
	});
	const tailMat = new MeshStandardMaterial({
		color: 15680580,
		emissive: 14427686,
		emissiveIntensity: .95
	});
	[-lightSpacing, lightSpacing].forEach((xPos) => {
		const tailLight = new Mesh(new BoxGeometry(.38, .12, .12), tailMat);
		tailLight.position.set(xPos, lightY, -chassisLength * .5 - .02);
		bodyGroup.add(tailLight);
	});
	const driverHead = new Group();
	driverHead.position.set(0, isHeavy ? 1.15 : .98, isHeavy ? .05 : -.08);
	const headMesh = new Mesh(new SphereGeometry(.26, 16, 16), new MeshStandardMaterial({
		color: 16628340,
		roughness: .55
	}));
	driverHead.add(headMesh);
	const helmetMesh = new Mesh(new SphereGeometry(.28, 16, 16, 0, Math.PI * 2, 0, Math.PI * .55), secondaryMaterial);
	helmetMesh.position.y = .05;
	driverHead.add(helmetMesh);
	[-.1, .1].forEach((xP) => {
		const goggle = new Mesh(new TorusGeometry(.09, .03, 8, 16), chromeMaterial);
		goggle.position.set(xP, .06, .23);
		driverHead.add(goggle);
		const lens = new Mesh(new CircleGeometry(.08, 12), new MeshStandardMaterial({
			color: 3718648,
			roughness: .1,
			metalness: .8
		}));
		lens.position.set(xP, .06, .24);
		driverHead.add(lens);
	});
	bodyGroup.add(driverHead);
	const wheelRadius = isHeavy ? .46 : .38;
	const wheelWidth = isHeavy ? .38 : .32;
	const wheelGeo = new CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 22);
	wheelGeo.rotateZ(Math.PI / 2);
	const hubGeo = new CylinderGeometry(wheelRadius * .56, wheelRadius * .56, wheelWidth + .03, 16);
	hubGeo.rotateZ(Math.PI / 2);
	const brakeRotorGeo = new CylinderGeometry(wheelRadius * .44, wheelRadius * .44, .04, 16);
	brakeRotorGeo.rotateZ(Math.PI / 2);
	const frontWheels = [];
	const allWheels = [];
	const xWheelOffset = chassisWidth * .5 + wheelWidth * .5 - .02;
	[
		{
			x: -xWheelOffset,
			y: wheelRadius,
			z: .88,
			isFront: true
		},
		{
			x: xWheelOffset,
			y: wheelRadius,
			z: .88,
			isFront: true
		},
		{
			x: -xWheelOffset,
			y: wheelRadius,
			z: -.88,
			isFront: false
		},
		{
			x: xWheelOffset,
			y: wheelRadius,
			z: -.88,
			isFront: false
		}
	].forEach((pos) => {
		const tire = new Mesh(wheelGeo, blackRubber);
		tire.castShadow = true;
		const rim = new Mesh(hubGeo, rimMaterial);
		tire.add(rim);
		for (let s = 0; s < 5; s++) {
			const spoke = new Mesh(new BoxGeometry(wheelWidth + .04, wheelRadius * .5, .06), rimMaterial);
			spoke.rotation.x = s / 5 * Math.PI * 2;
			tire.add(spoke);
		}
		const rotor = new Mesh(brakeRotorGeo, brakeRotorMat);
		rotor.position.x = pos.x > 0 ? -wheelWidth * .3 : wheelWidth * .3;
		tire.add(rotor);
		const caliper = new Mesh(new BoxGeometry(.08, .14, .12), brakeCaliperMat);
		caliper.position.set(pos.x > 0 ? -wheelWidth * .3 : wheelWidth * .3, wheelRadius * .28, 0);
		tire.add(caliper);
		if (pos.isFront) {
			const steerPivot = new Group();
			steerPivot.position.set(pos.x, pos.y, pos.z);
			steerPivot.add(tire);
			root.add(steerPivot);
			frontWheels.push(steerPivot);
		} else {
			tire.position.set(pos.x, pos.y, pos.z);
			root.add(tire);
		}
		allWheels.push(tire);
	});
	const exhaustGeo = new CylinderGeometry(.09, .12, .4, 14);
	exhaustGeo.rotateX(Math.PI / 2);
	const flameCoreGeo = new CylinderGeometry(.04, .07, .25, 8);
	flameCoreGeo.rotateX(Math.PI / 2);
	const flameMat = new MeshBasicMaterial({ color: 16347926 });
	const exY = isHeavy ? .48 : .38;
	const exZ = -chassisLength * .5 - .1;
	const exhaustLeft = new Mesh(exhaustGeo, chromeMaterial);
	exhaustLeft.position.set(-.48, exY, exZ);
	const flameL = new Mesh(flameCoreGeo, flameMat);
	flameL.position.set(0, 0, .06);
	exhaustLeft.add(flameL);
	bodyGroup.add(exhaustLeft);
	const exhaustRight = new Mesh(exhaustGeo, chromeMaterial);
	exhaustRight.position.set(.48, exY, exZ);
	const flameR = new Mesh(flameCoreGeo, flameMat);
	flameR.position.set(0, 0, .06);
	exhaustRight.add(flameR);
	bodyGroup.add(exhaustRight);
	return {
		root,
		bodyMesh: chassis,
		bodyGroup,
		frontWheels,
		allWheels,
		driverHead,
		exhaustLeft,
		exhaustRight,
		tailLightMat: tailMat,
		sirenLight,
		sirenRed,
		sirenBlue
	};
}
var POWER_UPS = {
	rocket: {
		type: "rocket",
		name: "Punane Rakett",
		icon: "🚀",
		description: "Jälitav rakett! Tulistab ettepoole ja võtab sihikule lähima vastase ees.",
		rarityWeight: 25
	},
	blue_rocket: {
		type: "blue_rocket",
		name: "Sinine Tiibrakett",
		icon: "🔷",
		description: "Legendaarne liidrijahtija! Lendab väsimatult seni, kuni tabab esikoha liidrit mega-plahvatusega!",
		rarityWeight: 15
	},
	thundercloud: {
		type: "thundercloud",
		name: "Äikesepilv",
		icon: "⛈️",
		description: "Varitseb teel! Kui vastane satub lähedale, jälitab teda 3.5 sekundit ja virutab äikeselöögi!",
		rarityWeight: 20
	},
	banana: {
		type: "banana",
		name: "Banaanikoor",
		icon: "🍌",
		description: "Libe lõks teel! Otsasõitja teeb kontrollimatu 360° spinni ja kaotab hoogu.",
		rarityWeight: 25
	},
	star: {
		type: "star",
		name: "Super Täht",
		icon: "⭐",
		description: "Täielik vikerkaare võitmatus! Annab ülikiiruse ja pühib kõik vastased teelt minema.",
		rarityWeight: 15
	},
	mine: {
		type: "mine",
		name: "TNT Miin",
		icon: "💣",
		description: "Viskab taha tiksuva pommi. Otsasõitja lendab spinniga õhku!",
		rarityWeight: 20
	},
	shield: {
		type: "shield",
		name: "Mullkilp",
		icon: "🛡️",
		description: "Kaitsev energiamull, mis neelab rünnakud ja tõukab vastaseid.",
		rarityWeight: 15
	},
	turbo: {
		type: "turbo",
		name: "Super Nitro",
		icon: "⚡",
		description: "Võimas kiirussööst ja leegid summutist!",
		rarityWeight: 25
	},
	lightning: {
		type: "lightning",
		name: "Välk",
		icon: "🌩️",
		description: "Lööb korraga kõiki vastaseid välguga ja aeglustab neid 3 sekundiks!",
		rarityWeight: 10
	},
	anvil: {
		type: "anvil",
		name: "10T Alasi",
		icon: "🔨",
		description: "Kukutab liidrile pähe tohutu koomiksialasi!",
		rarityWeight: 10
	},
	repair: {
		type: "repair",
		name: "Kiirparandus",
		icon: "🔧",
		description: "Taastab auto stabiilsuse ja annab väikese lisakiirenduse.",
		rarityWeight: 15
	},
	trio_rockets: {
		type: "trio_rockets",
		name: "3x Raketti",
		icon: "🎯",
		description: "Kolm kiiret raketti laiali lehvikuna vastaste rivi purustamiseks!",
		rarityWeight: 10
	},
	vortex: {
		type: "vortex",
		name: "Must Auk (Vortex)",
		icon: "🌀",
		description: "Gravitatsiooni singulaarsus! Tõmbab kõik lähedal olevad vastased (16m) oma tsentrisse pöörlema ja neelab nad lõksu!",
		rarityWeight: 20
	},
	freezeray: {
		type: "freezeray",
		name: "Jääkülmuti (Cryo)",
		icon: "❄️",
		description: "Kiire krüo-lask otse ettepoole (90 m/s)! Külmutab tabatud vastase 3.5 sekundiks libisevasse jääkuubikusse!",
		rarityWeight: 22
	},
	plasma_cannon: {
		type: "plasma_cannon",
		name: "Plasma Suurtükk",
		icon: "🔮",
		description: "Ülikiire lineaarne plasma-laserkiir (140 m/s)! Tulistab otse sihtmärgi suunas ja läbistab järjest kõik vastased!",
		rarityWeight: 24
	},
	oil_slick: {
		type: "oil_slick",
		name: "Õliloik",
		icon: "🛢️",
		description: "Viskab teele libeda musta õliloigu! Otsasõitja teeb pöörase 720° topelt-spinni ja kaotab pidamise.",
		rarityWeight: 22
	}
};
/**
* Weighted random power-up picker based on current race position (Rubber-banding!)
* Trailing racers (4th-6th) get game-changing items: Blue Rocket, Thundercloud, Vortex, Star, Red Rocket, Turbo.
* Leader (1st) gets defensive items: Banana, Mine, Shield, Repair.
*/
function getRandomPowerUp(position, totalRacers = 6) {
	const isLeader = position === 1;
	const isTrailing = position >= 4;
	const pool = [];
	if (isLeader) {
		pool.push({
			type: "oil_slick",
			weight: 32
		});
		pool.push({
			type: "banana",
			weight: 30
		});
		pool.push({
			type: "mine",
			weight: 25
		});
		pool.push({
			type: "shield",
			weight: 20
		});
		pool.push({
			type: "vortex",
			weight: 14
		});
		pool.push({
			type: "repair",
			weight: 14
		});
		pool.push({
			type: "turbo",
			weight: 10
		});
	} else if (isTrailing) {
		pool.push({
			type: "plasma_cannon",
			weight: 25
		});
		pool.push({
			type: "blue_rocket",
			weight: 22
		});
		pool.push({
			type: "vortex",
			weight: 20
		});
		pool.push({
			type: "freezeray",
			weight: 20
		});
		pool.push({
			type: "thundercloud",
			weight: 18
		});
		pool.push({
			type: "star",
			weight: 18
		});
		pool.push({
			type: "rocket",
			weight: 20
		});
		pool.push({
			type: "turbo",
			weight: 16
		});
		pool.push({
			type: "lightning",
			weight: 10
		});
	} else {
		pool.push({
			type: "plasma_cannon",
			weight: 24
		});
		pool.push({
			type: "rocket",
			weight: 22
		});
		pool.push({
			type: "freezeray",
			weight: 22
		});
		pool.push({
			type: "oil_slick",
			weight: 18
		});
		pool.push({
			type: "vortex",
			weight: 16
		});
		pool.push({
			type: "thundercloud",
			weight: 16
		});
		pool.push({
			type: "banana",
			weight: 14
		});
		pool.push({
			type: "turbo",
			weight: 18
		});
		pool.push({
			type: "shield",
			weight: 12
		});
		pool.push({
			type: "mine",
			weight: 12
		});
		pool.push({
			type: "blue_rocket",
			weight: 10
		});
	}
	const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
	let rand = Math.random() * totalWeight;
	for (const item of pool) {
		if (rand < item.weight) return item.type;
		rand -= item.weight;
	}
	return "turbo";
}
var rocketBodyGeo = new CylinderGeometry(.32, .38, 2, 10);
rocketBodyGeo.rotateX(Math.PI / 2);
var rocketBodyMat = new MeshStandardMaterial({
	color: 15680580,
	emissive: 14427686,
	emissiveIntensity: .65,
	metalness: .35,
	roughness: .25
});
var rocketNoseGeo = new ConeGeometry(.38, .85, 10);
rocketNoseGeo.rotateX(Math.PI / 2);
var rocketNoseMat = new MeshStandardMaterial({ color: 16436245 });
var rocketFinGeo = new BoxGeometry(1.1, .08, .45);
var rocketFinMat = new MeshStandardMaterial({ color: 1976635 });
var rocketFlameGeo = new ConeGeometry(.28, .7, 8);
rocketFlameGeo.rotateX(-Math.PI / 2);
var rocketFlameMat = new MeshBasicMaterial({ color: 16347926 });
var mineSphereGeo = new SphereGeometry(.45, 12, 12);
var mineBombMat = new MeshStandardMaterial({
	color: 1579035,
	roughness: .6
});
var mineFuseGeo = new CylinderGeometry(.04, .04, .3, 6);
var mineFuseMat = new MeshStandardMaterial({ color: 7877903 });
var mineSparkGeo = new SphereGeometry(.09, 6, 6);
var mineSparkMat = new MeshBasicMaterial({ color: 16096779 });
var mineSpikeGeo = new ConeGeometry(.12, .3, 6);
var mineSpikeMat = new MeshStandardMaterial({ color: 15680580 });
var blueRocketBodyMat = new MeshStandardMaterial({
	color: 165063,
	metalness: .5,
	roughness: .25
});
var blueRocketNoseMat = new MeshStandardMaterial({
	color: 3718648,
	emissive: 165063,
	emissiveIntensity: .8
});
var blueRocketWingMat = new MeshStandardMaterial({
	color: 16317180,
	metalness: .2,
	roughness: .3
});
var blueRocketFlameMat = new MeshBasicMaterial({ color: 440020 });
var cloudPuffGeo = new SphereGeometry(.55, 8, 8);
var cloudPuffDarkMat = new MeshStandardMaterial({
	color: 1976635,
	roughness: .9,
	metalness: .1
});
var cloudPuffMidMat = new MeshStandardMaterial({
	color: 3359061,
	roughness: .8
});
var lightningCoreGeo = new ConeGeometry(.16, .45, 4);
var lightningCoreMat = new MeshBasicMaterial({ color: 3718648 });
var bananaCurveGeo = new CylinderGeometry(.12, .15, .7, 8);
var bananaMat = new MeshStandardMaterial({
	color: 16436245,
	roughness: .4
});
var bananaStemMat = new MeshStandardMaterial({
	color: 7877903,
	roughness: .7
});
var bananaPeelGeo = new BoxGeometry(.18, .04, .45);
var sharedShieldGeo = new SphereGeometry(1.6, 16, 16);
var sharedShieldMat = new MeshStandardMaterial({
	color: 3718648,
	emissive: 165063,
	emissiveIntensity: .6,
	transparent: true,
	opacity: .4,
	roughness: .1,
	wireframe: false
});
/**
* 3D Projectile Mesh Generator (Uses pre-cached assets)
*/
function createRocketMesh() {
	const group = new Group();
	group.scale.setScalar(1.35);
	const body = new Mesh(rocketBodyGeo, rocketBodyMat);
	body.renderOrder = 5;
	group.add(body);
	const nose = new Mesh(rocketNoseGeo, rocketNoseMat);
	nose.position.z = 1.15;
	group.add(nose);
	const fin1 = new Mesh(rocketFinGeo, rocketFinMat);
	fin1.position.z = -.55;
	group.add(fin1);
	const fin2 = new Mesh(rocketFinGeo, rocketFinMat);
	fin2.position.z = -.55;
	fin2.rotation.z = Math.PI / 2;
	group.add(fin2);
	const flame = new Mesh(rocketFlameGeo, rocketFlameMat);
	flame.position.z = -1.05;
	group.add(flame);
	const core = new Mesh(new SphereGeometry(.35, 8, 8), new MeshBasicMaterial({ color: 16707722 }));
	core.position.z = .2;
	group.add(core);
	return group;
}
function createBlueRocketMesh() {
	const group = new Group();
	group.scale.setScalar(1.55);
	const body = new Mesh(rocketBodyGeo, blueRocketBodyMat);
	body.renderOrder = 5;
	group.add(body);
	const nose = new Mesh(rocketNoseGeo, blueRocketNoseMat);
	nose.position.z = .85;
	group.add(nose);
	const wingLeft = new Mesh(rocketFinGeo, blueRocketWingMat);
	wingLeft.position.set(-.5, 0, -.2);
	wingLeft.rotation.y = .3;
	group.add(wingLeft);
	const wingRight = new Mesh(rocketFinGeo, blueRocketWingMat);
	wingRight.position.set(.5, 0, -.2);
	wingRight.rotation.y = -.3;
	group.add(wingRight);
	const topFin = new Mesh(rocketFinGeo, blueRocketWingMat);
	topFin.position.set(0, .4, -.3);
	topFin.rotation.z = Math.PI / 2;
	group.add(topFin);
	const flame = new Mesh(rocketFlameGeo, blueRocketFlameMat);
	flame.position.z = -.75;
	flame.scale.set(1.3, 1.3, 1.3);
	group.add(flame);
	return group;
}
function createThundercloudMesh() {
	const group = new Group();
	[
		{
			x: 0,
			y: .1,
			z: 0,
			s: 1.1,
			dark: true
		},
		{
			x: -.45,
			y: -.05,
			z: .2,
			s: .85,
			dark: false
		},
		{
			x: .45,
			y: .05,
			z: -.15,
			s: .9,
			dark: true
		},
		{
			x: -.2,
			y: .2,
			z: -.3,
			s: .8,
			dark: false
		},
		{
			x: .3,
			y: -.1,
			z: .35,
			s: .85,
			dark: false
		},
		{
			x: 0,
			y: .25,
			z: .1,
			s: .75,
			dark: true
		}
	].forEach((o) => {
		const puff = new Mesh(cloudPuffGeo, o.dark ? cloudPuffDarkMat : cloudPuffMidMat);
		puff.position.set(o.x, o.y, o.z);
		puff.scale.set(o.s, o.s * .75, o.s);
		group.add(puff);
	});
	const bolt1 = new Mesh(lightningCoreGeo, lightningCoreMat);
	bolt1.position.set(-.15, -.35, .05);
	bolt1.rotation.z = .3;
	group.add(bolt1);
	const bolt2 = new Mesh(lightningCoreGeo, lightningCoreMat);
	bolt2.position.set(.15, -.38, -.05);
	bolt2.rotation.z = -.25;
	group.add(bolt2);
	return group;
}
function createBananaMesh() {
	const group = new Group();
	const core = new Mesh(bananaCurveGeo, bananaMat);
	core.rotation.x = Math.PI / 2;
	core.position.y = .15;
	group.add(core);
	const stem = new Mesh(new CylinderGeometry(.05, .08, .2, 6), bananaStemMat);
	stem.position.set(0, .15, .42);
	stem.rotation.x = Math.PI / 2;
	group.add(stem);
	[
		-.7,
		.7,
		2.3
	].forEach((angle) => {
		const peel = new Mesh(bananaPeelGeo, bananaMat);
		peel.position.set(Math.cos(angle) * .25, .03, Math.sin(angle) * .25);
		peel.rotation.y = angle;
		group.add(peel);
	});
	return group;
}
function createMineMesh() {
	const group = new Group();
	const bomb = new Mesh(mineSphereGeo, mineBombMat);
	group.add(bomb);
	const fuse = new Mesh(mineFuseGeo, mineFuseMat);
	fuse.position.y = .5;
	group.add(fuse);
	const spark = new Mesh(mineSparkGeo, mineSparkMat);
	spark.position.y = .65;
	group.add(spark);
	[
		0,
		Math.PI / 2,
		Math.PI,
		Math.PI * 1.5
	].forEach((a) => {
		const s = new Mesh(mineSpikeGeo, mineSpikeMat);
		s.position.set(Math.cos(a) * .45, 0, Math.sin(a) * .45);
		s.rotation.z = -Math.PI / 2;
		s.rotation.y = a;
		group.add(s);
	});
	return group;
}
function createShieldMesh() {
	return new Mesh(sharedShieldGeo, sharedShieldMat);
}
var vortexCoreGeo = new SphereGeometry(.55, 12, 12);
var vortexCoreMat = new MeshStandardMaterial({
	color: 984349,
	emissive: 5774471,
	emissiveIntensity: .9,
	roughness: .2
});
var vortexDiskGeo = new TorusGeometry(1.4, .28, 8, 24);
vortexDiskGeo.rotateX(Math.PI / 2);
var vortexDiskMat = new MeshStandardMaterial({
	color: 11032055,
	emissive: 9647082,
	emissiveIntensity: 1.4,
	roughness: .1,
	transparent: true,
	opacity: .88
});
var vortexRingOuterGeo = new TorusGeometry(2.1, .12, 6, 24);
vortexRingOuterGeo.rotateX(Math.PI / 2);
var vortexRingOuterMat = new MeshStandardMaterial({
	color: 12616956,
	emissive: 11032055,
	emissiveIntensity: 1.2,
	transparent: true,
	opacity: .75
});
function createVortexMesh() {
	const group = new Group();
	const core = new Mesh(vortexCoreGeo, vortexCoreMat);
	core.position.y = .6;
	group.add(core);
	const disk = new Mesh(vortexDiskGeo, vortexDiskMat);
	disk.position.y = .55;
	group.add(disk);
	const ring = new Mesh(vortexRingOuterGeo, vortexRingOuterMat);
	ring.position.y = .5;
	group.add(ring);
	const shardGeo = new OctahedronGeometry(.2, 0);
	const shardMat = new MeshStandardMaterial({
		color: 14202110,
		emissive: 8266446,
		emissiveIntensity: 1.1
	});
	for (let i = 0; i < 4; i++) {
		const angle = i / 4 * Math.PI * 2;
		const shard = new Mesh(shardGeo, shardMat);
		shard.position.set(Math.cos(angle) * 1.05, .6, Math.sin(angle) * 1.05);
		group.add(shard);
	}
	return group;
}
var freezeCoreGeo = new OctahedronGeometry(.48, 0);
var freezeCoreMat = new MeshStandardMaterial({
	color: 12248829,
	emissive: 165063,
	emissiveIntensity: 1.3,
	roughness: .1,
	metalness: .3,
	transparent: true,
	opacity: .92
});
var freezeSpikeGeo = new ConeGeometry(.18, .65, 5);
freezeSpikeGeo.rotateX(Math.PI / 2);
var freezeSpikeMat = new MeshStandardMaterial({
	color: 14742270,
	emissive: 3718648,
	emissiveIntensity: .8
});
function createFreezeRayMesh() {
	const group = new Group();
	group.scale.setScalar(1.3);
	const core = new Mesh(freezeCoreGeo, freezeCoreMat);
	core.scale.set(1, 1, 1.8);
	group.add(core);
	[-.25, .25].forEach((x) => {
		[-.25, .25].forEach((y) => {
			const spike = new Mesh(freezeSpikeGeo, freezeSpikeMat);
			spike.position.set(x, y, .3);
			group.add(spike);
		});
	});
	return group;
}
var plasmaCoreGeo = new SphereGeometry(.55, 16, 16);
var plasmaCoreMat = new MeshStandardMaterial({
	color: 1096065,
	emissive: 366185,
	emissiveIntensity: 1.8,
	roughness: .1,
	metalness: .2
});
var plasmaRingGeo = new TorusGeometry(.85, .08, 8, 20);
var plasmaRingMat = new MeshBasicMaterial({
	color: 3462041,
	transparent: true,
	opacity: .85
});
var plasmaSpikeGeo = new ConeGeometry(.12, .55, 6);
plasmaSpikeGeo.rotateX(Math.PI / 2);
var plasmaSpikeMat = new MeshBasicMaterial({ color: 7268279 });
function createPlasmaMesh() {
	const group = new Group();
	group.scale.setScalar(1.4);
	const core = new Mesh(plasmaCoreGeo, plasmaCoreMat);
	group.add(core);
	const ring1 = new Mesh(plasmaRingGeo, plasmaRingMat);
	ring1.rotation.x = Math.PI / 3;
	group.add(ring1);
	const ring2 = new Mesh(plasmaRingGeo, plasmaRingMat);
	ring2.rotation.y = Math.PI / 3;
	group.add(ring2);
	for (let i = 0; i < 4; i++) {
		const angle = i / 4 * Math.PI * 2;
		const spike = new Mesh(plasmaSpikeGeo, plasmaSpikeMat);
		spike.position.set(Math.cos(angle) * .45, Math.sin(angle) * .45, .5);
		group.add(spike);
	}
	return group;
}
var oilPuddleGeo = new CylinderGeometry(1.65, 1.8, .04, 24);
var oilPuddleMat = new MeshStandardMaterial({
	color: 592139,
	roughness: .08,
	metalness: .85,
	emissive: 1973067,
	emissiveIntensity: .35
});
var oilDropletGeo = new CylinderGeometry(.28, .35, .05, 12);
function createOilSlickMesh() {
	const group = new Group();
	const mainPuddle = new Mesh(oilPuddleGeo, oilPuddleMat);
	mainPuddle.position.y = .03;
	group.add(mainPuddle);
	const sheenGeo = new RingGeometry(.4, 1.45, 20);
	sheenGeo.rotateX(-Math.PI / 2);
	const sheenMat = new MeshBasicMaterial({
		color: 8490232,
		transparent: true,
		opacity: .4,
		side: 2
	});
	const sheen = new Mesh(sheenGeo, sheenMat);
	sheen.position.y = .055;
	group.add(sheen);
	[
		.4,
		1.6,
		2.7,
		3.8,
		5.1
	].forEach((angle, idx) => {
		const dist = 1.6 + idx % 3 * .35;
		const drop = new Mesh(oilDropletGeo, oilPuddleMat);
		drop.position.set(Math.cos(angle) * dist, .03, Math.sin(angle) * dist);
		const dropScale = .6 + idx % 2 * .4;
		drop.scale.set(dropScale, 1, dropScale);
		group.add(drop);
	});
	return group;
}
/**
* Procedural Cartoon Sound Synthesizer using Web Audio API
* High quality arcade sounds & dynamic multi-instrument racing soundtrack
* No external asset files needed - runs 100% reliably in any browser!
*/
var SoundManager = class {
	ctx = null;
	sfxGain = null;
	musicGain = null;
	masterGain = null;
	engineOsc = null;
	engineGain = null;
	sharedNoiseBuffer = null;
	lastDriftTime = 0;
	lastItemBoxTime = 0;
	isMuted = false;
	volume = .7;
	isMusicPlaying = false;
	musicInterval = null;
	constructor() {}
	/**
	* Disconnects nodes when audio playback ends to prevent Web Audio memory leaks and GC stalls
	*/
	scheduleCleanup(source, nodes, stopTime) {
		source.stop(stopTime);
		source.onended = () => {
			try {
				source.disconnect();
				for (let i = 0; i < nodes.length; i++) nodes[i]?.disconnect();
			} catch (_) {}
		};
	}
	init() {
		if (this.ctx) return;
		try {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			this.ctx = new AudioCtx();
			this.masterGain = this.ctx.createGain();
			this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
			this.masterGain.connect(this.ctx.destination);
			this.sfxGain = this.ctx.createGain();
			this.sfxGain.gain.setValueAtTime(.38, this.ctx.currentTime);
			this.sfxGain.connect(this.masterGain);
			this.musicGain = this.ctx.createGain();
			this.musicGain.gain.setValueAtTime(.26, this.ctx.currentTime);
			this.musicGain.connect(this.masterGain);
			const bufferSize = this.ctx.sampleRate * 1;
			this.sharedNoiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
			const data = this.sharedNoiseBuffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
			this.startEngineSound();
			const resume = () => {
				if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
			};
			window.addEventListener("pointerdown", resume, { once: true });
			window.addEventListener("keydown", resume, { once: true });
			document.addEventListener("visibilitychange", () => {
				if (document.visibilityState === "visible") resume();
			});
		} catch (e) {
			console.warn("Web Audio not supported or blocked", e);
		}
	}
	resume() {
		if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
	}
	setVolume(vol) {
		this.volume = Math.max(0, Math.min(1, vol));
		if (this.masterGain && this.ctx) this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
	}
	getVolume() {
		return this.volume;
	}
	setMute(muted) {
		this.isMuted = muted;
		if (this.masterGain && this.ctx) this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
	}
	toggleMute() {
		this.setMute(!this.isMuted);
		return this.isMuted;
	}
	getIsMuted() {
		return this.isMuted;
	}
	startEngineSound() {
		if (!this.ctx || !this.sfxGain) return;
		try {
			this.engineOsc = this.ctx.createOscillator();
			this.engineGain = this.ctx.createGain();
			this.engineOsc.type = "sawtooth";
			this.engineOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
			const filter = this.ctx.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.setValueAtTime(260, this.ctx.currentTime);
			this.engineGain.gain.setValueAtTime(.04, this.ctx.currentTime);
			this.engineOsc.connect(filter);
			filter.connect(this.engineGain);
			this.engineGain.connect(this.sfxGain);
			this.engineOsc.start();
		} catch (e) {
			console.warn(e);
		}
	}
	updateEngine(speedNormalized, isAccelerating) {
		if (!this.ctx || !this.engineOsc || !this.engineGain) return;
		const now = this.ctx.currentTime;
		const baseFreq = 52 + speedNormalized * 115 + (isAccelerating ? 30 : 0);
		this.engineOsc.frequency.setTargetAtTime(baseFreq, now, .07);
		const targetVol = .03 + speedNormalized * .05 + (isAccelerating ? .025 : 0);
		this.engineGain.gain.setTargetAtTime(targetVol, now, .07);
	}
	playCountdown(isGo = false) {
		this.init();
		this.resume();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = isGo ? "triangle" : "sine";
		osc.frequency.setValueAtTime(isGo ? 880 : 440, now);
		if (isGo) osc.frequency.exponentialRampToValueAtTime(1320, now + .35);
		gain.gain.setValueAtTime(.4, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + (isGo ? .6 : .3));
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + (isGo ? .65 : .35));
	}
	playItemBox() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		if (now - this.lastItemBoxTime < .12) return;
		this.lastItemBoxTime = now;
		[
			523.25,
			659.25,
			783.99,
			1046.5
		].forEach((freq, idx) => {
			if (!this.ctx || !this.sfxGain) return;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, now + idx * .05);
			gain.gain.setValueAtTime(.25, now + idx * .05);
			gain.gain.exponentialRampToValueAtTime(.001, now + idx * .05 + .22);
			osc.connect(gain);
			gain.connect(this.sfxGain);
			osc.start(now + idx * .05);
			this.scheduleCleanup(osc, [gain], now + idx * .05 + .24);
		});
	}
	playMiniTurbo() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		[
			784,
			1175,
			1568
		].forEach((freq, idx) => {
			if (!this.ctx || !this.sfxGain) return;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();
			osc.type = "triangle";
			osc.frequency.setValueAtTime(freq, now + idx * .06);
			gain.gain.setValueAtTime(.35, now + idx * .06);
			gain.gain.exponentialRampToValueAtTime(.001, now + idx * .06 + .3);
			osc.connect(gain);
			gain.connect(this.sfxGain);
			osc.start(now + idx * .06);
			this.scheduleCleanup(osc, [gain], now + idx * .06 + .32);
		});
	}
	playRocketLaunch() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "sawtooth";
		osc.frequency.setValueAtTime(260, now);
		osc.frequency.exponentialRampToValueAtTime(1050, now + .35);
		gain.gain.setValueAtTime(.35, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .4);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .42);
	}
	playExplosion() {
		this.init();
		if (!this.ctx || !this.sfxGain || !this.sharedNoiseBuffer) return;
		const now = this.ctx.currentTime;
		const noise = this.ctx.createBufferSource();
		noise.buffer = this.sharedNoiseBuffer;
		const filter = this.ctx.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.setValueAtTime(320, now);
		filter.frequency.exponentialRampToValueAtTime(45, now + .5);
		const gain = this.ctx.createGain();
		gain.gain.setValueAtTime(.24, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .52);
		noise.connect(filter);
		filter.connect(gain);
		gain.connect(this.sfxGain);
		noise.start(now);
		this.scheduleCleanup(noise, [filter, gain], now + .55);
	}
	playStuntChime() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		[
			587.33,
			739.99,
			880,
			1174.66
		].forEach((freq, idx) => {
			if (!this.ctx || !this.sfxGain) return;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();
			osc.type = "triangle";
			osc.frequency.setValueAtTime(freq, now + idx * .05);
			gain.gain.setValueAtTime(.28, now + idx * .05);
			gain.gain.exponentialRampToValueAtTime(.001, now + idx * .05 + .35);
			osc.connect(gain);
			gain.connect(this.sfxGain);
			osc.start(now + idx * .05);
			this.scheduleCleanup(osc, [gain], now + idx * .05 + .38);
		});
	}
	playStuntRing() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		[
			880,
			1108.73,
			1318.51,
			1760
		].forEach((freq, idx) => {
			if (!this.ctx || !this.sfxGain) return;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, now + idx * .04);
			gain.gain.setValueAtTime(.24, now + idx * .04);
			gain.gain.exponentialRampToValueAtTime(.001, now + idx * .04 + .4);
			osc.connect(gain);
			gain.connect(this.sfxGain);
			osc.start(now + idx * .04);
			this.scheduleCleanup(osc, [gain], now + idx * .04 + .42);
		});
	}
	playTurbo() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "triangle";
		osc.frequency.setValueAtTime(260, now);
		osc.frequency.exponentialRampToValueAtTime(980, now + .35);
		gain.gain.setValueAtTime(.18, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .42);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .45);
	}
	playShield() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(380, now);
		osc.frequency.linearRampToValueAtTime(540, now + .2);
		osc.frequency.linearRampToValueAtTime(420, now + .38);
		gain.gain.setValueAtTime(.15, now);
		gain.gain.exponentialRampToValueAtTime(.005, now + .4);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .42);
	}
	playThunder() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const zap = this.ctx.createOscillator();
		const zapGain = this.ctx.createGain();
		zap.type = "sawtooth";
		zap.frequency.setValueAtTime(1400, now);
		zap.frequency.exponentialRampToValueAtTime(80, now + .25);
		zapGain.gain.setValueAtTime(.35, now);
		zapGain.gain.exponentialRampToValueAtTime(.001, now + .28);
		zap.connect(zapGain);
		zapGain.connect(this.sfxGain);
		zap.start(now);
		this.scheduleCleanup(zap, [zapGain], now + .3);
		if (this.sharedNoiseBuffer) {
			const noise = this.ctx.createBufferSource();
			noise.buffer = this.sharedNoiseBuffer;
			const filter = this.ctx.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.setValueAtTime(260, now + .05);
			filter.frequency.exponentialRampToValueAtTime(35, now + .85);
			const rumbleGain = this.ctx.createGain();
			rumbleGain.gain.setValueAtTime(.3, now + .05);
			rumbleGain.gain.exponentialRampToValueAtTime(.001, now + .9);
			noise.connect(filter);
			filter.connect(rumbleGain);
			rumbleGain.connect(this.sfxGain);
			noise.start(now + .05);
			this.scheduleCleanup(noise, [filter, rumbleGain], now + .95);
		}
	}
	playSlip() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "triangle";
		osc.frequency.setValueAtTime(650, now);
		osc.frequency.exponentialRampToValueAtTime(180, now + .28);
		gain.gain.setValueAtTime(.28, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .3);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .32);
	}
	playBlueShell() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "sawtooth";
		osc.frequency.setValueAtTime(440, now);
		osc.frequency.exponentialRampToValueAtTime(1320, now + .4);
		gain.gain.setValueAtTime(.25, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .45);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .48);
	}
	playStarFanfare() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		[
			523.25,
			659.25,
			783.99,
			1046.5,
			1318.5
		].forEach((freq, i) => {
			if (!this.ctx || !this.sfxGain) return;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();
			osc.type = "triangle";
			osc.frequency.setValueAtTime(freq, now + i * .07);
			gain.gain.setValueAtTime(.22, now + i * .07);
			gain.gain.exponentialRampToValueAtTime(.001, now + i * .07 + .25);
			osc.connect(gain);
			gain.connect(this.sfxGain);
			osc.start(now + i * .07);
			this.scheduleCleanup(osc, [gain], now + i * .07 + .27);
		});
	}
	playBump() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(95, now);
		osc.frequency.exponentialRampToValueAtTime(35, now + .12);
		gain.gain.setValueAtTime(.14, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .13);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .14);
	}
	playBoing() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(200, now);
		osc.frequency.exponentialRampToValueAtTime(520, now + .16);
		osc.frequency.exponentialRampToValueAtTime(280, now + .32);
		gain.gain.setValueAtTime(.14, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .34);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .36);
	}
	playLightning() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "triangle";
		osc.frequency.setValueAtTime(750, now);
		osc.frequency.exponentialRampToValueAtTime(110, now + .24);
		gain.gain.setValueAtTime(.16, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .26);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .28);
	}
	playFreezeChime() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		[
			1046.5,
			1318.5,
			1567.98,
			2093
		].forEach((freq, idx) => {
			if (!this.ctx || !this.sfxGain) return;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, now + idx * .05);
			gain.gain.setValueAtTime(.18, now + idx * .05);
			gain.gain.exponentialRampToValueAtTime(.001, now + idx * .05 + .35);
			osc.connect(gain);
			gain.connect(this.sfxGain);
			osc.start(now + idx * .05);
			this.scheduleCleanup(osc, [gain], now + idx * .05 + .38);
		});
	}
	playVortexHum() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "sawtooth";
		osc.frequency.setValueAtTime(320, now);
		osc.frequency.exponentialRampToValueAtTime(55, now + .45);
		gain.gain.setValueAtTime(.22, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .5);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .52);
	}
	playPlasmaShot() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "sawtooth";
		osc.frequency.setValueAtTime(880, now);
		osc.frequency.exponentialRampToValueAtTime(140, now + .28);
		gain.gain.setValueAtTime(.24, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .32);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .34);
	}
	playOilSlick() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "triangle";
		osc.frequency.setValueAtTime(520, now);
		osc.frequency.linearRampToValueAtTime(840, now + .12);
		osc.frequency.exponentialRampToValueAtTime(180, now + .35);
		gain.gain.setValueAtTime(.22, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .38);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .4);
	}
	playRespawn() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(220, now);
		osc.frequency.exponentialRampToValueAtTime(620, now + .28);
		gain.gain.setValueAtTime(.14, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .32);
		osc.connect(gain);
		gain.connect(this.sfxGain);
		osc.start(now);
		this.scheduleCleanup(osc, [gain], now + .35);
	}
	playDrift() {
		this.init();
		if (!this.ctx || !this.sfxGain || !this.sharedNoiseBuffer) return;
		const now = this.ctx.currentTime;
		if (now - this.lastDriftTime < .22) return;
		this.lastDriftTime = now;
		const noise = this.ctx.createBufferSource();
		noise.buffer = this.sharedNoiseBuffer;
		const filter = this.ctx.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.setValueAtTime(420, now);
		const gain = this.ctx.createGain();
		gain.gain.setValueAtTime(.05, now);
		gain.gain.exponentialRampToValueAtTime(.001, now + .2);
		noise.connect(filter);
		filter.connect(gain);
		gain.connect(this.sfxGain);
		noise.start(now);
		this.scheduleCleanup(noise, [filter, gain], now + .21);
	}
	playHonk() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		[370, 470].forEach((freq) => {
			if (!this.ctx || !this.sfxGain) return;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();
			osc.type = "triangle";
			osc.frequency.setValueAtTime(freq, now);
			gain.gain.setValueAtTime(.22, now);
			gain.gain.exponentialRampToValueAtTime(.001, now + .28);
			osc.connect(gain);
			gain.connect(this.sfxGain);
			osc.start(now);
			this.scheduleCleanup(osc, [gain], now + .3);
		});
	}
	playWinFanfare() {
		this.init();
		if (!this.ctx || !this.sfxGain) return;
		const now = this.ctx.currentTime;
		[
			{
				f: 523,
				d: .15,
				t: 0
			},
			{
				f: 523,
				d: .15,
				t: .15
			},
			{
				f: 523,
				d: .15,
				t: .3
			},
			{
				f: 659,
				d: .4,
				t: .45
			},
			{
				f: 783,
				d: .6,
				t: .85
			},
			{
				f: 1046,
				d: .9,
				t: 1.45
			}
		].forEach((note) => {
			if (!this.ctx || !this.sfxGain) return;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();
			osc.type = "triangle";
			osc.frequency.setValueAtTime(note.f, now + note.t);
			gain.gain.setValueAtTime(.3, now + note.t);
			gain.gain.exponentialRampToValueAtTime(.001, now + note.t + note.d);
			osc.connect(gain);
			gain.connect(this.sfxGain);
			osc.start(now + note.t);
			this.scheduleCleanup(osc, [gain], now + note.t + note.d + .05);
		});
	}
	startMusic() {
		if (this.isMusicPlaying) return;
		this.init();
		this.isMusicPlaying = true;
		const bassline = [
			110,
			110,
			130.8,
			146.8,
			110,
			110,
			164.8,
			146.8
		];
		const melody = [
			440,
			523,
			659,
			587,
			523,
			440,
			493,
			523
		];
		let step = 0;
		this.musicInterval = setInterval(() => {
			if (!this.ctx || !this.musicGain || !this.isMusicPlaying || this.isMuted) return;
			const now = this.ctx.currentTime;
			if (step % 4 === 0) {
				const kickOsc = this.ctx.createOscillator();
				const kickGain = this.ctx.createGain();
				kickOsc.type = "sine";
				kickOsc.frequency.setValueAtTime(140, now);
				kickOsc.frequency.exponentialRampToValueAtTime(38, now + .1);
				kickGain.gain.setValueAtTime(.2, now);
				kickGain.gain.exponentialRampToValueAtTime(.001, now + .12);
				kickOsc.connect(kickGain);
				kickGain.connect(this.musicGain);
				kickOsc.start(now);
				this.scheduleCleanup(kickOsc, [kickGain], now + .14);
			}
			if (step % 4 === 2 && this.sharedNoiseBuffer) {
				const noiseSrc = this.ctx.createBufferSource();
				noiseSrc.buffer = this.sharedNoiseBuffer;
				const snareFilter = this.ctx.createBiquadFilter();
				snareFilter.type = "highpass";
				snareFilter.frequency.setValueAtTime(900, now);
				const snareGain = this.ctx.createGain();
				snareGain.gain.setValueAtTime(.12, now);
				snareGain.gain.exponentialRampToValueAtTime(.001, now + .08);
				noiseSrc.connect(snareFilter);
				snareFilter.connect(snareGain);
				snareGain.connect(this.musicGain);
				noiseSrc.start(now);
				this.scheduleCleanup(noiseSrc, [snareFilter, snareGain], now + .09);
			}
			if (step % 2 === 1 && this.sharedNoiseBuffer) {
				const noiseSrc = this.ctx.createBufferSource();
				noiseSrc.buffer = this.sharedNoiseBuffer;
				const hatFilter = this.ctx.createBiquadFilter();
				hatFilter.type = "highpass";
				hatFilter.frequency.setValueAtTime(6e3, now);
				const hatGain = this.ctx.createGain();
				hatGain.gain.setValueAtTime(.04, now);
				hatGain.gain.exponentialRampToValueAtTime(.001, now + .03);
				noiseSrc.connect(hatFilter);
				hatFilter.connect(hatGain);
				hatGain.connect(this.musicGain);
				noiseSrc.start(now);
				this.scheduleCleanup(noiseSrc, [hatFilter, hatGain], now + .04);
			}
			const bassOsc = this.ctx.createOscillator();
			const bassGain = this.ctx.createGain();
			bassOsc.type = "triangle";
			bassOsc.frequency.setValueAtTime(bassline[step % bassline.length], now);
			bassGain.gain.setValueAtTime(.14, now);
			bassGain.gain.exponentialRampToValueAtTime(.001, now + .18);
			bassOsc.connect(bassGain);
			bassGain.connect(this.musicGain);
			bassOsc.start(now);
			this.scheduleCleanup(bassOsc, [bassGain], now + .2);
			if (step % 2 === 0) {
				const leadOsc = this.ctx.createOscillator();
				const leadGain = this.ctx.createGain();
				leadOsc.type = "sine";
				leadOsc.frequency.setValueAtTime(melody[step / 2 % melody.length], now);
				leadGain.gain.setValueAtTime(.09, now);
				leadGain.gain.exponentialRampToValueAtTime(.001, now + .3);
				leadOsc.connect(leadGain);
				leadGain.connect(this.musicGain);
				leadOsc.start(now);
				this.scheduleCleanup(leadOsc, [leadGain], now + .32);
			}
			step++;
		}, 175);
	}
	stopMusic() {
		this.isMusicPlaying = false;
		if (this.musicInterval) {
			clearInterval(this.musicInterval);
			this.musicInterval = null;
		}
	}
};
var soundManager = new SoundManager();
var _physCarPos = new Vector3();
var _physCarFwd = new Vector3();
var _physForwardDir = new Vector3();
/**
* Updates physics for a single racer over delta time
*/
function updateRacerPhysics(racer, input, track, dt, onCollision, speedFactor = 1) {
	const carDef = racer._carDef || CAR_DEFINITIONS.find((c) => c.id === racer.carId) || CAR_DEFINITIONS[0];
	racer._carDef = carDef;
	const isIceTrack = track.theme === "ice";
	const maxBaseSpeed = (17.5 + carDef.stats.speed * .65) * speedFactor;
	const accelPower = (13.5 + carDef.stats.accel * .95) * speedFactor;
	const handlingPower = (2.2 + carDef.stats.handling * .16) * (isIceTrack ? .9 : 1);
	if (input.respawn) {
		input.respawn = false;
		const cp = track.checkpoints[racer.checkpointIndex];
		const nextCp = track.checkpoints[(racer.checkpointIndex + 1) % track.checkpoints.length];
		_physForwardDir.subVectors(nextCp, cp).normalize();
		racer.x = cp.x;
		racer.y = cp.y + .3;
		racer.z = cp.z;
		racer.rotY = Math.atan2(_physForwardDir.x, _physForwardDir.z);
		racer.speed = 0;
		racer.spinTimer = 0;
		racer.frozenTimer = 0;
		racer.driftChargeTime = 0;
		racer.rotX = 0;
		soundManager.playRespawn();
		return;
	}
	if (racer.spinTimer > 0) {
		racer.spinTimer -= dt;
		racer.rotY += Math.PI * 5 * dt;
		racer.speed = Math.max(0, racer.speed - 24 * dt);
		racer.x += Math.sin(racer.rotY) * racer.speed * dt * .3;
		racer.z += Math.cos(racer.rotY) * racer.speed * dt * .3;
		return;
	}
	if (racer.frozenTimer > 0) racer.frozenTimer -= dt;
	let speedMultiplier = 1;
	if (racer.turboTimer > 0) {
		racer.turboTimer -= dt;
		speedMultiplier = Math.max(speedMultiplier, 1.35);
	}
	if (racer.starTimer > 0) {
		racer.starTimer -= dt;
		speedMultiplier = Math.max(speedMultiplier, 1.42);
	}
	if (racer.frozenTimer > 0 && !(racer.starTimer > 0)) speedMultiplier *= .45;
	const wantsHandbrake = input.drift && Math.abs(racer.speed) > 2.8;
	const isIceDrift = isIceTrack && Math.abs(input.steer) > .65 && Math.abs(racer.speed) > 4.5;
	const isDrifting = wantsHandbrake || isIceDrift;
	let weightTransferFront = 0;
	if (input.brake > 0) weightTransferFront = .22 * input.brake;
	else if (input.throttle > 0) weightTransferFront = -.12 * input.throttle;
	const effectiveAccel = racer.frozenTimer > 0 && !(racer.starTimer > 0) ? accelPower * .45 : accelPower;
	const topSpeed = maxBaseSpeed * speedMultiplier;
	if (isDrifting) {
		const driftScrub = isIceTrack ? 3.8 : 7.2;
		if (input.throttle > 0) {
			racer.speed = Math.max(isIceTrack ? 6 : 7, racer.speed - driftScrub * .28 * dt + effectiveAccel * .42 * input.throttle * dt);
			if (racer.speed > topSpeed) racer.speed = MathUtils.lerp(racer.speed, topSpeed, dt * 2);
		} else racer.speed = Math.max(0, racer.speed - driftScrub * dt);
	} else if (input.throttle > 0) {
		if (racer.speed < topSpeed) racer.speed = Math.min(topSpeed, racer.speed + effectiveAccel * input.throttle * dt);
		else racer.speed = MathUtils.lerp(racer.speed, topSpeed, dt * 3);
	} else if (input.brake > 0) {
		if (racer.speed > .4) racer.speed = Math.max(0, racer.speed - accelPower * 2.4 * input.brake * dt);
		else if (racer.speed > -10) racer.speed -= accelPower * 1.1 * input.brake * dt;
	} else {
		const dragRate = isIceTrack ? 2.8 : 5.2;
		if (racer.speed > 0) racer.speed = Math.max(0, racer.speed - dragRate * dt);
		else if (racer.speed < 0) racer.speed = Math.min(0, racer.speed + dragRate * dt);
	}
	racer.isDrifting = isDrifting;
	if (racer.isDrifting) {
		racer.driftFactor = Math.min(1.4, (racer.driftFactor || 0) + dt * (isIceTrack ? 1.5 : 1.25));
		if (Math.abs(input.steer) > .15 || Math.abs(racer.steerAngle) > .15) racer.driftChargeTime = (racer.driftChargeTime || 0) + dt;
		else racer.driftChargeTime = (racer.driftChargeTime || 0) + dt * .4;
	} else {
		if (racer.driftChargeTime >= .55) {
			if (racer.driftChargeTime >= 2.2) {
				racer.turboTimer = 2.4;
				racer.speed = Math.max(racer.speed + 11, maxBaseSpeed * 1.32);
				soundManager.playTurbo();
			} else if (racer.driftChargeTime >= 1.35) {
				racer.turboTimer = 1.6;
				racer.speed = Math.max(racer.speed + 7.5, maxBaseSpeed * 1.22);
				soundManager.playTurbo();
			} else {
				racer.turboTimer = .95;
				racer.speed = Math.max(racer.speed + 5, maxBaseSpeed * 1.14);
				soundManager.playMiniTurbo();
			}
		}
		racer.driftChargeTime = 0;
		racer.driftFactor = Math.max(0, (racer.driftFactor || 0) - dt * 3.5);
	}
	const steerAmp = racer.isDrifting ? .6 : .44;
	const targetSteerAngle = input.steer * steerAmp;
	const steerLerpSpeed = racer.isDrifting ? 18 : 15;
	racer.steerAngle = MathUtils.lerp(racer.steerAngle, targetSteerAngle, dt * steerLerpSpeed);
	if (Math.abs(racer.speed) > .3) {
		const speedSteerFactor = MathUtils.clamp(Math.abs(racer.speed) / 12, .4, 1.05);
		const frontGripMod = 1 + weightTransferFront;
		const driftSteerBonus = racer.isDrifting ? 1.7 + (racer.driftFactor || 0) * .42 : 1;
		const direction = racer.speed >= 0 ? 1 : -1;
		racer.rotY += racer.steerAngle * handlingPower * speedSteerFactor * frontGripMod * driftSteerBonus * dt * direction;
	}
	const moveSpeed = racer.speed * dt;
	const driftSlip = racer.isDrifting ? racer.steerAngle * (.38 + (racer.driftFactor || 0) * .24) : 0;
	const moveHeading = racer.rotY + driftSlip;
	racer.x += Math.sin(moveHeading) * moveSpeed;
	racer.z += Math.cos(moveHeading) * moveSpeed;
	_physCarPos.set(racer.x, racer.y, racer.z);
	const trackInfo = track.getTrackInfo(_physCarPos, racer.centerlineIndex);
	racer.centerlineIndex = trackInfo.closestIndex;
	racer.trackT = trackInfo.t;
	racer.currentSurface = trackInfo.surface || "asphalt";
	racer.surfaceName = trackInfo.surfaceName || "Rannatee";
	racer.surfaceIcon = trackInfo.surfaceIcon || "🛣️";
	const targetY = trackInfo.closestPoint.y;
	if (racer.isAirborne) {
		racer.airTime = (racer.airTime || 0) + dt;
		racer.vy = (racer.vy || 0) - 34 * dt;
		racer.y += (racer.vy || 0) * dt;
		if (!racer.stuntType && (input.drift || input.useItem || Math.abs(input.steer) > .45)) {
			if (input.drift) racer.stuntType = "barrel_roll";
			else if (Math.abs(input.steer) > .45) racer.stuntType = "spin";
			else racer.stuntType = "flip";
			racer.stuntTimer = 0;
			racer.stuntCompleted = true;
		}
		if (racer.stuntType) {
			racer.stuntTimer = (racer.stuntTimer || 0) + dt;
			const stuntProgress = Math.min(1, racer.stuntTimer / .55);
			if (racer.stuntType === "flip") racer.stuntAngleX = stuntProgress * Math.PI * 2;
			else if (racer.stuntType === "spin") racer.stuntAngleY = stuntProgress * Math.PI * 2 * (input.steer < 0 ? -1 : 1);
			else if (racer.stuntType === "barrel_roll") racer.stuntAngleZ = stuntProgress * Math.PI * 2 * (input.steer < 0 ? -1 : 1);
		}
		if (racer.y <= targetY && racer.vy <= 0) {
			racer.y = targetY;
			racer.vy = 0;
			racer.isAirborne = false;
			racer.stuntAngleX = 0;
			racer.stuntAngleY = 0;
			racer.stuntAngleZ = 0;
			if (racer.stuntCompleted) {
				racer.turboTimer = 1.6;
				racer.speed = Math.max(racer.speed + 9.5, maxBaseSpeed * 1.28);
				if (onCollision) onCollision({
					type: "stunt_boost",
					racerId: racer.id,
					x: racer.x,
					y: racer.y,
					z: racer.z
				});
			}
			racer.stuntType = null;
			racer.stuntCompleted = false;
		}
	} else {
		if (Math.abs(racer.y - targetY) < .02) racer.y = targetY;
		else racer.y = MathUtils.lerp(racer.y, targetY, Math.min(1, dt * 18));
		racer.stuntAngleX = 0;
		racer.stuntAngleY = 0;
		racer.stuntAngleZ = 0;
	}
	let targetRotX = -Math.asin(MathUtils.clamp(trackInfo.tangent.y, -.65, .65));
	if (input.brake > 0 && racer.speed > 4) targetRotX += .04 * input.brake;
	else if (input.throttle > 0 && racer.speed < maxBaseSpeed) targetRotX -= .02 * input.throttle;
	racer.rotX = MathUtils.lerp(racer.rotX || 0, targetRotX, Math.min(1, dt * 10));
	const speedRatio = MathUtils.clamp(Math.abs(racer.speed) / (maxBaseSpeed + .1), 0, 1.2);
	const targetRoll = -racer.steerAngle * speedRatio * (racer.isDrifting ? .22 : .14);
	racer.rotZ = MathUtils.lerp(racer.rotZ || 0, targetRoll, dt * 14);
	_physCarFwd.set(Math.sin(racer.rotY), 0, Math.cos(racer.rotY));
	racer.isWrongWay = _physCarFwd.dot(trackInfo.tangent) < -.35 && racer.speed > 8;
	racer.currentSurface = trackInfo.surface || "asphalt";
	racer.surfaceName = trackInfo.surfaceName || "Rannatee";
	racer.surfaceIcon = trackInfo.surfaceIcon || "🛣️";
	if (trackInfo.isOffroad) {
		if (racer.turboTimer <= 0) {
			const offroadMax = 22;
			if (racer.speed > offroadMax) racer.speed = Math.max(offroadMax, racer.speed - 28 * dt);
		}
	} else if (trackInfo.isOnCurb) {
		if (racer.turboTimer <= 0 && racer.speed > 36) racer.speed -= 4 * dt;
	} else switch (racer.currentSurface) {
		case "sand":
			if (racer.turboTimer <= 0 && racer.speed > 35) racer.speed -= 7 * dt;
			break;
		case "ice":
			if (Math.abs(input.steer) > .4) racer.rotY += racer.steerAngle * .4 * dt;
			break;
		case "wood":
			if (racer.turboTimer <= 0 && racer.speed > 39) racer.speed -= 3 * dt;
			break;
		case "cobblestone":
			if (racer.isDrifting) racer.driftChargeTime = (racer.driftChargeTime || 0) + dt * .25;
			break;
		case "dirt":
			if (Math.abs(input.steer) > .6 && racer.speed > 16) racer.isDrifting = true;
			break;
		case "glass":
		case "cyber_grid": if (racer.speed > 25 && input.throttle > 0) racer.speed += 2.2 * dt;
	}
	{
		const half = track.trackWidth * .5;
		const rawWallDist = trackInfo.wallDistance || half + 2.4;
		const maxLegalDist = Math.max(half * .75, rawWallDist - 1.15);
		const softMax = maxLegalDist - .85;
		const toCarX = racer.x - trackInfo.closestPoint.x;
		const toCarZ = racer.z - trackInfo.closestPoint.z;
		const radialDist = Math.hypot(toCarX, toCarZ);
		if (radialDist > softMax) {
			const excess = radialDist - softMax;
			racer.speed *= Math.max(.48, 1 - excess * .18);
		}
		if (radialDist > maxLegalDist) {
			const clampedDist = maxLegalDist - .05;
			const dirX = toCarX / (radialDist || .001);
			const dirZ = toCarZ / (radialDist || .001);
			racer.x = trackInfo.closestPoint.x + dirX * clampedDist;
			racer.z = trackInfo.closestPoint.z + dirZ * clampedDist;
			const fwdX = Math.sin(racer.rotY);
			const fwdZ = Math.cos(racer.rotY);
			const intoWall = fwdX * dirX + fwdZ * dirZ;
			racer.x -= dirX * .22;
			racer.z -= dirZ * .22;
			if (intoWall > 0) {
				const targetYaw = fwdX * trackInfo.tangent.x + fwdZ * trackInfo.tangent.z >= 0 ? Math.atan2(trackInfo.tangent.x, trackInfo.tangent.z) : Math.atan2(-trackInfo.tangent.x, -trackInfo.tangent.z);
				racer.rotY = MathUtils.lerp(racer.rotY, targetYaw, .65);
			}
			const prevSpeed = Math.abs(racer.speed);
			racer.speed = Math.min(racer.speed * .6, 14);
			if (prevSpeed > 5 && onCollision) onCollision({
				type: "wall_hit",
				racerId: racer.id,
				x: racer.x,
				y: racer.y + .35,
				z: racer.z
			});
		}
	}
	const numCp = track.checkpoints.length;
	for (let offset = 1; offset <= 3; offset++) {
		const candidateIdx = (racer.checkpointIndex + offset) % numCp;
		if (_physCarPos.distanceTo(track.checkpoints[candidateIdx]) < 34) {
			if (candidateIdx === 0 && racer.checkpointIndex > numCp - 10) {
				racer.lap += 1;
				const now = Date.now();
				if (racer.currentLapStartTime > 0) {
					const lapDuration = (now - racer.currentLapStartTime) / 1e3;
					racer.lapTimes.push(lapDuration);
					if (!racer.bestLapTime || lapDuration < racer.bestLapTime) racer.bestLapTime = lapDuration;
				}
				racer.currentLapStartTime = now;
			}
			racer.checkpointIndex = candidateIdx;
			racer.totalDistance += 20 * offset;
			break;
		}
	}
	if (track.boostPads && racer.turboTimer <= 0) for (const pad of track.boostPads) {
		const dx = racer.x - pad.x;
		const dz = racer.z - pad.z;
		const cosR = Math.cos(-pad.rotY);
		const sinR = Math.sin(-pad.rotY);
		const localX = dx * cosR - dz * sinR;
		const localZ = dx * sinR + dz * cosR;
		if (Math.abs(localX) <= 2.4 && Math.abs(localZ) <= 2.8) {
			racer.turboTimer = 1.35;
			racer.speed = Math.max(racer.speed + 10, maxBaseSpeed * 1.18);
			if (onCollision) onCollision({
				type: "boost_pad",
				racerId: racer.id,
				x: racer.x,
				y: racer.y,
				z: racer.z
			});
			break;
		}
	}
	if (track.jumpRamps && !racer.isAirborne) for (const ramp of track.jumpRamps) {
		const dx = racer.x - ramp.x;
		const dz = racer.z - ramp.z;
		const cosR = Math.cos(-ramp.rotY);
		const sinR = Math.sin(-ramp.rotY);
		const localX = dx * cosR - dz * sinR;
		const localZ = dx * sinR + dz * cosR;
		if (Math.abs(localX) <= ramp.width * .5 + 1.2 && Math.abs(localZ) <= 3.2) {
			racer.isAirborne = true;
			racer.vy = ramp.jumpForce || 22;
			racer.speed = Math.max(racer.speed + (ramp.boostBonus || 12), maxBaseSpeed * 1.32);
			racer.turboTimer = Math.max(racer.turboTimer, 1.4);
			racer.airTime = 0;
			racer.stuntTimer = 0;
			racer.stuntType = null;
			racer.stuntCompleted = false;
			if (onCollision) onCollision({
				type: "jump_ramp",
				racerId: racer.id,
				x: racer.x,
				y: racer.y,
				z: racer.z
			});
			break;
		}
	}
	if (track.stuntRings) for (const ring of track.stuntRings) {
		if (ring.collectedBy.includes(racer.id)) continue;
		if ((racer.x - ring.x) ** 2 + (racer.y - ring.y) ** 2 + (racer.z - ring.z) ** 2 < (ring.radius + 1.8) ** 2) {
			ring.collectedBy.push(racer.id);
			racer.turboTimer = 2.2;
			racer.speed = Math.max(racer.speed + 14, maxBaseSpeed * 1.38);
			if (onCollision) onCollision({
				type: "stunt_ring",
				racerId: racer.id,
				x: ring.x,
				y: ring.y,
				z: ring.z
			});
			break;
		}
	}
	if (track.hazards && racer.spinTimer <= 0) for (const hazard of track.hazards) {
		if (!hazard.active) continue;
		if (Math.hypot(racer.x - hazard.x, racer.y - hazard.y, racer.z - hazard.z) < hazard.radius + 1.25) {
			if (racer.starTimer > 0) continue;
			else if (racer.hasShield) {
				racer.hasShield = false;
				racer.shieldTimer = 0;
			} else {
				racer.spinTimer = 1.4;
				racer.speed = Math.min(racer.speed * .22, 5);
				racer.driftChargeTime = 0;
				if (onCollision) onCollision({
					type: "hazard_hit",
					racerId: racer.id,
					x: hazard.x,
					y: hazard.y,
					z: hazard.z,
					hazardName: hazard.name
				});
			}
			break;
		}
	}
	if (racer.itemBoxCooldown && racer.itemBoxCooldown > 0) racer.itemBoxCooldown -= dt;
	if (racer.currentItem == null && (!racer.itemBoxCooldown || racer.itemBoxCooldown <= 0)) {
		const hitR = 3.4;
		const hitRSq = hitR * hitR;
		let bestBox = null;
		let bestD = hitRSq;
		for (const box of track.itemBoxes) {
			if (!box.active) continue;
			const dx = racer.x - box.x;
			const dz = racer.z - box.z;
			const dSq = dx * dx + dz * dz;
			if (dSq < bestD) {
				bestD = dSq;
				bestBox = box;
			}
		}
		if (bestBox) {
			bestBox.active = false;
			bestBox.respawnTime = 7;
			bestBox.mesh.visible = false;
			racer.itemBoxCooldown = 1.2;
			racer.currentItem = getRandomPowerUp(Math.max(1, racer.position || 1), 6);
			if (onCollision) onCollision({
				type: "item_box",
				racerId: racer.id,
				x: bestBox.x,
				y: bestBox.y,
				z: bestBox.z
			});
		}
	}
	track.boostPads.forEach((pad) => {
		if (Math.hypot(racer.x - pad.x, (racer.y - pad.y) * 1.5, racer.z - pad.z) < 4.8) {
			racer.turboTimer = 2.2;
			racer.speed = Math.max(racer.speed + 10, maxBaseSpeed * 1.34);
			if (onCollision) onCollision({
				type: "boost_pad",
				racerId: racer.id,
				x: pad.x,
				y: pad.y,
				z: pad.z
			});
		}
	});
	if (racer.shieldTimer > 0) {
		racer.shieldTimer -= dt;
		if (racer.shieldTimer <= 0) racer.hasShield = false;
	}
	if (racer.speechTimer && racer.speechTimer > 0) {
		racer.speechTimer -= dt;
		if (racer.speechTimer <= 0) racer.speechText = void 0;
	}
	racer.wheelRot += racer.speed / .38 * dt;
	racer.bounceOffset = 0;
}
/**
* Handles elastic collision between two cartoon cars (Smooth Bumping!)
*/
function resolveCarCarCollisions(racers, dt, onCollision) {
	const carRadius = 1.35;
	for (let i = 0; i < racers.length; i++) for (let j = i + 1; j < racers.length; j++) {
		const a = racers[i];
		const b = racers[j];
		const dx = b.x - a.x;
		const dz = b.z - a.z;
		const dist = Math.hypot(dx, dz);
		if (dist < carRadius * 2 && dist > .001) {
			const overlap = carRadius * 2 - dist;
			const nx = dx / dist;
			const nz = dz / dist;
			const pushDist = Math.min(overlap * .5, .25);
			a.x -= nx * pushDist;
			a.z -= nz * pushDist;
			b.x += nx * pushDist;
			b.z += nz * pushDist;
			const relSpeed = a.speed - b.speed;
			a.speed -= relSpeed * .2;
			b.speed += relSpeed * .2;
			if (a.starTimer > 0 && !(b.starTimer > 0)) {
				b.spinTimer = 1.6;
				b.speed *= .15;
			} else if (b.starTimer > 0 && !(a.starTimer > 0)) {
				a.spinTimer = 1.6;
				a.speed *= .15;
			} else if (a.hasShield && !b.hasShield) {
				b.spinTimer = 1.2;
				b.speed *= .2;
			} else if (b.hasShield && !a.hasShield) {
				a.spinTimer = 1.2;
				a.speed *= .2;
			}
			if (onCollision && (Math.abs(relSpeed) > 6 || Math.abs(a.speed) > 15)) onCollision({
				type: "car_bump",
				racerId: a.id,
				targetId: b.id,
				x: (a.x + b.x) * .5,
				y: (a.y + b.y) * .5,
				z: (a.z + b.z) * .5
			});
		}
	}
}
function pointToSegmentDistance(px, py, pz, ax, ay, az, bx, by, bz) {
	const abx = bx - ax;
	const aby = by - ay;
	const abz = bz - az;
	const apx = px - ax;
	const apy = py - ay;
	const apz = pz - az;
	const abLenSq = abx * abx + aby * aby + abz * abz;
	if (abLenSq < 1e-6) return Math.hypot(px - ax, py - ay, pz - az);
	const t = Math.max(0, Math.min(1, (apx * abx + apy * aby + apz * abz) / abLenSq));
	const projX = ax + t * abx;
	const projY = ay + t * aby;
	const projZ = az + t * abz;
	return Math.hypot(px - projX, py - projY, pz - projZ);
}
/**
* Updates projectiles (Rockets, Blue Rockets, Plasma, Freeze Ray, Thunderclouds, Bananas, Mines, Vortex, Oil Slicks)
* - Rockets: the ONLY guided/homing projectiles (follow road spline & steer towards target)
* - Plasma Cannon: ultra-fast straight energy railgun beam that pierces through multiple cars in crosshairs
* - Freeze Ray: rapid straight cryo-shard blast that encases victim in frictionless ice
* - Swept capsule collision ensures 100% reliable hits with zero tunneling
*/
function updateProjectiles(projectiles, racers, track, dt, onCollision) {
	const trackLength = track?.curve?.getLength() || 2700;
	const upVec = new Vector3(0, 1, 0);
	for (let i = projectiles.length - 1; i >= 0; i--) {
		const p = projectiles[i];
		if (!p.active) continue;
		p.life -= dt;
		if (p.life <= 0) {
			p.active = false;
			continue;
		}
		p.prevX = p.x;
		p.prevY = p.y;
		p.prevZ = p.z;
		if (p.type === "rocket") {
			if (p.trackT === void 0 && track && track.curve) {
				const info = track.getTrackInfo(new Vector3(p.x, p.y, p.z));
				p.trackT = info.t;
				p.lateralOffset = MathUtils.clamp(info.signedDistance, -track.trackWidth * .42, track.trackWidth * .42);
			}
			let target = p.targetId ? racers.find((r) => r.id === p.targetId && !r.finished) : void 0;
			if (!target) {
				let bestDist = 120;
				for (const r of racers) {
					if (r.id === p.ownerId || r.finished) continue;
					const d = Math.hypot(r.x - p.x, r.z - p.z);
					if (d < bestDist) {
						bestDist = d;
						target = r;
					}
				}
				if (target) p.targetId = target.id;
			}
			const speed = 72;
			if (track && track.curve && p.trackT !== void 0) {
				const stepT = speed * dt / trackLength;
				p.trackT = (p.trackT + stepT) % 1;
				const centerPt = track.curve.getPointAt(p.trackT);
				const tangent = track.curve.getTangentAt(p.trackT).normalize();
				const right = new Vector3().crossVectors(tangent, upVec).normalize();
				if (target) {
					const targetInfo = track.getTrackInfo(new Vector3(target.x, target.y, target.z));
					const targetOffset = MathUtils.clamp(targetInfo.signedDistance, -track.trackWidth * .44, track.trackWidth * .44);
					p.lateralOffset = MathUtils.lerp(p.lateralOffset || 0, targetOffset, dt * 10);
				}
				p.x = centerPt.x + right.x * (p.lateralOffset || 0);
				p.y = centerPt.y + .65;
				p.z = centerPt.z + right.z * (p.lateralOffset || 0);
				p.vx = tangent.x * speed;
				p.vy = tangent.y * speed;
				p.vz = tangent.z * speed;
			} else {
				if (target) {
					const toTarget = new Vector3(target.x - p.x, target.y + .5 - p.y, target.z - p.z).normalize();
					p.vx = MathUtils.lerp(p.vx, toTarget.x * speed, dt * 8);
					p.vy = MathUtils.lerp(p.vy, toTarget.y * speed, dt * 8);
					p.vz = MathUtils.lerp(p.vz, toTarget.z * speed, dt * 8);
				}
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				p.z += p.vz * dt;
			}
			for (const racer of racers) {
				if (racer.id === p.ownerId && p.life > 3.8) continue;
				if (pointToSegmentDistance(racer.x, racer.y + .5, racer.z, p.prevX, p.prevY, p.prevZ, p.x, p.y, p.z) < 3.8) {
					p.active = false;
					if (racer.starTimer > 0) {} else if (racer.hasShield) {
						racer.hasShield = false;
						racer.shieldTimer = 0;
					} else {
						racer.spinTimer = 1.8;
						racer.speed *= .15;
					}
					onCollision({
						type: "rocket_hit",
						racerId: p.ownerId,
						targetId: racer.id,
						x: racer.x,
						y: racer.y + .5,
						z: racer.z
					});
					break;
				}
			}
		} else if (p.type === "blue_rocket") {
			if (p.trackT === void 0 && track && track.curve) {
				p.trackT = track.getTrackInfo(new Vector3(p.x, p.y, p.z)).t;
				p.lateralOffset = 0;
			}
			let target = racers.find((r) => r.position === 1 && r.id !== p.ownerId && !r.finished);
			if (!target) target = racers.find((r) => r.position === 2 && r.id !== p.ownerId && !r.finished);
			if (!target) target = racers.find((r) => r.id !== p.ownerId && !r.finished);
			const chaseSpeed = 96;
			if (track && track.curve && p.trackT !== void 0) {
				const stepT = chaseSpeed * dt / trackLength;
				p.trackT = (p.trackT + stepT) % 1;
				const centerPt = track.curve.getPointAt(p.trackT);
				const tangent = track.curve.getTangentAt(p.trackT).normalize();
				let distToTarget = 999;
				if (target) distToTarget = Math.hypot(target.x - centerPt.x, target.z - centerPt.z);
				if (target && distToTarget < 24) {
					p.x = MathUtils.lerp(p.x, target.x, dt * 16);
					p.z = MathUtils.lerp(p.z, target.z, dt * 16);
					p.y = MathUtils.lerp(p.y, target.y + .6, dt * 12);
				} else {
					p.x = centerPt.x;
					p.y = centerPt.y + 1.8 + Math.sin(p.life * 12) * .2;
					p.z = centerPt.z;
				}
				p.vx = tangent.x * chaseSpeed;
				p.vy = tangent.y * chaseSpeed;
				p.vz = tangent.z * chaseSpeed;
				if (target && distToTarget < 3.8) {
					p.active = false;
					if (!(target.starTimer > 0)) {
						if (target.hasShield) {
							target.hasShield = false;
							target.shieldTimer = 0;
						} else {
							target.spinTimer = 2.8;
							target.speed = 0;
						}
					}
					for (const other of racers) {
						if (other.id === target.id) continue;
						if (Math.hypot(other.x - p.x, other.z - p.z) < 8.5 && !(other.starTimer > 0)) {
							if (other.hasShield) {
								other.hasShield = false;
								other.shieldTimer = 0;
							} else {
								other.spinTimer = 1.6;
								other.speed *= .3;
							}
						}
					}
					onCollision({
						type: "blue_rocket_hit",
						racerId: p.ownerId,
						targetId: target.id,
						x: target.x,
						y: target.y + .6,
						z: target.z
					});
				}
			} else {
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				p.z += p.vz * dt;
			}
		} else if (p.type === "plasma_cannon") {
			if (p.trackT === void 0 && track && track.curve) {
				const info = track.getTrackInfo(new Vector3(p.x, p.y, p.z));
				p.trackT = info.t;
				p.lateralOffset = MathUtils.clamp(info.signedDistance, -track.trackWidth * .44, track.trackWidth * .44);
				let angleDiff = Math.atan2(p.vx, p.vz) - Math.atan2(info.tangent.x, info.tangent.z);
				while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
				while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
				p.lateralSpeed = MathUtils.clamp(Math.sin(angleDiff) * 55, -20, 20);
			}
			const beamSpeed = 110;
			if (track && track.curve && p.trackT !== void 0) {
				const stepT = beamSpeed * dt / trackLength;
				p.trackT = (p.trackT + stepT) % 1;
				p.lateralOffset = (p.lateralOffset || 0) + (p.lateralSpeed || 0) * dt;
				const maxLat = track.trackWidth * .44;
				if (p.lateralOffset > maxLat) {
					p.lateralOffset = maxLat;
					p.lateralSpeed = -Math.abs(p.lateralSpeed || 12);
				} else if (p.lateralOffset < -maxLat) {
					p.lateralOffset = -maxLat;
					p.lateralSpeed = Math.abs(p.lateralSpeed || 12);
				}
				const centerPt = track.curve.getPointAt(p.trackT);
				const tangent = track.curve.getTangentAt(p.trackT).normalize();
				const right = new Vector3().crossVectors(tangent, upVec).normalize();
				p.x = centerPt.x + right.x * (p.lateralOffset || 0);
				p.y = centerPt.y + .65;
				p.z = centerPt.z + right.z * (p.lateralOffset || 0);
				p.vx = tangent.x * beamSpeed;
				p.vy = tangent.y * beamSpeed;
				p.vz = tangent.z * beamSpeed;
			} else {
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				p.z += p.vz * dt;
			}
			p.hitIds = p.hitIds || [];
			for (const racer of racers) {
				if (racer.finished) continue;
				if (racer.id === p.ownerId && p.life > 2.2) continue;
				if (p.hitIds.includes(racer.id)) continue;
				const dist = pointToSegmentDistance(racer.x, racer.y + .5, racer.z, p.prevX, p.prevY, p.prevZ, p.x, p.y, p.z);
				const directDist = Math.hypot(racer.x - p.x, racer.z - p.z);
				if (dist < 4.6 || directDist < 4.6) {
					p.hitIds.push(racer.id);
					if (racer.starTimer > 0) {} else if (racer.hasShield) {
						racer.hasShield = false;
						racer.shieldTimer = 0;
					} else {
						racer.spinTimer = 1.6;
						racer.speed *= .2;
					}
					onCollision({
						type: "plasma_hit",
						racerId: p.ownerId,
						targetId: racer.id,
						x: racer.x,
						y: racer.y + .5,
						z: racer.z
					});
				}
			}
		} else if (p.type === "freezeray") {
			if (p.trackT === void 0 && track && track.curve) {
				const info = track.getTrackInfo(new Vector3(p.x, p.y, p.z));
				p.trackT = info.t;
				p.lateralOffset = MathUtils.clamp(info.signedDistance, -track.trackWidth * .44, track.trackWidth * .44);
				let angleDiff = Math.atan2(p.vx, p.vz) - Math.atan2(info.tangent.x, info.tangent.z);
				while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
				while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
				p.lateralSpeed = MathUtils.clamp(Math.sin(angleDiff) * 45, -16, 16);
			}
			const freezeSpeed = 85;
			if (track && track.curve && p.trackT !== void 0) {
				const stepT = freezeSpeed * dt / trackLength;
				p.trackT = (p.trackT + stepT) % 1;
				p.lateralOffset = (p.lateralOffset || 0) + (p.lateralSpeed || 0) * dt;
				const maxLat = track.trackWidth * .44;
				if (p.lateralOffset > maxLat) {
					p.lateralOffset = maxLat;
					p.lateralSpeed = -Math.abs(p.lateralSpeed || 10);
				} else if (p.lateralOffset < -maxLat) {
					p.lateralOffset = -maxLat;
					p.lateralSpeed = Math.abs(p.lateralSpeed || 10);
				}
				const centerPt = track.curve.getPointAt(p.trackT);
				const tangent = track.curve.getTangentAt(p.trackT).normalize();
				const right = new Vector3().crossVectors(tangent, upVec).normalize();
				p.x = centerPt.x + right.x * (p.lateralOffset || 0);
				p.y = centerPt.y + .65;
				p.z = centerPt.z + right.z * (p.lateralOffset || 0);
				p.vx = tangent.x * freezeSpeed;
				p.vy = tangent.y * freezeSpeed;
				p.vz = tangent.z * freezeSpeed;
			} else {
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				p.z += p.vz * dt;
			}
			for (const racer of racers) {
				if (racer.finished) continue;
				if (racer.id === p.ownerId && p.life > 3.1) continue;
				const dist = pointToSegmentDistance(racer.x, racer.y + .5, racer.z, p.prevX, p.prevY, p.prevZ, p.x, p.y, p.z);
				const directDist = Math.hypot(racer.x - p.x, racer.z - p.z);
				if (dist < 4.4 || directDist < 4.4) {
					p.active = false;
					if (racer.starTimer > 0) {} else if (racer.hasShield) {
						racer.hasShield = false;
						racer.shieldTimer = 0;
					} else {
						racer.frozenTimer = 3.5;
						racer.spinTimer = .8;
						racer.speed = Math.min(racer.speed * .32, 10);
					}
					onCollision({
						type: "freezeray_hit",
						racerId: p.ownerId,
						targetId: racer.id,
						x: racer.x,
						y: racer.y + .5,
						z: racer.z
					});
					break;
				}
			}
		} else if (p.type === "thundercloud") {
			p.state = p.state || "idle";
			if (p.state === "idle") {
				p.y += Math.sin((60 - p.life) * 3) * .002;
				for (const racer of racers) {
					if (racer.id === p.ownerId && p.life > 57.5) continue;
					if (Math.hypot(racer.x - p.x, racer.z - p.z) < 12) {
						p.state = "chasing";
						p.targetId = racer.id;
						p.timer = 3;
						break;
					}
				}
			} else if (p.state === "chasing") {
				let target = racers.find((r) => r.id === p.targetId && !r.finished);
				if (!target) {
					let best = 45;
					for (const r of racers) {
						if (r.id === p.ownerId || r.finished) continue;
						const d = Math.hypot(r.x - p.x, r.z - p.z);
						if (d < best) {
							best = d;
							target = r;
						}
					}
					if (target) p.targetId = target.id;
				}
				if (target) {
					p.x = MathUtils.lerp(p.x, target.x, dt * 14);
					p.y = MathUtils.lerp(p.y, target.y + 2.5, dt * 12);
					p.z = MathUtils.lerp(p.z, target.z, dt * 14);
					p.timer = (p.timer || 3) - dt;
					if (p.timer <= 0) {
						p.active = false;
						if (target.starTimer > 0) {} else if (target.hasShield) {
							target.hasShield = false;
							target.shieldTimer = 0;
						} else {
							target.spinTimer = 2.4;
							target.frozenTimer = 3.2;
							target.speed *= .2;
						}
						onCollision({
							type: "thundercloud_strike",
							racerId: p.ownerId,
							targetId: target.id,
							x: target.x,
							y: target.y,
							z: target.z
						});
					}
				} else p.active = false;
			}
		} else if (p.type === "banana") for (const racer of racers) {
			if (racer.id === p.ownerId && p.life > 28.5) continue;
			if (pointToSegmentDistance(racer.x, racer.y + .3, racer.z, p.prevX, p.prevY, p.prevZ, p.x, p.y, p.z) < 2.5) {
				p.active = false;
				if (racer.starTimer > 0) {} else if (racer.hasShield) {
					racer.hasShield = false;
					racer.shieldTimer = 0;
				} else {
					racer.spinTimer = 1.8;
					racer.speed *= .35;
				}
				onCollision({
					type: "banana_hit",
					racerId: p.ownerId,
					targetId: racer.id,
					x: p.x,
					y: p.y,
					z: p.z
				});
				break;
			}
		}
		else if (p.type === "mine") for (const racer of racers) {
			if (racer.id === p.ownerId && p.life > 14.5) continue;
			if (pointToSegmentDistance(racer.x, racer.y + .3, racer.z, p.prevX, p.prevY, p.prevZ, p.x, p.y, p.z) < 2.8) {
				p.active = false;
				if (racer.starTimer > 0) {} else if (racer.hasShield) {
					racer.hasShield = false;
					racer.shieldTimer = 0;
				} else {
					racer.spinTimer = 2.2;
					racer.speed *= .1;
				}
				onCollision({
					type: "mine_hit",
					racerId: p.ownerId,
					targetId: racer.id,
					x: p.x,
					y: p.y,
					z: p.z
				});
				break;
			}
		}
		else if (p.type === "vortex") {
			p.absorbed = p.absorbed || 0;
			for (const racer of racers) {
				if (racer.finished) continue;
				if (racer.id === p.ownerId && p.life > 8) continue;
				const dx = p.x - racer.x;
				const dz = p.z - racer.z;
				const dist = Math.hypot(dx, dz);
				if (dist < 18 && dist > .05 && !(racer.starTimer > 0)) {
					const pullIntensity = (1 - dist / 18) * 20 * dt;
					racer.x += dx / dist * pullIntensity;
					racer.z += dz / dist * pullIntensity;
					if (dist < 2.8) {
						if (racer.hasShield) {
							racer.hasShield = false;
							racer.shieldTimer = 0;
						} else {
							racer.spinTimer = Math.max(racer.spinTimer || 0, 2.2);
							racer.speed *= .15;
						}
						onCollision({
							type: "vortex_suck",
							racerId: p.ownerId,
							targetId: racer.id,
							x: p.x,
							y: p.y + .4,
							z: p.z
						});
						p.absorbed++;
						if (p.absorbed >= 2) {
							p.active = false;
							break;
						}
					}
				}
			}
		} else if (p.type === "oil_slick") {
			p.slipCount = p.slipCount || 0;
			for (const racer of racers) {
				if (racer.finished) continue;
				if (racer.id === p.ownerId && p.life > 33.5) continue;
				if (Math.hypot(racer.x - p.x, racer.z - p.z) < 3.2) {
					if (racer.starTimer > 0) {} else {
						racer.spinTimer = Math.max(racer.spinTimer || 0, 2.4);
						racer.speed *= .45;
					}
					onCollision({
						type: "oil_slip",
						racerId: p.ownerId,
						targetId: racer.id,
						x: p.x,
						y: p.y + .1,
						z: p.z
					});
					p.slipCount++;
					if (p.slipCount >= 3) {
						p.active = false;
						break;
					}
				}
			}
		}
	}
}
/**
* Arcade slipstream: slight speed bonus when drafting behind another car
*/
function applySlipstream(racers, dt) {
	for (let i = 0; i < racers.length; i++) {
		const r = racers[i];
		if (r.finished || r.spinTimer > 0) continue;
		let best = 0;
		for (let j = 0; j < racers.length; j++) {
			if (i === j) continue;
			const o = racers[j];
			const dx = o.x - r.x;
			const dz = o.z - r.z;
			const dist = Math.hypot(dx, dz);
			if (dist < 3.5 || dist > 14) continue;
			const fwdX = Math.sin(r.rotY);
			const fwdZ = Math.cos(r.rotY);
			if ((dx * fwdX + dz * fwdZ) / dist < .65) continue;
			best = Math.max(best, 1 - (dist - 3.5) / 10.5);
		}
		if (best > .05) {
			r.speed += 6.5 * best * dt;
			r.inSlipstream = true;
		} else r.inSlipstream = false;
	}
}
var AI_TAUNTS = [
	"Söö mu tolmu! 💨",
	"Vaata ja õpi! 😎",
	"Puhas kiirus! ⚡",
	"Ei saa kätte! 😜",
	"Võta see! 🚀",
	"Hoia alt! 💥",
	"Ops, vabandust! 😈"
];
function createAIControllers(racers) {
	const map = /* @__PURE__ */ new Map();
	racers.filter((r) => r.isAI).forEach((r, idx) => {
		const laneOptions = [
			-3.8,
			-1.8,
			0,
			1.8,
			3.8
		];
		const chosenLane = laneOptions[idx % laneOptions.length];
		map.set(r.id, {
			racerId: r.id,
			laneOffset: chosenLane,
			targetLane: chosenLane,
			aggression: .65 + Math.random() * .35,
			itemCooldown: 1.5 + Math.random() * 2.5,
			tauntCooldown: 6 + Math.random() * 8,
			reactionTimer: 0
		});
	});
	return map;
}
var _aiCarPos = new Vector3();
var _aiDesiredTarget = new Vector3();
var _aiToTarget = new Vector3();
/**
* Calculates smooth, intelligent AI inputs (throttle, steer, drift, useItem, overtaking)
*/
function computeAIInput(racer, aiCtrl, track, allRacers, dt, onUseItem) {
	aiCtrl.itemCooldown -= dt;
	aiCtrl.tauntCooldown -= dt;
	aiCtrl.reactionTimer -= dt;
	_aiCarPos.set(racer.x, racer.y, racer.z);
	const baseT = racer.trackT !== void 0 && !isNaN(racer.trackT) ? racer.trackT : racer.checkpointIndex / Math.max(1, track.checkpoints.length);
	const trackTangent = track.getCenterlinePointAt(baseT).tangent;
	let headingDiff = Math.atan2(trackTangent.x, trackTangent.z) - racer.rotY;
	while (headingDiff > Math.PI) headingDiff -= Math.PI * 2;
	while (headingDiff < -Math.PI) headingDiff += Math.PI * 2;
	if (Math.abs(headingDiff) > 1.95 || racer.isWrongWay) {
		const recoverySteer = headingDiff > 0 ? 1 : -1;
		return {
			throttle: racer.speed < 12 ? .9 : .4,
			brake: racer.speed > 20 ? .3 : 0,
			steer: recoverySteer,
			drift: false,
			useItem: false,
			honk: false
		};
	}
	if (aiCtrl.reactionTimer <= 0) {
		aiCtrl.reactionTimer = .35 + Math.random() * .3;
		if (allRacers.find((other) => {
			if (other.id === racer.id) return false;
			const dx = other.x - racer.x;
			const dz = other.z - racer.z;
			if (Math.hypot(dx, dz) < 9) {
				let diff = Math.abs(Math.atan2(dx, dz) - racer.rotY);
				while (diff > Math.PI) diff = Math.PI * 2 - diff;
				return diff < .4;
			}
			return false;
		})) aiCtrl.targetLane = aiCtrl.laneOffset > 0 ? -2.6 : 2.6;
	}
	aiCtrl.laneOffset = MathUtils.lerp(aiCtrl.laneOffset, aiCtrl.targetLane, dt * 2.8);
	const lookaheadT = ((baseT + MathUtils.clamp(racer.speed * .5 + 12, 12, 28) / 2900) % 1 + 1) % 1;
	const targetPt = track.getCenterlinePointAt(lookaheadT);
	const targetTangent = targetPt.tangent;
	const targetRight = targetPt.right;
	const safeLane = MathUtils.clamp(aiCtrl.laneOffset, -4.5, 4.5);
	_aiDesiredTarget.copy(targetPt.point).addScaledVector(targetRight, safeLane);
	_aiToTarget.subVectors(_aiDesiredTarget, _aiCarPos);
	let angleDiff = Math.atan2(_aiToTarget.x, _aiToTarget.z) - racer.rotY;
	while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
	while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
	const steer = MathUtils.clamp(angleDiff * 2.8, -1, 1);
	const curveAheadT = ((lookaheadT + .04) % 1 + 1) % 1;
	const curveAheadPoint = track.getCenterlinePointAt(curveAheadT);
	const turnDot = targetTangent.dot(curveAheadPoint.tangent);
	const turnSharpness = Math.max(0, 1 - turnDot);
	let throttle = 1;
	let brake = 0;
	if (turnSharpness > .07 && racer.speed > 17) {
		throttle = MathUtils.lerp(1, .5, (racer.speed - 17) / 7);
		if (racer.speed > 21) brake = .25;
	}
	const drift = (turnSharpness > .05 || Math.abs(angleDiff) > .28) && racer.speed > 11 && (aiCtrl.aggression > .35 || Math.random() < .75);
	let useItem = false;
	if (racer.currentItem && aiCtrl.itemCooldown <= 0) {
		const item = racer.currentItem;
		if (item === "turbo") {
			if (Math.abs(angleDiff) < .25) {
				useItem = true;
				aiCtrl.itemCooldown = 2;
			}
		} else if (item === "rocket" || item === "trio_rockets" || item === "blue_rocket" || item === "freezeray" || item === "plasma_cannon") {
			if (allRacers.find((other) => {
				if (other.id === racer.id) return false;
				const dx = other.x - racer.x;
				const dz = other.z - racer.z;
				const dist = Math.hypot(dx, dz);
				if (dist > 6 && dist < (item === "blue_rocket" ? 120 : item === "plasma_cannon" ? 70 : 55)) {
					let diff = Math.abs(Math.atan2(dx, dz) - racer.rotY);
					while (diff > Math.PI) diff = Math.PI * 2 - diff;
					return diff < (item === "blue_rocket" ? 1.2 : item === "plasma_cannon" ? .65 : .55);
				}
				return false;
			}) || item === "blue_rocket" && racer.position > 1 || item === "plasma_cannon" && Math.random() < .5) {
				useItem = true;
				aiCtrl.itemCooldown = 2.8;
				racer.speechText = item === "blue_rocket" ? "Sinine rakett! 🔷" : item === "plasma_cannon" ? "Plasma löök! 🔮" : "Võta see! 🚀";
				racer.speechTimer = 2;
			}
		} else if (item === "thundercloud" || item === "vortex") {
			if (racer.position >= 2 || Math.random() < .45) {
				useItem = true;
				aiCtrl.itemCooldown = 3.5;
				racer.speechText = item === "vortex" ? "Must auk! 🌀" : "Äike tuleb! ⛈️";
				racer.speechTimer = 2;
			}
		} else if (item === "banana" || item === "mine" || item === "oil_slick") {
			if (allRacers.find((other) => {
				if (other.id === racer.id) return false;
				return Math.hypot(other.x - racer.x, other.z - racer.z) < 22;
			}) || Math.random() < .35) {
				useItem = true;
				aiCtrl.itemCooldown = 2.5;
				racer.speechText = item === "oil_slick" ? "Õlilõks! 🛢️" : item === "banana" ? "Banaan! 🍌" : "Vaata ette! 💣";
				racer.speechTimer = 2;
			}
		} else if (item === "shield" || item === "star" || item === "repair") {
			useItem = true;
			aiCtrl.itemCooldown = 3.5;
		} else if (item === "lightning" || item === "anvil") {
			if (racer.position > 1) {
				useItem = true;
				aiCtrl.itemCooldown = 4;
			}
		}
	}
	if (useItem && onUseItem) onUseItem(racer.id);
	if (aiCtrl.tauntCooldown <= 0 && !racer.speechText && Math.random() < .25) {
		aiCtrl.tauntCooldown = 12 + Math.random() * 10;
		racer.speechText = AI_TAUNTS[Math.floor(Math.random() * AI_TAUNTS.length)];
		racer.speechTimer = 2.2;
	}
	return {
		throttle,
		brake,
		steer,
		drift,
		useItem,
		honk: false
	};
}
var ParticleSystem = class {
	scene;
	particleGroup;
	activeParticles = [];
	particlePool = [];
	sparkGeo;
	starGeo;
	smokeGeo;
	flameGeo;
	smokeMat;
	flameCyanMat;
	flameOrangeMat;
	sparkYellowMat;
	sparkOrangeMat;
	sparkBlueMat;
	sparkPurpleMat;
	sparkGreenMat;
	oilDarkMat;
	starMats;
	constructor(scene) {
		this.scene = scene;
		this.particleGroup = new Group();
		this.scene.add(this.particleGroup);
		this.sparkGeo = new SphereGeometry(.12, 6, 6);
		this.smokeGeo = new SphereGeometry(.22, 6, 6);
		this.flameGeo = new ConeGeometry(.2, .6, 6);
		this.flameGeo.rotateX(Math.PI / 2);
		const starShape = new Shape();
		const outerR = .28;
		const innerR = .12;
		for (let i = 0; i < 10; i++) {
			const r = i % 2 === 0 ? outerR : innerR;
			const a = i / 10 * Math.PI * 2;
			const sx = Math.cos(a) * r;
			const sy = Math.sin(a) * r;
			if (i === 0) starShape.moveTo(sx, sy);
			else starShape.lineTo(sx, sy);
		}
		this.starGeo = new ShapeGeometry(starShape);
		this.smokeMat = new MeshBasicMaterial({
			color: 13751771,
			transparent: true,
			opacity: .55,
			depthWrite: false
		});
		this.flameCyanMat = new MeshBasicMaterial({
			color: 440020,
			transparent: true,
			opacity: .85,
			depthWrite: false
		});
		this.flameOrangeMat = new MeshBasicMaterial({
			color: 16347926,
			transparent: true,
			opacity: .85,
			depthWrite: false
		});
		this.sparkYellowMat = new MeshBasicMaterial({
			color: 16436245,
			transparent: true,
			opacity: .9,
			depthWrite: false
		});
		this.sparkOrangeMat = new MeshBasicMaterial({
			color: 16347926,
			transparent: true,
			opacity: .9,
			depthWrite: false
		});
		this.sparkBlueMat = new MeshBasicMaterial({
			color: 3718648,
			transparent: true,
			opacity: .95,
			depthWrite: false
		});
		this.sparkPurpleMat = new MeshBasicMaterial({
			color: 12616956,
			transparent: true,
			opacity: .95,
			depthWrite: false
		});
		this.sparkGreenMat = new MeshBasicMaterial({
			color: 1096065,
			transparent: true,
			opacity: .95,
			depthWrite: false
		});
		this.oilDarkMat = new MeshBasicMaterial({
			color: 592139,
			transparent: true,
			opacity: .95,
			depthWrite: false
		});
		this.starMats = [
			16436245,
			15680580,
			16347926,
			16777215,
			11032055
		].map((c) => new MeshBasicMaterial({
			color: c,
			side: 2,
			transparent: true,
			opacity: .95,
			depthWrite: false
		}));
		for (let i = 0; i < 60; i++) {
			const mesh = new Mesh(this.sparkGeo, this.smokeMat);
			mesh.visible = false;
			this.particleGroup.add(mesh);
			this.particlePool.push(mesh);
		}
	}
	getWarmupMeshes() {
		const list = [
			new Mesh(this.sparkGeo, this.sparkYellowMat),
			new Mesh(this.smokeGeo, this.smokeMat),
			new Mesh(this.flameGeo, this.flameOrangeMat),
			new Mesh(this.flameGeo, this.flameCyanMat)
		];
		this.starMats.forEach((m) => list.push(new Mesh(this.starGeo, m)));
		return list;
	}
	acquireMesh(geometry, material) {
		let mesh;
		if (this.particlePool.length > 0) {
			mesh = this.particlePool.pop();
			mesh.geometry = geometry;
			mesh.material = material;
			mesh.visible = true;
		} else {
			mesh = new Mesh(geometry, material);
			this.particleGroup.add(mesh);
		}
		return mesh;
	}
	releaseMesh(mesh) {
		mesh.visible = false;
		if (this.particlePool.length < 250) this.particlePool.push(mesh);
	}
	/**
	* Spawns exhaust smoke puff
	*/
	emitExhaustSmoke(x, y, z, carRotY) {
		if (this.activeParticles.length > 80) return;
		const mesh = this.acquireMesh(this.smokeGeo, this.smokeMat);
		mesh.position.set(x + (Math.random() - .5) * .1, y + (Math.random() - .5) * .05, z + (Math.random() - .5) * .1);
		const fwdX = Math.sin(carRotY);
		const fwdZ = Math.cos(carRotY);
		this.activeParticles.push({
			mesh,
			vx: -fwdX * 1.5 + (Math.random() - .5) * .6,
			vy: .5 + Math.random() * .4,
			vz: -fwdZ * 1.5 + (Math.random() - .5) * .6,
			rotSpeed: (Math.random() - .5) * 2,
			scaleSpeed: 1.5,
			life: .45,
			maxLife: .45,
			initialScale: 1,
			baseOpacity: .55
		});
	}
	/**
	* Spawns nitro boost flame jet
	*/
	emitNitroFlame(x, y, z, carRotY) {
		if (this.activeParticles.length > 80) return;
		const mat = Math.random() > .35 ? this.flameCyanMat : this.flameOrangeMat;
		const mesh = this.acquireMesh(this.flameGeo, mat);
		mesh.position.set(x, y, z);
		mesh.rotation.y = carRotY;
		const fwdX = Math.sin(carRotY);
		const fwdZ = Math.cos(carRotY);
		this.activeParticles.push({
			mesh,
			vx: -fwdX * 6 + (Math.random() - .5) * .6,
			vy: (Math.random() - .5) * .3,
			vz: -fwdZ * 6 + (Math.random() - .5) * .6,
			rotSpeed: 0,
			scaleSpeed: .7,
			life: .18,
			maxLife: .18,
			initialScale: 1,
			baseOpacity: .85
		});
	}
	/**
	* Spawns drift sparks (yellow, orange, blue, or purple based on tier)
	*/
	emitDriftSparks(x, y, z, level) {
		if (this.activeParticles.length > 80) return;
		const count = 1;
		for (let i = 0; i < count; i++) {
			const mat = level === 3 ? this.sparkPurpleMat : level === 2 ? Math.random() > .5 ? this.sparkOrangeMat : this.sparkYellowMat : this.sparkBlueMat;
			const mesh = this.acquireMesh(this.sparkGeo, mat);
			mesh.position.set(x + (Math.random() - .5) * .2, y + .1, z + (Math.random() - .5) * .2);
			this.activeParticles.push({
				mesh,
				vx: (Math.random() - .5) * 3.5,
				vy: 1.4 + Math.random() * 2.2,
				vz: (Math.random() - .5) * 3.5,
				rotSpeed: (Math.random() - .5) * 5,
				scaleSpeed: -.5,
				life: .3,
				maxLife: .3,
				initialScale: .9,
				baseOpacity: .9
			});
		}
	}
	/**
	* Spawns bump / collision sparks
	*/
	emitSparks(x, y, z, colorHex = 16766720, count = 6) {
		for (let i = 0; i < Math.min(count, 8); i++) {
			const mat = Math.random() > .5 ? this.sparkYellowMat : this.sparkOrangeMat;
			const mesh = this.acquireMesh(this.sparkGeo, mat);
			mesh.position.set(x, y, z);
			const angle = Math.random() * Math.PI * 2;
			const speed = 2.5 + Math.random() * 4;
			this.activeParticles.push({
				mesh,
				vx: Math.cos(angle) * speed,
				vy: 1.2 + Math.random() * 2.5,
				vz: Math.sin(angle) * speed,
				rotSpeed: 0,
				scaleSpeed: -.4,
				life: .28,
				maxLife: .28,
				initialScale: 1,
				baseOpacity: .9
			});
		}
	}
	/**
	* Spawns explosion burst of comic stars & smoke clouds
	*/
	emitExplosion(x, y, z) {
		for (let i = 0; i < 12; i++) {
			const mat = this.starMats[i % this.starMats.length];
			const mesh = this.acquireMesh(this.starGeo, mat);
			mesh.position.set(x, y + .5, z);
			const angle = i / 12 * Math.PI * 2 + Math.random() * .3;
			const speed = 5 + Math.random() * 6;
			this.activeParticles.push({
				mesh,
				vx: Math.cos(angle) * speed,
				vy: 2 + Math.random() * 4,
				vz: Math.sin(angle) * speed,
				rotSpeed: (Math.random() - .5) * 8,
				scaleSpeed: -.6,
				life: .45,
				maxLife: .45,
				initialScale: 1.2,
				baseOpacity: .95
			});
		}
		for (let i = 0; i < 6; i++) {
			const mesh = this.acquireMesh(this.smokeGeo, this.smokeMat);
			mesh.position.set(x + (Math.random() - .5) * .8, y + .4 + Math.random() * .5, z + (Math.random() - .5) * .8);
			this.activeParticles.push({
				mesh,
				vx: (Math.random() - .5) * 3,
				vy: 1.5 + Math.random() * 2,
				vz: (Math.random() - .5) * 3,
				rotSpeed: (Math.random() - .5) * 2,
				scaleSpeed: 2.2,
				life: .6,
				maxLife: .6,
				initialScale: 1.4,
				baseOpacity: .6
			});
		}
	}
	/**
	* Spawns massive blue rocket explosion
	*/
	emitBlueExplosion(x, y, z) {
		for (let i = 0; i < 24; i++) {
			const mat = i % 2 === 0 ? this.sparkBlueMat : this.flameCyanMat;
			const mesh = this.acquireMesh(this.starGeo, mat);
			mesh.position.set(x, y + .8, z);
			const angle = i / 24 * Math.PI * 2 + Math.random() * .2;
			const speed = 7 + Math.random() * 9;
			this.activeParticles.push({
				mesh,
				vx: Math.cos(angle) * speed,
				vy: 3 + Math.random() * 6,
				vz: Math.sin(angle) * speed,
				rotSpeed: (Math.random() - .5) * 10,
				scaleSpeed: -.5,
				life: .65,
				maxLife: .65,
				initialScale: 1.8,
				baseOpacity: 1
			});
		}
		for (let i = 0; i < 12; i++) {
			const mesh = this.acquireMesh(this.smokeGeo, this.smokeMat);
			mesh.position.set(x + (Math.random() - .5) * 1.5, y + .5 + Math.random() * .8, z + (Math.random() - .5) * 1.5);
			this.activeParticles.push({
				mesh,
				vx: (Math.random() - .5) * 5,
				vy: 2 + Math.random() * 3,
				vz: (Math.random() - .5) * 5,
				rotSpeed: (Math.random() - .5) * 3,
				scaleSpeed: 2.8,
				life: .75,
				maxLife: .75,
				initialScale: 1.8,
				baseOpacity: .7
			});
		}
	}
	/**
	* Spawns vertical lightning bolt and electric ground shockwave
	*/
	emitLightning(x, y, z) {
		for (let step = 0; step < 10; step++) {
			const mat = step % 2 === 0 ? this.sparkBlueMat : this.sparkPurpleMat;
			const mesh = this.acquireMesh(this.sparkGeo, mat);
			const boltY = y + step * .35;
			const jitterX = (Math.random() - .5) * .4;
			const jitterZ = (Math.random() - .5) * .4;
			mesh.position.set(x + jitterX, boltY, z + jitterZ);
			this.activeParticles.push({
				mesh,
				vx: (Math.random() - .5) * 1.5,
				vy: (Math.random() - .5) * 1.5,
				vz: (Math.random() - .5) * 1.5,
				rotSpeed: 0,
				scaleSpeed: .8,
				life: .35,
				maxLife: .35,
				initialScale: 1.5,
				baseOpacity: 1
			});
		}
		for (let i = 0; i < 14; i++) {
			const mat = i % 2 === 0 ? this.sparkPurpleMat : this.flameCyanMat;
			const mesh = this.acquireMesh(this.sparkGeo, mat);
			mesh.position.set(x, y + .2, z);
			const a = i / 14 * Math.PI * 2;
			const spd = 4 + Math.random() * 5;
			this.activeParticles.push({
				mesh,
				vx: Math.cos(a) * spd,
				vy: 1.5 + Math.random() * 3.5,
				vz: Math.sin(a) * spd,
				rotSpeed: 0,
				scaleSpeed: -.5,
				life: .4,
				maxLife: .4,
				initialScale: 1.2,
				baseOpacity: .95
			});
		}
	}
	/**
	* Spawns ominous rain/electric sparks under active thundercloud
	*/
	emitCloudSparks(x, y, z) {
		if (this.activeParticles.length > 80) return;
		const mat = Math.random() > .5 ? this.sparkPurpleMat : this.flameCyanMat;
		const mesh = this.acquireMesh(this.sparkGeo, mat);
		mesh.position.set(x + (Math.random() - .5) * .7, y - .2, z + (Math.random() - .5) * .7);
		this.activeParticles.push({
			mesh,
			vx: (Math.random() - .5) * .8,
			vy: -2.5 - Math.random() * 2,
			vz: (Math.random() - .5) * .8,
			rotSpeed: 0,
			scaleSpeed: -.4,
			life: .22,
			maxLife: .22,
			initialScale: .8,
			baseOpacity: .9
		});
	}
	/**
	* Spawns rainbow sparkle trail for Super Star invincibility
	*/
	emitStarAura(x, y, z) {
		if (this.activeParticles.length > 80) return;
		const mat = this.starMats[Math.floor(Math.random() * this.starMats.length)];
		const mesh = this.acquireMesh(this.starGeo, mat);
		mesh.position.set(x + (Math.random() - .5) * .8, y + .3 + Math.random() * .6, z + (Math.random() - .5) * .8);
		this.activeParticles.push({
			mesh,
			vx: (Math.random() - .5) * 2,
			vy: 1.5 + Math.random() * 2,
			vz: (Math.random() - .5) * 2,
			rotSpeed: (Math.random() - .5) * 6,
			scaleSpeed: -.5,
			life: .3,
			maxLife: .3,
			initialScale: 1,
			baseOpacity: .95
		});
	}
	/**
	* Spawns item box shatter celebration particles
	*/
	emitBoxBreak(x, y, z) {
		for (let i = 0; i < 10; i++) {
			const mat = this.starMats[i % this.starMats.length];
			const mesh = this.acquireMesh(this.starGeo, mat);
			mesh.position.set(x, y + .5, z);
			const angle = i / 10 * Math.PI * 2 + Math.random() * .2;
			const speed = 3.5 + Math.random() * 3.5;
			this.activeParticles.push({
				mesh,
				vx: Math.cos(angle) * speed,
				vy: 2.5 + Math.random() * 2.5,
				vz: Math.sin(angle) * speed,
				rotSpeed: (Math.random() - .5) * 6,
				scaleSpeed: -.4,
				life: .4,
				maxLife: .4,
				initialScale: .8,
				baseOpacity: .95
			});
		}
	}
	emitIceCrystals(x, y, z) {
		for (let i = 0; i < 14; i++) {
			const mesh = this.acquireMesh(this.starGeo, this.sparkBlueMat);
			mesh.position.set(x + (Math.random() - .5) * 1.5, y + .3 + Math.random() * 1.2, z + (Math.random() - .5) * 1.5);
			const angle = Math.random() * Math.PI * 2;
			const spd = 2 + Math.random() * 4;
			this.activeParticles.push({
				mesh,
				vx: Math.cos(angle) * spd,
				vy: 1.5 + Math.random() * 3,
				vz: Math.sin(angle) * spd,
				rotSpeed: (Math.random() - .5) * 8,
				scaleSpeed: -.5,
				life: .65,
				maxLife: .65,
				initialScale: 1.2,
				baseOpacity: .95
			});
		}
	}
	emitVortexSwirl(x, y, z) {
		for (let i = 0; i < 8; i++) {
			const mesh = this.acquireMesh(this.sparkGeo, this.sparkPurpleMat);
			const angle = i / 8 * Math.PI * 2;
			const r = 2.2 + Math.random() * 1.5;
			mesh.position.set(x + Math.cos(angle) * r, y + .4, z + Math.sin(angle) * r);
			const inwardSpeed = 4.5;
			const tangSpeed = 5;
			this.activeParticles.push({
				mesh,
				vx: -Math.cos(angle) * inwardSpeed - Math.sin(angle) * tangSpeed,
				vy: 1.2 + Math.random() * 1.5,
				vz: -Math.sin(angle) * inwardSpeed + Math.cos(angle) * tangSpeed,
				rotSpeed: 10,
				scaleSpeed: -.6,
				life: .45,
				maxLife: .45,
				initialScale: 1.4,
				baseOpacity: .9
			});
		}
	}
	emitPlasmaBurst(x, y, z) {
		for (let i = 0; i < 14; i++) {
			const mat = i % 2 === 0 ? this.sparkGreenMat : this.flameCyanMat;
			const mesh = this.acquireMesh(this.sparkGeo, mat);
			mesh.position.set(x, y + .35, z);
			const angle = i / 14 * Math.PI * 2;
			const spd = 6 + Math.random() * 5;
			this.activeParticles.push({
				mesh,
				vx: Math.cos(angle) * spd,
				vy: 2 + Math.random() * 4,
				vz: Math.sin(angle) * spd,
				rotSpeed: (Math.random() - .5) * 12,
				scaleSpeed: -.6,
				life: .65,
				maxLife: .65,
				initialScale: 1.6,
				baseOpacity: .95
			});
		}
	}
	emitOilSplatter(x, y, z) {
		for (let i = 0; i < 12; i++) {
			const mat = i % 3 === 0 ? this.sparkPurpleMat : this.oilDarkMat;
			const mesh = this.acquireMesh(this.sparkGeo, mat);
			mesh.position.set(x, y + .2, z);
			const angle = Math.random() * Math.PI * 2;
			const spd = 2.5 + Math.random() * 4;
			this.activeParticles.push({
				mesh,
				vx: Math.cos(angle) * spd,
				vy: 1.8 + Math.random() * 2.5,
				vz: Math.sin(angle) * spd,
				rotSpeed: (Math.random() - .5) * 6,
				scaleSpeed: -.4,
				life: .75,
				maxLife: .75,
				initialScale: 1.5,
				baseOpacity: .95
			});
		}
	}
	/**
	* Updates all active particles smoothly (compacts array in-place with zero allocations)
	*/
	update(dt) {
		let aliveCount = 0;
		for (let i = 0; i < this.activeParticles.length; i++) {
			const p = this.activeParticles[i];
			p.life -= dt;
			if (p.life <= 0) this.releaseMesh(p.mesh);
			else {
				p.mesh.position.x += p.vx * dt;
				p.mesh.position.y += p.vy * dt;
				p.mesh.position.z += p.vz * dt;
				p.vy -= 8.5 * dt * .6;
				p.mesh.rotation.y += p.rotSpeed * dt;
				p.mesh.rotation.z += p.rotSpeed * dt;
				const lifeRatio = p.life / p.maxLife;
				const currentScale = Math.max(.01, p.initialScale * (1 + (1 - lifeRatio) * p.scaleSpeed));
				p.mesh.scale.set(currentScale, currentScale, currentScale);
				this.activeParticles[aliveCount++] = p;
			}
		}
		this.activeParticles.length = aliveCount;
	}
	clear() {
		for (let i = 0; i < this.activeParticles.length; i++) this.releaseMesh(this.activeParticles[i].mesh);
		this.activeParticles = [];
	}
	destroy() {
		this.clear();
		this.scene.remove(this.particleGroup);
		this.sparkGeo.dispose();
		this.smokeGeo.dispose();
		this.flameGeo.dispose();
		this.starGeo.dispose();
	}
};
var SkidMarkManager = class {
	scene;
	strips = /* @__PURE__ */ new Map();
	maxPoints = 28;
	sharedMat;
	constructor(scene) {
		this.scene = scene;
		this.sharedMat = new MeshBasicMaterial({
			color: 1579035,
			transparent: true,
			opacity: .45,
			depthWrite: false,
			side: 2
		});
	}
	/**
	* Records skid marks for a racer's rear tires
	*/
	addSkid(racerId, carX, carY, carZ, carRotY) {
		const fwdX = Math.sin(carRotY);
		const fwdZ = Math.cos(carRotY);
		const rightX = fwdZ;
		const rightZ = -fwdX;
		const rearDist = -.85;
		const halfTrack = .72;
		const halfWidth = .11;
		const cX = carX + fwdX * rearDist;
		const cY = carY + .05;
		const cZ = carZ + fwdZ * rearDist;
		const lX = cX - rightX * halfTrack;
		const lZ = cZ - rightZ * halfTrack;
		const rX = cX + rightX * halfTrack;
		const rZ = cZ + rightZ * halfTrack;
		this.appendPoint(`${racerId}_l`, lX - rightX * halfWidth, cY, lZ - rightZ * halfWidth, lX + rightX * halfWidth, cY, lZ + rightZ * halfWidth);
		this.appendPoint(`${racerId}_r`, rX - rightX * halfWidth, cY, rZ - rightZ * halfWidth, rX + rightX * halfWidth, cY, rZ + rightZ * halfWidth);
	}
	stopSkid(racerId) {
		const sL = this.strips.get(`${racerId}_l`);
		if (sL) {
			sL.lastLx = null;
			sL.lastLz = null;
		}
		const sR = this.strips.get(`${racerId}_r`);
		if (sR) {
			sR.lastLx = null;
			sR.lastLz = null;
		}
	}
	appendPoint(key, lx, ly, lz, rx, ry, rz) {
		let strip = this.strips.get(key);
		if (!strip) {
			const geo = new BufferGeometry();
			const maxVerts = this.maxPoints * 2;
			const positions = new Float32Array(maxVerts * 3);
			const posAttr = new BufferAttribute(positions, 3);
			geo.setAttribute("position", posAttr);
			const maxQuads = this.maxPoints - 1;
			const indices = new Uint16Array(maxQuads * 6);
			for (let i = 0; i < maxQuads; i++) {
				const v = i * 2;
				const idx = i * 6;
				indices[idx] = v;
				indices[idx + 1] = v + 1;
				indices[idx + 2] = v + 2;
				indices[idx + 3] = v + 1;
				indices[idx + 4] = v + 3;
				indices[idx + 5] = v + 2;
			}
			geo.setIndex(new BufferAttribute(indices, 1));
			geo.setDrawRange(0, 0);
			const mesh = new Mesh(geo, this.sharedMat);
			mesh.renderOrder = 1;
			this.scene.add(mesh);
			strip = {
				points: [],
				mesh,
				geo,
				posAttr,
				lastLx: null,
				lastLz: null
			};
			this.strips.set(key, strip);
		}
		if (strip.lastLx !== null && strip.lastLz !== null) {
			const dx = strip.lastLx - lx;
			const dz = strip.lastLz - lz;
			if (dx * dx + dz * dz < .16) return;
		}
		strip.lastLx = lx;
		strip.lastLz = lz;
		strip.points.push({
			lx,
			ly,
			lz,
			rx,
			ry,
			rz
		});
		if (strip.points.length > this.maxPoints) strip.points.shift();
		this.updateStripBuffer(strip);
	}
	updateStripBuffer(strip) {
		const count = strip.points.length;
		if (count < 2) {
			strip.geo.setDrawRange(0, 0);
			return;
		}
		const posArray = strip.posAttr.array;
		for (let i = 0; i < count; i++) {
			const pt = strip.points[i];
			const base = i * 6;
			posArray[base] = pt.lx;
			posArray[base + 1] = pt.ly;
			posArray[base + 2] = pt.lz;
			posArray[base + 3] = pt.rx;
			posArray[base + 4] = pt.ry;
			posArray[base + 5] = pt.rz;
		}
		strip.posAttr.needsUpdate = true;
		strip.geo.setDrawRange(0, (count - 1) * 6);
	}
	update(_dt) {
		this.strips.forEach((strip) => {
			if (strip.points.length > 2 && Math.random() < .05) {
				strip.points.shift();
				this.updateStripBuffer(strip);
			}
		});
	}
	clear() {
		this.strips.forEach((strip) => {
			this.scene.remove(strip.mesh);
			strip.geo.dispose();
		});
		this.strips.clear();
		this.sharedMat.dispose();
	}
};
var _dummy = new Object3D();
function makeLambert(color, opts = {}) {
	return new MeshStandardMaterial({
		color,
		roughness: .78,
		metalness: .08,
		...opts
	});
}
function addWorldDressing(scene, trackDef, track) {
	const group = new Group();
	group.name = "world-dressing";
	const skyTex = skyTexture(trackDef.theme);
	const skyGeo = new SphereGeometry(820, 32, 20);
	skyGeo.scale(-1, 1, 1);
	const skyMat = skyTex ? new MeshBasicMaterial({
		map: skyTex,
		depthWrite: false
	}) : new MeshBasicMaterial({
		color: trackDef.skyColor,
		depthWrite: false
	});
	const sky = new Mesh(skyGeo, skyMat);
	sky.renderOrder = -10;
	group.add(sky);
	if (trackDef.theme !== "sky") {
		const gTex = repeatingGround(GROUND_BY_THEME[trackDef.theme] || "ground_beach", 42);
		const ground = new Mesh(new CircleGeometry(1100, 64), new MeshStandardMaterial({
			map: gTex.image ? gTex : void 0,
			color: gTex.image ? 16777215 : trackDef.groundColor,
			roughness: .95,
			metalness: .02
		}));
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = -.22;
		ground.receiveShadow = true;
		group.add(ground);
	}
	scatterThemeProps(group, track, trackDef.theme);
	addHorizonSilhouettes(group, trackDef.theme);
	let water;
	if (trackDef.theme === "beach" || trackDef.theme === "ice") {
		const waterMat = new MeshPhysicalMaterial({
			color: trackDef.theme === "ice" ? 10474730 : 1929114,
			roughness: .18,
			metalness: .15,
			transmission: .15,
			transparent: true,
			opacity: .88,
			envMapIntensity: .8
		});
		water = new Mesh(new CircleGeometry(980, 48), waterMat);
		water.rotation.x = -Math.PI / 2;
		water.position.y = trackDef.theme === "ice" ? -.55 : -.85;
		group.add(water);
	}
	scene.add(group);
	return {
		group,
		water
	};
}
function scatterThemeProps(group, track, theme) {
	const pts = track.centerlinePoints;
	const count = Math.min(90, Math.floor(pts.length / 3));
	if (count <= 0) return;
	if (theme === "cyber") {
		scatterBuildings(group, pts, count);
		return;
	}
	const trunkGeo = new CylinderGeometry(.28, .45, 4.2, 6);
	const crownGeo = theme === "beach" ? new SphereGeometry(1.7, 7, 6) : new ConeGeometry(1.8, 4.4, 7);
	const rockGeo = new DodecahedronGeometry(1.15, 0);
	const trunkMat = makeLambert(theme === "volcano" ? 1841431 : theme === "spooky" ? 2038294 : 6044194);
	const crownMat = makeLambert(theme === "ice" ? 14412542 : theme === "volcano" ? 2696484 : theme === "spooky" ? 1332013 : theme === "sky" ? 12318672 : 1467700, theme === "volcano" ? {
		emissive: 8138002,
		emissiveIntensity: .35
	} : {});
	const rockMat = makeLambert(theme === "ice" ? 13358561 : theme === "volcano" ? 1841431 : 5722958);
	const trunks = new InstancedMesh(trunkGeo, trunkMat, count);
	const crowns = new InstancedMesh(crownGeo, crownMat, count);
	const rocks = new InstancedMesh(rockGeo, rockMat, count);
	trunks.castShadow = true;
	crowns.castShadow = true;
	rocks.castShadow = true;
	trunks.frustumCulled = false;
	crowns.frustumCulled = false;
	rocks.frustumCulled = false;
	let n = 0;
	for (let i = 2; i < pts.length && n < count; i += 4) {
		const side = n % 2 === 0 ? 1 : -1;
		const dist = 20 + n * 17 % 22;
		const cp = pts[i];
		const x = cp.point.x + cp.right.x * side * dist;
		const z = cp.point.z + cp.right.z * side * dist;
		const y = Math.max(0, cp.point.y);
		const s = .85 + n * 13 % 10 / 14;
		_dummy.position.set(x, y + 2.1 * s, z);
		_dummy.rotation.set(0, n * .7, 0);
		_dummy.scale.set(s, s, s);
		_dummy.updateMatrix();
		trunks.setMatrixAt(n, _dummy.matrix);
		_dummy.position.set(x, y + (theme === "beach" ? 4.4 : 5.2) * s, z);
		_dummy.scale.set(s * (theme === "beach" ? 1.3 : 1), s, s * (theme === "beach" ? 1.3 : 1));
		_dummy.updateMatrix();
		crowns.setMatrixAt(n, _dummy.matrix);
		const rx = x + cp.right.x * side * 4.5;
		const rz = z + cp.right.z * side * 4.5;
		_dummy.position.set(rx, y + .4, rz);
		_dummy.rotation.set(n * .4, n * 1.1, n * .2);
		_dummy.scale.setScalar(.7 + n % 5 * .18);
		_dummy.updateMatrix();
		rocks.setMatrixAt(n, _dummy.matrix);
		n++;
	}
	trunks.count = n;
	crowns.count = n;
	rocks.count = n;
	trunks.instanceMatrix.needsUpdate = true;
	crowns.instanceMatrix.needsUpdate = true;
	rocks.instanceMatrix.needsUpdate = true;
	group.add(trunks, crowns, rocks);
}
function scatterBuildings(group, pts, count) {
	const boxGeo = new BoxGeometry(1, 1, 1);
	const matA = makeLambert(725536, {
		emissive: 561586,
		emissiveIntensity: .28,
		metalness: .55,
		roughness: .35
	});
	const matB = makeLambert(1120295, {
		emissive: 14362487,
		emissiveIntensity: .22,
		metalness: .5,
		roughness: .4
	});
	const meshA = new InstancedMesh(boxGeo, matA, count);
	const meshB = new InstancedMesh(boxGeo, matB, count);
	meshA.castShadow = true;
	meshB.castShadow = true;
	let a = 0;
	let b = 0;
	for (let i = 3; i < pts.length && a + b < count; i += 3) {
		const side = (a + b) % 2 === 0 ? 1 : -1;
		const dist = 24 + (a + b) % 7 * 3;
		const cp = pts[i];
		const x = cp.point.x + cp.right.x * side * dist;
		const z = cp.point.z + cp.right.z * side * dist;
		const h = 8 + (a + b) % 9 * 3.2;
		const w = 3.2 + (a + b) % 4;
		_dummy.position.set(x, Math.max(0, cp.point.y) + h * .5, z);
		_dummy.rotation.set(0, (a + b) * .3, 0);
		_dummy.scale.set(w, h, w * .85);
		_dummy.updateMatrix();
		if ((a + b) % 2 === 0) meshA.setMatrixAt(a++, _dummy.matrix);
		else meshB.setMatrixAt(b++, _dummy.matrix);
	}
	meshA.count = a;
	meshB.count = b;
	meshA.instanceMatrix.needsUpdate = true;
	meshB.instanceMatrix.needsUpdate = true;
	group.add(meshA, meshB);
}
function addHorizonSilhouettes(group, theme) {
	const n = 14;
	const geo = new IcosahedronGeometry(1, 0);
	const mat = makeLambert(theme === "ice" ? 14870768 : theme === "volcano" ? 1841431 : theme === "cyber" ? 132631 : theme === "spooky" ? 1120295 : 3560212, { roughness: 1 });
	const mesh = new InstancedMesh(geo, mat, n);
	for (let i = 0; i < n; i++) {
		const ang = i / n * Math.PI * 2;
		const r = 420 + i % 5 * 40;
		const h = 28 + i % 6 * 16;
		_dummy.position.set(Math.cos(ang) * r, h * .15, Math.sin(ang) * r);
		_dummy.scale.set(18 + i % 4 * 8, h, 18 + (i + 2) % 4 * 8);
		_dummy.rotation.set(0, ang, 0);
		_dummy.updateMatrix();
		mesh.setMatrixAt(i, _dummy.matrix);
	}
	mesh.instanceMatrix.needsUpdate = true;
	group.add(mesh);
}
function createSun(theme) {
	const sun = new DirectionalLight(theme === "volcano" ? 16742981 : theme === "spooky" ? 12891645 : theme === "cyber" ? 6809849 : theme === "ice" ? 14742270 : 16773577, theme === "spooky" || theme === "cyber" ? 1.35 : 2.15);
	sun.position.set(70, 120, 55);
	sun.castShadow = true;
	sun.shadow.mapSize.set(2048, 2048);
	sun.shadow.camera.near = 4;
	sun.shadow.camera.far = 220;
	sun.shadow.camera.left = -55;
	sun.shadow.camera.right = 55;
	sun.shadow.camera.top = 55;
	sun.shadow.camera.bottom = -55;
	sun.shadow.bias = -25e-5;
	sun.shadow.normalBias = .04;
	const target = new Object3D();
	sun.target = target;
	return {
		sun,
		target
	};
}
var _visFwd = new Vector3();
var _visRight = new Vector3();
new Vector3();
var _camFwd = new Vector3();
var _camDir = new Vector3();
var _targetCamPos = new Vector3();
var _camLookTarget = new Vector3();
var ToonCarEngine = class {
	container;
	scene;
	camera;
	renderer;
	animFrameId = null;
	lastTime = 0;
	trackDef;
	trackData;
	totalLaps;
	racers = [];
	carMeshes = /* @__PURE__ */ new Map();
	shieldMeshes = /* @__PURE__ */ new Map();
	shadowMeshes = /* @__PURE__ */ new Map();
	speechSprites = /* @__PURE__ */ new Map();
	projectiles = [];
	projectileMeshes = /* @__PURE__ */ new Map();
	aiControllers = /* @__PURE__ */ new Map();
	callbacks;
	particles;
	skidMarks;
	cloudsGroup;
	cameraShake = 0;
	sunLight;
	sunTarget;
	worldWater;
	qaHeld = /* @__PURE__ */ new Set();
	envReady = false;
	fxThrottle = 0;
	/** Blocks item use briefly after pickup so Space/E hold won't instant-fire */
	itemArmTimers = /* @__PURE__ */ new Map();
	posUpdateTimer = 0;
	_blankInput = {
		throttle: 0,
		brake: 0,
		steer: 0,
		drift: false,
		useItem: false,
		honk: false,
		lookBehind: false,
		respawn: false
	};
	_aiScratchInput = {
		throttle: 0,
		brake: 0,
		steer: 0,
		drift: false,
		useItem: false,
		honk: false,
		lookBehind: false,
		respawn: false
	};
	_gamepadInput = {
		throttle: 0,
		brake: 0,
		steer: 0,
		drift: false,
		useItem: false,
		honk: false,
		lookBehind: false,
		respawn: false
	};
	hudTimer = 0;
	currentCamLookTarget = new Vector3();
	isFirstCamFrame = true;
	cachedMinimapPoints = null;
	cachedMinimapRacers = [];
	cachedMinimapData = {
		curvePoints: [],
		racers: []
	};
	localInput = {
		throttle: 0,
		brake: 0,
		steer: 0,
		drift: false,
		useItem: false,
		honk: false,
		lookBehind: false,
		respawn: false
	};
	localPlayerId = "player_1";
	gameState = "countdown";
	countdownTimer = 3.2;
	userCustomization;
	speedFactor = 1;
	paused = false;
	lastAnnouncedPosition = 0;
	positionAnnounceCooldown = 0;
	finalLapAnnounced = false;
	nearMissCooldown = 0;
	blueWarningCooldown = 0;
	hitStreak = 0;
	hitStreakTimer = 0;
	physicsAccum = 0;
	fixedDt = 1 / 60;
	constructor(container, trackDef, userCarId, userCarColor, totalLaps, callbacks, customRacers, userCustomization, speedClass, localPlayerId) {
		this.container = container;
		this.trackDef = trackDef;
		this.totalLaps = totalLaps;
		this.callbacks = callbacks;
		this.userCustomization = userCustomization;
		if (localPlayerId) this.localPlayerId = localPlayerId;
		if (speedClass === "50cc") this.speedFactor = .85;
		else if (speedClass === "150cc") this.speedFactor = 1.18;
		else this.speedFactor = 1;
		preloadTextures();
		this.scene = new Scene();
		this.scene.background = new Color(trackDef.skyColor);
		this.scene.fog = new FogExp2(trackDef.fogColor, .00155);
		const width = container.clientWidth || window.innerWidth;
		const height = container.clientHeight || window.innerHeight;
		this.camera = new PerspectiveCamera(62, width / height, .2, 1400);
		this.renderer = new WebGLRenderer({
			antialias: true,
			powerPreference: "high-performance"
		});
		this.renderer.setSize(width, height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = 2;
		this.renderer.toneMapping = 4;
		this.renderer.toneMappingExposure = trackDef.theme === "spooky" || trackDef.theme === "cyber" ? 1.05 : 1.18;
		this.renderer.outputColorSpace = SRGBColorSpace;
		container.appendChild(this.renderer.domElement);
		this.renderer.sortObjects = true;
		this.renderer.autoClear = true;
		this.renderer.domElement.style.touchAction = "none";
		this.particles = new ParticleSystem(this.scene);
		this.skidMarks = new SkidMarkManager(this.scene);
		this.setupLighting();
		this.setupTrack();
		this.setupRacers(userCarId, userCarColor, customRacers);
		window.addEventListener("resize", this.onWindowResize);
		const warmupGroup = new Group();
		warmupGroup.visible = false;
		warmupGroup.add(createRocketMesh());
		warmupGroup.add(createMineMesh());
		warmupGroup.add(createShieldMesh());
		this.particles.getWarmupMeshes().forEach((m) => warmupGroup.add(m));
		this.scene.add(warmupGroup);
		try {
			this.renderer.compile(this.scene, this.camera);
		} catch (_) {}
		this.scene.remove(warmupGroup);
		soundManager.init();
		soundManager.startMusic();
		this.installControlsProbe();
		this.lastTime = performance.now();
		this.loop();
	}
	setupLighting() {
		const { sun, target } = createSun(this.trackDef.theme);
		this.sunLight = sun;
		this.sunTarget = target;
		this.scene.add(target);
		this.scene.add(sun);
		const hemiSky = this.trackDef.theme === "volcano" ? 16756873 : this.trackDef.theme === "spooky" ? 10859772 : this.trackDef.theme === "cyber" ? 6809849 : 16317180;
		const hemi = new HemisphereLight(hemiSky, this.trackDef.groundColor, .62);
		this.scene.add(hemi);
		const fill = new DirectionalLight(14412542, .38);
		fill.position.set(-80, 40, -60);
		this.scene.add(fill);
		const ambient = new AmbientLight(16777215, .22);
		this.scene.add(ambient);
	}
	setupTrack() {
		this.trackData = buildTrack(this.trackDef);
		const dressing = addWorldDressing(this.scene, this.trackDef, this.trackData);
		this.worldWater = dressing.water;
		this.scene.add(this.trackData.trackMesh);
		this.scene.add(this.trackData.curbsMesh);
		this.scene.add(this.trackData.wallsMesh);
		this.scene.add(this.trackData.startArch);
		this.scene.add(this.trackData.decorations);
		if (this.trackData.waterMesh) this.scene.add(this.trackData.waterMesh);
		this.trackData.itemBoxes.forEach((box) => {
			this.scene.add(box.mesh);
		});
		this.trackData.boostPads.forEach((pad) => {
			if (pad.mesh) this.scene.add(pad.mesh);
		});
		try {
			const pmrem = new PMREMGenerator(this.renderer);
			const envTex = pmrem.fromScene(this.scene, .02).texture;
			this.scene.environment = envTex;
			pmrem.dispose();
		} catch (_) {}
		this.envReady = true;
	}
	setupRacers(userCarId, userCarColor, customRacers) {
		this.trackData.curve.getPointAt(0);
		const startTangent = this.trackData.curve.getTangentAt(0);
		Math.atan2(startTangent.x, startTangent.z);
		new Vector3().crossVectors(startTangent, new Vector3(0, 1, 0)).normalize();
		const now = Date.now();
		const totalTrackLen = this.trackData.curve.getLength() || 700;
		const getGridSlot = (gridIndex) => {
			const t = (1 - (4.5 + gridIndex * 7) / totalTrackLen + 1) % 1;
			const pt = this.trackData.curve.getPointAt(t);
			const tangent = this.trackData.curve.getTangentAt(t).normalize();
			const upVec = new Vector3(0, 1, 0);
			const right = new Vector3().crossVectors(tangent, upVec).normalize();
			const side = (gridIndex % 2 === 0 ? -1 : 1) * 2.8;
			return {
				pos: pt.clone().addScaledVector(right, side),
				rotY: Math.atan2(tangent.x, tangent.z)
			};
		};
		if (customRacers && customRacers.length > 0) customRacers.forEach((cr, i) => {
			const slot = getGridSlot(i);
			this.addRacer({
				id: cr.id,
				name: cr.name,
				carId: cr.carId,
				isAI: cr.isAI,
				color: cr.color,
				x: slot.pos.x,
				y: slot.pos.y + .1,
				z: slot.pos.z,
				rotY: slot.rotY,
				rotX: 0,
				rotZ: 0,
				speed: 0,
				steerAngle: 0,
				driftFactor: 0,
				isDrifting: false,
				driftChargeTime: 0,
				lap: 1,
				checkpointIndex: 0,
				totalDistance: 0,
				position: i + 1,
				finished: false,
				lapTimes: [],
				currentLapStartTime: now,
				bestLapTime: null,
				isWrongWay: false,
				currentItem: null,
				hasShield: false,
				shieldTimer: 0,
				turboTimer: 0,
				starTimer: 0,
				spinTimer: 0,
				frozenTimer: 0,
				wheelRot: 0,
				bounceOffset: 0
			});
		});
		else {
			const aiDefs = CAR_DEFINITIONS.filter((c) => c.id !== userCarId).slice(0, 5);
			const playerSlot = getGridSlot(0);
			this.addRacer({
				id: this.localPlayerId,
				name: "Sina (You)",
				carId: userCarId,
				isAI: false,
				color: userCarColor,
				x: playerSlot.pos.x,
				y: playerSlot.pos.y + .1,
				z: playerSlot.pos.z,
				rotY: playerSlot.rotY,
				rotX: 0,
				rotZ: 0,
				speed: 0,
				steerAngle: 0,
				driftFactor: 0,
				isDrifting: false,
				driftChargeTime: 0,
				lap: 1,
				checkpointIndex: 0,
				totalDistance: 0,
				position: 1,
				finished: false,
				lapTimes: [],
				currentLapStartTime: now,
				bestLapTime: null,
				isWrongWay: false,
				currentItem: null,
				hasShield: false,
				shieldTimer: 0,
				turboTimer: 0,
				starTimer: 0,
				spinTimer: 0,
				frozenTimer: 0,
				wheelRot: 0,
				bounceOffset: 0
			});
			aiDefs.forEach((aiCar, idx) => {
				const slot = getGridSlot(idx + 1);
				this.addRacer({
					id: `ai_${aiCar.id}`,
					name: aiCar.driverName,
					carId: aiCar.id,
					isAI: true,
					color: aiCar.primaryColor,
					x: slot.pos.x,
					y: slot.pos.y + .1,
					z: slot.pos.z,
					rotY: slot.rotY,
					rotX: 0,
					rotZ: 0,
					speed: 0,
					steerAngle: 0,
					driftFactor: 0,
					isDrifting: false,
					driftChargeTime: 0,
					lap: 1,
					checkpointIndex: 0,
					totalDistance: 0,
					position: idx + 2,
					finished: false,
					lapTimes: [],
					currentLapStartTime: now,
					bestLapTime: null,
					isWrongWay: false,
					currentItem: null,
					hasShield: false,
					shieldTimer: 0,
					turboTimer: 0,
					starTimer: 0,
					spinTimer: 0,
					frozenTimer: 0,
					wheelRot: 0,
					bounceOffset: 0
				});
			});
		}
		const savedBest = localStorage.getItem(`best_lap_${this.trackData.id}`);
		if (savedBest) {
			const localRacer = this.racers.find((r) => r.id === this.localPlayerId);
			if (localRacer) localRacer.bestLapTime = parseFloat(savedBest);
		}
		this.aiControllers = createAIControllers(this.racers);
	}
	addRacer(state) {
		this.racers.push(state);
		const meshContainer = createToonCarMesh(CAR_DEFINITIONS.find((c) => c.id === state.carId) || CAR_DEFINITIONS[0], state.color, state.id === this.localPlayerId ? this.userCustomization : void 0);
		meshContainer.root.position.set(state.x, state.y, state.z);
		meshContainer.root.rotation.y = state.rotY;
		this.scene.add(meshContainer.root);
		this.carMeshes.set(state.id, meshContainer);
		const shadowGeo = new PlaneGeometry(2.2, 3.2);
		shadowGeo.rotateX(-Math.PI / 2);
		const shadowMat = new MeshBasicMaterial({
			color: 0,
			transparent: true,
			opacity: .3,
			depthWrite: false,
			depthTest: true,
			polygonOffset: true,
			polygonOffsetFactor: -4,
			polygonOffsetUnits: -4
		});
		const shadowMesh = new Mesh(shadowGeo, shadowMat);
		shadowMesh.position.set(0, .07, 0);
		shadowMesh.renderOrder = -1;
		meshContainer.root.add(shadowMesh);
		this.shadowMeshes.set(state.id, shadowMesh);
		const shield = createShieldMesh();
		shield.visible = false;
		meshContainer.root.add(shield);
		this.shieldMeshes.set(state.id, shield);
	}
	pollGamepads() {
		const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
		let gpActive = false;
		for (let i = 0; i < gamepads.length; i++) {
			const gp = gamepads[i];
			if (gp && gp.connected) {
				const btn = (idx) => gp.buttons[idx]?.pressed || false;
				this._gamepadInput.throttle = btn(0) || btn(7) ? 1 : 0;
				this._gamepadInput.brake = btn(1) || btn(6) || btn(2) ? 1 : 0;
				this._gamepadInput.drift = btn(2) || btn(6);
				let steer = gp.axes[0] || 0;
				if (Math.abs(steer) < .15) steer = 0;
				if (btn(14)) steer = -1;
				if (btn(15)) steer = 1;
				this._gamepadInput.steer = steer;
				if (btn(3) || btn(5)) this._gamepadInput.useItem = true;
				else this._gamepadInput.useItem = false;
				this._gamepadInput.lookBehind = btn(4);
				this._gamepadInput.respawn = btn(9);
				if (btn(10) || btn(11)) this._gamepadInput.honk = true;
				else this._gamepadInput.honk = false;
				gpActive = true;
				break;
			}
		}
		return gpActive;
	}
	loop = () => {
		this.animFrameId = requestAnimationFrame(this.loop);
		this.pollGamepads();
		const now = performance.now();
		let frameDt = (now - this.lastTime) / 1e3;
		this.lastTime = now;
		if (frameDt > .045) frameDt = .045;
		if (frameDt < .001) frameDt = .001;
		if (this.paused && this.gameState === "racing") {
			this.renderer.render(this.scene, this.camera);
			return;
		}
		if (frameDt > .024) {
			const halfDt = frameDt * .5;
			this.simulate(halfDt, now);
			this.simulate(halfDt, now);
		} else this.simulate(frameDt, now);
		this.syncProjectileMeshes();
		this.updateVisualMeshes(frameDt);
		this.particles.update(frameDt);
		this.skidMarks.update(frameDt);
		this.updateCamera(frameDt);
		this.hudTimer += frameDt;
		if (this.hudTimer >= .05) {
			this.hudTimer = 0;
			this.pushHUD();
		}
		this.renderer.render(this.scene, this.camera);
	};
	/** One simulation tick (physics, AI, race rules) */
	simulate(dt, now) {
		if (this.gameState === "countdown") {
			const prevTimer = this.countdownTimer;
			this.countdownTimer -= dt;
			if (prevTimer >= 3 && this.countdownTimer < 3) {
				soundManager.playCountdown(false);
				this.callbacks.onCountdownTick(3);
			} else if (prevTimer >= 2 && this.countdownTimer < 2) {
				soundManager.playCountdown(false);
				this.callbacks.onCountdownTick(2);
			} else if (prevTimer >= 1 && this.countdownTimer < 1) {
				soundManager.playCountdown(false);
				this.callbacks.onCountdownTick(1);
			} else if (prevTimer > 0 && this.countdownTimer <= 0) {
				soundManager.playCountdown(true);
				this.callbacks.onCountdownTick("LÄKS!");
				this.gameState = "racing";
				const player = this.racers.find((r) => r.id === this.localPlayerId);
				if (player && this.localInput.throttle > 0) {
					player.turboTimer = 1.8;
					player.speed = 46;
					soundManager.playTurbo();
					this.callbacks.onCombatEvent("🚀 TÄIUSLIK START! Nitro aktiveeritud!");
				}
				setTimeout(() => {
					this.callbacks.onCountdownTick("");
				}, 1200);
			}
		}
		const canDrive = this.gameState === "racing";
		this.itemArmTimers.forEach((t, id) => {
			const next = t - dt;
			if (next <= 0) this.itemArmTimers.delete(id);
			else this.itemArmTimers.set(id, next);
		});
		this.racers.forEach((racer) => {
			let input = this._blankInput;
			const isLocal = racer.id === this.localPlayerId;
			const isRemoteHuman = !racer.isAI && !isLocal;
			if (canDrive && !racer.finished) {
				if (isLocal) {
					if (this.qaHeld.size > 0) input = this.inputFromCodes(this.qaHeld);
					else input = {
						throttle: Math.max(this.localInput.throttle, this._gamepadInput.throttle),
						brake: Math.max(this.localInput.brake, this._gamepadInput.brake),
						steer: Math.abs(this._gamepadInput.steer) > .1 ? this._gamepadInput.steer : this.localInput.steer,
						drift: this.localInput.drift || this._gamepadInput.drift,
						useItem: this.localInput.useItem || this._gamepadInput.useItem,
						honk: this.localInput.honk || this._gamepadInput.honk,
						lookBehind: this.localInput.lookBehind || this._gamepadInput.lookBehind,
						respawn: this.localInput.respawn || this._gamepadInput.respawn
					};
					if (input.useItem && racer.currentItem) {
						if ((this.itemArmTimers.get(racer.id) || 0) <= 0) this.firePowerUp(racer);
						this.localInput.useItem = false;
						this._gamepadInput.useItem = false;
					}
					if (input.honk) {
						soundManager.playHonk();
						this.localInput.honk = false;
						this._gamepadInput.honk = false;
					}
				} else if (racer.isAI) {
					const ctrl = this.aiControllers.get(racer.id);
					if (ctrl) input = computeAIInput(racer, ctrl, this.trackData, this.racers, dt, (rId) => {
						const r = this.racers.find((x) => x.id === rId);
						if (r) this.firePowerUp(r);
					});
				}
			}
			if (isRemoteHuman) {
				if (racer.spinTimer > 0) {
					racer.spinTimer -= dt;
					racer.rotY += Math.PI * 5 * dt;
					racer.speed = Math.max(0, racer.speed - 24 * dt);
				} else if (racer.frozenTimer > 0) {
					racer.frozenTimer -= dt;
					racer.speed *= .92;
				} else if (canDrive && !racer.finished && Math.abs(racer.speed) > .5) {
					const step = racer.speed * dt * .85;
					racer.x += Math.sin(racer.rotY) * step;
					racer.z += Math.cos(racer.rotY) * step;
				}
				return;
			}
			const oldLap = racer.lap;
			updateRacerPhysics(racer, input, this.trackData, dt, (event) => this.handleCollision(event), this.speedFactor);
			if (racer.id === this.localPlayerId && racer.lap > oldLap) {
				const lastLapTime = racer.lapTimes[racer.lapTimes.length - 1];
				if (lastLapTime) {
					const key = `best_lap_${this.trackData.id}`;
					const stored = localStorage.getItem(key);
					if (lastLapTime < (stored ? parseFloat(stored) : Infinity)) {
						localStorage.setItem(key, lastLapTime.toString());
						this.callbacks.onCombatEvent(`🏆 UUS PARIM RINGIAEG: ${lastLapTime.toFixed(2)}s`);
					}
				}
			}
			if (racer.id === this.localPlayerId) {
				soundManager.updateEngine(Math.abs(racer.speed) / 50, input.throttle > 0);
				if (racer.isDrifting) soundManager.playDrift();
			}
			if (racer.lap > this.totalLaps && !racer.finished) {
				racer.finished = true;
				racer.finishTime = Date.now();
				if (racer.id === this.localPlayerId) {
					soundManager.playWinFanfare();
					this.callbacks.onCombatEvent(racer.position === 1 ? "🏆 VÕIT!!! Oled legendaarne!" : `🏁 Finiš! Koht #${racer.position}`);
					for (let f = 0; f < 5; f++) setTimeout(() => {
						this.particles.emitExplosion(racer.x + (Math.random() - .5) * 8, racer.y + 2 + Math.random() * 4, racer.z + (Math.random() - .5) * 8);
						this.particles.emitBoxBreak(racer.x, racer.y + 1, racer.z);
					}, f * 180);
					this.cameraShake = .8;
				}
				if (this.racers.every((r) => r.finished) || racer.id === this.localPlayerId) setTimeout(() => {
					this.callbacks.onRaceFinished(this.racers);
				}, 1500);
			}
		});
		resolveCarCarCollisions(this.racers, dt, (event) => this.handleCollision(event));
		if (canDrive) applySlipstream(this.racers, dt);
		this.nearMissCooldown = Math.max(0, this.nearMissCooldown - dt);
		this.blueWarningCooldown = Math.max(0, this.blueWarningCooldown - dt);
		this.hitStreakTimer = Math.max(0, this.hitStreakTimer - dt);
		if (this.hitStreakTimer <= 0) this.hitStreak = 0;
		const localPlayer = this.racers.find((r) => r.id === this.localPlayerId);
		if (localPlayer && canDrive) {
			if (!this.finalLapAnnounced && localPlayer.lap === this.totalLaps && !localPlayer.finished) {
				this.finalLapAnnounced = true;
				soundManager.playCountdown(true);
				this.callbacks.onCombatEvent("🏁 VIIMANE RING!!!");
				this.callbacks.onCountdownTick("VIIMANE RING!");
				setTimeout(() => this.callbacks.onCountdownTick(""), 2200);
			}
			if (this.blueWarningCooldown <= 0) {
				if (this.projectiles.find((p) => p.active && p.type === "blue_rocket" && p.targetId === this.localPlayerId)) {
					this.blueWarningCooldown = 2.2;
					this.callbacks.onCombatEvent("⚠️ SININE RAKETT TULEB SINU POOLE!!!");
					this.cameraShake = Math.max(this.cameraShake, .2);
				}
			}
		}
		updateProjectiles(this.projectiles, this.racers, this.trackData, dt, (event) => this.handleCollision(event));
		this.posUpdateTimer += dt;
		if (this.posUpdateTimer >= .12) {
			this.posUpdateTimer = 0;
			this.updateRacePositions();
		}
		this.trackData.itemBoxes.forEach((box) => {
			if (box.active) box.mesh.rotation.y += dt * 1.8;
			else {
				box.mesh.visible = false;
				box.respawnTime -= dt;
				if (box.respawnTime <= 0) {
					box.active = true;
					box.mesh.visible = true;
					box.mesh.position.y = box.y;
				}
			}
		});
		if (this.trackData.waterMesh) this.trackData.waterMesh.position.y = -.4 + Math.sin(now * .0018) * .12;
		if (this.trackData.lighthouseBeam) this.trackData.lighthouseBeam.rotation.y += dt * .9;
	}
	pushHUD() {
		const localRacer = this.racers.find((r) => r.id === this.localPlayerId);
		if (!localRacer) return;
		const currentLapTime = localRacer.currentLapStartTime > 0 ? (Date.now() - localRacer.currentLapStartTime) / 1e3 : 0;
		const driftCharge = (localRacer.driftChargeTime || 0) >= 2.6 ? 3 : (localRacer.driftChargeTime || 0) >= 1.6 ? 2 : (localRacer.driftChargeTime || 0) >= .75 ? 1 : 0;
		this.callbacks.onHUDUpdate({
			speed: Math.round(Math.abs(localRacer.speed) * 3.6),
			lap: Math.min(localRacer.lap, this.totalLaps),
			totalLaps: this.totalLaps,
			position: localRacer.position,
			totalRacers: this.racers.length,
			currentItem: localRacer.currentItem,
			isDrifting: localRacer.isDrifting,
			hasTurbo: localRacer.turboTimer > 0,
			hasShield: localRacer.hasShield,
			inSlipstream: !!localRacer.inSlipstream,
			isFinalLap: localRacer.lap >= this.totalLaps && !localRacer.finished,
			isLeader: localRacer.position === 1,
			blueThreat: this.projectiles.some((p) => p.active && p.type === "blue_rocket" && p.targetId === this.localPlayerId),
			isWrongWay: !!localRacer.isWrongWay,
			currentLapTime,
			bestLapTime: localRacer.bestLapTime,
			driftCharge,
			currentSurface: localRacer.currentSurface,
			surfaceName: localRacer.surfaceName,
			surfaceIcon: localRacer.surfaceIcon,
			minimapData: this.getMinimapData()
		});
	}
	registerHitStreak() {
		this.hitStreak += 1;
		this.hitStreakTimer = 6;
		if (this.hitStreak === 2) this.callbacks.onCombatEvent("🔥 2x TABAMUS!");
		else if (this.hitStreak === 3) this.callbacks.onCombatEvent("⚡ 3x KOMBO!!!");
		else if (this.hitStreak >= 4) this.callbacks.onCombatEvent("💀 DESTROYER!!!");
	}
	handleCollision(event) {
		if (event.type === "car_bump") {
			soundManager.playBoing();
			this.particles.emitSparks(event.x, event.y + .3, event.z, 16766720, 5);
		} else if (event.type === "wall_hit") {
			soundManager.playBump();
			this.particles.emitSparks(event.x, event.y + .3, event.z, 16777215, 6);
			if (event.racerId === this.localPlayerId) this.cameraShake = Math.min(this.cameraShake + .1, .18);
		} else if (event.type === "item_box") {
			soundManager.playItemBox();
			this.particles.emitBoxBreak(event.x, event.y, event.z);
			const racer = this.racers.find((r) => r.id === event.racerId);
			if (racer) {
				this.itemArmTimers.set(racer.id, .5);
				if (racer.isAI) {
					const ctrl = this.aiControllers.get(racer.id);
					if (ctrl) ctrl.itemCooldown = Math.max(ctrl.itemCooldown, 1.5);
				}
				if (racer.id === this.localPlayerId && this.callbacks.onItemBoxTaken) this.callbacks.onItemBoxTaken({
					x: event.x,
					y: event.y,
					z: event.z,
					racerId: racer.id
				});
			}
		} else if (event.type === "rocket_hit" || event.type === "blue_rocket_hit" || event.type === "thundercloud_strike" || event.type === "banana_hit" || event.type === "mine_hit" || event.type === "freezeray_hit" || event.type === "vortex_suck" || event.type === "plasma_hit" || event.type === "oil_slip") {
			if (event.type === "banana_hit") {
				soundManager.playBoing();
				this.particles.emitSparks(event.x, event.y + .2, event.z, 16436245, 6);
			} else if (event.type === "thundercloud_strike") {
				soundManager.playExplosion();
				this.particles.emitLightning(event.x, event.y, event.z);
			} else if (event.type === "freezeray_hit") {
				soundManager.playFreezeChime();
				this.particles.emitIceCrystals(event.x, event.y + .5, event.z);
			} else if (event.type === "vortex_suck") {
				soundManager.playVortexHum();
				this.particles.emitVortexSwirl(event.x, event.y + .5, event.z);
			} else if (event.type === "plasma_hit") {
				soundManager.playPlasmaShot();
				this.particles.emitPlasmaBurst(event.x, event.y + .4, event.z);
			} else if (event.type === "oil_slip") {
				soundManager.playOilSlick();
				this.particles.emitOilSplatter(event.x, event.y + .2, event.z);
			} else {
				soundManager.playExplosion();
				this.particles.emitExplosion(event.x, event.y, event.z);
			}
			if (event.targetId === this.localPlayerId) this.cameraShake = event.type === "banana_hit" || event.type === "oil_slip" ? .6 : event.type === "freezeray_hit" ? .75 : 1;
			const attacker = this.racers.find((r) => r.id === event.racerId);
			const target = this.racers.find((r) => r.id === event.targetId);
			if (target) {
				const isPlayerAttacker = !!(attacker && attacker.id === this.localPlayerId);
				const isPlayerTarget = target.id === this.localPlayerId;
				const isTargetLeader = target.position === 1;
				if (isPlayerTarget) {
					const victimLabels = {
						rocket_hit: `💥 Sind tabati raketiga! (${attacker ? attacker.name : "Vastane"})`,
						blue_rocket_hit: "🔷 SININE RAKETT tabas sind otse!",
						thundercloud_strike: "⛈️ ÄIKESELÖÖK tabas sind!",
						banana_hit: "🍌 Libisesid banaanil!",
						mine_hit: "💣 Sõitsid miinile otsa!",
						freezeray_hit: `❄️ Sind külmutati! (${attacker ? attacker.name : "Vastane"})`,
						vortex_suck: `🌀 Sind tõmmati musta auku! (${attacker ? attacker.name : "Vastane"})`,
						plasma_hit: `🔮 Sind tabas laserkiir! (${attacker ? attacker.name : "Vastane"})`,
						oil_slip: "🛢️ Libisesid õliloigul!"
					};
					this.callbacks.onCombatEvent(victimLabels[event.type] || "💥 Sind tabati!");
				} else if (isPlayerAttacker) {
					const attackLabels = {
						rocket_hit: `🎯 Tabasid raketiga: ${target.name}!`,
						blue_rocket_hit: `🔷 Sinine rakett tabas liidrit: ${target.name}!`,
						thundercloud_strike: `⛈️ Äikesepilv tabas: ${target.name}!`,
						banana_hit: `🍌 ${target.name} libises sinu banaanile!`,
						mine_hit: `💣 ${target.name} sõitis sinu miinile!`,
						freezeray_hit: `❄️ Külmutasid vastase: ${target.name}!`,
						vortex_suck: `🌀 Püüdsid vastase (${target.name}) musta auku!`,
						plasma_hit: `🔮 Tabasid laseriga: ${target.name}!`,
						oil_slip: `🛢️ ${target.name} libises sinu õliloigule!`
					};
					this.callbacks.onCombatEvent(attackLabels[event.type] || `🎯 Tabamus: ${target.name}!`);
					try {
						this.registerHitStreak();
					} catch (_) {}
				} else if (isTargetLeader && event.type === "blue_rocket_hit") this.callbacks.onCombatEvent(`🔷 Sinine rakett lõi liidri (${target.name}) teelt!`);
			}
			if (event.targetId && this.callbacks.onNetworkHit) {
				if (event.racerId === this.localPlayerId || event.targetId !== this.localPlayerId) this.callbacks.onNetworkHit({
					type: event.type,
					targetId: event.targetId,
					x: event.x,
					y: event.y,
					z: event.z
				});
			}
		} else if (event.type === "boost_pad") soundManager.playTurbo();
		else if (event.type === "jump_ramp") {
			soundManager.playTurbo();
			this.particles.emitNitroFlame(event.x, event.y + .4, event.z, 0);
		} else if (event.type === "stunt_boost") {
			soundManager.playStuntChime();
			this.particles.emitStarAura(event.x, event.y + .6, event.z);
			const racer = this.racers.find((r) => r.id === event.racerId);
			if (racer && racer.id === this.localPlayerId) this.callbacks.onCombatEvent("★ ÕHUTRIKK! +NITRO! ★");
		} else if (event.type === "stunt_ring") {
			soundManager.playStuntRing();
			this.particles.emitPlasmaBurst(event.x, event.y, event.z);
			const racer = this.racers.find((r) => r.id === event.racerId);
			if (racer && racer.id === this.localPlayerId) this.callbacks.onCombatEvent("💫 TRIKIRÕNGAS! +500 PTS! 💫");
		} else if (event.type === "hazard_hit") {
			soundManager.playExplosion();
			this.particles.emitExplosion(event.x, event.y, event.z);
			const racer = this.racers.find((r) => r.id === event.racerId);
			if (racer && racer.id === this.localPlayerId) {
				this.cameraShake = .8;
				this.callbacks.onCombatEvent(`⚠️ RAJATÕKE! Tabasid ohtu: ${event.hazardName || "Takistus"}!`);
			}
		}
	}
	/** Snapshot of local car for multiplayer broadcast */
	getLocalSyncState() {
		const r = this.racers.find((x) => x.id === this.localPlayerId);
		if (!r) return null;
		const inactiveBoxes = [];
		this.trackData.itemBoxes.forEach((b, i) => {
			if (!b.active) inactiveBoxes.push(i);
		});
		const myProjectiles = this.projectiles.filter((p) => p.active && p.ownerId === this.localPlayerId).map((p) => ({
			id: p.id,
			type: p.type,
			ownerId: p.ownerId,
			x: p.x,
			y: p.y,
			z: p.z,
			vx: p.vx,
			vy: p.vy,
			vz: p.vz,
			life: p.life,
			targetId: p.targetId,
			state: p.state,
			timer: p.timer
		}));
		return {
			id: r.id,
			x: r.x,
			y: r.y,
			z: r.z,
			rotY: r.rotY,
			speed: r.speed,
			steerAngle: r.steerAngle,
			isDrifting: r.isDrifting,
			lap: r.lap,
			position: r.position,
			checkpointIndex: r.checkpointIndex,
			totalDistance: r.totalDistance,
			turboTimer: r.turboTimer,
			hasShield: r.hasShield,
			currentItem: r.currentItem,
			finished: r.finished,
			spinTimer: r.spinTimer,
			frozenTimer: r.frozenTimer,
			starTimer: r.starTimer,
			trackT: r.trackT,
			centerlineIndex: r.centerlineIndex,
			inactiveBoxes,
			projectiles: myProjectiles
		};
	}
	/** Apply another client's car state (with light smoothing) */
	applyRemoteState(state) {
		if (!state || !state.id) return;
		if (state.id === this.localPlayerId) return;
		const r = this.racers.find((x) => x.id === state.id);
		if (!r) return;
		const dx = (state.x ?? r.x) - r.x;
		const dz = (state.z ?? r.z) - r.z;
		const dist = Math.hypot(dx, dz);
		const alpha = dist > 18 ? 1 : dist > 6 ? .45 : .28;
		if (typeof state.x === "number") r.x += (state.x - r.x) * alpha;
		if (typeof state.y === "number") r.y += (state.y - r.y) * alpha;
		if (typeof state.z === "number") r.z += (state.z - r.z) * alpha;
		if (typeof state.rotY === "number") {
			let dYaw = state.rotY - r.rotY;
			while (dYaw > Math.PI) dYaw -= Math.PI * 2;
			while (dYaw < -Math.PI) dYaw += Math.PI * 2;
			r.rotY += dYaw * Math.min(1, alpha + .15);
		}
		if (typeof state.speed === "number") r.speed = state.speed;
		if (typeof state.steerAngle === "number") r.steerAngle = state.steerAngle;
		if (typeof state.isDrifting === "boolean") r.isDrifting = state.isDrifting;
		if (typeof state.lap === "number") r.lap = state.lap;
		if (typeof state.position === "number") r.position = state.position;
		if (typeof state.checkpointIndex === "number") r.checkpointIndex = state.checkpointIndex;
		if (typeof state.totalDistance === "number") r.totalDistance = state.totalDistance;
		if (typeof state.turboTimer === "number") r.turboTimer = state.turboTimer;
		if (typeof state.hasShield === "boolean") r.hasShield = state.hasShield;
		if (state.currentItem !== void 0) r.currentItem = state.currentItem;
		if (typeof state.finished === "boolean") r.finished = state.finished;
		if (typeof state.spinTimer === "number") r.spinTimer = Math.max(r.spinTimer || 0, state.spinTimer);
		if (typeof state.frozenTimer === "number") r.frozenTimer = Math.max(r.frozenTimer || 0, state.frozenTimer);
		if (typeof state.starTimer === "number") r.starTimer = state.starTimer;
		if (typeof state.trackT === "number") r.trackT = state.trackT;
		if (typeof state.centerlineIndex === "number") r.centerlineIndex = state.centerlineIndex;
		if (Array.isArray(state.inactiveBoxes)) for (const idx of state.inactiveBoxes) {
			const box = this.trackData.itemBoxes[idx];
			if (box && box.active) {
				box.active = false;
				box.respawnTime = Math.max(box.respawnTime || 0, 7);
				box.mesh.visible = false;
			}
		}
		if (Array.isArray(state.projectiles)) for (const p of state.projectiles) {
			this.applyNetworkProjectile(p);
			const existing = this.projectiles.find((x) => x.id === p.id);
			if (existing && existing.ownerId !== this.localPlayerId) {
				existing.x = p.x;
				existing.y = p.y;
				existing.z = p.z;
				existing.vx = p.vx ?? existing.vx;
				existing.vy = p.vy ?? existing.vy;
				existing.vz = p.vz ?? existing.vz;
				existing.life = p.life ?? existing.life;
				existing.state = p.state ?? existing.state;
				existing.timer = p.timer ?? existing.timer;
				existing.active = true;
			}
		}
	}
	/** Spawn projectile/trap from another client */
	applyItemBoxTaken(data) {
		if (!data) return;
		let best = null;
		let bestD = 64;
		for (const box of this.trackData.itemBoxes) {
			if (!box.active) continue;
			const d = (box.x - data.x) ** 2 + (box.z - data.z) ** 2;
			if (d < bestD) {
				bestD = d;
				best = box;
			}
		}
		if (best) {
			best.active = false;
			best.respawnTime = 7;
			best.mesh.visible = false;
			this.particles.emitBoxBreak(best.x, best.y, best.z);
			soundManager.playItemBox();
		}
	}
	applyNetworkHit(hit) {
		if (!hit || !hit.targetId) return;
		const t = this.racers.find((r) => r.id === hit.targetId);
		if (!t) return;
		if (t.starTimer > 0) return;
		if (t.hasShield) {
			t.hasShield = false;
			t.shieldTimer = 0;
			soundManager.playShield();
			return;
		}
		const isLocalVictim = hit.targetId === this.localPlayerId;
		if (hit.type === "banana_hit") {
			t.spinTimer = Math.max(t.spinTimer, isLocalVictim ? 1.8 : 1.4);
			t.speed = Math.min(t.speed * .4, 18);
		} else if (hit.type === "freezeray_hit") {
			t.frozenTimer = Math.max(t.frozenTimer || 0, isLocalVictim ? 3.5 : 2.5);
			t.spinTimer = Math.max(t.spinTimer, .8);
			t.speed = Math.min(t.speed * .3, 10);
			soundManager.playFreezeChime();
			if (hit.x !== void 0) this.particles.emitIceCrystals(hit.x, hit.y || t.y + .5, hit.z || t.z);
		} else if (hit.type === "vortex_suck") {
			t.spinTimer = Math.max(t.spinTimer, isLocalVictim ? 2.4 : 1.8);
			t.speed *= .15;
			soundManager.playVortexHum();
			if (hit.x !== void 0) this.particles.emitVortexSwirl(hit.x, hit.y || t.y + .5, hit.z || t.z);
		} else if (hit.type === "thundercloud_strike") {
			t.spinTimer = Math.max(t.spinTimer, 2);
			t.speed = Math.min(t.speed * .15, 10);
			t.frozenTimer = Math.max(t.frozenTimer || 0, 2.5);
		} else {
			t.spinTimer = Math.max(t.spinTimer, isLocalVictim ? 2.4 : 2);
			t.speed = Math.min(t.speed * .08, 6);
		}
		if (isLocalVictim) {
			this.cameraShake = Math.max(this.cameraShake, 1.15);
			this.callbacks.onCombatEvent("💥 Sind tabati!");
			soundManager.playExplosion();
		}
		if (hit.x !== void 0) this.particles.emitExplosion(hit.x, hit.y || t.y + .5, hit.z || t.z);
	}
	applyNetworkProjectile(p) {
		if (!p || !p.id) return;
		if (this.projectiles.some((x) => x.id === p.id)) return;
		this.projectiles.push({
			id: p.id,
			type: p.type,
			ownerId: p.ownerId,
			x: p.x,
			y: p.y,
			z: p.z,
			vx: p.vx || 0,
			vy: p.vy || 0,
			vz: p.vz || 0,
			life: p.life ?? 10,
			active: true,
			targetId: p.targetId,
			state: p.state,
			timer: p.timer
		});
		this.ensureProjectileMesh(this.projectiles[this.projectiles.length - 1]);
	}
	firePowerUp(racer) {
		if (!racer.currentItem) return;
		if ((this.itemArmTimers.get(racer.id) || 0) > 0) return;
		const item = racer.currentItem;
		racer.currentItem = null;
		this.itemArmTimers.delete(racer.id);
		if (item === "turbo") {
			racer.turboTimer = 3.5;
			racer.speed = Math.max(racer.speed + 20, 58);
			soundManager.playTurbo();
		} else if (item === "shield") {
			racer.hasShield = true;
			racer.shieldTimer = 8;
			soundManager.playShield();
		} else if (item === "repair") {
			racer.spinTimer = 0;
			racer.frozenTimer = 0;
			racer.speed += 8;
			soundManager.playTurbo();
		} else if (item === "lightning") {
			soundManager.playExplosion();
			this.racers.forEach((r) => {
				if (r.id !== racer.id) {
					if (r.starTimer > 0) return;
					if (r.hasShield) {
						r.hasShield = false;
						r.shieldTimer = 0;
						return;
					}
					r.spinTimer = Math.max(r.spinTimer || 0, 1.8);
					r.frozenTimer = Math.max(r.frozenTimer || 0, 4.5);
					r.speed = 0;
					r.currentItem = null;
					r.turboTimer = 0;
					r.driftChargeTime = 0;
				}
			});
			this.callbacks.onCombatEvent(`⚡ ${racer.name} lõi kõiki võistlejaid VÄLGUGA! 🌩️`);
			this.cameraShake = Math.max(this.cameraShake, 1.2);
			this.racers.forEach((r) => {
				if (r.id !== racer.id) this.particles.emitLightning(r.x, r.y, r.z);
			});
		} else if (item === "anvil") {
			const leader = this.racers.find((r) => r.position === 1 && r.id !== racer.id);
			if (leader) {
				if (leader.hasShield) {
					leader.hasShield = false;
					leader.shieldTimer = 0;
				} else {
					leader.spinTimer = 2.5;
					leader.speed = 0;
				}
				soundManager.playExplosion();
				if (leader.id === this.localPlayerId) this.callbacks.onCombatEvent("🔨 10T ALASI kukkus sulle pähe!");
				else if (racer.id === this.localPlayerId) this.callbacks.onCombatEvent(`🔨 10T ALASI tabas liidrit (${leader.name})!`);
			}
		} else if (item === "rocket") {
			soundManager.playRocketLaunch();
			let target = this.racers.filter((r) => r.id !== racer.id && r.position < racer.position && !r.finished).sort((a, b) => {
				return (a.x - racer.x) ** 2 + (a.z - racer.z) ** 2 - ((b.x - racer.x) ** 2 + (b.z - racer.z) ** 2);
			})[0];
			if (!target) target = this.racers.filter((r) => r.id !== racer.id && !r.finished).sort((a, b) => {
				return (a.x - racer.x) ** 2 + (a.z - racer.z) ** 2 - ((b.x - racer.x) ** 2 + (b.z - racer.z) ** 2);
			})[0];
			const fwd = new Vector3(Math.sin(racer.rotY), 0, Math.cos(racer.rotY)).normalize();
			const spawnPos = new Vector3(racer.x, racer.y + 1.1, racer.z).add(fwd.clone().multiplyScalar(2.8));
			this.projectiles.push({
				id: `rocket_${Date.now()}_${Math.random()}`,
				type: "rocket",
				ownerId: racer.id,
				x: spawnPos.x,
				y: spawnPos.y,
				z: spawnPos.z,
				vx: fwd.x * 55,
				vy: 0,
				vz: fwd.z * 55,
				targetId: target?.id,
				life: 4.2,
				active: true
			});
		} else if (item === "trio_rockets") {
			soundManager.playRocketLaunch();
			const fwd = new Vector3(Math.sin(racer.rotY), 0, Math.cos(racer.rotY)).normalize();
			const right = new Vector3(fwd.z, 0, -fwd.x);
			[
				-.3,
				0,
				.3
			].forEach((angleOff, idx) => {
				const dir = fwd.clone().applyAxisAngle(new Vector3(0, 1, 0), angleOff);
				const spawnPos = new Vector3(racer.x, racer.y + .6, racer.z).add(fwd.clone().multiplyScalar(2.5)).add(right.clone().multiplyScalar((idx - 1) * 1.2));
				this.projectiles.push({
					id: `trio_${Date.now()}_${idx}`,
					type: "rocket",
					ownerId: racer.id,
					x: spawnPos.x,
					y: spawnPos.y,
					z: spawnPos.z,
					vx: dir.x * 50,
					vy: 0,
					vz: dir.z * 50,
					life: 4.5,
					active: true
				});
			});
		} else if (item === "mine") {
			const fwd = new Vector3(Math.sin(racer.rotY), 0, Math.cos(racer.rotY)).normalize();
			const spawnPos = new Vector3(racer.x, racer.y + .4, racer.z).sub(fwd.clone().multiplyScalar(2.8));
			this.projectiles.push({
				id: `mine_${Date.now()}_${Math.random()}`,
				type: "mine",
				ownerId: racer.id,
				x: spawnPos.x,
				y: spawnPos.y,
				z: spawnPos.z,
				vx: 0,
				vy: 0,
				vz: 0,
				life: 25,
				active: true
			});
		} else if (item === "blue_rocket") {
			soundManager.playRocketLaunch();
			const fwd = new Vector3(Math.sin(racer.rotY), 0, Math.cos(racer.rotY)).normalize();
			const spawnPos = new Vector3(racer.x, racer.y + 1.2, racer.z).add(fwd.clone().multiplyScalar(2.8));
			this.projectiles.push({
				id: `bluerocket_${Date.now()}_${Math.random()}`,
				type: "blue_rocket",
				ownerId: racer.id,
				x: spawnPos.x,
				y: spawnPos.y,
				z: spawnPos.z,
				vx: fwd.x * 70,
				vy: 0,
				vz: fwd.z * 70,
				life: 14,
				active: true
			});
			if (racer.id === this.localPlayerId) this.callbacks.onCombatEvent("🔷 SININE RAKETT teel liidri poole!");
		} else if (item === "thundercloud") {
			soundManager.playRocketLaunch();
			const fwd = new Vector3(Math.sin(racer.rotY), 0, Math.cos(racer.rotY)).normalize();
			const spawnPos = new Vector3(racer.x, racer.y + 2, racer.z).sub(fwd.clone().multiplyScalar(1.2));
			this.projectiles.push({
				id: `thunder_${Date.now()}_${Math.random()}`,
				type: "thundercloud",
				ownerId: racer.id,
				x: spawnPos.x,
				y: spawnPos.y,
				z: spawnPos.z,
				vx: 0,
				vy: 0,
				vz: 0,
				life: 60,
				active: true,
				state: "idle",
				timer: 3.5
			});
		} else if (item === "banana") {
			const fwd = new Vector3(Math.sin(racer.rotY), 0, Math.cos(racer.rotY)).normalize();
			const spawnPos = new Vector3(racer.x, racer.y + .25, racer.z).sub(fwd.clone().multiplyScalar(2.5));
			this.projectiles.push({
				id: `banana_${Date.now()}_${Math.random()}`,
				type: "banana",
				ownerId: racer.id,
				x: spawnPos.x,
				y: spawnPos.y,
				z: spawnPos.z,
				vx: 0,
				vy: 0,
				vz: 0,
				life: 30,
				active: true
			});
		} else if (item === "star") {
			racer.starTimer = 7;
			racer.turboTimer = Math.max(racer.turboTimer, 7);
			racer.hasShield = true;
			racer.shieldTimer = 7;
			soundManager.playTurbo();
			if (racer.id === this.localPlayerId) {
				this.callbacks.onCombatEvent("⭐ SUPER TÄHT! VÕITMATU!");
				this.cameraShake = .35;
			}
		} else if (item === "vortex") {
			soundManager.playVortexHum();
			const fwd = new Vector3(Math.sin(racer.rotY), 0, Math.cos(racer.rotY)).normalize();
			const spawnPos = new Vector3(racer.x, racer.y + .45, racer.z).sub(fwd.clone().multiplyScalar(2.6));
			this.projectiles.push({
				id: `vortex_${Date.now()}_${Math.random()}`,
				type: "vortex",
				ownerId: racer.id,
				x: spawnPos.x,
				y: spawnPos.y,
				z: spawnPos.z,
				vx: 0,
				vy: 0,
				vz: 0,
				life: 9.5,
				active: true
			});
		} else if (item === "freezeray") {
			soundManager.playFreezeChime();
			const fwd = new Vector3(Math.sin(racer.rotY), 0, Math.cos(racer.rotY)).normalize();
			const spawnPos = new Vector3(racer.x, racer.y + .9, racer.z).add(fwd.clone().multiplyScalar(2.8));
			this.projectiles.push({
				id: `freezeray_${Date.now()}_${Math.random()}`,
				type: "freezeray",
				ownerId: racer.id,
				x: spawnPos.x,
				y: spawnPos.y,
				z: spawnPos.z,
				vx: fwd.x * 90,
				vy: 0,
				vz: fwd.z * 90,
				life: 3.5,
				active: true
			});
		} else if (item === "plasma_cannon") {
			soundManager.playPlasmaShot();
			const fwd = new Vector3(Math.sin(racer.rotY), 0, Math.cos(racer.rotY)).normalize();
			const spawnPos = new Vector3(racer.x, racer.y + .9, racer.z).add(fwd.clone().multiplyScalar(2.6));
			this.projectiles.push({
				id: `plasma_${Date.now()}_${Math.random()}`,
				type: "plasma_cannon",
				ownerId: racer.id,
				x: spawnPos.x,
				y: spawnPos.y,
				z: spawnPos.z,
				vx: fwd.x * 140,
				vy: 0,
				vz: fwd.z * 140,
				life: 2.5,
				active: true,
				hitIds: []
			});
		} else if (item === "oil_slick") {
			soundManager.playOilSlick();
			const fwd = new Vector3(Math.sin(racer.rotY), 0, Math.cos(racer.rotY)).normalize();
			const spawnPos = new Vector3(racer.x, racer.y + .08, racer.z).sub(fwd.clone().multiplyScalar(2.8));
			this.projectiles.push({
				id: `oil_${Date.now()}_${Math.random()}`,
				type: "oil_slick",
				ownerId: racer.id,
				x: spawnPos.x,
				y: spawnPos.y,
				z: spawnPos.z,
				vx: 0,
				vy: 0,
				vz: 0,
				life: 35,
				active: true
			});
		}
		for (const p of this.projectiles) if (p.active) this.ensureProjectileMesh(p);
		if (racer.id === this.localPlayerId && this.callbacks.onProjectileSpawn) {
			const mine = this.projectiles.filter((p) => p.active && p.ownerId === racer.id);
			const p = mine[mine.length - 1];
			if (p) this.callbacks.onProjectileSpawn({
				id: p.id,
				type: p.type,
				ownerId: p.ownerId,
				x: p.x,
				y: p.y,
				z: p.z,
				vx: p.vx,
				vy: p.vy,
				vz: p.vz,
				life: p.life,
				targetId: p.targetId,
				state: p.state,
				timer: p.timer
			});
		}
	}
	ensureProjectileMesh(p) {
		if (!p.active || this.projectileMeshes.has(p.id)) return;
		let mesh;
		switch (p.type) {
			case "blue_rocket":
				mesh = createBlueRocketMesh();
				break;
			case "thundercloud":
				mesh = createThundercloudMesh();
				break;
			case "banana":
				mesh = createBananaMesh();
				break;
			case "mine":
				mesh = createMineMesh();
				break;
			case "vortex":
				mesh = createVortexMesh();
				break;
			case "freezeray":
				mesh = createFreezeRayMesh();
				break;
			case "plasma_cannon":
				mesh = createPlasmaMesh();
				break;
			case "oil_slick":
				mesh = createOilSlickMesh();
				break;
			default: mesh = createRocketMesh();
		}
		mesh.position.set(p.x, p.y, p.z);
		mesh.frustumCulled = false;
		this.scene.add(mesh);
		this.projectileMeshes.set(p.id, mesh);
	}
	syncProjectileMeshes() {
		this.projectiles.forEach((p) => {
			if (p.active) this.ensureProjectileMesh(p);
		});
		this.projectileMeshes.forEach((mesh, id) => {
			const p = this.projectiles.find((x) => x.id === id);
			if (p && p.active) {
				mesh.position.set(p.x, p.y, p.z);
				if (p.type === "rocket" || p.type === "blue_rocket") {
					mesh.rotation.y = Math.atan2(p.vx, p.vz);
					if (Math.random() < .22) this.particles.emitNitroFlame(p.x - Math.sin(mesh.rotation.y) * 1.2, p.y, p.z - Math.cos(mesh.rotation.y) * 1.2, mesh.rotation.y);
				} else if (p.type === "freezeray") {
					mesh.rotation.y = Math.atan2(p.vx, p.vz);
					mesh.rotation.z += .2;
					if (Math.random() < .35) this.particles.emitIceCrystals(p.x, p.y, p.z);
				} else if (p.type === "vortex") {
					mesh.rotation.y += .08;
					mesh.scale.setScalar(1 + Math.sin(performance.now() * .007) * .12);
					if (Math.random() < .28) this.particles.emitVortexSwirl(p.x, p.y + .2, p.z);
				} else if (p.type === "thundercloud") {
					mesh.rotation.y += .04;
					const s = p.state === "chasing" ? 1.25 : 1;
					mesh.scale.setScalar(s + Math.sin(performance.now() * .006) * .08);
					if (p.state === "idle") mesh.position.y = p.y + Math.sin(performance.now() * .004) * .35;
					if (p.state === "chasing" && Math.random() < .35) this.particles.emitCloudSparks(p.x, p.y, p.z);
				} else if (p.type === "plasma_cannon") {
					mesh.rotation.y = Math.atan2(p.vx, p.vz);
					mesh.rotation.z += .25;
					if (Math.random() < .4) this.particles.emitPlasmaBurst(p.x, p.y, p.z);
				} else if (p.type === "oil_slick") mesh.rotation.y += .005;
				else mesh.rotation.y += .04;
			} else {
				this.scene.remove(mesh);
				this.projectileMeshes.delete(id);
			}
		});
		if (this.projectiles.some((p) => !p.active)) this.projectiles = this.projectiles.filter((p) => p.active);
	}
	updateVisualMeshes(dt) {
		this.fxThrottle += dt;
		const doFx = this.fxThrottle >= .07;
		if (doFx) this.fxThrottle = 0;
		this.racers.forEach((racer) => {
			const meshContainer = this.carMeshes.get(racer.id);
			if (!meshContainer) return;
			meshContainer.root.position.set(racer.x, racer.y, racer.z);
			const targetScale = (racer.frozenTimer || 0) > 0 ? .68 : 1;
			meshContainer.root.scale.setScalar(targetScale);
			meshContainer.root.rotation.set((racer.rotX || 0) + (racer.stuntAngleX || 0), racer.rotY + (racer.stuntAngleY || 0), (racer.rotZ || 0) + (racer.stuntAngleZ || 0));
			meshContainer.frontWheels.forEach((fw) => {
				fw.rotation.y = racer.steerAngle;
			});
			meshContainer.allWheels.forEach((w) => {
				w.rotation.x = racer.wheelRot;
			});
			meshContainer.driverHead.rotation.z = -racer.steerAngle * .3;
			meshContainer.driverHead.position.y = .95;
			meshContainer.bodyGroup.rotation.x = racer.rotX || 0;
			meshContainer.bodyGroup.rotation.z = -racer.steerAngle * .14;
			if (meshContainer.tailLightMat) {
				const isBraking = racer.id === this.localPlayerId ? this.localInput.brake > .1 && racer.speed > 0 : racer.speed < 12;
				meshContainer.tailLightMat.emissiveIntensity = isBraking ? 2.8 : .8;
			}
			if (racer.isDrifting) {
				if (!racer.isAI) this.skidMarks.addSkid(racer.id, racer.x, racer.y, racer.z, racer.rotY);
				if (doFx) {
					const sparkLevel = (racer.driftChargeTime || 0) >= 2.6 ? 3 : (racer.driftChargeTime || 0) >= 1.6 ? 2 : 1;
					_visFwd.set(Math.sin(racer.rotY), 0, Math.cos(racer.rotY));
					_visRight.set(_visFwd.z, 0, -_visFwd.x);
					const rLx = racer.x + _visFwd.x * -.8 + _visRight.x * -.75;
					const rLz = racer.z + _visFwd.z * -.8 + _visRight.z * -.75;
					this.particles.emitDriftSparks(rLx, racer.y, rLz, sparkLevel);
					if (!racer.isAI) {
						const rRx = racer.x + _visFwd.x * -.8 + _visRight.x * .75;
						const rRz = racer.z + _visFwd.z * -.8 + _visRight.z * .75;
						this.particles.emitDriftSparks(rRx, racer.y, rRz, sparkLevel);
					}
				}
			} else this.skidMarks.stopSkid(racer.id);
			if (doFx && racer.turboTimer > 0) {
				_visFwd.set(Math.sin(racer.rotY), 0, Math.cos(racer.rotY));
				_visRight.set(_visFwd.z, 0, -_visFwd.x);
				const exY = racer.y + .45;
				const exLx = racer.x + _visFwd.x * -1.4 + _visRight.x * -.45;
				const exLz = racer.z + _visFwd.z * -1.4 + _visRight.z * -.45;
				this.particles.emitNitroFlame(exLx, exY, exLz, racer.rotY);
				if (!racer.isAI) {
					const exRx = racer.x + _visFwd.x * -1.4 + _visRight.x * .45;
					const exRz = racer.z + _visFwd.z * -1.4 + _visRight.z * .45;
					this.particles.emitNitroFlame(exRx, exY, exRz, racer.rotY);
				}
			} else if (doFx && !racer.isAI && Math.abs(racer.speed) > 12 && Math.random() < .12) {
				_visFwd.set(Math.sin(racer.rotY), 0, Math.cos(racer.rotY));
				const exPosX = racer.x + _visFwd.x * -1.4;
				const exPosY = racer.y + .35;
				const exPosZ = racer.z + _visFwd.z * -1.4;
				this.particles.emitExhaustSmoke(exPosX, exPosY, exPosZ, racer.rotY);
			}
			if (doFx && racer.starTimer > 0) this.particles.emitStarAura(racer.x, racer.y + .5, racer.z);
			if (doFx && (racer.frozenTimer || 0) > 0) {
				this.particles.emitSparks(racer.x, racer.y + .4, racer.z, 3718648, 3);
				if (Math.random() < .4) this.particles.emitIceCrystals(racer.x, racer.y + .5, racer.z);
			}
			const shield = this.shieldMeshes.get(racer.id);
			if (shield) {
				shield.visible = racer.hasShield;
				if (shield.visible) shield.rotation.y += dt * 3;
			}
		});
		if (this.trackData.stuntRings) this.trackData.stuntRings.forEach((ring) => {
			if (ring.mesh) ring.mesh.rotation.z += dt * 1.5;
		});
		if (this.trackData.hazards) {
			const nowSec = performance.now() * .001;
			this.trackData.hazards.forEach((hazard) => {
				const sweep = hazard.sweepSpeed ?? 1;
				const range = hazard.sweepRange ?? 8;
				hazard.sweepProgress = (hazard.sweepProgress || 0) + dt * sweep;
				if (!hazard.mesh) return;
				if (hazard.type === "pendulum") {
					const swingArm = hazard.mesh.getObjectByName("swing_arm");
					if (swingArm) {
						const swingAngle = Math.sin(nowSec * sweep) * .95;
						swingArm.rotation.z = swingAngle;
						const sinA = Math.sin(swingAngle);
						hazard.x = hazard.mesh.position.x + sinA * 7.5;
					}
				} else if (hazard.type === "laser_sweeper") {
					const laserArm = hazard.mesh.getObjectByName("laser_beam");
					if (laserArm) laserArm.position.y = 1.6 + Math.sin(nowSec * sweep) * 1.2;
				} else if (hazard.type === "snow_boulder") {
					const boulder = hazard.mesh.getObjectByName("rolling_boulder");
					if (boulder) {
						boulder.position.x = Math.sin(nowSec * sweep) * (range * .6);
						boulder.rotation.z -= dt * 4.5;
						hazard.x = hazard.mesh.position.x + boulder.position.x;
					}
				} else if (hazard.type === "magma_geyser" || hazard.type === "water_spout") {
					const spout = hazard.mesh.getObjectByName("erupting_spout");
					if (spout) {
						const pulse = .5 + Math.abs(Math.sin(nowSec * sweep)) * .9;
						spout.scale.set(1 + pulse * .3, pulse, 1 + pulse * .3);
						spout.position.y = spout.scale.y * 7 / 2;
					}
				} else if (hazard.type === "fireball") {
					const fb = hazard.mesh.getObjectByName("fireball_mesh");
					if (fb) {
						fb.position.x = Math.sin(nowSec * sweep) * (range * .5);
						fb.position.y = 2.2 + Math.abs(Math.sin(nowSec * sweep * 2)) * 1.5;
						hazard.x = hazard.mesh.position.x + fb.position.x;
					}
				}
			});
		}
	}
	updateRacePositions() {
		this.racers.sort((a, b) => {
			if (a.lap !== b.lap) return b.lap - a.lap;
			if (a.checkpointIndex !== b.checkpointIndex) return b.checkpointIndex - a.checkpointIndex;
			return b.totalDistance - a.totalDistance;
		});
		for (let idx = 0; idx < this.racers.length; idx++) this.racers[idx].position = idx + 1;
	}
	updateCamera(dt) {
		const player = this.racers.find((r) => r.id === this.localPlayerId) || this.racers[0];
		if (!player) return;
		const isLookingBack = !!this.localInput.lookBehind;
		_camFwd.set(Math.sin(player.rotY), 0, Math.cos(player.rotY)).normalize();
		if (isLookingBack) _camDir.copy(_camFwd);
		else _camDir.copy(_camFwd).negate();
		const camDist = 7.5 + (player.turboTimer > 0 ? 1.4 : 0);
		_targetCamPos.set(player.x, player.y + 3.6, player.z).addScaledVector(_camDir, camDist);
		const lookAheadDist = isLookingBack ? -8 : 5;
		_camLookTarget.set(player.x, player.y + 1.25, player.z).addScaledVector(_camFwd, lookAheadDist);
		if (this.isFirstCamFrame) {
			this.camera.position.copy(_targetCamPos);
			this.currentCamLookTarget.copy(_camLookTarget);
			this.isFirstCamFrame = false;
		} else {
			const camAlpha = Math.min(1, 1 - Math.exp(-6.2 * dt));
			this.camera.position.lerp(_targetCamPos, camAlpha);
			this.currentCamLookTarget.lerp(_camLookTarget, camAlpha);
		}
		this.camera.up.set(0, 1, 0);
		this.camera.lookAt(this.currentCamLookTarget);
		if (this.sunLight && this.sunTarget) {
			this.sunTarget.position.set(player.x, player.y, player.z);
			this.sunLight.position.set(player.x + 55, player.y + 90, player.z + 40);
			this.sunLight.target.updateMatrixWorld();
		}
		if (this.worldWater) this.worldWater.position.y = (this.trackDef.theme === "ice" ? -.55 : -.85) + Math.sin(performance.now() * 6e-4) * .08;
		if (this.cameraShake > .001) {
			const s = this.cameraShake;
			const t = performance.now() * .045;
			this.camera.position.x += Math.sin(t * 1.7) * s * .22;
			this.camera.position.y += Math.cos(t * 2.1) * s * .12;
			this.camera.position.z += Math.sin(t * 1.3) * s * .22;
			this.cameraShake = Math.max(0, this.cameraShake - dt * 3.2);
		}
		const targetFOV = player.turboTimer > 0 ? 74 : player.speed > 25 ? 68 : 64;
		const nextFov = MathUtils.lerp(this.camera.fov, targetFOV, Math.min(1, dt * 2.5));
		if (Math.abs(nextFov - this.camera.fov) > .08) {
			this.camera.fov = nextFov;
			this.camera.updateProjectionMatrix();
		}
	}
	onWindowResize = () => {
		if (!this.container) return;
		const width = this.container.clientWidth || window.innerWidth;
		const height = this.container.clientHeight || window.innerHeight;
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	};
	getMinimapData() {
		if (!this.cachedMinimapPoints) this.cachedMinimapPoints = this.trackData.checkpoints.map((cp) => ({
			x: cp.x,
			z: cp.z
		}));
		return {
			curvePoints: this.cachedMinimapPoints,
			racers: this.racers.map((r) => ({
				id: r.id,
				x: r.x,
				z: r.z,
				rotY: r.rotY || 0,
				color: r.color,
				isPlayer: r.id === this.localPlayerId,
				position: r.position,
				name: r.name
			}))
		};
	}
	destroy() {
		if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
		window.removeEventListener("resize", this.onWindowResize);
		soundManager.stopMusic();
		if (window.__controlsTest) delete window.__controlsTest;
		this.particles.clear();
		this.skidMarks.clear();
		this.shadowMeshes.forEach((s) => {
			this.scene.remove(s);
			s.geometry.dispose();
			s.material.dispose();
		});
		this.shadowMeshes.clear();
		if (this.renderer.domElement && this.container.contains(this.renderer.domElement)) this.container.removeChild(this.renderer.domElement);
		this.renderer.dispose();
	}
	inputFromCodes(codes) {
		const has = (...list) => list.some((c) => codes.has(c));
		let steer = 0;
		if (has("KeyA", "ArrowLeft")) steer -= 1;
		if (has("KeyD", "ArrowRight")) steer += 1;
		return {
			throttle: has("KeyW", "ArrowUp") ? 1 : 0,
			brake: has("KeyS", "ArrowDown") ? 1 : 0,
			steer,
			drift: has("Space", "ShiftLeft", "ShiftRight"),
			useItem: has("KeyE", "Enter"),
			honk: has("KeyH"),
			lookBehind: has("KeyC"),
			respawn: has("KeyR")
		};
	}
	installControlsProbe() {
		window.__controlsTest = {
			getYaw: () => {
				const p = this.racers.find((r) => r.id === this.localPlayerId) || this.racers[0];
				return p ? -p.rotY : 0;
			},
			getSpeed: () => {
				const p = this.racers.find((r) => r.id === this.localPlayerId) || this.racers[0];
				return p ? p.speed : 0;
			},
			setSteer: (v) => {
				this.qaHeld.clear();
				this.localInput.steer = -v;
			},
			setKeys: (codes) => {
				this.qaHeld = new Set(codes);
				if (codes.length === 0) {
					this.localInput.throttle = 0;
					this.localInput.brake = 0;
					this.localInput.steer = 0;
					this.localInput.drift = false;
				} else {
					const mapped = this.inputFromCodes(this.qaHeld);
					this.localInput.throttle = mapped.throttle;
					this.localInput.brake = mapped.brake;
					this.localInput.steer = mapped.steer;
					this.localInput.drift = mapped.drift;
				}
			}
		};
	}
};
var ITEM_ICON = {
	rocket: Rocket,
	blue_rocket: Crosshair,
	thundercloud: CloudLightning,
	vortex: Aperture,
	freezeray: Snowflake,
	banana: TriangleAlert,
	star: Star,
	mine: Circle,
	shield: Shield,
	turbo: Zap,
	lightning: CloudLightning,
	anvil: Hammer,
	repair: Wrench,
	trio_rockets: Rocket,
	plasma_cannon: Aperture,
	oil_slick: Droplets
};
function formatLapTime(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00.00";
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	const ms = Math.floor(seconds % 1 * 100);
	return `${m}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}
function stripEmoji(s) {
	return s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim();
}
function HUD({ speed, lap, totalLaps, position, totalRacers, currentItem, isDrifting, hasTurbo, hasShield, inSlipstream = false, isFinalLap = false, isWrongWay = false, currentLapTime = 0, bestLapTime = null, driftCharge = 0, surfaceName, combatEvents, countdownText, minimapData, onUseItem, onHonk, onLookBehindToggle, onRespawn, onInputStart, onInputEnd }) {
	const canvasRef = (0, import_react.useRef)(null);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const ItemIcon = currentItem ? ITEM_ICON[currentItem] : Flag;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas || !minimapData || minimapData.curvePoints.length === 0) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const w = canvas.width;
		const h = canvas.height;
		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = "#0c0d10";
		ctx.fillRect(0, 0, w, h);
		let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
		for (const p of minimapData.curvePoints) {
			minX = Math.min(minX, p.x);
			maxX = Math.max(maxX, p.x);
			minZ = Math.min(minZ, p.z);
			maxZ = Math.max(maxZ, p.z);
		}
		const scale = Math.min((w - 36) / Math.max(10, maxX - minX), (h - 36) / Math.max(10, maxZ - minZ));
		const cx = (x) => w / 2 + (x - (minX + maxX) / 2) * scale;
		const cy = (z) => h / 2 + (z - (minZ + maxZ) / 2) * scale;
		ctx.beginPath();
		minimapData.curvePoints.forEach((p, i) => {
			if (i === 0) ctx.moveTo(cx(p.x), cy(p.z));
			else ctx.lineTo(cx(p.x), cy(p.z));
		});
		ctx.closePath();
		ctx.strokeStyle = "#4b5160";
		ctx.lineWidth = 7;
		ctx.lineJoin = "round";
		ctx.stroke();
		ctx.strokeStyle = "#d7dbe2";
		ctx.lineWidth = 1.4;
		ctx.stroke();
		for (const r of minimapData.racers) {
			ctx.fillStyle = r.isPlayer ? "#eef0f3" : r.color || "#c24141";
			ctx.beginPath();
			ctx.arc(cx(r.x), cy(r.z), r.isPlayer ? 4.5 : 3, 0, Math.PI * 2);
			ctx.fill();
		}
	}, [minimapData]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-line bg-bg/80 px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-[0.14em] text-faint",
								children: "Koht"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-3xl font-semibold tabular leading-none",
								children: [position, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-base text-muted",
									children: ["/", totalRacers]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border border-line bg-bg/80 px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-[0.14em] text-faint",
								children: "Ring"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-2xl font-semibold tabular leading-none",
								children: [lap, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-muted",
									children: ["/", totalLaps]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden rounded-md border border-line bg-bg/80 px-3 py-2 sm:block",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-[0.14em] text-faint",
									children: "Aeg"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-sm tabular text-accent",
									children: formatLapTime(currentLapTime)
								}),
								bestLapTime != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-ok",
									children: ["Parim ", formatLapTime(bestLapTime)]
								})
							]
						}),
						surfaceName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden rounded-md border border-line bg-bg/80 px-3 py-2 md:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-[0.14em] text-faint",
								children: "Pind"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium",
								children: surfaceName
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pointer-events-auto flex size-11 items-center justify-center rounded-md border border-line bg-bg/80 text-fg",
						onClick: () => setMuted(soundManager.toggleMute()),
						"aria-label": "Heli",
						children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-line bg-bg/85 p-1.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
							ref: canvasRef,
							width: 148,
							height: 148,
							className: "block size-28 rounded-md sm:size-36"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute left-1/2 top-4 z-30 flex -translate-x-1/2 flex-col items-center gap-2",
				children: [
					currentItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onUseItem,
						className: "pointer-events-auto flex min-w-28 flex-col items-center gap-1 rounded-lg border border-accent bg-bg/90 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, { className: "size-8" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium uppercase tracking-wide",
								children: POWER_UPS[currentItem]?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-faint",
								children: "E"
							})
						]
					}),
					isWrongWay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-md border border-danger bg-danger px-4 py-2 text-center text-sm font-medium text-fg",
						children: "Vale suund — pööra või vajuta R"
					}),
					isFinalLap && !countdownText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full border border-line bg-bg/85 px-4 py-1 text-xs font-medium uppercase tracking-[0.16em]",
						children: "Viimane ring"
					})
				]
			}),
			countdownText !== "" && countdownText != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute left-1/2 top-1/3 z-40 -translate-x-1/2 -translate-y-1/2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-7xl font-semibold tracking-tight text-accent drop-shadow sm:text-8xl",
					children: countdownText
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-xs space-y-1 self-start",
				children: combatEvents.slice(-2).map((evt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md border border-line bg-bg/80 px-3 py-1.5 text-xs text-fg",
					children: stripEmoji(evt)
				}, `${evt}-${i}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1",
							children: [
								hasTurbo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 rounded-md bg-warn px-2 py-1 text-[10px] font-medium text-accent-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3" }), " Nitro"]
								}),
								hasShield && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 rounded-md bg-ok px-2 py-1 text-[10px] font-medium text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-3" }), " Kilp"]
								}),
								inSlipstream && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md border border-line bg-bg/80 px-2 py-1 text-[10px] font-medium",
									children: "Draft"
								}),
								isDrifting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md border border-accent bg-bg/80 px-2 py-1 text-[10px] font-medium",
									children: ["Drift ", driftCharge > 0 ? `T${driftCharge}` : ""]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-1 rounded-md border border-line bg-bg/80 px-3 py-1.5 text-[11px] text-muted lg:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-accent",
								children: "WASD"
							}),
							" sõit",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-line",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-accent",
								children: "Space"
							}),
							" drift",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-line",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-accent",
								children: "E"
							}),
							" ese"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							onRespawn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onRespawn,
								className: "pointer-events-auto hidden h-11 items-center gap-1 rounded-md border border-line bg-bg/80 px-3 text-xs sm:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), " R"]
							}),
							onLookBehindToggle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onMouseDown: () => onLookBehindToggle(true),
								onMouseUp: () => onLookBehindToggle(false),
								onTouchStart: () => onLookBehindToggle(true),
								onTouchEnd: () => onLookBehindToggle(false),
								className: "pointer-events-auto hidden h-11 items-center gap-1 rounded-md border border-line bg-bg/80 px-3 text-xs sm:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), " C"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onHonk,
								className: "pointer-events-auto hidden size-11 items-center justify-center rounded-md border border-line bg-bg/80 sm:flex",
								"aria-label": "Signaal",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-line bg-bg/85 px-4 py-2 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-4xl font-semibold tabular leading-none",
									children: speed
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-[0.14em] text-faint",
									children: "km/h"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto mt-2 flex items-end justify-between gap-3 pb-[env(safe-area-inset-bottom)] md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchBtn, {
						label: "Vasak",
						onStart: () => onInputStart("left"),
						onEnd: () => onInputEnd("left"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchBtn, {
						label: "Parem",
						onStart: () => onInputStart("right"),
						onEnd: () => onInputEnd("right"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-6" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchBtn, {
							label: "Drift",
							onStart: () => onInputStart("drift"),
							onEnd: () => onInputEnd("drift"),
							children: "Drift"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchBtn, {
							label: "Pidur",
							onStart: () => onInputStart("brake"),
							onEnd: () => onInputEnd("brake"),
							children: "Pidur"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TouchBtn, {
							label: "Gaas",
							onStart: () => onInputStart("throttle"),
							onEnd: () => onInputEnd("throttle"),
							primary: true,
							children: "Gaas"
						})
					]
				})]
			})
		]
	});
}
function TouchBtn({ children, label, onStart, onEnd, primary }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onTouchStart: (e) => {
			e.preventDefault();
			onStart();
		},
		onTouchEnd: (e) => {
			e.preventDefault();
			onEnd();
		},
		onMouseDown: onStart,
		onMouseUp: onEnd,
		onMouseLeave: onEnd,
		className: `flex h-14 min-w-14 items-center justify-center rounded-lg border px-3 text-xs font-medium ${primary ? "border-accent bg-accent text-accent-fg" : "border-line bg-bg/85 text-fg"}`,
		children
	});
}
var COLORS = [
	"#ef4444",
	"#f97316",
	"#facc15",
	"#22c55e",
	"#06b6d4",
	"#3b82f6",
	"#a855f7",
	"#ec4899",
	"#18181b",
	"#ffffff"
];
var FINISH = [
	{
		id: "gloss",
		label: "Läige"
	},
	{
		id: "metallic",
		label: "Metallik"
	},
	{
		id: "matte",
		label: "Matt"
	}
];
var RIMS = [
	{
		id: "sport",
		label: "Sport"
	},
	{
		id: "monster",
		label: "Monster"
	},
	{
		id: "gold",
		label: "Kuld"
	},
	{
		id: "cyber",
		label: "Küber"
	}
];
var GLOW = [
	{
		id: "none",
		label: "Väljas"
	},
	{
		id: "#06b6d4",
		label: "Tsüaan"
	},
	{
		id: "#22c55e",
		label: "Roheline"
	},
	{
		id: "#ec4899",
		label: "Roosa"
	},
	{
		id: "#eab308",
		label: "Kuldne"
	},
	{
		id: "#a855f7",
		label: "Lilla"
	}
];
function CarSelect({ selectedCarId, selectedColor, customization, onSelectCar, onSelectColor, onUpdateCustomization }) {
	const hostRef = (0, import_react.useRef)(null);
	const car = CAR_DEFINITIONS.find((c) => c.id === selectedCarId) || CAR_DEFINITIONS[0];
	(0, import_react.useEffect)(() => {
		const host = hostRef.current;
		if (!host) return;
		const w = host.clientWidth || 360;
		const h = host.clientHeight || 240;
		const scene = new Scene();
		const camera = new PerspectiveCamera(42, w / h, .1, 40);
		camera.position.set(3.6, 1.9, 4.4);
		camera.lookAt(0, .55, 0);
		const renderer = new WebGLRenderer({
			alpha: true,
			antialias: true
		});
		renderer.setSize(w, h);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.toneMapping = 4;
		renderer.toneMappingExposure = 1.15;
		renderer.outputColorSpace = SRGBColorSpace;
		renderer.shadowMap.enabled = true;
		host.replaceChildren(renderer.domElement);
		scene.add(new HemisphereLight(16317180, 1976635, .9));
		const key = new DirectionalLight(16774368, 2.2);
		key.position.set(4, 8, 6);
		key.castShadow = true;
		scene.add(key);
		const rim = new DirectionalLight(9684477, .7);
		rim.position.set(-6, 3, -4);
		scene.add(rim);
		const floor = new Mesh(new CircleGeometry(2.4, 48), new MeshStandardMaterial({
			color: 1447708,
			roughness: .55,
			metalness: .35
		}));
		floor.rotation.x = -Math.PI / 2;
		floor.receiveShadow = true;
		scene.add(floor);
		const mesh = createToonCarMesh(car, selectedColor, customization);
		scene.add(mesh.root);
		let id = 0;
		let live = true;
		const spin = () => {
			if (!live) return;
			mesh.root.rotation.y += .008;
			renderer.render(scene, camera);
			id = requestAnimationFrame(spin);
		};
		spin();
		return () => {
			live = false;
			cancelAnimationFrame(id);
			renderer.dispose();
			host.replaceChildren();
		};
	}, [
		selectedCarId,
		selectedColor,
		customization,
		car
	]);
	const stats = [
		{
			label: "Kiirus",
			v: car.stats.speed
		},
		{
			label: "Kiirendus",
			v: car.stats.accel
		},
		{
			label: "Rool",
			v: car.stats.handling
		},
		{
			label: "Armor",
			v: car.stats.armor
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 lg:grid-cols-[1.1fr_0.9fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-line bg-raised",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: hostRef,
				className: "h-56 w-full sm:h-72"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
						children: "Garaaž"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-semibold tracking-tight",
						children: car.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: car.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-faint",
						children: ["Juht: ", car.driverName]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
					children: CAR_DEFINITIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							onSelectCar(c.id);
							onSelectColor(c.primaryColor);
						},
						className: `rounded-md border px-3 py-2.5 text-left text-sm font-medium ${c.id === selectedCarId ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-fg hover:border-muted"}`,
						children: c.name
					}, c.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex justify-between text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular",
							children: [s.v, "/10"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 overflow-hidden rounded-full bg-line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-accent",
							style: { width: `${s.v * 10}%` }
						})
					})] }, s.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium uppercase tracking-[0.14em] text-faint",
					children: "Värv"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": c,
						onClick: () => onSelectColor(c),
						className: `size-8 rounded-full border ${selectedColor === c ? "border-accent ring-2 ring-accent" : "border-line"}`,
						style: { backgroundColor: c }
					}, c))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tune, {
							label: "Lakk",
							options: FINISH,
							value: customization.finish,
							onChange: (finish) => onUpdateCustomization({ finish })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tune, {
							label: "Veljed",
							options: RIMS,
							value: customization.rimStyle,
							onChange: (rimStyle) => onUpdateCustomization({ rimStyle })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tune, {
							label: "Allvalgus",
							options: GLOW,
							value: customization.underglow,
							onChange: (underglow) => onUpdateCustomization({ underglow })
						})
					]
				})
			]
		})]
	});
}
function Tune({ label, options, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-faint",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "h-11 w-full rounded-md border border-line bg-surface px-2 text-fg",
			children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: o.id,
				children: o.label
			}, o.id))
		})]
	});
}
var MODES = [
	{
		id: "single",
		label: "Üksiksõit",
		hint: "AI vastu"
	},
	{
		id: "cup",
		label: "Karikasari",
		hint: "Kõik rajad"
	},
	{
		id: "timetrial",
		label: "Ajasõit",
		hint: "Puhas ring"
	}
];
function TrackSelect({ selectedTrackId, selectedLaps, gameMode, speedClass, onSelectTrack, onSelectLaps, onSelectGameMode, onSelectSpeedClass }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
					children: "Rada"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-semibold tracking-tight",
					children: "Vali ringrada"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							onSelectGameMode(m.id);
							if (m.id === "cup") onSelectTrack(TRACK_DEFINITIONS[0].id);
						},
						className: `rounded-md border px-3 py-2 text-left ${gameMode === m.id ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface text-fg"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: m.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `text-[11px] ${gameMode === m.id ? "text-accent-fg/70" : "text-faint"}`,
							children: m.hint
						})]
					}, m.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: TRACK_DEFINITIONS.map((t) => {
					const active = t.id === selectedTrackId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: gameMode === "cup",
						onClick: () => onSelectTrack(t.id),
						className: `overflow-hidden rounded-lg border text-left ${active ? "border-accent" : "border-line"} ${gameMode === "cup" && !active ? "opacity-50" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-28 overflow-hidden bg-raised",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: `/tracks/${t.id}.jpg`,
								alt: "",
								className: "h-full w-full object-cover",
								crossOrigin: "anonymous"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-2 top-2 rounded-full bg-bg/80 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted",
								children: t.difficulty
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-surface px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-lg font-semibold leading-tight",
								children: t.name.split(" (")[0]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-xs leading-relaxed text-muted",
								children: t.description
							})]
						})]
					}, t.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm text-muted",
					children: ["Ringid", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: selectedLaps,
						onChange: (e) => onSelectLaps(Number(e.target.value)),
						className: "h-11 rounded-md border border-line bg-surface px-3 text-fg",
						children: [
							2,
							3,
							4,
							5
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: n,
							children: n
						}, n))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 rounded-md border border-line bg-surface p-1",
					children: [
						"50cc",
						"100cc",
						"150cc"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onSelectSpeedClass(s),
						className: `h-9 rounded-sm px-3 text-xs font-medium ${speedClass === s ? "bg-accent text-accent-fg" : "text-muted"}`,
						children: s
					}, s))
				})]
			})
		]
	});
}
function HelpModal({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-4 sm:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg rounded-xl border border-line bg-surface p-6 shadow-[var(--shadow-panel)] sm:rounded-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-faint",
						children: "Juhend"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-semibold tracking-tight text-fg",
						children: "Kuidas sõita"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "flex size-11 items-center justify-center rounded-md border border-line text-muted hover:text-fg",
						"aria-label": "Sulge",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "space-y-3 text-sm",
					children: [
						["W / nool üles", "Gaas"],
						["S / nool alla", "Pidur ja tagasikäik"],
						["A / D või nooled", "Rool — A vasakule, D paremale"],
						["Tühik või Shift", "Drift (lae mini-turbo)"],
						["E või Enter", "Kasuta eset"],
						["C", "Vaata taha"],
						["R", "Taasta viimasele kontrollpunktile"],
						["Esc", "Paus"],
						["H", "Signaal"]
					].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 rounded-md bg-raised px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-mono text-xs text-accent",
							children: k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-muted",
							children: v
						})]
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs leading-relaxed text-faint",
					children: "Puutetekraanil on vasakul rool ja paremal gaas, pidur ning drift. Sõida kolm ringi, kogu esemeid kastidest ja ära lõika raja järjestust — kontrollpunktid loevad."
				})
			]
		})
	});
}
var STORAGE = "tooncar-gp-v1";
function loadSave() {
	try {
		const raw = localStorage.getItem(STORAGE);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function saveState(data) {
	try {
		localStorage.setItem(STORAGE, JSON.stringify(data));
	} catch {}
}
function GameApp() {
	const saved = loadSave();
	const [screen, setScreen] = (0, import_react.useState)("menu");
	const [playerName, setPlayerName] = (0, import_react.useState)(saved?.name || "Tommy Rocket");
	const [selectedCarId, setSelectedCarId] = (0, import_react.useState)(saved?.carId || "speedy_turbo");
	const [selectedColor, setSelectedColor] = (0, import_react.useState)(saved?.color || "#ef4444");
	const [selectedTrackId, setSelectedTrackId] = (0, import_react.useState)("sunny_beach");
	const [selectedLaps, setSelectedLaps] = (0, import_react.useState)(3);
	const [customization, setCustomization] = (0, import_react.useState)(saved?.customization || {
		finish: "gloss",
		rimStyle: "sport",
		underglow: "none"
	});
	const [gameMode, setGameMode] = (0, import_react.useState)("single");
	const [speedClass, setSpeedClass] = (0, import_react.useState)("100cc");
	const [cupStandings, setCupStandings] = (0, import_react.useState)([]);
	const [cupStageIndex, setCupStageIndex] = (0, import_react.useState)(0);
	const [showHelp, setShowHelp] = (0, import_react.useState)(false);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [countdownText, setCountdownText] = (0, import_react.useState)("");
	const [combatEvents, setCombatEvents] = (0, import_react.useState)([]);
	const [raceResults, setRaceResults] = (0, import_react.useState)([]);
	const [hudData, setHudData] = (0, import_react.useState)({
		speed: 0,
		lap: 1,
		totalLaps: 3,
		position: 1,
		totalRacers: 6,
		currentItem: null,
		isDrifting: false,
		hasTurbo: false,
		hasShield: false,
		isWrongWay: false,
		currentLapTime: 0,
		bestLapTime: null,
		driftCharge: 0,
		surfaceName: "",
		inSlipstream: false,
		isFinalLap: false,
		isLeader: false,
		blueThreat: false
	});
	const [minimapData, setMinimapData] = (0, import_react.useState)(null);
	const gameContainerRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		preloadTextures();
	}, []);
	(0, import_react.useEffect)(() => {
		saveState({
			name: playerName,
			carId: selectedCarId,
			color: selectedColor,
			customization
		});
	}, [
		playerName,
		selectedCarId,
		selectedColor,
		customization
	]);
	(0, import_react.useEffect)(() => {
		const keys = /* @__PURE__ */ new Set();
		const apply = () => {
			const engine = engineRef.current;
			if (!engine) return;
			const held = (...codes) => codes.some((c) => keys.has(c));
			engine.localInput.throttle = held("KeyW", "ArrowUp") ? 1 : 0;
			engine.localInput.brake = held("KeyS", "ArrowDown") ? 1 : 0;
			let steer = 0;
			if (held("KeyA", "ArrowLeft")) steer -= 1;
			if (held("KeyD", "ArrowRight")) steer += 1;
			engine.localInput.steer = steer;
			engine.localInput.drift = held("Space", "ShiftLeft", "ShiftRight");
			engine.localInput.lookBehind = held("KeyC");
		};
		const down = (e) => {
			const engine = engineRef.current;
			if (!engine) return;
			keys.add(e.code);
			if ([
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight",
				"Space"
			].includes(e.code)) e.preventDefault();
			if (!e.repeat && (e.code === "KeyE" || e.code === "Enter")) engine.localInput.useItem = true;
			if (e.code === "KeyH") engine.localInput.honk = true;
			if (e.code === "KeyR") engine.localInput.respawn = true;
			if (!e.repeat && e.code === "Escape") {
				e.preventDefault();
				if (engine.gameState === "racing" || engine.gameState === "countdown") {
					engine.paused = !engine.paused;
					setPaused(engine.paused);
				}
			}
			apply();
		};
		const up = (e) => {
			keys.delete(e.code);
			apply();
		};
		const blur = () => {
			keys.clear();
			apply();
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		window.addEventListener("blur", blur);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
			window.removeEventListener("blur", blur);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (screen !== "racing") {
			engineRef.current?.destroy();
			engineRef.current = null;
			return;
		}
		const container = gameContainerRef.current;
		if (!container) return;
		soundManager.init();
		setCombatEvents([]);
		const engine = new ToonCarEngine(container, TRACK_DEFINITIONS.find((t) => t.id === selectedTrackId) || TRACK_DEFINITIONS[0], selectedCarId, selectedColor, selectedLaps, {
			onHUDUpdate: (data) => {
				setHudData((prev) => ({
					...prev,
					...data
				}));
				if (data.minimapData) setMinimapData(data.minimapData);
			},
			onCombatEvent: (msg) => {
				setCombatEvents((prev) => [...prev.slice(-1), msg]);
				window.setTimeout(() => {
					setCombatEvents((prev) => prev.filter((m) => m !== msg));
				}, 3200);
			},
			onRaceFinished: (results) => {
				setRaceResults(results);
				if (gameMode === "cup") {
					const pointsTable = [
						15,
						12,
						10,
						8,
						6,
						4
					];
					setCupStandings((prev) => {
						const updated = [...prev];
						results.forEach((r, idx) => {
							const pts = pointsTable[idx] || 2;
							const existing = updated.find((u) => u.racerId === r.id);
							if (existing) {
								existing.points += pts;
								if (idx === 0) existing.stageWins += 1;
							} else updated.push({
								racerId: r.id,
								name: r.name,
								carId: r.carId,
								points: pts,
								stageWins: idx === 0 ? 1 : 0
							});
						});
						return updated;
					});
				}
				setScreen("results");
			},
			onCountdownTick: (val) => setCountdownText(val)
		}, gameMode === "timetrial" ? [{
			id: "player_1",
			name: playerName,
			carId: selectedCarId,
			color: selectedColor,
			isAI: false
		}] : void 0, customization, speedClass, "player_1");
		engine.localPlayerId = "player_1";
		engineRef.current = engine;
		setPaused(false);
		return () => {
			engine.destroy();
			engineRef.current = null;
		};
	}, [
		screen,
		selectedTrackId,
		selectedCarId,
		selectedColor,
		selectedLaps,
		customization,
		speedClass,
		gameMode,
		playerName
	]);
	const selectedCar = CAR_DEFINITIONS.find((c) => c.id === selectedCarId) || CAR_DEFINITIONS[0];
	const selectedTrack = TRACK_DEFINITIONS.find((t) => t.id === selectedTrackId) || TRACK_DEFINITIONS[0];
	const startRace = () => {
		soundManager.init();
		if (gameMode === "cup") {
			setCupStageIndex(0);
			setCupStandings([]);
			setSelectedTrackId(TRACK_DEFINITIONS[0].id);
		}
		setScreen("racing");
	};
	const nextCup = () => {
		const next = cupStageIndex + 1;
		if (next < TRACK_DEFINITIONS.length) {
			setCupStageIndex(next);
			setSelectedTrackId(TRACK_DEFINITIONS[next].id);
			setScreen("racing");
		} else setScreen("menu");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: gameContainerRef,
				className: `h-full w-full ${screen === "racing" ? "block" : "hidden"}`
			}),
			screen === "racing" && paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-40 flex items-center justify-center bg-bg/70 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-xl border border-line bg-surface p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl font-semibold",
							children: "Paus"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Esc jätkab."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-md bg-accent text-sm font-medium text-accent-fg",
								onClick: () => {
									if (engineRef.current) engineRef.current.paused = false;
									setPaused(false);
								},
								children: "Jätka"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-md border border-line text-sm",
								onClick: () => {
									engineRef.current?.destroy();
									engineRef.current = null;
									setPaused(false);
									setScreen("menu");
								},
								children: "Menüü"
							})]
						})
					]
				})
			}),
			screen === "racing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HUD, {
				speed: hudData.speed,
				lap: hudData.lap,
				totalLaps: hudData.totalLaps,
				position: hudData.position,
				totalRacers: hudData.totalRacers,
				currentItem: hudData.currentItem,
				isDrifting: hudData.isDrifting,
				hasTurbo: hudData.hasTurbo,
				hasShield: hudData.hasShield,
				inSlipstream: hudData.inSlipstream,
				isFinalLap: hudData.isFinalLap,
				isLeader: hudData.isLeader,
				blueThreat: hudData.blueThreat,
				isWrongWay: hudData.isWrongWay,
				currentLapTime: hudData.currentLapTime,
				bestLapTime: hudData.bestLapTime,
				driftCharge: hudData.driftCharge,
				surfaceName: hudData.surfaceName,
				combatEvents,
				countdownText,
				minimapData,
				onUseItem: () => {
					const local = engineRef.current?.racers.find((r) => r.id === engineRef.current?.localPlayerId);
					if (local && engineRef.current) engineRef.current.firePowerUp(local);
				},
				onHonk: () => soundManager.playHonk(),
				onLookBehindToggle: (active) => {
					if (engineRef.current) engineRef.current.localInput.lookBehind = active;
				},
				onRespawn: () => {
					if (engineRef.current) engineRef.current.localInput.respawn = true;
				},
				onInputStart: (action) => {
					const engine = engineRef.current;
					if (!engine) return;
					if (action === "throttle") engine.localInput.throttle = 1;
					if (action === "brake") engine.localInput.brake = 1;
					if (action === "left") engine.localInput.steer = -1;
					if (action === "right") engine.localInput.steer = 1;
					if (action === "drift") engine.localInput.drift = true;
				},
				onInputEnd: (action) => {
					const engine = engineRef.current;
					if (!engine) return;
					if (action === "throttle") engine.localInput.throttle = 0;
					if (action === "brake") engine.localInput.brake = 0;
					if (action === "left" && engine.localInput.steer < 0) engine.localInput.steer = 0;
					if (action === "right" && engine.localInput.steer > 0) engine.localInput.steer = 0;
					if (action === "drift") engine.localInput.drift = false;
				}
			}),
			screen !== "racing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-30 overflow-y-auto bg-bg",
				style: {
					backgroundImage: "linear-gradient(180deg, rgba(12,13,16,0.55), rgba(12,13,16,0.92)), url(/ui/hero.jpg)",
					backgroundSize: "cover",
					backgroundPosition: "center"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex min-h-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-8 sm:py-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-[0.2em] text-faint",
									children: "Grand Prix"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-5xl font-semibold tracking-tight sm:text-6xl",
									children: "ToonCar GP"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 max-w-md text-sm text-muted",
									children: "Cinematic 3D kart — kuus teemat, drift ja power-up'id."
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShowHelp(true),
								className: "flex h-11 items-center gap-2 rounded-md border border-line bg-surface/80 px-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "size-4" }), " Juhend"]
							})]
						}),
						screen === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto max-w-xl space-y-4 pb-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-4 rounded-xl border border-line bg-surface/90 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex size-12 items-center justify-center rounded-lg border border-line",
											style: { backgroundColor: selectedColor },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-5 text-accent-fg mix-blend-difference" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs uppercase tracking-[0.14em] text-faint",
												children: "Sõiduk"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: selectedCar.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted",
												children: selectedCar.driverName
											})
										] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setScreen("garage"),
										className: "h-11 rounded-md border border-line px-3 text-sm",
										children: "Garaaž"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1 block text-xs uppercase tracking-[0.14em] text-faint",
										children: "Nimi"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: playerName,
										onChange: (e) => setPlayerName(e.target.value.slice(0, 18)),
										className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-fg"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									id: "btn-start",
									type: "button",
									onClick: () => setScreen("circuit"),
									className: "flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-accent text-base font-medium text-accent-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), " Alusta sõitu"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-faint",
									children: "W gaas · A/D rool · tühik drift · E ese"
								})
							]
						}),
						screen === "garage" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-line bg-surface/95 p-4 sm:p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarSelect, {
								selectedCarId,
								selectedColor,
								customization,
								onSelectCar: setSelectedCarId,
								onSelectColor: setSelectedColor,
								onUpdateCustomization: (c) => setCustomization((prev) => ({
									...prev,
									...c
								}))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setScreen("menu"),
									className: "h-11 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg",
									children: "Valmis"
								})
							})]
						}),
						screen === "circuit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-line bg-surface/95 p-4 sm:p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackSelect, {
								selectedTrackId,
								selectedLaps,
								gameMode,
								speedClass,
								onSelectTrack: setSelectedTrackId,
								onSelectLaps: setSelectedLaps,
								onSelectGameMode: setGameMode,
								onSelectSpeedClass: setSpeedClass
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setScreen("menu"),
									className: "h-11 rounded-md border border-line px-4 text-sm",
									children: "Tagasi"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									id: "btn-race",
									type: "button",
									onClick: startRace,
									className: "flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-4" }), gameMode === "cup" ? "Alusta karikat" : `Sõida: ${selectedTrack.name.split(" (")[0]}`]
								})]
							})]
						}),
						screen === "results" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto w-full max-w-lg rounded-xl border border-line bg-surface/95 p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[0.16em] text-faint",
									children: "Finiš"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-4xl font-semibold",
									children: "Tulemused"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "mt-4 space-y-2",
									children: raceResults.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between rounded-md border border-line bg-raised px-3 py-2 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular text-muted",
												children: i + 1
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex-1 px-3 font-medium",
												children: r.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular text-faint",
												children: r.finishTime != null ? `${r.finishTime.toFixed(1)}s` : "—"
											})
										]
									}, r.id))
								}),
								gameMode === "cup" && cupStandings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 flex items-center gap-2 text-sm text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4" }), " Karika punktid"]
									}), cupStandings.slice().sort((a, b) => b.points - a.points).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular",
											children: s.points
										})]
									}, s.racerId))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex flex-wrap gap-2",
									children: [gameMode === "cup" && cupStageIndex + 1 < TRACK_DEFINITIONS.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: nextCup,
										className: "h-11 flex-1 rounded-md bg-accent text-sm font-medium text-accent-fg",
										children: "Järgmine etapp"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setScreen("circuit"),
										className: "h-11 flex-1 rounded-md bg-accent text-sm font-medium text-accent-fg",
										children: "Uus sõit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setScreen("menu"),
										className: "h-11 rounded-md border border-line px-4 text-sm",
										children: "Menüü"
									})]
								})
							]
						})
					]
				})
			}),
			showHelp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelpModal, { onClose: () => setShowHelp(false) })
		]
	});
}
//#endregion
export { GameApp };
