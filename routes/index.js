var express = require('express');
var router = express.Router();

// thay the duong dan mongo cua cac ban
var urlDB = 'mongodb+srv://ABC:123dinh123@cluster0.f5red.mongodb.net/tinder';
const mongoose = require('mongoose');
mongoose.connect(urlDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('connected!!!!')
});

var multer = require('multer')
var path = 'public/uploads/'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path);
    },
    filename: function (req, file, cb) {
        //tên file
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});
const uploads = multer({
    dest:  path,
    storage: storage,
    limits: {
        fileSize: 2048 * 2048, //gioi han file size <= 2MB
    },
    fileFilter: function (req, file, cb) {
        // lọc file jpg
        if (file.mimetype !== "image/jpeg") {
            req.fileValidationError = "Chi chap nhan file JPG";
            return cb(null, false, new Error("Chi chap nhan file JPG"));
        }
        cb(null, true);
    },
})
// username
// password
// name
// address
// number_phone

var user = new mongoose.Schema({
    hoTen: String,
    ngaySinh: String,
    email: String,
    gioiTinh: String,
    soThich: String,
    gioiThieu: String,
    avatar: String,
})
/* GET home page. */

router.get("/", function (req, res) {
    res.render('home');
});
router.get("/login.hbs", function (req, res) {
    res.render('login');
});
router.get("/singup.hbs", function (req, res) {
    res.render('singup');
});
router.get("/user.hbs", function (req, res) {
    res.render('user');
});
router.get('/vewuser.hbs', function (req, res, next) {
    // ket noi toi collection ten la users
    var connectUsers = db.model('users', user);
    connectUsers.find({},
        function (error, users) {
            if (error) {
                res.render('vewuser', {title: 'Express : Loi@@@@'})
            } else {

                res.render('vewuser', {title: 'Express', users: users})

            }
        })
});


router.post('/vewuser.hbs', uploads.single('avatar'), function (req, res) {
    var connectUsers = db.model('users', user);
    connectUsers({
        hoTen: req.body.hoTen,
        ngaySinh: req.body.ngaySinh,
        email: req.body.email,
        gioiTinh: req.body.gioiTinh,
        soThich: req.body.soThich,
        gioiThieu: req.body.gioiThieu,
        avatar: path + req.file.filename
            // {
            //     data: path + req.file.filename,
            //     contentType: '.jpg'
            // }
    }).save(function (error) {
        if (error) {
            res.render('user', {title: 'Express Loi!!!!'});
        } else {
            connectUsers.find({},
                function (error, users) {
                    if (error) {
                        res.render('vewuser', {title: 'Express : Loi@@@@'})
                    } else {

                        res.render('vewuser', {title: 'Express', users: users})

                    }
                })
        }
    })
})
router.post('/delete', function (req, res) {
    var connectUsers = db.model('users', user);
    console.log(req.body.id)
    connectUsers.remove({_id : req.body.id},function (error){
        if (error){
            res.send("xoa bi loi")
        }else {
            connectUsers.find({},
                function (error, users) {
                    if (error) {
                        res.render('vewuser', {title: 'Express : Loi@@@@'})
                    } else {

                        res.render('vewuser', {title: 'Express', users: users})

                    }
                })
        }
    })

});

router.post('/update',function (req,res){
    var connectUsers = db.model('users', user);
    console.log(req.body.id)
    connectUsers.find({_id:req.body.id},
        function (error, users) {
            if (error) {
                res.render('updateUser', {title: 'Express : Loi@@@@'})
            } else {

                res.render('updateUser', {title: 'Express', users: users})

            }
        })

})

router.post('/updateUser',uploads.single('avatar'),function (req,res){
    var connectUsers = db.model('users', user);
    console.log(req.body.id)
    connectUsers.findByIdAndUpdate({_id:req.body.id},{
        hoTen: req.body.hoTen,
        ngaySinh: req.body.ngaySinh,
        email: req.body.email,
        gioiTinh: req.body.gioiTinh,
        soThich: req.body.soThich,
        gioiThieu: req.body.gioiThieu,
        avatar: path + req.file.filename
    },function (error){
        if (error){
            res.send("update bi loi")
        }else {
            connectUsers.find({},
                function (error, users) {
                    if (error) {
                        res.render('vewuser', {title: 'Express : Loi@@@@'})
                    } else {

                        res.render('vewuser', {title: 'Express', users: users})

                    }
                })
        }
    })
})
module.exports = router;
