package com.controle.financas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor

public class Financas {

    //variaveis
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    private String descricao;
    private BigDecimal valor;
    @Enumerated(EnumType.STRING)
    private TipoTransacao tipo;

    //construtor
    public Financas(String descricao, BigDecimal valor, TipoTransacao tipo) {
        this.descricao = descricao;
        this.valor = valor;
        this.tipo = tipo;
    }
}

