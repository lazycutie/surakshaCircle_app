export type Alert = {
    userId: string
    circleId: string
    location: {
        latitude: number
        logitude: number
    }
    alertType: "manual" | "shake" | "voice"
    status: "resolved"|"active"
    expiresAt: "date"
}