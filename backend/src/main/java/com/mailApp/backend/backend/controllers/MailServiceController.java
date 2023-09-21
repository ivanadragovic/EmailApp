package com.mailApp.backend.backend.controllers;

import com.mailApp.backend.backend.dto.DraftDto;
import com.mailApp.backend.backend.dto.MailDto;
import com.mailApp.backend.backend.dto.ThreadDto;
import com.mailApp.backend.backend.requests.FavoriteRequest;
import com.mailApp.backend.backend.requests.SaveDraftRequest;
import com.mailApp.backend.backend.requests.SendMailRequest;
import com.mailApp.backend.backend.requests.SendMailThreadRequest;
import com.mailApp.backend.backend.responses.*;
import com.mailApp.backend.backend.services.Base64BasicAuthDecoder;
import com.mailApp.backend.backend.services.MailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("mailService")
@CrossOrigin
public class MailServiceController {

    private final Base64BasicAuthDecoder basicAuthDecoder;
    private final MailService mailService;

    public MailServiceController(
            Base64BasicAuthDecoder basicAuthDecoder,
            MailService mailService
    ) {
        this.basicAuthDecoder = basicAuthDecoder;
        this.mailService = mailService;
    }

    @GetMapping("sent")
    public ResponseEntity<List<MailDto>> getSentMails(
            @RequestHeader(value = "Authorization") String authorizationHeader
    ) {
        String username = basicAuthDecoder.getUsernameFromAuthHeader(authorizationHeader);
        return ResponseEntity.status(HttpStatus.OK).body(mailService.findAllSentMailsForUsername(username));
    }

    @GetMapping("received")
    public ResponseEntity<List<MailDto>> getReceivedMails(
            @RequestHeader(value = "Authorization") String authorizationHeader
    ) {
        String username = basicAuthDecoder.getUsernameFromAuthHeader(authorizationHeader);
        return ResponseEntity.status(HttpStatus.OK).body(mailService.findAllReceivedMailsForUsername(username));
    }

    @GetMapping("mailThreads/{mailId}")
    public ResponseEntity<List<ThreadDto>> getThreadsForMail(
            @PathVariable Integer mailId
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(mailService.findAllThreadsForMail(mailId));
    }

    @PostMapping("sendMail")
    public ResponseEntity<SendMailResponse> sendMail(
            @RequestBody SendMailRequest sendMailRequest,
            @RequestHeader(value = "Authorization") String authorizationHeader
    ) {
        try {
            String senderUsername = basicAuthDecoder.getUsernameFromAuthHeader(authorizationHeader);
            mailService.sendMail(sendMailRequest, senderUsername);
            return ResponseEntity.status(HttpStatus.CREATED).body(new SendMailResponse(true));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new SendMailResponse(false));
        }
    }

    @PostMapping("sendMailThread")
    public ResponseEntity<SendMailThreadResponse> sendMailThread(
            @RequestBody SendMailThreadRequest sendMailThreadRequest,
            @RequestHeader(value = "Authorization") String authorizationHeader
    ) {
        try {
            String senderUsername = basicAuthDecoder.getUsernameFromAuthHeader(authorizationHeader);
            mailService.sendMailThread(sendMailThreadRequest, senderUsername);
            return ResponseEntity.status(HttpStatus.CREATED).body(new SendMailThreadResponse(true));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new SendMailThreadResponse(false));
        }
    }

    @GetMapping("drafts")
    public ResponseEntity<List<DraftDto>> getDrafts(
            @RequestHeader(value = "Authorization") String authorizationHeader
    ) {
        String username = basicAuthDecoder.getUsernameFromAuthHeader(authorizationHeader);
        return ResponseEntity.status(HttpStatus.OK).body(mailService.findAllDraftsForUsername(username));
    }

    @PostMapping("saveDraft")
    public ResponseEntity<SaveDraftResponse> saveDraft(
            @RequestBody SaveDraftRequest saveDraftRequest,
            @RequestHeader(value = "Authorization") String authorizationHeader
    ) {
        try {
            String senderUsername = basicAuthDecoder.getUsernameFromAuthHeader(authorizationHeader);
            mailService.saveDraft(saveDraftRequest, senderUsername);
            return ResponseEntity.status(HttpStatus.CREATED).body(new SaveDraftResponse(true));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new SaveDraftResponse(false));
        }
    }

    @DeleteMapping("discardDraft/{draftId}")
    public ResponseEntity<DiscardDraftResponse> discardDraft(
            @PathVariable Integer draftId
    ) {
        try {
            mailService.deleteDraft(draftId);
            return ResponseEntity.status(HttpStatus.OK).body(new DiscardDraftResponse(true));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new DiscardDraftResponse(false));
        }
    }

    @GetMapping("favorites")
    public ResponseEntity<List<MailDto>> getFavorites(
            @RequestHeader(value = "Authorization") String authorizationHeader
    ) {
        String username = basicAuthDecoder.getUsernameFromAuthHeader(authorizationHeader);
        return ResponseEntity.status(HttpStatus.OK).body(mailService.findAllFavoritesForUsername(username));
    }

    @PostMapping("markAsFavorite")
    public ResponseEntity<FavoriteResponse> markAsFavorite(
            @RequestBody FavoriteRequest favoriteRequest,
            @RequestHeader(value = "Authorization") String authorizationHeader
    ) {
        String username = basicAuthDecoder.getUsernameFromAuthHeader(authorizationHeader);
        mailService.markOrRemoveFavorite(username, favoriteRequest);
        return ResponseEntity.status(HttpStatus.OK).body(new FavoriteResponse(true));
    }
}
