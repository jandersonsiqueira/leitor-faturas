import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function DownloadFaturas() {
    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState('');
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [faturaEncontrada, setFaturaEncontrada] = useState(false);
    const [faturaNaoEncontrada, setFaturaNaoEncontrada] = useState(false);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/faturas');
                const clienteIdsUnicos = [...new Set(response.data.map(f => f.cliente_id))];
                setClientes(clienteIdsUnicos);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        };

        fetchClientes();
    }, []);

    const handleSearch = async () => {
        if (!clienteId || !mes || !ano) {
            alert('Por favor, selecione o cliente, mês e ano.');
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:4000/faturas/download?clienteId=${clienteId}&mes=${mes}&ano=${ano}`,
                { responseType: 'blob' }
            );
            
            if (response.status === 200) {
                setFaturaEncontrada(true);
                setFaturaNaoEncontrada(false);
            } else {
                setFaturaEncontrada(false);
                setFaturaNaoEncontrada(true);
            }
        } catch (error) {
            setFaturaEncontrada(false);
            setFaturaNaoEncontrada(true);
            console.error("Erro ao buscar fatura:", error);
        }
    };

    const handleDownload = () => {
        const downloadUrl = `http://localhost:4000/faturas/download?clienteId=${clienteId}&mes=${mes}&ano=${ano}`;
        window.open(downloadUrl);
    };

    return (
        <div className="download-faturas-container">
            <h1>Download de Faturas</h1>
            <div className="form-container">
                <label htmlFor="cliente-id">Selecione o Cliente:</label>
                <select
                    id="cliente-id"
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => (
                        <option key={cliente} value={cliente}>
                            Cliente ID: {cliente}
                        </option>
                    ))}
                </select>

                <label htmlFor="mes">Mês:</label>
                <input
                    type="text"
                    id="mes"
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    placeholder="Ex: 01"
                />

                <label htmlFor="ano">Ano:</label>
                <input
                    type="text"
                    id="ano"
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    placeholder="Ex: 2023"
                />

                <button onClick={handleSearch} className="btn-search">
                    Buscar Fatura
                </button>
            </div>

            {faturaEncontrada ? (
                <div className="fatura-container">
                    <p>Fatura encontrada!</p>
                    <i className="pdf-icon">📄</i>
                    <button onClick={handleDownload} className="btn-download">
                        Baixar PDF
                    </button>
                </div>
            ) : (
                faturaNaoEncontrada && <p>Fatura não encontrada para os parâmetros fornecidos.</p>
            )}
        </div>
    );
}

export default DownloadFaturas;
