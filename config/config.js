var mysql=require('mysql')
var con=mysql.createConnection({
  host:'localhost',
  name:'hammo',
  database:'ECOMM',
})
con.connect((err)=>{
  if(err)
  console.log(err)
  else{
    console.log('connected broo')
  }
})

module.exports=con;