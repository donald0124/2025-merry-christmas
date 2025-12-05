document.addEventListener('DOMContentLoaded', () => {
    

    // ==========================================
    // 功能：檢查是否有儲存的任務頁面 (LocalStorage)
    // ==========================================
    const savedUrl = localStorage.getItem('my_santa_mission');
    const welcomeArea = document.getElementById('welcome-back-area');
    const missionLink = document.getElementById('my-mission-link');

    // 如果記憶體有資料，而且「當前頁面不是任務頁面本身」(避免在任務頁也顯示)
    if (savedUrl && welcomeArea && !window.location.href.includes(savedUrl)) {
        // 設定連結
        missionLink.href = savedUrl;
        // 顯示按鈕
        welcomeArea.style.display = 'block';
    }

    
    // ==========================================
    // 功能一：聖誕老人追蹤器 (維持不變)
    // ==========================================
    const santaEmoji = "🦌🛷🎅"; 

    function updateSantaTracker() {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 11, 1);
        const endDate = new Date(currentYear, 11, 22, 23, 59, 59);
        const now = new Date();

        const diffTime = endDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const daysLeftElement = document.getElementById('days-left');
        if (now >= endDate) {
            daysLeftElement.innerText = "已截止！";
            daysLeftElement.style.color = "#B64545";
        } else {
            daysLeftElement.innerText = `還剩 ${diffDays} 天`;
        }

        const totalDuration = endDate - startDate;
        const timePassed = now - startDate;
        let percentage = (timePassed / totalDuration) * 100;

        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        const santa = document.getElementById('santa');
        const progressFill = document.getElementById('progress-fill');

        santa.innerText = santaEmoji;
        progressFill.style.width = percentage + "%";
        progressFill.style.backgroundColor = "#B64545";
        progressFill.style.height = "100%";
        progressFill.style.borderRadius = "5px";

        santa.style.left = "0%";
        setTimeout(() => {
            let iconPosition = percentage;
            if(iconPosition > 95) iconPosition = 95;
            santa.style.left = iconPosition + "%";
        }, 100);
    }

    updateSantaTracker();
    setInterval(updateSantaTracker, 60000);


    // ==========================================
    // 功能二：下雪特效 (文青風粉雪)
    // ==========================================
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // 隨機大小 (文青風不需要大雪，小小的就好)
        const size = Math.random() * 5 + 2; // 2px ~ 7px
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        
        // 隨機水平位置
        snowflake.style.left = `${Math.random() * 100}vw`;
        
        // 隨機透明度 (製造景深感)
        snowflake.style.opacity = Math.random() * 0.5 + 0.3;
        
        // 隨機飄落時間 (越慢越浪漫)
        const duration = Math.random() * 5 + 5; // 5s ~ 10s
        snowflake.style.animationDuration = `${duration}s`;
        
        // 加到容器
        document.getElementById('snow-container').appendChild(snowflake);
        
        // 動畫結束後移除元素，避免記憶體不足
        setTimeout(() => {
            snowflake.remove();
        }, duration * 1000);
    }

    // 每 300 毫秒產生一片雪花 (如果覺得太少改小，太多改大)
    setInterval(createSnowflake, 300);


});