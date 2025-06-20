package com.gaurav.dashboardbackend.repository;

import com.gaurav.dashboardbackend.model.Client;
import com.gaurav.dashboardbackend.model.Task;
import com.gaurav.dashboardbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByClientAndUser(Client client, User user);
}
