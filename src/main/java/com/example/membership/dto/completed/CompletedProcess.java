package com.example.membership.dto.completed;

import lombok.Data;

@Data
public class CompletedProcess {

    private int 관리ID;

    private String 접수관리일련번호;

    private String 고객명;

    private int 소요시간;

}
