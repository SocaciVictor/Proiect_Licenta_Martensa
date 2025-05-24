package org.demo.orderservice.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    private final OrderRabbitProperties props;

    public RabbitMQConfig(OrderRabbitProperties props) {
        this.props = props;
    }

    @Bean
    public Queue orderQueue() {
        return new Queue(props.getQueue());
    }

    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange(props.getExchange());
    }

    @Bean
    public Binding orderBinding() {
        return BindingBuilder
                .bind(orderQueue())
                .to(orderExchange())
                .with(props.getRoutingKey());
    }
}
