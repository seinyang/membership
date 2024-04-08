package com.example.membership.controller;


import com.example.membership.dto.job.WorkDTO;
import com.example.membership.service.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

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
}
