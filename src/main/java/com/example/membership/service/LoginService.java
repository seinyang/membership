package com.example.membership.service;

import com.example.membership.dto.login.AuthDTO;

import com.example.membership.dto.login.LoginRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;


@Service
public class LoginService {
    private static final Logger logger = LoggerFactory.getLogger(LoginService.class);
    private final RestTemplate restTemplate;
    private final String serverAddress;

    @Autowired
    public LoginService(RestTemplate restTemplate, @Value("${workapi.serverAddress}") String serverAddress) {
        this.restTemplate = restTemplate;
        this.serverAddress = serverAddress;
    }

    public AuthDTO login(LoginRequest loginRequest) {
        String apiAddress = serverAddress + "/api/Auth/login";

        try {
            AuthDTO responseDTO = restTemplate.postForObject(apiAddress, loginRequest, AuthDTO.class);

            if (responseDTO != null) {
                logger.info("로그인 성공적으로 수신: {}", responseDTO);
                return responseDTO;
            } else {
                logger.info("아이디가 틀리거나 값이 없음");
                return null;
            }
        } catch (RestClientResponseException ex) {
            logger.info("RestTemplate 처리 오류, 응답코드: {}, 응답 내용: {}", ex.getRawStatusCode(), ex.getResponseBodyAsString());
            return null;
        }
    }
}
