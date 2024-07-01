function CustomDatePicker(calendarId, controlsId, options = {}) {
    this.calendarDiv = document.getElementById(calendarId);
    this.controlDiv = document.getElementById(controlsId);
    this.currentDate = new Date();
    this.isSelecting = false;
    this.selectedFromDate = null;
    this.selectedToDate = null;

    this.showPreview = options.showPreview !== undefined ? options.showPreview : true;

    this.lockPastDates = options.lockPastDates !== undefined ? options.lockPastDates : true;
    this.lockFutureDates = options.lockFutureDates !== undefined ? options.lockFutureDates : false;
    this.disabledDates = options.disabledDates || [];

    this.lockFromDate = new Date(options.lockFromDate) || false;
    this.lockToDate = new Date(options.lockToDate) || false;

    // variable name for lock after x days
    this.lockAfterDays = options.lockAfterDays - 1 || -1;
    this.lockBeforeDays = options.lockBeforeDays || -1;

    this.css = options.css || [];

    this.disableWeekends = options.disableWeekends || false;

    this.daysBeforeLock= -1;

    this.DisableWeekends = function() {
        if (!this.disableWeekends) return;
        this.disabledDates = this.disabledDates.concat(
            Array.from({ length: 12 }, (_, month) => {
                const dates = [];
                const date = new Date(this.currentDate.getFullYear(), month, 1);
                while (date.getMonth() === month) {
                    const dayOfWeek = date.getDay();
                    if (dayOfWeek === 1 || dayOfWeek === 0) { // 0 = Sunday, 6 = Saturday
                        // Format the date as 'yyyy-mm-dd'
                        const formattedDate = date.toISOString().split('T')[0];
                        dates.push(formattedDate);
                    }
                    date.setDate(date.getDate() + 1);
                }
                return dates;
            }).flat()
        );
        this.updateCalendar(this.currentDate);
    }

    this.setShowPreview = function(showPreview) {
        this.showPreview = showPreview;
        this.updateCalendar(this.currentDate);
    }

    this.setLockPastDates = function(lockPastDates) {
        this.lockPastDates = lockPastDates;
        this.updateCalendar(this.currentDate);
    }

    this.setLockFutureDates = function(lockFutureDates) {
        this.lockFutureDates = lockFutureDates;
        this.updateCalendar(this.currentDate);
    }

    this.setDisabledDates = function(disabledDates) {
        this.disabledDates = disabledDates;
        this.updateCalendar(this.currentDate);
    }
    
    this.setLockFromDate = function(lockFromDate) {
        this.lockFromDate = lockFromDate;
        this.updateCalendar(this.currentDate);
    }

    this.setLockToDate = function(lockToDate) {
        this.lockToDate = lockToDate;
        this.updateCalendar(this.currentDate);
    }

    this.setDisableWeekends = function(disableWeekends) {
        this.disableWeekends = disableWeekends;
        this.DisableWeekends();
    }

    this.setLockAfterDays = function(lockAfterDays) {
        this.lockAfterDays = lockAfterDays;
        this.updateCalendar(this.currentDate);
    }

    this.setLockBeforeDays = function(lockBeforeDays) {
        this.lockBeforeDays = lockBeforeDays;
        this.updateCalendar(this.currentDate);
    }

    this.updateOptions = function(options) {
        this.setShowPreview(options.showPreview !== undefined ? options.showPreview : this.showPreview);
        this.setLockPastDates(options.lockPastDates !== undefined ? options.lockPastDates : this.lockPastDates);
        this.setLockFutureDates(options.lockFutureDates !== undefined ? options.lockFutureDates : this.lockFutureDates);
        this.setDisabledDates(options.disabledDates || this.disabledDates);
        this.setLockFromDate(options.lockFromDate || this.lockFromDate);
        this.setLockToDate(options.lockToDate || this.lockToDate);
        this.setDisableWeekends(options.disableWeekends || this.disableWeekends);
        this.setLockAfterDays(options.lockAfterDays || this.lockAfterDays);
        this.setLockBeforeDays(options.lockBeforeDays || this.lockBeforeDays);
    }


    this.loadCSS = function() {
        this.css.forEach(css => {
            const link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = css;
            document.head.appendChild(link);
        });
    }

    this.initializeCalendar = function() {
        this.loadCSS();
        this.DisableWeekends();
        this.createControls();
        this.createCalendarCells(this.currentDate.getDate(), this.currentDate.getMonth(), this.currentDate.getFullYear());
    }

    this.isDateDisabled = function(date) {

        return this.disabledDates.some(disabled => {
            if (typeof disabled === 'string') {
                return new Date(disabled).toDateString() === date.toDateString();
            } else if (disabled.from && disabled.to) {
                const fromDate = new Date(disabled.from);
                const toDate = new Date(disabled.to);
                return date >= fromDate && date <= toDate;
            }
            return false;
        });
    };

    this.createControls = function() {
        const inputMonth = this.createMonthInput(this.currentDate);
        const prevMonthButton = this.createMonthButton('<', -1, inputMonth);
        const nextMonthButton = this.createMonthButton('>', 1, inputMonth);

        this.controlDiv.append(prevMonthButton, inputMonth, nextMonthButton);
    }

    this.createMonthInput = function(date) {
        const input = document.createElement('input');
        input.type = 'month';
        input.id = 'inputMonth';
        input.className = 'inputMonth';
        input.value = this.formatDateToMonthInputValue(date);
        input.addEventListener('change', () => this.updateCalendar(new Date(input.value)));
        return input;
    }

    this.createMonthButton = function(text, monthChange, inputMonth) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', () => {
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() + monthChange);
            inputMonth.value = this.formatDateToMonthInputValue(this.currentDate);
            this.updateCalendar(this.currentDate);
        });
        return button;
    }

    this.formatDateToMonthInputValue = function(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
    }

    this.clearTable = function() {
        this.calendarDiv.innerHTML = '';
    }

    this.setCellData = function(cell, innerHTML, data, className, year, month) {
        cell.innerHTML = innerHTML;
        cell.setAttribute('data', data);
        cell.classList.add(className);
        cell.setAttribute('data-date', new Date(year, month, cell.innerHTML).toISOString());
    }

    this.createCalendarCells = function(day, month, year) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.clearTable();
        for(let i = 0; i < 7; i++){
            let cell = document.createElement('div');
            cell.setAttribute('class', 'Headers');
            cell.innerHTML = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
            this.calendarDiv.appendChild(cell);
        }
    
        let firstDayOfMonth = new Date(year, month, 1).getDay();
        firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let daysInPrevMonth = new Date(year, month, 0).getDate();
        let nextMonthDay = 1;
        let cellDate = 1;
    
        for(let i = 0; i < 6; i++){
            for(let j = 0; j < 7; j++){ 
                let cell = document.createElement('div');
                cell.classList.add('cell');
    
                let cellDateValue;
    
                if(i === 0 && j < firstDayOfMonth){
                    cellDateValue = new Date(year, month - 1, daysInPrevMonth - firstDayOfMonth + j + 1);
                    this.setCellData(cell, daysInPrevMonth - firstDayOfMonth + j + 1, 'prevMonth', 'prevMonth', year, month - 1);
                } else if(cellDate > daysInMonth){
                    cellDateValue = new Date(year, month + 1, nextMonthDay);
                    this.setCellData(cell, nextMonthDay++, 'nextMonth', 'nextMonth', year, month + 1);
                } else {
                    cellDateValue = new Date(year, month, cellDate);
                    this.setCellData(cell, cellDate++, 'currentMonth', 'currentMonth', year, month);
                }
                if(this.isDateDisabled(cellDateValue))
                    cell.classList.add('disabled');
                else if(cellDateValue < today && this.lockPastDates)
                    cell.classList.add('unclickable');
                else if (cellDateValue > today && this.lockFutureDates)
                    cell.classList.add('unclickable');
                else if (this.lockFromDate < cellDateValue) 
                    cell.classList.add('unclickable');
                else if (this.lockToDate > cellDateValue)
                    cell.classList.add('unclickable');
                else
                    cell.addEventListener('click', (e) => {this.onCellClick(e);});
                
                this.calendarDiv.appendChild(cell);
            }
            if(cellDate > daysInMonth) break;
        }
        this.addPreviewSelectListeners();
    }

    this.onCellClick = function(cell){
        const clickedDate = new Date(cell.target.getAttribute('data-date'));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        if (clickedDate < today && this.lockPastDates || clickedDate > today && this.lockFutureDates) return;

        if (!this.selectedFromDate || (this.selectedFromDate && this.selectedToDate)) {
            this.selectedFromDate = clickedDate;
            this.selectedToDate = null;
        } else if (clickedDate < this.selectedFromDate) {
            this.selectedToDate = this.selectedFromDate;
            this.selectedFromDate = clickedDate;
        } else
            this.selectedToDate = clickedDate;
    
        this.highlightDates();
    }

    this.highlightDates = function(previewEndDate = null) {
        document.querySelectorAll('.cell').forEach(cell => {
            const cellDate = new Date(cell.getAttribute('data-date'));
            cell.classList.remove('selected', 'range');
            if (this.selectedFromDate && cellDate.getTime() === this.selectedFromDate.getTime())
                cell.classList.add('selected'); 
            else if (this.selectedToDate && cellDate.getTime() === this.selectedToDate.getTime()) 
                cell.classList.add('selected');
            else {
                let startDate = this.selectedFromDate;
                let endDate = this.selectedToDate || previewEndDate;
                if (startDate && endDate && startDate > endDate)
                    [startDate, endDate] = [endDate, startDate]; 
                if (startDate && endDate && cellDate > startDate && cellDate < endDate)
                    cell.classList.add('range'); 
            }
        });
    }

    this.addPreviewSelectListeners = function() {
        if(!this.showPreview) return;
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('mouseover', (event) => {
                if (this.selectedFromDate && !this.selectedToDate) { 
                    const previewEndDate = new Date(event.target.getAttribute('data-date'));
                    this.highlightDates(previewEndDate);
                }
            });
        });
    }

    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', function() {
            const clickedDate = new Date(cell.getAttribute('data-date'));
            if (!selectedFromDate || (selectedFromDate && selectedToDate)) {
                this.selectedFromDate = clickedDate;
                this.selectedToDate = null; 
                this.addPreviewSelectListeners(); 
            } else if (this.selectedFromDate && !this.selectedToDate) this.selectedToDate = clickedDate;
            this.highlightDates();
        });
    });

    this.updateCalendar = function(date){
        this.currentDate = date;
        this.createCalendarCells(date.getDate(), date.getMonth(), date.getFullYear());
        this.highlightDates();
    }

    this.initializeCalendar();

    this.calculateActiveDays = function(selectedFromDate, selectedToDate, disabledDates) {
        let activeDays = 0;
        let currentDate = new Date(selectedFromDate);
    
        while (currentDate <= selectedToDate) {
            let isDisabled = false;
            const formattedCurrentDate = currentDate.toISOString().split('T')[0];
    
            for (let disabledDate of disabledDates) {
                if (typeof disabledDate === 'string')
                    if (disabledDate === formattedCurrentDate) {
                        isDisabled = true;
                        break;
                    }
                else if (disabledDate.from && disabledDate.to) {
                    const fromDate = new Date(disabledDate.from);
                    const toDate = new Date(disabledDate.to);
                    if (currentDate >= fromDate && currentDate <= toDate) {
                        isDisabled = true;
                        break;
                    }
                }
            }
            if (!isDisabled) activeDays++;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return activeDays;
    }

    this.getSelectedDates = function(){
        if (this.selectedFromDate && this.selectedToDate)
            return {
                from: this.selectedFromDate.toISOString().split('T')[0],
                to: this.selectedToDate.toISOString().split('T')[0],
                days: this.calculateActiveDays(this.selectedFromDate, this.selectedToDate, this.disabledDates)
            };
         else if (this.selectedFromDate)
            return this.selectedFromDate.toISOString().split('T')[0];
        else
            return null;
    }
}