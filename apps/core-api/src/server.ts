import express from "express"
import { httpLogger } from "./middlewares/httpLogger.js"
import { logger } from "./utils/logger.js"
import { errorHandler, notFound } from "./middlewares/errorHandler.js"


const app = express()
const PORT = Number(process.env.PORT) || 5000
app.use(express.json())
app.use(httpLogger)
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "core-api",
        timestamp: new Date().toISOString()
    })
})

app.use(notFound)
app.use(errorHandler)
app.listen(PORT, () => {
    logger.info(`Core API is running at http://localhost:${PORT}`);
    
})