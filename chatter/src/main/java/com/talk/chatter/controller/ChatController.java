package com.talk.chatter.controller;

import com.talk.chatter.DTO.ChatRequestor;
import com.talk.chatter.DTO.MessageDTO;
import com.talk.chatter.Entities.Message;
import com.talk.chatter.Entities.Users;
import com.talk.chatter.Repository.ConnectionsRepo;
import com.talk.chatter.Repository.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/chat")
public class ChatController {
    @Autowired private MessageRepo messageRepo;
    @Autowired private ConnectionsRepo connectionsRepo;

    @PostMapping("/connections")
    public ResponseEntity<Map<String, Object>> getConnections(@RequestBody Map<String, String> request){
        String principalUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        String userEmail = request.get("senderEmail");
        if(!principalUserEmail.equals(userEmail)){
            return  ResponseEntity.status(403).build();
        }
        List<Users> connection = connectionsRepo.findConnectedUsers(userEmail);
        Map<String, Object> response = new HashMap<>();
        response.put("data", connection);
        response.put("success", true);
        response.put("message", "Connection List Fetched.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/history")
    public ResponseEntity<List<MessageDTO>> getChat(@RequestBody ChatRequestor request){
        String principalUser = SecurityContextHolder.getContext().getAuthentication().getName();
        String user1 = request.getUser1();
        String user2 = request.getUser2();
        System.out.println(principalUser + " " + user1 + " " + user2);
        if(!principalUser.equals(user1) && !principalUser.equals(user2)){
            return ResponseEntity.status(403).build();
        }
        List<Message>  messages = messageRepo.getChatHistory(user1, user2);
        List<MessageDTO> response = messages.stream()
                .map(m -> new MessageDTO(m.getSenderId(), m.getReceiverId(), m.getMessageText(), m.getTimestamp()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
