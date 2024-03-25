package com.example.membership.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class controller {

    @GetMapping ("/login")
        public String login(){

        return "login/page-login";
    }



    @GetMapping ("/")
    public String home(){

        return "index";
    }

}
