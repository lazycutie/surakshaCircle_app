import { createContext, useContext, useEffect } from "react"
import { io } from "socket.io-client"
import { AuthContext } from "./AuthContext"
import { jwtDecode } from "jwt-decode"
import { IP_ADDRESS } from "@env"

/*
------------------------------------------------
SOCKET SERVER URL
------------------------------------------------
*/
const SOCKET_URL = `http://${IP_ADDRESS}:5000`

/*
------------------------------------------------
CREATE SINGLE GLOBAL SOCKET INSTANCE
------------------------------------------------
*/
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
})

const SocketContext = createContext(socket)

/*
------------------------------------------------
SOCKET PROVIDER (FIXED)
------------------------------------------------
Handles:
✔ Connection
✔ Joining user room
------------------------------------------------
*/

export const SocketProvider = ({ children }) => {

  const { token } = useContext(AuthContext)

useEffect(() => {

  /*
  ------------------------------------------------
  DEBUG: CHECK IF TOKEN IS AVAILABLE
  ------------------------------------------------
  Socket connection depends on auth token.
  If token is missing → user is not logged in yet.
  ------------------------------------------------
  */
  console.log("TOKEN IN SOCKET:", token)

  /*
  ------------------------------------------------
  STOP EXECUTION IF NO TOKEN
  ------------------------------------------------
  Prevents unnecessary socket connection attempts
  before authentication is ready.
  ------------------------------------------------
  */
  if (!token) {
    console.log("No token → socket not connecting")
    return
  }

  /*
  ------------------------------------------------
  DECODE TOKEN → EXTRACT USER ID
  ------------------------------------------------
  We use userId to:
  1. Join a private socket room
  2. Receive alerts targeted to this user
  ------------------------------------------------
  */
  let userId;
  try {
    const decoded: any = jwtDecode(token)
    userId = decoded.id || decoded._id;
  } catch (err) {
    console.log("❌ Error decoding token for socket connection:", err)
    return
  }

  console.log("Decoded userId:", userId)

  /*
  ------------------------------------------------
  CONNECT SOCKET (ONLY IF NOT CONNECTED)
  ------------------------------------------------
  Prevents multiple connections / duplicate sockets
  ------------------------------------------------
  */
  if (!socket.connected) {
    socket.connect()
    console.log("Connecting socket...")
  }

  /*
  ------------------------------------------------
  HANDLE SOCKET CONNECTION EVENT
  ------------------------------------------------
  This runs ONLY when socket successfully connects.
  ------------------------------------------------
  */
  const handleConnect = () => {

    console.log("✅ Socket connected:", socket.id)

    /*
    --------------------------------------------
    JOIN USER-SPECIFIC ROOM
    --------------------------------------------
    This is CRITICAL:
    Backend emits alerts using userId rooms.
    If this step fails → NO real-time alerts.
    --------------------------------------------
    */
    socket.emit("join", userId)

    console.log("✅ Joined room:", userId)
  }

  /*
  ------------------------------------------------
  REGISTER CONNECT EVENT LISTENER
  ------------------------------------------------
  */
  socket.on("connect", handleConnect)

  /*
  ------------------------------------------------
  CLEANUP FUNCTION
  ------------------------------------------------
  Prevents duplicate listeners when component
  re-renders or token changes.
  ------------------------------------------------
  */
  return () => {
    socket.off("connect", handleConnect)
    if (socket.connected) {
      socket.disconnect()
      console.log("🔌 Socket disconnected on cleanup")
    }
  }

}, [token])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

/*
------------------------------------------------
CUSTOM HOOK
------------------------------------------------
*/
export const useSocket = () => useContext(SocketContext)