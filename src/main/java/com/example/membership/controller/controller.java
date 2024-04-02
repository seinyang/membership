package com.example.membership.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class controller {

    @GetMapping ("/")
    public String home(){

        return "index";
    }

    @GetMapping ("/login")
        public String login(){

        return "login/page-login";
    }

    @GetMapping ("/workload")
    public String workload(){

        return "dashboard/workload";
    }

    @GetMapping ("/calendar")
    public String calendar(){

        return "dashboard/calendar";
    }

}
