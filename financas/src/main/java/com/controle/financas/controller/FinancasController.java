package com.controle.financas.controller;

import com.controle.financas.model.Financas;
import com.controle.financas.repository.FinancasRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/financas")
@CrossOrigin("*")
public class FinancasController {
    @Autowired
    private FinancasRepository financasRepository;

    @GetMapping
    public List<Financas> listarTodas(){
        return financasRepository.findAll();
    }

    @PostMapping
    public Financas salvarTransacao(@Valid @RequestBody Financas financas){
        return financasRepository.save(financas);
    }

    @DeleteMapping("/{id}")
    public void deletarTransacao(@PathVariable Long id){
        financasRepository.deleteById(id);
    }
}
