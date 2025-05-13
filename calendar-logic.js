// calendar-logic.js

// This script assumes smokeLog, dailyCigaretteLimit, and dailyTotalVapeTimeLimit
// are available from the main smoke-tracker-script.js.
// We'll also need getDateStringFromTimestamp and formatTime.
// If they are not global, they'll need to be passed or exposed.

// For now, let's define copies here or assume they'll be exposed globally by the main script
// For a cleaner approach, the main script could expose an API or an object.

// Placeholder for data from main script - main script will need to populate these
let _smokeLogRef = [];
let _dailyCigaretteLimitRef = 0;
let _dailyTotalVapeTimeLimitRef = 0;
let _helpersRef = {
    getDateStringFromTimestamp: () => "1970-01-01",
    formatTime: () => "0m 0s",
    getCurrentDateString: () => "1970-01-01"
};


// Calendar State
let calendarCurrentDate = new Date();

// Element Selectors (these will be initialized by the main script)
let calendarLogContainerEl, calendarGridContainerEl, calendarMonthYearDisplayEl, toggleCalendarButtonEl;

function initializeCalendarLogic(config) {
    _smokeLogRef = config.smokeLog;
    _dailyCigaretteLimitRef = config.dailyCigaretteLimit;
    _dailyTotalVapeTimeLimitRef = config.dailyTotalVapeTimeLimit;
    if (config.helpers) { // Pass helper functions
        _helpersRef.getDateStringFromTimestamp = config.helpers.getDateStringFromTimestamp;
        _helpersRef.formatTime = config.helpers.formatTime;
        _helpersRef.getCurrentDateString = config.helpers.getCurrentDateString;
    }

    calendarLogContainerEl = config.elements.calendarLogContainer;
    calendarGridContainerEl = config.elements.calendarGridContainer;
    calendarMonthYearDisplayEl = config.elements.calendarMonthYearDisplay;
    toggleCalendarButtonEl = config.elements.toggleCalendarButton; // For updating button text

    // console.log("Calendar logic initialized with config:", config);
}


function aggregateDailyDataForMonthInternal(targetMonth, targetYear) {
    const dailyData = {};
    const firstDayOfMonth = new Date(targetYear, targetMonth, 1).getTime();
    const firstDayOfNextMonth = new Date(targetYear, targetMonth + 1, 1).getTime();

    _smokeLogRef.forEach(log => {
        if (log.timestamp >= firstDayOfMonth && log.timestamp < firstDayOfNextMonth) {
            const dateStr = _helpersRef.getDateStringFromTimestamp(log.timestamp);
            if (!dailyData[dateStr]) {
                dailyData[dateStr] = { cigarettes: 0, vapeTime: 0 };
            }
            if (log.type === 'cigarette') {
                dailyData[dateStr].cigarettes += (log.count || 1);
            } else if (log.type === 'vape' && log.duration) {
                dailyData[dateStr].vapeTime += log.duration;
            }
        }
    });
    return dailyData;
}

function styleCalendarDayInternal(dayCell, dateString, dailyAggregatedData) {
    dayCell.classList.remove('calendar-day-success', 'calendar-day-overlimit', 'calendar-day-nodata', 'today');
    const data = dailyAggregatedData[dateString];
    const todayDateString = _helpersRef.getCurrentDateString();

    if (dateString === todayDateString) {
        dayCell.classList.add('today');
    }

    if (data) {
        const cigsOver = _dailyCigaretteLimitRef > 0 && data.cigarettes > _dailyCigaretteLimitRef;
        const vapeOver = _dailyTotalVapeTimeLimitRef > 0 && data.vapeTime > _dailyTotalVapeTimeLimitRef;

        if (cigsOver || vapeOver) {
            dayCell.classList.add('calendar-day-overlimit');
            dayCell.title = `Over Limit! Cigs: ${data.cigarettes}/${_dailyCigaretteLimitRef > 0 ? _dailyCigaretteLimitRef : '∞'}, Vape: ${_helpersRef.formatTime(data.vapeTime)}/${_dailyTotalVapeTimeLimitRef > 0 ? _helpersRef.formatTime(_dailyTotalVapeTimeLimitRef) : '∞'}`;
        } else {
            dayCell.classList.add('calendar-day-success');
            dayCell.title = `Success! Cigs: ${data.cigarettes}/${_dailyCigaretteLimitRef > 0 ? _dailyCigaretteLimitRef : '∞'}, Vape: ${_helpersRef.formatTime(data.vapeTime)}/${_dailyTotalVapeTimeLimitRef > 0 ? _helpersRef.formatTime(_dailyTotalVapeTimeLimitRef) : '∞'}`;
        }
    } else {
        dayCell.classList.add('calendar-day-nodata');
        dayCell.title = dateString;
    }
}

function generateCalendarExternal(month, year) {
    if (!calendarGridContainerEl || !calendarMonthYearDisplayEl) {
        // console.error("Calendar elements not initialized for generateCalendarExternal");
        return;
    }

    calendarGridContainerEl.innerHTML = '';
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    calendarMonthYearDisplayEl.textContent = `${monthNames[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const aggregatedData = aggregateDailyDataForMonthInternal(month, year);

    const table = document.createElement('table');
    table.className = 'calendar-grid';
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    dayNames.forEach(dayName => {
        const th = document.createElement('th');
        th.textContent = dayName;
        headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = tbody.insertRow();
        for (let j = 0; j < 7; j++) {
            const cell = row.insertCell();
            cell.classList.add('calendar-day');
            if (i === 0 && j < firstDayOfMonth) {
                cell.classList.add('other-month');
            } else if (date > daysInMonth) {
                cell.classList.add('other-month');
            } else {
                const daySpan = document.createElement('span');
                daySpan.className = 'calendar-day-number';
                daySpan.textContent = date;
                cell.appendChild(daySpan);
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                cell.dataset.date = dateString;
                styleCalendarDayInternal(cell, dateString, aggregatedData);
                date++;
            }
        }
        if (date > daysInMonth) {
             const cells = Array.from(row.cells);
             if(cells.every(c => c.classList.contains('other-month'))) {
                 tbody.removeChild(row);
             }
            break;
        }
    }
    calendarGridContainerEl.appendChild(table);
}

function handleToggleCalendar() {
    if (!calendarLogContainerEl || !toggleCalendarButtonEl) return;
    const isVisible = calendarLogContainerEl.classList.toggle('show');
    if (isVisible) {
        generateCalendarExternal(calendarCurrentDate.getMonth(), calendarCurrentDate.getFullYear());
        toggleCalendarButtonEl.innerHTML = '<i class="fas fa-calendar-times"></i> HIDE CALENDAR';
    } else {
        toggleCalendarButtonEl.innerHTML = '<i class="fas fa-calendar-alt"></i> VIEW CALENDAR LOG';
    }
}

function handlePrevMonth() {
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
    generateCalendarExternal(calendarCurrentDate.getMonth(), calendarCurrentDate.getFullYear());
}

function handleNextMonth() {
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
    generateCalendarExternal(calendarCurrentDate.getMonth(), calendarCurrentDate.getFullYear());
}

// Expose functions to be called by the main script if needed, or rely on event listeners.
// For this approach, the main script will call initializeCalendarLogic and attach its own listeners.
