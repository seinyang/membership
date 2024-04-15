//스마트 에디터
let oEditors = []

smartEditor = function () {
    console.log("Naver SmartEditor")
    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: "editorTxt",
        sSkinURI: "/css/smarteditor/SmartEditor2Skin.html",
        fCreator: "createSEditor2"
    })
}


smartEditor()
// business textarea의 내용을 에디터에 설정
const businessTextarea = document.getElementById('business');
if (businessTextarea) {
    const businessContent = businessTextarea.value;
    oEditors.getById["editorTxt"].exec("PASTE_HTML", [businessContent]);
}


function adjustCardHeight() {
    var firstCard = document.getElementById('firstCard');
    var secondCard = document.getElementById('secondCard');
    var thirdCard = document.getElementById("thirdCard");
    var thirdCard2 = document.getElementById("thirdCard2");
    var fourCard = document.getElementById("four");
    var fourCard2 = document.getElementById("four2");
    var windowHeight = document.documentElement.clientHeight; // 실제 화면의 높이 가져오기


    // 첫 번째 카드의 높이 조정
    var firstCardHeight = 1000;
    firstCard.style.height = firstCardHeight + 'px';

    // 두 번째 카드의 높이 조정
    var secondCardHeight = 920;
    secondCard.style.height = secondCardHeight + 'px';

    var thirdCardHeight = 850;
    thirdCard.style.height = thirdCardHeight + 'px';

    var thirdCardHeight2 = 850;
    thirdCard2.style.height = thirdCardHeight2 + 'px';

    var fourCardHeight = 250;
    fourCard.style.height = fourCardHeight + 'px';

    var fourCardHeight2 = 250;
    fourCard2.style.height = fourCardHeight2 + 'px';
}

// 페이지 로드 시 카드 높이 조정
window.onload = adjustCardHeight;

// 창 크기가 변경될 때마다 카드 높이를 조정
window.onresize = adjustCardHeight;



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
