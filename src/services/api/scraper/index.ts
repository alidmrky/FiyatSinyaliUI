import { healthApi } from './health.api'
import { logsApi } from './logs.api'
import { scrapTestApi } from './scrapTest.api'

export const scraperApi = {
    health: healthApi,
    logs: logsApi,
    scrapTest: scrapTestApi,
}
