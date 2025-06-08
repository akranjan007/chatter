package com.talk.chatter.controller;

import com.talk.chatter.Entities.Users;
import com.talk.chatter.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/search")
public class SearchController {
    @Autowired private UserRepository userRepository;

    @PostMapping("/user")
    public ResponseEntity<Map<String, Object>> searchUser(@RequestBody Map<String, String> request){
        Map<String, Object> response = new HashMap<>();
        String principal = SecurityContextHolder.getContext().getAuthentication().getName();
        String searchUser = request.get("searchUser");
        if(principal==null || searchUser==null || searchUser.trim().isEmpty()){
            response.put("success", false);
            response.put("message", "User not Logged in or SearchUser not received.");
            return ResponseEntity.status(400).body(response);
        }
        try{
            if(userRepository.existsByEmail(searchUser)){
                Optional<Users> user = userRepository.findByEmail(searchUser);
                response.put("success", true);
                response.put("data", user);
                response.put("message", "User Found.");
                return ResponseEntity.ok(response);
            }
            else{
                response.put("success", false);
                response.put("message", "User does not exists.");
                return ResponseEntity.status(404).body(response);
            }
        } catch(Exception e){
            e.printStackTrace();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
