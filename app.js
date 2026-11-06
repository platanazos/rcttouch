const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2XNFK7iywr_JcpMq1Qv3ZQx3FQfWgyuR3CU9zk7o1e-CRQOsdsUtKQMUSchwRfmsJ/exec';

// Handle publishing a new corporation listing
document.getElementById('corpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Publishing...';
    submitBtn.disabled = true;

    const payload = {
        type: 'listing',
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
        headers: {
            'Content-Type': 'text/plain;charset=utf-8'
        },
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
        alert('Failed to publish listing. Please check your connection.');
    })
    .finally(() => {
        submitBtn.textContent = 'Publish Listing';
        submitBtn.disabled = false;
    });
});

// Fetch and display active corporations from Google Sheets
function loadCorporations() {
    const listDiv = document.getElementById('corpList');
    listDiv.innerHTML = '<p>Loading active corporations...</p>';

    fetch(SCRIPT_URL)
    .then(response => response.json())
    .then(data => {
        if (!data || data.length === 0) {
            listDiv.innerHTML = '<p>No active corporations listed right now. Be the first to list one!</p>';
            return;
        }

        const now = new Date().getTime();
        let html = '';
        let activeCount = 0;

        data.forEach(corp => {
            // Calculate 3-day expiration (3 days = 259,200,000 ms)
            const createdTime = new Date(corp.createdAt).getTime();
            const expiresTime = corp.expiresAt ? new Date(corp.expiresAt).getTime() : createdTime + (3 * 24 * 60 * 60 * 1000);
            
            // Skip listings older than 3 days
            if (now > expiresTime) {
                return;
            }

            activeCount++;
            const hoursRemaining = Math.max(0, Math.round((expiresTime - now) / (1000 * 60 * 60)));

            html += `
                <div class="corp-item">
                    <h3>${escapeHtml(corp.corpName)} (ID:${escapeHtml(String(corp.corpId))})</h3>
                    <p><strong>Members:</strong> ${corp.memberCount} \vert{} <strong>Seeking:</strong>${corp.seekingCount} players</p>
                    <p><strong>Requirements:</strong> Level ${corp.minLevel}+ | Value: ${corp.minCompanyValue}+ \vert{} Donations:${corp.minDonations}+</p>
                    <p><strong>Rules & Description:</strong> ${escapeHtml
