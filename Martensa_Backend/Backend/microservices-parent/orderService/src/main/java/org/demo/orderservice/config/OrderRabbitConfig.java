package org.demo.orderservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OrderRabbitConfig {

    @Bean
    public Queue paymentResponseQueue(OrderRabbitProperties props) {
        return new Queue(props.getPaymentResponse().getQueue(), true);
    }

    @Bean
    public DirectExchange paymentResponseExchange(OrderRabbitProperties props) {
        return new DirectExchange(props.getPaymentResponse().getExchange());
    }

    @Bean
    public Binding paymentResponseBinding(OrderRabbitProperties props) {
        return BindingBuilder.bind(paymentResponseQueue(props))
                .to(paymentResponseExchange(props))
                .with(props.getPaymentResponse().getRoutingKey());
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
