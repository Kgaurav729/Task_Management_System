package com.gaurav.dashboardbackend.controller;

import com.gaurav.dashboardbackend.model.Client;
import com.gaurav.dashboardbackend.model.User;
import com.gaurav.dashboardbackend.repository.ClientRepository;
import com.gaurav.dashboardbackend.repository.UserRepository;
import com.gaurav.dashboardbackend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        String email = AuthUtil.getLoggedInUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();

        client.setUser(user);
        return ResponseEntity.ok(clientRepository.save(client));
    }

    @GetMapping
    public ResponseEntity<List<Client>> getClients() {
        String email = AuthUtil.getLoggedInUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();

        return ResponseEntity.ok(clientRepository.findByUser(user));
    }

    // ✅ New: Get a single client by ID (for detail page)
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        String email = AuthUtil.getLoggedInUserEmail();
        User user = userRepository.findByEmail(email).orElseThrow();

        Client client = clientRepository.findById(id)
                .filter(c -> c.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Client not found or access denied"));

        return ResponseEntity.ok(client);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client updatedClient) {
        Client client = clientRepository.findById(id).orElseThrow();
        client.setName(updatedClient.getName());
        client.setEmail(updatedClient.getEmail());
        client.setCompany(updatedClient.getCompany());
        client.setPhone(updatedClient.getPhone());

        return ResponseEntity.ok(clientRepository.save(client));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClient(@PathVariable Long id) {
        clientRepository.deleteById(id);
        return ResponseEntity.ok("Client deleted successfully.");
    }
}
