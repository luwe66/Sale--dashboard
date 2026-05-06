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
document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        if (!page) return;

        // 更新所有 nav-item active 状态
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        // Report 展开/收起子菜单
        const navSubmenu = document.querySelector('.nav-submenu');
        if (page === 'report') {
            navSubmenu.style.display = 'flex';
        } else {
            navSubmenu.style.display = 'none';
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
            labels: ['Jan 2018', 'Jan 2019', 'Jan 2020', 'Jan 2021', 'Jan 2022', 'Jan 2023'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [8000, 12000, 10000, 15124, 11000, 9000],
                    borderColor: COLORS.lineBlack,
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    pointRadius: 3,
                    borderWidth: 2
                },
                {
                    label: 'Order',
                    data: [6000, 7000, 11000, 8000, 13000, 7000],
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
                    max: 20000,
                    grid: { color: COLORS.gridLine },
                    border: { color: COLORS.axisLine },
                    ticks: { callback: v => v / 1000 + 'K', color: COLORS.textMuted, font: { size: 12 } }
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
            labels: ['Call', 'Preparation', 'Email', 'Lead/research', 'Other'],
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
                }
            },
            cutout: '65%'
        }
    });

    // Top Companies horizontal bar
    new Chart(document.getElementById('topCompaniesChart'), {
        type: 'bar',
        data: {
            labels: ['Accinov', 'Nothmore', 'Camilla', 'Berthe', 'Monica'],
            datasets: [
                { label: 'Completed', data: [16, 14, 11, 8, 7], backgroundColor: '#4ECDC4' },
                { label: 'Waiting',   data: [1, 1, 1, 0.5, 0.5], backgroundColor: '#FFE66D' },
                { label: 'In Progress', data: [1, 1, 0.5, 0.5, 0.5], backgroundColor: '#A8DADC' },
                { label: 'Not Started', data: [1, 1, 0.5, 0.5, 0], backgroundColor: '#FF6B6B' }
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
                x: { stacked: true, max: 20, grid: { color: COLORS.gridLine }, ticks: { color: COLORS.textMuted, font: { size: 12 } } },
                y: { stacked: true, grid: { display: false }, ticks: { color: COLORS.textMuted, font: { size: 12 } } }
            }
        }
    });
}

// Report Charts
function initReportCharts() {
    if (window._reportInit) return;
    window._reportInit = true;

    // Targets horizontal bar
    new Chart(document.getElementById('targetsChart'), {
        type: 'bar',
        data: {
            labels: ['Anthony', 'Harry', 'Tommy', 'Bertha', 'Monica'],
            datasets: [
                { label: 'Archived Targets',  data: [25, 22, 28, 19, 27], backgroundColor: COLORS.barBlue },
                { label: 'Remaining Targets', data: [25, 28, 22, 31, 23], backgroundColor: COLORS.barOrange }
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
                x: { stacked: true, max: 50, grid: { color: COLORS.gridLine }, ticks: { color: COLORS.textMuted, font: { size: 12 } } },
                y: { stacked: true, grid: { display: false }, ticks: { color: COLORS.textMuted, font: { size: 12 } } }
            }
        }
    });

    // Sales Performance line
    new Chart(document.getElementById('performanceChart'), {
        type: 'line',
        data: {
            labels: ['Jan 2018', 'Jan 2019', 'Jan 2020', 'Jan 2021', 'Jan 2022', 'Jan 2023'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [5000, 10000, 13000, 15124, 10000, 7000],
                    borderColor: COLORS.lineBlack,
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    pointRadius: 3,
                    borderWidth: 2
                },
                {
                    label: 'Order',
                    data: [4000, 7000, 9000, 7000, 11000, 6000],
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
                    max: 20000,
                    grid: { color: COLORS.gridLine },
                    ticks: { callback: v => v / 1000 + 'K', color: COLORS.textMuted, font: { size: 12 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: COLORS.textMuted, font: { size: 12 } }
                }
            }
        }
    });

    // New Deals bar
    new Chart(document.getElementById('newDealsChart'), {
        type: 'bar',
        data: {
            labels: ['Jan','Feb','Mar','Apl','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [{
                data: [2, 4, 5, 4, 9, 11, 14, 12, 16, 5, 7, 5],
                backgroundColor: COLORS.lineBlack,
                borderRadius: 0
            }]
        },
        options: {
            ...chartDefaults,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20,
                    grid: { color: COLORS.gridLine },
                    ticks: { stepSize: 5, color: COLORS.textMuted, font: { size: 12 } }
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
