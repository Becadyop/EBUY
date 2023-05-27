var con=require('../config/config')
const adminhome=(req,res)=>{
    res.render('admin/home')
}
const adminlogin=(req,res)=>{
    let username='admin'
    let password='admin'
    console.log(req.body)
    if(req.body.username ==username && password==password){
    console.log('login successfully')
    res.render('admin/adminhome')
    }else{
        console.log('login error')
        res.render('admin/home')
    }

}
const adminhomepage=(req,res)=>{
    res.render('admin/adminhome')
    
}
const addproduct=(req,res)=>{
    res.render('admin/addproduct')
}
const productpage=(req,res)=>{
    let files=req.files.image;
    // console.log(files)
    const {name}=req.files.image;
    req.body.image=name;
    console.log(req.body)
    var data=req.body
    files.mv('public/images/products/'+name,(err)=>{
        if(err){
            console.log(err)
        }else{
            let qry='insert into product set ?'
            con.query(qry,data,(err,result)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(result)
                    res.redirect('/admin/adminhome')
                }
            })
        }
    })
}


module.exports={adminhome,adminlogin,adminhomepage,addproduct,productpage}