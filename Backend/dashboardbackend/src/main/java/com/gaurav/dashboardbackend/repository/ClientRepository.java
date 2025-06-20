package com.gaurav.dashboardbackend.repository;

import com.gaurav.dashboardbackend.model.Client;
import com.gaurav.dashboardbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client,Long> {
    List<Client> findByUser(User user);
}
