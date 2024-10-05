const express = require('express');
const cors = require('cors');
const path = require('path');
const { Client } = require('pg');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const client = new Client({
    connectionString: 'postgresql://postgres:12345678@localhost:5432/postgres',
});

client.connect();

app.get('/api/faturas', async (req, res) => {
    const clienteId = req.query.clienteId;

    try {
        let result;
        if (clienteId) {
            result = await client.query('SELECT * FROM faturas WHERE cliente_id = $1', [clienteId]);
        } else {
            result = await client.query('SELECT * FROM faturas');
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao obter dados');
    }
});

app.get('/faturas/download', (req, res) => {
    const clienteId = req.query.clienteId;
    const mes = req.query.mes;
    const ano = req.query.ano;

    if (!clienteId || !mes || !ano) {
        return res.status(400).send('Cliente ID, mês e ano são necessários');
    }

    const fileName = `${clienteId}-${mes}-${ano}.pdf`;
    const filePath = path.join(__dirname, 'faturas', fileName);

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('Fatura não encontrada.');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});