package com.roado.demo.Mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.roado.demo.DTOs.RouteDTO;
import com.roado.demo.Model.Route;
import java.util.List;

@Mapper(componentModel = "spring")
public interface RouteMapper {

    @Mapping(source = "createdBy.id", target = "createdBy")
    
    RouteDTO toDTO(Route route);

    @Mapping(source = "createdBy", target = "createdBy.id", ignore = true)
    @Mapping(target = "activities", ignore = true)
    @Mapping(target = "routeId", ignore = true)
    Route toEntity(RouteDTO routeDTO);

    // List<RouteDTO> toDTOList(List<Route> routes);
    // List<Route> toEntityList(List<RouteDTO> routeDTOs);

    

}
