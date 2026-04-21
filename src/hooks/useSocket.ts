import { useEffect } from "react"
import { socket } from "../services/socketService"



/*
|--------------------------------------------------------------------------
| SOCKET SETUP HOOK
|--------------------------------------------------------------------------
| This hook registers the logged-in user
| with the socket server.
|--------------------------------------------------------------------------
*/

export default function useSocketSetup(userId:string){

  useEffect(()=>{

    if(!userId) return


    /*
    ------------------------------------------------
    REGISTER USER SOCKET
    ------------------------------------------------
    Backend will map:
    userId -> socket connection
    ------------------------------------------------
    */

    socket.emit("register-user", userId)


    /*
    ------------------------------------------------
    DEBUG LOG
    ------------------------------------------------
    */

    console.log("Socket registered for user:",userId)


  },[userId])

}