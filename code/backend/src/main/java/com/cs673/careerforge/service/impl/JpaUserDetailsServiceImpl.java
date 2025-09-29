package com.cs673.careerforge.service.impl;

import com.cs673.careerforge.common.auth.UserPrincipal;
import com.cs673.careerforge.domain.User;
import com.cs673.careerforge.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Written by human.
 */
@Service
public class JpaUserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    public JpaUserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return new UserPrincipal(u.getId(), u.getUsername(), u.getPassword(), u.getAuthorities(), u.isEnabled());
    }
}
