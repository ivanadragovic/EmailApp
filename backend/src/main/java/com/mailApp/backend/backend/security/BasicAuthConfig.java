package com.mailApp.backend.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class BasicAuthConfig {

    private final DataSource dataSource;
    private final MyPasswordEncoder myPasswordEncoder;

    public BasicAuthConfig(
            DataSource dataSource,
            MyPasswordEncoder myPasswordEncoder
    ) {
        this.dataSource = dataSource;
        this.myPasswordEncoder = myPasswordEncoder;
    }

    @Autowired
    public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .jdbcAuthentication()
                .passwordEncoder(myPasswordEncoder)
                .dataSource(dataSource)
                .usersByUsernameQuery("SELECT username, password, enabled FROM user WHERE username = ?")
                .authoritiesByUsernameQuery("SELECT username, role FROM user WHERE username = ?");
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf().disable()
                .cors().and()
                .authorizeHttpRequests()
                .requestMatchers("/authentication/**")
                .permitAll()
                .requestMatchers("/mailService/**")
                .hasAuthority("USER")
                .anyRequest()
                .authenticated()
                .and()
                .httpBasic()
                .and().build();
    }
}
