


class WebFontFile extends Phaser.Loader.File {
    constructor(loader, fileConfig) {
        //console.log("WebFontFile:ctor: called",loader,fileConfig);
        super(loader, fileConfig);
    }
    load() {
        //console.log("WebFontFile: load is called!",this);
        if (this.state == Phaser.Loader.FILE_POPULATED) {
            this.loader.nextFile(this,true);
            return;
        }
        // use standard? FontFace and adds tp document
        // worked for me
        // the key here will be the font-family name
        let a = new FontFace(this.key,"url(" + this.url +")");
        document.fonts.add(a);

        // FUCKING STUPID ASS => functions...
        // javascript is ass stupid
        // need though to preserve this... sigh
        a.load().then(() => {
            //console.log("font really loaded");
            this.loader.nextFile(this,true);
        },
        () => {
            //console.log("got an err on load");
            this.loader.nextFile(this,false);
        });

    }
}

let loaderCallback = function(key, config) {
    //console.log("loaderCallback is called",key,config);
    config = {
        key : key,
        type : "webfont",
        url : config,
        config : config
    };
    this.addFile(new WebFontFile(this,config));
    return this;
}

class WebFontLoaderPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        //console.log("WebFontLoader:ctor plugin was called");
        super(pluginManager);
        //console.log("WebFontLoader:ctor: about to register file type");
        pluginManager.registerFileType("webfont",loaderCallback);
        //console.log("WebFontLoader:ctor:done");
    }
    addToScene(scene) {
        //console.log("WebFontLoader:addToScene: called");
        scene.sys.load["webfont"] = loaderCallback;
    }
}
