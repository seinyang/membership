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
let oEditors = []

smartEditor = function() {
    console.log("Naver SmartEditor")
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "editorTxt",
        sSkinURI: "/css/smarteditor/SmartEditor2Skin.html",
        fCreator: "createSEditor2"
    })
}

$(document).ready(function() {
    smartEditor()
    // business textarea의 내용을 에디터에 설정
    const businessTextarea = document.getElementById('business');
    if (businessTextarea) {
        const businessContent = businessTextarea.value;
        oEditors.getById["editorTxt"].exec("PASTE_HTML", [businessContent]);
    }
})

function adjustCardHeight() {
    var firstCard = document.getElementById('firstCard');
    var secondCard = document.getElementById('secondCard');
    var thirdCard =document.getElementById("thirdCard");
    var windowHeight = window.innerHeight;

    // 첫 번째 카드의 높이 조정
    var firstCardHeight = Math.max(firstCard.clientHeight, 1000);
    firstCard.style.height = firstCardHeight + 'px';

    // 두 번째 카드의 높이 조정
    var secondCardHeight = Math.max(secondCard.clientHeight, 920 );
    secondCard.style.height = secondCardHeight + 'px';

    var thirdCardHeight = Math.max(thirdCard.clientHeight, 850);
    secondCard.style.height = thirdCardHeight + 'px';
}

// 페이지 로드 시 카드 높이 조정
window.onload = adjustCardHeight;

// 창 크기가 변경될 때마다 카드 높이를 조정
window.onresize = adjustCardHeight;