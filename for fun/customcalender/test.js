function initializeCalendar() {
    let date = new Date();
    createControls();
    CreateCalenderCells(date.getDate(), date.getMonth(), date.getFullYear());
}
function createControls() {
    const inputMonth = createMonthInput(currentDate);
    const prevMonthButton = createMonthButton('<', -1, inputMonth);
    const nextMonthButton = createMonthButton('>', 1, inputMonth);

    controlDiv.append(prevMonthButton, inputMonth, nextMonthButton);
}
function createMonthInput(date) {
    const input = document.createElement('input');
    input.type = 'month';
    input.id = 'inputMonth';
    input.className = 'inputMonth';
    input.value = formatDateToMonthInputValue(date);
    input.addEventListener('change', () => updateCalendar(new Date(input.value)));
    return input;
}
function createMonthButton(text, monthChange, inputMonth) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', () => {
        currentDate.setDate(1);
        currentDate.setMonth(currentDate.getMonth() + monthChange);
        inputMonth.value = formatDateToMonthInputValue(currentDate);
        updateCalendar(currentDate);
    });
    return button;
}
function formatDateToMonthInputValue(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
}
function ClearTable(){
    calendarDiv.innerHTML = '';
}
function SetCellData(cell,innerHTML, data, className, year, month){
    cell.innerHTML = innerHTML;
    cell.setAttribute('data', data);
    cell.classList.add(className);
    cell.setAttribute('data-date', new Date(year, month, cell.innerHTML).toISOString());
}
function CreateCalenderCells(day, month, year) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    ClearTable();
    for(let i = 0; i < 7; i++){
        let cell = document.createElement('div');
        cell.setAttribute('class', 'Headers');
        cell.innerHTML = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
        calendarDiv.appendChild(cell);
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
                SetCellData(cell, daysInPrevMonth - firstDayOfMonth + j + 1, 'prevMonth', 'prevMonth', year, month - 1);
            } else if(cellDate > daysInMonth){
                cellDateValue = new Date(year, month + 1, nextMonthDay);
                SetCellData(cell, nextMonthDay++, 'nextMonth', 'nextMonth', year, month + 1);
            } else {
                cellDateValue = new Date(year, month, cellDate);
                SetCellData(cell, cellDate++, 'currentMonth', 'currentMonth', year, month);
            }
            if(cellDateValue < today && lockPastDates){
                cell.classList.add('unclickable');
            } else {
                cell.addEventListener('click', (e) => {
                    onCellClick(e);
                });
            }
            calendarDiv.appendChild(cell);
        }
        if(cellDate > daysInMonth) break;
    }
    addPreviewSelectListeners();
}
function onCellClick(cell){
    const clickedDate = new Date(cell.target.getAttribute('data-date'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate < today && lockPastDates) return;

    if (!selectedFromDate || (selectedFromDate && selectedToDate)) {
        selectedFromDate = clickedDate;
        selectedToDate = null;
    } else if (clickedDate < selectedFromDate) {
        selectedToDate = selectedFromDate;
        selectedFromDate = clickedDate;
    } else {
         selectedToDate = clickedDate;
    }

    highlightDates();
}
function highlightDates(previewEndDate = null) {
    document.querySelectorAll('.cell').forEach(cell => {
        const cellDate = new Date(cell.getAttribute('data-date'));
        cell.classList.remove('selected', 'range');
        if (selectedFromDate && cellDate.getTime() === selectedFromDate.getTime())
            cell.classList.add('selected'); 
        else if (selectedToDate && cellDate.getTime() === selectedToDate.getTime()) 
            cell.classList.add('selected');
        else {
            let startDate = selectedFromDate;
            let endDate = selectedToDate || previewEndDate;
            if (startDate && endDate && startDate > endDate)
                [startDate, endDate] = [endDate, startDate]; 
            if (startDate && endDate && cellDate > startDate && cellDate < endDate)
                cell.classList.add('range'); 
        }
    });
}
function addPreviewSelectListeners() {
    if(!showPreview) return;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('mouseover', function() {
            if (selectedFromDate && !selectedToDate) { 
                const previewEndDate = new Date(cell.getAttribute('data-date'));
                highlightDates(previewEndDate);
            }
        });
    });
}
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', function() {
        const clickedDate = new Date(cell.getAttribute('data-date'));
        if (!selectedFromDate || (selectedFromDate && selectedToDate)) {
            selectedFromDate = clickedDate;
            selectedToDate = null; 
            addPreviewSelectListeners(); 
        } else if (selectedFromDate && !selectedToDate) {
            selectedToDate = clickedDate;
        }
        highlightDates();
    });
});

function updateCalendar(date){
    currentDate = date;
    CreateCalenderCells(date.getDate(), date.getMonth(), date.getFullYear());
    highlightDates();
}

initializeCalendar();