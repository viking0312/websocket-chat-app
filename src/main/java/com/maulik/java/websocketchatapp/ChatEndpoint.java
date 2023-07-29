package com.maulik.java.websocketchatapp;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashMap;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(value = "/chat/{username}", decoders = MessageDecoder.class, encoders = MessageEncoder.class)
public class ChatEndpoint {

    private Session session;

    private String username;
    private static Set<ChatEndpoint> chatEndpoints = new CopyOnWriteArraySet<>();
    private static HashMap<String, String> users = new HashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("username")String username) {
        //validate if unique username
        if(users.entrySet().stream().anyMatch(entry -> username.equals(entry.getValue()))){
            System.out.println("user already exists with name " + username);
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.CANNOT_ACCEPT, "User already exists with given username"));
            } catch (Exception e) {
                e.printStackTrace();
            }
            return;
        }

        this.session = session;
        chatEndpoints.add(this);
        users.put(session.getId(), username);
        this.username = username;

        Message message = new Message();
        message.setFrom(username);
        message.setContent("Connected!");
        message.setMessageType(MessageType.ONLINE.getValue());
        broadcast(message);
    }

    @OnMessage
    public void onMessage(Session session, String message) {
        Message messageObj = new Message();
        messageObj.setContent(message);
        messageObj.setFrom(users.get(session.getId()));
        broadcast(messageObj);
    }

    @OnClose
    public void onClose(Session session) {
        chatEndpoints.remove(this);
        if(Objects.nonNull(users.get(session.getId()))) {
            Message message = new Message();
            message.setFrom(username);
            message.setContent("Disconnected!");
            message.setMessageType(MessageType.OFFLINE.getValue());
            broadcast(message);
        }
        users.remove(session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {

    }

    private static void broadcast(Message message) {
        chatEndpoints.stream().filter(chatEndpoint -> !chatEndpoint.username.equals(message.getFrom())).forEach(endpoint -> {
            synchronized (endpoint) {
                try {
                    endpoint.session.getBasicRemote().sendObject(message);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                } catch (EncodeException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }
}
