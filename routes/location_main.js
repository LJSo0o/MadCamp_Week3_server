const { db } = require("../models/location");

module.exports = function(app, Locations){
    //CREATE BUNSILMUL
    app.post('/api/locations', function(req, res){
        console.log("create locations success")
        // var locations = new Locations();
        // Locations.update({uid: req.body.uid}, {location: req.body.location}, {upsert: true});
        // Locations.update({uid: req.body.uid}, {$push: {location: req.body.location}});
        // if (Locations.find({uid: req.body.uid}) == ''){
        //     Locations.create({uid: req.body.uid, location: req.body.location});
        // }
        // else{
        //     Locations.updateOne({uid: req.body.uid}, {$push: {location: req.body.locations}});
        // }
        // Locations.create({uid: req.body.uid, location: req.body.location});
        // Locations.update({uid: req.body.uid}, {uid: req.body.uid, location: req.body.location}, {upsert: true})
        // Locations.update({uid: req.body.uid}, {$push: {location: req.body.location}})]

        Locations.findOne({uid: req.body.uid}, function(err,cur_location){
            if(err){
                console.error(err);
                res.json({message: "fail"});
                return;
            }
            if(!cur_location){
                Locations.create({uid: req.body.uid, location: req.body.location});
                // cur_location.create({uid: req.body.uid, location: req.body.location});
                // cur_location.uid = req.body.uid;
                // cur_location.location = req.body.location;
                console.log("!cur_location")
                res.json({message:"success"})
                // cur_location.save();
            } else {
                
                cur_location.location.push({latitude: req.body.location.latitude, longitude: req.body.location.longitude});
                cur_location.save();
                // cur_location.save();
                console.log("cur_location")
                res.json({message:"success"})
            }
        })
            

        
    
        // if (req.body.uid == locations.uid)
        // {$cond : { <Locations.find({"uid": {$eq: req.body.uid}}).count() == 0>, ){
        //     var locations = new Locations();
        //     locations.uid = req.body.uid;
        //     locations.location.push(req.body.location);
        //     locations.save(function(err){
        //         if(err){
        //             console.error(err);
        //             res.json({message: "fail"});
        //             return;
        //     }
        //     res.json({message: "success"});
        //     return;
        //     })
        // }
        // elif (Locations.find({$where{
        //     locations.location.push(req.body.location)
        //     // Locations.find({"uid": {$eq: req.body.uid}}, function(err, findlocation){
        //     //     if(err){
        //     //         console.error(err);
        //     //         res.json({message: "fail"});
        //     //         return;
        //     //     }
        //     //     findlocation.location.push(req.body.location);
        //     //     res.json({message: "success"});
        //     //     return;
        //     // })
            
        //     // .location.push(req.body.location);
        //     // locations.save(function(err){
        //     //     if(err){
        //     //         console.error(err);
        //     //         res.json({message: "fail"});
        //     //         return;
        //     // }
        //     // res.json({message: "success"});
        //     // return;
        //     // })
        // }
        
    });
    //GET ALL 
    app.get('/api/locations/:uid', function(req,res){
        Locations.findOne({uid: req.params.uid}, function(err, locations){
            console.log("send locations success");
            if(err){
                console.error(err);
                res.status(404).json({message: "fail"});
                return;
            }
            console.log(locations)
            console.log(locations.loaction)
            res.json(locations.location)
        })
    })


}