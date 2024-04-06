package com.example.membership.controller;

import com.example.membership.dto.completed.CompletedDTO;
import com.example.membership.dto.job.WorkDTO;

import com.example.membership.service.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Controller
public class WorkloadController {

    final Service service;

    @GetMapping("/workload")
    public String workload(){

        return "dashboard/workload";

    }

    @PostMapping("/workload")
    public ResponseEntity<?> workSave(@RequestHeader("Authorization") String authorizationHeader, @RequestBody WorkDTO workDTO) {
        String token = authorizationHeader.replace("Bearer ", "");

        WorkDTO responseDTO = service.save( workDTO, token);

        if (responseDTO != null) {
            return ResponseEntity.ok(responseDTO);
        } else {
            return ResponseEntity.status(500).body("서비스 처리 중 오류가 발생했습니다.");
        }
    }


    //당일 처리항목
    @GetMapping("/completed")
    public ResponseEntity<CompletedDTO> getCompleted(@RequestHeader("Authorization") String authorizationHeader, @RequestParam(name = "inputDate") String inputDate){
        String token = authorizationHeader.replace("Barear","");

        try {
            CompletedDTO result = service.getCompleted(inputDate,token);

            if (result != null){
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }
}