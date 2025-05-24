package com.talk.chatter.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talk.chatter.DTO.ChatMessageDTO;
import com.talk.chatter.Entities.Connections;
import com.talk.chatter.Entities.Message;
import com.talk.chatter.Entities.Queue;
import com.talk.chatter.Entities.Users;
import com.talk.chatter.Repository.ConnectionsRepo;
import com.talk.chatter.Repository.MessageRepo;
import com.talk.chatter.Repository.QueueRepo;
import com.talk.chatter.Repository.UserRepository;
import com.talk.chatter.Services.ConnectionService;
import com.talk.chatter.Services.MessageService;
import com.talk.chatter.Services.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatWebSocketHandler implements WebSocketHandler {

    @Autowired private QueueRepo queueRepo;
    @Autowired private MessageRepo messageRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private QueueService queueService;
    @Autowired private ConnectionsRepo connectionsRepo;
    @Autowired private ConnectionService connectionService;
    @Autowired private MessageService messageService;
    private ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String username = (String) session.getAttributes().get("username");
        if(username!=null){
            sessions.put(username, session);
            System.out.println("Connection Established : "+username);
            List<Queue> unsent = queueRepo.findByReceiverId(username);
            if(!unsent.isEmpty()){
                WebSocketSession receiverSession = sessions.get(username);
                if(receiverSession!=null && receiverSession.isOpen()){
                    for(Queue q:unsent){
                        String messageText = q.getMessage();
                        String senderId = q.getSenderId();
                        receiverSession.sendMessage(new TextMessage(messageText));
                    }
                    queueService.deleteSentUnsentMessage(username);
                }
            }
            else{
                System.out.println("No new Message for "+ username);
            }
        }
        else{
            System.out.println("Username Missing. Closing connection.");
            session.close(CloseStatus.NOT_ACCEPTABLE);
        }
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        System.out.println("Message : "+ message.getPayload());

        String senderEmail = (String) session.getAttributes().get("username");

        ObjectMapper mapper = new ObjectMapper();
        ChatMessageDTO chatMessageDTO = mapper.readValue(message.getPayload().toString(), ChatMessageDTO.class);

        String receiverEmail = chatMessageDTO.getReceiverId();
        String messageText = chatMessageDTO.getMessageText();

        if(receiverEmail==null || messageText==null){
            System.out.println("Invalid message format, missing receiverId or messageText");
            return;
        }
        if(!userRepo.existsByEmail(receiverEmail)){
            System.out.println("Receiver doesn't exists "+ receiverEmail);
            return;
        }
        connectionService.connectionCheck(senderEmail, receiverEmail);
        messageService.saveMessage(senderEmail, receiverEmail, messageText);
        queueService.queueMessage(senderEmail, receiverEmail, messageText, sessions);

    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.out.println("Transport Error : "+exception.getMessage());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        String username = (String) session.getAttributes().get("username");
        if(username!=null){
            sessions.remove(username);
            System.out.println("Connection  Closed : "+username);
        }
        else{
            System.out.println("Connection closed : Unknown User.");
            session.close(CloseStatus.NOT_ACCEPTABLE);
        }
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
/*
    private String getUserId(WebSocketSession session){
        String uri = session.getUri().toString();
        if(uri.contains("userId=")){
            return uri.substring(uri.indexOf("userId=")+7)
        }
        return session.getId();
    }*/
}
