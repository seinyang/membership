package com.example.membership.dto.AttendState;

import lombok.Data;

@Data
public class state {

    private int 전체출근일수;

    private int 정상출근;

    private int 정상퇴근;

    private int 지각;

    private int 조퇴;

}
