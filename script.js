// Fetch and display hard drives
async function loadDrives() {
    try {
        const response = await fetch('drives.json');
        const drives = await response.json();
        
        // Sort drives by: Manufacturer (A-Z) -> Capacity (low to high) -> Model (A-Z)
        const sortedDrives = drives.sort((a, b) => {
            // Sort by manufacturer first
            const manufacturerSort = a.manufacturer.localeCompare(b.manufacturer);
            if (manufacturerSort !== 0) return manufacturerSort;
            
            // Then by capacity (numeric)
            const capacityA = parseFloat(a.capacity);
            const capacityB = parseFloat(b.capacity);
            if (capacityA !== capacityB) return capacityA - capacityB;
            
            // Finally by model name
            return a.model.localeCompare(b.model);
        });
        
        displayDrives(sortedDrives);
        updateStats(sortedDrives);
        setupSearch(sortedDrives);
    } catch (error) {
        console.error('Error loading drives:', error);
        document.getElementById('drivesContainer').innerHTML = 
            '<p class="no-results">Error loading drives. Please check the drives.json file.</p>';
    }
}

// Display drives in the grid
function displayDrives(drives, filter = '') {
    const container = document.getElementById('drivesContainer');
    
    if (drives.length === 0) {
        container.innerHTML = '<p class="no-results">No drives found.</p>';
        return;
    }
    
    const filteredDrives = drives.filter(drive => {
        const searchTerm = filter.toLowerCase();
        return (
            drive.manufacturer.toLowerCase().includes(searchTerm) ||
            drive.model.toLowerCase().includes(searchTerm) ||
            drive.capacity.toLowerCase().includes(searchTerm) ||
            (drive.type && drive.type.toLowerCase().includes(searchTerm)) ||
            (drive.notes && drive.notes.toLowerCase().includes(searchTerm))
        );
    });
    
    if (filteredDrives.length === 0) {
        container.innerHTML = '<p class="no-results">No drives match your search.</p>';
        return;
    }
    
    container.innerHTML = filteredDrives.map(drive => `
        <div class="drive-card">
            <h3>${drive.manufacturer} ${drive.model}</h3>
            <div class="drive-specs">
                <div class="spec">
                    <span class="spec-label">Capacity:</span>
                    <span class="spec-value">${drive.capacity}</span>
                </div>
                <div class="spec">
                    <span class="spec-label">Type:</span>
                    <span class="spec-value">${drive.type || 'Not specified'}</span>
                </div>
                ${drive.rpm ? `
                <div class="spec">
                    <span class="spec-label">RPM:</span>
                    <span class="spec-value">${drive.rpm}</span>
                </div>
                ` : ''}
                ${drive.interface ? `
                <div class="spec">
                    <span class="spec-label">Interface:</span>
                    <span class="spec-value">${drive.interface}</span>
                </div>
                ` : ''}
                ${drive.notes ? `
                <div class="spec">
                    <span class="spec-label">Notes:</span>
                    <span class="spec-value">${drive.notes}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Update statistics
function updateStats(drives) {
    const totalDrives = drives.length;
    
    // Calculate total capacity
    const totalCapacity = drives.reduce((sum, drive) => {
        const capacity = parseFloat(drive.capacity);
        return sum + (isNaN(capacity) ? 0 : capacity);
    }, 0);
    
    document.getElementById('totalDrives').textContent = totalDrives;
    
    // Format capacity display
    if (totalCapacity >= 1000) {
        document.getElementById('totalCapacity').textContent = (totalCapacity / 1000).toFixed(2) + ' PB';
    } else {
        document.getElementById('totalCapacity').textContent = totalCapacity.toFixed(2) + ' TB';
    }
}

// Setup search functionality
function setupSearch(drives) {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        displayDrives(drives, e.target.value);
    });
}

// Load drives on page load
document.addEventListener('DOMContentLoaded', loadDrives);
