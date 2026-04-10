
let day;

function get_day()
{
    return parseInt(localStorage.getItem('day'));
}

class ScooterScene extends Phaser.Scene {
    
    constructor() {
        super('ScooterScene');
    }


    preload() 
    {
        this.load.image("playerScooter1", "sprites/1x/ScooterScene/scooter1.png")
        this.load.image("playerScooter2", "sprites/1x/ScooterScene/scooter2.png")
        this.load.image("playerScooter3", "sprites/1x/ScooterScene/scooter3.png")
        this.load.image("rock", "sprites/1x/ScooterScene/rock.png")
        this.load.image("back", "sprites/1x/ScooterScene/road.png")
    }

    create() {
        this.currentline = 0;
        this.lines = [250,590,940];
        this.canmove = true;
        const bg = this.add.image(600, 400, 'back').setOrigin(0.5);
        bg.setDisplaySize(1200,800);
 

        this.anims.create({
            key: "move",
            frames: [ 
                { key: "playerScooter1" },
                { key: "playerScooter2" },
                { key: "playerScooter3" },
                { key: "playerScooter1"}
            ],
            frameRate: 20,
            repeat: -1
        });

        this.player = this.physics.add.sprite(250,500,"playerScooter1");
        this.player.play("move");
        this.player.setDisplaySize(110,150);
        this.player.body.setSize(140,170);

        this.tutorialText = this.add.text(
        150,                             
        700,
        'AD. Передвигайтесь по дорожкам и уклоняйтесь от камней.',
        { 
            fontSize: '32px',
            fill: '#e7e7e7ff',            
            stroke: '#b4b4b4ff',         
            strokeThickness: 1
        }
        ).setOrigin(0, 1).setScrollFactor(0).setDepth(1001).setVisible(false);

        this.timer = this.add.text(
        1100,                             
        80,
        '30',
        { 
            fontSize: '45px',
            fill: '#e7e7e7ff',            
            stroke: '#b4b4b4ff',         
            strokeThickness: 2
        }
        ).setOrigin(0, 1).setScrollFactor(0).setDepth(1001).setVisible(true);

        this.showText();

        this.rocks = this.physics.add.group();

        this.spawnborders = [0,0.33, 0.33, 0.66, 0.66, 1]

        this.physics.add.overlap(
            this.player,
            this.rocks,
            (player, rock) => {
            this.gameOver();
            }
        );
        this.nsec = 1;
        this.gameTime = 0;
        this.timeSinceLastSpawn = 0;
        this.currentTargetSpawnTime = Phaser.Math.FloatBetween(500, 1000);
        this.gameTimer = this.time.addEvent({
        delay: 10,                 
        callback: this.handleRockSpawn,
        callbackScope: this,       
        loop: true                 
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey('A');
        this.keyD = this.input.keyboard.addKey('D');
    }

    handleRockSpawn()
    {
        this.timeSinceLastSpawn += 10;
        this.gameTime += 10;
        if (this.timeSinceLastSpawn >= this.currentTargetSpawnTime) 
        {
            this.attemptSpawnRock();
        }

        if (this.gameTime >= 30000)
        {
            this.endGamePhase("none");
        }

        if (this.gameTime == this.nsec*1000)
        {
            this.timer.setText(30-this.nsec);
            this.nsec += 1;
        }
    }


    attemptSpawnRock()
    {
        const Seconds = this.timeSinceLastSpawn / 1000;
        const baseChance = 0.5;
        const delta = Seconds - 0.5;
        const extraChance = (delta/0.5)*0.002;
        const totalChance = Math.min(1.0, baseChance + extraChance);

        if(Math.random() >= totalChance)
        {
            return
        }

        const old = [...this.spawnborders];
        const chanceOfLaneIndex = Math.random();
        let laneIndex = 0;
        if (chanceOfLaneIndex >= old[0] && chanceOfLaneIndex < old[1]) {
        laneIndex = 0;
        
        this.spawnborders[1] = Math.max(0.1, this.spawnborders[1] - 0.03);
        this.spawnborders[2] = Math.min(this.spawnborders[2] + 0.015, 0.33); 
        this.spawnborders[4] = Math.min(this.spawnborders[4] + 0.015, 1.0);
        }

        if (chanceOfLaneIndex >= old[2] && chanceOfLaneIndex < old[3]) {
            laneIndex = 1;
            this.spawnborders[1] = Math.min(this.spawnborders[1] + 0.015, 0.33);
            this.spawnborders[2] = Math.max(0.33, this.spawnborders[2] - 0.03);
            this.spawnborders[4] = Math.min(this.spawnborders[4] + 0.015, 1.0);
        }

        if (chanceOfLaneIndex >= old[4] && chanceOfLaneIndex < old[5]) {
            laneIndex = 2;
            
            this.spawnborders[1] = Math.min(this.spawnborders[1] + 0.015, 0.33);
            this.spawnborders[2] = Math.min(this.spawnborders[2] + 0.015, 0.33);
            this.spawnborders[4] = Math.max(0.66, this.spawnborders[4] - 0.03);
        }

        const x = this.lines[laneIndex];

        const rock1 = this.rocks.create(x, -30, 'rock')
        rock1.setDisplaySize(100,60);
        rock1.body.setSize(130,100);
        rock1.setVelocityY(1050);
        if(Math.random() < 0.4)
        {
            let secondLane = laneIndex;
            if (Math.random() < 0.5) {
                const other = Phaser.Math.Between(0, 1);
                secondLane = (laneIndex + 1 + other) % 3;
            }
            const x2 = this.lines[secondLane];
            const rock2 = this.rocks.create(x2, -30, 'rock');
            rock2.setDisplaySize(100,60);
            rock2.body.setSize(130,100);
            rock2.setVelocityY(1050);
        }


        this.timeSinceLastSpawn = 0;
        this.currentTargetSpawnTime = Phaser.Math.FloatBetween(2500, 5000);
    }

    showText()
    {
        this.tutorialText.setVisible(true);
        this.time.delayedCall(3000, ()=>
            {
                this.tweens.add(
                    {
                        targets: this.tutorialText,
                        alpha:0,
                        duration:1000,
                        ease:"Powe2"
                    });
        });
    }

    gameOver()
    {
        this.endGamePhase("scootercrush");
    }

    endGamePhase(eventName)
    {
        localStorage.setItem("event", eventName);
        localStorage.setItem("isNextDay", "true");
        this.game.destroy(true);
        window.location.href = 'computer.html';
    }

    update() 
    {

    this.player.setVelocity(0, 0);



    if (this.keyA.isDown && this.canmove && this.currentline > 0) { 
        this.canmove = false;
        this.currentline -= 1;
        this.player.x = this.lines[this.currentline];

        this.time.delayedCall(200, () => {
        this.canmove = true;
        });
    }

    if (this.keyD.isDown && this.canmove && this.currentline < 2) { 
        this.canmove = false;
        this.currentline += 1;
        this.player.x = this.lines[this.currentline];

        this.time.delayedCall(200, () => {
        this.canmove = true;
        });
    }

  }

}


class HandScene1 extends Phaser.Scene {
    
    constructor() {
        super({
            key: 'HandScene1',
            physics: {
                default: 'matter',               
                matter: {
                    debug: false,
                    gravity: { y: 0 }
                }
            }
        });
    }


    preload() 
    {
        this.load.image("playereye", "sprites/1x/HandScene/playereye.png")
        this.load.image("hand", "sprites/1x/HandScene/hand.png")
        this.load.image("backgroundHandScene", "sprites/1x/HandScene/background.png")
    }

    create() {
        const bg = this.add.image(600, 400, 'backgroundHandScene').setOrigin(0.5);
        bg.setDisplaySize(1200,800);
 
        this.matter.world.setBounds(0, 0, 1200, 800, 64, true, true, true, true);

        this.player = this.matter.add.sprite(170, 500, "playereye");
        this.player.setDisplaySize(90,45);
        this.player.body.label = "player";
        this.player.body.friction = 0.5;
        this.player.body.mass = 1;
        this.speed = 8.5;

        this.tutorialText = this.add.text(
        350,                             
        700,
        'WASD. Уклоняйтесь от рук',
        { 
            fontSize: '40px',
            fill: '#1c1b1bff',            
            stroke: '#000000ff',         
            strokeThickness: 1
        }
        ).setOrigin(0, 1).setScrollFactor(0).setDepth(1001).setVisible(false);

        this.xsize = 250;
        this.ysize = 500;

        this.hand1 = this.matter.add.sprite(200, -600, "hand");
        this.hand1.setDisplaySize(this.xsize, this.ysize);
        this.hand1.angle = 180;
        this.hand1.body.label = "hand";
        this.hand1.setSensor(true);

        this.hand2 = this.matter.add.sprite(550, -600, "hand");
        this.hand2.setDisplaySize(this.xsize, this.ysize);
        this.hand2.angle = 180;
        this.hand2.body.label = "hand";
        this.hand2.setSensor(true);

        this.hand3 = this.matter.add.sprite(900, -600, "hand");
        this.hand3.setDisplaySize(this.xsize, this.ysize);
        this.hand3.angle = 180;
        this.hand3.body.label = "hand";
        this.hand3.setSensor(true);

        this.hand4 = this.matter.add.sprite(200, 1400, "hand");
        this.hand4.setDisplaySize(this.xsize, this.ysize);
        this.hand4.body.label = "hand";
        this.hand4.setSensor(true);

        this.hand5 = this.matter.add.sprite(550, 1400, "hand");
        this.hand5.setDisplaySize(this.xsize, this.ysize);
        this.hand5.body.label = "hand";
        this.hand5.setSensor(true);

        this.hand6 = this.matter.add.sprite(900, 1400, "hand");
        this.hand6.setDisplaySize(this.xsize, this.ysize);
        this.hand6.body.label = "hand";
        this.hand6.setSensor(true);

        this.hand7 = this.matter.add.sprite(-600, 500, "hand");
        this.hand7.setDisplaySize(this.xsize, this.ysize);
        this.hand7.body.label = "hand";
        this.hand7.setSensor(true);
        this.hand7.angle = 90;

        this.hand8 = this.matter.add.sprite(-600, 300, "hand");
        this.hand8.setDisplaySize(this.xsize, this.ysize);
        this.hand8.body.label = "hand";
        this.hand8.setSensor(true);
        this.hand8.angle = 90;

        this.hand9 = this.matter.add.sprite(1800, 500, "hand");
        this.hand9.setDisplaySize(this.xsize, this.ysize);
        this.hand9.body.label = "hand";
        this.hand9.setSensor(true);
        this.hand9.angle = 270;

        this.hand10 = this.matter.add.sprite(1800, 300, "hand");
        this.hand10.setDisplaySize(this.xsize, this.ysize);
        this.hand10.body.label = "hand";
        this.hand10.setSensor(true);
        this.hand10.angle = 270;
        
        this.sceneStartTime = this.time.now;

        this.timeline = 
        [
            {time:0, action: () => { this.nullaction(); }},
            {time:4000, action: () => { this.firstaction(); }},
            {time:6000, action: () => { this.secondaction(); }},
            {time:9000, action: () => { this.thirdaction(); }},
            {time:13000, action: () => { this.fourthtaction(); }},
            {time:18000, action: () => { this.fifthaction(); }},
            {time:22000, action: () => { this.sixthtaction(); }},
            {time:25000, action: () => { this.seventhstaction(); }},
            {time:29000, action: () => { this.eightthaction(); }},
            {time:32000, action: () => { this.endGamePhase("none"); }}
        ];
        this.index = 0;

        this.matter.world.on('collisionstart', (event) => 
        {
            event.pairs.forEach(pair => 
                {
                    const {bodyA,bodyB} = pair;
                    console.log('Pair:', bodyA.label, bodyB.label);
                    if ( (bodyA.label === 'hand' && bodyB.label === 'player') ||
            (bodyA.label === 'player' && bodyB.label === 'hand'))
                        {
                            this.gameOver();
                        }
                });
        });

        this.timeLineTimer = this.time.addEvent
        (
            {
            delay: 50,
            callback: this.updateTimeLine,
            callbackScope: this,
            loop: true
            }
        );

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey('A');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyW = this.input.keyboard.addKey('W');
        this.keyD = this.input.keyboard.addKey('D');
    }

    updateTimeLine()
        {
            const elapsed = this.time.now-this.sceneStartTime;

            if(this.index < this.timeline.length)
            {
                const event = this.timeline[this.index];
                if(elapsed >= event.time)
                {
                    event.action.call(this);
                    this.index++;
                }
            }
        }


    nullaction()
    {
        this.tutorialText.setVisible(true);
        this.time.delayedCall(3000, ()=>
            {
                this.tweens.add(
                    {
                        targets: this.tutorialText,
                        alpha:0,
                        duration:1000,
                        ease:"Powe2"
                    });
            });
    }

    firstaction()
    {
        this.tweens.add(
        {
        targets: this.hand1,
        y: 500,
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand1,
                                y: -600,
                                duration: 1000,
                                ease: 'Sine.easeInOut',
                            });
                    });
            }
        });

        this.tweens.add(
        {
        targets: this.hand8,
        x: 400,
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand8,
                                x: -600,
                                duration: 1000,
                                ease: 'Sine.easeInOut',
                            });
                    });
            }
        });
    }

    secondaction()
    {
        this.tweens.add(
        {
        targets: this.hand8,
        x: {from:900, to: 600},
        y: {from:0,to: 150},
        angle: {from:180,to:225},
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand8,
                                x: {from:600, to: 300},
                                angle: {from:225, to: 270},
                                y: -600,
                                duration: 1000,
                                ease: 'Sine.easeInOut',
                            });
                    });
            }
        });

        this.tweens.add(
        {
        targets: this.hand5,
        y: {from:1600,to: 500},
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand5,
                                y: 1600,
                                duration: 1000,
                                ease: 'Sine.easeInOut',
                            });
                    });
            }
        });
    }

    thirdaction()
    {
        this.tweens.add(
        {
        targets: this.hand5,
        y: {from:1600,to: 700},
        duration: 1200,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand5,
                                y: 1600,
                                duration: 1000,
                                ease: 'Sine.easeInOut',
                            });
                    });
            }
        });

        this.tweens.add(
        {
        targets: this.hand7,
        x: {from:-600,to: 300},
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand7,
                                x: -600,
                                duration: 1000,
                                ease: 'Sine.easeInOut',
                            });
                    });
            }
        });
    }

    fourthtaction()
    {
        this.hand1.x = 0;
        this.hand4.x = 0;
        this.tweens.add(
        {
        targets: this.hand1,
        y: {from:-200,to: 200},
        duration: 1000,
        ease: 'Sine.easeInOut',
        });
        this.tweens.add(
        {
        targets: this.hand4,
        y: {from:1000,to: 550},
        duration: 1000,
        ease: 'Sine.easeInOut',
        });

        this.time.delayedCall(1000, () =>
            {
            this.tweens.add(
            {
            targets: this.hand1,
            x: {from:0,to: 800},
            duration: 2300,
            ease: 'Sine.easeInOut',
            onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand1,
                                y: 50,
                                duration: 800,
                                ease: 'Sine.easeInOut',
                            });
                    });
                }
                });

                this.tweens.add(
                {
                targets: this.hand4,
                x: {from:0,to: 800},
                duration: 2300,
                ease: 'Sine.easeInOut',
                onComplete: () => 
                    {
                        this.time.delayedCall(300, () => 
                            {
                                this.tweens.add(
                                    {
                                        targets: this.hand4,
                                        y: 650,
                                        duration: 800,
                                        ease: 'Sine.easeInOut'
                                    });
                            });
                    }
                });
            });
    }

    fifthaction()
    {
        this.tweens.add(
        {
            targets: this.hand1,
            y: -600,
            duration: 800,
            ease: 'Sine.easeInOut'
        });
        this.tweens.add(
        {
            targets: this.hand4,
            y: 1600,
            duration: 800,
            ease: 'Sine.easeInOut',
            onComplete: () => {this.hand1.x = 200; this.hand4.x = 200;}
        });
        this.tweens.add(
        {
        targets: this.hand9,
        x: {from:1600,to: 900},
        duration: 1800,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand9,
                                x: 1600,
                                duration: 800,
                                ease: 'Sine.easeInOut',
                                onComplete: () => 
                    {
                                this.time.delayedCall(300, () => 
                                {
                                this.tweens.add(
                                    {
                                        targets: this.hand1,
                                        y: -600,
                                        duration: 800,
                                        ease: 'Sine.easeInOut'
                                    });
                                this.tweens.add(
                                    {
                                        targets: this.hand4,
                                        y: 1600,
                                        duration: 800,
                                        ease: 'Sine.easeInOut',
                                        onComplete: () => {this.hand1.x = 200; this.hand4.x = 200;}
                                    });
                                });
                                }
                            });
                    });
            }
        });

        this.tweens.add(
        {
        targets: this.hand10,
        x: {from:1600,to: 900},
        duration: 1800,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand10,
                                x: 1600,
                                duration: 800,
                                ease: 'Sine.easeInOut',
                            });
                    });
            }
        });
    }

    sixthtaction()
    {
        this.hand1.x = 0;
        this.hand1.angle = 135;
        this.hand3.x = 1200;
        this.hand3.angle = 225;
        this.hand4.x = 0;
        this.hand4.angle = 45;
        this.hand6.x = 1200;
        this.hand6.angle = -45;

        this.tweens.add(
        {
        targets: this.hand1,
        x: {from:0,to: 500},
        y: {from: -600, to: 300},
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand1,
                                x: {from:500,to: 0},
                                y: {from: 300, to: -600},
                                duration: 800,
                                ease: 'Sine.easeInOut',
                            });
                    });
            }
        });

        this.tweens.add(
        {
        targets: this.hand3,
        x: {from:1200,to: 700},
        y: {from: -600, to: 300},
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand3,
                                x: {from:700,to: 1200},
                                y: {from: 300, to: -600},
                                duration: 800,
                                ease: 'Sine.easeInOut',
                            });
                    });
            }
        });

        this.tweens.add(
        {
        targets: this.hand4,
        x: {from:0,to: 500},
        y: {from: 1600, to: 500},
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand4,
                                x: {from:500,to: 0},
                                y: {from: 500, to: 1600},
                                duration: 800,
                                ease: 'Sine.easeInOut',
                            });
                    });
            }
        });

        this.tweens.add(
        {
        targets: this.hand6,
        x: {from:1200,to: 700},
        y: {from: 1600, to: 500},
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand6,
                                x: {from:700,to: 1200},
                                y: {from: 500, to: 1600},
                                duration: 800,
                                ease: 'Sine.easeInOut',
                            });
                    });
            }
        });
    }

    seventhstaction()
    {
        this.hand7.y = 400;
        this.hand9.y = 400;
        this.tweens.add(
        {
        targets: this.hand7,
        x: {from:-650,to: 100},
        duration: 1200,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand7,
                                y: {from: 400, to: 200},
                                duration: 600,
                                ease: 'Sine.easeInOut',
                                onComplete: () =>
                                {
                                this.tweens.add(
                                {
                                    targets: this.hand7,
                                    x: {from: 100, to: 550},
                                    duration: 600,
                                    ease: 'Sine.easeInOut',
                                    onComplete: () => 
                                    {
                                        this.time.delayedCall(300, () => 
                                            {
                                                this.tweens.add(
                                                    {
                                                        targets: this.hand7,
                                                        x: {from:550,to: 200},
                                                        duration: 800,
                                                        ease: 'Sine.easeInOut',
                                                    });
                                            });
                                    }
                                });
                                }
                            });
                    });
            }
        });

        this.tweens.add(
        {
        targets: this.hand9,
        x: {from:1600,to: 1100},
        duration: 1200,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand9,
                                y: {from: 400, to: 660},
                                duration: 600,
                                ease: 'Sine.easeInOut',
                                onComplete: () =>
                                {
                                this.tweens.add(
                                {
                                    targets: this.hand9,
                                    x: {from: 1100, to: 650},
                                    duration: 600,
                                    ease: 'Sine.easeInOut',
                                    onComplete: () => 
                                    {
                                        this.time.delayedCall(300, () => 
                                            {
                                                this.tweens.add(
                                                    {
                                                        targets: this.hand9,
                                                        x: {from:650,to: 1100},
                                                        duration: 800,
                                                        ease: 'Sine.easeInOut',
                                                    });
                                            });
                                    }
                                });
                                }
                            });
                    });
            }
        });
    }

    eightthaction()
    {
        this.tweens.add(
        {
        targets: this.hand7,
        y: {from:200,to: 660},
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand7,
                                x: {from: 200, to: 650},
                                duration: 600,
                                ease: 'Sine.easeInOut',
                                onComplete:() => 
                                    {
                                        this.time.delayedCall(300, () => 
                                            {
                                                this.tweens.add(
                                                    {
                                                        targets: this.hand7,
                                                        y: {from:650,to: 1600},
                                                        duration: 800,
                                                        ease: 'Sine.easeInOut',
                                                    });
                                        });
                                    }
                            });
                    });
            }
        });

        this.tweens.add(
        {
        targets: this.hand9,
        y: {from:660,to: 200},
        duration: 1000,
        ease: 'Sine.easeInOut',
        onComplete: () => 
            {
                this.time.delayedCall(300, () => 
                    {
                        this.tweens.add(
                            {
                                targets: this.hand9,
                                x: {from: 1000, to: 550},
                                duration: 600,
                                ease: 'Sine.easeInOut',
                                onComplete:() => 
                                    {
                                        this.time.delayedCall(300, () => 
                                            {
                                                this.tweens.add(
                                                    {
                                                        targets: this.hand9,
                                                        y: {from:200,to: -600},
                                                        duration: 800,
                                                        ease: 'Sine.easeInOut',
                                                    });
                                        });
                                    }
                            });
                    });
            }
        });
    }

    

    gameOver()
    {
        this.endGamePhase("thiefs");
    }

    endGamePhase(eventName)
    {
        localStorage.setItem("event", eventName);
        localStorage.setItem("isNextDay", "true");
        this.game.destroy(true);
        window.location.href = 'computer.html';
    }

    update() 
    {

    this.player.setVelocity(0, 0);

    if (this.keyA.isDown) 
    { 
        this.player.setVelocityX(-this.speed);
    }

    if (this.keyD.isDown) 
    { 
        this.player.setVelocityX(this.speed);
    }

    if (this.keyS.isDown) 
    { 
        this.player.setVelocityY(this.speed);
    }

    if (this.keyW.isDown) 
    { 
       this.player.setVelocityY(-this.speed);
    }

  }

}

class ParkScene extends Phaser.Scene {
    constructor() { 
        super('ParkScene');
        this.player = null;
        this.map = null;
        this.layer = null;
        this.reactionText = null;
        this.isGameFinished = false;
        this.isMoving = false;
        this.isMiniGame = false;
        this.miniGameTimer = null;
        this.targetX = 0;
        this.targetY = 0;
        this.commandQueue = [];
        this.tileSize = 32;
        this.SPEED = 2;
        this.REACTION_TIME = 2000;
    }

    addToQueue(deltaX, deltaY, startMiniGame) {
        this.commandQueue.push({ dx: deltaX, dy: deltaY, mini: startMiniGame === 1 });
        this.processQueue();
    }

    processQueue() {
        if (this.isMoving || this.isMiniGame || this.commandQueue.length === 0) return;
        const cmd = this.commandQueue.shift();
        this.moveTo(cmd.dx, cmd.dy, cmd.mini);
    }

    moveTo(deltaX, deltaY, startMiniGame) {
        this.targetX = this.player.x + (deltaX * this.tileSize);
        this.targetY = this.player.y + (deltaY * this.tileSize);
        this.isMoving = true;
        this.player.nextMiniGame = startMiniGame;
    }

    preload() {
        this.load.json('parkMap', 'sprites/1x/ParkScene/Карта парка.json');
        this.load.image('tiles', 'sprites/1x/ParkScene/Untitled5.png');
        this.load.image('playerImg', 'sprites/1x/ParkScene/собака 1.1.png');
    }

    create() {
        try {
            const jsonData = this.cache.json.get('parkMap');
            if (!jsonData) throw new Error('JSON не найден');
            
            this.map = this.make.tilemap({
                tileWidth: 32,
                tileHeight: 32,
                width: jsonData.width,
                height: jsonData.height
            });

            const tileset = this.map.addTilesetImage('tiles', 'tiles', 32, 32, 0, 0);
            const layerData = jsonData.layers[0];
            
            this.layer = this.map.createBlankLayer('Layer1', tileset);
            
            const width = jsonData.width;
            const height = jsonData.height;
            const data = layerData.data;
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const tileIndex = data[y * width + x];
                    if (tileIndex > 0) {
                        this.layer.putTileAt(tileIndex - 1, x, y);
                    }
                }
            }
            
            let spawnX = this.map.widthInPixels / 2;
            let spawnY = this.map.heightInPixels / 2;
            
            for (let i = 0; i < data.length; i++) {
                if (data[i] === 99) {
                    const x = i % width;
                    const y = Math.floor(i / width);
                    spawnX = x * 32 + 16;
                    spawnY = y * 32 + 16;
                    break;
                }
            }
            
            this.player = this.add.container(spawnX, spawnY);
            const sprite = this.add.image(0,0, 'playerImg');
            sprite.setScale(0.45);
            this.player.add(sprite);
            this.player.nextMiniGame = false;
            
            const zoom = Math.min(1200 / this.map.widthInPixels, 800 / this.map.heightInPixels);
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
            this.cameras.main.setZoom(zoom);
            this.cameras.main.centerOn(this.map.widthInPixels/2, this.map.heightInPixels/2);
            
            this.reactionText = this.add.text(400, 700, '', { 
                fontSize: '40px', fill: '#fff', stroke: '#000', strokeThickness: 6 
            }).setOrigin(0.5).setVisible(false).setScrollFactor(0);
            
            this.input.keyboard.on('keydown-F', () => { 
                if (this.isMiniGame) this.successMiniGame(); 
            });

            this.commandQueue = [];
            
            this.addToQueue(6, 0, 1);
            this.addToQueue(5, 0, 0);
            this.addToQueue(0, -7, 0);
            this.addToQueue(8, 0, 1);
            this.addToQueue(7, 0, 0);
            this.addToQueue(0, 6, 1);
            this.addToQueue(0, 12, 0);
            this.addToQueue(20, 0, 0);
            this.addToQueue(0, -4, 1);
            this.addToQueue(0, -7, 0);
            this.addToQueue(14, 0, 0);
            
        } catch (error) {
            console.error(error);
        }
    }

    update() {
        if (!this.player) return;
        
        if (this.isMoving) {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.targetX, this.targetY);
            
            if (dist < this.SPEED) {
                this.player.x = this.targetX;
                this.player.y = this.targetY;
                this.isMoving = false;
                
                if (this.player.nextMiniGame) {
                    this.player.nextMiniGame = false;
                    this.startMiniGame();
                } else if (this.commandQueue.length === 0 && !this.isGameFinished) {
                    this.showVictory();
                } else {
                    this.processQueue();
                }
            } else {
                const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.targetX, this.targetY);
                this.player.x += Math.cos(angle) * this.SPEED;
                this.player.y += Math.sin(angle) * this.SPEED;
            }
        }
    }

    startMiniGame() {
        this.isMiniGame = true;
        this.reactionText.setText(`          !!ОСТОРОЖНО!!\n СОБАКА ПЫТАЕТСЯ УКУСИТЬ ЧЕЛОВЕКА!\n          ⚡ НАЖМИ F ⚡`).setColor('#ff0000').setVisible(true);
        
        this.miniGameTimer = this.time.delayedCall(this.REACTION_TIME, () => {
            if (this.isMiniGame) {
                this.endGamePhase("dog");    
            }
        });
    }

    successMiniGame() {
        if (!this.isMiniGame) return;
        this.isMiniGame = false;
        if (this.miniGameTimer) this.miniGameTimer.remove();

        this.reactionText.setText('УСПЕХ!').setColor('#00ff00');
        if (this.commandQueue.length === 0) {
            this.showVictory();
        } else {
            this.processQueue();
        }
        this.time.delayedCall(800, () => {
            this.reactionText.setVisible(false);
        });
    }

    showVictory() {
        if (this.isGameFinished) return; 
        this.isGameFinished = true;
        
        this.reactionText.setText(' ВЫ УСПЕШНО ПОГУЛЯЛИ С СОБАКОЙ! 🐕')
            .setColor('#ffff00')
            .setVisible(true);

        this.isMoving = false;
        this.isMiniGame = false;
        this.commandQueue = [];
        this.endGamePhase("none");
    }

    endGamePhase(eventName) {
        localStorage.setItem("event", eventName);
        localStorage.setItem("isNextDay", "true");
        this.game.destroy(true); 
        window.location.href = 'computer.html';
    }
}

class SimpleGame extends Phaser.Scene {
        constructor() {
            super({ key: 'SimpleGame' });
        }

        preload() {
            this.load.image('kitchen', 'sprites/1x/SimpleGameScene/kitchen.png');
            this.load.image("arrow", "sprites/1x/SimpleGameScene/arrow.png");
        }

        create() {
            this.centerX = 400; 
            this.centerY = 500; 

            this.radius = 180;     
            this.arrowAngle = 0;
            this.direction = 1;     
            this.speed = 200;       
            this.active = true;

            const bg = this.add.image(600, 400, 'kitchen').setScale(0.51);
            this.arrow = this.add.sprite(this.centerX+225, this.centerY-60, 'arrow');
            this.arrow.setScale(0.5);
            this.arrow.Angle = 270;


            this.greenStart = -75;
            this.greenEnd  = -46;
            this.arrow.x += 4;   
            this.arrow.y += 14;   
            this.arrow.setScale(0.6);  


            this.updateArrowRotation = () => {
                const rad = Phaser.Math.DegToRad(this.arrowAngle);
                this.arrow.setRotation(rad);
            };
            this.updateArrowRotation();

            this.resultText = this.add.text(600, 80, '', {
                fontSize: '36px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                color: '#fff',
                stroke: '#000',
                strokeThickness: 4
            }).setOrigin(0.5);


            this.add.text(650, 700, 'Нажми ПРОБЕЛ, когда стрелка в ЗЕЛЁНОЙ зоне', {
                fontSize: '20px',
                fontFamily: 'sans-serif',
                color: '#fff',
                backgroundColor: '#000000aa',
                padding: { x: 12, y: 6 }
            }).setOrigin(0.5);


            this.input.keyboard.on('keydown-SPACE', () => {
                if (this.active) this.checkHit();
            });
        }

        update(time, delta) {
            if (!this.active) return;
            const step = (this.speed * delta) / 1000;
            this.arrowAngle += step * this.direction;
            if (this.arrowAngle >= 0) {
                this.arrowAngle = 0;
                this.direction = -1;
            } else if (this.arrowAngle <= -180) {
                this.arrowAngle = -180;
                this.direction = 1;
            }
            this.updateArrowRotation();
        }

        checkHit() {
            const inGreen = (this.arrowAngle >= this.greenStart && this.arrowAngle <= this.greenEnd);
            if(inGreen){this.endGamePhase("none");}
            else {this.endGamePhase("cooking");}
            this.active = false;
        }

        endGamePhase(eventName)
        {
            localStorage.setItem("event", eventName);
            localStorage.setItem("isNextDay", "true");
            this.game.destroy(true);
            window.location.href = 'computer.html';
        }
    }

class MapScene extends Phaser.Scene {
    
    constructor() 
    {
        super('MapScene');
    }

    preload() 
    {
        this.load.image("playerMapState", "sprites/1x/MapScene/playerstate.png");
        this.load.image("playerMapMoveLeft", "sprites/1x/MapScene/moveleft.png");
        this.load.image("playerMapMoveRight", "sprites/1x/MapScene/moveright.png");
        this.load.image("playerMapFalling1", "sprites/1x/MapScene/falling1.png");
        this.load.image("playerMapFalling2", "sprites/1x/MapScene/falling2.png");
        this.load.image("playerMapFalling3", "sprites/1x/MapScene/falling3.png");
        this.load.image("playerMapFalling4", "sprites/1x/MapScene/falling4.png");
        this.load.tilemapTiledJSON("map", "sprites/1x/MapScene/MainMap.json");
        this.load.image("Untitled", "sprites/1x/MapScene/Untitled.png");
        this.load.image("Untitled1", "sprites/1x/MapScene/Untitled1.png");
        this.load.image("Untitled2", "sprites/1x/MapScene/Untitled2.png");
        this.load.image("Untitled3", "sprites/1x/MapScene/Untitled3.png");
        this.load.image("thief", "sprites/1x/MapScene/thief.png");
        this.load.image("puddle", "sprites/1x/MapScene/puddle.png");
    }

    create() 
    {
        day = get_day();
        
        this.isCutsceneActive = false;
        this.fProcessed = false;

        if(day == 13)
        {
            this.scene.start("SimpleGame");
        }

        const map = this.make.tilemap({key: "map"});
        const ts1 = map.addTilesetImage("Untitled","Untitled");
        const ts2 = map.addTilesetImage("Untitled1","Untitled1");
        const ts3 = map.addTilesetImage("Untitled2","Untitled2");
        const ts4 = map.addTilesetImage("Untitled3","Untitled3");

        const layer1 = map.createLayer(
        "Слой тайлов 1",
        [ts1, ts2, ts3, ts4]
        );

        const layer2 = map.createLayer(
            "Слой тайлов 2",
            [ts1, ts2, ts3, ts4]
        );

        this.anims.create({
        key: "state",
        frames: [{ key: "playerMapState" }], 
        frameRate: 1,
        repeat: -1
        });

        this.anims.create({
        key: "falling",
        frames: [           
            { key: "playerMapFalling1" },
            { key: "playerMapFalling2" },
            { key: "playerMapFalling3" },
            { key: "playerMapFalling4" },
            { key: "playerMapFalling1" }
        ], 
        frameRate: 8,
        repeat: -1
        });

        this.anims.create({
            key: "walk",
            frames: [ 
                { key: "playerMapMoveLeft" },
                { key: "playerMapMoveRight" },
                { key: "playerMapMoveLeft" }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.player = this.physics.add.sprite(315*32,161*32,"playerMapState");
        this.player.setDisplaySize(120,70);
        this.player.body.setSize(200, 200);
        this.player.play("state");
        this.speed = 500;
        this.physics.world.setBounds(0, 0, 700 * 32, 312 * 32);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(0.6);

        this.interactText = this.add.text(
        this.cameras.main.width-200,                             
        this.cameras.main.height+230,
        'Нажмите F для взаимодействия',
        { 
            fontSize: '40px',
            fill: '#eceaeaff',            
            stroke: '#dededeff',         
            strokeThickness: 1
        }
        ).setOrigin(0, 1).setScrollFactor(0).setDepth(1001).setVisible(false);

        if (day == 9) 
        {
            this.thief1 = this.physics.add.sprite(533*32,84*32,"thief");
            this.thief1.setDisplaySize(120,70);
            this.thief2 = this.physics.add.sprite(516*32,72*32,"thief");
            this.thief2.setDisplaySize(120,70);
            
            const darkOverlay = this.add.rectangle(0,0,1500*32,624*32, 0x000000).setAlpha(0.9).setDepth(999);
            
            const lightGraphics = this.add.graphics();
            lightGraphics.fillStyle(0xffffff, 0.15);
            lightGraphics.fillCircle(0, 0, 150); 
            lightGraphics.setBlendMode(Phaser.BlendModes.ADD);
            
            this.lightSprite = this.add.container(0, 0, [lightGraphics]).setDepth(1000);
        }
        
        this.trigger_school = this.add.zone(44*32,36.5*32,10*32,2*32);
        this.physics.world.enable(this.trigger_school);
        this.trigger_school.body.setAllowGravity(false);

        this.trigger_scooter = this.add.zone(272*32,286.5*32,56*32,3*32);
        this.physics.world.enable(this.trigger_scooter);
        this.trigger_scooter.body.setAllowGravity(false);

        this.trigger_park = this.add.zone(332*32,284*32,3*32,8*32);
        this.physics.world.enable(this.trigger_park);
        this.trigger_park.body.setAllowGravity(false);

        this.trigger_thief = this.add.zone(524*32,84*32,12*32,3*32);
        this.physics.world.enable(this.trigger_thief);
        this.trigger_thief.body.setAllowGravity(false);

        this.trigger_grandma = this.add.zone(76*32,282*32,8*32,3*32);
        this.physics.world.enable(this.trigger_grandma);
        this.trigger_grandma.body.setAllowGravity(false);

        this.neccesarrywalls = this.physics.add.staticGroup();
        this.createBarrierFromEdges(310,320,158,158,this.neccesarrywalls);
        this.createBarrierFromEdges(309,309,159,179,this.neccesarrywalls);
        this.createBarrierFromEdges(321,321,159,179,this.neccesarrywalls);
        this.createBarrierFromEdges(50,309,179,179,this.neccesarrywalls);
        this.createBarrierFromEdges(50,309,189,189,this.neccesarrywalls);
        this.createBarrierFromEdges(321,518,179,179,this.neccesarrywalls);
        this.createBarrierFromEdges(530,610,179,179,this.neccesarrywalls);
        this.createBarrierFromEdges(321,599,189,189,this.neccesarrywalls);
        this.createBarrierFromEdges(309,309,189,279,this.neccesarrywalls);
        this.createBarrierFromEdges(321,321,189,279,this.neccesarrywalls);
        this.createBarrierFromEdges(50,50,36,179,this.neccesarrywalls);
        this.createBarrierFromEdges(50,50,189,273,this.neccesarrywalls);
        this.createBarrierFromEdges(38,38,36,283,this.neccesarrywalls);
        this.createBarrierFromEdges(50,80,273,273,this.neccesarrywalls);
        this.createBarrierFromEdges(39,80,284,284,this.neccesarrywalls);
        this.createBarrierFromEdges(81,81,274,283,this.neccesarrywalls);
        this.createBarrierFromEdges(39,49,35,35,this.neccesarrywalls);
        this.createBarrierFromEdges(243,243,280,288,this.neccesarrywalls);
        this.createBarrierFromEdges(244,333,289,289,this.neccesarrywalls);
        this.createBarrierFromEdges(244,309,279,279,this.neccesarrywalls);
        this.createBarrierFromEdges(321,333,279,279,this.neccesarrywalls);
        this.createBarrierFromEdges(333,333,280,288,this.neccesarrywalls);
        this.createBarrierFromEdges(518,518,100,179,this.neccesarrywalls);
        this.createBarrierFromEdges(518,518,37,90,this.neccesarrywalls);
        this.createBarrierFromEdges(530,530,100,179,this.neccesarrywalls);
        this.createBarrierFromEdges(530,530,37,90,this.neccesarrywalls);
        this.createBarrierFromEdges(463,518,100,100,this.neccesarrywalls);
        this.createBarrierFromEdges(530,584,100,100,this.neccesarrywalls);
        this.createBarrierFromEdges(463,518,90,90,this.neccesarrywalls);
        this.createBarrierFromEdges(530,584,90,90,this.neccesarrywalls);
        this.createBarrierFromEdges(462,462,91,99,this.neccesarrywalls);
        this.createBarrierFromEdges(585,585,91,99,this.neccesarrywalls);
        this.createBarrierFromEdges(457,518,37,37,this.neccesarrywalls);
        this.createBarrierFromEdges(530,614,37,37,this.neccesarrywalls);
        this.createBarrierFromEdges(457,614,27,27,this.neccesarrywalls);
        this.createBarrierFromEdges(615,615,28,36,this.neccesarrywalls);
        this.createBarrierFromEdges(456,456,28,36,this.neccesarrywalls);
        this.createBarrierFromEdges(599,599,189,279,this.neccesarrywalls);
        this.createBarrierFromEdges(611,611,180,288,this.neccesarrywalls);
        this.createBarrierFromEdges(586,610,289,289,this.neccesarrywalls);
        this.createBarrierFromEdges(586,599,279,279,this.neccesarrywalls);
        this.createBarrierFromEdges(586,586,280,288,this.neccesarrywalls);

        if(day == 1)
        {
            this.createBarrierFromEdges(321,321,180,188,this.neccesarrywalls);
            this.createBarrierFromEdges(310,320,189,189,this.neccesarrywalls);
            this.createBarrierFromEdges(39,49,189,189,this.neccesarrywalls);
        }

        if(day == 3)
        {
            this.createBarrierFromEdges(321,321,180,188,this.neccesarrywalls);
            this.createBarrierFromEdges(309,309,180,188,this.neccesarrywalls);
            this.createBarrierFromEdges(321,321,280,288,this.neccesarrywalls);
        }

        if(day == 5)
        {
            this.createBarrierFromEdges(321,321,180,188,this.neccesarrywalls);
            this.createBarrierFromEdges(310,320,189,189,this.neccesarrywalls);
            this.createBarrierFromEdges(39,49,189,189,this.neccesarrywalls);
        }

        if(day == 7)
        {
            this.createBarrierFromEdges(321,321,180,188,this.neccesarrywalls);
            this.createBarrierFromEdges(310,320,189,189,this.neccesarrywalls);
            this.createBarrierFromEdges(39,49,179,179,this.neccesarrywalls);
        }

        if(day == 9)
        {
            this.createBarrierFromEdges(310,320,189,189,this.neccesarrywalls);
            this.createBarrierFromEdges(309,309,180,188,this.neccesarrywalls);
            this.createBarrierFromEdges(530,530,180,188,this.neccesarrywalls);
        }

        if(day == 11)
        {
            this.createBarrierFromEdges(321,321,180,188,this.neccesarrywalls);
            this.createBarrierFromEdges(309,309,180,188,this.neccesarrywalls);
            this.createBarrierFromEdges(309,309,280,288,this.neccesarrywalls);
        }

        if(day == 15)
        {
            this.createBarrierFromEdges(321,321,180,188,this.neccesarrywalls);
            this.createBarrierFromEdges(309,309,180,188,this.neccesarrywalls);
            this.createBarrierFromEdges(321,321,280,288,this.neccesarrywalls);   
        }
        
        if(day == 5)
        {
            this.isTriggeredPuddle1 = false;
            this.isTriggeredPuddle2 = false;
            this.isTriggeredPuddle3 = false;
            this.isFalled = false;
            this.player.setDepth(2);

            this.trigger_puddle1 = this.physics.add.sprite(184*32,184*32,"puddle");
            this.trigger_puddle1.setDisplaySize(430,280);
            this.trigger_puddle1.setDepth(1);

            this.trigger_puddle2 = this.physics.add.sprite(45*32,184*32,"puddle");
            this.trigger_puddle2.setDisplaySize(450,280);
            this.trigger_puddle2.setDepth(1);

            this.trigger_puddle3 = this.physics.add.sprite(44*32,126*32,"puddle");
            this.trigger_puddle3.setDisplaySize(425,230);
            this.trigger_puddle3.setDepth(1);

            this.physics.add.overlap(this.player, this.trigger_puddle1, () =>
            {
                if(!this.isTriggeredPuddle1)
                {
                    this.isTriggeredPuddle1 = true;
                    if(Math.random() <= 0.25)
                    {
                        this.isFalled = true;
                        this.startCutscene();
                        this.speed = 400;
                    }
                }
            },null,this);

            this.physics.add.overlap(this.player, this.trigger_puddle2, () =>
            {
                if(!this.isTriggeredPuddle2)
                {
                    this.isTriggeredPuddle2 = true;
                    if(Math.random() <= 0.25)
                    {
                        this.isFalled = true;
                        this.startCutscene();
                        this.speed = 400;
                    }
                }
            },null,this);

            this.physics.add.overlap(this.player, this.trigger_puddle3, () =>
            {
                if(!this.isTriggeredPuddle3)
                {
                    this.isTriggeredPuddle3 = true;
                    if(Math.random() <= 0.25)
                    {
                        this.isFalled = true;
                        this.startCutscene();
                        this.speed = 400;
                    }
                }
            },null,this);
        }   

        this.physics.add.collider(this.player, this.neccesarrywalls);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey('A');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyW = this.input.keyboard.addKey('W');
        this.keyD = this.input.keyboard.addKey('D');
        this.keyF = this.input.keyboard.addKey('F');

        this.inZone = 
        [
            {name:"school",zonetrigger: false},
            {name:"scooter",zonetrigger: false},
            {name:"grandma", zonetrigger:false},
            {name:"park",zonetrigger: false},
            {name:"thief",zonetrigger: false}
        ];
    }


    createBarrierFromEdges(x1, x2, y1, y2, group) 
    {
        const x = x1*32;
        const y = y1*32;
        let width,height;
        if(x1 != x2){width = 32*(x2 - x1);}
        else{width = 1;}
        if(y1 != y2){height = 32*(y2 - y1);}
        else{height = 1;}

        const wall = group.create(x, y, null);
        wall.body.setSize(width, height);
        wall.body.setOffset(0, 0);
        wall.setAlpha(0);  
    }   

    startCutscene() {
        this.isCutsceneActive = true;     
        this.player.setVelocity(0, 0);    
        
        this.player.play('falling');
        
        this.time.delayedCall(2000, () => {
            this.isCutsceneActive = false;
            this.player.play('state');  
        });
    }

    update() 
    {
        let moving = false;
        this.player.setVelocity(0, 0);

        this.inZone[0].zonetrigger = this.physics.world.overlap(this.player, this.trigger_school);
        this.inZone[1].zonetrigger = this.physics.world.overlap(this.player, this.trigger_scooter);
        this.inZone[2].zonetrigger = this.physics.world.overlap(this.player, this.trigger_grandma);
        this.inZone[3].zonetrigger = this.physics.world.overlap(this.player, this.trigger_park);
        this.inZone[4].zonetrigger = this.physics.world.overlap(this.player, this.trigger_thief);
        
        const isInAnyZone = this.inZone[0].zonetrigger || 
                           this.inZone[1].zonetrigger || 
                           this.inZone[2].zonetrigger || 
                           this.inZone[3].zonetrigger;
        
        this.interactText.setVisible(isInAnyZone);

        if (this.inZone[4].zonetrigger)
        {
            if(day == 9)
            {
                this.scene.start("HandScene1");
            }
        }

        if (isInAnyZone && this.keyF.isDown)
        {
            if (!this.fProcessed)
            {
                this.fProcessed = true;
                
                if (this.inZone[0].zonetrigger)
                {
                    if(day == 1)
                    {
                        this.endGamePhase("none");
                    }
                    if(day == 5)
                    {
                        if(this.isFalled)
                        {
                            this.endGamePhase("puddle");
                        }
                        else
                        {
                            this.endGamePhase("none"); 
                        }
                    }
                }
                
                if (this.inZone[1].zonetrigger)
                {
                    if(day == 3 || day == 15)
                    {
                        this.scene.start("ScooterScene");
                    }   
                }
                
                if (this.inZone[2].zonetrigger)
                {
                    if(day == 7)
                    {
                        this.endGamePhase("none");
                    }
                }
                
                if (this.inZone[3].zonetrigger)
                {
                    if(day == 11)
                    {   
                        this.scene.start("ParkScene");
                    }
                }
            }
        }
        else
        {
            this.fProcessed = false;
        }

        if(day == 9)
        {
            this.lightSprite.x = this.player.x;
            this.lightSprite.y = this.player.y;
        }

        if (this.keyA.isDown && !this.isCutsceneActive) 
        { 
            this.player.setVelocityX(-this.speed);
            this.player.angle = 270;
            moving = true;
        }

        if (this.keyD.isDown && !this.isCutsceneActive) 
        { 
            this.player.setVelocityX(this.speed);
            this.player.angle = 90;
            moving = true;
        }

        if (this.keyS.isDown && !this.isCutsceneActive) 
        { 
            this.player.setVelocityY(this.speed);
            this.player.angle = 180;
            moving = true;
        }

        if (this.keyW.isDown && !this.isCutsceneActive) 
        { 
            this.player.setVelocityY(-this.speed);
            this.player.angle = 0;
            moving = true;
        }

        if (moving && !this.isCutsceneActive) 
        {
            if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'walk')
            {
                this.player.play('walk');
            }
        } 
        else if(!this.isCutsceneActive)
        {
            if (this.player.anims.currentAnim.key !== 'state') 
            {
                this.player.play('state');
            }
        }
    }

    endGamePhase(eventName)
    {
        localStorage.setItem("event", eventName);
        localStorage.setItem("isNextDay", "true");
        this.game.destroy(true);
        window.location.href = 'computer.html';
    }

}


const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    backgroundColor: "#20a860",
    antialias: false,
    pixelArt: true,
    physics: {
        default: 'arcade',
        matter: {
            gravity: { y: 0 }
        }
    },
    scene: [MapScene,ScooterScene,HandScene1,SimpleGame,ParkScene]
};

new Phaser.Game(config);