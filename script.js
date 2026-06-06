// Fetch and display manufacturers
async function loadManufacturers() {
    try {
        const response = await fetch('drives.json');
        const drives = await response.json();
        
        // Group drives by manufacturer
        const manufacturerMap = {};
        drives.forEach(drive => {
            if (!manufacturerMap[drive.manufacturer]) {
                manufacturerMap[drive.manufacturer] = [];
            }
            manufacturerMap[drive.manufacturer].push(drive);
        });
        
        // Sort manufacturers alphabetically
        const sortedManufacturers = Object.keys(manufacturerMap).sort();
        
        displayManufacturers(sortedManufacturers, manufacturerMap, drives);
        updateStats(drives, sortedManufacturers);
        setupSearch(sortedManufacturers, manufacturerMap, drives);
    } catch (error) {
        console.error('Error loading drives:', error);
        document.getElementById('manufacturersContainer').innerHTML = 
            '<p class="no-results">Error loading manufacturers. Please check the drives.json file.</p>';
    }
}

// Display manufacturers as cards
function displayManufacturers(manufacturers, manufacturerMap, allDrives, filter = '') {
    const container = document.getElementById('manufacturersContainer');
    
    if (manufacturers.length === 0) {
        container.innerHTML = '<p class="no-results">No manufacturers found.</p>';
        return;
    }
    
    const filteredManufacturers = manufacturers.filter(mfg => 
        mfg.toLowerCase().includes(filter.toLowerCase())
    );
    
    if (filteredManufacturers.length === 0) {
        container.innerHTML = '<p class="no-results">No manufacturers match your search.</p>';
        return;
    }
    
    container.innerHTML = filteredManufacturers.map(manufacturer => {
        const drives = manufacturerMap[manufacturer];
        const totalCapacity = drives.reduce((sum, drive) => {
            const capacity = parseFloat(drive.capacity);
            return sum + (isNaN(capacity) ? 0 : capacity);
        }, 0);
        
        const driveTypes = [...new Set(drives.map(d => d.type).filter(Boolean))];
        const safeManufacturer = manufacturer.replace(/'/g, "\\'");
        
        return `<div class="manufacturer-card" onclick="goToManufacturer('${safeManufacturer}')"><h3>${manufacturer}</h3><div class="manufacturer-info"><div class="info-item"><span class="info-label">Drives:</span><span class="info-value">${drives.length}</span></div><div class="info-item"><span class="info-label">Capacity:</span><span class="info-value">${totalCapacity.toFixed(2)} TB</span></div><div class="info-item"><span class="info-label">Types:</span><span class="info-value">${driveTypes.join(', ') || 'Not specified'}</span></div></div><div class="click-hint">Click to view drives →</div></div>`;
    }).join('');
}

// Navigate to manufacturer page
function goToManufacturer(manufacturer) {
    sessionStorage.setItem('selectedManufacturer', manufacturer);
    window.location.href = 'manufacturer.html';
}

// Update statistics
function updateStats(drives, manufacturers) {
    const totalDrives = drives.length;
    
    // Calculate total capacity
    const totalCapacity = drives.reduce((sum, drive) => {
        const capacity = parseFloat(drive.capacity);
        return sum + (isNaN(capacity) ? 0 : capacity);
    }, 0);
    
    document.getElementById('totalDrives').textContent = totalDrives;
    document.getElementById('totalManufacturers').textContent = manufacturers.length;
    
    // Format capacity display
    if (totalCapacity >= 1000) {
        document.getElementById('totalCapacity').textContent = (totalCapacity / 1000).toFixed(2) + ' PB';
    } else {
        document.getElementById('totalCapacity').textContent = totalCapacity.toFixed(2) + ' TB';
    }
}

// Setup search functionality
function setupSearch(manufacturers, manufacturerMap, allDrives) {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        displayManufacturers(manufacturers, manufacturerMap, allDrives, e.target.value);
    });
}

// Load manufacturers on page load
document.addEventListener('DOMContentLoaded', loadManufacturers);
