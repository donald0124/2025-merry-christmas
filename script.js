document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 功能：檢查是否有儲存的任務頁面 (LocalStorage)
    // ==========================================
    const savedUrl = localStorage.getItem('my_santa_mission');
    const welcomeArea = document.getElementById('welcome-back-area');
    const missionLink = document.getElementById('my-mission-link');

    if (savedUrl && welcomeArea && !window.location.href.includes(savedUrl)) {
        missionLink.href = savedUrl;
        welcomeArea.style.display = 'block';
    }

    // ==========================================
    // 功能：聖誕老人追蹤器 (修正版：強制開啟點擊)
    // ==========================================
    const santaContainer = document.getElementById('santa-container');
    const progressFill = document.getElementById('progress-fill');
    const daysLeftElement = document.getElementById('days-left');

    // 核心變數
    let basePercentage = 0;       // 日期決定的基礎位置
    let bonusPercentage = 0;      // 點擊增加的額外距離
    let currentDisplayPos = 0;    // 目前畫面上的實際位置
    let isPhysicsMode = false;    // 模式旗標

    // ★★★ 關鍵修正：強制開啟滑鼠點擊功能 (覆蓋掉 CSS 的 pointer-events: none) ★★★
    if (santaContainer) {
        santaContainer.style.pointerEvents = 'auto'; 
        santaContainer.style.cursor = 'pointer';     // 讓滑鼠變成手指形狀
    }

    // 1. 基礎日期計算
    function updateDateProgress() {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 11, 1);
        const endDate = new Date(currentYear, 11, 22, 23, 59, 59);
        const now = new Date();

        // 顯示天數
        const diffTime = endDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (daysLeftElement) {
            if (now >= endDate) {
                daysLeftElement.innerText = "已截止！";
                daysLeftElement.style.color = "#d35400";
            } else {
                daysLeftElement.innerText = `還剩 ${diffDays} 天`;
            }
        }

        // 計算百分比
        const totalDuration = endDate - startDate;
        const timePassed = now - startDate;
        let percentage = (timePassed / totalDuration) * 100;

        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        
        basePercentage = percentage;

        // ★★★ 修改點 1：只有「還沒開始玩」的時候，才由日期控制進度條 ★★★
        if (!isPhysicsMode) {
            if (progressFill) {
                progressFill.style.height = "100%"; 
                progressFill.style.width = percentage + "%";
            }
            if (santaContainer) {
                santaContainer.style.left = percentage + "%"; 
            }
        }
    }

    // 2. 啟動遊戲物理模式 (第一次點擊時觸發)
    function enablePhysicsMode() {
        isPhysicsMode = true;
        
        // 抓取目前位置，避免跳動
        if (santaContainer && santaContainer.parentElement) {
            const parentWidth = santaContainer.parentElement.offsetWidth;
            const currentLeftPx = santaContainer.getBoundingClientRect().left - santaContainer.parentElement.getBoundingClientRect().left;
            currentDisplayPos = (currentLeftPx / parentWidth) * 100;

            // 關閉 CSS Transition，交給 JS 控制
            santaContainer.style.transition = 'none';
        }
        
        requestAnimationFrame(gameLoop);
    }

    // 3. 遊戲迴圈 (處理倒退與移動)
    function gameLoop() {
        // 倒退嚕 (摩擦力)
        if (bonusPercentage > 0.1) {
            bonusPercentage *= 0.95; 
        } else {
            bonusPercentage = 0;
        }

        // 目標位置
        const targetPos = basePercentage + bonusPercentage;

        // 平滑移動
        currentDisplayPos += (targetPos - currentDisplayPos) * 0.15;

        // 更新畫面
        if (santaContainer) {
            santaContainer.style.left = currentDisplayPos + "%";
        }
        
        // ★★★ 修改點 2：進度條寬度現在跟著 currentDisplayPos (聖誕老人) 一起變動 ★★★
        if (progressFill) {
            progressFill.style.width = currentDisplayPos + "%"; 
            progressFill.style.height = "100%"; 
        }

        requestAnimationFrame(gameLoop);
    }

   // 4. 點擊事件
    let bubbleTimeout; // 用來記錄氣泡的計時器

    if (santaContainer) {
        santaContainer.addEventListener('click', (e) => {
            e.preventDefault(); 

            if (!isPhysicsMode) {
                enablePhysicsMode();
            }

            // 加速邏輯
            bonusPercentage += 15; //每次加速距離
            if (basePercentage + bonusPercentage > 98) {
                bonusPercentage = 98 - basePercentage;
            }

            // A. 聖誕老人縮放動畫
            santaContainer.style.transform = "translateX(-50%) scale(1.2)";
            setTimeout(() => {
                santaContainer.style.transform = "translateX(-50%) scale(1)";
            }, 100);

            // B. 顯示氣泡文字邏輯
            const bubble = document.getElementById('speech-bubble');
            if (bubble) {
                // 顯示氣泡
                bubble.classList.add('show');
                
                // 隨機換台詞 (增加趣味性，選做)
                const messages = ["🎅: 趕路中！別催！", "🎅: 禮物要掉了啦！", "🎅: 衝啊！", "🦌: 腿好痠...", "🎅: Ho Ho Ho!"];
                // 每點 5 次才換一句，或是每次都換，這裡設為隨機
                if (Math.random() > 0.2) {
                   bubble.innerText = messages[Math.floor(Math.random() * messages.length)];
                } else {
                   bubble.innerText = "🎅: 趕路中！別催！"; // 預設台詞
                }

                // 清除之前的倒數計時 (如果玩家一直點，氣泡就一直亮著)
                clearTimeout(bubbleTimeout);
                
                // 設定 1.5 秒後消失
                bubbleTimeout = setTimeout(() => {
                    bubble.classList.remove('show');
                }, 1500);
            }
        });
    }
    
    // --- 初始化 ---
    // 先歸零
    if (santaContainer) santaContainer.style.left = "0%";
    
    // 延遲執行日期計算，確保 CSS Transition 有效
    setTimeout(() => {
        updateDateProgress();
    }, 100);

    // 定時更新
    setInterval(updateDateProgress, 60000);


    // ==========================================
    // 功能二：下雪特效
    // ==========================================
    function createSnowflake() {
        const snowContainer = document.getElementById('snow-container');
        if (!snowContainer) return;

        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        const size = Math.random() * 5 + 2; 
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.opacity = Math.random() * 0.5 + 0.3;
        
        const duration = Math.random() * 5 + 5; 
        snowflake.style.animationDuration = `${duration}s`;
        
        snowContainer.appendChild(snowflake);
        
        setTimeout(() => {
            snowflake.remove();
        }, duration * 1000);
    }
    setInterval(createSnowflake, 250);

});