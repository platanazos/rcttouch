const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// Handle publishing a new corporation listing
document.getElementById('corpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const payload = {
        corpName: document.getElementById('corpName').value,
        corpId: document.getElementById('corpId').value,
        memberCount: document.getElementById('memberCount').value,
        seekingCount: document.getElementById('seekingCount').value,
        minLevel: document.getElementById('minLevel').value,
        minCompanyValue: document.getElementById('minCompanyValue').value,
        minDonations: document.getElementById('minDonations').value,
        description: document.getElementById('description').value
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        alert('Corporation listed successfully!');
        document.getElementById('corpForm').reset();
        loadCorporations();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to publish listing.');
    });
});

// Fetch and display active corporations from Google Sheets
function loadCorporations() {
    const listDiv = document.getElementById('corpList');
    listDiv.innerHTML = 'Loading listings...';

    fetch(SCRIPT_URL)
    .then(response => response.json())
    .then(data => {
        if (data.length === 0) {
            listDiv.innerHTML = '<p>No active corporations listed right now.</p>';
            return;
        }

        let html = '';
        data.forEach(corp => {
            html += `
                <div class="corp-item">
                    <h3>${corp.corpName} (ID: ${corp.corpId})</h3>
                    <p><strong>Members:</strong> ${corp.memberCount} | <strong>Seeking:</strong> ${corp.seekingCount} players</p>
                    <p><strong>Requirements:</strong> Level ${corp.minLevel}+ | Value: ${corp.minCompanyValue}+ | Donations: ${corp.minDonations}+</p>
                    <p><strong>Rules/Description:</strong> ${corp.description}</p>
                    <p><em>⚠️ Reminder: You must leave your current corporation in RCT Touch to receive an invite!</em></p>
                </div>
            `;
        });
        listDiv.innerHTML = html;
    })
    .catch(error => {
        console.error('Error loading data:', error);
        listDiv.innerHTML = '<p>Could not load listings.</p>';
    });
}

// Load listings when page opens
loadCorporations();