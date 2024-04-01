(function(){
    $(function(){
        // calendar element 취득
        var calendarEl = $('#calendar')[0];
        // full-calendar 생성하기
        var calendar = new FullCalendar.Calendar(calendarEl, {
            height: '700px', // calendar 높이 설정
            expandRows: true, // 화면에 맞게 높이 재설정
            slotMinTime: '08:00', // Day 캘린더에서 시작 시간
            slotMaxTime: '20:00', // Day 캘린더에서 종료 시간
            // 해더에 표시할 툴바
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth',//timeGridWeek,timeGridDay,listWeek
            },
            initialView: 'dayGridMonth', // 초기 로드 될때 보이는 캘린더 화면(기본 설정: 달)
            navLinks: false, // 날짜를 선택하면 Day 캘린더나 Week 캘린더로 링크
            editable: false, // 수정 가능?
            selectable: false, // 달력 일자 드래그 설정가능
            nowIndicator: true, // 현재 시간 마크
            dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
            locale: 'ko', // 한국어 설정
            eventAdd: function(obj) { // 이벤트가 추가되면 발생하는 이벤트
                console.log(obj);
            },
            eventChange: function(obj) { // 이벤트가 수정되면 발생하는 이벤트
                console.log(obj);
            },
            eventRemove: function(obj){ // 이벤트가 삭제되면 발생하는 이벤트
                console.log(obj);
            },
            // 이벤트
            events: [
            ]
        });
        // 캘린더 랜더링
        calendar.render();

        // 일요일에 해당하는 셀의 텍스트 색상을 빨간색으로 변경
        calendar.on('dayCellDidMount', function (arg) {
            var dayOfWeek = arg.date.getDay(); // 일요일: 0, 월요일: 1, ..., 토요일: 6
            if (dayOfWeek === 0) { // 일요일인 경우
                arg.el.style.color = 'red'; // 텍스트 색상을 빨간색으로 변경
            }
        });
    });
})();