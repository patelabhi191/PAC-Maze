module objects {
    export class Enemy extends objects.GameObject {
        // Variables
        leftSide:Boolean = true;
        
        // Constructor
       
        constructor(assetManager: createjs.LoadQueue, imageString:string, x:number = 0, y:number = 0,)
        {
            super(assetManager, imageString); 
            this.x = x;
            this.y = y;     
            this.Start();          
        }
        
        public Start():void{
            console.log('In Enemy');
        }

        public Update():void {
            super.Update();
       
        }        
        
        public Reset():void {}
        
    }
}