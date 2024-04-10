package com.example.membership.dto.completed;

import lombok.Data;

import java.util.List;

@Data
public class CompletedDTO {

        private int 처리개수;

        private int 소요시간합계;

        private List<CompletedProcess> 완료처리리스트;

    }


