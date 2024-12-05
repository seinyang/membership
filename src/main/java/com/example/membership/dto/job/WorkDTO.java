package com.example.membership.dto.job;

import lombok.Data;

@Data
public class WorkDTO {

    private String 사용자ID;

    private String 출근시간;

    private String 퇴근시간;

    private boolean 정상근태여부;

    private boolean 정상퇴근여부;

    private String 지각시간;

    private String 조퇴시간;

    private String 요청사항;

    private String 긴급요청건;

    private String 비고;

    private int 현재검수대기;

    private int 당일검수완료;

    private int 당일수리완료;

    private int 업무소요시간;

    private String 작성날짜;

    private int 관리ID;

    private String formattedDate;

}
