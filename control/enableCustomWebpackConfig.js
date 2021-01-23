const fs = require('fs').promises;

(async function () {
    const featureFlagsPath = './node_modules/pcf-scripts/featureflags.json';

    let json = await fs.readFile(featureFlagsPath, { encoding: 'utf-8' });
    
    const flags = JSON.parse(json);
    flags.pcfAllowCustomWebpack = "on";

    json = JSON.stringify(flags, null, 2);

    await fs.writeFile(featureFlagsPath, json);
}())