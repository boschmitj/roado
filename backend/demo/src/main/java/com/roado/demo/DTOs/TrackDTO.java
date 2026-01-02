package com.roado.demo.DTOs;

import com.fasterxml.jackson.databind.JsonNode;

public record TrackDTO(
    JsonNode track
) {

}
