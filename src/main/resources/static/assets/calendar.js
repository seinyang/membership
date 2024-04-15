$(document).ready(function() {
    document.addEventListener("DOMContentLoaded", function () {
        const urlParams = new URLSearchParams(window.location.search);
        const inputDate = urlParams.get('inpuDate');

        // inputDate를 사용하여 필요한 작업 수행
        console.log('클릭한 이벤트의 날짜:', inputDate);
        // 이제 inputDate를 사용하여 서버로 요청을 보내거나 원하는 작업을 수행할 수 있습니다.
    });
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;

    // calendar element 취득
    var calendarEl = $('#calendars')[0];

    // full-calendar 생성하기
    const calendar = new FullCalendar.Calendar(calendarEl, {
        height: '700px', // calendar 높이 설정
        expandRows: true, // 화면에 맞게 높이 재설정
        slotMinTime: '08:00', // Day 캘린더에서 시작 시간
        slotMaxTime: '20:00', // Day 캘린더에서 종료 시간
        // 해더에 표시할 툴바
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth', //timeGridWeek,timeGridDay,listWeek
        },
        initialView: 'dayGridMonth', // 초기 로드 될때 보이는 캘린더 화면(기본 설정: 달)
        navLinks: false, // 날짜를 선택하면 Day 캘린더나 Week 캘린더로 링크
        editable: false, // 수정 가능?
        selectable: false, // 달력 일자 드래그 설정가능
        nowIndicator: true, // 현재 시간 마크
        dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
        locale: 'ko', // 한국어 설정
        eventClick: function (info) {
            // 클릭된 이벤트의 시작 날짜를 가져옴
            const clickedStartDate = info.event.start;
            console.log(clickedStartDate);

            if (clickedStartDate) {
                // 클릭된 날짜를 로컬 시간대로 변환
                const localStartDate = new Date(clickedStartDate.getTime() - (new Date().getTimezoneOffset() * 60000));
                // 시작 날짜에서 원하는 형식으로 작성날짜 추출 (예: YYYY-MM-DD)
                const targetDate = localStartDate.toISOString().slice(0,10);
                console.log('클릭한 날짜:', targetDate);
                // 여기서 해당 경로로 이동하면 컨트롤러와 매핑되는 메서드가 실행됨
                // (여기서 targetDate가 클릭된 날짜, 컨트롤러에는 클릭된 날짜가 inputDate)
                location.href = `/editPage/${targetDate}`;
            } else {
                console.error("클릭된 이벤트의 시작 날짜를 찾을 수 없습니다.");
            }
        },


        events: [],
    });

    // 캘린더 랜더링
    calendar.render();

    function handleDateRange(currentDate) {
        // 현재 보여지는 월의 정보 출력
        console.log('현재 보여지는 월:', currentDate);

        var firstDayOfMonth = moment(currentDate).startOf('month').format('YYYY-MM-DD');

        console.log(firstDayOfMonth);

        fetchData(firstDayOfMonth)
            .then(data => {
                console.log('데이터를 새로 불러왔습니다:', data);


                const events = [];

                data.forEach(item => {
                    let eventAdded = false;

                    // 정상출근 및 정상퇴근 아이템
                    if (item.정상근태여부 === true && item.정상퇴근여부 === true) {
                        const eventDate = new Date(item.작성날짜);
                        // 해당 날짜에 이미 아이템이 추가되지 않은 경우에만 추가
                        if (!events.some(event => isSameDay(event.start, eventDate))) {
                            events.push({
                                title: '정상출근 및 정상퇴근',
                                start: eventDate,
                                backgroundColor: '#74DF00',
                                click: function () {
                                    window.location.href = `/workload?inpuDate=${item.작성날짜}`;
                                }
                            });
                            eventAdded = true;
                        }
                    }

                    // 지각 아이템
                    if (!eventAdded && item.정상근태여부 === false && item.정상퇴근여부 === true) {
                        const eventDate = new Date(item.작성날짜);
                        if (!events.some(event => isSameDay(event.start, eventDate))) {
                            events.push({
                                title: '지각',
                                start: eventDate,
                                backgroundColor: '#E6A1F2',
                                // click 이벤트를 설정하거나 다른 처리를 추가할 수 있습니다.
                            });
                            eventAdded = true;
                        }
                    }

                    // 조퇴 아이템
                    if (!eventAdded && item.정상근태여부 === true && item.정상퇴근여부 === false) {
                        const eventDate = new Date(item.작성날짜);
                        if (!events.some(event => isSameDay(event.start, eventDate))) {
                            events.push({
                                title: '조퇴',
                                start: eventDate,
                                backgroundColor: '#17A2B8',
                                // click 이벤트를 설정하거나 다른 처리를 추가할 수 있습니다.
                            });
                        }
                    }

                    // 정상 근태여부와 정상 퇴근여부가 둘 다 false인 경우, 조퇴시간과 지각시간 아이템을 추가합니다.
                    if (item.정상근태여부 === false && item.정상퇴근여부 === false) {
                        const eventDate = new Date(item.작성날짜);
                        // 조퇴와 지각 아이템 추가
                        if (!events.some(event => isSameDay(event.start, eventDate))) {
                            events.push({
                                title: '조퇴',
                                start: eventDate,
                                backgroundColor: '#17A2B8', // 조퇴시간의 배경색을 변경할 수 있습니다.
                            });

                            events.push({
                                title: '지각',
                                start: eventDate,
                                backgroundColor: '#E6A1F2', // 지각시간의 배경색을 변경할 수 있습니다.
                            });
                        }
                    }
                });
                //출근전체일수
                const totalWorkDays = countTotalWorkDays(events);
                //지각일수
                const totalLateDays = countLateDays(events);
                //조퇴일수
                const totalEarlyLeaveDays = countEarlyLeaveDays(events);
                //정상출근,정상퇴근일수
                const totalcountAllDays = countAllDays(events);

                // 근태 테이블 업데이트
                updateAttendanceTable(firstDayOfMonth, totalWorkDays, totalLateDays, totalEarlyLeaveDays, totalcountAllDays);

                const finalEvents = events;

                // 기존 이벤트를 모두 제거하고 새로운 이벤트를 추가합니다.
                calendar.removeAllEvents();
                calendar.addEventSource(events);
            })
            .catch(error => {
                console.error('데이터 불러오기 오류:', error);
            });

// 두 날짜가 같은 날인지 확인하는 함수
        function isSameDay(date1, date2) {
            return date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate();
        }
    }

    // 페이지가 로드될 때 한 번 호출됩니다.
    handleDateRange(new Date());

    // viewDidMount 이벤트 핸들러 설정
    calendar.on('viewDidMount', function(arg) {
        handleDateRange(arg.view.currentStart);
    });

    // datesSet 이벤트 핸들러 설정
    calendar.on('datesSet', function(arg) {
        handleDateRange(arg.view.currentStart);
    });

    async function fetchData(firstDayOfMonth) {
        // API 호출
        const response = await fetch(`/month?inputDate=${firstDayOfMonth}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            // 에러 상태가 404(Not Found)이면 빈 객체 반환
            if (response.status === 404) {
                return {};
            }
            throw new Error('Network response was not ok');
        }

        try {
            // JSON 파싱 시도
            const jsonData = await response.json();
            return jsonData || {};
        } catch (error) {
            console.error('JSON 파싱 중 오류가 발생했습니다:', error);
            // JSON 파싱 오류 시 빈 객체 반환
            return {};
        }
    }

    // 날짜 목록을 받아서 날짜당 하나의 이벤트만을 고려한 출근일수를 계산하는 함수
    function getUniqueDates(events) {
        const uniqueDates = [...new Set(events.map(event => moment(event.start).format('YYYY-MM-DD')))];
        return uniqueDates;
    }

    function countTotalWorkDays(events) {
        const uniqueDates = getUniqueDates(events);
        return uniqueDates.length;
    }

    //지각이벤트 세주는 역할
    // 달력에 뿌려진 지각 이벤트만 가져오는 함수
    function getLateEvents(events) {
        return events.filter(event => event.title === '지각');
    }

    // 지각 이벤트의 날짜 수를 세는 함수
    function countLateDays(events) {
        const lateEvents = getLateEvents(events);
        const uniqueLateDays = new Set(lateEvents.map(event => moment(event.start).format('YYYY-MM-DD')));
        return uniqueLateDays.size;
    }

    // 달력에 뿌려진 조퇴 이벤트만 가져오는 함수
    function getEarlyLeaveEvents(events) {
        return events.filter(event => event.title === '조퇴');
    }

    // 조퇴 이벤트의 날짜 수를 세는 함수
    function countEarlyLeaveDays(events) {
        const earlyLeaveEvents = getEarlyLeaveEvents(events);
        const uniqueEarlyLeaveDays = new Set(earlyLeaveEvents.map(event => moment(event.start).format('YYYY-MM-DD')));
        return uniqueEarlyLeaveDays.size;
    }

    // 달력에 뿌려진 정상출근 및 정상퇴근 이벤트만 가져오는 함수
    function getAll(events) {
        return events.filter(event => event.title === '정상출근 및 정상퇴근');
    }

    // 정상출근,정상퇴근 이벤트의 날짜 수를 세는 함수
    function countAllDays(events) {
        const AllEvents = getAll(events);
        const uniqueAllDays = new Set(AllEvents.map(event => moment(event.start).format('YYYY-MM-DD')));
        return uniqueAllDays.size;
    }
    // 월 선택 시 근태 테이블 업데이트 함수
    async function updateAttendanceTable(firstDayOfMonth, totalWorkDays, totalLateDays, totalEarlyLeaveDays, totalcountAllDays) {
        console.log('현재 보여지는 근태현황의 월:', moment(firstDayOfMonth).format('YYYY-MM'));
        const response = await fetch(`/state?inputDate=${firstDayOfMonth}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        let attendanceData = {};

        if (response.ok) {
            try {
                attendanceData = await response.json();
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }

        // 테이블 업데이트
        document.getElementById('totalDaysCell').textContent = totalWorkDays;
        document.getElementById('normalAttendanceCell').textContent = totalcountAllDays;
        document.getElementById('normalLeaveCell').textContent = totalcountAllDays;
        document.getElementById('lateCell').textContent = totalLateDays;
        document.getElementById('earlyLeaveCell').textContent = totalEarlyLeaveDays;
    }

});
$(document).ready(function(){
    // 현재 URL 경로 확인
    var path = window.location.pathname;

    // 각 메뉴 항목에 대해 현재 URL과 일치하는 경우 활성화
    $('.navbar-nav .nav-link').each(function(){
        var href = $(this).attr('href');
        if (path === href) {
            $(this).addClass('active');
        }
    });
});
