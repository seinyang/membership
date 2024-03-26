// 현재 날짜를 가져오는 함수
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 작성 날짜 입력 필드에 현재 날짜 설정
document.getElementById('date').value = getCurrentDate();


//스마트 에디터