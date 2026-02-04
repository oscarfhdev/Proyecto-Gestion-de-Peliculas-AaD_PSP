package com.ofhcinema.GestionCine.domain;

/**
 * Estados posibles de una entrada de cine.
 */
public enum EstadoEntrada {
    RESERVADA, // Entrada reservada pero aún no pagada
    PAGADA, // Entrada pagada y lista para usar
    USADA, // Entrada ya usada (escaneada en la sala)
    CANCELADA // Entrada cancelada
}
