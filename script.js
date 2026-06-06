// Wait for DOM to be ready, then load manufacturers
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    loadManufacturers();
});

// Fetch and display manufacturers
async function loadManufacturers() {
    console.log('Starting loadManufacturers');
    const container = document.getElementById('manufacturersContainer');
    console.log('Container element:', container);
    
    if (!container) {
        console.error('manufacturersContainer element not found!');
        return;
    }
    
    try {
        console.log('Fetching drives.json');
        const response = await fetch('drives.json');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const drives = await response.json();
        console.log('Drives loaded:', drives.length);
        
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
        console.log('Manufacturers:', sortedManufacturers);
        
        displayManufacturers(sortedManufacturers, manufacturerMap, drives);
        updateStats(drives, sortedManufacturers);
        setupSearch(sortedManufacturers, manufacturerMap, drives);
    } catch (error) {
        console.error('Error loading drives:', error);
        const errorContainer = document.getElementById('manufacturersContainer');
        if (errorContainer) {
            errorContainer.innerHTML = '<p class="no-results">Error loading manufacturers: ' + error.message + '</p>';
        }
    }
}

// Display manufacturers as cards
function displayManufacturers(manufacturers, manufacturerMap, allDrives, filter = '') {
    console.log('displayManufacturers called with', manufacturers.length, 'manufacturers');
    
    const container = document.getElementById('manufacturersContainer');
    if (!container) {
        console.error('Container not found in displayManufacturers');
        return;
    }
    
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
    
    let html = '';
    filteredManufacturers.forEach(manufacturer => {
        const drives = manufacturerMap[manufacturer];
        const totalCapacity = drives.reduce((sum, drive) => {
            const capacity = parseFloat(drive.capacity);
            return sum + (isNaN(capacity) ? 0 : capacity);
        }, 0);
        
        const driveTypes = [...new Set(drives.map(d => d.type).filter(Boolean))];
        const safeManufacturer = manufacturer.replace(/'/g, "\\'");
        
        html += `<div class="manufacturer-card" onclick="goToManufacturer('${safeManufacturer}')">
                    <h3>${manufacturer}</h3>
                    <div class="manufacturer-info">
                        <div class="info-item">
                            <span class="info-label">Drives:</span>
                            <span class="info-value">${drives.length}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Capacity:</span>
                            <span class="info-value">${totalCapacity.toFixed(2)} TB</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Types:</span>
                            <span class="info-value">${driveTypes.join(', ') || 'Not specified'}</span>
                        </div>
                    </div>
                    <div class="click-hint">Click to view drives →</div>
                </div>`;
    });
    
    container.innerHTML = html;
}

// Navigate to manufacturer page
function goToManufacturer(manufacturer) {
    console.log('Navigating to:', manufacturer);
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
    
    const totalDrivesEl = document.getElementById('totalDrives');
    const totalCapacityEl = document.getElementById('totalCapacity');
    const totalManufacturersEl = document.getElementById('totalManufacturers');
    
    if (totalDrivesEl) totalDrivesEl.textContent = totalDrives;
    if (totalManufacturersEl) totalManufacturersEl.textContent = manufacturers.length;
    
    if (totalCapacityEl) {
        if (totalCapacity >= 1000) {
            totalCapacityEl.textContent = (totalCapacity / 1000).toFixed(2) + ' PB';
        } else {
            totalCapacityEl.textContent = totalCapacity.toFixed(2) + ' TB';
        }
    }
}

// Setup search functionality
function setupSearch(manufacturers, manufacturerMap, allDrives) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            displayManufacturers(manufacturers, manufacturerMap, allDrives, e.target.value);
        });
    }
}
