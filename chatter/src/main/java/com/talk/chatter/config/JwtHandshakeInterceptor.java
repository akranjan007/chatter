package com.talk.chatter.config;

import com.talk.chatter.Entities.Users;
import com.talk.chatter.Repository.UserRepository;
import com.talk.chatter.Services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.security.Principal;
import java.util.Map;
import java.util.Optional;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    @Autowired private JwtService jwtService;
    @Autowired private UserDetailsService userDetailsService;
    @Autowired private UserRepository userRepo;
    //@Autowired private Principal principal;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        //System.out.println(">>> beforeHandshake called");

        if (request instanceof ServletServerHttpRequest servletRequest) {
            String token = servletRequest.getServletRequest().getParameter("token");
            System.out.println(">>> Token received: " + token);

            if (token != null) {
                String username = jwtService.extractUserName(token);
                System.out.println(">>> Username extracted: " + username);

                if (username != null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    Optional<Users> optionUser = userRepo.findByEmail(username);
                    Users user = optionUser.get();
                    if (jwtService.validateToken(token, userDetails)) {
                        System.out.println(">>> Token validated successfully for: " + username);
                        attributes.put("username", username);
                        attributes.put("userId", user.getUserId());
                        return true;
                    } else {
                        System.out.println(">>> Token validation failed");
                    }
                } else {
                    System.out.println(">>> Username extraction failed");
                }
            } else {
                System.out.println(">>> Token is null");
            }
        } else {
            System.out.println(">>> Not a ServletServerHttpRequest");
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }
}
