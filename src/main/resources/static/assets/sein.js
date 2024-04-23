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
