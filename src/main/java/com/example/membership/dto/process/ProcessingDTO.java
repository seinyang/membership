package com.example.membership.dto.process;

import lombok.Data;

import java.util.List;
@Data
public class ProcessingDTO {

    private int 처리개수;
    private String 처리항목;
    private List<ProcessingItem> aS처리리스트;


}



