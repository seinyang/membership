package com.example.membership.controller;


import com.example.membership.dto.AttendState.state;
import com.example.membership.dto.job.WorkDTO;
import com.example.membership.service.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.List;


@RequiredArgsConstructor
@Controller
public class CalendarController {

    final Service service;

    @GetMapping("/calendar")
    public String calendar(){

        return "dashboard/calendar";
    }


    //달력 월 데이터 뿌리기
    @GetMapping("/month")
    public ResponseEntity<List<WorkDTO>> getMonth(@RequestHeader("Authorization") String authorizationHeader, @RequestParam(name = "inputDate") String inputDate) {
        String token = authorizationHeader.replace("Bearer ", "");

        try {
            List<WorkDTO> result = service.CalenderMonth(inputDate, token);

            if (result != null && !result.isEmpty()) {
                // 데이터가 있는 경우 JSON 응답 반환
                return new ResponseEntity<>(result, HttpStatus.OK);
            } else {
                // 데이터가 없는 경우 No Content 상태코드 반환
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        } catch (Exception e) {
            // 예외 처리 로직을 추가하여 적절한 응답이나 로깅을 수행할 수 있습니다.
            e.printStackTrace(); // 예외를 콘솔에 출력하거나 로깅할 수 있습니다.
            // 서버 오류인 경우 Internal Server Error 상태코드 반환
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //달력 근태현황
    @GetMapping("/state")
    public ResponseEntity<state> state(@RequestHeader("Authorization") String authorizationHeader, @RequestParam(name = "inputDate") String inputDate){
        String token = authorizationHeader.replace("Bearer ", "");

        try {
            state result = service.AttendState(inputDate, token);

            if (result != null ) {
                // 데이터가 있는 경우 JSON 응답 반환
                return new ResponseEntity<>(result, HttpStatus.OK);
            } else {
                // 데이터가 없는 경우 No Content 상태코드 반환
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        } catch (Exception e) {
            // 예외 처리 로직을 추가하여 적절한 응답이나 로깅을 수행할 수 있습니다.
            e.printStackTrace(); // 예외를 콘솔에 출력하거나 로깅할 수 있습니다.
            // 서버 오류인 경우 Internal Server Error 상태코드 반환
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("dashboard/editPage")
    public String editPage(){
        return "dashboard/editPage";
    }



    // 달력 이벤트 클릭시 해당 날짜의 데이터를 가져와서 화면에 보여주기 위한 컨트롤러 메서드
    @GetMapping("/editPage/{inputDate}")
    public String getDay(@PathVariable String inputDate, Model model, HttpServletRequest request) {
        // HTTP 요청에서 토큰을 가져오는 메서드 호출
        String token = getTokenFromCookie(request);

        try {
            // 입력한 날짜로 업무일지를 조회하여 결과를 담는다
            WorkDTO result = service.CalenderDay(inputDate, token);

            // 서비스 레이어에서 데이터 가공
            WorkDTO processedResult = service.processFormatData(result);

            // 조회한 데이터가 있으면 editPage로 이동
            if (processedResult != null) {

                // 모델에 testDTO 객체를 추가해서 "edit"라는 화면에서 사용할 변수명
                model.addAttribute("edit", processedResult);
                System.out.println("Processed Result: " + processedResult);
                model.addAttribute("result", result);
                return "dashboard/editPage";
            } else {
                // 조회한 데이터가 없으면 No Content 상태코드 반환 (null을 반환)
                return null;
            }
        } catch (Exception e) {

            e.printStackTrace();
            // 서버 오류인 경우 Internal Server Error 상태코드 반환
            return null;
        }
    }


    private String getTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
