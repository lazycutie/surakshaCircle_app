import { io } from "socket.io-client"
import { IP_ADDRESS } from "@env"




/*
|--------------------------------------------------------------------------
| SOCKET CONNECTION
|--------------------------------------------------------------------------
| This file creates a global socket connection
| that can be used anywhere in the app.
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Replace the IP with your backend server IP.
|
| Example:
| 192.168.0.104 (your laptop)
|--------------------------------------------------------------------------
*/

export const socket = io(`http://${IP_ADDRESS}:5000`, {

  transports:["websocket", "polling"],

})



/*
|--------------------------------------------------------------------------
| CONNECTION DEBUG
|--------------------------------------------------------------------------
| These logs help verify that the phone
| successfully connected to the backend.
|--------------------------------------------------------------------------
*/

socket.on("connect",()=>{

  console.log("Socket connected:", socket.id)

})

socket.on("disconnect",()=>{

  console.log("Socket disconnected")

})