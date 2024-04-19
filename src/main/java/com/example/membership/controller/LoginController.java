package com.example.membership.controller;

import com.example.membership.config.ErrorResponse;
import com.example.membership.dto.login.AuthDTO;
import com.example.membership.dto.login.LoginRequest;
import com.example.membership.service.LoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;


@RequiredArgsConstructor
@Controller
public class LoginController {

    private final LoginService loginService;

    @GetMapping("/login")
    public String login(){
        return "login/login";
    }

    @PostMapping("/login")
    public ResponseEntity<?> processLogin(@RequestBody LoginRequest loginRequest){

        AuthDTO responseDTO = loginService.login(loginRequest);

        if (responseDTO != null){
            //로그인 성공시 제이슨 형식으로 응답
            return ResponseEntity.ok(responseDTO);
        } else {
            //로그인 실패시 ErrorResponse 객체를 생성하여 반환
            ErrorResponse errorResponse = new ErrorResponse("아이디나 패스워드가 틀렸습니다");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }



    @GetMapping("/logout")
    public String logout(HttpServletRequest request) {
        // 현재 세션 무효화
        request.getSession().invalidate();
        // 로그아웃 후 로그인 페이지로 이동
        return "redirect:/login";
    }
}
