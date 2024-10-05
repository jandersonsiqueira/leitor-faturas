import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import DownloadFaturas from './components/DownloadFaturas';
import './App.css';

Chart.register(...registerables);

function App() {
    const [faturas, setFaturas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState('');
    const [inputClienteId, setInputClienteId] = useState('');
    const navigate = useNavigate();

    const fetchFaturas = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/faturas');
            setFaturas(response.data);

            const clienteIdsUnicos = [...new Set(response.data.map(f => f.cliente_id))];
            setClientes(clienteIdsUnicos);

        } catch (error) {
            console.error("Erro ao buscar faturas:", error);
        }
    };

    const fetchFaturasPorCliente = async (clienteId) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/faturas?clienteId=${clienteId}`);
            setFaturas(response.data);
        } catch (error) {
            console.error("Erro ao buscar faturas:", error);
        }
    };

    useEffect(() => {
        fetchFaturas();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchFaturasPorCliente(inputClienteId || clienteId);
        setClienteId(inputClienteId);
    };

    const handleDownloadFaturasClick = () => {
        navigate('/download-faturas');
    };

    const handleHome = () => {
        navigate('/');
    };

    const chartDataEnergia = {
        labels: faturas.map(f => f.referente_a),
        datasets: [
            {
                label: 'Consumo de Energia (kWh)',
                data: faturas.map(f => f.energia_eletrica_kwh + f.energia_sceee_kwh),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Energia Compensada (kWh)',
                data: faturas.map(f => f.energia_compensada_kwh),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
            },
        ],
    };

    const chartDataValores = {
        labels: faturas.map(f => f.referente_a),
        datasets: [
            {
                label: 'Valor Total sem GD (R$)',
                data: faturas.map(f => f.energia_eletrica_valor + f.energia_sceee_valor + f.contrib_ilum_publica_valor),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
            {
                label: 'Economia GD (R$)',
                data: faturas.map(f => f.energia_compensada_valor),
                backgroundColor: faturas.map(f => f.energia_compensada_valor < 0 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)'),
            },
        ],
    };

    return (
        <div className="dashboard-container">
            <div className="navigation"> 
                <button onClick={handleHome}>Home</button> {}
                <button onClick={handleDownloadFaturasClick}>Download de Faturas</button> {}
            </div>

            <Routes>
                <Route path="/" element={
                    <>
                        <h1>Dashboard de Faturas</h1>
                        <div className="search-container">
                            <form onSubmit={handleSubmit} className="form-client-search">
                                <label htmlFor="cliente-id" className="label-client">Selecione ou digite o Cliente ID:</label>
                                <select
                                    id="cliente-id"
                                    value={clienteId}
                                    onChange={(e) => setClienteId(e.target.value)}
                                    className="select-client"
                                >
                                    <option value="">Selecione um cliente</option>
                                    {clientes.map(cliente => (
                                        <option key={cliente} value={cliente}>
                                            Cliente ID: {cliente}
                                        </option>
                                    ))}
                                </select>

                                <button type="submit" className="btn-submit">Buscar Faturas</button>
                            </form>
                        </div>

                        {faturas.length > 0 ? (
                            <div>
                                <h2>Gráficos de Energia (kWh)</h2>
                                <Bar data={chartDataEnergia} />

                                <h2>Gráficos de Valores (R$)</h2>
                                <Bar data={chartDataValores} />
                            </div>
                        ) : clienteId || inputClienteId ? (
                            <p>Nenhuma fatura encontrada para o cliente {clienteId || inputClienteId}.</p>
                        ) : (
                            <p>Insira ou selecione o ID do cliente para buscar os dados.</p>
                        )}
                    </>
                } />
                <Route path="/download-faturas" element={<DownloadFaturas />} />
            </Routes>
        </div>
    );
}

const AppWithRouter = () => (
    <Router>
        <App />
    </Router>
);

export default AppWithRouter;
