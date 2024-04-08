$(document).ready(function() {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;

    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];

    // calendar element 취득
    var calendarEl = $('#calendar')[0];

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

    // 데이터를 가져오고 이벤트로 만드는 작업을 수행합니다.
    fetchData(firstDayOfMonth)
        .then(data => {
            console.log('데이터를 새로 불러왔습니다:', data);
            // 이벤트를 생성하기 위한 로직을 작성합니다.
            const events = data.flatMap(item => {
                const result = [];

                if (item.정상근태여부 === true && item.정상퇴근여부 === true) {
                    result.push({
                        title: '정상출근 및 정상퇴근',
                        start: new Date(item.작성날짜),
                        backgroundColor: '#74DF00',
                        click: function () {
                            window.location.href = `/workload?inpuDate=${item.작성날짜}`;
                        }
                    });
                } else {
                    if (item.정상근태여부 === false && item.정상퇴근여부 === true) {
                        result.push({
                            title: '지각',
                            start: new Date(item.작성날짜),
                            backgroundColor: '#E6A1F2',
                            // click 이벤트를 설정하거나 다른 처리를 추가할 수 있습니다.
                        });
                    }

                    if (item.정상근태여부 === true && item.정상퇴근여부 === false) {
                        result.push({
                            title: '조퇴',
                            start: new Date(item.작성날짜),
                            backgroundColor: '#17A2B8',
                            // click 이벤트를 설정하거나 다른 처리를 추가할 수 있습니다.
                        });
                    }
                    // 정상 근태여부와 정상 퇴근여부가 둘 다 false인 경우, 조퇴시간과 지각시간 아이템을 추가합니다.
                    if (item.정상근태여부 === false && item.정상퇴근여부 === false) {
                        result.push({
                            title: '조퇴',
                            start: new Date(item.작성날짜),
                            backgroundColor: '#17A2B8', // 조퇴시간의 배경색을 변경할 수 있습니다.
                        });

                        result.push({
                            title: '지각',
                            start: new Date(item.작성날짜),
                            backgroundColor: '#E6A1F2', // 지각시간의 배경색을 변경할 수 있습니다.
                        });
                    }
                }
                return result;
            });

            // 캘린더에 이벤트를 추가합니다.
            calendar.removeAllEvents(); // 기존 이벤트 모두 삭제
            calendar.addEventSource(events); // 새로운 이벤트 추가

            // 캘린더 랜더링
            calendar.render();
        })
        .catch(error => {
            console.error('데이터 불러오기 오류:', error);
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
});
