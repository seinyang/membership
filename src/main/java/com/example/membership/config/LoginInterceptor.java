package com.example.membership.config;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        if (session.getAttribute("userId") == null) {
            // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
            response.sendRedirect("/login");
            return false;
        } else if (request.getRequestURI().equals("/login")) {
            // 로그인한 사용자가 로그인 페이지에 접근하는 경우, 메인 페이지로 리디렉션
            response.sendRedirect("/");
            return false;
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HttpSession session = request.getSession();
        if (session.getAttribute("userId") != null && request.getRequestURI().equals("/login")) {
            // 로그인한 사용자가 로그인 페이지에 접근한 경우, 메인 페이지로 리디렉션
            response.sendRedirect("/");
        }
    }
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // Do nothing
    }
}
