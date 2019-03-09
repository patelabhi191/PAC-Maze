module scenes
{
    export class StartScene extends objects.Scene
    {
        private background: objects.Background;
        private gameTitle: objects.Label;
        private gameTitleShadow: objects.Label;
        private startButton: objects.Button;
        private txtStartButton: objects.Label;
        private hDivider: objects.Image;
        private hDivider2: objects.Image;
        private label1: objects.Label;
        private timer: number = 0;
        private zoomInOut: boolean = false;

        constructor(assetManager: createjs.LoadQueue)
        {
            super(assetManager);
            this.Start();
        }

        private fn_ButtonClick():void
        {
            objects.Game.currentScene = config.Scene.INGAME;
        }

        public Start():void
        {
            console.log("Main Menu/Start Menu...");        
        
            this.background = new objects.Background(this.assetManager, "background");
           
            this.startButton = new objects.Button(this.assetManager, "startButton", 1066 * 0.5, 600 * 0.65, true);
            this.startButton.scaleX = 0.75;
            this.txtStartButton = new objects.Label("PLAY", "20px", "Cambay", "#f7fffd",this.startButton.x,this.startButton.y + 2, true);     
            this.label1 = new objects.Label("Abhi Patel - 300984015", "28px", "Cambay", "#8c8cff", 1066 * 0.5, 600 * 0.1, true);
            this.hDivider = new objects.Image(this.assetManager,"hdivider" ,1066 * 0.5, 600 * 0.3, true);
            this.hDivider.scaleX = 2;

            this.hDivider2 = new objects.Image(this.assetManager,"hdivider" ,1066 * 0.5, 600 * 0.175, true);
            this.hDivider2.scaleX = 2;
            this.Main();
        }
        
        public Update():void
        {
            this.timer += 1;
            if (this.timer >= 30) {
                this.timer = 0;
                if (this.zoomInOut) {
                    this.startButton.scaleX = 0.85;
                    this.txtStartButton.scaleX = 1.25;
                    this.startButton.scaleY = 1;
                    this.txtStartButton.scaleY = 1.3;
                }
                else {
                    this.startButton.scaleX = 0.75;
                    this.txtStartButton.scaleX = 1;
                    this.startButton.scaleY = 1;
                    this.txtStartButton.scaleY = 1;
                }
                console.log("this ran !");
                this.zoomInOut = !this.zoomInOut;
            }
        }

        public Main():void
        {
            this.addChild(this.background);
            this.addChild(this.gameTitleShadow);
            this.addChild(this.gameTitle);
            this.addChild(this.startButton);
            this.addChild(this.txtStartButton);
            this.addChild(this.label1);
            this.startButton.on("click", this.fn_ButtonClick);
        }
    }
}