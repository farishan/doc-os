import os from "./features/os";
import { renderBootButton } from './features/testing-scripts'
import CONFIG from "./config";
import logger from "./modules/logger";

logger.switch(CONFIG.debug);
logger.log(`Hello from main.js`)
logger.log(CONFIG)

if (CONFIG.autoboot) {
    os.execute('boot')

    /* Shutdown test */
    if (CONFIG.should_test_shutdown) {
        os.executeLater('shutdown', 1000)
    }
} else {
    logger.log('Rendering "boot" button...')
    renderBootButton(os)
    logger.log('"boot" button rendered.')
}
