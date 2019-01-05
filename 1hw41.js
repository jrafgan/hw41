

    var Machine = function () {
        this.isTurn = false;
        this.turnOn = function () {
            this.isTurn = true;
            console.log('Machine is On');
        }
        this.turnOff = function () {
            this.isTurn = false;
            console.log('Machine is Off');
        }
    };

    var HomeAppliance = function () {
        Machine.call(this);
        this.isPlug = false;
        this.plugIn = function () {
            this.isPlug = true;
            console.log('Home Appliance is plugged in');
        }
        this.plugOff = function () {
            this.isPlug = false;
            console.log('Home Appliance is plugged Off');
        }
    };
    var WashingMachine = function () {
        HomeAppliance.call(this);
        this.turnOn = function () {
            if (this.isPlug) this.isTurn = true;
        }
        this.run = function () {
            if (this.isPlug && this.isTurn) {
                console.log('WashingMachine is running');
            }
        }
    };
    var LightSource = function () {
        HomeAppliance.call(this);
        this.setLevel = function (level) {
            if (level > 1 && level < 100) {
                this.level = level;
                console.log('Light is turned On and level is: ', level);
            } else {
                console.log('Sorry, wrong Level');
            }
        }
    };

    var AutoVehicle = function () {
        Machine.call(this);
        this.x = 0;
        this.y = 0;
        var self = this;
        this.setPosition = function (x, y) {
            self.x = x;
            self.y = y;
            console.log(x, y);
        }
    };

    var Car = function () {
        AutoVehicle.call(this);
        this.speed = 10;
        var self = this;

        this.setSpeed = function (speed) {
            self.speed = speed;
        }
        this.run = function (a, b) {
            var s = 0;
            function interval() {
                s += self.speed;
                x1 = 0.6 * s + self.x;
                y1 = 0.8 * s + self.y;;
                console.log('Car X =  ' + x1 + '\nCar Y = ' + y1 + '\nPassed Way = ' + s);

                if (x1 >= a || y1 >= b) {
                    clearInterval(intervalID);
                }
            }
            var intervalID = setInterval(interval, 1000);
        }
    }

    var bosch = new WashingMachine();
    bosch.plugIn();
    bosch.turnOn();
    bosch.run();

    var lightBulb = new LightSource();
    lightBulb.plugIn();
    lightBulb.setLevel(60);
    lightBulb.turnOn();

    var honda = new Car();
    honda.setPosition(30, 40);
    honda.turnOn();
    honda.setSpeed(60);
    honda.run(180, 240);
    console.log(honda);
