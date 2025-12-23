package com.roado.demo.Model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@RequiredArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private Long id;
    
    @Column(name = "name")
    private String name;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id")
    private ActivityStats activityStats;

    @ManyToOne(fetch = FetchType.LAZY, optional = true) // can be optional, if no route is present. 
    @JoinColumn(name = "route_id")
    private RoutePlan route;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Track track;

    @Column(name = "matched_route")
    private boolean matchedRoute;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "activity", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<TimedStatsEntity> timedStats;

}
