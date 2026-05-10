// Sales Activity 百分比标注插件（需在图表初始化前注册）
const doughnutLabelPlugin = {
    id: 'doughnutOuterLabels',
    afterDraw(chart) {
        if (chart.canvas.id !== 'salesActivityChart') return;
        const { ctx, data } = chart;
        const dataset = data.datasets[0];
        const total = dataset.data.reduce((a, b) => a + b, 0);
        const meta = chart.getDatasetMeta(0);
        meta.data.forEach((arc, i) => {
            const pct = Math.round(dataset.data[i] / total * 100);
            if (pct < 8) return;
            const angle = (arc.startAngle + arc.endAngle) / 2;
            const outerR = arc.outerRadius + 18;
            const x = arc.x + Math.cos(angle) * outerR;
            const y = arc.y + Math.sin(angle) * outerR;
            ctx.save();
            ctx.font = '600 12px PingFang SC, sans-serif';
            ctx.fillStyle = 'rgba(0,0,0,0.9)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pct + '%', x, y);
            ctx.restore();
        });
    }
};
Chart.register(doughnutLabelPlugin);

// Colors from Figma
const COLORS = {
    sidebar: '#1f1f1f',
    bg: '#ebebeb',
    card: '#ffffff',
    barBlue: '#8de3f5',
    barOrange: '#fab86a',
    lineBlack: '#15161b',
    lineGreen: '#87db1c',
    textPrimary: 'rgba(0,0,0,0.9)',
    textSecondary: 'rgba(0,0,0,0.6)',
    textMuted: 'rgba(0,0,0,0.4)',
    gridLine: 'rgba(24,24,24,0.1)',
    axisLine: 'rgba(24,24,24,0.25)',
};

const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    }
};

// Nav
function setNavIcon(item, isActive) {
    const img = item.querySelector('.icon img');
    if (!img) return;
    const lineSrc = item.getAttribute('data-icon-line');
    const fillSrc = item.getAttribute('data-icon-fill');
    if (isActive && fillSrc) {
        img.src = fillSrc;
    } else if (lineSrc) {
        img.src = lineSrc;
    }
}

document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        if (!page) return;

        // 所有 nav-item 恢复 line 图标
        document.querySelectorAll('.nav-item').forEach(n => {
            n.classList.remove('active');
            setNavIcon(n, false);
        });

        // 当前项设为 active，切换 fill 图标
        item.classList.add('active');
        setNavIcon(item, true);

        // Report group 展开/收起
        const reportGroup = document.getElementById('report-group');
        const navSubmenu = document.querySelector('.nav-submenu');
        const navArrow = document.querySelector('.nav-arrow');

        if (page === 'report') {
            reportGroup.classList.add('open');
            navSubmenu.style.display = 'flex';
            if (navArrow) navArrow.style.transform = 'rotate(180deg)';
        } else {
            reportGroup.classList.remove('open');
            navSubmenu.style.display = 'none';
            if (navArrow) navArrow.style.transform = 'rotate(0deg)';
        }

        // 切换页面
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(`${page}-page`);
        if (target) {
            target.classList.add('active');
            if (page === 'report') initReportCharts();
            if (page === 'dashboard') initDashboardCharts();
        }
    });
});

// Dashboard Charts
function initDashboardCharts() {
    if (window._dashboardInit) return;
    window._dashboardInit = true;

    // Total Sales
    new Chart(document.getElementById('totalSalesChart'), {
        type: 'line',
        data: {
            labels: ['2014年', '2015年', '2016年', '2017年'],
            datasets: [
                {
                    label: '营收',
                    data: [484247, 470533, 609206, 733215],
                    borderColor: COLORS.lineBlack,
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    pointRadius: 3,
                    borderWidth: 2
                },
                {
                    label: '利润',
                    data: [49544, 61619, 81795, 93439],
                    borderColor: COLORS.lineGreen,
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    pointRadius: 3,
                    borderWidth: 2
                }
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { size: 12 }, color: COLORS.textSecondary }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: COLORS.gridLine },
                    border: { color: COLORS.axisLine },
                    ticks: { callback: v => '$' + (v/1000).toFixed(0) + 'K', color: COLORS.textMuted, font: { size: 12 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: COLORS.textMuted, font: { size: 12 } }
                }
            }
        }
    });

    // Sales Activity Doughnut
    new Chart(document.getElementById('salesActivityChart'), {
        type: 'doughnut',
        data: {
            labels: ['电话', '准备', '邮件', '线索/调研', '其他'],
            datasets: [{
                data: [35, 10, 8, 22, 25],
                backgroundColor: ['#4ECDC4', '#FFE66D', '#A8DADC', '#95E1D3', '#2C3E50'],
                borderWidth: 0
            }]
        },
        options: {
            ...chartDefaults,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { boxWidth: 10, font: { size: 12 }, color: COLORS.textSecondary }
                },
                tooltip: { enabled: true },
                datalabels: {
                    display: false
                }
            },
            cutout: '65%'
        }
    });

    // Top Companies horizontal bar
    new Chart(document.getElementById('topCompaniesChart'), {
        type: 'bar',
        data: {
            labels: ['Sean Miller', 'Tamara Chand', 'Raymond Buch', 'Tom Ashbrook', 'Adrian Barton'],
            datasets: [
                { label: '科技',     data: [15026, 11435, 9070, 8758, 8684], backgroundColor: '#8de3f5' },
                { label: '家具',     data: [6234, 5231, 4231, 3921, 3876], backgroundColor: '#a5f6c6' },
                { label: '办公用品', data: [3783, 2386, 1816, 1917, 1914], backgroundColor: '#c4c6fa' }
            ]
        },
        options: {
            indexAxis: 'y',
            ...chartDefaults,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { boxWidth: 10, font: { size: 12 }, color: COLORS.textSecondary }
                }
            },
            scales: {
                x: { stacked: true, grid: { color: COLORS.gridLine }, ticks: { callback: v => '$' + (v/1000).toFixed(0) + 'K', color: COLORS.textMuted, font: { size: 12 } } },
                y: { stacked: true, grid: { display: false }, ticks: { color: COLORS.textMuted, font: { size: 12 } } }
            }
        }
    });
}

// Report Charts
function initReportCharts() {
    if (window._reportInit) return;
    window._reportInit = true;

    // Targets horizontal bar — 按类别销售额 vs 利润
    new Chart(document.getElementById('targetsChart'), {
        type: 'bar',
        data: {
            labels: ['科技', '家具', '办公用品'],
            datasets: [
                { label: '销售额',  data: [836154, 742000, 719047], backgroundColor: COLORS.barBlue },
                { label: '利润', data: [145455, 18451, 122491], backgroundColor: COLORS.barOrange }
            ]
        },
        options: {
            indexAxis: 'y',
            ...chartDefaults,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { boxWidth: 10, font: { size: 12 }, color: COLORS.textSecondary }
                }
            },
            scales: {
                x: {
                    stacked: false,
                    grid: { color: COLORS.gridLine },
                    ticks: { callback: v => '$' + (v/1000).toFixed(0) + 'K', color: COLORS.textMuted, font: { size: 12 } }
                },
                y: { stacked: false, grid: { display: false }, ticks: { color: COLORS.textMuted, font: { size: 12 } } }
            }
        }
    });

    // Sales Performance line
    new Chart(document.getElementById('performanceChart'), {
        type: 'line',
        data: {
            labels: ['2014年', '2015年', '2016年', '2017年'],
            datasets: [
                {
                    label: '营收',
                    data: [484247, 470533, 609206, 733215],
                    borderColor: COLORS.lineBlack,
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    pointRadius: 3,
                    borderWidth: 2
                },
                {
                    label: '利润',
                    data: [49544, 61619, 81795, 93439],
                    borderColor: COLORS.lineGreen,
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    pointRadius: 3,
                    borderWidth: 2
                }
            ]
        },
        options: {
            ...chartDefaults,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { size: 12 }, color: COLORS.textSecondary }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: COLORS.gridLine },
                    ticks: { callback: v => '$' + (v/1000).toFixed(0) + 'K', color: COLORS.textMuted, font: { size: 12 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: COLORS.textMuted, font: { size: 12 } }
                }
            }
        }
    });

    // New Deals bar — 2017年各月订单数
    new Chart(document.getElementById('newDealsChart'), {
        type: 'bar',
        data: {
            labels: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            datasets: [{
                data: [69, 53, 118, 116, 118, 133, 111, 111, 226, 147, 261, 224],
                backgroundColor: COLORS.lineBlack,
                borderRadius: 0
            }]
        },
        options: {
            ...chartDefaults,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: COLORS.gridLine },
                    ticks: { stepSize: 50, color: COLORS.textMuted, font: { size: 12 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: COLORS.textMuted, font: { size: 12 } }
                }
            }
        }
    });
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
    initReportCharts();
});
