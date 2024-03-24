function loadImage(key, filename, onComplete) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve({key, filename, asset: image});
            if (typeof onComplete === 'function') onComplete({ filename, image });
        }, { once: true });
        image.addEventListener('error', (event) => reject({filename, event}));
        image.src = filename;
    });
}

function loadSound(key, filename, onComplete) {
    return new Promise((resolve, reject) => {
        const sound = new Audio()
        sound.addEventListener('canplay', () => {
            resolve({key, filename, asset: sound})
            if (typeof onComplete === 'function') onComplete({filename, sound})
        }, {once: true});
        sound.addEventListener('error', (event) => reject({filename, event}));
        sound.src = filename;
    });
}

async function load(assetsArray, onComplete) {
    const promises = assetsArray.map(([key, filename]) => {
        const extenstion = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        const type = AssetTypeLookup[extenstion];

        if (type === AssetType.IMAGE) {
            return loadImage(key, filename, onComplete)
        } else if (type === AssetType.SOUND) {
            return loadSound(key, filename, onComplete)
        } else {
            throw new TypeError('Unknown file type error')
        }
    });

    return Promise.all(promises).then((loadAssets) => {
        for (const {key, asset} of loadAssets) {
            assets.set(key, asset);
        }
    });
}

function handleAssetDownload({filename, image}) {
    // console.log(`${filename} has been downaloded!`);
    if (typeof LoadingScreenIns !== 'undefined') {
        LoadingScreenIns.setSpeed(100 / assetList.length)
    }
}