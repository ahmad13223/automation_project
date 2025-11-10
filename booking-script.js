// Booking Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Calendar functionality
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    let selectedDate = null;
    let selectedTime = null;
    
    // Calendar elements
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarDaysElement = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    // Time slot elements
    const timeSlots = document.querySelectorAll('.time-slot');
    
    // Form elements
    const appointmentForm = document.getElementById('appointmentForm');
    const confirmBtn = document.querySelector('.confirm-btn');
    
    // Initialize calendar
    function initCalendar() {
        updateCalendarHeader();
        generateCalendarDays();
    }
    
    // Update calendar header
    function updateCalendarHeader() {
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    // Generate calendar days
    function generateCalendarDays() {
        calendarDaysElement.innerHTML = '';
        
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = createDayElement(daysInPrevMonth - i, true, false);
            calendarDaysElement.appendChild(dayElement);
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = (currentYear === currentDate.getFullYear() && 
                           currentMonth === currentDate.getMonth() && 
                           day === currentDate.getDate());
            
            const isPast = new Date(currentYear, currentMonth, day) < new Date().setHours(0, 0, 0, 0);
            const dayElement = createDayElement(day, false, isToday, isPast);
            calendarDaysElement.appendChild(dayElement);
        }
        
        // Next month days to fill the grid
        const totalCells = calendarDaysElement.children.length;
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = createDayElement(day, true, false);
            calendarDaysElement.appendChild(dayElement);
        }
    }
    
    // Create day element
    function createDayElement(day, isOtherMonth, isToday, isPast = false) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        } else {
            if (isToday) {
                dayElement.classList.add('today');
            }
            if (isPast) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.addEventListener('click', () => selectDate(currentYear, currentMonth, day, dayElement));
            }
        }
        
        return dayElement;
    }
    
    // Select date
    function selectDate(year, month, day, element) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Add selection to clicked day
        element.classList.add('selected');
        
        selectedDate = new Date(year, month, day);
        updateConfirmButton();
        
        // Update available time slots based on selected date
        updateTimeSlots();
    }
    
    // Update time slots availability
    function updateTimeSlots() {
        if (!selectedDate) return;
        
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();
        const currentHour = today.getHours();
        
        timeSlots.forEach(slot => {
            const timeText = slot.getAttribute('data-time');
            const hour = parseInt(timeText.split(':')[0]);
            const isPM = timeText.includes('PM');
            const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
            
            // Disable past time slots for today
            if (isToday && hour24 <= currentHour) {
                slot.classList.add('disabled');
                slot.disabled = true;
            } else {
                slot.classList.remove('disabled');
                slot.disabled = false;
            }
        });
    }
    
    // Calendar navigation
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendarDays();
        updateCalendarHeader();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendarDays();
        updateCalendarHeader();
    });
    
    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            if (slot.disabled || slot.classList.contains('disabled')) return;
            
            // Remove previous selection
            timeSlots.forEach(s => s.classList.remove('selected'));
            
            // Add selection to clicked slot
            slot.classList.add('selected');
            selectedTime = slot.getAttribute('data-time');
            updateConfirmButton();
        });
    });
    
    // Update confirm button state
    function updateConfirmButton() {
        const fullName = document.getElementById('fullName').value.trim();
        const service = document.getElementById('service').value;
        
        if (fullName && service && selectedDate && selectedTime) {
            confirmBtn.disabled = false;
        } else {
            confirmBtn.disabled = true;
        }
    }
    
    // Form validation
    document.getElementById('fullName').addEventListener('input', updateConfirmButton);
    document.getElementById('service').addEventListener('change', updateConfirmButton);
    
    // Form submission
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedDate || !selectedTime) {
            showMessage('Please select a date and time for your appointment.', 'error');
            return;
        }
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            date: selectedDate.toLocaleDateString(),
            time: selectedTime
        };
        
        // Here you would typically send the data to your server
        console.log('Appointment Data:', formData);
        
        // Show success message
        showMessage(`Appointment confirmed for ${formData.fullName} on ${formData.date} at ${formData.time}`, 'success');
        
        // Reset form after successful submission
        setTimeout(() => {
            resetForm();
        }, 3000);
    });
    
    // Show message function
    function showMessage(message, type) {
        // Remove existing messages
        document.querySelectorAll('.success-message, .error-message').forEach(el => el.remove());
        
        const messageElement = document.createElement('div');
        messageElement.className = type === 'success' ? 'success-message' : 'error-message';
        messageElement.textContent = message;
        
        appointmentForm.appendChild(messageElement);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    // Reset form
    function resetForm() {
        appointmentForm.reset();
        selectedDate = null;
        selectedTime = null;
        
        // Remove selections
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });
        timeSlots.forEach(slot => slot.classList.remove('selected'));
        
        confirmBtn.disabled = true;
        
        // Remove messages
        document.querySelectorAll('.success-message, .error-message').forEach(el => el.remove());
    }
    
    // Initialize calendar on page load
    initCalendar();
    updateConfirmButton();
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                // Handle anchor links within the same page
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
