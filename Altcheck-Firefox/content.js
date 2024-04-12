if (window.location.host === "www.roblox.com") {

    function fetchAndDisplayAlt() {
        console.log("getting user id");
        const urlPath = window.location.pathname;
        const pathSegments = urlPath.split('/');
        const userId = pathSegments[2];

        if (userId) {
            console.log(`User ID found: ${userId}`);
            const apiUrl = `https://altcheck-demo.fiddllepat.com/predict_by_userid?user_id=${encodeURIComponent(userId)}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.percent_alt !== undefined) {
                        addNewListItem(data.percent_alt);
                        insertBadgeActivityImage(userId);
                    } else {
                        console.error('Error fetching data:', data);
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
            fetchLastOnline(userId);
        } else {
            console.log("user id not found.");
        }
    }

    function addNewListItem(percentAlt) {
        const detailsInfo = document.querySelector('ul.details-info');
        if (detailsInfo) {
            const newListItem = document.createElement('li');
            const textLabel = document.createElement('div');
            textLabel.className = "text-label font-caption-header";
            textLabel.textContent = "Alt";

            const percentSpan = document.createElement('span');
            percentSpan.className = "font-header-2";
            percentSpan.title = `${percentAlt}%`;
            percentSpan.textContent = `${percentAlt}%`;

            newListItem.appendChild(textLabel);
            newListItem.appendChild(percentSpan);
            detailsInfo.appendChild(newListItem);
            console.log("inserted alt %");
        }
    }

    function insertBadgeActivityImage(userId) {
        const imageUrl = `https://altcheck-demo.fiddllepat.com/graph_badge_activity/${userId}`;
        const footerDiv = document.querySelector('.border-top.profile-about-footer');
        if (footerDiv) {
            const textLabel = document.createElement('span');
            textLabel.textContent = 'Badge Activity';
            textLabel.style.display = 'block';
            textLabel.style.fontWeight = 'bold';
            textLabel.style.marginBottom = '5px';

            const loadingText = document.createElement('span');
            loadingText.textContent = 'Loading';
            loadingText.style.display = 'block';
            footerDiv.appendChild(loadingText);

            let dotCount = 0;
            const loadingInterval = setInterval(() => {
                loadingText.textContent = `Loading${'.'.repeat(dotCount)}`;
                dotCount = (dotCount + 1) % 4;
            }, 500);

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Badge Activity';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'none';

            img.onload = () => {
                clearInterval(loadingInterval);
                loadingText.remove();
                img.style.display = 'block';
            };

            if (footerDiv.firstChild) {
                footerDiv.insertBefore(textLabel, footerDiv.firstChild);
                footerDiv.insertBefore(img, textLabel.nextSibling);
            } else {
                footerDiv.appendChild(textLabel);
                footerDiv.appendChild(img);
            }

            console.log("started loading the badge activity");
        }
    }

    function fetchLastOnline(userId) {
        const lastOnlineApiUrl = 'https://presence.roblox.com/v1/presence/last-online';
        fetch(lastOnlineApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                "userIds": [parseInt(userId)]
            })
        })
        .then(response => response.json())
        .then(data => {
            const lastOnlineTimestamps = data.lastOnlineTimestamps;
            if (lastOnlineTimestamps && lastOnlineTimestamps.length > 0) {
                const lastOnline = lastOnlineTimestamps[0].lastOnline;
                const lastOnlineDate = new Date(lastOnline);
                const daysAgo = Math.floor((new Date() - lastOnlineDate) / (1000 * 60 * 60 * 24));
                let lastOnlineText;
                if (daysAgo === 0) {
                    lastOnlineText = 'Last Online Today';
                } else if (daysAgo === 1) {
                    lastOnlineText = 'Last Online Yesterday';
                } else {
                    lastOnlineText = `Last Online ${daysAgo} Days Ago`;
                }

                const profileDisplayName = document.querySelector('.profile-display-name.font-caption-body.text.text-overflow');
                if (profileDisplayName) {
                    const originalText = profileDisplayName.textContent;
                    profileDisplayName.textContent = `${originalText} | ${lastOnlineText}`;
                }
            }
        })
        .catch(error => console.error('error fetching last online data:', error));
    }

    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', fetchAndDisplayAlt);
    } else {
        fetchAndDisplayAlt();
    }
}
