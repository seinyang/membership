!function($) {
    "use strict";

    var CalendarApp = function() {
        this.$body = $("body");
        this.$modal = $('#event-modal');
        this.$event = $('#external-events div.external-event');
        this.$calendar = $('#calendar');
        this.$saveCategoryBtn = $('.save-category');
        this.$categoryForm = $('#add-category form');
        this.$extEvents = $('#external-events');
        this.$calendarObj = null;

        // Save Events to Local Storage
    };




    /* on drop */
    CalendarApp.prototype.onDrop = function (eventObj, date) {
        var $this = this;
        // retrieve the dropped element's stored Event Object
        var originalEventObject = eventObj.data('eventObject');
        var $categoryClass = eventObj.attr('data-class');
        // we need to copy it, so that multiple events don't have a reference to the same object
        var copiedEventObject = $.extend({}, originalEventObject);
        // assign it the date that was reported
        copiedEventObject.start = date;
        if ($categoryClass)
            copiedEventObject['className'] = [$categoryClass];

        console.log("Dropped Event:", copiedEventObject); // 여기에 추가

        // render the event on the calendar
        $this.$calendar.fullCalendar('renderEvent', copiedEventObject, true);
        // is the "remove after drop" checkbox checked?
        if ($('#drop-remove').is(':checked')) {
            // if so, remove the element from the "Draggable Events" list
            eventObj.remove();
        }
    },
        /* on click on event */
        CalendarApp.prototype.onEventClick =  function (calEvent, jsEvent, view) {
            var $this = this;
            var form = $("<form></form>");
            form.append("<label>Change event name</label>");
            form.append("<div class='input-group'><input class='form-control' type=text value='" + calEvent.title + "' /><span class='input-group-btn'><button type='submit' class='btn btn-success waves-effect waves-light'><i class='fa fa-check'></i> Save</button></span></div>");
            $this.$modal.modal({
                backdrop: 'static'
            });

            console.log("Clicked Event:", calEvent); // 여기에 추가

            $this.$modal.find('.delete-event').show().end().find('.save-event').hide().end().find('.modal-body').empty().prepend(form).end().find('.delete-event').unbind('click').on("click", function () {
                console.log("Delete button:", $this.$modal.find('.delete-event'));
                // 여기에 삭제 로직 추가
                var eventToRemove = $this.$calendarObj.fullCalendar('clientEvents', calEvent._id);

                if (eventToRemove.length > 0) {
                    // FullCalendar에서 이벤트 제거
                    $this.$calendarObj.fullCalendar('removeEvents', calEvent._id);

                    // 로컬 스토리지에서 이벤트 제거
                    var currentEvents = $this.getEventsFromLocalStorage();
                    currentEvents = currentEvents.filter(function (event) {
                        return event._id !== calEvent._id;
                    });
                    $this.saveEventsToLocalStorage(currentEvents);

                    // 모달 숨기기
                    $this.$modal.modal('hide');
                } else {
                    console.log("Event not found in FullCalendar");
                    // FullCalendar에서 이벤트를 찾지 못한 경우에 대한 처리를 추가할 수 있습니다.
                }
            });


            form.find('button[type=submit]').on('click', function (e) {
                e.preventDefault(); // 기본 동작 방지

                console.log('Save button clicked');
                var newTitle = form.find("input[type=text]").val();
                console.log('New title:', newTitle);

                // 여기에 저장 관련 로직을 추가하세요.
                calEvent.title = newTitle;

                // 현재 로컬 스토리지에서 저장된 이벤트들을 가져옴
                var currentEvents = $this.getEventsFromLocalStorage();

                // 새 이벤트에 고유 ID 부여
                calEvent._id = 'event_' + new Date().getTime(); // 예시로 현재 시간을 사용

                // 새 이벤트 추가
                currentEvents.push(calEvent);

                // 로컬 스토리지에 저장
                $this.saveEventsToLocalStorage(currentEvents);

                // 캘린더 업데이트
                $this.$calendarObj.fullCalendar('renderEvent', calEvent, true);
                $this.$modal.modal('hide');
            });
        },
        /* on select */
        CalendarApp.prototype.onSelect = function (start, end, allDay) {
            var $this = this;
            $this.$modal.modal({
                backdrop: 'static'
            });
            var form = $("<form></form>");
            form.append("<div class='row'></div>");
            form.find(".row")
                .append("<div class='col-md-6'><div class='form-group'><label class='control-label'>Event Name</label><input class='form-control' placeholder='Insert Event Name' type='text' name='title'/></div></div>")
                .append("<div class='col-md-6'><div class='form-group'><label class='control-label'>Category</label><select class='form-control' name='category'></select></div></div>")
                .find("select[name='category']")
                .append("<option value='bg-danger'>Danger</option>")
                .append("<option value='bg-success'>Success</option>")
                .append("<option value='bg-dark'>Dark</option>")
                .append("<option value='bg-primary'>Primary</option>")
                .append("<option value='bg-pink'>Pink</option>")
                .append("<option value='bg-info'>Info</option>")
                .append("<option value='bg-warning'>Warning</option></div></div>");
            $this.$modal.find('.delete-event').hide().end().find('.save-event').show().end().find('.modal-body').empty().prepend(form).end().find('.save-event').unbind('click').on("click", function () {
                form.submit();
            });
            $this.$modal.find('form').on('submit', function () {
                var title = form.find("input[name='title']").val();
                var categoryClass = form.find("select[name='category'] option:checked").val();

                // 변경된 부분: start와 end를 문자열로 변환하여 저장
                var newEvent = {
                    title: title,
                    start: start.format(), // start를 문자열로 변환
                    end: end ? end.format() : null, // end를 문자열로 변환, end가 존재하면 변환, 없으면 null
                    allDay: allDay,
                    className: categoryClass
                };

                if (title !== null && title.length !== 0) {
                    $this.$calendarObj.fullCalendar('renderEvent', newEvent, true);
                    $this.$modal.modal('hide');

                    // Save events to local storage
                    var currentEvents = $this.getEventsFromLocalStorage();
                    currentEvents.push(newEvent);
                    $this.saveEventsToLocalStorage(currentEvents);

                    // Enable drag for the new event
                    $this.enableDrag();
                } else {
                    alert('You have to give a title to your event');
                }
                return false;
            });
            $this.$calendarObj.fullCalendar('unselect');

        },

        CalendarApp.prototype.enableDrag = function() {
            //init events
            $(this.$event).each(function () {
                // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
                // it doesn't need to have a start or end
                var eventObject = {
                    title: $.trim($(this).text()) // use the element's text as the event title
                };
                // store the Event Object in the DOM element so we can get to it later
                $(this).data('eventObject', eventObject);
                // make the event draggable using jQuery UI
                $(this).draggable({
                    zIndex: 999,
                    revert: true,      // will cause the event to go back to its
                    revertDuration: 0  //  original position after the drag
                });
            });
        }
    CalendarApp.prototype.init = function() {
        var $this = this;
        $this.$externalEvents = undefined;
        $this.$deleteCategoryBtn = $('#yourDeleteButtonID');
        this.enableDrag();
        console.log('Initializing CalendarApp');
        console.log('$this.$saveCategoryBtn length:', this.$saveCategoryBtn.length);
        /*  Initialize the calendar  */
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var form = '';
        var today = new Date($.now());

        var defaultEvents =  [];


        $this.$calendarObj = $this.$calendar.fullCalendar({
            slotDuration: '00:15:00', /* If we want to split day time each 15minutes */
            minTime: '08:00:00',
            maxTime: '19:00:00',
            defaultView: 'month',
            handleWindowResize: true,
            height: $(window).height() - 200,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
//start의값과 end값을 정의해서 filter이벤트를 사용함으로 달전체씀
            events: function(start, end, timezone, callback) {
                // 현재 FullCalendar에서 보여지는 월의 시작일과 마지막일 구하기
                var firstDayOfMonth = moment(start).startOf('month').format('YYYY-MM-DD');
                var lastDayOfMonth = moment(end).endOf('month').format('YYYY-MM-DD');

                var savedEvents = $this.getEventsFromLocalStorage();
                // 현재 월에 해당하는 이벤트만 필터링
                var filteredEvents = savedEvents.filter(function(event) {
                    return moment(event.start).isSameOrAfter(firstDayOfMonth) && moment(event.start).isBefore(lastDayOfMonth);
                });

                callback(filteredEvents);
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            eventLimit: true, // allow "more" link when too many events
            selectable: true,
            drop: function(date) { $this.onDrop($(this), date); },
            select: function (start, end, allDay) { $this.onSelect(start, end, allDay); },
            eventClick: function(calEvent, jsEvent, view) { $this.onEventClick(calEvent, jsEvent, view); }
        });

        $this.$deleteCategoryBtn.on('click', function () {
            console.log('Delete button clicked');

            var categoryName = $this.$categoryForm.find("input[name='category-name']").val();
            console.log('Category Name to delete:', categoryName);

            // Remove the category from the calendar
            $this.$calendarObj.fullCalendar('removeEventSource', categoryName);

            // Remove the category from the local storage
            var currentEvents = $this.getEventsFromLocalStorage();
            currentEvents = currentEvents.filter(function (event) {
                return event.title !== categoryName;
            });
            $this.saveEventsToLocalStorage(currentEvents);

            // Remove the category option from the external events
            var $externalEvent = $this.$externalEvents.find('.external-event[data-class="bg-' + categoryName + '"]');
            $externalEvent.remove();

            // Remove the category from the Create New events (assuming each has a unique identifier)
            var newEventToRemove = $this.$calendarObj.fullCalendar('clientEvents', function (event) {
                return event.title === categoryName;
            });

            if (newEventToRemove.length > 0) {
                $this.$calendarObj.fullCalendar('removeEvents', newEventToRemove[0]._id);
            }

            // Clear the form fields
            $this.$categoryForm.find("input[name='category-name']").val('');
            $this.$categoryForm.find("select[name='category-color']").val('bg-danger');
        });



        // Load events from local storage on page load
        var savedEvents = $this.getEventsFromLocalStorage();
        $this.$calendarObj.fullCalendar('addEventSource', savedEvents);


        // on new event
        $this.$saveCategoryBtn.on('click', function(){

            console.log('Save button clicked');

            var categoryName = $this.$categoryForm.find("input[name='category-name']").val();
            var categoryColor = $this.$categoryForm.find("select[name='category-color']").val();

            console.log('Category Name:', categoryName); // 추가
            console.log('Category Color:', categoryColor); // 추가

            if (categoryName !== null && categoryName.length !== 0) {
                var newEvent = {
                    title: categoryName,
                    start: new Date(),
                    className: 'bg-' + categoryColor
                };

                // Add the new event to the calendar
                $this.$calendarObj.fullCalendar('renderEvent', newEvent, true);

                // Save events to local storage
                var currentEvents = $this.getEventsFromLocalStorage();
                currentEvents.push(newEvent);
                $this.saveEventsToLocalStorage(currentEvents);

                // Enable drag for the new event
                $this.enableDrag();
            }
        });

    };


    CalendarApp.prototype.saveEventsToLocalStorage = function (events) {
        // 순환 참조를 처리하기 위해 replacer 함수 사용
        var replacer = function (key, value) {
            if (key === 'source') {
                return undefined; // 'source' 속성을 무시
            }
            return value;
        };

        var eventsString = JSON.stringify(events, replacer);
        console.log('Saving events to local storage:', eventsString);
        localStorage.setItem('calendarEvents', eventsString);
    };

    CalendarApp.prototype.getEventsFromLocalStorage = function() {
        var storedEvents = localStorage.getItem('calendarEvents');
        var parsedEvents = storedEvents ? JSON.parse(storedEvents) : [];
        console.log('Retrieved events from local storage:', JSON.stringify(parsedEvents));
        return parsedEvents;
    };


    // Initializing CalendarApp
    $.CalendarApp = new CalendarApp, $.CalendarApp.Constructor = CalendarApp;



    // Initializing CalendarApp on document ready
    $(document).ready(function() {
        $.CalendarApp.init();


    });



}(window.jQuery); 