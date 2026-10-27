/**
 * RootSteve's Network Port Scanner
 * A simple Node.js tool to find open network ports on a local host.
 */

const net = require('net');

// The targets we want to scan (standard hacking lab ports)
const portsToScan = [21, 22, 80, 443, 8080, 9000];
const targetHost = '127.0.0.1'; // Scanning your own local machine safely
const timeoutLimit = 1500; 

console.log(`📡 [RootSteve] Starting reconnaissance scan on ${targetHost}...`);

// Ethical Hacking Logic: Try to establish a connection to see if port is open
const scanPort = (port) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        
        socket.setTimeout(timeoutLimit);
        
        socket.on('connect', () => {
            socket.destroy();
            resolve({ port, status: 'OPEN 🔓 (Potential Target)' });
        });
        
        socket.on('timeout', () => {
            socket.destroy();
            resolve({ port, status: 'FILTERED 🛡️ (Firewall Active)' });
        });
        
        socket.on('error', () => {
            socket.destroy();
            resolve({ port, status: 'CLOSED 🔒' });
        });
        
        socket.connect(port, targetHost);
    });
};

// Execute the scan across all ports asynchronously
async function runScanner() {
    const scanPromises = portsToScan.map(port => scanPort(port));
    const results = await Promise.all(scanPromises);
    
    console.log('\n===== SCAN REPORT =====');
    // Using clean array filtering to isolate vulnerable openings
    const openPorts = results.filter(item => item.status.includes('OPEN'));
    
    results.forEach(res => console.log(`Port ${res.port}: ${res.status}`));
    
    console.log('=======================');
    console.log(`⚠️ Summary: Found ${openPorts.length} exposed attack surfaces.`);
}

runScanner();
Add core port scanning logic
