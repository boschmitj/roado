package com.roado.demo.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.roado.demo.DTOs.TimedStatsDTO;
import com.roado.demo.Model.TimedStatsEntity;
import com.roado.demo.Repository.TimedStatsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TimedStatsService {

    private final TimedStatsRepository timedStatsRepository;

    public List<TimedStatsEntity> createTimedStatsEntity(List<TimedStatsDTO> timedStatsDTOs) {
        List<TimedStatsEntity> timedStats = new ArrayList<>();
        for (TimedStatsDTO timedStatsDTO : timedStatsDTOs) {
            timedStats.add(new TimedStatsEntity(timedStatsDTO.time(), timedStatsDTO.position().getAltitude(), timedStatsDTO.speed()));
        }

        return timedStatsRepository.saveAll(timedStats);
    }

}
