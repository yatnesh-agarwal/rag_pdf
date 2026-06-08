function getSessionId(req) {
    const sessionId = req.headers["x-session-id"]

    if (typeof sessionId !== "string") {
        return null
    }

    const trimmed = sessionId.trim()
    return trimmed || null
}

module.exports = {getSessionId}
