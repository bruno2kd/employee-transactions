const semverSatisfies = require('semver/functions/satisfies')
const packageJSON = require('./package.json')

const requiredVersion = packageJSON?.engines?.node || '0'
const nodeVersion = process.version.replace(/^v/, '')

const isNodeCompatibleVersion = semverSatisfies(nodeVersion, requiredVersion)

if (!isNodeCompatibleVersion) {
  console.warn(`node version ${nodeVersion} is incompatible with this app. ` +
      `Expected version ${requiredVersion}`)
  process.exit(1)
}
