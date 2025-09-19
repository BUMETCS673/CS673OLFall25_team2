package com.cs673.careerforge.utils;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
public class DateTimeConvertor {
    public static long asLong(LocalDateTime dateTime) {
        return dateTime == null ? 0L : dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    public static LocalDateTime asLocalDateTime(long epochMilli) {
        return epochMilli == 0L ? null :
                Instant.ofEpochMilli(epochMilli).atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

}
