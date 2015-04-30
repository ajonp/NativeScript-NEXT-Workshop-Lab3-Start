var NativeScriptMonitor = require('./NativeScriptMonitor').Monitor;
var monitor = new NativeScriptMonitor({
    productId: 'analytics-key-here',
    version: '0.9'
});

monitor.start();
module.exports = monitor;