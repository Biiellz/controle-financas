package com.controle.financas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
    @NotBlank(message = "a descrição não pode estar em branco")
    private String descricao;
    @Positive(message = "O valor deve ser maior que zero")
    private BigDecimal valor;
    @NotNull(message = "O tipo da transação é obrigatório")
    @Enumerated(EnumType.STRING)
    private TipoTransacao tipo;

    //construtor
    public Financas(String descricao, BigDecimal valor, TipoTransacao tipo) {
        this.descricao = descricao;
        this.valor = valor;
        this.tipo = tipo;
    }
}

