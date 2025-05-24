package com.talk.chatter.Repository;

import com.talk.chatter.Entities.Connections;
import com.talk.chatter.Entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface ConnectionsRepo extends JpaRepository<Connections, Long> {
    @Query(
            "SELECT c FROM Connections c WHERE " +
                    "(c.user1.id = :userAId AND c.user2.id = :userBId) OR " +
                    "(c.user1.id = :userBId AND c.user2.id = :userAId)"
    )
    Optional<Connections> findConnectionBetweenUsers(@Param("userAId") Long userAId, @Param("userBId")Long userBId);

    default boolean exitsBetweenUsers(Long userAId, Long userBId){
        return findConnectionBetweenUsers(userAId, userBId).isPresent();
    }

    @Query(
            "SELECT c.user2 FROM Connections c WHERE c.user1.email = :email"
    )
    List<Users> findUser2Connections(@Param("email") String email);

    @Query(
            "SELECT c.user1 FROM Connections c WHERE c.user2.email = :email"
    )
    List<Users> findUser1Connections(@Param("email") String email);

    default List<Users> findConnectedUsers(String email){
        List<Users> result = new ArrayList<>();
        result.addAll(findUser1Connections(email));
        result.addAll(findUser2Connections(email));
        return result;
    }


}
