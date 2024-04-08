package com.example.membership.service;


import com.example.membership.dto.completed.CompletedDTO;
import com.example.membership.dto.completed.CompletedProcess;
import com.example.membership.dto.job.WorkDTO;
import com.example.membership.dto.process.ProcessingDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

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



    // 달력 월별 데이터 뿌리기(list로 묶어서뿌려줘야함)
    public List<WorkDTO> CalenderMonth(String inputDate, String token) {
        String apiAddress = serverAddress + "/api/Job/WorkHistory-Month?inpuDate=" + inputDate;
        return getMonthData(apiAddress, token);
    }


    public List<WorkDTO> getMonthData(String apiAddress, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 서버로 GET 요청을 보내고 응답을 받음
            ResponseEntity<WorkDTO[]> response = restTemplate.exchange(
                    apiAddress,
                    HttpMethod.GET,
                    entity,
                    WorkDTO[].class
            );

            WorkDTO[] workHistoryArray = response.getBody();

            // workHistoryArray가 null이 아닌지 확인
            if (workHistoryArray != null && workHistoryArray.length > 0) {
                // 배열을 List로 변환
                List<WorkDTO> workHistoryList = Arrays.asList(workHistoryArray);
                // 첫 번째 WorkHistoryDTO 객체의 각 필드 값을 출력
                System.out.println("불러온 데이터: " + workHistoryList);
                return workHistoryList;
            } else {
                System.out.println("데이터가 없습니다.");
                return Collections.emptyList();
            }

        } catch (RestClientResponseException ex) {
            if (ex.getRawStatusCode() == 401) {
                System.err.println("로그인 실패 메시지: " + ex.getResponseBodyAsString());
                return Collections.emptyList(); // 로그인 실패 시 빈 리스트 반환
            } else {
                System.err.println("서비스 오류: " + ex.getResponseBodyAsString());
                return Collections.emptyList(); // 다른 서비스 오류 시 빈 리스트 반환
            }
        }
    }




    //당일 처리항목
    public CompletedDTO getCompleted(String inputDate, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String apiAddress = serverAddress + "/api/Job/day-Completed?inpuDate=" + inputDate;

        try {
            ResponseEntity<CompletedDTO> responseEntity = restTemplate.exchange(
                    apiAddress,
                    HttpMethod.GET,
                    entity,
                    CompletedDTO.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                return responseEntity.getBody();
            } else {
                return new CompletedDTO();
            }
        } catch (RestClientResponseException ex) {
            return new CompletedDTO();
        }
    }

    //오늘 처리 개수
    public ProcessingDTO getProcessing(String inputDate, String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String apiAddress = serverAddress + "/api/Job/Day-Processing?inpuDate=" + inputDate;

        try {
            ResponseEntity<ProcessingDTO> responseEntity = restTemplate.exchange(
                    apiAddress,
                    HttpMethod.GET,
                    entity,
                    ProcessingDTO.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                return responseEntity.getBody();
            } else {
                return new ProcessingDTO();
            }

        } catch (RestClientResponseException ex) {
            return new ProcessingDTO();
        }
    }
}