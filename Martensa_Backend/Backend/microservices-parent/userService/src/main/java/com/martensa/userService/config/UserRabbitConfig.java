package com.martensa.userService.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(UserRabbitProperties.class)
public class UserRabbitConfig {

    @Bean
    public Queue loyaltyPointsQueue(UserRabbitProperties props) {
        return new Queue(props.getLoyaltyPoints().getQueue(), true);
    }

    @Bean
    public DirectExchange loyaltyPointsExchange(UserRabbitProperties props) {
        return new DirectExchange(props.getLoyaltyPoints().getExchange());
    }

    @Bean
    public Binding loyaltyPointsBinding(UserRabbitProperties props) {
        return BindingBuilder.bind(loyaltyPointsQueue(props))
                .to(loyaltyPointsExchange(props))
                .with(props.getLoyaltyPoints().getRoutingKey());
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}