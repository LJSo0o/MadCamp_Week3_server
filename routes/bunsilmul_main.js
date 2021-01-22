module.exports = function(app, Bunsilmul, Device, ResgisterLocations, firebaseAdmin){

        const haversine = require('haversine')

        // var admin = require("firebase-admin");
        // var serviceAccount = require("/home/ubuntu/server/madcamp-bunsilmul-firebase-adminsdk-xsatg-ae7e18520e.json")
        // // require("./cs496week2-39d97-firebase-adminsdk-fnpd2-f5f476444d.json");
        // admin.initializeApp({
        // credential: admin.credential.cert(serviceAccount)
        // });

        //CREATE BUNSILMUL
        app.post('/api/bunsilmuls', function(req, res){
            console.log("create bunsilmul success")
            var bunsilmul = new Bunsilmul();
            bunsilmul.uid = req.body.uid;
            bunsilmul.category = req.body.category;
            bunsilmul.information = req.body.information;
            bunsilmul.photo = req.body.photo;
            bunsilmul.latitude = req.body.latitude;
            bunsilmul.longitude = req.body.longitude;
    
            ///MESSAGE TO WHO WANT BUNSILMUL 
            Device.find({}, function(err, devices){
                console.log("DEVICEs")
                console.log(devices)
                for(const device of devices){
                    console.log("Device")
                    console.log(device)
                    ResgisterLocations.findOne({uid: device.uid},function(err,location){
                        console.log("Location")
                        // console.log(location)
                        var exist = false;
                        if(location){
                            console.log("NULL NOT")
                            for(const point of location.location){
                                // console.log(location)
                                // console.log(point)
                                if(haversine({latitude: point.latitude, longitude: point.longitude},{latitude: req.body.latitude, longitude: req.body.longitude},{unit: 'meter' }) < 100){
                                    console.log(point)
                                    exist = true;
                                }
                            }
                            console.log(device.devicetoken)
                            if(exist){
                                /////MESSAGE TO WHO WANT BUNSILMUL
                                var payload = {
                                    notification: {
                                        title: "분실물을 발견했습니다.",
                                        body: "카테고리:" + req.body.category +" 정보:" + req.body.information
                                    },
                                    data: {
                                        title: "분실물을 발견했습니다.",
                                        body: "카테고리:" + req.body.category +" 정보:" + req.body.information
                                    }
                                }
                                firebaseAdmin.messaging().sendToDevice(device.devicetoken, payload)
                                    .then(function(response){
                                        console.log("SUCCESSFUL MESSAGE", response);
                                    })
                                    .catch(function(error){
                                        console.log("ERROR MESSAGE", error)
                                    });
                            }
                        }
                    })
                }
            })


            bunsilmul.save(function(err){
                if(err){
                    console.error(err);
                    res.json({message: "fail"});
                    return;
                }
    
                res.json({message: "success", _id: bunsilmul._id});
                return;
            })
        });
    
    
        //GET ALL 
        app.get('/api/bunsilmuls/all', function(req,res){
            Bunsilmul.find({}, {photo: 0}, function(err, bunsilmuls){
                console.log("send bunsilmul success");
                if(err){
                    console.error(err);
                    res.status(404).json({message: "fail"});
                    return;
                }
                console.log(bunsilmuls)
                console.log(typeof(bunsilmuls))
                res.json(bunsilmuls)
            })
        })
    
        app.get('/api/bunsilmuls/photo/:id', function(req, res){
            Bunsilmul.findById(req.params.id, function(err, bunsilmul){
                if(err){
                    console.error(err);
                    res.status(404).json({message: "fail"});
                    return;
                }
                res.json({photo: bunsilmul.photo});
                return;
            })
        })
    
        ///find by objectId
        app.get('/api/bunsilmuls/bunsilmul/:id', function(req, res){
            Bunsilmul.findById(req.params.id, function(err, bunsilmul){
                if(err){
                    console.error(err);
                    res.status(404).json({message: "fail"});
                    return;
                }
                res.json(bunsilmul);
                return;
            })
        })
    
        ///find by UserID
        app.get('/api/bunsilmuls/user/:id', function(req,res){
            Bunsilmul.find({uid: req.params.id}, {photo: 0}, function(err, bunsilmuls){
                console.log("send bunsilmul success");
                if(err){
                    console.error(err);
                    res.status(404).json({message: "fail"});
                    return;
                }
                console.log(bunsilmuls)
                console.log(typeof(bunsilmuls))
                res.json(bunsilmuls)
            })
        })
    
    
    }