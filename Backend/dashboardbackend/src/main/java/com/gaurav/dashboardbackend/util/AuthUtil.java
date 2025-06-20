package com.gaurav.dashboardbackend.util;

import org.springframework.security.core.context.SecurityContextHolder;

public class AuthUtil {
    public static String getLoggedInUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
