
module scenes
{
    export class StageOne extends objects.Scene
    {
        private background: objects.Background;
        private title: objects.Label;
        private titleShadow: objects.Label;

        private backButton: objects.Button;
        private pauseButton: objects.Button;
        private txtButton: objects.Label;

        private enemies:objects.Enemy[];        

        //private ghost: objects.Enemy;
        private player: objects.Player;

        private pauseTxtButton: objects.Label;

        private background_main: objects.Background;
        private background_shadow: objects.Background;

        private gameSceneryStaticObjects:objects.EmptyGameObject[];
        private gameSceneryDynamicObjects:objects.DynamicObject[];

        private timeRemaining: objects.Label;


        constructor(assetManager: createjs.LoadQueue)
        {
            super(assetManager);
            this.Start();
        }

        private fn_ButtonClick():void
        {
            objects.Game.currentScene = config.Scene.FINISH;
        }

        private fn_pauseButtonClick():void
        {
            objects.Game.currentScene = config.Scene.PAUSE;
        }

        public Start():void
        {
            
            //config.Gravity.gravityFactor = -1;
            
            objects.Game.isDebug = true;
            this.isPaused = false;
            this.gameSceneryStaticObjects = new Array<objects.EmptyGameObject>();
            this.gameSceneryDynamicObjects = new Array<objects.DynamicObject>();
            
            this.enemies = new Array<objects.Enemy>();

            objects.Game.keyboard = new managers.Keyboard();
            var ghost = new objects.Enemy(this.assetManager, "ghost", 550, 245);
            ghost.y = ghost.y - ghost.height;
            this.enemies[0] = ghost;

            console.log("GAME SCENE(S)...");        

            //this.timeRemaining = new objects.Timer(objects.Game.stageTimer, (1066/2), 50, true);
            this.timeRemaining = new objects.Label(objects.Game.stageTimer.toString(), "bold 32px", "Cambay", "#000000", 66, 65, true);
        
            this.background = new objects.Background(this.assetManager, "level_01");           
            this.background_main = new objects.Background(this.assetManager, "level_01");           
            this.background_shadow = new objects.Background(this.assetManager, "level_01_shadow");
            
            this.txtButton = new objects.Label("Bypass!", "18px", "bold Cambay", "#ffffff");
            this.txtButton.x = 910;
            this.txtButton.y = 565;  
            
            
            this.player = new objects.Player(this.assetManager);            
            this.player.boxCollider = new objects.BoxCollider(18, 16, this.player.x, 
                this.player.y, 
                this.player.width - 45, this.player.height - 20);
                
            this.Main();

        }

        public CreateFunctionCheck(gameObject:objects.GameObject) {
            let boxCollider:objects.BoxCollider = gameObject.boxCollider;
            return (x:number, y:number) : managers.AABB => {
                let collided = false;                                
                let aabbCollider = boxCollider.GetAABB(x, y);
                let result: managers.AABB;

                for(let i = 0; i < this.gameSceneryStaticObjects.length; i++) {
                    var platform = this.gameSceneryStaticObjects[i];                    
                    result = managers.Collision.CheckAABBCollision(aabbCollider, platform.boxCollider.aabb);
                    if (result.CheckCollided()) {
                        collided = true;
                        break;
                    } 
                }
                if (!collided) {
                    for(let i = 0; i < this.gameSceneryDynamicObjects.length; i++) {
                        var object = this.gameSceneryDynamicObjects[i];
                        if (object.name !== gameObject.name) {
                            result = managers.Collision.CheckAABBCollision(aabbCollider, object.boxCollider.aabb);
                            if (result.CheckCollided()) {
                                collided = true;
                                if (gameObject.name === this.player.name) {
                                    object.aabbResultPlayer = result;
                                    this.player.actionObject = object;
                                }
                                break;
                            } 
                        }
                    }
                }

                if (!collided) {
                    this.player.actionObject = null;
                }
                return result;
            };
        }


        public Update():void
        {
            this.CheckPaused();
            if (this.isPaused){
                return;
            } 

            
            this.timeRemaining.text = this.timeRemaining.fn_ChangeLabel();
            
            let CheckMovement = this.CreateFunctionCheck(this.player);

            this.player.UpdateIfPossible(CheckMovement);
            
            this.enemies.forEach(enemy => {
                enemy.Update();
            });

            for(let i = 0; i < this.gameSceneryStaticObjects.length; i++) {
                var platform = this.gameSceneryStaticObjects[i];
                platform.Update();
            }

            for(let i = 0; i < this.gameSceneryDynamicObjects.length; i++) {
                var object = this.gameSceneryDynamicObjects[i];
                object.UpdateIfPossible(this.CreateFunctionCheck(object));
            }
        }

        public Main():void
        {        
            this.timeRemaining.fn_TimerTicker(objects.Game.stageTimer);
            //this.addChild(this.background);
            this.addChild(this.background_main);
            
         //   this.addChild(this.timeRemaining);
            
         //   this.addChild(this.titleShadow);
         //   this.addChild(this.title);
            
         //   this.addChild(this.backButton);
         //   this.addChild(this.txtButton);
            
            this.CreateScenery();
            this.addChild(this.player);
         //   this.enemies.forEach(ghost => {
          //      this.addChild(ghost);  
          //  });

          //  this.addChild(this.background_shadow);
            
            //create the empties gameobjects to be the stage boundaries

         //   this.backButton.on("click", this.fn_ButtonClick);

         //   var callback = () : void => {
         //       this.removeChild(this.title);
         //       this.removeChild(this.titleShadow);
         //   }
        //    this.StartCountdown(3, callback);

          //  this.addChild(this.pauseButton);
         //   this.addChild(this.pauseTxtButton);
            
        //    this.backButton.on("click", this.fn_ButtonClick);
         //   this.pauseButton.on("click", ()=>{this.isPaused = !this.isPaused; this.fn_pauseButtonClick;});//pause
        
        }
        
        private CreateScenery() {
            
            //Boundary
            var wall_l = new objects.EmptyGameObject(this.assetManager, "wall_l", 1, 600);
            wall_l.x = 1;
            wall_l.y = 1;
            this.addChild(wall_l);
            
            var wall_r = new objects.EmptyGameObject(this.assetManager, "wall_r", 1, 600);
            wall_r.x = 1065;
            wall_r.y = 1;
            this.addChild(wall_r);

            var wall_t = new objects.EmptyGameObject(this.assetManager, "wall_t", 1066, 1);
            wall_t.x = 1;
            wall_t.y = 1;
            this.addChild(wall_t);
            
            var wall_d = new objects.EmptyGameObject(this.assetManager, "wall_d", 1066, 1);
            wall_d.x = 1;
            wall_d.y = 599;
            this.addChild(wall_d);

            this.gameSceneryStaticObjects[10] = wall_l;
            this.gameSceneryStaticObjects[11] = wall_r;
            this.gameSceneryStaticObjects[12] = wall_t;
            this.gameSceneryStaticObjects[9] = wall_d;


            this.CreateFloors();
          //  this.CreatePlatformsStairs();
           // this.CreateObjects();

        }
        private CreateObjects():void {
            var floor_3_Desk = new objects.OpenableObject(this.assetManager, "closed_desk","opened_desk"); 
            floor_3_Desk.boxCollider = new objects.BoxCollider(0 , 0, floor_3_Desk.x, floor_3_Desk.y, 
                floor_3_Desk.width, floor_3_Desk.height);
            this.addChild(floor_3_Desk);
                        
            floor_3_Desk.x = 615;
            floor_3_Desk.y = 190;

            this.gameSceneryDynamicObjects[1] = floor_3_Desk;

            var floor_3_Crate = new objects.PushableObject(this.assetManager, "crate"); 
            floor_3_Crate.boxCollider = new objects.BoxCollider(0 , 0, floor_3_Crate.x, floor_3_Crate.y, 
                floor_3_Crate.width, floor_3_Crate.height-5);
            this.addChild(floor_3_Crate);
                        
            floor_3_Crate.x = 415;
            floor_3_Crate.y = 190;

            this.gameSceneryDynamicObjects[0] = floor_3_Crate;

        
        }
        
        private CreateFloors():void {
            //Floors platforms
            let platform_offset = 20;
            var wall_1 = new objects.EmptyGameObject(this.assetManager, "wall_1", 450, 21); 
            this.addChild(wall_1);
            this.gameSceneryStaticObjects[7] = wall_1;
            wall_1.x = 145;
            wall_1.y = 65;

            var wall_11 = new objects.EmptyGameObject(this.assetManager, "wall_11", 310, 21); 
            this.addChild(wall_11);
            this.gameSceneryStaticObjects[8] = wall_11;
            wall_11.x = 681;
            wall_11.y = 65;

            var wall_21 = new objects.EmptyGameObject(this.assetManager, "wall_21", 160, 21); 
            this.addChild(wall_21);
            this.gameSceneryStaticObjects[6] = wall_21;
            wall_21.x = 145;
            wall_21.y = 140;
    
            var wall_22 = new objects.EmptyGameObject(this.assetManager, "wall_22", 215, 21); 
            this.addChild(wall_22);
            this.gameSceneryStaticObjects[5] = wall_22;
            wall_22.x = 375;
            wall_22.y = 141;

            var wall_23 = new objects.EmptyGameObject(this.assetManager, "wall_23", 145, 21); 
            this.addChild(wall_23);
            this.gameSceneryStaticObjects[4] = wall_23;
            wall_23.x = 680;
            wall_23.y = 140;

            var wall_3 = new objects.EmptyGameObject(this.assetManager, "wall_3", 225, 21); 
            this.addChild(wall_3);
            this.gameSceneryStaticObjects[3] = wall_3;
            wall_3.x = 145;
            wall_3.y = 217;
    
            var wall_32 = new objects.EmptyGameObject(this.assetManager, "wall_32", 93, 21); 
            this.addChild(wall_32);
            this.gameSceneryStaticObjects[2] = wall_32;
            wall_32.x = 447;
            wall_32.y = 218;
    
            var wall_33 = new objects.EmptyGameObject(this.assetManager, "wall_33", 93, 21); 
            this.addChild(wall_33);
            this.gameSceneryStaticObjects[1] = wall_33;
            wall_33.x = 675;
            wall_33.y = 218;
    
            var wall_4 = new objects.EmptyGameObject(this.assetManager, "wall_4", 165, 21); 
            this.addChild(wall_4);
            this.gameSceneryStaticObjects[0] = wall_4;
            wall_4.x = 145;
            wall_4.y = 295;

            var wall_5 = new objects.EmptyGameObject(this.assetManager, "wall_5", 160, 21); 
            this.addChild(wall_5);
            this.gameSceneryStaticObjects[13] = wall_5;
            wall_5.x = 225;
            wall_5.y = 372;

            var wall_51 = new objects.EmptyGameObject(this.assetManager, "wall_51", 235 , 21); 
            this.addChild(wall_51);
            this.gameSceneryStaticObjects[14] = wall_51;
            wall_51.x = 760;
            wall_51.y = 371;

            var wall_6 = new objects.EmptyGameObject(this.assetManager, "wall_6", 243, 21); 
            this.addChild(wall_6);
            this.gameSceneryStaticObjects[15] = wall_6;
            wall_6.x = 145;
            wall_6.y = 445;

            var wall_61 = new objects.EmptyGameObject(this.assetManager, "wall_61", 160, 21); 
            this.addChild(wall_61);
            this.gameSceneryStaticObjects[16] = wall_61;
            wall_61.x = 755;
            wall_61.y = 445;

            var wall_7 = new objects.EmptyGameObject(this.assetManager, "wall_7", 375, 21); 
            this.addChild(wall_7);
            this.gameSceneryStaticObjects[17] = wall_7;
            wall_7.x = 67;
            wall_7.y = 520;

            var wall_71 = new objects.EmptyGameObject(this.assetManager, "wall_71", 320, 21); 
            this.addChild(wall_4);
            this.gameSceneryStaticObjects[18] = wall_71;
            wall_71.x = 600;
            wall_71.y = 520;

            //Standing colliders
            var stand_1 = new objects.EmptyGameObject(this.assetManager, "stand_1", 21,390); 
            this.addChild(stand_1);
            this.gameSceneryStaticObjects[19] = stand_1;
            stand_1.x = 65;
            stand_1.y = 150;

            var stand_21 = new objects.EmptyGameObject(this.assetManager, "stand_21", 21,95); 
            this.addChild(stand_21);
            this.gameSceneryStaticObjects[20] = stand_21;
            stand_21.x = 143;
            stand_21.y = 143;

            var stand_22 = new objects.EmptyGameObject(this.assetManager, "stand_22", 21,160); 
            this.addChild(stand_22);
            this.gameSceneryStaticObjects[21] = stand_22;
            stand_22.x = 144;
            stand_22.y = 300;

            var stand_3 = new objects.EmptyGameObject(this.assetManager, "stand_3", 21,240); 
            this.addChild(stand_3);
            this.gameSceneryStaticObjects[22] = stand_3;
            stand_3.x = 368;
            stand_3.y = 218;

            var stand_4 = new objects.EmptyGameObject(this.assetManager, "stand_4", 21,320); 
            this.addChild(stand_4);
            this.gameSceneryStaticObjects[23] = stand_4;
            stand_4.x = 447;
            stand_4.y = 220;

            var stand_5 = new objects.EmptyGameObject(this.assetManager, "stand_5", 21,390); 
            this.addChild(stand_5);
            this.gameSceneryStaticObjects[24] = stand_5;
            stand_5.x = 520;
            stand_5.y = 220;

            var stand_6 = new objects.EmptyGameObject(this.assetManager, "stand_6", 21,320); 
            this.addChild(stand_6);
            this.gameSceneryStaticObjects[25] = stand_6;
            stand_6.x = 600;
            stand_6.y = 220;

            var stand_7 = new objects.EmptyGameObject(this.assetManager, "stand_7", 21,240); 
            this.addChild(stand_7);
            this.gameSceneryStaticObjects[26] = stand_7;
            stand_7.x = 673;
            stand_7.y = 220;

            var stand_62 = new objects.EmptyGameObject(this.assetManager, "stand_62", 21,162); 
            this.addChild(stand_62);
            this.gameSceneryStaticObjects[27] = stand_62;
            stand_62.x = 595;
            stand_62.y = 0;

            var stand_8 = new objects.EmptyGameObject(this.assetManager, "stand_8", 21,85); 
            this.addChild(stand_8);
            this.gameSceneryStaticObjects[28] = stand_8;
            stand_8.x = 749;
            stand_8.y = 220;

            var stand_9 = new objects.EmptyGameObject(this.assetManager, "stand_9", 21,240); 
            this.addChild(stand_9);
            this.gameSceneryStaticObjects[29] = stand_9;
            stand_9.x = 826;
            stand_9.y = 141;

            var stand_10 = new objects.EmptyGameObject(this.assetManager, "stand_10", 21,240); 
            this.addChild(stand_10);
            this.gameSceneryStaticObjects[30] = stand_10;
            stand_10.x = 902;
            stand_10.y = 65;

            var stand_11 = new objects.EmptyGameObject(this.assetManager, "stand_11", 21,240); 
            this.addChild(stand_11);
            this.gameSceneryStaticObjects[31] = stand_11;
            stand_11.x = 978;
            stand_11.y = 143;

            

        } 

    }
}
