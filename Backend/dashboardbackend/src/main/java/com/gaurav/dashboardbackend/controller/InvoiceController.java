package com.gaurav.dashboardbackend.controller;

import com.gaurav.dashboardbackend.service.InvoiceService;
import com.gaurav.dashboardbackend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService invoiceService;

    @PreAuthorize("isAuthenticated()") // <- ensures authenticated access
    @GetMapping("/client/{clientId}")
    public ResponseEntity<byte[]> generateInvoice(@PathVariable Long clientId) {
        try {
            String email = AuthUtil.getLoggedInUserEmail();
            byte[] pdf = invoiceService.generateInvoicePdf(clientId, email);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition
                    .builder("inline")
                    .filename("invoice-client-" + clientId + ".pdf")
                    .build());

            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}

