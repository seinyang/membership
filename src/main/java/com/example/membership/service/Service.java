package com.example.membership.service;


import com.example.membership.dto.AttendState.state;
import com.example.membership.dto.completed.CompletedDTO;
import com.example.membership.dto.completed.CompletedProcess;
import com.example.membership.dto.job.WorkDTO;
import com.example.membership.dto.process.ProcessingDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
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
    public WorkDTO save(WorkDTO workDTO, String token) {

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

    // 근무내용 수정
    public WorkDTO saveEdit(String apiAddress, WorkDTO workDTO, String token) {

        apiAddress = serverAddress + "/api/Job/WorkHistoryEdit";

        var headers = new HttpHeaders();
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
            if (ex.getRawStatusCode() == 401) {
                System.err.println("로그인 실패 메시지: " + ex.getResponseBodyAsString());
                return null;
            } else {
                System.err.println("저장시 실패 오류: " + ex.getResponseBodyAsString());
                return null; // 다른 서비스 오류 시 null 반환
            }
        }
    }

    public String ApiAddress() {
        return serverAddress + "/api/Job/WorkHistoryEdit";
    }


    public WorkDTO processFormatData(WorkDTO workDTO) {

        workDTO.setFormattedDate(formatDateString(workDTO.get작성날짜()));

        return workDTO;
    }


    public String formatDateString(String dateString) {

        try {
            // JSON 형식의 데이터인 경우 {"value":"0"}와 같은 형태의 데이터가 포함될 수 있으므로 확인
            if (dateString.startsWith("{")) {
                // JSON 데이터인 경우 해당 필드를 파싱
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(dateString);
                dateString = jsonNode.get("value").asText();
            }

            SimpleDateFormat inputDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            SimpleDateFormat outputDateFormat = new SimpleDateFormat("yyyy-MM-dd");

            Date date = inputDateFormat.parse(dateString);


            return outputDateFormat.format(date);
        } catch (ParseException | IOException e) {
            e.printStackTrace();
            return "날짜 형식이 올바르지 않습니다.";
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


    // 달력에 이벤트 클릭시 해당일의 데이터를 그대로 가져와 수정(이건 데이터 하나씩 받아야해서 list쓰면안됨)
    public WorkDTO CalenderDay(String inputDate, String token) {
        String apiAddress = serverAddress + "/api/Job/WorkHistory-Day?inpuDate=" + inputDate;

        return getDayData(apiAddress, token);
    }


    // 일간 데이터 가져오기
    private WorkDTO getDayData(String apiAddress, String token) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<>(headers);


        try {
            // 서버로 GET 요청을 보내고 응답을 받음
            ResponseEntity<WorkDTO> response = restTemplate.exchange(
                    apiAddress,
                    HttpMethod.GET,
                    entity,
                    WorkDTO.class
            );

            WorkDTO workHistory = response.getBody();

            // workHistory가 null이 아닌지 확인
            if (workHistory != null) {
                // 결과 반환
                System.out.println("불러온 데이터: " + workHistory);
                return workHistory;
            } else {
                System.out.println("데이터가 없습니다.");
                return null;
            }

        } catch (RestClientResponseException ex) {
            if (ex.getRawStatusCode() == 401) {
                System.err.println("로그인 실패 메시지: " + ex.getResponseBodyAsString());
            } else {
                System.err.println("서비스 오류: " + ex.getResponseBodyAsString());
            }
            return null;
        }
    }


    //근무 상태
    public state AttendState(String inputDate,String token) {

        String apiAddress = serverAddress + "/api/Job/AttendState?inpuDate=" + inputDate;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 서버로 GET 요청을 보내고 응답을 받음
            ResponseEntity<state> response = restTemplate.exchange(
                    apiAddress,
                    HttpMethod.GET,
                    entity,
                    state.class
            );

            state state = response.getBody();

            // workHistory가 null이 아닌지 확인
            if (state != null) {
                // 결과 반환
                System.out.println("불러온 데이터: " + state);
                return state;
            } else {
                System.out.println("데이터가 없습니다.");
                return null;
            }

        } catch (RestClientException e) {
            throw new RuntimeException(e);
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