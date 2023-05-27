var con=require('../config/config')
var checkuser=require('../Middlewares/Checkuser')
var razorpay=require('../payment/Razorpay')
const home=(req,res)=>{
    let qry='select * from product'
    con.query(qry,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(req.session.user){
                let user=req.session.user
                console.log(user,'hello')
                let id=user.id
                let cartqry='select count(*) as cartnumber from cart where userid =?'
                con.query(cartqry,[id],(err,row)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log(row[0].cartnumber,'from cart')
                        let cart=row[0].cartnumber
                        res.render('index',{result,user,cart})
                    }
                })
            }
            else{
                res.render('index',{result})
            }
            
        }
    })
   
}
const login=(req,res)=>{
    res.render('users/login')
}
const register=(req,res)=>{
    res.render('users/register')
}
const doregister=(req,res)=>{
    console.log(req.body);
    let qry='insert into users set ?'
    con.query(qry,req.body,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            console.log('inserted successfully')
            res.redirect('/login')
        }
    })

}
const dologin=(req,res)=>{
    console.log(req.body)
    let username=req.body.username;
    let password=req.body.password;
    let qry='select * from users where name =? and password =?'
    con.query(qry,[username,password],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length>0){
                console.log('login successfully broo')
                req.session.user=result[0];
                console.log(req.session.user,'session data')
                res.redirect('/')
            }else{
                console.log('login error bro')
                res.redirect('/login')
            }
        }
    })
   
}

const myorder=(req,res)=>{
    res.render('users/myorder')
}
const logout=(req,res)=>{
    req.session.destroy()
    res.redirect('/')

}
const addtocart=(req,res)=>{
    let productid=req.params.pid
    let userid=req.session.user.id
    let qry='select * from cart where productid =? and userid =?'
    con.query(qry,[productid,userid],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length>0){
                var qty=result[0].qty
                let cartid=result[0].id
                let qry1='update cart set where qty =? and id=?'
                con.query(qry1,[qty,cartid],(err,row)=>{
                    if(err){
                        console.log(err)
                    }else{
                        res.redirect('/')
                    }
                })
            }
        }
        let qry2='insert into cart set ?'
        var data={
            productid,
            userid
        }
        con.query(qry2,data,(err,result)=>{
            if(err){
                console.log(err)
            }else{
                res.redirect('/')
            }
        })
    })

}
const buynow=(req,res)=>{
     let qry='select * from product where id =?'
     let productid=req.params.id
     con.query(qry,productid,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            let product=result[0];
            let user=req.session.user
            res.render('users/buy',{product,user})

        }
     })
}
const checkout=(req,res)=>{
    let productid=req.params.id;
    let price=req.params.price;
    console.log(productid,price)
    
var options = {
    amount: 50000,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  razorpay.orders.create(options, function(err, order) {
    if(err){
        console.log(err)
    }else{
        console.log(order);
        res.render('users/checkout',{order})

    }
  });

}
const payVerify = async(req,res) =>
{
    console.log(req.body);
    let data = req.body;
    var crypto = require('crypto');
    var order_id = data['response[razorpay_order_id]']
    var payment_id = data[ 'response[razorpay_payment_id]']
    const razorpay_signature = data[ 'response[razorpay_signature]']
    const key_secret = "nhuwa5cqmVHrDX1P4Ro1I8xy";
    let hmac = crypto.createHmac('sha256', key_secret); 
    await hmac.update(order_id + "|" + payment_id);
    const generated_signature = hmac.digest('hex');
    if(razorpay_signature===generated_signature){
        console.log('verified')
        res.redirect('/')
    }
    else{
        console.log('failed')
    } 

}
const cancelpage=(req,res)=>{
    // req.session.destroy()
    res.redirect('/')
}
module.exports={home,login,register,doregister,dologin,myorder,cancelpage,logout,addtocart,buynow,checkout,payVerify}