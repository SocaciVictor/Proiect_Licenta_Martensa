package org.demo.paymentservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class PaymentRabbitConfig {

    @Bean
    public Queue orderCreatedQueue(PaymentRabbitProperties props) {
        return new Queue(props.getPayment().getQueue(), true);
    }

    @Bean
    public DirectExchange orderExchange(PaymentRabbitProperties props) {
        return new DirectExchange(props.getPayment().getExchange());
    }

    @Bean
    public Binding orderCreatedBinding(PaymentRabbitProperties props) {
        return BindingBuilder.bind(orderCreatedQueue(props))
                .to(orderExchange(props))
                .with(props.getPayment().getRoutingKey());
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

