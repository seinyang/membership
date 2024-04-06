package com.example.membership.service;


import com.example.membership.dto.completed.CompletedDTO;
import com.example.membership.dto.completed.CompletedProcess;
import com.example.membership.dto.job.WorkDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

@org.springframework.stereotype.Service
public class Service {
    @Value("${workapi.serverAddress}")

    private static final Logger logger = LoggerFactory.getLogger(Service.class);
    final RestTemplate restTemplate;
    private final String serverAddress;

    @Autowired
    public Service(RestTemplate restTemplate, @Value("${workapi.serverAddress}") String serverAddress) {
        this.restTemplate = restTemplate;
        this.serverAddress = serverAddress;
    }
    //업무 저장
    public WorkDTO save( WorkDTO workDTO, String token) {
        String apiAddress = serverAddress + "/api/Job/WorkHistorySave";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<WorkDTO> requestEntity = new HttpEntity<>(workDTO, headers);

        try {
            ResponseEntity<WorkDTO> responseEntity = restTemplate.exchange(
                    apiAddress,
                    HttpMethod.POST,
                    requestEntity,
                    WorkDTO.class);
            return responseEntity.getBody();
        } catch (RestClientResponseException ex) {
            // 다른 서비스 오류 시 null 반환
            if (ex.getRawStatusCode() == 401) {
                System.err.println("로그인 실패 메시지: " + ex.getResponseBodyAsString());
            } else {
                System.err.println("서비스 오류: " + ex.getResponseBodyAsString());
            }
            return null; // 로그인 실패 시 null 반환
        }
    }
    //당일 처리 항목
    public CompletedDTO getCompleted(String inputDate, String token){
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization","Bearer"+token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String apiAddress = serverAddress + "/api/Job/day-Completed?inpuDate" + inputDate;

        try {
            ResponseEntity<CompletedDTO> responseEntity = restTemplate.exchange(
                    apiAddress,
                    HttpMethod.GET,
                    entity,
                    CompletedDTO.class);
            if (responseEntity.getStatusCode() == HttpStatus.OK){
                return responseEntity.getBody();
            } else {
                return new CompletedDTO();
            }
        }catch (RestClientResponseException ex){
            return new CompletedDTO();
        }
    }
}