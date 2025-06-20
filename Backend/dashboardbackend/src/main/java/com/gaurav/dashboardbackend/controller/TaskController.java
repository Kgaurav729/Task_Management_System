//package com.gaurav.dashboardbackend.controller;
//
//import com.gaurav.dashboardbackend.model.Client;
//import com.gaurav.dashboardbackend.model.Task;
//import com.gaurav.dashboardbackend.model.User;
//import com.gaurav.dashboardbackend.repository.ClientRepository;
//import com.gaurav.dashboardbackend.repository.TaskRepository;
//import com.gaurav.dashboardbackend.repository.UserRepository;
//import com.gaurav.dashboardbackend.util.AuthUtil;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.*;
////@RequestMapping("/api/clients/{clientId}/tasks")
//
//@RestController
//@RequestMapping("/api/clients/{clientId}/tasks")
//@RequiredArgsConstructor
//public class TaskController {
//    private final TaskRepository taskRepository;
//    private final ClientRepository clientRepository;
//    private final UserRepository userRepository;
//
//    @PostMapping
//    public ResponseEntity<Task> createTask(@PathVariable Long clientId, @RequestBody Task task) {
//        String email = AuthUtil.getLoggedInUserEmail();
//        User user = userRepository.findByEmail(email).orElseThrow();
//        Client client = clientRepository.findById(clientId).orElseThrow();
//
//        task.setClient(client);
//        task.setUser(user);
//
//        return ResponseEntity.ok(taskRepository.save(task));
//    }
//
//    @GetMapping
//    public ResponseEntity<List<Task>> getTasksForClient(@PathVariable Long clientId) {
//        String email = AuthUtil.getLoggedInUserEmail();
//        User user = userRepository.findByEmail(email).orElseThrow();
//        Client client = clientRepository.findById(clientId).orElseThrow();
//
//        return ResponseEntity.ok(taskRepository.findByClientAndUser(client, user));
//    }
//
//    @PutMapping("/{taskId}")
//    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task updated) {
//        Task task = taskRepository.findById(taskId).orElseThrow();
//
//        task.setTitle(updated.getTitle());
//        task.setDescription(updated.getDescription());
//        task.setCompleted(updated.isCompleted());
//
//        return ResponseEntity.ok(taskRepository.save(task));
//    }
//
//    @DeleteMapping("/{taskId}")
//    public ResponseEntity<String> deleteTask(@PathVariable Long taskId) {
//        taskRepository.deleteById(taskId);
//        return ResponseEntity.ok("Task deleted");
//    }
//}

package com.gaurav.dashboardbackend.controller;

import com.gaurav.dashboardbackend.model.Client;
import com.gaurav.dashboardbackend.model.Task;
import com.gaurav.dashboardbackend.model.User;
import com.gaurav.dashboardbackend.repository.ClientRepository;
import com.gaurav.dashboardbackend.repository.TaskRepository;
import com.gaurav.dashboardbackend.repository.UserRepository;
import com.gaurav.dashboardbackend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/clients/{clientId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskRepository taskRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Task> createTask(@PathVariable Long clientId, @RequestBody Task task) {
        String email = AuthUtil.getLoggedInUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Client client = clientRepository.findById(clientId).orElseThrow();

        task.setClient(client);
        task.setUser(user);

        // Default status if not provided
        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("PENDING");
        }

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @GetMapping
    public ResponseEntity<List<Task>> getTasksForClient(@PathVariable Long clientId) {
        String email = AuthUtil.getLoggedInUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();
        Client client = clientRepository.findById(clientId).orElseThrow();

        return ResponseEntity.ok(taskRepository.findByClientAndUser(client, user));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task updated) {
        Task task = taskRepository.findById(taskId).orElseThrow();

        task.setTitle(updated.getTitle());
        task.setDescription(updated.getDescription());
        task.setStatus(updated.getStatus());
        task.setDueDate(updated.getDueDate());

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(@PathVariable Long taskId) {
        taskRepository.deleteById(taskId);
        return ResponseEntity.ok("Task deleted");
    }
}

