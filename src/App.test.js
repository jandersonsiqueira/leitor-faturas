import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

describe('App Component', () => {
    beforeEach(() => {
        axios.get.mockClear();
    });

    test('renders the App component', () => {
        render(<App />);
        expect(screen.getByText(/Dashboard de Faturas/i)).toBeInTheDocument();
    });

    test('fetches and displays faturas on initial load', async () => {
        const faturas = [
            { id: 1, referente_a: 'Janeiro', energia_eletrica_kwh: 100, energia_sceee_kwh: 50, energia_compensada_kwh: 30, energia_eletrica_valor: 100, energia_sceee_valor: 20, contribuicao_valor: 10, energia_compensada_valor: -15 },
            { id: 2, referente_a: 'Fevereiro', energia_eletrica_kwh: 120, energia_sceee_kwh: 60, energia_compensada_kwh: 25, energia_eletrica_valor: 120, energia_sceee_valor: 25, contribuicao_valor: 15, energia_compensada_valor: -10 },
        ];

        axios.get.mockResolvedValue({ data: faturas });
        
        render(<App />);
        
        expect(await screen.findByText('Janeiro')).toBeInTheDocument();
        expect(await screen.findByText('Fevereiro')).toBeInTheDocument();
    });

    test('displays no faturas message when no faturas are found', async () => {
        axios.get.mockResolvedValue({ data: [] });
        
        render(<App />);
        
        expect(await screen.findByText(/Insira ou selecione o ID do cliente para buscar os dados/i)).toBeInTheDocument();
    });

    test('fetches and displays faturas based on client ID', async () => {
        const faturas = [
            { id: 1, referente_a: 'Janeiro', cliente_id: '1', energia_eletrica_kwh: 100 },
        ];

        axios.get.mockResolvedValueOnce({ data: faturas });
        
        render(<App />);

        fireEvent.change(screen.getByLabelText(/Selecione ou digite o Cliente ID:/i), { target: { value: '1' } });
        fireEvent.click(screen.getByText(/Buscar Faturas/i));

        expect(await screen.findByText('Janeiro')).toBeInTheDocument();
    });
});
