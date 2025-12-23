package com.roado.demo.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.roado.demo.Model.TimedStatsEntity;
import com.roado.demo.POJOs.PositionObject;
import com.roado.demo.POJOs.SpeedObject;
import com.roado.demo.Repository.TimedStatsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TimedStatsService {

    private final TimedStatsRepository timedStatsRepository;

    public List<TimedStatsEntity> createTimedStatsEntity(List<PositionObject> positionList, List<SpeedObject> speedList) {

        List<TimedStatsEntity> timedStats = new ArrayList<>();

        long minLength = Math.min(positionList.size(), speedList.size());
        long maxLength = Math.max(positionList.size(), speedList.size());
        Long currentSecond = 0L;
        for (long i = 0; i < minLength; i++) {

            Long second = positionList.get((int) i).getSecondsSinceStart() / 1000;
            if (second == currentSecond) continue;

            for (long j = 0; j < minLength; j++) {
                long timeDiff = speedList.get((int) j).getSecondsSinceStart() / 1000 - second;
                if (0 < timeDiff && timeDiff < 1) {
                    Double speed = speedList.get((int) j).getSpeed();
                    timedStats.add(new TimedStatsEntity(second, positionList.get((int) i).getAltitude(), speed));
                    break;
                }
            }

            currentSecond = second + 1;
        }

        if (!(maxLength == minLength)) {
            if (positionList.size() > speedList.size()) {
                for (long i = minLength; i < maxLength; i++) {
                    Long second = positionList.get((int) i) .getSecondsSinceStart() / 1000;
                    if (second == currentSecond) continue;

                    Double elevation = positionList.get((int) i).getAltitude();
                    timedStats.add(new TimedStatsEntity(second, elevation, null));
                    currentSecond = second + 1;
                }
            }
            else {
                for (long i = minLength; i < maxLength; i++) {
                    Long second = speedList.get((int) i).getSecondsSinceStart() / 1000;
                    if (second == currentSecond) continue;

                    Double speed = speedList.get((int) i).getSpeed();
                    timedStats.add(new TimedStatsEntity(second, null, speed));
                    currentSecond = second + 1;
                }
            }
            
        }

        return timedStatsRepository.saveAll(timedStats);
    }

}
