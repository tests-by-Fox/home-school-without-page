import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
    timeout: 60 * 1000,
    expect: { timeout: 20000 },
    
    use: {
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        viewport: {width:1800, height: 1024},
        actionTimeout: 60*1000,
        navigationTimeout: 60*1000,
        headless: false
    },

    projects: [
        {
            name: 'chrome',
            use: {
                //headless: true,
                ...devices['Desktop Chrome'],
                browserName: 'chromium',
            },
            
        }
    ],

    workers: 1,
    fullyParallel: true,
    reporter: [
        ['html'],
    ],
};

export default config;