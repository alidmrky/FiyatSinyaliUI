import { healthApi } from './health.api'
import { logsApi } from './logs.api'

export const scraperApi = {
    health: healthApi,
    logs: logsApi
}
