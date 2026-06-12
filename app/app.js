// Globals
let webData = null;
let chartInstance = null;

// Fetch and load data
async function loadDashboard() {
    try {
        const response = await fetch('data.json');
        webData = await response.json();
        
        // Update Latest Date Badge
        document.getElementById('latest-date-badge').innerText = `Latest Portfolio Date: ${webData.latest_date}`;
        
        // Update Model Metrics
        document.getElementById('metrics-mae').innerText = parseFloat(webData.model_metrics.MAE).toFixed(6);
        document.getElementById('metrics-r2').innerText = parseFloat(webData.model_metrics.R2).toFixed(6);
        document.getElementById('metrics-accuracy').innerText = webData.model_metrics.DirectionalAccuracy;
        
        // Update Holdings Table
        populateHoldingsTable(webData.latest_holdings);
        
        // Setup Slider & Buttons
        setupControls();
        
        // Initial Backtest Simulation with Aggressive Profile (80% weight)
        runSimulation(0.80, 'Aggressive');
        
    } catch (error) {
        console.error('Error loading web_data.json:', error);
        alert('Failed to load dashboard data. Ensure that you run the application via a local web server (e.g. VS Code Live Server or python -m http.server).');
    }
}

// Populate Stock Picks Table
function populateHoldingsTable(holdings) {
    const tbody = document.getElementById('holdings-table-body');
    tbody.innerHTML = '';
    
    holdings.forEach(stock => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="symbol-badge">${stock.Symbol}</span></td>
            <td style="color: #10b981; font-weight: 600;">+${(stock.Predicted_Return * 100).toFixed(3)}%</td>
            <td>₹${stock.Close.toFixed(2)}</td>
            <td>${stock.RSI.toFixed(1)}</td>
            <td>${(stock.Volatility * 100).toFixed(2)}%</td>
        `;
        tbody.appendChild(tr);
    });
}

// Recalculate portfolio metrics and update the chart
function runSimulation(equityWeight, profileName = 'Custom') {
    const dailyReturns = webData.daily_returns;
    const rDebt = 0.05 / 252; // Debt rate (5% annualized)
    
    let cumValues = [];
    let portfolioDailyReturns = [];
    let currVal = 1.0;
    
    for (let i = 0; i < dailyReturns.length; i++) {
        const row = dailyReturns[i];
        
        let txCost = 0.0;
        let equityReturn = 0.0;
        
        if (profileName === 'Conservative') {
            txCost = 0.0;
            equityReturn = row.passive_equity;
        } else if (profileName === 'Balanced') {
            txCost = row.bal_tx_cost;
            equityReturn = row.active_equity;
        } else if (profileName === 'Aggressive') {
            txCost = row.agg_tx_cost;
            equityReturn = row.active_equity;
        } else {
            // Interpolate active rebalance transaction cost based on custom weight
            // Standard rebalance drag is roughly proportional to the active weight
            txCost = row.agg_tx_cost * (equityWeight / 0.80);
            equityReturn = row.active_equity;
        }
        
        // Calculate daily portfolio return
        const pReturn = equityWeight * equityReturn + (1.0 - equityWeight) * rDebt - txCost;
        
        // Compound return
        currVal *= (1.0 + pReturn);
        
        // Capital preservation floor at 95% drawdown (portfolio value cannot drop below 0.05)
        if (currVal <= 0.05) {
            currVal = Math.max(currVal, 0.0);
            pReturn = 0.0;
        }
        
        cumValues.push(currVal);
        portfolioDailyReturns.push(pReturn);
        
        if (currVal === 0.0) {
            // Stays at 0 after bankruptcy
            for (let k = i + 1; k < dailyReturns.length; k++) {
                cumValues.push(0.0);
                portfolioDailyReturns.push(0.0);
            }
            break;
        }
    }
    
    // 1. CAGR (Annualized Return)
    const nDays = dailyReturns.length;
    const endVal = cumValues[cumValues.length - 1];
    const cagr = Math.pow(endVal / 1.0, 252 / nDays) - 1.0;
    
    // 2. Annualized Volatility
    const meanRet = portfolioDailyReturns.reduce((sum, r) => sum + r, 0) / portfolioDailyReturns.length;
    const variance = portfolioDailyReturns.reduce((sum, r) => sum + Math.pow(r - meanRet, 2), 0) / (portfolioDailyReturns.length - 1);
    const vol = Math.sqrt(variance) * Math.sqrt(252);
    
    // 3. Sharpe Ratio (assumed Risk-Free Rate = 5% annualized)
    const rf = 0.05;
    const sharpe = (cagr - rf) / (vol + 1e-9);
    
    // 4. Maximum Drawdown
    let runningMax = 0;
    let maxDrawdown = 0;
    for (let i = 0; i < cumValues.length; i++) {
        if (cumValues[i] > runningMax) {
            runningMax = cumValues[i];
        }
        const dd = (cumValues[i] - runningMax) / (runningMax + 1e-9);
        if (dd < maxDrawdown) {
            maxDrawdown = dd;
        }
    }
    
    // Update Stats UI
    updateStatsUI(cagr, vol, sharpe, maxDrawdown);
    
    // Render Chart
    updateChart(cumValues);
}

// Update UI Values
function updateStatsUI(cagr, vol, sharpe, maxDrawdown) {
    const cagrEl = document.getElementById('sim-cagr');
    cagrEl.innerText = `${(cagr * 100).toFixed(2)}%`;
    if (cagr >= 0.05) {
        cagrEl.className = 'result-val success-text';
    } else {
        cagrEl.className = 'result-val';
    }
    
    document.getElementById('sim-vol').innerText = `${(vol * 100).toFixed(2)}%`;
    document.getElementById('sim-sharpe').innerText = sharpe.toFixed(2);
    
    const ddEl = document.getElementById('sim-drawdown');
    ddEl.innerText = `${(maxDrawdown * 100).toFixed(2)}%`;
}

// Update Chart.js Plot
function updateChart(portfolioCumValues) {
    const dates = webData.chart_data.map(d => d.date);
    const niftyValues = webData.chart_data.map(d => d.NIFTY50);
    
    // Since chart_data is downsampled (every 3 days), we downsample the computed portfolioCumValues to match
    let portfolioChartValues = [];
    for (let i = 0; i < portfolioCumValues.length; i += 3) {
        portfolioChartValues.push(portfolioCumValues[i]);
    }
    // Make sure sizes match exactly
    portfolioChartValues = portfolioChartValues.slice(0, dates.length);
    
    if (chartInstance) {
        chartInstance.data.datasets[0].data = portfolioChartValues;
        chartInstance.update();
    } else {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Simulated Portfolio (Net of Fees)',
                        data: portfolioChartValues,
                        borderColor: '#38bdf8',
                        backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        borderWidth: 2.5,
                        pointRadius: 0,
                        fill: true,
                        tension: 0.1
                    },
                    {
                        label: 'NIFTY50 Passive Index',
                        data: niftyValues,
                        borderColor: '#9ca3af',
                        borderWidth: 1.5,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e5e7eb',
                            font: { family: 'Outfit', size: 12 }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.03)' },
                        ticks: { color: '#9ca3af', font: { family: 'Inter', size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.03)' },
                        ticks: { color: '#9ca3af', font: { family: 'Inter', size: 10 } }
                    }
                }
            }
        });
    }
}

// Setup Event Listeners
function setupControls() {
    const slider = document.getElementById('weight-equity-slider');
    const sliderVal = document.getElementById('weight-equity-val');
    
    const btnConservative = document.getElementById('btn-conservative');
    const btnBalanced = document.getElementById('btn-balanced');
    const btnAggressive = document.getElementById('btn-aggressive');
    
    // Slider Change
    slider.addEventListener('input', (e) => {
        const weight = parseInt(e.target.value) / 100.0;
        sliderVal.innerText = `${e.target.value}%`;
        
        // Deactivate all preset buttons
        btnConservative.classList.remove('active');
        btnBalanced.classList.remove('active');
        btnAggressive.classList.remove('active');
        
        runSimulation(weight, 'Custom');
    });
    
    // Preset buttons click
    btnConservative.addEventListener('click', () => {
        setActiveButton(btnConservative);
        slider.value = 20;
        sliderVal.innerText = '20%';
        runSimulation(0.20, 'Conservative');
    });
    
    btnBalanced.addEventListener('click', () => {
        setActiveButton(btnBalanced);
        slider.value = 50;
        sliderVal.innerText = '50%';
        runSimulation(0.50, 'Balanced');
    });
    
    btnAggressive.addEventListener('click', () => {
        setActiveButton(btnAggressive);
        slider.value = 80;
        sliderVal.innerText = '80%';
        runSimulation(0.80, 'Aggressive');
    });
}

function setActiveButton(activeBtn) {
    const btns = [document.getElementById('btn-conservative'), document.getElementById('btn-balanced'), document.getElementById('btn-aggressive')];
    btns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Start
document.addEventListener('DOMContentLoaded', loadDashboard);
