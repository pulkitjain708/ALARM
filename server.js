tarr=[]
const express= require('express');
const app=express();
arr=[]
app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})
const port=app.listen("8080");
var io = require('socket.io')(port);
io.on("connect",(client)=>{
    client.on("addtimer",(timevalue)=>{
        tymobj={}
          tymobj.sid=client.id
          tymobj.tym=timevalue
           pushSettings(tymobj)
    })
})
 function pushSettings(obj){
    timeConfig=new Date()
    hrs=timeConfig.getHours()
    min=timeConfig.getMinutes()>10?timeConfig.getMinutes():"0"+timeConfig.getMinutes()
    rtym=hrs+" : "+min
    // Logic for Pushing

    if(obj.tym<rtym){
        return
    }
    else{
         if(tarr.length==0){
             tarr.push(obj)
         }
         else{
             if(tarr[0].tym>obj.tym){
                 tarr.splice(0,0,obj)
             }
             else{
                 var i=1
                 while(i<tarr.length){
                    if( tarr[i].tym > obj.tym )
                    {
                        tarr.splice(i,0,obj)
                        break;
                    } 
                    i++
                 }
                 if(i==tarr.length)
                tarr.splice(i,0,obj);
             }
         }
    }
}
setInterval(() => {
    var today= new Date();
    var min= (today.getMinutes()<10)?"0"+today.getMinutes():today.getMinutes();
    var hrs=today.getHours();
    var time = hrs + ":" +min;
    if(tarr.length!=0)
     {
        if(time==tarr[0].tym)
        { 
  
          io.to(tarr[0].sid).emit("ringing" ,time);
           tarr.shift();
        }
      }
    }, 1000);