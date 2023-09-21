package com.mailApp.backend.backend.services;

import com.mailApp.backend.backend.dto.DraftDto;
import com.mailApp.backend.backend.dto.MailDto;
import com.mailApp.backend.backend.dto.ThreadDto;
import com.mailApp.backend.backend.dto.UserDto;
import com.mailApp.backend.backend.entities.*;
import com.mailApp.backend.backend.entities.composite_keys.DraftReceiverId;
import com.mailApp.backend.backend.entities.composite_keys.FavoritesId;
import com.mailApp.backend.backend.entities.composite_keys.MailReceiverId;
import com.mailApp.backend.backend.repositories.*;
import com.mailApp.backend.backend.requests.FavoriteRequest;
import com.mailApp.backend.backend.requests.SaveDraftRequest;
import com.mailApp.backend.backend.requests.SendMailRequest;
import com.mailApp.backend.backend.requests.SendMailThreadRequest;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MailService {

    private final UserRepository userRepository;
    private final MailRepository mailRepository;
    private final MailReceiverRepository mailReceiverRepository;
    private final ThreadRepository threadRepository;
    private final DraftRepository draftRepository;
    private final DraftReceiverRepository draftReceiverRepository;
    private final FavoritesRepository favoritesRepository;

    public MailService(
            UserRepository userRepository,
            MailRepository mailRepository,
            MailReceiverRepository mailReceiverRepository,
            ThreadRepository threadRepository,
            DraftRepository draftRepository,
            DraftReceiverRepository draftReceiverRepository,
            FavoritesRepository favoritesRepository
    ) {
        this.userRepository = userRepository;
        this.mailRepository = mailRepository;
        this.mailReceiverRepository = mailReceiverRepository;
        this.threadRepository = threadRepository;
        this.draftRepository = draftRepository;
        this.draftReceiverRepository = draftReceiverRepository;
        this.favoritesRepository = favoritesRepository;
    }

    public List<MailDto> findAllSentMailsForUsername(String username) {
        List<Mail> senderMails = mailRepository.findAllByUsername(username);
        List<MailDto> mails = new ArrayList<>();
        for (Mail mail : senderMails) {
            List<MailReceiver> mailReceivers = mailReceiverRepository.findByMailId(mail.getId());
            Favorites favorite = favoritesRepository.findByUserAndMailId(username, mail.getId());
            Boolean fav = true;
            if(favorite == null)
                fav = false;
            mails.add(new MailDto(
                    mail.getId(),
                    mail.getSender().toUserDto(),
                    mail.getDateTime(),
                    mail.getSubject(),
                    mail.getContent(),
                    mailReceivers.stream().map(mailReceiver -> mailReceiver.getReceiver().toUserDto()).toList(),
                    fav
            ));
        }
        return mails;
    }

    public List<MailDto> findAllReceivedMailsForUsername(String username) {
        List<MailReceiver> mailsForUser = mailReceiverRepository.findByReceiver(username);
        List<Mail> sentMails = mailRepository.findAllById(
                mailsForUser.stream().map(mailReceiver -> mailReceiver.getMail().getId()).toList()
        );
        List<MailDto> mails = new ArrayList<>();
        for (Mail currentMail : sentMails) {
            Favorites favorite = favoritesRepository.findByUserAndMailId(username, currentMail.getId());
            Boolean fav = true;
            if(favorite == null)
                fav = false;
            mails.add(new MailDto(
                    currentMail.getId(),
                    currentMail.getSender().toUserDto(),
                    currentMail.getDateTime(),
                    currentMail.getSubject(),
                    currentMail.getContent(),
                    findAllReceiversForMail(currentMail.getId()),
                    fav
            ));
        }
        return mails;
    }

    private List<UserDto> findAllReceiversForMail(Integer mailId) {
        return mailReceiverRepository
                .findByMailId(mailId)
                .stream()
                .map(mailReceiver -> mailReceiver.getReceiver().toUserDto())
                .toList();
    }

    public List<ThreadDto> findAllThreadsForMail(Integer mailId) {
        return threadRepository.findByMailId(mailId)
                .stream()
                .map(MailThread::toThreadDto)
                .toList();
    }

    @Transactional
    public void sendMail(SendMailRequest sendMailRequest, String senderUsername) throws NoSuchElementException {
        Mail savedMail = mailRepository.save(
            new Mail(
                0,
                userRepository.findById(senderUsername).orElseThrow(),
                LocalDateTime.now(),
                sendMailRequest.getSubject(),
                sendMailRequest.getContent()
            )
        );
        for (String receiverUsername: sendMailRequest.getReceiverUsernames()) {
            mailReceiverRepository.save(
                new MailReceiver(
                    new MailReceiverId(
                            receiverUsername,
                            savedMail.getId()
                    ),
                    userRepository.findById(receiverUsername).orElseThrow(),
                    savedMail,
                    true
                )
            );
        }
    }

    public void sendMailThread(
            SendMailThreadRequest sendMailThreadRequest,
            String senderUsername
    ) throws NoSuchElementException {
        threadRepository.save(
            new MailThread(
                0,
                mailRepository.findById(sendMailThreadRequest.getMailId()).orElseThrow(),
                userRepository.findById(senderUsername).orElseThrow(),
                LocalDateTime.now(),
                sendMailThreadRequest.getContent()
            )
        );
    }

    public List<DraftDto> findAllDraftsForUsername(String username) {
        List<Draft> senderDrafts = draftRepository.findAllDraftsByUsername(username);
        List<DraftDto> drafts = new ArrayList<>();
        for (Draft draft : senderDrafts) {
            List<DraftReceiver> draftReceivers = draftReceiverRepository.findByDraftId(draft.getId());
            drafts.add(new DraftDto(
                    draft.getId(),
                    draft.getSender().toUserDto(),
                    draft.getSubject(),
                    draft.getContent(),
                    draftReceivers.stream().map(draftReceiver -> draftReceiver.getReceiver().toUserDto()).toList()
            ));
        }
        return drafts;
    }

    @Transactional
    public void saveDraft(SaveDraftRequest saveDraftRequest, String senderUsername) throws NoSuchElementException {
        //ako draft ne postoji, cuva se
        if(saveDraftRequest.getId() == -1)
        {
            Draft savedDraft = draftRepository.save(
                    new Draft(
                            0,
                            userRepository.findById(senderUsername).orElseThrow(),
                            saveDraftRequest.getSubject(),
                            saveDraftRequest.getContent()
                    )
            );
            if(saveDraftRequest.getReceiverUsernames().size() > 0)
            {
                for (String receiverUsername: saveDraftRequest.getReceiverUsernames()) {
                    draftReceiverRepository.save(
                            new DraftReceiver(
                                    new DraftReceiverId(
                                            receiverUsername,
                                            savedDraft.getId()
                                    ),
                                    userRepository.findById(receiverUsername).orElseThrow(),
                                    savedDraft
                            )
                    );
                }
            }
        }
        //ako draft postoji, azurira se
        else
        {
            Draft draft = draftRepository.findById(saveDraftRequest.getId()).orElseThrow();
            draft.setSubject(saveDraftRequest.getSubject());
            draft.setContent(saveDraftRequest.getContent());
            draftRepository.save(draft);

            //delete existing rows first, then add all receivers again (sender could've added or deleted some/all)
            draftReceiverRepository.deleteDraftReceivers(draft.getId());

            if(saveDraftRequest.getReceiverUsernames().size() > 0)
            {
                for (String receiverUsername: saveDraftRequest.getReceiverUsernames()) {
                    draftReceiverRepository.save(
                            new DraftReceiver(
                                    new DraftReceiverId(
                                            receiverUsername,
                                            draft.getId()
                                    ),
                                    userRepository.findById(receiverUsername).orElseThrow(),
                                    draft
                            )
                    );
                }
            }
        }
    }

    @Transactional
    public void deleteDraft(Integer draftId) {
        draftReceiverRepository.deleteDraftReceivers(draftId);
        draftRepository.deleteDraftById(draftId);
    }

    public List<MailDto> findAllFavoritesForUsername(String username) {
        List<Favorites> userFavorites = favoritesRepository.findByUser(username);
        List<MailDto> favs = new ArrayList<>();
        for (Favorites favorite : userFavorites) {
            List<MailReceiver> mailReceivers = mailReceiverRepository.findByMailId(favorite.getMail().getId());
            favs.add(new MailDto(
                    favorite.getMail().getId(),
                    favorite.getMail().getSender().toUserDto(),
                    favorite.getMail().getDateTime(),
                    favorite.getMail().getSubject(),
                    favorite.getMail().getContent(),
                    mailReceivers.stream().map(mailReceiver -> mailReceiver.getReceiver().toUserDto()).toList(),
                    true
            ));
        }
        return favs;
    }

    @Transactional
    public void markOrRemoveFavorite(String username, FavoriteRequest favoriteRequest) throws NoSuchElementException {
        Favorites favorite = favoritesRepository.findByUserAndMailId(username, favoriteRequest.getMailId());
        //postoji, treba da se ukloni
        if(favorite != null)
        {
            favoritesRepository.removeFavorite(username, favoriteRequest.getMailId());
        }
        //ne postoji, treba da se doda
        else
        {
            favoritesRepository.save(
                    new Favorites(
                            new FavoritesId(username, favoriteRequest.getMailId()),
                            userRepository.findById(username).orElseThrow(),
                            mailRepository.findById(favoriteRequest.getMailId()).orElseThrow()
                    )
            );
        }
    }
}
