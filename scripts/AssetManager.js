class AssetManager {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.textures = {};
        this.loadingPromises = [];
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.baseTextureUrl = '../../textures/';
    }

    loadTexture(name, url) {
        this.totalAssets++;

        const promise = new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                (texture) => {
                    this.textures[name] = texture;
                    this.loadedAssets++;
                    this.updateProgress();
                    resolve(texture);
                },
                undefined,
                (err) => {
                    // console.error(`Error loading texture ${name} from ${url}:`, err);
                    // Try loading a backup texture
                    this.loadBackupTexture(name)
                        .then(resolve)
                        .catch(reject);
                }
            );
        });

        this.loadingPromises.push(promise);
        return promise;
    }

    loadBackupTexture(name) {
        // List of fallback texture URLs from NASA's 3D Resources and Solar System Scope
        const fallbackTextures = {
            'sun': '2k_sun.jpg',
            'mercury': '2k_mercury.jpg',
            'venus': '2k_venus_surface.jpg',
            'earth': '2k_earth_daymap.jpg',
            'earthNight': '2k_earth_nightmap.jpg',
            'earthBump': '2k_earth_normal_map.jpg',
            'earthSpecular': '2k_earth_specular_map.jpg',
            'moon': '2k_moon.jpg',
            'mars': '2k_mars.jpg',
            'jupiter': '2k_jupiter.jpg',
            'saturn': '2k_saturn.jpg',
            'saturnRings': '2k_saturn_ring_alpha.png',
            'uranus': '2k_uranus.jpg',
            'neptune': '2k_neptune.jpg',
            'stars': '2k_stars_milky_way.jpg'
        };

        return new Promise((resolve, reject) => {
            if (fallbackTextures[name]) {
                this.textureLoader.load(
                    this.baseTextureUrl + fallbackTextures[name],
                    (texture) => {
                        this.textures[name] = texture;
                        this.loadedAssets++;
                        this.updateProgress();
                        resolve(texture);
                    },
                    undefined,
                    (err) => {
                        console.error(`Error loading backup texture for ${name}:`, err);
                        // Create a placeholder colored texture
                        const canvas = document.createElement('canvas');
                        canvas.width = 256;
                        canvas.height = 256;
                        const ctx = canvas.getContext('2d');

                        // Generate a colored placeholder based on planet name
                        let color;
                        if (name.includes('sun')) color = '#FF8800';
                        else if (name.includes('mercury')) color = '#888888';
                        else if (name.includes('venus')) color = '#FFAA77';
                        else if (name.includes('earth')) color = '#2277AA';
                        else if (name.includes('mars')) color = '#DD4422';
                        else if (name.includes('jupiter')) color = '#DDAA88';
                        else if (name.includes('saturn')) color = '#DDCC99';
                        else if (name.includes('uranus')) color = '#AACCDD';
                        else if (name.includes('neptune')) color = '#3355AA';
                        else if (name.includes('moon')) color = '#BBBBBB';
                        else color = '#555555';

                        ctx.fillStyle = color;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        const texture = new THREE.CanvasTexture(canvas);
                        this.textures[name] = texture;
                        this.loadedAssets++;
                        this.updateProgress();
                        resolve(texture);
                    }
                );
            } else {
                reject(new Error(`No fallback texture for ${name}`));
            }
        });
    }

    waitForAllTextures() {
        return Promise.all(this.loadingPromises);
    }

    updateProgress() {
        const progressPercent = Math.round((this.loadedAssets / this.totalAssets) * 100);
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = `Loading Solar System... ${progressPercent}%`;
        }
    }

    getTexture(name) {
        return this.textures[name];
    }

    loadSolarSystemAssets() {
        // Primary texture sources from Solar System Scope
        this.loadTexture('stars', this.baseTextureUrl + '2k_stars_milky_way.jpg');
        this.loadTexture('sun', this.baseTextureUrl + '2k_sun.jpg');
        this.loadTexture('mercury', this.baseTextureUrl + '2k_mercury.jpg');
        this.loadTexture('venus', this.baseTextureUrl + '2k_venus_surface.jpg');
        this.loadTexture('earth', this.baseTextureUrl + '2k_earth_daymap.jpg');
        this.loadTexture('earthNight', this.baseTextureUrl + '2k_earth_nightmap.jpg');
        this.loadTexture('earthBump', this.baseTextureUrl + '2k_earth_nightmap.jpg');
        this.loadTexture('earthSpecular', this.baseTextureUrl + '2k_earth_nightmap.jpg');
        this.loadTexture('moon', this.baseTextureUrl + '2k_moon.jpg');
        this.loadTexture('mars', this.baseTextureUrl + '2k_mars.jpg');
        this.loadTexture('jupiter', this.baseTextureUrl + '2k_jupiter.jpg');
        this.loadTexture('saturn', this.baseTextureUrl + '2k_saturn.jpg');
        this.loadTexture('saturnRings', this.baseTextureUrl + '2k_saturn_ring_alpha.png');
        this.loadTexture('uranus', this.baseTextureUrl + '2k_uranus.jpg');
        this.loadTexture('neptune', this.baseTextureUrl + '2k_neptune.jpg');
        // Alternative stars texture as backup
        // if (!this.textures['stars']) {
        //     this.loadTexture('stars', this.baseTextureUrl + '2k_stars_milky_way.jpg');
        // }
        
        return this.waitForAllTextures();
    }
}
