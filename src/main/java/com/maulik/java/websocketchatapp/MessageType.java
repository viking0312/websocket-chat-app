package com.maulik.java.websocketchatapp;

public enum MessageType {
    OFFLINE(0),
    ONLINE(1),
    NORMAL(2);

    private final int value;

    MessageType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
