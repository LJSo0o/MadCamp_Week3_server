module.exports = function(app, Device, RegisterLocation, Location){
    
    //CREATE Device
    app.post('/api/device', function(req, res){
        console.log("create devicetoken success")
        Device.find({uid: req.body.uid}, function(err, devices){
            if(devices.length == 0 ){ // 등록된 device가 없는 경우
                var device = new Device();
                device.uid = req.body.uid;
                device.devicetoken = req.body.devicetoken;
                console.log(device)
                device.save(function(err){
                    if(err){
                        console.error(err);
                        res.json({message: "fail"});
                        return;
                    }
                    Location.findOne({uid: req.body.uid}, function(err, location){
                        if(err){
                            console.error(err);
                            res.json({message: "fail"});
                            return;
                        }
                        RegisterLocation.find({uid: req.body.uid}, function(err, registerlocations){
                            if(registerlocations.length == 0){
                                var registerlocation = new RegisterLocation();
                                registerlocation.uid = req.body.uid;
                                registerlocation.location = location.location;
                                registerlocation.save(function(err){
                                    if(err){
                                        console.error(err);
                                        res.json({message: "fail"});
                                        return;
                                    }
                                })
                            } else{
                                // RegisterLocation.update({uid:req.body.uid},{$set: {location: location.location}})
                                RegisterLocation.findOne({uid: req.body.uid}, function(err, registerlocation){
                                    registerlocation.location = location.location
                                })
                            }
                        })
                    })
                    res.json({message: "success"});
                    return;
                })
            } else { // 등록된 device가 있는 경우 
                // Device.update({uid: req.body.uid},{$set: {devicetoken: req.body.devicetoken}})
                Device.findOne({uid: req.body.uid}, function(err, device){
                    device.devicetoken = req.body.devicetoken;
                    device.save()

                })
                Location.findOne({uid: req.body.uid}, function(err, location){
                    if(err){
                        console.error(err);
                        res.json({message: "fail"});
                        return;
                    }
                    RegisterLocation.find({uid: req.body.uid}, function(err, registerlocations){
                        if(registerlocations.length == 0){
                            var registerlocation = new RegisterLocation();
                            registerlocation.uid = req.body.uid;
                            registerlocation.location = location.location;
                            registerlocation.save(function(err){
                                if(err){
                                    console.error(err);
                                    res.json({message: "fail"});
                                    return;
                                }
                            })
                        } else{
                            RegisterLocation.update({uid:req.body.uid},{$set: {location: location.location}})
                        }
                    })
                })
                res.json({message: "success"});
                return;
            }
        })
    });
}